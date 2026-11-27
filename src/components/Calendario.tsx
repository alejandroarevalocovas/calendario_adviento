import { useEffect, useState } from 'react'
import { CASILLAS, type Casilla } from '../data/layout'
import { diaPorNumero } from '../lib/contenido'
import { estaDesbloqueado } from '../lib/fecha'
import { Icono } from '../lib/iconos'
import { Gift, Ticket } from 'lucide-react'

type Props = {
  t: number
  hoy: number
  abiertos: number[]
  rascados: number[]
  abriendo: number | null
  alTocar: (dia: number) => void
  temblando: number | null
}

export default function Calendario({ t, hoy, abiertos, rascados, abriendo, alTocar, temblando }: Props) {
  return (
    <div className="calendario">
      {CASILLAS.map((c) => (
        <Puerta
          key={c.dia}
          c={c}
          abierta={abiertos.includes(c.dia)}
          sorpresa={c.tamano !== 'normal' && !rascados.includes(c.dia)}
          abriendo={abriendo === c.dia}
          desbloqueada={estaDesbloqueado(c.dia, t)}
          esHoy={hoy === c.dia}
          tiembla={temblando === c.dia}
          alTocar={() => alTocar(c.dia)}
        />
      ))}
    </div>
  )
}

type PuertaProps = {
  c: Casilla
  abierta: boolean
  sorpresa: boolean // día especial aún sin rascar: no se enseña el premio
  abriendo: boolean
  desbloqueada: boolean
  esHoy: boolean
  tiembla: boolean
  alTocar: () => void
}

function Puerta({ c, abierta, sorpresa, abriendo, desbloqueada, esHoy, tiembla, alTocar }: PuertaProps) {
  // Cuando ya está abierta y terminó la animación, la puerta se esconde (como si se hubiera recortado)
  const [asentada, setAsentada] = useState(abierta)
  useEffect(() => {
    if (!abierta && !abriendo) setAsentada(false)
  }, [abierta, abriendo])
  const info = abierta || abriendo ? diaPorNumero(c.dia) : null
  const clases = [
    'casilla',
    c.tamano,
    `tono-${c.dia % 3}`,
    abierta || abriendo ? 'abierta' : '',
    asentada && abierta ? 'asentada' : '',
    esHoy && !abierta ? 'hoy' : '',
    desbloqueada && !abierta && !esHoy ? 'pendiente' : '',
    tiembla ? 'tiembla' : '',
  ].join(' ')

  return (
    <button
      className={clases}
      style={{ gridColumn: `${c.col} / span ${c.ancho}`, gridRow: `${c.fila} / span ${c.alto}` }}
      onClick={alTocar}
      aria-label={`Día ${c.dia}`}
    >
      <div className="interior">
        {info &&
          (sorpresa ? (
            <>
              <Gift className="interior-icono" />
              <span className="interior-titulo">¡Rasca para descubrirlo!</span>
              <span className="interior-num">{c.dia}</span>
            </>
          ) : (
            <>
              <Icono nombre={info.icono} className="interior-icono" />
              {c.tamano !== 'normal' && <span className="interior-titulo">{info.titulo}</span>}
              <span className="interior-num">{c.dia}</span>
              {info.tipo === 'vale' && <Ticket className="interior-vale" />}
            </>
          ))}
      </div>
      <div className="puerta" onTransitionEnd={() => (abierta || abriendo) && setAsentada(true)}>
        <div className="puerta-frente">
          {c.tamano === 'grande' || c.tamano === 'enorme' ? <span className="lazo" /> : null}
          {c.tamano === 'mediano' && <span className="estrellita">★</span>}
          <span className="numero">{c.dia}</span>
          {esHoy && !abierta && <span className="cinta-hoy">¡Hoy!</span>}
        </div>
        <div className="puerta-dorso" />
      </div>
    </button>
  )
}
