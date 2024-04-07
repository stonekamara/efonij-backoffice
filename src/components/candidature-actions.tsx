"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateCandidatureStatut } from "@/app/actions";
import type { CandidatureStatut } from "@/lib/types";

const options: { value: CandidatureStatut; label: string }[] = [
  { value: "en_attente", label: "En attente" },
  { value: "acceptee", label: "Accepter" },
  { value: "refusee", label: "Refuser" },
];

export default function CandidatureActions({
  candidatureId,
  statut,
  onChanged,
}: {
  candidatureId: string;
  statut: CandidatureStatut;
  onChanged?: (statut: CandidatureStatut) => void;
}) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function change(next: CandidatureStatut) {
    if (next === statut || busy) return;
    setBusy(true);
    await updateCandidatureStatut(candidatureId, next);
    setBusy(false);
    onChanged?.(next);
    router.refresh();
  }

  return (
    <div className="mt-4 flex flex-wrap gap-2">
      {options.map((o) => {
        const active = o.value === statut;
        const styles =
          o.value === "acceptee"
            ? "border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
            : o.value === "refusee"
              ? "border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
              : "border-amber-200 bg-amber-50 text-amber-700 hover:bg-amber-100";
        return (
          <button
            key={o.value}
            type="button"
            disabled={busy}
            onClick={() => change(o.value)}
            className={`rounded-full border px-3.5 py-1.5 text-xs font-bold transition disabled:opacity-50 ${
              active ? `${styles} ring-2 ring-inset` : "border-slate-200 bg-white text-slate-500 hover:bg-slate-50"
            }`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
