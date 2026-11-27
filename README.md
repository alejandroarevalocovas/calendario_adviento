# Calendario de Xisca 🎄

Web app instalable (PWA) para iPhone: se abre en Safari, **Compartir → Añadir a pantalla de inicio**, y queda como una app.

Web publicada: https://alejandroarevalocovas.github.io/calendario_adviento/

## Cambiar las recompensas

El contenido en claro está en `contenido/dias.json`. Ese archivo **no se sube a GitHub** para que no haya spoilers.

1. Edita `contenido/dias.json`.
2. Ejecuta `npm run codificar`. Esto genera `src/data/contenido.ts` codificado.
3. Haz commit y push. GitHub Actions publica la nueva versión sola.

Si clonas el repo en otro PC, `npm run decodificar` recupera `contenido/dias.json`.

Campos de cada día: `emoji`, `tipo` (`"vale"` va a *Mis vales* con botón de canjear, `"plan"` es para hacer juntos), `titulo`, `texto`, `pista` (opcional, se ve destacada) y `aniversario` (opcional, lanza corazones).

El tamaño y la posición de cada casilla están en `src/data/layout.ts`.

## Probar en local

```
npm install
npm run dev
```

O `npm run probar`, que además abre el navegador.

En local aparece el botón **🛠 Pruebas** abajo a la izquierda: cambia el día simulado (◀ ▶), cierra todas las puertas o empieza de cero. También vale `?fecha=2026-12-10T18:00` en la URL. Esto **solo existe en local**: la versión publicada usa la hora real, y si hay internet la toma del servidor.

La lista de cosas que preparar está en `contenido/PREPARAR.md` (tampoco se sube).

## Otros comandos

- `npm run build`: compila en `dist/`.
- `npm run iconos -- regalo-noche`: regenera los iconos de `public/` (otros diseños en `scripts/disenos-icono.mjs`).
