"use client";

import { useState } from "react";
import { traiterDemande } from "@/app/actions";
import { Badge, Button } from "@/components/ui";

type DemandeRow = {
  id: string;
  nom: string;
  type: "structure" | "entreprise" | "fonij";
  contact: string | null;
  statut: "en_attente" | "active" | "refusee";
  created_at?: string;
  membres?: Array<{ user_id: string; role: string }>;
};

const typeLabel: Record<DemandeRow["type"], string> = {
  structure: "Structure",
  entreprise: "Entreprise",
  fonij: "FONIJ",
};

const statutBadge: Record<
  DemandeRow["statut"],
  { label: string; color: "amber" | "green" | "red" }
> = {
  en_attente: { label: "En attente", color: "amber" },
  active: { label: "Active", color: "green" },
  refusee: { label: "Refusée", color: "red" },
};

function formatDate(iso?: string) {
  if (!iso) return "·";
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function DemandesList({
  demandes,
}: {
  demandes: DemandeRow[];
}) {
  const [busyId, setBusyId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function handle(organisationId: string, statut: "active" | "refusee") {
    if (busyId) return;
    setBusyId(organisationId);
    setMessage(null);
    const res = await traiterDemande(organisationId, statut);
    setBusyId(null);
    if (res && "error" in res) {
      setMessage(res.error ?? "Erreur inconnue.");
      return;
    }
  }

  return (
    <div>
      {message ? (
        <div className="border-b border-red-200 bg-red-50 px-5 py-3 text-sm font-semibold text-red-700">
          {message}
        </div>
      ) : null}

      {demandes.map((d) => {
        const badge = statutBadge[d.statut];
        const pending = d.statut === "en_attente";
        return (
          <div
            key={d.id}
            className={`flex flex-wrap items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0 ${
              pending ? "bg-amber-50/40" : ""
            }`}
          >
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fonij/10 text-lg">
              {d.type === "entreprise" ? "🏢" : "🏛️"}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-bold text-slate-900">{d.nom}</p>
                <Badge color="slate">{typeLabel[d.type]}</Badge>
                <Badge color={badge.color}>{badge.label}</Badge>
              </div>
              <p className="mt-0.5 text-sm text-slate-500">
                {d.contact ? `${d.contact} · ` : ""}
                Demandé le {formatDate(d.created_at)}
                {d.membres?.length ? ` · ${d.membres.length} compte(s)` : ""}
              </p>
            </div>
            {pending ? (
              <div className="flex shrink-0 gap-2">
                <Button
                  variant="secondary"
                  disabled={busyId === d.id}
                  onClick={() => handle(d.id, "refusee")}
                >
                  Refuser
                </Button>
                <Button
                  disabled={busyId === d.id}
                  onClick={() => handle(d.id, "active")}
                >
                  {busyId === d.id ? "Traitement…" : "Approuver ✅"}
                </Button>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
