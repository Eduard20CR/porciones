import { useMemo, useState } from 'react'
import { Card } from '../../components/Card'
import { todayKey } from '../../domain/date'
import { getDailyTotals } from '../../domain/totals'
import { useAppStore } from '../../store/useAppStore'
import { DailySummary } from './DailySummary'
import { DateNav } from './DateNav'
import { MealCard } from './MealCard'

interface DashboardProps {
  onOpenSettings: () => void
}

export function Dashboard({ onOpenSettings }: DashboardProps) {
  const [date, setDate] = useState(todayKey)
  const settings = useAppStore((state) => state.settings)
  const dayLog = useAppStore((state) => state.logs[date])
  const setConsumption = useAppStore((state) => state.setConsumption)

  const totals = useMemo(() => getDailyTotals(settings, dayLog), [settings, dayLog])

  return (
    <div className="space-y-6">
      {settings.personName && (
        <p className="text-slate-500">
          Hola, <span className="font-medium text-slate-800">{settings.personName}</span>
        </p>
      )}
      <DateNav date={date} onChange={setDate} />

      {settings.categories.length === 0 || settings.meals.length === 0 ? (
        <Card>
          <p className="text-slate-600">
            Para empezar, configura al menos una categoría y una comida.
          </p>
          <button
            type="button"
            onClick={onOpenSettings}
            className="mt-3 rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            Ir a configuración
          </button>
        </Card>
      ) : (
        <DailySummary categories={settings.categories} totals={totals} />
      )}

      <div className="space-y-4">
        {settings.meals.map((meal) => (
          <MealCard
            // La fecha en la key reinicia las categorías añadidas al cambiar de día.
            key={`${date}:${meal.id}`}
            meal={meal}
            categories={settings.categories}
            consumption={dayLog?.meals[meal.id]}
            onChange={(categoryId, value) => setConsumption(date, meal.id, categoryId, value)}
          />
        ))}
      </div>
    </div>
  )
}
