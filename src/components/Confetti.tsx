import { useEffect, useRef } from 'react'

const COLORS = ['#2477D4', '#36B37E', '#EAF4FF', '#16324F', '#F87171', '#FFC857']

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  rotation: number
  spin: number
  color: string
  shape: 'rect' | 'circle'
}

export function Confetti({ duration = 4500 }: { duration?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    const resize = () => {
      canvas.width = window.innerWidth * dpr
      canvas.height = window.innerHeight * dpr
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    resize()
    window.addEventListener('resize', resize)

    const w = window.innerWidth
    const particles: Particle[] = Array.from({ length: Math.min(180, Math.round(w / 6)) }, () => ({
      x: Math.random() * w,
      y: -20 - Math.random() * window.innerHeight * 0.6,
      vx: (Math.random() - 0.5) * 3,
      vy: 2 + Math.random() * 3.5,
      size: 6 + Math.random() * 8,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.25,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: Math.random() > 0.7 ? 'circle' : 'rect',
    }))

    const start = performance.now()
    let frame = 0
    const draw = (t: number) => {
      const elapsed = t - start
      context.clearRect(0, 0, window.innerWidth, window.innerHeight)
      const fade = elapsed > duration - 800 ? Math.max(0, (duration - elapsed) / 800) : 1
      context.globalAlpha = fade
      for (const p of particles) {
        p.x += p.vx + Math.sin((t + p.y) / 400) * 0.6
        p.y += p.vy
        p.rotation += p.spin
        context.save()
        context.translate(p.x, p.y)
        context.rotate(p.rotation)
        context.fillStyle = p.color
        if (p.shape === 'circle') {
          context.beginPath()
          context.arc(0, 0, p.size / 2.5, 0, Math.PI * 2)
          context.fill()
        } else {
          context.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2)
        }
        context.restore()
      }
      if (elapsed < duration) frame = requestAnimationFrame(draw)
      else context.clearRect(0, 0, window.innerWidth, window.innerHeight)
    }
    frame = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
    }
  }, [duration])

  return <canvas ref={canvasRef} className="pointer-events-none fixed inset-0 z-50 size-full" aria-hidden="true" />
}
