import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { especialidades } from "@/content/especialidades";
import { MessageSquare, Calendar, Phone, Mail } from "lucide-react";

async function getConsultas(usuarioId: string, rol: string) {
  const where = rol === "ADMIN" ? {} : { OR: [{ profesionalId: usuarioId }, { profesionalId: null }] };

  return prisma.consulta.findMany({
    where,
    orderBy: [{ urgente: "desc" }, { createdAt: "desc" }],
    include: {
      turno: true,
      profesional: true,
    },
  });
}

function getNombreProblema(tipoProblema: string): string {
  const problema = especialidades
    .flatMap((e) => e.problemas)
    .find((p) => p.id === tipoProblema);
  return problema?.label || tipoProblema;
}

function getNombreEspecialidad(especialidadId: string): string {
  const esp = especialidades.find((e) => e.id === especialidadId);
  return esp?.nombre || especialidadId;
}

export default async function ConsultasPage() {
  const session = await auth();
  if (!session?.user) return null;

  const consultas = await getConsultas(session.user.id, session.user.rol);

  const estadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "NUEVA":
        return "default";
      case "ASIGNADA":
        return "secondary";
      case "EN_PROCESO":
        return "outline";
      case "ATENDIDA":
        return "default";
      case "CERRADA":
        return "secondary";
      default:
        return "secondary";
    }
  };

  const estadoLabel = (estado: string) => {
    return estado.replace("_", " ");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Consultas</h1>
        <p className="text-muted-foreground">
          {session.user.rol === "ADMIN"
            ? "Todas las consultas recibidas"
            : "Consultas asignadas y sin asignar"}
        </p>
      </div>

      {consultas.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No hay consultas todavía</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {consultas.map((consulta) => (
            <Card
              key={consulta.id}
              className={consulta.urgente ? "border-red-200 bg-red-50/50" : ""}
            >
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{consulta.nombre}</CardTitle>
                      {consulta.urgente && (
                        <Badge variant="destructive">Urgente</Badge>
                      )}
                    </div>
                    <CardDescription>
                      {getNombreEspecialidad(consulta.especialidad)} •{" "}
                      {getNombreProblema(consulta.tipoProblema)}
                    </CardDescription>
                  </div>
                  <Badge variant={estadoBadgeVariant(consulta.estado)}>
                    {estadoLabel(consulta.estado)}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {consulta.descripcion}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href={`mailto:${consulta.email}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    {consulta.email}
                  </a>
                  <a
                    href={`tel:${consulta.telefono}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-4 w-4" />
                    {consulta.telefono}
                  </a>
                  {consulta.turno && (
                    <span className="flex items-center gap-1 text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      Turno solicitado
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between pt-2 border-t">
                  <div className="text-xs text-muted-foreground">
                    Recibida: {new Date(consulta.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                    {consulta.profesional && (
                      <span className="ml-2">
                        • Asignada a: {consulta.profesional.nombre}
                      </span>
                    )}
                  </div>
                  <Button asChild size="sm">
                    <Link href={`/panel/consultas/${consulta.id}`}>
                      Ver detalles
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
