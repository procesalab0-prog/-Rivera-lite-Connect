import Link from 'next/link';
import { notFound, redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { demoVehiculo, demoOrdenesDeVehiculo, demoAvances, demoFotos } from '@/lib/demo';
import DemoBanner from '@/components/DemoBanner';
import Tacometro from '@/components/Tacometro';
import Timeline from '@/components/Timeline';
import GaleriaAntesDespues from '@/components/GaleriaAntesDespues';
import CotizacionCliente from '@/components/CotizacionCliente';
import FormResena from '@/components/FormResena';
import RealtimeRefresh from '@/components/RealtimeRefresh';
import ClienteTabBar from '@/components/ClienteTabBar';
import type { Avance, Foto, Orden, Resena, Vehiculo } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function CarroPage({ params }: { params: { id: string } }) {
  const demo = !supabaseConfigurado();

  let v: Vehiculo;
  let o: Orden | null;
  let avances: Avance[] = [];
  let fotos: Foto[] = [];
  let resena: Resena | null = null;

  if (demo) {
    const dv = demoVehiculo(params.id) ?? demoVehiculo('demo-gtr')!;
    v = dv;
    o = demoOrdenesDeVehiculo(v.id)[0] ?? null;
    avances = o ? demoAvances(o.id) : [];
    fotos = o ? demoFotos(o.id) : [];
  } else {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) redirect('/login');

    const { data: vehiculo } = await supabase.from('vehiculos').select('*').eq('id', params.id).single();
    if (!vehiculo) notFound();
    v = vehiculo as Vehiculo;

    const { data: ordenes } = await supabase
      .from('ordenes')
      .select('*')
      .eq('vehiculo_id', v.id)
      .order('created_at', { ascending: false });
    o = (ordenes?.[0] as Orden) ?? null;

    avances = o
      ? ((await supabase.from('avances').select('*').eq('orden_id', o.id).order('created_at', { ascending: false })).data as Avance[]) ?? []
      : [];
    fotos = o
      ? ((await supabase.from('fotos').select('*').eq('orden_id', o.id).order('created_at', { ascending: true })).data as Foto[]) ?? []
      : [];
    resena = o
      ? ((await supabase.from('resenas').select('*').eq('orden_id', o.id).eq('cliente_id', user.id).maybeSingle()).data as Resena | null)
      : null;
  }

  const meta: { k: string; v: string; red?: boolean }[] = [];
  if (v.placa) meta.push({ k: 'Placa', v: v.placa });
  if (v.color) meta.push({ k: 'Color', v: v.color });
  if (o?.mecanico) meta.push({ k: 'Mecánico', v: o.mecanico });
  if (o?.fecha_entrega_estimada)
    meta.push({
      k: 'Entrega estimada',
      v: new Date(o.fecha_entrega_estimada).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' }),
      red: true,
    });

  return (
    <main className="mx-auto min-h-screen max-w-md animate-riseIn pb-32">
      {demo ? <DemoBanner /> : <RealtimeRefresh />}

      {/* Header crimson + hero */}
      <div className="hero-crimson rounded-b-[30px] px-5 pb-5 pt-14">
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/16 bg-white/[.08] text-white"
            aria-label="Volver"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
          </Link>
          <div>
            <span className="font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-[#ff8b91]">Orden de servicio</span>
            <h1 className="font-cond text-2xl font-extrabold leading-none">{v.marca} {v.modelo} {v.anio ?? ''}</h1>
          </div>
        </div>
        <div className="relative mt-4 aspect-[16/10] overflow-hidden rounded-[18px] border border-white/12 shadow-[0_16px_34px_rgba(0,0,0,.45)]">
          {v.foto_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={v.foto_url} alt={`${v.marca} ${v.modelo}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-rivera-input text-5xl">🚗</div>
          )}
        </div>
      </div>

      <div className="px-[18px] pt-4">
        {/* Meta */}
        {meta.length > 0 && (
          <div className="mb-3.5 rounded-[18px] border border-rivera-border px-4 py-1" style={{ background: 'linear-gradient(180deg,#16181D,#121419)' }}>
            {meta.map((m, idx) => (
              <div
                key={m.k}
                className={`flex justify-between py-[11px] ${idx < meta.length - 1 ? 'border-b border-[#20242b]' : ''}`}
              >
                <span className="font-cond text-xs uppercase tracking-[0.09em] text-rivera-dim">{m.k}</span>
                <span className={`font-saira text-sm font-${m.red ? 'bold' : 'semibold'}`} style={m.red ? { color: '#E4121E' } : undefined}>{m.v}</span>
              </div>
            ))}
          </div>
        )}

        {!o ? (
          <div className="card text-rivera-muted">Este carro aún no tiene una orden de servicio activa.</div>
        ) : (
          <>
            {/* Progreso */}
            <section
              className="relative mb-3.5 overflow-hidden rounded-[22px] border border-rivera-border px-4 py-5 shadow-[0_18px_44px_rgba(0,0,0,.5)]"
              style={{ background: 'radial-gradient(90% 120% at 50% 0,#191c22,#0e1013)' }}
            >
              <div className="pointer-events-none absolute inset-0" style={{ background: 'radial-gradient(60% 50% at 50% 42%,rgba(228,18,30,.10),transparent 70%)' }} />
              <div className="relative flex flex-col items-center text-center">
                <span className="font-cond text-[11px] font-bold uppercase tracking-[0.16em] text-[#8b929c]">Progreso del servicio</span>
                <h2 className="mb-4 mt-1 font-cond text-xl font-extrabold">{o.titulo}</h2>
                <div className="w-[min(320px,92%)]">
                  <Tacometro etapa={o.estatus} size="320px" />
                </div>
              </div>
            </section>

            {/* Historial */}
            <section className="card mb-3.5 rounded-[20px]">
              <h2 className="section-title" style={{ marginBottom: '18px' }}>Historial</h2>
              <Timeline avances={(avances as Avance[]) ?? []} />
            </section>

            {/* Cotización */}
            <section className="card mb-3.5 rounded-[20px]">
              <h2 className="section-title mb-4">Cotización</h2>
              <CotizacionCliente ordenId={o.id} costo={o.costo_estimado} estado={o.cotizacion_estado} />
            </section>

            {/* Fotos */}
            <section className="card mb-3.5 rounded-[20px]">
              <h2 className="section-title mb-4">Fotos · Antes / Después</h2>
              <GaleriaAntesDespues fotos={(fotos as Foto[]) ?? []} />
            </section>

            {/* Opinión (solo entregado) */}
            {o.estatus === 'entregado' && (
              <section className="card rounded-[20px]">
                <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5">
                  <h2 className="section-title">Tu opinión</h2>
                  <Link href={`/carro/${v.id}/recibo`} className="btn-ghost px-3 py-2 text-xs">Ver recibo</Link>
                </div>
                <FormResena ordenId={o.id} existente={(resena as Resena) ?? null} />
              </section>
            )}
          </>
        )}
      </div>

      <ClienteTabBar />
    </main>
  );
}
