"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

const links = [
  { href: "#produits", label: "Passeport" },
  { href: "#comment-ca-marche", label: "Comment ça marche" },
  { href: "#partenaires", label: "Partenaires" },
];

export default function LandingNav() {
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:px-6 lg:h-[72px]">
        {/* Logo */}
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          <Image
            src="/logo_efonij.png"
            alt="Logo E-FONIJ"
            width={36}
            height={36}
            className="h-8 w-8 rounded-full object-cover ring-2 ring-fonij/60 lg:h-9 lg:w-9"
          />
          <span className="text-lg font-bold tracking-tight text-ink">E-FONIJ</span>
        </Link>

        {/* Liens en pilules (desktop) */}
        <div className="hidden items-center gap-1 lg:flex">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="rounded-full px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 hover:text-ink"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* CTA pilule noire (desktop) */}
        <div className="hidden shrink-0 lg:block">
          <Link
            href="/demande-inscription"
            className="inline-flex items-center rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-fonij-dark active:scale-95"
          >
            Demander l&apos;accès
          </Link>
        </div>

        {/* Bouton menu mobile */}
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-label="Menu"
          aria-expanded={open}
          className="flex h-10 w-10 items-center justify-center rounded-full text-ink transition hover:bg-slate-100 lg:hidden"
        >
          <svg
            width="22"
            height="22"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            {open ? (
              <>
                <path d="M6 6l12 12" />
                <path d="M18 6L6 18" />
              </>
            ) : (
              <>
                <path d="M3 6h18" />
                <path d="M3 12h18" />
                <path d="M3 18h18" />
              </>
            )}
          </svg>
        </button>
      </nav>

      {/* Menu mobile */}
      {open ? (
        <div className="border-t border-slate-200 bg-white px-4 pb-5 pt-3 lg:hidden">
          <div className="flex flex-col gap-1">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </div>
          <Link
            href="/demande-inscription"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-full bg-ink px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-fonij-dark"
          >
            Demander l&apos;accès
          </Link>
        </div>
      ) : null}
    </header>
  );
}
