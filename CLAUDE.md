# CLAUDE.md — Estudio Jurídico RBS

Orientación para cualquier sesión de trabajo en este repo. **El código y la base son la fuente de verdad; este documento orienta y advierte, no reemplaza la verificación.** Antes de tocar algo, leé el archivo real y verificá contra el código/DB.

Idioma del proyecto: **español argentino (voseo)** en UI, commits y comunicación.

---

## Qué es

Sitio web + CRM para el estudio jurídico de la Dra. Romina Belén Sanchez (Alta Gracia, Córdoba). Sitio público (captación de consultas) + panel de gestión interno (CRM) + módulo de Reestructuración de Pasivos (CRP).

Producción: **Vercel + Neon (PostgreSQL)**. Dominio: `www.rsestudiojuridico.com.ar`.

---

## Stack

- **Next.js 16.1.3** (App Router) · **React 19.2** · **TypeScript 5**
- **Tailwind CSS v4** (OKLCH, `@theme inline`) · shadcn/ui sobre **Radix UI**
- **Prisma 5.22** + **PostgreSQL** (Neon en dev y prod)
- **NextAuth v5** (Google OAuth, estrategia JWT)
- **Nodemailer** (Gmail SMTP) · **react-hook-form + Zod v4** · date-fns · lucide-react

---

## Comandos

```bash
npm run dev          # servidor de desarrollo
npm run build        # prisma generate && next build
npm run lint         # eslint
npx tsc --noEmit     # typecheck (NO hay script dedicado; usar esto antes de commitear)
npm run db:migrate   # prisma migrate dev
npm run db:studio    # explorar la base
npm run db:seed      # sembrar (npx tsx prisma/seed.ts)
```

**Deploy:** `git push origin master` → Vercel despliega solo (~1-2 min). No hay otro paso.
**Verificar cambios en prod:** `curl -s https://www.rsestudiojuridico.com.ar/...` (canonical, JSON-LD, etc.).

---

## Arquitectura (CRM v2.0)

Multi-tenant: `Organizacion` → `OrganizacionMiembro` → `Usuario`.
Flujo público: `Contacto (1) → Consulta (N) → Turno (1)`, con `Nota` y `ConsultaEvento`.

**Emails desacoplados (importante):** las acciones NO envían mail directo — **encolan** en `EmailCola`. Un worker (`POST /api/email-worker`) procesa la cola. Lo dispara un **cron externo en cron-job.org cada 15 min** (Vercel Hobby no soporta crons sub-horarios). Templates: `nueva-consulta-admin`, `confirmacion-cliente`, `turno-confirmado`, `turno-rechazado`.

**Módulo CRP** (Reestructuración de Pasivos): 9 modelos con prefijo CRP, detalle en 8 tabs (`?tab=`). Escala arancelaria Jus Ley 9459 Córdoba en `src/lib/crp-utils.ts`. Ver también `docs/` y memoria del proyecto.

**Soft-delete:** varios modelos usan `deletedAt`. Toda query debe filtrar `deletedAt: null`.

---

## Mapa de rutas

- `src/app/(public)/` — sitio público (con Header + Footer, JSON-LD): `/`, `/especialidades[/slug]` (6 slugs estáticos), `/informacion[/slug]` (artículos educativos) + `/informacion/valores-de-referencia` (histórico de indicadores), `/consulta[/gracias]`, `/contacto`, `/equipo`, `/legal/{aviso,privacidad,terminos}`
- `src/app/panel/` — CRM (protegido por `src/middleware.ts`): dashboard, `/consultas[/id]`, `/turnos`, `/reestructuracion[/nuevo|/id]`, `/valores` (valores de referencia), `/visitas` (analítica propia)
- `src/app/api/` — `consulta` (POST: crea Contacto+Consulta+Turno+EmailCola), `email-worker` (POST: procesa cola), `track` (POST: registra visita), `auth/[...nextauth]`
- `src/app/auth/{login,error}` — Google OAuth

## Archivos clave

