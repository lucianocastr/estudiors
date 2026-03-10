"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
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

  // Obtener contacto y turno para el email
  const consultaCompleta = await prisma.consulta.findFirst({
    where: { id: consultaId, organizacionId },
    include: { contacto: true, turno: true },
  });

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

  // Encolar email de confirmación al cliente
  if (consultaCompleta?.contacto && consultaCompleta.turno) {
    await prisma.emailCola.create({
      data: {
        organizacionId,
        destinatario: consultaCompleta.contacto.email,
        asunto: `Turno confirmado — ${process.env.ESTUDIO_NOMBRE || "Estudio Jurídico RS"}`,
        template: "turno-confirmado",
        payload: {
          consultaId,
          nombre: consultaCompleta.contacto.nombre,
          email: consultaCompleta.contacto.email,
          modalidad: consultaCompleta.turno.modalidad,
          fechaConfirmada: fechaStr,
          linkVideoCall: linkVideoCall,
        },
        prioridad: 2,
      },
    });
  }

  revalidatePath(`/panel/consultas/${consultaId}`);
}

export async function rechazarTurno(consultaId: string, formData: FormData) {
  const motivo = (formData.get("motivoRechazo") as string) || null;

  const { session, organizacionId } = await getConsultaSegura(consultaId);

  // Obtener contacto para el email
  const consultaCompleta = await prisma.consulta.findFirst({
    where: { id: consultaId, organizacionId },
    include: { contacto: true },
  });

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

  // Encolar email de rechazo al cliente
  if (consultaCompleta?.contacto) {
    await prisma.emailCola.create({
      data: {
        organizacionId,
        destinatario: consultaCompleta.contacto.email,
        asunto: `Información sobre tu turno — ${process.env.ESTUDIO_NOMBRE || "Estudio Jurídico RS"}`,
        template: "turno-rechazado",
        payload: {
          consultaId,
          nombre: consultaCompleta.contacto.nombre,
          email: consultaCompleta.contacto.email,
          motivoRechazo: motivo,
        },
        prioridad: 2,
      },
    });
  }

  revalidatePath(`/panel/consultas/${consultaId}`);
}

export async function eliminarConsulta(consultaId: string) {
  await getConsultaSegura(consultaId);

  await prisma.consulta.update({
    where: { id: consultaId },
    data: { deletedAt: new Date() },
  });

  revalidatePath("/panel/consultas");
  revalidatePath("/panel");
  redirect("/panel/consultas");
}
