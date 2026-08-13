# Deployment y Servicios Externos — Estudio Jurídico RS

**Última actualización:** Marzo 2026

---

## Resumen del estado actual

| Servicio | Estado |
|----------|--------|
| Sitio en producción | ✅ Activo en Vercel |
| Dominio www | ✅ `www.rsestudiojuridico.com.ar` propagado |
| Dominio apex | ⚠️ `rsestudiojuridico.com.ar` — verificar propagación |
| Emails automáticos | ✅ Funcionando (Gmail SMTP + cron-job.org) |
| Login Google OAuth | ✅ Configurado para producción |
| Google Search Console | ✅ Verificado + sitemap enviado |
| Google Business Profile | ⏳ Creado — pendiente verificación |
| WhatsApp Business | ⏳ App instalada — pendiente configurar mensajes automáticos |

---

## Vercel

- **URL panel:** https://vercel.com/dashboard
- **Proyecto:** estudio-juridico (o similar)
- **Plan:** Hobby
- **Deploy:** automático al hacer push a `master` en GitHub
- **Variables de entorno:** configuradas en Settings → Environment Variables

### Variables de entorno en Vercel

```
DATABASE_URL          # Neon PostgreSQL connection string
NEXTAUTH_SECRET       # string aleatorio largo
NEXTAUTH_URL          # https://www.rsestudiojuridico.com.ar
GOOGLE_CLIENT_ID      # desde Google Cloud Console
GOOGLE_CLIENT_SECRET  # desde Google Cloud Console
SMTP_HOST             # smtp.gmail.com
SMTP_PORT             # 587
SMTP_USER             # cuenta Gmail del estudio
SMTP_PASSWORD         # contraseña de aplicación Gmail (no la contraseña normal)
SMTP_FROM             # dirección "De:" en los emails
ESTUDIO_NOMBRE        # Estudio Jurídico RS
ESTUDIO_EMAIL         # email del estudio
ESTUDIO_TELEFONO      # +54 351 8916246
ESTUDIO_DIRECCION     # Alta Gracia, Córdoba, Argentina
ADMIN_EMAIL           # email del admin principal
DEFAULT_ORGANIZATION_ID  # ID de la organización en BD (ver tabla Organizacion en Neon)
CRON_SECRET           # (opcional) token para proteger /api/email-worker
```

### Limitaciones Hobby plan
- Crons internos solo soportan frecuencia mínima de 1 hora (`0 * * * *`)
- Para crons más frecuentes usar servicio externo (cron-job.org)

---

## Dominio — NIC.ar

- **Registrador:** NIC.ar
- **Dominio:** `rsestudiojuridico.com.ar`
- **Nameservers configurados:** los de Vercel (ej: `ns1.vercel-dns.com`, `ns2.vercel-dns.com`)
- **Nota DNS:** el apex domain puede tardar hasta 48hs en propagar completamente

---

## Base de Datos — Neon

- **Consola:** https://console.neon.tech
- **Motor:** PostgreSQL
- **Esquema gestionado con Prisma** — `prisma/schema.prisma`

### Agregar nuevo usuario administrador

Ejecutar las siguientes queries en la consola SQL de Neon:

```sql
-- Query 1: Crear usuario
INSERT INTO "Usuario" (id, email, nombre, rol, activo, "createdAt", "updatedAt")
VALUES (
  gen_random_uuid(),
  'EMAIL_AQUI',
  'NOMBRE_AQUI',
  'ADMIN',
  true,
  now(),
  now()
);

-- Query 2: Agregar a la organización
INSERT INTO "OrganizacionMiembro" (id, "organizacionId", "usuarioId", rol, activo, "createdAt")
SELECT
  gen_random_uuid(),
  (SELECT id FROM "Organizacion" LIMIT 1),
  id,
  'ADMIN',
  true,
  now()
FROM "Usuario"
WHERE email = 'EMAIL_AQUI';
```

> Reemplazar `EMAIL_AQUI` y `NOMBRE_AQUI`. El usuario se autentica con Google OAuth — la primera vez que ingresa al panel con ese email queda vinculado.

### Usuarios activos
| Email | Nombre | Rol |
|-------|--------|-----|
| rsestudiojur@gmail.com | Romina Belén Sanchez | ADMIN |

---

## Sistema de Email — Gmail SMTP

- **Cuenta:** configurada en variables de entorno (`SMTP_USER`)
- **Tipo de contraseña:** "Contraseña de aplicación" de Google (no la contraseña normal)
  - Se genera en: Google Account → Seguridad → Verificación en 2 pasos → Contraseñas de aplicación
- **Templates activos:**
  - `nueva-consulta-admin` → notifica al estudio de nueva consulta
  - `confirmacion-cliente` → confirma recepción al cliente
  - `turno-confirmado` → notifica al cliente que el turno fue confirmado

