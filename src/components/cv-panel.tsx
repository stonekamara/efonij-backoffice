"use client";

import { useState } from "react";
import type { Candidature, CandidatureStatut, CvSnapshot } from "@/lib/types";
import { NIVEAU_LANGUE, STATUT_CANDIDATURE } from "@/lib/types";
import { dateHeureFr } from "@/lib/format";
import { Badge } from "@/components/ui";
import CandidatureActions from "@/components/candidature-actions";

function SectionTitle({ children }: { children: string }) {
  return (
    <h4 className="mb-2 text-[11px] font-extrabold uppercase tracking-wider text-fonij">
      {children}
    </h4>
  );
}

export function CvSections({ cv }: { cv: CvSnapshot }) {
  return (
    <div className="space-y-5">
      {cv.resume ? (
        <div>
          <SectionTitle>Résumé</SectionTitle>
          <p className="text-sm leading-relaxed text-slate-700">{cv.resume}</p>
        </div>
      ) : null}

      {cv.formations && cv.formations.length > 0 ? (
        <div>
          <SectionTitle>Formations</SectionTitle>
          <ul className="space-y-2.5">
            {cv.formations.map((f, i) => (
              <li key={i} className="flex items-start justify-between gap-3 text-sm">
                <div>
                  <p className="font-bold text-slate-800">{f.diplome}</p>
                  {f.etablissement ? (
                    <p className="text-xs text-slate-500">{f.etablissement}</p>
                  ) : null}
                </div>
                {f.annee_debut || f.annee_fin ? (
                  <span className="shrink-0 rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
                    {f.annee_debut ?? "·"} → {f.annee_fin ?? "auj."}
                  </span>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {cv.experiences && cv.experiences.length > 0 ? (
        <div>
          <SectionTitle>Expériences</SectionTitle>
          <ul className="space-y-3">
            {cv.experiences.map((e, i) => (
              <li key={i} className="text-sm">
                <p className="font-bold text-slate-800">{e.poste}</p>
                {e.organisation ? (
                  <p className="text-xs font-semibold text-slate-500">{e.organisation}</p>
                ) : null}
                {e.date_debut || e.date_fin ? (
                  <p className="text-xs text-slate-400">
                    {e.date_debut ?? "·"} → {e.date_fin ?? "aujourd'hui"}
                  </p>
                ) : null}
                {e.description ? (
                  <p className="mt-1 leading-relaxed text-slate-600">{e.description}</p>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {cv.competences && cv.competences.length > 0 ? (
        <div>
          <SectionTitle>Compétences</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {cv.competences.map((c, i) => (
              <span
                key={i}
                className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-semibold text-teal-800"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      ) : null}

      {cv.langues && cv.langues.length > 0 ? (
        <div>
          <SectionTitle>Langues</SectionTitle>
          <ul className="space-y-1.5">
            {cv.langues.map((l, i) => (
              <li key={i} className="flex items-center justify-between text-sm">
                <span className="font-semibold text-slate-700">{l.langue}</span>
                <span className="text-xs text-slate-500">
                  {l.niveau ? (NIVEAU_LANGUE[l.niveau] ?? l.niveau) : ""}
                </span>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export default function CvPanel({
  candidature,
  onClose,
}: {
  candidature: Candidature;
  onClose: () => void;
}) {
  const cv = candidature.cv_snapshot;
  const profile = candidature.profiles;
  // État local : le statut se met à jour immédiatement dans le panneau,
  // sans attendre le refresh de la liste.
  const [statut, setStatut] = useState<CandidatureStatut>(candidature.statut);
  const [reviewedAt, setReviewedAt] = useState<string | null>(
    candidature.reviewed_at,
  );

  function onChanged(next: CandidatureStatut) {
    setStatut(next);
    setReviewedAt(new Date().toISOString());
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* En-tête */}
        <div className="sticky top-0 z-10 border-b border-slate-100 bg-white/95 px-6 py-4 backdrop-blur">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2.5">
                <h3 className="text-lg font-extrabold text-slate-900">
                  {cv?.nom_complet ?? (profile ? `${profile.prenom} ${profile.nom}` : "CV")}
                </h3>
                <Badge
                  color={
                    statut === "acceptee"
                      ? "green"
                      : statut === "refusee"
                        ? "red"
                        : "slate"
                  }
                >
                  {STATUT_CANDIDATURE[statut]}
                </Badge>
              </div>
              <p className="mt-0.5 text-sm font-semibold text-fonij">
                {cv?.titre_poste ?? "CV"}
              </p>
              {reviewedAt ? (
                <p className="mt-1 text-xs text-slate-400">
                  Relue le {dateHeureFr(reviewedAt)}
                </p>
              ) : null}
              {profile && (profile.email || profile.telephone) ? (
                <p className="mt-1 flex flex-wrap gap-x-4 text-xs font-medium text-slate-500">
                  {profile.email ? <span>✉️ {profile.email}</span> : null}
                  {profile.telephone ? <span>📞 {profile.telephone}</span> : null}
                </p>
              ) : null}
            </div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-slate-100 p-2 text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
              aria-label="Fermer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Contenu */}
        <div className="px-6 py-5">
          {cv ? (
            <CvSections cv={cv} />
          ) : (
            <p className="rounded-xl bg-slate-50 px-4 py-6 text-center text-sm text-slate-500">
              Aucun CV joint à cette candidature.
            </p>
          )}

          {/* Actions */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-5">
            <div className="flex flex-wrap gap-2">
              <CandidatureActions
                candidatureId={candidature.id}
                statut={statut}
                onChanged={onChanged}
              />
            </div>
            {candidature.cv_pdf_url ? (
              <a
                href={candidature.cv_pdf_url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-xl bg-fonij px-4 py-2.5 text-sm font-bold text-white transition hover:bg-fonij-dark"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <path d="M7 10l5 5 5-5" />
                  <path d="M12 15V3" />
                </svg>
                Télécharger en PDF
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
