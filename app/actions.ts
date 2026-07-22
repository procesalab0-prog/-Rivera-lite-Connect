'use server';

import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';

export async function cerrarSesion() {
  if (!supabaseConfigurado()) {
    redirect('/'); // modo demo: volver a la landing
  }
  const supabase = createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
