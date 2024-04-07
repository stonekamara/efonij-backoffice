"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import TiltCard from "@/components/tilt-card";
import {
  PasseportVisual,
  OffresVisual,
  CommunautesVisual,
} from "@/components/product-visuals";

/**
 * Carrousel signature Revolut : une pile de 3 cartes produit.
 * La carte active est au centre (scale 1), la précédente glisse à
 * gauche derrière (scale 0.9), la suivante arrive depuis la droite.
 * Le titre, le texte et le CTA changent avec la carte ; des pilules
 * permettent de choisir. Auto-rotation toutes les 5 s (pause au survol).
 */

type Slide = {
  id: string;
  label: string;
  eyebrow: string;
  title: string;
  desc: string;
  cta: string;
  href: string;
  visual: ReactNode;
};

const slides: Slide[] = [
  {
    id: "passeport",
    label: "Passeport",
    eyebrow: "Passeport Jeune",
    title: "Ton identité officielle",
    desc: "Un Passeport Jeune généré automatiquement, avec ton matricule unique, ta photo et ton QR code personnel.",
    cta: "Voir mon passeport",
    href: "/demande-inscription",
    visual: <PasseportVisual />,
  },
  {
    id: "offres",
    label: "Offres",
    eyebrow: "Offres partenaires",
    title: "Postule en un geste",
    desc: "Des offres vérifiées des structures et entreprises partenaires. Ton CV part automatiquement avec ta candidature.",
    cta: "Voir les offres",
    href: "#produits",
    visual: <OffresVisual />,
  },
  {
    id: "communautes",
    label: "Communautés",
    eyebrow: "Communautés",
    title: "Rejoins les tiens",
    desc: "Des communautés autour de tes centres d'intérêt pour échanger, apprendre et te soutenir entre jeunes.",
    cta: "Découvrir les communautés",
    href: "#comment-ca-marche",
    visual: <CommunautesVisual />,
  },
];

export default function HeroCarousel() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const slide = slides[active];

  // Auto-rotation (désactivée si pause, survol ou réduction des animations).
  // Redémarrée à chaque changement de slide : un clic sur une pilule
  // réinitialise le compte à rebours (comme sur Revolut).
  useEffect(() => {
    if (paused) return;
    if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    const t = setInterval(() => setActive((a) => (a + 1) % slides.length), 5200);
    return () => clearInterval(t);
  }, [paused, active]);

  // Position de chaque carte dans la pile, selon son écart avec l'active
  const position = (i: number) => {
    const n = slides.length;
    const diff = ((i - active) % n + n) % n;
    if (diff === 0) return "z-20 translate-x-0 scale-100 opacity-100";
    if (diff === 1) return "z-10 translate-x-[58%] scale-90 opacity-50";
    return "z-0 -translate-x-[58%] scale-90 opacity-50";
  };

  return (
    <div
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Contenu qui change avec la carte active */}
      <div key={slide.id} className="hero-slide-in mx-auto max-w-2xl text-center">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-fonij">
          {slide.eyebrow}
        </p>
        <h2 className="mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl">
          {slide.title}
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">{slide.desc}</p>
        <div className="mt-7">
          <Link
            href={slide.href}
            className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-3.5 text-sm font-semibold text-white transition hover:bg-fonij-dark active:scale-95"
          >
            {slide.cta}
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M5 12h14M13 6l6 6-6 6" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Pile de cartes */}
      <div className="relative mx-auto mt-14 h-[320px] max-w-md sm:h-[360px]">
        {slides.map((s, i) => (
          <div
            key={s.id}
            aria-hidden={i !== active}
            className={`hero-carousel-card ease-revolut absolute inset-0 flex items-center justify-center transition-all duration-500 ${position(i)}`}
          >
            <div className={`scale-[0.85] ${i === active ? "" : "pointer-events-none"}`}>
              <TiltCard max={7}>{s.visual}</TiltCard>
            </div>
          </div>
        ))}
      </div>

      {/* Pilules de sélection */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2.5">
        {slides.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={active === i}
            className={`rounded-full px-6 py-2.5 text-sm font-semibold transition ${
              active === i
                ? "bg-ink text-white"
                : "bg-transparent text-slate-600 ring-1 ring-slate-300 hover:bg-slate-100 hover:text-ink"
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>
    </div>
  );
}
