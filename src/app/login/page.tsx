import { Suspense } from "react";
import LoginForm from "@/components/login-form";

export const metadata = {
  title: "Connexion · E-FONIJ Back-office",
  robots: { index: false, follow: false },
};

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-fonij-dark via-fonij to-fonij-light px-4">
      <div className="w-full max-w-md">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-fonij-accent text-2xl font-black text-fonij-dark">
            E
          </div>
          <h1 className="text-2xl font-extrabold text-white">E-FONIJ</h1>
          <p className="text-sm text-white/70">
            Back-office · Structures, entreprises et administration
          </p>
        </div>

        <Suspense fallback={<div className="h-64" />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
