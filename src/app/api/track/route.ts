import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import type { DispositivoVisita } from "@prisma/client";
import { detectarDispositivo, esBot, detectarFuente } from "@/lib/visitas";

function decode(v: string | null): string | null {
  if (!v) return null;
  try {
    return decodeURIComponent(v);
  } catch {
    return v;
  }
}

// Registro de visitas propio. NO guarda IP: sólo la localidad derivada por
// Vercel (headers x-vercel-ip-*), el dispositivo (User-Agent) y la fuente.
export async function POST(request: NextRequest) {
  const organizacionId = process.env.DEFAULT_ORGANIZATION_ID;
  if (!organizacionId) return NextResponse.json({ ok: false });

  const ua = request.headers.get("user-agent") ?? "";
  if (esBot(ua)) return NextResponse.json({ ok: true, skipped: "bot" });

  let path = "/";
  let referrer = "";
  try {
    const body = JSON.parse(await request.text());
    if (typeof body.path === "string") path = body.path.slice(0, 512);
    if (typeof body.referrer === "string") referrer = body.referrer;
  } catch {
    // payload inválido → se ignora
  }

  // Sólo páginas públicas (no panel/api/auth)
  if (path.startsWith("/panel") || path.startsWith("/api") || path.startsWith("/auth")) {
    return NextResponse.json({ ok: true, skipped: "no-public" });
  }

  try {
    await prisma.visitaSitio.create({
      data: {
        organizacionId,
        path,
        dispositivo: detectarDispositivo(ua) as DispositivoVisita,
        ciudad: decode(request.headers.get("x-vercel-ip-city")),
        region: request.headers.get("x-vercel-ip-country-region"),
        pais: request.headers.get("x-vercel-ip-country"),
        fuente: detectarFuente(referrer),
      },
    });
  } catch {
    // Nunca romper la navegación por un fallo de tracking
  }

  return NextResponse.json({ ok: true });
}
