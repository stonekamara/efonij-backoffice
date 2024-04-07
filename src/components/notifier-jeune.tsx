"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { envoyerNotifications } from "@/app/actions";
import type { NotificationType } from "@/lib/types";
import { NOTIFICATION_TYPES } from "@/lib/types";

export default function NotifierJeune({
  userId,
  jeuneNom,
  onClose,
}: {
  userId: string;
  jeuneNom: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [titre, setTitre] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("admin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    setBusy(true);
    setError(null);
    const res = await envoyerNotifications({
      userIds: [userId],
      titre,
      message,
      type,
    });
    setBusy(false);
    if (res && "error" in res) {
      setError(res.error ?? "Erreur inconnue.");
      return;
    }
    setSent(true);
    router.refresh();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-0 backdrop-blur-sm sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-t-3xl bg-white shadow-2xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="border-b border-slate-100 px-6 py-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">
                Envoyer une notification
              </h3>
              <p className="mt-0.5 text-sm text-slate-500">{jeuneNom}</p>
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

        <div className="px-6 py-5">
          {sent ? (
            <div className="py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M20 6 9 17l-5-5" />
                </svg>
              </div>
              <p className="mt-4 text-base font-extrabold text-slate-900">
                Notification envoyée !
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {jeuneNom} la recevra immédiatement dans l'app.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-5 rounded-xl bg-fonij px-5 py-2.5 text-sm font-bold text-white transition hover:bg-fonij-dark"
              >
                Fermer
              </button>
            </div>
          ) : (
            <form onSubmit={submit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  Titre *
                </label>
                <input
                  value={titre}
                  onChange={(e) => setTitre(e.target.value)}
                  placeholder="Ex. : Votre candidature évolue"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-fonij focus:ring-2 focus:ring-fonij/20"
                  required
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  Message
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={4}
                  placeholder="Votre message personnalisé…"
                  className="w-full resize-none rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-fonij focus:ring-2 focus:ring-fonij/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-600">
                  Type
                </label>
                <select
                  value={type}
                  onChange={(e) => setType(e.target.value as NotificationType)}
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-fonij focus:ring-2 focus:ring-fonij/20"
                >
                  {Object.entries(NOTIFICATION_TYPES).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              {error ? (
                <p className="rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
                  {error}
                </p>
              ) : null}

              <div className="flex justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={onClose}
                  className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-600 transition hover:bg-slate-50"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  disabled={busy || !titre.trim()}
                  className="inline-flex items-center gap-2 rounded-xl bg-fonij px-5 py-2.5 text-sm font-bold text-white transition hover:bg-fonij-dark disabled:opacity-50"
                >
                  {busy ? "Envoi…" : "Envoyer"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
