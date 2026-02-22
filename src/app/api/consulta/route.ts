import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { consultaConTurnoSchema } from "@/lib/validators";
import { enviarEmailNuevaConsulta, enviarEmailConfirmacion } from "@/lib/email";

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

    // Crear consulta en la base de datos
    const consulta = await prisma.consulta.create({
      data: {
        tipoProblema: data.tipoProblema,
        especialidad: data.especialidad,
        descripcion: data.descripcion,
        urgente: data.urgente,
        nombre: data.nombre,
        email: data.email,
        telefono: data.telefono,
        localidad: data.localidad || null,
        aceptaTerminos: data.aceptaTerminos,
        disclaimerLeido: data.disclaimerLeido,
      },
    });

    // Si solicitó turno, crearlo
    if (data.solicitaTurno && data.turno?.modalidad && data.turno?.fechaPreferida && data.turno?.horarioPreferido) {
      await prisma.turno.create({
        data: {
          consultaId: consulta.id,
          modalidad: data.turno.modalidad,
          fechaPreferida: new Date(data.turno.fechaPreferida),
          horarioPreferido: data.turno.horarioPreferido,
        },
      });
    }

    // Enviar emails (no bloquear si falla)
    try {
      await Promise.all([
        enviarEmailNuevaConsulta(consulta),
        enviarEmailConfirmacion(consulta),
      ]);
    } catch (emailError) {
      console.error("Error enviando emails:", emailError);
      // No fallar si los emails no se envían
    }

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
