interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  placeholder?: string
  /** Oculta la etiqueta visualmente (sigue disponible para lectores de pantalla). */
  hideLabel?: boolean
}

export function TextField({ label, value, onChange, placeholder, hideLabel }: TextFieldProps) {
  return (
    <label className="flex min-w-0 flex-1 flex-col gap-1">
      <span className={hideLabel ? 'sr-only' : 'text-xs font-medium text-slate-500'}>{label}</span>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-lg border border-slate-200 px-3 py-1.5 focus:border-brand-500 focus:ring-2 focus:ring-brand-50 focus:outline-none"
      />
    </label>
  )
}
