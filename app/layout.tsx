import type { Metadata, Viewport } from 'next';
import { Archivo, Saira_Condensed, Saira, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const archivo = Archivo({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-archivo',
  display: 'swap',
});
const sairaCond = Saira_Condensed({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-saira-cond',
  display: 'swap',
});
const saira = Saira({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-saira',
  display: 'swap',
});
const jetbrains = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: '--font-jetbrains',
  display: 'swap',
});

export const metadata: Metadata = {
  applicationName: 'Rivera Connect',
  title: 'Rivera Connect',
  description:
    'Portal de clientes de Rivera Élite Garage: historial, progreso y fotos de tu carro.',
  manifest: '/manifest-cliente.webmanifest',
  appleWebApp: {
    capable: true,
    title: 'Rivera Connect',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    apple: '/icons/cliente-180.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0B0C0E',
  viewportFit: 'cover',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="es"
      className={`${archivo.variable} ${sairaCond.variable} ${saira.variable} ${jetbrains.variable}`}
    >
      <body>
        {/* Ambiente: degradado radial fijo */}
        <div
          aria-hidden
          className="pointer-events-none fixed inset-0 z-0"
          style={{
            background:
              'radial-gradient(120% 80% at 50% -10%,rgba(228,18,30,.10),transparent 55%),radial-gradient(90% 60% at 100% 110%,rgba(120,130,145,.07),transparent 60%)',
          }}
        />
        <div className="relative z-[1]">{children}</div>
      </body>
    </html>
  );
}
