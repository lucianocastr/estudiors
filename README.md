# Estudio Jurídico RBS — Sistema Web + Legal CRM

Sistema web profesional para el estudio jurídico de **Romina Belén Sanchez**, abogada con sede en **Alta Gracia, Córdoba, Argentina**.

---

## Stack Tecnológico

| Categoría | Tecnología | Versión |
|-----------|-----------|---------|
| Framework | Next.js (App Router) | 16.1.3 |
| UI Library | React | 19.2.3 |
| Lenguaje | TypeScript | 5 |
| Estilos | Tailwind CSS v4 + shadcn/ui | 4.x |
| Componentes | Radix UI primitives | — |
| ORM | Prisma | 5.22 |
| Base de datos | PostgreSQL (Neon) | 14+ |
| Autenticación | NextAuth.js v5 (Google OAuth) | 5.0-beta |
| Email | Nodemailer + Gmail SMTP | 7.x |
| Formularios | react-hook-form + Zod | 7.x / 4.x |
| Íconos | lucide-react | 0.562 |
| Tipografía | Inter + Cormorant Garamond (Google Fonts) | — |

---

## Funcionalidades

### Sitio Público (`/(public)`)

#### Home (`/`)
- Hero fotográfico (`imagenMain.png`) con overlay oscuro y texto: nombre de la abogada + credencial
- Sección "Cómo funciona" — proceso de consulta en 3 pasos
- Grid de especialidades con links a páginas de detalle
- Sección "Por qué elegirnos" — valores del estudio
- CTA final hacia formulario de consulta

#### Especialidades (`/especialidades`, `/especialidades/[slug]`)
- Listado de las 5 especialidades con ícono, descripción y link
- Página de detalle por especialidad con:
  - Descripción extendida
  - Situaciones que atiende el estudio (cards)
  - Preguntas frecuentes
  - CTA hacia formulario pre-filtrado por especialidad

#### Formulario de Consulta (`/consulta`)
- Formulario multi-paso (5 pasos):
  1. **Tipo de problema** — selección de especialidad y situación
  2. **Descripción** — texto libre + flag de urgencia
  3. **Datos de contacto** — nombre, email, teléfono, localidad
  4. **Turno (opcional)** — modalidad, fecha, horario preferido
  5. **Confirmación** — resumen + aceptación de términos legales
- **Filtrado inteligente**: si viene de `/especialidades/[slug]`, el paso 1 muestra solo esa especialidad
- Validación con Zod en cada paso
- Crea `Contacto` (deduplicado por email) + `Consulta` + `Turno` + encola 2 emails

#### Contacto (`/contacto`)
- CTA principal hacia formulario de consulta
- Cards de contacto directo: WhatsApp e Instagram

#### Legal
- `/legal/aviso` — Aviso legal
- `/legal/privacidad` — Política de privacidad (Ley 25.326)
- `/legal/terminos` — Términos y condiciones

---

### Panel de Profesionales (`/panel`)

Acceso restringido via Google OAuth (NextAuth.js). Multi-tenant por `Organizacion`.

#### Dashboard (`/panel`)
- Estadísticas: consultas nuevas, en análisis, urgentes, turnos pendientes
- Listado de consultas recientes con estado y contacto

#### Consultas (`/panel/consultas`)
- Listado completo con nombre, email, teléfono, especialidad, estado, prioridad
- Filtros por estado

#### Detalle de Consulta (`/panel/consultas/[id]`)
- **Layout 2 columnas**:
  - Izquierda (2/3): descripción del caso, sección turno, notas internas
  - Derecha (1/3): datos del contacto, gestión de estado, timeline de eventos
- **Server Actions**:
  - `cambiarEstado` — cambia `InquiryEstado` con timestamps (contactadoAt, convertidoAt, cerradoAt)
  - `agregarNota` — crea `Nota` con tipo (GENERAL, LLAMADA, REUNIÓN, SEGUIMIENTO)
  - `confirmarTurno` — confirma turno con fecha y link de videollamada opcional
  - `rechazarTurno` — rechaza turno con motivo opcional
- **Audit log**: `ConsultaEvento` append-only con historial de cambios de estado

#### Turnos (`/panel/turnos`)
- Listado de turnos con modalidad, fecha preferida, estado
- Datos del contacto asociado

---

### Sistema de Emails

#### Cola de emails (`EmailCola`)
- Todos los emails se encolan en BD, no se envían en el request
- Worker: `POST /api/email-worker` procesa hasta 10 pendientes
- Backoff exponencial en fallo: 5min → 15min → 45min
- Máximo 3 intentos, luego estado `FALLIDO`

