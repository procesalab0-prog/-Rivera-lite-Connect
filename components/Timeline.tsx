import { labelEtapa } from '@/lib/etapas';
import type { Avance } from '@/lib/types';

// Línea de tiempo / historial de avances de una orden.
export default function Timeline({ avances }: { avances: Avance[] }) {
  if (avances.length === 0) {
    return (
      <p className="text-sm text-slate-500">Aún no hay avances registrados.</p>
    );
  }

  return (
    <ol className="relative border-l border-slate-700 pl-5">
      {avances.map((a) => (
        <li key={a.id} className="mb-6 last:mb-0">
          <span className="absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full bg-rivera-gold" />
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-medium text-slate-100">
              {labelEtapa(a.etapa)}
            </span>
            <time className="text-xs text-slate-500">
              {new Date(a.created_at).toLocaleString('es-MX', {
                dateStyle: 'medium',
                timeStyle: 'short',
              })}
            </time>
          </div>
          {a.nota && <p className="mt-1 text-sm text-slate-400">{a.nota}</p>}
        </li>
      ))}
    </ol>
  );
}
