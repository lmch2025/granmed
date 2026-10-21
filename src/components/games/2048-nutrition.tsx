'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Undo2, CalendarCheck, Timer, Hash } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { loadSave, saveSave, clearSave } from '@/lib/save'
import { todayKey, seedFromString, shuffle, useReducedMotion } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { toast } from 'sonner'

export const gameId = '2048-nutrition'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: 'Le 2048 classique habillé de fruits et de saveurs : glissez, fusionnez, atteignez la tuile 2048 — puis visez plus haut.',
    en: 'The classic 2048 dressed in fruits and flavors: slide, merge, reach the 2048 tile — then aim higher.',
  },
  description: {
    fr: [
      '2048 Nutrition est un jeu de puzzle à glissements dans lequel vous déplacez des tuiles numérotées sur une grille 4×4 pour fusionner les valeurs identiques. Deux tuiles 2 deviennent une tuile 4, deux tuiles 4 deviennent une tuile 8… jusqu’à la fameuse tuile 2048 — et au-delà pour les experts.',
      'Le thème nutrition ne change rien aux mathématiques : les valeurs restent de pures puissances de 2, chaque tuile étant simplement illustrée par un aliment (2🍒, 4🍓, 8🍊, 16🍎… jusqu’à 2048🍉 et 8192🍯). Le score suit la règle classique : chaque fusion ajoute la valeur de la tuile créée.',
      'Trois annulations de coup par partie, un mode Classique (chiffres) ou Thématique (aliments), un défi du jour identique pour tous les joueurs et une sauvegarde automatique permettent de jouer partout, en sessions courtes comme acharnées.',
    ],
    en: [
      '2048 Nutrition is a sliding-tile puzzle in which you move numbered tiles on a 4×4 grid to merge identical values. Two 2 tiles become a 4, two 4s become an 8… all the way to the famous 2048 tile — and beyond for experts.',
      'The nutrition theme changes nothing about the math: values stay pure powers of two, each tile simply illustrated with a food (2🍒, 4🍓, 8🍊, 16🍎… up to 2048🍉 and 8192🍯). The score follows the classic rule: each merge adds the value of the newly created tile.',
      'Three move undos per game, a Classic (numbers) or Themed (foods) display mode, a daily challenge identical for every player and automatic saving let you play anywhere, in short or intense sessions.',
    ],
  },
  rules: {
    fr: [
      'Glissez dans une direction : toutes les tuiles coulissent jusqu’au bord possible.',
      'Deux tuiles de même valeur qui se rencontrent fusionnent en une tuile de valeur double.',
      'Après chaque coup réussi, une nouvelle tuile (2 ou 4) apparaît sur une case libre.',
      'La partie est gagnée lorsque vous créez la tuile 2048 — vous pouvez alors continuer de jouer.',
      'La partie se termine quand plus aucun mouvement n’est possible.',
      'Vous disposez de 3 annulations par partie pour revenir sur un coup.',
    ],
    en: [
      'Swipe in a direction: every tile slides as far as it can.',
      'Two tiles of equal value that meet merge into a tile of double value.',
      'After each successful move, a new tile (2 or 4) appears on a free cell.',
      'You win when you create the 2048 tile — you may then keep playing.',
      'The game ends when no move is possible anymore.',
      'You have 3 undos per game to revert a move.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : balayez le plateau avec le doigt dans la direction souhaitée.',
      'Ordinateur : flèches du clavier ou touches WASD / ZQSD.',
      'Bouton « Annuler » : restaure le plateau et le score d’avant votre dernier coup (3 fois par partie).',
    ],
    en: [
      'Mobile & tablet: swipe the board with your finger in the desired direction.',
      'Desktop: keyboard arrow keys or WASD.',
      '“Undo” button: restores the board and score from before your last move (3 times per game).',
    ],
  },
  features: {
    fr: [
      'Le 2048 classique : valeurs 100 % puissances de 2',
      '14 habillages aliment, de la cerise 2 à la tuile miel 8192',
      'Modes Classique (chiffres) et Thématique (aliments mis en avant)',
      '3 annulations de coup par partie',
      'Défi du jour : mêmes tuiles de départ pour tous les joueurs',
      'Sauvegarde automatique : reprenez votre partie en cours',
    ],
    en: [
      'The classic 2048: values are 100% powers of two',
      '14 food skins, from the 2 cherry to the 8192 honey tile',
      'Classic (numbers) and Themed (foods up front) display modes',
      '3 move undos per game',
      'Daily challenge: same starting tiles for every player',
      'Automatic save: resume your game in progress',
    ],
  },
  tips: {
    fr: [
      'Choisissez un coin et gardez-y votre plus grande tuile : c’est la stratégie la plus fiable.',
      'Ne construisez qu’un seul « escalier » de valeurs le long d’un bord pour éviter les tuiles isolées.',
      'Gardez la rangée du bas remplie pour contrôler les apparitions aléatoires.',
      'Utilisez l’annulation pour tester un coup risqué, pas pour rejouer une série entière.',
    ],
    en: [
      'Pick one corner and keep your biggest tile there: it is the most reliable strategy.',
      'Build a single “staircase” of values along one edge to avoid isolated tiles.',
      'Keep the bottom row filled to control random spawns.',
      'Use undo to test a risky move, not to replay a whole sequence.',
    ],
  },
  faq: {
    fr: [
      { q: '2048 Nutrition est-il le vrai 2048 ?', a: 'Oui : les mécaniques sont exactement celles du 2048 original — puissances de 2, fusions limitées à une par tuile et par coup, apparitions aléatoires de 2 et de 4. Seul l’habillage visuel change.' },
      { q: 'Comment le score est-il calculé ?', a: 'Chaque fusion ajoute la valeur de la tuile créée : fusionner deux tuiles 128 ajoute ainsi 256 au score, et ainsi de suite.' },
      { q: 'Peut-on dépasser 2048 ?', a: 'Oui. Après la tuile 2048, un bouton « Continuer » vous laisse jouer vers 4096, 8192 et au-delà — des badges récompensent chaque palier.' },
      { q: 'Le défi du jour est-il le même pour tous ?', a: 'Oui : les tuiles de départ sont tirées d’une graine déterministe basée sur la date, et toute la partie suit cette graine. Tout le joueur joue donc la même grille ce jour-là.' },
      { q: 'Puis-je annuler un coup ?', a: 'Oui, trois fois par partie. L’annulation restaure le plateau et le score d’avant votre dernier coup ; elle est utilisable même après un game over.' },
    ],
    en: [
      { q: 'Is 2048 Nutrition the real 2048?', a: 'Yes: the mechanics are exactly those of the original 2048 — powers of two, at most one merge per tile per move, random 2s and 4s spawning. Only the visual skin changes.' },
      { q: 'How is the score calculated?', a: 'Each merge adds the value of the created tile: merging two 128 tiles adds 256 to your score, and so on.' },
      { q: 'Can you go beyond 2048?', a: 'Yes. After the 2048 tile, a “Keep playing” button lets you aim for 4096, 8192 and beyond — badges reward each milestone.' },
      { q: 'Is the daily challenge the same for everyone?', a: 'Yes: the starting tiles are drawn from a deterministic seed based on the date, and the whole game follows that seed. Everyone plays the same board that day.' },
      { q: 'Can I undo a move?', a: 'Yes, three times per game. Undo restores the board and score from before your last move; it even works after a game over.' },
    ],
  },
  records: {
    'best-score': { fr: 'Meilleur score', en: 'Best score' },
    'best-tile': { fr: 'Meilleure tuile', en: 'Best tile' },
  },
}

