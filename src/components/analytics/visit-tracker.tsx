"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/** Envía un ping a /api/track en cada cambio de página (registro propio). */
export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const payload = JSON.stringify({ path: pathname, referrer: document.referrer });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/track", payload);
      } else {
        void fetch("/api/track", { method: "POST", body: payload, keepalive: true });
      }
    } catch {
      // el tracking nunca debe afectar la navegación
    }
  }, [pathname]);

  return null;
}
