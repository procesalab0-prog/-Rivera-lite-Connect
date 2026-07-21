import { ETAPAS, indiceEtapa, porcentajeEtapa, type Etapa } from '@/lib/etapas';

// Barra de progreso reutilizable con las 7 etapas del taller.
export default function BarraProgreso({
  etapa,
  compacta = false,
}: {
  etapa: Etapa;
  compacta?: boolean;
}) {
  const pct = porcentajeEtapa(etapa);
  const actual = indiceEtapa(etapa);

  if (compacta) {
    return (
      <div>
        <div className="mb-1 flex justify-between text-xs text-slate-400">
          <span>{ETAPAS[actual]?.label ?? etapa}</span>
          <span>{pct}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
          <div
            className="h-full rounded-full bg-rivera-gold transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-2 flex items-center justify-between">
        <span className="text-sm font-medium text-slate-200">
          Progreso: {pct}%
        </span>
      </div>
      <div className="mb-4 h-3 w-full overflow-hidden rounded-full bg-slate-800">
        <div
          className="h-full rounded-full bg-rivera-gold transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ol className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-7">
        {ETAPAS.map((e, i) => {
          const done = i <= actual;
          return (
            <li
              key={e.key}
              className={`flex flex-col items-center rounded-lg border p-2 text-center text-xs ${
                done
                  ? 'border-rivera-gold/50 bg-rivera-gold/10 text-rivera-gold'
                  : 'border-slate-800 text-slate-500'
              }`}
            >
              <span className="text-lg">{e.emoji}</span>
              <span className="mt-1">{e.label}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
