import type { Metadata } from 'next';

// Metadata específica del panel admin: nombre e ícono de app propios
// (para que "Agregar a Inicio" en /admin guarde el ícono de administración).
export const metadata: Metadata = {
  applicationName: 'Rivera Élite Admin',
  title: 'Rivera Élite · Admin',
  manifest: '/manifest-admin.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Rivera Admin',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/icons/admin-180.png',
  },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
