import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type Membership = {
  organisation_id: string;
  role: "admin" | "membre";
  organisations: {
    id: string;
    nom: string;
    type: "structure" | "entreprise" | "fonij";
  } | null;
};

/**
 * Utilisateur courant, résolu UNE seule fois par requête (memoïsé).
 * Tous les appels à getUser() dans la même requête partagent le résultat,
 * ce qui évite les allers-retours réseau répétés vers Supabase Auth.
 */
export const getCurrentUser = cache(async (): Promise<User | null> => {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
});

/** Appartenance de l'utilisateur courant à son organisation (première ligne). */
export const getMembership = cache(async (): Promise<Membership | null> => {
  const supabase = await createClient();
  const user = await getCurrentUser();
  if (!user) return null;

  const { data } = await supabase
    .from("organisation_users")
    .select("organisation_id, role, organisations(nom, type)")
    .eq("user_id", user.id)
    .maybeSingle();

  if (!data) return null;
  const org = Array.isArray(data.organisations)
    ? data.organisations[0]
    : data.organisations;
  if (!org) return null;

  return {
    organisation_id: data.organisation_id as string,
    role: data.role as Membership["role"],
    organisations: {
      id: data.organisation_id as string,
      nom: org.nom as string,
      type: org.type as NonNullable<Membership["organisations"]>["type"],
    },
  };
});

export function isFonijAdmin(membership: Membership | null): boolean {
  return (
    membership?.organisations?.type === "fonij" &&
    membership.role === "admin"
  );
}
