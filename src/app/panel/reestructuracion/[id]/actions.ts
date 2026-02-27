"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import {
  calcularFechaPrescricion,
  calcularEstadoPrescricion,
  generarAlertasDeuda,
  PLAZO_PRESCRICION_MESES,
} from "@/lib/crp-utils";
import type {
  CRPEstadoCaso,
  CRPNivelUrgencia,
  CRPNivelExposicion,
  CRPObjetivoCliente,
  CRPSituacionBCRA,
  CRPEstadoInhibicion,
  CRPTipoDeuda,
  CRPEstadoDeuda,
  CRPRiesgoJudicial,
  CRPEstadoMediacion,
  CRPTipoBien,
  CRPRiesgoRevocatoria,
  CRPTipoEscenario,
  CRPRiesgoEscenario,
  CRPTipoIntervencion,
  CRPTipoServicio,
  CRPEstadoPago,
  CRPEstadoAlerta,
} from "@prisma/client";

// ── Helper de autorización ─────────────────────────────────────────────────────

async function getCasoSeguro(casoId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");

  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) throw new Error("Sin organización");

  const caso = await prisma.casoRestructuracion.findFirst({
    where: { id: casoId, organizacionId: membresia.organizacionId, deletedAt: null },
  });
  if (!caso) throw new Error("Caso no encontrado");

  return { caso, session, organizacionId: membresia.organizacionId };
}

function revalidar(casoId: string) {
  revalidatePath(`/panel/reestructuracion/${casoId}`);
}

// ── CASO: cambiar estado ───────────────────────────────────────────────────────

export async function cambiarEstadoCaso(casoId: string, formData: FormData) {
  const nuevoEstado = formData.get("estado") as CRPEstadoCaso;
  if (!nuevoEstado) return;
  const { caso } = await getCasoSeguro(casoId);
  if (caso.estado === nuevoEstado) return;

  await prisma.casoRestructuracion.update({
    where: { id: casoId },
    data: {
      estado: nuevoEstado,
      ...( ["CERRADO_EXITOSO", "CERRADO_ABANDONADO"].includes(nuevoEstado) && !caso.fechaCierre
        ? { fechaCierre: new Date() }
        : {}),
    },
  });
  revalidar(casoId);
}

export async function cambiarUrgencia(casoId: string, formData: FormData) {
  const urgencia = formData.get("nivelUrgencia") as CRPNivelUrgencia;
  if (!urgencia) return;
  await getCasoSeguro(casoId);
  await prisma.casoRestructuracion.update({
    where: { id: casoId },
    data: { nivelUrgencia: urgencia },
  });
  revalidar(casoId);
}

export async function guardarDiagnostico(casoId: string, formData: FormData) {
  await getCasoSeguro(casoId);

  const checklistKeys = [
    "prescripcionRevisada", "cesionVerificada", "interesesEvaluados",
    "mediacionNotificada", "inhibicionConsultada", "revocatoriaEvaluada",
    "bienFamiliaInscripto", "codeudoresIdentificados", "ingresoFormal",
  ];
  const checklist = Object.fromEntries(
    checklistKeys.map((k) => [k, formData.get(k) === "on"])
  );

  await prisma.casoRestructuracion.update({
    where: { id: casoId },
    data: {
      checklistDiagnostico: checklist,
      recomendacionTecnica: (formData.get("recomendacionTecnica") as string)?.trim() || null,
      nivelExposicion: (formData.get("nivelExposicion") as CRPNivelExposicion) || undefined,
      objetivoCliente: (formData.get("objetivoCliente") as CRPObjetivoCliente) || undefined,
      estadoBCRA: (formData.get("estadoBCRA") as CRPSituacionBCRA) || undefined,
      estadoInhibicion: (formData.get("estadoInhibicion") as CRPEstadoInhibicion) || undefined,
      juzgadoInhibicion: (formData.get("juzgadoInhibicion") as string)?.trim() || null,
      acreedorInhibicion: (formData.get("acreedorInhibicion") as string)?.trim() || null,
    },
  });
  revalidar(casoId);
}

// ── DEUDAS ────────────────────────────────────────────────────────────────────

