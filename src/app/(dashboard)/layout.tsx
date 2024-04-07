import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getMembership, isFonijAdmin } from "@/lib/auth";
import Sidebar from "@/components/sidebar";
import Header from "@/components/header";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const membership = await getMembership();
  if (!membership) redirect("/login?error=acces");

  return (
    <div className="flex min-h-screen">
      <Sidebar isAdmin={isFonijAdmin(membership)} />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          orgName={membership.organisations?.nom ?? "Organisation"}
          orgType={membership.organisations?.type ?? "structure"}
          email={user.email ?? ""}
        />
        <main className="flex-1 px-6 py-6">{children}</main>
      </div>
    </div>
  );
}
