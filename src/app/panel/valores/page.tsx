import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { ValorReferenciaForm } from "@/components/panel/valor-referencia-form";
import { eliminarValorReferencia } from "./actions";
import {
  INDICADORES,
  CANASTA_TRAMOS,
  formatPeriodo,
  formatARS,
  leerValor,
} from "@/lib/valores-referencia";
import type { IndicadorReferencia } from "@prisma/client";

function resumenValores(indicador: IndicadorReferencia, valores: unknown): string {
  if (indicador === "CANASTA_CRIANZA") {
    return CANASTA_TRAMOS.map((t) => {
      const n = leerValor(valores, t.key);
      return n != null ? formatARS(n) : "—";
    }).join(" · ");
  }
  const n = leerValor(valores, "valor");
  return n != null ? formatARS(n) : "—";
}

export default async function ValoresPage() {
  const session = await auth();
  if (!session?.user) return null;

  const membresia = await prisma.organizacionMiembro.findFirst({
    where: { usuarioId: session.user.id, activo: true, deletedAt: null },
  });
  if (!membresia) return null;

  const valores = await prisma.valorReferencia.findMany({
    where: { organizacionId: membresia.organizacionId, deletedAt: null },
    orderBy: [{ indicador: "asc" }, { periodo: "desc" }],
  });

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold">Valores de referencia</h1>
        <p className="text-muted-foreground text-sm">
          Cargá los valores oficiales (canasta de crianza, SMVM, Jus). Se muestran en la
          sección Información del sitio, con su fuente y período.
        </p>
      </div>

      {/* Form de carga */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Cargar / actualizar un valor</CardTitle>
        </CardHeader>
        <CardContent>
          <ValorReferenciaForm />
        </CardContent>
      </Card>

      {/* Listado por indicador */}
      {INDICADORES.map((ind) => {
        const items = valores.filter((v) => v.indicador === ind.value);
        if (items.length === 0) return null;
        return (
          <Card key={ind.value}>
            <CardHeader>
              <CardTitle className="text-base">{ind.label}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {items.map((v) => (
                <div
                  key={v.id}
                  className="flex items-center justify-between gap-3 border rounded-lg px-3 py-2 text-sm"
                >
                  <div className="min-w-0">
                    <span className="font-medium">{formatPeriodo(v.periodo)}</span>
                    <span className="text-muted-foreground">
                      {" "}
                      · {resumenValores(v.indicador, v.valores)}
                    </span>
                    <span className="block text-xs text-muted-foreground">{v.fuente}</span>
                  </div>
                  <form action={eliminarValorReferencia.bind(null, v.id)}>
                    <Button
                      type="submit"
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-red-600 flex-shrink-0"
                      aria-label="Eliminar"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              ))}
            </CardContent>
          </Card>
        );
      })}

      {valores.length === 0 && (
        <p className="text-muted-foreground text-sm text-center py-8">
          Todavía no cargaste ningún valor.
        </p>
      )}
    </div>
  );
}
