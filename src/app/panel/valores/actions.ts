"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { IndicadorReferencia } from "@prisma/client";
import { CANASTA_TRAMOS } from "@/lib/valores-referencia";

async function getOrganizacionId(): Promise<string> {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");
  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) throw new Error("Sin organización");
  return membresia.organizacionId;
}

function parseNum(v: FormDataEntryValue | null): number {
  const n = Number(String(v ?? "").replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

function revalidar() {
  revalidatePath("/panel/valores");
  revalidatePath("/informacion/valores-de-referencia");
  revalidatePath("/informacion/canasta-de-crianza-cuota-alimentaria");
  revalidatePath("/informacion/te-despidieron-tus-derechos");
}

export async function guardarValorReferencia(formData: FormData) {
  const organizacionId = await getOrganizacionId();

  const indicador = formData.get("indicador") as IndicadorReferencia;
  const periodo = (formData.get("periodo") as string)?.trim();
  const vigenteDesde = (formData.get("vigenteDesde") as string)?.trim();
  const fuente = (formData.get("fuente") as string)?.trim() || "INDEC";
  const fuenteUrl = (formData.get("fuenteUrl") as string)?.trim() || null;

  if (!indicador || !periodo || !vigenteDesde) {
    throw new Error("Indicador, período y fecha de vigencia son obligatorios");
  }

  let valores: Record<string, number>;
  if (indicador === "CANASTA_CRIANZA") {
    valores = {};
    for (const t of CANASTA_TRAMOS) {
      valores[t.key] = parseNum(formData.get(`valor_${t.key}`));
    }
  } else {
    valores = { valor: parseNum(formData.get("valor")) };
  }

  // Upsert por (organización, indicador, período): recargar un período lo actualiza.
  await prisma.valorReferencia.upsert({
    where: {
      organizacionId_indicador_periodo: { organizacionId, indicador, periodo },
    },
    update: { vigenteDesde: new Date(vigenteDesde), valores, fuente, fuenteUrl, deletedAt: null },
    create: { organizacionId, indicador, periodo, vigenteDesde: new Date(vigenteDesde), valores, fuente, fuenteUrl },
  });

  revalidar();
}

export async function eliminarValorReferencia(id: string) {
  const organizacionId = await getOrganizacionId();
  await prisma.valorReferencia.updateMany({
    where: { id, organizacionId, deletedAt: null },
    data: { deletedAt: new Date() },
  });
  revalidar();
}
