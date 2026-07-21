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
      <main className="mx-auto max-w-5xl space-y-8 px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Resumen del taller</h1>
          <Link href="/admin/vehiculos" className="btn-primary">+ Nuevo vehículo</Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {ETAPAS.map((e) => (
            <div key={e.key} className="card text-center">
              <div className="text-2xl">{e.emoji}</div>
              <div className="mt-1 text-2xl font-bold text-rivera-gold">{conteo[e.key] ?? 0}</div>
              <div className="text-xs text-slate-400">{e.label}</div>
            </div>
          ))}
        </div>

        <section>
          <h2 className="mb-3 text-lg font-semibold">Órdenes activas</h2>
          {activas.length === 0 ? (
            <div className="card text-slate-400">No hay órdenes activas.</div>
          ) : (
            <div className="space-y-2">
              {activas.map((o) => {
                const v = o.vehiculos as unknown as { marca: string; modelo: string; placa: string | null };
                return (
                  <Link
                    key={o.id}
                    href={`/admin/ordenes/${o.id}`}
                    className="card flex items-center justify-between transition-colors hover:border-rivera-gold/50"
                  >
                    <div>
                      <p className="font-medium">
                        {v?.marca} {v?.modelo} {v?.placa ? `· ${v.placa}` : ''}
                      </p>
                      <p className="text-sm text-slate-400">{o.titulo}</p>
                    </div>
                    <div className="text-right">
                      <span className="badge bg-rivera-gold/15 text-rivera-gold">
                        {labelEtapa(o.estatus)}
                      </span>
                      {o.fecha_entrega_estimada && (
                        <p className="mt-1 text-xs text-slate-500">
                          Entrega: {new Date(o.fecha_entrega_estimada).toLocaleDateString('es-MX')}
                        </p>
                      )}
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
