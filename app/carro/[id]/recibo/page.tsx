import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';
import { demoVehiculo, demoOrdenesDeVehiculo } from '@/lib/demo';
import BotonImprimir from '@/components/BotonImprimir';
import { labelEtapa } from '@/lib/etapas';
import type { Orden, Vehiculo } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function ReciboPage({ params }: { params: { id: string } }) {
  let v: Vehiculo;
  let o: Orden | null;

  if (!supabaseConfigurado()) {
    v = demoVehiculo(params.id) ?? demoVehiculo('demo-gtr')!;
    o = demoOrdenesDeVehiculo(v.id)[0] ?? null;
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
  }

  const money = (n: number | null) =>
    n == null ? '—' : new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(n);

  const folio = `RG-${(o?.id ?? v.id).replace(/\D/g, '').slice(0, 8).padStart(8, '0')}`;
  const fecha = new Date(o?.fecha_entrega_real ?? o?.created_at ?? Date.now()).toLocaleString('es-MX', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

  const meta = [
    { k: 'Folio', v: folio },
    { k: 'Fecha', v: fecha },
    { k: 'Vehículo', v: `${v.marca} ${v.modelo} ${v.anio ?? ''}`.trim() },
    ...(v.placa ? [{ k: 'Placa', v: v.placa }] : []),
    ...(o?.mecanico ? [{ k: 'Mecánico', v: o.mecanico }] : []),
    { k: 'Estatus', v: o ? labelEtapa(o.estatus) : '—' },
  ];

  // Barras del código de barras (deterministas)
  let seed = 91;
  const rand = () => ((seed = (seed * 1103515245 + 12345) & 0x7fffffff) / 0x7fffffff);
  const barras = Array.from({ length: 44 }, () => 1 + Math.round(rand() * 2));

  return (
    <main className="mx-auto min-h-screen max-w-md px-[18px] py-14 animate-riseIn">
      <div className="mb-4.5 flex items-center gap-3" style={{ marginBottom: '18px' }}>
        <Link
          href={`/carro/${v.id}`}
          className="flex h-10 w-10 items-center justify-center rounded-full border border-rivera-border bg-white/[.06] text-white print:hidden"
          aria-label="Volver"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
        </Link>
        <h1 className="m-0 font-cond text-xl font-bold uppercase tracking-[0.04em] print:hidden">Recibo</h1>
      </div>

      <div className="relative mx-auto max-w-[330px] drop-shadow-[0_24px_40px_rgba(0,0,0,.55)]">
        <div style={{ height: 12, background: 'radial-gradient(circle at 7px 0,#0B0C0E 6px,transparent 6.5px)', backgroundSize: '14px 12px', backgroundRepeat: 'repeat-x' }} />
        <div className="bg-[#EDE8DE] px-[22px] pb-[18px] pt-[22px] font-mono text-[#1C1F24]">
          <div className="mb-1.5 text-center">
            <span className="font-cond text-[26px] font-extrabold italic leading-none text-[#C0111B]">Rivera</span>{' '}
            <span className="font-cond text-[15px] font-bold tracking-[0.12em] text-[#1C1F24]">ÉLITE GARAGE</span>
          </div>
          <p className="m-0 mb-0.5 text-center text-[10.5px] tracking-[0.04em] text-[#5a544a]">Mecánica Automotriz · EST. 2023</p>
          <p className="m-0 text-center text-[10.5px] tracking-[0.04em] text-[#5a544a]">Av. Reforma 128 · Tel. 55 1234 5678</p>

          <div className="my-3.5 border-t border-dashed border-[#b3ab9b]" />
          {meta.map((m) => (
            <div key={m.k} className="mb-[5px] flex justify-between text-[11.5px]">
              <span className="text-[#5a544a]">{m.k}</span>
              <span className="font-bold">{m.v}</span>
            </div>
          ))}

          <div className="my-3.5 border-t border-dashed border-[#b3ab9b]" />
          <div className="mb-2 flex justify-between text-[10px] tracking-[0.08em] text-[#5a544a]">
            <span>CONCEPTO</span>
            <span>IMPORTE</span>
          </div>
          <div className="mb-1.5 flex justify-between gap-2.5 text-[11.5px]">
            <span className="flex-1">{o?.titulo ?? 'Servicio'}</span>
            <span className="font-bold tabular-nums">{money(o?.costo_estimado ?? null)}</span>
          </div>

          <div className="my-3 border-t border-dashed border-[#b3ab9b]" />
          <div className="flex items-baseline justify-between">
            <span className="font-cond text-base font-extrabold tracking-[0.06em]">TOTAL</span>
            <span className="font-saira text-2xl font-bold tabular-nums text-[#C0111B]">{money(o?.costo_estimado ?? null)}</span>
          </div>
          <p className="m-0 mt-0.5 text-right text-[10px] text-[#5a544a]">MXN · IVA incluido</p>

          <div className="my-3.5 border-t border-dashed border-[#b3ab9b]" />
          <p className="m-0 mb-3 text-center font-cond text-[13px] font-bold tracking-[0.1em]">¡GRACIAS POR SU CONFIANZA!</p>
          <div className="flex h-[46px] items-end justify-center gap-[2px]">
            {barras.map((w, i) => (
              <span key={i} className="h-full bg-[#1C1F24]" style={{ width: w }} />
            ))}
          </div>
          <p className="m-0 mt-1.5 text-center text-[10px] tracking-[0.14em] text-[#1C1F24]">{folio}</p>
        </div>
        <div style={{ height: 12, background: 'radial-gradient(circle at 7px 12px,#0B0C0E 6px,transparent 6.5px)', backgroundSize: '14px 12px', backgroundRepeat: 'repeat-x' }} />
      </div>

      <div className="mx-auto mt-5 max-w-[330px] print:hidden">
        <BotonImprimir />
      </div>
    </main>
  );
}
