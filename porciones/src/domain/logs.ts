import { normalizeQuantity } from './quantity'
import type { DateKey, DayLog, Id, Logs } from './types'

export const NOTE_MAX_LENGTH = 500

/** Guarda el día solo si tiene algo (consumo o nota); si no, lo elimina. */
function withDay(logs: Logs, date: DateKey, day: DayLog): Logs {
  const next = { ...logs }
  const hasMeals = Object.keys(day.meals).length > 0
  if (!hasMeals && !day.note) delete next[date]
  else next[date] = day.note ? day : { meals: day.meals }
  return next
}

/**
 * Devuelve unos logs nuevos con el consumo actualizado.
 * Los valores 0 se eliminan (y las comidas/días vacíos también) para no acumular datos.
 */
export function withConsumption(
  logs: Logs,
  date: DateKey,
  mealId: Id,
  categoryId: Id,
  value: number,
): Logs {
  const quantity = normalizeQuantity(value)

  const meals = { ...logs[date]?.meals }
  const meal = { ...meals[mealId] }
  if (quantity === 0) delete meal[categoryId]
  else meal[categoryId] = quantity

  if (Object.keys(meal).length === 0) delete meals[mealId]
  else meals[mealId] = meal

  return withDay(logs, date, { meals, note: logs[date]?.note })
}

/**
 * Devuelve unos logs nuevos con la nota del día actualizada.
 * La nota se recorta y limita a `NOTE_MAX_LENGTH`; una nota vacía se elimina.
 */
export function withNote(logs: Logs, date: DateKey, note: string): Logs {
  const trimmed = note.trim().slice(0, NOTE_MAX_LENGTH)
  return withDay(logs, date, { meals: { ...logs[date]?.meals }, note: trimmed || undefined })
}
