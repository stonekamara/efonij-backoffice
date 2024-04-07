import DemandeForm from "@/components/demande-form";

export const metadata = {
  title: "Demander l'accès · E-FONIJ Back-office",
};

export default function DemandeInscriptionPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-fonij-dark via-fonij to-fonij-light px-4 py-10">
      <div className="w-full max-w-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-fonij-accent text-2xl font-black text-fonij-dark">
            E
          </div>
          <h1 className="text-2xl font-extrabold text-white">
            Demander l&apos;accès au back-office
          </h1>
          <p className="mx-auto mt-1 max-w-md text-sm text-white/70">
            Structure partenaire ou entreprise : créez votre demande. Elle sera
            validée par l&apos;administrateur FONIJ.
          </p>
        </div>

        <DemandeForm />

        <p className="mt-5 text-center text-sm text-white/70">
          Une fois validée, votre organisation pourra se connecter depuis
          l&apos;espace dédié indiqué par le FONIJ.
        </p>
      </div>
    </div>
  );
}
