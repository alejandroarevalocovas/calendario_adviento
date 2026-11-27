import { DATOS } from '../data/contenido'

export type Dia = {
  dia: number
  icono: string
  // vale: se guarda para canjear · plan: algo que hacemos juntos · regalo: algo para ella · mimo: un cuidado para ella
  tipo: 'vale' | 'plan' | 'regalo' | 'mimo'
  titulo: string
  texto: string
  pista?: string
  aniversario?: boolean
}

const CLAVE = 'xisca-navidad-2026-sin-espiar'

function decodificar(b64: string): string {
  const bin = atob(b64)
  const k = new TextEncoder().encode(CLAVE)
  const out = new Uint8Array(bin.length)
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i) ^ k[i % k.length] ^ ((i * 31) & 255)
  return new TextDecoder().decode(out)
}

export const DIAS: Dia[] = JSON.parse(decodificar(DATOS))

export const diaPorNumero = (n: number) => DIAS.find((d) => d.dia === n)!
