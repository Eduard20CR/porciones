import { normalizeQuantity } from './quantity'
import type { DateKey, Id, Logs } from './types'

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

  const next = { ...logs }
  if (Object.keys(meals).length === 0) delete next[date]
  else next[date] = { meals }
  return next
}
