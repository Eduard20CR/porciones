import type { ReactNode } from 'react'
import { addDays, formatDateKey, todayKey } from '../../domain/date'
import type { DateKey } from '../../domain/types'

interface DateNavProps {
  date: DateKey
  onChange: (date: DateKey) => void
}

export function DateNav({ date, onChange }: DateNavProps) {
  const isToday = date === todayKey()

  return (
    <nav className="flex items-center justify-between gap-2" aria-label="Seleccionar día">
      <NavButton label="Día anterior" onClick={() => onChange(addDays(date, -1))}>
        ‹
      </NavButton>

      <div className="flex flex-col items-center text-center">
        <span className="font-medium text-slate-900 first-letter:uppercase">{formatDateKey(date)}</span>
        {isToday ? (
          <span className="text-xs text-slate-500">Hoy</span>
        ) : (
          <button
            type="button"
            onClick={() => onChange(todayKey())}
            className="text-xs font-medium text-brand-600 hover:underline"
          >
            Volver a hoy
          </button>
        )}
      </div>

      <NavButton label="Día siguiente" onClick={() => onChange(addDays(date, 1))}>
        ›
      </NavButton>
    </nav>
  )
}

interface NavButtonProps {
  label: string
  onClick: () => void
  children: ReactNode
}

function NavButton({ label, onClick, children }: NavButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-10 shrink-0 items-center justify-center rounded-full text-2xl text-slate-600 hover:bg-slate-200"
    >
      {children}
    </button>
  )
}
