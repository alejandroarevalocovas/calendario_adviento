import { useCallback, useEffect, useState } from 'react'

export type Tema = 'clasico' | 'noche' | 'nordico' | 'jengibre' | 'rosa' | 'cabana'

export type Estado = {
  abiertos: number[]
  rascados: number[]
  canjeados: Record<number, string> // día -> fecha ISO del canje
  tema: Tema
  musica: boolean
  cancion: number
  ultimaIntro: string // clave de fecha del último día que se vio la animación completa
  resumenVisto: boolean
}

const INICIAL: Estado = {
  abiertos: [],
  rascados: [],
  canjeados: {},
  tema: 'clasico',
  musica: false,
  cancion: 0,
  ultimaIntro: '',
  resumenVisto: false,
}

const CLAVE = 'adviento-xisca-v1'

// ---------- Copia en IndexedDB (respaldo por si se pierde localStorage) ----------
function abrirDB(): Promise<IDBDatabase> {
  return new Promise((res, rej) => {
    const r = indexedDB.open('adviento-xisca', 1)
    r.onupgradeneeded = () => r.result.createObjectStore('estado')
    r.onsuccess = () => res(r.result)
    r.onerror = () => rej(r.error)
  })
}
async function leerDB(): Promise<Estado | null> {
  try {
    const db = await abrirDB()
    return await new Promise((res) => {
      const r = db.transaction('estado').objectStore('estado').get(CLAVE)
      r.onsuccess = () => res((r.result as Estado) ?? null)
      r.onerror = () => res(null)
    })
  } catch {
    return null
  }
}
async function escribirDB(e: Estado) {
  try {
    const db = await abrirDB()
    db.transaction('estado', 'readwrite').objectStore('estado').put(e, CLAVE)
  } catch {
    /* ignorar */
  }
}

function leerLocal(): Estado | null {
  try {
    const t = localStorage.getItem(CLAVE)
    return t ? { ...INICIAL, ...JSON.parse(t) } : null
  } catch {
    return null
  }
}

/** Une dos estados quedándose con todo lo que haya en cualquiera de los dos */
function fusionar(a: Estado | null, b: Estado | null): Estado {
  if (!a && !b) return INICIAL
  if (!a) return { ...INICIAL, ...b! }
  if (!b) return a
  return {
    ...b,
    ...a,
    abiertos: [...new Set([...a.abiertos, ...b.abiertos])],
    rascados: [...new Set([...a.rascados, ...b.rascados])],
    canjeados: { ...b.canjeados, ...a.canjeados },
    resumenVisto: a.resumenVisto || b.resumenVisto,
  }
}

function guardar(e: Estado) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(e))
  } catch {
    /* ignorar */
  }
  escribirDB(e)
}

export function exportarCodigo(e: Estado): string {
  const { abiertos, rascados, canjeados } = e
  return btoa(JSON.stringify({ abiertos, rascados, canjeados }))
}

export function useEstado() {
  const [estado, setEstado] = useState<Estado>(() => leerLocal() ?? INICIAL)

  useEffect(() => {
    // Pedimos a iOS que no borre nunca los datos
    navigator.storage?.persist?.().catch(() => {})
    leerDB().then((db) => {
      setEstado((actual) => {
        const f = fusionar(actual, db)
        guardar(f)
        return f
      })
    })
  }, [])

  const actualizar = useCallback((cambio: (e: Estado) => Estado) => {
    setEstado((e) => {
      const n = cambio(e)
      guardar(n)
      return n
    })
  }, [])

  const importarCodigo = useCallback(
    (codigo: string): boolean => {
      try {
        const datos = JSON.parse(atob(codigo.trim()))
        if (!Array.isArray(datos.abiertos)) return false
        actualizar((e) => fusionar(e, { ...e, ...datos }))
        return true
      } catch {
        return false
      }
    },
    [actualizar],
  )

  return { estado, actualizar, importarCodigo }
}
