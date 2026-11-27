// Genera los iconos PNG de la app: npm run iconos -- <arbol|regalo|corona|calendario|bola>
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'
import { DISENOS } from './disenos-icono.mjs'

const nombre = process.argv[2] ?? 'arbol'
const diseno = DISENOS[nombre]
if (!diseno) throw new Error(`Diseño desconocido: ${nombre}. Opciones: ${Object.keys(DISENOS).join(', ')}`)

writeFileSync('public/favicon.svg', diseno(112))
const plano = Buffer.from(diseno(0)) // iOS y Android ya redondean las esquinas
await sharp(plano).resize(180, 180).png().toFile('public/apple-touch-icon.png')
await sharp(plano).resize(192, 192).png().toFile('public/pwa-192.png')
await sharp(plano).resize(512, 512).png().toFile('public/pwa-512.png')
await sharp(plano).resize(512, 512).png().toFile('public/pwa-maskable-512.png')
console.log(`✅ Iconos generados con el diseño "${nombre}"`)
