import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("Iniciando seed...");

  // ── Organización por defecto ──────────────────────────────
  const organizacion = await prisma.organizacion.upsert({
    where: { slug: "estudio-rs" },
    update: {},
    create: {
      nombre: "Estudio Jurídico RS",
      slug: "estudio-rs",
      plan: "FREE",
      activa: true,
    },
  });
  console.log("Organización creada:", organizacion.slug);

  // ── Usuario administrador ─────────────────────────────────
  // Configurable via variable de entorno ADMIN_EMAIL
  const adminEmail = process.env.ADMIN_EMAIL ?? "admin@ejemplo.com";
  const admin = await prisma.usuario.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      nombre: "Romina Belén Sanchez",
      rol: "OWNER",
      titulo: "Dra.",
      activo: true,
    },
  });
  console.log("Usuario admin creado:", admin.email);

  // ── Membresía: admin como OWNER de la organización ────────
  await prisma.organizacionMiembro.upsert({
    where: {
      organizacionId_usuarioId: {
        organizacionId: organizacion.id,
        usuarioId: admin.id,
      },
    },
    update: {},
    create: {
      organizacionId: organizacion.id,
      usuarioId: admin.id,
      rol: "OWNER",
      activo: true,
    },
  });
  console.log("Membresía OWNER creada");

  // ── Especialidades ────────────────────────────────────────
  const especialidadesData = [
    {
      nombre: "Derecho Real y Sucesiones",
      slug: "derecho-real-sucesiones",
      descripcionCorta:
        "Asesoramiento en temas de propiedades, herencias y trámites sucesorios.",
      descripcionLarga:
        "Brindamos asesoramiento integral en cuestiones relacionadas con bienes inmuebles, herencias y procesos sucesorios.",
      problemasComunes: ["Sucesiones", "Herencias", "Usucapión", "Compraventa de inmuebles"],
      orden: 1,
    },
    {
      nombre: "Daños y Accidentes de Tránsito",
      slug: "danos-accidentes",
      descripcionCorta:
        "Reclamos por accidentes de tránsito y todo tipo de daños y perjuicios.",
      descripcionLarga:
        "Representamos a víctimas de accidentes de tránsito y otros hechos que generen daños y perjuicios.",
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
      descripcionLarga:
        "Acompañamos a las familias en los momentos de cambio y reorganización.",
      problemasComunes: ["Divorcios", "Alimentos", "Régimen de visitas", "Violencia familiar"],
      orden: 3,
    },
    {
      nombre: "Derecho Previsional",
      slug: "derecho-previsional",
      descripcionCorta: "Jubilaciones, pensiones, reajustes y reclamos a ANSES.",
      descripcionLarga:
        "Asesoramos y representamos a trabajadores y jubilados en trámites y reclamos previsionales.",
      problemasComunes: ["Jubilaciones", "Pensiones", "Reajustes", "Moratorias"],
      orden: 4,
    },
    {
      nombre: "Derecho Laboral",
      slug: "derecho-laboral",
      descripcionCorta: "Despidos, accidentes de trabajo, reclamos laborales y más.",
      descripcionLarga:
        "Defendemos los derechos de los trabajadores frente a situaciones de conflicto laboral.",
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

  console.log("\nSeed completado exitosamente!");
  console.log("─────────────────────────────────────────");
  console.log(`Organización: ${organizacion.nombre} (slug: ${organizacion.slug})`);
  console.log(`Admin:        ${admin.email}`);
  console.log("─────────────────────────────────────────");
  console.log("Configurar en .env: DEFAULT_ORGANIZATION_ID=" + organizacion.id);
  console.log("Configurar en .env: ADMIN_EMAIL=<email-real-de-google>");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
