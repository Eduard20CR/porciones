interface IconButtonProps {
  label: string
  onClick: () => void
  disabled?: boolean
  tone?: 'default' | 'danger'
  children: string
}

export function IconButton({ label, onClick, disabled, tone = 'default', children }: IconButtonProps) {
  const color = tone === 'danger' ? 'text-red-500 hover:bg-red-50' : 'text-slate-500 hover:bg-slate-100'
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-8 shrink-0 items-center justify-center rounded-lg disabled:opacity-30 disabled:hover:bg-transparent ${color}`}
    >
      {children}
    </button>
  )
}
