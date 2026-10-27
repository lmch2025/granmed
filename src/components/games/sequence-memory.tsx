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
import { Button } from '@/components/ui/button'
import { Confetti } from '@/components/shared/confetti'
import { RoundEndActions, VictoryBurst } from '@/components/game/round-end'

export const gameId = 'sequence-memory'

/* ================= Contenu SEO bilingue ================= */
export const content: GameSEOContent = {
  tagline: {
    fr: "Mémorisez et reproduisez des séquences de couleurs et de sons de plus en plus longues : chaque manche révèle votre QI estimé, façon Simon classique.",
    en: "Memorize and repeat ever-longer color and sound sequences: every round reveals your estimated IQ, classic Simon style.",
  },
  description: {
    fr: [
      "Gran' Mémoire est un jeu de séquences lumineuses inspiré du Simon classique : quatre pastilles colorées s'allument tour à tour avec leur note musicale, et vous devez reproduire la séquence exacte dans le même ordre. Chaque tour réussi ajoute une couleur, la séquence s'allonge et votre mémoire de travail est mise à l'épreuve.",
      "Deux modes sont proposés : le mode Classique, à vitesse constante, et le mode Rapide, qui accélère légèrement tous les cinq niveaux. Votre score correspond à la longueur de séquence reproduite, avec des records séparés par mode, des succès à débloquer (séquences de 10 et de 20) et de l'XP gagnée à chaque niveau réussi. En fin de partie, un QI estimé — calculé à partir de la longueur de séquence atteinte et du mode joué — vous attribue un niveau d'intelligence, du Novice au Génie, à élever en rejouant.",
      "Cet entraînement cérébral se joue en quelques minutes, sans inscription, sur mobile comme sur ordinateur. Les quatre tons distincts (do, mi, sol, do aigu) permettent à l'oreille de soutenir la mémoire visuelle : écoutez autant que vous regardez.",
    ],
    en: [
      "Gran's Memory is a light-sequence game inspired by the classic Simon: four colored pads light up one after another with their own musical tone, and you must repeat the exact sequence in the same order. Every successful round adds one more color, the sequence grows longer and your working memory is put to the test.",
      "Two modes are available: Classic, at a constant speed, and Fast, which speeds up slightly every five levels. Your score is the sequence length you reproduced, with separate personal bests per mode, achievements to unlock (sequences of 10 and 20) and XP earned on every completed level. At the end of a run, an estimated IQ — computed from the sequence length you reached and the mode you played — assigns you an intelligence level, from Novice to Genius, to raise as you replay.",
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
      'QI estimé et niveau d’intelligence après chaque partie',
      '4 grandes pastilles aux dégradés rose, ambre, émeraude et violet',
      'Tons musicaux distincts (do, mi, sol, do aigu) générés en direct',
      'Mode Classique et mode Rapide accéléré (jusqu’à 150 ms par couleur)',
      'Records personnels séparés pour chaque mode',
      'Succès « Séquence 10 » et « Séquence 20 » à débloquer',
      'Rejouer instantanément, sans rechargement',
    ],
    en: [
      'Estimated IQ and intelligence level after every round',
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
      { q: 'Comment est calculé mon QI estimé ?', a: 'Votre QI estimé s’appuie sur la précision (la longueur de séquence que vous avez réussi à reproduire entièrement) et la difficulté du mode (Classique ou Rapide) ; la rapidité n’entre pas en compte dans ce jeu. Le résultat est ramené sur l’échelle classique du QI (moyenne 100, écart-type 15). C’est une estimation ludique de votre performance à ce jeu de mémoire de travail — pas un test de QI clinique — et le meilleur moyen de l’élever reste de rejouer pour allonger vos séquences.' },
      { q: 'Quelle est la différence entre les modes Classique et Rapide ?', a: 'En Classique, chaque couleur reste allumée 400 ms du début à la fin. En Rapide, on démarre à 300 ms et la vitesse augmente de 10 ms tous les cinq niveaux, jusqu’à un minimum de 150 ms.' },
      { q: 'Ce jeu améliore-t-il vraiment la mémoire ?', a: "Il fait travailler la mémoire de travail auditive et visuelle, comme tout exercice régulier de ce type. Il mesure surtout votre entraînement à ce jeu, sans prétendre évaluer vos capacités cognitives globales." },
      { q: 'Puis-je jouer sur mon téléphone ?', a: 'Oui, le plateau 2×2 est conçu pour l’écran tactile et occupe toute la largeur en portrait comme en paysage.' },
    ],
    en: [
      { q: "Is Gran's Memory really free?", a: 'Yes: both modes, records and achievements are free to play, with no sign-up and no download.' },
      { q: 'How is the score calculated?', a: 'The score is the sequence length you fully reproduced. If you fail at level 7, your score is 6.' },
      { q: 'How is my estimated IQ calculated?', a: 'Your estimated IQ rests on accuracy (the sequence length you fully reproduced) and the mode’s difficulty (Classic or Fast); speed does not come into play in this game. The result maps onto the classic IQ scale (mean 100, standard deviation 15). It is a playful estimate of your performance at this working-memory game — not a clinical IQ test — and the best way to raise it is to keep playing to lengthen your sequences.' },
      { q: 'What is the difference between Classic and Fast modes?', a: 'In Classic, every color stays lit for 400 ms from start to finish. In Fast, you start at 300 ms and the speed increases by 10 ms every five levels, down to a minimum of 150 ms.' },
      { q: 'Does this game really improve memory?', a: 'It exercises auditory and visual working memory, like any regular practice of this kind. It mostly measures your training at this game, not your overall cognitive abilities.' },
      { q: 'Can I play on my phone?', a: 'Yes, the 2×2 board is designed for touch and fills the width in portrait or landscape.' },
    ],
  },
  records: {
    'best-iq': { fr: 'Meilleur QI estimé', en: 'Best estimated IQ' },
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
        <div className="relative grid aspect-square grid-cols-2 grid-rows-2 gap-2.5 sm:gap-3" role="group" aria-label={L.board}>
          {PADS.map((pad, i) => {
            const active = lit === i || tapFlash === i
            const isShake = shakeIdx === i
            return (
              <button
                key={i}
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
