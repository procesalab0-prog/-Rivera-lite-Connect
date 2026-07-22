import Link from 'next/link';
import { cerrarSesion } from '@/app/actions';

// Barra de navegación inferior fija (tipo app nativa): pegada abajo, de lado
// a lado, con Inicio + Salir y respeto del safe-area del iPhone.
export default function ClienteTabBar({ activo }: { activo?: 'inicio' }) {
  const inicioActivo = activo === 'inicio';
  return (
    <nav
      className="fixed bottom-0 left-1/2 z-40 w-full max-w-md -translate-x-1/2 border-t border-[#23272e]"
      style={{
        background: 'rgba(11,12,14,.92)',
        backdropFilter: 'blur(16px)',
        paddingBottom: 'env(safe-area-inset-bottom)',
      }}
    >
      <div className="flex items-stretch justify-around px-4 pt-2">
        <Link
          href="/dashboard"
          className="flex flex-1 flex-col items-center gap-1 py-2"
          style={{ color: inicioActivo ? '#E4121E' : '#8b929c' }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 11l9-8 9 8" />
            <path d="M5.5 9.5V20h13V9.5" />
          </svg>
          <span className="font-cond text-[10px] font-bold uppercase tracking-[0.08em]">Inicio</span>
        </Link>

        <form action={cerrarSesion} className="flex flex-1">
          <button type="submit" className="flex w-full flex-col items-center gap-1 py-2 text-[#8b929c]">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
              <path d="M16 17l5-5-5-5" />
              <path d="M21 12H9" />
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            </svg>
            <span className="font-cond text-[10px] font-bold uppercase tracking-[0.08em]">Salir</span>
          </button>
        </form>
      </div>
    </nav>
  );
}
