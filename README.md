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

## Mapa de URLs y Funcionalidades

### SITIO PÚBLICO

---

#### `GET /`
**Archivo**: `src/app/(public)/page.tsx`

Página principal. Estructura:
- **Hero**: imagen de escritorio jurídico (`imagenMain.png`) con overlay oscuro, nombre de la abogada, credencial y botón "Hacer una consulta"
- **¿Cómo funciona?**: proceso en 3 pasos (Completá el formulario → Revisamos tu caso → Te contactamos)
- **Especialidades**: grid de 5 cards con ícono, nombre, descripción y link a `/especialidades/[slug]`
- **¿Por qué elegirnos?**: 4 atributos del estudio
- **CTA final**: botón "Hacer una consulta gratuita" → `/consulta`
- **Botón flotante WhatsApp**: fijo en esquina inferior derecha, abre `wa.me/5493513100760`

---

#### `GET /especialidades`
**Archivo**: `src/app/(public)/especialidades/page.tsx`

Listado de las 5 especialidades con SEO (metadata estática). Cada card muestra:
- Ícono SVG + nombre de la especialidad
- Descripción corta
- Lista de 3 problemas frecuentes
- Botón "Ver más información" → `/especialidades/[slug]`

Al pie: CTA "¿No encontrás tu problema? Hacé una consulta" → `/consulta`

---

#### `GET /especialidades/[slug]`
**Archivo**: `src/app/(public)/especialidades/[slug]/page.tsx`

Página dinámica por especialidad. Slugs disponibles:
- `derecho-real-sucesiones`
- `danos-accidentes`
- `familia`
- `previsional`
- `laboral`

Generada estáticamente con `generateStaticParams()`. Metadata dinámica por slug. Estructura:
- Breadcrumb + ícono + nombre
- Descripción larga de la especialidad
- Alert: "La información es orientativa, no reemplaza asesoramiento profesional"
- **Situaciones que atendemos**: grid 2 columnas de cards con problema + descripción
- **Preguntas Frecuentes**: sección expandible (si existen para esa especialidad)
- **CTA**: "¿Tenés un problema de [especialidad]?" → `/consulta?especialidad=[id]` (pre-filtra el paso 1 del formulario)

---

#### `GET /consulta`
**Archivo**: `src/app/(public)/consulta/page.tsx`

Formulario de consulta multi-paso. Incluye el componente `<ConsultaForm />` con Suspense fallback. Encabezado con alert "Esta consulta inicial es sin cargo". Nota legal al pie con link a `/legal/aviso`.

El formulario tiene 5 pasos (implementado en `src/components/forms/consulta-form.tsx`):

| Paso | Nombre | Contenido |
|------|--------|-----------|
| 1 | Tipo de problema | Selección de especialidad (radio) y situación (radio). Si viene con `?especialidad=X`, muestra solo esa especialidad |
| 2 | Descripción | Textarea libre + checkbox "Es urgente" |
| 3 | Datos de contacto | Nombre completo, email, teléfono, localidad |
| 4 | Turno (opcional) | Toggle "¿Querés solicitar un turno?". Si sí: modalidad (Presencial/Virtual), horario preferido (Mañana/Tarde), fecha preferida |
| 5 | Confirmación | Resumen completo + checkbox aceptación de términos → botón "Enviar consulta" |

Al enviar: hace `POST /api/consulta` y redirige a `/consulta/gracias`.

---

#### `GET /consulta/gracias`
**Archivo**: `src/app/(public)/consulta/gracias/page.tsx`

Página de confirmación post-envío:
- Check verde grande + "¡Consulta enviada!"
- Card "¿Qué sigue ahora?": 3 pasos (revisamos el caso → te contactamos en 24–48hs → coordinamos si es necesario)
- Card "¿Tenés alguna urgencia?": teléfono y email del estudio
- Botón "Volver al inicio" → `/`

---

#### `GET /contacto`
**Archivo**: `src/app/(public)/contacto/page.tsx`

Página de contacto:
- CTA principal: "Iniciá tu consulta online" → `/consulta`
- Grid 2 columnas: card WhatsApp (`wa.me/5493513100760`) y card Instagram (`instagram.com/rs.ejur`)
- Nota legal al pie

---

#### `GET /equipo`
**Archivo**: `src/app/(public)/equipo/page.tsx`

