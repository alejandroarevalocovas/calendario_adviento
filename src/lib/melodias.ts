// Villancicos de dominio público, escritos como [nota, duración en pulsos].
// "R" es un silencio.
export type Nota = [string, number]
// Acompañamiento: [acorde, duración en pulsos]. Acordes: "C", "Am", "G7"... "R" = sin acorde
export type Acorde = [string, number]
export type Melodia = { nombre: string; tempo: number; compas: number; notas: Nota[]; acordes: Acorde[] }

const jingleBells: Nota[] = [
  ['E5', 1], ['E5', 1], ['E5', 2], ['E5', 1], ['E5', 1], ['E5', 2],
  ['E5', 1], ['G5', 1], ['C5', 1.5], ['D5', 0.5], ['E5', 4],
  ['F5', 1], ['F5', 1], ['F5', 1.5], ['F5', 0.5], ['F5', 1], ['E5', 1], ['E5', 1], ['E5', 0.5], ['E5', 0.5],
  ['E5', 1], ['D5', 1], ['D5', 1], ['E5', 1], ['D5', 2], ['G5', 2],
  ['E5', 1], ['E5', 1], ['E5', 2], ['E5', 1], ['E5', 1], ['E5', 2],
  ['E5', 1], ['G5', 1], ['C5', 1.5], ['D5', 0.5], ['E5', 4],
  ['F5', 1], ['F5', 1], ['F5', 1.5], ['F5', 0.5], ['F5', 1], ['E5', 1], ['E5', 1], ['E5', 0.5], ['E5', 0.5],
  ['G5', 1], ['G5', 1], ['F5', 1], ['D5', 1], ['C5', 4], ['R', 2],
]

const nochePaz: Nota[] = [
  ['G4', 1.5], ['A4', 0.5], ['G4', 1], ['E4', 3],
  ['G4', 1.5], ['A4', 0.5], ['G4', 1], ['E4', 3],
  ['D5', 2], ['D5', 1], ['B4', 3],
  ['C5', 2], ['C5', 1], ['G4', 3],
  ['A4', 2], ['A4', 1], ['C5', 1.5], ['B4', 0.5], ['A4', 1],
  ['G4', 1.5], ['A4', 0.5], ['G4', 1], ['E4', 3],
  ['A4', 2], ['A4', 1], ['C5', 1.5], ['B4', 0.5], ['A4', 1],
  ['G4', 1.5], ['A4', 0.5], ['G4', 1], ['E4', 3],
  ['D5', 2], ['D5', 1], ['F5', 1.5], ['D5', 0.5], ['B4', 1],
  ['C5', 3], ['E5', 3],
  ['C5', 1.5], ['G4', 0.5], ['E4', 1], ['G4', 1.5], ['F4', 0.5], ['D4', 1],
  ['C4', 6], ['R', 3],
]

const weWish: Nota[] = [
  ['D4', 1],
  ['G4', 1], ['G4', 0.5], ['A4', 0.5], ['G4', 0.5], ['F#4', 0.5],
  ['E4', 1], ['E4', 1], ['E4', 1],
  ['A4', 1], ['A4', 0.5], ['B4', 0.5], ['A4', 0.5], ['G4', 0.5],
  ['F#4', 1], ['D4', 1], ['D4', 1],
  ['B4', 1], ['B4', 0.5], ['C5', 0.5], ['B4', 0.5], ['A4', 0.5],
  ['G4', 1], ['E4', 1], ['D4', 0.5], ['D4', 0.5],
  ['E4', 1], ['A4', 1], ['F#4', 1],
  ['G4', 2], ['D4', 1],
  ['G4', 1], ['G4', 1], ['G4', 1],
  ['F#4', 2], ['F#4', 1],
  ['G4', 1], ['F#4', 1], ['E4', 1],
  ['D4', 2], ['A4', 1],
  ['B4', 1], ['A4', 1], ['G4', 1],
  ['D5', 1], ['D4', 1], ['D4', 0.5], ['D4', 0.5],
  ['E4', 1], ['A4', 1], ['F#4', 1],
  ['G4', 3], ['R', 3],
]

const deckHalls: Nota[] = [
  ['G4', 1.5], ['F4', 0.5], ['E4', 1], ['D4', 1],
  ['C4', 1], ['D4', 1], ['E4', 1], ['C4', 1],
  ['D4', 0.5], ['E4', 0.5], ['F4', 0.5], ['D4', 0.5], ['E4', 1.5], ['D4', 0.5],
  ['C4', 1], ['B3', 1], ['C4', 2],
  ['G4', 1.5], ['F4', 0.5], ['E4', 1], ['D4', 1],
  ['C4', 1], ['D4', 1], ['E4', 1], ['C4', 1],
  ['D4', 0.5], ['E4', 0.5], ['F4', 0.5], ['D4', 0.5], ['E4', 1.5], ['D4', 0.5],
  ['C4', 1], ['B3', 1], ['C4', 2],
  ['D4', 1.5], ['E4', 0.5], ['F4', 1], ['D4', 1],
  ['E4', 1.5], ['F4', 0.5], ['G4', 1], ['D4', 1],
  ['E4', 0.5], ['F#4', 0.5], ['G4', 1], ['A4', 0.5], ['B4', 0.5], ['C5', 1],
  ['B4', 1], ['A4', 1], ['G4', 2],
  ['G4', 1.5], ['F4', 0.5], ['E4', 1], ['D4', 1],
  ['C4', 1], ['D4', 1], ['E4', 1], ['C4', 1],
  ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['G4', 1.5], ['F4', 0.5],
  ['E4', 1], ['D4', 1], ['C4', 2], ['R', 2],
]

