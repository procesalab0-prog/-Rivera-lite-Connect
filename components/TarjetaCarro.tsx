import Link from 'next/link';
import BarraProgreso from './BarraProgreso';
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
    <Link href={`/carro/${id}`} className="card block transition-colors hover:border-rivera-gold/50">
      <div className="flex gap-4">
        <div className="h-20 w-28 shrink-0 overflow-hidden rounded-lg bg-slate-800">
          {fotoUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={fotoUrl} alt={`${marca} ${modelo}`} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-3xl">🚗</div>
          )}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-semibold text-slate-100">
            {marca} {modelo} {anio ?? ''}
          </h3>
          {placa && <p className="text-xs text-slate-400">Placa: {placa}</p>}
          {fechaEntrega && (
            <p className="text-xs text-slate-400">
              Entrega estimada: {new Date(fechaEntrega).toLocaleDateString('es-MX')}
            </p>
          )}
        </div>
      </div>
      {etapa && (
        <div className="mt-4">
          <BarraProgreso etapa={etapa} compacta />
        </div>
      )}
    </Link>
  );
}
