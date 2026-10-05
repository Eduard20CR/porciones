import { useEffect, useRef, useState } from 'react'
import { IconButton } from './IconButton'

const MIN_ZOOM = 1
const MAX_ZOOM = 4
const ZOOM_STEP = 0.5

interface ImageViewerProps {
  src: string
  alt: string
  title: string
  onClose: () => void
}

// Visor modal: se abre al montarse. El zoom agranda la imagen y el scroll nativo permite recorrerla.
export function ImageViewer({ src, alt, title, onClose }: ImageViewerProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const [zoom, setZoom] = useState(MIN_ZOOM)

  useEffect(() => {
    // Al desmontarse, el dialog sale del DOM y se cierra solo
    const dialog = dialogRef.current
    if (dialog && !dialog.open) dialog.showModal()
  }, [])

  const changeZoom = (delta: number) => setZoom((z) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z + delta)))

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        // Clic en el fondo (fuera del contenido) cierra el visor
        if (e.target === e.currentTarget) onClose()
      }}
      className="m-auto hidden h-[90dvh] w-[95vw] max-w-3xl flex-col overflow-hidden rounded-2xl open:flex bg-white p-0 shadow-xl backdrop:bg-black/60"
    >
      <div className="flex items-center gap-1 border-b border-slate-200 px-3 py-2">
        <h2 className="flex-1 text-sm font-semibold text-slate-800">{title}</h2>
        <IconButton label="Alejar" onClick={() => changeZoom(-ZOOM_STEP)} disabled={zoom <= MIN_ZOOM}>
          −
        </IconButton>
        <button
          type="button"
          onClick={() => setZoom(MIN_ZOOM)}
          title="Restablecer zoom"
          className="w-14 rounded-lg py-1 text-xs tabular-nums text-slate-600 hover:bg-slate-100"
        >
          {Math.round(zoom * 100)}%
        </button>
        <IconButton label="Acercar" onClick={() => changeZoom(ZOOM_STEP)} disabled={zoom >= MAX_ZOOM}>
          +
        </IconButton>
        <IconButton label="Cerrar" onClick={onClose}>
          ✕
        </IconButton>
      </div>
      <div className="flex-1 overflow-auto">
        <img
          src={src}
          alt={alt}
          onDoubleClick={() => setZoom((z) => (z === MIN_ZOOM ? 2 : MIN_ZOOM))}
          style={{ width: `${zoom * 100}%` }}
          className="max-w-none select-none"
        />
      </div>
    </dialog>
  )
}
