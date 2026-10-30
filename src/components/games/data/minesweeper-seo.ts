import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu minesweeper (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const minesweeperSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Le Démineur classique : trois niveaux, des drapeaux, un chrono et un QI estimé — sans jamais toucher une mine.',
    en: 'The classic Minesweeper: three levels, flags, a timer and an estimated IQ — without ever touching a mine.',
  },
  description: {
    fr: [
      "Le Démineur Santé est un jeu de logique gratuit en ligne dans lequel vous devez révéler toutes les cases d’une grille sans jamais déclencher une mine. Chaque case découverte affiche le nombre de mines présentes dans ses huit cases voisines : à vous d’en déduire où se cachent les explosifs et de les marquer d’un drapeau.",
      "Trois difficultés sont au programme : Facile (9×9, 10 mines), Intermédiaire (16×16, 40 mines) et Expert (24×16, 99 mines). Les mines ne sont placées qu’après votre premier clic : la case choisie et son voisinage immédiat sont toujours sans danger, et les zones vides se découvrent automatiquement en cascade. En fin de partie, un QI estimé — fonction de votre précision, de votre rapidité et de la difficulté de la grille — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.",
      "Un défi du jour de taille Facile, identique pour tous les joueurs, est renouvelé chaque jour. Chronomètre avec pause automatique, chording (clic sur un chiffre complet pour ouvrir ses voisines), records de temps par difficulté et une petite astuce bien-être après chaque partie : le classique du raisonnement déductif, jouable partout sans installation.",
    ],
    en: [
      "Minesweeper Health is a free online logic game in which you must reveal every cell of a grid without ever triggering a mine. Each uncovered cell shows how many mines hide in its eight neighbouring cells: deduce where the explosives are and flag them.",
      "Three difficulties are on offer: Easy (9×9, 10 mines), Intermediate (16×16, 40 mines) and Expert (24×16, 99 mines). Mines are only placed after your first click — the chosen cell and its immediate neighbourhood are always safe — and empty areas reveal themselves automatically in a cascade. At the end of each game, an estimated IQ — based on your accuracy, speed and grid difficulty — assigns you an intelligence level, from Novice to Genius, to raise as you replay.",
      "A daily challenge in Easy size, identical for every player, is refreshed each day. A timer with automatic pause, chording (click a satisfied number to open its neighbours), best times per difficulty and a small well-being tip after each game: the deductive-reasoning classic, playable anywhere with no download.",
    ],
  },
  rules: {
    fr: [
      'Révélez toutes les cases exemptes de mine pour gagner la partie.',
      'Chaque chiffre indique le nombre de mines dans les huit cases adjacentes.',
      'Marquez les mines d’un drapeau pour vous repérer ; le compteur affiche les mines restantes.',
      'Le premier clic est toujours sûr : les mines sont placées ensuite, hors de la zone cliquée.',
      'Une case vide découverte révèle automatiquement sa zone (propagation en cascade).',
      'Cliquez un chiffre dont tous les drapeaux sont posés : les voisines restantes s’ouvrent d’un coup.',
      'Le défi du jour (Facile) est généré à partir de la date : la grille est identique pour tous les joueurs.',
    ],
    en: [
      'Reveal every mine-free cell to win the game.',
      'Each number tells how many mines sit in the eight adjacent cells.',
      'Flag the mines to keep track; the counter shows the remaining mines.',
      'The first click is always safe: mines are placed afterwards, outside the clicked zone.',
      'Revealing an empty cell automatically opens its whole area (cascade).',
      'Click a number whose flags are all placed: the remaining neighbours open at once.',
      'The daily challenge (Easy) is generated from the date: the grid is identical for every player.',
    ],
  },
  controls: {
    fr: [
      'Clic gauche (ou toucher) : révéler une case.',
      'Clic droit, appui long (450 ms) ou bouton « Mode drapeau » : poser ou retirer un drapeau.',
      'Clic sur un chiffre entouré de ses drapeaux : révéler les voisines restantes (chording).',
      'Clavier : flèches pour déplacer le focus, Entrée pour révéler, F pour marquer, R pour recommencer.',
    ],
    en: [
      'Left click (or tap): reveal a cell.',
      'Right click, long press (450 ms) or the “Flag mode” button: place or remove a flag.',
      'Click a number surrounded by its flags: reveal the remaining neighbours (chording).',
      'Keyboard: arrow keys to move the focus, Enter to reveal, F to flag, R to restart.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Trois difficultés : Facile 9×9, Intermédiaire 16×16, Expert 24×16 avec défilement horizontal contenu.',
      'Premier clic garanti sans mine et révélation en cascade des zones vides.',
      'Chording : un clic sur un chiffre complet révèle toutes ses voisines d’un coup.',
      'Drapeaux au clic droit, à l’appui long ou via le mode drapeau tactile bien visible.',
      'Chronomètre avec pause automatique quand vous quittez l’onglet.',
      'Défi du jour identique pour tous, records de temps par difficulté et succès à débloquer.',
      'Une astuce bien-être discrète et masquable après chaque partie.',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'Three difficulties: Easy 9×9, Intermediate 16×16, Expert 24×16 with contained horizontal scrolling.',
      'Guaranteed-safe first click and cascading reveal of empty areas.',
      'Chording: click a satisfied number to open all its neighbours at once.',
      'Flags via right click, long press or the clearly visible touch flag mode.',
      'Timer with automatic pause when you leave the tab.',
      'A daily challenge identical for everyone, best times per difficulty and achievements to unlock.',
      'A discreet, dismissible well-being tip after every game.',
    ],
  },
  tips: {
    fr: [
      'Ouvrez d’abord vers le centre : les grandes zones vides se dévoilent en cascade et offrent de l’information gratuite.',
      'Un chiffre égal au nombre de ses cases voisines non révélées : toutes ces cases sont des mines.',
      'Posez vos drapeaux puis cliquez les chiffres complétés : le chording ouvre les voisines restantes en un instant.',
      'Comparez le compteur de mines restantes au nombre de drapeaux posés pour valider vos déductions.',
      'Ne devinez qu’en dernier recours : dans la grille Expert, la logique suffit presque toujours.',
      'Les configurations 1-2-1 et 1-2-2-1 sont des motifs classiques : les mines s’y placent toujours de la même façon.',
    ],
    en: [
      'Open towards the centre first: large empty areas cascade open and hand you free information.',
      'A number equal to its count of unrevealed neighbours: every one of those cells is a mine.',
      'Place your flags, then click completed numbers: chording opens the remaining neighbours instantly.',
      'Compare the remaining-mine counter with your flag count to double-check your deductions.',
      'Guess only as a last resort: in the Expert grid, logic is almost always enough.',
      'The 1-2-1 and 1-2-2-1 patterns are classics: the mines always sit in the same spots.',
    ],
  },
  faq: {
    fr: [
      {
        q: 'La première case peut-elle contenir une mine ?',
        a: 'Non. Les mines ne sont placées qu’après votre premier clic, en excluant la case choisie et ses huit voisines. Vous pouvez commencer n’importe où sans risque.',
      },
      {
        q: 'Le défi du jour est-il identique pour tous les joueurs ?',
        a: 'Oui. La grille Facile du jour est générée à partir de la date avec la même graine : tout le monde joue la même partie, et le bouton Recommencer conserve cette même grille.',
      },
      {
        q: 'Comment marquer une mine sur mobile ?',
        a: 'Activez le bouton « Mode drapeau » au-dessus de la grille : chaque toucher pose alors un drapeau. L’appui long (450 ms) fonctionne aussi, ainsi que le clic droit à la souris.',
      },
      {
        q: 'À quoi correspondent les couleurs des chiffres ?',
        a: '1 est vert, 2 ambre, 3 orange, 4 rose, et 5 ou plus en rouge — pour lire les densités de mines d’un coup d’œil.',
      },
      {
        q: 'Comment est calculé mon QI estimé ?',
        a: 'Votre QI estimé combine trois dimensions mesurées pendant la partie : la précision (part des cases sûres révélées, une grille complètement déminée valant la note parfaite), la rapidité (temps réel comparé au temps attendu de la grille, environ 1,4 seconde par case) et la difficulté (Facile, Intermédiaire ou Expert). Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de logique — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour affûter votre raisonnement déductif.',
      },
      {
        q: 'Mes records sont-ils sauvegardés ?',
        a: 'Oui, localement sur votre appareil, sans inscription : le meilleur temps est conservé séparément pour chaque difficulté.',
      },
    ],
    en: [
      {
        q: 'Can the first cell contain a mine?',
        a: 'No. Mines are only placed after your first click, excluding the chosen cell and its eight neighbours. You can start anywhere safely.',
      },
      {
        q: 'Is the daily challenge the same for every player?',
        a: 'Yes. The daily Easy grid is generated from the date with the same seed: everyone plays the same board, and the Restart button keeps that exact grid.',
      },
      {
        q: 'How do I flag a mine on mobile?',
        a: 'Turn on the “Flag mode” button above the grid: every tap then places a flag. A long press (450 ms) works too, as does right click with a mouse.',
      },
      {
        q: 'What do the number colours mean?',
        a: '1 is green, 2 amber, 3 orange, 4 rose, and 5 or more red — so you can read mine density at a glance.',
      },
      {
        q: 'How is my estimated IQ calculated?',
        a: 'Your estimated IQ combines three dimensions measured during the game: accuracy (the share of safe cells revealed — a fully cleared grid earns a perfect score), speed (actual time compared with the grid’s expected time, roughly 1.4 seconds per cell) and difficulty (Easy, Intermediate or Expert). The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this logic game — not a clinical IQ test — and the best way to raise it is to keep playing to sharpen your deductive reasoning.',
      },
      {
        q: 'Are my records saved?',
        a: 'Yes, locally on your device with no sign-up: your best time is kept separately for each difficulty.',
      },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-time-easy': { fr: 'Meilleur temps — Facile', en: 'Best time — Easy' },
    'best-time-medium': { fr: 'Meilleur temps — Intermédiaire', en: 'Best time — Intermediate' },
    'best-time-expert': { fr: 'Meilleur temps — Expert', en: 'Best time — Expert' },
  },
}
