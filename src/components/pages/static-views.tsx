'use client'

import { ChevronRight, ShieldCheck, HeartHandshake, Languages, Gamepad2 } from 'lucide-react'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { GAMES } from '@/lib/games/catalog'
import { Button } from '@/components/ui/button'
import { HashLink } from '@/components/shared/hash-link'

const ABOUT_TEXT: Record<'fr' | 'en', { p: string[] }> = {
  fr: {
    p: [
      "Granmed est un portail international de jeux gratuits sur navigateur, bilingue français/anglais, dédié au divertissement, à l'entraînement cérébral et à la détente. Notre promesse tient en trois mots : Play (des jeux amusants, immédiatement accessibles, sans téléchargement), Challenge (défis quotidiens, records personnels et niveaux progressifs) et Relax (animations fluides, sons immersifs et interfaces adaptées à tous les âges).",
      "Le portail réunit 20 jeux originaux répartis en quatre familles : mémoire et entraînement cérébral, puzzles et logique, adresse et réflexes, mots et culture. Chaque jeu possède sa propre identité, son propre moteur et ses propres règles — vous pouvez passer d'un sudoku zen à une partie de découpe de fruits sans jamais quitter le site.",
      "Granmed est pensé pour être joué sans contrainte : pas de compte obligatoire, pas de limite de parties, sauvegarde automatique de votre progression sur votre appareil, et changement de langue à tout moment. Vos records, succès et favoris vous suivent localement, en toute confidentialité.",
      "Les contenus touchant à la santé (jeu Vrai ou Faux, Mot du Jour Santé) sont rédigés à titre informatif à partir de sources publiques reconnues telles que l'Organisation mondiale de la santé et les institutions nationales de santé. Ils ne remplacent en aucun cas l'avis d'un professionnel de santé et ne présentent aucun remède comme un traitement démontré sans preuves suffisantes.",
      "Nos effets sonores proviennent de bibliothèques libres de droits (Mixkit et autres plateformes autorisant la réutilisation) ; les illustrations sont originales. L'ensemble du portail est développé avec Next.js et TypeScript, avec un soin particulier porté aux performances, à l'accessibilité et au référencement naturel.",
    ],
  },
  en: {
    p: [
      "Granmed is an international portal of free browser games, bilingual French/English, devoted to entertainment, brain training and relaxation. Our promise fits in three words: Play (fun games, instantly accessible, no download), Challenge (daily challenges, personal bests and progressive levels) and Relax (smooth animations, immersive sounds and interfaces suitable for all ages).",
      "The portal gathers 20 original games in four families: memory & brain training, puzzles & logic, skill & reflexes, and words & culture. Every game has its own identity, its own engine and its own rules — you can switch from a zen sudoku to a fruit-slicing session without ever leaving the site.",
      "Granmed is built to be played without friction: no mandatory account, no play limits, automatic progress saving on your device, and language switching at any time. Your records, achievements and favorites follow you locally, with full privacy.",
      "Health-related content (True or False game, Daily Word) is written for information purposes from recognized public sources such as the World Health Organization and national health institutions. It never replaces advice from a healthcare professional and never presents any remedy as a proven treatment without sufficient evidence.",
      "Our sound effects come from royalty-free libraries (Mixkit and other platforms allowing reuse); the illustrations are original. The whole portal is built with Next.js and TypeScript, with special care for performance, accessibility and search engine optimization.",
    ],
  },
}