/* ================= Données de jeu ================= */
type Dir = 'up' | 'down' | 'left' | 'right'
type Mode = 'classic' | 'themed'
type AnimKind = 'new' | 'merged' | null

const FOOD: Record<number, string> = {
  2: '🍒', 4: '🍓', 8: '🍊', 16: '🍎', 32: '🍐', 64: '🍇', 128: '🥝', 256: '🍑',
  512: '🍍', 1024: '🥭', 2048: '🍉', 4096: '🥗', 8192: '🍯',
}

const TILE_STYLE: Record<number, string> = {
  2: 'bg-amber-50 text-amber-900 border border-amber-200',
  4: 'bg-amber-100 text-amber-900 border border-amber-200',
  8: 'bg-orange-200 text-orange-900',
  16: 'bg-orange-300 text-orange-950',
  32: 'bg-amber-400 text-amber-950',
  64: 'bg-orange-500 text-white',
  128: 'bg-rose-400 text-white',
  256: 'bg-rose-500 text-white',
  512: 'bg-red-500 text-white',
  1024: 'bg-pink-600 text-white',
  2048: 'bg-emerald-600 text-white',
  4096: 'bg-violet-600 text-white',
  8192: 'bg-purple-700 text-white',
}
const TILE_STYLE_BIG = 'bg-emerald-800 text-white'