Página del equipo profesional (ruta existente, no enlazada en nav principal):
- Grid de cards por profesional: avatar, nombre, título, badges de especialidades, bio
- CTA "¿Querés consultarnos?" → `/consulta`
- Contenido estático desde `src/content/equipo.ts`

---

#### `GET /legal/aviso`
**Archivo**: `src/app/(public)/legal/aviso/page.tsx`

Aviso legal. Secciones:
- Alert "Importante"
- Naturaleza informativa del sitio
- No constituye relación profesional
- Limitaciones del contenido
- Recomendación de consulta profesional
- Responsabilidad y jurisdicción

---

#### `GET /legal/privacidad`
**Archivo**: `src/app/(public)/legal/privacidad/page.tsx`

Política de Privacidad (conforme Ley 25.326 Argentina). Secciones:
1. Responsable del tratamiento
2. Datos que se recopilan (nombre, email, teléfono, localidad, descripción del caso)
3. Finalidad del tratamiento
4. Base legal
5. Conservación de datos
6. Derechos del titular (acceso, rectificación, supresión)
7. Seguridad
8. Confidencialidad profesional
9. Modificaciones
10. Contacto

---

#### `GET /legal/terminos`
**Archivo**: `src/app/(public)/legal/terminos/page.tsx`

Términos y Condiciones. Secciones:
1. Uso del sitio
2. Información no vinculante
3. Formulario de consulta
4. Propiedad intelectual
5. Limitación de responsabilidad
6. Modificaciones
7. Legislación aplicable (Córdoba, Argentina)

---

### AUTENTICACIÓN

---

#### `GET /auth/login`
**Archivo**: `src/app/auth/login/page.tsx`

Página de acceso al panel profesional:
- Card centrada con ícono de balanza + "Panel de Profesionales"
- Botón "Continuar con Google" → dispara Server Action `signIn("google", { redirectTo: "/panel" })`
- Nota: "Solo usuarios autorizados por el estudio"

> **Importante**: solo pueden ingresar cuentas de Google autorizadas. Si el usuario logueado no tiene membresía en la organización, el panel no muestra datos.

---

#### `GET /auth/error`
**Archivo**: `src/app/auth/error/page.tsx`

Página de error de autenticación. Mensajes dinámicos según `?error=`:
- `Configuration` → error de configuración del servidor
- `AccessDenied` → cuenta no autorizada
- `Verification` → error de verificación
- (default) → error genérico

Botones: "Intentar de nuevo" → `/auth/login` y "Volver al inicio" → `/`

---

### PANEL CRM (requiere autenticación Google OAuth)

> Todas las rutas `/panel/*` están protegidas por `src/middleware.ts`. Si no hay sesión activa, redirige a `/auth/login`. Todas las queries están scopeadas por `organizacionId` del usuario logueado.

---

#### `GET /panel`
**Archivo**: `src/app/panel/page.tsx`

Dashboard principal con estadísticas en tiempo real:

**Stat cards (4)**:
| Card | Dato | Condición |
|------|------|-----------|
| Consultas Nuevas | Count estado NUEVA | — |
| En Análisis | Count estado EN_ANALISIS | — |
| Turnos Pendientes | Count turnos PENDIENTE | — |
| Urgentes | Count urgente=true | Fondo rojo si > 0 |

**Últimas Consultas**: tabla con las 5 más recientes. Columnas: nombre, descripción (truncada), estado (badge color), fecha. Botón "Ver" → `/panel/consultas/[id]`.

---

#### `GET /panel/consultas`
**Archivo**: `src/app/panel/consultas/page.tsx`

Listado completo de consultas ordenadas por urgencia y fecha. Cada card muestra:
- Nombre del contacto + badge "Urgente" (si aplica) + badge de estado (con color)
- Especialidad · tipo de problema
- Descripción (2 líneas)
- Email, teléfono, modalidad del turno solicitado
- Fecha de recepción + botón "Ver detalles" → `/panel/consultas/[id]`

**Estados posibles** (con colores):
| Estado | Color |
|--------|-------|
| NUEVA | Azul |
| EN_ANALISIS | Amarillo |
| CONTACTADO | Naranja |
| CONVERTIDO | Verde |
| CERRADO | Gris |

---

#### `GET /panel/consultas/[id]`
**Archivo**: `src/app/panel/consultas/[id]/page.tsx`
**Server Actions**: `src/app/panel/consultas/[id]/actions.ts`

Vista detallada de una consulta. Layout 2 columnas:

