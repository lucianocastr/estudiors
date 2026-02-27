"use server";

import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { generarNumeroCaso } from "@/lib/crp-utils";
import type {
  CRPObjetivoCliente,
  CRPSituacionLaboral,
  CRPNivelSocioeconomico,
  CRPSituacionBCRA,
} from "@prisma/client";

export async function crearCaso(formData: FormData) {
  const session = await auth();
  if (!session?.user) throw new Error("No autorizado");

  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) throw new Error("Sin organización");

  const organizacionId = membresia.organizacionId;

  // Contacto: buscar por id o crear nuevo
  const contactoId = formData.get("contactoId") as string;
  const nombreNuevo = (formData.get("nombreNuevo") as string)?.trim();
  const emailNuevo = (formData.get("emailNuevo") as string)?.trim();
  const telefonoNuevo = (formData.get("telefonoNuevo") as string)?.trim();

  let resolvedContactoId = contactoId;

  if (!resolvedContactoId && nombreNuevo && emailNuevo && telefonoNuevo) {
    const contacto = await prisma.contacto.create({
      data: {
        organizacionId,
        nombre: nombreNuevo,
        email: emailNuevo,
        telefono: telefonoNuevo,
        esCliente: true,
        clienteDesdeAt: new Date(),
      },
    });
    resolvedContactoId = contacto.id;
  }

  if (!resolvedContactoId) throw new Error("Contacto requerido");

  const numeroCaso = await generarNumeroCaso(organizacionId);

  const caso = await prisma.casoRestructuracion.create({
    data: {
      numeroCaso,
      organizacionId,
      contactoId: resolvedContactoId,
      abogadoId: session.user.id,
      cuit: (formData.get("cuit") as string) || null,
      objetivoCliente: (formData.get("objetivoCliente") as CRPObjetivoCliente) || null,
      situacionLaboral: (formData.get("situacionLaboral") as CRPSituacionLaboral) || null,
      nivelSocioeconomico: (formData.get("nivelSocioeconomico") as CRPNivelSocioeconomico) || null,
      estadoBCRA: (formData.get("estadoBCRA") as CRPSituacionBCRA) || null,
      checklistDiagnostico: {
        prescripcionRevisada: false,
        cesionVerificada: false,
        interesesEvaluados: false,
        mediacionNotificada: false,
        inhibicionConsultada: false,
        revocatoriaEvaluada: false,
        bienFamiliaInscripto: false,
        codeudoresIdentificados: false,
        ingresoFormal: false,
      },
    },
  });

  redirect(`/panel/reestructuracion/${caso.id}`);
}
