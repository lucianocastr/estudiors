"use client";

import { useState } from "react";
import { guardarValorReferencia } from "@/app/panel/valores/actions";
import { Button } from "@/components/ui/button";
import { INDICADORES, CANASTA_TRAMOS, getIndicadorConfig } from "@/lib/valores-referencia";
import type { IndicadorReferencia } from "@prisma/client";

const inputCls = "w-full text-sm border rounded-md px-3 py-2 bg-background";
const labelCls = "text-xs text-muted-foreground uppercase tracking-wide block mb-1.5";

export function ValorReferenciaForm() {
  const [indicador, setIndicador] = useState<IndicadorReferencia>("CANASTA_CRIANZA");
  const cfg = getIndicadorConfig(indicador);
  const [fuente, setFuente] = useState(cfg.fuente);
  const [fuenteUrl, setFuenteUrl] = useState(cfg.fuenteUrl);

  function onIndicadorChange(v: IndicadorReferencia) {
    setIndicador(v);
    const c = getIndicadorConfig(v);
    setFuente(c.fuente);
    setFuenteUrl(c.fuenteUrl);
  }

  return (
    <form action={guardarValorReferencia} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className={labelCls}>Indicador</label>
          <select
            name="indicador"
            value={indicador}
            onChange={(e) => onIndicadorChange(e.target.value as IndicadorReferencia)}
            className={inputCls}
          >
            {INDICADORES.map((i) => (
              <option key={i.value} value={i.value}>
                {i.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelCls}>Período (mes)</label>
          <input type="month" name="periodo" required className={inputCls} />
        </div>
      </div>

      {/* Valores — dependen del indicador */}
      {indicador === "CANASTA_CRIANZA" ? (
        <div>
          <label className={labelCls}>Valores por tramo de edad (ARS)</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {CANASTA_TRAMOS.map((t) => (
              <div key={t.key}>
                <span className="text-[11px] text-muted-foreground block mb-1">{t.label}</span>
                <input
                  type="number"
                  name={`valor_${t.key}`}
                  min="0"
                  step="1"
                  placeholder="0"
                  className={inputCls}
                />
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="sm:max-w-xs">
          <label className={labelCls}>Valor (ARS)</label>
          <input type="number" name="valor" min="0" step="1" placeholder="0" className={inputCls} />
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className={labelCls}>Vigente desde</label>
          <input type="date" name="vigenteDesde" required className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>Fuente</label>
          <input
            type="text"
            name="fuente"
            value={fuente}
            onChange={(e) => setFuente(e.target.value)}
            className={inputCls}
          />
        </div>
        <div>
          <label className={labelCls}>Link de la fuente</label>
          <input
            type="url"
            name="fuenteUrl"
            value={fuenteUrl}
            onChange={(e) => setFuenteUrl(e.target.value)}
            className={inputCls}
          />
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Si cargás un período que ya existe, se actualiza (no se duplica).
      </p>

      <div className="flex justify-end">
        <Button type="submit">Guardar valor</Button>
      </div>
    </form>
  );
}
