import { useMemo } from 'react'
import { Card } from '../../components/Card'
import { IconButton } from '../../components/IconButton'
import { QuantityInput } from '../../components/QuantityInput'
import { Stepper } from '../../components/Stepper'
import { TextField } from '../../components/TextField'
import { formatQuantity } from '../../domain/quantity'
import { getMealTargetSums } from '../../domain/settings'
import { useAppStore } from '../../store/useAppStore'
import { AddButton, SectionHeader } from './SettingsSection'

export function CategoriesEditor() {
  const settings = useAppStore((state) => state.settings)
  const addCategory = useAppStore((state) => state.addCategory)
  const updateCategory = useAppStore((state) => state.updateCategory)
  const removeCategory = useAppStore((state) => state.removeCategory)
  const moveCategory = useAppStore((state) => state.moveCategory)

  const mealSums = useMemo(() => getMealTargetSums(settings), [settings])
  const { categories } = settings

  return (
    <section>
      <SectionHeader title="Categorías" description="Objetivo diario de cada grupo de alimentos." />
      <Card>
        {categories.length === 0 && <p className="text-sm text-slate-500">Todavía no hay categorías.</p>}
        <ul className="divide-y divide-slate-100">
          {categories.map((category, index) => {
            const mealSum = mealSums[category.id] ?? 0
            return (
              <li key={category.id} className="space-y-3 py-4 first:pt-0 last:pb-0">
                <div className="flex items-end gap-2">
                  <TextField
                    label="Nombre"
                    value={category.name}
                    onChange={(name) => updateCategory(category.id, { name })}
                  />
                  <div className="w-24 shrink-0">
                    <TextField
                      label="Unidad"
                      value={category.unit}
                      onChange={(unit) => updateCategory(category.id, { unit })}
                    />
                  </div>
                  <div className="flex pb-0.5">
                    <IconButton label={`Subir ${category.name}`} disabled={index === 0} onClick={() => moveCategory(category.id, -1)}>
                      ↑
                    </IconButton>
                    <IconButton
                      label={`Bajar ${category.name}`}
                      disabled={index === categories.length - 1}
                      onClick={() => moveCategory(category.id, 1)}
                    >
                      ↓
                    </IconButton>
                    <IconButton
                      label={`Eliminar ${category.name}`}
                      tone="danger"
                      onClick={() => {
                        if (confirm(`¿Eliminar "${category.name}"? También se quitará de los objetivos de las comidas.`)) {
                          removeCategory(category.id)
                        }
                      }}
                    >
                      ✕
                    </IconButton>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Objetivo diario</span>
                    <Stepper
                      value={category.dailyTarget}
                      step={category.step}
                      label={`Objetivo diario de ${category.name}`}
                      onChange={(dailyTarget) => updateCategory(category.id, { dailyTarget })}
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium text-slate-500">Incremento</span>
                    <QuantityInput
                      value={category.step}
                      label={`Incremento de ${category.name}`}
                      onChange={(step) => updateCategory(category.id, { step })}
                    />
                  </div>
                </div>

                {mealSum !== category.dailyTarget && (
                  <p className="text-xs text-amber-600">
                    Las comidas suman {formatQuantity(mealSum)} de {formatQuantity(category.dailyTarget)}{' '}
                    {category.unit}
                  </p>
                )}
              </li>
            )
          })}
        </ul>
        <AddButton onClick={addCategory}>+ Añadir categoría</AddButton>
      </Card>
    </section>
  )
}
