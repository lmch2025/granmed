'use client'

import { useEffect, useRef } from 'react'
import { useReducedMotion } from '@/lib/utils-game'

/** Explosion de confettis canvas — déclenchée en incrémentant `fire`. */
export function Confetti({ fire, count = 90 }: { fire: number; count?: number }) {
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
    const colors = ['#e2725b', '#f2a65a', '#f7c873', '#8fbf7f', '#d98cb3', '#9b8cf2', '#f4f1ea']
    const W = canvas.width
    const H = canvas.height
    const cx = W / 2
    const parts = Array.from({ length: count }, () => {
      const ang = Math.random() * Math.PI * 2
      const spd = (4 + Math.random() * 9) * dpr
      return {
        x: cx + (Math.random() - 0.5) * 60 * dpr,
        y: H * 0.55,
        vx: Math.cos(ang) * spd,
        vy: Math.sin(ang) * spd - 5 * dpr,
        w: (4 + Math.random() * 5) * dpr,
        h: (3 + Math.random() * 6) * dpr,
        rot: Math.random() * Math.PI,
        vr: (Math.random() - 0.5) * 0.3,
        color: colors[Math.floor(Math.random() * colors.length)],
        life: 1,
      }
    })
    let raf = 0
    const step = () => {
      if (!running.current) running.current = true
      ctx.clearRect(0, 0, W, H)
      let alive = false
      for (const p of parts) {
        p.vy += 0.22 * dpr
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr
        p.life -= 0.008
        if (p.life > 0 && p.y < H + 30) {
          alive = true
          ctx.save()
          ctx.globalAlpha = Math.max(0, p.life)
          ctx.translate(p.x, p.y)
          ctx.rotate(p.rot)
          ctx.fillStyle = p.color
          ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h)
          ctx.restore()
        }
      }
      if (alive) raf = requestAnimationFrame(step)
      else running.current = false
    }
    cancelAnimationFrame(raf)
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [fire, count, reduce])

  if (reduce) return null
  return (
    <canvas
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 z-30 h-full w-full"
    />
  )
}
