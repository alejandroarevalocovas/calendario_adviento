import { useState } from 'react'
import type { Tema } from '../lib/estado'
import { MELODIAS } from '../lib/melodias'

export const TEMAS: { id: Tema; nombre: string; colores: string[] }[] = [
  { id: 'clasico', nombre: 'Clásico', colores: ['#8e1b2b', '#d9b48a', '#1f6b3a'] },
  { id: 'noche', nombre: 'Noche nevada', colores: ['#0b1430', '#243c75', '#c9d3ea'] },
  { id: 'nordico', nombre: 'Nórdico', colores: ['#f4efe6', '#e8d5b5', '#b3261e'] },
  { id: 'jengibre', nombre: 'Pan de jengibre', colores: ['#4a2c1a', '#b06a35', '#fff8f0'] },
  { id: 'rosa', nombre: 'Rosa romántico', colores: ['#f9d3de', '#fff4f7', '#c94b70'] },
  { id: 'cabana', nombre: 'Cabaña acogedora', colores: ['#2a1a12', '#a3352b', '#ffb347'] },
]

type Props = {
  tema: Tema
  musica: boolean
  cancion: number
  hayResumen: boolean
  codigo: string
  alTema: (t: Tema) => void
  alMusica: (on: boolean) => void
  alCancion: (i: number) => void
  alVerIntro: () => void
  alVerResumen: () => void
  alImportar: (c: string) => boolean
  alCerrar: () => void
}

export default function Ajustes(p: Props) {
  const [importar, setImportar] = useState('')
  const [aviso, setAviso] = useState('')

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(p.codigo)
      setAviso('Código copiado ✅ Guárdalo en Notas.')
    } catch {
      setAviso('No se pudo copiar. Mantén pulsado el código para copiarlo.')
    }
  }

  return (
    <div className="fondo-modal" onClick={p.alCerrar}>
      <div className="hoja" onClick={(e) => e.stopPropagation()}>
        <div className="asa" />
        <h2>Ajustes</h2>

        <h3>🎨 Tema</h3>
        <div className="temas">
          {TEMAS.map((t) => (
            <button key={t.id} className={`tema ${p.tema === t.id ? 'activo' : ''}`} onClick={() => p.alTema(t.id)}>
              <span className="muestra">
                {t.colores.map((c) => (
                  <i key={c} style={{ background: c }} />
                ))}
              </span>
              {t.nombre}
            </button>
          ))}
        </div>

        <h3>🎵 Música</h3>
        <label className="interruptor">
          <input type="checkbox" checked={p.musica} onChange={(e) => p.alMusica(e.target.checked)} />
          <span>Música de caja de música</span>
        </label>
        <div className="canciones">
          {MELODIAS.map((m, i) => (
            <button key={m.nombre} className={`cancion ${p.musica && p.cancion === i ? 'activa' : ''}`} onClick={() => p.alCancion(i)}>
              {p.musica && p.cancion === i ? '🔊' : '♪'} {m.nombre}
            </button>
          ))}
        </div>

        <h3>✨ Más</h3>
        <div className="mas">
          <button className="boton secundario" onClick={p.alVerIntro}>
            🎄 Ver la animación de inicio
          </button>
          {p.hayResumen && (
            <button className="boton secundario" onClick={p.alVerResumen}>
              🌟 Nuestro diciembre
            </button>
          )}
        </div>

        <details className="copia">
          <summary>💾 Copia de seguridad</summary>
          <p>Si alguna vez borras la app, con este código recuperas los días abiertos y los vales canjeados.</p>
          <code onClick={copiar}>{p.codigo}</code>
          <button className="boton secundario" onClick={copiar}>
            Copiar código
          </button>
          <textarea placeholder="Pega aquí un código para recuperar" value={importar} onChange={(e) => setImportar(e.target.value)} />
          <button
            className="boton secundario"
            onClick={() => setAviso(p.alImportar(importar) ? 'Datos recuperados ✅' : 'Ese código no es válido ❌')}
          >
            Recuperar
          </button>
          {aviso && <p className="aviso">{aviso}</p>}
        </details>
      </div>
    </div>
  )
}
