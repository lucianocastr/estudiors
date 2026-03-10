"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";

interface ConfirmarTurnoFormProps {
  confirmarAction: (formData: FormData) => Promise<void>;
  rechazarAction: (formData: FormData) => Promise<void>;
  esVirtual: boolean;
}

function formatFecha(date: Date): string {
  const d = String(date.getDate()).padStart(2, "0");
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const y = date.getFullYear();
  return `${d}/${m}/${y}`;
}

function toDatetimeLocal(date: Date, hora: string): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}T${hora}`;
}

export function ConfirmarTurnoForm({
  confirmarAction,
  rechazarAction,
  esVirtual,
}: ConfirmarTurnoFormProps) {
  const [fecha, setFecha] = useState<Date | undefined>();
  const [hora, setHora] = useState("09:00");
  const [calendarOpen, setCalendarOpen] = useState(false);

  return (
    <div className="flex gap-3 pt-2 border-t">
      {/* Formulario confirmar */}
      <form action={confirmarAction} className="flex-1 space-y-2">
        <input
          type="hidden"
          name="fechaConfirmada"
          value={fecha ? toDatetimeLocal(fecha, hora) : ""}
        />

        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Fecha del turno
          </p>
          <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
            <PopoverTrigger asChild>
              <button
                type="button"
                className="w-full flex items-center gap-2 text-sm border rounded-md px-3 py-1.5 bg-background text-left hover:bg-secondary/50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/30"
              >
                <CalendarIcon className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                {fecha ? (
                  <span>{formatFecha(fecha)}</span>
                ) : (
                  <span className="text-muted-foreground">dd/mm/aaaa</span>
                )}
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={fecha}
                onSelect={(d) => {
                  setFecha(d);
                  setCalendarOpen(false);
                }}
                disabled={(d) => d < new Date(new Date().setHours(0, 0, 0, 0))}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="space-y-1.5">
          <p className="text-xs text-muted-foreground uppercase tracking-wide">
            Horario
          </p>
          <input
            type="time"
            value={hora}
            onChange={(e) => setHora(e.target.value)}
            className="w-full text-sm border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        </div>

        {esVirtual && (
          <input
            type="url"
            name="linkVideoCall"
            placeholder="Link de videollamada (opcional)"
            className="w-full text-sm border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
          />
        )}

        <Button
          type="submit"
          size="sm"
          className="w-full"
          disabled={!fecha}
        >
          Confirmar turno
        </Button>
      </form>

      {/* Formulario rechazar */}
      <form action={rechazarAction} className="w-40 space-y-2">
        <p className="text-xs text-muted-foreground uppercase tracking-wide">
          Rechazo
        </p>
        <input
          type="text"
          name="motivoRechazo"
          placeholder="Motivo (opcional)"
          className="w-full text-sm border rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
        />
        <Button type="submit" variant="destructive" size="sm" className="w-full">
          Rechazar
        </Button>
      </form>
    </div>
  );
}
