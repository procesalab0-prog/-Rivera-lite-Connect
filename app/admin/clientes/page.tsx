import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import NavBar from '@/components/NavBar';
import { crearCliente } from '@/app/admin/actions';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ClientesPage() {
  const { profile } = await requireAdmin();
  const supabase = createClient();

  const { data: clientes } = await supabase
    .from('profiles')
    .select('*')
    .eq('rol', 'cliente')
    .order('created_at', { ascending: false });

  return (
    <>
      <NavBar rol="admin" nombre={profile?.nombre ?? null} />
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <h1 className="text-2xl font-bold">Clientes</h1>

        <section className="card">
          <h2 className="mb-4 text-lg font-semibold">Dar de alta un cliente</h2>
          <form action={crearCliente} className="grid gap-4 sm:grid-cols-2">
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
            <div className="sm:col-span-2">
              <button className="btn-primary">Crear cliente</button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">
            Clientes registrados ({clientes?.length ?? 0})
          </h2>
          <div className="space-y-2">
            {(clientes as Profile[] | null)?.map((c) => (
              <div key={c.id} className="card flex items-center justify-between">
                <div>
                  <p className="font-medium">{c.nombre || 'Sin nombre'}</p>
                  <p className="text-sm text-slate-400">{c.email}</p>
                </div>
                {c.telefono && <span className="text-sm text-slate-400">{c.telefono}</span>}
              </div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
