import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import LandingNav from "@/components/landing-nav";
import Reveal from "@/components/reveal";
import StepsCarousel from "@/components/steps-carousel";
import ProductTabs from "@/components/product-tabs";
import ScrollMotion from "@/components/scroll-motion";
import Marquee from "@/components/marquee";
import ScrollProgress from "@/components/scroll-progress";
import Magnetic from "@/components/magnetic";
import CursorGlow from "@/components/cursor-glow";
import SplitReveal from "@/components/split-reveal";
import HeroCarousel from "@/components/hero-carousel";

export const metadata: Metadata = {
  title: "E-FONIJ · Passeport Jeune de Guinée",
  description:
    "La plateforme officielle du FONIJ : Passeport Jeune numérique avec QR code, offres, candidatures et communautés pour les jeunes de Guinée.",
};

/* ------------------------------- Icônes SVG ------------------------------ */

const IconCheck = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 6 9 17l-5-5" />
  </svg>
);

const IconShield = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 3l8 3.5v5.2c0 4.7-3.2 7.9-8 9.3-4.8-1.4-8-4.6-8-9.3V6.5z" />
    <path d="M9 11.5l2 2 4-4.5" />
  </svg>
);

const IconBriefcase = (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="7" width="18" height="13" rx="2.5" />
    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    <path d="M3 12h18" />
  </svg>
);

/* --------------------------------- Page ---------------------------------- */

