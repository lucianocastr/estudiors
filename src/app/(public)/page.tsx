import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { especialidades } from "@/content/especialidades";
import {
  ArrowRight,
  CheckCircle2,
  MessageSquare,
  Calendar,
  Shield,
} from "lucide-react";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ────────────────────────────────────────────────── */}
      <section
        className="relative overflow-hidden flex items-center"
        style={{ height: "min(100svh, 820px)", minHeight: "540px" }}
      >
        {/* Fotografía — escritorio jurídico con balanza dorada */}
        <Image
          src="/imagenMain.png"
          alt="Escritorio jurídico con balanza de la justicia, mazo y cuaderno"
          fill
          priority
          sizes="100vw"
          className="object-cover"
          style={{
            objectPosition: "center 45%",
            filter: "brightness(0.92) contrast(1.05) saturate(0.90)",
          }}
        />

        {/* WASH LEFT: área de texto sobre el mazo/cuaderno — balanza derecha visible */}
        <div
          className="absolute inset-y-0 left-0 pointer-events-none"
          style={{
            width: "72%",
            background:
              "linear-gradient(to right, rgba(40,22,10,0.82) 0%, rgba(40,22,10,0.72) 30%, rgba(40,22,10,0.50) 52%, rgba(40,22,10,0.15) 68%, transparent 100%)",
          }}
        />

        {/* WASH BOTTOM: transición suave hacia la siguiente sección */}
        <div
          className="absolute inset-x-0 bottom-0 pointer-events-none"
          style={{
            height: "22%",
            background:
              "linear-gradient(to top, rgb(244,241,236) 0%, transparent 100%)",
          }}
        />

        {/* Texto — panel izquierdo sobre overlay oscuro */}
        <div className="relative z-10 px-10 sm:px-14 md:px-20 max-w-[56%]">
          <h1 className="font-display leading-none tracking-tight">
            <span className="block font-semibold text-white text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[4rem] leading-tight">
              Romina Belén
            </span>
            <span className="block font-semibold text-white text-4xl sm:text-5xl md:text-[3.25rem] lg:text-[4rem] leading-tight mt-0.5">
              Sanchez
            </span>
            <span className="block font-light text-amber-200/70 tracking-[0.55em] uppercase text-xs sm:text-sm mt-5">
              Abogada
            </span>
          </h1>

          <div className="h-px w-20 bg-amber-300/35 mt-8 mb-9" />

          <Button asChild size="lg" className="shadow-md text-sm px-8">
            <Link href="/consulta">
              Hacer una consulta
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      {/* ── Cómo funciona ───────────────────────────────────────── */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-foreground">
              ¿Cómo podemos ayudarte?
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Un proceso simple para que puedas consultar tu situación y
              coordinar una entrevista con nuestros profesionales.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10 max-w-4xl mx-auto">
            {[
              {
                icon: MessageSquare,
                title: "1. Contanos tu problema",
                desc: "Completá el formulario describiendo brevemente tu situación. No necesitás conocimientos legales.",
              },
              {
                icon: Calendar,
                title: "2. Coordinamos un turno",
                desc: "Te contactamos para coordinar una entrevista presencial o virtual según tu preferencia.",
              },
              {
                icon: CheckCircle2,
                title: "3. Recibís asesoramiento",
                desc: "Analizamos tu caso de forma personalizada y te orientamos sobre los pasos a seguir.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-5 ring-1 ring-accent/35">
                  <Icon className="h-7 w-7 text-accent" />
                </div>
                <h3 className="font-display text-lg font-medium mb-2 text-foreground">
                  {title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button asChild>
              <Link href="/consulta">Iniciar consulta</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* ── Especialidades ──────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-secondary/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-foreground">
              Nuestras Especialidades
            </h2>
            <p className="text-muted-foreground max-w-xl mx-auto text-sm leading-relaxed">
              Contamos con profesionales especializados en diversas áreas del
              derecho para brindarte la mejor asistencia.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {especialidades.map((esp) => {
              const Icon = esp.icono;
              return (
                <Card
                  key={esp.id}
                  className="hover:shadow-md transition-all duration-200 border-border/60 bg-card hover:border-primary/25"
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-accent/12 rounded-lg ring-1 ring-accent/25 flex-shrink-0">
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <CardTitle className="font-display text-base font-medium leading-tight">
                        {esp.nombre}
                      </CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="mb-4 text-sm leading-relaxed">
                      {esp.descripcionCorta}
                    </CardDescription>
                    <Link
                      href={`/especialidades/${esp.slug}`}
                      className="text-xs font-medium text-primary/80 hover:text-primary transition-colors inline-flex items-center gap-1"
                    >
                      Ver más información
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Por qué elegirnos ───────────────────────────────────── */}
      <section className="py-20 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-foreground">
              ¿Por qué elegirnos?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
            {[
              {
                icon: Shield,
                title: "Confidencialidad",
                desc: "Tu información está protegida por el secreto profesional.",
              },
              {
                icon: CheckCircle2,
                title: "Experiencia",
                desc: "Años de trayectoria en el ejercicio de la profesión.",
              },
              {
                icon: MessageSquare,
                title: "Comunicación clara",
                desc: "Te explicamos todo en un lenguaje simple y directo.",
              },
              {
                icon: Calendar,
                title: "Atención personalizada",
                desc: "Cada caso recibe la dedicación que merece.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div
                key={title}
                className="text-center p-7 rounded-xl border border-border/50 bg-card shadow-sm hover:shadow-md hover:border-accent/25 transition-all duration-200"
              >
                <Icon className="h-9 w-9 text-accent mx-auto mb-4" />
                <h3 className="font-display text-base font-medium mb-2 text-foreground">
                  {title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Final ───────────────────────────────────────────── */}
      <section className="py-20 md:py-24 bg-secondary/60 border-y border-border/50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-accent/70 mb-3 font-medium">
            Consulta inicial sin cargo
          </p>
          <h2 className="font-display text-3xl md:text-4xl font-semibold mb-4 text-foreground">
            ¿Tenés un problema legal?
          </h2>
          <p className="text-base text-foreground/60 mb-10 max-w-xl mx-auto leading-relaxed">
            No esperes más. Contanos tu situación y te orientamos sobre los
            pasos a seguir.
          </p>
          <Button asChild size="lg" className="text-sm shadow-md px-8">
            <Link href="/consulta">
              Hacer una consulta gratuita
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
