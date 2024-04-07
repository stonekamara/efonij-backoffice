"use client";

import { useState, type ReactNode } from "react";
import {
  PasseportVisual,
  OffresVisual,
  CommunautesVisual,
  ValidationsVisual,
} from "@/components/product-visuals";

/* ------------------------------- Icônes ------------------------------- */

const IconCard = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="20" height="14" rx="2.5" />
    <path d="M2 10h20" />
    <path d="M6 15h4" />
  </svg>
);

const IconBriefcase = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  </svg>
);

const IconUsers = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0" />
    <circle cx="17.5" cy="9" r="2.5" />
    <path d="M16 14.5a5 5 0 0 1 5.5 5" />
  </svg>
);

const IconScan = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7V5a2 2 0 0 1 2-2h2M17 3h2a2 2 0 0 1 2 2v2M21 17v2a2 2 0 0 1-2 2h-2M7 21H5a2 2 0 0 1-2-2v-2" />
    <path d="M3 12h18" />
  </svg>
);

/* ------------------------------- Tabs ------------------------------- */

type Tab = {
  id: string;
  label: string;
  title: string;
  desc: string;
  points: string[];
  visual: ReactNode;
};

const tabs: Tab[] = [
  {
    id: "passeport",
    label: "Passeport",
    title: "Ton identité officielle",
    desc: "Un Passeport Jeune généré automatiquement avec ton matricule unique, ta photo et ton QR code personnel.",
    points: [
      "Matricule officiel unique",
      "QR code de validation anti-fraude",
      "Photo, niveau et validité inclus",
    ],
    visual: <PasseportVisual />,
  },
  {
    id: "offres",
    label: "Offres",
    title: "Postule en un geste",
    desc: "Des offres vérifiées des structures et entreprises partenaires, filtrées par pilier. Ton CV part automatiquement.",
    points: [
      "Offres publiées par les partenaires FONIJ",
      "Filtres par pilier et par région",
      "CV joint automatiquement",
    ],
    visual: <OffresVisual />,
  },
  {
    id: "communautes",
    label: "Communautés",
    title: "Rejoins les tiens",
    desc: "Des communautés autour de tes centres d'intérêt pour échanger, apprendre et te soutenir.",
    points: [
      "Communautés par pilier et par ville",
      "Événements et sorties annoncés",
      "Entraide entre jeunes",
    ],
    visual: <CommunautesVisual />,
  },
  {
    id: "validations",
    label: "Validations",
    title: "Fais valider ta présence",
    desc: "Un scan du QR par les partenaires et ta présence ou ta candidature est validée instantanément.",
    points: [
      "Présence aux événements",
      "Confirmation de candidature",
      "Notifié en temps réel dans l'app",
    ],
    visual: <ValidationsVisual />,
  },
];

export default function ProductTabs() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active) ?? tabs[0];

  return (
    <div>
      {/* Pilules d'onglets */}
      <div className="flex flex-wrap justify-center gap-2.5">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActive(t.id)}
            aria-pressed={active === t.id}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
              active === t.id
                ? "bg-ink text-white"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Contenu */}
      <div
        key={current.id}
        className="animate-tab-in mt-12 grid items-center gap-12 lg:grid-cols-2"
      >
        <div>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-fonij/10 text-fonij">
            {current.id === "passeport"
              ? IconCard
              : current.id === "offres"
                ? IconBriefcase
                : current.id === "communautes"
                  ? IconUsers
                  : IconScan}
          </div>
          <h3 className="mt-5 text-3xl font-medium tracking-tight text-slate-900 sm:text-4xl">
            {current.title}
          </h3>
          <p className="mt-3 max-w-md text-base leading-relaxed text-slate-600">
            {current.desc}
          </p>
          <ul className="mt-6 space-y-3">
            {current.points.map((p) => (
              <li key={p} className="flex items-center gap-3 text-sm text-slate-700">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-fonij/10 text-fonij">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex justify-center lg:justify-end">
          <div className="animate-float-slow">{current.visual}</div>
        </div>
      </div>
    </div>
  );
}
