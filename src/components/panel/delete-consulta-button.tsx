"use client";

import { useState, useTransition } from "react";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { eliminarConsulta } from "@/app/panel/consultas/[id]/actions";

interface DeleteConsultaButtonProps {
  consultaId: string;
  /** Muestra solo el ícono sin texto (para listados compactos) */
  iconOnly?: boolean;
}

export function DeleteConsultaButton({
  consultaId,
  iconOnly = false,
}: DeleteConsultaButtonProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  function handleDelete() {
    startTransition(async () => {
      await eliminarConsulta(consultaId);
    });
  }

  return (
    <>
      <Button
        variant="ghost"
        size="sm"
        className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
        onClick={() => setOpen(true)}
        title="Eliminar consulta"
      >
        <Trash2 className="h-4 w-4" />
        {!iconOnly && <span className="ml-1.5">Eliminar</span>}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Eliminar consulta</DialogTitle>
            <DialogDescription>
              ¿Estás segura de que querés eliminar esta consulta? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isPending}
            >
              {isPending ? "Eliminando..." : "Eliminar"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
