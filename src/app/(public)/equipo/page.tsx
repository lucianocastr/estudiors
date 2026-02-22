import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { equipo } from "@/content/equipo";
import { User, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Nuestro Equipo",
  description:
    "Conocé a los profesionales del estudio jurídico. Abogados especializados en diversas áreas del derecho.",
};

export default function EquipoPage() {
  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-secondary via-secondary/60 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-accent/75 mb-3 font-medium">
            El estudio
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Nuestro Equipo
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Un equipo de profesionales comprometidos con brindarte el mejor
            asesoramiento legal.
          </p>
        </div>
      </section>

      {/* Grid de profesionales */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-5xl mx-auto">
            {equipo.map((profesional) => (
              <Card
                key={profesional.id}
                className="text-center border-border/60 bg-card hover:shadow-md hover:border-accent/25 transition-all duration-200"
              >
                <CardHeader className="pb-3">
                  {/* Avatar */}
                  <div className="w-24 h-24 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 ring-2 ring-accent/20">
                    {profesional.foto ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={profesional.foto}
                        alt={profesional.nombre}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-11 w-11 text-accent/50" />
                    )}
                  </div>
                  <CardTitle className="font-display text-xl font-semibold">
                    {profesional.nombre}
                  </CardTitle>
                  <CardDescription className="text-sm font-medium text-accent/80">
                    {profesional.titulo}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-1.5 justify-center mb-4">
                    {profesional.especialidades.map((esp) => (
                      <Badge
                        key={esp}
                        variant="secondary"
                        className="text-xs bg-secondary/70 text-secondary-foreground"
                      >
                        {esp}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {profesional.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA */}
          <div className="mt-16 max-w-2xl mx-auto">
            <div className="text-center bg-secondary/50 rounded-2xl p-10 border border-border/50">
              <h2 className="font-display text-2xl font-semibold mb-3 text-foreground">
                ¿Querés consultarnos?
              </h2>
              <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
                Contanos tu situación y te derivamos con el profesional más adecuado
                para tu caso.
              </p>
              <Button asChild>
                <Link href="/consulta">
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
