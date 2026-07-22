import BotonWhatsApp from './BotonWhatsApp';
import { mensajeEstatus, normalizarTelefono } from '@/lib/whatsapp';
import type { Etapa } from '@/lib/etapas';

// Bloque para notificar al cliente por WhatsApp, con vista previa del mensaje.
export default function WhatsAppAviso({
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
  const mensaje = mensajeEstatus({ nombre, marca, modelo, placa, etapa, fechaEntrega });
  const tel = normalizarTelefono(telefono);
  const telBonito = tel ? `+${tel}` : 'Sin teléfono';

  return (
    <section className="card rounded-[18px] p-[22px]">
      <div className="mb-1 flex items-center gap-2.5">
        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#25d366] text-sm text-white">✓</span>
        <h2 className="font-cond text-base font-bold uppercase tracking-[0.03em]">Notificar al cliente por WhatsApp</h2>
      </div>
      <p className="mb-4 font-sans text-[13px] text-rivera-muted">
        Un mensaje listo con el nombre del cliente y la etapa actual. Se abre WhatsApp con el
        texto ya escrito — solo das enviar.
      </p>

      {/* Vista previa tipo chat */}
      <div className="mb-4 rounded-2xl border border-rivera-border bg-rivera-input p-3">
        <div className="mb-2 flex items-center justify-between">
          <span className="font-saira text-xs text-rivera-dim">
            Para: {nombre ?? 'Cliente'} · {telBonito}
          </span>
          <span className="font-saira text-[10px] text-rivera-dim">Vista previa</span>
        </div>
        <div className="flex justify-end">
          <div
            className="relative max-w-[88%] rounded-2xl rounded-br-sm px-3.5 py-2.5 text-[13px] leading-snug text-white"
            style={{ background: '#075E54' }}
          >
            {mensaje}
            <span className="mt-1 block text-right text-[10px] text-white/70">12:30 ✓✓</span>
          </div>
        </div>
      </div>

      <BotonWhatsApp
        telefono={telefono}
        nombre={nombre}
        marca={marca}
        modelo={modelo}
        placa={placa}
        etapa={etapa}
        fechaEntrega={fechaEntrega}
      />
    </section>
  );
}
