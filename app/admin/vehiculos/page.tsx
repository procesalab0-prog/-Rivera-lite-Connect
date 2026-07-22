import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { requireAdmin } from '@/lib/auth';
import { DEMO_ADMIN, DEMO_CLIENTES, DEMO_VEHICULOS } from '@/lib/demo';
import NavBar from '@/components/NavBar';
import DemoBanner from '@/components/DemoBanner';
import { crearVehiculo } from '@/app/admin/actions';
import type { Profile } from '@/lib/types';

export const dynamic = 'force-dynamic';

type VehItem = { id: string; marca: string; modelo: string; anio: number | null; placa: string | null; profiles: { nombre: string | null } };

export default async function VehiculosPage() {
  const demo = !supabaseConfigurado();
  let nombreAdmin: string | null = null;
  let clientes: Pick<Profile, 'id' | 'nombre' | 'email'>[] = [];
  let vehiculos: VehItem[] = [];

  if (demo) {
    nombreAdmin = DEMO_ADMIN.nombre;
    clientes = DEMO_CLIENTES.map((c) => ({ id: c.id, nombre: c.nombre, email: c.email }));
    vehiculos = DEMO_VEHICULOS.map((v) => ({
      id: v.id, marca: v.marca, modelo: v.modelo, anio: v.anio, placa: v.placa,
      profiles: { nombre: v.profiles.nombre },
    }));
  } else {
    const { profile } = await requireAdmin();
    nombreAdmin = profile?.nombre ?? null;
    const supabase = createClient();
    const { data: cs } = await supabase
      .from('profiles')
      .select('id, nombre, email')
      .eq('rol', 'cliente')
      .order('nombre');
    clientes = (cs as Pick<Profile, 'id' | 'nombre' | 'email'>[]) ?? [];
    const { data: vs } = await supabase
      .from('vehiculos')
      .select('id, marca, modelo, anio, placa, profiles(nombre)')
      .order('created_at', { ascending: false });
    vehiculos = (vs as unknown as VehItem[]) ?? [];
  }

  return (
    <>
      {demo && <DemoBanner />}
      <NavBar rol="admin" nombre={nombreAdmin} />
      <main className="mx-auto max-w-[900px] animate-riseIn px-5 pb-16 pt-8">
        <h1 className="mb-5 font-cond text-[clamp(26px,5vw,36px)] font-extrabold">Vehículos</h1>

        <section className="card mb-7 rounded-[18px] p-[22px]">
          <h2 className="section-title" style={{ marginBottom: '18px' }}>Registrar vehículo</h2>
          {(clientes?.length ?? 0) === 0 ? (
            <p className="text-sm text-rivera-muted">
              Primero da de alta un cliente en la sección de Clientes.
            </p>
          ) : (
            <form action={crearVehiculo}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="label">Cliente</label>
                  <select name="cliente_id" required className="input">
                    {(clientes as Pick<Profile, 'id' | 'nombre' | 'email'>[]).map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre || c.email}</option>
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
              </div>
              <button className="btn-primary mt-4">Registrar</button>
            </form>
          )}
        </section>

        <h2 className="mb-3.5 font-cond text-[17px] font-bold uppercase tracking-[0.03em]">
          Vehículos ({vehiculos?.length ?? 0})
        </h2>
        <div className="grid gap-2.5">
          {(vehiculos ?? []).map((v) => {
            const dueno = v.profiles as unknown as { nombre: string | null };
            return (
              <Link
                key={v.id}
                href={`/admin/vehiculos/${v.id}`}
                className="card flex items-center justify-between gap-3 rounded-[14px] px-[18px] py-4 transition-colors hover:border-rivera-red/50"
              >
                <div>
                  <p className="m-0 font-cond text-base font-bold">{v.marca} {v.modelo} {v.anio ?? ''}</p>
                  <p className="mt-0.5 font-sans text-[13px] text-rivera-muted">
                    {dueno?.nombre ?? 'Sin dueño'}{v.placa ? ` · ${v.placa}` : ''}
                  </p>
                </div>
                <span className="font-saira text-lg text-[#565c65]">›</span>
              </Link>
            );
          })}
        </div>
      </main>
    </>
  );
}
