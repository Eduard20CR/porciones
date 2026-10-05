import { useState } from 'react'
import { Card } from '../../components/Card'
import { Stepper } from '../../components/Stepper'
import { formatQuantity } from '../../domain/quantity'
import type { Category, Id, Meal, MealConsumption } from '../../domain/types'

interface MealCardProps {
  meal: Meal
  categories: Category[]
  consumption: MealConsumption | undefined
  onChange: (categoryId: Id, value: number) => void
}

export function MealCard({ meal, categories, consumption, onChange }: MealCardProps) {
  // Categorías sin objetivo que el usuario añadió para registrar algo no planificado.
  const [addedIds, setAddedIds] = useState<Id[]>([])

  const isVisible = (category: Category) =>
    (meal.targets[category.id] ?? 0) > 0 ||
    (consumption?.[category.id] ?? 0) > 0 ||
    addedIds.includes(category.id)

  const visible = categories.filter(isVisible)
  const hidden = categories.filter((category) => !isVisible(category))

  return (
    <Card>
      <h3 className="mb-3 font-semibold text-slate-900">{meal.name}</h3>

      {visible.length === 0 ? (
        <p className="mb-3 text-sm text-slate-500">No hay categorías planificadas para esta comida.</p>
      ) : (
        <ul className="divide-y divide-slate-100">
          {visible.map((category) => {
            const consumed = consumption?.[category.id] ?? 0
            const target = meal.targets[category.id] ?? 0
            return (
              <li key={category.id} className="flex items-center justify-between gap-3 py-2">
                <div className="min-w-0">
                  <p className="truncate font-medium text-slate-800">{category.name}</p>
                  <p className={`text-xs ${consumed > target ? 'text-amber-600' : 'text-slate-500'}`}>
                    {target > 0 ? `Objetivo: ${formatQuantity(target)} ${category.unit}` : 'Sin objetivo'}
                    {target > 0 && consumed === target && ' ✓'}
                  </p>
                </div>
                <Stepper
                  value={consumed}
                  step={category.step}
                  label={`${category.name} en ${meal.name}`}
                  onChange={(value) => onChange(category.id, value)}
                />
              </li>
            )
          })}
        </ul>
      )}

      {hidden.length > 0 && (
        <select
          aria-label={`Añadir categoría a ${meal.name}`}
          value=""
          onChange={(event) => setAddedIds([...addedIds, event.target.value])}
          className="mt-2 rounded-lg px-2 py-1 text-sm font-medium text-brand-600 hover:bg-brand-50"
        >
          <option value="" disabled>
            + Añadir categoría
          </option>
          {hidden.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
      )}
    </Card>
  )
}
