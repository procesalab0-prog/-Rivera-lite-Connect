import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { requireAdmin } from '@/lib/auth';
import { DEMO_ADMIN, demoOrden, demoVehiculo, demoAvances, demoFotos } from '@/lib/demo';
import NavBar from '@/components/NavBar';
import DemoBanner from '@/components/DemoBanner';
import Tacometro from '@/components/Tacometro';
import Timeline from '@/components/Timeline';
import BotonWhatsApp from '@/components/BotonWhatsApp';
import { ETAPAS } from '@/lib/etapas';
import { cambiarEtapa, actualizarOrden, subirFotoOrden } from '@/app/admin/actions';
import type { Avance, Foto, Orden, Vehiculo } from '@/lib/types';

export const dynamic = 'force-dynamic';

type OrdenConVehiculo = Orden & {
  vehiculos: Vehiculo & { profiles: { nombre: string | null; telefono: string | null } };
};

export default async function AdminOrdenPage({ params }: { params: { id: string } }) {
  const demo = !supabaseConfigurado();
  let nombreAdmin: string | null = null;
  let o: OrdenConVehiculo;
  let avances: Avance[] = [];
  let fotos: Foto[] = [];

  if (demo) {
    nombreAdmin = DEMO_ADMIN.nombre;
    const od = demoOrden(params.id) ?? demoOrden('demo-ord-1')!;
    const vd = demoVehiculo(od.vehiculo_id)!;
    o = { ...od, vehiculos: vd } as OrdenConVehiculo;
    avances = demoAvances(o.id);
    fotos = demoFotos(o.id);
  } else {
    const { profile } = await requireAdmin();
    nombreAdmin = profile?.nombre ?? null;
    const supabase = createClient();
    const { data: orden } = await supabase
      .from('ordenes')
      .select('*, vehiculos(*, profiles(nombre, telefono))')
      .eq('id', params.id)
      .single();
    if (!orden) notFound();
    o = orden as OrdenConVehiculo;
    avances = ((await supabase.from('avances').select('*').eq('orden_id', o.id).order('created_at', { ascending: false })).data as Avance[]) ?? [];
    fotos = ((await supabase.from('fotos').select('*').eq('orden_id', o.id).order('created_at', { ascending: true })).data as Foto[]) ?? [];
  }

  const v = o.vehiculos;

  return (
    <>
      {demo && <DemoBanner />}
      <NavBar rol="admin" nombre={nombreAdmin} />
      <main className="mx-auto max-w-[1000px] animate-riseIn px-5 pb-16 pt-7">
        <Link href={`/admin/vehiculos/${v.id}`} className="mb-4 inline-block font-cond text-[13px] font-semibold uppercase tracking-[0.06em] text-rivera-muted hover:text-rivera-red">
          ← {v.marca} {v.modelo}
        </Link>

        <section
          className="mb-4 rounded-[20px] border border-rivera-border p-[clamp(18px,4vw,28px)] shadow-[0_20px_50px_rgba(0,0,0,.5)]"
          style={{ background: 'radial-gradient(90% 120% at 50% 0,#191c22,#0e1013)' }}
        >
          <div className="mb-4.5 flex flex-wrap items-center justify-between gap-3.5" style={{ marginBottom: '18px' }}>
            <h1 className="m-0 font-cond text-[clamp(20px,4vw,28px)] font-extrabold">{o.titulo}</h1>
            <BotonWhatsApp
              telefono={v.profiles?.telefono ?? null}
              nombre={v.profiles?.nombre ?? null}
              marca={v.marca}
              modelo={v.modelo}
              placa={v.placa}
              etapa={o.estatus}
              fechaEntrega={o.fecha_entrega_estimada}
            />
          </div>
          <div className="flex justify-center">
            <div className="w-[min(360px,92vw)]">
              <Tacometro etapa={o.estatus} size="340px" />
            </div>
          </div>
        </section>

        <div className="mb-4 grid gap-4 md:grid-cols-2">
          <section className="card rounded-[18px] p-[22px]">
            <h2 className="section-title mb-4">Avanzar etapa</h2>
            <form action={cambiarEtapa} className="space-y-3">
              <input type="hidden" name="orden_id" value={o.id} />
              <div>
                <label className="label">Nueva etapa</label>
                <select name="etapa" defaultValue={o.estatus} className="input">
                  {ETAPAS.map((e) => (
                    <option key={e.key} value={e.key}>{e.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Nota (opcional)</label>
                <input name="nota" className="input" placeholder="Ej. Se cambiaron balatas" />
              </div>
              <button className="btn-primary">Guardar avance</button>
            </form>
          </section>

          <section className="card rounded-[18px] p-[22px]">
            <h2 className="section-title mb-4">Datos de la orden</h2>
            <form action={actualizarOrden} className="space-y-3">
              <input type="hidden" name="orden_id" value={o.id} />
              <div>
                <label className="label">Título</label>
                <input name="titulo" defaultValue={o.titulo} className="input" />
              </div>
              <div>
                <label className="label">Descripción</label>
                <textarea name="descripcion" defaultValue={o.descripcion ?? ''} rows={2} className="input resize-y" />
              </div>
              <div>
                <label className="label">Mecánico</label>
                <input name="mecanico" defaultValue={o.mecanico ?? ''} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="label">Entrega est.</label>
                  <input name="fecha_entrega_estimada" type="date" defaultValue={o.fecha_entrega_estimada ?? ''} className="input" />
                </div>
                <div>
                  <label className="label">Entrega real</label>
                  <input name="fecha_entrega_real" type="date" defaultValue={o.fecha_entrega_real ?? ''} className="input" />
                </div>
              </div>
              <div>
                <label className="label">Costo (MXN)</label>
                <input name="costo_estimado" type="number" step="0.01" defaultValue={o.costo_estimado ?? ''} className="input" />
              </div>
              <button className="btn-secondary">Guardar cambios</button>
            </form>
          </section>
        </div>

        <section className="card mb-4 rounded-[18px] p-[22px]">
          <h2 className="section-title mb-4">Fotos</h2>
          <form action={subirFotoOrden} className="mb-4 grid gap-3 sm:grid-cols-4 sm:items-end">
            <input type="hidden" name="orden_id" value={o.id} />
            <div>
              <label className="label">Tipo</label>
              <select name="tipo" className="input">
                <option value="antes">Antes</option>
                <option value="durante">Durante</option>
                <option value="despues">Después</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label className="label">Archivo</label>
              <input type="file" name="foto" accept="image/*" required
                className="w-full font-saira text-[13px] text-rivera-dim file:mr-2 file:rounded file:border-0 file:bg-[#20242b] file:px-3 file:py-1.5 file:font-cond file:text-xs file:uppercase file:text-rivera-ink" />
            </div>
            <button className="btn-secondary">Subir foto</button>
          </form>

          <div className="grid grid-cols-3 gap-2.5 sm:grid-cols-4">
            {(fotos as Foto[] | null)?.map((f) => (
              <div key={f.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.tipo} className="aspect-square w-full rounded-xl border border-rivera-input-border object-cover" />
                <span className="badge absolute left-1.5 top-1.5 bg-black/60 px-2 py-0.5 text-[9px] text-white">{f.tipo}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="card rounded-[18px] p-[22px]">
          <h2 className="section-title mb-4">Historial</h2>
          <Timeline avances={(avances as Avance[]) ?? []} />
        </section>
      </main>
    </>
  );
}