const KEYMAP: Record<string, Dir> = {
  ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
  w: 'up', W: 'up', z: 'up', Z: 'up',
  a: 'left', A: 'left', q: 'left', Q: 'left',
  s: 'down', S: 'down',
  d: 'right', D: 'right',
}

interface Game2048 {
  board: number[]
  score: number
  undos: number
  prev: { board: number[]; score: number } | null
  won: boolean
  ack: boolean
  over: boolean
  daily: boolean
  daily256: boolean
  rngState: number
  mode: Mode
  moves: number
  xpAwarded: boolean
}

/** Générateur pseudo-aléatoire dont l'état (serialisable) permet des parties déterministes. */
function rngStep(s: number): [number, number] {
  const a = (s + 0x6d2b79f5) | 0
  let t = Math.imul(a ^ (a >>> 15), 1 | a)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return [a, ((t ^ (t >>> 14)) >>> 0) / 4294967296]
}

function makeRng(seed: number): { next: () => number; state: () => number } {
  let s = seed >>> 0
  return {
    next: () => {
      const [ns, v] = rngStep(s)
      s = ns
      return v
    },
    state: () => s,
  }
}

/** Fusionne une ligne de 4 valeurs dans l'ordre du mouvement. */
function slideLine(vals: number[]): { line: number[]; gained: number; merged: boolean[] } {
  const out: number[] = []
  const merged: boolean[] = []
  const items = vals.filter((v) => v !== 0)
  let i = 0
  while (i < items.length) {
    if (i + 1 < items.length && items[i] === items[i + 1]) {
      out.push(items[i] * 2)
      merged.push(true)
      i += 2
    } else {
      out.push(items[i])
      merged.push(false)
      i += 1
    }
  }
  while (out.length < 4) {
    out.push(0)
    merged.push(false)
  }
  let gained = 0
  for (let k = 0; k < 4; k++) if (merged[k]) gained += out[k]
  return { line: out, gained, merged }
}

/** Les 4 indices de la ligne/colonne `line`, dans l'ordre du mouvement. */
function lineIndices(dir: Dir, line: number): number[] {
  const idx: number[] = []
  for (let k = 0; k < 4; k++) {
    if (dir === 'left') idx.push(line * 4 + k)
    else if (dir === 'right') idx.push(line * 4 + (3 - k))
    else if (dir === 'up') idx.push(k * 4 + line)
    else idx.push((3 - k) * 4 + line)
  }
  return idx
}

function canMove(b: number[]): boolean {
  for (let i = 0; i < 16; i++) {
    if (b[i] === 0) return true
    const r = (i / 4) | 0
    const c = i % 4
    if (c < 3 && b[i] === b[i + 1]) return true
    if (r < 3 && b[i] === b[i + 4]) return true
  }
  return false
}

