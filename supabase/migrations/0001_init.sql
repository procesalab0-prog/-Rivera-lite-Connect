-- =====================================================================
-- Rivera Élite Connect - Esquema inicial
-- Ejecutar en el SQL Editor de Supabase (una sola vez).
-- =====================================================================

-- --------- Enums ---------
do $$
begin
  if not exists (select 1 from pg_type where typname = 'rol_usuario') then
    create type rol_usuario as enum ('admin', 'cliente');
  end if;
  if not exists (select 1 from pg_type where typname = 'etapa_orden') then
    create type etapa_orden as enum (
      'recibido',
      'diagnostico',
      'en_reparacion',
      'pintura',
      'control_calidad',
      'listo',
      'entregado'
    );
  end if;
  if not exists (select 1 from pg_type where typname = 'estado_cotizacion') then
    create type estado_cotizacion as enum ('pendiente', 'aprobada', 'rechazada');
  end if;
  if not exists (select 1 from pg_type where typname = 'tipo_foto') then
    create type tipo_foto as enum ('antes', 'durante', 'despues');
  end if;
end $$;

-- --------- profiles ---------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  rol rol_usuario not null default 'cliente',
  nombre text,
  telefono text,
  email text,
  created_at timestamptz not null default now()
);

-- --------- vehiculos ---------
create table if not exists public.vehiculos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  marca text not null,
  modelo text not null,
  anio int,
  placa text,
  vin text,
  color text,
  foto_url text,
  qr_slug text unique not null default replace(gen_random_uuid()::text, '-', ''),
  created_at timestamptz not null default now()
);
create index if not exists idx_vehiculos_cliente on public.vehiculos(cliente_id);

-- --------- ordenes ---------
create table if not exists public.ordenes (
  id uuid primary key default gen_random_uuid(),
  vehiculo_id uuid not null references public.vehiculos(id) on delete cascade,
  titulo text not null,
  descripcion text,
  estatus etapa_orden not null default 'recibido',
  fecha_ingreso date default current_date,
  fecha_entrega_estimada date,
  fecha_entrega_real date,
  mecanico text,
  costo_estimado numeric(10,2),
  cotizacion_estado estado_cotizacion not null default 'pendiente',
  created_at timestamptz not null default now()
);
create index if not exists idx_ordenes_vehiculo on public.ordenes(vehiculo_id);

-- --------- avances (timeline) ---------
create table if not exists public.avances (
  id uuid primary key default gen_random_uuid(),
  orden_id uuid not null references public.ordenes(id) on delete cascade,
  etapa etapa_orden not null,
  nota text,
  created_at timestamptz not null default now()
);
create index if not exists idx_avances_orden on public.avances(orden_id);

-- --------- fotos ---------
create table if not exists public.fotos (
  id uuid primary key default gen_random_uuid(),
  orden_id uuid not null references public.ordenes(id) on delete cascade,
  url text not null,
  tipo tipo_foto not null default 'durante',
  descripcion text,
  created_at timestamptz not null default now()
);
create index if not exists idx_fotos_orden on public.fotos(orden_id);

-- --------- notificaciones ---------
create table if not exists public.notificaciones (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  orden_id uuid references public.ordenes(id) on delete cascade,
  mensaje text not null,
  leida boolean not null default false,
  created_at timestamptz not null default now()
);
create index if not exists idx_notif_cliente on public.notificaciones(cliente_id);

-- --------- resenas ---------
create table if not exists public.resenas (
  id uuid primary key default gen_random_uuid(),
  orden_id uuid not null references public.ordenes(id) on delete cascade,
  cliente_id uuid not null references public.profiles(id) on delete cascade,
  calificacion int not null check (calificacion between 1 and 5),
  comentario text,
  created_at timestamptz not null default now(),
  unique (orden_id, cliente_id)
);

-- =====================================================================
-- Trigger: crear profile automáticamente al registrarse un usuario
-- =====================================================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, nombre, telefono, rol)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', ''),
    coalesce(new.raw_user_meta_data->>'telefono', ''),
    'cliente'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- =====================================================================
-- Helper: saber si el usuario actual es admin (evita recursión en RLS)
-- =====================================================================
create or replace function public.es_admin()
returns boolean
language sql
security definer set search_path = public
stable
as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and rol = 'admin'
  );
$$;

-- =====================================================================
-- Row Level Security
-- =====================================================================
alter table public.profiles       enable row level security;
alter table public.vehiculos      enable row level security;
alter table public.ordenes        enable row level security;
alter table public.avances        enable row level security;
alter table public.fotos          enable row level security;
alter table public.notificaciones enable row level security;
alter table public.resenas        enable row level security;

