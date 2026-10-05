import { addDays } from './date'
import type { DateKey, Logs } from './types'

export const RETENTION_DAYS = 30

/**
 * Elimina los registros con más de `days` días de antigüedad respecto a `today`.
 * Devuelve el mismo objeto si no hay nada que borrar (evita re-renders innecesarios).
 */
export function purgeOldLogs(logs: Logs, today: DateKey, days = RETENTION_DAYS): Logs {
  const cutoff = addDays(today, -days)
  const keys = Object.keys(logs)
  // Las claves 'YYYY-MM-DD' se ordenan bien como strings.
  if (keys.every((key) => key >= cutoff)) return logs
  return Object.fromEntries(keys.filter((key) => key >= cutoff).map((key) => [key, logs[key]]))
}
