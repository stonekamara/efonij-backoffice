import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import { PageHeader, Badge } from "@/components/ui";
import PublicationsStructure from "@/components/publications-structure";

export const dynamic = "force-dynamic";

export default async function PublicationsPage() {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) {
    return null;
  }
  const isAdmin = isFonijAdmin(membership);

  // Communautés dans lesquelles la structure peut publier : les siennes
  // (toutes pour l'admin FONIJ).
  let query = supabase
    .from("communautes")
    .select("id, nom")
    .order("nom", { ascending: true });
  if (!isAdmin) query = query.eq("structure_id", membership.organisation_id);
  const [{ data: communautes }, { data: publications }] = await Promise.all([
    query,
    supabase
      .from("publications")
      .select(
        "id, communaute_id, auteur_id, contenu, created_at, " +
          "communautes(nom), profiles!publications_auteur_id_fkey(prenom, nom)",
      )
      .order("created_at", { ascending: false }),
  ]);

  return (
    <div>
      <PageHeader
        title="Publications"
        subtitle={
          isAdmin
            ? "Tous les posts de toutes les communautés — modérez librement."
            : "Tous les posts des communautés. Vous publiez dans vos communautés et pouvez supprimer les posts des vôtres."
        }
        action={
          <Badge color="fonij">
            {publications?.length ?? 0} publications
          </Badge>
        }
      />
      <PublicationsStructure
        organisationNom={membership.organisations?.nom ?? ""}
        isAdmin={isAdmin}
        communautes={(communautes ?? []) as { id: string; nom: string }[]}
        publications={(publications ?? []) as never}
      />
    </div>
  );
}
