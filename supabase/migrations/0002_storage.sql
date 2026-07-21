-- =====================================================================
-- Storage: bucket para fotos de vehículos y órdenes
-- Ejecutar en el SQL Editor de Supabase después de 0001_init.sql
-- =====================================================================

insert into storage.buckets (id, name, public)
values ('vehiculos', 'vehiculos', true)
on conflict (id) do nothing;

-- Lectura pública de las imágenes (el bucket es público para mostrar fotos y QR)
drop policy if exists "vehiculos_public_read" on storage.objects;
create policy "vehiculos_public_read" on storage.objects
  for select using (bucket_id = 'vehiculos');

-- Solo administradores pueden subir / actualizar / borrar imágenes
drop policy if exists "vehiculos_admin_insert" on storage.objects;
create policy "vehiculos_admin_insert" on storage.objects
  for insert with check (bucket_id = 'vehiculos' and public.es_admin());

drop policy if exists "vehiculos_admin_update" on storage.objects;
create policy "vehiculos_admin_update" on storage.objects
  for update using (bucket_id = 'vehiculos' and public.es_admin());

drop policy if exists "vehiculos_admin_delete" on storage.objects;
create policy "vehiculos_admin_delete" on storage.objects
  for delete using (bucket_id = 'vehiculos' and public.es_admin());
