import type { GameSEOContent } from '@/lib/games/types'

/**
 * Contenu SEO bilingue du jeu mini-crossword (Task 27 — double vérification Task 26).
 * Données PURES (aucune directive « use client », aucun import de module
 * client) : réellement double-usage — importable par le serveur (rendu du
 * HTML brut des pages jeu réelles, src/lib/games/content-registry.ts) comme
 * par le composant client du jeu, à la manière du catalogue. Source de
 * vérité unique : zéro duplication, zéro dérive.
 */
export const miniCrosswordSeoContent: GameSEOContent = {
  tagline: {
    fr: 'Complétez de petites grilles construites à la main : nature, culture, expressions et gourmandises — chaque grille résolue révèle votre QI estimé.',
    en: 'Complete small hand-crafted grids: nature, culture and sweet treats — every solved grid reveals your estimated IQ.',
  },
  description: {
    fr: [
      "Culture Gran est un jeu de mots croisés express gratuit : de petites grilles de 5×5 construites à la main, à remplir en quelques minutes à partir de définitions simples. Chaque grille a été assemblée et vérifiée lettre par lettre — les croisements sont toujours cohérents.",
      "Le jeu propose des grilles en français et en anglais, chacune avec ses propres thèmes : fleurs du jardin, forêt, musée, épices et poèmes, lagon de corail ou camp au pré. Les définitions sont courtes et accessibles, avec un clavier à l'écran pour jouer confortablement sur téléphone. En fin de grille, un QI estimé — calculé à partir de votre précision (indices et vérifications utilisés), de votre rapidité et de la difficulté — vous attribue un niveau d'intelligence, du Novice au Génie, à élever en rejouant.",
      "Trois indices par grille permettent de révéler une lettre difficile — ou un mot entier en échange de vos indices restants — tandis qu'un bouton de vérification signale les erreurs. Chronomètre et compteur de mots trouvés rythment chaque grille, et votre progression est sauvegardée automatiquement. Chaque matin, une grille du jour attend les joueurs réguliers et alimente votre série de défis quotidiens.",
    ],
    en: [
      "Culture Gran is a free mini crossword game: small 5×5 hand-crafted grids to fill in within minutes from simple clues. Every grid was assembled and verified letter by letter — crossings are always consistent.",
      "The game offers French and English grids, each with its own themes: garden flowers, forest, museum, spices and poems, coral lagoon or meadow camp. Clues are short and accessible, with an on-screen keyboard to play comfortably on your phone. At the end of each grid, an estimated IQ — computed from your accuracy (hints and checks used), your speed and the difficulty — assigns you an intelligence level, from Novice to Genius, to raise as you replay.",
      "Three hints per grid reveal a tricky letter — or a whole word in exchange for your remaining hints — while a check button flags mistakes. A timer and a words-found counter pace every grid, and your progress auto-saves. Every morning, a grid of the day awaits regular players and feeds your daily-challenge streak.",
    ],
  },
  rules: {
    fr: [
      'Choisissez une grille (ou lancez le défi du jour).',
      'Touchez une case pour la sélectionner ; touchez-la à nouveau pour changer de sens (horizontal/vertical).',
      "Saisissez les lettres avec le clavier à l'écran ou le clavier physique : la saisie avance automatiquement.",
      'La grille est résolue quand toutes les cases sont correctement remplies — la détection est automatique.',
      "En cas de blocage : trois indices par grille (une lettre), la révélation d'un mot entier et un bouton de vérification.",
    ],
    en: [
      'Pick a grid (or start the daily challenge).',
      'Tap a cell to select it; tap it again to switch direction (across/down).',
      'Type letters with the on-screen or physical keyboard: entry advances automatically.',
      'The grid is solved when every cell is correctly filled — detection is automatic.',
      'Stuck? Three letter hints per grid, a whole-word reveal and a check button.',
    ],
  },
  controls: {
    fr: [
      "Mobile et tablette : clavier à l'écran intégré (lettres, effacement, sens, indices, vérification).",
      "Ordinateur : saisie directe au clavier (accents acceptés), flèches pour naviguer, retour arrière pour effacer, barre d'espace pour changer de sens.",
      'Tab ou Entrée pour passer au mot suivant ; cliquez sur une définition pour sélectionner le mot correspondant.',
    ],
    en: [
      'Mobile & tablet: built-in on-screen keyboard (letters, erase, direction, hints, check).',
      'Desktop: type directly (accents accepted), arrow keys to navigate, Backspace to erase, Space to switch direction.',
      'Tab or Enter to jump to the next word; click a clue to select the matching word.',
    ],
  },
  features: {
    fr: [
      'QI estimé et niveau d’intelligence après chaque partie',
      'Grilles 5×5 construites à la main et vérifiées',
      '8 grilles françaises et 6 anglaises aux thèmes variés',
      'Définitions courtes et accessibles bilingues',
      "Trois indices par grille, révélation de mot et vérification des erreurs",
      'Chronomètre, compteur de mots trouvés et meilleur temps enregistré',
      'Défi quotidien : une grille du jour pour tous les joueurs',
      'Sauvegarde automatique de la progression (lettres, temps, indices)',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
      'Hand-crafted and verified 5×5 grids',
      '8 French and 6 English grids on varied themes',
      'Short, accessible bilingual clues',
      'Three hints per grid, word reveal and error checking',
      'Timer, words-found counter and best-time tracking',
      'Daily challenge: one grid of the day for all players',
      'Automatic progress saving (letters, time, hints)',
    ],
  },
  tips: {
    fr: [
      'Commencez par le mot le plus long (la première définition horizontale) : il donne beaucoup de lettres croisées.',
      'Les mots français sont saisis sans accents : ÉCOLE se tape ECOLE, ÉPÉE se tape EPEE.',
      "Ne devinez jamais deux cases d'affilée : vérifiez chaque lettre avec les mots croisés.",
      'Gardez les indices pour la fin de grille, quand il ne reste que quelques cases.',
    ],
    en: [
      'Start with the longest word (the first across clue): it unlocks many crossing letters.',
      'Scan the clue list for the theme — it often hints at several answers at once.',
      'Never guess two cells in a row: check each letter against the crossing words.',
      'Save your hints for the end of the grid, when only a few cells remain.',
    ],
  },
  faq: {
    fr: [
      { q: 'Les grilles sont-elles générées aléatoirement ?', a: 'Non. Chaque grille est construite à la main selon un motif vérifié : les croisements sont contrôlés lettre par lettre, ce qui garantit des grilles toujours cohérentes et solubles.' },
      { q: 'Pourquoi certains mots s’écrivent sans accent ?', a: 'Pour simplifier la saisie au clavier, les réponses françaises sont stockées sans diacritiques : ÉCOLE se saisit ECOLE. Les définitions rappellent l’orthographe complète quand c’est utile, et le clavier physique accepte les lettres accentuées.' },
      { q: 'Comment fonctionnent les indices ?', a: 'Chaque grille vous donne trois indices : chacun révèle la lettre d’une case vide (la case sélectionnée en priorité, sinon la première case vide). Vous pouvez aussi révéler un mot entier, ce qui consomme tous vos indices restants.' },
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé combine trois dimensions mesurées pendant la grille : la précision (chaque indice ou vérification utilisée la réduit légèrement), la rapidité (environ 9 secondes par case remplie servant de rythme de référence) et la difficulté (grilles 5×5 construites à la main). Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de mots — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer en économisant vos indices.' },
      { q: 'Que contient le défi du jour ?', a: 'Chaque jour, une grille différente est désignée par tirage déterministe : tous les joueurs affrontent la même grille, et la réussir valide votre défi quotidien du parcours Granmed.' },
      { q: 'Les grilles françaises et anglaises sont-elles les mêmes ?', a: 'Non : chaque langue possède ses propres grilles, ses propres thèmes et ses propres définitions, véritablement adaptées culturellement.' },
      { q: 'Puis-je reprendre une grille commencée ?', a: 'Oui : vos lettres, la grille en cours, le temps écoulé et le nombre d’indices utilisés sont sauvegardés automatiquement sur votre appareil.' },
    ],
    en: [
      { q: 'Are the grids randomly generated?', a: 'No. Every grid is hand-crafted on a verified pattern: crossings are checked letter by letter, guaranteeing grids that are always consistent and solvable.' },
      { q: 'Are the French and English grids the same?', a: 'No: each language has its own grids, themes and clues, genuinely adapted culturally.' },
      { q: 'What is in the daily challenge?', a: 'Each day, a different grid is picked deterministically: every player faces the same grid, and solving it validates your Granmed daily challenge.' },
      { q: 'How do hints work?', a: 'You get three hints per grid: each reveals the letter of an empty cell (the selected cell first). You can also reveal a whole word, which uses up all your remaining hints.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ combines three dimensions measured during the grid: accuracy (each hint or check you use lowers it slightly), speed (about 9 seconds per filled cell as the reference pace) and difficulty (hand-crafted 5×5 grids). The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this word game — not a clinical IQ test — and the best way to raise it is to replay while saving your hints.' },
      { q: 'Can I resume a grid I started?', a: 'Yes: your letters, current grid, elapsed time and hints used are automatically saved on your device.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
    solved: { fr: 'Grilles résolues', en: 'Puzzles solved' },
    'best-time': { fr: 'Meilleur temps (s)', en: 'Best time (s)' },
  },
}
