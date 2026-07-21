import Link from 'next/link';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import NavBar from '@/components/NavBar';
import BarraProgreso from '@/components/BarraProgreso';
import Timeline from '@/components/Timeline';
import BotonWhatsApp from '@/components/BotonWhatsApp';
import { ETAPAS } from '@/lib/etapas';
import { cambiarEtapa, actualizarOrden, subirFotoOrden } from '@/app/admin/actions';
import type { Avance, Foto, Orden, Vehiculo } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function AdminOrdenPage({ params }: { params: { id: string } }) {
  const { profile } = await requireAdmin();
  const supabase = createClient();

  const { data: orden } = await supabase
    .from('ordenes')
    .select('*, vehiculos(*, profiles(nombre, telefono))')
    .eq('id', params.id)
    .single();
  if (!orden) notFound();
  const o = orden as Orden & {
    vehiculos: Vehiculo & { profiles: { nombre: string | null; telefono: string | null } };
  };
  const v = o.vehiculos;

  const { data: avances } = await supabase
    .from('avances')
    .select('*')
    .eq('orden_id', o.id)
    .order('created_at', { ascending: false });

  const { data: fotos } = await supabase
    .from('fotos')
    .select('*')
    .eq('orden_id', o.id)
    .order('created_at', { ascending: true });

  return (
    <>
      <NavBar rol="admin" nombre={profile?.nombre ?? null} />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Link href={`/admin/vehiculos/${v.id}`} className="text-sm text-slate-400 hover:text-rivera-gold">
          ← {v.marca} {v.modelo}
        </Link>

        <section className="card">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-xl font-bold">{o.titulo}</h1>
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
          <BarraProgreso etapa={o.estatus} />
        </section>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Cambiar etapa */}
          <section className="card">
            <h2 className="mb-4 text-lg font-semibold">Avanzar etapa</h2>
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

          {/* Editar datos */}
          <section className="card">
            <h2 className="mb-4 text-lg font-semibold">Datos de la orden</h2>
            <form action={actualizarOrden} className="space-y-3">
              <input type="hidden" name="orden_id" value={o.id} />
              <div>
                <label className="label">Título</label>
                <input name="titulo" defaultValue={o.titulo} className="input" />
              </div>
              <div>
                <label className="label">Descripción</label>
                <textarea name="descripcion" defaultValue={o.descripcion ?? ''} rows={2} className="input" />
              </div>
              <div>
                <label className="label">Mecánico</label>
                <input name="mecanico" defaultValue={o.mecanico ?? ''} className="input" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="label">Entrega estimada</label>
                  <input name="fecha_entrega_estimada" type="date"
                    defaultValue={o.fecha_entrega_estimada ?? ''} className="input" />
                </div>
                <div>
                  <label className="label">Entrega real</label>
                  <input name="fecha_entrega_real" type="date"
                    defaultValue={o.fecha_entrega_real ?? ''} className="input" />
                </div>
              </div>
              <div>
                <label className="label">Costo estimado (MXN)</label>
                <input name="costo_estimado" type="number" step="0.01"
                  defaultValue={o.costo_estimado ?? ''} className="input" />
              </div>
              <button className="btn-secondary">Guardar cambios</button>
            </form>
          </section>
        </div>

        {/* Fotos */}
        <section className="card">
          <h2 className="mb-4 text-lg font-semibold">Fotos</h2>
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
                className="w-full text-sm text-slate-300 file:mr-2 file:rounded file:border-0 file:bg-slate-700 file:px-3 file:py-1 file:text-slate-100" />
            </div>
            <button className="btn-secondary">Subir foto</button>
          </form>

          <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
            {(fotos as Foto[] | null)?.map((f) => (
              <div key={f.id} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={f.url} alt={f.tipo} className="aspect-square w-full rounded-lg object-cover" />
                <span className="badge absolute left-1 top-1 bg-black/60 text-white">{f.tipo}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Historial */}
        <section className="card">
          <h2 className="mb-4 text-lg font-semibold">Historial</h2>
          <Timeline avances={(avances as Avance[]) ?? []} />
        </section>
      </main>
    </>
  );
}
