import { createClient } from '@/lib/supabase/server';
import { supabaseConfigurado } from '@/lib/supabase/config';
import Tacometro from '@/components/Tacometro';
import Marca from '@/components/Marca';
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
  let info: EstatusQr | null = null;
  if (supabaseConfigurado()) {
    const supabase = createClient();
    const { data } = await supabase.rpc('estatus_por_qr', { slug: params.slug });
    info = (data?.[0] as EstatusQr) ?? null;
  } else {
    // Modo demo: mostrar el estatus de un vehículo de ejemplo
    const { demoVehiculoPorSlug, demoOrdenesDeVehiculo } = await import('@/lib/demo');
    const v = demoVehiculoPorSlug(params.slug) ?? demoVehiculoPorSlug('demo-gtr');
    const o = v ? demoOrdenesDeVehiculo(v.id)[0] : null;
    if (v) {
      info = {
        marca: v.marca,
        modelo: v.modelo,
        anio: v.anio,
        color: v.color,
        foto_url: v.foto_url,
        titulo: o?.titulo ?? null,
        estatus: o?.estatus ?? null,
        fecha_entrega_estimada: o?.fecha_entrega_estimada ?? null,
      };
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-md animate-riseIn pb-9">
      <div className="hero-crimson rounded-b-[30px] px-[22px] pb-[22px] pt-16 text-center">
        <span className="mb-2 inline-block font-cond text-[11px] font-bold uppercase tracking-[0.24em] text-[#ff8b91]">
          Estatus en vivo
        </span>
        <div className="flex justify-center">
          <Marca size="26px" sub />
        </div>
      </div>

      {!info ? (
        <div className="px-[18px] pt-4">
          <div className="card text-center text-rivera-muted">
            No encontramos información para este código.
          </div>
        </div>
      ) : (
        <div className="px-[18px] pt-4">
          <div className="relative mb-3.5 aspect-[16/9] overflow-hidden rounded-2xl border border-rivera-input-border">
            {info.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={info.foto_url} alt="Vehículo" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-rivera-input text-5xl">🚗</div>
            )}
          </div>
          <div className="mb-1 text-center">
            <h2 className="m-0 font-cond text-[23px] font-extrabold">{info.marca} {info.modelo} {info.anio ?? ''}</h2>
            <p className="mt-0.5 font-saira text-[13px] text-rivera-muted">
              {[info.color, info.titulo].filter(Boolean).join(' · ')}
            </p>
          </div>

          {info.estatus ? (
            <div className="mx-auto mt-2.5 w-[min(300px,86%)]">
              <Tacometro etapa={info.estatus} size="300px" />
            </div>
          ) : (
            <p className="text-center text-sm text-rivera-dim">Sin orden activa.</p>
          )}

          {info.fecha_entrega_estimada && (
            <div className="mt-2 border-t border-[#20242b] pt-4 text-center">
              <span className="font-cond text-xs uppercase tracking-[0.1em] text-rivera-dim">Entrega estimada</span>
              <div className="font-saira text-lg font-bold text-rivera-red">
                {new Date(info.fecha_entrega_estimada).toLocaleDateString('es-MX', { day: '2-digit', month: 'short', year: 'numeric' })}
              </div>
            </div>
          )}

          <p className="mt-4 text-center font-saira text-[11px] tracking-[0.06em] text-[#4a4f57]">
            Vista pública de solo lectura · Rivera Élite Garage
          </p>
        </div>
      )}
    </main>
  );
}
