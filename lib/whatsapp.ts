import { labelEtapa, type Etapa } from './etapas';

// Número de WhatsApp del taller Rivera Élite Garage (para que el cliente contacte).
export const TALLER_TELEFONO = '4791015418';

// Normaliza un teléfono a solo dígitos (wa.me no acepta símbolos).
// Si no trae lada de país, se antepone 52 (México).
export function normalizarTelefono(telefono: string | null | undefined): string {
  if (!telefono) return '';
  const digitos = telefono.replace(/\D/g, '');
  if (digitos.length === 10) return `52${digitos}`;
  return digitos;
}

// Arma el mensaje pre-escrito con nombre + estatus.
export function mensajeEstatus(params: {
  nombre?: string | null;
  marca: string;
  modelo: string;
  placa?: string | null;
  etapa: Etapa;
  fechaEntrega?: string | null;
}): string {
  const { nombre, marca, modelo, placa, etapa, fechaEntrega } = params;
  const saludo = nombre ? `Hola ${nombre}` : 'Hola';
  const carro = `tu ${marca} ${modelo}${placa ? ` (${placa})` : ''}`;
  let msg = `${saludo}, ${carro} pasó a la etapa: ${labelEtapa(etapa)}.`;
  if (fechaEntrega) {
    msg += ` Fecha estimada de entrega: ${fechaEntrega}.`;
  }
  msg += ' — Rivera Élite Garage 🏁';
  return msg;
}

// Genera el link de WhatsApp click-to-send.
export function linkWhatsApp(telefono: string | null | undefined, mensaje: string): string {
  const tel = normalizarTelefono(telefono);
  const texto = encodeURIComponent(mensaje);
  return tel
    ? `https://wa.me/${tel}?text=${texto}`
    : `https://wa.me/?text=${texto}`;
}
