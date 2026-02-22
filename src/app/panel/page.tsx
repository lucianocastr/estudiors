import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MessageSquare,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";

async function getEstadisticas(usuarioId: string, rol: string) {
  const where = rol === "ADMIN" ? {} : { profesionalId: usuarioId };

  const [
    totalConsultas,
    consultasNuevas,
    consultasEnProceso,
    turnosPendientes,
    consultasUrgentes,
  ] = await Promise.all([
    prisma.consulta.count({ where }),
    prisma.consulta.count({ where: { ...where, estado: "NUEVA" } }),
    prisma.consulta.count({ where: { ...where, estado: "EN_PROCESO" } }),
    prisma.turno.count({ where: { ...where, estado: "PENDIENTE" } }),
    prisma.consulta.count({ where: { ...where, urgente: true, estado: { not: "CERRADA" } } }),
  ]);

  return {
    totalConsultas,
    consultasNuevas,
    consultasEnProceso,
    turnosPendientes,
    consultasUrgentes,
  };
}

async function getUltimasConsultas(usuarioId: string, rol: string) {
  const where = rol === "ADMIN" ? {} : { profesionalId: usuarioId };

  return prisma.consulta.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { turno: true },
  });
}

export default async function PanelDashboard() {
  const session = await auth();
  if (!session?.user) return null;

  const stats = await getEstadisticas(session.user.id, session.user.rol);
  const ultimasConsultas = await getUltimasConsultas(session.user.id, session.user.rol);

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
      default:
        return "secondary";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">
          Hola, {session.user.name?.split(" ")[0]}
        </h1>
        <p className="text-muted-foreground">
          Este es el resumen de tu actividad
        </p>
      </div>

      {/* Tarjetas de estadísticas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Consultas Nuevas
            </CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultasNuevas}</div>
            <p className="text-xs text-muted-foreground">
              pendientes de revisión
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">En Proceso</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultasEnProceso}</div>
            <p className="text-xs text-muted-foreground">
              consultas activas
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Turnos Pendientes
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.turnosPendientes}</div>
            <p className="text-xs text-muted-foreground">
              por confirmar
            </p>
          </CardContent>
        </Card>

        <Card className={stats.consultasUrgentes > 0 ? "border-red-200 bg-red-50" : ""}>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Urgentes</CardTitle>
            <AlertCircle className={`h-4 w-4 ${stats.consultasUrgentes > 0 ? "text-red-500" : "text-muted-foreground"}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stats.consultasUrgentes > 0 ? "text-red-600" : ""}`}>
              {stats.consultasUrgentes}
            </div>
            <p className="text-xs text-muted-foreground">
              requieren atención
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Últimas consultas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Últimas Consultas</CardTitle>
              <CardDescription>
                Las consultas más recientes recibidas
              </CardDescription>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/panel/consultas">
                Ver todas
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {ultimasConsultas.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No hay consultas todavía
            </p>
          ) : (
            <div className="space-y-4">
              {ultimasConsultas.map((consulta) => (
                <div
                  key={consulta.id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{consulta.nombre}</p>
                      {consulta.urgente && (
                        <Badge variant="destructive" className="text-xs">
                          Urgente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {consulta.descripcion.substring(0, 100)}...
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(consulta.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    <Badge variant={estadoBadgeVariant(consulta.estado)}>
                      {consulta.estado.replace("_", " ")}
                    </Badge>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/panel/consultas/${consulta.id}`}>
                        Ver
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
