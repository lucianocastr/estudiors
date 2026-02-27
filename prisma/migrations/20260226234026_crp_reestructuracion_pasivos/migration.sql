-- CreateEnum
CREATE TYPE "CRPEstadoCaso" AS ENUM ('DIAGNOSTICO', 'EN_ANALISIS', 'ESTRATEGIA', 'NEGOCIACION', 'IMPLEMENTACION', 'JUDICIAL', 'SUSPENDIDO', 'CERRADO_EXITOSO', 'CERRADO_ABANDONADO', 'ARCHIVADO');

-- CreateEnum
CREATE TYPE "CRPNivelUrgencia" AS ENUM ('BAJO', 'MEDIO', 'ALTO', 'CRITICO');

-- CreateEnum
CREATE TYPE "CRPNivelExposicion" AS ENUM ('BAJO', 'MEDIO', 'ALTO', 'TOTAL');

-- CreateEnum
CREATE TYPE "CRPObjetivoCliente" AS ENUM ('SALIR_RAPIDO', 'MINIMIZAR_COSTO', 'PROTEGER_BIENES', 'MIXTO');

-- CreateEnum
CREATE TYPE "CRPSituacionLaboral" AS ENUM ('RELACION_DEPENDENCIA', 'AUTONOMO', 'DESOCUPADO', 'JUBILADO', 'OTRO');

-- CreateEnum
CREATE TYPE "CRPNivelSocioeconomico" AS ENUM ('BAJO', 'MEDIO', 'MEDIO_ALTO', 'ALTO');

-- CreateEnum
CREATE TYPE "CRPSituacionBCRA" AS ENUM ('NORMAL', 'RIESGO_BAJO', 'DEFICIENTE', 'DUDOSO', 'IRRECUPERABLE');

-- CreateEnum
CREATE TYPE "CRPEstadoInhibicion" AS ENUM ('SIN_INHIBICION', 'VIGENTE', 'EN_GESTION_LEVANTAMIENTO', 'LEVANTADA');

-- CreateEnum
CREATE TYPE "CRPTipoDeuda" AS ENUM ('TARJETA', 'PRESTAMO_PERSONAL', 'DESCUBIERTO', 'HIPOTECA', 'PRENDA', 'OTRO');

-- CreateEnum
CREATE TYPE "CRPEstadoDeuda" AS ENUM ('ACTIVA', 'EN_NEGOCIACION', 'PROPUESTA_ENVIADA', 'CONTRAOFERTA_RECIBIDA', 'ACUERDO_VERBAL', 'ACUERDO_FORMALIZADO', 'EN_CUMPLIMIENTO', 'JUDICIALIZADA', 'CERRADA', 'ABANDONADA');

-- CreateEnum
CREATE TYPE "CRPRiesgoJudicial" AS ENUM ('NULO', 'BAJO', 'MEDIO', 'ALTO', 'INMINENTE');

-- CreateEnum
CREATE TYPE "CRPEstadoPrescricion" AS ENUM ('VIGENTE', 'PROXIMA', 'PRESCRIPTA', 'INTERRUMPIDA', 'SUSPENDIDA');

-- CreateEnum
CREATE TYPE "CRPEstadoMediacion" AS ENUM ('NO_APLICA', 'NO_INICIADA', 'NOTIFICADA', 'EN_CURSO', 'ACUERDO', 'FRACASADA');

-- CreateEnum
CREATE TYPE "CRPTipoBien" AS ENUM ('INMUEBLE', 'VEHICULO', 'FONDO_COMERCIO', 'CREDITO_A_FAVOR', 'BIEN_MUEBLE_REGISTRABLE', 'OTRO');

-- CreateEnum
CREATE TYPE "CRPRiesgoRevocatoria" AS ENUM ('NULO', 'BAJO', 'MEDIO', 'ALTO');

-- CreateEnum
CREATE TYPE "CRPTipoEscenario" AS ENUM ('REFINANCIAR', 'PRESTAMO_EXTERNO', 'ESPERAR_QUITA', 'VENDER_ACTIVO', 'IMPUGNAR_INTERESES', 'CONCURSO_PREVENTIVO', 'ACUERDO_EXTRAJUDICIAL', 'COMBINADO');

-- CreateEnum
CREATE TYPE "CRPEstadoEscenario" AS ENUM ('BORRADOR', 'PRESENTADO', 'ACEPTADO', 'DESCARTADO');

