export type OrganisationType = "structure" | "entreprise" | "fonij";

export type Organisation = {
  id: string;
  nom: string;
  type: OrganisationType;
  logo_url: string | null;
  contact: string | null;
  statut: "en_attente" | "active" | "refusee";
  created_at?: string;
  organisation_users?: Array<{ user_id: string; role: string }>;
};

export type Communaute = {
  id: string;
  nom: string;
  slug: string;
  description: string | null;
  avatar_url: string | null;
  pilier: string | null;
  created_at?: string;
};

export const STATUT_ORGANISATION: Record<Organisation["statut"], string> = {
  en_attente: "En attente",
  active: "Active",
  refusee: "Refusée",
};

/** Version allégée (id, nom, type) pour les listes de sélection. */
export type OrganisationLite = Pick<Organisation, "id" | "nom" | "type">;

export type OffreType =
  | "formation"
  | "stage"
  | "emploi"
  | "concours"
  | "bootcamp";

export type OffreStatut = "ouverte" | "fermee";

export type Offre = {
  id: string;
  titre: string;
  type: OffreType;
  description: string | null;
  prerequis: string | null;
  public_cible: string | null;
  lieu: string | null;
  image_url: string | null;
  pilier: string | null;
  structure_id: string | null;
  date_limite: string | null;
  statut: OffreStatut;
  created_at: string;
  organisations?: Organisation;
};

export type Profile = {
  id: string;
  prenom: string;
  nom: string;
  email?: string;
  matricule: string | null;
  niveau_passeport: number;
  avatar_url?: string | null;
  region?: string | null;
  telephone?: string | null;
  pilier?: string | null;
  points?: number;
  created_at?: string;
};

export type NotificationType =
  | "info"
  | "candidature"
  | "validation"
  | "offre"
  | "admin";

export const NOTIFICATION_TYPES: Record<NotificationType, string> = {
  info: "Information",
  candidature: "Candidature",
  validation: "Validation",
  offre: "Offre",
  admin: "Message FONIJ",
};

export type CandidatureStatut = "en_attente" | "acceptee" | "refusee";

/** Snapshot JSON du CV envoyé au moment de la candidature. */
export type CvSnapshot = {
  nom_complet?: string;
  titre_poste?: string | null;
  resume?: string | null;
  formations?: Array<{
    diplome?: string;
    etablissement?: string | null;
    annee_debut?: number | null;
    annee_fin?: number | null;
  }>;
  experiences?: Array<{
    poste?: string;
    organisation?: string | null;
    date_debut?: string | null;
    date_fin?: string | null;
    description?: string | null;
  }>;
  competences?: string[];
  langues?: Array<{ langue?: string; niveau?: string }>;
};

export type Candidature = {
  id: string;
  offre_id: string;
  user_id: string;
  statut: CandidatureStatut;
  created_at: string;
  cv_snapshot: CvSnapshot | null;
  cv_pdf_url: string | null;
  reviewed_at: string | null;
  reviewed_by: string | null;
  profiles?: Profile;
  offres?: Array<{
    id: string;
    titre: string;
    type: OffreType;
    structure_id: string | null;
  }>;
};

export type ValidationType =
  | "presence_evenement"
  | "confirmation_candidature";

export const OFFRE_TYPES: Record<OffreType, string> = {
  formation: "Formation",
  stage: "Stage",
  emploi: "Emploi",
  concours: "Concours",
  bootcamp: "Bootcamp",
};

export const PILIERS: Record<string, string> = {
  AG: "Agriculture",
  ED: "Éducation",
  IT: "Numérique",
  EC: "Entrepreneuriat",
  SA: "Santé",
};

export const STATUT_CANDIDATURE: Record<CandidatureStatut, string> = {
  en_attente: "En attente",
  acceptee: "Acceptée",
  refusee: "Refusée",
};

export const NIVEAU_LANGUE: Record<string, string> = {
  debutant: "Débutant",
  intermediaire: "Intermédiaire",
  courant: "Courant",
  bilingue: "Bilingue",
};
