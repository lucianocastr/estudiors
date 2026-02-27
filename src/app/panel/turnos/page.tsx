import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Video, Phone, Mail } from "lucide-react";

async function getOrganizacionId(usuarioId: string): Promise<string | null> {
  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId, activo: true, deletedAt: null },
  });
  return membresia?.organizacionId ?? null;
}

async function getTurnos(organizacionId: string) {
  return prisma.turno.findMany({
    where: { organizacionId, deletedAt: null },
    orderBy: [{ estado: "asc" }, { fechaPreferida: "asc" }],
    include: {
      consulta: {
        include: { contacto: true },
      },
    },
  });
}

export default async function TurnosPage() {
  const session = await auth();
  if (!session?.user) return null;

  const organizacionId = await getOrganizacionId(session.user.id);
  if (!organizacionId) return null;

  const turnos = await getTurnos(organizacionId);

  const TURNO_ESTADO_LABELS: Record<string, string> = {
    PENDIENTE: "Pendiente",
    CONFIRMADO: "Confirmado",
    RECHAZADO: "Rechazado",
    COMPLETADO: "Completado",
    CANCELADO: "Cancelado",
  };
  const TURNO_ESTADO_COLORS: Record<string, string> = {
    PENDIENTE: "bg-yellow-100 text-yellow-800",
    CONFIRMADO: "bg-green-100 text-green-800",
    RECHAZADO: "bg-red-100 text-red-800",
    COMPLETADO: "bg-blue-100 text-blue-800",
    CANCELADO: "bg-gray-100 text-gray-600",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Turnos</h1>
        <p className="text-muted-foreground">Todos los turnos solicitados</p>
      </div>

      {turnos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Calendar className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay turnos solicitados</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {turnos.map((turno) => (
            <Card key={turno.id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {turno.consulta.contacto.nombre}
                    </CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      {turno.modalidad === "PRESENCIAL" ? (
                        <>
                          <MapPin className="h-4 w-4" />
                          Presencial
                        </>
                      ) : (
                        <>
                          <Video className="h-4 w-4" />
                          Virtual
                        </>
                      )}
                    </CardDescription>
                  </div>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${TURNO_ESTADO_COLORS[turno.estado] ?? "bg-gray-100 text-gray-600"}`}>
                    {TURNO_ESTADO_LABELS[turno.estado] ?? turno.estado}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(turno.fechaPreferida).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>
                      {turno.horarioPreferido === "manana"
                        ? "Mañana (9–13hs)"
                        : "Tarde (17–20hs)"}
                    </span>
                  </div>
                </div>

                {turno.fechaConfirmada && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                    <p className="font-medium text-green-800">
                      Turno confirmado para:{" "}
                      {new Date(turno.fechaConfirmada).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href={`mailto:${turno.consulta.contacto.email}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    {turno.consulta.contacto.email}
                  </a>
                  <a
                    href={`tel:${turno.consulta.contacto.telefono}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-4 w-4" />
                    {turno.consulta.contacto.telefono}
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Solicitado:{" "}
                    {new Date(turno.createdAt).toLocaleDateString("es-AR")}
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/panel/consultas/${turno.consultaId}`}>
                      Ver consulta
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
