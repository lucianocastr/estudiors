import {
  Home,
  Car,
  Users,
  Clock,
  Briefcase,
  Scroll,
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
}

export const especialidades: Especialidad[] = [
  {
    id: "derecho-real",
    nombre: "Derecho Real",
    slug: "derecho-real",
    icono: Home,
    descripcionCorta:
      "Asesoramiento en juicio de usucapión, escrituraciones, acciones de reivindicación y posesiones.",
    descripcionLarga: `
      Brindamos asesoramiento integral en cuestiones relacionadas con bienes inmuebles.
      Acompañamos a nuestros clientes en los trámites necesarios para regularizar
      situaciones patrimoniales y proteger sus derechos sobre bienes adquiridos,
      poseídos o en conflicto.
    `,
    problemas: [
      {
        id: "usucapion",
        label: "Poseo un inmueble hace más de 20 años sin escritura",
        descripcion: "Prescripción adquisitiva, regularización dominial, usucapión",
      },
      {
        id: "ocupacion-terreno",
        label: "Me ocuparon un terreno",
        descripcion: "Acción reivindicatoria, desalojo, recuperación de la posesión",
      },
      {
        id: "boleto-compraventa",
        label: "Compré un terreno por Boleto de compra y venta",
        descripcion: "Escrituración, cumplimiento de contrato, regularización dominial",
      },
      {
        id: "escrituracion",
        label: "Necesito escriturar un inmueble",
        descripcion: "Escrituración, gestión notarial, regularización de títulos",
      },
      {
        id: "otro-real",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas sobre derechos reales e inmuebles",
      },
    ],
  },
  {
    id: "declaratoria-herederos-sucesiones",
    nombre: "Declaratoria de Herederos y Sucesiones",
    slug: "declaratoria-herederos-sucesiones",
    icono: Scroll,
    descripcionCorta:
      "Inicio de sucesión, declaratoria de herederos, adjudicaciones y tracto abreviado.",
    descripcionLarga: `
      Acompañamos a las familias en el proceso sucesorio desde el fallecimiento del
      causante hasta la adjudicación de los bienes. Gestionamos la declaratoria de
      herederos, las adjudicaciones y el tracto sucesivo abreviado para la
      regularización dominial, tanto en sucesiones extrajudiciales como judiciales.
    `,
    problemas: [
      {
        id: "inicio-sucesion",
        label: "Falleció un familiar y hay bienes",
        descripcion: "Inicio de sucesión, declaratoria de herederos, inventario y avalúo",
      },
      {
        id: "adjudicacion-bienes",
        label: "Necesito adjudicar los bienes de la sucesión",
        descripcion: "Adjudicación de inmuebles y bienes, inscripción registral a nombre de los herederos",
      },
      {
        id: "tracto-abreviado",
        label: "El inmueble tiene varios dueños fallecidos encadenados",
        descripcion: "Tracto sucesivo abreviado, regularización dominial de transmisiones no inscriptas",
      },
      {
        id: "venta-bien-heredado",
        label: "Quiero vender un bien heredado",
        descripcion: "Gestión para habilitar la venta, tracto abreviado previo, escrituración",
      },
      {
        id: "conflicto-herederos",
        label: "Tengo conflictos con otros herederos",
        descripcion: "Protección de derechos hereditarios, partición judicial, mediación",
      },
      {
        id: "otro-sucesiones",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas sobre herencias y sucesiones",
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
      Brindamos asesoramiento y representación en todo tipo de siniestros viales y hechos
      que generen daños y perjuicios, tanto a quienes los sufrieron como a quienes son
      reclamados. Gestionamos negociaciones con compañías de seguros e iniciamos o
      defendemos las acciones judiciales que cada situación requiera.
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
  },
  {
    id: "derecho-familia",
    nombre: "Derecho de Familia",
    slug: "derecho-familia",
    icono: Users,
    descripcionCorta:
      "Divorcio, régimen de responsabilidad parental, acciones de filiación y más.",
    descripcionLarga: `
      Acompañamos a las familias en los momentos de cambio y reorganización.
      Brindamos asesoramiento y representación en divorcios, responsabilidad parental,
      alimentos, acciones de filiación y otros temas que afectan las relaciones
      familiares, priorizando soluciones que resguarden el interés de todas las partes.
    `,
    problemas: [
      {
        id: "divorcio",
        label: "Quiero divorciarme",
        descripcion: "Divorcio unilateral o de común acuerdo, convenio regulador de efectos",
      },
      {
        id: "alimentos-hijos",
        label: "Necesito cuota alimentaria para mis hijos",
        descripcion: "Fijación de alimentos, aumento o reducción de cuota",
      },
      {
        id: "filiacion",
        label: "Mi padre no me reconoce",
        descripcion: "Acción de filiación, reclamación de estado, impugnación de paternidad",
      },
      {
        id: "responsabilidad-parental",
        label: "Quiero ver a mis hijos / No me dejan verlos",
        descripcion: "Régimen de responsabilidad parental, comunicación, cuidado personal",
      },
      {
        id: "incumplimiento-alimentos",
        label: "No me pagan los alimentos",
        descripcion: "Ejecución de cuota alimentaria, reclamo de alimentos adeudados",
      },
      {
        id: "otro-familia",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas sobre temas de familia",
      },
    ],
  },
  {
    id: "derecho-previsional",
    nombre: "Derecho Previsional",
    slug: "derecho-previsional",
    icono: Clock,
    descripcionCorta:
      "Jubilaciones, pensiones y reajustes ante ANSES y Caja de Jubilaciones de la Provincia de Córdoba.",
    descripcionLarga: `
      Asesoramos y representamos a trabajadores y jubilados en trámites y reclamos
      previsionales ante ANSES y la Caja de Jubilaciones, Subsidios y Pensiones
      de la Provincia de Córdoba. Gestionamos jubilaciones, pensiones, reajustes
      de haberes y recursos ante denegaciones o liquidaciones incorrectas.
    `,
    problemas: [
      {
        id: "jubilacion-tramite",
        label: "Quiero jubilarme",
        descripcion: "Inicio de trámite jubilatorio ante ANSES o Caja Provincial, asesoramiento sobre requisitos",
      },
      {
        id: "jubilacion-rechazada",
        label: "Me rechazaron la jubilación",
        descripcion: "Recurso administrativo y judicial ante denegación de beneficio",
      },
      {
        id: "reajuste-haberes",
        label: "Creo que mi jubilación está mal calculada",
        descripcion: "Reajuste de haberes, diferencias por mal cálculo, actualización de prestación",
      },
      {
        id: "pension",
        label: "Necesito una pensión",
        descripcion: "Pensión por fallecimiento del titular, pensión por discapacidad",
      },
      {
        id: "caja-provincial",
        label: "Soy empleado o jubilado provincial",
        descripcion: "Trámites y reclamos ante la Caja de Jubilaciones de la Provincia de Córdoba",
      },
      {
        id: "otro-previsional",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas previsionales",
      },
    ],
  },
  {
    id: "derecho-laboral",
    nombre: "Derecho Laboral y A.R.T.",
    slug: "derecho-laboral",
    icono: Briefcase,
    descripcionCorta:
      "Despidos, accidentes de trabajo, reclamos laborales y reclamos ante A.R.T.",
    descripcionLarga: `
      Defendemos los derechos de los trabajadores frente a situaciones de conflicto
      laboral. Asesoramos en casos de despido, reclamos salariales, accidentes de trabajo
      y enfermedades profesionales, incluyendo reclamos ante Aseguradoras de Riesgos
      del Trabajo (A.R.T.) por incapacidades laborales.
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
        descripcion: "Reclamo a A.R.T., incapacidad laboral, enfermedades profesionales",
      },
      {
        id: "art-no-cubre",
        label: "La A.R.T. no me cubre o me rechazó",
        descripcion: "Impugnación de rechazo, reclamo judicial por incapacidad, diferencias de prestaciones",
      },
      {
        id: "salarios-adeudados",
        label: "No me pagan el sueldo",
        descripcion: "Reclamo de salarios, horas extra, aguinaldo",
      },
      {
        id: "otro-laboral",
        label: "Otro tema relacionado",
        descripcion: "Otras consultas laborales",
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
