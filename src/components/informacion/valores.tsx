import Link from "next/link";
import { ExternalLink } from "lucide-react";
import type { IndicadorReferencia, ValorReferencia } from "@prisma/client";
import {
  CANASTA_TRAMOS,
  formatARS,
  formatPeriodo,
  leerValor,
  INDICADOR_LABELS,
} from "@/lib/valores-referencia";

function valorSimple(v: ValorReferencia): string {
  const n = leerValor(v.valores, "valor");
  return n != null ? formatARS(n) : "—";
}

/** Tabla de valores vigentes — se muestra dentro de un artículo. */
export function ValoresVigentes({
  indicador,
  ultimo,
}: {
  indicador: IndicadorReferencia;
  ultimo: ValorReferencia | null;
}) {
  if (!ultimo) return null;

  return (
    <div className="my-10 rounded-2xl border border-primary/20 bg-primary/5 p-6">
      <div className="flex items-baseline justify-between gap-3 mb-4 flex-wrap">
        <h3 className="font-display text-lg font-semibold text-foreground">
          {INDICADOR_LABELS[indicador]} — valores vigentes
        </h3>
        <span className="text-xs text-muted-foreground">
          {formatPeriodo(ultimo.periodo)} · Fuente: {ultimo.fuente}
        </span>
      </div>

      {indicador === "CANASTA_CRIANZA" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-2 pr-4 font-medium">Edad del niño/a</th>
                <th className="py-2 font-medium text-right">Costo mensual</th>
              </tr>
            </thead>
            <tbody>
              {CANASTA_TRAMOS.map((t) => {
                const n = leerValor(ultimo.valores, t.key);
                return (
                  <tr key={t.key} className="border-t border-border/50">
                    <td className="py-2 pr-4 text-foreground">{t.label}</td>
                    <td className="py-2 text-right font-medium text-foreground tabular-nums">
                      {n != null ? formatARS(n) : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-2xl font-semibold text-foreground tabular-nums">
          {valorSimple(ultimo)}
        </p>
      )}

      <div className="flex flex-wrap gap-4 mt-4 text-xs">
        {ultimo.fuenteUrl && (
          <a
            href={ultimo.fuenteUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-primary hover:underline"
          >
            <ExternalLink className="h-3 w-3" /> Ver fuente oficial
          </a>
        )}
        <Link href="/informacion/valores-de-referencia" className="text-primary hover:underline">
          Ver histórico completo →
        </Link>
      </div>
    </div>
  );
}

/** Tabla histórica completa de un indicador — para la página de valores. */
export function HistoricoTabla({
  indicador,
  valores,
}: {
  indicador: IndicadorReferencia;
  valores: ValorReferencia[];
}) {
  if (valores.length === 0) return null;
  const esCanasta = indicador === "CANASTA_CRIANZA";

  return (
    <div className="overflow-x-auto rounded-xl border border-border/60">
      <table className="w-full text-sm">
        <thead className="bg-secondary/40">
          <tr className="text-left text-xs uppercase tracking-wide text-muted-foreground">
            <th className="py-2.5 px-4 font-medium">Período</th>
            {esCanasta ? (
              CANASTA_TRAMOS.map((t) => (
                <th key={t.key} className="py-2.5 px-4 font-medium text-right whitespace-nowrap">
                  {t.label}
                </th>
              ))
            ) : (
              <th className="py-2.5 px-4 font-medium text-right">Valor</th>
            )}
            <th className="py-2.5 px-4 font-medium">Fuente</th>
          </tr>
        </thead>
        <tbody>
          {valores.map((v) => (
            <tr key={v.id} className="border-t border-border/50">
              <td className="py-2.5 px-4 font-medium text-foreground whitespace-nowrap">
                {formatPeriodo(v.periodo)}
              </td>
              {esCanasta ? (
                CANASTA_TRAMOS.map((t) => {
                  const n = leerValor(v.valores, t.key);
                  return (
                    <td key={t.key} className="py-2.5 px-4 text-right tabular-nums">
                      {n != null ? formatARS(n) : "—"}
                    </td>
                  );
                })
              ) : (
                <td className="py-2.5 px-4 text-right tabular-nums font-medium">
                  {valorSimple(v)}
                </td>
              )}
              <td className="py-2.5 px-4 text-xs text-muted-foreground">
                {v.fuenteUrl ? (
                  <a
                    href={v.fuenteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {v.fuente}
                  </a>
                ) : (
                  v.fuente
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
