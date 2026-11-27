import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react'
import './intro.css'

type Props = { modo: 'completa' | 'corta'; alTerminar: () => void }

// ---------- Geometría del árbol (coordenadas locales, eje en x = 100) ----------
type Piso = { arriba: number; abajo: number; ancho: number; ondas: number }
const PISOS: Piso[] = [
  { arriba: 130, abajo: 215, ancho: 80, ondas: 5 }, // el de abajo primero (se dibuja debajo)
  { arriba: 90, abajo: 170, ancho: 64, ondas: 4 },
  { arriba: 55, abajo: 125, ancho: 48, ondas: 3 },
  { arriba: 22, abajo: 85, ancho: 32, ondas: 3 },
]

function caminoPiso({ arriba, abajo, ancho, ondas }: Piso) {
  const w = (2 * ancho) / ondas
  let d = `M100 ${arriba} L${100 + ancho} ${abajo}`
  for (let i = 0; i < ondas; i++) {
    const x = 100 + ancho - w * (i + 1)
    d += ` Q${x + w / 2} ${abajo + 9} ${x} ${abajo}`
  }
  return d + ' Z'
}
function bordePiso({ abajo, ancho, ondas }: Piso) {
  const w = (2 * ancho) / ondas
  let d = `M${100 + ancho} ${abajo}`
  for (let i = 0; i < ondas; i++) {
    const x = 100 + ancho - w * (i + 1)
    d += ` Q${x + w / 2} ${abajo + 9} ${x} ${abajo}`
  }
  return d
}

// Guirnalda: curva que cuelga dentro del piso, alternando de lado para que parezca enrollada
function guirnalda(p: Piso, i: number) {
  const h = p.abajo - p.arriba
  const izq = i % 2 === 0
  const a = { x: 100 + (izq ? -1 : 1) * (p.ancho * 0.5 - 5), y: p.arriba + 0.5 * h }
  const b = { x: 100 + (izq ? 1 : -1) * (p.ancho * 0.9 - 6), y: p.abajo - 0.1 * h }
  const c = { x: 100, y: p.abajo - 0.06 * h }
  const punto = (t: number) => ({
    x: (1 - t) ** 2 * a.x + 2 * (1 - t) * t * c.x + t * t * b.x,
    y: (1 - t) ** 2 * a.y + 2 * (1 - t) * t * c.y + t * t * b.y,
  })
  return { d: `M${a.x} ${a.y} Q${c.x} ${c.y} ${b.x} ${b.y}`, punto }
}

const COLORES = ['#ff5a5a', '#ffd84d', '#5ad7ff', '#8cff6b', '#ff8ae0', '#ffae4d']
const ADORNOS = [
  { x: 88, y: 68, c: '#e2384d', r: 5 },
  { x: 116, y: 100, c: '#ffd84d', r: 5.5 },
  { x: 80, y: 146, c: '#d9e4f2', r: 6 },
  { x: 124, y: 152, c: '#e2384d', r: 6 },
  { x: 96, y: 192, c: '#ffd84d', r: 6.5 },
  { x: 66, y: 202, c: '#e2384d', r: 6 },
  { x: 136, y: 198, c: '#d9e4f2', r: 6 },
]