export async function agregarDeuda(casoId: string, formData: FormData) {
  await getCasoSeguro(casoId);

  const tipoDeuda = formData.get("tipoDeuda") as CRPTipoDeuda;
  const fechaMoraStr = formData.get("fechaMora") as string;
  const fechaMora = fechaMoraStr ? new Date(fechaMoraStr) : null;

  // Calcular prescripción
  const plazoMeses = PLAZO_PRESCRICION_MESES[tipoDeuda] ?? 60;
  const fechaInicioComputo = fechaMora;
  const fechaPrescricion = fechaInicioComputo
    ? calcularFechaPrescricion(fechaInicioComputo, plazoMeses)
    : null;
  const estadoPrescricion = calcularEstadoPrescricion(fechaPrescricion, null);

  // Totales
  const capitalOriginal = parseFloat(formData.get("capitalOriginal") as string) || 0;
  const capitalActual = parseFloat(formData.get("capitalActual") as string) || capitalOriginal;
  const intereses = parseFloat(formData.get("interesesAcumulados") as string) || 0;
  const punitatorios = parseFloat(formData.get("punitatorios") as string) || 0;
  const totalReclamado = capitalActual + intereses + punitatorios;
  const costasJudiciales = parseFloat(formData.get("costasJudiciales") as string) || 0;
  const honorariosAbogadoBanco = parseFloat(formData.get("honorariosAbogadoBanco") as string) || 0;

  const fechaAudienciaMedStr = formData.get("fechaAudienciaMed") as string;

  const deuda = await prisma.deudaBancaria.create({
    data: {
      casoId,
      acreedorOriginal: (formData.get("acreedorOriginal") as string).trim(),
      acreedorActual: (formData.get("acreedorActual") as string)?.trim() ||
        (formData.get("acreedorOriginal") as string).trim(),
      fueCedida: formData.get("fueCedida") === "on",
      tipoDeuda,
      estadoDeuda: "ACTIVA",
      situacionBCRA: (formData.get("situacionBCRA") as any) || null,
      fechaMora,
      capitalOriginal,
      capitalActual,
      interesesAcumulados: intereses,
      punitatorios,
      totalReclamado,
      costasJudiciales,
      honorariosAbogadoBanco,
      plazoPrescricionMeses: plazoMeses,
      fechaInicioComputo,
      fechaPrescricion,
      estadoPrescricion,
      riesgoJudicial: (formData.get("riesgoJudicial") as CRPRiesgoJudicial) || "BAJO",
      estadoMediacion: (formData.get("estadoMediacion") as CRPEstadoMediacion) || "NO_APLICA",
      fechaNotificacionMed: (formData.get("fechaNotificacionMed") as string)
        ? new Date(formData.get("fechaNotificacionMed") as string)
        : null,
      fechaAudienciaMed: fechaAudienciaMedStr ? new Date(fechaAudienciaMedStr) : null,
      nroExpedienteJudicial: (formData.get("nroExpedienteJudicial") as string)?.trim() || null,
      juzgado: (formData.get("juzgado") as string)?.trim() || null,
      fuero: (formData.get("fuero") as string)?.trim() || null,
      observaciones: (formData.get("observaciones") as string)?.trim() || null,
    },
  });

  // Auto-generar alertas si corresponde
  await generarAlertasDeuda(casoId, deuda.id, {
    fechaPrescricion,
    estadoPrescricion,
    fechaAudienciaMed: deuda.fechaAudienciaMed,
  });

  revalidar(casoId);
}

export async function actualizarEstadoDeuda(deudaId: string, casoId: string, formData: FormData) {
  await getCasoSeguro(casoId);
  const nuevoEstado = formData.get("estadoDeuda") as CRPEstadoDeuda;
  const montoAcordado = formData.get("montoAcordado")
    ? parseFloat(formData.get("montoAcordado") as string)
    : undefined;

  await prisma.deudaBancaria.update({
    where: { id: deudaId },
    data: {
      estadoDeuda: nuevoEstado,
      ...(montoAcordado !== undefined ? { montoAcordado } : {}),
    },
  });
  revalidar(casoId);
}

export async function eliminarDeuda(deudaId: string, casoId: string) {
  await getCasoSeguro(casoId);
  await prisma.deudaBancaria.delete({ where: { id: deudaId } });
  revalidar(casoId);
}

// ── BIENES ────────────────────────────────────────────────────────────────────

