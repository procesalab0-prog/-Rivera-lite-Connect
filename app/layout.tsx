import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Rivera Élite Connect',
  description:
    'Portal de clientes de Rivera Élite Garage: historial, progreso y fotos de tu carro.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