const STR = {
  fr: {
    score: 'Score',
    moves: 'Coups',
    undo: 'Annuler',
    classic: 'Classique',
    themed: 'Thématique',
    dailyGoal: 'Objectif du jour : atteindre 256',
    dailyDone: 'Objectif du jour atteint : tuile 256 !',
    winTitle: '2048 atteint !',
    winSub: 'Banquet complet 🍉 — continuez vers 4096 ou lancez une nouvelle partie.',
    overTitle: 'Plus aucun coup possible',
    finalScore: 'Score final',
    bestTile: 'Meilleure tuile',
    savedGame: 'Partie sauvegardée',
    dailyGame: 'Défi du jour en cours',
    points: 'points',
    board: 'Plateau 2048',
  },
  en: {
    score: 'Score',
    moves: 'Moves',
    undo: 'Undo',
    classic: 'Classic',
    themed: 'Themed',
    dailyGoal: 'Daily goal: reach 256',
    dailyDone: 'Daily goal reached: 256 tile!',
    winTitle: '2048 reached!',
    winSub: 'Full banquet 🍉 — keep going for 4096 or start a new game.',
    overTitle: 'No moves left',
    finalScore: 'Final score',
    bestTile: 'Best tile',
    savedGame: 'Saved game',
    dailyGame: 'Daily challenge in progress',
    points: 'points',
    board: '2048 board',
  },
}

