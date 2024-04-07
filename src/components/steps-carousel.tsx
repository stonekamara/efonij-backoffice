"use client";

import { useRef, type ReactNode } from "react";

export type Step = {
  n: string;
  icon: ReactNode;
  tile: string;
  t: string;
  d: string;
  chip: string;
};

const ArrowIcon = ({ flip = false }: { flip?: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={flip ? "rotate-180" : ""}
  >
    <path d="M9 6l6 6-6 6" />
  </svg>
);

/** Une seule carte regroupant les étapes, défilable horizontalement (snap scroll + flèches). */
export default function StepsCarousel({ steps }: { steps: Step[] }) {
  const trackRef = useRef<HTMLDivElement>(null);

  const scrollByAmount = (dir: 1 | -1) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>("[data-slide]");
    const amount = card ? card.offsetWidth + 24 : 420;
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <div className="relative mt-16">
      {/* Carte unique scrollable */}
      <div
        ref={trackRef}
        role="region"
        aria-label="Étapes de la plateforme"
        tabIndex={0}
        className="no-scrollbar flex snap-x snap-mandatory gap-6 overflow-x-auto rounded-[2rem] border border-slate-200 bg-white p-6 outline-none focus-visible:ring-2 focus-visible:ring-fonij sm:p-8"
      >
        {steps.map((s) => (
          <div
            key={s.n}
            data-slide
            className="flex w-[85%] shrink-0 snap-start flex-col rounded-3xl border border-slate-100 bg-slate-50/60 p-7 transition duration-300 hover:border-fonij/30 hover:bg-slate-50 sm:w-[55%] lg:w-auto lg:flex-1"
          >
            <div
              className={`flex h-14 w-14 items-center justify-center rounded-2xl transition duration-300 hover:scale-110 ${s.tile}`}
            >
              {s.icon}
            </div>
            <p className="mt-6 text-[11px] font-bold uppercase tracking-[0.18em] text-fonij">
              Étape {s.n}
            </p>
            <h3 className="mt-1.5 text-xl font-bold tracking-tight text-ink">{s.t}</h3>
            <p className="mt-2.5 flex-1 text-sm leading-relaxed text-slate-600">{s.d}</p>
            <div className="mt-5 inline-flex w-fit items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 ring-1 ring-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-fonij-accent" />
              {s.chip}
            </div>
          </div>
        ))}
      </div>

      {/* Indice + flèches */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <p className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <svg
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 5v14M5 12l7 7 7-7" />
          </svg>
          Faites défiler pour découvrir les étapes
        </p>
        <div className="flex gap-2.5">
          <button
            type="button"
            onClick={() => scrollByAmount(-1)}
            aria-label="Étape précédente"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-100 text-slate-700 transition hover:bg-slate-200 active:scale-95"
          >
            <ArrowIcon flip />
          </button>
          <button
            type="button"
            onClick={() => scrollByAmount(1)}
            aria-label="Étape suivante"
            className="flex h-11 w-11 items-center justify-center rounded-full bg-ink text-white transition hover:bg-fonij-dark active:scale-95"
          >
            <ArrowIcon />
          </button>
        </div>
      </div>
    </div>
  );
}