export async function agregarBien(casoId: string, formData: FormData) {
  await getCasoSeguro(casoId);

  await prisma.bienPatrimonial.create({
    data: {
      casoId,
      tipo: formData.get("tipo") as CRPTipoBien,
      descripcion: (formData.get("descripcion") as string).trim(),
      valorEstimado: parseFloat(formData.get("valorEstimado") as string) || 0,
      esRegistrable: formData.get("esRegistrable") === "on",
      esEmbargable: formData.get("esEmbargable") !== "off",
      esBienFamilia: formData.get("esBienFamilia") === "on",
      tieneGarantia: formData.get("tieneGarantia") === "on",
      garantiaTipo: (formData.get("garantiaTipo") as string)?.trim() || null,
      tienePrenda: formData.get("tienePrenda") === "on",
      tieneCodeudor: formData.get("tieneCodeudor") === "on",
      codeudorNombre: (formData.get("codeudorNombre") as string)?.trim() || null,
      riesgoRevocatoria: (formData.get("riesgoRevocatoria") as CRPRiesgoRevocatoria) || "NULO",
      motivoRiesgoRevocatoria: (formData.get("motivoRiesgoRevocatoria") as string)?.trim() || null,
      observaciones: (formData.get("observaciones") as string)?.trim() || null,
    },
  });

  // Si tiene inhibición y bien no embargable por bien de familia → alerta
  const caso = await prisma.casoRestructuracion.findUnique({ where: { id: casoId } });
  if (caso?.estadoInhibicion === "VIGENTE") {
    const alertaExistente = await prisma.alertaCRP.findFirst({
      where: { casoId, tipoAlerta: "INHIBICION_ACTIVA", estado: "PENDIENTE" },
    });
    if (!alertaExistente) {
      await prisma.alertaCRP.create({
        data: {
          casoId,
          tipoAlerta: "INHIBICION_ACTIVA",
          fechaAlerta: new Date(),
          descripcion: "Inhibición general de bienes vigente — revisar escenarios de venta de activos",
          prioridad: "ALTA",
        },
      });
    }
  }

  revalidar(casoId);
}

export async function eliminarBien(bienId: string, casoId: string) {
  await getCasoSeguro(casoId);
  await prisma.bienPatrimonial.delete({ where: { id: bienId } });
  revalidar(casoId);
}

// ── ANÁLISIS FINANCIERO ───────────────────────────────────────────────────────

export async function guardarAnalisisFinanciero(casoId: string, formData: FormData) {
  await getCasoSeguro(casoId);

  const ingresoMensualNeto = parseFloat(formData.get("ingresoMensualNeto") as string) || 0;
  const egresosFijos = parseFloat(formData.get("egresosFijos") as string) || 0;
  const compromisoMensualDeudas = parseFloat(formData.get("compromisoMensualDeudas") as string) || 0;
  const totalPasivosBruto = parseFloat(formData.get("totalPasivosBruto") as string) || 0;
  const totalPasivosReclamado = parseFloat(formData.get("totalPasivosReclamado") as string) || 0;
  const totalConCostas = parseFloat(formData.get("totalConCostas") as string) || 0;
  const totalActivosEstimados = parseFloat(formData.get("totalActivosEstimados") as string) || 0;
  const capacidadPagoMensual = parseFloat(formData.get("capacidadPagoMensual") as string) || 0;
  const mesesParaRegularizar = formData.get("mesesParaRegularizar")
    ? parseInt(formData.get("mesesParaRegularizar") as string, 10)
    : null;

  // Versión: siguiente a la última existente
  const ultimoAnalisis = await prisma.analisisFinanciero.findFirst({
    where: { casoId },
    orderBy: { version: "desc" },
    select: { version: true },
  });
  const version = (ultimoAnalisis?.version ?? 0) + 1;

  await prisma.analisisFinanciero.create({
    data: {
      casoId,
      version,
      ingresoMensualNeto,
      egresosFijos,
      compromisoMensualDeudas,
      totalPasivosBruto,
      totalPasivosReclamado,
      totalConCostas,
      totalActivosEstimados,
      capacidadPagoMensual,
      mesesParaRegularizar,
      observaciones: (formData.get("observaciones") as string)?.trim() || null,
    },
  });
  revalidar(casoId);
}

// ── ESCENARIOS ────────────────────────────────────────────────────────────────

export async function agregarEscenario(casoId: string, formData: FormData) {
  await getCasoSeguro(casoId);

  await prisma.escenarioEstrategico.create({
    data: {
      casoId,
      nombre: (formData.get("nombre") as string).trim(),
      tipoEscenario: formData.get("tipoEscenario") as CRPTipoEscenario,
      descripcion: (formData.get("descripcion") as string)?.trim() || null,
      montoTotalPagar: parseFloat(formData.get("montoTotalPagar") as string) || 0,
      plazoMeses: formData.get("plazoMeses")
        ? parseInt(formData.get("plazoMeses") as string, 10)
        : null,
      cuotaMensualEstimada: formData.get("cuotaMensualEstimada")
        ? parseFloat(formData.get("cuotaMensualEstimada") as string)
        : null,
      riesgoEscenario: (formData.get("riesgoEscenario") as CRPRiesgoEscenario) || "MEDIO",
      ventajas: (formData.get("ventajas") as string)?.trim() || null,
      desventajas: (formData.get("desventajas") as string)?.trim() || null,
      recomendado: formData.get("recomendado") === "on",
    },
  });
  revalidar(casoId);
}

export async function marcarEscenarioSeleccionado(escenarioId: string, casoId: string) {
  await getCasoSeguro(casoId);

  // Desmarcar todos los demás del caso
  await prisma.escenarioEstrategico.updateMany({
    where: { casoId },
    data: { seleccionado: false },
  });
  await prisma.escenarioEstrategico.update({
    where: { id: escenarioId },
    data: { seleccionado: true, estado: "ACEPTADO", fechaPresentacion: new Date() },
  });
  revalidar(casoId);
}

