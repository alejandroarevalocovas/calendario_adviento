import { useEffect, useRef } from 'react'
import type { Tema } from '../lib/estado'

type Tipo = 'nieve' | 'corazones' | 'estrellas'

const POR_TEMA: Record<Tema, { tipo: Tipo; color: string }> = {
  clasico: { tipo: 'nieve', color: 'rgba(255,255,255,0.85)' },
  noche: { tipo: 'estrellas', color: 'rgba(220,232,255,0.9)' },
  nordico: { tipo: 'nieve', color: 'rgba(150,175,205,0.7)' },
  jengibre: { tipo: 'nieve', color: 'rgba(255,248,240,0.8)' },
  rosa: { tipo: 'corazones', color: 'rgba(214,80,120,0.45)' },
  cabana: { tipo: 'nieve', color: 'rgba(255,240,220,0.75)' },
}

export default function Particulas({ tema }: { tema: Tema }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    const { tipo, color } = POR_TEMA[tema]
    const dpr = Math.min(devicePixelRatio || 1, 2)
    let w = 0
    let h = 0
    const ajustar = () => {
      w = innerWidth
      h = innerHeight
      cv.width = w * dpr
      cv.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }
    ajustar()
    addEventListener('resize', ajustar)

    const n = tipo === 'corazones' ? 22 : 55
    const ps = Array.from({ length: n }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: tipo === 'corazones' ? 6 + Math.random() * 8 : 1 + Math.random() * 2.6,
      v: 0.25 + Math.random() * 0.7,
      fase: Math.random() * Math.PI * 2,
    }))

    const corazon = (x: number, y: number, s: number) => {
      ctx.beginPath()
      ctx.moveTo(x, y + s * 0.3)
      ctx.bezierCurveTo(x, y, x - s * 0.5, y, x - s * 0.5, y + s * 0.3)
      ctx.bezierCurveTo(x - s * 0.5, y + s * 0.6, x, y + s * 0.8, x, y + s)
      ctx.bezierCurveTo(x, y + s * 0.8, x + s * 0.5, y + s * 0.6, x + s * 0.5, y + s * 0.3)
      ctx.bezierCurveTo(x + s * 0.5, y, x, y, x, y + s * 0.3)
      ctx.fill()
    }

    let raf = 0
    let t = 0
    const pintar = () => {
      t += 1
      ctx.clearRect(0, 0, w, h)
      ctx.fillStyle = color
      for (const p of ps) {
        if (tipo === 'estrellas') {
          // Estrellas que titilan y caen muy despacio
          p.y += p.v * 0.15
          ctx.globalAlpha = 0.35 + 0.65 * Math.abs(Math.sin(p.fase + t * 0.02))
        } else {
          p.y += p.v
          p.x += Math.sin(p.fase + t * 0.01) * 0.4
        }
        if (p.y > h + 20) {
          p.y = -20
          p.x = Math.random() * w
        }
        if (tipo === 'corazones') corazon(p.x, p.y, p.r)
        else {
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.globalAlpha = 1
      }
      raf = requestAnimationFrame(pintar)
    }
    pintar()

    const vis = () => {
      cancelAnimationFrame(raf)
      if (!document.hidden) pintar()
    }
    document.addEventListener('visibilitychange', vis)
    return () => {
      cancelAnimationFrame(raf)
      removeEventListener('resize', ajustar)
      document.removeEventListener('visibilitychange', vis)
    }
  }, [tema])

  return <canvas ref={ref} className="particulas" aria-hidden />
}
