'use client'

import { useEffect, useRef, useState } from 'react'
import { Play, RotateCcw, Eye, Pointer, Trophy, Zap } from 'lucide-react'
import { cn } from '@/lib/utils'
import { sfx } from '@/lib/sound'
import { useT, useLang } from '@/lib/i18n'
import { useProfileStore } from '@/lib/progress/store'
import { useReducedMotion } from '@/lib/utils-game'
import type { GameSEOContent } from '@/lib/games/types'
import { Button } from '@/components/ui/button'

export const gameId = 'sequence-memory'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: "Mémorisez et reproduisez des séquences de couleurs et de sons de plus en plus longues, façon Simon classique.",
    en: "Memorize and repeat ever-longer color and sound sequences, classic Simon style.",
  },
  description: {
    fr: [
      "Gran' Mémoire est un jeu de séquences lumineuses inspiré du Simon classique : quatre pastilles colorées s'allument tour à tour avec leur note musicale, et vous devez reproduire la séquence exacte dans le même ordre. Chaque tour réussi ajoute une couleur, la séquence s'allonge et votre mémoire de travail est mise à l'épreuve.",
      "Deux modes sont proposés : le mode Classique, à vitesse constante, et le mode Rapide, qui accélère légèrement tous les cinq niveaux. Votre score correspond à la longueur de séquence reproduite, avec des records séparés par mode, des succès à débloquer (séquences de 10 et de 20) et de l'XP gagnée à chaque niveau réussi.",
      "Cet entraînement cérébral se joue en quelques minutes, sans inscription, sur mobile comme sur ordinateur. Les quatre tons distincts (do, mi, sol, do aigu) permettent à l'oreille de soutenir la mémoire visuelle : écoutez autant que vous regardez.",
    ],
    en: [
      "Gran's Memory is a light-sequence game inspired by the classic Simon: four colored pads light up one after another with their own musical tone, and you must repeat the exact sequence in the same order. Every successful round adds one more color, the sequence grows longer and your working memory is put to the test.",
      "Two modes are available: Classic, at a constant speed, and Fast, which speeds up slightly every five levels. Your score is the sequence length you reproduced, with separate personal bests per mode, achievements to unlock (sequences of 10 and 20) and XP earned on every completed level.",
      "This brain-training game plays in a few minutes, with no sign-up, on mobile and desktop alike. The four distinct tones (C, E, G, high C) let your ears support your visual memory: listen as much as you watch.",
    ],
  },
  rules: {
    fr: [
      'Choisissez un mode : Classique (vitesse constante) ou Rapide (accélère tous les 5 niveaux).',
      'Appuyez sur Commencer : les pastilles s’allument une à une, chacune avec sa note.',
      'Observez et écoutez la séquence complète sans toucher l’écran.',
      'À votre tour : touchez les pastilles dans le même ordre.',
      'Chaque séquence réussie ajoute une couleur ; le niveau suivant rejoue toute la séquence depuis le début.',
      'Une seule erreur et la partie s’arrête : votre score est la longueur de séquence reproduite.',
    ],
    en: [
      'Pick a mode: Classic (constant speed) or Fast (speeds up every 5 levels).',
      'Press Start: the pads light up one by one, each with its own tone.',
      'Watch and listen to the whole sequence without touching the screen.',
      'Your turn: tap the pads in the same order.',
      'Each successful sequence adds one color; the next level replays the whole sequence from the start.',
      'One single mistake ends the game: your score is the sequence length you reproduced.',
    ],
  },
  controls: {
    fr: [
      'Mobile et tablette : touchez les grandes pastilles colorées.',
      'Ordinateur : cliquez sur les pastilles, ou utilisez les touches 1, 2, 3 et 4 (dans l’ordre de lecture du plateau).',
      'Le son se coupe depuis la barre d’outils ; chaque pastille conserve sa propre note.',
    ],
    en: [
      'Mobile & tablet: tap the large colored pads.',
      'Desktop: click the pads, or use the 1, 2, 3 and 4 keys (in the board’s reading order).',
      'Sound can be muted from the toolbar; each pad keeps its own tone.',
    ],
  },
  features: {
    fr: [
      '4 grandes pastilles aux dégradés rose, ambre, émeraude et violet',
      'Tons musicaux distincts (do, mi, sol, do aigu) générés en direct',
      'Mode Classique et mode Rapide accéléré (jusqu’à 150 ms par couleur)',
      'Records personnels séparés pour chaque mode',
      'Succès « Séquence 10 » et « Séquence 20 » à débloquer',
      'Rejouer instantanément, sans rechargement',
    ],
    en: [
      '4 large pads with rose, amber, emerald and violet gradients',
      'Distinct musical tones (C, E, G, high C) generated live',
      'Classic mode and accelerating Fast mode (down to 150 ms per color)',
      'Separate personal bests for each mode',
      '“Sequence 10” and “Sequence 20” achievements to unlock',
      'Instant replay, no reload needed',
    ],
  },
  tips: {
    fr: [
      'Répétez la séquence à voix haute (« rose, ambre, ambre, violet… ») : la mémoire verbale soutient la mémoire visuelle.',
      'Mémorisez chaque pastille avec sa note : l’oreille reconnaît souvent la bonne couleur avant l’œil.',
      'Fixez un point au centre du plateau pour embrasser les quatre pastilles d’un seul regard, sans bouger la tête.',
      'En mode Rapide, regroupez la séquence par blocs de deux ou trois couleurs pour mieux l’anticiper.',
    ],
    en: [
      'Say the sequence out loud (“rose, amber, amber, violet…”): verbal memory supports visual memory.',
      'Memorize each pad with its tone: your ear often spots the right color before your eye does.',
      'Stare at a point in the center of the board to take in all four pads at once, without moving your head.',
      'In Fast mode, chunk the sequence into groups of two or three colors to anticipate better.',
    ],
  },
  faq: {
    fr: [
      { q: "Gran' Mémoire est-il vraiment gratuit ?", a: "Oui : les deux modes, les records et les succès sont accessibles gratuitement, sans inscription ni téléchargement." },
      { q: 'Comment le score est-il calculé ?', a: 'Le score est la longueur de séquence que vous avez réussi à reproduire entièrement. Si vous échouez au niveau 7, votre score est de 6.' },
      { q: 'Quelle est la différence entre les modes Classique et Rapide ?', a: 'En Classique, chaque couleur reste allumée 400 ms du début à la fin. En Rapide, on démarre à 300 ms et la vitesse augmente de 10 ms tous les cinq niveaux, jusqu’à un minimum de 150 ms.' },
      { q: 'Ce jeu améliore-t-il vraiment la mémoire ?', a: "Il fait travailler la mémoire de travail auditive et visuelle, comme tout exercice régulier de ce type. Il mesure surtout votre entraînement à ce jeu, sans prétendre évaluer vos capacités cognitives globales." },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui, le plateau 2×2 est conçu pour l’écran tactile et occupe toute la largeur en portrait comme en paysage.' },
    ],
    en: [
      { q: "Is Gran's Memory really free?", a: 'Yes: both modes, records and achievements are free to play, with no sign-up and no download.' },
      { q: 'How is the score calculated?', a: 'The score is the sequence length you fully reproduced. If you fail at level 7, your score is 6.' },
      { q: 'What is the difference between Classic and Fast modes?', a: 'In Classic, every color stays lit for 400 ms from start to finish. In Fast, you start at 300 ms and the speed increases by 10 ms every five levels, down to a minimum of 150 ms.' },
      { q: 'Does this game really improve memory?', a: 'It exercises auditory and visual working memory, like any regular practice of this kind. It mostly measures your training at this game, not your overall cognitive abilities.' },
      { q: 'Can I play on my phone?', a: 'Yes, the 2×2 board is designed for touch and fills the width in portrait or landscape.' },
    ],
  },
  records: {
    'best-sequence-classic': { fr: 'Meilleure séquence — Classique', en: 'Best sequence — Classic' },
    'best-sequence-fast': { fr: 'Meilleure séquence — Rapide', en: 'Best sequence — Fast' },
  },
}

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

