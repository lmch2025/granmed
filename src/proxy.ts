import { NextResponse, type NextRequest } from "next/server";
import { GAMES } from "@/lib/games/catalog";

/**
 * GRANMED.STORE — proxy Next 16.
 *
 * Task 22 (audit ultime SEO/GEO/AIO) : propage `?lang` vers l'en-tête de
 * requête `x-granmed-lang` afin que le `<html lang>` soit correct DANS LE
 * HTML BRUT servi (src/app/layout.tsx). Les moteurs de réponse IA et une
 * partie des crawlers classiques n'exécutent PAS JavaScript (GPTBot,
 * ClaudeBot, PerplexityBot, OAI-SearchBot…) — GEO/AIO exige un langage
 * servi, pas calculé côté client.
 *
 * Task 26 (pages jeu individuelles indexables) : les 40 chemins réels
 * canoniques des jeux (`/fr/jeu-memory`, `/en/memory-match`…) sont réécrits
 * vers `/` — l'unique composant de page — en propageant `x-granmed-path`
 * pour que page.tsx serve les métadonnées DÉDIÉES au jeu (title, description,
 * keywords, canonical, hreflang, JSON-LD VideoGame + BreadcrumbList).
 * L'URL affichée reste le chemin réel ; un script précoce (page.tsx) y
 * superpose le hash du routeur AVANT l'hydratation. Les chemins non
 * canoniques (jeu inconnu, préfixe/langue incohérents) ne sont PAS
 * réécrits : Next sert un 404 légitime.
 */

/** Chemins réels canoniques des 20 jeux × 2 langues. */
const GAME_REAL_PATHS: Set<string> = new Set(
  GAMES.flatMap((g) => [`/fr/${g.paths.fr}`, `/en/${g.paths.en}`]),
);

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const headers = new Headers(request.headers);

  /* Task 26 — page jeu individuelle : réécriture vers `/`, métadonnées dédiées. */
  if (GAME_REAL_PATHS.has(pathname)) {
    headers.set("x-granmed-path", pathname);
    headers.set("x-granmed-lang", pathname.startsWith("/en/") ? "en" : "fr");
    return NextResponse.rewrite(new URL("/", request.url), { request: { headers } });
  }

  const lang =
    pathname === "/en" ||
    pathname.startsWith("/en/") ||
    request.nextUrl.searchParams.get("lang") === "en"
      ? "en"
      : "fr";
  headers.set("x-granmed-lang", lang);
  return NextResponse.next({ request: { headers } });
}

export const config = {
  // Tout sauf les fichiers statiques (aucune transformation nécessaire).
  matcher: [
    "/((?!_next/static|_next/image|icons|images|sounds|favicon.ico|logo.svg|manifest.webmanifest|robots.txt|sitemap.xml|llms.txt|llms-full.txt|ads.txt|googlec5dc6c64480779bb.html|sw.js).*)",
  ],
};
