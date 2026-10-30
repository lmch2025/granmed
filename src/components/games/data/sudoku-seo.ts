import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu sudoku (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const sudokuSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Des grilles à solution unique garantie, quatre niveaux, notes au crayon, chrono et QI estimé : le sudoku zen de Granmed.',
    en: 'Uniquely solvable grids, four levels, pencil notes, a timer and an estimated IQ: Granmed’s zen sudoku.',
  },
  description: {
    fr: [
      'Sudoku Zen est un jeu de sudoku gratuit en ligne dans lequel vous complétez une grille 9×9 avec les chiffres 1 à 9, sans jamais répéter un chiffre dans une ligne, une colonne ou un bloc de 3×3.',
      'Chaque grille est générée sur mesure et vérifie une propriété essentielle : elle admet exactement une seule solution. Quatre niveaux de difficulté — de 40 indices en Facile à 24 en Expert — s’adaptent aux débutants comme aux vétérans, et un défi du jour identique pour tous renouvelle l’intérêt chaque matin. Chaque grille résolue révèle aussi un QI estimé — fonction de votre précision (indices et erreurs), de votre rapidité et de la difficulté — qui vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Notes au crayon nettoyées automatiquement, contrôle des erreurs, compteur de fautes, trois indices par grille et chronomètre avec pause : tout est pensé pour une partie calme et rigoureuse, sauvegardée automatiquement pour être reprise à tout moment.',
    ],
    en: [
      'Sudoku Zen is a free online sudoku game in which you complete a 9×9 grid with the digits 1 to 9, never repeating a digit within a row, a column or a 3×3 box.',
      'Every grid is generated on the fly and verified for one essential property: it admits exactly one solution. Four difficulty levels — from 40 givens in Easy down to 24 in Expert — suit beginners and veterans alike, and a daily challenge, identical for everyone, renews the fun every morning. Every solved grid also reveals an estimated IQ — based on your accuracy (hints and mistakes), your speed and the difficulty — which assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'Self-cleaning pencil notes, error checking, a mistake counter, three hints per grid and a pausable timer: everything is designed for a calm, rigorous game, saved automatically so you can resume at any time.',
    ],
  },
  rules: {
    fr: [
      'Complétez la grille avec les chiffres 1 à 9.',
      'Chaque chiffre apparaît une seule fois par ligne, par colonne et par bloc 3×3.',
      'Les chiffres donnés au départ ne peuvent pas être modifiés.',
      'Activez le mode notes pour inscrire plusieurs candidats au crayon dans une case.',
      'La grille est résolue quand elle est entièrement remplie et valide — sa solution est unique.',
    ],
    en: [
      'Complete the grid with the digits 1 to 9.',
      'Each digit appears only once per row, column and 3×3 box.',
      'The givens provided at the start cannot be changed.',
      'Turn on notes mode to pencil several candidates into a cell.',
      'The grid is solved when fully filled and valid — its solution is unique.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez une case puis un chiffre du pavé numérique.',
      'Ordinateur : cliquez une case ; tapez 1–9, effacez avec Retour/Suppr, déplacez-vous avec les flèches, N bascule les notes, H demande un indice, P met en pause.',
      'Bouton pause : fige le chronomètre et masque la grille.',
    ],
    en: [
      'Mobile & tablet: tap a cell, then a digit on the number pad.',
      'Desktop: click a cell; type 1–9, erase with Backspace/Delete, move with arrow keys, N toggles notes, H asks for a hint, P pauses.',
      'Pause button: freezes the timer and hides the grid.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Générateur à solution unique vérifiée pour chaque grille',
      '4 difficultés : Facile (40 indices), Moyen (34), Difficile (28), Expert (24)',
      'Notes crayon 3×3 et surbrillance ligne/colonne/bloc',
      'Contrôle automatique des erreurs, compteur de fautes et 3 indices par partie',
      'Les notes des cases voisines s’effacent dès qu’un chiffre est posé',
      'Chronomètre avec pause (y compris automatique en arrière-plan)',
      'Records de temps par difficulté et défi du jour quotidien',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'Generator with a verified unique solution for every grid',
      '4 difficulties: Easy (40 givens), Medium (34), Hard (28), Expert (24)',
      '3×3 pencil notes and row/column/box highlighting',
      'Automatic error checking, mistake counter and 3 hints per game',
      'Neighbouring pencil notes are cleared as soon as a digit is placed',
      'Timer with pause (including automatic pause in background)',
      'Best times per difficulty and a daily challenge',
    ],
  },
  tips: {
    fr: [
      'Commencez par les chiffres les plus présents : c’est là que les déductions sont les plus rapides.',
      'Un chiffre ne peut aller que dans une case d’un bloc ? Notez-le, puis éliminez par lignes et colonnes.',
      'Utilisez le mode notes pour les cases à 2–3 candidats, puis nettoyez-les au fil des déductions.',
      'En Expert, ne devinez jamais : chaque grille a une solution logique unique.',
    ],
    en: [
      'Start with the most frequent digits: that is where deductions come fastest.',
      'A digit can only fit one cell of a box? Pencil it in, then eliminate by rows and columns.',
      'Use notes mode for cells with 2–3 candidates, then clean them up as you deduce.',
      'On Expert, never guess: every grid has a unique logical solution.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les grilles ont-elles vraiment une solution unique ?', a: 'Oui. À chaque tentative de retrait d’un chiffre pendant la génération, un solveur compte les solutions de la grille (arrêt dès la deuxième) : si l’unicité était perdue, le chiffre est remis en place.' },
      { q: 'Le chronomètre compte-t-il quand je change d’onglet ?', a: 'Non : le chrono se met en pause automatiquement quand la page devient invisible, et vous pouvez le mettre en pause manuellement à tout moment.' },
      { q: 'À quoi servent les indices ?', a: 'Un indice remplit correctement la case sélectionnée (ou une case utile choisie au hasard). Vous en avez 3 par grille ; chaque indice utilisé réduit l’expérience gagnée.' },
      { q: 'Puis-je reprendre une grille en cours ?', a: 'Oui : la grille, les notes, le chrono, les erreurs et les indices restants sont sauvegardés automatiquement ; la page vous proposera de reprendre au retour.' },
      { q: 'Quelle est la différence entre les difficultés ?', a: 'Le nombre de chiffres donnés au départ : 40 en Facile, 34 en Moyen, 28 en Difficile, 24 en Expert. Moins d’indices signifie des déductions plus longues.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé combine trois dimensions mesurées à la victoire : la précision (chaque indice utilisé coûte 0,12 et chaque erreur 0,05), la rapidité (votre temps réel comparé au temps « par » du niveau : 6 min en Facile, 10 min en Moyen, 15 min en Difficile, 24 min en Expert) et la difficulté de la grille. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce sudoku — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer, avec moins d’indices et plus de verve.' },
    ],
    en: [
      { q: 'Do the grids really have a unique solution?', a: 'Yes. Every time the generator attempts to remove a digit, a solver counts the grid’s solutions (stopping at the second): if uniqueness would be lost, the digit is put back.' },
      { q: 'Does the timer run when I switch tabs?', a: 'No: the timer pauses automatically when the page becomes hidden, and you can pause it manually at any time.' },
      { q: 'What are hints for?', a: 'A hint fills the selected cell (or a useful random cell) correctly. You get 3 per grid; each hint used reduces the experience earned.' },
      { q: 'Can I resume a grid in progress?', a: 'Yes: the grid, notes, timer, mistakes and remaining hints are saved automatically; the page will offer to resume when you come back.' },
      { q: 'What is the difference between difficulties?', a: 'The number of starting givens: 40 in Easy, 34 in Medium, 28 in Hard, 24 in Expert. Fewer givens mean longer deductions.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ combines three dimensions measured at the win: accuracy (each hint used costs 0.12 and each mistake 0.05), speed (your actual time compared to the level’s par time: 6 min in Easy, 10 min in Medium, 15 min in Hard, 24 min in Expert) and the grid difficulty. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this sudoku — not a clinical IQ test — and the best way to raise it is to keep playing, with fewer hints and more flair.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-time-easy': { fr: 'Meilleur temps — Facile', en: 'Best time — Easy' },
    'best-time-medium': { fr: 'Meilleur temps — Moyen', en: 'Best time — Medium' },
    'best-time-hard': { fr: 'Meilleur temps — Difficile', en: 'Best time — Hard' },
    'best-time-expert': { fr: 'Meilleur temps — Expert', en: 'Best time — Expert' },
  },
}
