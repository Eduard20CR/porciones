import type { Settings } from './types'

/** Plan inicial de ejemplo. Los IDs son fijos para que sea determinista. */
export function createDefaultSettings(): Settings {
  return {
    personName: '',
    categories: [
      { id: 'leches', name: 'Leches', unit: 'porciones', dailyTarget: 1, step: 1 },
      { id: 'frutas', name: 'Frutas', unit: 'porciones', dailyTarget: 2, step: 1 },
      { id: 'vegetales', name: 'Vegetales', unit: 'porciones', dailyTarget: 3, step: 1 },
      { id: 'harinas', name: 'Harinas', unit: 'porciones', dailyTarget: 8, step: 1 },
      { id: 'proteinas', name: 'Proteínas', unit: 'porciones', dailyTarget: 13, step: 1 },
      { id: 'grasas', name: 'Grasas', unit: 'porciones', dailyTarget: 4, step: 1 },
      { id: 'liquidos', name: 'Líquidos', unit: 'L', dailyTarget: 3, step: 0.25 },
    ],
    meals: [
      { id: 'desayuno', name: 'Desayuno', targets: { proteinas: 3, harinas: 2, frutas: 1 } },
      { id: 'almuerzo', name: 'Almuerzo', targets: { proteinas: 5, harinas: 3 } },
      { id: 'merienda', name: 'Merienda', targets: {} },
      { id: 'cena', name: 'Cena', targets: {} },
    ],
  }
}
