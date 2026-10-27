import type { Lang } from '@/lib/i18n'

export type CategoryId = 'memory' | 'logic' | 'reflex' | 'words'

export interface CategoryDef {
  id: CategoryId
  icon: string
  name: Record<Lang, string>
  tagline: Record<Lang, string>
  description: Record<Lang, string>
  path: Record<Lang, string>
}

export interface GameDef {
  slug: string
  /** Chemins localisés (cahier des charges §4.1), sans langue ni slash initial. */
  paths: Record<Lang, string>
  title: Record<Lang, string>
  /** Une ligne pour les cartes de l'accueil. */
  short: Record<Lang, string>
  icon: string
  category: CategoryId
  /** 1 = accessible, 2 = modéré, 3 = exigeant */
  difficulty: 1 | 2 | 3
  popularity: number
  releasedAt: string
  similar: string[]
  daily: boolean
}

export const CATEGORIES: CategoryDef[] = [
  {
    id: 'memory',
    icon: '🧠',
    name: { fr: 'Mémoire et entraînement cérébral', en: 'Memory & brain training' },
    tagline: { fr: 'Testez votre QI : mémoire de travail, attention et rapidité d’esprit', en: 'Test your IQ: working memory, attention and mental speed' },
    description: {
      fr: 'Ces jeux d’entraînement cérébral font travailler la mémoire de travail, l’attention, la vitesse de traitement et les connaissances. Chaque partie révèle un QI estimé — fonction de votre précision, de votre rapidité et de la difficulté — pour mesurer vos progrès manche après manche. Des sessions courtes et régulières suffisent, avec des défis quotidiens.',
      en: 'These brain-training games work your working memory, attention, processing speed and knowledge. Every round reveals an estimated IQ — a function of your accuracy, speed and the difficulty — to measure your progress round after round. Short, regular sessions are enough, with daily challenges.',
    },
    path: { fr: 'categorie/memoire', en: 'category/memory' },
  },
  {
    id: 'logic',
    icon: '🧩',
    name: { fr: 'Puzzles et logique', en: 'Puzzles & logic' },
    tagline: { fr: 'Aiguisez votre logique et votre QI, pièce par pièce', en: 'Sharpen your logic and your IQ, piece by piece' },
    description: {
      fr: 'Puzzles, grilles et fusions : des jeux de réflexion calmes ou tactiques, pensés pour la détente autant que pour le défi. La logique pure est notée en QI estimé à chaque partie, et chaque jeu se sauvegarde automatiquement pour être repris plus tard.',
      en: 'Puzzles, grids and merges: calm or tactical thinking games, designed for relaxation as much as challenge. Pure logic is scored as an estimated IQ on every round, and every game auto-saves so you can pick it up later.',
    },
    path: { fr: 'categorie/logique', en: 'category/logic' },
  },
  {
    id: 'reflex',
    icon: '⚡',
    name: { fr: 'Adresse et réflexes', en: 'Skill & reflexes' },
    tagline: { fr: 'Réflexes, anticipation et QI estimé, jouables au doigt', en: 'Reflexes, anticipation and estimated IQ, played with one finger' },
    description: {
      fr: 'Lancer, guider, pêcher, découper : des jeux d’adresse aux commandes ultra-simpes, avec une difficulté progressive et des records à battre. Chaque manche calcule votre QI estimé — précision et rapidité sous pression — pour une pause de quelques minutes qui stimule vraiment.',
      en: 'Toss, guide, fish, slice: skill games with ultra-simple controls, progressive difficulty and records to beat. Every round computes your estimated IQ — accuracy and speed under pressure — for a few minutes’ break that truly stimulates.',
    },
    path: { fr: 'categorie/reflexes', en: 'category/reflex' },
  },
  {
    id: 'words',
    icon: '✨',
    name: { fr: 'Mots et culture', en: 'Words & culture' },
    tagline: { fr: 'Langage, culture générale et QI estimé', en: 'Language, general knowledge and estimated IQ' },
    description: {
      fr: 'Dictionnaires, expressions et récits : des jeux de mots soigneusement adaptés à chaque langue, avec leurs propres mots du jour, définitions et histoires. Vocabulaire et compréhension alimentent votre QI estimé, à élever en rejouant.',
      en: 'Dictionaries, idioms and stories: word games carefully adapted to each language, with their own daily words, definitions and stories. Vocabulary and comprehension feed your estimated IQ, to raise as you replay.',
    },
    path: { fr: 'categorie/mots', en: 'category/words' },
  },
]

