// Definición central de las etapas del taller (orden importa para la barra).

export type Etapa =
  | 'recibido'
  | 'diagnostico'
  | 'en_reparacion'
  | 'pintura'
  | 'control_calidad'
  | 'listo'
  | 'entregado';

export const ETAPAS: { key: Etapa; label: string; emoji: string }[] = [
  { key: 'recibido', label: 'Recibido', emoji: '🅿️' },
  { key: 'diagnostico', label: 'Diagnóstico', emoji: '🔎' },
  { key: 'en_reparacion', label: 'En reparación', emoji: '🔧' },
  { key: 'pintura', label: 'Pintura', emoji: '🎨' },
  { key: 'control_calidad', label: 'Control de calidad', emoji: '✅' },
  { key: 'listo', label: 'Listo', emoji: '🚗' },
  { key: 'entregado', label: 'Entregado', emoji: '🏁' },
];

export function indiceEtapa(etapa: Etapa): number {
  return ETAPAS.findIndex((e) => e.key === etapa);
}

export function porcentajeEtapa(etapa: Etapa): number {
  const i = indiceEtapa(etapa);
  if (i < 0) return 0;
  return Math.round((i / (ETAPAS.length - 1)) * 100);
}

export function labelEtapa(etapa: Etapa): string {
  return ETAPAS.find((e) => e.key === etapa)?.label ?? etapa;
}