export function AboutView() {
  const t = useT()
  const lang = useLang()

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1">
          <li>
            <HashLink view={{ type: 'home' }} className="rounded px-1 py-0.5 text-inherit hover:text-primary hover:underline">
              {t('nav.home')}
            </HashLink>
          </li>
          <li aria-hidden="true" className="flex items-center"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li aria-current="page" className="font-medium text-foreground">{t('nav.about')}</li>
        </ol>
      </nav>

      <header className="mb-6">
        <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">Granmed · {t('nav.about')}</h1>
        <p className="mt-2 text-muted-foreground">{t('brand.tagline')}</p>
      </header>

      <div className="space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {ABOUT_TEXT[lang].p.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border bg-card p-5">
          <Gamepad2 className="h-6 w-6 text-primary" aria-hidden="true" />
          <h2 className="mt-3 font-display font-bold">20 {t('common.games')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {GAMES.map((g) => g.title[lang].split('—')[0].trim()).slice(0, 6).join(' · ')}…
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <Languages className="h-6 w-6 text-amber-500" aria-hidden="true" />
          <h2 className="mt-3 font-display font-bold">Français · English</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === 'fr' ? 'Chaque jeu possède ses textes et dictionnaires propres dans chaque langue.' : 'Every game has its own texts and dictionaries in each language.'}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <ShieldCheck className="h-6 w-6 text-emerald-500" aria-hidden="true" />
          <h2 className="mt-3 font-display font-bold">{t('footer.privacy')}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === 'fr' ? 'Stockage 100 % local, aucune donnée personnelle collectée.' : '100% local storage, no personal data collected.'}
          </p>
        </div>
        <div className="rounded-2xl border bg-card p-5">
          <HeartHandshake className="h-6 w-6 text-rose-500" aria-hidden="true" />
          <h2 className="mt-3 font-display font-bold">{lang === 'fr' ? 'Jeu honnête' : 'Honest play'}</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {lang === 'fr' ? 'Pas de mécanismes de rétention artificiels ni de publicités intrusives.' : 'No artificial retention mechanics, no intrusive ads.'}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Button size="lg" className="rounded-full" asChild>
          <HashLink view={{ type: 'home' }} sound={null} onNavigate={() => sfx.play('pop')}>
            {t('common.playNow')}
          </HashLink>
        </Button>
      </div>
    </div>
  )
}

const LEGAL_TEXT: Record<'privacy' | 'terms', Record<'fr' | 'en', { title: string; p: string[] }>> = {
  privacy: {
    fr: {
      title: 'Confidentialité',
      p: [
        "Granmed fonctionne sans compte utilisateur. Votre progression (records, succès, favoris, défis quotidiens, paramètres) est enregistrée exclusivement dans le stockage local de votre navigateur, sur votre appareil. Elle n'est transmise à aucun serveur.",
        "Aucune donnée nominative (nom, e-mail, numéro de téléphone) n'est demandée ni collectée par Granmed pour jouer.",
        "Pour financer l'accès gratuit aux 20 jeux, Granmed diffuse des annonces via Google AdSense. En tant que fournisseur tiers, Google utilise des cookies pour diffuser des annonces sur ce site en fonction de vos visites antérieures sur Granmed ou sur d'autres sites web.",
        "Vous pouvez à tout moment désactiver la publicité personnalisée en consultant les Paramètres des annonces Google (https://adssettings.google.com) ou via la plateforme www.aboutads.info, et gérer vos préférences de cookies directement dans les réglages de votre navigateur.",
        "Vous pouvez également effacer l'intégralité de votre progression locale à tout moment grâce au bouton « Réinitialiser mon profil » dans Mon parcours, ou en vidant le stockage de votre navigateur.",
      ],
    },
    en: {
      title: 'Privacy',
      p: [
        "Granmed works without user accounts. Your progress (records, achievements, favorites, daily challenges, settings) is stored exclusively in your browser's local storage, on your device. It is never sent to any server.",
        "No personally identifiable information (name, email, phone number) is requested or collected by Granmed to play.",
        "To keep all 20 games free to play, Granmed displays advertisements via Google AdSense. As a third-party vendor, Google uses cookies to serve ads on this site based on your prior visits to Granmed or other websites.",
        "You may opt out of personalized advertising at any time by visiting Google Ads Settings (https://adssettings.google.com) or www.aboutads.info, and manage your cookie preferences directly in your browser settings.",
        "You can also erase all your local game data at any time using the “Reset my profile” button in My journey, or by clearing your browser storage.",
      ],
    },
  },
  terms: {
    fr: {
      title: 'Mentions légales',
      p: [
        "Granmed est un portail de jeux gratuit fourni « en l'état », à des fins de divertissement et d'entraînement ludique.",
        "Les jeux, textes, illustrations et l'identité sonore du site sont protégés. Les effets sonores proviennent de bibliothèques libres de droits et les illustrations sont originales ; toute réutilisation non autorisée est interdite.",
        "Les contenus santé du site (affirmations du jeu Vrai ou Faux, mot du jour Santé) sont informatifs, rédigés à partir de sources publiques reconnues. Ils ne constituent pas un avis médical et ne remplacent jamais la consultation d'un professionnel de santé. Aucun élément du site ne doit être interprété comme une recommandation de traitement.",
        "Le site peut évoluer : de nouveaux jeux, fonctionnalités ou contenus peuvent être ajoutés, modifiés ou retirés. Les scores et statistiques affichés sont ludiques et ne mesurent pas les capacités cognitives réelles des joueurs.",
        "Pour toute question relative au site, utilisez les pages d'aide et la FAQ intégrées.",
      ],
    },
    en: {
      title: 'Terms',
      p: [
        "Granmed is a free games portal provided “as is”, for entertainment and playful training purposes.",
        "The site's games, texts, illustrations and sound identity are protected. Sound effects come from royalty-free libraries and illustrations are original; unauthorized reuse is prohibited.",
        "Health content on the site (True or False statements, daily health word) is informational, written from recognized public sources. It does not constitute medical advice and never replaces consulting a healthcare professional. Nothing on the site should be interpreted as a treatment recommendation.",
        "The site may evolve: new games, features or content may be added, changed or removed. Scores and statistics displayed are playful and do not measure players' real cognitive abilities.",
        "For any question about the site, use the help pages and the built-in FAQ.",
      ],
    },
  },
}

