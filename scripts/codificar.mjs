// Lee contenido/dias.json (en claro, no se sube a GitHub) y genera src/data/contenido.ts codificado.
import { readFileSync, writeFileSync } from 'node:fs'
import { codificar } from './clave.mjs'

const json = readFileSync(new URL('../contenido/dias.json', import.meta.url), 'utf8')
const dias = JSON.parse(json)
if (dias.length !== 25) throw new Error(`Tiene que haber 25 días y hay ${dias.length}`)
const datos = codificar(JSON.stringify(dias))
writeFileSync(
  new URL('../src/data/contenido.ts', import.meta.url),
  `// Archivo generado con "npm run codificar". No editar a mano: edita contenido/dias.json.\nexport const DATOS = '${datos}'\n`,
)
console.log('✅ src/data/contenido.ts actualizado')
