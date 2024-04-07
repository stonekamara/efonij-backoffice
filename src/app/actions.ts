"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser, getMembership, isFonijAdmin } from "@/lib/auth";
import type {
  CandidatureStatut,
  NotificationType,
  ValidationType,
} from "@/lib/types";

// ---------------------------------------------------------------------------
// Authentification
// ---------------------------------------------------------------------------

export async function login(formData: FormData) {
  const supabase = await createClient();
  const email = String(formData.get("email") ?? "");
  const password = String(formData.get("password") ?? "");

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    const msg = error.message?.toLowerCase() ?? "";
    if (msg.includes("confirm")) {
      redirect("/login?error=non_confirme");
    }
    return { error: "Email ou mot de passe incorrect." };
  }
  redirect("/tableau-de-bord");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}

// ---------------------------------------------------------------------------
// Offres
// ---------------------------------------------------------------------------

function offrePayload(formData: FormData, structureId: string) {
  return {
    titre: String(formData.get("titre") ?? "").trim(),
    type: String(formData.get("type") ?? ""),
    description: String(formData.get("description") ?? "").trim() || null,
    prerequis: String(formData.get("prerequis") ?? "").trim() || null,
    public_cible: String(formData.get("public_cible") ?? "").trim() || null,
    lieu: String(formData.get("lieu") ?? "").trim() || null,
    image_url: String(formData.get("image_url") ?? "").trim() || null,
    pilier: String(formData.get("pilier") ?? "").trim() || null,
    date_limite: String(formData.get("date_limite") ?? "").trim() || null,
    statut: String(formData.get("statut") ?? "ouverte"),
    structure_id: structureId,
  };
}

/** Organisation autorisée pour l'utilisateur courant (son org, ou celle choisie si FONIJ admin). */
async function resolveStructureId(formData: FormData): Promise<string | null> {
  const membership = await getMembership();
  if (!membership) return null;
  if (isFonijAdmin(membership)) {
    return String(formData.get("structure_id") ?? "") || null;
  }
  return membership.organisation_id;
}

export async function createOffre(formData: FormData) {
  const supabase = await createClient();
  const structureId = await resolveStructureId(formData);
  if (!structureId) return { error: "Organisation introuvable." };
  if (!String(formData.get("titre") ?? "").trim()) {
    return { error: "Le titre est obligatoire." };
  }

  const { error } = await supabase
    .from("offres")
    .insert(offrePayload(formData, structureId));
  if (error) return { error: error.message };
  revalidatePath("/offres");
  redirect("/offres");
}

export async function updateOffre(id: string, formData: FormData) {
  const supabase = await createClient();
  const structureId = await resolveStructureId(formData);
  if (!structureId) return { error: "Organisation introuvable." };

  const { error } = await supabase
    .from("offres")
    .update(offrePayload(formData, structureId))
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/offres");
  redirect("/offres");
}

export async function deleteOffre(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("offres").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/offres");
}

// ---------------------------------------------------------------------------
// Candidatures
// ---------------------------------------------------------------------------

export async function updateCandidatureStatut(
  candidatureId: string,
  statut: CandidatureStatut,
) {
  const supabase = await createClient();
  const user = await getCurrentUser();
  const { error } = await supabase
    .from("candidatures")
    .update({
      statut,
      reviewed_at: new Date().toISOString(),
      reviewed_by: user?.id ?? null,
    })
    .eq("id", candidatureId);
  if (error) return { error: error.message };
  revalidatePath("/offres", "layout");
}

// ---------------------------------------------------------------------------
// Inscription des organisations (demande + validation)
// ---------------------------------------------------------------------------

export async function demanderInscription(formData: FormData) {
  const supabase = await createClient();
  const nom = String(formData.get("nom") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const contact = String(formData.get("contact") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!nom || nom.length < 2) {
    return { error: "Le nom de l'organisation est obligatoire." };
  }
  if (!email.includes("@")) return { error: "Adresse email invalide." };
  if (password.length < 6) {
    return { error: "Le mot de passe doit faire 6 caractères minimum." };
  }

  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: "organisation" } },
  });
  if (signUpError) return { error: signUpError.message };
  const userId = signUpData.user?.id;
  if (!userId) {
    return { error: "Impossible de créer le compte. Vérifiez l'email." };
  }

  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    "demander_acces_organisation",
    {
      p_user_id: userId,
      p_nom: nom,
      p_type: type,
      p_contact: contact,
    },
  );
  if (rpcError) return { error: rpcError.message };
  const result = rpcResult as { ok: boolean; error?: string } | null;
  if (!result?.ok) {
    return { error: result?.error ?? "Impossible de créer la demande." };
  }
  return { ok: true as const };
}

