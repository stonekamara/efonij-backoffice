"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { creerStructure, supprimerStructure } from "@/app/actions";
import { Badge, Button, Card, EmptyState, Field, Input, Select } from "@/components/ui";

export type StructureRow = {
  id: string;
  nom: string;
  type: "structure" | "entreprise" | "fonij";
  contact: string | null;
  statut: "en_attente" | "active" | "refusee";
  created_at?: string;
  membres?: Array<{ user_id: string; role: string }>;
};

const typeLabel: Record<StructureRow["type"], string> = {
  structure: "Structure",
  entreprise: "Entreprise",
  fonij: "FONIJ",
};

const statutBadge: Record<
  StructureRow["statut"],
  { label: string; color: "amber" | "green" | "red" | "slate" }
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

export default function StructuresAdmin({
  structures,
}: {
  structures: StructureRow[];
}) {
  const router = useRouter();
  const [nom, setNom] = useState("");
  const [type, setType] = useState("structure");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function create(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    const formData = new FormData();
    formData.set("nom", nom);
    formData.set("type", type);
    formData.set("contact", contact);
    formData.set("email", email);
    formData.set("password", password);
    const res = await creerStructure(formData);
    setBusy(false);
    if (res && "error" in res) {
      setError(res.error ?? "Erreur inconnue.");
      return;
    }
    setNom("");
    setType("structure");
    setContact("");
    setEmail("");
    setPassword("");
    setSuccess("Structure créée : le compte peut se connecter au back-office.");
    router.refresh();
  }

  async function remove(s: StructureRow) {
    if (deletingId) return;
    const confirmed = window.confirm(
      `Supprimer « ${s.nom} » ?\n\nToutes ses offres, communautés et données liées seront définitivement supprimées, ainsi que le compte d'accès au back-office (l'email deviendra réutilisable). Cette action est irréversible.`,
    );
    if (!confirmed) return;
    setDeletingId(s.id);
    setError(null);
    setSuccess(null);
    const res = await supprimerStructure(s.id);
    setDeletingId(null);
    if (res && "error" in res) {
      setError(res.error ?? "Erreur inconnue.");
      return;
    }
    setSuccess(`« ${s.nom} » a été supprimée.`);
    router.refresh();
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <Card className="h-fit p-6 lg:col-span-2">
        <h2 className="text-base font-extrabold text-slate-900">
          Créer une structure
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Crée l'organisation (active immédiatement) et son compte d'accès au
          back-office.
        </p>
        <form onSubmit={create} className="mt-5 space-y-4">
          <Field label="Nom *">
            <Input
              value={nom}
              onChange={(e) => setNom(e.target.value)}
              placeholder="Ex. : Ministère de la Jeunesse"
              required
              minLength={2}
            />
          </Field>
          <Field label="Type *">
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              required
            >
              <option value="structure">Structure</option>
              <option value="entreprise">Entreprise</option>
            </Select>
          </Field>
          <Field label="Contact">
            <Input
              value={contact}
              onChange={(e) => setContact(e.target.value)}
              placeholder="Téléphone, adresse…"
            />
          </Field>
          <Field label="Email du compte *">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="structure@exemple.gn"
              required
              autoComplete="off"
            />
          </Field>
          <Field label="Mot de passe du compte *">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="6 caractères minimum"
              required
              minLength={6}
              autoComplete="new-password"
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
            {busy ? "Création…" : "+ Créer la structure"}
          </Button>
        </form>
      </Card>

      <div className="lg:col-span-3">
        {structures.length === 0 ? (
          <EmptyState
            icon="🏢"
            title="Aucune structure"
            message="Créez votre première structure pour qu'elle publie des offres."
          />
        ) : (
          <Card className="overflow-hidden">
            {structures.map((s) => {
              const badge = statutBadge[s.statut];
              const isFonij = s.type === "fonij";
              return (
                <div
                  key={s.id}
                  className="flex flex-wrap items-center gap-4 border-b border-slate-100 px-5 py-4 last:border-0"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-fonij/10 text-lg">
                    {s.type === "entreprise" ? "🏢" : "🏛️"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-bold text-slate-900">{s.nom}</p>
                      <Badge color="slate">{typeLabel[s.type]}</Badge>
                      <Badge color={badge.color}>{badge.label}</Badge>
                    </div>
                    <p className="mt-0.5 truncate text-sm text-slate-500">
                      {s.contact ? `${s.contact} · ` : ""}
                      Créée le {formatDate(s.created_at)}
                      {s.membres?.length
                        ? ` · ${s.membres.length} compte(s)`
                        : ""}
                    </p>
                  </div>
                  {!isFonij ? (
                    <button
                      type="button"
                      onClick={() => remove(s)}
                      disabled={deletingId === s.id}
                      className="shrink-0 rounded-lg px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-wait disabled:opacity-50"
                      title="Supprimer la structure et toutes ses données"
                    >
                      {deletingId === s.id ? "Suppression…" : "🗑 Supprimer"}
                    </button>
                  ) : null}
                </div>
              );
            })}
          </Card>
        )}
      </div>
    </div>
  );
}
