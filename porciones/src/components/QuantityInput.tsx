import { useState } from 'react'
import { formatQuantity, parseQuantity } from '../domain/quantity'

interface QuantityInputProps {
  value: number
  label: string
  onChange: (value: number) => void
}

/** Input numérico que acepta "1,5" o "1.5". Confirma al salir o con Enter; Escape cancela. */
export function QuantityInput({ value, label, onChange }: QuantityInputProps) {
  // null = mostrando el valor recibido; string = el usuario está escribiendo.
  const [draft, setDraft] = useState<string | null>(null)

  // Lee el valor del input y no de `draft`, que podría no estar actualizado todavía al salir.
  const commit = (text: string) => {
    if (draft === null && text === formatQuantity(value)) return
    const parsed = parseQuantity(text)
    if (parsed !== null) onChange(parsed)
    setDraft(null)
  }

  return (
    <input
      type="text"
      inputMode="decimal"
      aria-label={label}
      value={draft ?? formatQuantity(value)}
      onFocus={(event) => event.target.select()}
      onChange={(event) => setDraft(event.target.value)}
      onBlur={(event) => commit(event.currentTarget.value)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') event.currentTarget.blur()
        if (event.key === 'Escape') setDraft(null)
      }}
      className="w-14 rounded-lg border border-slate-200 py-1.5 text-center tabular-nums focus:border-brand-500 focus:ring-2 focus:ring-brand-50 focus:outline-none"
    />
  )
}
