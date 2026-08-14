// Consultas públicas de valores de referencia (server-only).
// Scopeadas a la organización del sitio vía DEFAULT_ORGANIZATION_ID.
import { prisma } from "@/lib/db";
import type { IndicadorReferencia, ValorReferencia } from "@prisma/client";

function orgId(): string | undefined {
  return process.env.DEFAULT_ORGANIZATION_ID;
}

export async function getHistoricoPublico(
  indicador: IndicadorReferencia
): Promise<ValorReferencia[]> {
  const organizacionId = orgId();
  if (!organizacionId) return [];
  return prisma.valorReferencia.findMany({
    where: { organizacionId, indicador, deletedAt: null },
    orderBy: { periodo: "desc" },
  });
}

export async function getUltimoPublico(
  indicador: IndicadorReferencia
): Promise<ValorReferencia | null> {
  const organizacionId = orgId();
  if (!organizacionId) return null;
  return prisma.valorReferencia.findFirst({
    where: { organizacionId, indicador, deletedAt: null },
    orderBy: { periodo: "desc" },
  });
}

/** Todos los indicadores con su histórico, para la página de valores. */
export async function getTodosLosHistoricos(): Promise<
  Record<string, ValorReferencia[]>
> {
  const organizacionId = orgId();
  if (!organizacionId) return {};
  const todos = await prisma.valorReferencia.findMany({
    where: { organizacionId, deletedAt: null },
    orderBy: { periodo: "desc" },
  });
  return todos.reduce<Record<string, ValorReferencia[]>>((acc, v) => {
    (acc[v.indicador] ??= []).push(v);
    return acc;
  }, {});
}
