import { MELODIAS } from './melodias'

// Caja de música generada con Web Audio: no hay archivos de audio que descargar.

const SEMITONOS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

function frecuencia(nota: string): number {
  const m = nota.match(/^([A-G])(#|b)?(\d)$/)!
  let n = SEMITONOS[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0)
  n += (Number(m[3]) + 1) * 12 // MIDI
  return 440 * Math.pow(2, (n - 69) / 12)
}

class CajaDeMusica {
  private ctx: AudioContext | null = null
  private salida: GainNode | null = null
  private temporizador: number | null = null
  private indice = 0
  private siguiente = 0
  private cancion = 0
  sonando = false

  private iniciarContexto() {
    if (this.ctx) return
    // En iPhone: que suene aunque el interruptor de silencio esté puesto (Safari 17+)
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    if (nav.audioSession) nav.audioSession.type = 'playback'
    this.ctx = new AudioContext()
    this.salida = this.ctx.createGain()
    this.salida.gain.value = 0.22
    // Eco suave para que suene a cajita
    const eco = this.ctx.createDelay()
    eco.delayTime.value = 0.23
    const realimentacion = this.ctx.createGain()
    realimentacion.gain.value = 0.28
    const filtro = this.ctx.createBiquadFilter()
    filtro.frequency.value = 2600
    this.salida.connect(this.ctx.destination)
    this.salida.connect(eco)
    eco.connect(filtro)
    filtro.connect(realimentacion)
    realimentacion.connect(eco)
    filtro.connect(this.ctx.destination)
  }

  private campanita(f: number, t: number, dur: number) {
    const ctx = this.ctx!
    const parciales: [number, number][] = [[1, 1], [2, 0.35], [3, 0.12], [4.2, 0.06]]
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.exponentialRampToValueAtTime(1, t + 0.008)
    env.gain.exponentialRampToValueAtTime(0.0001, t + Math.max(dur * 1.6, 0.9))
    env.connect(this.salida!)
    for (const [mult, vol] of parciales) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = 'sine'
      o.frequency.value = f * mult
      g.gain.value = vol
      o.connect(g).connect(env)
      o.start(t)
      o.stop(t + Math.max(dur * 1.6, 0.9) + 0.05)
    }
  }

  private programar = () => {
    const ctx = this.ctx!
    const mel = MELODIAS[this.cancion]
    const pulso = 60 / mel.tempo
    while (this.siguiente < ctx.currentTime + 0.4) {
      const [nota, dur] = mel.notas[this.indice]
      if (nota !== 'R') this.campanita(frecuencia(nota), this.siguiente, dur * pulso)
      this.siguiente += dur * pulso
      this.indice++
      if (this.indice >= mel.notas.length) {
        // Al terminar, pasa a la siguiente canción de la lista
        this.indice = 0
        this.cancion = (this.cancion + 1) % MELODIAS.length
        this.alCambiar?.(this.cancion)
        this.siguiente += 1
        break
      }
    }
  }

  alCambiar?: (cancion: number) => void

  /** Debe llamarse desde un toque del usuario (requisito de iOS) */
  tocar(cancion: number) {
    this.iniciarContexto()
    this.parar()
    this.ctx!.resume()
    this.cancion = cancion
    this.indice = 0
    this.siguiente = this.ctx!.currentTime + 0.1
    this.sonando = true
    this.temporizador = window.setInterval(this.programar, 100)
  }

  parar() {
    if (this.temporizador) clearInterval(this.temporizador)
    this.temporizador = null
    this.sonando = false
  }

  /** Al irse la app a segundo plano */
  pausar() {
    this.ctx?.suspend()
  }

  reanudar() {
    if (this.sonando) this.ctx?.resume()
  }

  /** Pequeño "tilín" al abrir una puerta */
  tilin() {
    if (!this.ctx) return
    const t = this.ctx.currentTime
    ;['E6', 'G6', 'C7'].forEach((n, i) => this.campanita(frecuencia(n), t + i * 0.07, 0.3))
  }
}

export const musica = new CajaDeMusica()
export { MELODIAS }
