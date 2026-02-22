import type { Metadata } from "next";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description: "Aviso legal importante sobre el contenido del sitio web.",
};

export default function AvisoLegalPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto">
          <div className="mb-10 pb-8 border-b border-border/50">
            <p className="text-xs tracking-[0.2em] uppercase text-accent/70 mb-2 font-medium">Legal</p>
            <h1 className="font-display text-4xl font-semibold text-foreground">Aviso Legal</h1>
          </div>

          <Alert className="mb-8 bg-amber-50 border-amber-200">
            <AlertTriangle className="h-5 w-5 text-amber-600" />
            <AlertTitle className="text-amber-800">Importante</AlertTitle>
            <AlertDescription className="text-amber-700">
              La información brindada en este sitio es de carácter general y no
              constituye asesoramiento legal. Cada caso requiere un análisis
              particular por parte de un profesional.
            </AlertDescription>
          </Alert>

          <div className="prose prose-gray">
            <h2>Naturaleza Informativa</h2>
            <p>
              Este sitio web tiene una finalidad exclusivamente informativa sobre
              los servicios profesionales del estudio jurídico. El contenido
              publicado no debe interpretarse como asesoramiento legal aplicable
              a situaciones particulares.
            </p>

            <h2>No Constituye Relación Profesional</h2>
            <p>
              La navegación por este sitio, la lectura de su contenido o el envío
              de consultas a través de los formularios no establece una relación
              abogado-cliente. Dicha relación solo se constituye mediante un
              acuerdo expreso y formal con el estudio.
            </p>

            <h2>Limitaciones del Contenido</h2>
            <p>
              La información general proporcionada:
            </p>
            <ul>
              <li>No reemplaza la consulta profesional personalizada</li>
              <li>No considera las particularidades de cada caso</li>
              <li>Puede no estar actualizada respecto a cambios legislativos recientes</li>
              <li>No garantiza resultados en casos concretos</li>
            </ul>

            <h2>Recomendación</h2>
            <p>
              Antes de tomar cualquier decisión legal, te recomendamos consultar
              con un profesional que pueda analizar tu situación particular,
              evaluar la documentación relevante y brindarte asesoramiento
              adecuado a tu caso.
            </p>

            <h2>Responsabilidad</h2>
            <p>
              El estudio no se hace responsable por:
            </p>
            <ul>
              <li>
                Decisiones tomadas en base a la información general de este sitio
                sin consulta profesional previa
              </li>
              <li>
                Interpretaciones erróneas del contenido publicado
              </li>
              <li>
                Resultados adversos derivados de actuar sin asesoramiento legal
                personalizado
              </li>
            </ul>

            <h2>Consulta Profesional</h2>
            <p>
              Si tenés una situación legal que requiere atención, te invitamos a
              contactarnos a través de nuestro formulario de consulta. Evaluaremos
              tu caso y te indicaremos si podemos asistirte y cuáles serían los
              pasos a seguir.
            </p>

            <div className="bg-secondary/40 p-6 rounded-xl mt-8 border border-border/50">
              <p className="text-sm text-muted-foreground mb-0">
                <strong>Recordá:</strong> La información de este sitio es orientativa.
                Para obtener asesoramiento aplicable a tu situación particular,
                es necesario una consulta profesional donde se analicen todos los
                aspectos relevantes de tu caso.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
