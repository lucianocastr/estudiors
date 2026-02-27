/**
 * CRP — Utilidades del módulo de Reestructuración de Pasivos
 * Labels, colores, cálculos y helpers compartidos entre componentes y actions.
 */

import { prisma } from "@/lib/db";
import type {
  CRPEstadoCaso,
  CRPEstadoDeuda,
  CRPRiesgoJudicial,
  CRPEstadoPrescricion,
  CRPNivelUrgencia,
  CRPPrioridadAlerta,
  CRPTipoDeuda,
  CRPTipoEscenario,
  CRPTipoIntervencion,
  CRPTipoServicio,
  CRPEstadoPago,
  CRPTipoBien,
  CRPSituacionBCRA,
  CRPEstadoMediacion,
} from "@prisma/client";

// ── Labels de presentación ────────────────────────────────────────────────────

export const ESTADO_CASO_LABELS: Record<CRPEstadoCaso, string> = {
  DIAGNOSTICO: "Diagnóstico",
  EN_ANALISIS: "En análisis",
  ESTRATEGIA: "Estrategia",
  NEGOCIACION: "Negociación",
  IMPLEMENTACION: "Implementación",
  JUDICIAL: "Judicial",
  SUSPENDIDO: "Suspendido",
  CERRADO_EXITOSO: "Cerrado — Exitoso",
  CERRADO_ABANDONADO: "Cerrado — Abandonado",
  ARCHIVADO: "Archivado",
};

export const ESTADO_CASO_COLORS: Record<CRPEstadoCaso, string> = {
  DIAGNOSTICO: "bg-blue-100 text-blue-800",
  EN_ANALISIS: "bg-yellow-100 text-yellow-800",
  ESTRATEGIA: "bg-purple-100 text-purple-800",
  NEGOCIACION: "bg-orange-100 text-orange-800",
  IMPLEMENTACION: "bg-teal-100 text-teal-800",
  JUDICIAL: "bg-red-100 text-red-800",
  SUSPENDIDO: "bg-gray-100 text-gray-600",
  CERRADO_EXITOSO: "bg-green-100 text-green-800",
  CERRADO_ABANDONADO: "bg-gray-100 text-gray-500",
  ARCHIVADO: "bg-gray-50 text-gray-400",
};

export const ESTADO_DEUDA_LABELS: Record<CRPEstadoDeuda, string> = {
  ACTIVA: "Activa",
  EN_NEGOCIACION: "En negociación",
  PROPUESTA_ENVIADA: "Propuesta enviada",
  CONTRAOFERTA_RECIBIDA: "Contraoferta recibida",
  ACUERDO_VERBAL: "Acuerdo verbal",
  ACUERDO_FORMALIZADO: "Acuerdo formalizado",
  EN_CUMPLIMIENTO: "En cumplimiento",
  JUDICIALIZADA: "Judicializada",
  CERRADA: "Cerrada",
  ABANDONADA: "Abandonada",
};

export const ESTADO_DEUDA_COLORS: Record<CRPEstadoDeuda, string> = {
  ACTIVA: "bg-gray-100 text-gray-700",
  EN_NEGOCIACION: "bg-blue-100 text-blue-800",
  PROPUESTA_ENVIADA: "bg-yellow-100 text-yellow-800",
  CONTRAOFERTA_RECIBIDA: "bg-orange-100 text-orange-800",
  ACUERDO_VERBAL: "bg-purple-100 text-purple-800",
  ACUERDO_FORMALIZADO: "bg-teal-100 text-teal-800",
  EN_CUMPLIMIENTO: "bg-green-100 text-green-800",
  JUDICIALIZADA: "bg-red-100 text-red-800",
  CERRADA: "bg-green-50 text-green-700",
  ABANDONADA: "bg-gray-50 text-gray-400",
};

export const RIESGO_JUDICIAL_LABELS: Record<CRPRiesgoJudicial, string> = {
  NULO: "Sin riesgo",
  BAJO: "Bajo",
  MEDIO: "Medio",
  ALTO: "Alto",
  INMINENTE: "Inminente",
};

