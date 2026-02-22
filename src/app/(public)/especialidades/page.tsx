import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { especialidades } from "@/content/especialidades";
import { ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Especialidades",
  description:
    "Conocé nuestras áreas de especialización: Derecho Real y Sucesiones, Daños y Accidentes, Derecho de Familia, Previsional y Laboral.",
};

export default function EspecialidadesPage() {
  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-secondary via-secondary/60 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-accent/75 mb-3 font-medium">
            Áreas de práctica
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Nuestras Especialidades
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Contamos con profesionales capacitados en diversas ramas del derecho
            para brindarte el asesoramiento que necesitás.
          </p>
        </div>
      </section>

      {/* Grid de especialidades */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {especialidades.map((esp) => {
              const Icon = esp.icono;
              return (
                <Card
                  key={esp.id}
                  className="hover:shadow-md transition-all duration-200 border-border/60 bg-card hover:border-accent/30"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/12 rounded-lg ring-1 ring-accent/25 flex-shrink-0 mt-0.5">
                        <Icon className="h-7 w-7 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-xl font-semibold mb-1">
                          {esp.nombre}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {esp.descripcionCorta}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-xs font-medium text-muted-foreground mb-3 uppercase tracking-wide">
                      Situaciones frecuentes
                    </p>
                    <ul className="text-sm text-muted-foreground space-y-1.5 mb-5">
                      {esp.problemas.slice(0, 3).map((prob) => (
                        <li key={prob.id} className="flex items-center gap-2.5">
                          <span className="w-1 h-1 bg-accent rounded-full flex-shrink-0" />
                          {prob.label}
                        </li>
                      ))}
                    </ul>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full text-sm border-border/60 hover:bg-background hover:border-primary/40 hover:text-primary"
                    >
                      <Link href={`/especialidades/${esp.slug}`}>
                        Ver más información
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {/* CTA */}
          <div className="text-center mt-16 max-w-lg mx-auto">
            <div className="h-px bg-border/50 mb-10" />
            <p className="text-sm text-muted-foreground mb-5">
              ¿No encontrás tu problema en la lista?
            </p>
            <Button asChild>
              <Link href="/consulta">Hacer una consulta</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
