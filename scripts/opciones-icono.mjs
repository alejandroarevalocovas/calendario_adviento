// Genera opciones-icono.html para comparar los diseños de icono
import { writeFileSync } from 'node:fs'
import { DISENOS } from './disenos-icono.mjs'

const nombres = { arbol: 'A · Árbol', regalo: 'B · Regalo', corona: 'C · Corona', calendario: 'D · Calendario 25', bola: 'E · Bola' }
const tarjetas = Object.entries(DISENOS)
  .map(([k, f]) => `<figure><div class="i">${f(112)}</div><figcaption>${nombres[k]}</figcaption></figure>`)
  .join('')
writeFileSync('opciones-icono.html', `<!doctype html><meta charset="utf-8"><title>Opciones de icono</title>
<style>body{font-family:system-ui;background:#eee;display:flex;flex-wrap:wrap;gap:24px;padding:24px;justify-content:center}
figure{margin:0;text-align:center}.i svg{width:140px;height:140px;filter:drop-shadow(0 4px 10px rgba(0,0,0,.25))}figcaption{margin-top:8px;font-weight:600}</style>${tarjetas}`)
console.log('ok')
