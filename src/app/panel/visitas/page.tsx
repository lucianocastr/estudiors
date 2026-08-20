import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DISPOSITIVO_LABELS, labelFuente } from "@/lib/visitas";
import { Smartphone, Monitor, MapPin, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

type Visita = {
  path: string;
  dispositivo: keyof typeof DISPOSITIVO_LABELS;
  ciudad: string | null;
  region: string | null;
  pais: string | null;
  fuente: string | null;
  createdAt: Date;
};

function topPor<T>(items: T[], keyFn: (t: T) => string, limit = 6) {
  const conteo = new Map<string, number>();
  for (const it of items) {
    const k = keyFn(it);
    conteo.set(k, (conteo.get(k) ?? 0) + 1);
  }
  return [...conteo.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
}

function ListaTop({
  titulo,
  datos,
  total,
}: {
  titulo: string;
  datos: [string, number][];
  total: number;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-medium">{titulo}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2.5">
        {datos.length === 0 && (
          <p className="text-sm text-muted-foreground">Sin datos.</p>
        )}
        {datos.map(([k, n]) => {
          const pct = total > 0 ? Math.round((n / total) * 100) : 0;
          return (
            <div key={k}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-foreground truncate pr-2">{k}</span>
                <span className="text-muted-foreground tabular-nums flex-shrink-0">
                  {n} · {pct}%
                </span>
              </div>
              <div className="h-1.5 rounded-full bg-secondary/60 overflow-hidden">
                <div className="h-full bg-primary/60" style={{ width: `${pct}%` }} />
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}

export default async function VisitasPage() {
  const session = await auth();
  if (!session?.user) return null;

  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) return null;

  const desde = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
  const visitas = (await prisma.visitaSitio.findMany({
    where: { organizacionId: membresia.organizacionId, createdAt: { gte: desde } },
    orderBy: { createdAt: "desc" },
    select: {
      path: true,
      dispositivo: true,
      ciudad: true,
      region: true,
      pais: true,
      fuente: true,
      createdAt: true,
    },
  })) as Visita[];

  const total = visitas.length;
  const movil = visitas.filter((v) => v.dispositivo === "MOVIL").length;
  const pctMovil = total > 0 ? Math.round((movil / total) * 100) : 0;

  const porDispositivo = topPor(visitas, (v) => DISPOSITIVO_LABELS[v.dispositivo], 4);
  const topCiudades = topPor(visitas, (v) => v.ciudad ?? "Desconocida");
  const topFuentes = topPor(visitas, (v) => labelFuente(v.fuente));
  const topPaginas = topPor(visitas, (v) => v.path);
  const recientes = visitas.slice(0, 12);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Visitas al sitio</h1>
        <p className="text-muted-foreground text-sm">
          De dónde y cómo llega la gente al sitio. Últimos 30 días. Datos propios
          (sin IP); para análisis en profundidad, Google Analytics.
        </p>
      </div>

      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Visitas (30 días)</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{total}</div>
            <p className="text-xs text-muted-foreground">páginas vistas</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Desde el celular</CardTitle>
            <Smartphone className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pctMovil}%</div>
            <p className="text-xs text-muted-foreground">{movil} de {total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Desde escritorio</CardTitle>
            <Monitor className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{100 - pctMovil}%</div>
            <p className="text-xs text-muted-foreground">resto de los dispositivos</p>
          </CardContent>
        </Card>
      </div>

      {/* Agregados */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <ListaTop titulo="Localidades" datos={topCiudades} total={total} />
        <ListaTop titulo="De dónde llegan" datos={topFuentes} total={total} />
        <ListaTop titulo="Páginas de entrada" datos={topPaginas} total={total} />
        <ListaTop titulo="Dispositivo" datos={porDispositivo} total={total} />
      </div>

      {/* Últimas visitas */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Últimas visitas</CardTitle>
        </CardHeader>
        <CardContent>
          {recientes.length === 0 ? (
            <p className="text-muted-foreground text-sm text-center py-8">
              Todavía no hay visitas registradas. Empiezan a aparecer cuando la gente
              entra al sitio (en producción).
            </p>
          ) : (
            <div className="space-y-2">
              {recientes.map((v, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between gap-3 text-sm border rounded-lg px-3 py-2"
                >
                  <div className="min-w-0">
                    <span className="font-medium text-foreground">
                      {v.ciudad ?? "Localidad desconocida"}
                    </span>
                    <span className="text-muted-foreground">
                      {" "}· {DISPOSITIVO_LABELS[v.dispositivo]} · {labelFuente(v.fuente)}
                    </span>
                    <span className="block text-xs text-muted-foreground truncate">
                      {v.path}
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground flex-shrink-0 tabular-nums">
                    {new Date(v.createdAt).toLocaleString("es-AR", {
                      timeZone: "America/Argentina/Buenos_Aires",
                      day: "2-digit",
                      month: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <a
        href="https://analytics.google.com"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 text-sm text-primary hover:underline"
      >
        Abrir Google Analytics (análisis completo)
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}
