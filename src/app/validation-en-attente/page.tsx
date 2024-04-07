import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

export const dynamic = "force-dynamic";

export default async function ValidationEnAttentePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let orgName: string | null = null;
  if (user) {
    const { data: membership } = await supabase
      .from("organisation_users")
      .select("organisations(nom, statut)")
      .eq("user_id", user.id)
      .limit(1)
      .maybeSingle();
    const org = Array.isArray(membership?.organisations)
      ? membership?.organisations[0]
      : membership?.organisations;
    if (org?.statut === "en_attente" && org?.nom) {
      orgName = org.nom;
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-fonij-dark via-fonij to-fonij-light px-4">
      <div className="w-full max-w-md rounded-3xl bg-white p-10 text-center shadow-xl">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-100 text-3xl">
          ⏳
        </div>
        <h1 className="mt-5 text-xl font-extrabold text-slate-900">
          Demande en attente de validation
        </h1>
        <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
          {orgName ? (
            <>
              Votre organisation <strong>{orgName}</strong> est en cours
              d&apos;examen par l&apos;administrateur FONIJ. Vous recevrez une
              notification dès l&apos;approbation.
            </>
          ) : (
            <>
              Votre demande d&apos;accès est en cours d&apos;examen par
              l&apos;administrateur FONIJ. Vous recevrez une notification dès
              l&apos;approbation.
            </>
          )}
        </p>
        <Link
          href="/login"
          className="mt-6 inline-block rounded-xl bg-fonij px-6 py-2.5 text-sm font-bold text-white transition hover:bg-fonij-dark"
        >
          Retour à la connexion
        </Link>
      </div>
    </div>
  );
}
