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
  Briefcase,
} from "lucide-react";

async function getOrganizacionId(usuarioId: string): Promise<string | null> {
  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId, activo: true, deletedAt: null },
  });
  return membresia?.organizacionId ?? null;
}

async function getEstadisticas(organizacionId: string) {
  const base = { organizacionId, deletedAt: null };

  const [
    totalConsultas,
    consultasNuevas,
    consultasEnAnalisis,
    turnosPendientes,
    consultasUrgentes,
  ] = await Promise.all([
    prisma.consulta.count({ where: base }),
    prisma.consulta.count({ where: { ...base, estado: "NUEVA" } }),
    prisma.consulta.count({ where: { ...base, estado: "EN_ANALISIS" } }),
    prisma.turno.count({ where: { organizacionId, deletedAt: null, estado: "PENDIENTE" } }),
    prisma.consulta.count({ where: { ...base, urgente: true, estado: { not: "CERRADO" } } }),
  ]);

  return {
    totalConsultas,
    consultasNuevas,
    consultasEnAnalisis,
    turnosPendientes,
    consultasUrgentes,
  };
}

async function getAlertasCRP(organizacionId: string) {
  return prisma.alertaCRP.findMany({
    where: {
      estado: "PENDIENTE",
      caso: { organizacionId, deletedAt: null },
    },
    orderBy: [{ prioridad: "desc" }, { fechaAlerta: "asc" }],
    take: 5,
    include: {
      caso: { select: { numeroCaso: true, id: true, contacto: { select: { nombre: true } } } },
    },
  });
}

async function getUltimasConsultas(organizacionId: string) {
  return prisma.consulta.findMany({
    where: { organizacionId, deletedAt: null },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { turno: true, contacto: true },
  });
}

export default async function PanelDashboard() {
  const session = await auth();
  if (!session?.user) return null;

  const organizacionId = await getOrganizacionId(session.user.id);
  if (!organizacionId) return null;

  const [stats, ultimasConsultas, alertasCRP] = await Promise.all([
    getEstadisticas(organizacionId),
    getUltimasConsultas(organizacionId),
    getAlertasCRP(organizacionId),
  ]);

  const CONSULTA_ESTADO_LABELS: Record<string, string> = {
    NUEVA: "Nueva",
    EN_ANALISIS: "En análisis",
    CONTACTADO: "Contactado",
    CONVERTIDO: "Convertido",
    CERRADO: "Cerrado",
  };
  const CONSULTA_ESTADO_COLORS: Record<string, string> = {
    NUEVA: "bg-blue-100 text-blue-800",
    EN_ANALISIS: "bg-yellow-100 text-yellow-800",
    CONTACTADO: "bg-purple-100 text-purple-800",
    CONVERTIDO: "bg-green-100 text-green-800",
    CERRADO: "bg-gray-100 text-gray-600",
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
            <CardTitle className="text-sm font-medium">En Análisis</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.consultasEnAnalisis}</div>
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

      {/* Widget alertas CRP */}
      {alertasCRP.length > 0 && (
        <Card className="border-orange-200">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-orange-600" />
                <CardTitle className="text-base">Alertas — Reestructuración</CardTitle>
                <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                  {alertasCRP.length}
                </Badge>
              </div>
              <Button asChild variant="outline" size="sm">
                <Link href="/panel/reestructuracion">
                  Ver todos <ArrowRight className="ml-1 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-2">
            {alertasCRP.map((alerta) => (
              <Link
                key={alerta.id}
                href={`/panel/reestructuracion/${alerta.caso.id}?tab=alertas`}
                className="flex items-center justify-between p-3 border rounded-lg hover:bg-orange-50/50 transition-colors"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <AlertCircle className={`h-4 w-4 flex-shrink-0 ${
                    alerta.prioridad === "CRITICA" ? "text-red-600" :
                    alerta.prioridad === "ALTA" ? "text-orange-600" : "text-yellow-600"
                  }`} />
                  <div className="min-w-0">
                    <p className="text-sm font-medium truncate">{alerta.descripcion}</p>
                    <p className="text-xs text-muted-foreground">
                      {alerta.caso.numeroCaso} · {alerta.caso.contacto.nombre}
                    </p>
                  </div>
                </div>
                <Badge variant="outline" className={`flex-shrink-0 text-xs ${
                  alerta.prioridad === "CRITICA" ? "border-red-300 text-red-700" :
                  alerta.prioridad === "ALTA" ? "border-orange-300 text-orange-700" : ""
                }`}>
                  {alerta.prioridad}
                </Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

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
                      <p className="font-medium truncate">{consulta.contacto.nombre}</p>
                      {consulta.urgente && (
                        <Badge variant="destructive" className="text-xs">
                          Urgente
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground truncate">
                      {consulta.descripcion?.substring(0, 100) ?? ""}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(consulta.createdAt).toLocaleDateString("es-AR")}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${CONSULTA_ESTADO_COLORS[consulta.estado] ?? "bg-gray-100 text-gray-600"}`}>
                      {CONSULTA_ESTADO_LABELS[consulta.estado] ?? consulta.estado}
                    </span>
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
