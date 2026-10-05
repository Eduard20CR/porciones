import { describe, expect, it } from 'vitest'
import { withConsumption } from './logs'
import type { Logs } from './types'

describe('withConsumption', () => {
  it('crea el día y la comida si no existen', () => {
    const logs = withConsumption({}, '2026-10-05', 'desayuno', 'proteinas', 2)
    expect(logs).toEqual({ '2026-10-05': { meals: { desayuno: { proteinas: 2 } } } })
  })

  it('no modifica el objeto original', () => {
    const original: Logs = { '2026-10-05': { meals: { desayuno: { proteinas: 1 } } } }
    withConsumption(original, '2026-10-05', 'desayuno', 'proteinas', 5)
    expect(original['2026-10-05'].meals.desayuno.proteinas).toBe(1)
  })

  it('elimina valores 0 y limpia comidas y días vacíos', () => {
    const logs: Logs = { '2026-10-05': { meals: { desayuno: { proteinas: 1 } } } }
    expect(withConsumption(logs, '2026-10-05', 'desayuno', 'proteinas', 0)).toEqual({})
  })

  it('conserva el resto de categorías y comidas', () => {
    const logs: Logs = {
      '2026-10-05': { meals: { desayuno: { proteinas: 1, frutas: 1 }, cena: { grasas: 1 } } },
    }
    const next = withConsumption(logs, '2026-10-05', 'desayuno', 'proteinas', 0)
    expect(next['2026-10-05'].meals).toEqual({ desayuno: { frutas: 1 }, cena: { grasas: 1 } })
  })

  it('no guarda negativos', () => {
    expect(withConsumption({}, '2026-10-05', 'desayuno', 'proteinas', -1)).toEqual({})
  })
})