/** Approuve ou refuse la demande d'inscription d'une organisation. */
export async function traiterDemande(
  organisationId: string,
  statut: "active" | "refusee",
) {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership || !isFonijAdmin(membership)) {
    return { error: "Accès réservé à l'administrateur FONIJ." };
  }
  const user = await getCurrentUser();

  const { data: org } = await supabase
    .from("organisations")
    .select("id, nom, organisation_users(user_id)")
    .eq("id", organisationId)
    .maybeSingle();
  if (!org) return { error: "Organisation introuvable." };

  const { error } = await supabase
    .from("organisations")
    .update({ statut })
    .eq("id", organisationId);
  if (error) return { error: error.message };

  // À l'approbation, la structure reçoit une notification in-app.
  if (statut === "active") {
    const members = Array.isArray(org.organisation_users)
      ? org.organisation_users
      : [org.organisation_users].filter(Boolean);
    const userId = members[0]?.user_id;
    if (userId) {
      const loginUrl = process.env.NEXT_PUBLIC_SITE_URL
        ? `${process.env.NEXT_PUBLIC_SITE_URL}/login`
        : null;
      await supabase.from("notifications").insert({
        user_id: userId,
        titre: "Votre organisation a été approuvée",
        message:
          `Félicitations, « ${org.nom} » est active. ` +
          (loginUrl
            ? `Connectez-vous sur ${loginUrl} pour publier vos offres.`
            : "Connectez-vous au back-office pour publier vos offres."),
        type: "admin",
        envoyee_par: user?.id ?? null,
      });
    }
  }
  revalidatePath("/demandes");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Structures : création directe par l'admin FONIJ (droit suprême)
// ---------------------------------------------------------------------------

export async function creerStructure(formData: FormData) {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership || !isFonijAdmin(membership)) {
    return { error: "Accès réservé à l'administrateur FONIJ." };
  }
  const nom = String(formData.get("nom") ?? "").trim();
  const type = String(formData.get("type") ?? "");
  const contact = String(formData.get("contact") ?? "").trim();
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (nom.length < 2) {
    return { error: "Le nom de l'organisation est obligatoire." };
  }
  if (!["structure", "entreprise"].includes(type)) {
    return { error: "Type d'organisation invalide." };
  }
  if (!email.includes("@")) return { error: "Adresse email invalide." };
  if (password.length < 6) {
    return { error: "Le mot de passe doit faire 6 caractères minimum." };
  }

  // 1. Création du compte back-office (profil créé par le trigger handle_new_user).
  const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { role: "organisation" } },
  });
  if (signUpError) return { error: signUpError.message };
  const userId = signUpData.user?.id;
  if (!userId) {
    return {
      error:
        "Impossible de créer le compte. Cet email est peut-être déjà utilisé.",
    };
  }

  // 2. Création de l'organisation (active) + rattachement du compte (RPC sécurisé).
  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    "creer_organisation_par_admin",
    {
      p_user_id: userId,
      p_nom: nom,
      p_type: type,
      p_contact: contact,
    },
  );
  if (rpcError) return { error: rpcError.message };
  const result = rpcResult as { ok: boolean; error?: string } | null;
  if (!result?.ok) {
    return { error: result?.error ?? "Impossible de créer la structure." };
  }

  revalidatePath("/structures");
  return { ok: true as const };
}

/** Supprime une structure et toutes ses données liées (droit suprême admin). */
export async function supprimerStructure(id: string) {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership || !isFonijAdmin(membership)) {
    return { error: "Accès réservé à l'administrateur FONIJ." };
  }

  const { data: rpcResult, error: rpcError } = await supabase.rpc(
    "supprimer_organisation_par_admin",
    { p_org_id: id },
  );
  if (rpcError) return { error: rpcError.message };
  const result = rpcResult as { ok: boolean; error?: string } | null;
  if (!result?.ok) {
    return { error: result?.error ?? "Impossible de supprimer la structure." };
  }

  revalidatePath("/structures");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Communautés (admin FONIJ uniquement)
