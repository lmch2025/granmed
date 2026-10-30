import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu 2048-nutrition (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const n2048NutritionSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Le 2048 classique habillé de fruits et de saveurs : glissez, fusionnez, atteignez la tuile 2048 — et révélez votre QI estimé.',
    en: 'The classic 2048 dressed in fruits and flavors: slide, merge, reach the 2048 tile — and reveal your estimated IQ.',
  },
  description: {
    fr: [
      '2048 Nutrition est un jeu de puzzle à glissements dans lequel vous déplacez des tuiles numérotées sur une grille 4×4 pour fusionner les valeurs identiques. Deux tuiles 2 deviennent une tuile 4, deux tuiles 4 deviennent une tuile 8… jusqu’à la fameuse tuile 2048 — et au-delà pour les experts.',
      'Le thème nutrition ne change rien aux mathématiques : les valeurs restent de pures puissances de 2, chaque tuile étant simplement illustrée par un aliment (2🍒, 4🍓, 8🍊, 16🍎… jusqu’à 2048🍉 et 8192🍯). Le score suit la règle classique : chaque fusion ajoute la valeur de la tuile créée. Quand la grille se bloque, un QI estimé — calculé à partir de la hauteur de votre meilleure tuile et de la difficulté — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Trois annulations de coup par partie, un mode Classique (chiffres) ou Thématique (aliments), un défi du jour identique pour tous les joueurs et une sauvegarde automatique permettent de jouer partout, en sessions courtes comme acharnées.',
    ],
    en: [
      '2048 Nutrition is a sliding-tile puzzle in which you move numbered tiles on a 4×4 grid to merge identical values. Two 2 tiles become a 4, two 4s become an 8… all the way to the famous 2048 tile — and beyond for experts.',
      'The nutrition theme changes nothing about the math: values stay pure powers of two, each tile simply illustrated with a food (2🍒, 4🍓, 8🍊, 16🍎… up to 2048🍉 and 8192🍯). The score follows the classic rule: each merge adds the value of the newly created tile. When the grid locks up, an estimated IQ — computed from the height of your best tile and the difficulty — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'Three move undos per game, a Classic (numbers) or Themed (foods) display mode, a daily challenge identical for every player and automatic saving let you play anywhere, in short or intense sessions.',
    ],
  },
  rules: {
    fr: [
      'Glissez dans une direction : toutes les tuiles coulissent jusqu’au bord possible.',
      'Deux tuiles de même valeur qui se rencontrent fusionnent en une tuile de valeur double.',
      'Après chaque coup réussi, une nouvelle tuile (2 ou 4) apparaît sur une case libre.',
      'La partie est gagnée lorsque vous créez la tuile 2048 — vous pouvez alors continuer de jouer.',
      'La partie se termine quand plus aucun mouvement n’est possible.',
      'Vous disposez de 3 annulations par partie pour revenir sur un coup.',
    ],
    en: [
      'Swipe in a direction: every tile slides as far as it can.',
      'Two tiles of equal value that meet merge into a tile of double value.',
      'After each successful move, a new tile (2 or 4) appears on a free cell.',
      'You win when you create the 2048 tile — you may then keep playing.',
      'The game ends when no move is possible anymore.',
      'You have 3 undos per game to revert a move.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : balayez le plateau avec le doigt dans la direction souhaitée.',
      'Ordinateur : flèches du clavier ou touches WASD / ZQSD.',
      'Bouton « Annuler » : restaure le plateau et le score d’avant votre dernier coup (3 fois par partie).',
    ],
    en: [
      'Mobile & tablet: swipe the board with your finger in the desired direction.',
      'Desktop: keyboard arrow keys or WASD.',
      '“Undo” button: restores the board and score from before your last move (3 times per game).',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Le 2048 classique : valeurs 100 % puissances de 2',
      '14 habillages aliment, de la cerise 2 à la tuile miel 8192',
      'Modes Classique (chiffres) et Thématique (aliments mis en avant)',
      '3 annulations de coup par partie',
      'Défi du jour : mêmes tuiles de départ pour tous les joueurs',
      'Sauvegarde automatique : reprenez votre partie en cours',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'The classic 2048: values are 100% powers of two',
      '14 food skins, from the 2 cherry to the 8192 honey tile',
      'Classic (numbers) and Themed (foods up front) display modes',
      '3 move undos per game',
      'Daily challenge: same starting tiles for every player',
      'Automatic save: resume your game in progress',
    ],
  },
  tips: {
    fr: [
      'Choisissez un coin et gardez-y votre plus grande tuile : c’est la stratégie la plus fiable.',
      'Ne construisez qu’un seul « escalier » de valeurs le long d’un bord pour éviter les tuiles isolées.',
      'Gardez la rangée du bas remplie pour contrôler les apparitions aléatoires.',
      'Utilisez l’annulation pour tester un coup risqué, pas pour rejouer une série entière.',
    ],
    en: [
      'Pick one corner and keep your biggest tile there: it is the most reliable strategy.',
      'Build a single “staircase” of values along one edge to avoid isolated tiles.',
      'Keep the bottom row filled to control random spawns.',
      'Use undo to test a risky move, not to replay a whole sequence.',
    ],
  },
  faq: {
    fr: [
      { q: '2048 Nutrition est-il le vrai 2048 ?', a: 'Oui : les mécaniques sont exactement celles du 2048 original — puissances de 2, fusions limitées à une par tuile et par coup, apparitions aléatoires de 2 et de 4. Seul l’habillage visuel change.' },
      { q: 'Comment le score est-il calculé ?', a: 'Chaque fusion ajoute la valeur de la tuile créée : fusionner deux tuiles 128 ajoute ainsi 256 au score, et ainsi de suite.' },
      { q: 'Peut-on dépasser 2048 ?', a: 'Oui. Après la tuile 2048, un bouton « Continuer » vous laisse jouer vers 4096, 8192 et au-delà — des badges récompensent chaque palier.' },
      { q: 'Le défi du jour est-il le même pour tous ?', a: 'Oui : les tuiles de départ sont tirées d’une graine déterministe basée sur la date, et toute la partie suit cette graine. Tous les joueurs jouent donc la même grille ce jour-là.' },
      { q: 'Puis-je annuler un coup ?', a: 'Oui, trois fois par partie. L’annulation restaure le plateau et le score d’avant votre dernier coup ; elle est utilisable même après un game over.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé combine trois dimensions mesurées à la fin de la partie : la hauteur de votre meilleure tuile (2048 = précision maximale, 1024 = 0,91, 256 = 0,73…), la difficulté de la grille (4×4 classique) et l’absence de bonus de rapidité — le 2048 se joue sans chrono, à vous de bâtir votre stratégie. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce puzzle — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour viser des tuiles plus hautes.' },
    ],
    en: [
      { q: 'Is 2048 Nutrition the real 2048?', a: 'Yes: the mechanics are exactly those of the original 2048 — powers of two, at most one merge per tile per move, random 2s and 4s spawning. Only the visual skin changes.' },
      { q: 'How is the score calculated?', a: 'Each merge adds the value of the created tile: merging two 128 tiles adds 256 to your score, and so on.' },
      { q: 'Can you go beyond 2048?', a: 'Yes. After the 2048 tile, a “Keep playing” button lets you aim for 4096, 8192 and beyond — badges reward each milestone.' },
      { q: 'Is the daily challenge the same for everyone?', a: 'Yes: the starting tiles are drawn from a deterministic seed based on the date, and the whole game follows that seed. Everyone plays the same board that day.' },
      { q: 'Can I undo a move?', a: 'Yes, three times per game. Undo restores the board and score from before your last move; it even works after a game over.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ combines three dimensions measured at the end of the game: the height of your best tile (2048 = top accuracy, 1024 = 0.91, 256 = 0.73…), the grid difficulty (classic 4×4) and no speed bonus — 2048 is played without a timer, so the strategy is all yours. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this puzzle — not a clinical IQ test — and the best way to raise it is to keep playing and aim for higher tiles.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
    'best-tile': { fr: 'Meilleure tuile', en: 'Best tile' },
  },
}
