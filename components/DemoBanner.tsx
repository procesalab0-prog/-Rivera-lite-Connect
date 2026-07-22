// Cinta que indica que la app está en modo demostración (datos de ejemplo).
export default function DemoBanner() {
  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-2 border-b border-rivera-red/30 bg-rivera-red/15 px-3 py-1.5 text-center backdrop-blur">
      <span className="h-2 w-2 shrink-0 animate-pulse rounded-full bg-rivera-red" />
      <span className="font-cond text-[11px] font-bold uppercase tracking-[0.14em] text-rivera-ink">
        Modo demostración · datos de ejemplo
      </span>
    </div>
  );
}
