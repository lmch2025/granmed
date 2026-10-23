'use client'

import type { CSSProperties, ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useLang } from '@/lib/i18n'
import { getGame } from '@/lib/games/catalog'

/* =========================================================================
   GamePreview — aperçu animé unique par jeu.
   Chaque jeu possède sa propre mini-scène vivante (100 % CSS, émojis +
   keyframes pv-* de globals.css) qui donne envie de cliquer :
   cartes qui se retournent, pads qui s'illuminent, fusions, découpes…
   ========================================================================= */

/** Dégradé de fond par jeu — la teinte de catégorie domine, la seconde varie. */
const PREVIEW_BG: Record<string, string> = {
  'memory-match': 'from-rose-200 via-pink-200 to-rose-100',
  'sequence-memory': 'from-rose-200 via-amber-200 to-orange-200',
  'schulte-table': 'from-rose-200 via-orange-100 to-amber-200',
  'speed-math': 'from-rose-200 via-amber-200 to-yellow-200',
  'mini-crossword': 'from-rose-200 via-fuchsia-100 to-rose-100',
  'health-true-false': 'from-rose-200 via-emerald-100 to-green-100',
  'merge-garden': 'from-lime-200 via-emerald-200 to-teal-100',
  '2048-nutrition': 'from-emerald-200 via-amber-100 to-orange-200',
  'sudoku': 'from-teal-200 via-emerald-200 to-green-200',
  'daily-word': 'from-emerald-200 via-green-200 to-lime-200',
  'minesweeper': 'from-emerald-200 via-stone-200 to-neutral-200',
  'block-puzzle': 'from-emerald-200 via-teal-100 to-cyan-100',
  'jigsaw-puzzle': 'from-emerald-200 via-rose-100 to-rose-200',
  'pill-toss': 'from-amber-200 via-rose-200 to-red-200',
  'fire-escape': 'from-orange-300 via-red-200 to-amber-200',
  'zen-fishing': 'from-amber-200 via-teal-200 to-emerald-200',
  'fruit-slice': 'from-amber-200 via-lime-200 to-yellow-200',
  'guess-the-idiom': 'from-violet-200 via-purple-200 to-violet-100',
  'longest-word': 'from-violet-200 via-fuchsia-200 to-rose-200',
  'interactive-story': 'from-violet-200 via-amber-100 to-amber-200',
}

/* ------------------------------------------------------------------ */
/* Composant principal                                                */
/* ------------------------------------------------------------------ */

export function GamePreview({ slug, className }: { slug: string; className?: string }) {
  const game = getGame(slug)
  const bg = PREVIEW_BG[slug] ?? 'from-amber-100 via-orange-100 to-amber-200'
  return (
    <div
      aria-hidden="true"
      className={cn('no-select relative isolate overflow-hidden bg-gradient-to-br', bg, className)}
    >
      {/* texture + halos décoratifs */}
      <div className="pv-dots absolute inset-0 opacity-60" />
      <div className="absolute -left-8 -top-10 h-28 w-28 rounded-full bg-white/30 blur-2xl" />
      <div className="absolute -bottom-12 -right-8 h-32 w-32 rounded-full bg-black/10 blur-2xl" />
      {/* filigrane (icône du jeu) */}
      {game ? (
        <span className="absolute -bottom-2 -right-1 text-[42px] leading-none opacity-15 blur-[0.6px]">{game.icon}</span>
      ) : null}

      {/* scène centrale */}
      <div className="absolute inset-0 flex items-center justify-center p-3">
        <Scene slug={slug} fallback={game?.icon ?? '🎮'} />
      </div>

      {/* étincelles scintillantes */}
      <span className="anim-pv-spark absolute left-[9%] top-[16%] text-[10px]" style={{ animationDelay: '0.4s' }}>✨</span>
      <span
        className="anim-pv-spark absolute right-[10%] top-[12%] text-[9px]"
        style={{ animationDelay: '1.7s', animationDuration: '4.1s' }}
      >
        ✨
      </span>
    </div>
  )
}