#### Templates disponibles
- `nueva-consulta-admin` — notifica al estudio de nueva consulta
- `confirmacion-cliente` — confirma al cliente la recepción
- `turno-confirmado` — notifica fecha y link de videollamada al cliente

#### Procesar emails manualmente
```bash
npm run email:process
```

---

### Elementos Globales
- **Header sticky**: monograma RS + nombre + navegación + CTA "Consultar"
- **Botón flotante WhatsApp**: acceso rápido permanente en esquina inferior derecha
- **Footer**: identidad RS, links de especialidades, navegación, links legales, redes sociales

---

## Modelo de Base de Datos (v2.0)

```
Organizacion      — Tenant root (multi-tenant)
OrganizacionMiembro — Rol de usuario por organización (OWNER/ADMIN/PROFESIONAL/ASISTENTE)
Usuario           — Profesionales y admin (Google OAuth)
Contacto          — Persona que consulta (1 → N consultas, deduplicado por email)
Consulta          — Caso/Inquiry (pertenece a Contacto)
ConsultaAsignacion — Historial de asignaciones a profesionales
ConsultaEvento    — Audit log append-only (inmutable)
Turno             — Turno asociado 1:1 a Consulta
Nota              — Notas internas por consulta
EmailCola         — Cola de emails desacoplada
BloqueoHorario    — Bloqueos de agenda por profesional
Configuracion     — Key/value por organización
Especialidad      — Especialidades (futuro CMS)
```

**Estados de consulta**: `NUEVA → EN_ANALISIS → CONTACTADO → CONVERTIDO → CERRADO`

**Estados de turno**: `PENDIENTE → CONFIRMADO / RECHAZADO → COMPLETADO / CANCELADO`

---

## Identidad Visual

### Marca
- **Nombre**: Romina Belén Sanchez — Abogada · Estudio Jurídico
- **Monograma**: RS (círculo con borde rose/mauve, letras gold)
- **Tipografía display**: Cormorant Garamond (headings, títulos)
- **Tipografía body**: Inter

### Paleta de Colores (OKLCH)
| Rol | Token | Color |
|-----|-------|-------|
| Botones / acción principal | `--primary` | Gold oscuro `oklch(0.48 0.090 68)` |
| Fondos de sección / hero | `--secondary` | Gold suave `oklch(0.88 0.032 72)` |
| Iconos / detalles | `--accent` | Rose/mauve `oklch(0.52 0.070 8)` |
| Canvas | `--background` | Blanco cálido `oklch(0.975 0.004 55)` |

### Redes Sociales
- Instagram: https://www.instagram.com/rs.ejur/
- WhatsApp: https://wa.me/5493513100760

---

## Requisitos Previos

