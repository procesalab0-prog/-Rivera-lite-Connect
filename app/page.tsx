import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';

export default async function Home() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si ya inició sesión, mandarlo a su panel
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('rol')
      .eq('id', user.id)
      .single();
    redirect(profile?.rol === 'admin' ? '/admin' : '/dashboard');
  }

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-4 text-center">
      <span className="text-5xl">🏁</span>
      <h1 className="mt-4 text-4xl font-bold text-rivera-gold">Rivera Élite Connect</h1>
      <p className="mt-3 max-w-xl text-slate-400">
        El portal de Rivera Élite Garage. Consulta el progreso de tu carro en el
        taller, su historial, fotos y fecha de entrega — todo en un solo lugar.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/login" className="btn-primary">Iniciar sesión</Link>
        <Link href="/registro" className="btn-secondary">Crear cuenta</Link>
      </div>
    </main>
  );
}
