import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import type { Organisation } from "@/lib/types";
import { Card, PageHeader } from "@/components/ui";
import OffreForm from "@/components/offre-form";

export default async function NouvelleOffrePage() {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");

  const isAdmin = isFonijAdmin(membership);
  const { data: organisations } = isAdmin
    ? await supabase.from("organisations").select("id, nom, type")
    : { data: [] as Organisation[] };

  return (
    <div className="max-w-3xl">
      <PageHeader
        title="Nouvelle offre"
        subtitle="Publiez une offre visible par les jeunes de la plateforme E-FONIJ."
      />
      <Card className="p-6">
        <OffreForm
          organisations={organisations ?? []}
          defaultOrganisationId={membership.organisation_id}
          isAdmin={isAdmin}
        />
      </Card>
    </div>
  );
}
