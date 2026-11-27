// Diseños de icono disponibles (SVG 512x512). Se elige uno con: npm run iconos -- <nombre>

const copos = (pts, color = '#fff', op = 0.7) =>
  pts.map(([x, y, r]) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${color}" opacity="${op}"/>`).join('')

export const DISENOS_BASE = {
  // A) Árbol con estrella sobre rojo
  arbol: (r) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="f" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#d8344a"/><stop offset="1" stop-color="#6e0f1f"/></radialGradient>
    <linearGradient id="v" x1="0" x2="1"><stop offset="0" stop-color="#3fbf6b"/><stop offset=".55" stop-color="#23894a"/><stop offset="1" stop-color="#145c30"/></linearGradient>
  </defs>
  <rect width="512" height="512" rx="${r}" fill="url(#f)"/>
  ${copos([[70, 90, 5], [430, 120, 4], [110, 300, 4], [440, 330, 5], [60, 430, 4], [400, 450, 3], [180, 70, 3], [330, 60, 4]])}
  <rect x="236" y="390" width="40" height="46" rx="6" fill="#6b3f1f"/>
  <path d="M256 120 L340 230 L300 230 L380 330 L330 330 L410 410 L102 410 L182 330 L132 330 L212 230 L172 230 Z" fill="url(#v)" stroke="#e9fff0" stroke-width="6" stroke-linejoin="round"/>
  ${[[230, 215, '#ffd84d'], [285, 250, '#fff'], [215, 300, '#ff6b6b'], [300, 310, '#ffd84d'], [190, 385, '#fff'], [255, 360, '#ff6b6b'], [330, 385, '#ffd84d']]
    .map(([x, y, c]) => `<circle cx="${x}" cy="${y}" r="13" fill="${c}"/><circle cx="${x - 4}" cy="${y - 4}" r="4" fill="#fff" opacity=".7"/>`).join('')}
  <path d="M256 52 L271 90 L312 92 L280 117 L291 157 L256 135 L221 157 L232 117 L200 92 L241 90 Z" fill="#ffd84d" stroke="#fff3b0" stroke-width="5" stroke-linejoin="round"/>
</svg>`,

  // B) Regalo con lazo dorado (fondo configurable)
  regalo: (r) => regalo(r, ['#2f9e5c', '#0f4a2a'], '#fff'),
  'regalo-noche': (r) => regalo(r, ['#26457f', '#0a1633'], '#fff'),
  'regalo-nieve': (r) => regalo(r, ['#ffffff', '#cfe3f2'], '#9fc3de'),
  'regalo-dorado': (r) => regalo(r, ['#fff3cf', '#e9c46a'], '#fff'),
}

function regalo(r, [f1, f2], copo) {
  return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="f" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="${f1}"/><stop offset="1" stop-color="${f2}"/></radialGradient>
    <linearGradient id="c" x1="0" x2="1"><stop offset="0" stop-color="#e2384d"/><stop offset="1" stop-color="#a8182c"/></linearGradient>
    <linearGradient id="o" x1="0" x2="1"><stop offset="0" stop-color="#ffe27a"/><stop offset="1" stop-color="#d9a520"/></linearGradient>
  </defs>
  <rect width="512" height="512" rx="${r}" fill="url(#f)"/>
  ${copos([[70, 80, 5], [440, 100, 4], [80, 260, 4], [450, 300, 5], [90, 450, 4], [420, 440, 3], [260, 50, 3]], copo, 0.8)}
  <rect x="116" y="250" width="280" height="190" rx="14" fill="url(#c)"/>
  <rect x="98" y="196" width="316" height="70" rx="14" fill="#c2203a"/>
  <rect x="98" y="196" width="316" height="22" rx="10" fill="#e8475c" opacity=".7"/>
  <rect x="232" y="196" width="48" height="244" fill="url(#o)"/>
  <path d="M256 198 C200 120 140 140 160 180 C175 210 230 205 256 198 Z" fill="url(#o)" stroke="#b8860b" stroke-width="5"/>
  <path d="M256 198 C312 120 372 140 352 180 C337 210 282 205 256 198 Z" fill="url(#o)" stroke="#b8860b" stroke-width="5"/>
  <circle cx="256" cy="196" r="22" fill="#ffd84d" stroke="#b8860b" stroke-width="5"/>
</svg>`
}

const MAS = {


  // C) Corona de adviento con lazo
  corona: (r) => {
    const hojas = Array.from({ length: 28 }, (_, i) => {
      const a = (i / 28) * Math.PI * 2
      const rr = i % 2 ? 128 : 112
      const x = 256 + Math.cos(a) * rr
      const y = 256 + Math.sin(a) * rr
      const g = ((a * 180) / Math.PI + 90 + (i % 2 ? 25 : -25)).toFixed(1)
      const c = i % 3 === 0 ? '#2f9e57' : i % 3 === 1 ? '#1f7a40' : '#3cb46a'
      return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="20" ry="44" transform="rotate(${g} ${x.toFixed(1)} ${y.toFixed(1)})" fill="${c}"/>`
    }).join('')
    const bayas = [0.3, 1.2, 2.0, 2.9, 3.6, 4.4, 5.3, 6.0]
      .map((a) => `<circle cx="${(256 + Math.cos(a) * 120).toFixed(1)}" cy="${(256 + Math.sin(a) * 120).toFixed(1)}" r="12" fill="#e2384d" stroke="#fff" stroke-width="2"/>`)
      .join('')
    return `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs><radialGradient id="f" cx="50%" cy="40%" r="75%"><stop offset="0" stop-color="#fff6e6"/><stop offset="1" stop-color="#f0d9b5"/></radialGradient></defs>
  <rect width="512" height="512" rx="${r}" fill="url(#f)"/>
  ${hojas}${bayas}
  <path d="M256 372 L196 440 L226 444 L236 470 L256 392 Z" fill="#c2203a"/>
  <path d="M256 372 L316 440 L286 444 L276 470 L256 392 Z" fill="#a8182c"/>
  <path d="M256 370 C210 330 170 350 190 380 C205 400 240 385 256 370 Z" fill="#e2384d"/>
  <path d="M256 370 C302 330 342 350 322 380 C307 400 272 385 256 370 Z" fill="#e2384d"/>
  <circle cx="256" cy="370" r="16" fill="#c2203a"/>
  <text x="256" y="292" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="120" fill="#a8182c">X</text>
</svg>`
  },

  // D) Hoja de calendario "25 DIC"
  calendario: (r) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs><radialGradient id="f" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#d8344a"/><stop offset="1" stop-color="#6e0f1f"/></radialGradient></defs>
  <rect width="512" height="512" rx="${r}" fill="url(#f)"/>
  ${copos([[60, 70, 5], [450, 80, 4], [470, 300, 4], [50, 330, 5], [420, 470, 4], [90, 470, 3]])}
  <rect x="106" y="112" width="300" height="310" rx="28" fill="#fffaf0"/>
  <path d="M106 140 Q106 112 134 112 L378 112 Q406 112 406 140 L406 196 L106 196 Z" fill="#1f7a40"/>
  <text x="256" y="174" text-anchor="middle" font-family="Arial, sans-serif" font-weight="700" font-size="52" letter-spacing="6" fill="#fff">DIC</text>
  <rect x="160" y="88" width="20" height="56" rx="10" fill="#cfcfcf"/><rect x="332" y="88" width="20" height="56" rx="10" fill="#cfcfcf"/>
  <text x="256" y="372" text-anchor="middle" font-family="Georgia, serif" font-weight="700" font-size="170" fill="#c2203a">25</text>
  <ellipse cx="370" cy="400" rx="16" ry="34" transform="rotate(50 370 400)" fill="#2f9e57"/>
  <ellipse cx="395" cy="370" rx="16" ry="34" transform="rotate(10 395 370)" fill="#1f7a40"/>
  <circle cx="384" cy="392" r="11" fill="#e2384d"/><circle cx="398" cy="402" r="9" fill="#e2384d"/>
</svg>`,

  // E) Bola de Navidad
  bola: (r) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
  <defs>
    <radialGradient id="f" cx="50%" cy="35%" r="75%"><stop offset="0" stop-color="#1d3a6e"/><stop offset="1" stop-color="#081430"/></radialGradient>
    <radialGradient id="b" cx="38%" cy="35%" r="70%"><stop offset="0" stop-color="#ff7a8a"/><stop offset=".5" stop-color="#d8203a"/><stop offset="1" stop-color="#7a0c1c"/></radialGradient>
  </defs>
  <rect width="512" height="512" rx="${r}" fill="url(#f)"/>
  ${copos([[70, 80, 5], [440, 90, 4], [90, 260, 4], [450, 280, 5], [70, 440, 4], [430, 450, 3], [150, 150, 3], [380, 180, 3]])}
  <path d="M256 30 L256 110" stroke="#ffd84d" stroke-width="5"/>
  <rect x="222" y="104" width="68" height="44" rx="8" fill="#e0b13a" stroke="#a87b10" stroke-width="4"/>
  <circle cx="256" cy="300" r="160" fill="url(#b)"/>
  <path d="M106 280 Q256 330 406 280" stroke="#ffd84d" stroke-width="14" fill="none"/>
  <path d="M110 330 Q256 380 402 330" stroke="#fff" stroke-width="6" fill="none" opacity=".8" stroke-dasharray="2 16" stroke-linecap="round"/>
  <ellipse cx="200" cy="215" rx="42" ry="24" transform="rotate(-30 200 215)" fill="#fff" opacity=".45"/>
  <text x="256" y="262" text-anchor="middle" font-family="Georgia, serif" font-style="italic" font-weight="700" font-size="70" fill="#ffd84d">X</text>
</svg>`,
}

export const DISENOS = { ...DISENOS_BASE, ...MAS }
