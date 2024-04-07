import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import type { Candidature, Profile } from "@/lib/types";
import JeuneDetail from "@/components/jeune-detail";

export const dynamic = "force-dynamic";

export default async function JeuneDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");
  if (!isFonijAdmin(membership)) redirect("/offres");

  const { data: jeune } = await supabase
    .from("profiles")
    .select("id, prenom, nom, email, matricule, niveau_passeport, created_at")
    .eq("id", id)
    .maybeSingle();
  if (!jeune) notFound();

  const { data: candidatures } = await supabase
    .from("candidatures")
    .select("*, profiles(prenom, nom, email, telephone, avatar_url), offres(titre, type, structure_id)")
    .eq("user_id", id)
    .order("created_at", { ascending: false });

  return (
    <JeuneDetail
      jeune={jeune as Profile}
      candidatures={(candidatures ?? []) as Candidature[]}
    />
  );
}