- `src/lib/auth.ts` — NextAuth v5, roles, helpers · `src/lib/db.ts` — Prisma client
- `src/lib/email.ts` — envío (funciones payload-based, sin tipos Prisma) · `src/lib/validators.ts` — Zod
- `src/lib/crp-utils.ts` — labels/colores/cálculos CRP · `src/content/especialidades.ts` — contenido de especialidades (+ `problemas[]` que alimenta el formulario)
- `src/content/informacion.ts` — artículos educativos de la sección `/informacion` (patrón espejo de especialidades: array + `[slug]`). Contenido orientativo — **revisar con la profesional antes de publicar**. Un artículo con `indicador` muestra la tabla de valores vigentes de ese indicador.
- `src/lib/valores-referencia.ts` — helpers puros de valores (labels, tramos canasta, formato ARS/período), client-safe · `src/lib/valores-referencia-queries.ts` — consultas públicas (server), scopeadas a `DEFAULT_ORGANIZATION_ID` · `src/components/informacion/valores.tsx` — tablas (vigente + histórico) · `src/app/panel/valores/` — backoffice de carga (form + `actions.ts` con upsert por período)
- `src/components/seo/legal-service-schema.tsx` — JSON-LD `LegalService` (montado en `(public)/layout.tsx`)
- `src/app/panel/consultas/[id]/actions.ts` — Server Actions (estado, nota, confirmar/rechazar turno, eliminar)
- `src/components/analytics/` — `google-analytics.tsx` (GA4, se activa con `NEXT_PUBLIC_GA_ID`) + `visit-tracker.tsx` (beacon → `/api/track`) · `src/lib/visitas.ts` — helpers (dispositivo/fuente/bot) · `src/app/panel/visitas/` — panel de analítica propia
- `prisma/schema.prisma` — 24 modelos (12 core + 9 CRP + Especialidad + ValorReferencia + VisitaSitio)

---

## Convenciones

- **Scope por organización:** en el panel, resolver `organizacionId` vía `OrganizacionMiembro` del usuario (`activo: true, deletedAt: null`) y filtrar todo por él.
- **Fechas con hora → SIEMPRE** `timeZone: "America/Argentina/Buenos_Aires"` (Vercel corre en UTC, Argentina es UTC-3).
- **Estados** con mapas objeto (`ESTADO_LABELS` / `ESTADO_COLORS`), no `Badge variant`.
- **SEO:** canonical **por página** (relativo, ej. `/contacto`) — NUNCA en el root layout (se hereda a todas). JSON-LD via componente.
- **Server vs Client:** los Server Components no pueden usar `usePathname()` → extraer a Client Component (ej. `nav-links.tsx`).
- **Tailwind v4:** mapear CSS vars → utilities con `@theme inline`. Paleta OKLCH: primary=gold oscuro, secondary=gold claro, accent=rose/mauve.

---

## ⚠️ Gotchas / footguns (leé antes de tocar)

