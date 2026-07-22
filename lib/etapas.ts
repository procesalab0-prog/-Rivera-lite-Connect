// Definición central de las etapas del taller (orden importa para el progreso).

export type Etapa =
  | 'recibido'
  | 'diagnostico'
  | 'pedido_piezas'
  | 'en_reparacion'
  | 'control_calidad'
  | 'listo'
  | 'entregado';

export const ETAPAS: { key: Etapa; label: string }[] = [
  { key: 'recibido', label: 'Recibido' },
  { key: 'diagnostico', label: 'Diagnóstico' },
  { key: 'pedido_piezas', label: 'Pedido de piezas' },
  { key: 'en_reparacion', label: 'En reparación' },
  { key: 'control_calidad', label: 'Control de calidad' },
  { key: 'listo', label: 'Listo' },
  { key: 'entregado', label: 'Entregado' },
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