-- CreateEnum
CREATE TYPE "CRPRiesgoEscenario" AS ENUM ('BAJO', 'MEDIO', 'ALTO');

-- CreateEnum
CREATE TYPE "CRPTipoIntervencion" AS ENUM ('LLAMADA', 'REUNION', 'PROPUESTA_ENVIADA', 'CONTRAOFERTA_RECIBIDA', 'DOCUMENTO_ENVIADO', 'RESPUESTA_BANCO', 'AUDIENCIA_MEDIACION', 'PRESENTACION_JUDICIAL', 'NOTA_INTERNA', 'OTRO');

-- CreateEnum
CREATE TYPE "CRPTipoServicio" AS ENUM ('CONSULTA', 'DIAGNOSTICO', 'NEGOCIACION', 'LITIGIO', 'COMBINADO');

-- CreateEnum
CREATE TYPE "CRPEstadoPago" AS ENUM ('PENDIENTE', 'PARCIAL', 'PAGADO', 'INCOBRABLE');

-- CreateEnum
CREATE TYPE "CRPTipoAlerta" AS ENUM ('PRESCRIPCION_PROXIMA', 'PRESCRIPCION_VENCIDA', 'AUDIENCIA_MEDIACION', 'VENCIMIENTO_PROPUESTA', 'FOLLOW_UP', 'REVISION_CASO', 'HONORARIO_VENCIDO', 'INHIBICION_ACTIVA', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CRPPrioridadAlerta" AS ENUM ('BAJA', 'MEDIA', 'ALTA', 'CRITICA');

-- CreateEnum
CREATE TYPE "CRPEstadoAlerta" AS ENUM ('PENDIENTE', 'VISTA', 'RESUELTA', 'DESCARTADA');

-- CreateTable
CREATE TABLE "CasoRestructuracion" (
    "id" TEXT NOT NULL,
    "numeroCaso" TEXT NOT NULL,
    "organizacionId" TEXT NOT NULL,
    "contactoId" TEXT NOT NULL,
    "abogadoId" TEXT NOT NULL,
    "estado" "CRPEstadoCaso" NOT NULL DEFAULT 'DIAGNOSTICO',
    "nivelUrgencia" "CRPNivelUrgencia" NOT NULL DEFAULT 'MEDIO',
    "nivelExposicion" "CRPNivelExposicion" NOT NULL DEFAULT 'MEDIO',
    "objetivoCliente" "CRPObjetivoCliente",
    "situacionLaboral" "CRPSituacionLaboral",
    "nivelSocioeconomico" "CRPNivelSocioeconomico",
    "cuit" TEXT,
    "estadoBCRA" "CRPSituacionBCRA",
    "historialBCRA" JSONB,
    "estadoInhibicion" "CRPEstadoInhibicion" NOT NULL DEFAULT 'SIN_INHIBICION',
    "juzgadoInhibicion" TEXT,
    "acreedorInhibicion" TEXT,
    "fechaInhibicion" TIMESTAMP(3),
    "checklistDiagnostico" JSONB,
    "recomendacionTecnica" TEXT,
    "fechaApertura" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fechaCierre" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "CasoRestructuracion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DeudaBancaria" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "acreedorOriginal" TEXT NOT NULL,
    "acreedorActual" TEXT NOT NULL,
    "fueCedida" BOOLEAN NOT NULL DEFAULT false,
    "fechaCesion" TIMESTAMP(3),
    "notificacionCesionValida" BOOLEAN,
    "tipoDeuda" "CRPTipoDeuda" NOT NULL,
    "estadoDeuda" "CRPEstadoDeuda" NOT NULL DEFAULT 'ACTIVA',
    "situacionBCRA" "CRPSituacionBCRA",
    "fechaMora" TIMESTAMP(3),
    "capitalOriginal" DECIMAL(14,2) NOT NULL,
    "capitalActual" DECIMAL(14,2) NOT NULL,
    "interesesAcumulados" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "punitatorios" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalReclamado" DECIMAL(14,2) NOT NULL,
    "costasJudiciales" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "honorariosAbogadoBanco" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "plazoPrescricionMeses" INTEGER,
    "fechaInicioComputo" TIMESTAMP(3),
    "fechaPrescricion" TIMESTAMP(3),
    "estadoPrescricion" "CRPEstadoPrescricion" NOT NULL DEFAULT 'VIGENTE',
    "causaInterrupcion" TEXT,
    "riesgoJudicial" "CRPRiesgoJudicial" NOT NULL DEFAULT 'BAJO',
    "escenarioQuitaEstimado" DECIMAL(5,2),
    "propuestaRefinanciacion" TEXT,
    "montoAcordado" DECIMAL(14,2),
    "estadoMediacion" "CRPEstadoMediacion" NOT NULL DEFAULT 'NO_APLICA',
    "fechaNotificacionMed" TIMESTAMP(3),
    "fechaAudienciaMed" TIMESTAMP(3),
    "resultadoMediacion" TEXT,
    "nroExpedienteJudicial" TEXT,
    "juzgado" TEXT,
    "fuero" TEXT,
    "abogadoBanco" TEXT,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DeudaBancaria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BienPatrimonial" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "tipo" "CRPTipoBien" NOT NULL,
    "descripcion" TEXT NOT NULL,
    "valorEstimado" DECIMAL(14,2) NOT NULL,
    "esRegistrable" BOOLEAN NOT NULL DEFAULT false,
    "esEmbargable" BOOLEAN NOT NULL DEFAULT true,
    "esBienFamilia" BOOLEAN NOT NULL DEFAULT false,
    "tieneGarantia" BOOLEAN NOT NULL DEFAULT false,
    "garantiaTipo" TEXT,
    "tienePrenda" BOOLEAN NOT NULL DEFAULT false,
    "tieneCodeudor" BOOLEAN NOT NULL DEFAULT false,
    "codeudorNombre" TEXT,
    "riesgoRevocatoria" "CRPRiesgoRevocatoria" NOT NULL DEFAULT 'NULO',
    "motivoRiesgoRevocatoria" TEXT,
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BienPatrimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalisisFinanciero" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "ingresoMensualNeto" DECIMAL(14,2) NOT NULL,
    "egresosFijos" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "compromisoMensualDeudas" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "totalPasivosBruto" DECIMAL(14,2) NOT NULL,
    "totalPasivosReclamado" DECIMAL(14,2) NOT NULL,
    "totalConCostas" DECIMAL(14,2) NOT NULL,
    "totalActivosEstimados" DECIMAL(14,2) NOT NULL,
    "capacidadPagoMensual" DECIMAL(14,2) NOT NULL,
    "mesesParaRegularizar" INTEGER,
    "observaciones" TEXT,
    "fechaAnalisis" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalisisFinanciero_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscenarioEstrategico" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "nombre" TEXT NOT NULL,
    "tipoEscenario" "CRPTipoEscenario" NOT NULL,
    "descripcion" TEXT,
    "estado" "CRPEstadoEscenario" NOT NULL DEFAULT 'BORRADOR',
    "montoTotalPagar" DECIMAL(14,2) NOT NULL,
    "plazoMeses" INTEGER,
    "cuotaMensualEstimada" DECIMAL(14,2),
    "riesgoEscenario" "CRPRiesgoEscenario" NOT NULL DEFAULT 'MEDIO',
    "ventajas" TEXT,
    "desventajas" TEXT,
    "recomendado" BOOLEAN NOT NULL DEFAULT false,
    "seleccionado" BOOLEAN NOT NULL DEFAULT false,
    "fechaPresentacion" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "EscenarioEstrategico_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EscenarioDeuda" (
    "id" TEXT NOT NULL,
    "escenarioId" TEXT NOT NULL,
    "deudaId" TEXT,
    "bienId" TEXT,
    "rol" TEXT,

    CONSTRAINT "EscenarioDeuda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntervencionCRP" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "deudaId" TEXT,
    "usuarioId" TEXT NOT NULL,
    "tipoIntervencion" "CRPTipoIntervencion" NOT NULL,
    "fecha" TIMESTAMP(3) NOT NULL,
    "entidadInvolucrada" TEXT,
    "descripcion" TEXT NOT NULL,
    "resultado" TEXT,
    "documentoUrl" TEXT,
    "requiereFollowUp" BOOLEAN NOT NULL DEFAULT false,
    "fechaFollowUp" TIMESTAMP(3),
    "followUpCompletado" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntervencionCRP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HonorarioCRP" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "tipoServicio" "CRPTipoServicio" NOT NULL,
    "etapa" TEXT NOT NULL,
    "honorarioPactado" DECIMAL(14,2) NOT NULL,
    "honorarioVariable" DECIMAL(14,2),
    "criterioVariable" TEXT,
    "montoFacturado" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "montoPercibido" DECIMAL(14,2) NOT NULL DEFAULT 0,
    "estadoPago" "CRPEstadoPago" NOT NULL DEFAULT 'PENDIENTE',
    "fechaVencimiento" TIMESTAMP(3),
    "observaciones" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HonorarioCRP_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AlertaCRP" (
    "id" TEXT NOT NULL,
    "casoId" TEXT NOT NULL,
    "deudaId" TEXT,
    "usuarioAsignadoId" TEXT,
    "tipoAlerta" "CRPTipoAlerta" NOT NULL,
    "fechaAlerta" TIMESTAMP(3) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "prioridad" "CRPPrioridadAlerta" NOT NULL DEFAULT 'MEDIA',
    "estado" "CRPEstadoAlerta" NOT NULL DEFAULT 'PENDIENTE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AlertaCRP_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CasoRestructuracion_numeroCaso_key" ON "CasoRestructuracion"("numeroCaso");

-- CreateIndex
CREATE INDEX "CasoRestructuracion_organizacionId_idx" ON "CasoRestructuracion"("organizacionId");

-- CreateIndex
CREATE INDEX "CasoRestructuracion_organizacionId_estado_idx" ON "CasoRestructuracion"("organizacionId", "estado");

-- CreateIndex
CREATE INDEX "CasoRestructuracion_contactoId_idx" ON "CasoRestructuracion"("contactoId");

-- CreateIndex
CREATE INDEX "CasoRestructuracion_abogadoId_idx" ON "CasoRestructuracion"("abogadoId");

-- CreateIndex
CREATE INDEX "CasoRestructuracion_organizacionId_nivelUrgencia_idx" ON "CasoRestructuracion"("organizacionId", "nivelUrgencia");

-- CreateIndex
CREATE INDEX "CasoRestructuracion_deletedAt_idx" ON "CasoRestructuracion"("deletedAt");

-- CreateIndex
CREATE INDEX "DeudaBancaria_casoId_idx" ON "DeudaBancaria"("casoId");

-- CreateIndex
CREATE INDEX "DeudaBancaria_casoId_estadoDeuda_idx" ON "DeudaBancaria"("casoId", "estadoDeuda");

-- CreateIndex
CREATE INDEX "DeudaBancaria_casoId_estadoPrescricion_idx" ON "DeudaBancaria"("casoId", "estadoPrescricion");

-- CreateIndex
CREATE INDEX "DeudaBancaria_fechaAudienciaMed_idx" ON "DeudaBancaria"("fechaAudienciaMed");

-- CreateIndex
CREATE INDEX "DeudaBancaria_fechaPrescricion_idx" ON "DeudaBancaria"("fechaPrescricion");

-- CreateIndex
CREATE INDEX "BienPatrimonial_casoId_idx" ON "BienPatrimonial"("casoId");

-- CreateIndex
CREATE INDEX "BienPatrimonial_casoId_tipo_idx" ON "BienPatrimonial"("casoId", "tipo");

-- CreateIndex
CREATE INDEX "AnalisisFinanciero_casoId_idx" ON "AnalisisFinanciero"("casoId");

-- CreateIndex
CREATE UNIQUE INDEX "AnalisisFinanciero_casoId_version_key" ON "AnalisisFinanciero"("casoId", "version");

-- CreateIndex
CREATE INDEX "EscenarioEstrategico_casoId_idx" ON "EscenarioEstrategico"("casoId");

-- CreateIndex
CREATE INDEX "EscenarioEstrategico_casoId_estado_idx" ON "EscenarioEstrategico"("casoId", "estado");

-- CreateIndex
CREATE INDEX "EscenarioDeuda_escenarioId_idx" ON "EscenarioDeuda"("escenarioId");

-- CreateIndex
CREATE INDEX "EscenarioDeuda_deudaId_idx" ON "EscenarioDeuda"("deudaId");

-- CreateIndex
CREATE INDEX "EscenarioDeuda_bienId_idx" ON "EscenarioDeuda"("bienId");

-- CreateIndex
CREATE INDEX "IntervencionCRP_casoId_idx" ON "IntervencionCRP"("casoId");

-- CreateIndex
CREATE INDEX "IntervencionCRP_casoId_tipoIntervencion_idx" ON "IntervencionCRP"("casoId", "tipoIntervencion");

-- CreateIndex
CREATE INDEX "IntervencionCRP_deudaId_idx" ON "IntervencionCRP"("deudaId");

-- CreateIndex
CREATE INDEX "IntervencionCRP_fechaFollowUp_idx" ON "IntervencionCRP"("fechaFollowUp");

-- CreateIndex
CREATE INDEX "HonorarioCRP_casoId_idx" ON "HonorarioCRP"("casoId");

-- CreateIndex
CREATE INDEX "HonorarioCRP_casoId_estadoPago_idx" ON "HonorarioCRP"("casoId", "estadoPago");

-- CreateIndex
CREATE INDEX "HonorarioCRP_fechaVencimiento_idx" ON "HonorarioCRP"("fechaVencimiento");

-- CreateIndex
CREATE INDEX "AlertaCRP_casoId_idx" ON "AlertaCRP"("casoId");

-- CreateIndex
CREATE INDEX "AlertaCRP_casoId_estado_idx" ON "AlertaCRP"("casoId", "estado");

-- CreateIndex
CREATE INDEX "AlertaCRP_usuarioAsignadoId_estado_idx" ON "AlertaCRP"("usuarioAsignadoId", "estado");

-- CreateIndex
CREATE INDEX "AlertaCRP_fechaAlerta_estado_idx" ON "AlertaCRP"("fechaAlerta", "estado");

-- CreateIndex
CREATE INDEX "AlertaCRP_prioridad_estado_idx" ON "AlertaCRP"("prioridad", "estado");

-- AddForeignKey
ALTER TABLE "CasoRestructuracion" ADD CONSTRAINT "CasoRestructuracion_organizacionId_fkey" FOREIGN KEY ("organizacionId") REFERENCES "Organizacion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CasoRestructuracion" ADD CONSTRAINT "CasoRestructuracion_contactoId_fkey" FOREIGN KEY ("contactoId") REFERENCES "Contacto"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CasoRestructuracion" ADD CONSTRAINT "CasoRestructuracion_abogadoId_fkey" FOREIGN KEY ("abogadoId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DeudaBancaria" ADD CONSTRAINT "DeudaBancaria_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "CasoRestructuracion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BienPatrimonial" ADD CONSTRAINT "BienPatrimonial_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "CasoRestructuracion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnalisisFinanciero" ADD CONSTRAINT "AnalisisFinanciero_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "CasoRestructuracion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscenarioEstrategico" ADD CONSTRAINT "EscenarioEstrategico_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "CasoRestructuracion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscenarioDeuda" ADD CONSTRAINT "EscenarioDeuda_escenarioId_fkey" FOREIGN KEY ("escenarioId") REFERENCES "EscenarioEstrategico"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscenarioDeuda" ADD CONSTRAINT "EscenarioDeuda_deudaId_fkey" FOREIGN KEY ("deudaId") REFERENCES "DeudaBancaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EscenarioDeuda" ADD CONSTRAINT "EscenarioDeuda_bienId_fkey" FOREIGN KEY ("bienId") REFERENCES "BienPatrimonial"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntervencionCRP" ADD CONSTRAINT "IntervencionCRP_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "CasoRestructuracion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntervencionCRP" ADD CONSTRAINT "IntervencionCRP_deudaId_fkey" FOREIGN KEY ("deudaId") REFERENCES "DeudaBancaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntervencionCRP" ADD CONSTRAINT "IntervencionCRP_usuarioId_fkey" FOREIGN KEY ("usuarioId") REFERENCES "Usuario"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HonorarioCRP" ADD CONSTRAINT "HonorarioCRP_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "CasoRestructuracion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertaCRP" ADD CONSTRAINT "AlertaCRP_casoId_fkey" FOREIGN KEY ("casoId") REFERENCES "CasoRestructuracion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertaCRP" ADD CONSTRAINT "AlertaCRP_deudaId_fkey" FOREIGN KEY ("deudaId") REFERENCES "DeudaBancaria"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AlertaCRP" ADD CONSTRAINT "AlertaCRP_usuarioAsignadoId_fkey" FOREIGN KEY ("usuarioAsignadoId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;
