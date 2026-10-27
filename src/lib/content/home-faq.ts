/** FAQ de la page d'accueil — partagée entre le rendu serveur (JSON-LD) et la vue client.
 * Module SANS 'use client' pour rester accessible côté serveur. */
export const HOME_FAQ: Record<'fr' | 'en', { q: string; a: string }[]> = {
  fr: [
    {
      q: 'Granmed propose-t-il un test de QI gratuit ?',
      a: 'Oui, à chaque partie. Les 20 jeux de Granmed calculent un QI estimé gratuit à partir de votre performance réelle : précision, rapidité et difficulté. Le résultat s’affiche sur l’échelle classique du QI (moyenne 100, écart-type 15) avec un niveau d’intelligence, du Novice au Génie. C’est une estimation ludique de votre performance au jeu — pas un test de QI clinique — et rejouer est le meilleur moyen de l’élever.',
    },
    {
      q: 'Comment est calculé mon QI estimé ?',
      a: 'Trois dimensions mesurées pendant la partie entrent dans le calcul : la précision (réussites rapportées aux tentatives), la rapidité (temps réel comparé au temps attendu du défi) et la difficulté (taille de la grille, mode ou niveau choisi). La formule ramène le résultat sur l’échelle de Wechsler (moyenne 100, écart-type 15) : une manche parfaite, rapide et difficile culmine vers 141, le niveau Génie.',
    },
    {
      q: 'Quel est le QI moyen ?',
      a: 'Par construction, le QI moyen est de 100 : sur l’échelle de Wechsler, environ 68 % des personnes se situent entre 85 et 115, et environ 95 % entre 70 et 130. Sur Granmed, un QI estimé entre 90 et 110 correspond donc à une partie solide ; dépasser 125 vous place dans le top 5 % des performances du jeu. La progression vient avec l’entraînement : mémoire, logique et rapidité se travaillent en rejouant.',
    },
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
      q: 'Does Granmed offer a free IQ test?',
      a: 'Yes, with every game. Granmed’s 20 games compute a free estimated IQ from your actual performance: accuracy, speed and difficulty. The result is shown on the classic IQ scale (mean 100, standard deviation 15) along with an intelligence level, from Novice to Genius. It is a playful estimate of your performance at the game — not a clinical IQ test — and replaying is the best way to raise it.',
    },
    {
      q: 'How is my estimated IQ calculated?',
      a: 'Three dimensions measured during the round feed the calculation: accuracy (successes relative to attempts), speed (actual time compared to the expected time of the challenge) and difficulty (grid size, mode or level chosen). The formula maps the result onto the Wechsler scale (mean 100, standard deviation 15): a flawless, fast, hard round peaks at 141, the Genius level.',
    },
    {
      q: 'What is the average IQ?',
      a: 'By construction, the average IQ is 100: on the Wechsler scale, about 68% of people score between 85 and 115, and about 95% between 70 and 130. On Granmed, an estimated IQ between 90 and 110 therefore reflects a solid round; above 125 you land in the top 5% of game performances. Progress comes with training: memory, logic and speed improve as you replay.',
    },
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