- **Canonical:** ver arriba — un canonical en el root layout se hereda a TODO el sitio (bug histórico: todas las páginas apuntaban al home → Google las trataba como duplicados). Definir por página.
- **Turnos + soft-delete:** eliminar una `Consulta` (soft delete) **no** borra su `Turno` → queda PENDIENTE. Toda query/conteo de turnos debe filtrar `consulta: { deletedAt: null }` (aplica en `/panel/turnos` y en el conteo del dashboard `panel/page.tsx`).
- **Emails no salen →** revisar PRIMERO el job en cron-job.org: la URL debe ser el **dominio de producción** (`https://www.rsestudiojuridico.com.ar/api/email-worker`), método **POST**, habilitado. (Bug histórico: apuntaba a un dominio interno de Vercel y la cola no se procesó ~1 mes.) Diagnóstico de cola: tabla `EmailCola` en Neon (estados PENDIENTE/PROCESANDO/ENVIADO/FALLIDO/CANCELADO; ver campo `errorUltimo`). Para frenar mails encolados sin borrarlos: `UPDATE "EmailCola" SET estado='CANCELADO' WHERE estado IN ('PENDIENTE','PROCESANDO')` (el worker solo toma PENDIENTE).
- **Gmail SMTP:** `SMTP_FROM` debe coincidir con `SMTP_USER` (o alias verificado), o Gmail reescribe/rechaza. Contraseña = **contraseña de aplicación** (requiere 2FA), no la normal.
- **Prisma en Windows:** `prisma generate` da EPERM si el dev server está corriendo → pararlo antes.
- **`DEFAULT_ORGANIZATION_ID`** debe estar en `.env` antes de arrancar el server (no hay hot-reload de env).
- **`OrganizacionMiembro`** no tiene `updatedAt` ni default en `id` → en INSERTs SQL manuales usar `gen_random_uuid()` y no incluir `updatedAt`.
- **Formulario consulta paso 3:** validar `localidad` antes de avanzar (si se omite → 400 en la API).
- **psql local (9.5)** NO conecta a Neon (SCRAM). Para consultar la base: script Node con Prisma client + `DATABASE_URL` de `.env`.
- **`CRON_SECRET` no está seteado** → el endpoint `/api/email-worker` es público. Hardening pendiente (setear el secreto + header `x-cron-token` en cron-job.org).
- **Valores de referencia:** los cargan desde `/panel/valores`; las páginas públicas que los muestran (`/informacion/[slug]` con `indicador`, y `/informacion/valores-de-referencia`) son **ISR** (`export const revalidate = 3600`) y scopean por `DEFAULT_ORGANIZATION_ID`. Las Server Actions de carga llaman `revalidatePath` de esas rutas. Si un valor cargado no aparece en el sitio: verificar que `DEFAULT_ORGANIZATION_ID` coincida con la organización desde la que se cargó.

---

## Variables de entorno

```
DATABASE_URL · NEXTAUTH_SECRET · NEXTAUTH_URL
GOOGLE_CLIENT_ID · GOOGLE_CLIENT_SECRET
SMTP_HOST · SMTP_PORT · SMTP_USER · SMTP_PASSWORD · SMTP_FROM
ESTUDIO_NOMBRE · ESTUDIO_EMAIL · ESTUDIO_TELEFONO · ESTUDIO_DIRECCION
ADMIN_EMAIL · DEFAULT_ORGANIZATION_ID · CRON_SECRET (opcional)
NEXT_PUBLIC_GA_ID (opcional — Measurement ID de GA4, ej. G-XXXX; sin él, GA no carga)
```
**Analítica:** GA4 (`NEXT_PUBLIC_GA_ID`) + registro propio (`VisitaSitio` vía `POST /api/track`, montado en `(public)/layout`). El registro **no guarda IP**: la localidad sale de los headers `x-vercel-ip-*` (sólo existen en producción; en local la ciudad queda null). Panel en `/panel/visitas`. Filtra bots por User-Agent. Mencionado en la Política de Privacidad.
Notas: `.env` y `enviroment.txt` están gitignoreados (secretos). `SMTP_USER`/`SMTP_FROM` = cuenta que envía (hoy `rsestudiojur@gmail.com`); `ESTUDIO_EMAIL` = casilla que recibe avisos.

---

## Documentación del repo (`docs/`)

- `deployment-y-servicios.md` — estado y config de todos los servicios externos (Vercel, Neon, Gmail, cron, OAuth, Search Console, Business Profile) + SQL para alta de admin
- `manual-usuario.md` — manual del sistema · `whatsapp-business-setup.md` — WhatsApp Business
- `google-business-profile-checklist.md` — optimización de la ficha de Google
- `Agregar nuevo admin.txt` — queries SQL para alta de usuario ADMIN

---

## Flujo de trabajo (buenas prácticas)

1. **Verificar antes de actuar:** leé el archivo/estado real; no confíes en documentación que pueda haber quedado vieja.
2. **Cambios de código:** `npx tsc --noEmit` antes de commitear.
3. **Commits:** en español, descriptivos; push a `master` = deploy.
4. **Después de desplegar:** verificá en prod (curl / la pantalla afectada).
5. **Actualizá esta doc** cuando cambie algo estructural o descubras un nuevo footgun — es lo que mantiene el contexto vivo.
