import type { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
}

export function Card({ children }: CardProps) {
  return <section className="rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-200">{children}</section>
}
