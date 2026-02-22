import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import {
  enviarEmailNuevaConsulta,
  enviarEmailConfirmacion,
  enviarEmailTurnoConfirmado,
  type PayloadNuevaConsultaAdmin,
  type PayloadConfirmacionCliente,
  type PayloadTurnoConfirmado,
} from "@/lib/email";

// Protección simple con token de cron — configurable en .env
function isAuthorized(request: NextRequest): boolean {
  const token = request.headers.get("x-cron-token");
  const expected = process.env.CRON_SECRET;
  if (!expected) return true; // Sin token configurado, permite en desarrollo
  return token === expected;
}

export async function POST(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const ahora = new Date();
  const procesados: string[] = [];
  const fallidos: string[] = [];

  // Tomar hasta 10 emails pendientes cuya fecha de próximo intento ya pasó
  const pendientes = await prisma.emailCola.findMany({
    where: {
      estado: "PENDIENTE",
      OR: [
        { proximoIntento: null },
        { proximoIntento: { lte: ahora } },
      ],
    },
    orderBy: [{ prioridad: "asc" }, { createdAt: "asc" }],
    take: 10,
  });

  if (pendientes.length === 0) {
    return NextResponse.json({ mensaje: "Sin emails pendientes", procesados: 0 });
  }

  for (const email of pendientes) {
    // Marcar como procesando
    await prisma.emailCola.update({
      where: { id: email.id },
      data: { estado: "PROCESANDO" },
    });

    try {
      await despacharEmail(email.template, email.payload, email.destinatario);

      await prisma.emailCola.update({
        where: { id: email.id },
        data: {
          estado: "ENVIADO",
          procesadoAt: new Date(),
          intentos: { increment: 1 },
        },
      });
      procesados.push(email.id);
    } catch (error) {
      const intentos = email.intentos + 1;
      const agotado = intentos >= email.maxIntentos;

      // Backoff exponencial: 5min, 15min, 45min
      const backoffMinutos = Math.pow(3, intentos) * 5;
      const proximoIntento = new Date(ahora.getTime() + backoffMinutos * 60 * 1000);

      await prisma.emailCola.update({
        where: { id: email.id },
        data: {
          estado: agotado ? "FALLIDO" : "PENDIENTE",
          intentos,
          errorUltimo: error instanceof Error ? error.message : String(error),
          proximoIntento: agotado ? null : proximoIntento,
        },
      });
      fallidos.push(email.id);
      console.error(`Email ${email.id} falló (intento ${intentos}):`, error);
    }
  }

  return NextResponse.json({
    procesados: procesados.length,
    fallidos: fallidos.length,
    ids: { procesados, fallidos },
  });
}

async function despacharEmail(
  template: string,
  payload: unknown,
  destinatario: string
): Promise<void> {
  switch (template) {
    case "nueva-consulta-admin":
      await enviarEmailNuevaConsulta(payload as PayloadNuevaConsultaAdmin);
      break;
    case "confirmacion-cliente":
      await enviarEmailConfirmacion(payload as PayloadConfirmacionCliente, destinatario);
      break;
    case "turno-confirmado":
      await enviarEmailTurnoConfirmado(payload as PayloadTurnoConfirmado);
      break;
    default:
      throw new Error(`Template desconocido: ${template}`);
  }
}
