import { describe, expect, it } from 'vitest'
import { addDays, parseDateKey, toDateKey } from './date'

describe('toDateKey', () => {
  it('usa la fecha local aunque sea de noche', () => {
    expect(toDateKey(new Date(2026, 9, 5, 23, 30))).toBe('2026-10-05')
  })

  it('rellena mes y día con ceros', () => {
    expect(toDateKey(new Date(2026, 0, 3))).toBe('2026-01-03')
  })
})

describe('parseDateKey', () => {
  it('es la inversa de toDateKey', () => {
    expect(toDateKey(parseDateKey('2026-02-28'))).toBe('2026-02-28')
  })
})

describe('addDays', () => {
  it('cruza meses y años', () => {
    expect(addDays('2026-01-31', 1)).toBe('2026-02-01')
    expect(addDays('2026-12-31', 1)).toBe('2027-01-01')
    expect(addDays('2026-03-01', -1)).toBe('2026-02-28')
  })

  it('maneja años bisiestos', () => {
    expect(addDays('2028-02-28', 1)).toBe('2028-02-29')
  })
})
