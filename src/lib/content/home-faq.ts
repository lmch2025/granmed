/** FAQ de la page d'accueil — partagée entre le rendu serveur (JSON-LD) et la vue client.
 * Module SANS 'use client' pour rester accessible côté serveur. */
export const HOME_FAQ: Record<'fr' | 'en', { q: string; a: string }[]> = {
  fr: [
    {
      q: 'Les jeux de Granmed sont-ils vraiment gratuits ?',
      a: 'Oui. Les 20 jeux de Granmed sont 100 % gratuits, sans inscription obligatoire, sans téléchargement et sans limite de parties. Le site est pensé pour que vous puissiez lancer une partie en quelques secondes, directement dans votre navigateur.',
    },
    {
      q: 'Faut-il créer un compte pour sauvegarder ses scores ?',
      a: 'Non. Vos records, succès, favoris et défis quotidiens sont sauvegardés automatiquement sur votre appareil (stockage local du navigateur). Aucune donnée personnelle n’est collectée. Une synchronisation entre appareils pourra être ajoutée plus tard, en option.',
    },
    {
      q: 'Les jeux fonctionnent-ils sur téléphone et tablette ?',
      a: 'Oui, tous les jeux sont conçus d’abord pour les écrans tactiles : zones de contact suffisamment grandes, commandes simples et interfaces lisibles. Ils fonctionnent aussi à la souris et au clavier sur ordinateur.',
    },
    {
      q: 'Granmed existe-t-il en anglais ?',
      a: 'Oui, la plateforme est entièrement bilingue français/anglais. Chaque jeu possède ses propres textes, règles, dictionnaires et mots du jour dans chaque langue. Vous pouvez changer de langue à tout moment via le sélecteur en haut de page.',
    },
    {
      q: 'Les contenus santé du site sont-ils fiables ?',
      a: 'Les affirmations du jeu Vrai ou Faux s’appuient sur des sources publiques reconnues (OMS, institutions nationales de santé). Elles sont fournies à titre informatif et ludique : elles ne remplacent jamais l’avis d’un professionnel de santé.',
    },
    {
      q: 'Comment fonctionnent les défis quotidiens ?',
      a: 'Chaque jour, un jeu est mis à l’honneur avec un défi spécial renouvelé chaque matin : grille du jour au memory, mot du jour, série de quiz… Réussir un défi vous rapporte un bonus d’XP et fait grandir votre série de jours consécutifs.',
    },
    {
      q: 'Que signifie le niveau et les XP de mon parcours ?',
      a: 'Chaque partie, victoire, record et défi quotidien vous rapporte des points d’expérience (XP) qui font monter votre niveau. Ces statistiques sont ludiques : elles reflètent votre assiduité et vos progrès dans les jeux, sans prétendre mesurer vos capacités cognitives.',
    },
  ],
  en: [
    {
      q: 'Are Granmed’s games really free?',
      a: 'Yes. All 20 Granmed games are 100% free, with no mandatory sign-up, no download and no play limits. The site is designed so you can start a game within seconds, straight in your browser.',
    },
    {
      q: 'Do I need an account to save my scores?',
      a: 'No. Your records, achievements, favorites and daily challenges are automatically saved on your device (browser local storage). No personal data is collected. Optional cross-device sync may be added later.',
    },
    {
      q: 'Do the games work on phones and tablets?',
      a: 'Yes, every game is designed touch-first: large touch targets, simple controls and readable interfaces. They also work with mouse and keyboard on desktop.',
    },
    {
      q: 'Is Granmed available in English?',
      a: 'Yes, the platform is fully bilingual French/English. Each game has its own texts, rules, dictionaries and daily words in each language. You can switch languages at any time using the selector at the top of the page.',
    },
    {
      q: 'Is the health content reliable?',
      a: 'The True or False game statements rely on recognized public sources (WHO, national health institutions). They are provided for information and fun: they never replace advice from a healthcare professional.',
    },
    {
      q: 'How do daily challenges work?',
      a: 'Every day, one game is featured with a special challenge refreshed each morning: memory grid of the day, daily word, quiz series… Completing a challenge earns bonus XP and grows your consecutive-day streak.',
    },
    {
      q: 'What do the level and XP in my journey mean?',
      a: 'Every game, win, record and daily challenge earns experience points (XP) that raise your level. These statistics are playful: they reflect your attendance and progress in the games, not your cognitive abilities.',
    },
  ],
}
