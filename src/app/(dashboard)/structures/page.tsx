import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import { PageHeader, Badge } from "@/components/ui";
import StructuresAdmin, {
  type StructureRow,
} from "@/components/structures-admin";

export const dynamic = "force-dynamic";

export default async function StructuresPage() {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");
  if (!isFonijAdmin(membership)) redirect("/offres");

  const { data: organisations } = await supabase
    .from("organisations")
    .select(
      "id, nom, type, contact, statut, created_at, organisation_users(user_id, role)",
    )
    .order("created_at", { ascending: false });

  const rows: StructureRow[] = (organisations ?? []).map((o) => {
    const users = Array.isArray(o.organisation_users)
      ? o.organisation_users
      : o.organisation_users
        ? [o.organisation_users]
        : [];
    return {
      id: o.id,
      nom: o.nom,
      type: o.type as StructureRow["type"],
      contact: o.contact,
      statut: o.statut as StructureRow["statut"],
      created_at: o.created_at,
      membres: users,
    };
  });

  return (
    <div>
      <PageHeader
        title="Structures"
        subtitle="Créez les structures et entreprises partenaires, avec leur compte d'accès au back-office."
        action={<Badge color="fonij">{rows.length} organisations</Badge>}
      />
      <StructuresAdmin structures={rows} />
    </div>
  );
}
