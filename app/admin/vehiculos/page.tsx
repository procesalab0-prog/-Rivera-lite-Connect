import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import NavBar from '@/components/NavBar';
import { crearVehiculo } from '@/app/admin/actions';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function VehiculosPage() {
  const { profile } = await requireAdmin();
  const supabase = createClient();

  const { data: clientes } = await supabase
    .from('profiles')
    .select('id, nombre, email')
    .eq('rol', 'cliente')
    .order('nombre');

  const { data: vehiculos } = await supabase
    .from('vehiculos')
    .select('id, marca, modelo, anio, placa, profiles(nombre)')
    .order('created_at', { ascending: false });

  return (
    <>
      <NavBar rol="admin" nombre={profile?.nombre ?? null} />
      <main className="mx-auto max-w-4xl space-y-8 px-4 py-8">
        <h1 className="text-2xl font-bold">Vehículos</h1>

        <section className="card">
          <h2 className="mb-4 text-lg font-semibold">Registrar vehículo</h2>
          {(clientes?.length ?? 0) === 0 ? (
            <p className="text-sm text-slate-400">
              Primero da de alta un cliente en la sección de Clientes.
            </p>
          ) : (
            <form action={crearVehiculo} className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Cliente</label>
                <select name="cliente_id" required className="input">
                  {(clientes as Pick<Profile, 'id' | 'nombre' | 'email'>[]).map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.nombre || c.email}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Marca</label>
                <input name="marca" required className="input" />
              </div>
              <div>
                <label className="label">Modelo</label>
                <input name="modelo" required className="input" />
              </div>
              <div>
                <label className="label">Año</label>
                <input name="anio" type="number" className="input" />
              </div>
              <div>
                <label className="label">Color</label>
                <input name="color" className="input" />
              </div>
              <div>
                <label className="label">Placa</label>
                <input name="placa" className="input" />
              </div>
              <div>
                <label className="label">VIN</label>
                <input name="vin" className="input" />
              </div>
              <div className="sm:col-span-2">
                <button className="btn-primary">Registrar</button>
              </div>
            </form>
          )}
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Vehículos ({vehiculos?.length ?? 0})</h2>
          <div className="space-y-2">
            {(vehiculos ?? []).map((v) => {
              const dueno = v.profiles as unknown as { nombre: string | null };
              return (
                <Link
                  key={v.id}
                  href={`/admin/vehiculos/${v.id}`}
                  className="card flex items-center justify-between transition-colors hover:border-rivera-gold/50"
                >
                  <div>
                    <p className="font-medium">
                      {v.marca} {v.modelo} {v.anio ?? ''}
                    </p>
                    <p className="text-sm text-slate-400">
                      {dueno?.nombre ?? 'Sin dueño'} {v.placa ? `· ${v.placa}` : ''}
                    </p>
                  </div>
                  <span className="text-slate-500">→</span>
                </Link>
              );
            })}
          </div>
        </section>
      </main>
    </>
  );
}
