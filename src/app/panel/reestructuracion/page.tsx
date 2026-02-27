import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Briefcase,
  Plus,
  AlertTriangle,
  TrendingDown,
  User,
} from "lucide-react";
import {
  ESTADO_CASO_LABELS,
  ESTADO_CASO_COLORS,
  URGENCIA_LABELS,
  URGENCIA_COLORS,
  formatARS,
} from "@/lib/crp-utils";

async function getCasos(organizacionId: string) {
  return prisma.casoRestructuracion.findMany({
    where: { organizacionId, deletedAt: null },
    orderBy: [
      { nivelUrgencia: "desc" },
      { createdAt: "desc" },
    ],
    include: {
      contacto: { select: { nombre: true, telefono: true } },
      abogado: { select: { nombre: true } },
      deudas: {
        select: { totalReclamado: true, costasJudiciales: true, honorariosAbogadoBanco: true },
      },
      alertas: {
        where: { estado: "PENDIENTE" },
        select: { prioridad: true },
      },
      _count: { select: { deudas: true } },
    },
  });
}

export default async function ReestructuracionPage() {
  const session = await auth();
  if (!session?.user) return null;

  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) return null;

  const casos = await getCasos(membresia.organizacionId);

  // Métricas globales
  const totalPasivos = casos.reduce((acc, c) => {
    const sum = c.deudas.reduce((s, d) => {
      const total = Number(d.totalReclamado) + Number(d.costasJudiciales) + Number(d.honorariosAbogadoBanco);
      return s + total;
    }, 0);
    return acc + sum;
  }, 0);

  const casosActivos = casos.filter(
    (c) => !["CERRADO_EXITOSO", "CERRADO_ABANDONADO", "ARCHIVADO"].includes(c.estado)
  ).length;

  const alertasCriticas = casos.reduce(
    (acc, c) => acc + c.alertas.filter((a) => a.prioridad === "CRITICA").length,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold">Reestructuración de Pasivos</h1>
          <p className="text-muted-foreground text-sm">
            Gestión estratégica de casos de deudas bancarias
          </p>
        </div>
        <Button asChild>
          <Link href="/panel/reestructuracion/nuevo">
            <Plus className="h-4 w-4 mr-2" />
            Nuevo caso
          </Link>
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Briefcase className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold">{casosActivos}</p>
                <p className="text-xs text-muted-foreground">Casos activos</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 rounded-lg">
                <TrendingDown className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatARS(totalPasivos)}</p>
                <p className="text-xs text-muted-foreground">Pasivo total administrado</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${alertasCriticas > 0 ? "bg-red-100" : "bg-green-100"}`}>
                <AlertTriangle className={`h-5 w-5 ${alertasCriticas > 0 ? "text-red-600" : "text-green-600"}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{alertasCriticas}</p>
                <p className="text-xs text-muted-foreground">Alertas críticas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Listado */}
      {casos.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Briefcase className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground font-medium">No hay casos registrados</p>
            <p className="text-sm text-muted-foreground mt-1">
              Creá el primer caso de reestructuración
            </p>
            <Button asChild className="mt-4">
              <Link href="/panel/reestructuracion/nuevo">
                <Plus className="h-4 w-4 mr-2" />
                Nuevo caso
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3">
          {casos.map((caso) => {
            const pasivoBruto = caso.deudas.reduce(
              (s, d) =>
                s +
                Number(d.totalReclamado) +
                Number(d.costasJudiciales) +
                Number(d.honorariosAbogadoBanco),
              0
            );
            const alertasCriticasCaso = caso.alertas.filter(
              (a) => a.prioridad === "CRITICA"
            ).length;
            const alertasAltasCaso = caso.alertas.filter(
              (a) => a.prioridad === "ALTA"
            ).length;

            return (
              <Card
                key={caso.id}
                className={
                  caso.nivelUrgencia === "CRITICO"
                    ? "border-red-200 bg-red-50/30"
                    : ""
                }
              >
                <CardContent className="py-4">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    {/* Info principal */}
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs font-mono text-muted-foreground">
                          {caso.numeroCaso}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_CASO_COLORS[caso.estado]}`}
                        >
                          {ESTADO_CASO_LABELS[caso.estado]}
                        </span>
                        <span
                          className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${URGENCIA_COLORS[caso.nivelUrgencia]}`}
                        >
                          {URGENCIA_LABELS[caso.nivelUrgencia]}
                        </span>
                      </div>
                      <p className="font-semibold">{caso.contacto.nombre}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <User className="h-3.5 w-3.5" />
                          {caso.abogado.nombre}
                        </span>
                        <span>{caso._count.deudas} deuda{caso._count.deudas !== 1 ? "s" : ""}</span>
                        <span className="font-medium text-foreground">
                          {formatARS(pasivoBruto)}
                        </span>
                      </div>
                    </div>

                    {/* Alertas + acción */}
                    <div className="flex items-center gap-3 flex-shrink-0">
                      {alertasCriticasCaso > 0 && (
                        <Badge className="bg-red-100 text-red-800 hover:bg-red-100 gap-1">
                          <AlertTriangle className="h-3 w-3" />
                          {alertasCriticasCaso} crítica{alertasCriticasCaso !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      {alertasAltasCaso > 0 && alertasCriticasCaso === 0 && (
                        <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                          {alertasAltasCaso} alerta{alertasAltasCaso !== 1 ? "s" : ""}
                        </Badge>
                      )}
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/panel/reestructuracion/${caso.id}`}>
                          Ver caso
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
