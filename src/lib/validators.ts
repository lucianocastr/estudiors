import { z } from "zod";

// ============================================
// CONSULTA
// ============================================

export const consultaSchema = z.object({
  tipoProblema: z.string().min(1, "Seleccioná el tipo de problema"),
  especialidad: z.string().min(1, "Especialidad requerida"),
  descripcion: z
    .string()
    .min(20, "Por favor, describí tu situación con al menos 20 caracteres")
    .max(2000, "La descripción no puede superar los 2000 caracteres"),
  urgente: z.boolean(),
  nombre: z
    .string()
    .min(2, "El nombre debe tener al menos 2 caracteres")
    .max(100, "El nombre no puede superar los 100 caracteres"),
  email: z.string().email("Ingresá un email válido"),
  telefono: z
    .string()
    .min(8, "El teléfono debe tener al menos 8 dígitos")
    .max(20, "El teléfono no puede superar los 20 caracteres")
    .regex(/^[\d\s\-+()]+$/, "El teléfono solo puede contener números, espacios, guiones y paréntesis"),
  localidad: z.string().min(1, "Ingresá tu localidad").max(100),
  aceptaTerminos: z.boolean().refine((val) => val === true, {
    message: "Debés aceptar los términos y condiciones",
  }),
  disclaimerLeido: z.boolean().refine((val) => val === true, {
    message: "Debés confirmar que leíste el aviso legal",
  }),
});

export type ConsultaInput = z.infer<typeof consultaSchema>;

// ============================================
// TURNO
// ============================================

export const turnoSchema = z.object({
  consultaId: z.string().min(1, "ID de consulta inválido"),
  modalidad: z.enum(["PRESENCIAL", "VIRTUAL"], {
    message: "Seleccioná una modalidad",
  }),
  fechaPreferida: z
    .string()
    .regex(/^\d{2}\/\d{2}\/\d{4}$/, "El formato debe ser dd/mm/yyyy")
    .refine((val) => {
      const [dia, mes, anio] = val.split("/").map(Number);
      const fecha = new Date(anio, mes - 1, dia);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      return fecha >= hoy;
    }, "La fecha debe ser posterior a hoy"),
  horarioPreferido: z.enum(["manana", "tarde"], {
    message: "Seleccioná un horario preferido",
  }),
});

export type TurnoInput = z.infer<typeof turnoSchema>;

// ============================================
// CONSULTA CON TURNO (formulario completo)
// ============================================

export const consultaConTurnoSchema = consultaSchema.extend({
  turno: z.object({
    modalidad: z.enum(["PRESENCIAL", "VIRTUAL"], {
      message: "Seleccioná una modalidad",
    }),
    fechaPreferida: z
      .string()
      .regex(/^\d{2}\/\d{2}\/\d{4}$/, "El formato debe ser dd/mm/yyyy")
      .refine((val) => {
        const [dia, mes, anio] = val.split("/").map(Number);
        const fecha = new Date(anio, mes - 1, dia);
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0);
        return fecha >= hoy;
      }, "La fecha debe ser posterior a hoy"),
    horarioPreferido: z.enum(["manana", "tarde"], {
      message: "Seleccioná un horario preferido",
    }),
  }),
});

export type ConsultaConTurnoInput = z.infer<typeof consultaConTurnoSchema>;

// ============================================
// NOTA
// ============================================

export const notaSchema = z.object({
  consultaId: z.string().min(1, "ID de consulta inválido"),
  contenido: z
    .string()
    .min(1, "La nota no puede estar vacía")
    .max(5000, "La nota no puede superar los 5000 caracteres"),
});

export type NotaInput = z.infer<typeof notaSchema>;

// ============================================
// CONTACTO (formulario simple)
// ============================================

export const contactoSchema = z.object({
  nombre: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Ingresá un email válido"),
  telefono: z.string().optional(),
  mensaje: z
    .string()
    .min(10, "El mensaje debe tener al menos 10 caracteres")
    .max(1000, "El mensaje no puede superar los 1000 caracteres"),
  aceptaTerminos: z.boolean().refine((val) => val === true, {
    message: "Debés aceptar los términos y condiciones",
  }),
});

export type ContactoInput = z.infer<typeof contactoSchema>;
