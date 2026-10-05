import type { Settings } from './types'

/** Plan inicial de ejemplo. Los IDs son fijos para que sea determinista. */
export function createDefaultSettings(): Settings {
  return {
    personName: '',
    categories: [
      { id: 'leches', name: 'Leches', unit: 'porc.', dailyTarget: 1, step: 1 },
      { id: 'frutas', name: 'Frutas', unit: 'porc.', dailyTarget: 2, step: 1 },
      { id: 'vegetales', name: 'Vegetales', unit: 'porc.', dailyTarget: 3, step: 1 },
      { id: 'harinas', name: 'Harinas', unit: 'porc.', dailyTarget: 8, step: 1 },
      { id: 'proteinas', name: 'Proteínas', unit: 'porc.', dailyTarget: 13, step: 1 },
      { id: 'grasas', name: 'Grasas', unit: 'porc.', dailyTarget: 4, step: 1 },
    ],
    meals: [
      { id: 'desayuno', name: 'Desayuno', targets: { proteinas: 3, harinas: 2, frutas: 1 } },
      { id: 'almuerzo', name: 'Almuerzo', targets: { proteinas: 5, harinas: 3 } },
      { id: 'merienda', name: 'Merienda', targets: {} },
      { id: 'cena', name: 'Cena', targets: {} },
    ],
  }
}
