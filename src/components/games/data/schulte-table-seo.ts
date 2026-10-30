import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu schulte-table (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const schulteTableSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Retrouvez les nombres dans l’ordre croissant le plus vite possible, des grilles 3×3 aux redoutables 7×7 — chaque grille complétée révèle votre QI estimé.',
    en: 'Find the numbers in ascending order as fast as you can, from 3×3 grids up to the tricky 7×7 — every completed grid reveals your estimated IQ.',
  },
  description: {
    fr: [
      'Vision Active est un jeu de table de Schulte, un exercice d’attention visuelle utilisé en psychologie : les nombres de 1 à N² sont répartis au hasard dans une grille, et vous devez les toucher dans l’ordre croissant, le plus rapidement possible. Le chronomètre ne démarre qu’au premier toucher, au dixième de seconde près, et se met en pause automatiquement si vous changez d’onglet.',
      'Cinq tailles de grille sont proposées, de 3×3 (9 nombres) à 7×7 (49 nombres), avec des records personnels de temps et une moyenne de vos derniers résultats pour chacune. Trois modes d’affichage — clair, sombre et contraste élevé (fond noir, gros chiffres jaunes) — rendent l’exercice confortable pour tous les yeux, y compris en pleine partie. En fin de grille, un QI estimé — calculé à partir de votre rapidité et de la taille de la grille — vous attribue un niveau d’intelligence, du Novice au Génie, à élever en rejouant.',
      'Chaque matin, une grille du jour identique pour tous les joueurs est proposée en 5×5 ou 6×6 : la réussir valide le défi quotidien et alimente votre série de jours. Vos cinq derniers temps restent consultables à tout moment.',
    ],
    en: [
      'Vision Active is a Schulte table game, a visual-attention exercise used in psychology: numbers from 1 to N² are scattered across a grid, and you must tap them in ascending order as fast as possible. The timer only starts on your first tap, runs to a tenth of a second, and auto-pauses if you switch tabs.',
      'Five grid sizes are available, from 3×3 (9 numbers) to 7×7 (49 numbers), each with its own personal time record and the average of your recent results. Three display modes — light, dark and high contrast (black background, large yellow digits) — keep the exercise comfortable for every eye, even mid-game. At the end of each grid, an estimated IQ — computed from your speed and the grid size — assigns you an intelligence level, from Novice to Genius, to raise as you replay.',
      'Every morning, a daily grid identical for all players is offered in 5×5 or 6×6: completing it validates the daily challenge and feeds your day streak. Your five latest times stay available at any moment.',
    ],
  },
  rules: {
    fr: [
      'Choisissez la taille de la grille (3×3 à 7×7) et le mode d’affichage, puis lancez la partie.',
      'Touchez le nombre 1, puis 2, puis 3… dans l’ordre croissant strict.',
      'Le chronomètre démarre au premier toucher et affiche mm:ss.d.',
      'Si vous quittez l’onglet, le chronomètre se met en pause et reprend à votre retour.',
      'Un nombre correct passe au vert ; un nombre hors ordre tremble et ne fait pas avancer.',
      'La grille est terminée quand le plus grand nombre est touché : votre temps est enregistré.',
      'Réalisez le défi du jour (grille du jour 5×5 ou 6×6) pour valider votre série quotidienne.',
    ],
    en: [
      'Pick the grid size (3×3 to 7×7) and the display mode, then start the game.',
      'Tap number 1, then 2, then 3… in strict ascending order.',
      'The timer starts on your first tap and displays mm:ss.d.',
      'If you leave the tab, the timer pauses and resumes when you come back.',
      'A correct number turns green; an out-of-order number shakes and does not advance.',
      'The grid is complete once the largest number is tapped: your time is recorded.',
      'Complete the daily challenge (a 5×5 or 6×6 grid of the day) to validate your daily streak.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez les nombres directement, une seule main suffit.',
      'Ordinateur : cliquez sur les nombres à la souris, ou au clavier via Tab puis Entrée.',
      'Changez le mode d’affichage à tout moment : pastilles au départ, bouton compact soleil/lune pendant la partie.',
    ],
    en: [
      'Mobile & tablet: tap the numbers directly, one hand is enough.',
      'Desktop: click the numbers with your mouse, or use Tab then Enter on a keyboard.',
      'Switch the display mode at any time: chips before starting, a compact sun/moon button while playing.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      '5 tailles de grille : 3×3, 4×4, 5×5, 6×6 et 7×7',
      'Chronomètre au dixième de seconde, démarré au premier toucher',
      'Mise en pause automatique du chronomètre quand vous quittez l’onglet',
      '3 modes d’affichage dont un contraste élevé pensé pour l’accessibilité',
      'Records personnels et moyenne de vos derniers temps par taille de grille',
      'Historique des 5 derniers temps',
      'Défi du jour déterministe (grille identique pour tous les joueurs)',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      '5 grid sizes: 3×3, 4×4, 5×5, 6×6 and 7×7',
      'Tenth-of-a-second timer, started on the first tap',
      'Timer automatically pauses when you leave the tab',
      '3 display modes including a high-contrast mode designed for accessibility',
      'Personal records and average of your recent times per grid size',
      'History of your 5 latest times',
      'Deterministic daily challenge (same grid for every player)',
    ],
  },
  tips: {
    fr: [
      'Ne sautez pas d’un nombre à l’autre avec les yeux : balayez doucement la grille et laissez la vision périphérique repérer la cible.',
      'Après chaque touche réussie, revenez au centre de la grille plutôt que de fixer le dernier nombre.',
      'Sur les grandes grilles, mémorisez la position approximative des nombres déjà trouvés pour ne pas y revenir.',
      'Respirez calmement et préférez un rythme régulier à la précipitation : les erreurs coûtent plus cher que la lenteur.',
    ],
    en: [
      'Don’t jump from number to number with your eyes: sweep the grid gently and let peripheral vision spot the target.',
      'After each successful tap, return to the center of the grid instead of staring at the last number.',
      'On large grids, remember the rough position of numbers you already found so you don’t go back to them.',
      'Breathe calmly and prefer a steady pace over rushing: mistakes cost more than slowness.',
    ],
  },
  faq: {
    fr: [
      { q: 'La table de Schulte, c’est quoi exactement ?', a: 'C’est un exercice d’entraînement de l’attention visuelle inventé par le psychiatre Walter Schulte : retrouver des nombres dispersés dans l’ordre. Il est utilisé en psychologie pour travailler la vitesse de recherche et le champ visuel.' },
      { q: 'Le chronomètre démarre-t-il avant mon premier toucher ?', a: 'Non : il démarre exactement au moment où vous touchez le nombre 1. Vous pouvez prendre le temps d’observer la grille avant de commencer.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé combine trois dimensions : la précision (une grille terminée compte comme une réussite complète, les touches hors ordre ne font que vous faire perdre du temps), la rapidité (votre temps réel comparé au temps attendu pour la taille de la grille) et la difficulté (de 3×3 à 7×7). Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à cet exercice d’attention visuelle — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour gagner en vitesse de balayage.' },
      { q: 'Si je quitte l’onglet en pleine partie, le temps continue-t-il ?', a: 'Non : le chronomètre se met en pause dès que l’onglet devient invisible et repart à votre retour, pour un temps toujours juste.' },
      { q: 'Les records sont-ils séparés par taille de grille ?', a: 'Oui, chaque taille (3×3 à 7×7) possède son propre record de temps et la moyenne de vos derniers résultats, conservés sur votre appareil.' },
      { q: 'La grille du jour est-elle la même pour tous ?', a: 'Oui, elle est générée de façon déterministe à partir de la date : tout le monde affronte la même grille 5×5 ou 6×6 jusqu’au lendemain.' },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui : même la grille 7×7 garde des cases d’environ 45 px, confortables au doigt, et le plateau tient à l’écran sans défilement sur la plupart des téléphones.' },
    ],
    en: [
      { q: 'What exactly is a Schulte table?', a: 'It is a visual-attention training exercise invented by psychiatrist Walter Schulte: find scattered numbers in order. Psychologists use it to work on search speed and visual field.' },
      { q: 'Does the timer start before my first tap?', a: 'No: it starts exactly when you tap number 1. Take all the time you need to scan the grid before starting.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ combines three dimensions: accuracy (a completed grid counts as a full success — out-of-order taps only cost you time), speed (your actual time compared with the expected time for the grid size) and difficulty (from 3×3 to 7×7). The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this visual-attention exercise — not a clinical IQ test — and the best way to raise it is to keep playing to sharpen your scanning speed.' },
      { q: 'If I leave the tab mid-game, does the clock keep running?', a: 'No: the timer pauses as soon as the tab becomes hidden and resumes when you return, so your time stays fair.' },
      { q: 'Are records separate per grid size?', a: 'Yes, every size (3×3 to 7×7) has its own time record and the average of your recent results, saved on your device.' },
      { q: 'Is the daily grid the same for everyone?', a: 'Yes, it is generated deterministically from the date: everyone faces the same 5×5 or 6×6 grid until tomorrow.' },
      { q: 'Can I play on my phone?', a: 'Yes: even the 7×7 grid keeps cells of about 45 px, comfortable for fingers, and the board fits on screen without scrolling on most phones.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    'best-time-3': { fr: 'Meilleur temps — 3×3', en: 'Best time — 3×3' },
    'best-time-4': { fr: 'Meilleur temps — 4×4', en: 'Best time — 4×4' },
    'best-time-5': { fr: 'Meilleur temps — 5×5', en: 'Best time — 5×5' },
    'best-time-6': { fr: 'Meilleur temps — 6×6', en: 'Best time — 6×6' },
    'best-time-7': { fr: 'Meilleur temps — 7×7', en: 'Best time — 7×7' },
  },
}
