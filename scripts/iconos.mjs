// Genera los iconos PNG de la app a partir de un SVG (npm run iconos)
import sharp from 'sharp'
import { writeFileSync } from 'node:fs'

const arbol = (escala = 1) => `
  <g transform="translate(256 270) scale(${escala}) translate(-100 -120)">
    <rect x="88" y="195" width="24" height="26" rx="3" fill="#6b3f1f"/>
    <path d="M100 20 L140 80 L122 80 L160 135 L136 135 L180 195 L20 195 L64 135 L40 135 L78 80 L60 80 Z" fill="url(#v)" stroke="#7be39b" stroke-width="2" stroke-linejoin="round"/>
    ${[[92,62,'#ff4d4d'],[110,74,'#ffd84d'],[78,112,'#4dd2ff'],[104,104,'#ff7ad9'],[124,120,'#7dff6b'],[66,170,'#ffd84d'],[92,158,'#ff4d4d'],[118,176,'#4dd2ff'],[142,164,'#ffa24d'],[52,186,'#ff7ad9'],[150,188,'#ff4d4d']]
      .map(([x,y,c]) => `<circle cx="${x}" cy="${y}" r="7" fill="${c}" opacity=".35"/><circle cx="${x}" cy="${y}" r="3.5" fill="${c}"/>`).join('')}
    <circle cx="100" cy="18" r="26" fill="url(#b)"/>
    <path d="M100 2 L104.7 12.6 L116 13.6 L107.4 21 L110 32 L100 26.2 L90 32 L92.6 21 L84 13.6 L95.3 12.6 Z" fill="#ffd84d" stroke="#fff3b0"/>
  </g>`

const svg = (redondo, escala) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="f" cx="50%" cy="30%" r="80%"><stop offset="0" stop-color="#1d2f66"/><stop offset="1" stop-color="#070d22"/></radialGradient>
    <linearGradient id="v" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2f9e57"/><stop offset="1" stop-color="#14532d"/></linearGradient>
    <radialGradient id="b"><stop offset="0" stop-color="#fff6c2" stop-opacity=".9"/><stop offset="1" stop-color="#ffd84d" stop-opacity="0"/></radialGradient>
  </defs>
  <rect width="512" height="512" rx="${redondo}" fill="url(#f)"/>
  ${[[60,80],[440,60],[400,150],[90,200],[460,300],[50,380],[420,440],[140,60]].map(([x,y]) => `<circle cx="${x}" cy="${y}" r="3" fill="#fff" opacity=".8"/>`).join('')}
  ${arbol(escala)}
</svg>`

writeFileSync('public/favicon.svg', svg(110, 1.75))
const normal = Buffer.from(svg(0, 1.75))
const maskable = Buffer.from(svg(0, 1.35))
await sharp(normal).resize(180, 180).png().toFile('public/apple-touch-icon.png')
await sharp(normal).resize(192, 192).png().toFile('public/pwa-192.png')
await sharp(normal).resize(512, 512).png().toFile('public/pwa-512.png')
await sharp(maskable).resize(512, 512).png().toFile('public/pwa-maskable-512.png')
console.log('✅ Iconos generados en public/')
