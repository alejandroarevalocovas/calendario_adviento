# Calendario de adviento de Xisca 🎄

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

Abre `http://localhost:5173/calendario_adviento/?fecha=2026-12-10T18:00` para simular una fecha. Esto **solo funciona en local**: la versión publicada usa la hora real, y si hay internet la toma del servidor.

## Otros comandos

- `npm run build`: compila en `dist/`.
- `npm run iconos`: regenera los iconos de `public/`.
