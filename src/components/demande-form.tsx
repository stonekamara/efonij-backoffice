"use client";

import { useState } from "react";
import Link from "next/link";
import { demanderInscription } from "@/app/actions";

export default function DemandeForm() {
  const [nom, setNom] = useState("");
  const [type, setType] = useState("structure");
  const [contact, setContact] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const formData = new FormData();
    formData.set("nom", nom);
    formData.set("type", type);
    formData.set("contact", contact);
    formData.set("email", email);
    formData.set("password", password);
    const res = await demanderInscription(formData);
    setBusy(false);
    if (res && "error" in res) {
      setError(res.error ?? "Erreur inconnue.");
      return;
    }
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h2 className="mt-5 text-xl font-extrabold text-slate-900">
          Demande envoyée !
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          Votre demande d&apos;accès pour <strong>{nom}</strong> a bien été
          enregistrée. L&apos;administrateur FONIJ va l&apos;examiner et vous
          recevrez une notification dès l&apos;approbation de votre compte.
        </p>
        <Link
          href="/"
          className="mt-6 inline-block rounded-xl bg-fonij px-6 py-2.5 text-sm font-bold text-white transition hover:bg-fonij-dark"
        >
          Retour à l&apos;accueil
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label className="mb-1.5 block text-xs font-bold text-slate-600">
          Nom de l&apos;organisation *
        </label>
        <input
          value={nom}
          onChange={(e) => setNom(e.target.value)}
          placeholder="Ex. : Centre de formation de Kankan"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-fonij focus:ring-2 focus:ring-fonij/20"
          required
        />
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-slate-600">
          Type d&apos;organisation *
        </label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-fonij focus:ring-2 focus:ring-fonij/20"
        >
          <option value="structure">Structure partenaire</option>
          <option value="entreprise">Entreprise</option>
        </select>
      </div>
      <div>
        <label className="mb-1.5 block text-xs font-bold text-slate-600">
          Personne de contact
        </label>
        <input
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          placeholder="Nom du responsable + téléphone"
          className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-fonij focus:ring-2 focus:ring-fonij/20"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-600">
            Email du compte *
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="vous@organisation.gn"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-fonij focus:ring-2 focus:ring-fonij/20"
            required
          />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-600">
            Mot de passe *
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6 caractères minimum"
            className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-fonij focus:ring-2 focus:ring-fonij/20"
            required
            minLength={6}
          />
        </div>
      </div>

      <p className="rounded-xl bg-slate-50 px-4 py-3 text-xs leading-relaxed text-slate-500">
        🔐 Après validation par l&apos;administrateur FONIJ, votre organisation
        pourra publier des offres, consulter les candidatures et scanner les QR
        codes des jeunes.
      </p>

      {error ? (
        <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={busy}
        className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fonij px-5 py-3 text-sm font-bold text-white transition hover:bg-fonij-dark disabled:opacity-50"
      >
        {busy ? "Envoi de la demande…" : "Demander l'accès"}
      </button>
    </form>
  );
}
