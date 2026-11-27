import { useEffect } from 'react'
import confetti from 'canvas-confetti'
import { DIAS } from '../lib/contenido'

type Props = { abiertos: number[]; canjeados: Record<number, string>; alCerrar: () => void }

export default function Resumen({ abiertos, canjeados, alCerrar }: Props) {
  const planes = DIAS.filter((d) => d.tipo === 'plan' && abiertos.includes(d.dia)).length
  const vales = DIAS.filter((d) => d.tipo === 'vale' && abiertos.includes(d.dia)).length
  const usados = Object.keys(canjeados).length

  useEffect(() => {
    const estrella = confetti.shapeFromText({ text: '⭐', scalar: 2 })
    confetti({ particleCount: 50, spread: 120, origin: { y: 0.3 }, shapes: [estrella], scalar: 2, zIndex: 60 })
  }, [])

  return (
    <div className="pantalla resumen">
      <div className="pantalla-cabecera">
        <button className="volver" onClick={alCerrar}>
          ← Calendario
        </button>
        <h2>🌟 Nuestro diciembre</h2>
      </div>
      <div className="pantalla-cuerpo">
        <div className="mosaico">
          {DIAS.map((d, i) => (
            <div key={d.dia} className={`tesela ${abiertos.includes(d.dia) ? '' : 'cerrada'}`} style={{ animationDelay: `${i * 0.06}s` }}>
              <span>{abiertos.includes(d.dia) ? d.emoji : '?'}</span>
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
          <span className="firma">¡Feliz Navidad, Xisca! ❤️</span>
        </p>
      </div>
    </div>
  )
}