export const RIESGO_JUDICIAL_COLORS: Record<CRPRiesgoJudicial, string> = {
  NULO: "bg-gray-100 text-gray-600",
  BAJO: "bg-green-100 text-green-700",
  MEDIO: "bg-yellow-100 text-yellow-800",
  ALTO: "bg-orange-100 text-orange-800",
  INMINENTE: "bg-red-100 text-red-800",
};

export const PRESCRICION_LABELS: Record<CRPEstadoPrescricion, string> = {
  VIGENTE: "Vigente",
  PROXIMA: "Próxima a prescribir",
  PRESCRIPTA: "Prescripta",
  INTERRUMPIDA: "Interrumpida",
  SUSPENDIDA: "Suspendida",
};

export const PRESCRICION_COLORS: Record<CRPEstadoPrescricion, string> = {
  VIGENTE: "bg-green-100 text-green-700",
  PROXIMA: "bg-orange-100 text-orange-800",
  PRESCRIPTA: "bg-red-100 text-red-800",
  INTERRUMPIDA: "bg-blue-100 text-blue-700",
  SUSPENDIDA: "bg-yellow-100 text-yellow-700",
};

export const URGENCIA_LABELS: Record<CRPNivelUrgencia, string> = {
  BAJO: "Baja",
  MEDIO: "Media",
  ALTO: "Alta",
  CRITICO: "Crítica",
};

export const URGENCIA_COLORS: Record<CRPNivelUrgencia, string> = {
  BAJO: "bg-green-100 text-green-700",
  MEDIO: "bg-yellow-100 text-yellow-800",
  ALTO: "bg-orange-100 text-orange-800",
  CRITICO: "bg-red-100 text-red-800",
};

export const PRIORIDAD_ALERTA_COLORS: Record<CRPPrioridadAlerta, string> = {
  BAJA: "text-gray-500",
  MEDIA: "text-yellow-600",
  ALTA: "text-orange-600",
  CRITICA: "text-red-600",
};

export const TIPO_DEUDA_LABELS: Record<CRPTipoDeuda, string> = {
  TARJETA: "Tarjeta de crédito",
  PRESTAMO_PERSONAL: "Préstamo personal",
  DESCUBIERTO: "Descubierto en cuenta",
  HIPOTECA: "Hipoteca",
  PRENDA: "Prenda",
  OTRO: "Otro",
};

export const TIPO_ESCENARIO_LABELS: Record<CRPTipoEscenario, string> = {
  REFINANCIAR: "Refinanciación directa",
  PRESTAMO_EXTERNO: "Préstamo externo",
  ESPERAR_QUITA: "Esperar quita",
  VENDER_ACTIVO: "Venta de activo",
  IMPUGNAR_INTERESES: "Impugnación de intereses",
  CONCURSO_PREVENTIVO: "Concurso preventivo",
  ACUERDO_EXTRAJUDICIAL: "Acuerdo extrajudicial",
  COMBINADO: "Estrategia combinada",
};

export const TIPO_INTERVENCION_LABELS: Record<CRPTipoIntervencion, string> = {
  LLAMADA: "Llamada",
  REUNION: "Reunión",
  PROPUESTA_ENVIADA: "Propuesta enviada",
  CONTRAOFERTA_RECIBIDA: "Contraoferta recibida",
  DOCUMENTO_ENVIADO: "Documento enviado",
  RESPUESTA_BANCO: "Respuesta del banco",
  AUDIENCIA_MEDIACION: "Audiencia de mediación",
  PRESENTACION_JUDICIAL: "Presentación judicial",
  NOTA_INTERNA: "Nota interna",
  OTRO: "Otro",
};

export const TIPO_SERVICIO_LABELS: Record<CRPTipoServicio, string> = {
  CONSULTA: "Consulta",
  DIAGNOSTICO: "Diagnóstico",
  NEGOCIACION: "Negociación",
  LITIGIO: "Litigio",
  COMBINADO: "Combinado",
};

export const ESTADO_PAGO_LABELS: Record<CRPEstadoPago, string> = {
  PENDIENTE: "Pendiente",
  PARCIAL: "Pago parcial",
  PAGADO: "Pagado",
  INCOBRABLE: "Incobrable",
};

