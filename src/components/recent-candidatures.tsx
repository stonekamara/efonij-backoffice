"use client";

import Link from "next/link";
import { Badge } from "@/components/ui";
import { STATUT_CANDIDATURE, type CandidatureStatut } from "@/lib/types";
import { dateHeureFr } from "@/lib/format";

export type CandidatureRecente = {
  id: string;
  statut: CandidatureStatut;
  created_at: string;
  offre_id: string;
  profiles?:
    | Array<{
        prenom: string;
        nom: string;
        matricule: string | null;
        avatar_url: string | null;
      }>
    | {
        prenom: string;
        nom: string;
        matricule: string | null;
        avatar_url: string | null;
      }
    | null;
  offres?: { titre: string } | Array<{ titre: string }> | null;
};

const statusColor: Record<CandidatureStatut, "slate" | "green" | "red"> = {
  en_attente: "slate",
  acceptee: "green",
  refusee: "red",
};

export default function RecentCandidatures({
  candidatures,
}: {
  candidatures: CandidatureRecente[];
}) {
  if (candidatures.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-slate-200 px-4 py-6 text-center text-sm text-slate-400">
        Aucune candidature pour le moment. Publiez une offre pour en recevoir !
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {candidatures.map((r) => {
        const profile = Array.isArray(r.profiles) ? r.profiles[0] : r.profiles;
        const offre = Array.isArray(r.offres) ? r.offres[0] : r.offres;
        const initiales = profile
          ? `${profile.prenom.charAt(0)}${profile.nom.charAt(0)}`.toUpperCase()
          : "?";
        return (
          <Link
            key={r.id}
            href={`/offres/${r.offre_id}/candidatures`}
            className="flex items-center gap-3 rounded-xl border border-slate-100 px-3 py-2.5 transition hover:border-fonij hover:bg-fonij/5"
          >
            <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-fonij/10">
              <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-fonij">
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
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-bold text-slate-800">
                {profile ? `${profile.prenom} ${profile.nom}` : "Profil supprimé"}
              </p>
              <p className="truncate text-xs text-slate-400">
                {offre?.titre ?? "Offre supprimée"} · {dateHeureFr(r.created_at)}
              </p>
            </div>
            <Badge color={statusColor[r.statut]}>
              {STATUT_CANDIDATURE[r.statut]}
            </Badge>
          </Link>
        );
      })}
    </div>
  );
}
