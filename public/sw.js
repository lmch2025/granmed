/* GRANMED.STORE — Service Worker PWA
 * Stratégie offline-first robuste :
 *  - navigation : network-first → cache → shell « / » (jamais de page blanche)
 *  - assets immuables (/_next/static, /sounds, /images, /icons…) : cache-first
 *  - autres GET same-origin : stale-while-revalidate
 *  - mode « volatile » (dev : /sw.js?volatile=1) : AUCUNE interception fetch,
 *    afin de ne jamais interférer avec le HMR/Fast Refresh de Turbopack.
 */
const VERSION = "v1.0.0";
const CORE_CACHE = `granmed-core-${VERSION}`;
const RUNTIME_CACHE = `granmed-runtime-${VERSION}`;
const VOLATILE = new URLSearchParams(self.location.search).has("volatile");

const CORE_ASSETS = [
  "/",
  "/manifest.webmanifest",
  "/logo.svg",
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/icon-maskable-192.png",
  "/icons/icon-maskable-512.png",
];

self.addEventListener("install", (event) => {
  if (VOLATILE) {
    self.skipWaiting();
    return;
  }
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CORE_CACHE);
      await Promise.allSettled(CORE_ASSETS.map((url) => cache.add(url)));
      await self.skipWaiting();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("granmed-") && !k.endsWith(VERSION))
          .map((k) => caches.delete(k))
      );
      await self.clients.claim();
    })()
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "SKIP_WAITING") self.skipWaiting();
});

/* ---------- Stratégies (production uniquement) ---------- */

function isImmutableAsset(pathname) {
  return (
    pathname.startsWith("/_next/static/") ||
    pathname.startsWith("/sounds/") ||
    pathname.startsWith("/images/") ||
    pathname.startsWith("/icons/") ||
    pathname === "/logo.svg" ||
    pathname === "/manifest.webmanifest"
  );
}

async function cacheFirst(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok) {
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
  }
  return response;
}

async function networkFirstNavigation(request) {
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      const cache = await caches.open(CORE_CACHE);
      cache.put("/", fresh.clone());
    }
    return fresh;
  } catch {
    const cached = (await caches.match(request)) || (await caches.match("/"));
    if (cached) return cached;
    return new Response(
      "<!doctype html><meta charset=utf-8><title>Hors ligne</title><p style=\"font-family:system-ui;padding:2rem\">Granmed est hors ligne — rouvrez l'application dès le retour du réseau.</p>",
      { status: 503, headers: { "Content-Type": "text/html; charset=utf-8" } }
    );
  }
}

async function staleWhileRevalidate(request) {
  const cached = await caches.match(request);
  const network = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);
  return cached || (await network) || new Response("", { status: 504 });
}

if (!VOLATILE) {
  self.addEventListener("fetch", (event) => {
    const { request } = event;
    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (url.pathname.startsWith("/api/")) return;

    if (request.mode === "navigate") {
      event.respondWith(networkFirstNavigation(request));
      return;
    }
    if (isImmutableAsset(url.pathname)) {
      event.respondWith(cacheFirst(request));
      return;
    }
    event.respondWith(staleWhileRevalidate(request));
  });
}
