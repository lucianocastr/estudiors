import { notFound } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Clock,
  Video,
  MapPinned,
  AlertCircle,
  User,
} from "lucide-react";
import { cambiarEstado, agregarNota, confirmarTurno, rechazarTurno } from "./actions";

// ── Helpers de presentación ───────────────────────────────────────────────────

const ESTADOS = ["NUEVA", "EN_ANALISIS", "CONTACTADO", "CONVERTIDO", "CERRADO"] as const;

const ESTADO_LABELS: Record<string, string> = {
  NUEVA: "Nueva",
  EN_ANALISIS: "En análisis",
  CONTACTADO: "Contactado",
  CONVERTIDO: "Convertido",
  CERRADO: "Cerrado",
};

const ESTADO_COLORS: Record<string, string> = {
  NUEVA: "bg-blue-100 text-blue-800",
  EN_ANALISIS: "bg-yellow-100 text-yellow-800",
  CONTACTADO: "bg-purple-100 text-purple-800",
  CONVERTIDO: "bg-green-100 text-green-800",
  CERRADO: "bg-gray-100 text-gray-600",
};

const EVENTO_LABELS: Record<string, string> = {
  CREATED: "Consulta recibida",
  STATE_CHANGED: "Estado actualizado",
  ASSIGNED: "Asignada a profesional",
  REASSIGNED: "Reasignada",
  NOTE_ADDED: "Nota agregada",
  NOTE_DELETED: "Nota eliminada",
  APPOINTMENT_CREATED: "Turno solicitado",
  APPOINTMENT_CONFIRMED: "Turno confirmado",
  APPOINTMENT_REJECTED: "Turno rechazado",
  APPOINTMENT_COMPLETED: "Turno completado",
  CONTACT_ATTEMPT: "Intento de contacto",
  CLIENT_CONVERTED: "Convertido a cliente",
  CLOSED: "Caso cerrado",
};

const NOTA_TIPO_LABELS: Record<string, string> = {
  GENERAL: "General",
  LLAMADA: "Llamada",
  REUNION: "Reunión",
  SEGUIMIENTO: "Seguimiento",
  SISTEMA: "Sistema",
};

// ── Data fetching ─────────────────────────────────────────────────────────────

