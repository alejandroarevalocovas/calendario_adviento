import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { DIAS } from '../lib/contenido'
import { Icono, RUTA_ESTRELLA } from '../lib/iconos'
import { ChevronLeft, Heart, Star } from 'lucide-react'

type Props = { abiertos: number[]; canjeados: Record<number, string>; alCerrar: () => void }

export default function Resumen({ abiertos, canjeados, alCerrar }: Props) {
  const planes = DIAS.filter((d) => d.tipo === 'plan' && abiertos.includes(d.dia)).length
  const vales = DIAS.filter((d) => d.tipo === 'vale' && abiertos.includes(d.dia)).length
  const usados = Object.keys(canjeados).length

  useEffect(() => {
    const estrella = confetti.shapeFromPath({ path: RUTA_ESTRELLA })
    confetti({ particleCount: 60, spread: 120, origin: { y: 0.3 }, shapes: [estrella], colors: ['#ffd84d', '#ffe9a8', '#f2c14e'], scalar: 1.6, zIndex: 60 })
  }, [])

  return (
    <div className="pantalla resumen">
      <div className="pantalla-cabecera">
        <button className="volver" onClick={alCerrar}>
          <ChevronLeft size={18} /> Calendario
        </button>
        <h2>
          <Star size={26} /> Nuestro diciembre
        </h2>
      </div>
      <div className="pantalla-cuerpo">
        <div className="mosaico">
          {DIAS.map((d, i) => (
            <div key={d.dia} className={`tesela ${abiertos.includes(d.dia) ? '' : 'cerrada'}`} style={{ animationDelay: `${i * 0.06}s` }}>
              {abiertos.includes(d.dia) ? <Icono nombre={d.icono} size={26} /> : <span>?</span>}
              <small>{d.dia}</small>
            </div>
          ))}
        </div>
        <div className="cifras">
          <div>
            <b>{abiertos.length}</b>
            <span>días abiertos</span>
          </div>
          <div>
            <b>{planes}</b>
            <span>planes juntos</span>
          </div>
          <div>
            <b>
              {usados}/{vales}
            </b>
            <span>vales canjeados</span>
          </div>
        </div>
        <p className="mensaje-final">
          25 días, 25 detalles… y solo unos pocos de todos los motivos por los que te quiero.
          <br />
          <span className="firma">¡Feliz Navidad, Xisca!</span>
          <Heart className="corazon-final" size={34} fill="currentColor" />
        </p>
      </div>
    </div>
  )
}
