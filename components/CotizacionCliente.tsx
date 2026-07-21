import { responderCotizacion } from '@/app/carro/[id]/actions';
import type { EstadoCotizacion } from '@/lib/types';

// Muestra la cotización y permite al cliente aprobar o rechazar.
export default function CotizacionCliente({
  ordenId,
  costo,
  estado,
}: {
  ordenId: string;
  costo: number | null;
  estado: EstadoCotizacion;
}) {
  if (costo == null) {
    return <p className="text-sm text-slate-500">Aún no hay cotización.</p>;
  }

  const money = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(costo);

  if (estado !== 'pendiente') {
    return (
      <div className="flex items-center justify-between">
        <span className="text-lg font-semibold">{money}</span>
        <span
          className={`badge ${
            estado === 'aprobada'
              ? 'bg-green-500/15 text-green-400'
              : 'bg-red-500/15 text-red-400'
          }`}
        >
          {estado === 'aprobada' ? 'Aprobada' : 'Rechazada'}
        </span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-lg font-semibold">{money}</p>
      <p className="text-sm text-slate-400">
        Revisa la cotización y confírmala para que el taller continúe.
      </p>
      <div className="flex gap-2">
        <form action={responderCotizacion}>
          <input type="hidden" name="orden_id" value={ordenId} />
          <input type="hidden" name="decision" value="aprobada" />
          <button className="btn bg-green-600 text-white hover:bg-green-500">
            Aprobar
          </button>
        </form>
        <form action={responderCotizacion}>
          <input type="hidden" name="orden_id" value={ordenId} />
          <input type="hidden" name="decision" value="rechazada" />
          <button className="btn-ghost">Rechazar</button>
        </form>
      </div>
    </div>
  );
}