export default function LandingPage() {
  return (
    <div className="landing-root">
      <style>{`
        @keyframes fadeUp {
          0% { opacity: 0; transform: translateY(18px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-up { animation: fadeUp .7s cubic-bezier(.2,.8,.2,1) both; }
        @keyframes meshDrift {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(50px, -40px) scale(1.15); }
          66% { transform: translate(-40px, 30px) scale(0.9); }
        }
        .mesh-blob { animation: meshDrift 16s ease-in-out infinite; }
        .mesh-blob-2 { animation: meshDrift 20s ease-in-out infinite reverse; }
      `}</style>

      <LandingNav />
      <ScrollProgress />

      {/* ============================== HERO ============================== */}
      <section className="relative overflow-hidden bg-[linear-gradient(180deg,#2E8A93_0%,#106067_48%,#0A4449_100%)] text-white">
        {/* Fond : lueurs en parallaxe liée au scroll (signature Revolut) */}
        <ScrollMotion maxRotate={0} parallax={70} className="absolute inset-0">
          <div className="absolute inset-0">
            <div className="mesh-blob absolute -left-32 top-16 h-[420px] w-[420px] rounded-full bg-fonij-accent/25 blur-[110px]" />
            <div className="mesh-blob-2 absolute -right-24 top-0 h-[380px] w-[380px] rounded-full bg-white/10 blur-[100px]" />
            <div
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.6) 1px, transparent 0)",
                backgroundSize: "34px 34px",
              }}
            />
          </div>
        </ScrollMotion>

        {/* Halo lumineux qui suit le curseur */}
        <CursorGlow />

        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          {/* Titre géant + CTA (style Banking & Beyond) */}
          <div className="pt-28 text-center sm:pt-36">
            <h1 className="animate-fade-up text-[2.75rem] font-medium leading-[1.02] tracking-[-0.035em] sm:text-7xl lg:text-[6rem]">
              Passeport Jeune
              <br />
              <span className="bg-gradient-to-r from-white via-fonij-accent to-fonij-accent bg-clip-text text-transparent">
                &amp; au-delà.
              </span>
            </h1>
            <p
              className="animate-fade-up mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-white/85 sm:text-xl"
              style={{ animationDelay: ".1s" }}
            >
              Ceci est ton passeport, réinventé. Postule aux offres des
              structures et entreprises partenaires, rejoins des communautés et
              fais valider ta présence en un scan.
            </p>
            <div
              className="animate-fade-up mt-9 flex flex-wrap items-center justify-center gap-4"
              style={{ animationDelay: ".2s" }}
            >
              <Magnetic>
                <Link
                  href="/demande-inscription"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-9 py-4 text-sm font-semibold text-white transition hover:bg-fonij-dark active:scale-95"
                >
                  Demander l&apos;accès
                  <svg
                    width="16"
                    height="16"
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
              </Magnetic>
            </div>
          </div>

          {/* Feuille blanche arrondie + carrousel signature (révélé au scroll) */}
          <div className="relative mx-auto mt-14 max-w-5xl rounded-t-[2.5rem] bg-white px-4 pb-12 pt-14 text-ink sm:px-8 sm:pb-16 sm:pt-16">
            <Reveal>
              <HeroCarousel />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ===================== BADGES / PREUVE SOCIALE ==================== */}
      <section className="bg-white py-10">
        <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
          <p className="text-lg font-medium tracking-tight text-ink">
            Rejoint par des milliers de jeunes et leurs partenaires en Guinée
          </p>
          <div className="mt-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm font-medium text-slate-500">
            {[
              "Passeport officiel FONIJ",
              "QR code sécurisé",
              "Offres vérifiées",
              "Communautés actives",
              "Validation instantanée",
            ].map((b, i) => (
              <span key={b} className="flex items-center gap-4">
                {i > 0 ? <span className="h-1 w-1 rounded-full bg-slate-300" /> : null}
                {b}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ==================== BANDEAU DÉFILANT (MARQUEE) ================= */}
      <Marquee
        items={[
          "Passeport Jeune numérique",
          "QR sécurisé",
          "Offres partenaires",
          "Communautés actives",
          "Validation instantanée",
          "Inscription gratuite",
        ]}
      />

      {/* ============================ PRODUITS (TABS) ===================== */}
      <section id="produits" className="scroll-mt-20 bg-white py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-fonij">
              Fonctionnalités
            </span>
            <SplitReveal
              text="Tout ce dont un jeune a besoin"
              className="mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl"
            />
          </div>
          <Reveal>
            <ProductTabs />
          </Reveal>
        </div>
      </section>

      {/* ========================= COMMENT ÇA MARCHE ====================== */}
      <section id="comment-ca-marche" className="scroll-mt-20 bg-slate-50 py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mx-auto max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-[0.22em] text-fonij">
              Comment ça marche
            </span>
            <SplitReveal
              text="Trois étapes vers les opportunités"
              className="mt-3 text-4xl font-medium tracking-tight text-ink sm:text-5xl"
            />
          </div>

          <Reveal>
            <StepsCarousel
              steps={[
                {
                  n: "1",
                  icon: IconCheck,
                  tile: "bg-fonij/10 text-fonij",
                  t: "Crée ton compte",
                  d: "Inscris-toi gratuitement dans l'app E-FONIJ et complète ton profil avec ta photo et tes centres d'intérêt.",
                  chip: "Gratuit",
                },
                {
                  n: "2",
                  icon: IconShield,
                  tile: "bg-fonij-accent/20 text-fonij-dark",
                  t: "Reçois ton Passeport",
                  d: "Ton Passeport Jeune officiel est généré automatiquement, avec ton matricule unique et ton QR code personnel.",
                  chip: "Matricule + QR",
                },
                {
                  n: "3",
                  icon: IconBriefcase,
                  tile: "bg-fonij/10 text-fonij",
                  t: "Postule & fais valider",
                  d: "Candidates-toi aux offres, rejoins des communautés, et fais scanner ton QR lors des événements.",
                  chip: "Validation instantanée",
                },
              ]}
            />
          </Reveal>
        </div>
      </section>

      {/* ============================ PARTENAIRES ========================= */}
      <section id="partenaires" className="scroll-mt-20 bg-ink py-24 text-white">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-4 sm:px-6 lg:grid-cols-2">
          <Reveal>
            <div>
              <span className="inline-flex items-center gap-2 rounded-full border border-fonij-accent/40 bg-fonij-accent/10 px-3.5 py-1.5 text-xs font-bold text-fonij-accent">
                <Image
                  src="/logo_fonij.png"
                  alt="Logo FONIJ"
                  width={18}
                  height={18}
                  className="h-5 w-5 rounded-full object-cover"
                />
                Espace partenaires
              </span>
              <h2 className="mt-5 text-4xl font-medium tracking-tight sm:text-5xl">
                Structures et entreprises,{" "}
                <span className="bg-gradient-to-r from-fonij-accent to-amber-300 bg-clip-text text-transparent">
                  pilotez votre recrutement
                </span>
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/60">
                Publiez vos offres, recevez des candidatures qualifiées et
                validez la présence des jeunes à vos événements, le tout dans
                un back-office simple connecté à la base nationale.
              </p>
              <ul className="mt-8 space-y-3.5">
                {[
                  "Créez et gérez vos offres en quelques clics",
                  "Scannez le QR du Passeport pour valider présence ou candidature",
                  "Consultez les CV et suivez le statut de chaque candidature",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-white/75">
                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-fonij-accent text-ink">
                      {IconCheck}
                    </span>
                    {t}
                  </li>
                ))}
              </ul>
              <div className="mt-9">
                <Link
                  href="/demande-inscription"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-sm font-semibold text-ink transition hover:bg-fonij-accent active:scale-95"
                >
                  Soumettre ma demande d&apos;accès
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
                <p className="mt-4 flex items-center gap-2 text-xs text-white/60">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="10" rx="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  Votre demande sera examinée par le FONIJ avant l&apos;activation de votre compte.
                </p>
              </div>
            </div>
          </Reveal>

          <div className="grid gap-4">
            {[
              {
                icon: IconBriefcase,
                t: "Publier une offre",
                d: "Titre, pilier, prérequis, date limite… ciblez le bon public.",
              },
              {
                icon: IconShield,
                t: "Scanner un QR",
                d: "Un scan et le profil du jeune s'affiche avec ses candidatures actives.",
              },
              {
                icon: IconCheck,
                t: "Valider & notifier",
                d: "Chaque validation est notifiée instantanément dans l'app du jeune.",
              },
            ].map((c, i) => (
              <Reveal key={c.t} delay={i * 100}>
                <div className="group flex items-start gap-4 rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-fonij-accent/40 hover:bg-white/10">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-fonij-accent transition group-hover:scale-110">
                    {c.icon}
                  </div>
                  <div>
                    <h3 className="font-bold text-white">{c.t}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-white/60">{c.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============================== CTA FINAL ========================= */}
      <section className="relative overflow-hidden bg-white py-24">
        <div className="mesh-blob absolute left-1/2 top-0 h-64 w-[520px] -translate-x-1/2 rounded-full bg-fonij/10 blur-[100px]" />
        <div className="relative mx-auto max-w-3xl px-4 text-center sm:px-6">
          <Reveal>
            <SplitReveal
              text="Rejoins le Passeport Jeune"
              className="text-4xl font-medium tracking-tight text-ink sm:text-5xl"
            />
            <p className="mx-auto mt-4 max-w-xl text-lg text-slate-600">
              Crée ton compte dans l&apos;app E-FONIJ et obtiens ton Passeport
              Jeune officiel, gratuitement.
            </p>
            <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
              <Magnetic>
                <Link
                  href="/demande-inscription"
                  className="inline-flex items-center gap-2 rounded-full bg-ink px-8 py-4 text-sm font-semibold text-white transition hover:bg-fonij-dark active:scale-95"
                >
                  Demander l&apos;accès
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </Link>
              </Magnetic>
              <a
                href="#comment-ca-marche"
                className="rounded-full border border-slate-300 px-8 py-4 text-sm font-semibold text-slate-700 transition hover:border-ink hover:text-ink"
              >
                Découvrir la plateforme
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ============================== FOOTER ============================ */}
      <footer className="bg-ink py-12 text-white">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col items-center justify-between gap-8 md:flex-row md:items-start">
            <div className="max-w-sm text-center md:text-left">
              <div className="flex items-center justify-center gap-2.5 md:justify-start">
                <Image
                  src="/logo_efonij.png"
                  alt="Logo E-FONIJ"
                  width={34}
                  height={34}
                  className="h-8 w-8 rounded-full object-cover ring-2 ring-fonij-accent/60"
                />
                <span className="text-lg font-bold tracking-tight">E-FONIJ</span>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-white/60">
                Le Passeport Jeune numérique de la Guinée. Une initiative du
                FONIJ au service de la jeunesse.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-10 text-center sm:gap-16 md:text-left">
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Plateforme
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/60">
                  <li><a href="#produits" className="transition hover:text-fonij-accent">Fonctionnalités</a></li>
                  <li><a href="#comment-ca-marche" className="transition hover:text-fonij-accent">Comment ça marche</a></li>
                  <li><a href="#partenaires" className="transition hover:text-fonij-accent">Partenaires</a></li>
                </ul>
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-white/50">
                  Rejoindre
                </p>
                <ul className="mt-3 space-y-2 text-sm text-white/60">
                  <li><Link href="/demande-inscription" className="transition hover:text-fonij-accent">Soumettre une demande d&apos;accès</Link></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-6 text-xs text-white/55 sm:flex-row">
            <p>© {new Date().getFullYear()} E-FONIJ · Tous droits réservés</p>
            <p className="flex items-center gap-2">
              En partenariat officiel avec
              <Image
                src="/logo_fonij.png"
                alt="Logo FONIJ"
                width={20}
                height={20}
                className="h-4 w-4 rounded-full object-cover"
              />
              le FONIJ
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
