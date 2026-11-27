import { useCallback, useEffect, useRef, useState } from 'react'
import Intro from './components/Intro'
import Calendario from './components/Calendario'
import ModalDia from './components/ModalDia'
import Vales from './components/Vales'
import Ajustes from './components/Ajustes'
import Resumen from './components/Resumen'
import Particulas from './components/Particulas'
import { useEstado, exportarCodigo } from './lib/estado'
import { ahora, claveHoy, diaDeHoy, diasParaNavidad, estaDesbloqueado, sincronizarHora, textoCuentaAtras, useAhora } from './lib/fecha'
import { musica } from './lib/musica'
import { DIAS } from './lib/contenido'

const BROMAS = [
  '¡Ni lo intentes! 👀',
  'Papá Noel te está vigilando 🎅',
  'La paciencia también es un regalo 🎁',
  '¡Eh! Sin trampas 😏',
  'Los elfos dicen que todavía no 🧝',
  'Ese día aún no ha llegado ❄️',
  'Buen intento, Xisca 😘',
]

export default function App() {
  const { estado, actualizar, importarCodigo } = useEstado()
  const t = useAhora()
  const hoy = diaDeHoy(t)

  const [intro, setIntroEstado] = useState<{ modo: 'completa' | 'corta'; n: number } | null>(() => ({
    modo: estado.ultimaIntro === claveHoy() ? 'corta' : 'completa',
    n: 0,
  }))
  const introRef = useRef(intro)
  introRef.current = intro
  const setIntro = (modo: 'completa' | 'corta') => setIntroEstado((i) => ({ modo, n: (i?.n ?? 0) + 1 }))
  const [modal, setModal] = useState<{ dia: number; nuevo: boolean } | null>(null)
  const [abriendo, setAbriendo] = useState<number | null>(null)
  const [temblando, setTemblando] = useState<number | null>(null)
  const [aviso, setAviso] = useState<{ titulo: string; sub: string } | null>(null)
  const [pantalla, setPantalla] = useState<'calendario' | 'vales' | 'resumen'>('calendario')
  const [ajustes, setAjustes] = useState(false)
  const avisoTimer = useRef<number>(undefined)
  const estadoRef = useRef(estado)
  estadoRef.current = estado

  // Hora del servidor (evita trampas cambiando la hora del iPhone si hay internet)
  useEffect(() => {
    sincronizarHora()
  }, [])

  // Al volver a la app: si es un día nuevo, animación completa otra vez. La música se pausa en segundo plano.
  useEffect(() => {
    const vis = () => {
      if (document.hidden) {
        musica.pausar()
        return
      }
      musica.reanudar()
      sincronizarHora()
      if (estadoRef.current.ultimaIntro !== claveHoy()) {
        setModal(null)
        setAjustes(false)
        setIntro('completa')
      }
    }
    document.addEventListener('visibilitychange', vis)
    return () => document.removeEventListener('visibilitychange', vis)
  }, [])

  // iOS solo deja sonar audio tras un toque: si la música estaba activada, arranca con el primer toque
  useEffect(() => {
    musica.alCambiar = (i) => actualizar((e) => ({ ...e, cancion: i }))
    if (!estado.musica || musica.sonando) return
    const arrancar = () => {
      if (estadoRef.current.musica && !musica.sonando) musica.tocar(estadoRef.current.cancion)
    }
    window.addEventListener('pointerdown', arrancar, { once: true })
    return () => window.removeEventListener('pointerdown', arrancar)
  }, [estado.musica, actualizar])

  // Tema en <html> para que se aplique a todo
  useEffect(() => {
    document.documentElement.dataset.tema = estado.tema
  }, [estado.tema])

  const terminarIntro = useCallback(() => {
    if (introRef.current?.modo === 'completa') actualizar((e) => ({ ...e, ultimaIntro: claveHoy() }))
    setIntroEstado(null)
    // Después de Navidad, el resumen se enseña solo la primera vez
    if (diaDeHoy() >= 26 && !estadoRef.current.resumenVisto) {
      setPantalla('resumen')
      actualizar((e) => ({ ...e, resumenVisto: true }))
    }
  }, [actualizar])

  const mostrarAviso = (titulo: string, sub: string) => {
    clearTimeout(avisoTimer.current)
    setAviso({ titulo, sub })
    avisoTimer.current = window.setTimeout(() => setAviso(null), 2600)
  }

  const tocarDia = (dia: number) => {
    if (abriendo) return
    if (estado.abiertos.includes(dia)) {
      setModal({ dia, nuevo: false })
      return
    }
    if (!estaDesbloqueado(dia)) {
      setTemblando(dia)
      setTimeout(() => setTemblando(null), 600)
      navigator.vibrate?.(80)
      mostrarAviso(BROMAS[Math.floor(Math.random() * BROMAS.length)], textoCuentaAtras(dia))
      return
    }
    // Se abre la puerta y, al terminar, aparece el premio
    setAbriendo(dia)
    if (estado.musica) musica.tilin()
    setTimeout(() => {
      actualizar((e) => ({ ...e, abiertos: [...e.abiertos, dia] }))
      setAbriendo(null)
      setModal({ dia, nuevo: true })
    }, 950)
  }

  const cambiarMusica = (on: boolean) => {
    if (on) musica.tocar(estado.cancion)
    else musica.parar()
    actualizar((e) => ({ ...e, musica: on }))
  }

  const elegirCancion = (i: number) => {
    musica.tocar(i)
    actualizar((e) => ({ ...e, musica: true, cancion: i }))
  }

  const valesPendientes = DIAS.filter((d) => d.tipo === 'vale' && estado.abiertos.includes(d.dia) && !estado.canjeados[d.dia]).length
  const faltan = diasParaNavidad(t)
  const hayResumen = estado.abiertos.includes(25) || hoy >= 26

  return (
    <>
      <Particulas tema={estado.tema} />

      {pantalla === 'calendario' && (
        <main className="principal">
          <header className="cabecera">
            <div className="barra">
              <button className="icono" onClick={() => setPantalla('vales')} aria-label="Mis vales">
                🎟️{valesPendientes > 0 && <span className="globo">{valesPendientes}</span>}
              </button>
              <h1>
                <span className="t1">Adviento de</span>
                <span className="t2">Xisca</span>
              </h1>
              <div className="barra-der">
                <button className="icono" onClick={() => cambiarMusica(!estado.musica)} aria-label="Música">
                  {estado.musica ? '🔊' : '🔇'}
                </button>
                <button className="icono" onClick={() => setAjustes(true)} aria-label="Ajustes">
                  ⚙️
                </button>
              </div>
            </div>

            <div className="contador">
              {faltan > 1 && (
                <>
                  <span className="contador-num">{faltan}</span>
                  <span className="contador-txt">días para Navidad</span>
                </>
              )}
              {faltan === 1 && <span className="contador-txt grande">¡Mañana es Navidad! 🎄</span>}
              {faltan === 0 && <span className="contador-txt grande">¡Hoy es Navidad! 🎁</span>}
              {faltan < 0 && <span className="contador-txt grande">¡Feliz Navidad! ✨</span>}
            </div>
            {hayResumen && (
              <button className="boton-resumen" onClick={() => setPantalla('resumen')}>
                🌟 Ver nuestro diciembre
              </button>
            )}
          </header>

          <Calendario t={t} hoy={hoy} abiertos={estado.abiertos} abriendo={abriendo} alTocar={tocarDia} temblando={temblando} />

          <footer className="pie">Hecho con ❤️ para ti</footer>
        </main>
      )}

      {pantalla === 'vales' && (
        <Vales
          abiertos={estado.abiertos}
          canjeados={estado.canjeados}
          alCanjear={(d) => actualizar((e) => ({ ...e, canjeados: { ...e.canjeados, [d]: new Date(ahora()).toISOString() } }))}
          alDeshacer={(d) =>
            actualizar((e) => {
              const c = { ...e.canjeados }
              delete c[d]
              return { ...e, canjeados: c }
            })
          }
          alCerrar={() => setPantalla('calendario')}
        />
      )}

      {pantalla === 'resumen' && (
        <Resumen abiertos={estado.abiertos} canjeados={estado.canjeados} alCerrar={() => setPantalla('calendario')} />
      )}

      {modal && (
        <ModalDia
          dia={modal.dia}
          recienAbierto={modal.nuevo}
          rascado={estado.rascados.includes(modal.dia)}
          canjeado={estado.canjeados[modal.dia]}
          alRascar={() => actualizar((e) => ({ ...e, rascados: [...new Set([...e.rascados, modal.dia])] }))}
          alCerrar={() => setModal(null)}
          alVerVales={() => {
            setModal(null)
            setPantalla('vales')
          }}
        />
      )}

      {ajustes && (
        <Ajustes
          tema={estado.tema}
          musica={estado.musica}
          cancion={estado.cancion}
          hayResumen={hayResumen}
          codigo={exportarCodigo(estado)}
          alTema={(tema) => actualizar((e) => ({ ...e, tema }))}
          alMusica={cambiarMusica}
          alCancion={elegirCancion}
          alVerIntro={() => {
            setAjustes(false)
            setIntro('completa')
          }}
          alVerResumen={() => {
            setAjustes(false)
            setPantalla('resumen')
          }}
          alImportar={importarCodigo}
          alCerrar={() => setAjustes(false)}
        />
      )}

      {aviso && (
        <div className="aviso-flotante" key={aviso.titulo + aviso.sub}>
          <b>{aviso.titulo}</b>
          <span>{aviso.sub}</span>
        </div>
      )}

      {intro && <Intro key={intro.n} modo={intro.modo} alTerminar={terminarIntro} />}
    </>
  )
}
