interface ProgressBarProps {
  /** Fracción de avance; puede ser > 1 si se supera el objetivo. */
  progress: number
  label: string
  /** Texto que leen los lectores de pantalla, ej. "7 de 13 porc.". */
  valueText: string
}

export function ProgressBar({ progress, label, valueText }: ProgressBarProps) {
  const percent = Math.round(progress * 100)
  const color = progress > 1 ? 'bg-amber-500' : progress === 1 ? 'bg-brand-600' : 'bg-brand-500'

  return (
    <div
      role="progressbar"
      aria-label={label}
      aria-valuenow={percent}
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuetext={valueText}
      className="h-2 overflow-hidden rounded-full bg-slate-200"
    >
      <div
        className={`h-full rounded-full transition-[width] ${color}`}
        style={{ width: `${Math.min(percent, 100)}%` }}
      />
    </div>
  )
}
