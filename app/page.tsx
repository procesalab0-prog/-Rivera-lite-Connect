import Link from 'next/link';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';
import Marca from '@/components/Marca';
import Tacometro from '@/components/Tacometro';

export default async function Home() {
  const demo = !supabaseConfigurado();

  // Si ya hay sesión, mandar a su panel (solo si Supabase está configurado).
  if (supabaseConfigurado()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('rol')
        .eq('id', user.id)
        .single();
      redirect(profile?.rol === 'admin' ? '/admin' : '/dashboard');
    }
  }

  return (
    <main
      className="mx-auto flex min-h-screen max-w-md flex-col animate-riseIn"
      style={{ background: 'linear-gradient(168deg,#6a0c12 0%,#2b0507 34%,#0B0C0E 72%)' }}
    >
      <div className="px-7 pt-16 text-center">
        <span className="mb-3.5 inline-block font-cond text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff8b91]">
          Portal de clientes
        </span>
        <div className="flex justify-center">
          <Marca size="46px" sub />
        </div>
      </div>

      <div className="my-2 flex justify-center">
        <div className="w-[min(320px,78%)]">
          <Tacometro etapa="listo" size="320px" />
        </div>
      </div>

      <div className="mt-auto px-6 pb-10 text-center">
        <p className="mb-5 text-[15px] leading-relaxed text-[#c7cdd6]">
          Sigue el progreso de tu carro en el taller en tiempo real: etapa, historial, fotos y
          fecha de entrega.
        </p>

        {demo ? (
          <>
            <Link href="/dashboard" className="btn-primary mb-3 w-full py-4 text-base">
              Ver demo · Portal del cliente
            </Link>
            <Link href="/admin" className="btn-secondary mb-4 w-full py-4 text-base">
              Ver demo · Panel del taller
            </Link>
            <p className="text-xs text-rivera-dim">
              Demostración con datos de ejemplo — no requiere iniciar sesión.
            </p>
          </>
        ) : (
          <>
            <Link href="/login" className="btn-primary mb-3 w-full py-4 text-base">
              Iniciar sesión
            </Link>
            <Link href="/registro" className="btn-secondary w-full py-4 text-base">
              Crear cuenta
            </Link>
          </>
        )}
      </div>
    </main>
  );
}