-- profiles: cada quien ve su perfil; admin ve todos
drop policy if exists "profiles_select" on public.profiles;
create policy "profiles_select" on public.profiles
  for select using (id = auth.uid() or public.es_admin());

drop policy if exists "profiles_update" on public.profiles;
create policy "profiles_update" on public.profiles
  for update using (id = auth.uid() or public.es_admin());

drop policy if exists "profiles_insert_admin" on public.profiles;
create policy "profiles_insert_admin" on public.profiles
  for insert with check (public.es_admin() or id = auth.uid());

-- vehiculos: cliente ve los suyos; admin todo
drop policy if exists "vehiculos_select" on public.vehiculos;
create policy "vehiculos_select" on public.vehiculos
  for select using (cliente_id = auth.uid() or public.es_admin());

drop policy if exists "vehiculos_admin_write" on public.vehiculos;
create policy "vehiculos_admin_write" on public.vehiculos
  for all using (public.es_admin()) with check (public.es_admin());

-- ordenes: cliente ve las de sus vehiculos; admin todo
drop policy if exists "ordenes_select" on public.ordenes;
create policy "ordenes_select" on public.ordenes
  for select using (
    public.es_admin() or exists (
      select 1 from public.vehiculos v
      where v.id = ordenes.vehiculo_id and v.cliente_id = auth.uid()
    )
  );

drop policy if exists "ordenes_admin_write" on public.ordenes;
create policy "ordenes_admin_write" on public.ordenes
  for all using (public.es_admin()) with check (public.es_admin());

-- el cliente puede aprobar/rechazar la cotización de sus órdenes
drop policy if exists "ordenes_cliente_cotizacion" on public.ordenes;
create policy "ordenes_cliente_cotizacion" on public.ordenes
  for update using (
    exists (
      select 1 from public.vehiculos v
      where v.id = ordenes.vehiculo_id and v.cliente_id = auth.uid()
    )
  ) with check (
    exists (
      select 1 from public.vehiculos v
      where v.id = ordenes.vehiculo_id and v.cliente_id = auth.uid()
    )
  );

-- avances: visibles si la orden es visible; solo admin escribe
drop policy if exists "avances_select" on public.avances;
create policy "avances_select" on public.avances
  for select using (
    public.es_admin() or exists (
      select 1 from public.ordenes o
      join public.vehiculos v on v.id = o.vehiculo_id
      where o.id = avances.orden_id and v.cliente_id = auth.uid()
    )
  );

drop policy if exists "avances_admin_write" on public.avances;
create policy "avances_admin_write" on public.avances
  for all using (public.es_admin()) with check (public.es_admin());

-- fotos: mismas reglas que avances
drop policy if exists "fotos_select" on public.fotos;
create policy "fotos_select" on public.fotos
  for select using (
    public.es_admin() or exists (
      select 1 from public.ordenes o
      join public.vehiculos v on v.id = o.vehiculo_id
      where o.id = fotos.orden_id and v.cliente_id = auth.uid()
    )
  );

drop policy if exists "fotos_admin_write" on public.fotos;
create policy "fotos_admin_write" on public.fotos
  for all using (public.es_admin()) with check (public.es_admin());

-- notificaciones: el cliente ve/actualiza las suyas; admin ve todo
drop policy if exists "notif_select" on public.notificaciones;
create policy "notif_select" on public.notificaciones
  for select using (cliente_id = auth.uid() or public.es_admin());

drop policy if exists "notif_update" on public.notificaciones;
create policy "notif_update" on public.notificaciones
  for update using (cliente_id = auth.uid());

drop policy if exists "notif_admin_insert" on public.notificaciones;
create policy "notif_admin_insert" on public.notificaciones
  for insert with check (public.es_admin());

-- resenas: el cliente crea/ve las suyas; admin ve todo
drop policy if exists "resenas_select" on public.resenas;
create policy "resenas_select" on public.resenas
  for select using (cliente_id = auth.uid() or public.es_admin());

drop policy if exists "resenas_cliente_insert" on public.resenas;
create policy "resenas_cliente_insert" on public.resenas
  for insert with check (cliente_id = auth.uid());

-- =====================================================================
-- Realtime: publicar tablas que el cliente observa en vivo
-- =====================================================================
alter publication supabase_realtime add table public.ordenes;
alter publication supabase_realtime add table public.avances;
alter publication supabase_realtime add table public.notificaciones;
