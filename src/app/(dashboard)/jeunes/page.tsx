import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import type { Profile } from "@/lib/types";
import { PageHeader } from "@/components/ui";
import JeunesList from "@/components/jeunes-list";

export const dynamic = "force-dynamic";

export default async function JeunesPage() {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");
  if (!isFonijAdmin(membership)) redirect("/offres");

  const { data: jeunes } = await supabase
    .from("profiles")
    .select("id, prenom, nom, matricule, niveau_passeport, created_at, candidatures(count)")
    .order("created_at", { ascending: false });

  const rows = (jeunes ?? []).map((j: Record<string, unknown> & { candidatures?: unknown }) => {
    const counts = Array.isArray(j.candidatures) ? j.candidatures[0] : j.candidatures;
    const count =
      counts && typeof counts === "object" && "count" in counts
        ? (counts as { count: number }).count
        : 0;
    return { ...j, nb_candidatures: count };
  });

  return (
    <div>
      <PageHeader
        title="Jeunes inscrits"
        subtitle="Liste complète des jeunes E-FONIJ"
      />
      <JeunesList jeunes={rows as (Profile & { nb_candidatures: number })[]} />
    </div>
  );
}