export default function Intro({ modo, alTerminar }: Props) {
  const [saliendo, setSaliendo] = useState(false)
  const [puedeTocar, setPuedeTocar] = useState(false)
  const terminado = useRef(false)
  const k = modo === 'completa' ? 1 : 0.28 // la versión corta va mucho más rápida
  const d = (s: number) => ({ animationDelay: `${(s * k).toFixed(2)}s` }) as CSSProperties

  const guirnaldas = useMemo(() => {
    // De arriba abajo para que se vayan encendiendo en orden
    const orden = [...PISOS].reverse()
    let n = 0
    return orden.map((p, i) => {
      const g = guirnalda(p, i)
      const cuantas = 3 + i
      const luces = Array.from({ length: cuantas }, (_, j) => {
        const pt = g.punto(0.1 + (0.8 * j) / (cuantas - 1))
        return { ...pt, c: COLORES[n % COLORES.length], n: n++ }
      })
      return { d: g.d, luces, i }
    })
  }, [])

  const copos = useMemo(
    () =>
      Array.from({ length: 40 }, (_, i) => ({
        left: `${(i * 37) % 100}%`,
        size: 2 + ((i * 7) % 4),
        dur: 7 + ((i * 13) % 7),
        delay: -((i * 3.7) % 12),
        op: 0.5 + ((i * 11) % 5) / 10,
      })),
    [],
  )

  const salir = () => {
    if (terminado.current) return
    terminado.current = true
    setSaliendo(true)
    setTimeout(alTerminar, 1000)
  }

  useEffect(() => {
    const a = setTimeout(() => setPuedeTocar(true), 7000 * k)
    const b = setTimeout(salir, modo === 'completa' ? 9500 : 3000)
    return () => {
      clearTimeout(a)
      clearTimeout(b)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo])

  return (
    <div className={`intro ${saliendo ? 'saliendo' : ''}`} style={{ '--k': k } as CSSProperties} onClick={salir}>
      {/* Nieve cayendo */}
      <div className="intro-nieve" aria-hidden>
        {copos.map((c, i) => (
          <i
            key={i}
            style={{ left: c.left, width: c.size, height: c.size, opacity: c.op, animationDuration: `${c.dur}s`, animationDelay: `${c.delay}s` }}
          />
        ))}
      </div>

      <svg className="intro-escena" viewBox="0 0 300 520" preserveAspectRatio="xMidYMax slice" aria-hidden>
        <defs>
          <radialGradient id="i-luna">
            <stop offset="0" stopColor="#fffbe8" />
            <stop offset="1" stopColor="#f3e6b8" />
          </radialGradient>
          <radialGradient id="i-halo-luna">
            <stop offset="0" stopColor="#fff6d0" stopOpacity="0.35" />
            <stop offset="1" stopColor="#fff6d0" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="i-hoja" x1="0" x2="1">
            <stop offset="0" stopColor="#46c473" />
            <stop offset="0.5" stopColor="#24864a" />
            <stop offset="1" stopColor="#13562e" />
          </linearGradient>
          <linearGradient id="i-nieve-atras" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#b9cbe6" />
            <stop offset="1" stopColor="#8fa6cc" />
          </linearGradient>
          <linearGradient id="i-nieve" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#ffffff" />
            <stop offset="1" stopColor="#d5e2f5" />
          </linearGradient>
          <radialGradient id="i-brillo">
            <stop offset="0" stopColor="#fff8d6" stopOpacity="1" />
            <stop offset="0.4" stopColor="#ffd84d" stopOpacity="0.6" />
            <stop offset="1" stopColor="#ffd84d" stopOpacity="0" />
          </radialGradient>
          <linearGradient id="i-estela" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="#fff6c2" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fff6c2" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Luna */}
        <g className="i-luna" style={d(0.1)}>
          <circle cx="238" cy="170" r="60" fill="url(#i-halo-luna)" />
          <circle cx="238" cy="170" r="24" fill="url(#i-luna)" />
          <circle cx="230" cy="164" r="4" fill="#e9dcae" opacity="0.6" />
          <circle cx="245" cy="178" r="3" fill="#e9dcae" opacity="0.5" />
        </g>

        {/* Colinas de fondo con pinos lejanos */}
        <g className="i-colinas" style={d(0)}>
          <path d="M-40 455 Q60 410 150 440 Q240 405 340 450 L340 520 L-40 520 Z" fill="url(#i-nieve-atras)" />
          {[
            [28, 430],
            [44, 424],
            [258, 425],
            [274, 431],
            [242, 432],
          ].map(([x, y], i) => (
            <path key={i} d={`M${x} ${y - 22} L${x + 9} ${y} L${x - 9} ${y} Z`} fill="#2c4a6e" opacity="0.8" />
          ))}
        </g>

        {/* Árbol */}
        <g transform="translate(50 255)">
          <rect className="i-tronco" style={d(0.35)} x="91" y="210" width="18" height="24" rx="3" fill="#6b3f1f" />
          {PISOS.map((p, i) => (
            <g key={i} className="i-piso" style={d(0.5 + i * 0.22)}>
              <path d={caminoPiso(p)} fill="url(#i-hoja)" />
              <path
                d={bordePiso(p)}
                fill="none"
                stroke="#f4f9ff"
                strokeWidth="3.2"
                strokeLinecap="round"
                strokeDasharray="14 5 22 7 9 6"
              />
            </g>
          ))}

          {/* Guirnaldas y luces (siempre sobre la guirnalda, dentro del árbol) */}
          {guirnaldas.map((g) => (
            <g key={g.i}>
              <path
                className="i-cable"
                style={{ ...d(1.7 + g.i * 0.25), animationDuration: `${0.6 * k}s` }}
                d={g.d}
                pathLength={1}
                fill="none"
                stroke="#ffe9b0"
                strokeOpacity="0.75"
                strokeWidth="1.1"
              />
              {g.luces.map((l) => (
                <g key={l.n} className="i-luz" style={{ color: l.c, ...d(2.0 + l.n * 0.065) }}>
                  <circle cx={l.x} cy={l.y} r="6" fill="currentColor" className="i-halo" style={d(3 + (l.n % 5) * 0.3)} />
                  <circle cx={l.x} cy={l.y} r="2.6" fill="currentColor" />
                  <circle cx={l.x - 0.8} cy={l.y - 0.8} r="0.9" fill="#fff" opacity="0.9" />
                </g>
              ))}
            </g>
          ))}

          {/* Bolas */}
          {ADORNOS.map((a, i) => (
            <g key={i} className="i-bola" style={d(2.3 + i * 0.1)}>
              <circle cx={a.x} cy={a.y} r={a.r} fill={a.c} />
              <circle cx={a.x - a.r * 0.35} cy={a.y - a.r * 0.35} r={a.r * 0.32} fill="#fff" opacity="0.7" />
            </g>
          ))}

          {/* Estrella fugaz que se posa en la punta */}
          <g transform="translate(100 18)">
            <g className="i-estrella" style={d(3.3)}>
              <path className="i-estela" style={d(3.3)} d="M4 -3 L95 -70 L98 -64 Z" fill="url(#i-estela)" />
              <circle className="i-estrella-brillo" style={d(4.2)} r="26" fill="url(#i-brillo)" />
              <path
                d="M0 -14 L4.1 -4.6 L14 -4.3 L6.4 2.2 L8.7 12 L0 6.6 L-8.7 12 L-6.4 2.2 L-14 -4.3 L-4.1 -4.6 Z"
                fill="#ffd84d"
                stroke="#fff6c2"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
            </g>
            <g className="i-rayos" style={d(4.2)}>
              {Array.from({ length: 8 }, (_, i) => (
                <line key={i} x1="0" y1="-18" x2="0" y2="-40" stroke="#fff3b0" strokeWidth="2" strokeLinecap="round" transform={`rotate(${i * 45})`} />
              ))}
            </g>
            <circle className="i-onda" style={d(4.2)} r="10" fill="none" stroke="#fff3b0" strokeWidth="2" />
          </g>
        </g>

        {/* Nieve del suelo, delante */}
        <path d="M-40 520 L-40 498 Q150 458 340 498 L340 520 Z" fill="url(#i-nieve)" className="i-suelo" style={d(0)} />

        {/* Regalos bajo el árbol */}
        <g className="i-regalo" style={d(4.4)}>
          <rect x="94" y="466" width="34" height="26" rx="2" fill="#d8344a" />
          <rect x="91" y="460" width="40" height="9" rx="2" fill="#e8475c" />
          <rect x="108" y="460" width="6" height="32" fill="#ffd84d" />
          <path d="M111 460 q-10 -12 -14 -3 q4 6 14 3 q10 -12 14 -3 q-4 6 -14 3" fill="#ffd84d" />
        </g>
        <g className="i-regalo" style={d(4.55)}>
          <rect x="176" y="472" width="30" height="21" rx="2" fill="#2f8f57" />
          <rect x="173" y="467" width="36" height="8" rx="2" fill="#3cab6a" />
          <rect x="188" y="467" width="6" height="26" fill="#f4f4f4" />
          <path d="M191 467 q-8 -10 -12 -2 q3 5 12 2 q8 -10 12 -2 q-3 5 -12 2" fill="#f4f4f4" />
        </g>
        <g className="i-regalo" style={d(4.7)}>
          <rect x="132" y="480" width="22" height="16" rx="2" fill="#4a78d6" />
          <rect x="130" y="476" width="26" height="6" rx="1.5" fill="#6a93e6" />
          <rect x="141" y="476" width="4" height="20" fill="#ffd84d" />
        </g>
      </svg>

      <div className="intro-texto">
        <div className="feliz" style={{ ...d(4.8), animationDuration: `${1.6 * k}s` }}>
          Feliz Navidad
        </div>
        <div className="nombre" style={d(6.0)}>
          Xisca
          {[
            ['-8%', '10%'],
            ['104%', '18%'],
            ['92%', '78%'],
            ['2%', '70%'],
          ].map(([x, y], i) => (
            <span key={i} className="chispa" style={{ left: x, top: y, ...d(6.4 + i * 0.25) }}>
              ✦
            </span>
          ))}
        </div>
      </div>

      <div className={`intro-toca ${puedeTocar ? 'visible' : ''}`}>Toca para entrar</div>
      <div className="intro-destello" />
    </div>
  )
}