export const TIPO_BIEN_LABELS: Record<CRPTipoBien, string> = {
  INMUEBLE: "Inmueble",
  VEHICULO: "Vehículo",
  FONDO_COMERCIO: "Fondo de comercio",
  CREDITO_A_FAVOR: "Crédito a favor",
  BIEN_MUEBLE_REGISTRABLE: "Bien mueble registrable",
  OTRO: "Otro",
};

export const BCRA_LABELS: Record<CRPSituacionBCRA, string> = {
  NORMAL: "Situación 1 — Normal",
  RIESGO_BAJO: "Situación 2 — Riesgo bajo",
  DEFICIENTE: "Situación 3 — Deficiente",
  DUDOSO: "Situación 4 — Dudoso",
  IRRECUPERABLE: "Situación 5 — Irrecuperable",
};

export const MEDIACION_LABELS: Record<CRPEstadoMediacion, string> = {
  NO_APLICA: "No aplica",
  NO_INICIADA: "No iniciada",
  NOTIFICADA: "Notificada",
  EN_CURSO: "En curso",
  ACUERDO: "Acuerdo alcanzado",
  FRACASADA: "Fracasada",
};

// Orden de flujo para selector de estado del caso
export const ESTADOS_CASO_FLUJO: CRPEstadoCaso[] = [
  "DIAGNOSTICO",
  "EN_ANALISIS",
  "ESTRATEGIA",
  "NEGOCIACION",
  "IMPLEMENTACION",
  "JUDICIAL",
  "SUSPENDIDO",
  "CERRADO_EXITOSO",
  "CERRADO_ABANDONADO",
  "ARCHIVADO",
];

// ── Plazos de prescripción por tipo de deuda ─────────────────────────────────

export const PLAZO_PRESCRICION_MESES: Record<CRPTipoDeuda, number> = {
  TARJETA: 36,          // Ley 25.065
  PRESTAMO_PERSONAL: 60, // CCCN Art. 2560
  DESCUBIERTO: 36,
  HIPOTECA: 120,        // 10 años acción real
  PRENDA: 60,
  OTRO: 60,
};

// ── Cálculos financieros ──────────────────────────────────────────────────────

/** Calcula la fecha de prescripción dado el inicio del cómputo y el plazo en meses */
export function calcularFechaPrescricion(
  fechaInicio: Date,
  plazoMeses: number
): Date {
  const fecha = new Date(fechaInicio);
  fecha.setMonth(fecha.getMonth() + plazoMeses);
  return fecha;
}

/** Determina el estado de prescripción según la fecha */
export function calcularEstadoPrescricion(
  fechaPrescricion: Date | null,
  causaInterrupcion?: string | null
): "VIGENTE" | "PROXIMA" | "PRESCRIPTA" | "INTERRUMPIDA" {
  if (causaInterrupcion) return "INTERRUMPIDA";
  if (!fechaPrescricion) return "VIGENTE";

  const hoy = new Date();
  const diasRestantes = Math.floor(
    (fechaPrescricion.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24)
  );

  if (diasRestantes < 0) return "PRESCRIPTA";
  if (diasRestantes < 90) return "PROXIMA";
  return "VIGENTE";
}

/** Total de deuda incluyendo costas y honorarios del banco */
export function calcularTotalConCostas(deuda: {
  totalReclamado: number | { toNumber: () => number };
  costasJudiciales: number | { toNumber: () => number };
  honorariosAbogadoBanco: number | { toNumber: () => number };
}): number {
  const toNum = (v: number | { toNumber: () => number }) =>
    typeof v === "number" ? v : v.toNumber();
  return toNum(deuda.totalReclamado) + toNum(deuda.costasJudiciales) + toNum(deuda.honorariosAbogadoBanco);
}

/** Flujo disponible mensual */
export function calcularFlujoDisponible(analisis: {
  ingresoMensualNeto: number | { toNumber: () => number };
  egresosFijos: number | { toNumber: () => number };
  compromisoMensualDeudas: number | { toNumber: () => number };
}): number {
  const toNum = (v: number | { toNumber: () => number }) =>
    typeof v === "number" ? v : v.toNumber();
  return (
    toNum(analisis.ingresoMensualNeto) -
    toNum(analisis.egresosFijos) -
    toNum(analisis.compromisoMensualDeudas)
  );
}

