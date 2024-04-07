import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import { PageHeader, Badge } from "@/components/ui";
import CommunautesAdmin from "@/components/communautes-admin";

export const dynamic = "force-dynamic";

export default async function CommunautesPage() {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");

  const isAdmin = isFonijAdmin(membership);

  let query = supabase
    .from("communautes")
    .select("id, nom, slug, description, pilier, structure_id, created_at")
    .order("nom", { ascending: true });
  if (!isAdmin) query = query.eq("structure_id", membership.organisation_id);
  const { data: communautes } = await query;

  const { data: organisations } = isAdmin
    ? await supabase
        .from("organisations")
        .select("id, nom, type")
        .eq("statut", "active")
        .order("nom", { ascending: true })
    : { data: [] as { id: string; nom: string; type: string }[] };

  return (
    <div>
      <PageHeader
        title="Communautés"
        subtitle={
          isAdmin
            ? "Création et modération des communautés et de leurs propriétaires."
            : "Créez et gérez vos communautés. Vous pourrez y publier depuis l'onglet Publications."
        }
        action={
          <Badge color="fonij">{communautes?.length ?? 0} communautés</Badge>
        }
      />
      <CommunautesAdmin
        communautes={(communautes ?? []) as never}
        organisations={(organisations ?? []) as never}
        isAdmin={isAdmin}
      />
    </div>
  );
}
