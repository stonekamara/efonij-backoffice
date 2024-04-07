"use client";

import { useState } from "react";
import { creerCommunaute, supprimerCommunaute } from "@/app/actions";
import { Button, Card, EmptyState, Field, Input, Select, TextArea } from "@/components/ui";

type CommunauteRow = {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  pilier: string | null;
  structure_id: string | null;
  created_at?: string;
};

type OrganisationRow = { id: string; nom: string; type: string };

export default function CommunautesAdmin({
  communautes,
  organisations,
  isAdmin,
}: {
  communautes: CommunauteRow[];
  organisations: OrganisationRow[];
  isAdmin: boolean;
}) {
  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [pilier, setPilier] = useState("");
  const [structureId, setStructureId] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.set("nom", nom);
    formData.set("description", description);
    formData.set("pilier", pilier);
    if (isAdmin) formData.set("structure_id", structureId);
    const res = await creerCommunaute(formData);
    setBusy(false);
    if (res && "error" in res) {
      setError(res.error ?? "Erreur inconnue.");
      return;
    }
    setNom("");
    setDescription("");
    setSuccess("Communauté créée !");
  }

  async function remove(id: string) {
    if (deletingId) return;
    if (!window.confirm("Supprimer cette communauté ? Les publications et adhésions seront supprimées.")) {
      return;
    }
    setDeletingId(id);
    setError(null);
    const res = await supprimerCommunaute(id);
    setDeletingId(null);
    if (res && "error" in res) {
      setError(res.error ?? "Erreur inconnue.");
      return;
    }
    setSuccess("Communauté supprimée.");
  }

  const proprietaire = (c: CommunauteRow) =>
    organisations.find((o) => o.id === c.structure_id);

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit p-6 lg:col-span-2">
        <h2 className="text-base font-extrabold text-slate-900">
          Créer une communauté
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isAdmin
            ? "Choisissez l'organisation qui la gérera."
            : "Votre organisation la gérera et pourra y publier."}
        </p>
        <form onSubmit={create} className="mt-5 space-y-4">
          <Field label="Nom *">
            <Input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex. : Développeurs de Guinée"
              required
              minLength={2}
            />
          </Field>
          <Field label="Description">
            <TextArea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              placeholder="Objectif de la communauté, activités…"
            />
          </Field>
          <Field label="Pilier">
            <Select value={pilier} onChange={(e) => setPilier(e.target.value)}>
              <option value="">Aucun</option>
              <option value="AG">Agriculture</option>
              <option value="ED">Éducation</option>
              <option value="IT">Numérique</option>
              <option value="EC">Entrepreneuriat</option>
              <option value="SA">Santé</option>
            </Select>
          </Field>
          {isAdmin ? (
            <Field label="Organisation propriétaire *">
              <Select
                value={structureId}
                onChange={(e) => setStructureId(e.target.value)}
                required
              >
                <option value="">Choisir…</option>
                {organisations.map((o) => (
                  <option key={o.id} value={o.id}>
                    {o.nom} ({o.type})
                  </option>
                ))}
              </Select>
            </Field>
          ) : null}

          {error ? (
            <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
              {error}
            </p>
          ) : null}
          {success ? (
            <p className="rounded-xl bg-emerald-50 px-4 py-2.5 text-sm font-semibold text-emerald-700">
              {success}
            </p>
          ) : null}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Création…" : "+ Créer la communauté"}
          </Button>
        </form>
      </Card>

      <div className="lg:col-span-3">
        {communautes.length === 0 ? (
          <EmptyState
            icon="🌍"
            title="Aucune communauté"
            message="Créez votre première communauté pour que les jeunes puissent s'y inscrire."
          />
        ) : (
          <Card className="overflow-hidden">
            {communautes.map((c, i) => {
              const org = proprietaire(c);
              return (
                <div
                  key={c.id}
                  className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fonij/10 text-lg">
                    {c.pilier ? "🧭" : "🌍"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{c.nom}</p>
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {c.description || "Aucune description"}
                      {c.pilier ? ` · Pilier ${c.pilier}` : ""}
                      {isAdmin && org ? ` · Gérée par ${org.nom}` : ""}
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    disabled={deletingId === c.id}
                    onClick={() => remove(c.id)}
                  >
                    {deletingId === c.id ? "Suppression…" : "Supprimer"}
                  </Button>
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