**Columna principal (2/3 del ancho)**:

1. **Breadcrumb**: Consultas / Nombre del contacto
2. **Encabezado**: nombre, badge urgente, estado actual
3. **Descripción del caso** (card):
   - Grid: Especialidad, Tipo de problema, Prioridad, Fecha recibida
   - Texto completo del caso (fondo secondary)
4. **Turno** (card, si fue solicitado):
   - Modalidad (Presencial / Virtual)
   - Horario preferido (Mañana / Tarde)
   - Fecha preferida
   - Si está **pendiente**: formulario para confirmar (campo fecha+hora, campo link videollamada opcional) con botones "Confirmar" y "Rechazar"
   - Si está **confirmado**: muestra fecha+hora confirmada y link de videollamada (si aplica)
   - Si está **rechazado**: muestra motivo del rechazo
5. **Notas internas** (card):
   - Formulario: textarea + select tipo (General / Llamada / Reunión / Seguimiento) + botón "Agregar nota"
   - Lista de notas con: autor, tipo (badge), fecha, contenido

**Columna lateral (1/3 del ancho)**:

1. **Datos del contacto** (card):
   - Nombre, email (mailto:), teléfono (tel:), localidad
   - Badge "Cliente" si `esCliente=true`
2. **Gestión de estado** (card):
   - Select con los 5 estados + botón "Actualizar estado" (Server Action)
   - Muestra profesional asignado (si hay)
3. **Historial de eventos** (card):
   - Timeline cronológico append-only (`ConsultaEvento`)
   - Eventos: CREATED, STATE_CHANGED, ASSIGNED, NOTE_ADDED, APPOINTMENT_CONFIRMED, APPOINTMENT_REJECTED
   - Cada evento: tipo, cambio de estado, autor, fecha

**Server Actions disponibles**:

| Acción | Qué hace | Efecto en BD |
|--------|----------|--------------|
| `cambiarEstado` | Cambia el estado de la consulta | Actualiza `Consulta.estado` + crea `ConsultaEvento` STATE_CHANGED |
| `agregarNota` | Agrega nota interna | Crea `Nota` + crea `ConsultaEvento` NOTE_ADDED |
| `confirmarTurno` | Confirma turno con fecha y link | Actualiza `Turno.estado=CONFIRMADO`, guarda `fechaConfirmada` y `linkVideoCall` + evento + encola email `turno-confirmado` |
| `rechazarTurno` | Rechaza turno con motivo | Actualiza `Turno.estado=RECHAZADO`, guarda `motivoRechazo` + evento |

Todos los Server Actions validan sesión, scopean por organización y llaman `revalidatePath()` al terminar.

---

#### `GET /panel/turnos`
**Archivo**: `src/app/panel/turnos/page.tsx`

Listado de turnos ordenados por estado y fecha preferida. Cada card:
- Nombre del contacto + ícono modalidad (Presencial/Virtual) + estado (badge)
- Fecha preferida + horario preferido
- Si confirmado: fecha y hora confirmada (fondo verde)
- Email y teléfono del contacto
- Botón "Ver consulta" → `/panel/consultas/[consultaId]`

---

#### `GET /panel/reestructuracion`
**Archivo**: `src/app/panel/reestructuracion/page.tsx`

Listado de casos CRP con KPIs superiores:

**KPIs (4 cards)**:
| Card | Dato |
|------|------|
| Casos activos | Count estados activos |
| Deuda total | Suma monto total declarado |
| Con alertas | Count casos con alertas pendientes |
| Sin movimiento | Count con última actividad > 30 días |

Tabla de casos: número, cliente, estado, deuda total, última actividad. Botón "Ver" → `/panel/reestructuracion/[id]`.

---

#### `GET /panel/reestructuracion/nuevo`
**Archivo**: `src/app/panel/reestructuracion/nuevo/page.tsx`
**Server Action**: `src/app/panel/reestructuracion/nuevo/actions.ts`

Formulario de alta de nuevo caso CRP. Campos:
- Datos del cliente (nombre, email, teléfono, CUIT)
- Tipo de deuda predominante
- Monto total declarado
- Descripción del caso

Server Action `crearCasoCRP`: crea `CRPCaso` con número autoincremental (`CRP-YYYY-NNNN`), vincula o crea `Contacto`, redirige a detalle.

---

