import { createId } from './id'
import { normalizeQuantity } from './quantity'
import type { Category, Id, Meal, Settings } from './types'

export function createCategory(): Category {
  return { id: createId(), name: 'Nueva categoría', unit: 'porciones', dailyTarget: 0, step: 1 }
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
