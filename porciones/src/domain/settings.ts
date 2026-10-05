import { createId } from './id'
import { normalizeQuantity } from './quantity'
import type { Category, Id, Meal, Settings } from './types'

export function createCategory(): Category {
  return { id: createId(), name: 'Nueva categoría', unit: 'porc.', dailyTarget: 0, step: 1 }
}

export function createMeal(): Meal {
  return { id: createId(), name: 'Nueva comida', targets: {} }
}

/** Normaliza los campos numéricos; el incremento nunca puede ser 0. */
export function sanitizeCategory(category: Category): Category {
  return {
    ...category,
    dailyTarget: normalizeQuantity(category.dailyTarget),
    step: normalizeQuantity(category.step) || 1,
  }
}

/** Borra la categoría y sus objetivos en todas las comidas. */
export function withoutCategory(settings: Settings, categoryId: Id): Settings {
  return {
    ...settings,
    categories: settings.categories.filter((category) => category.id !== categoryId),
    meals: settings.meals.map((meal) => {
      const { [categoryId]: _removed, ...targets } = meal.targets
      return { ...meal, targets }
    }),
  }
}

/** Fija el objetivo de una categoría en una comida (0 elimina la entrada). */
export function withMealTarget(settings: Settings, mealId: Id, categoryId: Id, value: number): Settings {
  const quantity = normalizeQuantity(value)
  return {
    ...settings,
    meals: settings.meals.map((meal) => {
      if (meal.id !== mealId) return meal
      const targets = { ...meal.targets }
      if (quantity === 0) delete targets[categoryId]
      else targets[categoryId] = quantity
      return { ...meal, targets }
    }),
  }
}

/** Mueve un elemento una posición arriba (-1) o abajo (1). Devuelve el mismo array si no puede. */
export function moveById<T extends { id: Id }>(items: T[], id: Id, offset: -1 | 1): T[] {
  const from = items.findIndex((item) => item.id === id)
  const to = from + offset
  if (from === -1 || to < 0 || to >= items.length) return items
  const next = [...items]
  ;[next[from], next[to]] = [next[to], next[from]]
  return next
}

/** Suma de los objetivos de todas las comidas por categoría (para compararla con el objetivo diario). */
export function getMealTargetSums(settings: Settings): Record<Id, number> {
  const sums: Record<Id, number> = {}
  for (const category of settings.categories) {
    const sum = settings.meals.reduce((total, meal) => total + (meal.targets[category.id] ?? 0), 0)
    sums[category.id] = normalizeQuantity(sum)
  }
  return sums
}
