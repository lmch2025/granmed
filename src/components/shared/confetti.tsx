'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/utils-game'

/** Explosion de confettis canvas — déclencher en incrémentant `fire`.
 *  `waves` : nombre de salves (2-3 pour une victoire, décalées de ~300 ms).
 *  `gold` : palette dorée de victoire. */
export function Confetti({ fire, count = 90, waves = 1, gold = false }: { fire: number; count?: number; waves?: number; gold?: boolean }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const reduce = useReducedMotion()
  const running = useRef(false)

  useEffect(() => {
    if (!fire || reduce) return
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = canvas.offsetWidth * dpr
      canvas.height = canvas.offsetHeight * dpr
    }
    resize()
    const colors = gold
      ? ['#f2a65a', '#f7c873', '#ffd700', '#e2725b', '#fff3d6', '#d98cb3', '#ffffff']
      : ['#e2725b', '#f2a65a', '#f7c873', '#8fbf7f', '#d98cb3', '#9b8cf2', '#f4f1ea']
    const parts: {
      x: number; y: number; vx: number; vy: number; w: number; h: number
      rot: number; vr: number; color: string; life: number; decay: number; star: boolean
    }[] = []

    const spawn = (n: number, originY: number) => {
      const W = canvas.width
      for (let i = 0; i < n; i++) {
        const ang = Math.random() * Math.PI * 2
        const spd = (4 + Math.random() * 9) * dpr
        parts.push({
          x: W / 2 + (Math.random() - 0.5) * 90 * dpr,
          y: originY,
          vx: Math.cos(ang) * spd,
          vy: Math.sin(ang) * spd - 5 * dpr,
          w: (4 + Math.random() * 5) * dpr,
          h: (3 + Math.random() * 6) * dpr,
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.3,
          color: colors[Math.floor(Math.random() * colors.length)],
          life: 1,
          decay: 0.008 + Math.random() * 0.004,
          star: gold && Math.random() < 0.3,
        })
      }
    }

    const H = canvas.height
    spawn(count, H * 0.55)
    let pendingWaves = Math.max(0, Math.min(3, waves) - 1)
    const timers: number[] = []
    for (let w = 1; w <= pendingWaves; w++) {
      timers.push(
        window.setTimeout(() => {
          resize()
          spawn(Math.round(count * (w === 1 ? 0.8 : 0.5)), (canvas.height * (w === 1 ? 0.35 : 0.6)) | 0)
          pendingWaves--
        }, w * 320),
      )
    }

    let raf = 0
    const step = () => {
      running.current = true
      const W = canvas.width
      const curH = canvas.height
      ctx.clearRect(0, 0, W, curH)
      let alive = false
      for (const p of parts) {
        if (p.life <= 0) continue
        p.vy += 0.22 * dpr
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        p.life -= p.decay
        if (p.life > 0 && p.y < curH + 30) {
          alive = true
          ctx.save()
          ctx.globalAlpha = Math.max(0, p.life)
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillStyle = p.color
          if (p.star) {
            ctx.beginPath()
            const r = p.w * 0.7
            for (let s = 0; s < 10; s++) {
              const rr = s % 2 === 0 ? r : r * 0.45
              const a = (s * Math.PI) / 5 - Math.PI / 2
              ctx.lineTo(Math.cos(a) * rr, Math.sin(a) * rr)
            }
            ctx.closePath()
            ctx.fill()
          } else {
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          }
          ctx.restore()
        }
      }
      if (alive || pendingWaves > 0) {
        raf = requestAnimationFrame(step)
      } else {
        running.current = false
      }
    }
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(step)
    return () => {
      cancelAnimationFrame(raf)
      for (const id of timers) window.clearTimeout(id)
      running.current = false
    }
  }, [fire, count, waves, gold, reduce])

  if (reduce) return null
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    />
  )
}
