import type { Id } from './types'

/**
 * No usamos `crypto.randomUUID()` porque solo existe en contextos seguros (https/localhost)
 * y fallaría al abrir el servidor de desarrollo desde el móvil por IP local.
 */
export function createId(): Id {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}
