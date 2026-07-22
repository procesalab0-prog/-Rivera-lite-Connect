import Link from 'next/link';
import { cerrarSesion } from '@/app/actions';
import Marca from './Marca';

// Header del panel de administración (web).
export default function NavBar({ nombre }: { rol?: 'admin' | 'cliente'; nombre: string | null }) {
  return (
    <header
      className="relative z-10 border-b border-[#1c1f25]"
      style={{ background: 'linear-gradient(180deg,#111318,#0d0f12)' }}
    >
      <div className="mx-auto flex max-w-[1100px] flex-wrap items-center justify-between gap-3.5 px-[18px] py-3">
        <Link href="/admin">
          <Marca size="22px" />
        </Link>
        <nav className="flex flex-wrap items-center gap-1">
          {[
            { href: '/admin', label: 'Resumen' },
            { href: '/admin/clientes', label: 'Clientes' },
            { href: '/admin/vehiculos', label: 'Vehículos' },
          ].map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="px-2.5 py-2 font-cond text-[13.5px] font-semibold uppercase tracking-[0.05em] text-[#c7cdd6] transition-colors hover:text-rivera-red"
            >
              {l.label}
            </Link>
          ))}
          {nombre && <span className="mx-1 font-sans text-[13px] text-[#565c65]">{nombre}</span>}
          <form action={cerrarSesion}>
            <button type="submit" className="btn-ghost px-3.5 py-1.5 text-xs">
              Salir
            </button>
          </form>
        </nav>
      </div>
    </header>
  );
}
