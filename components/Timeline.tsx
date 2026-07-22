import { labelEtapa } from '@/lib/etapas';
import type { Avance } from '@/lib/types';

// Línea de tiempo / historial de avances (más reciente primero).
export default function Timeline({ avances }: { avances: Avance[] }) {
  if (avances.length === 0) {
    return <p className="font-sans text-sm text-rivera-dim">Aún no hay avances registrados.</p>;
  }

  return (
    <ol className="m-0 list-none border-l border-rivera-input-border p-0 pl-[18px]">
      {avances.map((a, idx) => {
        const actual = idx === 0;
        return (
          <li key={a.id} className="relative mb-5 last:mb-0">
            <span
              className="absolute left-[-25px] top-[3px] h-[11px] w-[11px] rounded-full"
              style={{
                background: actual ? '#E4121E' : '#9aa3ad',
                boxShadow: actual ? '0 0 10px rgba(228,18,30,.9)' : 'none',
              }}
            />
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="font-cond text-[15px] font-bold text-rivera-ink">
                {labelEtapa(a.etapa)}
              </span>
              <time className="font-saira text-[11px] text-rivera-dim">
                {new Date(a.created_at).toLocaleString('es-MX', {
                  dateStyle: 'medium',
                  timeStyle: 'short',
                })}
              </time>
            </div>
            {a.nota && (
              <p className="mt-1 font-sans text-[13px] leading-[1.5] text-rivera-muted">{a.nota}</p>
            )}
          </li>
        );
      })}
    </ol>
  );
}
