import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import type { Offre, Organisation } from "@/lib/types";
import { Card, PageHeader } from "@/components/ui";
import OffreForm from "@/components/offre-form";

export default async function EditOffrePage({
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
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (!offre) notFound();
  if (!isAdmin && offre.structure_id !== membership.organisation_id) {
    redirect("/offres");
  }

  const { data: organisations } = isAdmin
    ? await supabase.from("organisations").select("id, nom, type")
    : { data: [] as Organisation[] };

  return (
    <div className="max-w-3xl">
      <PageHeader title="Modifier l'offre" subtitle={offre.titre} />
      <Card className="p-6">
        <OffreForm
          offre={offre as Offre}
          organisations={organisations ?? []}
          defaultOrganisationId={membership.organisation_id}
          isAdmin={isAdmin}
        />
      </Card>
    </div>
  );
}
