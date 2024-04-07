import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import type { Offre, Organisation } from "@/lib/types";
import { PageHeader } from "@/components/ui";
import OffresList from "@/components/offres-list";

export default async function OffresPage() {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");

  const isAdmin = isFonijAdmin(membership);

  let query = supabase
    .from("offres")
    .select("*, organisations(nom, type)")
    .order("created_at", { ascending: false });
  if (!isAdmin) query = query.eq("structure_id", membership.organisation_id);
  const { data: offres } = await query;

  const { data: organisations } = isAdmin
    ? await supabase.from("organisations").select("id, nom, type")
    : { data: [] as Organisation[] };

  return (
    <div>
      <PageHeader
        title="Offres"
        subtitle={
          isAdmin
            ? "Toutes les offres de la plateforme, toutes organisations confondues."
            : "Les offres publiées par votre organisation."
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
      <OffresList
        offres={(offres as Offre[] | null) ?? []}
        organisations={organisations ?? []}
        isAdmin={isAdmin}
      />
    </div>
  );
}
