import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu jigsaw-puzzle (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const jigsawPuzzleSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Reconstituez six illustrations originales en 12, 24 ou 48 pièces — chaque puzzle terminé révèle votre QI estimé — au doigt ou à la souris.',
    en: 'Reassemble six original illustrations in 12, 24 or 48 pieces — every finished puzzle reveals your estimated IQ — by touch or mouse.',
  },
  description: {
    fr: [
      "Souvenirs de Famille est un jeu de puzzle (jigsaw) gratuit en ligne dans lequel vous reconstituez des illustrations originales en faisant glisser les pièces une par une sur le plateau. Six images inédites — champ de lavande, cuisine rustique, chat à la fenêtre, marché de village, jardin fleuri et lac de montagne — vous attendent en 12, 24 ou 48 pièces.",
      'Chaque pièce est découpée dans l’image complète et dispersée dans le bac situé sous le plateau. Faites-la glisser : si elle est lâchée proche de sa case correcte, elle s’y aimante et s’y verrouille définitivement ; sinon, elle reste exactement là où vous l’avez déposée, sur le plateau ou dans le bac. En fin de puzzle, un QI estimé — fonction de votre précision, de votre rapidité et de la taille du puzzle — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Un bouton œil affiche l’image complète en transparence pour vous guider, un bouton Mélanger redisperse les pièces non posées, un bouton Recommencer relance la même image en un geste, et une barre de progression avec chronomètre suit votre avancée. Sur mobile, plateau et bac à pièces tiennent ensemble à l’écran, sans le moindre défilement. Vos meilleurs temps par taille sont sauvegardés, la galerie des puzzles terminés est conservée, et une partie en cours est automatiquement reprise.',
    ],
    en: [
      "Family Memories is a free online jigsaw puzzle game in which you reassemble original illustrations by dragging pieces one by one onto the board. Six exclusive images — lavender field, rustic kitchen, cat by the window, village market, blooming garden and mountain lake — await you in 12, 24 or 48 pieces.",
      'Each piece is cut from the complete image and scattered in the tray below the board. Drag it around: if you drop it near its correct cell it snaps and locks into place for good; otherwise it stays exactly where you left it, on the board or in the tray. When you finish a puzzle, an estimated IQ — based on your accuracy, speed and puzzle size — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'An eye button shows the full image as a translucent guide, a Shuffle button rescatters the unplaced pieces, a Restart button relaunches the same image in one tap, and a progress bar with a timer tracks your run. On mobile, board and piece tray fit together on screen with zero scrolling. Your best times per size are saved, the gallery of finished puzzles is kept, and a game in progress is automatically resumed.',
    ],
  },
  rules: {
    fr: [
      "Choisissez une image, puis un nombre de pièces : 12 (facile), 24 (moyen) ou 48 (patient).",
      'Les pièces sont dispersées dans le bac sous le plateau ; aucune rotation n’est nécessaire.',
      'Faites glisser une pièce : relâchez-la près de sa case correcte pour qu’elle s’y colle et s’y verrouille.',
      'Une pièce lâchée au mauvais endroit reste où elle est — vous pouvez la reprendre et la déplacer autant de fois que nécessaire.',
      'Le puzzle est terminé quand toutes les pièces sont verrouillées : votre temps est alors enregistré.',
    ],
    en: [
      'Pick an image, then a piece count: 12 (easy), 24 (medium) or 48 (patient).',
      'Pieces are scattered in the tray below the board; no rotation is ever needed.',
      'Drag a piece: release it near its correct cell and it snaps and locks into place.',
      'A piece dropped in the wrong spot stays there — you can pick it up and move it again as often as you like.',
      'The puzzle is complete when every piece is locked in: your time is then recorded.',
    ],
  },
  controls: {
    fr: [
      'Mobile et ordinateur : appuyez sur une pièce puis faites-la glisser avec le doigt ou la souris, et relâchez pour la déposer.',
      'Bouton œil : affiche ou masque l’image complète en transparence sur le plateau.',
      'Bouton Mélanger : redisperse dans le bac les pièces non encore verrouillées.',
      'Bouton Recommencer (flèche circulaire) : relance immédiatement la même image, pièces redispersées.',
      'Bouton retour (flèche) : revenir à l’écran de choix des images — la partie en cours est sauvegardée.',
    ],
    en: [
      'Mobile and desktop: press a piece, drag it with your finger or mouse, then release to drop it.',
      'Eye button: toggles the full image shown faintly over the board.',
      'Shuffle button: rescatters the not-yet-locked pieces back into the tray.',
      'Restart button (circular arrow): immediately relaunches the same image with pieces rescattered.',
      'Back button (arrow): return to the image selection screen — your game in progress is saved.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Six illustrations originales 1024×1024 créées pour Granmed, sans rotation de pièces.',
      'Trois tailles par image : 12, 24 ou 48 pièces, avec meilleurs temps conservés séparément.',
      'Aimantation généreuse : la pièce se colle dès qu’elle est lâchée à moins de la moitié d’une pièce d’écart, avec transition douce et bref anneau vert de confirmation.',
      'Bouton d’aperçu (image fantôme à 40 % d’opacité), bouton Mélanger et bouton Recommencer.',
      'Barre de progression, chronomètre avec pause automatique quand l’onglet est masqué.',
      'Plateau et bac à pièces dimensionnés pour tenir ensemble à l’écran sur mobile, sans défilement.',
      'Galerie persistante des puzzles terminés (✅ + meilleur temps) et reprise automatique de la partie en cours.',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'Six original 1024×1024 illustrations created for Granmed, with no piece rotation.',
      'Three sizes per image: 12, 24 or 48 pieces, each with its own saved best time.',
      'Generous snapping: a piece locks as soon as it is dropped within half a piece of its cell, with a smooth transition and a brief green ring.',
      'Preview toggle (ghost image at 40% opacity), Shuffle button and Restart button.',
      'Progress bar and timer that automatically pauses when the tab is hidden.',
      'Board and piece tray sized to fit together on a phone screen, with zero scrolling.',
      'Persistent gallery of finished puzzles (✅ + best time) and automatic resume of unfinished games.',
    ],
  },
  tips: {
    fr: [
      'Commencez par les pièces aux couleurs très reconnaissables (ciel, coin de table, robe du chat) : elles se plaquent vite au bon endroit.',
      'Gardez le bouton œil activé par intermittence : l’image fantôme à 40 % suffit à se repérer sans mâcher le travail.',
      'Rangez les pièces douteuses dans un coin du bac : un bac organisé fait gagner plus de temps que la vitesse de glisser.',
      'Les bords de l’image et les lignes fortes (horizon, bord de fenêtre) forment un cadre naturel à monter en premier.',
      'En 48 pièces, procédez par zones de couleur plutôt que pièce par pièce : le chronomètre vous remerciera.',
    ],
    en: [
      'Start with easily recognizable colors (sky, table corner, the cat’s fur): they snap into place quickly.',
      'Keep the eye button on intermittently: the 40% ghost image is enough to get your bearings without doing the work for you.',
      'Park doubtful pieces in a corner of the tray: an organized tray saves more time than fast dragging.',
      'Image edges and strong lines (horizon, window frame) make a natural frame to build first.',
      'On 48 pieces, work by color areas rather than piece by piece: your timer will thank you.',
    ],
  },
  faq: {
    fr: [
      { q: 'Faut-il faire tourner les pièces ?', a: 'Non, aucune rotation n’est nécessaire : chaque pièce est déjà dans le bon sens, il suffit de la placer au bon endroit.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé combine trois dimensions mesurées pendant le puzzle : la précision (un puzzle reconstitué sans jamais utiliser l’aperçu de l’image vaut la note parfaite, chaque recours à cette aide la réduit légèrement), la rapidité (temps réel comparé au temps attendu, environ 14 secondes par pièce) et la difficulté (12, 24 ou 48 pièces). Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce puzzle — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour gagner en vitesse et en repérage.' },
      { q: 'Comment une pièce sait-elle où se coller ?', a: 'Quand vous relâchez une pièce, sa position est comparée à celle de sa case correcte : à moins de la moitié de la largeur d’une pièce, elle s’y aimante et s’y verrouille — un rayon qui s’adapte à la taille des pièces et reste confortable au doigt.' },
      { q: 'Puis-je revoir l’image complète ?', a: 'Oui, le bouton œil affiche l’image en transparence (40 % d’opacité) sur le plateau, autant de fois que vous le souhaitez.' },
      { q: 'Que fait le bouton Mélanger ?', a: 'Il redisperse uniquement les pièces non verrouillées dans le bac — les pièces déjà placées ne bougent jamais.' },
      { q: 'Ma partie est-elle sauvegardée si je quitte ?', a: 'Oui : pièces posées, positions des pièces libres et temps écoulé sont enregistrés automatiquement, et une invitation à reprendre s’affiche à votre retour.' },
    ],
    en: [
      { q: 'Do I need to rotate pieces?', a: 'No, no rotation is ever required: every piece is already facing the right way, you only need to place it correctly.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ combines three dimensions measured during the puzzle: accuracy (a puzzle rebuilt without ever using the image preview earns a perfect score, and each use of that help slightly lowers it), speed (actual time compared with the expected time, roughly 14 seconds per piece) and difficulty (12, 24 or 48 pieces). The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this puzzle — not a clinical IQ test — and the best way to raise it is to keep playing to get faster and sharper at spotting pieces.' },
      { q: 'How does a piece know where to snap?', a: 'When you release a piece, its position is compared with its correct cell’s: within half a piece’s width, it snaps and locks there — a radius that adapts to the piece size and stays comfortable for fingers.' },
      { q: 'Can I see the full image again?', a: 'Yes, the eye button shows the image faintly (40% opacity) over the board, as often as you like.' },
      { q: 'What does the Shuffle button do?', a: 'It only rescatters the unplaced pieces into the tray — locked pieces never move.' },
      { q: 'Is my game saved if I leave?', a: 'Yes: locked pieces, free-piece positions and elapsed time are saved automatically, and a resume prompt appears when you come back.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-time-12': { fr: 'Meilleur temps — 12 pièces', en: 'Best time — 12 pieces' },
    'best-time-24': { fr: 'Meilleur temps — 24 pièces', en: 'Best time — 24 pieces' },
    'best-time-48': { fr: 'Meilleur temps — 48 pièces', en: 'Best time — 48 pieces' },
  },
}
