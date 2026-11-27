import { useState } from 'react'
import { DIAS } from '../lib/contenido'
import { Icono } from '../lib/iconos'
import { ChevronLeft, Ticket } from 'lucide-react'

type Props = {
  abiertos: number[]
  canjeados: Record<number, string>
  alCanjear: (dia: number) => void
  alDeshacer: (dia: number) => void
  alCerrar: () => void
}

export default function Vales({ abiertos, canjeados, alCanjear, alDeshacer, alCerrar }: Props) {
  const [confirmando, setConfirmando] = useState<number | null>(null)
  const vales = DIAS.filter((d) => d.tipo === 'vale')
  const descubiertos = vales.filter((d) => abiertos.includes(d.dia))
  const ocultos = vales.length - descubiertos.length
  const pendientes = descubiertos.filter((d) => !canjeados[d.dia])
  const usados = descubiertos.filter((d) => canjeados[d.dia])

  const TicketVale = ({ d }: { d: (typeof vales)[number] }) => {
    const usado = canjeados[d.dia]
    return (
      <div className={`ticket ${usado ? 'usado' : ''}`}>
        <div className="ticket-izq">
          <Icono nombre={d.icono} size={34} className="ticket-icono" />
          <span className="ticket-dia">Día {d.dia}</span>
        </div>
        <div className="ticket-der">
          <div className="ticket-titulo">{d.titulo}</div>
          <div className="ticket-texto">{d.texto}</div>
          {usado ? (
            <div className="ticket-acciones">
              <span className="sello">CANJEADO · {new Date(usado).toLocaleDateString('es-ES')}</span>
              <button className="enlace pequeno" onClick={() => alDeshacer(d.dia)}>
                deshacer
              </button>
            </div>
          ) : confirmando === d.dia ? (
            <div className="ticket-acciones">
              <span>¿Lo canjeas ya?</span>
              <button
                className="boton"
                onClick={() => {
                  alCanjear(d.dia)
                  setConfirmando(null)
                }}
              >
                Sí
              </button>
              <button className="boton secundario" onClick={() => setConfirmando(null)}>
                No
              </button>
            </div>
          ) : (
            <div className="ticket-acciones">
              <button className="boton" onClick={() => setConfirmando(d.dia)}>
                Canjear
              </button>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="pantalla">
      <div className="pantalla-cabecera">
        <button className="volver" onClick={alCerrar}>
          <ChevronLeft size={18} /> Calendario
        </button>
        <h2>
          <Ticket size={26} /> Mis vales
        </h2>
      </div>
      <div className="pantalla-cuerpo">
        {descubiertos.length === 0 && <p className="vacio">Aún no tienes vales. ¡Abre los días del calendario para conseguirlos!</p>}
        {pendientes.map((d) => (
          <TicketVale key={d.dia} d={d} />
        ))}
        {usados.length > 0 && <h3 className="subtitulo">Ya canjeados</h3>}
        {usados.map((d) => (
          <TicketVale key={d.dia} d={d} />
        ))}
        {ocultos > 0 && (
          <p className="ocultos">
            Quedan {ocultos} {ocultos === 1 ? 'vale' : 'vales'} por descubrir…
          </p>
        )}
      </div>
    </div>
  )
}