// ── INTERVENCIONES ────────────────────────────────────────────────────────────

export async function agregarIntervencion(casoId: string, formData: FormData) {
  const { session } = await getCasoSeguro(casoId);

  const fechaFollowUpStr = formData.get("fechaFollowUp") as string;
  const requiereFollowUp = formData.get("requiereFollowUp") === "on";

  const intervencion = await prisma.intervencionCRP.create({
    data: {
      casoId,
      usuarioId: session.user.id,
      deudaId: (formData.get("deudaId") as string) || null,
      tipoIntervencion: formData.get("tipoIntervencion") as CRPTipoIntervencion,
      fecha: new Date(formData.get("fecha") as string),
      entidadInvolucrada: (formData.get("entidadInvolucrada") as string)?.trim() || null,
      descripcion: (formData.get("descripcion") as string).trim(),
      resultado: (formData.get("resultado") as string)?.trim() || null,
      documentoUrl: (formData.get("documentoUrl") as string)?.trim() || null,
      requiereFollowUp,
      fechaFollowUp: requiereFollowUp && fechaFollowUpStr ? new Date(fechaFollowUpStr) : null,
    },
  });

  // Auto-alerta de follow-up
  if (requiereFollowUp && intervencion.fechaFollowUp) {
    await prisma.alertaCRP.create({
      data: {
        casoId,
        tipoAlerta: "FOLLOW_UP",
        fechaAlerta: intervencion.fechaFollowUp,
        descripcion: `Follow-up requerido: ${intervencion.entidadInvolucrada ?? "caso"}`,
        prioridad: "MEDIA",
        usuarioAsignadoId: session.user.id,
      },
    });
  }

  revalidar(casoId);
}

// ── HONORARIOS ────────────────────────────────────────────────────────────────

export async function agregarHonorario(casoId: string, formData: FormData) {
  await getCasoSeguro(casoId);

  const fechaVencimientoStr = formData.get("fechaVencimiento") as string;

  const honorario = await prisma.honorarioCRP.create({
    data: {
      casoId,
      tipoServicio: formData.get("tipoServicio") as CRPTipoServicio,
      etapa: (formData.get("etapa") as string).trim(),
      honorarioPactado: parseFloat(formData.get("honorarioPactado") as string) || 0,
      honorarioVariable: formData.get("honorarioVariable")
        ? parseFloat(formData.get("honorarioVariable") as string)
        : null,
      criterioVariable: (formData.get("criterioVariable") as string)?.trim() || null,
      montoFacturado: parseFloat(formData.get("montoFacturado") as string) || 0,
      montoPercibido: parseFloat(formData.get("montoPercibido") as string) || 0,
      estadoPago: (formData.get("estadoPago") as CRPEstadoPago) || "PENDIENTE",
      fechaVencimiento: fechaVencimientoStr ? new Date(fechaVencimientoStr) : null,
      observaciones: (formData.get("observaciones") as string)?.trim() || null,
    },
  });

  // Auto-alerta de vencimiento de honorario
  if (honorario.fechaVencimiento) {
    const diasHasta = Math.floor(
      (honorario.fechaVencimiento.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (diasHasta <= 7) {
      await prisma.alertaCRP.create({
        data: {
          casoId,
          tipoAlerta: "HONORARIO_VENCIDO",
          fechaAlerta: honorario.fechaVencimiento,
          descripcion: `Vencimiento de honorario: ${honorario.etapa}`,
          prioridad: diasHasta <= 2 ? "CRITICA" : "ALTA",
        },
      });
    }
  }

  revalidar(casoId);
}

export async function actualizarPagoHonorario(honorarioId: string, casoId: string, formData: FormData) {
  await getCasoSeguro(casoId);
  await prisma.honorarioCRP.update({
    where: { id: honorarioId },
    data: {
      montoPercibido: parseFloat(formData.get("montoPercibido") as string) || 0,
      estadoPago: formData.get("estadoPago") as CRPEstadoPago,
    },
  });
  revalidar(casoId);
}

// ── ALERTAS ───────────────────────────────────────────────────────────────────

export async function resolverAlerta(alertaId: string, casoId: string) {
  await getCasoSeguro(casoId);
  await prisma.alertaCRP.update({
    where: { id: alertaId },
    data: { estado: "RESUELTA" },
  });
  revalidar(casoId);
}

export async function descartarAlerta(alertaId: string, casoId: string) {
  await getCasoSeguro(casoId);
  await prisma.alertaCRP.update({
    where: { id: alertaId },
    data: { estado: "DESCARTADA" },
  });
  revalidar(casoId);
}
