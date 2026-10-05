/** Recorta a >= 0 y elimina ruido de flotantes (0.1 + 0.2 -> 0.3). */
export function normalizeQuantity(value: number): number {
  if (!Number.isFinite(value) || value <= 0) return 0
  return Math.round(value * 1000) / 1000
}

const quantityFormat = new Intl.NumberFormat('es', { maximumFractionDigits: 3 })

/** Ej.: 0.75 -> "0,75", 13 -> "13". */
export function formatQuantity(value: number): string {
  return quantityFormat.format(value)
}
