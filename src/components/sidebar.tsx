"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/tableau-de-bord", label: "Tableau de bord", icon: "📊" },
  { href: "/offres", label: "Offres", icon: "💼" },
  { href: "/publications", label: "Publications", icon: "📣" },
  { href: "/scan", label: "Scan QR", icon: "📷" },
];

const adminLinks = [
  { href: "/structures", label: "Structures", icon: "🏢" },
  { href: "/demandes", label: "Demandes", icon: "📋" },
  { href: "/jeunes", label: "Jeunes", icon: "👥" },
  { href: "/communautes", label: "Communautés", icon: "🌍" },
  { href: "/notifications", label: "Notifications", icon: "🔔" },
];

export default function Sidebar({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-fonij-dark text-white">
      <div className="flex items-center gap-3 px-5 py-6">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-fonij-accent text-lg font-black text-fonij-dark">
          E
        </div>
        <div>
          <p className="text-base font-extrabold leading-tight">E-FONIJ</p>
          <p className="text-xs text-white/60">Back-office</p>
        </div>
      </div>

      <nav className="flex-1 space-y-1 px-3">
        {links.map((link) => {
          const active =
            link.href === "/tableau-de-bord"
              ? pathname === "/tableau-de-bord"
              : pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                active
                  ? "bg-white/15 text-white"
                  : "text-white/70 hover:bg-white/10 hover:text-white"
              }`}
            >
              <span className="text-base">{link.icon}</span>
              {link.label}
            </Link>
          );
        })}
        {isAdmin ? (
          <>
            <div className="px-3.5 pb-1 pt-4 text-[10px] font-extrabold uppercase tracking-wider text-white/40">
              Administration
            </div>
            {adminLinks.map((link) => {
              const active = pathname.startsWith(link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition ${
                    active
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  <span className="text-base">{link.icon}</span>
                  {link.label}
                </Link>
              );
            })}
          </>
        ) : null}
      </nav>

      <div className="px-5 py-4 text-[11px] leading-relaxed text-white/40">
        Plateforme E-FONIJ · Passeport Jeune
      </div>
    </aside>
  );
}