#### `GET /panel/reestructuracion/[id]`
**Archivo**: `src/app/panel/reestructuracion/[id]/page.tsx`
**Server Actions**: `src/app/panel/reestructuracion/[id]/actions.ts`

Vista detallada del caso CRP con 8 tabs navegables via `?tab=`:

| Tab | Contenido |
|-----|-----------|
| `resumen` | Datos generales, estado, resumen financiero, alertas activas |
| `pasivos` | Lista de deudas del cliente (AFIP, bancos, proveedores, etc.) |
| `patrimonio` | Bienes del cliente (inmuebles, vehículos, cuentas, etc.) |
| `financiero` | Análisis de capacidad de pago, ingresos, egresos |
| `escenarios` | Comparativa de escenarios de reestructuración |
| `intervenciones` | Historial de intervenciones del estudio en el caso |
| `honorarios` | Referencia arancelaria Ley 9459 (Córdoba) — escala Art. 36 en Jus, tabla por tipo de trámite |
| `alertas` | Alertas activas del caso con severidad y acción sugerida |

**Server Actions del módulo CRP**:
- `actualizarEstadoCRP` — cambia estado del caso
- `agregarPasivo` — registra nueva deuda
- `agregarBienPatrimonial` — registra nuevo bien
- `agregarIntervenccion` — registra intervención del estudio
- `agregarEscenario` — agrega escenario de reestructuración

---

### API ROUTES

---

#### `POST /api/consulta`
**Archivo**: `src/app/api/consulta/route.ts`

Endpoint receptor del formulario público. Cuerpo esperado: JSON validado por `consultaConTurnoSchema` (Zod).

Flujo:
1. Valida el body con Zod
2. Obtiene `DEFAULT_ORGANIZATION_ID` del env
3. Find-or-create `Contacto` por email dentro de la organización
4. Crea `Consulta` vinculada al contacto
5. Registra evento `CREATED` en `ConsultaEvento` (audit log inmutable)
6. Si `solicitaTurno=true`: crea `Turno` con modalidad, fechaPreferida y horarioPreferido
7. Encola 2 emails en `EmailCola`:
   - `nueva-consulta-admin` → email del estudio (prioridad 1 si urgente, 5 si normal)
   - `confirmacion-cliente` → email del cliente (prioridad 3)
8. Retorna `201 { id: consultaId }`

Errores: `400` con detalle de validación Zod, `500` si falta config de env o error de BD.

---

#### `POST /api/email-worker`
**Archivo**: `src/app/api/email-worker/route.ts`

Worker de procesamiento de la cola de emails. Debe llamarse periódicamente (cron o manual).

Autenticación: verifica header `x-cron-token` contra `CRON_SECRET` del env. Si `CRON_SECRET` no está configurado (desarrollo), acepta cualquier request.

Flujo por llamada:
1. Busca hasta 10 emails con `estado=PENDIENTE` y `proximoIntento <= ahora`
2. Ordena por `prioridad ASC`, `createdAt ASC`
3. Para cada email:
   - Marca como `PROCESANDO`
   - Despacha via template (`nueva-consulta-admin`, `confirmacion-cliente`, `turno-confirmado`)
   - Éxito → marca `ENVIADO`, incrementa intentos
   - Fallo → calcula backoff exponencial, actualiza `proximoIntento`:
     - Intento 1 → reintenta en 5 min
     - Intento 2 → reintenta en 15 min
     - Intento 3 → reintenta en 45 min
     - Agotados 3 intentos → marca `FALLIDO`
4. Retorna `{ procesados: N, fallidos: N, ids: { procesados: [...], fallidos: [...] } }`

Ejecutar manualmente (con servidor corriendo):
```bash
npm run email:process
```

---

#### `GET|POST /api/auth/[...nextauth]`
**Archivo**: `src/app/api/auth/[...nextauth]/route.ts`

Manejador de NextAuth v5. Re-exporta los handlers de `src/lib/auth.ts`. Gestiona todo el flujo OAuth de Google:
- `GET /api/auth/signin/google` — inicia OAuth
- `GET /api/auth/callback/google` — callback con código de Google, crea/actualiza `Usuario` en BD
- `GET /api/auth/session` — retorna sesión activa (JWT)
- `POST /api/auth/signout` — cierra sesión

---

## Flujo Completo de una Consulta

