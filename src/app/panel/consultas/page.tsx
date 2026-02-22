import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MessageSquare, Calendar, Phone, Mail } from "lucide-react";

async function getOrganizacionId(usuarioId: string): Promise<string | null> {
  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId, activo: true, deletedAt: null },
  });
  return membresia?.organizacionId ?? null;
}

async function getConsultas(organizacionId: string) {
  return prisma.consulta.findMany({
    where: { organizacionId, deletedAt: null },
    orderBy: [{ urgente: "desc" }, { createdAt: "desc" }],
    include: {
      turno: true,
      contacto: true,
    },
  });
}

export default async function ConsultasPage() {
  const session = await auth();
  if (!session?.user) return null;

  const organizacionId = await getOrganizacionId(session.user.id);
  if (!organizacionId) return null;

  const consultas = await getConsultas(organizacionId);

  const estadoBadgeVariant = (estado: string) => {
    switch (estado) {
      case "NUEVA":
        return "default";
      case "EN_ANALISIS":
        return "secondary";
      case "CONTACTADO":
        return "outline";
      case "CONVERTIDO":
        return "default";
      case "CERRADO":
        return "secondary";
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Consultas</h1>
        <p className="text-muted-foreground">Todas las consultas recibidas</p>
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
                      <CardTitle className="text-lg">{consulta.contacto.nombre}</CardTitle>
                      {consulta.urgente && (
                        <Badge variant="destructive">Urgente</Badge>
                      )}
                    </div>
                    <CardDescription>
                      {consulta.especialidad} · {consulta.tipoProblema}
                    </CardDescription>
                  </div>
                  <Badge variant={estadoBadgeVariant(consulta.estado)}>
                    {consulta.estado.replace("_", " ")}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {consulta.descripcion}
                </p>

                <div className="flex flex-wrap gap-4 text-sm">
                  <a
                    href={`mailto:${consulta.contacto.email}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Mail className="h-4 w-4" />
                    {consulta.contacto.email}
                  </a>
                  <a
                    href={`tel:${consulta.contacto.telefono}`}
                    className="flex items-center gap-1 text-muted-foreground hover:text-primary"
                  >
                    <Phone className="h-4 w-4" />
                    {consulta.contacto.telefono}
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
                    Recibida:{" "}
                    {new Date(consulta.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
