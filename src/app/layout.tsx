import type { Metadata, Viewport } from "next";
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

const SITE_URL = "https://granmed.store";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Granmed — Jeux gratuits en ligne : mémoire, puzzles, mots et réflexes",
    template: "%s | Granmed",
  },
  description:
    "20 jeux gratuits sans téléchargement : mémoire, sudoku, 2048, mots, quiz santé et réflexes. Défis quotidiens, succès et records personnels. Jouez en français ou en anglais.",
  keywords: [
    "jeux gratuits",
    "jeu de mémoire gratuit",
    "sudoku gratuit en ligne",
    "démineur en ligne",
    "2048",
    "jeu de mots gratuit",
    "jeu de calcul mental",
    "puzzle gratuit en ligne",
    "jeu de réflexes",
    "free online games",
    "free memory game",
    "online brain games",
    "free online sudoku",
    "minesweeper online",
    "daily word game",
    "block puzzle game",
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
    ],
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
    title: "Granmed — 20 jeux gratuits en ligne",
    description:
      "Mémoire, sudoku, mots, réflexes, puzzles… Jouez gratuitement dans votre navigateur, sans inscription. Défis quotidiens, succès et records. FR/EN.",
    url: SITE_URL,
    images: [{ url: "/images/og-granmed.png", width: 1200, height: 630, alt: "Granmed — portail de jeux gratuits" }],
    locale: "fr_FR",
    alternateLocale: ["en_US"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Granmed — 20 jeux gratuits en ligne",
    description: "Mémoire, sudoku, mots, réflexes : jouez gratuitement, sans inscription. FR/EN.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${display.variable} ${body.variable} antialiased bg-background text-foreground`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
