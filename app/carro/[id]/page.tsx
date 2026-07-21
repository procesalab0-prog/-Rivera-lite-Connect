import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import NavBar from '@/components/NavBar';
import BarraProgreso from '@/components/BarraProgreso';
import Timeline from '@/components/Timeline';
import GaleriaAntesDespues from '@/components/GaleriaAntesDespues';
import CotizacionCliente from '@/components/CotizacionCliente';
import FormResena from '@/components/FormResena';
import RealtimeRefresh from '@/components/RealtimeRefresh';
import type { Avance, Foto, Orden, Resena, Vehiculo } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function CarroPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect('/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('rol, nombre')
    .eq('id', user.id)
    .single();

  const { data: vehiculo } = await supabase
    .from('vehiculos')
    .select('*')
    .eq('id', params.id)
    .single();

  if (!vehiculo) notFound();
  const v = vehiculo as Vehiculo;

  const { data: ordenes } = await supabase
    .from('ordenes')
    .select('*')
    .eq('vehiculo_id', v.id)
    .order('created_at', { ascending: false });

  const ordenActual = (ordenes?.[0] as Orden) ?? null;

  const { data: avances } = ordenActual
    ? await supabase
        .from('avances')
        .select('*')
        .eq('orden_id', ordenActual.id)
        .order('created_at', { ascending: false })
    : { data: [] as Avance[] };

  const { data: fotos } = ordenActual
    ? await supabase
        .from('fotos')
        .select('*')
        .eq('orden_id', ordenActual.id)
        .order('created_at', { ascending: true })
    : { data: [] as Foto[] };

  const { data: resena } = ordenActual
    ? await supabase
        .from('resenas')
        .select('*')
        .eq('orden_id', ordenActual.id)
        .eq('cliente_id', user.id)
        .maybeSingle()
    : { data: null };

  return (
    <>
      <RealtimeRefresh />
      <NavBar rol={(profile?.rol as 'admin' | 'cliente') ?? 'cliente'} nombre={profile?.nombre ?? null} />
      <main className="mx-auto max-w-4xl space-y-6 px-4 py-8">
        <Link href="/dashboard" className="text-sm text-slate-400 hover:text-rivera-gold">
          ← Volver
        </Link>

        <header className="card flex flex-col gap-4 sm:flex-row">
          <div className="h-32 w-full overflow-hidden rounded-lg bg-slate-800 sm:w-52">
            {v.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={v.foto_url} alt={`${v.marca} ${v.modelo}`} className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center text-4xl">🚗</div>
            )}
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {v.marca} {v.modelo} {v.anio ?? ''}
            </h1>
            <div className="mt-1 space-y-0.5 text-sm text-slate-400">
              {v.placa && <p>Placa: {v.placa}</p>}
              {v.color && <p>Color: {v.color}</p>}
              {ordenActual?.mecanico && <p>Mecánico: {ordenActual.mecanico}</p>}
              {ordenActual?.fecha_entrega_estimada && (
                <p>
                  Entrega estimada:{' '}
                  {new Date(ordenActual.fecha_entrega_estimada).toLocaleDateString('es-MX')}
                </p>
              )}
            </div>
          </div>
        </header>

        {!ordenActual ? (
          <div className="card text-slate-400">
            Este carro aún no tiene una orden de servicio activa.
          </div>
        ) : (
          <>
            <section className="card">
              <h2 className="mb-4 text-lg font-semibold">{ordenActual.titulo}</h2>
              <BarraProgreso etapa={ordenActual.estatus} />
            </section>

            <div className="grid gap-6 md:grid-cols-2">
              <section className="card">
                <h2 className="mb-4 text-lg font-semibold">Historial</h2>
                <Timeline avances={(avances as Avance[]) ?? []} />
              </section>

              <section className="card">
                <h2 className="mb-4 text-lg font-semibold">Cotización</h2>
                <CotizacionCliente
                  ordenId={ordenActual.id}
                  costo={ordenActual.costo_estimado}
                  estado={ordenActual.cotizacion_estado}
                />
              </section>
            </div>

            <section className="card">
              <h2 className="mb-4 text-lg font-semibold">Fotos</h2>
              <GaleriaAntesDespues fotos={(fotos as Foto[]) ?? []} />
            </section>

            {ordenActual.estatus === 'entregado' && (
              <section className="card">
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Tu opinión</h2>
                  <Link href={`/carro/${v.id}/recibo`} className="btn-ghost py-1">
                    🧾 Descargar recibo
                  </Link>
                </div>
                <FormResena ordenId={ordenActual.id} existente={(resena as Resena) ?? null} />
              </section>
            )}
          </>
        )}
      </main>
    </>
  );
}
