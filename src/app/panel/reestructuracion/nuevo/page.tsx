import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { crearCaso } from "./actions";

export default async function NuevoCasoPage() {
  const session = await auth();
  if (!session?.user) return null;

  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) return null;

  // Contactos existentes para buscar cliente
  const contactos = await prisma.contacto.findMany({
    where: { organizacionId: membresia.organizacionId, deletedAt: null },
    orderBy: { nombre: "asc" },
    select: { id: true, nombre: true, email: true, telefono: true },
  });

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/panel/reestructuracion">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Reestructuración
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">Nuevo caso</span>
      </div>

      <div>
        <h1 className="text-2xl font-bold">Nuevo caso de reestructuración</h1>
        <p className="text-muted-foreground text-sm">
          Datos iniciales del caso. Los pasivos, patrimonio y análisis se cargan desde el detalle.
        </p>
      </div>

      <form action={crearCaso} className="space-y-6">
        {/* Cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Cliente</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Selector de contacto existente */}
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                Seleccionar contacto existente
              </label>
              <select
                name="contactoId"
                className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                defaultValue=""
              >
                <option value="">— Nuevo contacto (completar abajo) —</option>
                {contactos.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.nombre} · {c.email}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-muted-foreground border-t pt-3">
              O completar para crear un contacto nuevo:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Nombre completo
                </label>
                <input
                  type="text"
                  name="nombreNuevo"
                  placeholder="Ej: García Alejandro"
                  className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Email
                </label>
                <input
                  type="email"
                  name="emailNuevo"
                  placeholder="email@ejemplo.com"
                  className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                  Teléfono
                </label>
                <input
                  type="tel"
                  name="telefonoNuevo"
                  placeholder="+54 9 351 000-0000"
                  className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                  CUIT
                </label>
                <input
                  type="text"
                  name="cuit"
                  placeholder="20-12345678-9"
                  className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Perfil del cliente */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Perfil del cliente</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                Objetivo
              </label>
              <select
                name="objetivoCliente"
                className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                defaultValue=""
              >
                <option value="">— Sin definir —</option>
                <option value="SALIR_RAPIDO">Salir rápido</option>
                <option value="MINIMIZAR_COSTO">Minimizar costo</option>
                <option value="PROTEGER_BIENES">Proteger bienes</option>
                <option value="MIXTO">Mixto</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                Situación laboral
              </label>
              <select
                name="situacionLaboral"
                className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                defaultValue=""
              >
                <option value="">— Sin definir —</option>
                <option value="RELACION_DEPENDENCIA">Relación de dependencia</option>
                <option value="AUTONOMO">Autónomo / Monotributista</option>
                <option value="DESOCUPADO">Desocupado</option>
                <option value="JUBILADO">Jubilado / Pensionado</option>
                <option value="OTRO">Otro</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                Nivel socioeconómico
              </label>
              <select
                name="nivelSocioeconomico"
                className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                defaultValue=""
              >
                <option value="">— Sin definir —</option>
                <option value="BAJO">Bajo</option>
                <option value="MEDIO">Medio</option>
                <option value="MEDIO_ALTO">Medio-alto</option>
                <option value="ALTO">Alto</option>
              </select>
            </div>

            <div>
              <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                Situación BCRA
              </label>
              <select
                name="estadoBCRA"
                className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                defaultValue=""
              >
                <option value="">— Sin consultar —</option>
                <option value="NORMAL">Situación 1 — Normal</option>
                <option value="RIESGO_BAJO">Situación 2 — Riesgo bajo</option>
                <option value="DEFICIENTE">Situación 3 — Deficiente</option>
                <option value="DUDOSO">Situación 4 — Dudoso</option>
                <option value="IRRECUPERABLE">Situación 5 — Irrecuperable</option>
              </select>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 justify-end">
          <Button asChild variant="outline">
            <Link href="/panel/reestructuracion">Cancelar</Link>
          </Button>
          <Button type="submit">Crear caso</Button>
        </div>
      </form>
    </div>
  );
}
