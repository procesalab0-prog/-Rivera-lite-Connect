import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import NavBar from '@/components/NavBar';
import QRCarro from '@/components/QRCarro';
import { labelEtapa } from '@/lib/etapas';
import { crearOrden, subirFotoVehiculo } from '@/app/admin/actions';
import type { Orden, Vehiculo } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminVehiculoPage({ params }: { params: { id: string } }) {
  const { profile } = await requireAdmin();
  const supabase = createClient();

  const { data: vehiculo } = await supabase
    .from('vehiculos')
    .select('*, profiles(nombre, telefono, email)')
    .eq('id', params.id)
    .single();
  if (!vehiculo) notFound();
  const v = vehiculo as Vehiculo & { profiles: { nombre: string | null; telefono: string | null; email: string | null } };

  const { data: ordenes } = await supabase
    .from('ordenes')
    .select('*')
    .eq('vehiculo_id', v.id)
    .order('created_at', { ascending: false });

  return (
    <>
      <NavBar rol="admin" nombre={profile?.nombre ?? null} />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Link href="/admin/vehiculos" className="text-sm text-slate-400 hover:text-rivera-gold">
          ← Vehículos
        </Link>

        <div className="grid gap-6 md:grid-cols-2">
          <section className="card">
            <h1 className="text-xl font-bold">
              {v.marca} {v.modelo} {v.anio ?? ''}
            </h1>
            <div className="mt-2 space-y-0.5 text-sm text-slate-400">
              <p>Dueño: {v.profiles?.nombre ?? '—'}</p>
              {v.profiles?.telefono && <p>Tel: {v.profiles.telefono}</p>}
              {v.placa && <p>Placa: {v.placa}</p>}
              {v.color && <p>Color: {v.color}</p>}
              {v.vin && <p>VIN: {v.vin}</p>}
            </div>

            <div className="mt-4 h-40 w-full overflow-hidden rounded-lg bg-slate-800">
              {v.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.foto_url} alt="Foto" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl">🚗</div>
              )}
            </div>
            <form action={subirFotoVehiculo} className="mt-3 flex items-center gap-2">
              <input type="hidden" name="vehiculo_id" value={v.id} />
              <input type="file" name="foto" accept="image/*" required
                className="text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-slate-700 file:px-3 file:py-1 file:text-slate-100" />
              <button className="btn-secondary py-1">Subir</button>
            </form>
          </section>

          <section className="card">
            <h2 className="mb-3 text-lg font-semibold">Código QR</h2>
            <QRCarro slug={v.qr_slug} />
          </section>
        </div>

        <section className="card">
          <h2 className="mb-4 text-lg font-semibold">Nueva orden de servicio</h2>
          <form action={crearOrden} className="grid gap-4 sm:grid-cols-2">
            <input type="hidden" name="vehiculo_id" value={v.id} />
            <div className="sm:col-span-2">
              <label className="label">Título</label>
              <input name="titulo" required className="input" placeholder="Ej. Servicio mayor + frenos" />
            </div>
            <div className="sm:col-span-2">
              <label className="label">Descripción</label>
              <textarea name="descripcion" rows={2} className="input" />
            </div>
            <div>
              <label className="label">Mecánico</label>
              <input name="mecanico" className="input" />
            </div>
            <div>
              <label className="label">Fecha de entrega estimada</label>
              <input name="fecha_entrega_estimada" type="date" className="input" />
            </div>
            <div>
              <label className="label">Costo estimado (MXN)</label>
              <input name="costo_estimado" type="number" step="0.01" className="input" />
            </div>
            <div className="sm:col-span-2">
              <button className="btn-primary">Crear orden</button>
            </div>
          </form>
        </section>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Órdenes ({ordenes?.length ?? 0})</h2>
          <div className="space-y-2">
            {(ordenes as Orden[] | null)?.map((o) => (
              <Link
                key={o.id}
                href={`/admin/ordenes/${o.id}`}
                className="card flex items-center justify-between transition-colors hover:border-rivera-gold/50"
              >
                <span>{o.titulo}</span>
                <span className="badge bg-rivera-gold/15 text-rivera-gold">
                  {labelEtapa(o.estatus)}
                </span>
              </Link>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
