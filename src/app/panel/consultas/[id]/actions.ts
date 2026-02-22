"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import type { InquiryEstado, NotaTipo } from "@prisma/client";

async function getConsultaSegura(consultaId: string) {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");

  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) throw new Error("Sin organización");

  const consulta = await prisma.consulta.findFirst({
    where: { id: consultaId, organizacionId: membresia.organizacionId, deletedAt: null },
  });
  if (!consulta) throw new Error("Consulta no encontrada");

  return { consulta, session, organizacionId: membresia.organizacionId };
}

export async function cambiarEstado(consultaId: string, formData: FormData) {
  const nuevoEstado = formData.get("estado") as InquiryEstado;
  if (!nuevoEstado) return;

  const { consulta, session, organizacionId } = await getConsultaSegura(consultaId);
  const estadoAnterior = consulta.estado;

  if (estadoAnterior === nuevoEstado) return;

  await prisma.consulta.update({
    where: { id: consultaId },
    data: {
      estado: nuevoEstado,
      ...(nuevoEstado === "CONTACTADO" && !consulta.contactadoAt
        ? { contactadoAt: new Date() }
        : {}),
      ...(nuevoEstado === "CONVERTIDO" && !consulta.convertidoAt
        ? { convertidoAt: new Date() }
        : {}),
      ...(nuevoEstado === "CERRADO" && !consulta.cerradoAt
        ? { cerradoAt: new Date() }
        : {}),
    },
  });

  await prisma.consultaEvento.create({
    data: {
      consultaId,
      organizacionId,
      autorId: session.user.id,
      tipo: "STATE_CHANGED",
      estadoAnterior,
      estadoNuevo: nuevoEstado,
    },
  });

  revalidatePath(`/panel/consultas/${consultaId}`);
}

export async function agregarNota(consultaId: string, formData: FormData) {
  const contenido = (formData.get("contenido") as string)?.trim();
  const tipo = (formData.get("tipo") as NotaTipo) ?? "GENERAL";
  if (!contenido) return;

  const { session, organizacionId } = await getConsultaSegura(consultaId);

  await prisma.nota.create({
    data: {
      consultaId,
      autorId: session.user.id,
      organizacionId,
      contenido,
      tipo,
    },
  });

  await prisma.consultaEvento.create({
    data: {
      consultaId,
      organizacionId,
      autorId: session.user.id,
      tipo: "NOTE_ADDED",
    },
  });

  revalidatePath(`/panel/consultas/${consultaId}`);
}

export async function confirmarTurno(consultaId: string, formData: FormData) {
  const fechaStr = formData.get("fechaConfirmada") as string;
  const linkVideoCall = (formData.get("linkVideoCall") as string) || null;
  if (!fechaStr) return;

  const { session, organizacionId } = await getConsultaSegura(consultaId);

  await prisma.turno.update({
    where: { consultaId },
    data: {
      estado: "CONFIRMADO",
      fechaConfirmada: new Date(fechaStr),
      linkVideoCall,
    },
  });

  await prisma.consultaEvento.create({
    data: {
      consultaId,
      organizacionId,
      autorId: session.user.id,
      tipo: "APPOINTMENT_CONFIRMED",
      metadata: { fechaConfirmada: fechaStr },
    },
  });

  revalidatePath(`/panel/consultas/${consultaId}`);
}

export async function rechazarTurno(consultaId: string, formData: FormData) {
  const motivo = (formData.get("motivoRechazo") as string) || null;

  const { session, organizacionId } = await getConsultaSegura(consultaId);

  await prisma.turno.update({
    where: { consultaId },
    data: { estado: "RECHAZADO", motivoRechazo: motivo },
  });

  await prisma.consultaEvento.create({
    data: {
      consultaId,
      organizacionId,
      autorId: session.user.id,
      tipo: "APPOINTMENT_REJECTED",
    },
  });

  revalidatePath(`/panel/consultas/${consultaId}`);
}
