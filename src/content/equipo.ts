export interface Profesional {
  id: string;
  nombre: string;
  titulo: string;
  especialidades: string[];
  bio: string;
  email?: string;
  foto?: string;
}

// Datos de ejemplo - reemplazar con los profesionales reales
export const equipo: Profesional[] = [
  {
    id: "1",
    nombre: "Dr. Juan Pérez",
    titulo: "Abogado",
    especialidades: ["Derecho Real y Sucesiones", "Derecho de Familia"],
    bio: "Abogado egresado de la Universidad Nacional de Córdoba. Especialista en derecho civil con más de 15 años de experiencia en el ejercicio de la profesión.",
  },
  {
    id: "2",
    nombre: "Dra. María García",
    titulo: "Abogada",
    especialidades: ["Daños y Accidentes de Tránsito", "Derecho Laboral"],
    bio: "Abogada con amplia experiencia en litigios por daños y perjuicios. Especializada en la defensa de los derechos de trabajadores y víctimas de accidentes.",
  },
  {
    id: "3",
    nombre: "Dr. Carlos López",
    titulo: "Abogado",
    especialidades: ["Derecho Previsional", "Derecho Laboral"],
    bio: "Especialista en derecho previsional y laboral. Dedicado a la gestión de jubilaciones, pensiones y reclamos ante ANSES y organismos previsionales.",
  },
];
