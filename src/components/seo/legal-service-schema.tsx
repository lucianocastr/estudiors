const SITE_URL = "https://www.rsestudiojuridico.com.ar";

/**
 * Structured data (schema.org LegalService) del estudio.
 * Se renderiza en el layout público para que Google identifique al negocio
 * local de forma inequívoca (nombre, dirección, zona, teléfono, redes).
 *
 * Pendiente de completar cuando estén los datos:
 *  - aggregateRating / review (cuando haya reseñas en Google)
 */
export function LegalServiceSchema() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "LegalService",
    "@id": `${SITE_URL}/#legalservice`,
    name: "Estudio Jurídico Romina Belén Sanchez",
    alternateName: "Estudio Jurídico RS",
    description:
      "Estudio jurídico en Alta Gracia, Córdoba. Asesoramiento en Derecho Real, Sucesiones, Daños y Accidentes de Tránsito, Derecho de Familia, Previsional y Laboral.",
    url: SITE_URL,
    telephone: "+543518916246",
    image: `${SITE_URL}/imagenMain.png`,
    logo: `${SITE_URL}/icon.png`,
    priceRange: "$$",
    currenciesAccepted: "ARS",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Dino Carignani 275",
      addressLocality: "Alta Gracia",
      addressRegion: "Córdoba",
      postalCode: "X5186HDD",
      addressCountry: "AR",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: -31.6567826,
      longitude: -64.4302657,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "09:00",
        closes: "13:30",
      },
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
        opens: "16:30",
        closes: "20:00",
      },
    ],
    areaServed: [
      { "@type": "City", name: "Alta Gracia" },
      { "@type": "AdministrativeArea", name: "Provincia de Córdoba" },
    ],
    founder: {
      "@type": "Person",
      name: "Romina Belén Sanchez",
      jobTitle: "Abogada",
    },
    knowsAbout: [
      "Derecho Real",
      "Declaratoria de Herederos y Sucesiones",
      "Daños y Accidentes de Tránsito",
      "Derecho de Familia",
      "Derecho Previsional",
      "Derecho Laboral y A.R.T.",
    ],
    sameAs: ["https://www.instagram.com/rs.ejur/"],
    knowsLanguage: "es-AR",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
