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
      <main className="mx-auto max-w-[1000px] animate-riseIn px-5 pb-16 pt-7">
        <Link href="/admin/vehiculos" className="mb-4 inline-block font-cond text-[13px] font-semibold uppercase tracking-[0.06em] text-rivera-muted hover:text-rivera-red">
          ← Vehículos
        </Link>

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <section className="card rounded-[18px] p-[22px]">
            <h1 className="mb-3 font-cond text-2xl font-extrabold">{v.marca} {v.modelo} {v.anio ?? ''}</h1>
            <div className="mb-4 font-saira text-sm leading-[1.8] text-rivera-muted">
              <div>Dueño: <span className="text-[#e8ecf0]">{v.profiles?.nombre ?? '—'}</span></div>
              {v.profiles?.telefono && <div>Tel: <span className="text-[#e8ecf0]">{v.profiles.telefono}</span></div>}
              {v.placa && <div>Placa: <span className="text-[#e8ecf0]">{v.placa}</span>{v.color ? <> · Color: <span className="text-[#e8ecf0]">{v.color}</span></> : null}</div>}
              {v.vin && <div>VIN: <span className="text-[#e8ecf0]">{v.vin}</span></div>}
            </div>
            <div className="mb-3 aspect-video overflow-hidden rounded-xl border border-rivera-input-border bg-rivera-input">
              {v.foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={v.foto_url} alt="Foto" className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-4xl">🚗</div>
              )}
            </div>
            <form action={subirFotoVehiculo} className="flex items-center gap-2.5">
              <input type="hidden" name="vehiculo_id" value={v.id} />
              <input type="file" name="foto" accept="image/*" required
                className="flex-1 font-saira text-[13px] text-rivera-dim file:mr-2 file:rounded file:border-0 file:bg-[#20242b] file:px-3 file:py-1.5 file:font-cond file:text-xs file:uppercase file:text-rivera-ink" />
              <button className="btn-secondary py-2">Subir</button>
            </form>
          </section>

          <section className="card flex flex-col items-center rounded-[18px] p-[22px]">
            <h2 className="section-title mb-4 self-start">Código QR</h2>
            <QRCarro slug={v.qr_slug} />
          </section>
        </div>

        <section className="card mb-4 rounded-[18px] p-[22px]">
          <h2 className="section-title" style={{ marginBottom: '18px' }}>Nueva orden de servicio</h2>
          <form action={crearOrden}>
            <input type="hidden" name="vehiculo_id" value={v.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <label className="label">Título</label>
                <input name="titulo" required className="input" placeholder="Ej. Servicio mayor + frenos" />
              </div>
              <div className="sm:col-span-2">
                <label className="label">Descripción</label>
                <textarea name="descripcion" rows={2} className="input resize-y" />
              </div>
              <div>
                <label className="label">Mecánico</label>
                <input name="mecanico" className="input" />
              </div>
              <div>
                <label className="label">Entrega estimada</label>
                <input name="fecha_entrega_estimada" type="date" className="input" />
              </div>
              <div>
                <label className="label">Costo estimado (MXN)</label>
                <input name="costo_estimado" type="number" step="0.01" className="input" />
              </div>
            </div>
            <button className="btn-primary mt-4">Crear orden</button>
          </form>
        </section>

        <h2 className="mb-3 font-cond text-[17px] font-bold uppercase tracking-[0.03em]">
          Órdenes ({ordenes?.length ?? 0})
        </h2>
        <div className="grid gap-2.5">
          {(ordenes as Orden[] | null)?.map((o) => (
            <Link
              key={o.id}
              href={`/admin/ordenes/${o.id}`}
              className="card flex items-center justify-between rounded-[14px] px-[18px] py-4 transition-colors hover:border-rivera-red/50"
            >
              <span className="font-cond text-base font-bold">{o.titulo}</span>
              <span className={o.estatus === 'entregado' ? 'badge-muted' : 'badge-red'}>{labelEtapa(o.estatus)}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
