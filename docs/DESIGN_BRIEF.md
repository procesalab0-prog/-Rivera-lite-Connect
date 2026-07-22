# Brief de diseño — Rivera Élite Connect

## Qué es
App web de **Rivera Élite Garage** (taller automotriz). El cliente entra a su
sesión y ve el progreso de su carro dentro del taller, su historial, fotos y
fecha de entrega. Hay dos vistas sobre la misma app: **cliente** y **administración**.

La funcionalidad ya está completa. **Tu trabajo es el diseño visual**, sin romper
la lógica ni la estructura de datos.

## Objetivo de diseño
Que se sienta **premium, moderno y llamativo** — nivel "garage élite / performance".
El cliente debe emocionarse al entrar a ver su carro. Modo oscuro como base, con
un acento dorado/metálico. Debe verse increíble en **celular** (la mayoría entra
desde el teléfono) y en escritorio.

- Tono: elegante, deportivo, confiable. Nada corporativo/frío.
- Inspiración: dashboards de autos, apps de tracking premium, detailing shops.
- Micro-animaciones sutiles (barra de progreso que llena, transiciones suaves).

## Stack y reglas técnicas (importante)
- **Next.js 14 (App Router) + TypeScript + Tailwind CSS.**
- Puedes cambiar libremente estilos, layout, colores, tipografías y agregar
  micro-interacciones.
- **No cambies** la lógica de datos, los `Server Actions`, los nombres de campos,
  ni las consultas a Supabase.
- Hay clases utilitarias base en `app/globals.css` (`.btn`, `.btn-primary`,
  `.card`, `.input`, `.label`, `.badge`) y colores en `tailwind.config.ts`
  (`rivera-dark`, `rivera-gold`, `rivera-steel`). Puedes rediseñarlas o
  reemplazarlas, mientras la app siga funcionando.
- Todo responsivo; sin scroll horizontal en móvil.
- Falta el **logo**; si no hay, usa un wordmark tipográfico "Rivera Élite" +
  ícono 🏁 provisional.

## Pantallas a diseñar (rutas)
**Cliente**
- `/` — landing con login/registro (primera impresión, debe enamorar).
- `/login`, `/registro` — formularios.
- `/dashboard` — "Mis carros": tarjetas con foto, mini barra de progreso y fecha de entrega.
- `/carro/[id]` — **pantalla estrella**: barra de progreso grande (7 etapas), línea
  de tiempo/historial, galería antes/después (slider), cotización a aprobar,
  reseña y botón de recibo.
- `/carro/[id]/recibo` — recibo imprimible (limpio, estilo factura, fondo claro para PDF).

**Administración**
- `/admin` — resumen: contadores por etapa + lista de órdenes activas.
- `/admin/clientes` — alta y lista de clientes.
- `/admin/vehiculos` y `/admin/vehiculos/[id]` — alta de vehículos, foto, QR, órdenes.
- `/admin/ordenes/[id]` — gestión: cambiar etapa, editar datos, subir fotos, botón WhatsApp.

**Público**
- `/qr/[slug]` — vista de solo lectura del estatus (se abre al escanear el QR del parabrisas).

## Componentes clave (en `components/`)
- `BarraProgreso` — las 7 etapas: Recibido → Diagnóstico → En reparación →
  Pintura → Control de calidad → Listo → Entregado. Es el elemento central,
  hazlo lucir (estados completado/actual/pendiente, %).
- `TarjetaCarro`, `Timeline`, `GaleriaAntesDespues`, `CotizacionCliente`,
  `FormResena`, `BotonWhatsApp`, `QRCarro`, `NavBar`.

## Entregable esperado
- Rediseño aplicado sobre el código actual (Tailwind), listo para desplegar en Vercel.
- Coherencia visual entre cliente y admin.
- Estados vacíos y de carga cuidados.
- Paleta final + tipografías definidas (idealmente en `tailwind.config.ts` y `globals.css`).

## Marca (ajustar a gusto)
- Nombre app: **Rivera Élite Connect** · Taller: **Rivera Élite Garage**.
- Colores de arranque: fondo oscuro (`#0f172a`), acento dorado (`#c9a227`),
  gris acero (`#334155`). Si tienes una mejor paleta premium, propónla.
