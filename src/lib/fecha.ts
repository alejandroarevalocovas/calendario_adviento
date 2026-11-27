import { useEffect, useState } from 'react'

export const ANO = 2026
const HORA = 3600_000
const DIA = 24 * HORA

// Diciembre en España siempre es horario de invierno (UTC+1).
// El día N se desbloquea a las 00:00 de Madrid = 23:00 UTC del día anterior.
export const desbloqueoDe = (dia: number) => Date.UTC(ANO, 11, dia) - HORA

// Diferencia entre la hora del servidor y la del móvil (para que cambiar la hora del iPhone no sirva de nada si hay internet)
let desfase = 0

// Solo en desarrollo (npm run dev): ?fecha=2026-12-10T10:00 simula otra fecha. No existe en la versión publicada.
let fechaSimulada: number | null = null
if (import.meta.env.DEV) {
  const p = new URLSearchParams(location.search).get('fecha')
  if (p) fechaSimulada = new Date(p).getTime() - Date.now()
}

export const ahora = () => Date.now() + (fechaSimulada ?? desfase)

export async function sincronizarHora() {
  if (import.meta.env.DEV) return
  try {
    const t0 = Date.now()
    const r = await fetch(`${import.meta.env.BASE_URL}hora.txt?t=${t0}`, { cache: 'no-store' })
    const cabecera = r.headers.get('date')
    if (!cabecera) return
    const servidor = new Date(cabecera).getTime() + (Date.now() - t0) / 2
    const d = servidor - Date.now()
    desfase = Math.abs(d) > 2 * 60_000 ? d : 0
    window.dispatchEvent(new Event('hora-sincronizada'))
  } catch {
    /* sin conexión: usamos la hora del móvil */
  }
}

export const estaDesbloqueado = (dia: number, t = ahora()) => t >= desbloqueoDe(dia)

/** Día de diciembre que es hoy en Madrid (0 si aún no es diciembre, 26+ si ya ha pasado Navidad) */
export function diaDeHoy(t = ahora()): number {
  if (t < desbloqueoDe(1)) return 0
  return Math.floor((t - desbloqueoDe(1)) / DIA) + 1
}

/** Clave única de la fecha de hoy en Madrid, p. ej. "2026-12-03" */
export function claveHoy(t = ahora()): string {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Europe/Madrid' }).format(new Date(t))
}

export function textoCuentaAtras(dia: number, t = ahora()): string {
  const ms = desbloqueoDe(dia) - t
  if (ms <= 0) return '¡Ya se puede abrir!'
  const horas = Math.floor(ms / HORA)
  const min = Math.floor((ms % HORA) / 60_000)
  if (horas < 1) return `Se abre en ${Math.max(min, 1)} min`
  if (horas < 24) return `Se abre en ${horas} h ${min} min`
  const dias = Math.ceil(ms / DIA)
  return dias === 1 ? 'Se abre mañana' : `Se abre en ${dias} días`
}

/** Días que faltan para Navidad (0 el día 25, negativo después) */
export function diasParaNavidad(t = ahora()): number {
  return Math.ceil((desbloqueoDe(25) - t) / DIA)
}

/** Hook que devuelve la hora actual y se actualiza cada `cada` ms y al volver a la app */
export function useAhora(cada = 30_000) {
  const [t, setT] = useState(ahora)
  useEffect(() => {
    const tick = () => setT(ahora())
    const id = setInterval(tick, cada)
    document.addEventListener('visibilitychange', tick)
    window.addEventListener('hora-sincronizada', tick)
    return () => {
      clearInterval(id)
      document.removeEventListener('visibilitychange', tick)
      window.removeEventListener('hora-sincronizada', tick)
    }
  }, [cada])
  return t
}
