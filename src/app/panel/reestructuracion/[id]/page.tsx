import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft, AlertTriangle, User, Phone, Mail,
  Building2, Home, TrendingDown, BarChart3,
  GitBranch, PhoneCall, DollarSign, Bell,
  CheckCircle2, Circle, ChevronDown,
} from "lucide-react";
import {
  ESTADO_CASO_LABELS, ESTADO_CASO_COLORS, ESTADOS_CASO_FLUJO,
  URGENCIA_LABELS, URGENCIA_COLORS,
  ESTADO_DEUDA_LABELS, ESTADO_DEUDA_COLORS,
  RIESGO_JUDICIAL_LABELS, RIESGO_JUDICIAL_COLORS,
  PRESCRICION_LABELS, PRESCRICION_COLORS,
  TIPO_DEUDA_LABELS, TIPO_BIEN_LABELS,
  TIPO_ESCENARIO_LABELS,
  TIPO_INTERVENCION_LABELS,
  TIPO_SERVICIO_LABELS, ESTADO_PAGO_LABELS,
  BCRA_LABELS, MEDIACION_LABELS,
  formatARS, formatPorcentaje,
  calcularDiasMora, calcularFlujoDisponible, calcularRatioDeudaIngreso,
  REFERENCIA_ARANCELARIA_CRP, escalaArt36Porcentajes, calcularEscalaArt36ARS,
} from "@/lib/crp-utils";
import {
  cambiarEstadoCaso, cambiarUrgencia, guardarDiagnostico,
  agregarDeuda, actualizarEstadoDeuda, eliminarDeuda,
  agregarBien, eliminarBien,
  guardarAnalisisFinanciero,
  agregarEscenario, marcarEscenarioSeleccionado,
  agregarIntervencion,
  agregarHonorario, actualizarPagoHonorario,
  resolverAlerta, descartarAlerta,
} from "./actions";

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getCaso(id: string, organizacionId: string) {
  return prisma.casoRestructuracion.findFirst({
    where: { id, organizacionId, deletedAt: null },
    include: {
      contacto: true,
      abogado: { select: { id: true, nombre: true, titulo: true } },
      deudas: { orderBy: { createdAt: "asc" } },
      bienes: { orderBy: { createdAt: "asc" } },
      analisisFinancieros: { orderBy: { version: "desc" } },
      escenarios: { orderBy: { createdAt: "asc" }, include: { deudasYBienes: true } },
      intervenciones: {
        orderBy: { fecha: "desc" },
        include: { usuario: { select: { nombre: true } }, deuda: { select: { acreedorActual: true } } },
      },
      honorarios: { orderBy: { createdAt: "asc" } },
      alertas: {
        where: { estado: "PENDIENTE" },
        orderBy: [{ prioridad: "desc" }, { fechaAlerta: "asc" }],
      },
    },
  });
}

// ── Helpers de presentación ───────────────────────────────────────────────────

const CHECKLIST_LABELS: Record<string, string> = {
  prescripcionRevisada: "Prescripción revisada",
  cesionVerificada: "Cesión de cartera verificada",
  interesesEvaluados: "Intereses evaluados (posible anatocismo)",
  mediacionNotificada: "Mediación prejudicial consultada",
  inhibicionConsultada: "Inhibición general de bienes consultada",
  revocatoriaEvaluada: "Riesgo de acción revocatoria evaluado",
  bienFamiliaInscripto: "Bien de familia consultado",
  codeudoresIdentificados: "Codeudores identificados",
  ingresoFormal: "Ingreso formal / informal determinado",
};

