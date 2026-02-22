import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Video, Phone, Mail } from "lucide-react";

async function getTurnos(usuarioId: string, rol: string) {
  const where = rol === "ADMIN" ? {} : { OR: [{ profesionalId: usuarioId }, { profesionalId: null }] };

  return prisma.turno.findMany({
    where,
    orderBy: [{ estado: "asc" }, { fechaPreferida: "asc" }],
    include: {
      consulta: true,
      profesional: true,
    },
  });
}

export default async function TurnosPage() {
  const session = await auth();
  if (!session?.user) return null;

  const turnos = await getTurnos(session.user.id, session.user.rol);

  const estadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "PENDIENTE":
        return "default";
      case "CONFIRMADO":
        return "outline";
      case "RECHAZADO":
        return "destructive";
      case "COMPLETADO":
        return "secondary";
      case "CANCELADO":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const estadoLabel = (estado: string) => {
    return estado;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Turnos</h1>
        <p className="text-muted-foreground">
          {session.user.rol === "ADMIN"
            ? "Todos los turnos solicitados"
            : "Turnos asignados y pendientes"}
        </p>
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
                      {turno.consulta.nombre}
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
                  <Badge variant={estadoBadgeVariant(turno.estado)}>
                    {estadoLabel(turno.estado)}
                  </Badge>
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
                        ? "Mañana (9-13hs)"
                        : "Tarde (17-20hs)"}
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
                    href={`mailto:${turno.consulta.email}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    {turno.consulta.email}
                  </a>
                  <a
                    href={`tel:${turno.consulta.telefono}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-4 w-4" />
                    {turno.consulta.telefono}
                  </a>
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Solicitado:{" "}
                    {new Date(turno.createdAt).toLocaleDateString("es-AR")}
                    {turno.profesional && (
                      <span className="ml-2">
                        • Asignado a: {turno.profesional.nombre}
                      </span>
                    )}
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
