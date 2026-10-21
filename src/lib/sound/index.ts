'use client'

/**
 * Gestionnaire audio commun.
 * - Fichiers MP3 libres de droits (voir public/sounds/LICENSE.md) chargés à la demande.
 * - Déverrouillage automatique à la première interaction (politique d'autoplay).
 * - Sons de synthèse (séquences Simon) via Web Audio API.
 * - Volume + coupure générale persistés dans le profil.
 */

export type SoundName =
  | 'click'
  | 'flip'
  | 'pop'
  | 'correct'
  | 'wrong'
  | 'pair'
  | 'merge'
  | 'sweep'
  | 'drop'
  | 'reveal'
  | 'coin'
  | 'splash'
  | 'slice'
  | 'tick'
  | 'levelup'
  | 'win'
  | 'lose'
  | 'achievement'
  | 'swish'

const SOUND_FILES: Record<SoundName, string> = {
  click: '/sounds/click.mp3',
  flip: '/sounds/flip.mp3',
  pop: '/sounds/pop.mp3',
  correct: '/sounds/correct.mp3',
  wrong: '/sounds/wrong.mp3',
  pair: '/sounds/pair.mp3',
  merge: '/sounds/merge.mp3',
  sweep: '/sounds/sweep.mp3',
  drop: '/sounds/drop.mp3',
  reveal: '/sounds/reveal.mp3',
  coin: '/sounds/coin.mp3',
  splash: '/sounds/splash.mp3',
  slice: '/sounds/slice.mp3',
  tick: '/sounds/tick.mp3',
  levelup: '/sounds/levelup.mp3',
  win: '/sounds/win.mp3',
  lose: '/sounds/lose.mp3',
  achievement: '/sounds/achievement.mp3',
  swish: '/sounds/swish.mp3',
}

class SoundManager {
  private cache = new Map<SoundName, HTMLAudioElement>()
  private ctx: AudioContext | null = null
  private _enabled = true
  private _volume = 0.7
  private unlocked = false
  private listeners = new Set<() => void>()

  constructor() {
    if (typeof window === 'undefined') return
    const unlock = () => {
      this.unlocked = true
      try {
        this.ctx = this.ctx ?? new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
        if (this.ctx.state === 'suspended') void this.ctx.resume()
      } catch {}
      window.removeEventListener('pointerdown', unlock)
      window.removeEventListener('keydown', unlock)
      window.removeEventListener('touchstart', unlock)
    }
    window.addEventListener('pointerdown', unlock, { passive: true })
    window.addEventListener('keydown', unlock, { passive: true })
    window.addEventListener('touchstart', unlock, { passive: true })
  }

  setEnabled(v: boolean) {
    this._enabled = v
    this.emit()
  }

  setVolume(v: number) {
    this._volume = Math.max(0, Math.min(1, v))
    this.emit()
  }

  get enabled() {
    return this._enabled
  }

  get volume() {
    return this._volume
  }

  private emit() {
    for (const l of this.listeners) l()
  }

  subscribe(fn: () => void): () => void {
    this.listeners.add(fn)
    return () => this.listeners.delete(fn)
  }

  private el(name: SoundName): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null
    let a = this.cache.get(name)
    if (!a) {
      a = new Audio(SOUND_FILES[name])
      a.preload = 'auto'
      this.cache.set(name, a)
    }
    return a
  }

  /** Joue un effet sonore. Ignoré si le son est coupé ou pas encore déverrouillé. */
  play(name: SoundName, opts?: { volume?: number }) {
    if (!this._enabled || !this.unlocked) return
    const a = this.el(name)
    if (!a) return
    try {
      a.currentTime = 0
      a.volume = Math.max(0, Math.min(1, (opts?.volume ?? 1) * this._volume))
      void a.play().catch(() => {})
    } catch {}
  }

  /** Ton de synthèse (pads Simon) — fréquence en Hz, durée en secondes. */
  tone(freq: number, duration = 0.35, type: OscillatorType = 'sine', gain = 0.22) {
    if (!this._enabled || !this.unlocked || !this.ctx) return
    try {
      const t = this.ctx.currentTime
      const osc = this.ctx.createOscillator()
      const g = this.ctx.createGain()
      osc.type = type
      osc.frequency.value = freq
      g.gain.setValueAtTime(0.0001, t)
      g.gain.exponentialRampToValueAtTime(gain * this._volume, t + 0.02)
      g.gain.exponentialRampToValueAtTime(0.0001, t + duration)
      osc.connect(g)
      g.connect(this.ctx.destination)
      osc.start(t)
      osc.stop(t + duration + 0.05)
    } catch {}
  }
}

export const sfx = new SoundManager()
