-- CreateEnum
CREATE TYPE "MemberRole" AS ENUM ('OWNER', 'ADMIN', 'PROFESIONAL', 'ASISTENTE');

-- CreateEnum
CREATE TYPE "InquiryEstado" AS ENUM ('NUEVA', 'EN_ANALISIS', 'CONTACTADO', 'CONVERTIDO', 'CERRADO');

-- CreateEnum
CREATE TYPE "InquiryPrioridad" AS ENUM ('BAJA', 'NORMAL', 'ALTA', 'URGENTE');

-- CreateEnum
CREATE TYPE "FuenteCaptacion" AS ENUM ('WEB', 'INSTAGRAM', 'WHATSAPP', 'REFERIDO', 'OTRO');

-- CreateEnum
CREATE TYPE "Modalidad" AS ENUM ('PRESENCIAL', 'VIRTUAL');

-- CreateEnum
CREATE TYPE "AppointmentEstado" AS ENUM ('PENDIENTE', 'CONFIRMADO', 'RECHAZADO', 'COMPLETADO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "NotaTipo" AS ENUM ('GENERAL', 'LLAMADA', 'REUNION', 'SEGUIMIENTO', 'SISTEMA');

-- CreateEnum
CREATE TYPE "EventTipo" AS ENUM ('CREATED', 'STATE_CHANGED', 'ASSIGNED', 'REASSIGNED', 'NOTE_ADDED', 'NOTE_DELETED', 'APPOINTMENT_CREATED', 'APPOINTMENT_CONFIRMED', 'APPOINTMENT_REJECTED', 'APPOINTMENT_COMPLETED', 'CONTACT_ATTEMPT', 'CLIENT_CONVERTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "EmailEstado" AS ENUM ('PENDIENTE', 'PROCESANDO', 'ENVIADO', 'FALLIDO', 'CANCELADO');

-- CreateEnum
CREATE TYPE "OrganizacionPlan" AS ENUM ('FREE', 'STARTER', 'PRO', 'ENTERPRISE');

-- CreateTable
CREATE TABLE "Organizacion" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "OrganizacionPlan" NOT NULL DEFAULT 'FREE',
    "activa" BOOLEAN NOT NULL DEFAULT true,
    "configuracion" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Organizacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "imagen" TEXT,
    "rol" "MemberRole" NOT NULL DEFAULT 'PROFESIONAL',
    "titulo" TEXT,
    "matricula" TEXT,
    "bio" TEXT,
    "telefono" TEXT,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OrganizacionMiembro" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "rol" "MemberRole" NOT NULL DEFAULT 'PROFESIONAL',
    "permisos" JSONB,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "OrganizacionMiembro_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contacto" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "telefono" TEXT NOT NULL,
    "localidad" TEXT,
    "documentoTipo" TEXT,
    "documentoNro" TEXT,
    "fuente" "FuenteCaptacion" NOT NULL DEFAULT 'WEB',
    "tags" TEXT[],
    "esCliente" BOOLEAN NOT NULL DEFAULT false,
    "clienteDesdeAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Contacto_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Consulta" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "contactoId" TEXT NOT NULL,
    "especialidad" TEXT NOT NULL,
    "tipoProblema" TEXT NOT NULL,
    "descripcion" TEXT NOT NULL,
    "urgente" BOOLEAN NOT NULL DEFAULT false,
    "prioridad" "InquiryPrioridad" NOT NULL DEFAULT 'NORMAL',
    "estado" "InquiryEstado" NOT NULL DEFAULT 'NUEVA',
    "aceptaTerminos" BOOLEAN NOT NULL DEFAULT false,
    "disclaimerLeido" BOOLEAN NOT NULL DEFAULT false,
    "contactadoAt" TIMESTAMP(3),
    "convertidoAt" TIMESTAMP(3),
    "cerradoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Consulta_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultaAsignacion" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "asignadoAId" TEXT NOT NULL,
    "asignadoPorId" TEXT NOT NULL,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "nota" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "reasignadoAt" TIMESTAMP(3),

    CONSTRAINT "ConsultaAsignacion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ConsultaEvento" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "autorId" TEXT,
    "tipo" "EventTipo" NOT NULL,
    "estadoAnterior" TEXT,
    "estadoNuevo" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ConsultaEvento_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Turno" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "modalidad" "Modalidad" NOT NULL,
    "fechaPreferida" TIMESTAMP(3) NOT NULL,
    "horarioPreferido" TEXT NOT NULL,
    "estado" "AppointmentEstado" NOT NULL DEFAULT 'PENDIENTE',
    "fechaConfirmada" TIMESTAMP(3),
    "linkVideoCall" TEXT,
    "motivoRechazo" TEXT,
    "asistio" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Turno_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Nota" (
    "id" TEXT NOT NULL,
    "consultaId" TEXT NOT NULL,
    "autorId" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "contenido" TEXT NOT NULL,
    "tipo" "NotaTipo" NOT NULL DEFAULT 'GENERAL',
    "esPrivada" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "Nota_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmailCola" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT,
    "destinatario" TEXT NOT NULL,
    "asunto" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "payload" JSONB NOT NULL,
    "prioridad" INTEGER NOT NULL DEFAULT 5,
    "estado" "EmailEstado" NOT NULL DEFAULT 'PENDIENTE',
    "intentos" INTEGER NOT NULL DEFAULT 0,
    "maxIntentos" INTEGER NOT NULL DEFAULT 3,
    "proximoIntento" TIMESTAMP(3),
    "errorUltimo" TEXT,
    "procesadoAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EmailCola_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BloqueoHorario" (
    "id" TEXT NOT NULL,
    "usuarioId" TEXT NOT NULL,
    "organizacionId" TEXT,
    "fechaInicio" TIMESTAMP(3) NOT NULL,
    "fechaFin" TIMESTAMP(3) NOT NULL,
    "motivo" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BloqueoHorario_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Configuracion" (
    "id" TEXT NOT NULL,
    "organizacionId" TEXT,
    "clave" TEXT NOT NULL,
    "valor" TEXT NOT NULL,
    "tipo" TEXT NOT NULL DEFAULT 'text',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Configuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Especialidad" (
    "id" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "descripcionCorta" TEXT NOT NULL,
    "descripcionLarga" TEXT NOT NULL,
    "icono" TEXT,
    "problemasComunes" TEXT[],
    "orden" INTEGER NOT NULL DEFAULT 0,
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Especialidad_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizacion_slug_key" ON "Organizacion"("slug");

-- CreateIndex
CREATE INDEX "Organizacion_slug_idx" ON "Organizacion"("slug");

-- CreateIndex
CREATE INDEX "Organizacion_deletedAt_idx" ON "Organizacion"("deletedAt");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_email_idx" ON "Usuario"("email");

-- CreateIndex
CREATE INDEX "Usuario_deletedAt_idx" ON "Usuario"("deletedAt");

-- CreateIndex
CREATE INDEX "OrganizacionMiembro_organizacionId_idx" ON "OrganizacionMiembro"("organizacionId");

-- CreateIndex
CREATE INDEX "OrganizacionMiembro_usuarioId_idx" ON "OrganizacionMiembro"("usuarioId");

-- CreateIndex
CREATE INDEX "OrganizacionMiembro_organizacionId_rol_idx" ON "OrganizacionMiembro"("organizacionId", "rol");

-- CreateIndex
CREATE UNIQUE INDEX "OrganizacionMiembro_organizacionId_usuarioId_key" ON "OrganizacionMiembro"("organizacionId", "usuarioId");

-- CreateIndex
CREATE INDEX "Contacto_organizacionId_idx" ON "Contacto"("organizacionId");

-- CreateIndex
CREATE INDEX "Contacto_organizacionId_email_idx" ON "Contacto"("organizacionId", "email");

-- CreateIndex
CREATE INDEX "Contacto_esCliente_idx" ON "Contacto"("esCliente");

-- CreateIndex
CREATE INDEX "Contacto_deletedAt_idx" ON "Contacto"("deletedAt");

-- CreateIndex
CREATE INDEX "Consulta_organizacionId_idx" ON "Consulta"("organizacionId");

-- CreateIndex
CREATE INDEX "Consulta_contactoId_idx" ON "Consulta"("contactoId");

-- CreateIndex
CREATE INDEX "Consulta_organizacionId_estado_idx" ON "Consulta"("organizacionId", "estado");

-- CreateIndex
CREATE INDEX "Consulta_organizacionId_urgente_idx" ON "Consulta"("organizacionId", "urgente");

-- CreateIndex
CREATE INDEX "Consulta_organizacionId_prioridad_idx" ON "Consulta"("organizacionId", "prioridad");

-- CreateIndex
CREATE INDEX "Consulta_createdAt_idx" ON "Consulta"("createdAt");

-- CreateIndex
CREATE INDEX "Consulta_deletedAt_idx" ON "Consulta"("deletedAt");

-- CreateIndex
CREATE INDEX "ConsultaAsignacion_consultaId_idx" ON "ConsultaAsignacion"("consultaId");

-- CreateIndex
CREATE INDEX "ConsultaAsignacion_asignadoAId_idx" ON "ConsultaAsignacion"("asignadoAId");

-- CreateIndex
CREATE INDEX "ConsultaAsignacion_consultaId_activo_idx" ON "ConsultaAsignacion"("consultaId", "activo");

-- CreateIndex
CREATE INDEX "ConsultaAsignacion_organizacionId_idx" ON "ConsultaAsignacion"("organizacionId");

-- CreateIndex
CREATE INDEX "ConsultaEvento_consultaId_idx" ON "ConsultaEvento"("consultaId");

-- CreateIndex
CREATE INDEX "ConsultaEvento_consultaId_tipo_idx" ON "ConsultaEvento"("consultaId", "tipo");

-- CreateIndex
CREATE INDEX "ConsultaEvento_organizacionId_createdAt_idx" ON "ConsultaEvento"("organizacionId", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Turno_consultaId_key" ON "Turno"("consultaId");

-- CreateIndex
CREATE INDEX "Turno_organizacionId_idx" ON "Turno"("organizacionId");

-- CreateIndex
CREATE INDEX "Turno_organizacionId_estado_idx" ON "Turno"("organizacionId", "estado");

-- CreateIndex
CREATE INDEX "Turno_fechaConfirmada_idx" ON "Turno"("fechaConfirmada");

-- CreateIndex
CREATE INDEX "Turno_deletedAt_idx" ON "Turno"("deletedAt");

-- CreateIndex
CREATE INDEX "Nota_consultaId_idx" ON "Nota"("consultaId");

-- CreateIndex
CREATE INDEX "Nota_autorId_idx" ON "Nota"("autorId");

-- CreateIndex
CREATE INDEX "Nota_consultaId_deletedAt_idx" ON "Nota"("consultaId", "deletedAt");

-- CreateIndex
CREATE INDEX "EmailCola_estado_proximoIntento_idx" ON "EmailCola"("estado", "proximoIntento");

-- CreateIndex
CREATE INDEX "EmailCola_organizacionId_idx" ON "EmailCola"("organizacionId");

-- CreateIndex
CREATE INDEX "BloqueoHorario_usuarioId_idx" ON "BloqueoHorario"("usuarioId");

-- CreateIndex
CREATE INDEX "BloqueoHorario_fechaInicio_fechaFin_idx" ON "BloqueoHorario"("fechaInicio", "fechaFin");

-- CreateIndex
CREATE UNIQUE INDEX "Configuracion_organizacionId_clave_key" ON "Configuracion"("organizacionId", "clave");

-- CreateIndex
CREATE UNIQUE INDEX "Especialidad_slug_key" ON "Especialidad"("slug");

-- AddForeignKey
ALTER TABLE "OrganizacionMiembro" ADD CONSTRAINT "OrganizacionMiembro_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OrganizacionMiembro" ADD CONSTRAINT "OrganizacionMiembro_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Contacto" ADD CONSTRAINT "Contacto_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consulta" ADD CONSTRAINT "Consulta_contactoId_fkey" FOREIGN KEY ("contactoId") REFERENCES "Contacto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaAsignacion" ADD CONSTRAINT "ConsultaAsignacion_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaAsignacion" ADD CONSTRAINT "ConsultaAsignacion_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaAsignacion" ADD CONSTRAINT "ConsultaAsignacion_asignadoAId_fkey" FOREIGN KEY ("asignadoAId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaAsignacion" ADD CONSTRAINT "ConsultaAsignacion_asignadoPorId_fkey" FOREIGN KEY ("asignadoPorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaEvento" ADD CONSTRAINT "ConsultaEvento_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaEvento" ADD CONSTRAINT "ConsultaEvento_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ConsultaEvento" ADD CONSTRAINT "ConsultaEvento_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Turno" ADD CONSTRAINT "Turno_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_consultaId_fkey" FOREIGN KEY ("consultaId") REFERENCES "Consulta"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_autorId_fkey" FOREIGN KEY ("autorId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Nota" ADD CONSTRAINT "Nota_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailCola" ADD CONSTRAINT "EmailCola_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BloqueoHorario" ADD CONSTRAINT "BloqueoHorario_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Configuracion" ADD CONSTRAINT "Configuracion_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
