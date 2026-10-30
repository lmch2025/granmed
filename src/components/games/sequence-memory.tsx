'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Eye, Pointer, Trophy, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore } from '@/lib/progress/store'
import { useReducedMotion } from '@/lib/utils-game'
import { computeIq } from '@/lib/games/iq'
import type { GameSEOContent } from '@/lib/games/types'
import { sequenceMemorySeoContent } from './data/sequence-memory-seo'
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'
import { IqChallengeBanner } from '@/components/game/iq-banner'
import { useJuice } from '@/components/game/fx'

export const gameId = 'sequence-memory'

/* ================= Contenu SEO bilingue ================= */
/* Task 27 : objet déplacé en données pures dans ./data/sequence-memory-seo.ts —
 * double-usage serveur/client (HTML brut des pages jeu réelles), source unique. */
export const content: GameSEOContent = sequenceMemorySeoContent

/* ================= Données de jeu ================= */
interface PadDef {
  emoji: string
  tone: number
  grad: string
  name: { fr: string; en: string }
}

/** 4 pastilles : do, mi, sol, do aigu. */
const PADS: PadDef[] = [
  { emoji: '🌸', tone: 261.63, grad: 'from-rose-400 to-rose-600', name: { fr: 'Pastille rose', en: 'Rose pad' } },
  { emoji: '🍯', tone: 329.63, grad: 'from-amber-400 to-orange-500', name: { fr: 'Pastille ambre', en: 'Amber pad' } },
  { emoji: '🍀', tone: 392.0, grad: 'from-emerald-400 to-green-600', name: { fr: 'Pastille émeraude', en: 'Emerald pad' } },
  { emoji: '💜', tone: 523.25, grad: 'from-violet-400 to-purple-600', name: { fr: 'Pastille violette', en: 'Violet pad' } },
]

type Mode = 'classic' | 'fast'
type Phase = 'idle' | 'showing' | 'input' | 'over'

interface OverInfo {
  score: number
  isRecord: boolean
  /** QI estimé de la manche (Task 18). */
  iq: number
  /** Position où le joueur s'est trompé. */
  failedAt: number
  /** Pastille jouée à tort. */
  played: number
  /** Snapshot de la séquence attendue (recopiée pour le rendu). */
  seq: number[]
}

