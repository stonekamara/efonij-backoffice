# E-FONIJ Back-office

Back-office web de la plateforme **E-FONIJ** (Passeport Jeune), connecté à la
**même base Supabase** que l'app Flutter « eFonij Jeunes » (dépôt séparé
**`efonij_jeunes`**).

Destiné à trois profils :

- **Admin FONIJ** (organisation `fonij`, rôle `admin`) : vue globale de la
  plateforme, création/suppression de structures, gestion des demandes, des
  communautés, des publications et des notifications.
- **Structures partenaires** : gestion de leurs offres, candidatures reçues,
  scan du QR code des jeunes, publications dans leurs communautés.
- **Entreprises** : même fonctionnement que les structures.

## Stack

- Next.js 15 (App Router) + TypeScript + Tailwind CSS
- Supabase (auth + Postgres + RLS) via `@supabase/ssr`
- `html5-qrcode` pour le scan caméra

## Variables d'environnement

Copiez `.env.example` vers `.env.local` et renseignez les valeurs :

| Variable                      | Description                              | Obligatoire |
| ----------------------------- | ---------------------------------------- | ----------- |
| `NEXT_PUBLIC_SUPABASE_URL`    | URL du projet Supabase                   | ✅          |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Clé publique anon du projet            | ✅          |
| `NEXT_PUBLIC_SITE_URL`        | URL publique du back-office (utilisée dans les notifications) | ❌ (défaut `http://localhost:3100`) |

## Installation & démarrage

```bash
cp .env.example .env.local   # renseigner URL + clé anon Supabase
npm install

# Développement
npm run dev                  # http://localhost:3000

# Production (build puis démarrage sur le port utilisé en dev)
npm run typecheck            # vérification TypeScript
npm run build
npm run start -- -p 3100     # http://localhost:3100

# Vérification de type seule
npm run typecheck
```

> 🔒 `.env.local` est ignoré par git : aucun secret ne doit être commité.

## Comptes

| Rôle        | Email             | Mot de passe | Droits                                    |
| ----------- | ----------------- | ------------ | ----------------------------------------- |
| Admin FONIJ | `admin@efonij.gn` | *(à définir)* | Tout voir, tout gérer                     |

Les comptes des **structures** ne sont plus créés manuellement : l'admin
FONIJ les crée depuis le menu **Structures** (nom, type, contact, email,
mot de passe) l'organisation est créée **active** et le compte rattaché
peut se connecter immédiatement.

> ⚠️ Changez les mots de passe avant toute mise en production.

## Routes

| Route                              | Description                                        |
| ---------------------------------- | -------------------------------------------------- |
| `/login`                           | Connexion                                          |
| `/` et `/tableau-de-bord`          | Statistiques globales (admin) / activité           |
| `/offres`                          | Liste des offres (filtrée par organisation)        |
| `/offres/nouvelle`                 | Création d'offre                                   |
| `/offres/[id]`                     | Édition d'offre                                    |
| `/offres/[id]/candidatures`        | Candidatures reçues : filtre par statut, revue du CV (panneau + PDF) |
| `/scan`                            | Scan du QR Passeport + validation (présence / candidature) |
| `/structures` (admin FONIJ)        | Création et suppression de structures              |
| `/demandes` (admin FONIJ)          | Demandes d'inscription des organisations (approbation/refus) |
| `/jeunes` (admin FONIJ)            | Liste complète des jeunes inscrits + recherche     |
| `/jeunes/[id]` (admin FONIJ)       | Fiche jeune : candidatures + CV + notification     |
| `/communautes` (admin FONIJ)       | Création / gestion des communautés                 |
| `/publications`                    | Publications des structures dans les communautés (modération) |
| `/notifications` (admin FONIJ)     | Envoi de notifications : individuel / groupe / tous |

## Fonctionnalités principales

### Structures (droit suprême admin FONIJ)
- **Création** : `creer_organisation_par_admin` crée l'organisation active +
  rattache le compte back-office (rôle `admin`).
- **Suppression** : `supprimer_organisation_par_admin` supprime en une
  transaction les offres, candidatures, communautés, publications, validations
  et **les comptes auth liés** (l'email devient réutilisable).
  L'organisation FONIJ elle-même ne peut pas être supprimée.
- Ces RPC sont `security definer` avec garde `is_fonij_admin()`.

### Candidatures & CV
Chaque jeune construit son CV dans l'app ; à chaque candidature, un snapshot
JSON + PDF est joint. Côté back-office : bouton **« Voir le CV »** (panneau
formaté + lien PDF), changement de statut tracé (`reviewed_at`,
`reviewed_by`), filtre par statut (`en_attente` par défaut).

### Notifications in-app
Envoi depuis `/jeunes/[id]` ou `/notifications` (réservé admin FONIJ).
Réception temps réel dans l'app (Supabase Realtime). Un trigger crée
automatiquement une notification détaillée au jeune quand sa candidature
change de statut (migration `0006_notifications_details.sql`).

### Scan QR
Le QR code de l'app encode `EFONIJ:{uuid_du_jeune}`. Après scan, le
back-office retrouve le profil et ses candidatures, puis insère une ligne
`validations` (badge « Présence validée / Candidature confirmée » dans l'app).

## Sécurité

- **Aucune clé en dur** : variables d'environnement uniquement.
- **Toutes les requêtes passent par la session utilisateur** (jamais de clé
  `service_role` côté navigateur) : les policies **RLS** de la base font foi.
- Chaque route protégée vérifie l'authentification **et** l'appartenance à
  une organisation (`organisation_users`).
- Un membre d'organisation ne peut insérer une validation que si la
  candidature concerne une offre **de son organisation** (policy RLS).

## Schéma de données

Les migrations SQL vivent dans le dépôt de l'app Flutter
(`efonij_jeunes/supabase/migrations/`) appliquez-les dans l'ordre
(`0001_init.sql` à `0012_admin_supprime_structures.sql`).

## Note déploiement

La caméra (page `/scan`, librairie `html5-qrcode`) exige un **contexte
sécurisé** : fonctionnel en `localhost`, mais **HTTPS obligatoire** en
production (Vercel le fournit par défaut).