/* ================= Composant principal ================= */
export default function SequenceMemoryGame() {
  const t = useT()
  const lang = useLang()
  const reduce = useReducedMotion()
  const addPlay = useProfileStore((s) => s.addPlay)
  const addWin = useProfileStore((s) => s.addWin)
  const addXp = useProfileStore((s) => s.addXp)
  const setBest = useProfileStore((s) => s.setBest)
  const unlockBadge = useProfileStore((s) => s.unlockBadge)
  const recordsRef = useProfileStore((s) => s.profile.games[gameId]?.records)
  const records = recordsRef ?? {}

  const [mode, setMode] = useState<Mode>('classic')
  const [phase, setPhase] = useState<Phase>('idle')
  const [level, setLevel] = useState(0)
  const [inputIdx, setInputIdx] = useState(0)
  const [lit, setLit] = useState<number | null>(null)
  const [tapFlash, setTapFlash] = useState<number | null>(null)
  const [shakeIdx, setShakeIdx] = useState<number | null>(null)
  const [over, setOver] = useState<{ score: number; isRecord: boolean } | null>(null)

  const seqRef = useRef<number[]>([])
  const timersRef = useRef<number[]>([])
  const inputIdxRef = useRef(0)
  const phaseRef = useRef<Phase>('idle')
  const modeRef = useRef<Mode>('classic')
  const pausedRef = useRef(false)

  const L = {
    fr: {
      watchTitle: 'Observez la séquence…',
      yourTurn: 'À vous de jouer !',
      how: 'Le plateau va s’allumer : regardez et écoutez, puis reproduisez la séquence dans le même ordre.',
      watch: 'Regardez',
      repeat: 'Reproduisez',
      progress: 'Progression',
      levelWord: 'Niveau',
      bestClassic: 'Record Classique',
      bestFast: 'Record Rapide',
      reached: 'Séquence reproduite',
      classicMode: 'Classique',
      fastMode: 'Rapide',
      speedConst: 'vitesse constante',
      speedAcc: 'accélère tous les 5 niveaux',
      ready: 'Prêt ?',
      startHint: 'Quatre pastilles, quatre notes : mémorisez l’ordre et reproduisez-le.',
    },
    en: {
      watchTitle: 'Watch the sequence…',
      yourTurn: 'Your turn!',
      how: 'The board will light up: watch and listen, then repeat the sequence in the same order.',
      watch: 'Watch',
      repeat: 'Repeat',
      progress: 'Progress',
      levelWord: 'Level',
      bestClassic: 'Classic best',
      bestFast: 'Fast best',
      reached: 'Sequence reproduced',
      classicMode: 'Classic',
      fastMode: 'Fast',
      speedConst: 'constant speed',
      speedAcc: 'speeds up every 5 levels',
      ready: 'Ready?',
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

  /** Rejoue la séquence complète depuis le début (lit chaque pastille + ton). */
  function playSequence() {
    clearTimers()
    setLit(null)
    goPhase('showing')
    inputIdxRef.current = 0
    setInputIdx(0)
    const seq = seqRef.current
    const { lit: litMs, gap } = speedFor(seq.length, modeRef.current)
    let t = 400
    seq.forEach((pad, i) => {
      timersRef.current.push(
        window.setTimeout(() => {
          setLit(pad)
          sfx.tone(PADS[pad].tone, 0.32)
        }, t),
      )
      timersRef.current.push(window.setTimeout(() => setLit(null), t + litMs))
      t += litMs + gap
    })
    timersRef.current.push(
      window.setTimeout(() => {
        goPhase('input')
      }, t + 80),
    )
  }

  function start(m: Mode) {
    clearTimers()
    pausedRef.current = false
    modeRef.current = m
    setMode(m)
    seqRef.current = [Math.floor(Math.random() * 4)]
    setLevel(1)
    setOver(null)
    setShakeIdx(null)
    setTapFlash(null)
    addPlay(gameId)
    playSequence()
  }

  function finishRun() {
    const score = Math.max(0, seqRef.current.length - 1)
    const metric = modeRef.current === 'classic' ? 'best-sequence-classic' : 'best-sequence-fast'
    const isRecord = score > 0 ? setBest(gameId, metric, score) : false
    if (score >= 10) unlockBadge('simon-10')
    if (score >= 20) unlockBadge('simon-20')
    if (isRecord) addWin(gameId)
    goPhase('over')
    setOver({ score, isRecord })
    timersRef.current.push(window.setTimeout(() => setShakeIdx(null), 600))
  }

  function onPad(i: number) {
    if (phaseRef.current !== 'input') return
    sfx.tone(PADS[i].tone, 0.32)
    setTapFlash(i)
    timersRef.current.push(window.setTimeout(() => setTapFlash(null), 240))
    const seq = seqRef.current
    const idx = inputIdxRef.current
    if (seq[idx] === i) {
      if (idx + 1 >= seq.length) {
        // Séquence complète : niveau suivant, la séquence s'allonge d'une couleur.
        sfx.play('coin', { volume: 0.6 })
        addXp(5)
        seqRef.current = [...seq, Math.floor(Math.random() * 4)]
        setLevel(seqRef.current.length)
        goPhase('showing')
        timersRef.current.push(window.setTimeout(() => playSequence(), 700))
      } else {
        inputIdxRef.current = idx + 1
        setInputIdx(idx + 1)
      }
    } else {
      sfx.play('wrong', { volume: 0.5 })
      setShakeIdx(i)
      finishRun()
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

  /* Clavier : touches 1-4 pendant la phase de saisie. */
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const i = ['1', '2', '3', '4'].indexOf(e.key)
      if (i >= 0 && phaseRef.current === 'input') {
        e.preventDefault()
        onPad(i)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
     
  }, [])

  const bestValue = (m: Mode) => records[m === 'classic' ? 'best-sequence-classic' : 'best-sequence-fast']?.value
  const best = bestValue(mode)
  const speed = speedFor(Math.max(1, level), mode)

  return (
    <div className="relative select-none">
      {/* Barre supérieure : mode + statut */}
      <div className="mb-4 flex flex-wrap items-center gap-2">
        {phase === 'idle' || phase === 'over' ? (
          <>
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
                    'h-11 rounded-full border px-4 text-sm font-bold transition-all',
                    mode === m
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground',
                  )}
                >
                  {m === 'classic' ? L.classicMode : L.fastMode}
                </button>
              ))}
            </div>
            <span className="hidden text-xs text-muted-foreground sm:inline">
              {mode === 'classic' ? L.speedConst : L.speedAcc}
            </span>
            <Button size="lg" className="ms-auto h-11 rounded-full px-5 anim-glow" onClick={() => start(mode)}>
              <Play className="h-4 w-4" aria-hidden="true" />
              {phase === 'over' ? t('common.playAgain') : t('common.start')}
            </Button>
          </>
        ) : (
          <>
            <div className="flex flex-wrap items-center gap-2">
              <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.levelWord} value={level} />
              {phase === 'input' ? (
                <StatPill
                  icon={<Pointer className="h-4 w-4" aria-hidden="true" />}
                  label={L.progress}
                  value={`${inputIdx}/${Math.max(1, level)}`}
                />
              ) : (
                <StatPill icon={<Eye className="h-4 w-4" aria-hidden="true" />} label={t('common.time')} value={`${speed.lit} ms`} />
              )}
              <span
                className={cn(
                  'flex h-11 items-center gap-2 rounded-full px-4 text-sm font-bold',
                  phase === 'showing'
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300'
                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
                )}
                role="status"
              >
                {phase === 'showing' ? (
                  <>
                    <Eye className="h-4 w-4" aria-hidden="true" /> {L.watchTitle}
                  </>
                ) : (
                  <>
                    <Pointer className="h-4 w-4" aria-hidden="true" /> {L.yourTurn}
                  </>
                )}
              </span>
            </div>
            <Button
              variant="secondary"
              size="lg"
              className="ms-auto h-11 rounded-full"
              onClick={() => {
                sfx.play('click')
                start(mode)
              }}
            >
              <RotateCcw className="h-4 w-4" aria-hidden="true" />
              {t('common.restart')}
            </Button>
          </>
        )}
      </div>

      {/* Consigne première partie */}
      {phase === 'idle' ? (
        <div className="mb-4 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/5 p-4" role="note">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xl" aria-hidden="true">
            👀
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm font-bold">
              1. {L.watch} · 2. {L.repeat}
            </p>
            <p className="mt-0.5 text-sm text-muted-foreground">{L.how}</p>
            <p className="mt-1 text-xs text-muted-foreground">{L.startHint}</p>
          </div>
        </div>
      ) : null}

      {/* Plateau 2×2 */}
      <div className="mx-auto grid w-full max-w-md grid-cols-2 gap-3" role="group" aria-label={content.tagline[lang]}>
        {PADS.map((pad, i) => {
          const isLit = lit === i
          const isTap = tapFlash === i
          const isShake = shakeIdx === i
          const active = isLit || isTap
          return (
            <button
              key={i}
              type="button"
              disabled={phase !== 'input'}
              aria-label={`${pad.name[lang]} (${i + 1})`}
              onClick={() => onPad(i)}
              className={cn(
                'relative flex min-h-[120px] items-center justify-center rounded-3xl border-b-4 border-black/10 bg-gradient-to-br text-5xl no-select transition-all duration-150 focus-visible:outline-2 focus-visible:outline-ring sm:min-h-[150px] sm:text-6xl',
                pad.grad,
                active ? 'scale-[1.04] saturate-150 brightness-125 ring-4 ring-white/70' : 'saturate-[.55] brightness-[.72]',
                phase === 'input' && !active && 'hover:brightness-95 active:scale-[0.98]',
                phase === 'showing' && 'cursor-wait',
                isShake && 'anim-shake ring-4 ring-red-400 brightness-110',
                !reduce && phase !== 'showing' && 'hover:brightness-90',
              )}
            >
              <span className={cn('drop-shadow-md transition-transform', active && 'scale-110')} aria-hidden="true">
                {pad.emoji}
              </span>
            </button>
          )
        })}
      </div>

      {/* Écran de fin */}
      {phase === 'over' && over ? (
        <div className="anim-rise mt-5 rounded-2xl border-2 border-amber-300/60 bg-amber-50/60 p-5 text-center dark:border-amber-500/30 dark:bg-amber-500/10" role="status">
          <p className="font-display text-2xl font-extrabold text-amber-700 dark:text-amber-300">🔔 {t('common.defeat')}</p>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2.5">
            <StatPill icon={<Zap className="h-4 w-4" aria-hidden="true" />} label={L.reached} value={over.score} />
            <StatPill icon={<Trophy className="h-4 w-4" aria-hidden="true" />} label={t('common.best')} value={best ?? '—'} />
            {over.isRecord ? (
              <span className="flex h-11 items-center gap-1.5 rounded-full bg-amber-100 px-3.5 text-sm font-bold text-amber-700 dark:bg-amber-500/20 dark:text-amber-300">
                <Trophy className="h-4 w-4" aria-hidden="true" /> {t('common.newRecord')}
              </span>
            ) : null}
          </div>
          <div className="mt-4 flex flex-wrap justify-center gap-2.5">
            <Button size="lg" className="rounded-full" onClick={() => start(mode)}>
              <RotateCcw className="h-4 w-4" aria-hidden="true" /> {t('common.playAgain')}
            </Button>
            <Button
              size="lg"
              variant="secondary"
              className="rounded-full"
              onClick={() => start(mode === 'classic' ? 'fast' : 'classic')}
            >
              <Play className="h-4 w-4" aria-hidden="true" />
              {mode === 'classic' ? L.fastMode : L.classicMode}
            </Button>
          </div>
        </div>
      ) : null}
    </div>
  )
}

function StatPill({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <span className="flex h-11 items-center gap-2 rounded-full bg-secondary/70 px-3.5 text-sm font-semibold">
      <span className="text-muted-foreground" aria-hidden="true">
        {icon}
      </span>
      <span className="text-muted-foreground">{label}</span>
      <span className="tabular-nums">{value}</span>
    </span>
  )
}
