import { useEffect, useRef, useState } from 'react'
import { IconButton } from '../../components/IconButton'
import { NOTE_MAX_LENGTH } from '../../domain/logs'

interface NoteDialogProps {
  /** Fecha ya formateada para mostrarla en el encabezado. */
  dateLabel: string
  initialNote: string
  onSave: (note: string) => void
  onClose: () => void
}

// Modal para escribir la nota del día: se abre al montarse y solo guarda al pulsar «Guardar».
export function NoteDialog({ dateLabel, initialNote, onSave, onClose }: NoteDialogProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [note, setNote] = useState(initialNote)

  useEffect(() => {
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const save = () => {
    onSave(note)
    onClose()
  }

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        // Clic en el fondo cierra sin guardar
        if (e.target === e.currentTarget) onClose()
      }}
      aria-labelledby="note-dialog-title"
      className="m-auto w-[92vw] max-w-md overflow-hidden rounded-2xl bg-white p-0 shadow-xl backdrop:bg-black/50 backdrop:backdrop-blur-[2px]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          save()
        }}
        className="flex flex-col"
      >
        <div className="flex items-start gap-3 bg-brand-50 px-4 pt-4 pb-3">
          <span aria-hidden className="mt-0.5 text-xl">📝</span>
          <div className="flex-1">
            <h2 id="note-dialog-title" className="font-semibold text-slate-900">
              Nota del día
            </h2>
            <p className="text-xs text-slate-500 first-letter:uppercase">{dateLabel}</p>
          </div>
          <IconButton label="Cerrar" onClick={onClose}>
            ✕
          </IconButton>
        </div>

        <div className="px-4 pt-3">
          <textarea
            autoFocus
            value={note}
            maxLength={NOTE_MAX_LENGTH}
            rows={5}
            placeholder="¿Cómo te fue hoy? Antojos, ejercicio, cómo te sentiste…"
            onChange={(e) => setNote(e.target.value)}
            onKeyDown={(e) => {
              // Ctrl/Cmd + Enter guarda
              if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                e.preventDefault()
                save()
              }
            }}
            aria-label="Nota del día"
            className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm leading-relaxed text-slate-800 placeholder:text-slate-400 focus:border-brand-500 focus:bg-white focus:ring-2 focus:ring-brand-50 focus:outline-none"
          />
          <p className="mt-1 text-right text-xs tabular-nums text-slate-400">
            {note.length} / {NOTE_MAX_LENGTH}
          </p>
        </div>

        <div className="flex items-center gap-2 px-4 pt-2 pb-4">
          {initialNote && (
            <button
              type="button"
              onClick={() => {
                onSave('')
                onClose()
              }}
              className="rounded-lg px-3 py-2 text-sm font-medium text-red-500 hover:bg-red-50"
            >
              Borrar
            </button>
          )}
          <div className="flex-1" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="rounded-lg bg-brand-600 px-4 py-2 text-sm font-medium text-white hover:bg-brand-500"
          >
            Guardar
          </button>
        </div>
      </form>
    </dialog>
  )
}
