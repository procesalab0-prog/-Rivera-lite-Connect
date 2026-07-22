'use client';

import { useRef, useState } from 'react';
import { APP_AUTHOR, APP_NAME, APP_VERSION } from '@/lib/version';

// Envuelve un elemento: al darle 6 toques rápidos revela el crédito de ProcesaLab.
export default function EasterEgg({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const count = useRef(0);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function tap() {
    count.current += 1;
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      count.current = 0;
    }, 1200);
    if (count.current >= 6) {
      count.current = 0;
      if (timer.current) clearTimeout(timer.current);
      setOpen(true);
    }
  }

  return (
    <>
      <span
        onClick={tap}
        className={className}
        style={{ cursor: 'pointer', WebkitTapHighlightColor: 'transparent', userSelect: 'none' }}
      >
        {children}
      </span>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-6"
          style={{ background: 'rgba(5,6,8,.72)', backdropFilter: 'blur(6px)' }}
          onClick={() => setOpen(false)}
        >
          <div
            className="w-full max-w-xs rounded-[22px] border border-rivera-border p-6 text-center shadow-[0_30px_70px_rgba(0,0,0,.6)] animate-riseIn"
            style={{ background: 'linear-gradient(180deg,#16181D,#0e1013)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl" style={{ background: 'linear-gradient(180deg,#ef1e28,#b30d14)' }}>
              <span className="font-cond text-3xl font-extrabold italic text-white">P</span>
            </div>
            <p className="font-cond text-xs font-bold uppercase tracking-[0.2em] text-rivera-dim">Creado por</p>
            <h3 className="mt-1 font-cond text-2xl font-extrabold text-rivera-ink">{APP_AUTHOR}</h3>
            <div className="mx-auto my-4 h-px w-16 bg-rivera-border" />
            <p className="font-saira text-sm text-rivera-muted">{APP_NAME}</p>
            <p className="font-saira text-sm font-bold text-rivera-red">v{APP_VERSION}</p>
            <button onClick={() => setOpen(false)} className="btn-ghost mt-5 w-full py-2 text-xs">
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
