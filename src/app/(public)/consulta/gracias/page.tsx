import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Mail, Phone, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Consulta Enviada",
  description: "Tu consulta fue enviada correctamente.",
};

export default function GraciasPage() {
  return (
    <div className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-xl mx-auto text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="h-10 w-10 text-green-600" />
          </div>

          <h1 className="text-3xl font-bold mb-4">¡Consulta enviada!</h1>
          <p className="text-lg text-muted-foreground mb-8">
            Recibimos tu consulta correctamente. Te contactaremos a la brevedad
            para coordinar los próximos pasos.
          </p>

          <Card className="text-left mb-8">
            <CardHeader>
              <CardTitle className="text-lg">¿Qué sigue ahora?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">1</span>
                </div>
                <div>
                  <p className="font-medium">Revisamos tu consulta</p>
                  <p className="text-sm text-muted-foreground">
                    Un profesional del estudio analizará la información que
                    enviaste.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">2</span>
                </div>
                <div>
                  <p className="font-medium">Te contactamos</p>
                  <p className="text-sm text-muted-foreground">
                    Nos comunicaremos por teléfono o email para coordinar una
                    entrevista.
                  </p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-sm font-medium text-primary">3</span>
                </div>
                <div>
                  <p className="font-medium">Entrevista personalizada</p>
                  <p className="text-sm text-muted-foreground">
                    Analizamos tu caso en detalle y te orientamos sobre los pasos
                    a seguir.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="text-left mb-8 bg-gray-50">
            <CardHeader>
              <CardTitle className="text-lg">¿Tenés alguna urgencia?</CardTitle>
              <CardDescription>
                Si tu situación es urgente, podés contactarnos directamente:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <a
                href="tel:+543547000000"
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <Phone className="h-4 w-4" />
                +54 3547 XX-XXXX
              </a>
              <a
                href="mailto:contacto@estudio.com"
                className="flex items-center gap-3 text-sm hover:text-primary transition-colors"
              >
                <Mail className="h-4 w-4" />
                contacto@estudio.com
              </a>
            </CardContent>
          </Card>

          <Button asChild>
            <Link href="/">
              Volver al inicio
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
