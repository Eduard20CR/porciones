import { describe, expect, it } from 'vitest'
import { formatQuantity, normalizeQuantity } from './quantity'

describe('normalizeQuantity', () => {
  it('no permite negativos', () => {
    expect(normalizeQuantity(-1)).toBe(0)
  })

  it('elimina ruido de flotantes', () => {
    expect(normalizeQuantity(0.1 + 0.2)).toBe(0.3)
  })

  it('trata valores no finitos como 0', () => {
    expect(normalizeQuantity(Number.NaN)).toBe(0)
  })

  it('mantiene valores válidos', () => {
    expect(normalizeQuantity(2.75)).toBe(2.75)
  })
})

describe('formatQuantity', () => {
  it('usa coma decimal y omite decimales innecesarios', () => {
    expect(formatQuantity(0.75)).toBe('0,75')
    expect(formatQuantity(13)).toBe('13')
  })
})
