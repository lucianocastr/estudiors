import { redirect } from "next/navigation";
import Link from "next/link";
import { auth, signOut } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import {
  Scale,
  LayoutDashboard,
  MessageSquare,
  Calendar,
  LogOut,
  Menu,
  User,
} from "lucide-react";

const navItems = [
  { href: "/panel", label: "Dashboard", icon: LayoutDashboard },
  { href: "/panel/consultas", label: "Consultas", icon: MessageSquare },
  { href: "/panel/turnos", label: "Turnos", icon: Calendar },
];

export default async function PanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b sticky top-0 z-40">
        <div className="flex items-center justify-between px-4 h-16">
          <div className="flex items-center gap-4">
            <button className="md:hidden p-2">
              <Menu className="h-5 w-5" />
            </button>
            <Link href="/panel" className="flex items-center gap-2">
              <Scale className="h-6 w-6 text-primary" />
              <span className="font-semibold hidden sm:inline">
                Panel de Gestión
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                <User className="h-4 w-4 text-primary" />
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{session.user.name}</p>
                <p className="text-xs text-muted-foreground">
                  {session.user.rol === "OWNER" || session.user.rol === "ADMIN"
                    ? "Administrador"
                    : session.user.rol === "ASISTENTE"
                    ? "Asistente"
                    : "Profesional"}
                </p>
              </div>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <Button variant="ghost" size="sm" type="submit">
                <LogOut className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Salir</span>
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className="hidden md:flex w-64 flex-col border-r bg-white min-h-[calc(100vh-4rem)]">
          <nav className="flex-1 p-4 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Link
              href="/"
              className="text-sm text-muted-foreground hover:text-primary"
            >
              ← Volver al sitio público
            </Link>
          </div>
        </aside>

        {/* Mobile navigation */}
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40">
          <nav className="flex justify-around p-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex flex-col items-center gap-1 p-2 text-gray-600"
                >
                  <Icon className="h-5 w-5" />
                  <span className="text-xs">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Main content */}
        <main className="flex-1 p-4 md:p-6 pb-20 md:pb-6">{children}</main>
      </div>
    </div>
  );
}
