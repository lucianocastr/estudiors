import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, MessageSquare } from "lucide-react";

export const metadata: Metadata = {
  title: "Contacto",
  description:
    "Contactá al Estudio Jurídico Sanchez y Asociados. Iniciá tu consulta online o escribinos por WhatsApp o Instagram.",
};

export default function ContactoPage() {
  return (
    <>
      {/* Page header */}
      <section className="py-16 md:py-20 bg-gradient-to-br from-secondary via-secondary/60 to-background">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.25em] uppercase text-accent/75 mb-3 font-medium">
            Estamos para ayudarte
          </p>
          <h1 className="font-display text-4xl md:text-5xl font-semibold text-foreground mb-4">
            Contacto
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
            Atendemos en toda la provincia de Córdoba, de forma presencial o
            virtual según tu preferencia y ubicación.
          </p>
        </div>
      </section>

      {/* Contenido */}
      <section className="py-16 md:py-20">
        <div className="container mx-auto px-4 max-w-3xl">

          {/* CTA principal */}
          <Card className="bg-secondary border-border/50 mb-10">
            <CardContent className="p-8 flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center ring-1 ring-primary/25 flex-shrink-0">
                <MessageSquare className="h-7 w-7 text-primary" />
              </div>
              <div className="flex-1">
                <h2 className="font-display text-xl font-semibold text-foreground mb-1">
                  Iniciá tu consulta online
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Completá el formulario con tu situación y te contactamos para
                  coordinar una entrevista. Sin compromiso, sin costo inicial.
                </p>
              </div>
              <Button asChild size="lg" className="flex-shrink-0 w-full sm:w-auto">
                <Link href="/consulta">
                  Hacer una consulta
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </CardContent>
          </Card>

          {/* Canales sociales */}
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground/60 font-medium text-center mb-5">
            También podés escribirnos directamente
          </p>
          <div className="grid sm:grid-cols-2 gap-4">

            {/* WhatsApp */}
            <a
              href="https://wa.me/5493513100760"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 ring-1 ring-border/50 group-hover:ring-primary/30 transition-all"
                style={{ backgroundColor: "#25D36618" }}
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="#25D366" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  WhatsApp
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Respuesta rápida por chat
                </p>
              </div>
            </a>

            {/* Instagram */}
            <a
              href="https://www.instagram.com/rs.ejur/"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 p-5 rounded-xl border border-border/60 bg-card hover:border-primary/30 hover:shadow-md transition-all duration-200"
            >
              <div className="w-11 h-11 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0 ring-1 ring-border/50 group-hover:ring-primary/30 transition-all">
                <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-sm text-foreground group-hover:text-primary transition-colors">
                  Instagram
                </p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  @rs.ejur
                </p>
              </div>
            </a>
          </div>

          {/* Nota al pie */}
          <p className="text-center text-xs text-muted-foreground/60 mt-10 leading-relaxed">
            La información brindada no constituye asesoramiento legal. Cada caso
            requiere un análisis profesional personalizado.{" "}
            <Link
              href="/legal/aviso"
              className="underline underline-offset-2 hover:text-muted-foreground transition-colors"
            >
              Ver aviso legal
            </Link>
            .
          </p>
        </div>
      </section>
    </>
  );
}
