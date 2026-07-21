import type { Etapa } from './etapas';

export type Rol = 'admin' | 'cliente';
export type EstadoCotizacion = 'pendiente' | 'aprobada' | 'rechazada';
export type TipoFoto = 'antes' | 'durante' | 'despues';

export interface Profile {
  id: string;
  rol: Rol;
  nombre: string | null;
  telefono: string | null;
  email: string | null;
  created_at: string;
}

export interface Vehiculo {
  id: string;
  cliente_id: string;
  marca: string;
  modelo: string;
  anio: number | null;
  placa: string | null;
  vin: string | null;
  color: string | null;
  foto_url: string | null;
  qr_slug: string;
  created_at: string;
}

export interface Orden {
  id: string;
  vehiculo_id: string;
  titulo: string;
  descripcion: string | null;
  estatus: Etapa;
  fecha_ingreso: string | null;
  fecha_entrega_estimada: string | null;
  fecha_entrega_real: string | null;
  mecanico: string | null;
  costo_estimado: number | null;
  cotizacion_estado: EstadoCotizacion;
  created_at: string;
}

export interface Avance {
  id: string;
  orden_id: string;
  etapa: Etapa;
  nota: string | null;
  created_at: string;
}

export interface Foto {
  id: string;
  orden_id: string;
  url: string;
  tipo: TipoFoto;
  descripcion: string | null;
  created_at: string;
}

export interface Notificacion {
  id: string;
  cliente_id: string;
  orden_id: string | null;
  mensaje: string;
  leida: boolean;
  created_at: string;
}

export interface Resena {
  id: string;
  orden_id: string;
  cliente_id: string;
  calificacion: number;
  comentario: string | null;
  created_at: string;
}
