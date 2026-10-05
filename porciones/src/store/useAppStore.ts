import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { todayKey } from '../domain/date'
import { createDefaultSettings } from '../domain/defaults'
import { withConsumption } from '../domain/logs'
import { purgeOldLogs } from '../domain/retention'
import {
  createCategory,
  createMeal,
  moveById,
  sanitizeCategory,
  withMealTarget,
  withoutCategory,
} from '../domain/settings'
import type { Category, DateKey, Id, Logs, Settings } from '../domain/types'

interface PersistedState {
  settings: Settings
  logs: Logs
}

interface Actions {
  setConsumption: (date: DateKey, mealId: Id, categoryId: Id, value: number) => void
  setPersonName: (name: string) => void
  addCategory: () => void
  updateCategory: (id: Id, patch: Partial<Omit<Category, 'id'>>) => void
  removeCategory: (id: Id) => void
  moveCategory: (id: Id, offset: -1 | 1) => void
  addMeal: () => void
  renameMeal: (id: Id, name: string) => void
  removeMeal: (id: Id) => void
  moveMeal: (id: Id, offset: -1 | 1) => void
  setMealTarget: (mealId: Id, categoryId: Id, value: number) => void
}

export const useAppStore = create<PersistedState & Actions>()(
  persist(
    (set) => {
      const updateSettings = (update: (settings: Settings) => Settings) =>
        set((state) => ({ settings: update(state.settings) }))

      return {
        settings: createDefaultSettings(),
        logs: {},

        setConsumption: (date, mealId, categoryId, value) =>
          set((state) => ({ logs: withConsumption(state.logs, date, mealId, categoryId, value) })),

        setPersonName: (personName) => updateSettings((settings) => ({ ...settings, personName })),

        addCategory: () =>
          updateSettings((settings) => ({
            ...settings,
            categories: [...settings.categories, createCategory()],
          })),

        updateCategory: (id, patch) =>
          updateSettings((settings) => ({
            ...settings,
            categories: settings.categories.map((category) =>
              category.id === id ? sanitizeCategory({ ...category, ...patch }) : category,
            ),
          })),

        removeCategory: (id) => updateSettings((settings) => withoutCategory(settings, id)),

        moveCategory: (id, offset) =>
          updateSettings((settings) => ({
            ...settings,
            categories: moveById(settings.categories, id, offset),
          })),

        addMeal: () =>
          updateSettings((settings) => ({ ...settings, meals: [...settings.meals, createMeal()] })),

        renameMeal: (id, name) =>
          updateSettings((settings) => ({
            ...settings,
            meals: settings.meals.map((meal) => (meal.id === id ? { ...meal, name } : meal)),
          })),

        removeMeal: (id) =>
          updateSettings((settings) => ({
            ...settings,
            meals: settings.meals.filter((meal) => meal.id !== id),
          })),

        moveMeal: (id, offset) =>
          updateSettings((settings) => ({ ...settings, meals: moveById(settings.meals, id, offset) })),

        setMealTarget: (mealId, categoryId, value) =>
          updateSettings((settings) => withMealTarget(settings, mealId, categoryId, value)),
      }
    },
    {
      name: 'porciones',
      version: 1,
      // Solo se guardan los datos fuente; los totales se calculan en la UI.
      partialize: ({ settings, logs }): PersistedState => ({ settings, logs }),
      // Al cargar desde LocalStorage se purgan los registros de más de 30 días.
      merge: (persisted, current) => {
        const stored = persisted as Partial<PersistedState>
        return {
          ...current,
          ...stored,
          logs: purgeOldLogs(stored.logs ?? {}, todayKey()),
        }
      },
    },
  ),
)
