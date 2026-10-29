import { NextResponse, type NextRequest } from "next/server";

/**
 * GRANMED.STORE — Task 22 (audit ultime SEO/GEO/AIO/PWA) — proxy Next 16.
 *
 * Propage `?lang` vers l'en-tête de requête `x-granmed-lang` afin que le
 * `<html lang>` soit correct DANS LE HTML BRUT servi (src/app/layout.tsx).
 *
 * Pourquoi : les moteurs de réponse IA et une partie des crawlers classiques
 * n'exécutent PAS JavaScript (GPTBot, ClaudeBot, PerplexityBot, OAI-SearchBot…).
 * Avant ce correctif, `/?lang=en` — URL canonique anglaise déclarée par le
 * sitemap et le cluster hreflang — était servie avec `<html lang="fr">`.
 * GEO/AIO exige un langage servi, pas calculé côté client.
 *
 * Coût : rend la route dynamique — elle l'est déjà (generateMetadata lit
 * searchParams). Aucun impact sur les assets statiques (exclus du matcher).
 */

export function proxy(request: NextRequest) {
  const lang = request.nextUrl.searchParams.get("lang") === "en" ? "en" : "fr";
  const headers = new Headers(request.headers);
  headers.set("x-granmed-lang", lang);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Tout sauf les fichiers statiques (aucune transformation nécessaire).
  matcher: [
    "/((?!_next/static|_next/image|icons|images|sounds|favicon.ico|logo.svg|manifest.webmanifest|robots.txt|sitemap.xml|llms.txt|sw.js).*)",
  ],
};
