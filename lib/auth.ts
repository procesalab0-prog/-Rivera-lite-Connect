import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

// Verifica que haya sesión de admin. Devuelve el user y su profile.
export async function requireAdmin() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile?.rol !== 'admin') redirect('/dashboard');
  return { user, profile };
}
