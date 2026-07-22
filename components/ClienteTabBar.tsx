import Link from 'next/link';
import { cerrarSesion } from '@/app/actions';

// Barra flotante de navegación del cliente (Inicio + Salir).
export default function ClienteTabBar({ activo }: { activo?: 'inicio' }) {
  const base =
    'flex h-12 w-12 items-center justify-center rounded-full border-none transition-colors';
  return (
    <nav
      className="fixed left-1/2 z-40 flex -translate-x-1/2 items-center gap-1 rounded-full border border-[#23272e] p-[7px] px-2.5 shadow-[0_14px_34px_rgba(0,0,0,.55)]"
      style={{
        background: 'rgba(18,20,25,.82)',
        backdropFilter: 'blur(16px)',
        bottom: 'calc(18px + env(safe-area-inset-bottom))',
      }}
    >
      <Link
        href="/dashboard"
        aria-label="Inicio"
        className={base}
        style={activo === 'inicio' ? { background: '#F2F4F7' } : undefined}
      >
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={activo === 'inicio' ? '#0B0C0E' : '#8b929c'} strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 11l9-8 9 8" />
          <path d="M5.5 9.5V20h13V9.5" />
        </svg>
      </Link>
      <form action={cerrarSesion}>
        <button type="submit" aria-label="Salir" className={base} style={{ background: 'transparent' }}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#8b929c" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 17l5-5-5-5" />
            <path d="M21 12H9" />
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
          </svg>
        </button>
      </form>
    </nav>
  );
}
