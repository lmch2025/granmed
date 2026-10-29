import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Fredoka, Nunito } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const display = Fredoka({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const body = Nunito({
  variable: "--font-body",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SITE_URL = "https://www.granmed.store";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Granmed — Jeux de QI gratuits : testez et entraînez votre intelligence",
    template: "%s | Granmed",
  },
  description:
    "20 jeux de QI gratuits en ligne : mémoire, logique, calcul mental, mots et réflexes. Chaque partie révèle votre QI estimé et votre niveau d'intelligence — rejouez pour l'élever. Free IQ games & brain training, FR/EN.",
  keywords: [
    "jeux de QI",
    "test de QI gratuit",
    "test d'intelligence gratuit",
    "QI moyen",
    "jeux de réflexion gratuits",
    "jeux de logique",
    "jeux de mémoire",
    "entraînement cérébral",
    "calcul mental",
    "améliorer sa mémoire",
    "stimuler son cerveau",
    "jeux cérébraux",
    "free IQ test",
    "IQ games",
    "brain games",
    "brain training",
    "memory games",
    "logic games",
    "mind games",
    "increase IQ",
    "cognitive training",
  ],
  authors: [{ name: "Granmed" }],
  creator: "Granmed",
  publisher: "Granmed",
  applicationName: "Granmed",
  category: "games",
  icons: {
    icon: [
      {
        url:
          "data:image/svg+xml," +
          encodeURIComponent(
            '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><rect width="64" height="64" rx="16" fill="#e2725b"/><path d="M32 52c-12-5.8-20-14.8-20-25.4C12 18.6 20 12 27.2 12c2.7 0 4.8 1 4.8 1s2.1-1 4.8-1C44 12 52 18.6 52 26.6 52 37.2 44 46.2 32 52Z" fill="#fff7ed"/><path d="M32 43v-13m0 0c0-4.8 4.2-8 9-8 0 5-4 8-9 8Zm0 3.2c0-4.2-3.6-7.4-8-7.4 0 4.6 3.6 7.4 8 7.4Z" stroke="#c2410c" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>'
          ),
        type: "image/svg+xml",
      },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "Granmed",
    statusBarStyle: "default",
  },
  alternates: {
    canonical: "/",
    languages: {
      fr: "/?lang=fr",
      en: "/?lang=en",
      "x-default": "/",
    },
  },
  openGraph: {
    type: "website",
    siteName: "Granmed",
    title: "Granmed — 20 jeux de QI gratuits en ligne",
    description:
      "Mémoire, logique, calcul mental, réflexes… Chaque partie révèle votre QI estimé et votre niveau d'intelligence, du Novice au Génie. Jouez gratuitement, sans inscription. FR/EN. Free IQ games & brain training.",
    url: SITE_URL,
    images: [{ url: "/images/og-granmed.png", width: 1344, height: 768, alt: "Granmed — jeux de QI et entraînement cérébral gratuits" }],
    locale: "fr_FR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Granmed — 20 jeux de QI gratuits en ligne",
    description:
      "Chaque partie révèle votre QI estimé. Mémoire, logique, calcul mental : jouez gratuitement, sans inscription. FR/EN.",
    images: ["/images/og-granmed.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf5ee" },
    { media: "(prefers-color-scheme: dark)", color: "#211712" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const PWA_EARLY_CAPTURE = `(function(){try{var W=window;W.__granmedPwa={bip:null,dismissed:W.sessionStorage.getItem('granmed:pwa-dismissed')==='1',standalone:W.matchMedia('(display-mode: standalone)').matches||W.navigator.standalone===true,installed:false,showAfter:0};W.addEventListener('beforeinstallprompt',function(e){e.preventDefault();var s=W.__granmedPwa;s.bip=e;if(!s.showAfter)s.showAfter=Date.now()+2600;});W.addEventListener('appinstalled',function(){var s=W.__granmedPwa;if(s){s.bip=null;s.installed=true;}});}catch(e){}})();`;

/* SEO : la version anglaise dédiée (?lang=en) porte <html lang="en"> avant même l'hydratation. */
const LANG_EARLY = `(function(){try{if(new URLSearchParams(window.location.search).get('lang')==='en')document.documentElement.lang='en';}catch(e){}})();`;

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  /* Task 22 (audit ultime SEO/GEO/AIO) : <html lang> correct dans le HTML BRUT —
     le proxy (src/proxy.ts) propage `?lang` en en-tête `x-granmed-lang`, lisible ici via
     headers(). Les crawlers sans JavaScript (GPTBot, ClaudeBot, PerplexityBot…)
     voient la déclaration de langue exacte sur `/?lang=en`. LANG_EARLY demeure
     en ceinture de sécurité côté client. */
  const lang = (await headers()).get("x-granmed-lang") === "en" ? "en" : "fr";

  return (
    <html lang={lang} suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} antialiased bg-background text-foreground`}>
        {/* PWA : capture précoce de beforeinstallprompt avant l'hydratation React. */}
        <script dangerouslySetInnerHTML={{ __html: PWA_EARLY_CAPTURE }} />
        {/* SEO : langue correcte sur /?lang=en dès le HTML brut (crawlers sans JS). */}
        <script dangerouslySetInnerHTML={{ __html: LANG_EARLY }} />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