function Scene({ slug, fallback }: { slug: string; fallback: string }) {
  switch (slug) {
    case 'memory-match':
      return <MemoryScene />
    case 'sequence-memory':
      return <SequenceScene />
    case 'schulte-table':
      return <SchulteScene />
    case 'speed-math':
      return <SpeedMathScene />
    case 'mini-crossword':
      return <CrosswordScene />
    case 'health-true-false':
      return <TrueFalseScene />
    case 'merge-garden':
      return <MergeGardenScene />
    case '2048-nutrition':
      return <Merge2048Scene />
    case 'sudoku':
      return <SudokuScene />
    case 'daily-word':
      return <DailyWordScene />
    case 'minesweeper':
      return <MinesweeperScene />
    case 'block-puzzle':
      return <BlockPuzzleScene />
    case 'jigsaw-puzzle':
      return <JigsawScene />
    case 'pill-toss':
      return <PillTossScene />
    case 'fire-escape':
      return <FireEscapeScene />
    case 'zen-fishing':
      return <ZenFishingScene />
    case 'fruit-slice':
      return <FruitSliceScene />
    case 'guess-the-idiom':
      return <IdiomScene />
    case 'longest-word':
      return <LongestWordScene />
    case 'interactive-story':
      return <StoryScene />
    default:
      return <span className="anim-pv-bob text-4xl drop-shadow">{fallback}</span>
  }
}

/* ------------------------------------------------------------------ */
/* Briques communes                                                   */
/* ------------------------------------------------------------------ */

