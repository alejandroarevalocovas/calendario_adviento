// Panel SOLO para probar en local (npm run dev). No se incluye en la versión publicada.
import { useState } from 'react'
import { ahora, desbloqueoDe, diaDeHoy, simularFecha } from '../lib/fecha'
import type { Estado } from '../lib/estado'

type Props = {
  actualizar: (cambio: (e: Estado) => Estado) => void
  verIntro: () => void
}

export default function PanelPruebas({ actualizar, verIntro }: Props) {
  const [abierto, setAbierto] = useState(false)
  const hoy = diaDeHoy(ahora())

  // Simula las 12:00 de ese día de diciembre (0 = 30 de noviembre, 26 = después de Navidad)
  const irA = (dia: number) => simularFecha(desbloqueoDe(dia) + 13 * 3600_000)

  const btn: React.CSSProperties = {
    border: 0,
    borderRadius: 8,
    padding: '6px 10px',
    background: '#333',
    color: '#fff',
    fontSize: 13,
  }

  if (!abierto)
    return (
      <button
        onClick={() => setAbierto(true)}
        style={{ ...btn, position: 'fixed', left: 10, bottom: 10, zIndex: 90, opacity: 0.85 }}
      >
        🛠 Pruebas
      </button>
    )

  return (
    <div
      style={{
        position: 'fixed',
        left: 10,
        right: 10,
        bottom: 10,
        zIndex: 90,
        maxWidth: 460,
        margin: '0 auto',
        background: 'rgba(20,20,20,0.94)',
        color: '#fff',
        borderRadius: 14,
        padding: 12,
        fontFamily: 'system-ui',
        fontSize: 13,
        boxShadow: '0 8px 30px rgba(0,0,0,.4)',
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <b>🛠 Panel de pruebas (solo en tu PC)</b>
        <button style={btn} onClick={() => setAbierto(false)}>
          ✕
        </button>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
        <button style={btn} onClick={() => irA(Math.max(0, hoy - 1))}>
          ◀
        </button>
        <div style={{ flex: 1, textAlign: 'center', fontSize: 16 }}>
          {hoy === 0 ? 'Antes del 1 de diciembre' : hoy > 25 ? 'Después de Navidad' : `Hoy es ${hoy} de diciembre`}
        </div>
        <button style={btn} onClick={() => irA(Math.min(26, hoy + 1))}>
          ▶
        </button>
      </div>
      <input
        type="range"
        min={0}
        max={26}
        value={Math.min(hoy, 26)}
        onChange={(e) => irA(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 10 }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        <button
          style={btn}
          onClick={() => {
            actualizar((e) => ({ ...e, abiertos: [], rascados: [], canjeados: {}, resumenVisto: false }))
            irA(1)
          }}
        >
          🔄 Empezar de cero (día 1)
        </button>
        <button style={btn} onClick={() => actualizar((e) => ({ ...e, abiertos: [], rascados: [], canjeados: {} }))}>
          🚪 Cerrar todas las puertas
        </button>
        <button style={btn} onClick={verIntro}>
          🎄 Ver intro
        </button>
      </div>
    </div>
  )
}
