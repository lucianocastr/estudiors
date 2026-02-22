import type { Metadata } from "next";
import { Suspense } from "react";
import { ConsultaForm } from "@/components/forms/consulta-form";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Hacer una Consulta",
  description:
    "Completá el formulario para hacer una consulta al estudio jurídico. Te contactaremos a la brevedad.",
};

export default function ConsultaPage() {
  return (
    <>
      {/* Page header */}
      <section className="py-14 md:py-18 bg-gradient-to-br from-secondary via-secondary/60 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-accent/75 mb-3 font-medium">
            Consulta inicial sin cargo
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Hacer una Consulta
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Completá el formulario y te contactaremos a la brevedad. No necesitás
            conocimientos legales, contanos tu situación con tus palabras.
          </p>
        </div>
      </section>

      {/* Formulario */}
      <section className="py-14 md:py-18">
        <div className="container mx-auto px-4">
          {/* Aviso sin cargo */}
          <Alert className="max-w-2xl mx-auto mb-8 bg-secondary/40 border-border/60">
            <Info className="h-4 w-4 text-accent" />
            <AlertDescription className="text-foreground/75 text-sm">
              Esta consulta inicial es <strong className="text-foreground">sin cargo</strong>.
              Te contactaremos para evaluar tu caso y explicarte los pasos a seguir.
            </AlertDescription>
          </Alert>

          <Suspense
            fallback={
              <div className="text-center text-sm text-muted-foreground py-8">
                Cargando formulario...
              </div>
            }
          >
            <ConsultaForm />
          </Suspense>

          <p className="max-w-2xl mx-auto mt-8 text-xs text-muted-foreground/70 text-center leading-relaxed">
            La información brindada en este sitio es de carácter general y no
            constituye asesoramiento legal. Cada caso requiere un análisis
            profesional personalizado.{" "}
            <a href="/legal/aviso" className="underline underline-offset-2 hover:text-muted-foreground transition-colors">
              Ver aviso legal
            </a>
            .
          </p>
        </div>
      </section>
    </>
  );
}
