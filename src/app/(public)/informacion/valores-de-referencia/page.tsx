import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTodosLosHistoricos } from "@/lib/valores-referencia-queries";
import { HistoricoTabla } from "@/components/informacion/valores";
import { INDICADORES } from "@/lib/valores-referencia";
import type { IndicadorReferencia } from "@prisma/client";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Valores de referencia: canasta de crianza, SMVM y Jus",
  description:
    "Histórico de valores de referencia: canasta de crianza (INDEC), Salario Mínimo Vital y Móvil y valor del Jus en Córdoba. Con fuente y período.",
  alternates: { canonical: "/informacion/valores-de-referencia" },
  openGraph: {
    url: "https://www.rsestudiojuridico.com.ar/informacion/valores-de-referencia",
  },
};

export default async function ValoresReferenciaPage() {
  const historicos = await getTodosLosHistoricos();
  const hayDatos = Object.values(historicos).some((arr) => arr.length > 0);

  return (
    <>
      {/* Header */}
      <section className="py-14 md:py-18 bg-gradient-to-br from-secondary via-secondary/60 to-background">
        <div className="container mx-auto px-4">
          <Link
            href="/informacion"
            className="inline-flex items-center text-xs text-muted-foreground hover:text-accent transition-colors mb-6"
          >
            <ArrowLeft className="mr-1.5 h-3.5 w-3.5" />
            Volver a Información
          </Link>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-foreground max-w-3xl">
            Valores de referencia
          </h1>
          <p className="text-muted-foreground text-sm mt-3 max-w-2xl leading-relaxed">
            Histórico de indicadores que se usan como referencia en temas legales
            (cuota alimentaria, indemnizaciones, honorarios), con su fuente oficial
            y período. Los valores son orientativos.
          </p>
        </div>
      </section>

      {/* Tablas */}
      <section className="py-14 md:py-18">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl space-y-12">
            {!hayDatos ? (
              <p className="text-muted-foreground text-center py-8">
                Todavía no hay valores cargados. Pronto vas a encontrar acá el
                histórico actualizado.
              </p>
            ) : (
              INDICADORES.map((ind) => {
                const valores = historicos[ind.value] ?? [];
                if (valores.length === 0) return null;
                return (
                  <div key={ind.value}>
                    <h2 className="font-display text-xl md:text-2xl font-semibold mb-4 text-foreground">
                      {ind.label}
                    </h2>
                    <HistoricoTabla
                      indicador={ind.value as IndicadorReferencia}
                      valores={valores}
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Fuente: {ind.fuente}.{" "}
                      <a
                        href={ind.fuenteUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline"
                      >
                        Ver sitio oficial
                      </a>
                    </p>
                  </div>
                );
              })
            )}

            <Alert className="bg-amber-50 border-amber-200">
              <Info className="h-4 w-4 text-amber-600" />
              <AlertDescription className="text-amber-800 text-sm">
                Los valores publicados son de carácter informativo y orientativo. Para
                el dato oficial vigente, consultá la fuente correspondiente. No
                constituyen asesoramiento legal.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </section>
    </>
  );
}
