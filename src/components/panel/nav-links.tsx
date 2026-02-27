"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, MessageSquare, Calendar, Briefcase } from "lucide-react";

const NAV_ITEMS = [
  { href: "/panel",                label: "Dashboard",        icon: LayoutDashboard },
  { href: "/panel/consultas",      label: "Consultas",        icon: MessageSquare },
  { href: "/panel/turnos",         label: "Turnos",           icon: Calendar },
  { href: "/panel/reestructuracion", label: "Reestructuración", icon: Briefcase },
] as const;

function isActive(pathname: string, href: string): boolean {
  return href === "/panel" ? pathname === "/panel" : pathname.startsWith(href);
}

export function SidebarNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
              active
                ? "bg-primary/10 text-primary"
                : "text-gray-700 hover:bg-gray-100"
            }`}
          >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {label}
          </Link>
        );
      })}
    </>
  );
}

export function MobileNavLinks() {
  const pathname = usePathname();

  return (
    <>
      {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
        const active = isActive(pathname, href);
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-1 p-2 transition-colors ${
              active ? "text-primary" : "text-gray-500"
            }`}
          >
            <Icon className={`h-5 w-5 ${active ? "stroke-[2.5]" : ""}`} />
            <span className={`text-xs ${active ? "font-semibold" : ""}`}>
              {label}
            </span>
          </Link>
        );
      })}
    </>
  );
}
