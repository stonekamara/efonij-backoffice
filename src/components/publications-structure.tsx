"use client";

import { useState } from "react";
import {
  publierPublicationBackoffice,
  supprimerPublicationBackoffice,
} from "@/app/actions";
import {
  Button,
  Card,
  EmptyState,
  Field,
  Select,
  TextArea,
} from "@/components/ui";

type CommunauteRow = { id: string; nom: string };

type PublicationRow = {
  id: string;
  communaute_id: string;
  contenu: string;
  created_at: string;
  communautes?: { nom: string } | { nom: string }[] | null;
  profiles?: { prenom: string | null; nom: string | null } | null;
};

export default function PublicationsStructure({
  organisationNom,
  isAdmin,
  communautes,
  publications,
}: {
  organisationNom: string;
  isAdmin: boolean;
  communautes: CommunauteRow[];
  publications: PublicationRow[];
}) {
  const [communauteId, setCommunauteId] = useState("");
  const [contenu, setContenu] = useState("");
  const [busy, setBusy] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function publish(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.set("communaute_id", communauteId);
    formData.set("contenu", contenu);
    const res = await publierPublicationBackoffice(formData);
    setBusy(false);
    if (res && "error" in res) {
      setError(res.error ?? "Erreur inconnue.");
      return;
    }
    setContenu("");
    setSuccess("Publication envoyée !");
  }

  async function remove(id: string) {
    if (deletingId) return;
    if (!window.confirm("Supprimer cette publication ?")) return;
    setDeletingId(id);
    setError(null);
    const res = await supprimerPublicationBackoffice(id);
    setDeletingId(null);
    if (res && "error" in res) {
      setError(res.error ?? "Erreur inconnue.");
      return;
    }
    setSuccess("Publication supprimée.");
  }

  const nomCommunaute = (p: PublicationRow) => {
    const c = Array.isArray(p.communautes) ? p.communautes[0] : p.communautes;
    return c?.nom ?? "Communauté";
  };

  const nomAuteur = (p: PublicationRow) => {
    const pr = Array.isArray(p.profiles) ? p.profiles[0] : p.profiles;
    const nom = [pr?.prenom, pr?.nom]
      .filter(Boolean)
      .join(" ")
      .trim();
    return nom || "Membre";
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit p-6 lg:col-span-2">
        <h2 className="text-base font-extrabold text-slate-900">
          Nouvelle publication
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          {isAdmin
            ? "Publiez dans n'importe quelle communauté au nom de FONIJ."
            : `Publiez dans vos communautés au nom de ${
                organisationNom || "votre organisation"
              }, avec le badge vérifié.`}
        </p>
        <form onSubmit={publish} className="mt-5 space-y-4">
          <Field label="Communauté *">
            <Select
              value={communauteId}
              onChange={(e) => setCommunauteId(e.target.value)}
              required
            >
              <option value="">Choisir une communauté…</option>
              {communautes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nom}
                </option>
              ))}
            </Select>
          </Field>
          <Field label="Message *">
            <TextArea
              value={contenu}
              onChange={(e) => setContenu(e.target.value)}
              rows={4}
              placeholder="Annonce, actualité, conseils aux jeunes…"
              required
              maxLength={1000}
            />
          </Field>

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
            {busy ? "Publication…" : "📣 Publier"}
          </Button>
        </form>
      </Card>

      <div className="lg:col-span-3">
        <p className="mb-3 text-sm font-semibold text-slate-500">
          Tous les posts ({publications.length})
        </p>
        {publications.length === 0 ? (
          <EmptyState
            icon="📣"
            title="Aucune publication"
            message="Les publications des jeunes et des structures apparaîtront ici."
          />
        ) : (
          <Card className="overflow-hidden">
            {publications.map((p) => (
              <div
                key={p.id}
                className="flex items-start gap-4 border-b border-slate-100 px-5 py-4 last:border-0"
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-fonij/10 text-base">
                  {nomAuteur(p).length > 0 ? nomAuteur(p)[0].toUpperCase() : "?"}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="rounded-full bg-fonij/10 px-2.5 py-0.5 text-[11px] font-bold text-fonij">
                      {nomCommunaute(p)}
                    </span>
                    <p className="text-xs font-bold text-slate-900">
                      {nomAuteur(p)}
                    </p>
                    <span className="text-xs text-slate-400">
                      {new Date(p.created_at).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-sm text-slate-700">
                    {p.contenu}
                  </p>
                </div>
                <Button
                  variant="danger"
                  disabled={deletingId === p.id}
                  onClick={() => remove(p.id)}
                >
                  {deletingId === p.id ? "…" : "Supprimer"}
                </Button>
              </div>
            ))}
          </Card>
        )}
      </div>
    </div>
  );
}
