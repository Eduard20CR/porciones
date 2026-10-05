import { Card } from '../../components/Card'
import { ProgressBar } from '../../components/ProgressBar'
import { formatQuantity } from '../../domain/quantity'
import { getProgress } from '../../domain/totals'
import type { Category, Id } from '../../domain/types'

interface DailySummaryProps {
  categories: Category[]
  totals: Record<Id, number>
}

export function DailySummary({ categories, totals }: DailySummaryProps) {
  return (
    <Card>
      <h2 className="mb-3 text-sm font-semibold tracking-wide text-slate-500 uppercase">Resumen del día</h2>
      <ul className="space-y-3">
        {categories.map((category) => {
          const consumed = totals[category.id] ?? 0
          return (
            <li key={category.id}>
              <div className="mb-1 flex items-baseline justify-between gap-2 text-sm">
                <span className="font-medium text-slate-800">{category.name}</span>
                <span className="tabular-nums text-slate-600">
                  {formatQuantity(consumed)} / {formatQuantity(category.dailyTarget)}{' '}
                  <span className="text-xs text-slate-400">{category.unit}</span>
                </span>
              </div>
              <ProgressBar
                progress={getProgress(consumed, category.dailyTarget)}
                label={category.name}
                valueText={`${formatQuantity(consumed)} de ${formatQuantity(category.dailyTarget)} ${category.unit}`}
              />
            </li>
          )
        })}
      </ul>
    </Card>
  )
}
