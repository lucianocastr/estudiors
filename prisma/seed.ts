import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // Crear usuario admin de ejemplo
  // IMPORTANTE: Cambiar el email por el email real del administrador
  const admin = await prisma.usuario.upsert({
    where: { email: "admin@ejemplo.com" },
    update: {},
    create: {
      email: "admin@ejemplo.com",
      nombre: "Administrador",
      rol: "ADMIN",
      titulo: "Dr.",
      activo: true,
    },
  });

  console.log("Usuario admin creado:", admin.email);

  // Crear especialidades en la base de datos
  const especialidadesData = [
    {
      nombre: "Derecho Real y Sucesiones",
      slug: "derecho-real-sucesiones",
      descripcionCorta: "Asesoramiento en temas de propiedades, herencias y trámites sucesorios.",
      descripcionLarga: "Brindamos asesoramiento integral en cuestiones relacionadas con bienes inmuebles, herencias y procesos sucesorios.",
      problemasComunes: [
        "Sucesiones",
        "Herencias",
        "Usucapión",
        "Compraventa de inmuebles",
      ],
      orden: 1,
    },
    {
      nombre: "Daños y Accidentes de Tránsito",
      slug: "danos-accidentes",
      descripcionCorta: "Reclamos por accidentes de tránsito y todo tipo de daños y perjuicios.",
      descripcionLarga: "Representamos a víctimas de accidentes de tránsito y otros hechos que generen daños y perjuicios.",
      problemasComunes: [
        "Accidentes de tránsito",
        "Reclamos a seguros",
        "Lesiones personales",
        "Daños materiales",
      ],
      orden: 2,
    },
    {
      nombre: "Derecho de Familia",
      slug: "derecho-familia",
      descripcionCorta: "Divorcios, alimentos, régimen de comunicación, adopciones y más.",
      descripcionLarga: "Acompañamos a las familias en los momentos de cambio y reorganización.",
      problemasComunes: [
        "Divorcios",
        "Alimentos",
        "Régimen de visitas",
        "Violencia familiar",
      ],
      orden: 3,
    },
    {
      nombre: "Derecho Previsional",
      slug: "derecho-previsional",
      descripcionCorta: "Jubilaciones, pensiones, reajustes y reclamos a ANSES.",
      descripcionLarga: "Asesoramos y representamos a trabajadores y jubilados en trámites y reclamos previsionales.",
      problemasComunes: [
        "Jubilaciones",
        "Pensiones",
        "Reajustes",
        "Moratorias",
      ],
      orden: 4,
    },
    {
      nombre: "Derecho Laboral",
      slug: "derecho-laboral",
      descripcionCorta: "Despidos, accidentes de trabajo, reclamos laborales y más.",
      descripcionLarga: "Defendemos los derechos de los trabajadores frente a situaciones de conflicto laboral.",
      problemasComunes: [
        "Despidos",
        "Trabajo no registrado",
        "Accidentes laborales",
        "Acoso laboral",
      ],
      orden: 5,
    },
  ];

  for (const esp of especialidadesData) {
    await prisma.especialidad.upsert({
      where: { slug: esp.slug },
      update: esp,
      create: esp,
    });
    console.log("Especialidad creada:", esp.nombre);
  }

  console.log("Seed completado!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
