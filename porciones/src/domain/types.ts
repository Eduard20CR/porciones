export type Id = string

/** Fecha local en formato 'YYYY-MM-DD'. */
export type DateKey = string

export interface Category {
  id: Id
  name: string
  unit: string
  dailyTarget: number
  /** Incremento de los botones − / + (1 para porciones, 0.25 para litros). */
  step: number
}

export interface Meal {
  id: Id
  name: string
  /** categoryId -> objetivo de esa categoría en esta comida. */
  targets: Record<Id, number>
}

export interface Settings {
  personName: string
  /** El orden del array es el orden en pantalla. */
  categories: Category[]
  meals: Meal[]
}

/** categoryId -> cantidad consumida. */
export type MealConsumption = Record<Id, number>

export interface DayLog {
  /** mealId -> consumo real de esa comida. */
  meals: Record<Id, MealConsumption>
}

export type Logs = Record<DateKey, DayLog>
