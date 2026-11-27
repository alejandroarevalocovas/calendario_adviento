// Posición de cada casilla en una cuadrícula de 4 columnas x 10 filas.
// Los números van desordenados, como en un calendario de adviento de verdad.
export type Tamano = 'normal' | 'mediano' | 'grande' | 'enorme'
export type Casilla = { dia: number; col: number; fila: number; ancho: number; alto: number; tamano: Tamano }

const c = (dia: number, col: number, fila: number, ancho = 1, alto = 1, tamano: Tamano = 'normal'): Casilla => ({
  dia, col, fila, ancho, alto, tamano,
})

export const COLUMNAS = 4
export const FILAS = 10

export const CASILLAS: Casilla[] = [
  c(3, 1, 1), c(4, 2, 1, 2, 2, 'grande'), c(18, 4, 1),
  c(11, 1, 2), c(9, 4, 2),
  c(13, 1, 3, 2, 1, 'mediano'), c(6, 3, 3), c(22, 4, 3),
  c(16, 1, 4), c(19, 2, 4), c(1, 3, 4, 2, 1, 'mediano'),
  c(25, 1, 5, 3, 2, 'enorme'), c(8, 4, 5),
  c(2, 4, 6),
  c(10, 1, 7), c(20, 2, 7, 2, 1, 'mediano'), c(5, 4, 7),
  c(24, 1, 8, 2, 2, 'grande'), c(15, 3, 8), c(12, 4, 8, 1, 2, 'mediano'),
  c(21, 3, 9),
  c(17, 1, 10), c(23, 2, 10), c(7, 3, 10), c(14, 4, 10),
]

export const esEspecial = (dia: number) => CASILLAS.find((x) => x.dia === dia)!.tamano !== 'normal'
