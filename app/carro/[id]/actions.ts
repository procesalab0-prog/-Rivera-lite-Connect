'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';

export async function responderCotizacion(formData: FormData) {
  if (!supabaseConfigurado()) return; // modo demo: no persiste
  const ordenId = String(formData.get('orden_id'));
  const decision = String(formData.get('decision')); // 'aprobada' | 'rechazada'
  const supabase = createClient();

  await supabase
    .from('ordenes')
    .update({ cotizacion_estado: decision })
    .eq('id', ordenId);

  revalidatePath('/carro', 'layout');
}

export async function enviarResena(formData: FormData) {
  if (!supabaseConfigurado()) return; // modo demo: no persiste
  const ordenId = String(formData.get('orden_id'));
  const calificacion = Number(formData.get('calificacion'));
  const comentario = String(formData.get('comentario') ?? '');

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase.from('resenas').upsert(
    {
      orden_id: ordenId,
      cliente_id: user.id,
      calificacion,
      comentario,
    },
    { onConflict: 'orden_id,cliente_id' }
  );

  revalidatePath('/carro', 'layout');
}
