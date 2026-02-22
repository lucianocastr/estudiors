import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { consultaConTurnoSchema } from "@/lib/validators";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validar datos
    const validacion = consultaConTurnoSchema.safeParse(body);
    if (!validacion.success) {
      return NextResponse.json(
        { error: "Datos inválidos", detalles: validacion.error.flatten() },
        { status: 400 }
      );
    }

    const data = validacion.data;

    // Obtener la organización por defecto (configurada al hacer seed)
    const organizacionId = process.env.DEFAULT_ORGANIZATION_ID;
    if (!organizacionId) {
      console.error("DEFAULT_ORGANIZATION_ID no configurado");
      return NextResponse.json(
        { error: "Error de configuración del servidor" },
        { status: 500 }
      );
    }

    // Find-or-create Contacto por email dentro de la organización
    let contacto = await prisma.contacto.findFirst({
      where: { organizacionId, email: data.email, deletedAt: null },
    });

    if (!contacto) {
      contacto = await prisma.contacto.create({
        data: {
          organizacionId,
          nombre: data.nombre,
          email: data.email,
          telefono: data.telefono,
          localidad: data.localidad ?? null,
          fuente: "WEB",
        },
      });
    }

    // Crear la Consulta vinculada al Contacto
    const consulta = await prisma.consulta.create({
      data: {
        organizacionId,
        contactoId: contacto.id,
        especialidad: data.especialidad,
        tipoProblema: data.tipoProblema,
        descripcion: data.descripcion,
        urgente: data.urgente,
        aceptaTerminos: data.aceptaTerminos,
        disclaimerLeido: data.disclaimerLeido,
      },
    });

    // Registrar evento CREATED (audit log append-only)
    await prisma.consultaEvento.create({
      data: {
        consultaId: consulta.id,
        organizacionId,
        tipo: "CREATED",
        estadoNuevo: "NUEVA",
        metadata: { fuente: "WEB", contactoId: contacto.id },
      },
    });

    // Si solicitó turno, crearlo
    if (
      data.solicitaTurno &&
      data.turno?.modalidad &&
      data.turno?.fechaPreferida &&
      data.turno?.horarioPreferido
    ) {
      await prisma.turno.create({
        data: {
          consultaId: consulta.id,
          organizacionId,
          modalidad: data.turno.modalidad,
          fechaPreferida: new Date(data.turno.fechaPreferida),
          horarioPreferido: data.turno.horarioPreferido,
        },
      });
    }

    // Encolar emails (desacoplado del request — worker los procesa)
    await prisma.emailCola.createMany({
      data: [
        {
          organizacionId,
          destinatario: process.env.ESTUDIO_EMAIL ?? "",
          asunto: `Nueva consulta: ${data.especialidad}`,
          template: "nueva-consulta-admin",
          payload: {
            consultaId: consulta.id,
            nombre: data.nombre,
            email: data.email,
            telefono: data.telefono,
            localidad: data.localidad ?? null,
            especialidad: data.especialidad,
            tipoProblema: data.tipoProblema,
            descripcion: data.descripcion,
            urgente: data.urgente,
            createdAt: consulta.createdAt.toISOString(),
          },
          prioridad: data.urgente ? 1 : 5,
        },
        {
          organizacionId,
          destinatario: data.email,
          asunto: "Recibimos tu consulta — Estudio Jurídico RS",
          template: "confirmacion-cliente",
          payload: { consultaId: consulta.id, nombre: data.nombre, tipoProblema: data.tipoProblema },
          prioridad: 5,
        },
      ],
    });

    return NextResponse.json(
      { mensaje: "Consulta recibida correctamente", id: consulta.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error procesando consulta:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}
