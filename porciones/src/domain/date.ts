import type { DateKey } from './types'

const pad = (n: number) => String(n).padStart(2, '0')

/** Usa la fecha local (no UTC): `toISOString()` daría el día equivocado de noche en UTC-6. */
export function toDateKey(date: Date): DateKey {
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`
}

export function parseDateKey(key: DateKey): Date {
  const [year, month, day] = key.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export function addDays(key: DateKey, days: number): DateKey {
  const date = parseDateKey(key)
  date.setDate(date.getDate() + days)
  return toDateKey(date)
}

export function todayKey(): DateKey {
  return toDateKey(new Date())
}

const longDate = new Intl.DateTimeFormat('es', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})

/** Ej.: "lunes, 5 de octubre de 2026". */
export function formatDateKey(key: DateKey): string {
  return longDate.format(parseDateKey(key))
}
