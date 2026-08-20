// Helpers puros para el registro de visitas (sin Prisma).
import type { DispositivoVisita } from "@prisma/client";

export function detectarDispositivo(ua: string): DispositivoVisita {
  const s = ua.toLowerCase();
  if (/ipad|tablet|playbook|silk/.test(s) || (/android/.test(s) && !/mobile/.test(s)))
    return "TABLET";
  if (/mobi|iphone|ipod|android.*mobile|windows phone/.test(s)) return "MOVIL";
  if (/windows|macintosh|mac os|linux|cros/.test(s)) return "ESCRITORIO";
  return "OTRO";
}

export function esBot(ua: string): boolean {
  if (!ua) return true;
  return /bot|crawl|spider|slurp|bingpreview|facebookexternalhit|whatsapp|telegrambot|preview|monitor|headless|lighthouse|pingdom|gtmetrix|semrush|ahrefs|python-requests|curl|wget|axios|node-fetch|vercel/i.test(
    ua
  );
}

export function detectarFuente(referrer: string): string {
  if (!referrer) return "directo";
  try {
    const host = new URL(referrer).hostname.replace(/^www\./, "").toLowerCase();
    if (host.includes("rsestudiojuridico")) return "directo"; // navegación interna
    if (host.includes("google")) return "google";
    if (host.includes("instagram")) return "instagram";
    if (host.includes("facebook") || host.startsWith("fb.") || host.includes("fb.me"))
      return "facebook";
    if (host.includes("whatsapp") || host.includes("wa.me")) return "whatsapp";
    if (host.includes("bing")) return "bing";
    return host;
  } catch {
    return "directo";
  }
}

export const DISPOSITIVO_LABELS: Record<DispositivoVisita, string> = {
  MOVIL: "Móvil",
  ESCRITORIO: "Escritorio",
  TABLET: "Tablet",
  OTRO: "Otro",
};

export function labelFuente(f: string | null): string {
  if (!f) return "Directo";
  const map: Record<string, string> = {
    directo: "Directo",
    google: "Google",
    instagram: "Instagram",
    facebook: "Facebook",
    whatsapp: "WhatsApp",
    bing: "Bing",
  };
  return map[f] ?? f;
}
