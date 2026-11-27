import { useEffect, useMemo, useRef, useState } from 'react'
import './intro.css'

type Props = { modo: 'completa' | 'corta'; alTerminar: () => void }

const COLORES = ['#ff4d4d', '#ffd84d', '#4dd2ff', '#7dff6b', '#ff7ad9', '#ffa24d']

// Mitad del ancho del árbol a una altura dada (tres pisos)
function semiancho(y: number) {
  if (y < 80) return ((y - 20) / 60) * 40
  if (y < 135) return 22 + ((y - 80) / 55) * 38
  return 36 + ((y - 135) / 60) * 44
}

export default function Intro({ modo, alTerminar }: Props) {
  const [saliendo, setSaliendo] = useState(false)
  const [puedeTocar, setPuedeTocar] = useState(false)
  const terminado = useRef(false)

  const luces = useMemo(() => {
    const l: { x: number; y: number; c: string; d: number }[] = []
    let i = 0
    for (let y = 48; y <= 188; y += 13) {
      const hw = semiancho(y) * 0.82
      const n = Math.max(2, Math.round(hw / 14))
      for (let k = 0; k < n; k++) {
        const fx = n === 1 ? 0 : (k / (n - 1)) * 2 - 1
        const x = 100 + fx * hw + ((i * 37) % 7) - 3
        l.push({ x, y: y + ((k % 2) * 5 - 2), c: COLORES[i % COLORES.length], d: i })
        i++
      }
    }
    return l
  }, [])

  const salir = () => {
    if (terminado.current) return
    terminado.current = true
    setSaliendo(true)
    setTimeout(alTerminar, 900)
  }

  useEffect(() => {
    const total = modo === 'completa' ? 7600 : 2400
    const a = setTimeout(() => setPuedeTocar(true), modo === 'completa' ? 5200 : 800)
    const b = setTimeout(salir, total)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo])

  const retrasoLuz = (i: number) => (modo === 'completa' ? 1.6 + i * 0.07 : 0.1 + i * 0.015)
  const retrasoEstrella = modo === 'completa' ? 1.6 + luces.length * 0.07 + 0.2 : 0.4

  return (
    <div className={`intro ${modo} ${saliendo ? 'saliendo' : ''}`} onClick={salir}>
      <div className="intro-estrellas" />
      <svg className="intro-arbol" viewBox="0 0 200 240" aria-hidden>
        <defs>
          <linearGradient id="verde" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#2f9e57" />
            <stop offset="1" stopColor="#14532d" />
          </linearGradient>
          <radialGradient id="brillo">
            <stop offset="0" stopColor="#fff6c2" stopOpacity="0.9" />
            <stop offset="1" stopColor="#ffd84d" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect className="tronco" x="88" y="195" width="24" height="26" rx="3" fill="#6b3f1f" />
        <path
          className="silueta"
          d="M100 20 L140 80 L122 80 L160 135 L136 135 L180 195 L20 195 L64 135 L40 135 L78 80 L60 80 Z"
          fill="url(#verde)"
          stroke="#7be39b"
          strokeWidth="2"
          strokeLinejoin="round"
          pathLength={1}
        />
        {luces.map((l) => (
          <g key={l.d} className="luz" style={{ animationDelay: `${retrasoLuz(l.d)}s`, color: l.c }}>
            <circle cx={l.x} cy={l.y} r="7" fill="currentColor" opacity="0.35" className="halo" />
            <circle cx={l.x} cy={l.y} r="3" fill="currentColor" />
          </g>
        ))}
        <g className="estrella" style={{ animationDelay: `${retrasoEstrella}s` }}>
          <circle cx="100" cy="18" r="30" fill="url(#brillo)" className="estrella-brillo" />
          <path
            d="M100 2 L104.7 12.6 L116 13.6 L107.4 21 L110 32 L100 26.2 L90 32 L92.6 21 L84 13.6 L95.3 12.6 Z"
            fill="#ffd84d"
            stroke="#fff3b0"
            strokeWidth="1"
          />
        </g>
      </svg>

      <div className="intro-texto" style={{ animationDelay: `${retrasoEstrella + 0.4}s` }}>
        <div className="feliz">Feliz Navidad</div>
        <div className="nombre">Xisca</div>
      </div>

      <div className={`intro-toca ${puedeTocar ? 'visible' : ''}`}>Toca para entrar</div>
    </div>
  )
}