```
Cliente completa /consulta (5 pasos)
         ↓
POST /api/consulta
  → Crea/encuentra Contacto
  → Crea Consulta + evento CREATED
  → Crea Turno (si solicitó)
  → Encola emails (nueva-consulta-admin + confirmacion-cliente)
         ↓
Cliente ve /consulta/gracias
         ↓
npm run email:process (POST /api/email-worker)
  → Envía email al estudio (notificación nueva consulta)
  → Envía email al cliente (confirmación de recepción)
         ↓
Abogada ve /panel/consultas → selecciona consulta
  → Cambia estado (NUEVA → EN_ANALISIS → CONTACTADO...)
  → Agrega notas internas
  → Confirma turno (si había) → encola email turno-confirmado
         ↓
npm run email:process
  → Envía email al cliente con fecha y link de videollamada
```

---

## Modelo de Base de Datos (v2.0)

```
Organizacion          — Tenant raíz (multi-tenant)
OrganizacionMiembro   — Rol de usuario por org (OWNER/ADMIN/PROFESIONAL/ASISTENTE)
Usuario               — Profesionales y admin (Google OAuth)
Contacto              — Persona que consulta (1 → N consultas, deduplicado por email)
Consulta              — Caso/Inquiry (pertenece a Contacto y Organización)
ConsultaAsignacion    — Historial de asignaciones a profesionales
ConsultaEvento        — Audit log append-only (inmutable, no se edita ni borra)
Turno                 — Turno 1:1 asociado a Consulta
Nota                  — Notas internas por consulta (visibles solo en panel)
EmailCola             — Cola de emails desacoplada de los requests
BloqueoHorario        — Bloqueos de agenda por profesional
Configuracion         — Key/value por organización
Especialidad          — Especialidades (preparado para CMS futuro)
```

### Modelos CRP — Reestructuración de Pasivos (migración `20260226234026`)

```
CRPCaso               — Caso de reestructuración (número CRP-YYYY-NNNN, estado, tipo deuda)
CRPPasivo             — Deuda individual del cliente (acreedor, monto, tipo, estado)
CRPBienPatrimonial    — Bien del cliente (inmueble, vehículo, cuenta, etc.)
CRPAnalisisFinanciero — Ingresos/egresos mensuales del cliente
CRPEscenario          — Escenario de reestructuración propuesto
CRPEscenarioCuota     — Detalle de cuotas por escenario
CRPIntervencion       — Intervención del estudio en el caso
CRPAlerta             — Alerta generada automáticamente o manual
CRPHonorarioRegistro  — Registro de honorarios devengados por tipo de trámite
```

**Estados de consulta**: `NUEVA → EN_ANALISIS → CONTACTADO → CONVERTIDO → CERRADO`

**Estados de turno**: `PENDIENTE → CONFIRMADO | RECHAZADO → COMPLETADO | CANCELADO`

**Estados de email**: `PENDIENTE → PROCESANDO → ENVIADO | FALLIDO`

---

## Templates de Email

| Template | Disparador | Destinatario | Contenido |
|----------|-----------|--------------|-----------|
| `nueva-consulta-admin` | Nueva consulta enviada | Estudio (ESTUDIO_EMAIL) | Datos del contacto, especialidad, descripción del caso, si hay turno |
| `confirmacion-cliente` | Nueva consulta enviada | Cliente | Confirmación de recepción, resumen de su consulta, próximos pasos |
| `turno-confirmado` | Turno confirmado desde panel | Cliente | Fecha y hora confirmada, modalidad, link de videollamada (si virtual) |

---

## Identidad Visual

### Marca
- **Nombre**: Romina Belén Sanchez — Abogada · Estudio Jurídico
- **Monograma**: RS (círculo con borde rose/mauve, letras gold)
- **Tipografía display**: Cormorant Garamond (headings, títulos)
- **Tipografía body**: Inter

### Paleta de Colores (OKLCH)
| Rol | Token CSS | Color |
|-----|-----------|-------|
| Botones / acción principal | `--primary` | Gold oscuro `oklch(0.48 0.090 68)` |
| Fondos de sección / hero | `--secondary` | Gold suave `oklch(0.88 0.032 72)` |
| Íconos / detalles / monograma | `--accent` | Rose/mauve `oklch(0.52 0.070 8)` |
| Canvas general | `--background` | Blanco cálido `oklch(0.975 0.004 55)` |

