import Link from 'next/link';
import { cerrarSesion } from '@/app/actions';

// Barra superior con navegación y cerrar sesión.
export default function NavBar({
  rol,
  nombre,
}: {
  rol: 'admin' | 'cliente';
  nombre: string | null;
}) {
  return (
    <header className="border-b border-slate-800 bg-slate-900/60">
      <div className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <Link href={rol === 'admin' ? '/admin' : '/dashboard'} className="font-bold text-rivera-gold">
          Rivera Élite Connect
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          {rol === 'admin' ? (
            <>
              <Link href="/admin" className="text-slate-300 hover:text-rivera-gold">Resumen</Link>
              <Link href="/admin/clientes" className="text-slate-300 hover:text-rivera-gold">Clientes</Link>
              <Link href="/admin/vehiculos" className="text-slate-300 hover:text-rivera-gold">Vehículos</Link>
            </>
          ) : (
            <Link href="/dashboard" className="text-slate-300 hover:text-rivera-gold">Mis carros</Link>
          )}
          <span className="hidden text-slate-500 sm:inline">{nombre}</span>
          <form action={cerrarSesion}>
            <button type="submit" className="btn-ghost py-1">Salir</button>
          </form>
        </nav>
      </div>
    </header>
  );
}
