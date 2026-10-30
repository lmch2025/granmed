import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu block-puzzle (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const blockPuzzleSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Placez des pièces sur une grille 10×10, effacez lignes et colonnes, enchaînez les combos — et révélez votre QI estimé, sans chronomètre.',
    en: 'Place pieces on a 10×10 grid, clear rows and columns, chain combos — and reveal your estimated IQ — with no timer to rush you.',
  },
  description: {
    fr: [
      "Block Puzzle Équilibre est un jeu de puzzle gratuit en ligne dans lequel vous posez des pièces de formes variées sur une grille de 10×10 cases. Chaque pièce placée occupe définitivement ses cases ; dès qu'une ligne ou une colonne est entièrement remplie, elle disparaît et vous marque des points.",
      "Vous recevez trois pièces à la fois et devez les placer toutes les trois avant d'en recevoir de nouvelles, à la manière des grands classiques du genre. Le mode Classique propose le catalogue complet — point isolé, lignes, carrés, angles et le rare carré 3×3 — tandis que le mode Détente se limite aux pièces de quatre cases maximum pour des parties plus tranquilles. En fin de partie, un QI estimé — calculé à partir de votre précision, c'est-à-dire du score final rapporté au par de la grille — vous attribue un niveau d'intelligence, du Novice au Génie, à élever en rejouant.",
      "Sans chronomètre ni pression, le jeu récompense l'anticipation : effacer plusieurs lignes d'un seul coup déclenche un combo qui double, triple ou quadruple les points. Votre meilleur score est sauvegardé, un défi du jour propose la même séquence de pièces à tous les joueurs, et la partie en cours est conservée automatiquement pour être reprise plus tard.",
    ],
    en: [
      "Block Puzzle Balance is a free online puzzle game in which you place differently shaped pieces on a 10×10 grid. Every placed piece permanently occupies its cells; as soon as a row or a column is completely filled, it disappears and scores you points.",
      "You receive three pieces at a time and must place all three before new ones arrive, in the tradition of the genre's classics. Classic mode offers the full catalogue — single dot, lines, squares, corners and the rare 3×3 square — while Relax mode sticks to pieces of four cells or fewer for calmer games. At the end of each game, an estimated IQ — computed from your accuracy, that is, the final score measured against the grid's par — assigns you an intelligence level, from Novice to Genius, to raise as you replay.",
      "With no timer and no pressure, the game rewards planning ahead: clearing several lines at once triggers a combo that doubles, triples or quadruples the points. Your best score is saved, a daily challenge deals the same piece sequence to every player, and an unfinished game is automatically kept so you can resume it later.",
    ],
  },
  rules: {
    fr: [
      "Touchez une pièce dans l'un des trois emplacements sous la grille : elle est sélectionnée (anneau et léger soulèvement).",
      "Posez-la en touchant une case de la grille — elle s'ancre par son coin haut-gauche si toutes ses cases sont libres — ou glissez-la directement depuis son emplacement : la zone visée s'illumine quand le placement est possible.",
      'Si le placement est impossible, les bords de la grille clignotent en rouge : choisissez une autre case ou une autre pièce.',
      'Une ligne ou une colonne entièrement remplie est effacée : +1 point par case posée, +10 points par ligne effacée.',
      'Effacer 2, 3 ou 4 lignes d’un coup déclenche un combo : les points des lignes sont multipliés par ×2, ×3 ou ×4.',
      'Quand les trois emplacements sont vides, trois nouvelles pièces sont distribuées.',
      'La partie se termine quand plus aucune des pièces restantes ne peut être placée nulle part sur la grille.',
    ],
    en: [
      'Tap a piece in one of the three slots below the grid: it becomes selected (ring and slight lift).',
      'Place it by tapping a cell on the grid — it anchors by its top-left corner as long as all of its cells are free — or drag it straight from its slot: the targeted area lights up whenever the placement is possible.',
      'If the placement is impossible, the grid edges flash red: pick another cell or another piece.',
      'A completely filled row or column is cleared: +1 point per placed cell, +10 points per cleared line.',
      'Clearing 2, 3 or 4 lines at once triggers a combo: line points are multiplied by ×2, ×3 or ×4.',
      'When all three slots are empty, three new pieces are dealt.',
      'The game ends when none of the remaining pieces can be placed anywhere on the grid.',
    ],
  },
  controls: {
    fr: [
      'Mobile : glissez une pièce de son emplacement vers la grille — elle suit votre doigt et se pose dès que la zone visée s’illumine ; ou touchez la pièce, puis la case de destination.',
      'Ordinateur : cliquez sur une pièce puis sur une case ; un aperçu fantôme suit la souris sur la grille. Le glisser-déposer à la souris fonctionne aussi.',
      'Touchez de nouveau la pièce sélectionnée (ou appuyez sur Échap) pour annuler la sélection.',
      'Aucun chronomètre : le rythme est entièrement libre.',
    ],
    en: [
      'Mobile: drag a piece from its slot towards the grid — it follows your finger and drops as soon as the targeted area lights up; or tap the piece, then the destination cell.',
      'Desktop: click a piece then a cell; a ghost preview follows the mouse over the grid. Mouse drag-and-drop works too.',
      'Tap the selected piece again (or press Escape) to cancel the selection.',
      'No timer: the pace is entirely yours.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Grille 10×10 et pièces dessinées en mini-grilles, avec un dégradé chaud par famille de formes.',
      'Glisser-déposer tactile : la pièce suit le doigt et le dépôt s’aimante sur les cases ; pose en deux gestes également possible.',
      'Deux modes : Classique (toutes les pièces, carré 3×3 rare) et Détente (pièces ≤ 4 cases).',
      'Combos ×2/×3/×4 quand plusieurs lignes sont effacées d’un coup, avec animation flottante.',
      'Défi du jour : la séquence de pièces est déterministe, identique pour tous les joueurs.',
      'Sauvegarde automatique de la partie en cours (grille, pièces, score) avec reprise en un geste.',
      'Record de meilleur score, XP proportionnelle au score, succès à débloquer et légères vibrations tactiles de retour.',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '10×10 grid with pieces drawn as mini-grids, each shape family in a warm gradient.',
      'Touch drag-and-drop: the piece follows your finger and the drop snaps to the cells; two-tap placement also works.',
      'Two modes: Classic (all pieces, rare 3×3 square) and Relax (pieces ≤ 4 cells).',
      '×2/×3/×4 combos when several lines are cleared at once, with a floating animation.',
      'Daily challenge: the piece sequence is deterministic and identical for every player.',
      'Automatic save of the game in progress (grid, pieces, score) with one-tap resume.',
      'Best-score record, XP proportional to the score, achievements to unlock and light haptic feedback.',
    ],
  },
  tips: {
    fr: [
      'Gardez la grille aussi plate et trouée que possible : les trous isolés condamnent souvent la fin de partie.',
      'Ne remplissez une ligne que lorsque vous êtes certain de pouvoir la terminer, sinon elle bloque vos colonnes.',
      'Réservez toujours un carré de 3×3 cases libres quelque part : le grand carré 3×3 finit toujours par arriver en mode Classique.',
      'Les pièces d’une seule case sont précieuses : gardez-les pour boucher les trous au dernier moment.',
      'Viser un double effacement ligne + colonne au même endroit est le meilleur rapport points/libération d’espace.',
    ],
    en: [
      'Keep the grid as flat and hole-free as possible: isolated holes often doom the endgame.',
      'Only fill a line when you are sure you can finish it, otherwise it blocks your columns.',
      'Always keep a free 3×3 square somewhere: the big 3×3 piece eventually shows up in Classic mode.',
      'Single-cell pieces are precious: save them to plug holes at the last moment.',
      'Aiming for a row + column double clear in the same spot is the best points-to-space-freed ratio.',
    ],
  },
  faq: {
    fr: [
      { q: 'Le jeu est-il chronométré ?', a: "Non. Block Puzzle Équilibre est un jeu zen sans minuteur : vous pouvez réfléchir aussi longtemps que vous le souhaitez, la partie est même sauvegardée automatiquement." },
      { q: 'Quelle est la différence entre les modes Classique et Détente ?', a: 'Le mode Classique propose toutes les pièces, y compris le rare carré 3×3 de neuf cases. Le mode Détente exclut ce grand carré et se limite aux pièces de quatre cases maximum.' },
      { q: 'Comment fonctionnent les combos ?', a: 'Quand un placement efface plusieurs lignes et/ou colonnes à la fois, les points de lignes sont multipliés : ×2 pour deux lignes, ×3 pour trois, ×4 pour quatre.' },
      { q: 'Comment est calculé le score ?', a: 'Chaque case posée rapporte 1 point, et chaque ligne effacée rapporte 10 points de base, multipliés par le multiplicateur de combo le cas échéant.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé repose sur votre précision : le score final de la partie est rapporté à un par de 2 200 points (un bon score courant, autour de 1 500 à 1 900 points, correspond à une précision de 0,70 à 0,85). Ce jeu zen étant dépourvu de chronomètre, la rapidité n’entre pas en compte. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce puzzle — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour anticiper plus loin.' },
      { q: 'Puis-je rejouer le défi du jour ?', a: "Le défi du jour est validé dès que votre partie quotidienne se termine avec un score supérieur à 0. Vous pouvez ensuite relancer des parties libres normales." },
    ],
    en: [
      { q: 'Is the game timed?', a: 'No. Block Puzzle Balance is a zen game with no timer: think as long as you like — your game is even saved automatically.' },
      { q: 'What is the difference between Classic and Relax modes?', a: 'Classic mode deals every piece, including the rare nine-cell 3×3 square. Relax mode excludes that big square and sticks to pieces of four cells or fewer.' },
      { q: 'How do combos work?', a: 'When a placement clears several rows and/or columns at once, line points are multiplied: ×2 for two lines, ×3 for three, ×4 for four.' },
      { q: 'How is the score calculated?', a: 'Each placed cell is worth 1 point, and each cleared line is worth 10 base points, multiplied by the combo multiplier when applicable.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ rests on accuracy: the game’s final score is measured against a 2,200-point par (a good everyday score of roughly 1,500–1,900 points maps to 0.7–0.85 accuracy). Since this zen game has no timer, speed does not come into it. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this puzzle — not a clinical IQ test — and the best way to raise it is to keep playing and plan further ahead.' },
      { q: 'Can I replay the daily challenge?', a: 'The daily challenge is validated as soon as your daily game ends with a score above 0. You can then keep playing normal free games.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
  },
}
