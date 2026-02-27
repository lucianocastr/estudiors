# Manual de Usuario — Sistema de Gestión RBS Estudio Jurídico

**Versión:** 2.0
**Fecha:** Febrero 2026
**Estudio:** Romina Belén Sanchez — Abogada · Alta Gracia, Córdoba

---

## Índice

1. [Sitio público](#1-sitio-público)
   - 1.1 [Navegación general](#11-navegación-general)
   - 1.2 [Formulario de consulta](#12-formulario-de-consulta-online)
   - 1.3 [Especialidades](#13-especialidades)
   - 1.4 [Contacto y redes](#14-contacto-y-redes)
2. [Acceso al Panel CRM](#2-acceso-al-panel-crm)
3. [Dashboard](#3-dashboard)
4. [Módulo Consultas](#4-módulo-consultas)
   - 4.1 [Listado de consultas](#41-listado-de-consultas)
   - 4.2 [Detalle de consulta](#42-detalle-de-consulta)
   - 4.3 [Estados de consulta](#43-estados-de-consulta)
   - 4.4 [Gestión de turnos desde la consulta](#44-gestión-de-turnos-desde-la-consulta)
   - 4.5 [Notas internas](#45-notas-internas)
5. [Módulo Turnos](#5-módulo-turnos)
6. [Módulo Reestructuración de Pasivos (CRP)](#6-módulo-reestructuración-de-pasivos-crp)
   - 6.1 [Crear un caso CRP](#61-crear-un-caso-crp)
   - 6.2 [Detalle del caso — Tabs](#62-detalle-del-caso--tabs)
   - 6.3 [Tab Resumen](#63-tab-resumen)
   - 6.4 [Tab Pasivos](#64-tab-pasivos--deudas-bancarias)
   - 6.5 [Tab Activos](#65-tab-activos--patrimonio)
   - 6.6 [Tab Análisis Financiero](#66-tab-análisis-financiero)
   - 6.7 [Tab Escenarios](#67-tab-escenarios-estratégicos)
   - 6.8 [Tab Intervenciones](#68-tab-intervenciones)
   - 6.9 [Tab Honorarios](#69-tab-honorarios)
   - 6.10 [Tab Alertas](#610-tab-alertas)
   - 6.11 [Estados de caso CRP](#611-estados-de-caso-crp)
   - 6.12 [Sistema de alertas automáticas](#612-sistema-de-alertas-automáticas)
7. [Flujos principales de trabajo](#7-flujos-principales-de-trabajo)
8. [Preguntas frecuentes](#8-preguntas-frecuentes)

---

## 1. Sitio Público

El sitio público (`/`) es la cara visible del estudio hacia los potenciales clientes. No requiere autenticación.

### 1.1 Navegación general

La barra de navegación tiene dos niveles:

- **Barra superior (gris):** datos de contacto rápido — ubicación (Alta Gracia, Córdoba), WhatsApp directo y acceso a Instagram.
- **Barra principal:** logo RS del estudio, links de navegación (Inicio, Especialidades) y botón **"Consultar"** que lleva al formulario de consulta online.

En dispositivos móviles, la navegación se colapsa en un menú hamburguesa.

### 1.2 Formulario de consulta online

**Ruta:** `/consulta`

El formulario tiene **5 pasos** guiados:

| Paso | Contenido |
|------|-----------|
| 1 | **Datos personales:** nombre completo, email, teléfono |
| 2 | **Especialidad:** selección del área legal (Derecho Real, Daños, Familia, Previsional, Laboral) |
| 3 | **Descripción:** tipo de problema y descripción libre del caso |
| 4 | **Turno:** preferencia de fecha y modalidad (presencial/virtual) |
| 5 | **Confirmación:** resumen y envío |

Al completar el formulario y enviarlo:
- Se crea automáticamente el **Contacto** en la base de datos
- Se registra la **Consulta** con estado "Nueva"
- Se registra el **Turno solicitado**
- Se envía un **email de confirmación** al cliente
- Se envía una **notificación al administrador** del estudio
- El usuario es redirigido a `/consulta/gracias`

### 1.3 Especialidades

**Ruta:** `/especialidades`

Lista las 5 áreas de práctica del estudio. Cada especialidad tiene una página individual (`/especialidades/[slug]`) con descripción detallada, casos típicos y un botón de consulta directa.

Especialidades disponibles:
- Derecho Real y Sucesiones
- Daños y Accidentes
- Derecho de Familia
- Derecho Previsional
- Derecho Laboral

### 1.4 Contacto y redes

- **WhatsApp flotante:** botón verde fijo en la esquina inferior derecha en todas las páginas. Clic directo para iniciar conversación.
- **Instagram:** link en la barra superior y en el footer.
- **Página de contacto:** `/contacto` con formulario de contacto general.

---

## 2. Acceso al Panel CRM

**Ruta:** `/auth/login`

El acceso al panel es exclusivo para el equipo del estudio. Se utiliza **Google OAuth** (inicio de sesión con cuenta de Google). No hay formulario de usuario/contraseña.

**Pasos para ingresar:**
1. Ir a `/panel` (el sistema redirige a `/auth/login` automáticamente)
2. Hacer clic en **"Iniciar sesión con Google"**
3. Seleccionar la cuenta de Google autorizada
4. Ser redirigido al Dashboard

> **Importante:** Solo cuentas de Google previamente registradas en el sistema pueden acceder. Si aparece un error, contactar al administrador.

**Roles disponibles:**
- **Administrador (OWNER/ADMIN):** acceso total
- **Profesional:** acceso al panel de gestión
- **Asistente:** acceso limitado

Para cerrar sesión: botón **"Salir"** en la esquina superior derecha del panel.

---

## 3. Dashboard

**Ruta:** `/panel`

Página de inicio del panel. Muestra un resumen del estado actual del estudio.

### Tarjetas de estadísticas (4 KPIs)

| Tarjeta | Qué muestra |
|---------|-------------|
| **Consultas Nuevas** | Cantidad de consultas sin revisar todavía |
| **En Análisis** | Consultas activas siendo trabajadas |
| **Turnos Pendientes** | Turnos solicitados que aún no fueron confirmados |
| **Urgentes** | Consultas marcadas como urgentes y no cerradas (se resalta en rojo si hay alguna) |

### Widget Alertas — Reestructuración

Si existen alertas pendientes de casos CRP, aparece un panel naranja con hasta 5 alertas ordenadas por prioridad. Cada alerta es clickeable y lleva directamente al tab de alertas del caso correspondiente.

### Últimas Consultas

Lista las 5 consultas más recientes. Muestra nombre del contacto, descripción resumida, fecha y estado actual. El botón **"Ver"** lleva al detalle de esa consulta.

---

## 4. Módulo Consultas

### 4.1 Listado de consultas

**Ruta:** `/panel/consultas`

Muestra **todas las consultas** de la organización ordenadas por urgencia (primero) y luego por fecha descendente (más recientes primero).

Cada card de consulta muestra:
- Nombre del contacto + badge "Urgente" si aplica
- Especialidad y tipo de problema
- Descripción resumida (primeras 2 líneas)
- Email y teléfono clickeables
- Indicador si tiene turno solicitado
- Fecha y hora de recepción
- Estado actual (badge de color)
- Botón **"Ver detalles"**

### 4.2 Detalle de consulta

**Ruta:** `/panel/consultas/[id]`

Pantalla de dos columnas:

**Columna principal (izquierda, 2/3):**
- Descripción completa del caso (especialidad, tipo, prioridad, fecha, texto)
- Gestión del turno (si existe)
- Notas internas del equipo
- Línea de tiempo de eventos

**Columna lateral (derecha, 1/3):**
- Datos de contacto del cliente
- Panel de cambio de estado
- Datos de asignación

### 4.3 Estados de consulta

| Estado | Color | Descripción |
|--------|-------|-------------|
| **Nueva** | Azul | Recién recibida, sin revisar |
| **En análisis** | Amarillo | Siendo evaluada por el equipo |
| **Contactado** | Violeta | El equipo ya contactó al cliente |
| **Convertido** | Verde | Pasó a ser cliente activo |
| **Cerrado** | Gris | Consulta finalizada sin conversión |

**Cómo cambiar el estado:**
1. En la columna lateral, buscar el panel "Gestión"
2. Seleccionar el nuevo estado del select
3. Hacer clic en **"Cambiar estado"**

El cambio queda registrado automáticamente en la línea de tiempo de eventos.

### 4.4 Gestión de turnos desde la consulta

Si la consulta tiene un turno asociado, aparece un card con los detalles del mismo (modalidad, fecha preferida, horario).

**Confirmar turno:**
1. Ingresar la fecha y hora exacta confirmada en el campo `datetime-local`
2. Si es virtual, opcionalmente ingresar el link de videollamada
3. Clic en **"Confirmar turno"**

El sistema envía automáticamente un email de confirmación al cliente con los datos del turno.

**Rechazar turno:**
1. Opcionalmente ingresar el motivo del rechazo
2. Clic en **"Rechazar"**

### 4.5 Notas internas

Las notas son visibles solo para el equipo (no para el cliente).

**Tipos de nota:**
- General
- Llamada
- Reunión
- Seguimiento
- Sistema (generadas automáticamente)

**Agregar una nota:**
1. Seleccionar el tipo de nota
2. Escribir el contenido
3. Clic en **"Agregar nota"**

Cada nota registra quién la escribió y cuándo.

---

## 5. Módulo Turnos

**Ruta:** `/panel/turnos`

Lista todos los turnos de la organización, ordenados por estado y fecha preferida.

Cada card muestra:
- Nombre del cliente
- Modalidad (Presencial / Virtual) con ícono
- Estado del turno (badge de color)
- Fecha y franja horaria preferida
- Email y teléfono clickeables
- Fecha de solicitud
- Botón **"Ver consulta"** que lleva al detalle

**Estados de turno:**

| Estado | Color | Descripción |
|--------|-------|-------------|
| **Pendiente** | Amarillo | Solicitado, esperando confirmación |
| **Confirmado** | Verde | Confirmado con fecha y hora exacta |
| **Rechazado** | Rojo | Rechazado por el estudio |
| **Completado** | Azul | Turno ya realizado |
| **Cancelado** | Gris | Cancelado |

Para confirmar o rechazar un turno, ir al **detalle de la consulta** correspondiente (botón "Ver consulta").

---

## 6. Módulo Reestructuración de Pasivos (CRP)

**Ruta:** `/panel/reestructuracion`

Módulo especializado para la gestión estratégica de casos de deudas bancarias. Permite realizar un análisis integral del pasivo del cliente, diseñar escenarios de negociación y hacer seguimiento de todo el proceso.

### KPIs globales del módulo

En la parte superior de la página se muestran 3 indicadores:
- **Casos activos:** cantidad de casos en curso (excluye cerrados y archivados)
- **Pasivo total administrado:** suma de todos los pasivos con costas de todos los casos activos
- **Alertas críticas:** total de alertas de máxima prioridad pendientes

### 6.1 Crear un caso CRP

**Ruta:** `/panel/reestructuracion/nuevo`

**Pasos:**

1. **Seleccionar cliente:** elegir un contacto existente del desplegable, o completar los datos para crear uno nuevo (nombre, email, teléfono, CUIT)
2. **Perfil del cliente:** seleccionar (opcionales):
   - Objetivo principal (Salir rápido / Minimizar costo / Proteger bienes / Mixto)
   - Situación laboral (Dependencia / Autónomo / Desocupado / Jubilado / Otro)
   - Nivel socioeconómico (Bajo / Medio / Medio-alto / Alto)
   - Situación BCRA (Situación 1 Normal hasta Situación 5 Irrecuperable)
3. Clic en **"Crear caso"**

El sistema genera automáticamente un **número de caso** con formato `CRP-AAAA-NNNN` (ej: `CRP-2026-0001`) y redirige al detalle del caso.

### 6.2 Detalle del caso — Tabs

**Ruta:** `/panel/reestructuracion/[id]`

El detalle del caso se organiza en **10 tabs**:

| Tab | Funcionalidad |
|-----|---------------|
| Resumen | Datos generales, estado, checklist diagnóstico |
| Pasivos | Deudas bancarias |
| Activos | Bienes patrimoniales |
| Análisis | Análisis financiero del cliente |
| Escenarios | Escenarios estratégicos de negociación |
| Intervenciones | Registro de actuaciones |
| Honorarios | Gestión de honorarios |
| Alertas | Alertas pendientes del caso |

La URL recibe el parámetro `?tab=nombre` para acceder directamente a un tab (ej: `/panel/reestructuracion/abc123?tab=alertas`).

### 6.3 Tab Resumen

Muestra y permite editar:
- **Estado del caso** y **nivel de urgencia** (con selector y botón Guardar)
- **Datos del cliente:** nombre, teléfono, CUIT, objetivo, situación laboral, nivel socioeconómico, situación BCRA
- **Resumen financiero:** métricas calculadas automáticamente

**Métricas calculadas:**
| Campo | Fórmula |
|-------|---------|
| Pasivo bruto | Suma de totalReclamado de todas las deudas |
| Pasivo con costas | Suma de totalReclamado + costasJudiciales + honorariosAbogadoBanco |
| Flujo disponible | Ingresos netos − egresos fijos − compromiso mensual deudas |
| Ratio deuda/ingreso | Pasivo bruto / (ingreso mensual × 12) |
| Patrimonio neto | Total activos − pasivo bruto |

- **Checklist de diagnóstico:** 9 ítems de verificación (prescripción revisada, cesión verificada, intereses evaluados, mediación notificada, inhibición consultada, acción revocatoria evaluada, bien de familia consultado, codeudores identificados, ingreso formal determinado). Se guardan con el botón "Guardar diagnóstico".

### 6.4 Tab Pasivos — Deudas Bancarias

Lista todas las deudas del cliente. Cada deuda muestra:
- Acreedor original y acreedor actual (si fue cedida)
- Tipo de deuda (Tarjeta, Préstamo personal, Descubierto, Hipoteca, Prenda, Otro)
- Montos: capital, totalReclamado, costas judiciales, honorarios del banco
- Estado de la deuda y riesgo judicial
- Estado de prescripción y fecha de prescripción
- Estado de mediación y fecha de audiencia
- Días en mora (calculado automáticamente)

**Agregar deuda:**
1. Completar el formulario con los datos del acreedor y montos
2. Seleccionar tipo, estado, riesgo y estados de prescripción/mediación
3. Clic en **"Agregar deuda"**

Al agregar una deuda con fecha de prescripción próxima (< 90 días) o audiencia de mediación asignada, el sistema genera automáticamente una alerta.

**Actualizar estado de deuda:** cada deuda tiene un selector de estado que se actualiza directamente.

**Eliminar deuda:** botón de papelera en cada deuda (solicita confirmación).

### 6.5 Tab Activos — Patrimonio

Registra los bienes del cliente para el análisis patrimonial.

Cada bien muestra:
- Descripción y tipo (Inmueble, Rodado, Cuenta bancaria, Inversión, Otro)
- Valor estimado
- Si está afectado como bien de familia
- Riesgo de acción revocatoria

**Agregar bien:** completar descripción, tipo, valor y flags de protección. Clic en **"Agregar bien"**.

### 6.6 Tab Análisis Financiero

Registro del perfil económico del cliente. Es **append-only**: cada vez que se guarda, se crea una nueva versión (historial de versiones).

Campos:
- Ingreso mensual neto
- Egresos fijos mensuales
- Compromiso mensual actual de deudas
- Total activos estimados

**Guardar análisis:** completar los campos y clic en **"Guardar análisis"**. Se crea automáticamente la versión siguiente.

El historial de versiones previas se muestra debajo del formulario.

### 6.7 Tab Escenarios Estratégicos

Permite diseñar diferentes propuestas de negociación para presentar al cliente o a los acreedores.

Cada escenario tiene:
- Nombre y descripción
- Tipo (Pago único / Cuotas / Quita y espera / Refinanciación / Concurso / Abandono / Litigio)
- Monto total a pagar propuesto
- Probabilidad de éxito estimada
- Riesgo del escenario
- Plazo en meses
- Estado (Borrador / Presentado / Aceptado / Rechazado / Descartado)

**Agregar escenario:** completar el formulario y clic en **"Agregar escenario"**.

**Marcar como seleccionado:** en cada escenario aparece el botón **"Seleccionar"** para indicar cuál es el escenario activo. El ahorro vs. lo reclamado se calcula automáticamente comparando el monto del escenario con el pasivo total reclamado del análisis.

### 6.8 Tab Intervenciones

Registro cronológico de todas las actuaciones del equipo en el caso.

Tipos de intervención:
- Email
- Llamada
- Reunión
- Negociación
- Presentación judicial
- Mediación
- Seguimiento
- Otro

Cada intervención registra:
- Fecha y tipo
- Descripción
- Deuda bancaria relacionada (opcional)
- Fecha de follow-up (si aplica → genera alerta automática)

**Registrar intervención:** completar el formulario y clic en **"Registrar intervención"**.

### 6.9 Tab Honorarios

Gestión de los honorarios del estudio para el caso.

#### Panel de referencia arancelaria — Ley 9459 (Córdoba)

Al inicio del tab se muestra una tabla de referencia con los honorarios mínimos legales expresados en **Jus** (unidad arancelaria de la Ley 9459, actualizada mensualmente por el TSJ Córdoba):

| Tipo de intervención | Referencia (Jus) | Artículo |
|---------------------|------------------|----------|
| Consulta con estudio de causa | 8–20 Jus | Art. 104 inc. 3 |
| Diagnóstico integral (extrajudicial) | 15–40 Jus | Arts. 2 y 104 |
| Mediación prejudicial — sin acuerdo | 2–4 Jus/reunión | Art. 101 inc. 2 |
| Mediación prejudicial — con acuerdo | Hasta 85% mín. Art. 36 s/ monto acuerdo | Art. 101 inc. 1 |
| Negociación extrajudicial exitosa | 15% del monto percibido/ahorrado | Art. 105 |
| Proceso ejecutivo — sin excepciones | 60% escala Art. 36; mín 10 Jus | Arts. 36 y 81 |
| Proceso ejecutivo — con excepciones | 100% escala Art. 36; mín 10 Jus | Arts. 36 y 81 |
| Ejecución de sentencia | Escala Art. 36 s/ monto ejecutado | Art. 82 |
| Verificación de créditos (concurso) | 30% escala Art. 36 s/ crédito verificado | Art. 63 inc. 3 |
| Concurso preventivo del deudor | Hasta 2% del activo denunciado | Art. 63 inc. 2 |
| Recursos — 2ª instancia | 30–50% escala Art. 36; mín 12 Jus | Art. 40 |
| Servicio integral — cuota litis | Pacto libre; máx 30% resultado neto | Arts. 13 y 36 |

> El valor del Jus vigente del mes se publica en el sitio del **TSJ Córdoba** (último día hábil de cada mes). Los montos en ARS se calculan multiplicando los Jus por ese valor.

Si el caso tiene pasivos cargados, también se muestra el rango ARS estimado de la escala Art. 36 (base regulatoria = pasivo con costas).

#### Listado de honorarios del caso

Cada honorario registrado muestra:
- Etapa (descripción)
- Tipo de servicio (Consulta / Diagnóstico / Negociación / Litigio / Combinado)
- Honorario pactado (ARS)
- Honorario variable y criterio (si aplica — ej: % sobre ahorro)
- Estado de pago (badge de color)
- Monto facturado, percibido y saldo

**Agregar honorario:**
1. Completar etapa, tipo de servicio, honorario pactado
2. Opcionalmente: honorario variable y su criterio
3. Seleccionar fecha de vencimiento
4. Clic en **"Agregar honorario"**

**Registrar pago:** cada honorario tiene un formulario para ingresar el monto percibido. Clic en **"Registrar pago"**.

### 6.10 Tab Alertas

Lista todas las alertas pendientes del caso ordenadas por prioridad (Crítica → Alta → Media → Baja).

Cada alerta muestra:
- Tipo de alerta
- Descripción
- Fecha de la alerta
- Prioridad (badge de color)
- Botones **"Resolver"** y **"Descartar"**

**Resolver una alerta:** clic en **"Resolver"**. La alerta queda marcada como resuelta.

**Descartar una alerta:** clic en **"Descartar"**. La alerta se descarta sin marcarla como resuelta.

Las alertas resueltas y descartadas no aparecen en este listado.

### 6.11 Estados de caso CRP

| Estado | Color | Descripción |
|--------|-------|-------------|
| **Diagnóstico** | Azul | Etapa inicial de relevamiento |
| **En análisis** | Amarillo | Analizando deudas y patrimonio |
| **Estrategia** | Violeta | Diseñando escenarios |
| **Negociación** | Naranja | En tratativas con acreedores |
| **Implementación** | Verde azulado | Ejecutando el acuerdo |
| **Judicial** | Rojo | En proceso judicial |
| **Suspendido** | Gris | Caso pausado |
| **Cerrado — Exitoso** | Verde | Caso finalizado con éxito |
| **Cerrado — Abandonado** | Gris claro | Caso finalizado sin éxito |
| **Archivado** | Gris muy claro | Caso archivado |

**Niveles de urgencia:**

| Urgencia | Color | Cuándo usarlo |
|----------|-------|---------------|
| **Normal** | Gris | Sin presión de tiempo |
| **Alta** | Naranja | Plazos próximos relevantes |
| **Crítico** | Rojo | Urgencia máxima (ej: audiencia inminente, prescripción) |

### 6.12 Sistema de alertas automáticas

El sistema genera alertas automáticamente ante ciertos eventos:

| Evento disparador | Tipo de alerta | Prioridad |
|-------------------|----------------|-----------|
| Fecha de prescripción < 90 días | PRESCRIPCION_PROXIMA | **Crítica** |
| Se asigna fecha de audiencia de mediación | AUDIENCIA_MEDIACION | **Crítica** |
| Se define fecha de follow-up en una intervención | FOLLOW_UP | **Media** |
| Vencimiento de honorario en < 5 días | HONORARIO_VENCIDO | **Alta** |

---

## 7. Flujos Principales de Trabajo

### Flujo 1: Nueva consulta desde el sitio web

```
Cliente completa formulario /consulta
    → Sistema crea Contacto + Consulta (estado: Nueva) + Turno
    → Email automático al cliente (confirmación)
    → Email automático al estudio (notificación)
    → Dashboard muestra +1 en "Consultas Nuevas"
    → Abogada abre /panel/consultas
    → Revisa la consulta y cambia estado a "En análisis"
    → Si confirma el turno → email al cliente con fecha exacta
    → Si el caso avanza → estado "Convertido"
```

### Flujo 2: Caso de reestructuración de pasivos

```
/panel/reestructuracion/nuevo
    → Seleccionar cliente (existente o nuevo)
    → Sistema genera número CRP-AAAA-NNNN
    → Redirige al detalle del caso

Detalle del caso:
    1. Tab Resumen: completar datos de perfil, establecer estado/urgencia
    2. Tab Pasivos: cargar todas las deudas bancarias
    3. Tab Activos: cargar bienes del cliente
    4. Tab Análisis: registrar situación financiera actual
    5. Tab Escenarios: diseñar propuestas de negociación
    6. Tab Intervenciones: registrar cada actuación del equipo
    7. Tab Honorarios: registrar y dar seguimiento al cobro
    8. Tab Alertas: monitorear y resolver alertas críticas
```

### Flujo 3: Gestión de un turno pendiente

```
/panel/turnos → identificar turnos en estado "Pendiente"
    → Clic en "Ver consulta" para ir al detalle
    → Card de turno: ingresar fecha/hora confirmada
    → Clic "Confirmar turno" → email automático al cliente
    O bien:
    → Ingresar motivo → Clic "Rechazar"
```

---

## 8. Preguntas Frecuentes

**¿Cómo accedo si no tengo cuenta de Google autorizada?**
Contactar al administrador del sistema para que registre la cuenta.

**¿Los clientes pueden ver el panel?**
No. El panel es exclusivo para el equipo del estudio. Los clientes solo ven el sitio público.

**¿Se pueden eliminar consultas?**
El sistema usa eliminación lógica (los registros se marcan como eliminados pero no se borran de la base de datos), lo que preserva el historial.

**¿Cómo sé cuánto cobrar en un caso CRP?**
En el tab **Honorarios** del caso hay una tabla de referencia arancelaria basada en la Ley 9459 (Córdoba). Todos los valores están expresados en **Jus**. Para convertir a ARS, multiplicá por el valor del Jus vigente del mes, publicado en el sitio del TSJ Córdoba.

**¿Qué es el "número de caso" CRP?**
Un identificador único con formato `CRP-AAAA-NNNN` (ej: `CRP-2026-0001`). Se genera automáticamente al crear el caso.

**¿Qué pasa cuando una deuda está por prescribir?**
Si la fecha de prescripción está a menos de 90 días, el sistema genera automáticamente una alerta de prioridad **Crítica**. Esta alerta aparece en el tab Alertas del caso y también en el widget de alertas del Dashboard.

**¿Las notas son visibles para el cliente?**
No. Las notas internas son confidenciales y solo visibles para el equipo del estudio dentro del panel.

**¿Cómo funciona el email automático?**
El sistema usa una cola de emails (`EmailCola`). Los emails se encolan al momento del evento (nueva consulta, confirmación de turno, etc.) y se procesan automáticamente en segundo plano, de manera que no bloqueen la experiencia del usuario.

---

*Manual generado para uso interno del Estudio Jurídico RBS. Para soporte técnico, contactar al desarrollador.*