/** Cellule blanche type « plateau de jeu ». */
function Cell({ children, className, style }: { children?: ReactNode; className?: string; style?: CSSProperties }) {
  return (
    <div
      style={style}
      className={cn('flex items-center justify-center rounded-md bg-white/95 text-neutral-800 shadow-sm', className)}
    >
      {children}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 1. Memory Match — cartes qui se retournent et font une paire 🍓    */
/* ------------------------------------------------------------------ */

function PvFlipCard({ emoji, delay }: { emoji: string; delay: string }) {
  return (
    <div className="flip-inner anim-pv-flip relative h-11 w-11" style={{ animationDelay: delay }}>
      <div className="flip-face absolute inset-0 flex items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 text-lg shadow-md">🌿</div>
      <div className="flip-face flip-back absolute inset-0 flex items-center justify-center rounded-xl bg-white text-xl shadow-md ring-2 ring-emerald-400">{emoji}</div>
    </div>
  )
}

function MemoryScene() {
  return (
    <div className="flip-scene grid grid-cols-2 gap-2">
      <PvFlipCard emoji="🍓" delay="0.4s" />
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 text-lg shadow-md">🌿</div>
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-rose-400 to-pink-600 text-lg shadow-md">🌿</div>
      <PvFlipCard emoji="🍓" delay="0.9s" />
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 2. Séquences — pads Simon qui s'illuminent en chaîne               */
/* ------------------------------------------------------------------ */

function SequenceScene() {
  const pads = [
    { c: 'bg-rose-500', d: '0s' },
    { c: 'bg-emerald-500', d: '0.7s' },
    { c: 'bg-amber-400', d: '1.4s' },
    { c: 'bg-violet-500', d: '2.1s' },
  ]
  return (
    <div className="grid grid-cols-2 gap-2 rounded-2xl bg-neutral-900/85 p-2 shadow-lg">
      {pads.map((p) => (
        <div key={p.c} className={cn('anim-pv-pad h-9 w-11 rounded-lg', p.c)} style={{ animationDelay: p.d }} />
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 3. Table de Schulte — balayage 1 → 9 dans le désordre              */
/* ------------------------------------------------------------------ */

function SchulteScene() {
  const grid = [4, 1, 7, 2, 9, 5, 8, 3, 6]
  return (
    <div className="grid grid-cols-3 gap-1 rounded-lg bg-white/95 p-1 shadow-lg">
      {grid.map((n) => (
        <div
          key={n}
          className="anim-pv-sweep flex h-7 w-7 items-center justify-center rounded font-display text-[11px] font-extrabold text-neutral-600"
          style={{ animationDelay: `${(n - 1) * 0.42}s` }}
        >
          {n}
        </div>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 4. Calcul Éclair — « 7+5= » et la réponse qui apparaît             */
/* ------------------------------------------------------------------ */

function SpeedMathScene() {
  return (
    <div className="relative">
      <div className="flex items-center gap-1 rounded-xl bg-white/95 px-3.5 py-2 shadow-lg">
        <span className="font-display text-lg font-black tracking-tight text-neutral-800">7+5=</span>
        <span className="relative inline-block h-7 w-8">
          <span className="anim-pv-a absolute inset-0 text-center font-display text-lg font-black text-neutral-400">?</span>
          <span className="anim-pv-b absolute inset-0 text-center font-display text-lg font-black text-orange-600">12</span>
        </span>
      </div>
      <span className="anim-pv-zap absolute -right-3 -top-4 text-lg">⚡</span>
      <span className="anim-pv-point absolute -left-2 -top-3 font-display text-[10px] font-black text-orange-700">+3</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 5. Mots croisés — lettres qui se remplissent + crayon              */
/* ------------------------------------------------------------------ */

function CrosswordScene() {
  const cells: Record<string, { l: string; d: number }> = {
    '0-1': { l: 'A', d: 0 },
    '0-3': { l: 'N', d: 1 },
    '1-0': { l: 'M', d: 2 },
    '1-2': { l: 'E', d: 3 },
    '1-4': { l: 'R', d: 4 },
    '2-1': { l: 'T', d: 5 },
    '2-3': { l: 'D', d: 6 },
  }
  return (
    <div className="relative">
      <div className="grid grid-cols-5 gap-[3px]">
        {Array.from({ length: 15 }, (_, i) => {
          const key = `${Math.floor(i / 5)}-${i % 5}`
          const c = cells[key]
          return (
            <div key={key} className={cn('h-5 w-5 rounded-[4px] shadow-sm', c ? 'bg-white/95' : 'bg-neutral-800/85')}>
              {c ? (
                <span
                  className="anim-pv-type flex h-full w-full items-center justify-center font-display text-[11px] font-extrabold text-emerald-700"
                  style={{ animationDelay: `${c.d * 0.35}s` }}
                >
                  {c.l}
                </span>
              ) : null}
            </div>
          )
        })}
      </div>
      <span className="anim-pv-bob absolute -bottom-3 -right-3 text-base" style={{ animationDuration: '2.8s' }}>✏️</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 6. Vrai ou Faux — tuiles ✓ / ✕ qui s'alternent                     */
/* ------------------------------------------------------------------ */

function TrueFalseScene() {
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="anim-pv-true flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500 text-2xl font-black text-white shadow-lg">✓</div>
      <span className="anim-pv-q font-display text-2xl font-black text-white/95 drop-shadow">?</span>
      <div className="anim-pv-false flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500 text-2xl font-black text-white shadow-lg">✕</div>
      <span className="anim-pv-bob absolute -top-5 left-1/2 -translate-x-1/2 text-sm" style={{ animationDuration: '1.6s' }}>❤️</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 7. Jardin de Gran — deux graines fusionnent et fleurissent 🌷      */
/* ------------------------------------------------------------------ */

function MergeGardenScene() {
  return (
    <div className="relative flex h-20 w-32 items-end justify-center">
      {/* terre */}
      <div className="absolute bottom-0 h-3 w-28 rounded-full bg-amber-800/60" />
      <span className="anim-pv-ml absolute bottom-2 left-4 text-xl">🌱</span>
      <span className="anim-pv-mr absolute bottom-2 right-4 text-xl">🌱</span>
      <span className="anim-pv-bloom absolute bottom-2 text-3xl">🌷</span>
      <span className="anim-pv-spark absolute bottom-10 left-1/2 text-xs" style={{ animationDelay: '2s' }}>✨</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 8. 2048 Nutrition — 🍎 glisse, fusionne, devient 🍒                */
/* ------------------------------------------------------------------ */

function Merge2048Scene() {
  return (
    <div className="relative">
      <div className="grid grid-cols-3 gap-1.5 rounded-xl bg-amber-900/20 p-1.5 shadow-inner">
        <Cell className="h-9 w-9 text-lg">🍌</Cell>
        <Cell className="h-9 w-9 text-lg">🥕</Cell>
        <Cell className="h-9 w-9 text-lg">🍇</Cell>
        <div className="relative h-9 w-9 rounded-md bg-white/95 shadow-sm">
          <span className="anim-pv-slide absolute inset-0 flex items-center justify-center text-lg">🍎</span>
        </div>
        <div className="relative h-9 w-9 rounded-md bg-white/95 shadow-sm">
          <span className="anim-pv-vanish absolute inset-0 flex items-center justify-center text-lg">🍎</span>
          <span className="anim-pv-pop absolute inset-0 flex items-center justify-center text-xl">🍒</span>
        </div>
        <div className="h-9 w-9 rounded-md bg-white/95 shadow-sm" />
      </div>
      <span className="anim-pv-point absolute -right-2 -top-3 font-display text-[10px] font-black text-red-700">+4</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 9. Sudoku — case qui cycle + sélection qui pulse                   */
/* ------------------------------------------------------------------ */

function SudokuScene() {
  return (
    <div className="grid grid-cols-3 gap-[3px] rounded-lg bg-neutral-700/60 p-[3px] shadow-lg">
      <Cell className="h-7 w-7 font-display text-xs font-extrabold">5</Cell>
      <Cell className="h-7 w-7 font-display text-xs font-extrabold">3</Cell>
      <div className="relative flex h-7 w-7 items-center justify-center rounded bg-white/95 shadow-sm">
        <span className="anim-pv-a absolute font-display text-xs font-extrabold text-teal-700">4</span>
        <span className="anim-pv-b absolute font-display text-xs font-extrabold text-teal-700">8</span>
      </div>
      <div className="anim-pv-ring h-7 w-7 rounded bg-white/95 shadow-sm" />
      <Cell className="h-7 w-7 font-display text-xs font-extrabold">7</Cell>
      <Cell className="h-7 w-7 font-display text-xs font-extrabold">6</Cell>
      <Cell className="h-7 w-7 font-display text-xs font-extrabold">1</Cell>
      <Cell className="h-7 w-7 bg-white/60" />
      <Cell className="h-7 w-7 font-display text-xs font-extrabold">9</Cell>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 10. Mot du Jour — tuiles façon Wordle qui se colorent (SANTÉ)      */
/* ------------------------------------------------------------------ */

function DailyWordScene() {
  const tiles = [
    { l: 'S', c: '#059669', d: '0s' },
    { l: 'A', c: '#059669', d: '0.15s' },
    { l: 'N', c: '#d97706', d: '0.3s' },
    { l: 'T', c: '#a1a1aa', d: '0.45s' },
    { l: 'E', c: '#059669', d: '0.6s' },
  ]
  return (
    <div className="flex gap-1.5">
      {tiles.map((t) => (
        <span
          key={t.l}
          className="anim-pv-wordle flex h-10 w-8 items-center justify-center rounded-lg bg-white font-display text-base font-extrabold text-neutral-600 shadow-md"
          style={{ animationDelay: t.d, '--pv-tile': t.c } as CSSProperties}
        >
          {t.l}
        </span>
      ))}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 11. Démineur — drapeau planté, mine qui explose                    */
/* ------------------------------------------------------------------ */

function MinesweeperScene() {
  const digits: Record<number, { n: string; c: string }> = {
    1: { n: '1', c: 'text-teal-700' },
    6: { n: '2', c: 'text-emerald-700' },
    8: { n: '1', c: 'text-teal-700' },
  }
  return (
    <div className="grid grid-cols-4 gap-1 rounded-lg bg-neutral-500/40 p-1 shadow-lg">
      {Array.from({ length: 12 }, (_, i) => {
        const digit = digits[i]
        if (digit) {
          return (
            <Cell key={i} className={cn('h-5 w-5 font-display text-[9px] font-black', digit.c)}>
              {digit.n}
            </Cell>
          )
        }
        if (i === 2) {
          return (
            <Cell key={i} className="h-5 w-5">
              <span className="anim-pv-flag text-[11px] leading-none">🚩</span>
            </Cell>
          )
        }
        if (i === 9) {
          return (
            <Cell key={i} className="h-5 w-5">
              <span className="anim-pv-boom text-[11px] leading-none">💣</span>
            </Cell>
          )
        }
        return <div key={i} className="h-5 w-5 rounded bg-stone-400/90 shadow-[inset_0_-1px_0_rgb(0_0_0/0.15)]" />
      })}
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 12. Block Puzzle — blocs posés, ligne complétée, COMBO !           */
/* ------------------------------------------------------------------ */

function BlockPuzzleScene() {
  const colors = ['bg-amber-400', 'bg-rose-400', 'bg-emerald-400', 'bg-violet-400']
  return (
    <div className="relative">
      <div className="grid grid-cols-5 gap-[3px] rounded-lg bg-neutral-800/80 p-[3px] shadow-lg">
        {Array.from({ length: 15 }, (_, i) => {
          const row = Math.floor(i / 5)
          if (row === 2 && i % 5 < 4) {
            return (
              <div
                key={i}
                className={cn('anim-pv-fill h-5 w-5 rounded-[3px] shadow-sm', colors[i % 4])}
                style={{ animationDelay: `${(i % 5) * 0.2}s` }}
              />
            )
          }
          return <div key={i} className="h-5 w-5 rounded-[3px] bg-white/85" />
        })}
      </div>
      {/* flash de ligne complétée */}
      <div className="anim-pv-clear absolute inset-x-[3px] bottom-[3px] h-5 rounded bg-white" />
      <span className="anim-pv-combo absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-orange-500 px-2 py-0.5 font-display text-[9px] font-black tracking-wide text-white shadow-md">
        COMBO ×2
      </span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 13. Puzzle — pièce qui vient se snapping dans son emplacement       */
/* ------------------------------------------------------------------ */

function JigsawScene() {
  return (
    <div className="relative grid grid-cols-2 gap-1.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/95 text-xl shadow-md">🧩</div>
      <div className="flex h-10 w-10 rotate-6 items-center justify-center rounded-lg bg-white/95 text-xl shadow-md">🧩</div>
      <div className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-white/80 bg-white/25">
        <span className="anim-pv-snap text-xl">🧩</span>
      </div>
      <div className="anim-pv-chip flex h-10 w-10 items-center justify-center rounded-lg border-2 border-dashed border-white/80 bg-white/25 font-display text-sm font-black text-white/85">?</div>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 14. Pill Toss — pilules en cloche vers la fiole                    */
/* ------------------------------------------------------------------ */

function PillTossScene() {
  return (
    <div className="relative h-20 w-32">
      {/* fiole */}
      <div className="anim-pv-jar absolute bottom-0 right-3 flex h-12 w-11 flex-col overflow-hidden rounded-b-2xl rounded-t-md border-[3px] border-amber-600/70 bg-amber-100/70 shadow-md">
        <div className="mt-auto flex items-end justify-center gap-0.5 pb-0.5">
          <span className="text-[8px] leading-none">💊</span>
          <span className="text-[8px] leading-none">💊</span>
        </div>
      </div>
      {/* pilules lancées */}
      <span className="anim-pv-arc-x absolute left-1 top-3">
        <span className="anim-pv-arc-y block text-base">💊</span>
      </span>
      <span className="anim-pv-arc-x absolute left-1 top-6" style={{ animationDelay: '1.3s' }}>
        <span className="anim-pv-arc-y block text-base" style={{ animationDelay: '1.3s' }}>💊</span>
      </span>
      <span className="anim-pv-point absolute right-7 top-1 font-display text-[10px] font-black text-rose-700">+1</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 15. Fire Escape — pompier qui esquive les flammes                  */
/* ------------------------------------------------------------------ */

function FireEscapeScene() {
  return (
    <div className="relative h-24 w-28">
      <span className="anim-pv-flicker absolute bottom-0 left-1 text-xl" style={{ animationDuration: '1.1s' }}>🔥</span>
      <span className="anim-pv-flicker absolute bottom-0 left-10 text-2xl" style={{ animationDuration: '0.9s' }}>🔥</span>
      <span className="anim-pv-flicker absolute bottom-0 right-1 text-xl" style={{ animationDuration: '1.3s' }}>🔥</span>
      <span className="anim-pv-bob absolute left-1/2 top-1 -translate-x-1/2 text-2xl" style={{ animationDuration: '2.6s' }}>🧑‍🚒</span>
      <span className="anim-pv-bob absolute right-2 top-3 text-sm" style={{ animationDuration: '1.9s', animationDelay: '0.5s' }}>💧</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 16. Pêche Zen — ligne, poisson, algues                             */
/* ------------------------------------------------------------------ */

function ZenFishingScene() {
  return (
    <div className="relative h-24 w-32">
      {/* canne à pêche */}
      <span className="absolute left-1 top-0 text-xl">🎣</span>
      {/* ligne qui descend / remonte */}
      <span className="anim-pv-reel absolute left-[30px] top-[26px] h-[34px] w-[2px] rounded bg-emerald-900/50" />
      {/* poisson qui nage */}
      <span className="anim-pv-swim absolute right-1 top-12 text-lg">🐟</span>
      {/* algues */}
      <span className="anim-pv-sway absolute bottom-0 left-6 text-base">🌿</span>
      <span className="anim-pv-sway absolute bottom-0 right-7 text-base" style={{ animationDelay: '-1.2s' }}>🌿</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 17. Fruit Slice — coupe diagonale qui tranche la pastèque          */
/* ------------------------------------------------------------------ */

function FruitSliceScene() {
  return (
    <div className="relative h-20 w-28">
      {/* pastèque (sursaut quand la lame passe) */}
      <span className="anim-pv-jolt absolute left-1/2 top-2 -translate-x-1/2">
        <span className="anim-pv-bob block text-3xl" style={{ animationDuration: '3.2s' }}>🍉</span>
      </span>
      <span className="anim-pv-bob absolute bottom-1 left-1 text-lg" style={{ animationDuration: '2.6s', animationDelay: '-1s' }}>🍊</span>
      <span className="anim-pv-bob absolute bottom-2 right-1 text-lg" style={{ animationDuration: '2.9s', animationDelay: '-0.5s' }}>🥝</span>
      {/* lame / trait de coupe */}
      <span className="anim-pv-slash absolute left-0 top-8 h-1 w-14 rounded-full bg-white/90 shadow" />
      {/* éclat au moment de la coupe */}
      <span className="anim-pv-burst absolute left-1/2 top-3 text-sm">💥</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 18. Devine l'Expression — bulle « ... » puis l'idée 💡             */
/* ------------------------------------------------------------------ */

function IdiomScene() {
  return (
    <div className="relative flex flex-col items-center gap-2.5">
      <div className="relative rounded-2xl bg-white px-4 py-2.5 shadow-lg">
        <div className="flex gap-1">
          <span className="anim-pv-dots h-1.5 w-1.5 rounded-full bg-neutral-400" />
          <span className="anim-pv-dots h-1.5 w-1.5 rounded-full bg-neutral-400" style={{ animationDelay: '0.15s' }} />
          <span className="anim-pv-dots h-1.5 w-1.5 rounded-full bg-neutral-400" style={{ animationDelay: '0.3s' }} />
        </div>
        <span className="absolute -bottom-1 left-6 h-2.5 w-2.5 rotate-45 bg-white" />
      </div>
      <span className="anim-pv-idea text-2xl">💡</span>
      <span className="anim-pv-chip absolute -left-1 top-8 text-sm">💬</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 19. Mot le Plus Long — lettres qui basculent + mot trouvé          */
/* ------------------------------------------------------------------ */

function LongestWordScene() {
  const tiles = [
    { a: 'J', b: 'L' },
    { a: 'A', b: 'E' },
    { a: 'R', b: 'S' },
  ]
  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="flex gap-1.5">
        {tiles.map((t, i) => (
          <span key={i} className="relative flex h-9 w-9 items-center justify-center overflow-hidden rounded-lg bg-white/95 shadow-md">
            <span className="anim-pv-l1 absolute font-display text-base font-extrabold text-rose-600" style={{ animationDelay: `${i * 0.2}s` }}>{t.a}</span>
            <span className="anim-pv-l2 absolute font-display text-base font-extrabold text-rose-600" style={{ animationDelay: `${i * 0.2}s` }}>{t.b}</span>
          </span>
        ))}
        <span className="flex h-9 w-9 items-center justify-center rounded-lg border-2 border-dashed border-white/80 bg-white/25 font-display text-base font-black text-white/90">+</span>
      </div>
      <span className="anim-pv-chip rounded-full bg-white/95 px-3 py-1 font-display text-xs font-black tracking-wide text-emerald-700 shadow-md">JARDIN · 6</span>
    </div>
  )
}

/* ------------------------------------------------------------------ */
/* 20. Histoire Interactive — livre + choix Oui / Non                 */
/* ------------------------------------------------------------------ */

function StoryScene() {
  const lang = useLang()
  const yes = lang === 'fr' ? 'Oui' : 'Yes'
  const no = lang === 'fr' ? 'Non' : 'No'
  return (
    <div className="relative flex flex-col items-center gap-3">
      <span className="anim-pv-bob text-4xl drop-shadow-md" style={{ animationDuration: '3.4s' }}>📖</span>
      <div className="flex gap-2">
        <span className="anim-pv-choice rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-emerald-700 shadow-md">✓ {yes}</span>
        <span className="anim-pv-choice rounded-full bg-white/95 px-3 py-1 text-xs font-extrabold text-rose-600 shadow-md" style={{ animationDelay: '-0.9s' }}>✕ {no}</span>
      </div>
    </div>
  )
}
