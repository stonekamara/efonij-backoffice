import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

type SupabaseCookie = { name: string; value: string; options: CookieOptions };

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: SupabaseCookie[]) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;
  const isPublicPage =
    path === "/" ||
    path === "/login" ||
    path === "/demande-inscription" ||
    path === "/validation-en-attente";

  const redirect = (path: string, error?: string) => {
    const url = request.nextUrl.clone();
    url.pathname = path;
    if (error) url.searchParams.set("error", error);
    return NextResponse.redirect(url);
  };

  // Non connecté → seulement les pages publiques.
  if (!user) {
    if (isPublicPage) return response;
    return redirect("/login");
  }

  // Connecté sur une page publique → tableau de bord.
  if (isPublicPage) {
    if (path === "/validation-en-attente" && request.nextUrl.searchParams.get("error") === "acces") {
      return response;
    }
    return redirect("/tableau-de-bord");
  }

  // Connecté : vérifie l'appartenance et le statut de l'organisation.
  const { data: membership } = (await supabase
    .from("organisation_users")
    .select("id, organisations(statut)")
    .limit(1)
    .maybeSingle()) as {
    data: {
      id: string;
      organisations:
        | { statut: "en_attente" | "active" | "refusee" | null }
        | Array<{ statut: "en_attente" | "active" | "refusee" | null }>
        | null;
    } | null;
  };

  if (!membership) return redirect("/login", "acces");

  const statut = Array.isArray(membership.organisations)
    ? membership.organisations[0]?.statut
    : membership.organisations?.statut;

  if (statut === "en_attente") {
    return redirect("/validation-en-attente", "acces");
  }
  if (statut === "refusee") {
    return redirect("/login", "refuse");
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
