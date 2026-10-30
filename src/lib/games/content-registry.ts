import type { GameSEOContent } from '@/lib/games/types'

/**
 * ⚠️ REGISTRE SERVEUR — Task 27 (double vérification Task 26).
 *
 * Importe STATIQUEMENT le contenu SEO (`GameSEOContent`) de chacun des 20 jeux
 * depuis les fichiers de DONNÉES PURES `src/components/games/data/<jeu>-seo.ts`
 * afin de rendre le contenu éditorial de chaque page jeu DIRECTEMENT DANS LE
 * HTML BRUT (SSR) — lisible par les moteurs de réponse IA qui n'exécutent pas
 * JavaScript (GPTBot, ClaudeBot, PerplexityBot…) et par Google sans attendre le
 * rendu client.
 *
 * POURQUOI DES FICHIERS DE DONNÉES SÉPARÉS : les composants de jeu sont des
 * modules « use client » — les importer depuis un composant serveur (statique
 * OU dynamique) ne livre que des références clients (proxys sans données,
 * vérifié empiriquement). Les fichiers `-seo.ts` n'ont NI directive
 * « use client », NI import de module client : réellement double-usage,
 * exactement comme le catalogue (src/lib/games/catalog.ts) — importables par
 * le serveur ET par le client.
 *
 * SOURCE DE VÉRITÉ UNIQUE : chaque composant de jeu ré-exporte l'objet de son
 * fichier de données (`export const content = …-seo-content`) — le serveur et
 * le client servent des octets identiques, zéro duplication, zéro dérive.
 *
 * ⚠️ Ne JAMAIS importer ce fichier depuis un module client : cela annulerait
 * le code-splitting par jeu. Réservé aux composants serveur (src/app/page.tsx).
 */
import { memoryMatchSeoContent } from '@/components/games/data/memory-match-seo'
import { sequenceMemorySeoContent } from '@/components/games/data/sequence-memory-seo'
import { schulteTableSeoContent } from '@/components/games/data/schulte-table-seo'
import { speedMathSeoContent } from '@/components/games/data/speed-math-seo'
import { miniCrosswordSeoContent } from '@/components/games/data/mini-crossword-seo'
import { healthTrueFalseSeoContent } from '@/components/games/data/health-true-false-seo'
import { mergeGardenSeoContent } from '@/components/games/data/merge-garden-seo'
import { n2048NutritionSeoContent } from '@/components/games/data/2048-nutrition-seo'
import { sudokuSeoContent } from '@/components/games/data/sudoku-seo'
import { dailyWordSeoContent } from '@/components/games/data/daily-word-seo'
import { minesweeperSeoContent } from '@/components/games/data/minesweeper-seo'
import { blockPuzzleSeoContent } from '@/components/games/data/block-puzzle-seo'
import { jigsawPuzzleSeoContent } from '@/components/games/data/jigsaw-puzzle-seo'
import { pillTossSeoContent } from '@/components/games/data/pill-toss-seo'
import { fireEscapeSeoContent } from '@/components/games/data/fire-escape-seo'
import { zenFishingSeoContent } from '@/components/games/data/zen-fishing-seo'
import { fruitSliceSeoContent } from '@/components/games/data/fruit-slice-seo'
import { guessTheIdiomSeoContent } from '@/components/games/data/guess-the-idiom-seo'
import { longestWordSeoContent } from '@/components/games/data/longest-word-seo'
import { interactiveStorySeoContent } from '@/components/games/data/interactive-story-seo'

/** Contenu SEO des 20 jeux (données pures, double-usage serveur/client). */
export const GAME_CONTENT: Record<string, GameSEOContent> = {
  'memory-match': memoryMatchSeoContent,
  'sequence-memory': sequenceMemorySeoContent,
  'schulte-table': schulteTableSeoContent,
  'speed-math': speedMathSeoContent,
  'mini-crossword': miniCrosswordSeoContent,
  'health-true-false': healthTrueFalseSeoContent,
  'merge-garden': mergeGardenSeoContent,
  '2048-nutrition': n2048NutritionSeoContent,
  sudoku: sudokuSeoContent,
  'daily-word': dailyWordSeoContent,
  minesweeper: minesweeperSeoContent,
  'block-puzzle': blockPuzzleSeoContent,
  'jigsaw-puzzle': jigsawPuzzleSeoContent,
  'pill-toss': pillTossSeoContent,
  'fire-escape': fireEscapeSeoContent,
  'zen-fishing': zenFishingSeoContent,
  'fruit-slice': fruitSliceSeoContent,
  'guess-the-idiom': guessTheIdiomSeoContent,
  'longest-word': longestWordSeoContent,
  'interactive-story': interactiveStorySeoContent,
}

/** Contenu SEO d'un jeu — `null` si slug inconnu. */
export function getGameContent(slug: string): GameSEOContent | null {
  return GAME_CONTENT[slug] ?? null
}
