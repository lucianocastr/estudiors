import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Términos y Condiciones",
  description: "Términos y condiciones de uso del sitio web del estudio jurídico.",
};

export default function TerminosPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 pb-8 border-b border-border/50">
            <p className="text-xs tracking-[0.2em] uppercase text-accent/70 mb-2 font-medium">
              Legal
            </p>
            <h1 className="font-display text-4xl font-semibold text-foreground">
              Términos y Condiciones
            </h1>
          </div>

          <div className="prose prose-gray max-w-none">
            <p className="lead">
              Al utilizar este sitio web, aceptás los siguientes términos y condiciones.
            </p>

            <h2>1. Uso del Sitio</h2>
            <p>
              Este sitio web tiene como objetivo brindar información general sobre los
              servicios del estudio jurídico y facilitar el contacto con potenciales
              clientes. El uso del sitio implica la aceptación de estos términos.
            </p>

            <h2>2. Información No Vinculante</h2>
            <p>
              La información proporcionada en este sitio es de carácter general e
              informativo. No constituye asesoramiento legal ni crea una relación
              abogado-cliente. Cada situación particular requiere un análisis
              profesional específico.
            </p>

            <h2>3. Formulario de Consulta</h2>
            <p>
              El envío de información a través del formulario de consulta no establece
              una relación profesional. La información enviada será tratada de forma
              confidencial y utilizada únicamente para evaluar la posibilidad de
              brindar asistencia legal.
            </p>

            <h2>4. Propiedad Intelectual</h2>
            <p>
              Todo el contenido de este sitio (textos, imágenes, diseño) es propiedad
              del estudio o se utiliza con autorización. Queda prohibida su
              reproducción sin autorización expresa.
            </p>

            <h2>5. Limitación de Responsabilidad</h2>
            <p>
              El estudio no se responsabiliza por decisiones tomadas en base a la
              información general de este sitio sin la debida consulta profesional
              personalizada.
            </p>

            <h2>6. Modificaciones</h2>
            <p>
              Nos reservamos el derecho de modificar estos términos en cualquier
              momento. Las modificaciones serán efectivas desde su publicación en el
              sitio.
            </p>

            <h2>7. Legislación Aplicable</h2>
            <p>
              Estos términos se rigen por las leyes de la República Argentina. Cualquier
              controversia será sometida a los tribunales de la Provincia de Córdoba.
            </p>

            <p className="text-sm text-muted-foreground mt-8">
              Última actualización: Enero 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
