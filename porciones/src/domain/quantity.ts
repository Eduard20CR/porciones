/** Recorta a >= 0 y elimina ruido de flotantes (0.1 + 0.2 -> 0.3). */
export function normalizeQuantity(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.round(value * 1000) / 1000
}

// Sin separador de miles: "10.000" se volvería a leer como 10 en parseQuantity.
const quantityFormat = new Intl.NumberFormat('es', { maximumFractionDigits: 3, useGrouping: false })

/** Ej.: 0.75 -> "0,75", 13 -> "13". */
export function formatQuantity(value: number): string {
  return quantityFormat.format(value)
}

/** Interpreta lo que escribe el usuario ("1,5" o "1.5"). Devuelve null si no es un número. */
export function parseQuantity(text: string): number | null {
  const trimmed = text.trim().replace(',', '.')
  if (trimmed === '') return 0
  const value = Number(trimmed)
  return Number.isFinite(value) ? value : null
}
