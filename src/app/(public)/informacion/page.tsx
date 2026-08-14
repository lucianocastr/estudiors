import Link from "next/link";
import type { Metadata } from "next";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { articulos, formatFechaArticulo } from "@/content/informacion";
import { ArrowRight, TrendingUp } from "lucide-react";

export const metadata: Metadata = {
  title: "Información legal para Alta Gracia y Córdoba",
  description:
    "Artículos claros sobre temas legales frecuentes: cuota alimentaria, sucesiones, usucapión, despidos y accidentes. Información orientativa del estudio.",
  alternates: { canonical: "/informacion" },
  openGraph: {
    url: "https://www.rsestudiojuridico.com.ar/informacion",
  },
};

export default function InformacionPage() {
  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-secondary via-secondary/60 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-accent/75 mb-3 font-medium">
            Información
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Temas legales, explicados claro
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Notas breves sobre las consultas más frecuentes, en un lenguaje simple.
            Información orientativa para entender tu situación y saber cuándo consultar.
          </p>
        </div>
      </section>

      {/* Grid de artículos */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4">
          {/* Destacado: valores de referencia */}
          <Link
            href="/informacion/valores-de-referencia"
            className="flex items-center gap-4 p-5 rounded-2xl border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors max-w-4xl mx-auto mb-8"
          >
            <div className="p-3 bg-primary/10 rounded-xl ring-1 ring-primary/20 flex-shrink-0">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="block font-display text-lg font-semibold text-foreground">
                Valores de referencia actualizados
              </span>
              <span className="block text-sm text-muted-foreground">
                Canasta de crianza, salario mínimo y valor del Jus, con su fuente oficial.
              </span>
            </div>
            <ArrowRight className="h-5 w-5 text-primary flex-shrink-0" />
          </Link>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {articulos.map((art) => {
              const Icon = art.icono;
              return (
                <Card
                  key={art.slug}
                  className="flex flex-col hover:shadow-md transition-all duration-200 border-border/60 bg-card hover:border-accent/30"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-accent/12 rounded-lg ring-1 ring-accent/25 flex-shrink-0 mt-0.5">
                        <Icon className="h-6 w-6 text-accent" />
                      </div>
                      <div>
                        <CardTitle className="font-display text-lg font-semibold mb-1.5 leading-snug">
                          {art.titulo}
                        </CardTitle>
                        <CardDescription className="text-sm leading-relaxed">
                          {art.resumen}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col flex-1">
                    <span className="text-xs text-muted-foreground mt-auto mb-3">
                      {formatFechaArticulo(art.fechaPublicacion)}
                    </span>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full text-sm border-border/60 hover:bg-background hover:border-primary/40 hover:text-primary"
                    >
                      <Link href={`/informacion/${art.slug}`}>
                        Leer nota
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
              ¿Tu caso no está en la lista?
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
