import { describe, expect, it } from 'vitest'
import { createDefaultSettings } from './defaults'
import { sanitizeCategory, withMealTarget, withoutCategory } from './settings'

describe('withoutCategory', () => {
  it('borra la categoría y sus objetivos en las comidas', () => {
    const settings = withoutCategory(createDefaultSettings(), 'proteinas')
    expect(settings.categories.some((category) => category.id === 'proteinas')).toBe(false)
    expect(settings.meals.every((meal) => !('proteinas' in meal.targets))).toBe(true)
    expect(settings.meals[0].targets.harinas).toBe(2)
  })
})

describe('withMealTarget', () => {
  it('fija el objetivo solo en la comida indicada', () => {
    const settings = withMealTarget(createDefaultSettings(), 'cena', 'grasas', 2)
    expect(settings.meals.find((meal) => meal.id === 'cena')?.targets).toEqual({ grasas: 2 })
    expect(settings.meals.find((meal) => meal.id === 'desayuno')?.targets).not.toHaveProperty('grasas')
  })

  it('0 elimina la entrada', () => {
    const settings = withMealTarget(createDefaultSettings(), 'desayuno', 'frutas', 0)
    expect(settings.meals[0].targets).not.toHaveProperty('frutas')
  })
})

describe('sanitizeCategory', () => {
  it('evita objetivos negativos e incrementos de 0', () => {
    const category = sanitizeCategory({ id: 'x', name: 'X', unit: 'L', dailyTarget: -2, step: 0 })
    expect(category.dailyTarget).toBe(0)
    expect(category.step).toBe(1)
  })
})