### Cola de emails (EmailCola)
Los emails se encolan primero en la BD y luego el worker los procesa. Si hay problemas:
1. Verificar en Neon → tabla `EmailCola` si hay registros en estado `PENDIENTE` o `FALLIDO`
2. Disparar el worker manualmente: `POST https://www.rsestudiojuridico.com.ar/api/email-worker`
3. Si el estado es `FALLIDO`, revisar el campo `errorUltimo`

---

## Cron — cron-job.org

- **URL:** https://cron-job.org
- **Job configurado:** POST a `https://www.rsestudiojuridico.com.ar/api/email-worker`
- **Frecuencia:** cada 15 minutos
- **Header:** `x-cron-token: [valor de CRON_SECRET]` (si está configurado en Vercel)
- **Respuesta esperada:** HTTP 200 con JSON `{ procesados: N, fallidos: M }`

> **Por qué cron-job.org:** Vercel Hobby plan no soporta crons con frecuencia menor a 1 hora.
> El archivo `vercel.json` tiene `*/5 * * * *` como referencia pero en Hobby plan no ejecuta.

---

## Google OAuth — Google Cloud Console

- **Consola:** https://console.cloud.google.com
- **Proyecto:** estudio-juridico (o similar)
- **Authorized JavaScript origins:**
  - `https://rsestudiojuridico.com.ar`
  - `https://www.rsestudiojuridico.com.ar`
- **Authorized redirect URIs:**
  - `https://rsestudiojuridico.com.ar/api/auth/callback/google`
  - `https://www.rsestudiojuridico.com.ar/api/auth/callback/google`

> El login funciona con cualquier cuenta Google. El acceso al panel está controlado por si el email existe en la tabla `Usuario` de la BD.

---

## Google Search Console

- **Consola:** https://search.google.com/search-console
- **Propiedad verificada:** `rsestudiojuridico.com.ar` (via TXT en DNS)
- **Sitemap enviado:** `https://www.rsestudiojuridico.com.ar/sitemap.xml` ✅
- **Archivo fuente:** `src/app/sitemap.ts`

> La indexación completa puede tardar días o semanas. Revisar en Search Console → Cobertura para ver el progreso.

---

## Google Business Profile

- **Consola:** https://business.google.com
- **Nombre:** Estudio Jurídico RS
- **Categoría:** Abogado
- **Dirección:** Dino Carignani 275, X5186HDD Alta Gracia, Córdoba
- **Teléfono:** 0351 891-6246
- **Sitio web:** https://www.rsestudiojuridico.com.ar/
- **Estado:** ⏳ Pendiente de verificación

### Para verificar el perfil
Requiere estar físicamente en el estudio. Opciones que puede ofrecer Google:
1. **Videollamada** (más rápido) — mostrar fachada + interior + documento del negocio
2. **Video grabado** — subir video de la fachada e interior
3. **Correo postal** — tarjeta con PIN llega en 1-2 semanas

Una vez verificado, el estudio aparece en Google Maps y en búsquedas locales de Alta Gracia.

---

## WhatsApp Business

- **Número:** +54 9 351 310-0760
- **App:** instalada en iPhone (eSIM secundaria)
- **Estado:** ⏳ Pendiente configurar mensajes automáticos y respuestas rápidas

Ver guía completa en `docs/whatsapp-business-setup.md`

### Pendiente configurar
- [ ] Mensaje de bienvenida automático
- [ ] Mensaje de ausencia con horarios
- [ ] Respuestas rápidas: `/turno`, `/honorarios`, `/virtual`, `/presencial`, `/info`, `/ok`, `/noasesoramiento`
- [ ] Etiquetas: Nueva consulta / En seguimiento / Turno coordinado / Urgente / Cerrado
- [ ] Foto de perfil profesional
- [ ] Catálogo de especialidades (opcional)

---

## Sitio Público — URLs importantes

| Ruta | Descripción |
|------|-------------|
| `/` | Home |
| `/especialidades` | Listado de especialidades |
| `/especialidades/[slug]` | Detalle (5 slugs estáticos) |
| `/consulta` | Formulario de consulta (5 pasos) |
| `/consulta/gracias` | Confirmación post-envío |
| `/contacto` | Datos de contacto |
| `/sitemap.xml` | Sitemap para Google |

## Panel CRM — URLs importantes

| Ruta | Descripción |
|------|-------------|
| `/panel` | Dashboard con alertas CRP |
| `/panel/consultas` | Listado de consultas |
| `/panel/consultas/[id]` | Detalle + acciones |
| `/panel/turnos` | Listado de turnos |
| `/panel/reestructuracion` | Módulo CRP — listado |
| `/panel/reestructuracion/nuevo` | Crear caso CRP |
| `/panel/reestructuracion/[id]` | Detalle caso CRP (8 tabs) |
| `/auth/login` | Login con Google |

---

*Documento generado para continuidad del proyecto. Actualizar cuando cambien servicios o credenciales.*
