import nodemailer from "nodemailer";
import { especialidades } from "@/content/especialidades";

// Configurar transporter de Nodemailer
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

// ── Tipos de payload por template ────────────────────────────────────────────
// Estos tipos coinciden con lo almacenado en EmailCola.payload

export type PayloadNuevaConsultaAdmin = {
  consultaId: string;
  nombre: string;
  email: string;
  telefono: string;
  localidad?: string;
  especialidad: string;
  tipoProblema: string;
  descripcion: string;
  urgente: boolean;
  createdAt: string; // ISO string
};

export type PayloadConfirmacionCliente = {
  consultaId: string;
  nombre: string;
  tipoProblema: string;
};

export type PayloadTurnoConfirmado = {
  consultaId: string;
  nombre: string;
  email: string;
  modalidad: string;
  fechaConfirmada: string; // ISO string
};

// ── Helpers ───────────────────────────────────────────────────────────────────

function getNombreProblema(tipoProblema: string): string {
  const problema = especialidades
    .flatMap((e) => e.problemas)
    .find((p) => p.id === tipoProblema);
  return problema?.label || tipoProblema;
}

function getNombreEspecialidad(especialidadId: string): string {
  const esp = especialidades.find((e) => e.id === especialidadId);
  return esp?.nombre || especialidadId;
}

// ── Template: nueva-consulta-admin ────────────────────────────────────────────

export async function enviarEmailNuevaConsulta(
  payload: PayloadNuevaConsultaAdmin
): Promise<void> {
  const emailEstudio = process.env.ESTUDIO_EMAIL;
  if (!emailEstudio) {
    console.warn("ESTUDIO_EMAIL no configurado, omitiendo notificación");
    return;
  }

  const asunto = payload.urgente
    ? `[URGENTE] Nueva consulta de ${payload.nombre}`
    : `Nueva consulta de ${payload.nombre}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Nueva Consulta Recibida</h2>

      ${payload.urgente ? '<p style="color: #dc2626; font-weight: bold;">⚠️ MARCADA COMO URGENTE</p>' : ""}

      <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Nombre:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${payload.nombre}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="mailto:${payload.email}">${payload.email}</a>
          </td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Teléfono:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">
            <a href="tel:${payload.telefono}">${payload.telefono}</a>
          </td>
        </tr>
        ${payload.localidad ? `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Localidad:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${payload.localidad}</td>
        </tr>
        ` : ""}
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Especialidad:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${getNombreEspecialidad(payload.especialidad)}</td>
        </tr>
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eee; font-weight: bold;">Tipo de problema:</td>
          <td style="padding: 10px; border-bottom: 1px solid #eee;">${getNombreProblema(payload.tipoProblema)}</td>
        </tr>
      </table>

      <h3 style="color: #333;">Descripción:</h3>
      <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; white-space: pre-wrap;">${payload.descripcion}</div>

      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Consulta recibida el ${new Date(payload.createdAt).toLocaleString("es-AR")}
        <br>
        ID: ${payload.consultaId}
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: emailEstudio,
    subject: asunto,
    html,
  });
}

// ── Template: confirmacion-cliente ────────────────────────────────────────────

export async function enviarEmailConfirmacion(
  payload: PayloadConfirmacionCliente,
  destinatario: string
): Promise<void> {
  const nombreEstudio = process.env.ESTUDIO_NOMBRE || "Estudio Jurídico RS";
  const primerNombre = payload.nombre.split(" ")[0];

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Recibimos tu consulta</h2>

      <p>Hola ${primerNombre},</p>

      <p>
        Gracias por contactarte con ${nombreEstudio}. Recibimos tu consulta sobre
        <strong>${getNombreProblema(payload.tipoProblema).toLowerCase()}</strong> y un profesional
        de nuestro equipo la revisará a la brevedad.
      </p>

      <p>
        Te contactaremos por teléfono o email para coordinar los próximos pasos.
      </p>

      <div style="background: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0; color: #333;">¿Qué sigue?</h3>
        <ol style="margin: 0; padding-left: 20px;">
          <li>Revisamos tu consulta</li>
          <li>Te contactamos para coordinar una entrevista</li>
          <li>Analizamos tu caso de forma personalizada</li>
        </ol>
      </div>

      <p>
        Si tenés alguna urgencia, podés escribirnos a
        <a href="mailto:${process.env.ESTUDIO_EMAIL}">${process.env.ESTUDIO_EMAIL}</a> o
        llamarnos al <a href="tel:${process.env.ESTUDIO_TELEFONO}">${process.env.ESTUDIO_TELEFONO}</a>.
      </p>

      <p>Saludos cordiales,</p>
      <p><strong>${nombreEstudio}</strong></p>

      <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">

      <p style="color: #999; font-size: 12px;">
        <strong>Aviso legal:</strong> Este email es una confirmación de recepción de tu consulta.
        La información proporcionada no constituye asesoramiento legal. Cada caso requiere un
        análisis particular por parte de un profesional.
      </p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: destinatario,
    subject: `Recibimos tu consulta — ${nombreEstudio}`,
    html,
  });
}

// ── Template: turno-confirmado ────────────────────────────────────────────────

export async function enviarEmailTurnoConfirmado(
  payload: PayloadTurnoConfirmado
): Promise<void> {
  const nombreEstudio = process.env.ESTUDIO_NOMBRE || "Estudio Jurídico RS";
  const primerNombre = payload.nombre.split(" ")[0];
  const fecha = new Date(payload.fechaConfirmada);

  const fechaFormateada = fecha.toLocaleDateString("es-AR", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const horaFormateada = fecha.toLocaleTimeString("es-AR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Turno Confirmado</h2>

      <p>Hola ${primerNombre},</p>

      <p>Te confirmamos tu turno para una entrevista:</p>

      <div style="background: #f0f9ff; padding: 20px; border-radius: 5px; border-left: 4px solid #0ea5e9; margin: 20px 0;">
        <p style="margin: 0;"><strong>Fecha:</strong> ${fechaFormateada}</p>
        <p style="margin: 10px 0 0 0;"><strong>Hora:</strong> ${horaFormateada}</p>
        <p style="margin: 10px 0 0 0;"><strong>Modalidad:</strong> ${payload.modalidad === "PRESENCIAL" ? "Presencial" : "Virtual (videollamada)"}</p>
      </div>

      ${payload.modalidad === "PRESENCIAL" ? `
        <p><strong>Dirección:</strong> ${process.env.ESTUDIO_DIRECCION || "Córdoba, Argentina"}</p>
      ` : `
        <p>Te enviaremos el enlace de la videollamada antes de la cita.</p>
      `}

      <p>Si necesitás reprogramar o cancelar, por favor contactanos con anticipación.</p>

      <p>Saludos cordiales,</p>
      <p><strong>${nombreEstudio}</strong></p>
    </div>
  `;

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: payload.email,
    subject: `Turno confirmado — ${nombreEstudio}`,
    html,
  });
}

// ── Verificar conexión SMTP ───────────────────────────────────────────────────

export async function verificarConexionSMTP(): Promise<boolean> {
  try {
    await transporter.verify();
    return true;
  } catch (error) {
    console.error("Error verificando conexión SMTP:", error);
    return false;
  }
}
