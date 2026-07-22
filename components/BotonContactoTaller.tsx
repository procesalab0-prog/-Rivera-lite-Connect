'use client';

import { linkWhatsApp, TALLER_TELEFONO } from '@/lib/whatsapp';

// Botón del lado del cliente para escribirle al taller por WhatsApp.
export default function BotonContactoTaller({
  marca,
  modelo,
  placa,
}: {
  marca: string;
  modelo: string;
  placa: string | null;
}) {
  const mensaje = `Hola, quiero información sobre mi ${marca} ${modelo}${placa ? ` (${placa})` : ''}. — enviado desde Rivera Connect`;
  const href = linkWhatsApp(TALLER_TELEFONO, mensaje);

  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className="btn-whatsapp w-full">
      <span className="text-[15px]">✦</span> Escribir al taller por WhatsApp
    </a>
  );
}
