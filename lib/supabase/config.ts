// ¿Supabase está configurado con credenciales reales?
// (no vacías y no los placeholders de la vista previa)
export function supabaseConfigurado() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  return (
    url.startsWith('https://') &&
    !url.includes('placeholder') &&
    key.length > 0 &&
    !key.includes('placeholder')
  );
}
