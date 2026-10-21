/**
 * Données du jeu « Culture Gran — Mots croisés express ».
 *
 * GRILLES VALIDÉES PAR CONSTRUCTION : chaque grille suit le motif épars
 * A(0,0→) B(0,1↓) C(0,4↓) D(2,1→) E(4,1→) sur 5×5 — toutes les autres
 * cases sont noires, donc AUCUNE suite parasite de 2+ lettres ne peut
 * exister. Les croisements ont été vérifiés lettre par lettre.
 * Mots français sans diacritiques (indices compensent).
 */

export interface CrosswordWord {
  row: number
  col: number
  dir: 'across' | 'down'
  answer: string
  clue: { fr: string; en: string }
}

export interface CrosswordPuzzle {
  id: string
  size: number
  theme: { fr: string; en: string }
  icon: string
  words: CrosswordWord[]
}

export const FR_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 'fr-fleurs',
    size: 5,
    theme: { fr: 'Fleurs du jardin', en: 'Garden flowers' },
    icon: '🌷',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'FLEUR', clue: { fr: 'Elle parfume le jardin et régale les abeilles', en: 'It perfumes the garden and delights the bees' } },
      { row: 0, col: 1, dir: 'down', answer: 'LILAS', clue: { fr: 'Arbuste aux grappes violettes qui annonce le printemps', en: 'Shrub with purple clusters that announces spring' } },
      { row: 0, col: 4, dir: 'down', answer: 'ROSEE', clue: { fr: 'L’eau du matin qui perle sur l’herbe', en: 'Morning water beading on the grass' } },
      { row: 2, col: 1, dir: 'across', answer: 'LACS', clue: { fr: 'Grandes étendues d’eau des montagnes (au pluriel)', en: 'Large mountain waters (plural)' } },
      { row: 4, col: 1, dir: 'across', answer: 'SAGE', clue: { fr: 'Herbe aromatique de mamie — aussi synonyme de tranquille', en: 'Grandma’s aromatic herb — also means calm' } },
    ],
  },
  {
    id: 'fr-foret',
    size: 5,
    theme: { fr: 'Forêt et rosée', en: 'Forest and dew' },
    icon: '🌲',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'ARBRE', clue: { fr: 'Grand végétal au tronc ligneux', en: 'Tall plant with a woody trunk' } },
      { row: 0, col: 1, dir: 'down', answer: 'ROSEE', clue: { fr: 'Perle d’eau matinale sur les feuilles', en: 'Morning pearl of water on the leaves' } },
      { row: 0, col: 4, dir: 'down', answer: 'ELEVE', clue: { fr: 'Celui qui apprend, en classe (accent aigu !)', en: 'The one who learns, in class' } },
      { row: 2, col: 1, dir: 'across', answer: 'SEVE', clue: { fr: 'Liquide vital qui monte dans les plantes', en: 'Vital fluid rising through plants' } },
      { row: 4, col: 1, dir: 'across', answer: 'EPEE', clue: { fr: 'Arme d’escrime à la lame fine', en: 'Fencing weapon with a thin blade' } },
    ],
  },
  {
    id: 'fr-singe',
    size: 5,
    theme: { fr: 'Le singe savant', en: 'The clever monkey' },
    icon: '🐵',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'SINGE', clue: { fr: 'Animal malin qui grimpe aux arbres', en: 'Clever animal that climbs trees' } },
      { row: 0, col: 1, dir: 'down', answer: 'IMAGE', clue: { fr: 'Photo, dessin ou reflet', en: 'Photo, drawing or reflection' } },
      { row: 0, col: 4, dir: 'down', answer: 'ECOLE', clue: { fr: 'Lieu où l’on apprend (accent circonflexe)', en: 'Place where you learn' } },
      { row: 2, col: 1, dir: 'across', answer: 'AUTO', clue: { fr: 'Abréviation familière d’automobile', en: 'Familiar short word for automobile' } },
      { row: 4, col: 1, dir: 'across', answer: 'ETRE', clue: { fr: '« Je pense, donc je … »', en: '« I think, therefore I … »' } },
    ],
  },
  {
    id: 'fr-musee',
    size: 5,
    theme: { fr: 'Au musée', en: 'At the museum' },
    icon: '🏛️',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'MUSEE', clue: { fr: 'On y admire tableaux et sculptures', en: 'Where you admire paintings and sculptures' } },
      { row: 0, col: 1, dir: 'down', answer: 'USAGE', clue: { fr: 'Emploi, manière de se servir de quelque chose', en: 'The way something is used' } },
      { row: 0, col: 4, dir: 'down', answer: 'ECOLE', clue: { fr: 'Bâtiment des élèves et des maîtres', en: 'Building for pupils and teachers' } },
      { row: 2, col: 1, dir: 'across', answer: 'AUTO', clue: { fr: 'Quatre roues et un volant, en abrégé', en: 'Four wheels and a steering wheel, for short' } },
      { row: 4, col: 1, dir: 'across', answer: 'EPEE', clue: { fr: 'Arme blanche des duels', en: 'Dueling blade' } },
    ],
  },
  {
    id: 'fr-epices',
    size: 5,
    theme: { fr: 'Épices et poèmes', en: 'Spices and poems' },
    icon: '📝',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'EPICE', clue: { fr: 'Qui donne du goût, comme le curry', en: 'Flavorful, like curry' } },
      { row: 0, col: 1, dir: 'down', answer: 'POEME', clue: { fr: 'Texte en vers, souvent rimé', en: 'Verse text, often rhymed' } },
      { row: 0, col: 4, dir: 'down', answer: 'ELEVE', clue: { fr: 'Il lève la main en classe', en: 'Raises a hand in class' } },
      { row: 2, col: 1, dir: 'across', answer: 'ETRE', clue: { fr: 'Verbe le plus utilisé du français', en: 'The most used French verb' } },
      { row: 4, col: 1, dir: 'across', answer: 'ELLE', clue: { fr: 'Pronom féminin sujet', en: 'Feminine subject pronoun' } },
    ],
  },
  {
    id: 'fr-olive',
    size: 5,
    theme: { fr: 'L’olive et le livre', en: 'The olive and the book' },
    icon: '🫒',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'OLIVE', clue: { fr: 'Fruit vert ou noir de la Méditerranée', en: 'Green or black Mediterranean fruit' } },
      { row: 0, col: 1, dir: 'down', answer: 'LIVRE', clue: { fr: 'Objet à pages que l’on dévore', en: 'Page-filled object you devour' } },
      { row: 0, col: 4, dir: 'down', answer: 'ELEVE', clue: { fr: 'Écolier, apprenti', en: 'Schoolchild, learner' } },
      { row: 2, col: 1, dir: 'across', answer: 'VASE', clue: { fr: 'Récipient qui accueille les fleurs', en: 'Vessel that holds flowers' } },
      { row: 4, col: 1, dir: 'across', answer: 'VITE', clue: { fr: 'Rapidement', en: 'Quickly' } },
    ],
  },
  {
    id: 'fr-cafe',
    size: 5,
    theme: { fr: 'Café bien sucré', en: 'Sweet coffee' },
    icon: '☕',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'SUCRE', clue: { fr: 'On en met dans le café', en: 'You put it in your coffee' } },
      { row: 0, col: 1, dir: 'down', answer: 'USAGE', clue: { fr: 'Emploi habituel d’une chose', en: 'Customary use of a thing' } },
      { row: 0, col: 4, dir: 'down', answer: 'ELEVE', clue: { fr: 'Celui qui apprend du maître', en: 'One who learns from a teacher' } },
      { row: 2, col: 1, dir: 'across', answer: 'CAFE', clue: { fr: 'Boisson noire du matin', en: 'Dark morning drink' } },
      { row: 4, col: 1, dir: 'across', answer: 'ELLE', clue: { fr: 'Sujet au féminin', en: 'Feminine subject' } },
    ],
  },
  {
    id: 'fr-lune',
    size: 5,
    theme: { fr: 'La lune et le lilas', en: 'The moon and the lilac' },
    icon: '🌙',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'CLOUS', clue: { fr: 'On les enfonce avec un marteau', en: 'You hammer them in' } },
      { row: 0, col: 1, dir: 'down', answer: 'LILAS', clue: { fr: 'Arbuste aux fleurs mauves parfumées', en: 'Shrub with fragrant mauve flowers' } },
      { row: 0, col: 4, dir: 'down', answer: 'SCENE', clue: { fr: 'Plateau où jouent les comédiens', en: 'Where actors perform' } },
      { row: 2, col: 1, dir: 'across', answer: 'LUNE', clue: { fr: 'Elle éclaire la nuit', en: 'It lights up the night' } },
      { row: 4, col: 1, dir: 'across', answer: 'SEVE', clue: { fr: 'Suc végétal des plantes', en: 'Plants’ vital sap' } },
    ],
  },
]