- Node.js 18+
- PostgreSQL 14+ (recomendado: [Neon](https://neon.tech) para dev y producción)
- Cuenta Google Cloud (para OAuth)
- Cuenta Gmail con App Password (para envío de emails)

---

## Configuración

### 1. Instalar dependencias

```bash
npm install
```

### 2. Variables de entorno

Crear `.env` en la raíz:

```env
# Base de datos (Neon o PostgreSQL local 14+)
DATABASE_URL="postgresql://usuario:password@host/db?sslmode=require"

# NextAuth
NEXTAUTH_SECRET="generar-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"

# Gmail SMTP (usar App Password, no contraseña de cuenta)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-app-password"
SMTP_FROM="Estudio Jurídico <tu-email@gmail.com>"

# Datos del estudio
ESTUDIO_NOMBRE="Estudio Jurídico Romina Belén Sanchez"
ESTUDIO_EMAIL="contacto@estudio.com"
ESTUDIO_TELEFONO="+54 351 XXXXXXX"
ESTUDIO_DIRECCION="Alta Gracia, Córdoba, Argentina"

# CRM
ADMIN_EMAIL="email-del-admin@gmail.com"
DEFAULT_ORGANIZATION_ID="id-de-la-organizacion"  # obtener después del seed

# Worker de emails (dejar vacío en desarrollo)
# CRON_SECRET="token-seguro-para-produccion"
```

### 3. Configurar Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) → crear proyecto
2. APIs y Servicios → Habilitar Google+ API
3. Credenciales → OAuth 2.0 → Aplicación web
   - Origen: `http://localhost:3000`
   - Redirect URI: `http://localhost:3000/api/auth/callback/google`

### 4. Gmail App Password

1. Google Account → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones
2. Generar para "Correo" → copiar a `SMTP_PASSWORD`

### 5. Inicializar base de datos

```bash
npm run db:push    # Crear tablas (development)
npm run db:seed    # Crear organización y admin inicial
```

El seed imprime el `DEFAULT_ORGANIZATION_ID` — copiarlo al `.env` y reiniciar el servidor.

### 6. Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo |
| `npm run build` | Build de producción (`prisma generate` incluido) |
| `npm run start` | Servidor de producción |
| `npm run db:generate` | Generar cliente Prisma |
| `npm run db:push` | Sincronizar schema con BD |
| `npm run db:migrate` | Crear migración (producción) |
| `npm run db:seed` | Ejecutar seed |
| `npm run db:studio` | Abrir Prisma Studio (UI de BD) |
| `npm run email:process` | Procesar cola de emails pendientes |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/                # Sitio público (Header + Footer)
│   │   ├── page.tsx             # Home con hero fotográfico
│   │   ├── layout.tsx
│   │   ├── especialidades/
│   │   │   ├── page.tsx         # Listado de especialidades
│   │   │   └── [slug]/page.tsx  # Detalle con FAQ y CTA
│   │   ├── consulta/
│   │   │   ├── page.tsx         # Formulario 5 pasos
│   │   │   └── gracias/page.tsx # Confirmación de envío
│   │   ├── contacto/page.tsx
│   │   └── legal/
│   │       ├── aviso/page.tsx
│   │       ├── privacidad/page.tsx
│   │       └── terminos/page.tsx
│   ├── panel/                   # Panel CRM (protegido por NextAuth)
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Dashboard con estadísticas
│   │   ├── consultas/
│   │   │   ├── page.tsx         # Listado de consultas
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # Detalle 2 columnas
│   │   │       └── actions.ts   # Server Actions (cambiarEstado, agregarNota, turno)
│   │   └── turnos/page.tsx      # Listado de turnos
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── error/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   ├── consulta/route.ts    # POST: crea Contacto+Consulta+Turno+EmailCola
│   │   └── email-worker/route.ts # POST: procesa cola con backoff exponencial
│   ├── globals.css              # Paleta OKLCH + Tailwind v4
│   └── layout.tsx               # Root layout + WhatsApp flotante
├── components/
│   ├── ui/                      # shadcn/ui (Radix primitives)
│   ├── forms/
│   │   └── consulta-form.tsx    # Formulario multi-paso con React Hook Form
│   └── layout/
│       ├── header.tsx           # Nav + RS monogram
│       └── footer.tsx
├── content/                     # Contenido estático (TypeScript)
│   ├── especialidades.ts        # 5 especialidades con FAQ
│   └── equipo.ts                # Equipo profesional
├── lib/
│   ├── auth.ts                  # NextAuth v5 config + helpers (puedeAdministrar)
│   ├── db.ts                    # Prisma client singleton
│   ├── email.ts                 # Funciones de email payload-based
│   ├── utils.ts                 # cn() helper
│   └── validators.ts            # Schemas Zod del formulario
└── middleware.ts                # Protección de rutas /panel
```

---

## Personalización de Contenido

### Especialidades
Editar `src/content/especialidades.ts` — cada especialidad tiene: nombre, slug, ícono, descripción corta/larga, problemas (radio options del formulario) y preguntas frecuentes.

### Colores
Editar `src/app/globals.css` — sistema OKLCH en `:root`

### Datos de contacto en header y footer
Links de WhatsApp e Instagram están hardcodeados en `header.tsx` y `footer.tsx`.

---

## Deploy en Vercel

1. Importar repositorio en [vercel.com](https://vercel.com)
2. Configurar todas las variables de entorno del `.env`
3. Actualizar en producción:
   - `NEXTAUTH_URL` → dominio real
   - `CRON_SECRET` → token seguro para proteger `/api/email-worker`
   - Google Cloud Console → agregar dominio a orígenes y redirect URIs

### Worker de emails en producción

Agregar en `vercel.json`:

```json
{
  "crons": [
    {
      "path": "/api/email-worker",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

Y en los headers del cron configurar `x-cron-token: <CRON_SECRET>`.

---

## Fases de Desarrollo

- **Fase 1** ✅ — Sitio público completo + formulario de consulta + identidad visual RS
- **Fase 2** ✅ — Legal CRM v2.0: schema multi-tenant, panel completo, flujo Contacto→Consulta→Turno, Server Actions, cola de emails con backoff
- **Fase 3** — Panel de administración: métricas/embudo, gestión de usuarios, CMS de contenido, calendario de turnos
