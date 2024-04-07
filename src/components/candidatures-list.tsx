"use client";

import { useMemo, useState } from "react";
import type { Candidature, CandidatureStatut } from "@/lib/types";
import { PILIERS, STATUT_CANDIDATURE } from "@/lib/types";
import { dateHeureFr } from "@/lib/format";
import { Badge, Card, EmptyState } from "@/components/ui";
import CvPanel from "@/components/cv-panel";

const FILTRES: Array<{ value: CandidatureStatut | "toutes"; label: string }> = [
  { value: "en_attente", label: "En attente" },
  { value: "acceptee", label: "Acceptées" },
  { value: "refusee", label: "Refusées" },
  { value: "toutes", label: "Toutes" },
];

const statusColor: Record<CandidatureStatut, "slate" | "green" | "red" | "amber"> = {
  en_attente: "slate",
  acceptee: "green",
  refusee: "red",
};

export default function CandidaturesList({
  candidatures,
}: {
  candidatures: Candidature[];
}) {
  const [filtre, setFiltre] = useState<CandidatureStatut | "toutes">("en_attente");
  const [selected, setSelected] = useState<Candidature | null>(null);

  const liste = useMemo(
    () =>
      filtre === "toutes"
        ? candidatures
        : candidatures.filter((c) => c.statut === filtre),
    [candidatures, filtre],
  );

  const compteurs = useMemo(() => {
    const c: Record<string, number> = { toutes: candidatures.length };
    for (const f of FILTRES) {
      if (f.value === "toutes") continue;
      c[f.value] = candidatures.filter((x) => x.statut === f.value).length;
    }
    return c;
  }, [candidatures]);

  return (
    <>
      {/* Filtres par statut */}
      <div className="mb-5 flex flex-wrap gap-2">
        {FILTRES.map((f) => {
          const active = filtre === f.value;
          return (
            <button
              key={f.value}
              type="button"
              onClick={() => setFiltre(f.value)}
              className={`rounded-full border px-4 py-2 text-xs font-bold transition ${
                active
                  ? "border-fonij bg-fonij text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50"
              }`}
            >
              {f.label}
              <span
                className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] ${
                  active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"
                }`}
              >
                {compteurs[f.value] ?? 0}
              </span>
            </button>
          );
        })}
      </div>

      {liste.length === 0 ? (
        <EmptyState
          icon="📭"
          title={
            filtre === "toutes"
              ? "Aucune candidature"
              : "Aucune candidature en attente"
          }
          message={
            filtre === "toutes"
              ? "Aucun jeune n'a encore postulé à cette offre."
              : "Aucune candidature ne correspond à ce filtre."
          }
        />
      ) : (
        <div className="space-y-3">
          {liste.map((c) => {
            const profile = c.profiles;
            const initiales = profile
              ? `${profile.prenom.charAt(0)}${profile.nom.charAt(0)}`.toUpperCase()
              : "?";
            return (
              <Card key={c.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-4">
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-fonij/10">
                      <div className="absolute inset-0 flex items-center justify-center text-sm font-black text-fonij">
                        {initiales}
                      </div>
                      {profile?.avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={profile.avatar_url}
                          alt={`${profile.prenom} ${profile.nom}`}
                          className="absolute inset-0 h-full w-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = "none";
                          }}
                        />
                      ) : null}
                    </div>
                    <div>
                      <p className="text-sm font-extrabold text-slate-900">
                        {profile ? `${profile.prenom} ${profile.nom}` : "Profil supprimé"}
                      </p>
                      <p className="text-xs font-semibold text-slate-500">
                        {profile?.matricule ?? "Matricule indisponible"}
                        {profile ? ` · Niveau ${profile.niveau_passeport}` : ""}
                        {profile?.points != null
                          ? ` · ${profile.points} pts`
                          : ""}
                        {profile?.pilier
                          ? ` · Pilier ${PILIERS[profile.pilier] ?? profile.pilier}`
                          : ""}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {c.cv_snapshot ? (
                      <button
                        type="button"
                        onClick={() => setSelected(c)}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-fonij/30 bg-fonij/5 px-3.5 py-2 text-xs font-bold text-fonij transition hover:bg-fonij/10"
                      >
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                          <path d="M14 2v6h6" />
                        </svg>
                        Voir le CV
                      </button>
                    ) : null}
                    <Badge color={statusColor[c.statut]}>
                      {STATUT_CANDIDATURE[c.statut]}
                    </Badge>
                  </div>
                </div>

                {profile &&
                (profile.email || profile.telephone || profile.region) ? (
                  <div className="mt-3 grid gap-x-5 gap-y-1.5 rounded-xl border border-slate-100 bg-slate-50 px-4 py-3 text-xs font-medium text-slate-600 sm:grid-cols-2 lg:grid-cols-3">
                    {profile.email ? (
                      <span className="flex items-center gap-1.5 truncate">
                        <span aria-hidden>✉️</span> {profile.email}
                      </span>
                    ) : null}
                    {profile.telephone ? (
                      <span className="flex items-center gap-1.5">
                        <span aria-hidden>📞</span> {profile.telephone}
                      </span>
                    ) : null}
                    {profile.region ? (
                      <span className="flex items-center gap-1.5">
                        <span aria-hidden>📍</span> {profile.region}
                      </span>
                    ) : null}
                  </div>
                ) : null}

                <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-400">
                    Postulée le {dateHeureFr(c.created_at)}
                    {c.reviewed_at
                      ? ` · Relue le ${dateHeureFr(c.reviewed_at)}`
                      : ""}
                  </p>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selected ? (
        <CvPanel candidature={selected} onClose={() => setSelected(null)} />
      ) : null}
    </>
  );
}