/* ================= Composant principal ================= */
export default function SequenceMemoryGame() {
  const t = useT()
  const lang = useLang()
  const reduce = useReducedMotion()
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const addGameXp = useProfileStore((s) => s.addGameXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const recordsRef = useProfileStore((s) => s.profile.games[gameId]?.records)
  const records = recordsRef ?? {}

  const [mode, setMode] = useState<Mode>('classic')
  const [phase, setPhase] = useState<Phase>('idle')
  const [level, setLevel] = useState(1)
  const [inputIdx, setInputIdx] = useState(0)
  const [lit, setLit] = useState<number | null>(null)
  const [tapFlash, setTapFlash] = useState<number | null>(null)
  const [shakeIdx, setShakeIdx] = useState<number | null>(null)
  const [over, setOver] = useState<OverInfo | null>(null)
  const [showOver, setShowOver] = useState(false)
  const [turnFlash, setTurnFlash] = useState(false)
  const [confetti, setConfetti] = useState(0)
  const [burstKey, setBurstKey] = useState(0)

  const seqRef = useRef<number[]>([])
  const timersRef = useRef<number[]>([])
  const inputIdxRef = useRef(0)
  const phaseRef = useRef<Phase>('idle')
  const modeRef = useRef<Mode>('classic')
  const pausedRef = useRef(false)
  const lastStartRef = useRef(0)
  /* Effets « juice » (Task 20) — rebond de la pastille réussie, frisson du
     plateau sur erreur ; imperatifs (WAAPI), aucun re-render ni verrou. */
  const juice = useJuice()
  const padsRef = useRef<(HTMLButtonElement | null)[]>([])
  const boardRef = useRef<HTMLDivElement>(null)

  const L = {
    fr: {
      board: 'Plateau de séquences',
      watchTitle: 'Observez la séquence…',
      yourTurn: 'À vous !',
      watch: 'Regardez',
      repeat: 'Reproduisez',
      levelWord: 'Niveau',
      bestClassic: 'Record — Classique',
      bestFast: 'Record — Rapide',
      reached: 'séquence reproduite',
      classicMode: 'Classique',
      fastMode: 'Rapide',
      speedConst: 'vitesse constante',
      speedAcc: 'accélère tous les 5 niveaux',
      sequence: 'La séquence attendue',
      expected: 'Attendu',
      played: 'Joué',
      retry: 'Réessayer',
      startHint: 'Quatre pastilles, quatre notes : mémorisez l’ordre et reproduisez-le.',
    },
    en: {
      board: 'Sequence board',
      watchTitle: 'Watch the sequence…',
      yourTurn: 'Your turn!',
      watch: 'Watch',
      repeat: 'Repeat',
      levelWord: 'Level',
      bestClassic: 'Best — Classic',
      bestFast: 'Best — Fast',
      reached: 'sequence reproduced',
      classicMode: 'Classic',
      fastMode: 'Fast',
      speedConst: 'constant speed',
      speedAcc: 'speeds up every 5 levels',
      sequence: 'The expected sequence',
      expected: 'Expected',
      played: 'Played',
      retry: 'Try again',
      startHint: 'Four pads, four tones: memorize the order and repeat it.',
    },
  }[lang]

  function clearTimers() {
    for (const id of timersRef.current) window.clearTimeout(id)
    timersRef.current = []
  }

  function goPhase(p: Phase) {
    phaseRef.current = p
    setPhase(p)
  }

  function speedFor(len: number, m: Mode): { lit: number; gap: number } {
    if (m === 'classic') return { lit: 400, gap: 200 }
    const lit = Math.max(150, 300 - Math.floor((len - 1) / 5) * 10)
    return { lit, gap: Math.round(lit / 2) }
  }

  /** Rejoue la séquence complète depuis le début (allume chaque pastille + ton).
   *  Tous les minuteurs passent par timersRef (jamais d'effet qui fuit). */
  function playSequence() {
    clearTimers()
    setLit(null)
    setTurnFlash(false)
    goPhase('showing')
    inputIdxRef.current = 0
    setInputIdx(0)
    const seq = seqRef.current
    const { lit: litMs, gap } = speedFor(seq.length, modeRef.current)
    // Ton légèrement raccourci quand le mode Rapide accélère, pour éviter le brouillage.
    const toneDur = Math.max(0.12, Math.min(0.3, litMs / 1000 - 0.04))
    let at = 380
    for (const pad of seq) {
      timersRef.current.push(
        window.setTimeout(() => {
          setLit(pad)
          sfx.tone(PADS[pad].tone, toneDur)
        }, at),
      )
      timersRef.current.push(window.setTimeout(() => setLit(null), at + litMs))
      at += litMs + gap
    }
    timersRef.current.push(
      window.setTimeout(() => {
        goPhase('input')
        // Signal « À vous ! » les premiers niveaux, le temps de prendre le rythme.
        if (seqRef.current.length <= 3) {
          setTurnFlash(true)
          timersRef.current.push(window.setTimeout(() => setTurnFlash(false), 1000))
        }
      }, at + 90),
    )
  }

  function start(m: Mode) {
    const now = Date.now()
    if (now - lastStartRef.current < 350) return // anti double-tap (double addPlay)
    lastStartRef.current = now
    clearTimers()
    pausedRef.current = false
    modeRef.current = m
    setMode(m)
    seqRef.current = [Math.floor(Math.random() * 4)]
    setLevel(1)
    setOver(null)
    setShowOver(false)
    setShakeIdx(null)
    setTapFlash(null)
    setTurnFlash(false)
    addPlay(gameId)
    sfx.play('sweep', { volume: 0.5 })
    playSequence()
  }

  /** Fin de partie : records, succès, écran de fin. Appelée depuis le handler
   *  de saisie (jamais depuis un effet — convention React 19 du portail). */
  function failRun(failedAt: number, played: number) {
    const seq = seqRef.current
    const score = Math.max(0, seq.length - 1)
    /* QI estimé (Task 18) : précision = longueur de séquence reproduite
     * (13 = sans faute), difficulté = Classique 2 / Rapide 3 ; pas de
     * composante de rapidité (le jeu se joue sans temps « par »). */
    const accuracy = Math.min(1, Math.max(0.1, (score - 1) / 12))
    const difficulty: 1 | 2 | 3 = modeRef.current === 'fast' ? 3 : 2
    const iq = computeIq(gameId, { accuracy, difficulty })
    const metric = modeRef.current === 'classic' ? 'best-sequence-classic' : 'best-sequence-fast'
    const isRecord = score > 0 ? setBest(gameId, metric, score) : false
    if (score >= 10) unlockBadge('simon-10')
    if (score >= 20) unlockBadge('simon-20')
    if (score >= 5) addWin(gameId)
    /* Manche « victorieuse » (série ≥ 5) : célébration + 25 XP ; sinon 10 XP de consolation. */
    if (score >= 5) {
      setConfetti((c) => c + 1)
      setBurstKey((k) => k + 1)
    }
    addGameXp(gameId, score >= 5 ? 25 : 10)
    goPhase('over')
    setOver({ score, isRecord, failedAt, played, seq: [...seq], iq })
    setShowOver(false)
    // Laisse d'abord voir la pastille ratée (secousse rouge) avant l'écran de fin.
    timersRef.current.push(window.setTimeout(() => sfx.play('lose', { volume: 0.55 }), 450))
    timersRef.current.push(
      window.setTimeout(() => {
        setShowOver(true)
        setShakeIdx(null)
      }, 900),
    )
  }

  function onPad(i: number) {
    if (phaseRef.current !== 'input') return
    sfx.tone(PADS[i].tone, 0.32)
    setTapFlash(i)
    timersRef.current.push(window.setTimeout(() => setTapFlash(null), 220))
    const seq = seqRef.current
    const idx = inputIdxRef.current
    if (seq[idx] === i) {
      navigator.vibrate?.(10)
      juice.pop(padsRef.current[i], 1.06, 200)
      if (idx + 1 >= seq.length) {
        // Séquence complète : niveau suivant, la séquence s'allonge d'une couleur.
        sfx.play('coin', { volume: 0.6 })
        addXp(5)
        if (seq.length % 5 === 0) {
          sfx.play('levelup', { volume: 0.7 })
          setConfetti((c) => c + 1)
        }
        seqRef.current = [...seq, Math.floor(Math.random() * 4)]
        setLevel(seqRef.current.length)
        goPhase('showing')
        timersRef.current.push(window.setTimeout(() => playSequence(), 650))
      } else {
        inputIdxRef.current = idx + 1
        setInputIdx(idx + 1)
      }
    } else {
      sfx.play('wrong', { volume: 0.5 })
      navigator.vibrate?.(10)
      juice.shake(boardRef.current, 1)
      setShakeIdx(i)
      failRun(idx, i)
    }
  }

  /* Pause : si l'onglet est masqué pendant la lecture, on rejoue la séquence au retour. */
  useEffect(() => {
    const onVis = () => {
      if (document.hidden) {
        if (phaseRef.current === 'showing') {
          clearTimers()
          setLit(null)
          pausedRef.current = true
        }
      } else if (pausedRef.current) {
        pausedRef.current = false
        playSequence()
      }
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  /* Nettoyage de tous les minuteurs au démontage. */
  useEffect(() => () => clearTimers(), [])

  /* Clavier : touches 1-4 pendant la phase de saisie (appui maintenu ignoré). */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.repeat) return
      const i = ['1', '2', '3', '4'].indexOf(e.key)
      if (i >= 0 && phaseRef.current === 'input') {
        e.preventDefault()
        onPad(i)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  const best = records[mode === 'classic' ? 'best-sequence-classic' : 'best-sequence-fast']?.value
  const overStars = over ? (over.score >= 8 ? 3 : over.score >= 5 ? 2 : 1) : 3

  return (
    <div className="relative my-auto w-full select-none">
      {/* ---- HUD : une seule ligne compacte, au-dessus des pads ---- */}
      <div className="mb-2.5 flex min-h-10 flex-wrap items-center gap-1.5">
        {phase === 'idle' || phase === 'over' ? (
          <>
            {/* Défi QI bienveillant — mis en avant dès l'ouverture (Task 19) */}
            <IqChallengeBanner gameId={gameId} />

            <div className="flex flex-wrap gap-1.5" role="group" aria-label={t('common.mode')}>
              {(['classic', 'fast'] as Mode[]).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => {
                    sfx.play('click', { volume: 0.5 })
                    modeRef.current = m
                    setMode(m)
                  }}
                  className={cn(
                    'h-9 rounded-full border px-3.5 text-xs font-bold transition-colors',
                    mode === m
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {m === 'classic' ? L.classicMode : L.fastMode}
                </button>
              ))}
            </div>
            {best != null ? (
              <span
                title={mode === 'classic' ? L.bestClassic : L.bestFast}
                className="flex h-9 items-center gap-1.5 rounded-full bg-secondary/70 px-3 text-xs font-bold"
              >
                <Trophy className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                <span className="tabular-nums">{best}</span>
              </span>
            ) : null}
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {mode === 'classic' ? L.speedConst : L.speedAcc}
            </span>
            <Button size="sm" className="anim-glow ms-auto h-9 gap-1.5 rounded-full px-4" onClick={() => start(mode)}>
              <Play className="h-4 w-4" aria-hidden="true" />
              {phase === 'over' ? t('common.playAgain') : t('common.start')}
            </Button>
          </>
        ) : (
          <>
            <span
              key={level}
              className={cn(
                'flex h-8 items-center gap-1.5 rounded-full bg-secondary/70 px-2.5 text-xs font-bold',
                !reduce && 'anim-pop-in',
              )}
            >
              <Zap className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
              <span className="text-muted-foreground">{L.levelWord}</span>
              <span className="tabular-nums">{level}</span>
            </span>
            {phase === 'showing' ? (
              <span
                role="status"
                className="flex h-8 items-center gap-1.5 rounded-full bg-amber-100 px-2.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300"
              >
                <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                {L.watchTitle}
              </span>
            ) : (
              <span
                role="status"
                className="flex h-8 items-center gap-1.5 rounded-full bg-emerald-100 px-2.5 text-xs font-bold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300"
              >
                <Pointer className="h-3.5 w-3.5" aria-hidden="true" />
                <span className="tabular-nums">
                  {inputIdx}/{Math.max(1, level)}
                </span>
              </span>
            )}
            <Button
              variant="secondary"
              size="sm"
              className="relative ms-auto h-8 w-8 rounded-full p-0 after:absolute after:-inset-2 after:content-['']"
              aria-label={t('common.restart')}
              onClick={() => {
                sfx.play('click')
                start(mode)
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
            </Button>
          </>
        )}
      </div>

      {/* ---- Plateau 2×2 : carré, pleine largeur disponible, borné au budget
              vertical mobile (100dvh − chrome/HUD) — jamais de scroll horizontal ---- */}
      <div className="mx-auto w-full max-w-[min(calc(100dvh_-_250px),28rem)]">
        <div ref={boardRef} className="relative grid aspect-square grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3" role="group" aria-label={L.board}>
          {PADS.map((pad, i) => {
            const active = lit === i || tapFlash === i
            const isShake = shakeIdx === i
            return (
              <button
                key={i}
                ref={(el) => {
                  padsRef.current[i] = el
                }}
                type="button"
                disabled={phase !== 'input'}
                aria-label={`${pad.name[lang]} (${i + 1})`}
                onClick={() => onPad(i)}
                className={cn(
                  'no-select touch-manipulation relative flex min-h-[60px] items-center justify-center rounded-2xl border-b-4 border-black/10 bg-gradient-to-br text-4xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring sm:rounded-3xl sm:text-5xl',
                  pad.grad,
                  active ? 'saturate-150 brightness-125 ring-4 ring-white/70' : 'saturate-[.55] brightness-[.74]',
                  !reduce && 'transition-all duration-100',
                  active && !reduce && 'scale-[1.03]',
                  phase === 'input' && !active && 'hover:brightness-90',
                  phase === 'input' && !active && !reduce && 'active:scale-[0.97]',
                  phase === 'showing' && 'cursor-wait',
                  isShake && 'anim-shake ring-4 ring-red-400 brightness-110',
                )}
              >
                <span
                  className={cn('drop-shadow-md', !reduce && 'transition-transform duration-100', active && !reduce && 'scale-110')}
                  aria-hidden="true"
                >
                  {pad.emoji}
                </span>
              </button>
            )
          })}

          {/* Signal « À vous ! » — les premiers niveaux seulement */}
          {turnFlash && !reduce ? (
            <div className="pointer-events-none absolute left-1/2 top-3 z-20 -translate-x-1/2" aria-hidden="true">
              <span className="anim-pop-in flex items-center gap-1.5 rounded-full bg-emerald-500 px-3.5 py-1.5 text-sm font-bold text-white shadow-lg">
                <Pointer className="h-4 w-4" aria-hidden="true" />
                {L.yourTurn}
              </span>
            </div>
          ) : null}

          {/* Écran de fin : la séquence ratée est montrée, rejouer immédiat.
              Superposé au plateau pour rester à l'écran sans le moindre scroll. */}
          {phase === 'over' && over && showOver ? (
            <div className="absolute inset-0 z-20 flex items-center justify-center p-2" role="status">
              <div className="anim-pop-in nice-scroll flex max-h-full w-full max-w-[19rem] flex-col items-center gap-2 overflow-y-auto rounded-2xl border-2 border-amber-300/70 bg-card/95 p-4 text-center shadow-xl backdrop-blur-sm">
                <p className="font-display text-lg font-extrabold text-amber-700 dark:text-amber-300">🔔 {t('common.defeat')}</p>
                <p className="text-4xl font-extrabold leading-none tabular-nums">{over.score}</p>
                <p className="-mt-1 text-xs text-muted-foreground">{L.reached}</p>
                <div className="flex flex-wrap items-center justify-center gap-1.5">
                  <span className="flex h-8 items-center gap-1.5 rounded-full bg-secondary/70 px-2.5 text-xs font-bold">
                    <Trophy className="h-3.5 w-3.5 text-amber-500" aria-hidden="true" />
                    <span className="text-muted-foreground">{t('common.best')}</span>
                    <span className="tabular-nums">{best ?? '—'}</span>
                  </span>
                  {over.isRecord ? (
                    <span className="flex h-8 items-center gap-1.5 rounded-full bg-amber-100 px-2.5 text-xs font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                      <Trophy className="h-3.5 w-3.5" aria-hidden="true" />
                      {t('common.newRecord')}
                    </span>
                  ) : null}
                </div>
                <div className="w-full rounded-xl bg-secondary/50 px-2.5 py-2">
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">{L.sequence}</p>
                  <div className="mt-1.5 flex flex-wrap items-center justify-center gap-1">
                    {over.seq.map((p, k) => (
                      <span
                        key={k}
                        title={PADS[p].name[lang]}
                        className={cn(
                          'rounded-full bg-gradient-to-br',
                          PADS[p].grad,
                          k === over.failedAt ? 'h-4 w-4 ring-2 ring-red-500 ring-offset-1 ring-offset-card' : 'h-3 w-3',
                          k > over.failedAt && 'opacity-25',
                        )}
                      />
                    ))}
                  </div>
                  <p className="mt-1.5 text-[11px] text-muted-foreground">
                    {L.expected} <span aria-hidden="true">{PADS[over.seq[over.failedAt]].emoji}</span>
                    <span className="mx-1.5" aria-hidden="true">
                      ·
                    </span>
                    {L.played} <span aria-hidden="true">{PADS[over.played].emoji}</span>
                  </p>
                </div>
                <RoundEndActions
                  gameId={gameId}
                  onReplay={() => start(mode)}
                  replayLabel={over && over.score >= 5 ? t('common.playAgain') : L.retry}
                  iq={over.iq}
                  shareResult={lang === 'fr' ? `Séquence de ${over.score} reproduite` : `Sequence of ${over.score} replayed`}
                />
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-9 shrink-0 rounded-full px-4"
                  onClick={() => start(mode === 'classic' ? 'fast' : 'classic')}
                >
                  <Play className="h-4 w-4" aria-hidden="true" />
                  {mode === 'classic' ? L.fastMode : L.classicMode}
                </Button>
              </div>
            </div>
          ) : null}

          <Confetti fire={confetti} count={reduce ? 0 : 110} waves={2} gold />
          <VictoryBurst fire={burstKey} stars={overStars} sub={over ? `${over.score} — ${L.reached}` : undefined} />
        </div>
      </div>

      {/* Aide minimale, SOUS le plateau (jamais au-dessus des pads) */}
      {phase === 'idle' ? (
        <p className="mt-3 text-center text-xs leading-relaxed text-muted-foreground">
          <span className="font-semibold">1. {L.watch}</span> · <span className="font-semibold">2. {L.repeat}</span> — {L.startHint}
        </p>
      ) : null}
    </div>
  )
}
