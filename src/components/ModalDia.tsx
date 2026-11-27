import { useCallback, useEffect } from 'react'
import confetti from 'canvas-confetti'
import { diaPorNumero } from '../lib/contenido'
import { esEspecial } from '../data/layout'
import Rasca from './Rasca'

type Props = {
  dia: number
  recienAbierto: boolean
  rascado: boolean
  canjeado?: string
  alRascar: () => void
  alCerrar: () => void
  alVerVales: () => void
}

export function lanzarConfeti(dia: number) {
  const info = diaPorNumero(dia)
  if (info.aniversario) {
    const corazon = confetti.shapeFromText({ text: '❤️', scalar: 2 })
    confetti({ particleCount: 60, spread: 100, origin: { y: 0.6 }, shapes: [corazon], scalar: 2, zIndex: 60 })
    return
  }
  if (dia === 25 || dia === 24) {
    const fin = Date.now() + 1800
    const tanda = () => {
      confetti({ particleCount: 6, angle: 60, spread: 60, origin: { x: 0 }, zIndex: 60 })
      confetti({ particleCount: 6, angle: 120, spread: 60, origin: { x: 1 }, zIndex: 60 })
      if (Date.now() < fin) requestAnimationFrame(tanda)
    }
    tanda()
    return
  }
  confetti({
    particleCount: esEspecial(dia) ? 140 : 70,
    spread: 80,
    origin: { y: 0.55 },
    colors: ['#ffd84d', '#ff4d4d', '#ffffff', '#4dd27a'],
    zIndex: 60,
  })
}

export default function ModalDia({ dia, recienAbierto, rascado, canjeado, alRascar, alCerrar, alVerVales }: Props) {
  const info = diaPorNumero(dia)
  const especial = esEspecial(dia)
  const conRasca = especial && !rascado

  useEffect(() => {
    if (recienAbierto && !conRasca) lanzarConfeti(dia)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const terminarRasca = useCallback(() => {
    lanzarConfeti(dia)
    alRascar()
  }, [dia, alRascar])

  return (
    <div className="fondo-modal" onClick={alCerrar}>
      <div className={`modal-dia ${especial ? 'especial' : ''} ${info.aniversario ? 'aniversario' : ''}`} onClick={(e) => e.stopPropagation()}>
        <button className="cerrar" onClick={alCerrar} aria-label="Cerrar">
          ✕
        </button>
        <div className="modal-fecha">{dia} de diciembre</div>

        <div className="premio">
          <div className="premio-emoji">{info.emoji}</div>
          <h2 className="premio-titulo">{info.titulo}</h2>
          <p className="premio-texto">{info.texto}</p>
          {info.pista && <p className="premio-pista">{info.pista}</p>}
          {conRasca && <Rasca alTerminar={terminarRasca} />}
        </div>

        {!conRasca &&
          (info.tipo === 'vale' ? (
            <div className={`etiqueta vale ${canjeado ? 'usado' : ''}`}>
              {canjeado ? (
                <>✅ Vale canjeado el {new Date(canjeado).toLocaleDateString('es-ES')}</>
              ) : (
                <>
                  🎟️ Guardado en <b>Mis vales</b>
                  <button className="enlace" onClick={alVerVales}>
                    Ver mis vales →
                  </button>
                </>
              )}
            </div>
          ) : (
            <div className="etiqueta plan">💝 Plan para hacer juntos</div>
          ))}
      </div>
    </div>
  )
}