export function LegalView({ doc }: { doc: 'privacy' | 'terms' }) {
  const t = useT()
  const lang = useLang()
  const c = LEGAL_TEXT[doc][lang]

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-16 pt-6 sm:px-6">
      <nav aria-label="Breadcrumb" className="mb-4 text-sm text-muted-foreground">
        <ol className="flex items-center gap-1">
          <li>
            <HashLink view={{ type: 'home' }} className="rounded px-1 py-0.5 text-inherit hover:text-primary hover:underline">
              {t('nav.home')}
            </HashLink>
          </li>
          <li aria-hidden="true" className="flex items-center"><ChevronRight className="h-3.5 w-3.5" /></li>
          <li aria-current="page" className="font-medium text-foreground">{c.title}</li>
        </ol>
      </nav>

      <h1 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl">{c.title}</h1>
      <div className="mt-6 space-y-4 text-sm leading-relaxed text-foreground/90 sm:text-base">
        {c.p.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>
      <p className="mt-8 text-xs text-muted-foreground">
        {lang === 'fr' ? 'Dernière mise à jour : 2026-11-06' : 'Last updated: 2026-11-06'}
      </p>
    </div>
  )
}

export function NotFoundView() {
  const t = useT()
  return (
    <div className="mx-auto flex max-w-2xl flex-col items-center px-4 py-20 text-center">
      <span className="text-6xl anim-floaty" aria-hidden="true">🍂</span>
      <h1 className="mt-6 font-display text-3xl font-extrabold">{t('misc.notFound')}</h1>
      <p className="mt-2 text-muted-foreground">{t('misc.notFoundSub')}</p>
      <Button size="lg" className="mt-6 rounded-full" asChild>
        <HashLink view={{ type: 'home' }} sound={null} onNavigate={() => sfx.play('pop')}>
          {t('misc.backHome')}
        </HashLink>
      </Button>
    </div>
  )
}
