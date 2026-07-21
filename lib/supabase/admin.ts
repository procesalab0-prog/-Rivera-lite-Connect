import { createClient as createSupabaseClient } from '@supabase/supabase-js';

// Cliente con service_role. SOLO usar en el servidor y después de verificar
// que el usuario que invoca es administrador. Nunca exponer al navegador.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
