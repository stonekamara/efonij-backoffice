import FakeQr from "@/components/fake-qr";

/* --------------------------- Visuels (mockups CSS) --------------------------- */
/* Visuels produits partagés entre les onglets et le carrousel du hero. */

export function PasseportVisual() {
  return (
    <div className="w-full max-w-xs">
      <div className="overflow-hidden rounded-3xl bg-gradient-to-br from-fonij to-fonij-dark p-6 text-white ring-1 ring-fonij-accent/40">
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/60">
          République de Guinée
        </p>
        <p className="text-lg font-bold tracking-tight">E-FONIJ</p>
        <p className="mt-6 font-mono text-lg font-bold tracking-[0.15em] text-fonij-accent">
          FONIJ 26 000456
        </p>
        <div className="mt-5 flex items-end justify-between">
          <div>
            <p className="text-[9px] uppercase tracking-[0.25em] text-white/50">Titulaire</p>
            <p className="text-sm font-bold uppercase">NOM PRÉNOM</p>
          </div>
          <div className="h-14 w-14 rounded-lg bg-white p-1.5">
            <FakeQr color="#06282B" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function OffresVisual() {
  const offres = [
    { tag: "Formation", titre: "Développeur web", lieu: "Conakry" },
    { tag: "Emploi", titre: "Agent de saisie", lieu: "Kankan" },
    { tag: "Bourse", titre: "Master 2 public", lieu: "En ligne" },
  ];
  return (
    <div className="w-full max-w-sm space-y-3">
      {offres.map((o) => (
        <div
          key={o.titre}
          className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-white p-4"
        >
          <span className="rounded-full bg-fonij/10 px-2.5 py-1 text-[11px] font-bold text-fonij">
            {o.tag}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold text-slate-900">{o.titre}</p>
            <p className="text-xs text-slate-500">{o.lieu}</p>
          </div>
          <span className="text-xs font-semibold text-slate-400">Postuler →</span>
        </div>
      ))}
    </div>
  );
}

export function CommunautesVisual() {
  const membres = [
    { c: "#F2B544", i: "A" },
    { c: "#2E8A93", i: "F" },
    { c: "#f472b6", i: "M" },
    { c: "#38bdf8", i: "S" },
  ];
  return (
    <div className="w-full max-w-sm rounded-3xl border border-slate-200 bg-white p-6">
      <p className="text-sm font-bold text-slate-900">Codeurs de Guinée</p>
      <p className="mt-1 text-xs text-slate-500">12 480 membres</p>
      <div className="mt-4 flex -space-x-2.5">
        {membres.map((m) => (
          <div
            key={m.i}
            className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-sm font-black text-fonij-dark"
            style={{ backgroundColor: m.c }}
          >
            {m.i}
          </div>
        ))}
        <div className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white bg-slate-100 text-xs font-bold text-slate-500">
          +12k
        </div>
      </div>
      <div className="mt-5 rounded-2xl bg-slate-50 p-3 text-xs text-slate-500">
        🎉 Nouvelle sortie prévue samedi à Conakry
      </div>
    </div>
  );
}

export function ValidationsVisual() {
  return (
    <div className="w-full max-w-xs">
      <div className="rounded-3xl border border-slate-200 bg-white p-6 text-center">
        <div className="mx-auto h-24 w-24 rounded-2xl bg-white p-2 ring-1 ring-slate-200">
          <FakeQr />
        </div>
        <p className="mt-4 text-sm font-bold text-slate-900">Passeport prêt à scanner</p>
        <p className="mt-1 text-xs text-slate-500">Présente ce QR aux partenaires</p>
        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M20 6 9 17l-5-5" />
          </svg>
          Présence validée à l&apos;instant
        </div>
      </div>
    </div>
  );
}
