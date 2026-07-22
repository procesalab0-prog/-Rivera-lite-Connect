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
    return <p className="font-sans text-sm text-rivera-dim">Aún no hay cotización.</p>;
  }

  const money = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(costo);

  const Total = () => (
    <div className="mb-4 rounded-2xl border border-rivera-border bg-rivera-input p-[18px] text-center">
      <div className="font-cond text-xs uppercase tracking-[0.12em] text-rivera-dim">
        Total estimado
      </div>
      <div className="mt-0.5 font-saira text-[34px] font-bold tabular-nums text-rivera-ink">
        {money}
      </div>
    </div>
  );

  if (estado !== 'pendiente') {
    return (
      <div>
        <Total />
        <div className="flex justify-center">
          <span className={estado === 'aprobada' ? 'badge bg-green-500/15 text-green-400' : 'badge-muted'}>
            {estado === 'aprobada' ? '✓ Aprobada' : 'Rechazada'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Total />
      <div className="flex gap-2.5">
        <form action={responderCotizacion} className="flex-1">
          <input type="hidden" name="orden_id" value={ordenId} />
          <input type="hidden" name="decision" value="aprobada" />
          <button className="btn-success w-full">Aprobar</button>
        </form>
        <form action={responderCotizacion} className="flex-1">
          <input type="hidden" name="orden_id" value={ordenId} />
          <input type="hidden" name="decision" value="rechazada" />
          <button className="btn-ghost w-full">Rechazar</button>
        </form>
      </div>
    </div>
  );
}