async function getConsulta(id: string, organizacionId: string) {
  return prisma.consulta.findFirst({
    where: { id, organizacionId, deletedAt: null },
    include: {
      contacto: true,
      turno: true,
      notas: {
        where: { deletedAt: null },
        orderBy: { createdAt: "desc" },
        include: { autor: true },
      },
      eventos: {
        orderBy: { createdAt: "asc" },
        include: { autor: true },
      },
      asignaciones: {
        where: { activo: true },
        include: { asignadoA: true },
      },
    },
  });
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default async function ConsultaDetallePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await auth();
  if (!session?.user) return null;

  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) return null;

  const consulta = await getConsulta(id, membresia.organizacionId);
  if (!consulta) notFound();

  const asignacionActual = consulta.asignaciones[0] ?? null;
  const cambiarEstadoAction = cambiarEstado.bind(null, consulta.id);
  const agregarNotaAction = agregarNota.bind(null, consulta.id);
  const confirmarTurnoAction = confirmarTurno.bind(null, consulta.id);
  const rechazarTurnoAction = rechazarTurno.bind(null, consulta.id);

  return (
    <div className="space-y-6 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-3">
        <Button asChild variant="ghost" size="sm" className="-ml-2">
          <Link href="/panel/consultas">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Consultas
          </Link>
        </Button>
        <span className="text-muted-foreground">/</span>
        <span className="text-sm font-medium">{consulta.contacto.nombre}</span>
      </div>

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div className="space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl font-bold">{consulta.contacto.nombre}</h1>
            {consulta.urgente && (
              <Badge variant="destructive" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Urgente
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground">
            {consulta.especialidad} · {consulta.tipoProblema}
          </p>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${ESTADO_COLORS[consulta.estado]}`}
        >
          {ESTADO_LABELS[consulta.estado]}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Columna principal (2/3) ─────────────────────────────── */}
        <div className="lg:col-span-2 space-y-6">

          {/* Descripción del caso */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Descripción del caso</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Especialidad</p>
                  <p className="font-medium">{consulta.especialidad}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Tipo de problema</p>
                  <p className="font-medium">{consulta.tipoProblema}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Prioridad</p>
                  <p className="font-medium">{consulta.prioridad}</p>
                </div>
                <div>
                  <p className="text-muted-foreground text-xs uppercase tracking-wide mb-1">Recibida</p>
                  <p className="font-medium">
                    {new Date(consulta.createdAt).toLocaleDateString("es-AR", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-muted-foreground text-xs uppercase tracking-wide mb-2">Descripción</p>
                <p className="text-sm leading-relaxed whitespace-pre-wrap bg-secondary/40 rounded-lg p-4">
                  {consulta.descripcion}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Turno */}
          {consulta.turno && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Turno solicitado
                  <span className={`ml-auto inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    consulta.turno.estado === "CONFIRMADO" ? "bg-green-100 text-green-800" :
                    consulta.turno.estado === "PENDIENTE"  ? "bg-yellow-100 text-yellow-800" :
                    consulta.turno.estado === "RECHAZADO"  ? "bg-red-100 text-red-800" :
                    consulta.turno.estado === "COMPLETADO" ? "bg-blue-100 text-blue-800" :
                    "bg-gray-100 text-gray-600"
                  }`}>
                    {{ PENDIENTE: "Pendiente", CONFIRMADO: "Confirmado", RECHAZADO: "Rechazado", COMPLETADO: "Completado", CANCELADO: "Cancelado" }[consulta.turno.estado] ?? consulta.turno.estado}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    {consulta.turno.modalidad === "PRESENCIAL" ? (
                      <MapPinned className="h-4 w-4 text-muted-foreground" />
                    ) : (
                      <Video className="h-4 w-4 text-muted-foreground" />
                    )}
                    <span>{consulta.turno.modalidad === "PRESENCIAL" ? "Presencial" : "Virtual"}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {consulta.turno.horarioPreferido === "manana"
                        ? "Mañana (9–13hs)"
                        : "Tarde (17–20hs)"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 col-span-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      Preferencia:{" "}
                      {new Date(consulta.turno.fechaPreferida).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                  </div>
                </div>

                {consulta.turno.fechaConfirmada && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-sm">
                    <p className="font-medium text-green-800">
                      Confirmado para:{" "}
                      {new Date(consulta.turno.fechaConfirmada).toLocaleDateString("es-AR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </p>
                    {consulta.turno.linkVideoCall && (
                      <a
                        href={consulta.turno.linkVideoCall}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:underline text-xs mt-1 block"
                      >
                        {consulta.turno.linkVideoCall}
                      </a>
                    )}
                  </div>
                )}

                {consulta.turno.estado === "PENDIENTE" && (
                  <div className="flex gap-3 pt-2 border-t">
                    <form action={confirmarTurnoAction} className="flex-1 space-y-2">
                      <input
                        type="datetime-local"
                        name="fechaConfirmada"
                        required
                        className="w-full text-sm border rounded-md px-3 py-1.5 bg-background"
                      />
                      {consulta.turno.modalidad === "VIRTUAL" && (
                        <input
                          type="url"
                          name="linkVideoCall"
                          placeholder="Link de videollamada (opcional)"
                          className="w-full text-sm border rounded-md px-3 py-1.5 bg-background"
                        />
                      )}
                      <Button type="submit" size="sm" className="w-full">
                        Confirmar turno
                      </Button>
                    </form>
                    <form action={rechazarTurnoAction}>
                      <input
                        type="text"
                        name="motivoRechazo"
                        placeholder="Motivo (opcional)"
                        className="w-full text-sm border rounded-md px-3 py-1.5 mb-2 bg-background"
                      />
                      <Button type="submit" variant="destructive" size="sm" className="w-full">
                        Rechazar
                      </Button>
                    </form>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Notas internas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Notas internas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Formulario nueva nota */}
              <form action={agregarNotaAction} className="space-y-3">
                <textarea
                  name="contenido"
                  placeholder="Agregar una nota interna..."
                  rows={3}
                  required
                  className="w-full text-sm border rounded-md px-3 py-2 bg-background resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <div className="flex items-center justify-between">
                  <select
                    name="tipo"
                    defaultValue="GENERAL"
                    className="text-sm border rounded-md px-2 py-1.5 bg-background"
                  >
                    {Object.entries(NOTA_TIPO_LABELS).map(([val, label]) => (
                      <option key={val} value={val}>
                        {label}
                      </option>
                    ))}
                  </select>
                  <Button type="submit" size="sm">
                    Agregar nota
                  </Button>
                </div>
              </form>

              {/* Lista de notas */}
              {consulta.notas.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No hay notas todavía
                </p>
              ) : (
                <div className="space-y-3 pt-2 border-t">
                  {consulta.notas.map((nota) => (
                    <div key={nota.id} className="bg-secondary/30 rounded-lg p-3 text-sm">
                      <div className="flex items-center justify-between mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-xs">
                            {nota.autor.titulo ? `${nota.autor.titulo} ` : ""}
                            {nota.autor.nombre}
                          </span>
                          <Badge variant="secondary" className="text-xs py-0">
                            {NOTA_TIPO_LABELS[nota.tipo]}
                          </Badge>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {new Date(nota.createdAt).toLocaleDateString("es-AR", {
                            day: "numeric",
                            month: "short",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                      </div>
                      <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                        {nota.contenido}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* ── Columna lateral (1/3) ───────────────────────────────── */}
        <div className="space-y-6">

          {/* Contacto */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <User className="h-4 w-4" />
                Contacto
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <p className="font-semibold text-base">{consulta.contacto.nombre}</p>
              <a
                href={`mailto:${consulta.contacto.email}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4 flex-shrink-0" />
                {consulta.contacto.email}
              </a>
              <a
                href={`tel:${consulta.contacto.telefono}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4 flex-shrink-0" />
                {consulta.contacto.telefono}
              </a>
              {consulta.contacto.localidad && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 flex-shrink-0" />
                  {consulta.contacto.localidad}
                </div>
              )}
              <div className="pt-2 border-t">
                <p className="text-xs text-muted-foreground">
                  Fuente: {consulta.contacto.fuente}
                </p>
                {consulta.contacto.esCliente && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    Cliente
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Cambiar estado */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Gestión</CardTitle>
            </CardHeader>
            <CardContent>
              <form action={cambiarEstadoAction} className="space-y-3">
                <div>
                  <label className="text-xs text-muted-foreground uppercase tracking-wide block mb-1.5">
                    Estado actual
                  </label>
                  <select
                    name="estado"
                    defaultValue={consulta.estado}
                    className="w-full text-sm border rounded-md px-3 py-2 bg-background"
                  >
                    {ESTADOS.map((e) => (
                      <option key={e} value={e}>
                        {ESTADO_LABELS[e]}
                      </option>
                    ))}
                  </select>
                </div>
                <Button type="submit" size="sm" variant="outline" className="w-full">
                  Actualizar estado
                </Button>
              </form>

              {asignacionActual && (
                <div className="mt-4 pt-4 border-t text-sm">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Asignada a
                  </p>
                  <p className="font-medium">{asignacionActual.asignadoA.nombre}</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Timeline de eventos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Historial</CardTitle>
            </CardHeader>
            <CardContent>
              {consulta.eventos.length === 0 ? (
                <p className="text-sm text-muted-foreground">Sin eventos</p>
              ) : (
                <ol className="relative border-l border-border space-y-4 ml-2">
                  {consulta.eventos.map((evento) => (
                    <li key={evento.id} className="ml-4">
                      <div className="absolute -left-1.5 mt-1 w-3 h-3 rounded-full bg-primary/40 border-2 border-background" />
                      <p className="text-xs font-medium">
                        {EVENTO_LABELS[evento.tipo] ?? evento.tipo}
                      </p>
                      {evento.estadoAnterior && evento.estadoNuevo && (
                        <p className="text-xs text-muted-foreground">
                          {ESTADO_LABELS[evento.estadoAnterior]} →{" "}
                          {ESTADO_LABELS[evento.estadoNuevo]}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {evento.autor
                          ? `${evento.autor.nombre} · `
                          : "Sistema · "}
                        {new Date(evento.createdAt).toLocaleDateString("es-AR", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </p>
                    </li>
                  ))}
                </ol>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
