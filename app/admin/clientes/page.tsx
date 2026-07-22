import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { requireAdmin } from '@/lib/auth';
import { DEMO_ADMIN, DEMO_CLIENTES } from '@/lib/demo';
import NavBar from '@/components/NavBar';
import DemoBanner from '@/components/DemoBanner';
import { crearCliente } from '@/app/admin/actions';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  const demo = !supabaseConfigurado();
  let nombreAdmin: string | null = null;
  let clientes: Profile[] = [];

  if (demo) {
    nombreAdmin = DEMO_ADMIN.nombre;
    clientes = DEMO_CLIENTES;
  } else {
    const { profile } = await requireAdmin();
    nombreAdmin = profile?.nombre ?? null;
    const supabase = createClient();
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('rol', 'cliente')
      .order('created_at', { ascending: false });
    clientes = (data as Profile[]) ?? [];
  }

  return (
    <>
      {demo && <DemoBanner />}
      <NavBar rol="admin" nombre={nombreAdmin} />
      <main className="mx-auto max-w-[900px] animate-riseIn px-5 pb-16 pt-8">
        <h1 className="mb-5 font-cond text-[clamp(26px,5vw,36px)] font-extrabold">Clientes</h1>

        <section className="card mb-7 rounded-[18px] p-[22px]">
          <h2 className="section-title mb-4.5" style={{ marginBottom: '18px' }}>Dar de alta un cliente</h2>
          <form action={crearCliente}>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label">Nombre</label>
                <input name="nombre" required className="input" />
              </div>
              <div>
                <label className="label">Teléfono (WhatsApp)</label>
                <input name="telefono" className="input" placeholder="10 dígitos" />
              </div>
              <div>
                <label className="label">Correo</label>
                <input name="email" type="email" required className="input" />
              </div>
              <div>
                <label className="label">Contraseña temporal</label>
                <input name="password" required minLength={6} className="input" />
              </div>
            </div>
            <button className="btn-primary mt-4">Crear cliente</button>
          </form>
        </section>

        <h2 className="mb-3.5 font-cond text-[17px] font-bold uppercase tracking-[0.03em]">
          Clientes registrados ({clientes?.length ?? 0})
        </h2>
        <div className="grid gap-2.5">
          {(clientes as Profile[] | null)?.map((c) => (
            <div key={c.id} className="card flex flex-wrap items-center justify-between gap-3 rounded-[14px] px-[18px] py-4">
              <div>
                <p className="m-0 font-cond text-base font-bold">{c.nombre || 'Sin nombre'}</p>
                <p className="mt-0.5 font-sans text-[13px] text-rivera-muted">{c.email}</p>
              </div>
              {c.telefono && <span className="font-saira text-sm text-rivera-muted">{c.telefono}</span>}
            </div>
          ))}
        </div>
      </main>
    </>
  );
}