### Componentes Globales
- **Header sticky**: monograma RS + nombre del estudio + nav (Inicio, Especialidades, Contacto) + CTA "Consultar"
- **Footer oscuro**: identidad, links de especialidades, navegación, páginas legales, Instagram y WhatsApp
- **Botón flotante WhatsApp**: verde `#25D366`, fijo en esquina inferior derecha en todas las páginas públicas

### Redes Sociales
- Instagram: https://www.instagram.com/rs.ejur/
- WhatsApp: https://wa.me/5493513100760

---

## Estructura del Proyecto

```
src/
├── app/
│   ├── (public)/                # Sitio público (con Header + Footer via layout)
│   │   ├── layout.tsx           # Wrapper: Header + main + Footer
│   │   ├── page.tsx             # Home
│   │   ├── especialidades/
│   │   │   ├── page.tsx         # Listado de especialidades
│   │   │   └── [slug]/page.tsx  # Detalle por especialidad (estático)
│   │   ├── consulta/
│   │   │   ├── page.tsx         # Formulario 5 pasos
│   │   │   └── gracias/page.tsx # Confirmación post-envío
│   │   ├── contacto/page.tsx
│   │   ├── equipo/page.tsx
│   │   └── legal/
│   │       ├── aviso/page.tsx
│   │       ├── privacidad/page.tsx
│   │       └── terminos/page.tsx
│   ├── panel/                   # Panel CRM (protegido por NextAuth)
│   │   ├── layout.tsx           # Nav lateral + header usuario + nav móvil
│   │   ├── page.tsx             # Dashboard con estadísticas + alertas CRP
│   │   ├── consultas/
│   │   │   ├── page.tsx         # Listado de consultas
│   │   │   └── [id]/
│   │   │       ├── page.tsx     # Detalle 2 columnas
│   │   │       └── actions.ts   # Server Actions (estado, nota, turno)
│   │   ├── turnos/page.tsx      # Listado de turnos
│   │   └── reestructuracion/    # Módulo CRP
│   │       ├── page.tsx         # Listado + KPIs
│   │       ├── nuevo/
│   │       │   ├── page.tsx     # Formulario nuevo caso
│   │       │   └── actions.ts   # Server Action crearCasoCRP
│   │       └── [id]/
│   │           ├── page.tsx     # Detalle 8 tabs (?tab=)
│   │           └── actions.ts   # Server Actions CRP
│   ├── auth/
│   │   ├── login/page.tsx       # Login con Google
│   │   └── error/page.tsx       # Errores de auth
│   ├── api/
│   │   ├── auth/[...nextauth]/route.ts  # NextAuth handlers
│   │   ├── consulta/route.ts            # Receptor del formulario público
│   │   └── email-worker/route.ts        # Worker de cola de emails
│   ├── globals.css              # Paleta OKLCH + configuración Tailwind v4
│   └── layout.tsx               # Root layout + botón flotante WhatsApp
├── components/
│   ├── ui/                      # shadcn/ui (Button, Card, Input, Select, etc.)
│   ├── forms/
│   │   └── consulta-form.tsx    # Formulario multi-paso con React Hook Form + Zod
│   ├── panel/
│   │   └── nav-links.tsx        # Client component: SidebarNavLinks + MobileNavLinks (usePathname)
│   └── layout/
│       ├── header.tsx           # Nav principal + monograma RS
│       └── footer.tsx           # Footer oscuro
├── content/                     # Contenido estático (TypeScript puro)
│   ├── especialidades.ts        # 5 especialidades con descripción, problemas y FAQ
│   └── equipo.ts                # Profesionales del estudio
├── lib/
│   ├── auth.ts                  # NextAuth v5 config, JWT, helpers (puedeAdministrar)
│   ├── crp-utils.ts             # Módulo CRP: labels, colores, escala arancelaria, alertas
│   ├── db.ts                    # Prisma client singleton (evita múltiples instancias en dev)
│   ├── email.ts                 # Funciones de envío payload-based (sin tipos Prisma)
│   ├── utils.ts                 # cn() helper (clsx + tailwind-merge)
│   └── validators.ts            # Schemas Zod del formulario de consulta
├── middleware.ts                # Protección de rutas /panel (redirige a /auth/login)
docs/
├── manual-usuario.md            # Manual completo del sistema (flujos, panel, CRP)
└── whatsapp-business-setup.md   # Guía de configuración WhatsApp Business App
prisma/
├── schema.prisma                # Modelos BD v2.0 + modelos CRP
├── seed.ts                      # Seed: crea organización y usuario admin inicial
└── migrations/                  # Historial de migraciones
    └── 20260226234026_crp_reestructuracion_pasivos/
```

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

