"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Profile } from "@/lib/types";
import { Badge, Card, EmptyState } from "@/components/ui";

type Jeune = Profile & { nb_candidatures: number };

export default function JeunesList({ jeunes }: { jeunes: Jeune[] }) {
  const [q, setQ] = useState("");

  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return jeunes;
    return jeunes.filter(
      (j) =>
        j.prenom.toLowerCase().includes(query) ||
        j.nom.toLowerCase().includes(query) ||
        `${j.prenom} ${j.nom}`.toLowerCase().includes(query) ||
        (j.matricule ?? "").toLowerCase().includes(query),
    );
  }, [jeunes, q]);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <div className="relative w-full max-w-sm">
          <svg
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Rechercher un jeune (nom, matricule)…"
            className="w-full rounded-xl border border-slate-300 bg-white py-2.5 pl-10 pr-4 text-sm font-semibold text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-fonij focus:ring-2 focus:ring-fonij/20"
          />
        </div>
        <span className="text-sm font-semibold text-slate-500">
          {filtered.length} jeune{filtered.length > 1 ? "s" : ""}
        </span>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon="🔎"
          title="Aucun jeune trouvé"
          message="Modifiez votre recherche ou revenez plus tard."
        />
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((j) => (
            <Link key={j.id} href={`/jeunes/${j.id}`} className="block">
              <Card className="h-full p-5 transition hover:-translate-y-0.5 hover:shadow-md">
                <div className="flex items-center gap-3.5">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-fonij/10 text-base font-black text-fonij">
                    {`${j.prenom.charAt(0)}${j.nom.charAt(0)}`.toUpperCase()}
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-extrabold text-slate-900">
                      {j.prenom} {j.nom}
                    </p>
                    <p className="text-xs font-semibold text-slate-500">
                      {j.matricule ?? "Matricule indisponible"}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Badge color="green">Niveau {j.niveau_passeport}</Badge>
                  <Badge color="slate">
                    {j.nb_candidatures} candidature{j.nb_candidatures > 1 ? "s" : ""}
                  </Badge>
                </div>
                <p className="mt-3 text-[11px] text-slate-400">
                  Inscrit{j.created_at ? ` le ${new Date(j.created_at).toLocaleDateString("fr-FR")}` : ""}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
