import { useMemo, useState } from 'react'
import { todayKey } from '../../domain/date'
import { getDailyTotals } from '../../domain/totals'
import { useAppStore } from '../../store/useAppStore'
import { DailySummary } from './DailySummary'
import { DateNav } from './DateNav'

export function Dashboard() {
  const [date, setDate] = useState(todayKey)
  const settings = useAppStore((state) => state.settings)
  const dayLog = useAppStore((state) => state.logs[date])

  const totals = useMemo(() => getDailyTotals(settings, dayLog), [settings, dayLog])

  return (
    <div className="space-y-6">
      {settings.personName && (
        <p className="text-slate-500">
          Hola, <span className="font-medium text-slate-800">{settings.personName}</span>
        </p>
      )}
      <DateNav date={date} onChange={setDate} />
      <DailySummary categories={settings.categories} totals={totals} />
    </div>
  )
}
