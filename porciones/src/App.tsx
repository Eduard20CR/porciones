import { useState } from 'react'
import { Dashboard } from './features/dashboard/Dashboard'
import { Settings } from './features/settings/Settings'

type View = 'dashboard' | 'settings'

function App() {
  const [view, setView] = useState<View>('dashboard')

  return (
    <div className="min-h-dvh bg-slate-50 text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-2xl items-center justify-between px-4 py-3">
          <h1 className="text-lg font-semibold text-slate-900">Porciones</h1>
          <button
            type="button"
            onClick={() => setView(view === 'dashboard' ? 'settings' : 'dashboard')}
            className="rounded-lg px-3 py-1.5 text-sm font-medium text-brand-600 hover:bg-brand-50"
          >
            {view === 'dashboard' ? 'Configuración' : '← Volver'}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-6">
        {view === 'dashboard' ? <Dashboard /> : <Settings />}
      </main>
    </div>
  )
}

export default App
