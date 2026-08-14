import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  articulos,
  getArticuloBySlug,
  getArticulosRelacionados,
  tiempoLectura,
  formatFechaArticulo,
} from "@/content/informacion";
import { getUltimoPublico } from "@/lib/valores-referencia-queries";
import { ValoresVigentes } from "@/components/informacion/valores";
import { ArrowRight, ArrowLeft, Info, ExternalLink, Clock, CalendarDays } from "lucide-react";

const SITE_URL = "https://www.rsestudiojuridico.com.ar";

// ISR: se regenera cada hora; las cargas del panel fuerzan revalidación.
export const revalidate = 3600;

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return articulos.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const articulo = getArticuloBySlug(slug);

  if (!articulo) {
    return { title: "Nota no encontrada" };
  }

  const canonical = `/informacion/${articulo.slug}`;

  return {
    title: articulo.titulo,
    description: articulo.resumen,
    alternates: { canonical },
    openGraph: {
      title: `${articulo.titulo} | Estudio Jurídico RBS`,
      description: articulo.resumen,
      url: `${SITE_URL}${canonical}`,
      type: "article",
    },
  };
}

export default async function ArticuloPage({ params }: PageProps) {
  const { slug } = await params;
  const articulo = getArticuloBySlug(slug);

  if (!articulo) {
    notFound();
  }

  const Icon = articulo.icono;
  const url = `${SITE_URL}/informacion/${articulo.slug}`;
  const ultimoValor = articulo.indicador
    ? await getUltimoPublico(articulo.indicador)
    : null;
  const relacionados = getArticulosRelacionados(articulo.slug);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: articulo.titulo,
    description: articulo.resumen,
    datePublished: articulo.fechaPublicacion,
    dateModified: articulo.fechaPublicacion,
    inLanguage: "es-AR",
    author: {
      "@type": "Person",
      name: "Romina Belén Sanchez",
      jobTitle: "Abogada",
    },
    publisher: {
      "@type": "LegalService",
      name: "Estudio Jurídico Romina Belén Sanchez",
      url: SITE_URL,
    },
    mainEntityOfPage: url,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Page header */}
      <section className="py-14 md:py-18 bg-gradient-to-br from-secondary via-secondary/60 to-background">
        <div className="container mx-auto px-4">
          <Link
            href="/informacion"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Volver a Información
          </Link>

          <div className="flex items-start gap-5 max-w-3xl">
            <div className="p-4 bg-accent/12 rounded-xl ring-1 ring-accent/25 flex-shrink-0">
              <Icon className="h-8 w-8 text-accent" />
            </div>
            <h1 className="font-display text-2xl md:text-3xl font-semibold text-foreground leading-tight">
              {articulo.titulo}
            </h1>
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-5">
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays className="h-3.5 w-3.5" />
              {formatFechaArticulo(articulo.fechaPublicacion)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              {tiempoLectura(articulo)} min de lectura
            </span>
          </div>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-14 md:py-18">
        <div className="container mx-auto px-4">
          <article className="max-w-3xl">
            {articulo.contenido.map((seccion, i) => (
              <div key={i} className="mb-8">
                {seccion.titulo && (
                  <h2 className="font-display text-xl md:text-2xl font-semibold mb-4 text-foreground">
                    {seccion.titulo}
                  </h2>
                )}
                {seccion.parrafos.map((parrafo, j) => (
                  <p
                    key={j}
                    className="text-base text-muted-foreground leading-relaxed mb-4"
                  >
                    {parrafo}
                  </p>
                ))}
              </div>
            ))}

            {/* Valores vigentes (desde el panel) */}
            {articulo.indicador && (
              <ValoresVigentes indicador={articulo.indicador} ultimo={ultimoValor} />
            )}

            {/* Enlace externo (ej. INDEC) */}
            {articulo.enlaceExterno && (
              <a
                href={articulo.enlaceExterno.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 p-5 rounded-xl border border-primary/25 bg-primary/5 hover:bg-primary/10 transition-colors mb-10 group"
              >
                <ExternalLink className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                <span>
                  <span className="block font-medium text-foreground group-hover:text-primary transition-colors">
                    {articulo.enlaceExterno.texto}
                  </span>
                  <span className="block text-sm text-muted-foreground mt-1 leading-relaxed">
                    {articulo.enlaceExterno.descripcion}
                  </span>
                </span>
              </a>
            )}

            {/* Disclaimer */}
            <Alert className="mb-12 bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                Esta nota es de carácter general y orientativo, y no constituye
                asesoramiento legal. Cada situación requiere un análisis profesional
                personalizado.
              </AlertDescription>
            </Alert>

            {/* CTA */}
            <div className="bg-secondary/50 rounded-2xl p-8 md:p-10 text-center border border-border/50">
              <h2 className="font-display text-2xl font-semibold mb-3 text-foreground">
                ¿Necesitás asesoramiento sobre este tema?
              </h2>
              <p className="text-sm text-muted-foreground mb-7 leading-relaxed">
                Contanos tu situación y te orientamos sobre los pasos a seguir.
                También podés ver más sobre{" "}
                <Link
                  href={`/especialidades/${articulo.especialidadSlug}`}
                  className="text-primary hover:underline"
                >
                  {articulo.especialidadNombre}
                </Link>
                .
              </p>
              <Button asChild size="lg">
                <Link href="/consulta">
                  Hacer una consulta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {/* Artículos relacionados */}
            {relacionados.length > 0 && (
              <div className="mt-14 pt-10 border-t border-border/50">
                <h2 className="font-display text-xl font-semibold mb-6 text-foreground">
                  Seguí leyendo
                </h2>
                <div className="grid sm:grid-cols-2 gap-4">
                  {relacionados.map((r) => {
                    const RIcon = r.icono;
                    return (
                      <Link
                        key={r.slug}
                        href={`/informacion/${r.slug}`}
                        className="flex items-start gap-3 p-4 rounded-xl border border-border/60 hover:border-accent/35 hover:bg-secondary/30 transition-colors"
                      >
                        <div className="p-2 bg-accent/12 rounded-lg ring-1 ring-accent/25 flex-shrink-0">
                          <RIcon className="h-5 w-5 text-accent" />
                        </div>
                        <span className="min-w-0">
                          <span className="block font-medium text-sm text-foreground leading-snug">
                            {r.titulo}
                          </span>
                          <span className="block text-xs text-muted-foreground mt-1 line-clamp-2">
                            {r.resumen}
                          </span>
                        </span>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </article>
        </div>
      </section>
    </>
  );
}
