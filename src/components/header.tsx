"use client";

import { logout } from "@/app/actions";

export default function Header({
  orgName,
  orgType,
  email,
}: {
  orgName: string;
  orgType: string;
  email: string;
}) {
  const typeLabel =
    orgType === "fonij"
      ? "Administration FONIJ"
      : orgType === "entreprise"
        ? "Entreprise"
        : "Structure partenaire";

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/90 px-6 py-3.5 backdrop-blur">
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-fonij/10 font-black text-fonij">
          {orgName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-extrabold text-slate-900">{orgName}</p>
          <p className="text-xs text-slate-500">{typeLabel}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <span className="hidden text-sm text-slate-500 sm:block">{email}</span>
        <form action={logout}>
          <button
            type="submit"
            className="rounded-xl border border-slate-300 px-3.5 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            Se déconnecter
          </button>
        </form>
      </div>
    </header>
  );
}
