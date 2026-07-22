import Link from 'next/link';
import Tacometro from './Tacometro';
import type { Etapa } from '@/lib/etapas';

// Tarjeta resumen de un carro para el dashboard del cliente.
export default function TarjetaCarro({
  id,
  marca,
  modelo,
  anio,
  placa,
  fotoUrl,
  etapa,
  fechaEntrega,
}: {
  id: string;
  marca: string;
  modelo: string;
  anio: number | null;
  placa: string | null;
  fotoUrl: string | null;
  etapa: Etapa | null;
  fechaEntrega: string | null;
}) {
  return (
    <Link
      href={`/carro/${id}`}
      className="block rounded-[22px] border border-rivera-border p-4 shadow-[0_14px_30px_rgba(0,0,0,.4)] transition-all hover:-translate-y-0.5 hover:border-rivera-red/55"
      style={{ background: 'linear-gradient(180deg,#16181D,#121419)' }}
    >
      <div className="flex items-center gap-3.5">
        <div className="relative h-[66px] w-[88px] shrink-0 overflow-hidden rounded-[14px] border border-rivera-input-border bg-rivera-input">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt={`${marca} ${modelo}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-2xl">🚗</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-cond text-[19px] font-bold text-rivera-ink">
            {marca} {modelo} {anio ?? ''}
          </h3>
          {placa && <p className="mt-0.5 font-saira text-xs text-rivera-muted">Placa {placa}</p>}
          {fechaEntrega && (
            <p className="mt-0.5 font-saira text-xs text-rivera-dim">
              Entrega: {new Date(fechaEntrega).toLocaleDateString('es-MX')}
            </p>
          )}
        </div>
        <span className="font-saira text-2xl text-[#565c65]">›</span>
      </div>
      {etapa && (
        <div className="mt-4">
          <Tacometro etapa={etapa} compact />
        </div>
      )}
    </Link>
  );
}
