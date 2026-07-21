-- =====================================================================
-- Vista pública del estatus por QR (sin login)
-- Devuelve SOLO datos no sensibles del carro y su orden más reciente.
-- =====================================================================

create or replace function public.estatus_por_qr(slug text)
returns table (
  marca text,
  modelo text,
  anio int,
  color text,
  foto_url text,
  titulo text,
  estatus etapa_orden,
  fecha_entrega_estimada date
)
language sql
security definer set search_path = public
stable
as $$
  select
    v.marca,
    v.modelo,
    v.anio,
    v.color,
    v.foto_url,
    o.titulo,
    o.estatus,
    o.fecha_entrega_estimada
  from public.vehiculos v
  left join lateral (
    select * from public.ordenes o2
    where o2.vehiculo_id = v.id
    order by o2.created_at desc
    limit 1
  ) o on true
  where v.qr_slug = slug;
$$;

-- Permitir que usuarios anónimos y autenticados llamen la función
grant execute on function public.estatus_por_qr(text) to anon, authenticated;