# Datos del estudio (aparecen en emails y footer)
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

> **Nota**: `DEFAULT_ORGANIZATION_ID` debe estar en `.env` antes de arrancar el servidor — no hay hot-reload para variables de entorno.

### 3. Configurar Google OAuth

1. [Google Cloud Console](https://console.cloud.google.com/) → crear proyecto
2. APIs y Servicios → Habilitar Google+ API
3. Credenciales → OAuth 2.0 → Aplicación web:
   - Origen autorizado: `http://localhost:3000`
   - URI de redirección: `http://localhost:3000/api/auth/callback/google`

### 4. Gmail App Password

1. Google Account → Seguridad → Verificación en 2 pasos → Contraseñas de aplicaciones
2. Generar para "Correo" → copiar a `SMTP_PASSWORD`

### 5. Inicializar base de datos

```bash
npm run db:push    # Crea las tablas (development)
npm run db:seed    # Crea organización y admin inicial
```

El seed imprime el `DEFAULT_ORGANIZATION_ID` — copiarlo al `.env` y **reiniciar el servidor**.

### 6. Desarrollo

```bash
npm run dev
```

Abrir [http://localhost:3000](http://localhost:3000)

---

## Comandos

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en `localhost:3000` |
| `npm run build` | Build de producción (`prisma generate` incluido) |
| `npm run start` | Servidor de producción |
| `npm run db:generate` | Generar cliente Prisma (requiere detener el servidor en Windows) |
| `npm run db:push` | Sincronizar schema con BD (development) |
| `npm run db:migrate` | Crear migración formal (producción) |
| `npm run db:seed` | Ejecutar seed inicial |
| `npm run db:studio` | Abrir Prisma Studio (UI visual de la BD) |
| `npm run email:process` | Disparar el worker de emails manualmente |

---

## Personalización de Contenido

### Especialidades
Editar `src/content/especialidades.ts` — cada especialidad define: nombre, slug, ícono, descripción corta/larga, lista de problemas (opciones del formulario) y preguntas frecuentes.

### Paleta de colores
Editar `src/app/globals.css` — sistema OKLCH en `:root`. Tailwind v4 mapea los CSS vars a utilities via `@theme inline`.

### Datos de contacto
WhatsApp e Instagram están en `src/components/layout/header.tsx`, `src/components/layout/footer.tsx` y `src/app/layout.tsx` (botón flotante).

### Emails del estudio y admin
Configurar `ESTUDIO_EMAIL` y `ADMIN_EMAIL` en `.env`.

---

## Deploy en Vercel

1. Importar repositorio en [vercel.com](https://vercel.com)
2. Configurar todas las variables de entorno del `.env`
3. Actualizar para producción:
   - `NEXTAUTH_URL` → dominio real
   - `CRON_SECRET` → token seguro (string aleatorio largo)
   - Google Cloud Console → agregar dominio real a orígenes y redirect URIs

### Worker de emails en producción

Agregar `vercel.json` en la raíz:

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

Y configurar el header del cron con `x-cron-token: <CRON_SECRET>` desde la configuración de Vercel Cron Jobs.

---

## Documentación

| Archivo | Descripción |
|---------|-------------|
| `docs/manual-usuario.md` | Manual completo del sistema: sitio público, panel CRM, módulo CRP (8 tabs), flujos de trabajo, estados, honorarios Ley 9459, FAQ |
| `docs/whatsapp-business-setup.md` | Guía de configuración WhatsApp Business App: perfil, mensaje de bienvenida/ausencia, 7 respuestas rápidas, etiquetas, catálogo |

---

## Fases de Desarrollo

- **Fase 1** ✅ — Sitio público completo + formulario de consulta + identidad visual RS
- **Fase 2** ✅ — Legal CRM v2.0: schema multi-tenant, panel completo, flujo Contacto→Consulta→Turno, Server Actions, cola de emails con backoff exponencial
- **Fase 2.5** ✅ — Módulo CRP: Reestructuración de Pasivos (9 modelos BD, 3 rutas, 8 tabs, referencia arancelaria Ley 9459); QA UI panel (labels semánticos, nav activo); responsive público (hero mobile, stepper)
- **Fase 3** — Panel de administración: métricas/embudo, gestión de usuarios del equipo, CMS de contenido, calendario de turnos con disponibilidad
