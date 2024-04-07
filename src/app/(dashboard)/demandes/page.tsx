import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import { PageHeader, Badge, Card, EmptyState } from "@/components/ui";
import DemandesList from "@/components/demandes-list";

export const dynamic = "force-dynamic";

export default async function DemandesPage() {
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

  const rows = (organisations ?? []).map((o) => {
    const users = Array.isArray(o.organisation_users)
      ? o.organisation_users
      : o.organisation_users
        ? [o.organisation_users]
        : [];
    return { ...o, membres: users };
  });

  const enAttente = rows.filter((o) => o.statut === "en_attente");

  return (
    <div>
      <PageHeader
        title="Demandes d'inscription"
        subtitle="Organisations en attente de validation par l'administrateur FONIJ"
        action={
          enAttente.length > 0 ? (
            <Badge color="amber">{enAttente.length} en attente</Badge>
          ) : undefined
        }
      />

      {rows.length === 0 ? (
        <EmptyState
          icon="🏢"
          title="Aucune demande"
          message="Les structures et entreprises qui demandent l'accès apparaîtront ici."
        />
      ) : (
        <Card className="overflow-hidden">
          <DemandesList demandes={rows as never} />
        </Card>
      )}
    </div>
  );
}