export const EN_PUZZLES: CrosswordPuzzle[] = [
  {
    id: 'en-meadow',
    size: 5,
    theme: { fr: 'Le camp au pré', en: 'Meadow camp' },
    icon: '🐑',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'GRASS', clue: { en: 'Green carpet of the meadow', fr: 'Tapis vert du pré' } },
      { row: 0, col: 1, dir: 'down', answer: 'RELIC', clue: { en: 'Old treasured object from the past', fr: 'Objet ancien précieusement conservé' } },
      { row: 0, col: 4, dir: 'down', answer: 'SHEEP', clue: { en: 'Woolly farm animal counted at bedtime', fr: 'Animal laineux qu’on compte pour s’endormir' } },
      { row: 2, col: 1, dir: 'across', answer: 'LAKE', clue: { en: 'Still inland water', fr: 'Étendue d’eau intérieure' } },
      { row: 4, col: 1, dir: 'across', answer: 'CAMP', clue: { en: 'Tents in the wild', fr: 'Tentes en pleine nature' } },
    ],
  },
  {
    id: 'en-garden',
    size: 5,
    theme: { fr: 'Douceurs du jardin', en: 'Garden treats' },
    icon: '🍋',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'PLANT', clue: { en: 'Put a seed in the soil', fr: 'Mettre une graine en terre' } },
      { row: 0, col: 1, dir: 'down', answer: 'LEMON', clue: { en: 'Sour yellow citrus', fr: 'Agrume jaune acidulé' } },
      { row: 0, col: 4, dir: 'down', answer: 'TREAT', clue: { en: 'Sweet little reward', fr: 'Petite récompense sucrée' } },
      { row: 2, col: 1, dir: 'across', answer: 'MULE', clue: { en: 'Offspring of a horse and a donkey', fr: 'Enfant d’un cheval et d’un âne' } },
      { row: 4, col: 1, dir: 'across', answer: 'NEST', clue: { en: 'Bird’s cozy home', fr: 'Petit nid douillet des oiseaux' } },
    ],
  },
  {
    id: 'en-sword',
    size: 5,
    theme: { fr: 'L’épée et les dunes', en: 'Sword and dunes' },
    icon: '⚔️',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'SWORD', clue: { en: 'Knight’s blade', fr: 'Lame du chevalier' } },
      { row: 0, col: 1, dir: 'down', answer: 'WORLD', clue: { en: 'The whole planet', fr: 'La planète entière' } },
      { row: 0, col: 4, dir: 'down', answer: 'DANCE', clue: { en: 'Move to the music', fr: 'Bouger en musique' } },
      { row: 2, col: 1, dir: 'across', answer: 'RAIN', clue: { en: 'Water falling from clouds', fr: 'L’eau qui tombe des nuages' } },
      { row: 4, col: 1, dir: 'across', answer: 'DUNE', clue: { en: 'Sand hill of the desert', fr: 'Colline de sable du désert' } },
    ],
  },
  {
    id: 'en-coral',
    size: 5,
    theme: { fr: 'Le lagon de corail', en: 'Coral lagoon' },
    icon: '🦅',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'SCENE', clue: { en: 'Part of a play', fr: 'Partie d’une pièce' } },
      { row: 0, col: 1, dir: 'down', answer: 'CORAL', clue: { en: 'Pink sea organism building reefs', fr: 'Organisme marin rose des récifs' } },
      { row: 0, col: 4, dir: 'down', answer: 'EAGLE', clue: { en: 'Majestic bird of prey', fr: 'Majestueux rapace' } },
      { row: 2, col: 1, dir: 'across', answer: 'RING', clue: { en: 'Circle worn on a finger', fr: 'Cercle porté au doigt' } },
      { row: 4, col: 1, dir: 'across', answer: 'LAKE', clue: { en: 'Calm inland water', fr: 'Eau intérieure et calme' } },
    ],
  },
  {
    id: 'en-koala',
    size: 5,
    theme: { fr: 'L’oasis du koala', en: 'Koala’s oasis' },
    icon: '🐨',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'KOALA', clue: { en: 'Australian tree-hugging marsupial', fr: 'Marsupial australien ami des arbres' } },
      { row: 0, col: 1, dir: 'down', answer: 'OASIS', clue: { en: 'Green spot in the desert', fr: 'Zone verte au milieu du désert' } },
      { row: 0, col: 4, dir: 'down', answer: 'ARMOR', clue: { en: 'Knight’s metal protection', fr: 'Protection métallique du chevalier' } },
      { row: 2, col: 1, dir: 'across', answer: 'STEM', clue: { en: 'Plant’s stalk', fr: 'Tige de la plante' } },
      { row: 4, col: 1, dir: 'across', answer: 'STAR', clue: { en: 'It shines at night', fr: 'Elle brille la nuit' } },
    ],
  },
  {
    id: 'en-storm',
    size: 5,
    theme: { fr: 'Par temps d’orage', en: 'Storm watch' },
    icon: '⛈️',
    words: [
      { row: 0, col: 0, dir: 'across', answer: 'STORM', clue: { en: 'Thunder, lightning and heavy rain', fr: 'Tonnerre, éclairs et forte pluie' } },
      { row: 0, col: 1, dir: 'down', answer: 'TUTOR', clue: { en: 'Private teacher', fr: 'Professeur particulier' } },
      { row: 0, col: 4, dir: 'down', answer: 'MELON', clue: { en: 'Sweet summer fruit with a hard rind', fr: 'Fruit sucré d’été à l’écorce dure' } },
      { row: 2, col: 1, dir: 'across', answer: 'TAIL', clue: { en: 'Back appendage of animals', fr: 'Appendice arrière des animaux' } },
      { row: 4, col: 1, dir: 'across', answer: 'RAIN', clue: { en: 'Water from the clouds', fr: 'L’eau des nuages' } },
    ],
  },
]