const ostinato: Nota[] = [['Bb4', 1], ['A4', 0.5], ['Bb4', 0.5], ['G4', 1]]
const alto: Nota[] = [['D5', 1], ['C5', 0.5], ['D5', 0.5], ['Bb4', 1]]
const rep = (n: Nota[], veces: number) => Array.from({ length: veces }, () => n).flat()
const carolBells: Nota[] = [
  ...rep(ostinato, 4),
  ...rep(alto, 4),
  ['G5', 0.5], ['G5', 0.5], ['G5', 0.5], ['F5', 0.5], ['Eb5', 0.5], ['D5', 0.5],
  ['C5', 0.5], ['C5', 0.5], ['C5', 0.5], ['D5', 0.5], ['C5', 0.5], ['Bb4', 0.5],
  ['A4', 0.5], ['A4', 0.5], ['A4', 0.5], ['Bb4', 0.5], ['A4', 0.5], ['G4', 0.5],
  ['F#4', 1], ['G4', 0.5], ['A4', 0.5], ['D4', 1],
  ...rep(ostinato, 4),
  ['G4', 3], ['R', 3],
]

const x = (a: Acorde[], veces: number) => Array.from({ length: veces }, () => a).flat()

const acJingle: Acorde[] = [
  ['C', 4], ['C', 4], ['C', 4], ['C', 4], ['F', 4], ['C', 4], ['D7', 4], ['G7', 4],
  ['C', 4], ['C', 4], ['C', 4], ['C', 4], ['F', 4], ['C', 4], ['G7', 4], ['C', 4], ['R', 2],
]
const acNoche: Acorde[] = [
  ['C', 6], ['C', 6], ['G7', 6], ['C', 6], ['F', 6], ['C', 6], ['F', 6], ['C', 6],
  ['G7', 6], ['C', 6], ['C', 3], ['G7', 3], ['C', 6], ['R', 3],
]
const acWish: Acorde[] = [
  ['R', 1],
  ['G', 3], ['C', 3], ['A7', 3], ['D', 3], ['B7', 3], ['Em', 3], ['C', 1], ['D7', 2], ['G', 3],
  ['G', 3], ['D', 3], ['A7', 3], ['D', 3], ['G', 3], ['Em', 3], ['C', 1], ['D7', 2], ['G', 3], ['R', 3],
]
const acDeck: Acorde[] = [
  ...x([['C', 4], ['C', 2], ['F', 1], ['C', 1], ['G7', 2], ['C', 2], ['C', 1], ['G7', 1], ['C', 2]], 2),
  ['Dm', 2], ['G', 2], ['C', 2], ['G', 2], ['G', 2], ['D', 2], ['D7', 2], ['G', 2],
  ['C', 4], ['F', 2], ['C', 2], ['F', 2], ['C', 2], ['G7', 2], ['C', 2], ['R', 2],
]
const bajada: Acorde[] = [['Gm', 3], ['F', 3], ['Eb', 3], ['D', 3]]
const acCarol: Acorde[] = [...x(bajada, 2), ['Gm', 3], ['Cm', 3], ['D', 3], ['D', 3], ...bajada, ['Gm', 3], ['R', 3]]

export const MELODIAS: Melodia[] = [
  { nombre: 'Jingle Bells', tempo: 168, compas: 4, notas: jingleBells, acordes: acJingle },
  { nombre: 'Noche de Paz', tempo: 150, compas: 6, notas: nochePaz, acordes: acNoche },
  { nombre: 'We Wish You a Merry Christmas', tempo: 150, compas: 3, notas: weWish, acordes: acWish },
  { nombre: 'Deck the Halls', tempo: 140, compas: 4, notas: deckHalls, acordes: acDeck },
  { nombre: 'Carol of the Bells', tempo: 170, compas: 3, notas: carolBells, acordes: acCarol },
]

// Comprobación en desarrollo: la melodía y el acompañamiento deben durar lo mismo
if (import.meta.env.DEV) {
  for (const m of MELODIAS) {
    const a = m.notas.reduce((s, n) => s + n[1], 0)
    const b = m.acordes.reduce((s, n) => s + n[1], 0)
    if (a !== b) console.warn(`[música] ${m.nombre}: melodía ${a} pulsos, acordes ${b}`)
  }
}
