import {
  Home,
  Car,
  Users,
  Clock,
  Briefcase,
  type LucideIcon,
} from "lucide-react";

export interface TipoProblema {
  id: string;
  label: string;
  descripcion: string;
}

export interface Especialidad {
  id: string;
  nombre: string;
  slug: string;
  icono: LucideIcon;
  descripcionCorta: string;
  descripcionLarga: string;
  problemas: TipoProblema[];
  preguntasFrecuentes: { pregunta: string; respuesta: string }[];
}

export const especialidades: Especialidad[] = [
  {
    id: "derecho-real-sucesiones",
    nombre: "Derecho Real y Sucesiones",
    slug: "derecho-real-sucesiones",
    icono: Home,
    descripcionCorta:
      "Asesoramiento en temas de propiedades, herencias y trámites sucesorios.",
    descripcionLarga: `
      Brindamos asesoramiento integral en cuestiones relacionadas con bienes inmuebles,
      herencias y procesos sucesorios. Acompañamos a nuestros clientes en los trámites
      necesarios para regularizar situaciones patrimoniales y proteger sus derechos sobre
      bienes heredados o adquiridos.
    `,
    problemas: [
      {
        id: "herencia-fallecimiento",
        label: "Falleció un familiar y hay bienes",
        descripcion: "Inicio de sucesión, declaratoria de herederos, partición de bienes",
      },
      {
        id: "venta-herencia",
        label: "Quiero vender un bien heredado",
        descripcion: "Regularización de títulos, tracto sucesivo, venta de bienes de la sucesión",
      },
      {
        id: "conflicto-herederos",
        label: "Tengo conflictos con otros herederos",
        descripcion: "Mediación entre herederos, partición judicial, protección de derechos",
      },
      {
        id: "testamento",
        label: "Quiero hacer un testamento",
        descripcion: "Redacción de testamento, planificación sucesoria, protección de bienes",
      },
      {
        id: "usucapion",
        label: "Ocupo un terreno hace años sin escritura",
        descripcion: "Prescripción adquisitiva, regularización dominial, usucapión",
      },
      {
        id: "otro-sucesiones",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas sobre bienes o herencias",
      },
    ],
    preguntasFrecuentes: [
      {
        pregunta: "¿Cuánto tiempo tengo para iniciar una sucesión?",
        respuesta:
          "No hay un plazo límite para iniciar la sucesión, pero es recomendable hacerlo lo antes posible para evitar complicaciones con los bienes.",
      },
      {
        pregunta: "¿Qué documentos necesito para iniciar una sucesión?",
        respuesta:
          "Generalmente se necesita: partida de defunción, partidas de nacimiento de los herederos, títulos de los bienes, y documentación que acredite el vínculo familiar.",
      },
    ],
  },
  {
    id: "danos-accidentes",
    nombre: "Daños y Accidentes de Tránsito",
    slug: "danos-accidentes",
    icono: Car,
    descripcionCorta:
      "Reclamos por accidentes de tránsito y todo tipo de daños y perjuicios.",
    descripcionLarga: `
      Representamos a víctimas de accidentes de tránsito y otros hechos que generen
      daños y perjuicios. Gestionamos reclamos ante compañías de seguros y, de ser
      necesario, iniciamos las acciones judiciales correspondientes para obtener una
      justa reparación.
    `,
    problemas: [
      {
        id: "accidente-transito-victima",
        label: "Tuve un accidente de tránsito",
        descripcion: "Reclamo a seguro, demanda por daños, lesiones personales",
      },
      {
        id: "accidente-transito-demandado",
        label: "Me reclaman por un accidente",
        descripcion: "Defensa ante reclamos, negociación con seguros",
      },
      {
        id: "seguro-no-paga",
        label: "El seguro no quiere pagar",
        descripcion: "Reclamo judicial a aseguradoras, incumplimiento de póliza",
      },
      {
        id: "lesiones-personales",
        label: "Sufrí lesiones por culpa de otro",
        descripcion: "Indemnización por lesiones, daño físico y moral",
      },
      {
        id: "danos-propiedad",
        label: "Dañaron mi propiedad",
        descripcion: "Reclamo por daños materiales a bienes",
      },
      {
        id: "otro-danos",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas sobre daños y accidentes",
      },
    ],
    preguntasFrecuentes: [
      {
        pregunta: "¿Cuánto tiempo tengo para reclamar después de un accidente?",
        respuesta:
          "El plazo general para iniciar un reclamo por daños es de 3 años desde que ocurrió el hecho.",
      },
      {
        pregunta: "¿Qué pasa si el otro conductor no tiene seguro?",
        respuesta:
          "Podés reclamar directamente al conductor responsable. También existen fondos de garantía para ciertas situaciones.",
      },
    ],
  },
  {
    id: "derecho-familia",
    nombre: "Derecho de Familia",
    slug: "derecho-familia",
    icono: Users,
    descripcionCorta:
      "Divorcios, alimentos, régimen de comunicación, adopciones y más.",
    descripcionLarga: `
      Acompañamos a las familias en los momentos de cambio y reorganización.
      Brindamos asesoramiento y representación en divorcios, acuerdos de alimentos,
      regímenes de comunicación con hijos, y otros temas que afectan las relaciones
      familiares, siempre priorizando soluciones consensuadas cuando es posible.
    `,
    problemas: [
      {
        id: "divorcio",
        label: "Quiero divorciarme",
        descripcion: "Divorcio de común acuerdo o contencioso, convenio regulador",
      },
      {
        id: "alimentos-hijos",
        label: "Necesito cuota alimentaria para mis hijos",
        descripcion: "Fijación de alimentos, aumento o reducción de cuota",
      },
      {
        id: "regimen-comunicacion",
        label: "Quiero ver a mis hijos / No me dejan verlos",
        descripcion: "Régimen de visitas, comunicación paterno-filial",
      },
      {
        id: "incumplimiento-alimentos",
        label: "No me pagan los alimentos",
        descripcion: "Ejecución de cuota alimentaria, reclamo de alimentos adeudados",
      },
      {
        id: "violencia-familiar",
        label: "Sufro violencia en mi hogar",
        descripcion: "Medidas de protección, denuncia, exclusión del hogar",
      },
      {
        id: "otro-familia",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas sobre temas de familia",
      },
    ],
    preguntasFrecuentes: [
      {
        pregunta: "¿Cuánto tiempo demora un divorcio?",
        respuesta:
          "Un divorcio de común acuerdo puede resolverse en pocos meses. Si hay desacuerdos sobre bienes o hijos, el proceso puede extenderse.",
      },
      {
        pregunta: "¿Cómo se calcula la cuota alimentaria?",
        respuesta:
          "Se considera el costo de vida del menor, las necesidades específicas, y la capacidad económica de ambos padres.",
      },
    ],
  },
  {
    id: "derecho-previsional",
    nombre: "Derecho Previsional",
    slug: "derecho-previsional",
    icono: Clock,
    descripcionCorta:
      "Jubilaciones, pensiones, reajustes y reclamos a ANSES.",
    descripcionLarga: `
      Asesoramos y representamos a trabajadores y jubilados en trámites y reclamos
      previsionales. Gestionamos jubilaciones, pensiones, reajustes de haberes y
      cualquier conflicto con organismos previsionales como ANSES.
    `,
    problemas: [
      {
        id: "jubilacion-tramite",
        label: "Quiero jubilarme",
        descripcion: "Inicio de trámite jubilatorio, asesoramiento sobre requisitos",
      },
      {
        id: "jubilacion-rechazada",
        label: "Me rechazaron la jubilación",
        descripcion: "Recurso administrativo, reclamo judicial",
      },
      {
        id: "reajuste-haberes",
        label: "Creo que mi jubilación está mal calculada",
        descripcion: "Reajuste de haberes, diferencias por mal cálculo",
      },
      {
        id: "pension",
        label: "Necesito una pensión",
        descripcion: "Pensión por fallecimiento, pensión por discapacidad",
      },
      {
        id: "moratoria",
        label: "No tengo todos los aportes",
        descripcion: "Moratorias previsionales, regularización de aportes",
      },
      {
        id: "otro-previsional",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas previsionales",
      },
    ],
    preguntasFrecuentes: [
      {
        pregunta: "¿Cuántos años de aportes necesito para jubilarme?",
        respuesta:
          "Generalmente se requieren 30 años de aportes y la edad jubilatoria (60 años mujeres, 65 años hombres en el régimen general).",
      },
      {
        pregunta: "¿Puedo jubilarme si no tengo todos los aportes?",
        respuesta:
          "Existen moratorias y planes de regularización que permiten completar los años de aportes faltantes.",
      },
    ],
  },
  {
    id: "derecho-laboral",
    nombre: "Derecho Laboral",
    slug: "derecho-laboral",
    icono: Briefcase,
    descripcionCorta:
      "Despidos, accidentes de trabajo, reclamos laborales y más.",
    descripcionLarga: `
      Defendemos los derechos de los trabajadores frente a situaciones de conflicto
      laboral. Asesoramos en casos de despido, accidentes de trabajo, reclamos salariales
      y cualquier vulneración de derechos en el ámbito laboral.
    `,
    problemas: [
      {
        id: "despido",
        label: "Me despidieron",
        descripcion: "Indemnización por despido, despido sin causa, despido discriminatorio",
      },
      {
        id: "trabajo-no-registrado",
        label: "Trabajo en negro",
        descripcion: "Regularización laboral, reclamo por falta de registro",
      },
      {
        id: "accidente-trabajo",
        label: "Tuve un accidente en el trabajo",
        descripcion: "Reclamo a ART, incapacidad laboral, enfermedades profesionales",
      },
      {
        id: "salarios-adeudados",
        label: "No me pagan el sueldo",
        descripcion: "Reclamo de salarios, horas extra, aguinaldo",
      },
      {
        id: "acoso-laboral",
        label: "Sufro acoso o maltrato laboral",
        descripcion: "Mobbing, acoso laboral, ambiente de trabajo hostil",
      },
      {
        id: "otro-laboral",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas laborales",
      },
    ],
    preguntasFrecuentes: [
      {
        pregunta: "¿Cuánto tiempo tengo para reclamar después de un despido?",
        respuesta:
          "El plazo para reclamar diferencias salariales e indemnizaciones es de 2 años desde que se generó el derecho.",
      },
      {
        pregunta: "¿Me pueden despedir sin causa?",
        respuesta:
          "El empleador puede despedir sin causa, pero debe pagar la indemnización correspondiente según la ley.",
      },
    ],
  },
];

// Obtener especialidad por slug
export function getEspecialidadBySlug(slug: string): Especialidad | undefined {
  return especialidades.find((e) => e.slug === slug);
}

// Obtener todos los problemas con su especialidad
export function getAllProblemas(): (TipoProblema & { especialidadId: string })[] {
  return especialidades.flatMap((esp) =>
    esp.problemas.map((prob) => ({
      ...prob,
      especialidadId: esp.id,
    }))
  );
}

// Obtener especialidad por problema
export function getEspecialidadByProblema(problemaId: string): Especialidad | undefined {
  return especialidades.find((esp) =>
    esp.problemas.some((prob) => prob.id === problemaId)
  );
}
