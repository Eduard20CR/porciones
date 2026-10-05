import { describe, expect, it } from 'vitest'
import { formatQuantity, normalizeQuantity, parseQuantity } from './quantity'

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

describe('parseQuantity', () => {
  it('acepta coma o punto decimal', () => {
    expect(parseQuantity('1,5')).toBe(1.5)
    expect(parseQuantity(' 2.25 ')).toBe(2.25)
  })

  it('vacío es 0 y texto inválido es null', () => {
    expect(parseQuantity('')).toBe(0)
    expect(parseQuantity('abc')).toBeNull()
  })
})

describe('formatQuantity + parseQuantity', () => {
  it('ida y vuelta sin perder valores grandes o decimales', () => {
    for (const value of [0, 0.25, 1.5, 13, 10000, 12345.678]) {
      expect(parseQuantity(formatQuantity(value))).toBe(value)
    }
  })
})
