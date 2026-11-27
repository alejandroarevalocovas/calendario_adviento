// Recupera contenido/dias.json a partir de src/data/contenido.ts (por si clonas el repo en otro PC).
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { decodificar } from './clave.mjs'

const destino = new URL('../contenido/dias.json', import.meta.url)
if (existsSync(destino) && !process.argv.includes('--forzar')) {
  console.log('contenido/dias.json ya existe. Usa "npm run decodificar -- --forzar" para sobrescribirlo.')
  process.exit(0)
}
const ts = readFileSync(new URL('../src/data/contenido.ts', import.meta.url), 'utf8')
const datos = ts.match(/DATOS = '([^']+)'/)[1]
const dias = JSON.parse(decodificar(datos))
writeFileSync(destino, JSON.stringify(dias, null, 2) + '\n')
console.log('✅ contenido/dias.json recuperado')
