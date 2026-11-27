// Ofuscación sencilla para que las recompensas no se lean en GitHub a simple vista.
export const CLAVE = 'xisca-navidad-2026-sin-espiar'

export function codificar(texto) {
  const bytes = new TextEncoder().encode(texto)
  const k = new TextEncoder().encode(CLAVE)
  const out = bytes.map((b, i) => b ^ k[i % k.length] ^ ((i * 31) & 255))
  return Buffer.from(out).toString('base64')
}

export function decodificar(b64) {
  const bytes = Buffer.from(b64, 'base64')
  const k = new TextEncoder().encode(CLAVE)
  const out = bytes.map((b, i) => b ^ k[i % k.length] ^ ((i * 31) & 255))
  return new TextDecoder().decode(out)
}
