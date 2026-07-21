import { createClient } from '@/lib/supabase/server';
import BarraProgreso from '@/components/BarraProgreso';
import type { Etapa } from '@/lib/etapas';

export const dynamic = 'force-dynamic';

interface EstatusQr {
  marca: string;
  modelo: string;
  anio: number | null;
  color: string | null;
  foto_url: string | null;
  titulo: string | null;
  estatus: Etapa | null;
  fecha_entrega_estimada: string | null;
}

export default async function QrPage({ params }: { params: { slug: string } }) {
  const supabase = createClient();
  const { data } = await supabase.rpc('estatus_por_qr', { slug: params.slug });
  const info = (data?.[0] as EstatusQr) ?? null;

  return (
    <main className="mx-auto flex min-h-screen max-w-lg flex-col justify-center px-4 py-10">
      <div className="mb-4 text-center">
        <span className="text-3xl">🏁</span>
        <h1 className="text-xl font-bold text-rivera-gold">Rivera Élite Garage</h1>
      </div>

      {!info ? (
        <div className="card text-center text-slate-400">
          No encontramos información para este código.
        </div>
      ) : (
        <div className="card space-y-4">
          <div className="h-40 w-full overflow-hidden rounded-lg bg-slate-800">
            {info.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.foto_url} alt="Vehículo" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl">🚗</div>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold">
              {info.marca} {info.modelo} {info.anio ?? ''}
            </h2>
            {info.color && <p className="text-sm text-slate-400">Color: {info.color}</p>}
            {info.titulo && <p className="text-sm text-slate-400">{info.titulo}</p>}
          </div>

          {info.estatus ? (
            <BarraProgreso etapa={info.estatus} />
          ) : (
            <p className="text-sm text-slate-500">Sin orden activa.</p>
          )}

          {info.fecha_entrega_estimada && (
            <p className="text-center text-sm text-slate-400">
              Entrega estimada:{' '}
              {new Date(info.fecha_entrega_estimada).toLocaleDateString('es-MX')}
            </p>
          )}
        </div>
      )}
    </main>
  );
}
