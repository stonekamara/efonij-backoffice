import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import type { Candidature } from "@/lib/types";
import { PageHeader } from "@/components/ui";
import CandidaturesList from "@/components/candidatures-list";

export default async function OffreCandidaturesPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");
  const isAdmin = isFonijAdmin(membership);

  const { data: offre } = await supabase
    .from("offres")
    .select("id, titre, structure_id")
    .eq("id", id)
    .maybeSingle();
  if (!offre) notFound();
  if (!isAdmin && offre.structure_id !== membership.organisation_id) {
    redirect("/offres");
  }

  const { data: candidatures } = await supabase
    .from("candidatures")
        .select(
      "*, profiles(prenom, nom, matricule, niveau_passeport, avatar_url, email, region, telephone, pilier, points)",
    )
    .eq("offre_id", id)
    .order("created_at", { ascending: false });

  return (
    <div>
      <PageHeader
        title="Candidatures reçues"
        subtitle={offre.titre}
        action={
          <Link
            href="/offres"
            className="rounded-xl border border-slate-300 px-4 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
          >
            ← Retour aux offres
          </Link>
        }
      />

      <CandidaturesList candidatures={(candidatures ?? []) as Candidature[]} />
    </div>
  );
}
