import type { Lang } from '@/lib/i18n'

export interface GuideSection {
  h: string
  p: string[]
}

export interface Guide {
  slug: string
  icon: string
  date: string
  readMinutes: number
  title: Record<Lang, string>
  description: Record<Lang, string>
  sections: Record<Lang, GuideSection[]>
}

export const GUIDES: Guide[] = [
  {
    slug: 'ameliorer-sa-memoire',
    icon: '🧠',
    date: '2025-05-30',
    readMinutes: 6,
    title: {
      fr: 'Comment améliorer sa mémoire avec des jeux (méthode simple)',
      en: 'How to improve your memory with games (a simple method)',
    },
    description: {
      fr: 'Mémoire de travail, attention, concentration : comment progresser durablement grâce à des sessions de jeux courtes et régulières.',
      en: 'Working memory, attention, focus: how to make lasting progress with short, regular game sessions.',
    },
    sections: {
      fr: [
        {
          h: 'Pourquoi les jeux de mémoire fonctionnent',
          p: [
            "Les jeux de mémoire comme Memory Match ou les séquences lumineuses de Gran' Mémoire sollicitent la mémoire de travail : cette capacité à retenir et manipuler brièvement des informations. Comme pour un muscle, c'est la répétition régulière, et non l'effort intensif ponctuel, qui entretient cette fonction.",
            "Important : progresser à un jeu démontre que vous vous entraînez à ce jeu. Ce n'est pas une preuve d'amélioration générale de la mémoire. L'entraînement cérébral reste une activité ludique et stimulante, pas un traitement.",
          ],
        },
        {
          h: 'La méthode des sessions courtes',
          p: [
            "Privilégiez des sessions de 10 à 15 minutes, idéalement quotidiennes. Le défi du jour de Granmed est conçu pour cela : une grille spéciale par jeu, renouvelée chaque matin, qui donne une raison de revenir sans y passer des heures.",
            "Alternez les mécaniques : mémorisation de positions (Memory Match), séquences auditives et visuelles (Gran' Mémoire), recherche visuelle rapide (table de Schulte). Chaque jeu fait travailler un angle légèrement différent.",
          ],
        },
        {
          h: 'Mesurer ses progrès sans se mentir',
          p: [
            "Notez vos records : nombre de coups au memory, longueur de séquence atteinte, temps sur une grille de Schulte. Un tableau de bord comme « Mon parcours Granmed » rend la progression visible et motivante.",
            "Comparez-vous à vous-même, pas aux autres. La fatigue, le stress et l'heure influencent énormément les performances : une mauvaise journée ne dit rien de vos capacités.",
          ],
        },
        {
          h: 'Trois habitudes complémentaires',
          p: [
            "Le sommeil consolide les apprentissages : une bonne nuit avant une session fait souvent plus de différence qu'une heure de jeu supplémentaire.",
            "L'activité physique régulière améliore la circulation cérébrale. Enfin, varier les activités (lecture, conversations, cuisine, jardinage) reste le meilleur entraînement global — les jeux sont un complément agréable, pas un substitut.",
          ],
        },
      ],
      en: [
        {
          h: 'Why memory games work',
          p: [
            "Memory games like Memory Match or Gran's Memory light sequences engage working memory: the ability to briefly hold and manipulate information. As with a muscle, regular repetition — not occasional intense effort — maintains this function.",
            "Important: getting better at a game shows you are training at that game. It is not proof of a general memory improvement. Brain training remains a fun, stimulating activity, not a treatment.",
          ],
        },
        {
          h: 'The short-session method',
          p: [
            "Aim for 10–15 minute sessions, ideally daily. Granmed's daily challenge is designed for exactly that: one special grid per game, refreshed every morning, giving you a reason to come back without spending hours.",
            "Alternate mechanics: position memory (Memory Match), audio-visual sequences (Gran's Memory), fast visual search (Schulte tables). Each game works a slightly different angle.",
          ],
        },
        {
          h: 'Measuring progress honestly',
          p: [
            "Track your records: moves in memory games, sequence length reached, time on a Schulte grid. A dashboard like “My Granmed journey” makes progress visible and motivating.",
            "Compare yourself to yourself, not to others. Fatigue, stress and time of day hugely influence performance: one bad day says nothing about your abilities.",
          ],
        },
        {
          h: 'Three complementary habits',
          p: [
            "Sleep consolidates learning: a good night before a session often beats an extra hour of play.",
            "Regular physical activity improves cerebral circulation. Finally, varying activities (reading, conversations, cooking, gardening) remains the best overall training — games are a pleasant complement, not a substitute.",
          ],
        },
      ],
    },
  },
  {
    slug: 'regles-sudoku-debutants',
    icon: '🔢',
    date: '2025-05-20',
    readMinutes: 7,
    title: {
      fr: 'Les règles du sudoku expliquées aux débutants',
      en: 'Sudoku rules explained for beginners',
    },
    description: {
      fr: 'Grille, lignes, régions : toutes les règles du sudoku, les erreurs de débutant à éviter et les premières techniques pour résoudre une grille facile.',
      en: 'Grid, rows, regions: all the sudoku rules, common beginner mistakes and the first techniques to solve an easy grid.',
    },
    sections: {
      fr: [
        {
          h: 'La grille et les trois règles d’or',
          p: [
            "Une grille de sudoku classique contient 81 cases réparties en 9 lignes, 9 colonnes et 9 régions de 3×3. Le but : remplir chaque case avec un chiffre de 1 à 9 en respectant trois règles simples.",
            "Règle 1 : chaque ligne contient chaque chiffre de 1 à 9 exactement une fois. Règle 2 : chaque colonne aussi. Règle 3 : chaque région de 3×3 également. Une grille bien construite n'a qu'une seule solution.",
          ],
        },
        {
          h: 'Par où commencer',
          p: [
            "Cherchez les lignes, colonnes ou régions déjà bien remplies. Si une région ne manque que d'un chiffre, la case vide le révèle immédiatement : c'est un « singleton obvious ».",
            "Ensuite, pour chaque case vide, notez discrètement les candidats possibles (Sudoku Zen propose un mode notes intégré). Une case qui n'a qu'un seul candidat peut être remplie sans risque.",
          ],
        },
        {
          h: 'La technique du balayage',
          p: [
            "Choisissez un chiffre, par exemple le 5, et balayez la grille : chaque 5 déjà placé « interdit » sa ligne, sa colonne et sa région. Les cases restantes possibles pour le 5 se réduisent vite. Si une région n'a qu'une seule case possible, placez-le.",
            "Répétez ce balayage pour les chiffres les plus présents. Cette seule technique suffit à résoudre la plupart des grilles faciles et moyennes.",
          ],
        },
        {
          h: 'Les erreurs classiques',
          p: [
            "Deviner est la première cause d'échec : une erreur en début de grille ne se voit souvent qu'à la fin. Utilisez la vérification d'erreurs de Sudoku Zen pour corriger tôt.",
            "Deuxième erreur : oublier de noter les candidats sur les grilles difficiles. Troisième : s'acharner. Après 20 minutes de blocage, une pause de cinq minutes fait souvent retrouver la case fautive du premier coup d'œil.",
          ],
        },
      ],
      en: [
        {
          h: 'The grid and the three golden rules',
          p: [
            "A classic sudoku grid has 81 cells arranged in 9 rows, 9 columns and 9 regions of 3×3. The goal: fill each cell with a digit from 1 to 9 following three simple rules.",
            "Rule 1: each row contains each digit exactly once. Rule 2: each column too. Rule 3: each 3×3 region as well. A well-built grid has exactly one solution.",
          ],
        },
        {
          h: 'Where to start',
          p: [
            "Look for rows, columns or regions that are already well filled. If a region is missing just one digit, the empty cell reveals it immediately: that's an obvious single.",
            "Then, for each empty cell, quietly note the possible candidates (Sudoku Zen has a built-in notes mode). A cell with only one candidate can be filled safely.",
          ],
        },
        {
          h: 'The scanning technique',
          p: [
            "Pick a digit, say 5, and scan the grid: every placed 5 'forbids' its row, column and region. The remaining possible cells for the 5 shrink quickly. If a region has only one possible cell, place it.",
            "Repeat this scan for the most frequent digits. This single technique solves most easy and medium grids.",
          ],
        },
        {
          h: 'Classic mistakes',
          p: [
            "Guessing is the top cause of failure: an early mistake often only shows up at the very end. Use Sudoku Zen's error checking to correct early.",
            "Second mistake: skipping candidate notes on hard grids. Third: grinding. After 20 minutes of being stuck, a five-minute break often reveals the faulty cell at first glance.",
          ],
        },
      ],
    },
  },
  {
    slug: 'gagner-au-2048',
    icon: '🍎',
    date: '2025-05-10',
    readMinutes: 5,
    title: {
      fr: 'Gagner au 2048 : 5 stratégies qui fonctionnent vraiment',
      en: 'Winning at 2048: 5 strategies that actually work',
    },
    description: {
      fr: 'Coin stratégique, construction en serpent, gestion des rangées : les techniques éprouvées pour atteindre la tuile 2048.',
      en: 'Strategic corner, snake building, row management: proven techniques to reach the 2048 tile.',
    },
    sections: {
      fr: [
        {
          h: 'Stratégie 1 — Choisissez un coin et ne le quittez plus',
          p: [
            "La plupart des parties gagnantes gardent leur plus grosse tuile dans un coin, par exemple en bas à droite. Concentrez vos mouvements sur trois directions (bas, droite, et une direction latérale de secours) et n'utilisez la quatrième qu'en dernier recours.",
            "Pourquoi ? Une grande tuile au centre se retrouve vite bloquée entre des petites tuiles. Au coin, elle reste libre de fusionner avec les tuiles qui arrivent.",
          ],
        },
        {
          h: 'Stratégie 2 — Construisez en serpent',
          p: [
            "Organisez vos tuiles par valeurs décroissantes en serpent : la plus grosse en bas à droite, puis 512, 256, 128… en remontant la rangée du bas, puis en redescendant la rangée du dessus.",
            "Ainsi, chaque fusion en cascade rapproche automatiquement les tuiles de même valeur, sans casser votre structure.",
          ],
        },
        {
          h: 'Stratégie 3 — Ne jamais remplir la rangée de secours',
          p: [
            "Si votre coin est en bas à droite, gardez la rangée du haut la plus vide possible. Une rangée du bas pleine avec une nouvelle tuile mal placée au-dessus de votre 1024, et c'est souvent la fin.",
            "Règle pratique : si vous devez choisir entre fusionner à gauche ou fusionner en haut, choisissez presque toujours la fusion qui ne touche pas à votre structure.",
          ],
        },
        {
          h: 'Stratégies 4 et 5 — Patience et annulations',
          p: [
            "Le 2048 se gagne lentement : viser des fusions propres vaut mieux que des mouvements rapides qui éparpillent les tuiles. Avant chaque mouvement, demandez-vous où apparaîtra la nouvelle tuile.",
            "2048 Nutrition offre trois annulations par partie : gardez-les pour les vraies erreurs de manipulation, pas pour tester un mouvement incertain. Et souvenez-vous : la partie se sauvegarde, vous pouvez reprendre plus tard.",
          ],
        },
      ],
      en: [
        {
          h: 'Strategy 1 — Pick a corner and never leave it',
          p: [
            "Most winning games keep their largest tile in one corner, say bottom-right. Focus your moves on three directions (down, right, and one side direction) and use the fourth only as a last resort.",
            "Why? A big tile in the center quickly gets trapped between small tiles. In the corner, it stays free to merge with incoming tiles.",
          ],
        },
        {
          h: 'Strategy 2 — Build a snake',
          p: [
            "Arrange your tiles in descending order like a snake: the largest at the bottom right, then 512, 256, 128… going up the bottom row, then down the row above.",
            "That way, every cascading merge automatically brings same-value tiles together without breaking your structure.",
          ],
        },
        {
          h: 'Strategy 3 — Never fill your escape row',
          p: [
            "If your corner is bottom-right, keep the top row as empty as possible. A full bottom row with a badly placed new tile above your 1024 is often game over.",
            "Practical rule: when choosing between merging left or merging up, almost always pick the merge that doesn't disturb your structure.",
          ],
        },
        {
          h: 'Strategies 4 & 5 — Patience and undos',
          p: [
            "2048 is won slowly: aiming for clean merges beats fast moves that scatter tiles. Before each move, ask yourself where the new tile will appear.",
            "2048 Nutrition gives three undos per game: save them for genuine misclicks, not to test an uncertain move. And remember: your game auto-saves, you can resume later.",
          ],
        },
      ],
    },
  },
  {
    slug: 'jeux-de-mots-vocabulaire',
    icon: '✨',
    date: '2025-04-28',
    readMinutes: 5,
    title: {
      fr: 'Jeux de mots : la méthode douce pour enrichir son vocabulaire',
      en: 'Word games: the gentle way to grow your vocabulary',
    },
    description: {
      fr: 'Mot du jour, mot le plus long, expressions : comment utiliser les jeux de mots pour découvrir et mémoriser de nouveaux mots, en français comme en anglais.',
      en: 'Daily word, longest word, idioms: how to use word games to discover and memorize new words, in French and English alike.',
    },
    sections: {
      fr: [
        {
          h: 'Pourquoi les jeux de mots sont si efficaces',
          p: [
            "On mémorise mieux un mot rencontré en jouant qu'un mot appris dans une liste. Le jeu ajoute l'effort (chercher le mot), l'émotion (la victoire ou le raté) et la répétition espacée (revenir chaque jour) — trois piliers de la mémorisation durable.",
            "Le Mot du Jour Santé fonctionne exactement ainsi : un mot par jour, six tentatives, et des statistiques qui donnent envie de revenir demain.",
          ],
        },
        {
          h: 'Construire une routine de 5 minutes',
          p: [
            "Commencez par le mot du jour, puis enchaînez avec Le Mot le Plus Long en mode défi : les neuf lettres du jour sont identiques pour tous les joueurs, ce qui permet de comparer vos trouvailles.",
            "Notez dans un carnet (ou une note de téléphone) les mots découverts que vous aimez. Trois mots par jour suffisent : c'est la régularité qui compte, pas la quantité.",
          ],
        },
        {
          h: 'Les expressions, mine d’or culturelle',
          p: [
            "Devine l'Expression va au-delà du vocabulaire : chaque expression vient avec son origine et son contexte. Comprendre pourquoi on dit « poser un lapin » rend le mot inoubliable.",
            "En anglais, beaucoup d'expressions n'ont pas d'équivalent littéral français — et inversement. C'est précisément cette différence culturelle qui rend le jeu intéressant dans les deux langues.",
          ],
        },
        {
          h: 'Jouer en deux langues',
          p: [
            "Granmed propose chaque jeu de mots avec ses propres dictionnaires, mots et règles selon la langue. Alterner français et anglais dans la même semaine est un excellent exercice : le cerveau doit inhiber une langue pour en activer une autre.",
            "Astuce : jouez au mot du jour en anglais le lundi, mercredi et vendredi, en français les autres jours. Vous verrez vite la différence dans votre aisance.",
          ],
        },
      ],
      en: [
        {
          h: 'Why word games work so well',
          p: [
            "A word met while playing sticks better than a word learned from a list. Play adds effort (hunting the word), emotion (winning or missing) and spaced repetition (coming back daily) — three pillars of lasting memorization.",
            "The Daily Word Game works exactly like that: one word a day, six tries, and statistics that make you want to come back tomorrow.",
          ],
        },
        {
          h: 'Building a 5-minute routine',
          p: [
            "Start with the daily word, then follow with The Longest Word in challenge mode: the day's nine letters are the same for every player, so you can compare your finds.",
            "Jot down (in a notebook or phone note) the words you discover and like. Three words a day is plenty: consistency beats quantity.",
          ],
        },
        {
          h: 'Idioms, a cultural goldmine',
          p: [
            "Guess the Idiom goes beyond vocabulary: every idiom comes with its origin and context. Understanding why the French “poser un lapin” (to stand someone up, literally 'lay a rabbit') exists makes it unforgettable.",
            "In English, many idioms have no literal French equivalent — and vice versa. That cultural gap is exactly what makes the game interesting in both languages.",
          ],
        },
        {
          h: 'Playing in two languages',
          p: [
            "Granmed offers each word game with its own dictionaries, words and rules per language. Alternating French and English within the same week is excellent exercise: the brain must suppress one language to activate the other.",
            "Tip: play the daily word in English on Monday, Wednesday and Friday, in French on other days. You'll soon notice the difference in fluency.",
          ],
        },
      ],
    },
  },
]

export const GUIDES_BY_SLUG: Record<string, Guide> = Object.fromEntries(GUIDES.map((g) => [g.slug, g]))
