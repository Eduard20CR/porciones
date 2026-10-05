export function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <header className="mb-3">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      <p className="text-sm text-slate-500">{description}</p>
    </header>
  )
}

export function AddButton({ onClick, children }: { onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-3 rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50"
    >
      {children}
    </button>
  )
}
