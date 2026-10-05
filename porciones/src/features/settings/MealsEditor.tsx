import { Card } from '../../components/Card'
import { IconButton } from '../../components/IconButton'
import { Stepper } from '../../components/Stepper'
import { TextField } from '../../components/TextField'
import { formatQuantity } from '../../domain/quantity'
import type { Category, Meal } from '../../domain/types'
import { useAppStore } from '../../store/useAppStore'
import { AddButton, SectionHeader } from './SettingsSection'

export function MealsEditor() {
  const { meals, categories } = useAppStore((state) => state.settings)
  const addMeal = useAppStore((state) => state.addMeal)
  const renameMeal = useAppStore((state) => state.renameMeal)
  const removeMeal = useAppStore((state) => state.removeMeal)
  const moveMeal = useAppStore((state) => state.moveMeal)
  const setMealTarget = useAppStore((state) => state.setMealTarget)

  return (
    <section>
      <SectionHeader title="Comidas" description="Cuánto planeas consumir de cada categoría en cada comida." />
      <div className="space-y-4">
        {meals.map((meal, index) => (
          <Card key={meal.id}>
            <div className="flex items-end gap-2">
              <TextField label="Nombre de la comida" value={meal.name} onChange={(name) => renameMeal(meal.id, name)} />
              <div className="flex pb-0.5">
                <IconButton label={`Subir ${meal.name}`} disabled={index === 0} onClick={() => moveMeal(meal.id, -1)}>
                  ↑
                </IconButton>
                <IconButton label={`Bajar ${meal.name}`} disabled={index === meals.length - 1} onClick={() => moveMeal(meal.id, 1)}>
                  ↓
                </IconButton>
                <IconButton
                  label={`Eliminar ${meal.name}`}
                  tone="danger"
                  onClick={() => {
                    if (confirm(`¿Eliminar "${meal.name}"?`)) removeMeal(meal.id)
                  }}
                >
                  ✕
                </IconButton>
              </div>
            </div>

            {categories.length === 0 ? (
              <p className="mt-3 text-sm text-slate-500">Añade categorías para definir objetivos.</p>
            ) : (
              <details className="group mt-3">
                <summary className="cursor-pointer list-none text-sm text-slate-600 [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="mr-1 inline-block text-slate-400 transition-transform group-open:rotate-90">
                    ›
                  </span>
                  {summarizeTargets(meal.targets, categories)}
                </summary>
                <ul className="mt-2 divide-y divide-slate-100">
                  {categories.map((category) => (
                    <li key={category.id} className="flex items-center justify-between gap-3 py-2">
                      <span className="truncate text-sm text-slate-700">
                        {category.name} <span className="text-xs text-slate-400">{category.unit}</span>
                      </span>
                      <Stepper
                        value={meal.targets[category.id] ?? 0}
                        step={category.step}
                        label={`Objetivo de ${category.name} en ${meal.name}`}
                        onChange={(value) => setMealTarget(meal.id, category.id, value)}
                      />
                    </li>
                  ))}
                </ul>
              </details>
            )}
          </Card>
        ))}
      </div>
      <AddButton onClick={addMeal}>+ Añadir comida</AddButton>
    </section>
  )
}

/** Ej.: "Proteínas 3 · Harinas 2" o "Sin objetivos" (se muestra con la comida plegada). */
function summarizeTargets(targets: Meal['targets'], categories: Category[]): string {
  const parts = categories
    .filter((category) => (targets[category.id] ?? 0) > 0)
    .map((category) => `${category.name} ${formatQuantity(targets[category.id])}`)
  return parts.length > 0 ? parts.join(' · ') : 'Sin objetivos'
}
