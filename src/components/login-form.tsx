"use client";

import { useActionState } from "react";
import { useSearchParams } from "next/navigation";
import { login } from "@/app/actions";
import { Alert, Button, Field, Input } from "@/components/ui";

export default function LoginForm() {
  const searchParams = useSearchParams();
  const error = searchParams.get("error");
  const [state, formAction, pending] = useActionState(
    async (_prev: { error: string | null }, formData: FormData) => {
      const res = await login(formData);
      return res ? { error: res.error } : { error: null };
    },
    { error: null as string | null },
  );

  return (
    <div className="rounded-2xl bg-white p-7 shadow-xl">
      {error === "acces" ? (
        <div className="mb-5">
          <Alert kind="error">
            Votre compte n'est rattaché à aucune organisation partenaire.
            Contactez l'administration E-FONIJ pour obtenir l'accès.
          </Alert>
        </div>
      ) : null}
      {error === "refuse" ? (
        <div className="mb-5">
          <Alert kind="error">
            Votre demande d'accès a été refusée. Contactez l'administration
            E-FONIJ pour plus d'informations.
          </Alert>
        </div>
      ) : null}
      {error === "non_confirme" ? (
        <div className="mb-5">
          <Alert kind="error">
            Vérifiez d&apos;abord votre boîte mail : un lien de confirmation a
            été envoyé pour activer votre compte avant la première connexion.
          </Alert>
        </div>
      ) : null}
      {error === "session" ? (
        <div className="mb-5">
          <Alert kind="error">Session expirée. Veuillez vous reconnecter.</Alert>
        </div>
      ) : null}
      {state.error ? (
        <div className="mb-5">
          <Alert kind="error">{state.error}</Alert>
        </div>
      ) : null}

      <form action={formAction} className="space-y-4">
        <Field label="Adresse e-mail">
          <Input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="prenom.nom@exemple.gn"
          />
        </Field>
        <Field label="Mot de passe">
          <Input
            name="password"
            type="password"
            required
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </Field>
        <Button type="submit" disabled={pending} className="w-full">
          {pending ? "Connexion…" : "Se connecter"}
        </Button>
      </form>

      <p className="mt-5 text-center text-sm text-slate-500">
        Votre organisation n&apos;a pas encore de compte ?{" "}
        <a
          href="/demande-inscription"
          className="font-bold text-fonij hover:underline"
        >
          Demander l&apos;accès
        </a>
      </p>
      <p className="mt-3 text-center text-xs text-slate-400">
        Accès réservé aux organisations partenaires, après validation par
        l&apos;administration E-FONIJ.
      </p>
    </div>
  );
}