/** Ratio deuda / ingreso anual */
export function calcularRatioDeudaIngreso(
  totalPasivosBruto: number,
  ingresoMensualNeto: number
): number {
  if (ingresoMensualNeto <= 0) return 0;
  return totalPasivosBruto / (ingresoMensualNeto * 12);
}

/** Días de mora desde la fecha de mora hasta hoy */
export function calcularDiasMora(fechaMora: Date | null): number {
  if (!fechaMora) return 0;
  return Math.floor(
    (new Date().getTime() - fechaMora.getTime()) / (1000 * 60 * 60 * 24)
  );
}

// ── Formato de moneda ─────────────────────────────────────────────────────────

export function formatARS(value: number | { toNumber: () => number } | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const num = typeof value === "number" ? value : value.toNumber();
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPorcentaje(value: number | { toNumber: () => number } | null | undefined): string {
  if (value === null || value === undefined) return "—";
  const num = typeof value === "number" ? value : value.toNumber();
  return `${num.toFixed(1)}%`;
}

// ── Generador de número de caso ───────────────────────────────────────────────

/**
 * Genera el próximo numeroCaso para la organización en formato CRP-YYYY-NNNN.
 * Debe ejecutarse dentro de una transacción para evitar duplicados bajo concurrencia.
 */
export async function generarNumeroCaso(organizacionId: string): Promise<string> {
  const anio = new Date().getFullYear();
  const prefijo = `CRP-${anio}-`;

  const ultimo = await prisma.casoRestructuracion.findFirst({
    where: {
      organizacionId,
      numeroCaso: { startsWith: prefijo },
    },
    orderBy: { numeroCaso: "desc" },
    select: { numeroCaso: true },
  });

  let siguiente = 1;
  if (ultimo) {
    const partes = ultimo.numeroCaso.split("-");
    const nroActual = parseInt(partes[partes.length - 1], 10);
    if (!isNaN(nroActual)) siguiente = nroActual + 1;
  }

  return `${prefijo}${String(siguiente).padStart(4, "0")}`;
}

// ── Referencia arancelaria — Ley 9459 (Córdoba) ──────────────────────────────
//
// Código Arancelario para Abogados y Procuradores de la Provincia de Córdoba.
// Última modificación relevante: Ley 11042 (B.O. 05.05.2025).
//
// UNIDAD ARANCELARIA "JUS" (Art. 35 Ley 9459):
//   - El valor del Jus está atado al sueldo del Juez de Cámara con 8 años de antigüedad.
//   - El TSJ Córdoba publica el valor actualizado el último día hábil de cada mes.
//   - Los honorarios SIEMPRE se expresan y pactan en Jus (Art. 34 y 35).
//   - Al momento del pago, el deudor abona en pesos según el Jus vigente ese día.
//   - Este sistema NO contiene un valor de Jus hardcodeado: consultar TSJ Córdoba.

export interface ReferenciaHonorario {
  label: string;
  /** Mínimo fijado por ley en Jus */
  minJus: number;
  /** Máximo en Jus (null = abierto / variable según base regulatoria) */
  maxJus: number | null;
  /** Descripción del criterio variable cuando el monto depende de la base regulatoria */
  criterioVariable?: string;
  articuloLey: string;
  nota?: string;
}

/**
 * Referencias arancelarias del módulo CRP según Ley 9459 (Cba).
 * Todos los montos están en JUS — el valor en ARS surge de multiplicar por el Jus vigente del mes.
 */
export const REFERENCIA_ARANCELARIA_CRP: Record<CRPTipoServicio, ReferenciaHonorario[]> = {
  CONSULTA: [
    {
      label: "Consulta con estudio de causa en trámite",
      minJus: 8,
      maxJus: 20,
      articuloLey: "Art. 104 inc. 3",
      nota: "Mín 2 Jus verbal · 4 Jus escrita · 8 Jus con estudio de causa",
    },
  ],
  DIAGNOSTICO: [
    {
      label: "Diagnóstico integral (extrajudicial)",
      minJus: 15,
      maxJus: 40,
      articuloLey: "Arts. 2 y 104",
      nota: "Pacto libre. Incluye análisis BCRA, pasivos, patrimonio y escenarios. Recomendado: 15–40 Jus según complejidad.",
    },
  ],
  NEGOCIACION: [
    {
      label: "Mediación prejudicial — sin acuerdo",
      minJus: 2,
      maxJus: 4,
      articuloLey: "Art. 101 inc. 2",
      nota: "2 a 4 Jus por cada reunión",
    },
    {
      label: "Mediación prejudicial — con acuerdo/transacción",
      minJus: 3,
      maxJus: null,
      criterioVariable: "Hasta 85% del mínimo de la escala Art. 36 sobre el monto del acuerdo, en Jus. Mín 3 Jus/reunión.",
      articuloLey: "Art. 101 inc. 1",
    },
    {
      label: "Negociación/cobro extrajudicial",
      minJus: 10,
      maxJus: null,
      criterioVariable: "15% del monto efectivamente percibido/ahorrado por el cliente, convertido a Jus al día de pago (Art. 105). En defecto de convenio.",
      articuloLey: "Art. 105",
    },
  ],
  LITIGIO: [
    {
      label: "Proceso ejecutivo — sin excepciones (1ª instancia)",
      minJus: 10,
      maxJus: null,
      criterioVariable: "60% de la escala Art. 36 sobre la base regulatoria (monto reclamado), convertido a Jus. Mín absoluto: 10 Jus.",
      articuloLey: "Arts. 36 y 81",
    },
    {
      label: "Proceso ejecutivo — con excepciones (1ª instancia)",
      minJus: 10,
      maxJus: null,
      criterioVariable: "100% de la escala Art. 36 sobre la base regulatoria, en Jus. Mín: 10 Jus.",
      articuloLey: "Arts. 36 y 81",
    },
    {
      label: "Ejecución de sentencia",
      minJus: 10,
      maxJus: null,
      criterioVariable: "Escala Art. 36 sobre el monto ejecutado, en Jus. Sin oposición de excepciones: 50% de la escala.",
      articuloLey: "Art. 82",
    },
    {
      label: "Verificación de créditos (concurso/quiebra)",
      minJus: 4,
      maxJus: null,
      criterioVariable: "30% de la escala Art. 36 sobre el monto verificado, en Jus. Si no se verifica: la mitad.",
      articuloLey: "Art. 63 inc. 3",
      nota: "Acumulado con incidente de revisión: no superar el máximo de la escala Art. 36.",
    },
    {
      label: "Concurso preventivo del deudor",
      minJus: 10,
      maxJus: null,
      criterioVariable: "Hasta 2% del activo denunciado en Jus (pedido rechazado). Si prospera: Ley 24.522.",
      articuloLey: "Art. 63 inc. 2",
    },
    {
      label: "Recursos — 2ª instancia",
      minJus: 12,
      maxJus: null,
      criterioVariable: "30% a 50% de la escala Art. 36 sobre lo discutido en alzada, en Jus.",
      articuloLey: "Art. 40",
    },
  ],
  COMBINADO: [
    {
      label: "Servicio integral — cuota litis",
      minJus: 20,
      maxJus: null,
      criterioVariable: "Pacto de cuota litis: máx 30% de lo que efectivamente perciba el cliente (Art. 13), expresado en Jus al momento del resultado. Honorario fijo mínimo recomendado: 20 Jus.",
      articuloLey: "Arts. 13 y 36",
      nota: "Incluye diagnóstico, negociación y eventual litigio. El porcentaje aplica sobre el ahorro neto obtenido.",
    },
  ],
};

/**
 * Porcentaje mínimo de la escala Art. 36 según la base regulatoria.
 * La escala aplica sobre el MONTO EN ARS del pasivo reclamado; el resultado
 * luego se convierte a Jus al valor vigente del mes (Art. 34, Ley 9459).
 *
 * Umbrales en UE (Unidad Económica = sueldo Juez de Cámara 8 años):
 *   ≤ 20 UE → 20% · ≤ 50 UE → 16% · ≤ 100 UE → 12% · > 100 UE → 10%
 * Máximo: 25% (Art. 36).
 *
 * Como no fijamos el valor de UE en código, devolvemos los cuatro tramos
 * con los porcentajes para que la abogada aplique el que corresponda.
 */
export function escalaArt36Porcentajes(): {
  tramo: string;
  porcentajeMin: number;
  porcentajeMax: number;
}[] {
  return [
    { tramo: "Base ≤ 20 UE",           porcentajeMin: 20, porcentajeMax: 25 },
    { tramo: "Base entre 20 y 50 UE",  porcentajeMin: 16, porcentajeMax: 25 },
    { tramo: "Base entre 50 y 100 UE", porcentajeMin: 12, porcentajeMax: 25 },
    { tramo: "Base > 100 UE",          porcentajeMin: 10, porcentajeMax: 25 },
  ];
}

/**
 * Calcula el rango ARS (piso–techo) de honorarios según Art. 36,
 * dado el monto de la base regulatoria en pesos.
 * El resultado en ARS debe dividirse por el Jus vigente del mes para obtener Jus.
 *
 * Nota: los umbrales de UE se aproximan como base > N * (pasivo / ratio_estimado).
 * En la práctica, aplicar el tramo conservador (10%) para bases grandes.
 */
export function calcularEscalaArt36ARS(baseRegulatoria: number): {
  porcentajeMin: number;
  porcentajeMax: number;
  montoMinARS: number;
  montoMaxARS: number;
  notaJus: string;
} {
  // Sin valor de UE hardcodeado: usamos el tramo más conservador (10%) como piso seguro.
  // Para bases pequeñas, el 20% es probable — la abogada decide según el UE del mes.
  const pctMin = 0.10; // tramo más conservador (base > 100 UE)
  return {
    porcentajeMin: pctMin * 100,
    porcentajeMax: 25,
    montoMinARS: baseRegulatoria * pctMin,
    montoMaxARS: baseRegulatoria * 0.25,
    notaJus: "Dividir por el Jus vigente del mes (TSJ Córdoba) para obtener el monto en Jus a pactar.",
  };
}

// ── Auto-generación de alertas ────────────────────────────────────────────────

/**
 * Crea alertas automáticas cuando se guarda/actualiza una DeudaBancaria.
 * Llamar desde Server Actions tras crear o actualizar deuda.
 */
export async function generarAlertasDeuda(
  casoId: string,
  deudaId: string,
  deuda: {
    fechaPrescricion?: Date | null;
    estadoPrescricion?: string;
    fechaAudienciaMed?: Date | null;
  }
) {
  const alertasACrear = [];

  // Alerta de prescripción próxima
  if (
    deuda.fechaPrescricion &&
    (deuda.estadoPrescricion === "PROXIMA" || deuda.estadoPrescricion === "PRESCRIPTA")
  ) {
    alertasACrear.push({
      casoId,
      deudaId,
      tipoAlerta: "PRESCRIPCION_PROXIMA" as const,
      fechaAlerta: new Date(),
      descripcion:
        deuda.estadoPrescricion === "PRESCRIPTA"
          ? "Deuda posiblemente prescripta — revisar estrategia"
          : `Deuda prescribe el ${deuda.fechaPrescricion.toLocaleDateString("es-AR")} — menos de 90 días`,
      prioridad: "CRITICA" as const,
    });
  }

  // Alerta de audiencia de mediación
  if (deuda.fechaAudienciaMed) {
    alertasACrear.push({
      casoId,
      deudaId,
      tipoAlerta: "AUDIENCIA_MEDIACION" as const,
      fechaAlerta: deuda.fechaAudienciaMed,
      descripcion: `Audiencia de mediación el ${deuda.fechaAudienciaMed.toLocaleDateString("es-AR")}`,
      prioridad: "CRITICA" as const,
    });
  }

  if (alertasACrear.length > 0) {
    await prisma.alertaCRP.createMany({ data: alertasACrear });
  }
}
