"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { envoyerNotifications } from "@/app/actions";
import type { NotificationType, Profile } from "@/lib/types";
import { NOTIFICATION_TYPES } from "@/lib/types";
import { Card } from "@/components/ui";

type Mode = "individuel" | "groupe" | "tous";

const MODES: Array<{ value: Mode; label: string; icon: string }> = [
  { value: "individuel", label: "À un jeune", icon: "👤" },
  { value: "groupe", label: "À plusieurs", icon: "👥" },
  { value: "tous", label: "À tous les inscrits", icon: "🌍" },
];

export default function NotificationsForm({ jeunes }: { jeunes: Profile[] }) {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>("individuel");
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [titre, setTitre] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState<NotificationType>("admin");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return jeunes;
    return jeunes.filter(
      (j) =>
        j.prenom.toLowerCase().includes(q) ||
        j.nom.toLowerCase().includes(q) ||
        `${j.prenom} ${j.nom}`.toLowerCase().includes(q) ||
        (j.matricule ?? "").toLowerCase().includes(q),
    );
  }, [jeunes, search]);

  const destinataires =
    mode === "individuel"
      ? selectedId
        ? 1
        : 0
      : mode === "groupe"
        ? selectedIds.size
        : jeunes.length;

  function toggle(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  const allVisibleSelected =
    filtered.length > 0 && filtered.every((j) => selectedIds.has(j.id));

  function selectAll() {
    setSelectedIds(
      allVisibleSelected ? new Set() : new Set(filtered.map((j) => j.id)),
    );
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (busy) return;
    const userIds =
      mode === "individuel"
        ? selectedId
          ? [selectedId]
          : []
        : mode === "groupe"
          ? [...selectedIds]
          : jeunes.map((j) => j.id);
    if (userIds.length === 0) {
      setError("Sélectionnez au moins un destinataire.");
      return;
    }
    setBusy(true);
    setError(null);
    const res = await envoyerNotifications({ userIds, titre, message, type });
    setBusy(false);
    if (res && "error" in res) {
      setError(res.error ?? "Erreur inconnue.");
      return;
    }
    setResult(userIds.length);
    setTitre("");
    setMessage("");
    setSelectedId("");
    setSelectedIds(new Set());
    router.refresh();
  }

  if (result !== null) {
    return (
      <Card className="mx-auto max-w-lg p-10 text-center">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-100 text-emerald-600">
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </div>
        <h3 className="mt-5 text-xl font-extrabold text-slate-900">
          {result} notification{result > 1 ? "s" : ""} envoyée{result > 1 ? "s" : ""} !
        </h3>
        <p className="mt-2 text-sm text-slate-500">
          Les jeunes concernés la recevront immédiatement dans l'app
          (badge + écran Mes notifications).
        </p>
        <button
          type="button"
          onClick={() => setResult(null)}
          className="mt-6 rounded-xl bg-fonij px-6 py-2.5 text-sm font-bold text-white transition hover:bg-fonij-dark"
        >
          Envoyer une autre notification
        </button>
      </Card>
    );
  }

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      {/* Choix des destinataires */}
      <Card className="p-6 lg:col-span-3">
        <div className="mb-4 grid grid-cols-3 gap-2">
          {MODES.map((m) => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMode(m.value)}
              className={`rounded-xl border px-3 py-3 text-center transition ${
                mode === m.value
                  ? "border-fonij bg-fonij/5 text-fonij"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <span className="block text-lg">{m.icon}</span>
              <span className="mt-1 block text-xs font-bold">{m.label}</span>
            </button>
          ))}
        </div>

        {mode === "individuel" ? (
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Choisir un jeune
            </label>
            <select
              value={selectedId}
              onChange={(e) => setSelectedId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-800 outline-none transition focus:border-fonij focus:ring-2 focus:ring-fonij/20"
            >
              <option value="">Sélectionner…</option>
              {jeunes.map((j) => (
                <option key={j.id} value={j.id}>
                  {j.prenom} {j.nom} · {j.matricule ?? "sans matricule"}
                </option>
              ))}
            </select>
          </div>
        ) : mode === "groupe" ? (
          <div>
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <div className="relative flex-1">
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Filtrer par nom ou matricule…"
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 outline-none transition placeholder:font-normal placeholder:text-slate-400 focus:border-fonij focus:ring-2 focus:ring-fonij/20"
                />
              </div>
              <button
                type="button"
                onClick={selectAll}
                className="rounded-xl border border-slate-300 px-3 py-2 text-xs font-bold text-slate-600 transition hover:bg-slate-50"
              >
                {allVisibleSelected ? "Tout désélectionner" : "Tout sélectionner"}
              </button>
            </div>
            <div className="max-h-80 space-y-1.5 overflow-y-auto rounded-xl border border-slate-200 p-2">
              {filtered.length === 0 ? (
                <p className="px-3 py-6 text-center text-sm text-slate-400">
                  Aucun jeune trouvé.
                </p>
              ) : (
                filtered.map((j) => {
                  const checked = selectedIds.has(j.id);
                  return (
                    <label
                      key={j.id}
                      className={`flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 transition ${
                        checked ? "bg-fonij/10" : "hover:bg-slate-50"
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggle(j.id)}
                        className="h-4 w-4 accent-[#106067]"
                      />
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-slate-800">
                          {j.prenom} {j.nom}
                        </p>
                        <p className="text-[11px] text-slate-500">
                          {j.matricule ?? "sans matricule"}
                        </p>
                      </div>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        ) : (
          <div className="rounded-xl bg-fonij/5 px-5 py-6 text-center">
            <p className="text-3xl">🌍</p>
            <p className="mt-2 text-sm font-bold text-slate-800">
              {jeunes.length} jeune{jeunes.length > 1 ? "s" : ""} inscrit
              {jeunes.length > 1 ? "s" : ""}
            </p>
            <p className="mt-1 text-xs text-slate-500">
              La notification sera envoyée à tous les jeunes inscrits sur la
              plateforme.
            </p>
          </div>
        )}
      </Card>

      {/* Rédaction */}
      <Card className="p-6 lg:col-span-2">
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-bold text-slate-600">
              Titre *
            </label>
            <input
              value={titre}
              onChange={(e) => setTitre(e.target.value)}
              placeholder="Ex. : Nouvelle offre de stage disponible"
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
              rows={6}
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

          <button
            type="submit"
            disabled={busy || destinataires === 0 || !titre.trim()}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-fonij px-5 py-3 text-sm font-bold text-white transition hover:bg-fonij-dark disabled:opacity-50"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 2 11 13" />
              <path d="M22 2 15 22l-4-9-9-4z" />
            </svg>
            {busy
              ? "Envoi…"
              : `Envoyer à ${destinataires} jeune${destinataires > 1 ? "s" : ""}`}
          </button>
        </form>
      </Card>
    </div>
  );
}
