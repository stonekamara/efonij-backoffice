"use client";

import { useState } from "react";
import Link from "next/link";
import { deleteOffre } from "@/app/actions";
import type { Offre, OrganisationLite } from "@/lib/types";
import { OFFRE_TYPES, PILIERS } from "@/lib/types";
import { dateFr } from "@/lib/format";
import { Badge, Button, Card, EmptyState, Select } from "@/components/ui";

export default function OffresList({
  offres,
  organisations,
  isAdmin,
}: {
  offres: Offre[];
  organisations: OrganisationLite[];
  isAdmin: boolean;
}) {
  const [orgFilter, setOrgFilter] = useState("all");
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered =
    isAdmin && orgFilter !== "all"
      ? offres.filter((o) => o.structure_id === orgFilter)
      : offres;

  async function handleDelete(id: string) {
    if (!window.confirm("Supprimer définitivement cette offre ?")) return;
    setDeleting(id);
    await deleteOffre(id);
    setDeleting(null);
  }

  return (
    <div>
      {isAdmin && (
        <div className="mb-4 max-w-xs">
          <Select
            value={orgFilter}
            onChange={(e) => setOrgFilter(e.target.value)}
            aria-label="Filtrer par organisation"
          >
            <option value="all">Toutes les organisations</option>
            {organisations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nom}
              </option>
            ))}
          </Select>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon="💼"
          title="Aucune offre"
          message="Créez votre première offre pour attirer de jeunes candidats."
        />
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filtered.map((offre) => (
            <Card key={offre.id} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900">
                    {offre.titre}
                  </h3>
                  <p className="mt-0.5 text-xs font-semibold text-slate-500">
                    {offre.organisations?.nom ?? "Organisation inconnue"}
                  </p>
                </div>
                <Badge color={offre.statut === "ouverte" ? "green" : "slate"}>
                  {offre.statut === "ouverte" ? "Ouverte" : "Fermée"}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap gap-1.5">
                <Badge color="fonij">
                  {OFFRE_TYPES[offre.type] ?? offre.type}
                </Badge>
                {offre.pilier ? (
                  <Badge>{PILIERS[offre.pilier] ?? offre.pilier}</Badge>
                ) : null}
                {offre.lieu ? <Badge>📍 {offre.lieu}</Badge> : null}
              </div>

              {offre.description ? (
                <p className="mt-3 line-clamp-2 text-sm text-slate-500">
                  {offre.description}
                </p>
              ) : null}

              <div className="mt-3 text-xs font-medium text-slate-400">
                Limite : {dateFr(offre.date_limite)}
              </div>

              <div className="mt-4 flex flex-wrap gap-2 border-t border-slate-100 pt-4">
                <Link
                  href={`/offres/${offre.id}/candidatures`}
                  className="rounded-xl bg-fonij/10 px-3.5 py-2 text-xs font-bold text-fonij transition hover:bg-fonij/20"
                >
                  Candidatures reçues
                </Link>
                <Link
                  href={`/offres/${offre.id}`}
                  className="rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Modifier
                </Link>
                <Button
                  variant="danger"
                  className="ml-auto px-3.5 py-2 text-xs"
                  onClick={() => handleDelete(offre.id)}
                  disabled={deleting === offre.id}
                >
                  {deleting === offre.id ? "…" : "Supprimer"}
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