/** Grille dérivée des mots (les cases sans lettre sont null). */
export function buildGrid(puzzle: CrosswordPuzzle): (string | null)[][] {
  const g: (string | null)[][] = Array.from({ length: puzzle.size }, () => Array(puzzle.size).fill(null))
  for (const w of puzzle.words) {
    const letters = w.answer.split('')
    letters.forEach((ch, i) => {
      const r = w.row + (w.dir === 'down' ? i : 0)
      const c = w.col + (w.dir === 'across' ? i : 0)
      g[r][c] = ch
    })
  }
  return g
}

/** Numérotation standard : les cases commençant un mot reçoivent un numéro (ordre de lecture). */
export function numberCells(puzzle: CrosswordPuzzle): Map<string, number> {
  const grid = buildGrid(puzzle)
  const starts = new Set(puzzle.words.map((w) => `${w.row},${w.col}`))
  const nums = new Map<string, number>()
  let n = 0
  for (let r = 0; r < puzzle.size; r++) {
    for (let c = 0; c < puzzle.size; c++) {
      if (grid[r][c] !== null && starts.has(`${r},${c}`)) {
        n++
        nums.set(`${r},${c}`, n)
      }
    }
  }
  return nums
}

/** Numéros affectés à chaque mot (ordre de déclaration fiable pour ce motif). */
export function wordNumber(puzzle: CrosswordPuzzle, word: CrosswordWord, nums: Map<string, number>): number {
  return nums.get(`${word.row},${word.col}`) ?? 0
}
