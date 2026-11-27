import { useEffect, useRef } from 'react'

type Props = { alTerminar: () => void }

/** Capa de "rasca y gana" que se borra con el dedo */
export default function Rasca({ alTerminar }: Props) {
  const ref = useRef<HTMLCanvasElement>(null)
  const hecho = useRef(false)

  useEffect(() => {
    const cv = ref.current!
    const ctx = cv.getContext('2d')!
    // offsetWidth no se ve afectado por la animación de escala del modal
    const r = { width: cv.offsetWidth, height: cv.offsetHeight }
    const dpr = Math.min(devicePixelRatio || 1, 2)
    cv.width = r.width * dpr
    cv.height = r.height * dpr
    ctx.scale(dpr, dpr)

    // Capa plateada con brillo
    const g = ctx.createLinearGradient(0, 0, r.width, r.height)
    g.addColorStop(0, '#d9d9d9')
    g.addColorStop(0.3, '#f5f5f5')
    g.addColorStop(0.5, '#b8b8b8')
    g.addColorStop(0.7, '#efefef')
    g.addColorStop(1, '#c4c4c4')
    ctx.fillStyle = g
    ctx.fillRect(0, 0, r.width, r.height)
    ctx.fillStyle = 'rgba(0,0,0,0.06)'
    for (let i = 0; i < 300; i++) ctx.fillRect(Math.random() * r.width, Math.random() * r.height, 2, 2)
    ctx.fillStyle = '#7a7a7a'
    ctx.font = '600 22px Fredoka, sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'middle'
    ctx.fillText('Rasca aquí', r.width / 2, r.height / 2 - 10)
    ctx.font = '400 14px Fredoka, sans-serif'
    ctx.fillText('Desliza el dedo para descubrirlo', r.width / 2, r.height / 2 + 18)

    ctx.globalCompositeOperation = 'destination-out'
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.lineWidth = 42

    let ultimo: { x: number; y: number } | null = null
    let trazos = 0

    const punto = (e: PointerEvent) => {
      const b = cv.getBoundingClientRect()
      const k = cv.offsetWidth / b.width
      return { x: (e.clientX - b.left) * k, y: (e.clientY - b.top) * k }
    }
    const comprobar = () => {
      const datos = ctx.getImageData(0, 0, cv.width, cv.height).data
      let vacios = 0
      let total = 0
      for (let i = 3; i < datos.length; i += 4 * 40) {
        total++
        if (datos[i] === 0) vacios++
      }
      if (vacios / total > 0.5 && !hecho.current) {
        hecho.current = true
        cv.classList.add('rascado')
        setTimeout(alTerminar, 500)
      }
    }
    const abajo = (e: PointerEvent) => {
      cv.setPointerCapture(e.pointerId)
      ultimo = punto(e)
      ctx.beginPath()
      ctx.arc(ultimo.x, ultimo.y, 21, 0, Math.PI * 2)
      ctx.fill()
    }
    const mover = (e: PointerEvent) => {
      if (!ultimo) return
      const p = punto(e)
      ctx.beginPath()
      ctx.moveTo(ultimo.x, ultimo.y)
      ctx.lineTo(p.x, p.y)
      ctx.stroke()
      ultimo = p
      if (++trazos % 8 === 0) comprobar()
    }
    const arriba = () => {
      ultimo = null
      comprobar()
    }
    cv.addEventListener('pointerdown', abajo)
    cv.addEventListener('pointermove', mover)
    cv.addEventListener('pointerup', arriba)
    cv.addEventListener('pointercancel', arriba)
    return () => {
      cv.removeEventListener('pointerdown', abajo)
      cv.removeEventListener('pointermove', mover)
      cv.removeEventListener('pointerup', arriba)
      cv.removeEventListener('pointercancel', arriba)
    }
  }, [alTerminar])

  return <canvas ref={ref} className="rasca" />
}
