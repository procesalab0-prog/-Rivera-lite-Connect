'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { labelEtapa, type Etapa } from '@/lib/etapas';

// Verifica que el usuario actual sea admin (para acciones sensibles).
async function assertAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No autenticado');
  const { data: profile } = await supabase
    .from('profiles')
    .select('rol')
    .eq('id', user.id)
    .single();
  if (profile?.rol !== 'admin') throw new Error('No autorizado');
  return supabase;
}

// -------- Clientes --------
export async function crearCliente(formData: FormData) {
  if (!supabaseConfigurado()) return; // modo demo: no persiste
  await assertAdmin();
  const email = String(formData.get('email'));
  const password = String(formData.get('password'));
  const nombre = String(formData.get('nombre') ?? '');
  const telefono = String(formData.get('telefono') ?? '');

  const admin = createAdminClient();
  const { error } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: { nombre, telefono },
  });
  if (error) throw error;

  revalidatePath('/admin/clientes');
}

// -------- Vehículos --------
export async function crearVehiculo(formData: FormData) {
  if (!supabaseConfigurado()) return; // modo demo: no persiste
  const supabase = await assertAdmin();
  const { error } = await supabase.from('vehiculos').insert({
    cliente_id: String(formData.get('cliente_id')),
    marca: String(formData.get('marca')),
    modelo: String(formData.get('modelo')),
    anio: formData.get('anio') ? Number(formData.get('anio')) : null,
    placa: String(formData.get('placa') ?? '') || null,
    vin: String(formData.get('vin') ?? '') || null,
    color: String(formData.get('color') ?? '') || null,
  });
  if (error) throw error;
  revalidatePath('/admin/vehiculos');
}

export async function subirFotoVehiculo(formData: FormData) {
  if (!supabaseConfigurado()) return; // modo demo: no persiste
  const supabase = await assertAdmin();
  const vehiculoId = String(formData.get('vehiculo_id'));
  const file = formData.get('foto') as File | null;
  if (!file || file.size === 0) return;

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `vehiculos/${vehiculoId}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from('vehiculos')
    .upload(path, file, { upsert: true });
  if (upErr) throw upErr;

  const { data } = supabase.storage.from('vehiculos').getPublicUrl(path);
  await supabase.from('vehiculos').update({ foto_url: data.publicUrl }).eq('id', vehiculoId);
  revalidatePath(`/admin/vehiculos/${vehiculoId}`);
}

// -------- Órdenes --------
export async function crearOrden(formData: FormData) {
  if (!supabaseConfigurado()) return; // modo demo: no persiste
  const supabase = await assertAdmin();
  const vehiculoId = String(formData.get('vehiculo_id'));
  const { data: orden, error } = await supabase
    .from('ordenes')
    .insert({
      vehiculo_id: vehiculoId,
      titulo: String(formData.get('titulo')),
      descripcion: String(formData.get('descripcion') ?? '') || null,
      mecanico: String(formData.get('mecanico') ?? '') || null,
      fecha_entrega_estimada: String(formData.get('fecha_entrega_estimada') ?? '') || null,
      costo_estimado: formData.get('costo_estimado')
        ? Number(formData.get('costo_estimado'))
        : null,
      estatus: 'recibido',
    })
    .select()
    .single();
  if (error) throw error;

  await supabase.from('avances').insert({
    orden_id: orden.id,
    etapa: 'recibido',
    nota: 'Vehículo recibido en el taller.',
  });

  revalidatePath(`/admin/vehiculos/${vehiculoId}`);
}

export async function actualizarOrden(formData: FormData) {
  if (!supabaseConfigurado()) return; // modo demo: no persiste
  const supabase = await assertAdmin();
  const ordenId = String(formData.get('orden_id'));
  const { error } = await supabase
    .from('ordenes')
    .update({
      titulo: String(formData.get('titulo')),
      descripcion: String(formData.get('descripcion') ?? '') || null,
      mecanico: String(formData.get('mecanico') ?? '') || null,
      fecha_entrega_estimada: String(formData.get('fecha_entrega_estimada') ?? '') || null,
      fecha_entrega_real: String(formData.get('fecha_entrega_real') ?? '') || null,
      costo_estimado: formData.get('costo_estimado')
        ? Number(formData.get('costo_estimado'))
        : null,
    })
    .eq('id', ordenId);
  if (error) throw error;
  revalidatePath(`/admin/ordenes/${ordenId}`);
}

export async function cambiarEtapa(formData: FormData) {
  if (!supabaseConfigurado()) return; // modo demo: no persiste
  const supabase = await assertAdmin();
  const ordenId = String(formData.get('orden_id'));
  const etapa = String(formData.get('etapa')) as Etapa;
  const nota = String(formData.get('nota') ?? '') || null;

  // Actualiza estatus + registra avance
  await supabase.from('ordenes').update({ estatus: etapa }).eq('id', ordenId);
  await supabase.from('avances').insert({ orden_id: ordenId, etapa, nota });

  // Notificación in-app para el cliente
  const { data: orden } = await supabase
    .from('ordenes')
    .select('vehiculo_id')
    .eq('id', ordenId)
    .single();
  if (orden) {
    const { data: veh } = await supabase
      .from('vehiculos')
      .select('cliente_id, marca, modelo')
      .eq('id', orden.vehiculo_id)
      .single();
    if (veh) {
      await supabase.from('notificaciones').insert({
        cliente_id: veh.cliente_id,
        orden_id: ordenId,
        mensaje: `Tu ${veh.marca} ${veh.modelo} pasó a: ${labelEtapa(etapa)}.`,
      });
    }
  }

  revalidatePath(`/admin/ordenes/${ordenId}`);
}

export async function subirFotoOrden(formData: FormData) {
  if (!supabaseConfigurado()) return; // modo demo: no persiste
  const supabase = await assertAdmin();
  const ordenId = String(formData.get('orden_id'));
  const tipo = String(formData.get('tipo') ?? 'durante');
  const descripcion = String(formData.get('descripcion') ?? '') || null;
  const file = formData.get('foto') as File | null;
  if (!file || file.size === 0) return;

  const ext = file.name.split('.').pop() || 'jpg';
  const path = `ordenes/${ordenId}-${Date.now()}.${ext}`;
  const { error: upErr } = await supabase.storage
    .from('vehiculos')
    .upload(path, file, { upsert: true });
  if (upErr) throw upErr;

  const { data } = supabase.storage.from('vehiculos').getPublicUrl(path);
  await supabase.from('fotos').insert({
    orden_id: ordenId,
    url: data.publicUrl,
    tipo,
    descripcion,
  });
  revalidatePath(`/admin/ordenes/${ordenId}`);
}