// ---------------------------------------------------------------------------

function slugFromNom(nom: string) {
  const base = nom
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return `${base || "communaute"}-${Date.now().toString(36)}`;
}

export async function creerCommunaute(formData: FormData) {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) return { error: "Organisation introuvable." };
  const isAdmin = isFonijAdmin(membership);
  const nom = String(formData.get("nom") ?? "").trim();
  if (!nom) return { error: "Le nom est obligatoire." };

  const structureId = isAdmin
    ? String(formData.get("structure_id") ?? "").trim() || null
    : membership.organisation_id;
  if (!structureId) return { error: "Choisissez l'organisation propriétaire." };

  const { error } = await supabase.from("communautes").insert({
    nom,
    slug: slugFromNom(nom),
    description: String(formData.get("description") ?? "").trim() || null,
    pilier: String(formData.get("pilier") ?? "").trim() || null,
    structure_id: structureId,
  });
  if (error) return { error: error.message };
  revalidatePath("/communautes");
  return { ok: true as const };
}

export async function supprimerCommunaute(id: string) {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) return { error: "Organisation introuvable." };
  const { error } = await supabase.from("communautes").delete().eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/communautes");
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Notifications (admin FONIJ uniquement)
// ---------------------------------------------------------------------------

export async function envoyerNotifications(input: {
  userIds: string[];
  titre: string;
  message: string;
  type: NotificationType;
}) {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership || !isFonijAdmin(membership)) {
    return { error: "Accès réservé à l'administrateur FONIJ." };
  }
  const titre = input.titre.trim();
  if (!titre) return { error: "Le titre est obligatoire." };
  if (input.userIds.length === 0) {
    return { error: "Sélectionnez au moins un destinataire." };
  }
  const user = await getCurrentUser();

  const rows = input.userIds.map((uid) => ({
    user_id: uid,
    titre,
    message: input.message.trim() || null,
    type: input.type,
    envoyee_par: user?.id ?? null,
  }));
  const { error } = await supabase.from("notifications").insert(rows);
  if (error) return { error: error.message };
  return { ok: true as const, count: rows.length };
}

// ---------------------------------------------------------------------------
// Validations (scan QR)
// ---------------------------------------------------------------------------

export async function createValidation(input: {
  candidatureId: string;
  type: ValidationType;
}) {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) return { error: "Organisation introuvable." };
  const user = await getCurrentUser();

  const { error } = await supabase.from("validations").insert({
    candidature_id: input.candidatureId,
    type: input.type,
    scanned_by_user_id: user?.id ?? null,
    scanned_by_organisation_id: membership.organisation_id,
  });
  if (error) return { error: error.message };
  return { ok: true as const };
}

// ---------------------------------------------------------------------------
// Publications des structures dans les communautés
// ---------------------------------------------------------------------------

export async function publierPublicationBackoffice(formData: FormData) {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) return { error: "Organisation introuvable." };
  const user = await getCurrentUser();
  if (!user) return { error: "Connexion requise." };

  const communauteId = String(formData.get("communaute_id") ?? "").trim();
  const contenu = String(formData.get("contenu") ?? "").trim();
  if (!communauteId) return { error: "Choisissez une communauté." };
  if (!contenu) return { error: "Le message est vide." };

  const { error } = await supabase.from("publications").insert({
    communaute_id: communauteId,
    auteur_id: user.id,
    contenu,
  });
  if (error) return { error: error.message };
  revalidatePath("/publications");
  return { ok: true as const };
}

export async function supprimerPublicationBackoffice(id: string) {
  const supabase = await createClient();
  const membership = await getMembership();
  if (!membership) return { error: "Organisation introuvable." };
  // La RLS vérifie que l'utilisateur est l'auteur, un membre de la structure
  // propriétaire de la communauté, ou l'admin FONIJ.
  const { error } = await supabase
    .from("publications")
    .delete()
    .eq("id", id);
  if (error) return { error: error.message };
  revalidatePath("/publications");
  return { ok: true as const };
}
