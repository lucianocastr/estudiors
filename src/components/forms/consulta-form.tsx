"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { especialidades, getEspecialidadByProblema } from "@/content/especialidades";
import { consultaConTurnoSchema, type ConsultaConTurnoInput } from "@/lib/validators";
import {
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  Calendar,
} from "lucide-react";

const pasos = [
  { id: 1, nombre: "Tipo de problema" },
  { id: 2, nombre: "Descripción" },
  { id: 3, nombre: "Datos de contacto" },
  { id: 4, nombre: "Turno (opcional)" },
  { id: 5, nombre: "Confirmación" },
];

export function ConsultaForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const especialidadParam = searchParams.get("especialidad");

  // Si viene de una página de especialidad, quedará fija y solo se mostrarán sus opciones
  const especialidadFija = especialidadParam
    ? (especialidades.find((e) => e.id === especialidadParam) ?? null)
    : null;
  const especialidadesMostradas = especialidadFija ? [especialidadFija] : especialidades;

  const [paso, setPaso] = useState(1);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const form = useForm<ConsultaConTurnoInput>({
    resolver: zodResolver(consultaConTurnoSchema),
    defaultValues: {
      tipoProblema: "",
      especialidad: especialidadParam || "",
      descripcion: "",
      urgente: false,
      nombre: "",
      email: "",
      telefono: "",
      localidad: "",
      aceptaTerminos: false,
      disclaimerLeido: false,
      solicitaTurno: false,
      turno: {
        modalidad: undefined,
        fechaPreferida: "",
        horarioPreferido: undefined,
      },
    },
  });

  const tipoProblema = form.watch("tipoProblema");
  const solicitaTurno = form.watch("solicitaTurno");

  // Obtener la especialidad basada en el problema seleccionado
  const especialidadSeleccionada = tipoProblema
    ? getEspecialidadByProblema(tipoProblema)
    : null;

  const avanzar = async () => {
    let camposValidar: (keyof ConsultaConTurnoInput)[] = [];

    switch (paso) {
      case 1:
        camposValidar = ["tipoProblema"];
        break;
      case 2:
        camposValidar = ["descripcion"];
        break;
      case 3:
        camposValidar = ["nombre", "email", "telefono"];
        break;
      case 4:
        // El turno es opcional, no validamos
        break;
    }

    if (camposValidar.length > 0) {
      const valido = await form.trigger(camposValidar);
      if (!valido) return;
    }

    // Actualizar especialidad basada en el problema
    if (paso === 1 && especialidadSeleccionada) {
      form.setValue("especialidad", especialidadSeleccionada.id);
    }

    setPaso((p) => Math.min(p + 1, 5));
  };

  const retroceder = () => {
    setPaso((p) => Math.max(p - 1, 1));
  };

  const onSubmit = async (data: ConsultaConTurnoInput) => {
    setEnviando(true);
    setError(null);

    try {
      const response = await fetch("/api/consulta", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error al enviar la consulta");
      }

      router.push("/consulta/gracias");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar la consulta");
    } finally {
      setEnviando(false);
    }
  };

  // Obtener fecha mínima (mañana)
  const getFechaMinima = () => {
    const manana = new Date();
    manana.setDate(manana.getDate() + 1);
    return manana.toISOString().split("T")[0];
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Indicador de pasos */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          {pasos.map((p, index) => (
            <div key={p.id} className="flex items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  paso >= p.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {paso > p.id ? <CheckCircle2 className="h-5 w-5" /> : p.id}
              </div>
              {index < pasos.length - 1 && (
                <div
                  className={`w-12 md:w-20 h-1 mx-1 ${
                    paso > p.id ? "bg-primary" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-2">
          {pasos[paso - 1].nombre}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          {/* Paso 1: Tipo de problema */}
          {paso === 1 && (
            <Card>
              <CardHeader>
                {especialidadFija ? (
                  <>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                      <especialidadFija.icono className="h-3.5 w-3.5 text-accent" />
                      <span className="uppercase tracking-wide font-medium">{especialidadFija.nombre}</span>
                    </div>
                    <CardTitle>¿Qué situación describe mejor tu caso?</CardTitle>
                    <CardDescription>
                      Seleccioná la opción que mejor describe tu situación dentro de{" "}
                      <span className="font-medium text-foreground">{especialidadFija.nombre}</span>.
                    </CardDescription>
                  </>
                ) : (
                  <>
                    <CardTitle>¿Qué tipo de problema tenés?</CardTitle>
                    <CardDescription>
                      Seleccioná la opción que mejor describa tu situación. No te
                      preocupes si no estás seguro, nosotros te orientamos.
                    </CardDescription>
                  </>
                )}
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="tipoProblema"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <div className="space-y-4">
                          {especialidadesMostradas.map((esp) => (
                            <div key={esp.id} className="space-y-2">
                              <h3 className="font-medium text-sm text-muted-foreground flex items-center gap-2">
                                <esp.icono className="h-4 w-4" />
                                {esp.nombre}
                              </h3>
                              <RadioGroup
                                value={field.value}
                                onValueChange={field.onChange}
                                className="grid gap-2"
                              >
                                {esp.problemas.map((prob) => (
                                  <div
                                    key={prob.id}
                                    className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                                      field.value === prob.id
                                        ? "border-primary bg-secondary/50"
                                        : "hover:bg-muted"
                                    }`}
                                    onClick={() => field.onChange(prob.id)}
                                  >
                                    <RadioGroupItem value={prob.id} id={prob.id} />
                                    <Label
                                      htmlFor={prob.id}
                                      className="flex-1 cursor-pointer"
                                    >
                                      {prob.label}
                                    </Label>
                                  </div>
                                ))}
                              </RadioGroup>
                            </div>
                          ))}
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Paso 2: Descripción */}
          {paso === 2 && (
            <Card>
              <CardHeader>
                <CardTitle>Contanos más sobre tu situación</CardTitle>
                <CardDescription>
                  Describí brevemente tu problema. No te preocupes por usar
                  términos legales, contalo con tus palabras.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="descripcion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descripción de la situación</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Ej: Hace 6 meses falleció mi padre y dejó una casa. Somos 3 hermanos y queremos saber cómo hacer la sucesión..."
                          className="min-h-[150px]"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Mínimo 20 caracteres. No incluyas datos sensibles como
                        números de documento.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="urgente"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Es urgente</FormLabel>
                        <FormDescription>
                          Marcá esta opción si tu situación requiere atención
                          inmediata (plazos próximos a vencer, audiencias, etc.)
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Paso 3: Datos de contacto */}
          {paso === 3 && (
            <Card>
              <CardHeader>
                <CardTitle>Datos de contacto</CardTitle>
                <CardDescription>
                  Necesitamos tus datos para poder contactarte y coordinar una
                  entrevista.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre completo</FormLabel>
                      <FormControl>
                        <Input placeholder="Juan Pérez" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="juan@ejemplo.com"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="telefono"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Teléfono</FormLabel>
                      <FormControl>
                        <Input placeholder="3547 123456" {...field} />
                      </FormControl>
                      <FormDescription>
                        Preferentemente con WhatsApp
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="localidad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localidad (opcional)</FormLabel>
                      <FormControl>
                        <Input placeholder="Alta Gracia" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          )}

          {/* Paso 4: Turno */}
          {paso === 4 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5" />
                  Solicitar turno
                </CardTitle>
                <CardDescription>
                  Si querés, podés solicitar un turno para una entrevista. Es
                  opcional, también podemos contactarte después.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="solicitaTurno"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Quiero solicitar un turno</FormLabel>
                        <FormDescription>
                          Te contactaremos para confirmar el día y horario
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />

                {solicitaTurno && (
                  <div className="space-y-4 pt-4 border-t">
                    <FormField
                      control={form.control}
                      name="turno.modalidad"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Modalidad</FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="PRESENCIAL" id="presencial" />
                                <Label htmlFor="presencial">Presencial</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="VIRTUAL" id="virtual" />
                                <Label htmlFor="virtual">Virtual (videollamada)</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="turno.fechaPreferida"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Fecha preferida</FormLabel>
                          <FormControl>
                            <Input
                              type="date"
                              min={getFechaMinima()}
                              {...field}
                            />
                          </FormControl>
                          <FormDescription>
                            Seleccioná una fecha a partir de mañana
                          </FormDescription>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="turno.horarioPreferido"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Horario preferido</FormLabel>
                          <FormControl>
                            <RadioGroup
                              value={field.value}
                              onValueChange={field.onChange}
                              className="flex gap-4"
                            >
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="manana" id="manana" />
                                <Label htmlFor="manana">Mañana (9:00 - 13:00)</Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <RadioGroupItem value="tarde" id="tarde" />
                                <Label htmlFor="tarde">Tarde (17:00 - 20:00)</Label>
                              </div>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Paso 5: Confirmación */}
          {paso === 5 && (
            <Card>
              <CardHeader>
                <CardTitle>Confirmación</CardTitle>
                <CardDescription>
                  Revisá los datos y aceptá los términos para enviar tu consulta.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Resumen */}
                <div className="bg-secondary/40 rounded-lg p-4 space-y-3 text-sm">
                  <div>
                    <span className="text-muted-foreground">Tipo de problema:</span>
                    <p className="font-medium">
                      {especialidades
                        .flatMap((e) => e.problemas)
                        .find((p) => p.id === tipoProblema)?.label}
                    </p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Nombre:</span>
                    <p className="font-medium">{form.getValues("nombre")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Email:</span>
                    <p className="font-medium">{form.getValues("email")}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Teléfono:</span>
                    <p className="font-medium">{form.getValues("telefono")}</p>
                  </div>
                  {solicitaTurno && (
                    <div>
                      <span className="text-muted-foreground">Turno solicitado:</span>
                      <p className="font-medium">
                        {form.getValues("turno.modalidad") === "PRESENCIAL"
                          ? "Presencial"
                          : "Virtual"}{" "}
                        - {form.getValues("turno.fechaPreferida")} (
                        {form.getValues("turno.horarioPreferido") === "manana"
                          ? "Mañana"
                          : "Tarde"}
                        )
                      </p>
                    </div>
                  )}
                </div>

                {/* Aviso legal */}
                <Alert className="bg-amber-50 border-amber-200">
                  <AlertTriangle className="h-4 w-4 text-amber-600" />
                  <AlertDescription className="text-amber-800 text-sm">
                    La información brindada en este sitio es de carácter general
                    y no constituye asesoramiento legal. Cada caso requiere un
                    análisis particular por parte de un profesional.
                  </AlertDescription>
                </Alert>

                {/* Checkboxes legales */}
                <div className="space-y-4">
                  <FormField
                    control={form.control}
                    name="disclaimerLeido"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Leí y entendí que esta consulta no constituye
                            asesoramiento legal y que cada caso requiere un
                            análisis particular.
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="aceptaTerminos"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-normal">
                            Acepto los{" "}
                            <a
                              href="/legal/terminos"
                              target="_blank"
                              className="text-primary underline"
                            >
                              términos y condiciones
                            </a>{" "}
                            y la{" "}
                            <a
                              href="/legal/privacidad"
                              target="_blank"
                              className="text-primary underline"
                            >
                              política de privacidad
                            </a>
                            .
                          </FormLabel>
                          <FormMessage />
                        </div>
                      </FormItem>
                    )}
                  />
                </div>

                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          )}

          {/* Botones de navegación */}
          <div className="flex justify-between mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={retroceder}
              disabled={paso === 1 || enviando}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Anterior
            </Button>

            {paso < 5 ? (
              <Button type="button" onClick={avanzar}>
                Siguiente
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button type="submit" disabled={enviando}>
                {enviando ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Enviando...
                  </>
                ) : (
                  "Enviar consulta"
                )}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
