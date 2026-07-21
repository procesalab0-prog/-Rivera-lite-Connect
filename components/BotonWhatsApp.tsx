'use client';

import { linkWhatsApp, mensajeEstatus } from '@/lib/whatsapp';
import type { Etapa } from '@/lib/etapas';

// Botón que abre WhatsApp con un mensaje pre-escrito (nombre + estatus).
export default function BotonWhatsApp({
  telefono,
  nombre,
  marca,
  modelo,
  placa,
  etapa,
  fechaEntrega,
}: {
  telefono: string | null;
  nombre: string | null;
  marca: string;
  modelo: string;
  placa: string | null;
  etapa: Etapa;
  fechaEntrega: string | null;
}) {
  const mensaje = mensajeEstatus({
    nombre,
    marca,
    modelo,
    placa,
    etapa,
    fechaEntrega,
  });
  const href = linkWhatsApp(telefono, mensaje);

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="btn bg-green-600 text-white hover:bg-green-500"
    >
      💬 Enviar WhatsApp
    </a>
  );
}
