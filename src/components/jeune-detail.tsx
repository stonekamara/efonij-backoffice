"use client";

import { useState } from "react";
import Link from "next/link";
import type { Candidature, Profile } from "@/lib/types";
import { STATUT_CANDIDATURE } from "@/lib/types";
import { dateHeureFr } from "@/lib/format";
import { Badge, Card, EmptyState, PageHeader } from "@/components/ui";
import CvPanel from "@/components/cv-panel";
import NotifierJeune from "@/components/notifier-jeune";

const statusColor: Record<string, "slate" | "green" | "red" | "amber"> = {
  en_attente: "slate",
  acceptee: "green",
  refusee: "red",
};

export default function JeuneDetail({
  jeune,
  candidatures,
}: {
  jeune: Profile;
  candidatures: Candidature[];
}) {
  const [selected, setSelected] = useState<Candidature | null>(null);
  const [notifierOpen, setNotifierOpen] = useState(false);

  return (
    <div>
      <PageHeader
        title={`${jeune.prenom} ${jeune.nom}`}
        subtitle={jeune.matricule ?? "Matricule indisponible"}
        action={
          <Link
            href="/jeunes"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            ← Retour à la liste
          </Link>
        }
      />

      {/* En-tête profil */}
      <Card className="mb-6 p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-fonij/10 text-xl font-black text-fonij">
              {`${jeune.prenom.charAt(0)}${jeune.nom.charAt(0)}`.toUpperCase()}
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-900">
                {jeune.prenom} {jeune.nom}
              </p>
              <p className="text-sm text-slate-500">
                {jeune.email ?? "Email non renseigné"}
              </p>
              <div className="mt-1.5 flex flex-wrap gap-2">
                <Badge color="green">Niveau {jeune.niveau_passeport}</Badge>
                {jeune.created_at ? (
                  <Badge color="slate">
                    Inscrit le{" "}
                    {new Date(jeune.created_at).toLocaleDateString("fr-FR")}
                  </Badge>
                ) : null}
              </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setNotifierOpen(true)}
            className="inline-flex items-center gap-2 rounded-xl bg-fonij px-4 py-2.5 text-sm font-bold text-white transition hover:bg-fonij-dark"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
            Envoyer une notification
          </button>
        </div>
      </Card>

      {/* Candidatures */}
      <h3 className="mb-3 text-sm font-extrabold uppercase tracking-wider text-slate-500">
        Candidatures ({candidatures.length})
      </h3>

      {candidatures.length === 0 ? (
        <EmptyState
          icon="📭"
          title="Aucune candidature"
          message="Ce jeune n'a encore postulé à aucune offre."
        />
      ) : (
        <div className="space-y-3">
          {candidatures.map((c) => {
            const offre = Array.isArray(c.offres) ? c.offres[0] : c.offres;
            return (
              <Card key={c.id} className="p-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-extrabold text-slate-900">
                      {offre?.titre ?? "Offre supprimée"}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-500">
                      Postulée le {dateHeureFr(c.created_at)}
                      {c.reviewed_at
                        ? ` · Relue le ${dateHeureFr(c.reviewed_at)}`
                        : ""}
                    </p>
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
                    <Badge color={statusColor[c.statut] ?? "slate"}>
                      {STATUT_CANDIDATURE[c.statut] ?? c.statut}
                    </Badge>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selected ? (
        <CvPanel candidature={selected} onClose={() => setSelected(null)} />
      ) : null}

      {notifierOpen ? (
        <NotifierJeune
          jeuneNom={`${jeune.prenom} ${jeune.nom}`}
          userId={jeune.id}
          onClose={() => setNotifierOpen(false)}
        />
      ) : null}
    </div>
  );
}
