# Rivera Élite Connect

Portal web de **Rivera Élite Garage** para llevar el historial de los carros, su
progreso dentro del taller y fotos — con dos vistas: **cliente** y **administración**.

- **Cliente:** inicia sesión, ve sus carros, barra de progreso, fecha de entrega,
  historial (línea de tiempo), fotos (antes/después), aprueba cotizaciones,
  descarga su recibo y deja reseña.
- **Administración:** da de alta clientes y vehículos, crea órdenes, avanza las
  etapas, sube fotos, define fechas/costos, genera el QR y avisa por WhatsApp.

## Stack

- **Next.js 14** (App Router, TypeScript) + **Tailwind CSS**
- **Supabase** — Auth, Postgres, Storage (fotos), Realtime (progreso en vivo)
- **Vercel** — hosting / vista previa

## Etapas del taller

`Recibido → Diagnóstico → En reparación → Pintura → Control de calidad → Listo → Entregado`

---

## Puesta en marcha (paso a paso)

### 1. Crear el proyecto en Supabase
1. Entra a [supabase.com](https://supabase.com) → **New project**.
2. En **Settings → API** copia: `Project URL`, `anon public key` y `service_role key`.

### 2. Crear las tablas y la seguridad
En el **SQL Editor** de Supabase, ejecuta en orden el contenido de:
1. `supabase/migrations/0001_init.sql` (tablas, enum, RLS, trigger de perfiles)
2. `supabase/migrations/0002_storage.sql` (bucket `vehiculos` para fotos)
3. `supabase/migrations/0003_public_qr.sql` (vista pública del QR)

### 3. Variables de entorno
Copia `.env.local.example` a `.env.local` y llena los valores:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

> ⚠️ La `service_role key` es secreta: solo se usa en el servidor (dar de alta
> clientes). Nunca la publiques en el cliente.

### 4. Correr en local
```bash
npm install
npm run dev
```
Abre http://localhost:3000

### 5. Crear tu usuario administrador
1. Regístrate desde `/registro` con tu correo.
2. En Supabase → **Table editor → profiles**, cambia tu fila `rol` a `admin`
   (o corre en SQL: `update public.profiles set rol='admin' where email='TU-CORREO';`).
3. Vuelve a entrar: ahora verás el panel `/admin`.

### 6. Desplegar en Vercel
1. Sube el repo a GitHub (ya está en la rama de trabajo).
2. En [vercel.com](https://vercel.com) → **Add New → Project** → importa el repo.
3. En **Environment Variables** agrega las mismas del `.env.local`
   (usa la URL pública de Vercel en `NEXT_PUBLIC_SITE_URL`).
4. **Deploy** → obtienes la vista previa.

---

## Notas de funciones

- **WhatsApp:** el botón en la orden abre WhatsApp con un mensaje pre-escrito
  (nombre del cliente + estatus). Usa `wa.me` (sin costo). Si el teléfono trae 10
  dígitos, se le antepone `52` (México).
- **QR:** cada vehículo genera un `qr_slug`; el QR apunta a `/qr/<slug>`, una
  vista pública de solo lectura del estatus (para pegar en el parabrisas).
- **Recibo PDF:** desde el carro entregado, "Descargar recibo" abre una vista
  imprimible → *Imprimir / Guardar como PDF*.
- **Tiempo real:** la barra de progreso y el historial del cliente se actualizan
  solos cuando el taller cambia la etapa (Supabase Realtime).

## Siguiente paso
Esta versión es **funcional**. El diseño premium (branding, colores, tipografía,
animaciones) se pule después con Claude Design y se vuelve a desplegar en Vercel.
