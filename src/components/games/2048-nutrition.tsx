'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Undo2, CalendarCheck, Hash, Trophy, Cherry } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import type { Lang } from '@/lib/i18n'
import { useProfileStore, useIsDailyDone } from '@/lib/progress/store'
import { loadSave, saveSave, clearSave } from '@/lib/save'
import { todayKey, seedFromString, shuffle, useReducedMotion } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
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
      { q: 'Le défi du jour est-il le même pour tous ?', a: 'Oui : les tuiles de départ sont tirées d’une graine déterministe basée sur la date, et toute la partie suit cette graine. Tous les joueurs jouent donc la même grille ce jour-là.' },
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

/** Seuil de déclenchement d'un balayage tactile (px). */
const SWIPE_THRESHOLD = 24

interface PrevState {
  board: number[]
  score: number
  rngState: number
  moves: number
}

interface Game2048 {
  board: number[]
  score: number
  undos: number
  prev: PrevState | null
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

/** Générateur pseudo-aléatoire dont l'état (sérialisable) permet des parties déterministes. */
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

/** Fusionne une ligne de 4 valeurs dans l'ordre du mouvement (au plus une fusion par tuile et par coup). */
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

function highestTile(b: number[]): number {
  return b.reduce((a, v) => Math.max(a, v), 0)
}

function isPow2(v: number): boolean {
  return v > 0 && (v & (v - 1)) === 0
}

/** 12340 → « 12 340 » (fr) / « 12,340 » (en) au-delà de 9 999. */
function formatNum(v: number, lang: Lang): string {
  return v >= 10000 ? v.toLocaleString(lang === 'fr' ? 'fr-FR' : 'en-US') : String(v)
}

/** Taille de police d'une tuile chiffres, proportionnelle au plateau (container queries). */
function tileFontClass(v: number): string {
  if (v >= 4096) return 'text-[clamp(15px,6.4cqw,30px)]'
  if (v >= 1024) return 'text-[clamp(17px,7.2cqw,34px)]'
  return 'text-[clamp(20px,9cqw,40px)]'
}

const STR = {
  fr: {
    score: 'Score',
    moves: 'Coups',
    undo: 'Annuler le dernier coup',
    undosLeft: 'Annuler ({n} restant)',
    classic: 'Classique',
    themed: 'Thématique',
    toClassic: 'Basculer en mode Classique (chiffres)',
    toThemed: 'Basculer en mode Thématique (aliments)',
    dailyGoal: 'Objectif du jour : créer la tuile 256',
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
    recordLive: 'Vous battez votre record !',
    bestLine: 'Record',
  },
  en: {
    score: 'Score',
    moves: 'Moves',
    undo: 'Undo last move',
    undosLeft: 'Undo ({n} left)',
    classic: 'Classic',
    themed: 'Themed',
    toClassic: 'Switch to Classic mode (numbers)',
    toThemed: 'Switch to Themed mode (foods)',
    dailyGoal: 'Daily goal: create the 256 tile',
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
    recordLive: 'You are beating your record!',
    bestLine: 'Best',
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
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const completeDaily = useProfileStore((s) => s.completeDaily)
  const bestScoreRaw = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-score']?.value)
  const bestTileRaw = useProfileStore((s) => s.profile.games[gameId]?.records?.['best-tile']?.value)
  const bestScore = bestScoreRaw ?? 0
  const bestTile = bestTileRaw ?? 0

  const [game, setGame] = useState<Game2048 | null>(null)
  const [restored, setRestored] = useState<Game2048 | null>(null)
  const [modePref, setModePref] = useState<Mode>('classic')
  const [bumps, setBumps] = useState<number[]>(() => new Array(16).fill(0))
  const [animKind, setAnimKind] = useState<AnimKind[]>(() => new Array(16).fill(null))
  const [confettiKey, setConfettiKey] = useState(0)
  const [burstKey, setBurstKey] = useState(0)
  const [gainFx, setGainFx] = useState<{ n: number; k: number } | null>(null)
  const swipeRef = useRef<{ x: number; y: number } | null>(null)
  const moveRef = useRef<(d: Dir) => void>(() => {})
  const lockedRef = useRef(true)
  const fxKey = useRef(0)

  /* --- Restauration au montage (callback asynchrone, conforme set-state-in-effect) --- */
  useEffect(() => {
    let alive = true
    Promise.resolve().then(() => {
      if (!alive) return
      const s = loadSave<Game2048>(gameId)
      if (
        s &&
        Array.isArray(s.board) &&
        s.board.length === 16 &&
        s.board.every((v) => v === 0 || isPow2(v)) &&
        typeof s.score === 'number' &&
        typeof s.rngState === 'number' &&
        !s.over
      ) {
        setRestored({
          ...s,
          mode: s.mode === 'themed' ? 'themed' : 'classic',
          prev:
            s.prev && typeof s.prev.rngState === 'number' && typeof s.prev.moves === 'number' && Array.isArray(s.prev.board) && s.prev.board.length === 16
              ? s.prev
              : null,
        })
      }
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

  /* --- Clavier : flèches + WASD/ZQSD (abonné une seule fois) --- */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (lockedRef.current || e.defaultPrevented) return
      const dir = KEYMAP[e.key]
      if (!dir) return
      // Ne pas voler les touches pendant qu'un dialogue ou un menu global est ouvert.
      if (document.querySelector('[role="dialog"], [role="menu"]')) return
      e.preventDefault()
      moveRef.current(dir)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  /* --- Fin de partie : XP une seule fois, records à chaque palier (setBest est idempotent) --- */
  function awardEnd(score: number, board: number[], alreadyAwarded: boolean, won: boolean): void {
    setBest(gameId, 'best-score', score, false)
    setBest(gameId, 'best-tile', highestTile(board), false)
    if (!alreadyAwarded) {
      addXp(Math.floor(score / 50))
      /* Niveaux par jeu : banquet 2048 atteint ~30, fin de partie 10 + bonus score. */
      addGameXp(gameId, won ? 30 : 10 + Math.min(2, Math.floor(score / 1000)))
    }
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
    setAnimKind(() => {
      const n: AnimKind[] = new Array(16).fill(null)
      n[spots[0]] = 'new'
      n[spots[1]] = 'new'
      return n
    })
    setGainFx(null)
    setGame({
      board, score: 0, undos: 3, prev: null, won: false, ack: false, over: false,
      daily, daily256: false, rngState: rng.state(), mode: modePref, moves: 0, xpAwarded: false,
    })
    addPlay(gameId)
    sfx.play('pop')
  }

  function resumeGame() {
    if (!restored) return
    setGame(restored)
    setRestored(null)
    setBumps(new Array(16).fill(0))
    setAnimKind(new Array(16).fill(null))
    setModePref(restored.mode)
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

    // Spawn d'une nouvelle tuile (2 ou 4) sur une case LIBRE uniquement.
    const rng = makeRng(game.rngState)
    let spawnIdx = -1
    const empties: number[] = []
    for (let i = 0; i < 16; i++) if (next[i] === 0) empties.push(i)
    if (empties.length > 0) {
      spawnIdx = empties[Math.floor(rng.next() * empties.length)]
      next[spawnIdx] = rng.next() < 0.9 ? 2 : 4
      sfx.play('pop', { volume: 0.18 })
    }

    const newScore = score + gained
    if (Math.floor(newScore / 500) > Math.floor(score / 500)) sfx.play('coin')
    if (mergedIdx.length >= 2) navigator.vibrate?.(10)

    // Franchissement du record personnel en direct.
    if (bestScore > 0 && score <= bestScore && newScore > bestScore) {
      sfx.play('coin')
      navigator.vibrate?.(10)
    }

    setGame({
      ...game,
      board: next,
      score: newScore,
      prev: { board, score, rngState: game.rngState, moves: game.moves },
      rngState: rng.state(),
      moves: game.moves + 1,
    })

    // Animations reconstruites à chaque coup (aucune classe périmée).
    const nextAnim: AnimKind[] = new Array(16).fill(null)
    for (const i of mergedIdx) nextAnim[i] = 'merged'
    if (spawnIdx >= 0) nextAnim[spawnIdx] = 'new'
    setAnimKind(nextAnim)
    if (mergedIdx.length > 0 || spawnIdx >= 0) {
      setBumps((b) => {
        const n = [...b]
        for (const i of mergedIdx) n[i]++
        if (spawnIdx >= 0) n[spawnIdx]++
        return n
      })
    }
    if (gained > 0) {
      fxKey.current += 1
      setGainFx({ n: gained, k: fxKey.current })
    }

    const maxTile = highestTile(next)
    if (maxTile >= 1024) unlockBadge('n2048-1024')
    if (maxTile >= 2048) unlockBadge('n2048-2048')
    if (maxTile >= 4096) unlockBadge('n2048-4096')

    if (game.daily && !game.daily256 && maxTile >= 256) {
      setGame((g) => (g ? { ...g, daily256: true } : g))
      sfx.play('achievement')
      navigator.vibrate?.(10)
      completeDaily(gameId)
      toast('🎯', { description: L.dailyDone, duration: 4500 })
    }

    if (!game.won && maxTile >= 2048) {
      awardEnd(newScore, next, game.xpAwarded, true)
      setGame((g) => (g ? { ...g, won: true, xpAwarded: true } : g))
      setConfettiKey((k) => k + 1)
      setBurstKey((k) => k + 1)
      sfx.play('win')
      navigator.vibrate?.(20)
      addWin(gameId)
    } else if (!canMove(next)) {
      awardEnd(newScore, next, game.xpAwarded, false)
      setGame((g) => (g ? { ...g, over: true, xpAwarded: true } : g))
      sfx.play('lose')
      clearSave(gameId)
    }
  }

  /* --- Refs toujours à jour (handlers globaux sans closure périmée) --- */
  useEffect(() => {
    moveRef.current = move
    lockedRef.current = !game || game.over || (game.won && !game.ack)
  })

  /* --- Annulation : vrai retour arrière (plateau, score, RNG et coups) --- */
  function undo() {
    if (!game || !game.prev || game.undos <= 0) return
    sfx.play('sweep')
    const p = game.prev
    setGame({
      ...game,
      board: p.board,
      score: p.score,
      rngState: p.rngState,
      moves: p.moves,
      prev: null,
      undos: game.undos - 1,
      over: false,
    })
    setGainFx(null)
    const nextAnim: AnimKind[] = new Array(16).fill(null)
    const idxs: number[] = []
    for (let i = 0; i < 16; i++) {
      if (p.board[i] !== 0) {
        nextAnim[i] = 'new'
        idxs.push(i)
      }
    }
    setAnimKind(nextAnim)
    setBumps((b) => {
      const n = [...b]
      for (const i of idxs) n[i]++
      return n
    })
  }

  /* --- Mode d'affichage (chiffres / aliments) --- */
  function toggleMode() {
    sfx.play('click', { volume: 0.5 })
    setModePref((m) => (m === 'classic' ? 'themed' : 'classic'))
    setGame((g) => (g ? { ...g, mode: g.mode === 'classic' ? 'themed' : 'classic' } : g))
  }

  /* --- Balayage tactile (pointer events + capture, seuil 24 px, axe dominant) --- */
  function onPointerDown(e: React.PointerEvent) {
    // Pas de capture quand un voile (victoire / fin) affiche des boutons : le clic doit passer.
    if (lockedRef.current) return
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
    if (Math.max(adx, ady) < SWIPE_THRESHOLD) return
    if (adx > ady) moveRef.current(dx > 0 ? 'right' : 'left')
    else moveRef.current(dy > 0 ? 'down' : 'up')
  }

  /* --- Rendu : écran d'accueil compact (bouton Jouer immédiatement visible) --- */
  if (!game) {
    return (
      <div className="checkerboard flex min-h-[300px] w-full select-none flex-col items-center justify-center gap-3.5 rounded-2xl border p-5 text-center sm:min-h-[380px] sm:gap-4 sm:p-8 my-auto">
        <div className="flex gap-2" aria-hidden="true">
          {['🍒', '🍓', '🍊', '🍉'].map((e, i) => (
            <span key={i} className={cn('text-3xl sm:text-4xl', !reduce && 'anim-floaty')} style={{ animationDelay: `${i * 0.4}s` }}>
              {e}
            </span>
          ))}
        </div>
        {bestScore > 0 ? (
          <p className="flex items-center gap-1.5 rounded-full bg-secondary/70 px-3 py-1 text-xs font-semibold text-muted-foreground">
            <Trophy className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
            {L.bestLine}&nbsp;<span className="font-extrabold tabular-nums text-foreground">{formatNum(bestScore, lang)}</span>
            <span aria-hidden="true">·</span>
            <span aria-hidden="true">{FOOD[bestTile] ?? '🍽️'}</span>
            <span className="tabular-nums">{bestTile}</span>
          </p>
        ) : null}
        <p className="max-w-md text-sm text-muted-foreground">{content.tagline[lang]}</p>
        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {restored ? (
            <Button size="lg" className="rounded-full anim-glow" onClick={resumeGame}>
              <Play className="h-4 w-4" aria-hidden="true" />
              {t('game.resume')}
            </Button>
          ) : null}
          <Button size="lg" variant={restored ? 'secondary' : 'default'} className="rounded-full" onClick={() => startNew(false)}>
            <Play className="h-4 w-4" aria-hidden="true" />
            {restored ? t('game.newGame') : t('common.playNow')}
          </Button>
          <Button size="lg" variant="outline" className="rounded-full" onClick={() => startNew(true)} disabled={dailyDone}>
            <CalendarCheck className="h-4 w-4" aria-hidden="true" />
            {dailyDone ? `${t('game.startDaily')} ✓` : t('game.startDaily')}
          </Button>
        </div>
        {restored ? (
          <p className="text-xs text-muted-foreground">
            {restored.daily ? L.dailyGame : L.savedGame} — {formatNum(restored.score, lang)} {L.points}
          </p>
        ) : null}
        <ModeToggle mode={modePref} labels={L} onToggle={toggleMode} />
      </div>
    )
  }

  const winOverlay = game.won && !game.ack && !game.over
  const maxTile = highestTile(game.board)
  const recordLive = bestScore > 0 && game.score > bestScore
  const mode = game.mode

  return (
    <div className="relative mx-auto my-auto w-full max-w-[420px] select-none">
      <style>{'@keyframes merge-pulse-g { 0% { transform: scale(1); } 45% { transform: scale(1.16); } 100% { transform: scale(1); } } .anim-merge-pulse-g { animation: merge-pulse-g 0.28s ease-out; }'}</style>
      <Confetti fire={confettiKey} count={reduce ? 0 : 110} waves={2} gold />
      <VictoryBurst
        fire={burstKey}
        stars={maxTile >= 4096 || game.score >= 8000 ? 3 : 2}
        title={L.winTitle}
        emoji="🍉"
        sub={`${formatNum(game.score, lang)} ${L.points} · ${FOOD[maxTile] ?? '🍽️'} ${maxTile}`}
      />

      {/* HUD compact une ligne : score + record, annuler, mode, nouvelle partie */}
      <div className="mb-2.5 flex flex-wrap items-center gap-1.5">
        <div className="relative flex h-11 min-w-[72px] flex-col items-center justify-center rounded-xl bg-secondary/70 px-2.5">
          <span className="text-[10px] font-bold uppercase leading-none tracking-wider text-muted-foreground">{L.score}</span>
          <span className={cn('mt-1 text-lg font-extrabold leading-none tabular-nums', recordLive && 'text-emerald-600 dark:text-emerald-400')}>
            {formatNum(game.score, lang)}
          </span>
          {gainFx ? (
            <span key={gainFx.k} aria-hidden="true" className="anim-score pointer-events-none absolute -top-1 end-2 text-sm font-extrabold text-emerald-500">
              +{gainFx.n}
            </span>
          ) : null}
        </div>
        <div
          title={recordLive ? L.recordLive : t('common.best')}
          className={cn(
            'flex h-11 min-w-[72px] flex-col items-center justify-center rounded-xl px-2.5 transition-colors',
            recordLive ? 'bg-emerald-100 dark:bg-emerald-500/20' : 'bg-secondary/70',
          )}
        >
          <span className="text-[10px] font-bold uppercase leading-none tracking-wider text-muted-foreground">{t('common.best')}</span>
          <span className="mt-1 flex items-center gap-1 text-lg font-extrabold leading-none tabular-nums">
            {recordLive ? <span className="text-xs" aria-hidden="true">🔥</span> : null}
            {formatNum(Math.max(bestScore, game.score), lang)}
          </span>
        </div>
        {game.daily ? (
          <span
            title={L.dailyGoal}
            className={cn(
              'flex h-11 items-center gap-1 rounded-xl px-2.5 text-xs font-extrabold',
              game.daily256
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300'
                : 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
            )}
          >
            🎯<span className="tabular-nums">256</span>
            {game.daily256 ? <span aria-hidden="true">✓</span> : null}
          </span>
        ) : null}
        <div className="ms-auto flex items-center gap-1.5">
          <Button
            variant="outline"
            className="h-11 gap-1.5 rounded-full px-3"
            onClick={toggleMode}
            title={mode === 'classic' ? L.toThemed : L.toClassic}
            aria-label={mode === 'classic' ? L.toThemed : L.toClassic}
          >
            {mode === 'themed' ? <Cherry className="h-4 w-4" aria-hidden="true" /> : <Hash className="h-4 w-4" aria-hidden="true" />}
            <span className="hidden text-xs sm:inline">{mode === 'themed' ? L.themed : L.classic}</span>
          </Button>
          <Button
            variant="secondary"
            className="h-11 gap-1 rounded-full px-3"
            onClick={undo}
            disabled={!game.prev || game.undos <= 0}
            title={game.undos > 0 ? L.undosLeft.replace('{n}', String(game.undos)) : L.undo}
            aria-label={L.undo}
          >
            <Undo2 className="h-4 w-4" aria-hidden="true" />
            <span className="text-xs font-bold tabular-nums">{game.undos}</span>
          </Button>
          <Button
            variant="secondary"
            className="h-11 rounded-full px-3"
            onClick={() => startNew(game.daily)}
            title={t('game.newGame')}
            aria-label={t('game.newGame')}
          >
            <RotateCcw className="h-4 w-4" aria-hidden="true" />
            <span className="hidden sm:inline">{t('game.newGame')}</span>
          </Button>
        </div>
      </div>

      {/* Plateau fluide : carré, borné par la largeur ET la hauteur disponible (aucun scroll requis) */}
      <div
        role="group"
        aria-label={L.board}
        className="relative mx-auto grid aspect-square w-full max-w-[calc(100dvh-240px)] touch-none select-none grid-cols-4 grid-rows-4 gap-1.5 rounded-2xl border-2 border-amber-200/70 bg-amber-100/60 p-1.5 [container-type:inline-size] sm:gap-2 sm:p-2 dark:border-amber-500/20 dark:bg-secondary/60"
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => {
          swipeRef.current = null
        }}
        onLostPointerCapture={() => {
          swipeRef.current = null
        }}
        onContextMenu={(e) => e.preventDefault()}
      >
        {game.board.map((v, i) => (
          <div key={i} className="relative rounded-lg bg-amber-200/50 dark:bg-background/40">
            {v !== 0 ? (
              <div
                key={`${i}-${bumps[i]}`}
                aria-hidden="true"
                className={cn(
                  'absolute inset-0 flex flex-col items-center justify-center rounded-lg font-display font-extrabold leading-none shadow-sm sm:rounded-xl',
                  TILE_STYLE[v] ?? TILE_STYLE_BIG,
                  !reduce && animKind[i] === 'new' && 'anim-pop-in',
                  !reduce && animKind[i] === 'merged' && 'anim-merge-pulse-g',
                )}
              >
                {mode === 'themed' ? (
                  <>
                    <span className="text-[clamp(22px,10.5cqw,46px)]" aria-hidden="true">{FOOD[v] ?? '🍽️'}</span>
                    <span className="mt-0.5 text-[clamp(9px,3.4cqw,14px)] font-bold tabular-nums opacity-80">{v}</span>
                  </>
                ) : (
                  <>
                    <span className={cn('tabular-nums', tileFontClass(v))}>{v}</span>
                    <span className="absolute end-1 top-1 text-[clamp(11px,3.8cqw,17px)]" aria-hidden="true">{FOOD[v] ?? '🍽️'}</span>
                  </>
                )}
              </div>
            ) : null}
          </div>
        ))}

        {/* Bannière de victoire */}
        {winOverlay ? (
          <div className="anim-rise nice-scroll absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 overflow-y-auto rounded-2xl bg-card/85 p-4 text-center backdrop-blur-sm sm:gap-3 sm:p-6" role="status">
            <span className="text-4xl sm:text-5xl" aria-hidden="true">🍉</span>
            <p className="font-display text-xl font-extrabold text-emerald-600 sm:text-2xl dark:text-emerald-400">{L.winTitle}</p>
            <p className="max-w-xs text-sm text-muted-foreground">{L.winSub}</p>
            <div className="mt-1 w-full">
              <RoundEndActions
                gameId={gameId}
                onReplay={() => {
                  sfx.play('click')
                  setGame((g) => (g ? { ...g, ack: true } : g))
                }}
                replayLabel={t('common.continue')}
                replayIcon={<Play className="h-5 w-5" aria-hidden="true" />}
                shareResult={
                  lang === 'fr'
                    ? `2048 atteint ! Score : ${formatNum(game.score, lang)} points`
                    : `2048 reached! Score: ${formatNum(game.score, lang)} points`
                }
              />
              <Button
                variant="ghost"
                size="sm"
                className="mt-1 h-9 w-full rounded-2xl text-xs font-semibold"
                onClick={() => startNew(game.daily)}
              >
                <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> {t('game.newGame')}
              </Button>
            </div>
          </div>
        ) : null}

        {/* Écran de fin */}
        {game.over ? (
          <div className="anim-rise nice-scroll absolute inset-0 z-20 flex flex-col items-center justify-center gap-2 overflow-y-auto rounded-2xl bg-card/90 p-4 text-center backdrop-blur-sm sm:gap-3 sm:p-6" role="status">
            <span className="text-4xl sm:text-5xl" aria-hidden="true">🍽️</span>
            <p className="font-display text-xl font-extrabold sm:text-2xl">{L.overTitle}</p>
            <div className="flex flex-wrap justify-center gap-1.5">
              <StatBox label={L.finalScore} value={formatNum(game.score, lang)} />
              <StatBox label={L.bestTile} value={String(maxTile)} />
              <StatBox label={L.moves} value={String(game.moves)} />
            </div>
            <div className="mt-1 flex w-full flex-col items-center gap-2">
              {game.prev && game.undos > 0 ? (
                <Button size="lg" variant="secondary" className="h-11 w-full rounded-2xl" onClick={undo}>
                  <Undo2 className="h-4 w-4" aria-hidden="true" /> {L.undosLeft.replace('{n}', String(game.undos))}
                </Button>
              ) : null}
              <RoundEndActions
                gameId={gameId}
                onReplay={() => startNew(game.daily)}
                replayLabel={t('common.playAgain')}
                replayIcon={<RotateCcw className="h-5 w-5" aria-hidden="true" />}
                shareResult={
                  lang === 'fr'
                    ? `Score final : ${formatNum(game.score, lang)} points · tuile max ${maxTile}`
                    : `Final score: ${formatNum(game.score, lang)} points · best tile ${maxTile}`
                }
              />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

/* ================= Sous-composants ================= */

/** Boîte statistique compacte (libellé au-dessus, valeur en dessous). */
function StatBox({ label, value }: { label: string; value: string }) {
  return (
    <span className="flex h-11 min-w-[72px] flex-col items-center justify-center rounded-xl bg-secondary/70 px-2.5">
      <span className="text-[10px] font-bold uppercase leading-none tracking-wider text-muted-foreground">{label}</span>
      <span className="mt-1 text-lg font-extrabold leading-none tabular-nums">{value}</span>
    </span>
  )
}

/** Bascule Classique / Thématique compacte. */
function ModeToggle({ mode, labels, onToggle }: { mode: Mode; labels: (typeof STR)['fr']; onToggle: () => void }) {
  const options: { id: Mode; label: string; icon: React.ReactNode }[] = [
    { id: 'classic', label: labels.classic, icon: <Hash className="h-4 w-4" aria-hidden="true" /> },
    { id: 'themed', label: labels.themed, icon: <Cherry className="h-4 w-4" aria-hidden="true" /> },
  ]
  return (
    <div className="flex overflow-hidden rounded-full border" role="group" aria-label={labels.toThemed}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={mode === o.id}
          onClick={onToggle}
          className={cn(
            'flex h-11 items-center gap-1.5 px-4 text-sm font-bold transition-colors',
            mode === o.id ? 'bg-primary text-primary-foreground' : 'bg-card text-muted-foreground hover:text-foreground',
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  )
}
