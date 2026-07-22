import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { requireAdmin } from '@/lib/auth';
import NavBar from '@/components/NavBar';
import { ETAPAS, labelEtapa } from '@/lib/etapas';

export const dynamic = 'force-dynamic';

export default async function AdminPage() {
  const { profile } = await requireAdmin();
  const supabase = createClient();

  const { data: ordenes } = await supabase
    .from('ordenes')
    .select('id, titulo, estatus, fecha_entrega_estimada, vehiculos(marca, modelo, placa)')
    .order('created_at', { ascending: false });

  const activas = (ordenes ?? []).filter((o) => o.estatus !== 'entregado');
  const conteo: Record<string, number> = {};
  for (const o of ordenes ?? []) conteo[o.estatus] = (conteo[o.estatus] ?? 0) + 1;

  return (
    <>
      <NavBar rol="admin" nombre={profile?.nombre ?? null} />
      <main className="mx-auto max-w-[1100px] animate-riseIn px-5 pb-16 pt-8">
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="font-cond text-xs font-bold uppercase tracking-[0.18em] text-rivera-red">
              Panel de administración
            </span>
            <h1 className="mt-1 font-cond text-[clamp(26px,5vw,38px)] font-extrabold">Resumen del taller</h1>
          </div>
          <Link href="/admin/vehiculos" className="btn-primary">+ Nuevo vehículo</Link>
        </div>

        <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {ETAPAS.map((e) => {
            const n = conteo[e.key] ?? 0;
            return (
              <div key={e.key} className="card rounded-[14px] p-4 text-center">
                <div
                  className="mx-auto mb-2.5 h-2 w-2 rounded-full"
                  style={{
                    background: n > 0 ? '#E4121E' : '#2a2e36',
                    boxShadow: n > 0 ? '0 0 8px rgba(228,18,30,.7)' : 'none',
                  }}
                />
                <div
                  className="font-saira text-[30px] font-bold leading-none tabular-nums"
                  style={{ color: n > 0 ? '#F2F4F7' : '#565c65' }}
                >
                  {n}
                </div>
                <div className="mt-1.5 font-cond text-[11px] font-semibold uppercase tracking-[0.05em] text-[#8b929c]">
                  {e.label}
                </div>
              </div>
            );
          })}
        </div>

        <h2 className="section-title mb-3.5">Órdenes activas</h2>
        {activas.length === 0 ? (
          <div className="card text-rivera-muted">No hay órdenes activas.</div>
        ) : (
          <div className="grid gap-2.5">
            {activas.map((o) => {
              const v = o.vehiculos as unknown as { marca: string; modelo: string; placa: string | null };
              return (
                <Link
                  key={o.id}
                  href={`/admin/ordenes/${o.id}`}
                  className="card flex flex-wrap items-center justify-between gap-3.5 rounded-[14px] px-[18px] py-4 transition-colors hover:border-rivera-red/50"
                >
                  <div>
                    <p className="m-0 font-cond text-[17px] font-bold">
                      {v?.marca} {v?.modelo}{v?.placa ? ` · ${v.placa}` : ''}
                    </p>
                    <p className="mt-0.5 font-sans text-[13px] text-rivera-muted">{o.titulo}</p>
                  </div>
                  <div className="text-right">
                    <span className="badge-red">{labelEtapa(o.estatus)}</span>
                    {o.fecha_entrega_estimada && (
                      <p className="mt-1.5 font-saira text-[11px] text-rivera-dim">
                        Entrega: {new Date(o.fecha_entrega_estimada).toLocaleDateString('es-MX')}
                      </p>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
