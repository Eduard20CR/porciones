import { beforeEach, describe, expect, it, vi } from 'vitest'
import { addDays, todayKey } from '../domain/date'

function stubLocalStorage(initial: Record<string, string> = {}) {
  const data = new Map(Object.entries(initial))
  const localStorage = {
    getItem: (key: string) => data.get(key) ?? null,
    setItem: (key: string, value: string) => data.set(key, value),
    removeItem: (key: string) => data.delete(key),
  }
  // El persist de zustand usa `window.localStorage`, que no existe en Node.
  vi.stubGlobal('window', { localStorage })
  return data
}

// Se importa el store en cada test para que se hidrate con el localStorage simulado.
async function loadStore() {
  vi.resetModules()
  return (await import('./useAppStore')).useAppStore
}

describe('useAppStore (persistencia)', () => {
  beforeEach(() => {
    vi.unstubAllGlobals()
  })

  it('arranca con el plan por defecto si no hay nada guardado', async () => {
    stubLocalStorage()
    const store = await loadStore()
    expect(store.getState().settings.categories).toHaveLength(6)
    expect(store.getState().logs).toEqual({})
  })

  it('guarda el consumo en localStorage sin las acciones', async () => {
    const data = stubLocalStorage()
    const store = await loadStore()
    store.getState().setConsumption(todayKey(), 'desayuno', 'proteinas', 2)

    const saved = JSON.parse(data.get('porciones') ?? '{}')
    expect(saved.version).toBe(1)
    expect(Object.keys(saved.state)).toEqual(['settings', 'logs'])
    expect(saved.state.logs[todayKey()].meals.desayuno.proteinas).toBe(2)
  })

  it('al hidratar purga los registros de más de 30 días', async () => {
    const today = todayKey()
    const old = addDays(today, -40)
    const day = { meals: { desayuno: { proteinas: 1 } } }
    stubLocalStorage({
      porciones: JSON.stringify({ version: 1, state: { logs: { [old]: day, [today]: day } } }),
    })
    const store = await loadStore()
    expect(Object.keys(store.getState().logs)).toEqual([today])
    // Sin settings guardados se conservan los de por defecto.
    expect(store.getState().settings.meals).toHaveLength(4)
  })
})
