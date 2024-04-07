import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import { Badge, Card, PageHeader } from "@/components/ui";
import { dateFr, dateHeureFr } from "@/lib/format";
import RecentCandidatures, {
  type CandidatureRecente,
} from "@/components/recent-candidatures";

export default async function DashboardPage() {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");

  const isAdmin = isFonijAdmin(membership);
  const orgId = membership.organisation_id;
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();

  // ── 1re vague : requêtes indépendantes, lancées en parallèle ────────────────
  const [offresActives, offresIdsRaw, validationsMois, jeunes] =
    await Promise.all([
      // Nombre d'offres actives (toutes plateforme pour le FONIJ, sinon les siennes).
      (async () => {
        let q = supabase
          .from("offres")
          .select("id", { count: "exact", head: true })
          .eq("statut", "ouverte");
        if (!isAdmin) q = q.eq("structure_id", orgId);
        const { count } = await q;
        return count ?? 0;
      })(),
      // Ids des offres (toutes pour le FONIJ, sinon les siennes).
      (async () => {
        let q = supabase.from("offres").select("id");
        if (!isAdmin) q = q.eq("structure_id", orgId);
        const { data } = await q;
        return (data ?? []) as { id: string }[];
      })(),
      // Validations effectuées ce mois-ci.
      (async () => {
        let q = supabase
          .from("validations")
          .select("id", { count: "exact", head: true })
          .gte("scanned_at", startOfMonth);
        if (!isAdmin) q = q.eq("scanned_by_organisation_id", orgId);
        const { count } = await q;
        return count ?? 0;
      })(),
      // Total jeunes inscrits (FONIJ uniquement).
      isAdmin
        ? supabase
            .from("profiles")
            .select("id", { count: "exact", head: true })
            .then(({ count }) => count ?? 0)
        : Promise.resolve(0),
    ]);

  const ids = offresIdsRaw.map((o) => o.id);

  // ── 2e vague : dépend des ids, également en parallèle ───────────────────────
  const [candidatures, recentes, offresRecentes] = await Promise.all([
    // Candidatures reçues.
    ids.length > 0
      ? supabase
          .from("candidatures")
          .select("id", { count: "exact", head: true })
          .in("offre_id", ids)
          .then(({ count }) => count ?? 0)
      : Promise.resolve(0),
    // Dernières candidatures reçues (structures uniquement).
    !isAdmin && ids.length > 0
      ? supabase
          .from("candidatures")
          .select(
            "id, statut, created_at, offre_id, profiles(prenom, nom, matricule, avatar_url), offres(titre)",
          )
          .in("offre_id", ids)
          .order("created_at", { ascending: false })
          .limit(5)
          .then(({ data }) => (data ?? []) as CandidatureRecente[])
      : Promise.resolve([]),
    // Dernières offres publiées (structures uniquement).
    !isAdmin
      ? supabase
          .from("offres")
          .select("id, titre, statut, date_limite, created_at")
          .eq("structure_id", orgId)
          .order("created_at", { ascending: false })
          .limit(3)
          .then(({ data }) => data ?? [])
      : Promise.resolve([]),
  ]);

  const stats = isAdmin
    ? [
        {
          label: "Jeunes inscrits",
          value: jeunes ?? 0,
          icon: "👥",
          href: "/jeunes",
        },
        {
          label: "Offres actives (plateforme)",
          value: offresActives ?? 0,
          icon: "💼",
          href: "/offres",
        },
        {
          label: "Candidatures reçues",
          value: candidatures ?? 0,
          icon: "📥",
          href: "/offres",
        },
        {
          label: "Validations ce mois",
          value: validationsMois ?? 0,
          icon: "✅",
          href: "/scan",
        },
      ]
    : [
        {
          label: "Mes offres actives",
          value: offresActives ?? 0,
          icon: "💼",
          href: "/offres",
        },
        {
          label: "Candidatures reçues",
          value: candidatures ?? 0,
          icon: "📥",
          href: "/offres",
        },
        {
          label: "Validations ce mois",
          value: validationsMois ?? 0,
          icon: "✅",
          href: "/scan",
        },
      ];

  const acces = isAdmin
    ? [
        {
          href: "/offres/nouvelle",
          icon: "➕",
          title: "Publier une offre",
          desc: "Créer une nouvelle offre pour les jeunes",
        },
        {
          href: "/scan",
          icon: "📷",
          title: "Scanner un QR",
          desc: "Valider le passeport d'un jeune",
        },
        {
          href: "/demandes",
          icon: "📋",
          title: "Demandes d'inscription",
          desc: "Valider ou refuser les organisations",
        },
        {
          href: "/notifications",
          icon: "🔔",
          title: "Notifications",
          desc: "Envoyer un message aux jeunes",
        },
      ]
    : [
        {
          href: "/offres/nouvelle",
          icon: "➕",
          title: "Créer une offre",
          desc: "Publier une offre pour recruter des jeunes",
        },
        {
          href: "/scan",
          icon: "📷",
          title: "Scanner un QR",
          desc: "Valider la présence d'un jeune",
        },
        {
          href: "/offres",
          icon: "💼",
          title: "Mes offres",
          desc: "Gérer les offres et leurs candidatures",
        },
      ];

  return (
    <div>
      <PageHeader
        title={
          isAdmin ? "Tableau de bord · administration FONIJ" : "Tableau de bord"
        }
        subtitle={
          isAdmin
            ? "Vue globale de la plateforme E-FONIJ."
            : `Activité de ${membership.organisations?.nom ?? "votre organisation"}.`
        }
        action={
          <Link
            href="/offres/nouvelle"
            className="rounded-xl bg-fonij px-4 py-2.5 text-sm font-bold text-white transition hover:bg-fonij-dark"
          >
            + Nouvelle offre
          </Link>
        }
      />

      {/* Statistiques cliquables */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-fonij hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-3xl">{s.icon}</span>
              <span
                aria-hidden
                className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-fonij"
              >
                →
              </span>
            </div>
            <p className="mt-3 text-3xl font-black text-slate-900">{s.value}</p>
            <p className="mt-1 text-sm font-medium text-slate-500">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-2">
        {/* Accès rapides */}
        <Card className="p-5">
          <h2 className="text-base font-extrabold text-slate-900">
            Accès rapides
          </h2>
          <p className="mt-0.5 text-xs text-slate-400">
            Les actions les plus courantes de votre espace.
          </p>
          <div className="mt-4 space-y-2.5">
            {acces.map((a) => (
              <Link
                key={a.href + a.title}
                href={a.href}
                className="group flex items-center gap-4 rounded-xl border border-slate-200 px-4 py-3 transition hover:border-fonij hover:bg-fonij/5"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-50 text-lg transition group-hover:bg-fonij/10">
                  {a.icon}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-bold text-slate-800">
                    {a.title}
                  </span>
                  <span className="block truncate text-xs text-slate-400">
                    {a.desc}
                  </span>
                </span>
                <span
                  aria-hidden
                  className="text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-fonij"
                >
                  →
                </span>
              </Link>
            ))}
          </div>
        </Card>

        {/* Dernières candidatures reçues (structures) */}
        {!isAdmin ? (
          <Card className="p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-extrabold text-slate-900">
                Dernières candidatures reçues
              </h2>
              <Link
                href="/offres"
                className="text-xs font-bold text-fonij transition hover:text-fonij-dark"
              >
                Tout voir →
              </Link>
            </div>
            <RecentCandidatures candidatures={recentes} />
          </Card>
        ) : null}
      </div>

      {/* Mes dernières offres (structures) */}
      {!isAdmin && (offresRecentes ?? []).length > 0 ? (
        <Card className="mt-6 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-extrabold text-slate-900">
              Mes dernières offres
            </h2>
            <Link
              href="/offres"
              className="text-xs font-bold text-fonij transition hover:text-fonij-dark"
            >
              Tout voir →
            </Link>
          </div>
          <div className="mt-4 divide-y divide-slate-100">
            {(offresRecentes ?? []).map((o) => (
              <Link
                key={o.id}
                href={`/offres/${o.id}`}
                className="flex items-center justify-between gap-3 py-3 transition hover:text-fonij"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold text-slate-800">
                    {o.titre}
                  </p>
                  <p className="text-xs text-slate-400">
                    Publiée le {dateHeureFr(o.created_at)}
                    {o.date_limite ? ` · Limite ${dateFr(o.date_limite)}` : ""}
                  </p>
                </div>
                <Badge color={o.statut === "ouverte" ? "green" : "slate"}>
                  {o.statut === "ouverte" ? "Ouverte" : "Fermée"}
                </Badge>
              </Link>
            ))}
          </div>
        </Card>
      ) : null}
    </div>
  );
}
