# Estudio Jurídico RBS — Sistema Web Institucional

Sistema web profesional para el estudio jurídico de **Romina Belén Sanchez**, abogada con sede en **Córdoba, Argentina**.

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
| Base de datos | PostgreSQL | 14+ |
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
- Envío a API con guardado en base de datos + email de notificación
- Página de confirmación en `/consulta/gracias`

#### Equipo (`/equipo`)
- Presentación del equipo profesional (contenido estático en `src/content/equipo.ts`)

#### Contacto (`/contacto`)
- CTA principal hacia formulario de consulta
- Cards de contacto directo: WhatsApp e Instagram

#### Legal
- `/legal/aviso` — Aviso legal
- `/legal/privacidad` — Política de privacidad (Ley 25.326)
- `/legal/terminos` — Términos y condiciones

### Panel de Profesionales (`/panel`)
- Acceso restringido via Google OAuth (NextAuth.js)
- Vista de consultas recibidas con estados
- Gestión de turnos
- Notas internas por consulta

### Elementos Globales
- **Header sticky**: monograma RS + nombre + barra superior con WhatsApp e Instagram + navegación + CTA "Consultar"
- **Botón flotante WhatsApp**: acceso rápido permanente en esquina inferior derecha
- **Footer**: identidad RS, links de especialidades, navegación del sitio, links legales, redes sociales

---

## Identidad Visual

### Marca
- **Nombre**: Romina Belén Sanchez — Abogada · Estudio Jurídico
- **Monograma**: RS (círculo con borde gold, letras en primary gold)
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

## Modelo de Base de Datos

```
Usuario        — Profesionales y admin (Google OAuth)
Consulta       — Consultas del formulario público
Turno          — Turnos asociados a consultas
Nota           — Notas internas por consulta
BloqueoHorario — Bloqueos de agenda por profesional
Especialidad   — Especialidades (editable vía BD)
Configuracion  — Configuración del sitio (clave/valor)
```

**Estados de consulta**: `NUEVA → ASIGNADA → EN_PROCESO → ATENDIDA → CERRADA`

**Estados de turno**: `PENDIENTE → CONFIRMADO / RECHAZADO → COMPLETADO / CANCELADO`

---

## Requisitos Previos

- Node.js 18+
- PostgreSQL 14+
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
# Base de datos
DATABASE_URL="postgresql://usuario:password@localhost:5432/estudio_juridico"

# NextAuth
NEXTAUTH_SECRET="generar-con-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="tu-client-id.apps.googleusercontent.com"
GOOGLE_CLIENT_SECRET="tu-client-secret"

# Gmail SMTP
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="tu-email@gmail.com"
SMTP_PASSWORD="tu-app-password"
SMTP_FROM="Estudio Jurídico RBS <tu-email@gmail.com>"

# Datos del estudio
ESTUDIO_NOMBRE="Estudio Jurídico Romina Belén Sanchez"
ESTUDIO_EMAIL="contacto@estudio.com"
ESTUDIO_TELEFONO="+54 351 XXXXXXX"
ESTUDIO_DIRECCION="Córdoba, Argentina"
```

### 3. Configurar Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) → crear proyecto
2. Habilitar Google+ API
3. Credenciales → OAuth 2.0 → Aplicación web
   - Origen: `http://localhost:3000`
   - Redirect URI: `http://localhost:3000/api/auth/callback/google`

### 4. Gmail App Password

1. Google Account → Seguridad → Verificación 2 pasos → Contraseñas de aplicaciones
2. Generar para "Correo" → copiar a `SMTP_PASSWORD`

### 5. Inicializar base de datos

```bash
npm run db:push    # Crear tablas
npm run db:seed    # Datos iniciales
```

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
| `npm run build` | Build de producción |
| `npm run start` | Servidor de producción |
| `npm run db:generate` | Generar cliente Prisma |
| `npm run db:push` | Sincronizar schema con BD |
| `npm run db:migrate` | Crear migración |
| `npm run db:seed` | Ejecutar seed |
| `npm run db:studio` | Abrir Prisma Studio (UI de BD) |

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/                # Sitio público (Header + Footer)
│   │   ├── page.tsx             # Home con hero fotográfico (imagenMain.png)
│   │   ├── layout.tsx           # Layout público
│   │   ├── especialidades/
│   │   │   ├── page.tsx         # Listado de especialidades
│   │   │   └── [slug]/page.tsx  # Detalle con FAQ y CTA
│   │   ├── consulta/
│   │   │   ├── page.tsx         # Formulario 5 pasos
│   │   │   └── gracias/page.tsx # Confirmación de envío
│   │   ├── equipo/page.tsx
│   │   ├── contacto/page.tsx
│   │   └── legal/
│   │       ├── aviso/page.tsx
│   │       ├── privacidad/page.tsx
│   │       └── terminos/page.tsx
│   ├── panel/                   # Panel profesionales (protegido)
│   │   ├── layout.tsx
│   │   ├── page.tsx             # Dashboard
│   │   ├── consultas/page.tsx
│   │   └── turnos/page.tsx
│   ├── auth/
│   │   ├── login/page.tsx
│   │   └── error/page.tsx
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts
│   │   └── consulta/route.ts    # Recibe y guarda consultas
│   ├── globals.css              # Paleta OKLCH + Tailwind v4
│   └── layout.tsx               # Root layout + WhatsApp flotante
├── components/
│   ├── ui/                      # shadcn/ui (Radix primitives)
│   ├── forms/
│   │   └── consulta-form.tsx    # Formulario multi-paso
│   └── layout/
│       ├── header.tsx           # Nav + redes sociales
│       └── footer.tsx
├── content/                     # Contenido estático (TypeScript)
│   ├── especialidades.ts        # 5 especialidades con FAQ
│   └── equipo.ts                # Equipo profesional
└── lib/
    ├── auth.ts                  # NextAuth config
    ├── db.ts                    # Prisma client
    ├── email.ts                 # Servicio Nodemailer
    ├── utils.ts                 # cn() helper
    └── validators.ts            # Schemas Zod
```

---

## Personalización de Contenido

### Especialidades
Editar `src/content/especialidades.ts` — cada especialidad tiene: nombre, slug, ícono, descripción corta/larga, problemas (radio options del formulario) y preguntas frecuentes.

### Equipo
Editar `src/content/equipo.ts`

### Colores
Editar `src/app/globals.css` — sistema OKLCH en `:root`

### Datos de contacto en header y footer
Editar `src/components/layout/header.tsx` y `footer.tsx` — links de WhatsApp e Instagram

---

## Deploy en Vercel

1. Importar repositorio en [vercel.com](https://vercel.com)
2. Configurar todas las variables de entorno
3. Actualizar en producción:
   - `NEXTAUTH_URL` → dominio real
   - Google Cloud Console → agregar dominio a orígenes y redirect URIs

### Base de datos en producción
- **Vercel Postgres** — integración nativa
- **Railway** — simple y económico
- **Supabase** — tier gratuito generoso

---

## Fases de Desarrollo

- **Fase 1** ✅ — Sitio público + formulario de consulta + panel básico
- **Fase 2** — Panel completo (gestión de estados, notas, agenda, confirmación de turnos)
- **Fase 3** — Panel de administración (métricas, gestión de usuarios, CMS de contenido)
