import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const { pathname } = req.nextUrl;

  // Rutas que requieren autenticación
  const protectedRoutes = ["/panel"];

  // Verificar si la ruta actual requiere autenticación
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !req.auth) {
    // Redirigir al login si no está autenticado
    const loginUrl = new URL("/auth/login", req.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Si está autenticado e intenta acceder al login, redirigir al panel
  if (pathname.startsWith("/auth/login") && req.auth) {
    return NextResponse.redirect(new URL("/panel", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/panel/:path*", "/auth/:path*"],
};
