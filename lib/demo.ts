// =====================================================================
// Datos de ejemplo para el MODO DEMO (cuando Supabase no está configurado).
// Permite navegar la app sin login para enseñarla a un cliente.
// =====================================================================
import type { Avance, Foto, Orden, Profile, Resena, Vehiculo } from './types';

// Genera una "foto" de muestra auto-contenida (SVG data URI). Siempre carga,
// no depende de servicios externos: ideal para el modo demo.
function svgFoto(opts: { label: string; c1: string; c2: string; body: string }): string {
  const { label, c1, c2, body } = opts;
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='800' height='500' viewBox='0 0 800 500'>
  <defs>
    <linearGradient id='bg' x1='0' y1='0' x2='1' y2='1'>
      <stop offset='0' stop-color='${c1}'/><stop offset='1' stop-color='${c2}'/>
    </linearGradient>
    <radialGradient id='glow' cx='0.5' cy='0.35' r='0.7'>
      <stop offset='0' stop-color='rgba(228,18,30,0.35)'/><stop offset='1' stop-color='rgba(228,18,30,0)'/>
    </radialGradient>
  </defs>
  <rect width='800' height='500' fill='url(#bg)'/>
  <rect width='800' height='500' fill='url(#glow)'/>
  <ellipse cx='400' cy='398' rx='300' ry='30' fill='rgba(0,0,0,0.35)'/>
  <g fill='${body}' stroke='rgba(255,255,255,0.18)' stroke-width='2'>
    <path d='M150 350 L188 348 C205 305 250 262 330 258 L455 256 C540 258 596 300 636 330 L672 346 C690 349 690 366 672 368 L150 368 C138 368 138 351 150 350 Z'/>
  </g>
  <path d='M338 262 C360 250 430 250 452 258 L470 300 L322 300 Z' fill='rgba(12,14,17,0.72)'/>
  <g>
    <circle cx='262' cy='368' r='46' fill='#0c0e11'/><circle cx='262' cy='368' r='24' fill='#2a2e36'/><circle cx='262' cy='368' r='9' fill='#7d838c'/>
    <circle cx='560' cy='368' r='46' fill='#0c0e11'/><circle cx='560' cy='368' r='24' fill='#2a2e36'/><circle cx='560' cy='368' r='9' fill='#7d838c'/>
  </g>
  <rect x='636' y='318' width='34' height='9' rx='4' fill='#E4121E'/>
  <text x='40' y='58' font-family='Arial, sans-serif' font-size='20' font-weight='700' letter-spacing='4' fill='rgba(255,255,255,0.65)'>RIVERA ÉLITE GARAGE</text>
  <text x='40' y='470' font-family='Arial, sans-serif' font-size='42' font-weight='800' fill='#ffffff'>${label}</text>
</svg>`;
  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

const IMG = {
  gtr: svgFoto({ label: 'Nissan GT-R', c1: '#2b3038', c2: '#0b0d10', body: '#3a4048' }),
  mx5: svgFoto({ label: 'Mazda MX-5', c1: '#5a0d12', c2: '#160305', body: '#b0161f' }),
  golf: svgFoto({ label: 'VW Golf GTI', c1: '#3a3f47', c2: '#14161a', body: '#d8dce1' }),
  motor: svgFoto({ label: 'Servicio de motor', c1: '#22262d', c2: '#0b0d10', body: '#454b54' }),
  taller: svgFoto({ label: 'En el taller', c1: '#1a1d22', c2: '#0b0d10', body: '#3a4048' }),
  frenos: svgFoto({ label: 'Frenos', c1: '#26120f', c2: '#0b0d10', body: '#5a3030' }),
};

export const DEMO_CLIENTE: Profile = {
  id: 'demo-carlos',
  rol: 'cliente',
  nombre: 'Carlos Méndez',
  telefono: '5512345678',
  email: 'carlos.mendez@gmail.com',
  created_at: '2026-07-10T10:00:00Z',
};

export const DEMO_ADMIN: Profile = {
  id: 'demo-admin',
  rol: 'admin',
  nombre: 'J. Rivera',
  telefono: '5555555555',
  email: 'admin@riveraelite.mx',
  created_at: '2026-01-01T10:00:00Z',
};

export const DEMO_CLIENTES: Profile[] = [
  DEMO_CLIENTE,
  { id: 'demo-ana', rol: 'cliente', nombre: 'Ana Rivera', telefono: '5599887766', email: 'ana.rivera@outlook.com', created_at: '2026-07-08T10:00:00Z' },
  { id: 'demo-luis', rol: 'cliente', nombre: 'Luis Torres', telefono: '5544556677', email: 'luis.torres@gmail.com', created_at: '2026-07-05T10:00:00Z' },
];

export const DEMO_VEHICULOS: (Vehiculo & { profiles: { nombre: string | null; telefono: string | null; email: string | null } })[] = [
  {
    id: 'demo-gtr', cliente_id: 'demo-carlos', marca: 'Nissan', modelo: 'GT-R', anio: 2021,
    placa: 'ABG-42-19', vin: 'JN1AR5EF6BM230015', color: 'Gris Gunmetal', foto_url: IMG.gtr,
    qr_slug: 'demo-gtr', created_at: '2026-07-16T09:00:00Z',
    profiles: { nombre: 'Carlos Méndez', telefono: '5512345678', email: 'carlos.mendez@gmail.com' },
  },
  {
    id: 'demo-mx5', cliente_id: 'demo-carlos', marca: 'Mazda', modelo: 'MX-5', anio: 2019,
    placa: 'PXR-88-04', vin: 'JM1NDAB70K0301122', color: 'Rojo Soul', foto_url: IMG.mx5,
    qr_slug: 'demo-mx5', created_at: '2026-07-18T09:00:00Z',
    profiles: { nombre: 'Carlos Méndez', telefono: '5512345678', email: 'carlos.mendez@gmail.com' },
  },
  {
    id: 'demo-golf', cliente_id: 'demo-luis', marca: 'VW', modelo: 'Golf GTI', anio: 2020,
    placa: 'TRS-19-88', vin: 'WVWZZZ1KZAW000123', color: 'Blanco', foto_url: IMG.golf,
    qr_slug: 'demo-golf', created_at: '2026-07-12T09:00:00Z',
    profiles: { nombre: 'Luis Torres', telefono: '5544556677', email: 'luis.torres@gmail.com' },
  },
];

export const DEMO_ORDENES: Orden[] = [
  {
    id: 'demo-ord-1', vehiculo_id: 'demo-gtr', titulo: 'Servicio mayor + frenos',
    descripcion: 'Servicio mayor de motor y cambio completo del sistema de frenos por componentes de alto rendimiento.',
    estatus: 'en_reparacion', fecha_ingreso: '2026-07-16', fecha_entrega_estimada: '2026-07-28',
    fecha_entrega_real: null, mecanico: 'J. Rivera', costo_estimado: 48500, cotizacion_estado: 'pendiente',
    created_at: '2026-07-16T09:15:00Z',
  },
  {
    id: 'demo-ord-2', vehiculo_id: 'demo-mx5', titulo: 'Afinación y sincronización',
    descripcion: 'Afinación mayor, bujías, filtros y sincronización electrónica.',
    estatus: 'diagnostico', fecha_ingreso: '2026-07-18', fecha_entrega_estimada: '2026-08-02',
    fecha_entrega_real: null, mecanico: 'A. López', costo_estimado: 7800, cotizacion_estado: 'aprobada',
    created_at: '2026-07-18T11:00:00Z',
  },
  {
    id: 'demo-ord-3', vehiculo_id: 'demo-golf', titulo: 'Clutch y volante bimasa',
    descripcion: 'Reemplazo de kit de clutch y volante bimasa.',
    estatus: 'pedido_piezas', fecha_ingreso: '2026-07-12', fecha_entrega_estimada: '2026-07-30',
    fecha_entrega_real: null, mecanico: 'J. Rivera', costo_estimado: 22400, cotizacion_estado: 'aprobada',
    created_at: '2026-07-12T09:15:00Z',
  },
];

export const DEMO_AVANCES: Record<string, Avance[]> = {
  'demo-ord-1': [
    { id: 'a1', orden_id: 'demo-ord-1', etapa: 'en_reparacion', nota: 'Desmontaje del sistema de frenos e instalación de balatas y discos nuevos.', created_at: '2026-07-21T14:20:00Z' },
    { id: 'a2', orden_id: 'demo-ord-1', etapa: 'pedido_piezas', nota: 'Balatas y discos de alto rendimiento solicitados al proveedor; llegada en 24 h.', created_at: '2026-07-19T10:05:00Z' },
    { id: 'a3', orden_id: 'demo-ord-1', etapa: 'diagnostico', nota: 'Revisión completa realizada; cotización enviada al cliente.', created_at: '2026-07-17T16:40:00Z' },
    { id: 'a4', orden_id: 'demo-ord-1', etapa: 'recibido', nota: 'Vehículo recibido en el taller. Inventario y fotos iniciales.', created_at: '2026-07-16T09:15:00Z' },
  ],
  'demo-ord-2': [
    { id: 'b1', orden_id: 'demo-ord-2', etapa: 'diagnostico', nota: 'Diagnóstico electrónico en curso.', created_at: '2026-07-19T12:00:00Z' },
    { id: 'b2', orden_id: 'demo-ord-2', etapa: 'recibido', nota: 'Vehículo recibido en el taller.', created_at: '2026-07-18T11:00:00Z' },
  ],
  'demo-ord-3': [
    { id: 'c1', orden_id: 'demo-ord-3', etapa: 'pedido_piezas', nota: 'Kit de clutch solicitado al proveedor.', created_at: '2026-07-15T10:00:00Z' },
    { id: 'c2', orden_id: 'demo-ord-3', etapa: 'diagnostico', nota: 'Diagnóstico confirmado: clutch desgastado.', created_at: '2026-07-13T15:00:00Z' },
    { id: 'c3', orden_id: 'demo-ord-3', etapa: 'recibido', nota: 'Vehículo recibido en el taller.', created_at: '2026-07-12T09:15:00Z' },
  ],
};

export const DEMO_FOTOS: Record<string, Foto[]> = {
  'demo-ord-1': [
    { id: 'f1', orden_id: 'demo-ord-1', url: IMG.frenos, tipo: 'antes', descripcion: 'Sistema de frenos original', created_at: '2026-07-16T09:20:00Z' },
    { id: 'f2', orden_id: 'demo-ord-1', url: IMG.gtr, tipo: 'despues', descripcion: 'Frenos nuevos instalados', created_at: '2026-07-21T15:00:00Z' },
    { id: 'f3', orden_id: 'demo-ord-1', url: IMG.motor, tipo: 'durante', descripcion: 'Servicio de motor', created_at: '2026-07-20T12:00:00Z' },
    { id: 'f4', orden_id: 'demo-ord-1', url: IMG.taller, tipo: 'durante', descripcion: 'En el taller', created_at: '2026-07-20T13:00:00Z' },
  ],
};

export const DEMO_RESENAS: Record<string, Resena | null> = {};

// -------- Helpers --------
export function demoVehiculo(id: string) {
  return DEMO_VEHICULOS.find((v) => v.id === id) ?? null;
}
export function demoVehiculoPorSlug(slug: string) {
  return DEMO_VEHICULOS.find((v) => v.qr_slug === slug) ?? null;
}
export function demoOrdenesDeVehiculo(vehiculoId: string) {
  return DEMO_ORDENES.filter((o) => o.vehiculo_id === vehiculoId);
}
export function demoOrden(id: string) {
  return DEMO_ORDENES.find((o) => o.id === id) ?? null;
}
export function demoAvances(ordenId: string) {
  return DEMO_AVANCES[ordenId] ?? [];
}
export function demoFotos(ordenId: string) {
  return DEMO_FOTOS[ordenId] ?? [];
}
