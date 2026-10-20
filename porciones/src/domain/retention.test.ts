import { describe, expect, it } from 'vitest'
import { purgeOldLogs } from './retention'
import type { Logs } from './types'

const day = { meals: {} }

describe('purgeOldLogs', () => {
  it('borra los registros de más de 365 días', () => {
    const logs: Logs = { '2025-08-01': day, '2025-10-04': day, '2025-10-05': day, '2026-10-05': day }
    expect(Object.keys(purgeOldLogs(logs, '2026-10-05'))).toEqual(['2025-10-05', '2026-10-05'])
  })

  it('conserva fechas futuras', () => {
    const logs: Logs = { '2026-10-10': day }
    expect(purgeOldLogs(logs, '2026-10-05')).toHaveProperty('2026-10-10')
  })

  it('devuelve el mismo objeto si no hay nada que borrar', () => {
    const logs: Logs = { '2026-10-01': day }
    expect(purgeOldLogs(logs, '2026-10-05')).toBe(logs)
  })
})