/* ================= Composant principal ================= */
export default function Game2048() {
  const t = useT()
  const lang = useLang()
  const reduce = useReducedMotion()
  const L = STR[lang]
  const dailyDone = useIsDailyDone(gameId)
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)

  const [game, setGame] = useState<Game2048 | null>(null)
  const [restored, setRestored] = useState<Game2048 | null>(null)
  const [bumps, setBumps] = useState<number[]>(() => new Array(16).fill(0))
  const [animKind, setAnimKind] = useState<AnimKind[]>(() => new Array(16).fill(null))
  const [confettiKey, setConfettiKey] = useState(0)
  const swipeRef = useRef<{ x: number; y: number } | null>(null)
  const moveRef = useRef<(d: Dir) => void>(() => {})

  /* --- Restauration au montage (callback asynchrone) --- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const s = loadSave<Game2048>(gameId)
      if (s && Array.isArray(s.board) && s.board.length === 16 && !s.over) setRestored(s)
    })
    return () => {
      alive = false
    }
  }, [])

  /* --- Sauvegarde automatique à chaque coup --- */
  useEffect(() => {
    if (!game || game.over) return
    saveSave(gameId, game)
  }, [game])

  /* --- Animations ciblées --- */
  function markAnim(idxs: number[], kind: Exclude<AnimKind, null>) {
    if (idxs.length === 0) return
    setBumps((b) => {
      const n = [...b]
      for (const i of idxs) n[i]++
      return n
    })
    setAnimKind((k) => {
      const n = [...k]
      for (const i of idxs) n[i] = kind
      return n
    })
  }

  /* --- Fin de partie : XP + records (une seule fois) --- */
  function awardEnd(score: number, board: number[], alreadyAwarded: boolean): boolean {
    if (alreadyAwarded) return true
    addXp(Math.floor(score / 50))
    setBest(gameId, 'best-score', score, false)
    setBest(gameId, 'best-tile', board.reduce((a, b) => Math.max(a, b), 0), false)
    return true
  }

  /* --- Nouvelle partie --- */
  function startNew(daily: boolean) {
    const seed = daily
      ? seedFromString(`${gameId}:${todayKey()}`)
      : ((Date.now() ^ Math.floor(Math.random() * 0xffffffff)) >>> 0)
    const rng = makeRng(seed)
    const board = new Array(16).fill(0)
    const spots = shuffle(Array.from({ length: 16 }, (_, i) => i), rng.next)
    board[spots[0]] = rng.next() < 0.9 ? 2 : 4
    board[spots[1]] = rng.next() < 0.9 ? 2 : 4
    setRestored(null)
    setBumps(new Array(16).fill(0))
    setAnimKind(new Array(16).fill(null))
    setGame({
      board, score: 0, undos: 3, prev: null, won: false, ack: false, over: false,
      daily, daily256: false, rngState: rng.state(), mode: game?.mode ?? 'classic', moves: 0, xpAwarded: false,
    })
    markAnim([spots[0], spots[1]], 'new')
    addPlay(gameId)
    sfx.play('pop')
  }

  function resumeGame() {
    if (!restored) return
    setGame(restored)
    setRestored(null)
    setBumps(new Array(16).fill(0))
    setAnimKind(new Array(16).fill(null))
    addPlay(gameId)
    sfx.play('pop')
  }

  /* --- Coup --- */
  function move(dir: Dir) {
    if (!game || game.over || (game.won && !game.ack)) return
    const { board, score } = game
    const next = [...board]
    const mergedIdx: number[] = []
    let gained = 0
    let changed = false
    for (let line = 0; line < 4; line++) {
      const idxs = lineIndices(dir, line)
      const res = slideLine(idxs.map((i) => board[i]))
      for (let k = 0; k < 4; k++) {
        if (next[idxs[k]] !== res.line[k]) {
          changed = true
          next[idxs[k]] = res.line[k]
        }
        if (res.merged[k]) mergedIdx.push(idxs[k])
      }
      gained += res.gained
    }
    if (!changed) return

    sfx.play('swish', { volume: 0.25 })
    if (mergedIdx.length > 0) sfx.play('merge')

    const rng = makeRng(game.rngState)
    let spawnIdx = -1
    const empties: number[] = []
    for (let i = 0; i < 16; i++) if (next[i] === 0) empties.push(i)
    if (empties.length > 0) {
      spawnIdx = empties[Math.floor(rng.next() * empties.length)]
      next[spawnIdx] = rng.next() < 0.9 ? 2 : 4
    }

    const newScore = score + gained
    if (Math.floor(newScore / 500) > Math.floor(score / 500)) sfx.play('coin')

    setGame({
      ...game,
      board: next,
      score: newScore,
      prev: { board, score },
      rngState: rng.state(),
      moves: game.moves + 1,
    })
    markAnim(mergedIdx, 'merged')
    if (spawnIdx >= 0) markAnim([spawnIdx], 'new')

    const maxTile = next.reduce((a, b) => Math.max(a, b), 0)
    if (maxTile >= 1024) unlockBadge('n2048-1024')
    if (maxTile >= 2048) unlockBadge('n2048-2048')
    if (maxTile >= 4096) unlockBadge('n2048-4096')

    if (game.daily && !game.daily256 && maxTile >= 256) {
      setGame((g) => (g ? { ...g, daily256: true } : g))
      sfx.play('achievement')
      completeDaily(gameId)
      toast('🎯', { description: L.dailyDone, duration: 4500 })
    }

    if (!game.won && maxTile >= 2048) {
      const awarded = awardEnd(newScore, next, game.xpAwarded)
      setGame((g) => (g ? { ...g, won: true, xpAwarded: awarded } : g))
      setConfettiKey((k) => k + 1)
      sfx.play('win')
      addWin(gameId)
    } else if (!canMove(next)) {
      const awarded = awardEnd(newScore, next, game.xpAwarded)
      setGame((g) => (g ? { ...g, over: true, xpAwarded: awarded } : g))
      sfx.play('lose')
      clearSave(gameId)
    }
  }

  /* --- Annulation --- */
  function undo() {
    if (!game || !game.prev || game.undos <= 0) return
    sfx.play('sweep')
    setGame({
      ...game,
      board: game.prev.board,
      score: game.prev.score,
      prev: null,
      undos: game.undos - 1,
      over: false,
    })
    setAnimKind(new Array(16).fill(null))
  }

  /* --- Clavier : flèches + WASD/ZQSD (ref => toujours à jour) --- */
  useEffect(() => {
    moveRef.current = move
  })
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!game || game.over || (game.won && !game.ack)) return
      const dir = KEYMAP[e.key]
      if (!dir) return
      e.preventDefault()
      moveRef.current(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [game])

  /* --- Balayage tactile --- */
  function onPointerDown(e: React.PointerEvent) {
    // Pas de capture quand un voile (victoire / fin) affiche des boutons : le clic doit passer.
    if (game?.over || (game?.won && !game.ack)) return
    swipeRef.current = { x: e.clientX, y: e.clientY }
    try {
      ;(e.currentTarget as HTMLElement).setPointerCapture(e.pointerId)
    } catch {}
  }

  function onPointerUp(e: React.PointerEvent) {
    const s = swipeRef.current
    swipeRef.current = null
    if (!s) return
    const dx = e.clientX - s.x
    const dy = e.clientY - s.y
    const adx = Math.abs(dx)
    const ady = Math.abs(dy)
    if (Math.max(adx, ady) < 28) return
    if (adx > ady) moveRef.current(dx > 0 ? 'right' : 'left')
    else moveRef.current(dy > 0 ? 'down' : 'up')
  }

  /* --- Rendu --- */
  if (!game) {
    /* Menu : reprise / nouvelle partie / défi du jour */
    return (
      <div className="checkerboard flex min-h-[360px] select-none flex-col items-center justify-center gap-5 rounded-2xl border p-6 text-center">
        <div className="flex gap-2" aria-hidden="true">
          {['🍒', '🍓', '🍊', '🍉'].map((e, i) => (
            <span key={i} className={cn('text-4xl', !reduce && 'anim-floaty')} style={{ animationDelay: `${i * 0.4}s` }}>
              {e}
            </span>
          ))}
        </div>
        <p className="max-w-md text-sm text-muted-foreground">{content.tagline[lang]}</p>
        {restored ? (
          <Button size="lg" className="rounded-full px-6 anim-glow" onClick={resumeGame}>
            <Play className="h-4 w-4" aria-hidden="true" />
            {t('game.resume')}
          </Button>
        ) : null}
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          <Button size="lg" variant={restored ? 'secondary' : 'default'} className="rounded-full" onClick={() => startNew(false)}>
            <Play className="h-4 w-4" aria-hidden="true" />
            {t('game.newGame')}
          </Button>
          <Button size="lg" variant="outline" className="rounded-full" onClick={() => startNew(true)} disabled={dailyDone}>
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            {dailyDone ? `${t('game.startDaily')} ✓` : t('game.startDaily')}
          </Button>
        </div>
        {restored ? (
          <p className="text-xs text-muted-foreground">
            {restored.daily ? L.dailyGame : L.savedGame} — {restored.score} {L.points}
          </p>
        ) : null}
      </div>
    )
  }

  const winOverlay = game.won && !game.ack && !game.over
  const maxTile = game.board.reduce((a, b) => Math.max(a, b), 0)

  return (
    <div className="relative select-none">
      <style>{'@keyframes merge-pulse-g { 0% { transform: scale(1); } 45% { transform: scale(1.16); } 100% { transform: scale(1); } } .anim-merge-pulse-g { animation: merge-pulse-g 0.28s ease-out; }'}</style>
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} />

      {/* Barre d'actions */}
      <div className="mb-3 flex flex-wrap items-center gap-2">
        <StatPill icon={<Hash className="h-4 w-4" aria-hidden="true" />} label={L.score} value={game.score} />
        <StatPill icon={<Timer className="h-4 w-4" aria-hidden="true" />} label={L.moves} value={game.moves} />
        {game.daily ? (
          <span
            className={cn(
              'flex h-11 items-center gap-1.5 rounded-full px-3.5 text-xs font-bold',
              game.daily256
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
            )}
            title={L.dailyGoal}
          >
            🎯 256{game.daily256 ? ' ✅' : ''}
          </span>
        ) : null}
        <div className="ms-auto flex flex-wrap items-center gap-2">
          <div className="flex overflow-hidden rounded-full border" role="group" aria-label={t('common.mode')}>
            {(['classic', 'themed'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                aria-pressed={game.mode === m}
                onClick={() => {
                  sfx.play('click', { volume: 0.5 })
                  setGame((g) => (g ? { ...g, mode: m } : g))
                }}
                className={cn(
                  'h-11 px-3.5 text-sm font-bold transition-colors',
                  game.mode === m ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground',
                )}
              >
                {m === 'classic' ? L.classic : L.themed}
              </button>
            ))}
          </div>
          <Button
            variant="secondary"
            className="h-11 rounded-full"
            onClick={undo}
            disabled={!game.prev || game.undos <= 0}
            title={L.undo}
          >
            <Undo2 className="h-4 w-4" aria-hidden="true" />
            {game.undos}
          </Button>
          <Button variant="secondary" className="h-11 rounded-full" onClick={() => startNew(game.daily)}>
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('game.newGame')}</span>
          </Button>
        </div>
      </div>

      {/* Plateau */}
      <div
        role="grid"
        aria-label={L.board}
        className="relative mx-auto grid aspect-square w-[min(92vw,420px)] touch-none select-none grid-cols-4 grid-rows-4 gap-2 rounded-2xl border-2 border-amber-200/70 bg-amber-100/50 p-2 dark:border-amber-500/20 dark:bg-secondary/60"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipeRef.current = null
        }}
      >
        {game.board.map((v, i) => (
          <div key={i} className="relative">
            {v !== 0 ? (
              <div
                key={`${i}-${bumps[i]}`}
                className={cn(
                  'absolute inset-0 flex flex-col items-center justify-center rounded-xl font-display font-extrabold leading-none shadow-sm',
                  TILE_STYLE[v] ?? TILE_STYLE_BIG,
                  !reduce && animKind[i] === 'new' && 'anim-pop-in',
                  !reduce && animKind[i] === 'merged' && 'anim-merge-pulse-g',
                )}
                aria-label={String(v)}
              >
                {game.mode === 'themed' ? (
                  <>
                    <span className="text-3xl sm:text-4xl" aria-hidden="true">{FOOD[v] ?? '🍽️'}</span>
                    <span className="mt-0.5 text-[11px] font-bold tabular-nums opacity-80">{v}</span>
                  </>
                ) : (
                  <>
                    <span className={cn('tabular-nums', v >= 1024 ? 'text-xl sm:text-2xl' : 'text-2xl sm:text-3xl')}>{v}</span>
                    <span className="absolute end-1 top-1 text-sm sm:text-base" aria-hidden="true">{FOOD[v] ?? '🍽️'}</span>
                  </>
                )}
              </div>
            ) : null}
          </div>
        ))}

        {/* Bannière de victoire */}
        {winOverlay ? (
          <div className="anim-rise absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-card/85 p-6 text-center backdrop-blur-sm" role="status">
            <span className="text-5xl" aria-hidden="true">🍉</span>
            <p className="font-display text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">{L.winTitle}</p>
            <p className="max-w-xs text-sm text-muted-foreground">{L.winSub}</p>
            <div className="mt-1 flex flex-wrap justify-center gap-2.5">
              <Button size="lg" className="rounded-full" onClick={() => { sfx.play('click'); setGame((g) => (g ? { ...g, ack: true } : g)) }}>
                {t('common.continue')}
              </Button>
              <Button size="lg" variant="secondary" className="rounded-full" onClick={() => startNew(false)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('game.newGame')}
              </Button>
            </div>
          </div>
        ) : null}

        {/* Écran de fin */}
        {game.over ? (
          <div className="anim-rise absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-2xl bg-card/90 p-6 text-center backdrop-blur-sm" role="status">
            <span className="text-5xl" aria-hidden="true">🍽️</span>
            <p className="font-display text-2xl font-extrabold">{L.overTitle}</p>
            <div className="flex flex-wrap justify-center gap-2.5">
              <StatPill icon={<Hash className="h-4 w-4" aria-hidden="true" />} label={L.finalScore} value={game.score} />
              <StatPill icon={<span className="text-sm" aria-hidden="true">🍉</span>} label={L.bestTile} value={maxTile} />
            </div>
            <div className="mt-1 flex flex-wrap justify-center gap-2.5">
              {game.prev && game.undos > 0 ? (
                <Button size="lg" variant="secondary" className="rounded-full" onClick={undo}>
                  <Undo2 className="h-4 w-4" aria-hidden="true" /> {L.undo} ({game.undos})
                </Button>
              ) : null}
              <Button size="lg" className="rounded-full" onClick={() => startNew(game.daily)}>
                <RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('common.playAgain')}
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
      <span className="text-muted-foreground" aria-hidden="true">{icon}</span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
