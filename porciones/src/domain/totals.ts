import type { DayLog, Id, Settings } from './types'

export function getConsumed(dayLog: DayLog | undefined, mealId: Id, categoryId: Id): number {
  return dayLog?.meals[mealId]?.[categoryId] ?? 0
}

/**
 * Consumo diario por categoría: suma del consumo real de todas las comidas.
 * Solo cuenta comidas y categorías que siguen en la configuración (los IDs huérfanos se ignoran).
 */
export function getDailyTotals(settings: Settings, dayLog: DayLog | undefined): Record<Id, number> {
  const totals: Record<Id, number> = {}
  for (const category of settings.categories) {
    let sum = 0
    for (const meal of settings.meals) {
      sum += getConsumed(dayLog, meal.id, category.id)
    }
    totals[category.id] = Math.round(sum * 1000) / 1000
  }
  return totals
}

/** Fracción de avance (puede ser > 1 si se supera el objetivo). */
export function getProgress(consumed: number, target: number): number {
  if (target <= 0) return consumed > 0 ? 1 : 0
  return consumed / target
}
