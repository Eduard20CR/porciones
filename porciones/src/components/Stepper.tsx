import { QuantityInput } from './QuantityInput'

interface StepperProps {
  value: number
  step: number
  label: string
  onChange: (value: number) => void
}

/** `− [cantidad] +`. */
export function Stepper({ value, step, label, onChange }: StepperProps) {
  return (
    <div className="flex items-center gap-1">
      <StepButton label={`Restar ${label}`} disabled={value <= 0} onClick={() => onChange(value - step)}>
        −
      </StepButton>
      <QuantityInput value={value} label={label} onChange={onChange} />
      <StepButton label={`Sumar ${label}`} onClick={() => onChange(value + step)}>
        +
      </StepButton>
    </div>
  )
}

interface StepButtonProps {
  label: string
  disabled?: boolean
  onClick: () => void
  children: string
}

function StepButton({ label, disabled, onClick, children }: StepButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex size-9 items-center justify-center rounded-full bg-slate-100 text-lg text-slate-700 hover:bg-slate-200 disabled:opacity-40 disabled:hover:bg-slate-100"
    >
      {children}
    </button>
  )
}