function formatFecha(d: Date | null | undefined): string {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("es-AR", { day: "numeric", month: "short", year: "numeric" });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function CasoDetallePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ tab?: string }>;
}) {
  const { id } = await params;
  const { tab = "resumen" } = await searchParams;

  const session = await auth();
  if (!session?.user) return null;

  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) return null;

  const caso = await getCaso(id, membresia.organizacionId);
  if (!caso) notFound();

  // Análisis vigente (última versión)
  const analisis = caso.analisisFinancieros[0] ?? null;

  // Cálculos financieros
  const flujoDisponible = analisis
    ? calcularFlujoDisponible({
        ingresoMensualNeto: Number(analisis.ingresoMensualNeto),
        egresosFijos: Number(analisis.egresosFijos),
        compromisoMensualDeudas: Number(analisis.compromisoMensualDeudas),
      })
    : null;

  const ratioDeudaIngreso = analisis
    ? calcularRatioDeudaIngreso(Number(analisis.totalPasivosBruto), Number(analisis.ingresoMensualNeto))
    : null;

  const totalPasivoConCostas = caso.deudas.reduce(
    (s, d) => s + Number(d.totalReclamado) + Number(d.costasJudiciales) + Number(d.honorariosAbogadoBanco),
    0
  );

  const alertasCriticas = caso.alertas.filter((a) => a.prioridad === "CRITICA");

  // Checklist
  const checklist = (caso.checklistDiagnostico as Record<string, boolean>) ?? {};
  const checklistCompletados = Object.values(checklist).filter(Boolean).length;
  const checklistTotal = Object.keys(CHECKLIST_LABELS).length;

  // Bind de actions
  const cambiarEstadoAction = cambiarEstadoCaso.bind(null, caso.id);
  const cambiarUrgenciaAction = cambiarUrgencia.bind(null, caso.id);
  const guardarDiagnosticoAction = guardarDiagnostico.bind(null, caso.id);
  const agregarDeudaAction = agregarDeuda.bind(null, caso.id);
  const agregarBienAction = agregarBien.bind(null, caso.id);
  const guardarAnalisisAction = guardarAnalisisFinanciero.bind(null, caso.id);
  const agregarEscenarioAction = agregarEscenario.bind(null, caso.id);
  const agregarIntervencionAction = agregarIntervencion.bind(null, caso.id);
  const agregarHonorarioAction = agregarHonorario.bind(null, caso.id);

  // Tabs
  const tabs = [
    { key: "resumen", label: "Resumen", icon: BarChart3 },
    { key: "pasivos", label: `Pasivos (${caso.deudas.length})`, icon: TrendingDown },
    { key: "patrimonio", label: `Patrimonio (${caso.bienes.length})`, icon: Home },
    { key: "financiero", label: "Financiero", icon: BarChart3 },
    { key: "escenarios", label: `Escenarios (${caso.escenarios.length})`, icon: GitBranch },
    { key: "intervenciones", label: `Intervenciones (${caso.intervenciones.length})`, icon: PhoneCall },
    { key: "honorarios", label: `Honorarios (${caso.honorarios.length})`, icon: DollarSign },
    { key: "alertas", label: `Alertas (${caso.alertas.length})`, icon: Bell },
  ];

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/panel/reestructuracion">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Reestructuración
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium font-mono">{caso.numeroCaso}</span>
      </div>

      {/* Header del caso */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="space-y-1">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-sm text-muted-foreground">{caso.numeroCaso}</span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${ESTADO_CASO_COLORS[caso.estado]}`}>
                {ESTADO_CASO_LABELS[caso.estado]}
              </span>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${URGENCIA_COLORS[caso.nivelUrgencia]}`}>
                {URGENCIA_LABELS[caso.nivelUrgencia]}
              </span>
              {alertasCriticas.length > 0 && (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                  <AlertTriangle className="h-3 w-3" />
                  {alertasCriticas.length} crítica{alertasCriticas.length !== 1 ? "s" : ""}
                </span>
              )}
            </div>
            <h1 className="text-2xl font-bold">{caso.contacto.nombre}</h1>
            <p className="text-sm text-muted-foreground">
              {caso.cuit && <span>CUIT {caso.cuit} · </span>}
              {caso.estadoBCRA && <span>{BCRA_LABELS[caso.estadoBCRA]} · </span>}
              Abogado: {caso.abogado.titulo ? `${caso.abogado.titulo} ` : ""}{caso.abogado.nombre}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-red-700">{formatARS(totalPasivoConCostas)}</p>
            <p className="text-xs text-muted-foreground">Pasivo total con costas</p>
          </div>
        </div>

        {/* Alertas críticas banner */}
        {alertasCriticas.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 space-y-1">
            {alertasCriticas.map((a) => (
              <div key={a.id} className="flex items-center gap-2 text-sm text-red-800">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <span>{a.descripcion}</span>
                <span className="text-red-600 text-xs ml-auto">{formatFecha(a.fechaAlerta)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tabs de navegación */}
      <div className="border-b overflow-x-auto">
        <nav className="flex gap-0 min-w-max">
          {tabs.map(({ key, label, icon: Icon }) => (
            <Link
              key={key}
              href={`/panel/reestructuracion/${caso.id}?tab=${key}`}
              className={`flex items-center gap-1.5 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                tab === key
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </Link>
          ))}
        </nav>
      </div>

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB: RESUMEN                                            */}
      {/* ════════════════════════════════════════════════════════ */}
      {tab === "resumen" && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Checklist de diagnóstico */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Checklist de diagnóstico</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {checklistCompletados}/{checklistTotal}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <form action={guardarDiagnosticoAction} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(CHECKLIST_LABELS).map(([key, label]) => (
                      <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                          type="checkbox"
                          name={key}
                          defaultChecked={!!checklist[key]}
                          className="rounded border-gray-300"
                        />
                        {checklist[key] ? (
                          <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                        ) : (
                          <Circle className="h-4 w-4 text-gray-300 flex-shrink-0" />
                        )}
                        <span className={checklist[key] ? "line-through text-muted-foreground" : ""}>
                          {label}
                        </span>
                      </label>
                    ))}
                  </div>

                  <div className="border-t pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                        Situación BCRA
                      </label>
                      <select name="estadoBCRA" defaultValue={caso.estadoBCRA ?? ""}
                        className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                        <option value="">— Sin consultar —</option>
                        {(["NORMAL","RIESGO_BAJO","DEFICIENTE","DUDOSO","IRRECUPERABLE"] as const).map(s => (
                          <option key={s} value={s}>{BCRA_LABELS[s]}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                        Objetivo del cliente
                      </label>
                      <select name="objetivoCliente" defaultValue={caso.objetivoCliente ?? ""}
                        className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                        <option value="">— Sin definir —</option>
                        <option value="SALIR_RAPIDO">Salir rápido</option>
                        <option value="MINIMIZAR_COSTO">Minimizar costo</option>
                        <option value="PROTEGER_BIENES">Proteger bienes</option>
                        <option value="MIXTO">Mixto</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                        Nivel de exposición patrimonial
                      </label>
                      <select name="nivelExposicion" defaultValue={caso.nivelExposicion ?? "MEDIO"}
                        className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                        <option value="BAJO">Baja</option>
                        <option value="MEDIO">Media</option>
                        <option value="ALTO">Alta</option>
                        <option value="TOTAL">Total</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                        Inhibición general de bienes
                      </label>
                      <select name="estadoInhibicion" defaultValue={caso.estadoInhibicion}
                        className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                        <option value="SIN_INHIBICION">Sin inhibición</option>
                        <option value="VIGENTE">Vigente</option>
                        <option value="EN_GESTION_LEVANTAMIENTO">En gestión de levantamiento</option>
                        <option value="LEVANTADA">Levantada</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Recomendación técnica
                    </label>
                    <textarea
                      name="recomendacionTecnica"
                      defaultValue={caso.recomendacionTecnica ?? ""}
                      rows={4}
                      placeholder="Diagnóstico estratégico y recomendación del abogado..."
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                    />
                  </div>

                  <Button type="submit" size="sm">Guardar diagnóstico</Button>
                </form>
              </CardContent>
            </Card>

            {/* Métricas financieras resumen */}
            {analisis && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">
                    Resumen financiero
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                      v{analisis.version} · {formatFecha(analisis.fechaAnalisis)}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                    <div className="bg-secondary/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Pasivo bruto</p>
                      <p className="font-bold text-red-700">{formatARS(Number(analisis.totalPasivosBruto))}</p>
                    </div>
                    <div className="bg-secondary/30 rounded-lg p-3">
                      <p className="text-xs text-muted-foreground mb-1">Activos</p>
                      <p className="font-bold text-green-700">{formatARS(Number(analisis.totalActivosEstimados))}</p>
                    </div>
                    <div className={`rounded-lg p-3 ${flujoDisponible !== null && flujoDisponible < 0 ? "bg-red-50" : "bg-secondary/30"}`}>
                      <p className="text-xs text-muted-foreground mb-1">Flujo disponible</p>
                      <p className={`font-bold ${flujoDisponible !== null && flujoDisponible < 0 ? "text-red-700" : ""}`}>
                        {flujoDisponible !== null ? formatARS(flujoDisponible) : "—"}
                      </p>
                    </div>
                    <div className={`rounded-lg p-3 ${ratioDeudaIngreso !== null && ratioDeudaIngreso > 5 ? "bg-red-50" : "bg-secondary/30"}`}>
                      <p className="text-xs text-muted-foreground mb-1">Ratio deuda/ingreso</p>
                      <p className={`font-bold ${ratioDeudaIngreso !== null && ratioDeudaIngreso > 5 ? "text-red-700" : ""}`}>
                        {ratioDeudaIngreso !== null ? `${ratioDeudaIngreso.toFixed(1)}x` : "—"}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Contacto */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />Contacto
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <p className="font-semibold">{caso.contacto.nombre}</p>
                <a href={`mailto:${caso.contacto.email}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <Mail className="h-4 w-4 flex-shrink-0" />{caso.contacto.email}
                </a>
                <a href={`tel:${caso.contacto.telefono}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-primary">
                  <Phone className="h-4 w-4 flex-shrink-0" />{caso.contacto.telefono}
                </a>
              </CardContent>
            </Card>

            {/* Gestión de estado */}
            <Card>
              <CardHeader><CardTitle className="text-base">Estado del caso</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <form action={cambiarEstadoAction} className="space-y-2">
                  <select name="estado" defaultValue={caso.estado}
                    className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                    {ESTADOS_CASO_FLUJO.map((e) => (
                      <option key={e} value={e}>{ESTADO_CASO_LABELS[e]}</option>
                    ))}
                  </select>
                  <Button type="submit" size="sm" variant="outline" className="w-full">
                    Actualizar estado
                  </Button>
                </form>

                <form action={cambiarUrgenciaAction} className="space-y-2 pt-2 border-t">
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block">
                    Nivel de urgencia
                  </label>
                  <select name="nivelUrgencia" defaultValue={caso.nivelUrgencia}
                    className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                    <option value="BAJO">Baja</option>
                    <option value="MEDIO">Media</option>
                    <option value="ALTO">Alta</option>
                    <option value="CRITICO">Crítica</option>
                  </select>
                  <Button type="submit" size="sm" variant="outline" className="w-full">
                    Actualizar urgencia
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Fechas */}
            <Card>
              <CardHeader><CardTitle className="text-base">Cronología</CardTitle></CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Apertura</span>
                  <span>{formatFecha(caso.fechaApertura)}</span>
                </div>
                {caso.fechaCierre && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Cierre</span>
                    <span>{formatFecha(caso.fechaCierre)}</span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB: PASIVOS                                            */}
      {/* ════════════════════════════════════════════════════════ */}
      {tab === "pasivos" && (
        <div className="space-y-6">
          {/* Lista de deudas */}
          {caso.deudas.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <TrendingDown className="h-10 w-10 mx-auto mb-3 opacity-30" />
                No hay deudas registradas
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {caso.deudas.map((deuda) => {
                const diasMora = calcularDiasMora(deuda.fechaMora);
                const totalConCostas = Number(deuda.totalReclamado) + Number(deuda.costasJudiciales) + Number(deuda.honorariosAbogadoBanco);
                const actualizarEstadoDeudaAction = actualizarEstadoDeuda.bind(null, deuda.id, caso.id);
                const eliminarDeudaAction = eliminarDeuda.bind(null, deuda.id, caso.id);

                return (
                  <Card key={deuda.id}>
                    <CardContent className="py-4 space-y-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold">{deuda.acreedorActual}</span>
                            {deuda.fueCedida && (
                              <Badge variant="outline" className="text-xs">
                                Cedida de {deuda.acreedorOriginal}
                              </Badge>
                            )}
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${ESTADO_DEUDA_COLORS[deuda.estadoDeuda]}`}>
                              {ESTADO_DEUDA_LABELS[deuda.estadoDeuda]}
                            </span>
                            <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${RIESGO_JUDICIAL_COLORS[deuda.riesgoJudicial]}`}>
                              Riesgo {RIESGO_JUDICIAL_LABELS[deuda.riesgoJudicial]}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {TIPO_DEUDA_LABELS[deuda.tipoDeuda]}
                            {deuda.fechaMora && ` · ${diasMora} días de mora`}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold text-red-700">{formatARS(totalConCostas)}</p>
                          <p className="text-xs text-muted-foreground">total con costas</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Capital</p>
                          <p className="font-medium">{formatARS(Number(deuda.capitalActual))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Intereses</p>
                          <p className="font-medium">{formatARS(Number(deuda.interesesAcumulados))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Punitatorios</p>
                          <p className="font-medium">{formatARS(Number(deuda.punitatorios))}</p>
                        </div>
                      </div>

                      {/* Prescripción */}
                      {deuda.fechaPrescricion && (
                        <div className={`flex items-center gap-2 text-xs px-2 py-1.5 rounded ${PRESCRICION_COLORS[deuda.estadoPrescricion]}`}>
                          <span className="font-medium">{PRESCRICION_LABELS[deuda.estadoPrescricion]}</span>
                          <span>· Prescribe el {formatFecha(deuda.fechaPrescricion)}</span>
                          {deuda.causaInterrupcion && <span>· Interrumpida: {deuda.causaInterrupcion}</span>}
                        </div>
                      )}

                      {/* Mediación */}
                      {deuda.estadoMediacion !== "NO_APLICA" && (
                        <div className="text-xs text-muted-foreground">
                          Mediación: <span className="font-medium text-foreground">{MEDIACION_LABELS[deuda.estadoMediacion]}</span>
                          {deuda.fechaAudienciaMed && ` · Audiencia: ${formatFecha(deuda.fechaAudienciaMed)}`}
                        </div>
                      )}

                      {/* Expediente judicial */}
                      {deuda.nroExpedienteJudicial && (
                        <div className="text-xs text-muted-foreground">
                          Expte. {deuda.nroExpedienteJudicial}
                          {deuda.juzgado && ` · ${deuda.juzgado}`}
                          {deuda.fuero && ` (${deuda.fuero})`}
                        </div>
                      )}

                      {/* Acción cambiar estado */}
                      <form action={actualizarEstadoDeudaAction} className="flex gap-2 items-end pt-2 border-t flex-wrap">
                        <div className="flex-1 min-w-32">
                          <label className="text-xs text-muted-foreground block mb-1">Estado</label>
                          <select name="estadoDeuda" defaultValue={deuda.estadoDeuda}
                            className="w-full text-xs border rounded-md px-2 py-1.5 bg-background">
                            {(Object.keys(ESTADO_DEUDA_LABELS) as (keyof typeof ESTADO_DEUDA_LABELS)[]).map((e) => (
                              <option key={e} value={e}>{ESTADO_DEUDA_LABELS[e]}</option>
                            ))}
                          </select>
                        </div>
                        {["ACUERDO_VERBAL","ACUERDO_FORMALIZADO","EN_CUMPLIMIENTO","CERRADA"].includes(deuda.estadoDeuda) && (
                          <div className="flex-1 min-w-32">
                            <label className="text-xs text-muted-foreground block mb-1">Monto acordado</label>
                            <input type="number" name="montoAcordado"
                              defaultValue={deuda.montoAcordado ? Number(deuda.montoAcordado) : ""}
                              placeholder="0"
                              className="w-full text-xs border rounded-md px-2 py-1.5 bg-background"
                            />
                          </div>
                        )}
                        <Button type="submit" size="sm" variant="outline">Actualizar</Button>
                        <form action={eliminarDeudaAction}>
                          <Button type="submit" size="sm" variant="ghost"
                            className="text-red-600 hover:text-red-700 hover:bg-red-50">
                            Eliminar
                          </Button>
                        </form>
                      </form>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Formulario agregar deuda */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />Agregar deuda
            </CardTitle></CardHeader>
            <CardContent>
              <form action={agregarDeudaAction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Acreedor original *
                    </label>
                    <input type="text" name="acreedorOriginal" required
                      placeholder="Banco Galicia"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Acreedor actual
                    </label>
                    <input type="text" name="acreedorActual"
                      placeholder="Si fue cedida, nombre del cesionario"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Tipo de deuda *
                    </label>
                    <select name="tipoDeuda" required
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" defaultValue="">
                      <option value="" disabled>Seleccionar...</option>
                      {(Object.keys(TIPO_DEUDA_LABELS) as (keyof typeof TIPO_DEUDA_LABELS)[]).map((t) => (
                        <option key={t} value={t}>{TIPO_DEUDA_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Fecha de mora
                    </label>
                    <input type="date" name="fechaMora"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Capital original *
                    </label>
                    <input type="number" name="capitalOriginal" required min="0" step="0.01"
                      placeholder="0"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Capital actual
                    </label>
                    <input type="number" name="capitalActual" min="0" step="0.01"
                      placeholder="Igual al original si no varía"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Intereses acumulados
                    </label>
                    <input type="number" name="interesesAcumulados" min="0" step="0.01" defaultValue="0"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Punitatorios
                    </label>
                    <input type="number" name="punitatorios" min="0" step="0.01" defaultValue="0"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Costas judiciales
                    </label>
                    <input type="number" name="costasJudiciales" min="0" step="0.01" defaultValue="0"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Honorarios abogado banco
                    </label>
                    <input type="number" name="honorariosAbogadoBanco" min="0" step="0.01" defaultValue="0"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Riesgo judicial
                    </label>
                    <select name="riesgoJudicial" defaultValue="BAJO"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      {(Object.keys(RIESGO_JUDICIAL_LABELS) as (keyof typeof RIESGO_JUDICIAL_LABELS)[]).map((r) => (
                        <option key={r} value={r}>{RIESGO_JUDICIAL_LABELS[r]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Situación BCRA
                    </label>
                    <select name="situacionBCRA" defaultValue=""
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      <option value="">— Sin datos —</option>
                      {(Object.keys(BCRA_LABELS) as (keyof typeof BCRA_LABELS)[]).map((s) => (
                        <option key={s} value={s}>{BCRA_LABELS[s]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Estado mediación
                    </label>
                    <select name="estadoMediacion" defaultValue="NO_APLICA"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      {(Object.keys(MEDIACION_LABELS) as (keyof typeof MEDIACION_LABELS)[]).map((m) => (
                        <option key={m} value={m}>{MEDIACION_LABELS[m]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Fecha audiencia mediación
                    </label>
                    <input type="date" name="fechaAudienciaMed"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Nro. expediente judicial
                    </label>
                    <input type="text" name="nroExpedienteJudicial" placeholder="Ej: 12345/2024"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Juzgado / Fuero
                    </label>
                    <input type="text" name="juzgado" placeholder="Juzgado Civil N° 1"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="fueCedida" className="rounded" />
                    Cartera cedida a tercero
                  </label>
                </div>

                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Observaciones
                  </label>
                  <textarea name="observaciones" rows={2}
                    className="w-full text-sm border rounded-md px-3 py-2 bg-background resize-none" />
                </div>

                <Button type="submit">Agregar deuda</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB: PATRIMONIO                                         */}
      {/* ════════════════════════════════════════════════════════ */}
      {tab === "patrimonio" && (
        <div className="space-y-6">
          {caso.bienes.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <Home className="h-10 w-10 mx-auto mb-3 opacity-30" />
                No hay bienes patrimoniales registrados
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {caso.bienes.map((bien) => {
                const eliminarBienAction = eliminarBien.bind(null, bien.id, caso.id);
                return (
                  <Card key={bien.id}>
                    <CardContent className="py-4 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="font-medium text-sm">{bien.descripcion}</p>
                          <p className="text-xs text-muted-foreground">{TIPO_BIEN_LABELS[bien.tipo]}</p>
                        </div>
                        <p className="font-bold text-green-700 text-sm">{formatARS(Number(bien.valorEstimado))}</p>
                      </div>
                      <div className="flex flex-wrap gap-1.5 text-xs">
                        {bien.esRegistrable && <Badge variant="outline">Registrable</Badge>}
                        {!bien.esEmbargable && <Badge variant="outline" className="bg-green-50 text-green-700">No embargable</Badge>}
                        {bien.esBienFamilia && <Badge variant="outline" className="bg-blue-50 text-blue-700">Bien de familia</Badge>}
                        {bien.tieneGarantia && <Badge variant="outline">Garantía: {bien.garantiaTipo}</Badge>}
                        {bien.tienePrenda && <Badge variant="outline">Con prenda</Badge>}
                        {bien.tieneCodeudor && <Badge variant="outline">Codeudor: {bien.codeudorNombre}</Badge>}
                      </div>
                      {bien.riesgoRevocatoria !== "NULO" && (
                        <p className="text-xs text-orange-700 bg-orange-50 rounded px-2 py-1">
                          ⚠ Riesgo revocatoria {bien.riesgoRevocatoria.toLowerCase()}: {bien.motivoRiesgoRevocatoria}
                        </p>
                      )}
                      <form action={eliminarBienAction} className="pt-1">
                        <Button type="submit" size="sm" variant="ghost"
                          className="text-red-600 hover:text-red-700 hover:bg-red-50 h-7 text-xs">
                          Eliminar bien
                        </Button>
                      </form>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}

          {/* Total activos */}
          {caso.bienes.length > 0 && (
            <div className="text-right text-sm">
              <span className="text-muted-foreground">Total activos estimados: </span>
              <span className="font-bold text-green-700">
                {formatARS(caso.bienes.reduce((s, b) => s + Number(b.valorEstimado), 0))}
              </span>
            </div>
          )}

          {/* Formulario agregar bien */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2">
              <Home className="h-4 w-4" />Agregar bien
            </CardTitle></CardHeader>
            <CardContent>
              <form action={agregarBienAction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Tipo *
                    </label>
                    <select name="tipo" required defaultValue=""
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      <option value="" disabled>Seleccionar...</option>
                      {(Object.keys(TIPO_BIEN_LABELS) as (keyof typeof TIPO_BIEN_LABELS)[]).map((t) => (
                        <option key={t} value={t}>{TIPO_BIEN_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Valor estimado *
                    </label>
                    <input type="number" name="valorEstimado" required min="0" step="0.01"
                      placeholder="0"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Descripción *
                    </label>
                    <input type="text" name="descripcion" required
                      placeholder="Inmueble calle Belgrano 123, Alta Gracia"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Riesgo acción revocatoria
                    </label>
                    <select name="riesgoRevocatoria" defaultValue="NULO"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      <option value="NULO">Sin riesgo</option>
                      <option value="BAJO">Bajo</option>
                      <option value="MEDIO">Medio</option>
                      <option value="ALTO">Alto</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Motivo riesgo revocatoria
                    </label>
                    <input type="text" name="motivoRiesgoRevocatoria"
                      placeholder="Ej: Transferido hace 18 meses"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Garantía (si aplica)
                    </label>
                    <input type="text" name="garantiaTipo"
                      placeholder="Hipoteca a favor de Banco X"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Nombre codeudor
                    </label>
                    <input type="text" name="codeudorNombre"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="esRegistrable" className="rounded" />
                    Registrable
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="esBienFamilia" className="rounded" />
                    Bien de familia inscripto
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="tienePrenda" className="rounded" />
                    Tiene prenda
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="tieneCodeudor" className="rounded" />
                    Tiene codeudor
                  </label>
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="tieneGarantia" className="rounded" />
                    Tiene garantía
                  </label>
                </div>

                <Button type="submit">Agregar bien</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB: FINANCIERO                                         */}
      {/* ════════════════════════════════════════════════════════ */}
      {tab === "financiero" && (
        <div className="space-y-6">
          {/* Análisis vigente */}
          {analisis && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  Análisis financiero v{analisis.version}
                  <span className="ml-2 text-xs font-normal text-muted-foreground">
                    {formatFecha(analisis.fechaAnalisis)}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Ingreso mensual neto</p>
                    <p className="font-bold text-lg">{formatARS(Number(analisis.ingresoMensualNeto))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Egresos fijos</p>
                    <p className="font-medium">{formatARS(Number(analisis.egresosFijos))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Compromiso mensual deudas</p>
                    <p className="font-medium">{formatARS(Number(analisis.compromisoMensualDeudas))}</p>
                  </div>
                  <div className={flujoDisponible !== null && flujoDisponible < 0 ? "text-red-700" : "text-green-700"}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Flujo disponible</p>
                    <p className="font-bold text-lg">{flujoDisponible !== null ? formatARS(flujoDisponible) : "—"}</p>
                  </div>
                  <div className={ratioDeudaIngreso !== null && ratioDeudaIngreso > 5 ? "text-red-700" : ""}>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Ratio deuda/ingreso</p>
                    <p className="font-bold text-lg">{ratioDeudaIngreso !== null ? `${ratioDeudaIngreso.toFixed(1)}x` : "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Patrimonio neto</p>
                    <p className="font-bold text-lg">
                      {formatARS(Number(analisis.totalActivosEstimados) - Number(analisis.totalPasivosBruto))}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pasivo bruto</p>
                    <p className="font-medium text-red-700">{formatARS(Number(analisis.totalPasivosBruto))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pasivo reclamado</p>
                    <p className="font-medium text-red-700">{formatARS(Number(analisis.totalPasivosReclamado))}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Capacidad pago mensual</p>
                    <p className="font-medium">{formatARS(Number(analisis.capacidadPagoMensual))}</p>
                  </div>
                </div>
                {analisis.observaciones && (
                  <p className="text-sm text-muted-foreground bg-secondary/30 rounded-lg p-3 whitespace-pre-wrap">
                    {analisis.observaciones}
                  </p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Historial de versiones */}
          {caso.analisisFinancieros.length > 1 && (
            <div className="text-sm text-muted-foreground">
              {caso.analisisFinancieros.length - 1} versione{caso.analisisFinancieros.length - 1 !== 1 ? "s" : ""} anterior{caso.analisisFinancieros.length - 1 !== 1 ? "es" : ""} disponible{caso.analisisFinancieros.length - 1 !== 1 ? "s" : ""}
            </div>
          )}

          {/* Formulario nuevo análisis */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                {analisis ? `Actualizar análisis (v${analisis.version + 1})` : "Cargar análisis financiero"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form action={guardarAnalisisAction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    { name: "ingresoMensualNeto", label: "Ingreso mensual neto *", required: true, default: analisis ? Number(analisis.ingresoMensualNeto) : "" },
                    { name: "egresosFijos", label: "Egresos fijos", required: false, default: analisis ? Number(analisis.egresosFijos) : "0" },
                    { name: "compromisoMensualDeudas", label: "Compromiso mensual deudas", required: false, default: analisis ? Number(analisis.compromisoMensualDeudas) : "0" },
                    { name: "capacidadPagoMensual", label: "Capacidad de pago mensual *", required: true, default: analisis ? Number(analisis.capacidadPagoMensual) : "" },
                    { name: "totalPasivosBruto", label: "Total pasivos bruto *", required: true, default: analisis ? Number(analisis.totalPasivosBruto) : "" },
                    { name: "totalPasivosReclamado", label: "Total reclamado *", required: true, default: analisis ? Number(analisis.totalPasivosReclamado) : "" },
                    { name: "totalConCostas", label: "Total con costas", required: false, default: analisis ? Number(analisis.totalConCostas) : "0" },
                    { name: "totalActivosEstimados", label: "Total activos estimados *", required: true, default: analisis ? Number(analisis.totalActivosEstimados) : "" },
                  ].map(({ name, label, required, default: def }) => (
                    <div key={name}>
                      <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">{label}</label>
                      <input type="number" name={name} required={required} min="0" step="0.01"
                        defaultValue={def as number}
                        className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                    </div>
                  ))}
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Meses para regularizar
                    </label>
                    <input type="number" name="mesesParaRegularizar" min="1"
                      defaultValue={analisis?.mesesParaRegularizar ?? ""}
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Observaciones
                  </label>
                  <textarea name="observaciones" rows={3}
                    defaultValue={analisis?.observaciones ?? ""}
                    className="w-full text-sm border rounded-md px-3 py-2 bg-background resize-none" />
                </div>
                <Button type="submit">Guardar análisis</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB: ESCENARIOS                                         */}
      {/* ════════════════════════════════════════════════════════ */}
      {tab === "escenarios" && (
        <div className="space-y-6">
          {/* Comparador */}
          {caso.escenarios.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-secondary/40">
                    <th className="text-left px-4 py-2 font-medium text-xs uppercase tracking-wide text-muted-foreground">Escenario</th>
                    <th className="text-right px-4 py-2 font-medium text-xs uppercase tracking-wide text-muted-foreground">Monto total</th>
                    <th className="text-right px-4 py-2 font-medium text-xs uppercase tracking-wide text-muted-foreground">Ahorro vs. reclamado</th>
                    <th className="text-center px-4 py-2 font-medium text-xs uppercase tracking-wide text-muted-foreground">Plazo</th>
                    <th className="text-center px-4 py-2 font-medium text-xs uppercase tracking-wide text-muted-foreground">Riesgo</th>
                    <th className="text-center px-4 py-2 font-medium text-xs uppercase tracking-wide text-muted-foreground">Estado</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {caso.escenarios.map((esc) => {
                    const ahorro = analisis
                      ? Number(analisis.totalPasivosReclamado) - Number(esc.montoTotalPagar)
                      : null;
                    const marcarSeleccionadoAction = marcarEscenarioSeleccionado.bind(null, esc.id, caso.id);

                    return (
                      <tr key={esc.id} className={`border-b ${esc.seleccionado ? "bg-green-50" : esc.recomendado ? "bg-blue-50/50" : ""}`}>
                        <td className="px-4 py-3">
                          <div className="font-medium">{esc.nombre}</div>
                          <div className="text-xs text-muted-foreground">{TIPO_ESCENARIO_LABELS[esc.tipoEscenario]}</div>
                          {esc.recomendado && <Badge className="text-xs mt-1 bg-blue-100 text-blue-800 hover:bg-blue-100">Recomendado</Badge>}
                          {esc.seleccionado && <Badge className="text-xs mt-1 bg-green-100 text-green-800 hover:bg-green-100">Seleccionado</Badge>}
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-red-700">
                          {formatARS(Number(esc.montoTotalPagar))}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-green-700">
                          {ahorro !== null ? formatARS(ahorro) : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          {esc.plazoMeses ? `${esc.plazoMeses} meses` : "—"}
                        </td>
                        <td className="px-4 py-3 text-center">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            esc.riesgoEscenario === "BAJO" ? "bg-green-100 text-green-700" :
                            esc.riesgoEscenario === "MEDIO" ? "bg-yellow-100 text-yellow-800" :
                            "bg-red-100 text-red-800"}`}>
                            {esc.riesgoEscenario}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                          {esc.estado}
                        </td>
                        <td className="px-4 py-3">
                          {!esc.seleccionado && (
                            <form action={marcarSeleccionadoAction}>
                              <Button type="submit" size="sm" variant="outline" className="text-xs">
                                Marcar seleccionado
                              </Button>
                            </form>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Formulario nuevo escenario */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2">
              <GitBranch className="h-4 w-4" />Agregar escenario
            </CardTitle></CardHeader>
            <CardContent>
              <form action={agregarEscenarioAction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Nombre *
                    </label>
                    <input type="text" name="nombre" required
                      placeholder="Refinanciación directa Banco Galicia"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Tipo *
                    </label>
                    <select name="tipoEscenario" required defaultValue=""
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      <option value="" disabled>Seleccionar...</option>
                      {(Object.keys(TIPO_ESCENARIO_LABELS) as (keyof typeof TIPO_ESCENARIO_LABELS)[]).map((t) => (
                        <option key={t} value={t}>{TIPO_ESCENARIO_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Monto total a pagar *
                    </label>
                    <input type="number" name="montoTotalPagar" required min="0" step="0.01"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Plazo (meses)
                    </label>
                    <input type="number" name="plazoMeses" min="1"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Cuota mensual estimada
                    </label>
                    <input type="number" name="cuotaMensualEstimada" min="0" step="0.01"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Riesgo del escenario
                    </label>
                    <select name="riesgoEscenario" defaultValue="MEDIO"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      <option value="BAJO">Bajo</option>
                      <option value="MEDIO">Medio</option>
                      <option value="ALTO">Alto</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Ventajas</label>
                  <textarea name="ventajas" rows={2}
                    className="w-full text-sm border rounded-md px-3 py-2 bg-background resize-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">Desventajas</label>
                  <textarea name="desventajas" rows={2}
                    className="w-full text-sm border rounded-md px-3 py-2 bg-background resize-none" />
                </div>
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" name="recomendado" className="rounded" />
                  Marcar como recomendado
                </label>
                <Button type="submit">Agregar escenario</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB: INTERVENCIONES                                     */}
      {/* ════════════════════════════════════════════════════════ */}
      {tab === "intervenciones" && (
        <div className="space-y-6">
          {/* Timeline */}
          {caso.intervenciones.length > 0 && (
            <ol className="relative border-l border-border space-y-6 ml-3">
              {caso.intervenciones.map((int) => (
                <li key={int.id} className="ml-6">
                  <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full bg-primary/40 border-2 border-background" />
                  <div className="bg-white border rounded-lg p-4 space-y-2">
                    <div className="flex items-start justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Badge variant="secondary" className="text-xs">
                          {TIPO_INTERVENCION_LABELS[int.tipoIntervencion]}
                        </Badge>
                        {int.entidadInvolucrada && (
                          <span className="text-sm font-medium">{int.entidadInvolucrada}</span>
                        )}
                        {int.deuda && (
                          <span className="text-xs text-muted-foreground">
                            ({int.deuda.acreedorActual})
                          </span>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {formatFecha(int.fecha)} · {int.usuario.nombre}
                      </span>
                    </div>
                    <p className="text-sm whitespace-pre-wrap">{int.descripcion}</p>
                    {int.resultado && (
                      <p className="text-sm text-muted-foreground border-l-2 border-muted pl-3">
                        Resultado: {int.resultado}
                      </p>
                    )}
                    {int.requiereFollowUp && !int.followUpCompletado && (
                      <p className="text-xs text-orange-700 bg-orange-50 rounded px-2 py-1">
                        Follow-up requerido: {formatFecha(int.fechaFollowUp)}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ol>
          )}

          {caso.intervenciones.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <PhoneCall className="h-10 w-10 mx-auto mb-3 opacity-30" />
                No hay intervenciones registradas
              </CardContent>
            </Card>
          )}

          {/* Formulario nueva intervención */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2">
              <PhoneCall className="h-4 w-4" />Registrar intervención
            </CardTitle></CardHeader>
            <CardContent>
              <form action={agregarIntervencionAction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Tipo *
                    </label>
                    <select name="tipoIntervencion" required defaultValue=""
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      <option value="" disabled>Seleccionar...</option>
                      {(Object.keys(TIPO_INTERVENCION_LABELS) as (keyof typeof TIPO_INTERVENCION_LABELS)[]).map((t) => (
                        <option key={t} value={t}>{TIPO_INTERVENCION_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Fecha *
                    </label>
                    <input type="datetime-local" name="fecha" required
                      defaultValue={new Date().toISOString().slice(0, 16)}
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Entidad / Interlocutor
                    </label>
                    <input type="text" name="entidadInvolucrada"
                      placeholder="Banco Galicia / Juzgado Civil N°1"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Deuda relacionada
                    </label>
                    <select name="deudaId" defaultValue=""
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      <option value="">— Sin deuda específica —</option>
                      {caso.deudas.map((d) => (
                        <option key={d.id} value={d.id}>
                          {d.acreedorActual} — {TIPO_DEUDA_LABELS[d.tipoDeuda]}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Descripción *
                  </label>
                  <textarea name="descripcion" required rows={3}
                    placeholder="Detallar la intervención realizada..."
                    className="w-full text-sm border rounded-md px-3 py-2 bg-background resize-none" />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Resultado
                  </label>
                  <textarea name="resultado" rows={2}
                    className="w-full text-sm border rounded-md px-3 py-2 bg-background resize-none" />
                </div>
                <div className="flex items-center gap-4 flex-wrap">
                  <label className="flex items-center gap-2 text-sm cursor-pointer">
                    <input type="checkbox" name="requiereFollowUp" className="rounded" />
                    Requiere follow-up
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="text-xs text-muted-foreground">Fecha follow-up:</label>
                    <input type="date" name="fechaFollowUp"
                      className="text-sm border rounded-md px-2 py-1 bg-background" />
                  </div>
                </div>
                <Button type="submit">Registrar</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB: HONORARIOS                                         */}
      {/* ════════════════════════════════════════════════════════ */}
      {tab === "honorarios" && (
        <div className="space-y-6">

          {/* ── Referencia arancelaria — Ley 9459 Córdoba ─────────── */}
          {(() => {
            const tramosArt36 = escalaArt36Porcentajes();
            const escalaARS = totalPasivoConCostas > 0
              ? calcularEscalaArt36ARS(totalPasivoConCostas)
              : null;
            return (
              <Card className="border-blue-100 bg-blue-50/30">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-semibold text-blue-900">
                    Referencia arancelaria — Ley 9459 (Cba) · Ley 11042/2025
                  </CardTitle>
                  <p className="text-xs text-blue-700 mt-1">
                    Valores expresados en <strong>Jus</strong> (Art. 35 Ley 9459).
                    Consultá el valor vigente del mes en{" "}
                    <a href="https://www.justiciacordoba.gob.ar" target="_blank" rel="noopener noreferrer"
                      className="underline">TSJ Córdoba</a> (se publica el último hábil de cada mes).
                  </p>
                </CardHeader>
                <CardContent className="space-y-4 pb-4">

                  {/* Escala Art. 36 — tramos */}
                  <div className="bg-white rounded-lg border border-blue-100 p-3 text-xs">
                    <p className="font-medium uppercase tracking-wide text-muted-foreground mb-2">
                      Escala mínima Art. 36 (honorarios regulados)
                    </p>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-1">
                      {tramosArt36.map((t) => (
                        <div key={t.tramo} className="flex justify-between gap-2">
                          <span className="text-muted-foreground">{t.tramo}</span>
                          <span className="font-semibold text-blue-900 whitespace-nowrap">
                            {t.porcentajeMin}%–{t.porcentajeMax}%
                          </span>
                        </div>
                      ))}
                    </div>
                    {escalaARS && (
                      <div className="mt-2 pt-2 border-t border-blue-100">
                        <p className="text-muted-foreground mb-1">
                          Base regulatoria del caso: <span className="font-medium text-foreground">{formatARS(totalPasivoConCostas)}</span> (pasivo con costas)
                        </p>
                        <p className="text-muted-foreground">
                          Rango ARS estimado (10%–25%):
                          {" "}<span className="font-semibold text-blue-900">{formatARS(escalaARS.montoMinARS)}</span>
                          {" "}—{" "}
                          <span className="font-semibold text-blue-900">{formatARS(escalaARS.montoMaxARS)}</span>
                          {" · "}<span className="italic">{escalaARS.notaJus}</span>
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Tabla de referencias por tipo */}
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="text-left text-muted-foreground border-b border-blue-100">
                          <th className="pb-1.5 font-medium pr-3">Intervención</th>
                          <th className="pb-1.5 font-medium pr-3">Referencia (Jus)</th>
                          <th className="pb-1.5 font-medium">Artículo</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-blue-50">
                        {Object.values(REFERENCIA_ARANCELARIA_CRP).flat().map((ref, i) => (
                          <tr key={i}>
                            <td className="py-2 pr-3 font-medium">{ref.label}</td>
                            <td className="py-2 pr-3">
                              {ref.criterioVariable
                                ? <span className="text-muted-foreground">{ref.criterioVariable}</span>
                                : <><span className="font-semibold text-blue-900">{ref.minJus}{ref.maxJus ? `–${ref.maxJus}` : "+"} Jus</span>
                                  {ref.nota && <span className="text-muted-foreground ml-1">· {ref.nota}</span>}</>
                              }
                            </td>
                            <td className="py-2 text-muted-foreground whitespace-nowrap">{ref.articuloLey}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Mínimos legales Ley 9459 (Cba). El pacto con el cliente es libre dentro de los límites de la ley (Art. 2 y 34). Los montos en Jus se actualizan automáticamente al multiplicar por el valor del Jus vigente del mes.
                  </p>
                </CardContent>
              </Card>
            );
          })()}

          {/* Listado de honorarios */}
          {caso.honorarios.length > 0 && (
            <div className="space-y-3">
              {caso.honorarios.map((h) => {
                const saldo = Number(h.montoFacturado) - Number(h.montoPercibido);
                const actualizarPagoAction = actualizarPagoHonorario.bind(null, h.id, caso.id);
                return (
                  <Card key={h.id}>
                    <CardContent className="py-4 space-y-3">
                      <div className="flex items-start justify-between gap-3 flex-wrap">
                        <div>
                          <p className="font-medium">{h.etapa}</p>
                          <p className="text-xs text-muted-foreground">{TIPO_SERVICIO_LABELS[h.tipoServicio]}</p>
                          {h.criterioVariable && (
                            <p className="text-xs text-muted-foreground">Variable: {h.criterioVariable}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{formatARS(Number(h.honorarioPactado))}</p>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                            h.estadoPago === "PAGADO" ? "bg-green-100 text-green-700" :
                            h.estadoPago === "PARCIAL" ? "bg-yellow-100 text-yellow-800" :
                            h.estadoPago === "INCOBRABLE" ? "bg-gray-100 text-gray-500" :
                            "bg-orange-100 text-orange-800"
                          }`}>
                            {ESTADO_PAGO_LABELS[h.estadoPago]}
                          </span>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div>
                          <p className="text-xs text-muted-foreground">Facturado</p>
                          <p className="font-medium">{formatARS(Number(h.montoFacturado))}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Percibido</p>
                          <p className="font-medium">{formatARS(Number(h.montoPercibido))}</p>
                        </div>
                        <div className={saldo > 0 ? "text-orange-700" : "text-green-700"}>
                          <p className="text-xs text-muted-foreground">Saldo</p>
                          <p className="font-bold">{formatARS(saldo)}</p>
                        </div>
                      </div>

                      {h.fechaVencimiento && (
                        <p className="text-xs text-muted-foreground">
                          Vencimiento: {formatFecha(h.fechaVencimiento)}
                        </p>
                      )}

                      {h.estadoPago !== "PAGADO" && (
                        <form action={actualizarPagoAction} className="flex gap-2 items-end pt-2 border-t flex-wrap">
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1">Monto percibido</label>
                            <input type="number" name="montoPercibido" min="0" step="0.01"
                              defaultValue={Number(h.montoPercibido)}
                              className="text-sm border rounded-md px-2 py-1.5 bg-background w-36" />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground block mb-1">Estado</label>
                            <select name="estadoPago" defaultValue={h.estadoPago}
                              className="text-sm border rounded-md px-2 py-1.5 bg-background">
                              <option value="PENDIENTE">Pendiente</option>
                              <option value="PARCIAL">Parcial</option>
                              <option value="PAGADO">Pagado</option>
                              <option value="INCOBRABLE">Incobrable</option>
                            </select>
                          </div>
                          <Button type="submit" size="sm" variant="outline">Actualizar</Button>
                        </form>
                      )}
                    </CardContent>
                  </Card>
                );
              })}

              {/* Total honorarios */}
              <div className="text-right space-y-1 text-sm pt-2 border-t">
                <div className="flex justify-end gap-6">
                  <span className="text-muted-foreground">Total pactado:</span>
                  <span className="font-bold">{formatARS(caso.honorarios.reduce((s, h) => s + Number(h.honorarioPactado), 0))}</span>
                </div>
                <div className="flex justify-end gap-6">
                  <span className="text-muted-foreground">Total percibido:</span>
                  <span className="font-bold text-green-700">{formatARS(caso.honorarios.reduce((s, h) => s + Number(h.montoPercibido), 0))}</span>
                </div>
              </div>
            </div>
          )}

          {caso.honorarios.length === 0 && (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <DollarSign className="h-10 w-10 mx-auto mb-3 opacity-30" />
                No hay honorarios registrados
              </CardContent>
            </Card>
          )}

          {/* Formulario nuevo honorario */}
          <Card>
            <CardHeader><CardTitle className="text-base flex items-center gap-2">
              <DollarSign className="h-4 w-4" />Agregar honorario
            </CardTitle></CardHeader>
            <CardContent>
              <form action={agregarHonorarioAction} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Tipo de servicio *
                    </label>
                    <select name="tipoServicio" required defaultValue=""
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      <option value="" disabled>Seleccionar...</option>
                      {(Object.keys(TIPO_SERVICIO_LABELS) as (keyof typeof TIPO_SERVICIO_LABELS)[]).map((t) => (
                        <option key={t} value={t}>{TIPO_SERVICIO_LABELS[t]}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Etapa / descripción *
                    </label>
                    <input type="text" name="etapa" required
                      placeholder="Negociación Banco Galicia"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Honorario pactado *
                    </label>
                    <input type="number" name="honorarioPactado" required min="0" step="0.01"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Honorario variable
                    </label>
                    <input type="number" name="honorarioVariable" min="0" step="0.01"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Criterio variable
                    </label>
                    <input type="text" name="criterioVariable"
                      placeholder="10% del ahorro neto obtenido"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Monto facturado
                    </label>
                    <input type="number" name="montoFacturado" min="0" step="0.01" defaultValue="0"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Monto percibido
                    </label>
                    <input type="number" name="montoPercibido" min="0" step="0.01" defaultValue="0"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Fecha vencimiento
                    </label>
                    <input type="date" name="fechaVencimiento"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                      Estado de pago
                    </label>
                    <select name="estadoPago" defaultValue="PENDIENTE"
                      className="w-full text-sm border rounded-md px-3 py-2 bg-background">
                      <option value="PENDIENTE">Pendiente</option>
                      <option value="PARCIAL">Parcial</option>
                      <option value="PAGADO">Pagado</option>
                    </select>
                  </div>
                </div>
                <Button type="submit">Agregar honorario</Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}

      {/* ════════════════════════════════════════════════════════ */}
      {/* TAB: ALERTAS                                            */}
      {/* ════════════════════════════════════════════════════════ */}
      {tab === "alertas" && (
        <div className="space-y-4">
          {caso.alertas.length === 0 ? (
            <Card>
              <CardContent className="py-10 text-center text-muted-foreground">
                <Bell className="h-10 w-10 mx-auto mb-3 opacity-30" />
                No hay alertas pendientes
              </CardContent>
            </Card>
          ) : (
            caso.alertas.map((alerta) => {
              const resolverAction = resolverAlerta.bind(null, alerta.id, caso.id);
              const descartarAction = descartarAlerta.bind(null, alerta.id, caso.id);
              return (
                <Card key={alerta.id}
                  className={alerta.prioridad === "CRITICA" ? "border-red-200 bg-red-50/30" :
                    alerta.prioridad === "ALTA" ? "border-orange-200 bg-orange-50/20" : ""}>
                  <CardContent className="py-4">
                    <div className="flex items-start justify-between gap-3 flex-wrap">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className={`h-4 w-4 ${
                            alerta.prioridad === "CRITICA" ? "text-red-600" :
                            alerta.prioridad === "ALTA" ? "text-orange-600" :
                            alerta.prioridad === "MEDIA" ? "text-yellow-600" : "text-gray-500"
                          }`} />
                          <span className="font-medium text-sm">{alerta.descripcion}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {alerta.tipoAlerta.replace(/_/g, " ")} · {formatFecha(alerta.fechaAlerta)}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <form action={resolverAction}>
                          <Button type="submit" size="sm" variant="outline" className="text-green-700 hover:bg-green-50">
                            Resolver
                          </Button>
                        </form>
                        <form action={descartarAction}>
                          <Button type="submit" size="sm" variant="ghost" className="text-muted-foreground">
                            Descartar
                          </Button>
                        </form>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
