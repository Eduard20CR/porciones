import { describe, expect, it } from 'vitest'
import { NOTE_MAX_LENGTH, withConsumption, withNote } from './logs'
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

describe('withNote', () => {
  it('crea el día solo con la nota', () => {
    expect(withNote({}, '2026-10-05', 'Día de fiesta')).toEqual({
      '2026-10-05': { meals: {}, note: 'Día de fiesta' },
    })
  })

  it('recorta espacios y limita la longitud', () => {
    expect(withNote({}, '2026-10-05', '  hola  ')['2026-10-05'].note).toBe('hola')
    const long = 'a'.repeat(NOTE_MAX_LENGTH + 10)
    expect(withNote({}, '2026-10-05', long)['2026-10-05'].note).toHaveLength(NOTE_MAX_LENGTH)
  })

  it('una nota vacía se elimina y limpia el día si no hay consumo', () => {
    const logs: Logs = { '2026-10-05': { meals: {}, note: 'x' } }
    expect(withNote(logs, '2026-10-05', '   ')).toEqual({})
  })

  it('conserva el consumo al cambiar la nota', () => {
    const logs: Logs = { '2026-10-05': { meals: { desayuno: { proteinas: 1 } } } }
    expect(withNote(logs, '2026-10-05', 'nota')['2026-10-05']).toEqual({
      meals: { desayuno: { proteinas: 1 } },
      note: 'nota',
    })
    expect(withNote(withNote(logs, '2026-10-05', 'nota'), '2026-10-05', '')['2026-10-05']).toEqual({
      meals: { desayuno: { proteinas: 1 } },
    })
  })

  it('withConsumption conserva la nota aunque el consumo quede vacío', () => {
    const logs: Logs = { '2026-10-05': { meals: { desayuno: { proteinas: 1 } }, note: 'nota' } }
    expect(withConsumption(logs, '2026-10-05', 'desayuno', 'proteinas', 0)).toEqual({
      '2026-10-05': { meals: {}, note: 'nota' },
    })
  })
})
