"use client";

import { useActionState } from "react";
import { useRouter } from "next/navigation";
import { createOffre, updateOffre } from "@/app/actions";
import type { Offre, OrganisationLite } from "@/lib/types";
import {
  Alert,
  Button,
  Field,
  Input,
  Select,
  TextArea,
} from "@/components/ui";

const types = [
  { value: "formation", label: "Formation" },
  { value: "stage", label: "Stage" },
  { value: "emploi", label: "Emploi" },
  { value: "concours", label: "Concours" },
  { value: "bootcamp", label: "Bootcamp" },
];

const piliers = [
  { value: "AG", label: "Agriculture (AG)" },
  { value: "ED", label: "Éducation (ED)" },
  { value: "IT", label: "Numérique (IT)" },
  { value: "EC", label: "Entrepreneuriat (EC)" },
  { value: "SA", label: "Santé (SA)" },
];

export default function OffreForm({
  offre,
  organisations,
  defaultOrganisationId,
  isAdmin,
}: {
  offre?: Offre;
  organisations: OrganisationLite[];
  defaultOrganisationId: string;
  isAdmin: boolean;
}) {
  const router = useRouter();
  const isEdit = Boolean(offre);

  const action = isEdit
    ? (formData: FormData) => updateOffre(offre!.id, formData)
    : createOffre;

  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      const res = await action(formData);
      if (res && "error" in res) return res;
      return { error: null };
    },
    { error: null as string | null },
  );

  return (
    <form action={formAction} className="space-y-5">
      {state.error ? <Alert kind="error">{state.error}</Alert> : null}

      <div className="grid gap-5 md:grid-cols-2">
        <Field label="Titre *">
          <Input
            name="titre"
            required
            defaultValue={offre?.titre ?? ""}
            placeholder="Ex. Stage développeur·se Flutter"
          />
        </Field>

        <Field label="Type *">
          <Select name="type" required defaultValue={offre?.type ?? "formation"}>
            {types.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Pilier">
          <Select name="pilier" defaultValue={offre?.pilier ?? ""}>
            <option value="">Choisir…</option>
            {piliers.map((p) => (
              <option key={p.value} value={p.value}>
                {p.label}
              </option>
            ))}
          </Select>
        </Field>

        <Field label="Lieu">
          <Input name="lieu" defaultValue={offre?.lieu ?? ""} placeholder="Conakry" />
        </Field>

        <Field label="Date limite">
          <Input
            name="date_limite"
            type="date"
            defaultValue={offre?.date_limite?.slice(0, 10) ?? ""}
          />
        </Field>

        <Field label="Statut">
          <Select name="statut" defaultValue={offre?.statut ?? "ouverte"}>
            <option value="ouverte">Ouverte</option>
            <option value="fermee">Fermée</option>
          </Select>
        </Field>
      </div>

      {isAdmin ? (
        <Field label="Organisation propriétaire *">
          <Select name="structure_id" required defaultValue={offre?.structure_id ?? ""}>
            <option value="">Choisir une organisation…</option>
            {organisations.map((o) => (
              <option key={o.id} value={o.id}>
                {o.nom}
              </option>
            ))}
          </Select>
        </Field>
      ) : (
        <input
          type="hidden"
          name="structure_id"
          value={defaultOrganisationId}
        />
      )}

      <Field label="Description">
        <TextArea
          name="description"
          rows={4}
          defaultValue={offre?.description ?? ""}
          placeholder="Décrivez la mission, le contenu, les conditions…"
        />
      </Field>

      <Field label="Image (URL)">
        <Input
          name="image_url"
          defaultValue={offre?.image_url ?? ""}
          placeholder="https://exemple.com/photo.jpg"
        />
      </Field>

      <Field label="Prérequis">
        <TextArea
          name="prerequis"
          rows={2}
          defaultValue={offre?.prerequis ?? ""}
          placeholder="Diplômes, compétences, matériel…"
        />
      </Field>

      <Field label="Public cible">
        <Input
          name="public_cible"
          defaultValue={offre?.public_cible ?? ""}
          placeholder="Ex. Jeunes diplômés de 18 à 35 ans"
        />
      </Field>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending}>
          {pending ? "Enregistrement…" : isEdit ? "Enregistrer les modifications" : "Publier l'offre"}
        </Button>
        <Button type="button" variant="secondary" onClick={() => router.back()}>
          Annuler
        </Button>
      </div>
    </form>
  );
}
