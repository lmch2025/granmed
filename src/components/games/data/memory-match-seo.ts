import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue de Memory Match (Task 27 — double vérification Task 26).
 * Extrait du composant en données PURES (aucune directive « use client », aucun
 * import de module client) : ce fichier est réellement double-usage — importable
 * par le serveur (rendu du HTML brut des pages jeu réelles, src/lib/games/
 * content-registry.ts) comme par le composant client du jeu, à la manière du
 * catalogue. Source de vérité unique : zéro duplication, zéro dérive.
 */
export const memoryMatchSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Retrouvez toutes les paires de cartes le plus efficacement possible : chaque grille révèle votre QI estimé, sur 5 thèmes et 4 tailles.',
    en: 'Find every matching pair as efficiently as you can: each grid reveals your estimated IQ, across 5 themes and 4 grid sizes.',
  },
  description: {
    fr: [
      "Memory Match est un jeu de mémoire gratuit en ligne dans lequel vous retournez des cartes face cachée pour retrouver les paires identiques. Chaque carte révèle un fruit, une fleur, un animal ou un souvenir rétro ; à vous de mémoriser leurs positions pour les apparier en un minimum de coups.",
      "Le jeu propose cinq thèmes (fruits, nature, nutrition, animaux et souvenirs rétro) et quatre grilles de difficulté croissante, de 6 paires (4×3) à 15 paires (6×5). Un chronomètre facultatif, un compteur de coups et des records personnels sauvegardés permettent de mesurer vos progrès. En fin de partie, un QI estimé — calculé à partir de votre précision, de votre rapidité et de la taille de la grille — vous attribue un niveau d'intelligence, du Novice au Génie, à élever en rejouant.",
      "Chaque matin, une grille spéciale attend les joueurs réguliers : le défi du jour de Memory Match, identique pour tous, qui alimente votre série de jours consécutifs et rapporte un bonus d'XP à votre parcours Granmed.",
    ],
    en: [
      "Memory Match is a free online memory game where you flip face-down cards to find identical pairs. Each card reveals a fruit, a flower, an animal or a retro memory; your job is to memorize their positions and match them in as few moves as possible.",
      "The game offers five themes (fruits, nature, nutrition, animals and retro memories) and four grids of increasing difficulty, from 6 pairs (4×3) up to 15 pairs (6×5). An optional timer, a move counter and saved personal bests let you track your progress. At the end of each round, an estimated IQ — computed from your accuracy, speed and grid size — assigns you an intelligence level, from Novice to Genius, to raise as you replay.",
      "Every morning, a special grid awaits regular players: the Memory Match daily challenge, identical for everyone, which feeds your consecutive-day streak and earns bonus XP for your Granmed journey.",
    ],
  },
  rules: {
    fr: [
      'Choisissez un thème et une taille de grille, puis lancez la partie.',
      'Touchez ou cliquez sur deux cartes pour les retourner.',
      'Si les deux cartes sont identiques, la paire reste découverte.',
      'Sinon, elles se retournent à nouveau : mémorisez leurs positions.',
      'La partie est gagnée lorsque toutes les paires sont découvertes.',
      'Réussissez la grille avec le moins de coups possible — et, pour les experts, sans aucune erreur.',
    ],
    en: [
      'Pick a theme and a grid size, then start the game.',
      'Tap or click two cards to flip them.',
      'If the two cards match, the pair stays revealed.',
      'Otherwise they flip back — memorize their positions.',
      'You win when every pair has been discovered.',
      'Aim to clear the grid in as few moves as possible — and, for experts, without a single mistake.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez une carte pour la retourner.',
      'Ordinateur : cliquez sur les cartes, ou naviguez avec Tab puis validez avec Entrée.',
      'Activez ou désactivez le chronomètre avec l’interrupteur dédié.',
    ],
    en: [
      'Mobile & tablet: tap a card to flip it.',
      'Desktop: click cards, or navigate with Tab and confirm with Enter.',
      'Turn the timer on or off with the dedicated switch.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '5 thèmes : fruits, nature, nutrition, animaux et souvenirs rétro',
      '4 tailles de grille : 6, 8, 12 ou 15 paires',
      'Chronomètre facultatif et compteur de coups',
      'Records personnels par taille de grille',
      'Défi quotidien avec grille spéciale',
      'Animations fluides et sons satisfaisants',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '5 themes: fruits, nature, nutrition, animals and retro memories',
      '4 grid sizes: 6, 8, 12 or 15 pairs',
      'Optional timer and move counter',
      'Personal bests per grid size',
      'Daily challenge with a special grid',
      'Smooth animations and satisfying sounds',
    ],
  },
  tips: {
    fr: [
      'Commencez par retourner les cartes d’une même zone (une rangée ou une colonne) : vous mémoriserez mieux des positions groupées.',
      'Nommez chaque carte à voix haute ou dans votre tête (« fraise, en haut à gauche ») : le langage ancre la mémoire visuelle.',
      'Sur les grandes grilles, utilisez la première passe pour repérer les paires faciles, puis concentrez-vous sur les positions incertaines.',
      'Le chronomètre désactivé est parfait pour s’entraîner ; activez-le quand vous visez le record de vitesse.',
    ],
    en: [
      'Start by flipping cards within one zone (a row or column): grouped positions are easier to memorize.',
      'Name each card out loud or in your head (“strawberry, top left”): language anchors visual memory.',
      'On large grids, use a first pass to spot easy pairs, then focus on uncertain positions.',
      'With the timer off you can practice freely; switch it on when you go for the speed record.',
    ],
  },
  faq: {
    fr: [
      { q: 'Memory Match est-il vraiment gratuit ?', a: 'Oui : toutes les grilles, tous les thèmes et le défi quotidien sont accessibles gratuitement, sans inscription ni téléchargement.' },
      { q: 'Comment le score est-il calculé ?', a: 'Il n’y a pas de score à proprement parler : vos performances se mesurent en nombre de coups et en temps. Vos records par taille de grille sont sauvegardés sur votre appareil.' },
      { q: 'Quelle est la meilleure technique pour gagner ?', a: 'La technique la plus efficace consiste à toujours retourner une nouvelle carte dont vous cherchez la jumelle, plutôt que deux cartes inconnues : vous maximisez les informations à chaque coup.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé combine trois dimensions mesurées pendant la partie : la précision (paires trouvées par rapport aux coups joués), la rapidité (temps réel comparé au temps attendu de la grille) et la difficulté (taille de la grille). Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de mémoire — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour affûter votre mémoire.' },
      { q: 'La grille du défi du jour est-elle la même pour tous ?', a: 'Oui. La grille du jour est générée de façon déterministe à partir de la date : tous les joueurs affrontent exactement la même disposition jusqu’au lendemain matin.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui, le jeu est conçu pour le tactile : les cartes sont dimensionnées pour être touchées facilement, en portrait comme en paysage.' },
    ],
    en: [
      { q: 'Is Memory Match really free?', a: 'Yes: every grid, every theme and the daily challenge are free to play, with no sign-up and no download.' },
      { q: 'How is the score calculated?', a: 'There is no score as such: your performance is measured in moves and time. Your best results per grid size are saved on your device.' },
      { q: 'What is the best technique to win?', a: 'The most effective technique is to always flip one new card whose twin you are looking for, rather than two unknown cards: you maximize information with every move.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ combines three dimensions measured during the round: accuracy (pairs found relative to moves played), speed (actual time compared to the expected grid time) and difficulty (grid size). The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this memory game — not a clinical IQ test — and the best way to raise it is to keep playing to sharpen your memory.' },
      { q: 'Is the daily grid the same for everyone?', a: 'Yes. The daily grid is generated deterministically from the date: every player faces exactly the same layout until the next morning.' },
      { q: 'Can I play on my phone?', a: 'Yes, the game is touch-first: cards are sized for easy tapping, in portrait or landscape.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-moves-6': { fr: 'Coups — 6 paires', en: 'Moves — 6 pairs' },
    'best-moves-8': { fr: 'Coups — 8 paires', en: 'Moves — 8 pairs' },
    'best-moves-12': { fr: 'Coups — 12 paires', en: 'Moves — 12 pairs' },
    'best-moves-15': { fr: 'Coups — 15 paires', en: 'Moves — 15 pairs' },
    'best-time-6': { fr: 'Temps — 6 paires', en: 'Time — 6 pairs' },
    'best-time-8': { fr: 'Temps — 8 paires', en: 'Time — 8 pairs' },
    'best-time-12': { fr: 'Temps — 12 paires', en: 'Time — 12 pairs' },
    'best-time-15': { fr: 'Temps — 15 paires', en: 'Time — 15 pairs' },
  },
}
