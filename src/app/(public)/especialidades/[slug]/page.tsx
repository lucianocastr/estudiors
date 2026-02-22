import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { especialidades, getEspecialidadBySlug } from "@/content/especialidades";
import { ArrowRight, ArrowLeft, Info, HelpCircle } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return especialidades.map((esp) => ({
    slug: esp.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const especialidad = getEspecialidadBySlug(slug);

  if (!especialidad) {
    return { title: "Especialidad no encontrada" };
  }

  return {
    title: especialidad.nombre,
    description: especialidad.descripcionCorta,
  };
}

export default async function EspecialidadPage({ params }: PageProps) {
  const { slug } = await params;
  const especialidad = getEspecialidadBySlug(slug);

  if (!especialidad) {
    notFound();
  }

  const Icon = especialidad.icono;

  return (
    <>
      {/* Page header */}
      <section className="py-14 md:py-18 bg-gradient-to-br from-secondary via-secondary/60 to-background">
        <div className="container mx-auto px-4">
          <Link
            href="/especialidades"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Volver a especialidades
          </Link>

          <div className="flex items-center gap-5 max-w-3xl">
            <div className="p-4 bg-accent/12 rounded-xl ring-1 ring-accent/25 flex-shrink-0">
              <Icon className="h-9 w-9 text-accent" />
            </div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground">
              {especialidad.nombre}
            </h1>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-14 md:py-18">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            {/* Descripción */}
            <p className="text-base text-muted-foreground leading-relaxed mb-8 whitespace-pre-line">
              {especialidad.descripcionLarga.trim()}
            </p>

            {/* Disclaimer */}
            <Alert className="mb-12 bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                La información de esta página es orientativa. Cada situación requiere
                un análisis profesional personalizado.
              </AlertDescription>
            </Alert>

            {/* Situaciones que atendemos */}
            <h2 className="font-display text-2xl font-semibold mb-6 text-foreground">
              Situaciones que atendemos
            </h2>
            <div className="grid md:grid-cols-2 gap-4 mb-12">
              {especialidad.problemas.map((problema) => (
                <Card
                  key={problema.id}
                  className="border-border/60 hover:border-accent/35 transition-colors bg-card"
                >
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-accent rounded-full flex-shrink-0" />
                      {problema.label}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {problema.descripcion}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Preguntas frecuentes */}
            {especialidad.preguntasFrecuentes.length > 0 && (
              <div className="mb-12">
                <h2 className="font-display text-2xl font-semibold mb-6 text-foreground flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-accent" />
                  Preguntas Frecuentes
                </h2>
                <div className="space-y-3">
                  {especialidad.preguntasFrecuentes.map((faq, index) => (
                    <div
                      key={index}
                      className="border border-border/60 rounded-xl p-5 bg-card hover:border-accent/25 transition-colors"
                    >
                      <h3 className="font-medium text-sm mb-2 text-foreground">
                        {faq.pregunta}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {faq.respuesta}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* CTA */}
            <div className="bg-secondary/50 rounded-2xl p-8 md:p-10 text-center border border-border/50">
              <h2 className="font-display text-2xl font-semibold mb-3 text-foreground">
                ¿Tenés un problema relacionado con{" "}
                <span className="italic">{especialidad.nombre.toLowerCase()}</span>?
              </h2>
              <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
                Contanos tu situación y te orientamos sobre los pasos a seguir.
              </p>
              <Button asChild size="lg">
                <Link href={`/consulta?especialidad=${especialidad.id}`}>
                  Hacer una consulta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
