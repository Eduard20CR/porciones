import { describe, expect, it } from 'vitest'
import { createDefaultSettings } from './defaults'
import { getDailyTotals, getProgress } from './totals'
import type { DayLog } from './types'

const settings = createDefaultSettings()

describe('getDailyTotals', () => {
  it('devuelve 0 en todas las categorías si no hay registro', () => {
    const totals = getDailyTotals(settings, undefined)
    expect(Object.keys(totals)).toHaveLength(settings.categories.length)
    expect(Object.values(totals).every((value) => value === 0)).toBe(true)
  })

  it('suma el consumo de todas las comidas', () => {
    const log: DayLog = {
      meals: {
        desayuno: { proteinas: 3, harinas: 2 },
        almuerzo: { proteinas: 5, harinas: 1 },
      },
    }
    const totals = getDailyTotals(settings, log)
    expect(totals.proteinas).toBe(8)
    expect(totals.harinas).toBe(3)
    expect(totals.frutas).toBe(0)
  })

  it('ignora comidas y categorías que ya no existen', () => {
    const log: DayLog = {
      meals: {
        desayuno: { proteinas: 2, borrada: 10 },
        comidaBorrada: { proteinas: 99 },
      },
    }
    const totals = getDailyTotals(settings, log)
    expect(totals.proteinas).toBe(2)
    expect(totals).not.toHaveProperty('borrada')
  })
})

describe('getProgress', () => {
  it('calcula la fracción del objetivo', () => {
    expect(getProgress(7, 14)).toBe(0.5)
  })

  it('puede superar 1', () => {
    expect(getProgress(15, 13)).toBeGreaterThan(1)
  })

  it('con objetivo 0 no divide entre cero', () => {
    expect(getProgress(0, 0)).toBe(0)
    expect(getProgress(2, 0)).toBe(1)
  })
})
