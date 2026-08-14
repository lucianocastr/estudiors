import { Home, Scroll, Briefcase, Car, Users, type LucideIcon } from "lucide-react";
import type { IndicadorReferencia } from "@prisma/client";

export interface SeccionArticulo {
  titulo?: string;
  parrafos: string[];
}

export interface EnlaceExterno {
  texto: string;
  descripcion: string;
  url: string;
}

export interface Articulo {
  slug: string;
  titulo: string;
  resumen: string;
  icono: LucideIcon;
  especialidadSlug: string;
  especialidadNombre: string;
  fechaPublicacion: string; // ISO (YYYY-MM-DD) — para JSON-LD
  contenido: SeccionArticulo[];
  enlaceExterno?: EnlaceExterno;
  indicador?: IndicadorReferencia; // muestra la tabla de valores vigentes del indicador
}

// NOTA: contenido educativo/orientativo. Debe ser revisado y aprobado por la
// profesional antes de considerarse definitivo. No promete resultados ni
// incluye cifras que se desactualicen.
export const articulos: Articulo[] = [
  {
    slug: "canasta-de-crianza-cuota-alimentaria",
    titulo: "Canasta de crianza: cuánto cuesta criar un hijo según su edad",
    resumen:
      "Qué es la canasta de crianza que publica el INDEC, cómo cambia según la edad de los chicos y de qué manera se relaciona con la cuota alimentaria.",
    icono: Users,
    especialidadSlug: "derecho-familia",
    especialidadNombre: "Derecho de Familia",
    fechaPublicacion: "2026-08-14",
    indicador: "CANASTA_CRIANZA",
    contenido: [
      {
        parrafos: [
          "Una de las preguntas más frecuentes en temas de familia es cuánto debería cubrir una cuota alimentaria. Para orientar esa respuesta existe un dato oficial: la canasta de crianza que publica el INDEC.",
        ],
      },
      {
        titulo: "¿Qué es la canasta de crianza?",
        parrafos: [
          "Es un valor de referencia, elaborado por el Estado, que estima cuánto cuesta criar a un hijo por mes según su edad. Se actualiza mensualmente y abarca a los niños y niñas hasta los 12 años.",
          "Se compone de dos partes: por un lado, los bienes y servicios que necesita un chico (alimentación, salud, educación, vestimenta, transporte, esparcimiento); por otro, el costo del cuidado, es decir, el valor de las horas que alguien dedica a criarlo.",
        ],
      },
      {
        titulo: "¿Por qué cambia según la edad?",
        parrafos: [
          "Las necesidades no son las mismas en cada etapa. A medida que el chico crece aparecen gastos de escolaridad, transporte, indumentaria y actividades que antes no existían, y también cambian las horas de cuidado. Por eso el valor se calcula por tramos de edad.",
        ],
      },
      {
        titulo: "Su relación con la cuota alimentaria",
        parrafos: [
          "La canasta de crianza se usa como un parámetro objetivo para pensar cuánto cuesta mantener a un hijo. Es una guía útil al momento de fijar o de actualizar una cuota.",
          "Ahora bien, es importante entender que no es automática: la cuota no equivale sin más al valor de la canasta. Cada caso se analiza en particular, considerando las necesidades concretas del niño y las posibilidades de cada progenitor. La canasta orienta; no reemplaza ese análisis.",
        ],
      },
      {
        titulo: "¿Cuándo conviene revisar una cuota?",
        parrafos: [
          "Si la cuota quedó desactualizada por el paso del tiempo, si cambiaron las necesidades del hijo o si se modificó la situación de alguno de los padres, puede corresponder pedir una actualización. También puede reclamarse cuando no se paga.",
        ],
      },
    ],
    enlaceExterno: {
      texto: "Ver los valores oficiales vigentes (INDEC)",
      descripcion:
        "El valor de la canasta de crianza se actualiza todos los meses. Podés consultar el dato oficial más reciente en el sitio del INDEC.",
      url: "https://www.indec.gob.ar/indec/web/Nivel4-Tema-4-43-173",
    },
  },
  {
    slug: "usucapion-inmueble-sin-escritura",
    titulo: "Usucapión: cómo regularizar un inmueble que poseés hace años",
    resumen:
      "Qué es la prescripción adquisitiva (usucapión), en qué casos se aplica y qué se necesita para regularizar el dominio de un inmueble a tu nombre.",
    icono: Home,
    especialidadSlug: "derecho-real",
    especialidadNombre: "Derecho Real",
    fechaPublicacion: "2026-08-14",
    contenido: [
      {
        parrafos: [
          "Vivir o usar un inmueble durante muchos años no siempre significa ser su dueño legal. Cuando falta la escritura a nombre de quien lo posee, la usucapión puede ser el camino para regularizar esa situación.",
        ],
      },
      {
        titulo: "¿Qué es la usucapión?",
        parrafos: [
          "Es un modo de adquirir la propiedad de un inmueble por haberlo poseído durante el tiempo que fija la ley. También se la llama prescripción adquisitiva. En términos generales, la posesión larga requiere veinte años.",
        ],
      },
      {
        titulo: "¿Qué se tiene en cuenta?",
        parrafos: [
          "No alcanza con estar en el lugar: la posesión debe ser continua, pública (a la vista de todos) y ejercida como si uno fuera el dueño, durante el plazo legal. Pagar impuestos, hacer mejoras y contar con testigos suelen ser elementos importantes para probarla.",
        ],
      },
      {
        titulo: "Situaciones frecuentes",
        parrafos: [
          "Es habitual en terrenos ocupados durante décadas sin título, en inmuebles comprados por boleto de compraventa que nunca se escrituraron, o en propiedades con cadenas de dueños fallecidos sin regularizar. Cada caso tiene sus particularidades y conviene analizarlo antes de iniciar el trámite.",
        ],
      },
    ],
  },
  {
    slug: "como-iniciar-una-sucesion",
    titulo: "Sucesiones: qué hacer cuando fallece un familiar y quedan bienes",
    resumen:
      "Cuándo hace falta iniciar una sucesión, qué es la declaratoria de herederos y cómo es el proceso para poder disponer de los bienes heredados.",
    icono: Scroll,
    especialidadSlug: "declaratoria-herederos-sucesiones",
    especialidadNombre: "Declaratoria de Herederos y Sucesiones",
    fechaPublicacion: "2026-08-14",
    contenido: [
      {
        parrafos: [
          "Cuando fallece un familiar y deja bienes —una casa, un auto, un terreno, cuentas—, para poder disponer de ellos hace falta realizar la sucesión. Es un trámite que muchas familias postergan y que conviene encarar a tiempo.",
        ],
      },
      {
        titulo: "¿Qué es la declaratoria de herederos?",
        parrafos: [
          "Es la resolución que reconoce quiénes son los herederos del fallecido. A partir de ella se pueden inscribir los bienes a nombre de esos herederos y así venderlos, transferirlos o disponer de ellos.",
        ],
      },
      {
        titulo: "¿Cómo es el proceso?",
        parrafos: [
          "En líneas generales se inicia el trámite, se acredita el vínculo con el fallecido, se identifican los bienes y se dicta la declaratoria. Según el caso, la sucesión puede tramitarse de manera judicial o, cuando es posible, por vías más simples.",
          "Cuando hay varios dueños fallecidos encadenados sin regularizar, existe el tracto sucesivo abreviado, que permite ordenar esas transmisiones para regularizar el dominio.",
        ],
      },
      {
        titulo: "Si hay conflictos entre herederos",
        parrafos: [
          "No siempre los herederos están de acuerdo. En esos casos existen herramientas para proteger los derechos de cada uno, desde la mediación hasta la partición judicial de los bienes.",
        ],
      },
    ],
  },
  {
    slug: "te-despidieron-tus-derechos",
    titulo: "Te despidieron: qué te corresponde y qué revisar antes de firmar",
    resumen:
      "Qué derechos tenés frente a un despido, por qué conviene revisar la liquidación antes de firmar y qué pasa si trabajabas sin estar registrado.",
    icono: Briefcase,
    especialidadSlug: "derecho-laboral",
    especialidadNombre: "Derecho Laboral y A.R.T.",
    fechaPublicacion: "2026-08-14",
    indicador: "SMVM",
    contenido: [
      {
        parrafos: [
          "Un despido genera incertidumbre, y muchas veces se firma la liquidación sin saber bien qué corresponde. Conocer tus derechos antes de dar ese paso puede marcar una diferencia importante.",
        ],
      },
      {
        titulo: "¿Qué puede corresponder en un despido sin causa?",
        parrafos: [
          "Según tu situación, puede incluir la indemnización por antigüedad, el preaviso, la integración del mes de despido y los rubros proporcionales como aguinaldo y vacaciones no gozadas. Los montos dependen de tu antigüedad y tu remuneración.",
        ],
      },
      {
        titulo: "Revisá antes de firmar",
        parrafos: [
          "Antes de aceptar un acuerdo o firmar la liquidación final, conviene verificar que los montos estén bien calculados. Una vez firmado, reclamar diferencias puede ser más difícil.",
        ],
      },
      {
        titulo: "Si trabajabas sin registrar",
        parrafos: [
          "Si estabas 'en negro' o mal registrado (con una fecha de ingreso o un sueldo distinto al real), también podés tener derecho a reclamar. Hay plazos legales para hacerlo, así que no conviene dejar pasar el tiempo.",
        ],
      },
    ],
  },
  {
    slug: "accidente-de-transito-como-reclamar",
    titulo: "Accidente de tránsito: qué podés reclamar y cómo actuar",
    resumen:
      "Qué daños se pueden reclamar tras un accidente de tránsito, cuál es el rol del seguro y qué conviene hacer en los momentos posteriores al hecho.",
    icono: Car,
    especialidadSlug: "danos-accidentes",
    especialidadNombre: "Daños y Accidentes de Tránsito",
    fechaPublicacion: "2026-08-14",
    contenido: [
      {
        parrafos: [
          "Después de un accidente de tránsito es común no saber por dónde empezar, sobre todo cuando la aseguradora ofrece menos de lo esperado o directamente no responde. Conocer qué podés reclamar ayuda a tomar mejores decisiones.",
        ],
      },
      {
        titulo: "¿Qué se puede reclamar?",
        parrafos: [
          "Según el caso, pueden reclamarse los daños en el vehículo, las lesiones físicas, los gastos médicos y de traslado, el tiempo que no pudiste trabajar y el daño moral. Cada situación se evalúa de manera particular.",
        ],
      },
      {
        titulo: "Qué conviene hacer después del accidente",
        parrafos: [
          "En lo posible, dejá constancia de lo ocurrido (fotos, datos del otro vehículo y de testigos, denuncia policial) y hacé la consulta médica correspondiente aunque las lesiones parezcan leves. Guardá toda la documentación y los comprobantes de gastos.",
        ],
      },
      {
        titulo: "No aceptes la primera oferta sin revisarla",
        parrafos: [
          "No estás obligado a aceptar lo primero que ofrece una aseguradora. Antes de cerrar un acuerdo, conviene evaluar si cubre realmente los daños sufridos.",
        ],
      },
    ],
  },
];

export function getArticuloBySlug(slug: string): Articulo | undefined {
  return articulos.find((a) => a.slug === slug);
}

/** Minutos estimados de lectura (~200 palabras/min). */
export function tiempoLectura(articulo: Articulo): number {
  const palabras = articulo.contenido.reduce(
    (acc, s) => acc + s.parrafos.join(" ").split(/\s+/).filter(Boolean).length,
    0
  );
  return Math.max(1, Math.round(palabras / 200));
}

const MESES_ES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

/** "2026-08-14" → "14 de agosto de 2026" (sin desfase de zona horaria). */
export function formatFechaArticulo(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} de ${MESES_ES[m - 1] ?? ""} de ${y}`;
}

/** Otros artículos, priorizando la misma especialidad. */
export function getArticulosRelacionados(slug: string, limit = 3): Articulo[] {
  const actual = getArticuloBySlug(slug);
  const otros = articulos.filter((a) => a.slug !== slug);
  const mismos = actual
    ? otros.filter((a) => a.especialidadSlug === actual.especialidadSlug)
    : [];
  const resto = otros.filter((a) => !mismos.includes(a));
  return [...mismos, ...resto].slice(0, limit);
}
