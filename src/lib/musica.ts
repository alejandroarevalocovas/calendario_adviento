import { MELODIAS, type Melodia } from './melodias'

// Caja de música generada con Web Audio: no hay archivos de audio que descargar.
// Melodía + bajo + arpegio suave, con reverberación de sala (sin eco que repita notas).

const SEMITONOS: Record<string, number> = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 }

const midiDe = (nombre: string, octava: number) => {
  const m = nombre.match(/^([A-G])(#|b)?/)!
  return SEMITONOS[m[1]] + (m[2] === '#' ? 1 : m[2] === 'b' ? -1 : 0) + (octava + 1) * 12
}
const hz = (midi: number) => 440 * Math.pow(2, (midi - 69) / 12)

function notaAMidi(nota: string): number {
  const m = nota.match(/^([A-G](?:#|b)?)(\d)$/)!
  return midiDe(m[1], Number(m[2]))
}

/** "Am" → raíz + intervalos del acorde */
function acorde(nombre: string) {
  const m = nombre.match(/^([A-G](?:#|b)?)(m?)(7?)$/)!
  const tercera = m[2] ? 3 : 4
  return { raiz: m[1], intervalos: m[3] ? [0, tercera, 7, 10] : [0, tercera, 7] }
}

type Evento = { t: number; midi: number; dur: number; vol: number; tipo: 'mel' | 'bajo' | 'arp' }

/** Convierte una canción en una lista de notas con su momento (en pulsos) */
function eventosDe(mel: Melodia): { eventos: Evento[]; total: number } {
  const ev: Evento[] = []
  let t = 0
  for (const [nota, dur] of mel.notas) {
    if (nota !== 'R') ev.push({ t, midi: notaAMidi(nota), dur, vol: 1, tipo: 'mel' })
    t += dur
  }
  const total = t
  t = 0
  for (const [nombre, dur] of mel.acordes) {
    if (nombre !== 'R') {
      const { raiz, intervalos } = acorde(nombre)
      const base = midiDe(raiz, 3)
      for (let b = 0; b < dur; b++) {
        if (b === 0) {
          ev.push({ t, midi: base, dur, vol: 0.55, tipo: 'bajo' })
        } else {
          // Arpegio suave: quinta, tercera, octava...
          const orden = [intervalos[2], intervalos[1], 12, intervalos[intervalos.length - 1] === 10 ? 10 : 7]
          ev.push({ t: t + b, midi: base + 12 + orden[(b - 1) % orden.length], dur: 1, vol: 0.2, tipo: 'arp' })
        }
      }
    }
    t += dur
  }
  ev.sort((a, b) => a.t - b.t)
  return { eventos: ev, total }
}

class CajaDeMusica {
  private ctx: AudioContext | null = null
  private salida: GainNode | null = null
  private temporizador: number | null = null
  private eventos: Evento[] = []
  private indice = 0
  private inicio = 0 // segundo del contexto en que empezó la canción
  private pulso = 0.4
  private total = 0
  private cancion = 0
  sonando = false
  alCambiar?: (cancion: number) => void

  private iniciarContexto() {
    if (this.ctx) return
    // En iPhone: que suene aunque el interruptor de silencio esté puesto (Safari 17+)
    const nav = navigator as Navigator & { audioSession?: { type: string } }
    if (nav.audioSession) nav.audioSession.type = 'playback'
    const ctx = new AudioContext()
    this.ctx = ctx

    // Limitador final para que nunca sature
    const limitador = ctx.createDynamicsCompressor()
    limitador.threshold.value = -10
    limitador.ratio.value = 6
    limitador.connect(ctx.destination)

    const volumen = ctx.createGain()
    volumen.gain.value = 0.32
    volumen.connect(limitador)

    // Reverberación de sala: respuesta al impulso generada (ruido que se apaga poco a poco)
    const rev = ctx.createConvolver()
    const largo = Math.floor(ctx.sampleRate * 1.8)
    const ir = ctx.createBuffer(2, largo, ctx.sampleRate)
    for (let c = 0; c < 2; c++) {
      const d = ir.getChannelData(c)
      for (let i = 0; i < largo; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / largo, 3.2)
    }
    rev.buffer = ir
    const humedo = ctx.createGain()
    humedo.gain.value = 0.22
    rev.connect(humedo).connect(volumen)

    this.salida = ctx.createGain()
    this.salida.connect(volumen)
    this.salida.connect(rev)
  }

  /** Una nota con timbre de caja de música / celesta */
  private sonar(midi: number, t: number, durSeg: number, vol: number, tipo: Evento['tipo']) {
    const ctx = this.ctx!
    const f = hz(midi)
    // Las notas largas duran más; las cortas se apagan rápido para no emborronar
    const caida = tipo === 'bajo' ? Math.min(durSeg + 0.4, 2.2) : Math.min(Math.max(durSeg * 1.3, 0.45), 2)
    const env = ctx.createGain()
    env.gain.setValueAtTime(0.0001, t)
    env.gain.linearRampToValueAtTime(vol * 0.5, t + 0.006)
    env.gain.setTargetAtTime(0, t + 0.02, caida / 4)
    env.connect(this.salida!)
    const parciales: [number, number][] =
      tipo === 'bajo' ? [[1, 1], [2, 0.25]] : [[1, 1], [2, 0.22], [3, 0.06]]
    for (const [mult, v] of parciales) {
      const o = ctx.createOscillator()
      const g = ctx.createGain()
      o.type = tipo === 'bajo' ? 'triangle' : 'sine'
      o.frequency.value = f * mult
      g.gain.value = v
      o.connect(g).connect(env)
      o.start(t)
      o.stop(t + caida + 0.1)
    }
  }

  private cargar(cancion: number, inicio: number) {
    const mel = MELODIAS[cancion]
    const { eventos, total } = eventosDe(mel)
    this.cancion = cancion
    this.eventos = eventos
    this.total = total
    this.indice = 0
    this.pulso = 60 / mel.tempo
    this.inicio = inicio
  }

  private programar = () => {
    const ctx = this.ctx!
    const limite = ctx.currentTime + 0.35
    while (true) {
      if (this.indice >= this.eventos.length) {
        // Siguiente canción tras una pequeña pausa
        const fin = this.inicio + this.total * this.pulso
        if (fin > limite) return
        this.cargar((this.cancion + 1) % MELODIAS.length, fin + 1.2)
        this.alCambiar?.(this.cancion)
        continue
      }
      const e = this.eventos[this.indice]
      const t = this.inicio + e.t * this.pulso
      if (t > limite) return
      if (t >= ctx.currentTime - 0.05) this.sonar(e.midi, t, e.dur * this.pulso, e.vol, e.tipo)
      this.indice++
    }
  }

  /** Debe llamarse desde un toque del usuario (requisito de iOS) */
  tocar(cancion: number) {
    this.iniciarContexto()
    this.parar()
    this.ctx!.resume()
    this.cargar(cancion, this.ctx!.currentTime + 0.15)
    this.sonando = true
    this.programar()
    this.temporizador = window.setInterval(this.programar, 60)
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
    ;['E6', 'G6', 'C7'].forEach((n, i) => this.sonar(notaAMidi(n), t + i * 0.07, 0.3, 0.6, 'mel'))
  }
}

export const musica = new CajaDeMusica()
export { MELODIAS }