/** Styles par catégorie (palette chaude — pas de bleu/indigo). */
export const CATEGORY_STYLES: Record<CategoryId, { tile: string; chip: string; text: string; soft: string }> = {
  memory: {
    tile: 'from-rose-400 to-pink-600',
    chip: 'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-300',
    text: 'text-rose-600 dark:text-rose-400',
    soft: 'bg-rose-50 dark:bg-rose-500/10',
  },
  logic: {
    tile: 'from-emerald-400 to-teal-600',
    chip: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300',
    text: 'text-emerald-600 dark:text-emerald-400',
    soft: 'bg-emerald-50 dark:bg-emerald-500/10',
  },
  reflex: {
    tile: 'from-amber-400 to-orange-600',
    chip: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
    text: 'text-amber-600 dark:text-amber-400',
    soft: 'bg-amber-50 dark:bg-amber-500/10',
  },
  words: {
    tile: 'from-violet-400 to-purple-600',
    chip: 'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-300',
    text: 'text-violet-600 dark:text-violet-400',
    soft: 'bg-violet-50 dark:bg-violet-500/10',
  },
}

export const GAMES: GameDef[] = [
  {
    slug: 'memory-match',
    paths: { fr: 'jeu-memory', en: 'memory-match' },
    title: { fr: 'Memory Match — Jeu de mémoire', en: 'Memory Match — Pairs Memory Game' },
    short: {
      fr: 'Retrouvez les paires de cartes et mesurez votre QI estimé : fruits, nature, animaux, souvenirs rétro.',
      en: 'Flip cards, find matching pairs and reveal your estimated IQ: fruits, nature, animals and retro memories.',
    },
    icon: '🃏',
    category: 'memory',
    difficulty: 1,
    popularity: 98,
    releasedAt: '2025-01-10',
    similar: ['sequence-memory', 'schulte-table', 'jigsaw-puzzle'],
    daily: true,
  },
  {
    slug: 'sequence-memory',
    paths: { fr: 'memoire-sequences', en: 'sequence-memory' },
    title: { fr: "Gran' Mémoire — Séquences lumineuses", en: "Gran's Memory — Light Sequences" },
    short: {
      fr: 'Reproduisez des séquences qui s’allongent à chaque tour : un test de mémoire de travail qui révèle votre QI.',
      en: 'Repeat sequences that grow longer each round: a working-memory test that reveals your IQ.',
    },
    icon: '🔔',
    category: 'memory',
    difficulty: 1,
    popularity: 84,
    releasedAt: '2025-01-18',
    similar: ['memory-match', 'schulte-table', 'speed-math'],
    daily: false,
  },
  {
    slug: 'schulte-table',
    paths: { fr: 'table-schulte', en: 'schulte-table' },
    title: { fr: 'Vision Active — Table de Schulte', en: 'Vision Active — Schulte Table' },
    short: {
      fr: 'Trouvez les nombres dans l’ordre le plus vite possible : vitesse de traitement et QI estimé, de 3×3 à 7×7.',
      en: 'Find numbers in order as fast as you can: processing speed and estimated IQ, from 3×3 to 7×7 grids.',
    },
    icon: '👁️',
    category: 'memory',
    difficulty: 2,
    popularity: 71,
    releasedAt: '2025-01-25',
    similar: ['speed-math', 'sequence-memory', 'memory-match'],
    daily: true,
  },
  {
    slug: 'speed-math',
    paths: { fr: 'calcul-mental-rapide', en: 'speed-math' },
    title: { fr: 'Calcul Éclair — Calcul mental', en: 'Speed Math — Mental Arithmetic' },
    short: {
      fr: 'Résolvez un maximum d’opérations en 60 secondes : calcul mental, agilité et QI estimé à la clé.',
      en: 'Solve as many operations as you can in 60 seconds: mental math, agility and your estimated IQ.',
    },
    icon: '⚡',
    category: 'memory',
    difficulty: 2,
    popularity: 90,
    releasedAt: '2025-02-02',
    similar: ['schulte-table', 'sequence-memory', 'daily-word'],
    daily: true,
  },
  {
    slug: 'mini-crossword',
    paths: { fr: 'mots-croises', en: 'mini-crossword' },
    title: { fr: 'Culture Gran — Mots croisés express', en: 'Culture Gran — Mini Crossword' },
    short: {
      fr: 'Complétez de petites grilles construites à la main : culture générale, logique et QI estimé.',
      en: 'Complete small hand-crafted grids: general knowledge, logic and your estimated IQ.',
    },
    icon: '✏️',
    category: 'memory',
    difficulty: 2,
    popularity: 76,
    releasedAt: '2025-02-09',
    similar: ['guess-the-idiom', 'longest-word', 'health-true-false'],
    daily: true,
  },
  {
    slug: 'health-true-false',
    paths: { fr: 'quiz-sante', en: 'health-true-false' },
    title: { fr: 'Vrai ou Faux — Santé et connaissances', en: 'True or False — Health & Knowledge' },
    short: {
      fr: 'Affirmations santé, nutrition et bien-être, avec explications sourcées : un quiz qui teste votre QI.',
      en: 'Health, nutrition and wellbeing statements with sourced explanations: a quiz that tests your IQ.',
    },
    icon: '✅',
    category: 'memory',
    difficulty: 1,
    popularity: 82,
    releasedAt: '2025-02-15',
    similar: ['mini-crossword', 'daily-word', 'guess-the-idiom'],
    daily: true,
  },
  {
    slug: 'merge-garden',
    paths: { fr: 'jardin-merge', en: 'merge-garden' },
    title: { fr: 'Jardin de Gran — Jeu de fusion', en: "Gran's Garden — Merge Game" },
    short: {
      fr: 'Fusionnez graines et plantes pour découvrir 16 espèces : un jardin zen qui révèle votre QI estimé.',
      en: 'Merge seeds and plants to discover 16 species: a zen garden that reveals your estimated IQ.',
    },
    icon: '🌱',
    category: 'logic',
    difficulty: 1,
    popularity: 87,
    releasedAt: '2025-02-22',
    similar: ['2048-nutrition', 'zen-fishing', 'jigsaw-puzzle'],
    daily: false,
  },
  {
    slug: '2048-nutrition',
    paths: { fr: '2048-nutrition', en: '2048-nutrition' },
    title: { fr: '2048 Nutrition', en: '2048 Nutrition' },
    short: {
      fr: 'Le 2048 classique revisité : fusionnez les aliments et poussez votre QI estimé jusqu’au banquet complet.',
      en: 'The classic 2048 with a food twist: merge foods and push your estimated IQ to the full banquet.',
    },
    icon: '🍎',
    category: 'logic',
    difficulty: 2,
    popularity: 95,
    releasedAt: '2025-03-01',
    similar: ['merge-garden', 'block-puzzle', 'sudoku'],
    daily: true,
  },
  {
    slug: 'sudoku',
    paths: { fr: 'sudoku', en: 'sudoku' },
    title: { fr: 'Sudoku Zen', en: 'Sudoku Zen' },
    short: {
      fr: 'Grilles à solution unique, notes et indices : la logique pure, notée en QI estimé. Quatre niveaux.',
      en: 'Unique-solution grids, pencil notes and hints: pure logic, scored as an estimated IQ. Four levels.',
    },
    icon: '🔢',
    category: 'logic',
    difficulty: 3,
    popularity: 93,
    releasedAt: '2025-03-08',
    similar: ['2048-nutrition', 'minesweeper', 'mini-crossword'],
    daily: true,
  },
  {
    slug: 'daily-word',
    paths: { fr: 'mot-du-jour', en: 'daily-word-game' },
    title: { fr: 'Mot du Jour Santé', en: 'Daily Word Game' },
    short: {
      fr: 'Devinez le mot mystère en 6 tentatives : vocabulaire, déduction et QI estimé. Un nouveau mot chaque jour !',
      en: 'Guess the mystery word in 6 tries: vocabulary, deduction and estimated IQ. A new word every day!',
    },
    icon: '🟩',
    category: 'logic',
    difficulty: 2,
    popularity: 97,
    releasedAt: '2025-03-15',
    similar: ['longest-word', 'guess-the-idiom', 'health-true-false'],
    daily: true,
  },
  {
    slug: 'minesweeper',
    paths: { fr: 'demineur', en: 'minesweeper' },
    title: { fr: 'Démineur Santé', en: 'Minesweeper Health' },
    short: {
      fr: 'Le démineur classique : déduction logique sous pression, chrono et QI estimé.',
      en: 'Classic minesweeper: logical deduction under pressure, timer and estimated IQ.',
    },
    icon: '💣',
    category: 'logic',
    difficulty: 2,
    popularity: 88,
    releasedAt: '2025-03-22',
    similar: ['sudoku', 'block-puzzle', '2048-nutrition'],
    daily: true,
  },
  {
    slug: 'block-puzzle',
    paths: { fr: 'block-puzzle', en: 'block-puzzle' },
    title: { fr: 'Block Puzzle Équilibre', en: 'Block Puzzle Balance' },
    short: {
      fr: 'Placez les pièces pour compléter lignes et colonnes : vision spatiale et QI estimé au compteur.',
      en: 'Place pieces to complete rows and columns: spatial vision and estimated IQ on the counter.',
    },
    icon: '🧱',
    category: 'logic',
    difficulty: 1,
    popularity: 91,
    releasedAt: '2025-03-29',
    similar: ['2048-nutrition', 'merge-garden', 'minesweeper'],
    daily: true,
  },
  {
    slug: 'jigsaw-puzzle',
    paths: { fr: 'puzzle-images', en: 'jigsaw-puzzle' },
    title: { fr: 'Souvenirs de Famille — Puzzle', en: 'Family Memories — Jigsaw Puzzle' },
    short: {
      fr: 'Reconstituez des illustrations originales : perception visuelle et QI estimé, de 12 à 48 pièces.',
      en: 'Reassemble original illustrations: visual perception and estimated IQ, from 12 to 48 pieces.',
    },
    icon: '🖼️',
    category: 'logic',
    difficulty: 1,
    popularity: 85,
    releasedAt: '2025-04-05',
    similar: ['memory-match', 'merge-garden', 'block-puzzle'],
    daily: false,
  },
  {
    slug: 'pill-toss',
    paths: { fr: 'lancer-de-pilules', en: 'pill-toss' },
    title: { fr: 'Pill Toss — Lancer de pilules', en: 'Pill Toss — Pill Throwing Game' },
    short: {
      fr: 'Visez et lancez des pilules fictives dans des fioles en mouvement : adresse, timing et QI estimé.',
      en: 'Aim and throw fictional pills into moving jars: skill, timing and estimated IQ.',
    },
    icon: '💊',
    category: 'reflex',
    difficulty: 2,
    popularity: 74,
    releasedAt: '2025-04-12',
    similar: ['fruit-slice', 'fire-escape', 'zen-fishing'],
    daily: false,
  },
  {
    slug: 'fire-escape',
    paths: { fr: 'pompier-de-gran', en: 'fire-escape' },
    title: { fr: 'Le Pompier de Gran — Fire Escape', en: 'Gran’s Firefighter — Fire Escape' },
    short: {
      fr: 'Guidez le pompier à travers les flammes : réflexes, anticipation et QI estimé.',
      en: 'Guide the firefighter through the flames: reflexes, anticipation and estimated IQ.',
    },
    icon: '🚒',
    category: 'reflex',
    difficulty: 2,
    popularity: 79,
    releasedAt: '2025-04-19',
    similar: ['pill-toss', 'fruit-slice', 'zen-fishing'],
    daily: true,
  },
  {
    slug: 'zen-fishing',
    paths: { fr: 'peche-zen', en: 'zen-fishing' },
    title: { fr: 'Pêche Miraculeuse — Zen Fishing', en: 'Miraculous Fishing — Zen Fishing' },
    short: {
      fr: 'Une pêche détendante : descendez, remontez, complétez votre collection — et votre QI estimé.',
      en: 'Relaxed fishing: drop your hook, reel up and grow your collection — and your estimated IQ.',
    },
    icon: '🎣',
    category: 'reflex',
    difficulty: 1,
    popularity: 83,
    releasedAt: '2025-04-26',
    similar: ['merge-garden', 'pill-toss', 'fire-escape'],
    daily: true,
  },
  {
    slug: 'fruit-slice',
    paths: { fr: 'decoupe-de-fruits', en: 'fruit-slice' },
    title: { fr: 'Le Verger de Gran — Fruit Slice', en: "Gran's Orchard — Fruit Slice" },
    short: {
      fr: 'Tranchez les fruits du verger au doigt et évitez les savons : réflexes et QI estimé !',
      en: 'Slice orchard fruits with your finger and avoid the soaps: reflexes and estimated IQ!',
    },
    icon: '🍉',
    category: 'reflex',
    difficulty: 2,
    popularity: 92,
    releasedAt: '2025-05-03',
    similar: ['pill-toss', 'fire-escape', '2048-nutrition'],
    daily: true,
  },
  {
    slug: 'guess-the-idiom',
    paths: { fr: 'devine-expression', en: 'guess-the-idiom' },
    title: { fr: 'Devine l’Expression', en: 'Guess the Idiom' },
    short: {
      fr: 'Retrouvez les expressions populaires à partir d’indices et de définitions : langage et QI estimé.',
      en: 'Find popular idioms from clues and definitions: language skills and estimated IQ.',
    },
    icon: '💬',
    category: 'words',
    difficulty: 2,
    popularity: 78,
    releasedAt: '2025-05-10',
    similar: ['mini-crossword', 'longest-word', 'health-true-false'],
    daily: true,
  },
  {
    slug: 'longest-word',
    paths: { fr: 'mot-le-plus-long', en: 'longest-word-game' },
    title: { fr: 'Le Mot le Plus Long', en: 'The Longest Word' },
    short: {
      fr: 'Formez un maximum de mots avec 9 lettres : vocabulaire, rapidité et QI estimé avant la fin du compte à rebours.',
      en: 'Build as many words as you can from 9 letters: vocabulary, speed and estimated IQ before time runs out.',
    },
    icon: '🔤',
    category: 'words',
    difficulty: 2,
    popularity: 75,
    releasedAt: '2025-05-17',
    similar: ['daily-word', 'guess-the-idiom', 'mini-crossword'],
    daily: true,
  },
  {
    slug: 'interactive-story',
    paths: { fr: 'histoire-interactive', en: 'interactive-story' },
    title: { fr: 'Histoire Interactive', en: 'Interactive Story' },
    short: {
      fr: 'Vos décisions changent le récit : compréhension, choix avisés et QI estimé. Plusieurs fins à découvrir.',
      en: 'Your choices change the story: comprehension, savvy decisions and estimated IQ. Several endings to find.',
    },
    icon: '📖',
    category: 'words',
    difficulty: 1,
    popularity: 72,
    releasedAt: '2025-05-24',
    similar: ['guess-the-idiom', 'merge-garden', 'mini-crossword'],
    daily: false,
  },
]

export const GAMES_BY_SLUG: Record<string, GameDef> = Object.fromEntries(GAMES.map((g) => [g.slug, g]))

export function getGame(slug: string): GameDef | undefined {
  return GAMES_BY_SLUG[slug]
}

export function gamesOfCategory(cat: CategoryId): GameDef[] {
  return GAMES.filter((g) => g.category === cat)
}

export function popularGames(n = 6): GameDef[] {
  return [...GAMES].sort((a, b) => b.popularity - a.popularity).slice(0, n)
}

export function recentGames(n = 4): GameDef[] {
  return [...GAMES].sort((a, b) => (a.releasedAt < b.releasedAt ? 1 : -1)).slice(0, n)
}

/** Jeu du défi du jour (déterministe par date). */
export function dailyFeaturedGame(dateKey: string): GameDef {
  const dailies = GAMES.filter((g) => g.daily)
  let h = 0
  for (let i = 0; i < dateKey.length; i++) h = (h * 31 + dateKey.charCodeAt(i)) >>> 0
  return dailies[h % dailies.length]
}
