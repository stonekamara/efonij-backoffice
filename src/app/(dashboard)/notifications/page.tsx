import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import type { Profile } from "@/lib/types";
import { PageHeader } from "@/components/ui";
import NotificationsForm from "@/components/notifications-form";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");
  if (!isFonijAdmin(membership)) redirect("/offres");

  const { data: jeunes } = await supabase
    .from("profiles")
    .select("id, prenom, nom, matricule")
    .order("prenom", { ascending: true });

  return (
    <div>
      <PageHeader
        title="Envoyer une notification"
        subtitle="Notifications in-app reçues par les jeunes sur leur téléphone"
      />
      <NotificationsForm jeunes={(jeunes ?? []) as Profile[]} />
    </div>
  );
}
