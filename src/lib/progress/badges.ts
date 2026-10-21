import type { Lang } from '@/lib/i18n'

export interface BadgeDef {
  id: string
  icon: string
  /** Slug du jeu concerné, ou undefined pour les succès globaux. */
  game?: string
  name: Record<Lang, string>
  desc: Record<Lang, string>
  xp: number
}

/** Succès (badges) — IDs exacts à utiliser avec unlockBadge(). */
export const BADGES: BadgeDef[] = [
  // --- Globaux
  { id: 'first-game', icon: '🎉', name: { fr: 'Première partie', en: 'First game' }, desc: { fr: 'Jouer votre première partie', en: 'Play your first game' }, xp: 25 },
  { id: 'explorer-5', icon: '🗺️', name: { fr: 'Explorateur', en: 'Explorer' }, desc: { fr: 'Essayer 5 jeux différents', en: 'Try 5 different games' }, xp: 40 },
  { id: 'explorer-15', icon: '🌍', name: { fr: 'Grand explorateur', en: 'Globe-trotter' }, desc: { fr: 'Essayer 15 jeux différents', en: 'Try 15 different games' }, xp: 90 },
  { id: 'plays-10', icon: '💪', name: { fr: 'Joueur fidèle', en: 'Regular player' }, desc: { fr: 'Jouer 10 parties', en: 'Play 10 games' }, xp: 30 },
  { id: 'plays-100', icon: '🏆', name: { fr: 'Vétéran', en: 'Veteran' }, desc: { fr: 'Jouer 100 parties', en: 'Play 100 games' }, xp: 120 },
  { id: 'streak-3', icon: '🔥', name: { fr: 'Trois jours de suite', en: 'Three-day streak' }, desc: { fr: 'Réussir un défi du jour 3 jours de suite', en: 'Complete a daily challenge 3 days in a row' }, xp: 50 },
  { id: 'streak-7', icon: '🌋', name: { fr: 'Semaine parfaite', en: 'Perfect week' }, desc: { fr: 'Réussir un défi du jour 7 jours de suite', en: 'Complete a daily challenge 7 days in a row' }, xp: 120 },
  { id: 'level-5', icon: '⭐', name: { fr: 'Niveau 5', en: 'Level 5' }, desc: { fr: 'Atteindre le niveau 5', en: 'Reach level 5' }, xp: 0 },
  { id: 'level-10', icon: '👑', name: { fr: 'Niveau 10', en: 'Level 10' }, desc: { fr: 'Atteindre le niveau 10', en: 'Reach level 10' }, xp: 0 },
  { id: 'favorites-5', icon: '❤️', name: { fr: 'Cœur tendre', en: 'Warm heart' }, desc: { fr: 'Ajouter 5 jeux aux favoris', en: 'Add 5 games to favorites' }, xp: 30 },

  // --- Memory Match
  { id: 'memory-perfect', icon: '🧠', game: 'memory-match', name: { fr: 'Mémoire d’éléphant', en: 'Elephant memory' }, desc: { fr: 'Terminer une grille sans aucune erreur', en: 'Finish a grid without a single mistake' }, xp: 60 },
  { id: 'memory-master', icon: '🎖️', game: 'memory-match', name: { fr: 'Maître du memory', en: 'Memory master' }, desc: { fr: 'Terminer la grille experte de 15 paires', en: 'Finish the 15-pair expert grid' }, xp: 80 },
  // --- Gran' Mémoire
  { id: 'simon-10', icon: '🎵', game: 'sequence-memory', name: { fr: 'Séquence 10', en: 'Sequence 10' }, desc: { fr: 'Reproduire une séquence de 10', en: 'Repeat a sequence of 10' }, xp: 50 },
  { id: 'simon-20', icon: '🎼', game: 'sequence-memory', name: { fr: 'Séquence 20', en: 'Sequence 20' }, desc: { fr: 'Reproduire une séquence de 20', en: 'Repeat a sequence of 20' }, xp: 120 },
  // --- Schulte
  { id: 'schulte-5-30', icon: '⚡', game: 'schulte-table', name: { fr: 'Œil de lynx', en: 'Lynx eye' }, desc: { fr: 'Finir une grille 5×5 en moins de 30 s', en: 'Finish a 5×5 grid in under 30 s' }, xp: 60 },
  { id: 'schulte-7', icon: '🔎', game: 'schulte-table', name: { fr: 'Vision complète', en: 'Full vision' }, desc: { fr: 'Terminer une grille 7×7', en: 'Complete a 7×7 grid' }, xp: 70 },
  // --- Calcul Éclair
  { id: 'math-25', icon: '🧮', game: 'speed-math', name: { fr: '25 en 60 secondes', en: '25 in 60 seconds' }, desc: { fr: '25 bonnes réponses en un sprint', en: '25 correct answers in one sprint' }, xp: 60 },
  { id: 'math-40', icon: '🎓', game: 'speed-math', name: { fr: 'Calculateur prodige', en: 'Lightning calculator' }, desc: { fr: '40 bonnes réponses en un sprint', en: '40 correct answers in one sprint' }, xp: 130 },
  // --- Mots croisés
  { id: 'crossword-first', icon: '✏️', game: 'mini-crossword', name: { fr: 'Première grille', en: 'First grid' }, desc: { fr: 'Terminer une grille de mots croisés', en: 'Complete a crossword grid' }, xp: 50 },
  { id: 'crossword-3', icon: '📜', game: 'mini-crossword', name: { fr: 'Mots-croisiste', en: 'Crossword fan' }, desc: { fr: 'Terminer 3 grilles', en: 'Complete 3 grids' }, xp: 90 },
  // --- Vrai ou Faux
  { id: 'quiz-perfect', icon: '💯', game: 'health-true-false', name: { fr: 'Sans faute', en: 'Flawless' }, desc: { fr: 'Terminer une série sans aucune erreur', en: 'Finish a series without a single mistake' }, xp: 70 },
  { id: 'quiz-streak-15', icon: '🔗', game: 'health-true-false', name: { fr: '15 d’affilée', en: '15 in a row' }, desc: { fr: '15 bonnes réponses consécutives', en: '15 correct answers in a row' }, xp: 80 },
  // --- Jardin de Gran
  { id: 'merge-half', icon: '🌷', game: 'merge-garden', name: { fr: 'Jardinier discret', en: 'Quiet gardener' }, desc: { fr: 'Découvrir 8 espèces', en: 'Discover 8 species' }, xp: 60 },
  { id: 'merge-all', icon: '🏡', game: 'merge-garden', name: { fr: 'Jardin complet', en: 'Full garden' }, desc: { fr: 'Découvrir les 16 espèces', en: 'Discover all 16 species' }, xp: 150 },
  // --- 2048
  { id: 'n2048-1024', icon: '🥗', game: '2048-nutrition', name: { fr: '1024', en: '1024' }, desc: { fr: 'Atteindre la tuile 1024', en: 'Reach the 1024 tile' }, xp: 40 },
  { id: 'n2048-2048', icon: '🍽️', game: '2048-nutrition', name: { fr: '2048', en: '2048' }, desc: { fr: 'Atteindre la tuile 2048', en: 'Reach the 2048 tile' }, xp: 90 },
  { id: 'n2048-4096', icon: '👑', game: '2048-nutrition', name: { fr: '4096', en: '4096' }, desc: { fr: 'Atteindre la tuile 4096', en: 'Reach the 4096 tile' }, xp: 160 },
  // --- Sudoku
  { id: 'sudoku-hard', icon: '🧘', game: 'sudoku', name: { fr: 'Serein et solide', en: 'Calm and solid' }, desc: { fr: 'Résoudre une grille difficile', en: 'Solve a hard grid' }, xp: 80 },
  { id: 'sudoku-expert-nohints', icon: '☯️', game: 'sudoku', name: { fr: 'Maître zen', en: 'Zen master' }, desc: { fr: 'Résoudre une grille experte sans indice', en: 'Solve an expert grid with no hints' }, xp: 180 },
  // --- Mot du Jour
  { id: 'word-fast3', icon: '⚡', game: 'daily-word', name: { fr: 'Foudre verbale', en: 'Word flash' }, desc: { fr: 'Trouver le mot en 3 essais ou moins', en: 'Find the word in 3 tries or fewer' }, xp: 70 },
  { id: 'word-streak5', icon: '📅', game: 'daily-word', name: { fr: 'Cinq mots d’affilée', en: 'Five words in a row' }, desc: { fr: 'Gagner 5 défis quotidiens consécutifs', en: 'Win 5 daily challenges in a row' }, xp: 120 },
  // --- Démineur
  { id: 'mine-medium', icon: '🚩', game: 'minesweeper', name: { fr: 'Démineur aguerri', en: 'Seasoned sweeper' }, desc: { fr: 'Gagner une grille intermédiaire 16×16', en: 'Win a 16×16 intermediate grid' }, xp: 70 },
  { id: 'mine-expert', icon: '🥇', game: 'minesweeper', name: { fr: 'Expert en déminage', en: 'Expert sweeper' }, desc: { fr: 'Gagner une grille experte 24×16', en: 'Win a 24×16 expert grid' }, xp: 150 },
  // --- Block Puzzle
  { id: 'block-5000', icon: '🧱', game: 'block-puzzle', name: { fr: '5 000 points', en: '5,000 points' }, desc: { fr: 'Atteindre 5 000 points', en: 'Reach 5,000 points' }, xp: 80 },
  { id: 'block-combo4', icon: '💥', game: 'block-puzzle', name: { fr: 'Quadruple', en: 'Quadruple' }, desc: { fr: 'Effacer 4 lignes d’un coup', en: 'Clear 4 lines at once' }, xp: 100 },
  // --- Jigsaw
  { id: 'jigsaw-48', icon: '🖼️', game: 'jigsaw-puzzle', name: { fr: 'Patience d’or', en: 'Golden patience' }, desc: { fr: 'Terminer un puzzle de 48 pièces', en: 'Complete a 48-piece puzzle' }, xp: 90 },
  // --- Pill Toss
  { id: 'toss-combo-8', icon: '🎯', game: 'pill-toss', name: { fr: 'Huit d’affilée', en: 'Eight in a row' }, desc: { fr: '8 touches consécutives', en: '8 hits in a row' }, xp: 80 },
  { id: 'toss-score-30', icon: '🏹', game: 'pill-toss', name: { fr: 'Précision chirurgicale', en: 'Surgical precision' }, desc: { fr: 'Marquer 30 points en une manche', en: 'Score 30 points in one round' }, xp: 100 },
  // --- Fire Escape
  { id: 'fire-500', icon: '🚒', game: 'fire-escape', name: { fr: '500 mètres', en: '500 meters' }, desc: { fr: 'Parcourir 500 m', en: 'Travel 500 m' }, xp: 50 },
  { id: 'fire-1500', icon: '🧯', game: 'fire-escape', name: { fr: '1 500 mètres', en: '1,500 meters' }, desc: { fr: 'Parcourir 1 500 m', en: 'Travel 1,500 m' }, xp: 120 },
  // --- Zen Fishing
  { id: 'fish-10', icon: '🐟', game: 'zen-fishing', name: { fr: 'Collectionneur', en: 'Collector' }, desc: { fr: 'Attraper 10 espèces différentes', en: 'Catch 10 different species' }, xp: 80 },
  { id: 'fish-rare', icon: '🐠', game: 'zen-fishing', name: { fr: 'Prise rare', en: 'Rare catch' }, desc: { fr: 'Attraper une espèce rare', en: 'Catch a rare species' }, xp: 90 },
  // --- Fruit Slice
  { id: 'fruit-combo-4', icon: '🍉', game: 'fruit-slice', name: { fr: 'Quadruple tranche', en: 'Quad slice' }, desc: { fr: 'Trancher 4 fruits en un geste', en: 'Slice 4 fruits in one swipe' }, xp: 70 },
  { id: 'fruit-150', icon: '🌟', game: 'fruit-slice', name: { fr: '150 points', en: '150 points' }, desc: { fr: 'Atteindre 150 points', en: 'Reach 150 points' }, xp: 100 },
  // --- Devine l'Expression
  { id: 'idiom-streak3', icon: '💬', game: 'guess-the-idiom', name: { fr: 'Sans indice', en: 'No hints needed' }, desc: { fr: '3 expressions trouvées d’affilée sans indice', en: '3 idioms solved in a row without hints' }, xp: 80 },
  { id: 'idiom-10', icon: '🗣️', game: 'guess-the-idiom', name: { fr: 'Tribune', en: 'Wordsmith' }, desc: { fr: 'Trouver 10 expressions au total', en: 'Solve 10 idioms in total' }, xp: 90 },
  // --- Mot le Plus Long
  { id: 'longest-7', icon: '7️⃣', game: 'longest-word', name: { fr: 'Sept lettres', en: 'Seven letters' }, desc: { fr: 'Trouver un mot de 7 lettres', en: 'Find a 7-letter word' }, xp: 60 },
  { id: 'longest-9', icon: '9️⃣', game: 'longest-word', name: { fr: 'Neuf lettres !', en: 'Nine letters!' }, desc: { fr: 'Trouver un mot utilisant les 9 lettres', en: 'Find a word using all 9 letters' }, xp: 150 },
  // --- Histoire Interactive
  { id: 'story-first', icon: '📖', game: 'interactive-story', name: { fr: 'Fin atteinte', en: 'Ending reached' }, desc: { fr: 'Terminer une histoire', en: 'Finish a story' }, xp: 50 },
  { id: 'story-explorer', icon: '🧭', game: 'interactive-story', name: { fr: 'Toutes les fins', en: 'All endings' }, desc: { fr: 'Découvrir toutes les fins d’une histoire', en: 'Discover every ending of a story' }, xp: 140 },
]

export const BADGES_BY_ID: Record<string, BadgeDef> = Object.fromEntries(BADGES.map((b) => [b.id, b]))
