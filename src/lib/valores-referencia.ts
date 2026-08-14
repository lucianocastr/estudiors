// Helpers puros (sin Prisma) para valores de referencia. Client-safe.
import type { IndicadorReferencia } from "@prisma/client";

export const INDICADORES: {
  value: IndicadorReferencia;
  label: string;
  tipo: "tramos" | "unico";
  fuente: string;
  fuenteUrl: string;
}[] = [
  {
    value: "CANASTA_CRIANZA",
    label: "Canasta de crianza",
    tipo: "tramos",
    fuente: "INDEC",
    fuenteUrl: "https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-43-173",
  },
  {
    value: "SMVM",
    label: "Salario Mínimo Vital y Móvil",
    tipo: "unico",
    fuente: "Consejo Nacional del Empleo (Boletín Oficial)",
    fuenteUrl: "https://www.boletinoficial.gob.ar/",
  },
  {
    value: "JUS",
    label: "Valor del Jus (Córdoba)",
    tipo: "unico",
    fuente: "TSJ Córdoba",
    fuenteUrl: "https://www.justiciacordoba.gob.ar/",
  },
];

export const INDICADOR_LABELS: Record<IndicadorReferencia, string> = {
  CANASTA_CRIANZA: "Canasta de crianza",
  SMVM: "Salario Mínimo Vital y Móvil",
  JUS: "Valor del Jus (Córdoba)",
};

export const CANASTA_TRAMOS = [
  { key: "menor_1", label: "Menor de 1 año" },
  { key: "1_3", label: "1 a 3 años" },
  { key: "4_5", label: "4 a 5 años" },
  { key: "6_12", label: "6 a 12 años" },
] as const;

export function getIndicadorConfig(indicador: IndicadorReferencia) {
  return INDICADORES.find((i) => i.value === indicador)!;
}

const MESES = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre",
];

/** "2026-08" → "Agosto 2026" */
export function formatPeriodo(periodo: string): string {
  const [y, m] = periodo.split("-");
  const mi = parseInt(m, 10) - 1;
  return MESES[mi] ? `${MESES[mi]} ${y}` : periodo;
}

export function formatARS(n: number): string {
  return new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency: "ARS",
    maximumFractionDigits: 0,
  }).format(n);
}

/** Lee un número de un JSON de valores (tolerante a null/undefined). */
export function leerValor(valores: unknown, key: string): number | null {
  if (valores && typeof valores === "object" && key in valores) {
    const v = (valores as Record<string, unknown>)[key];
    return typeof v === "number" ? v : null;
  }
  return null;
}
