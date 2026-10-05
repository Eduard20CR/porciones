# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Porciones is a client-only daily portion tracker built from a nutrition plan (React 19, TypeScript, Vite, Zustand `persist`, Tailwind CSS v4, Vitest). Each meal has a target per category (proteins, starches, liquids…), the user logs what they actually ate, and the daily summary is the sum across meals. There is no backend: everything lives in `localStorage`.

The UI text, code comments, and test descriptions are written in **Spanish**. Keep new ones in Spanish.

## Commands

```bash
npm run dev                          # Vite dev server
npm test                             # vitest run (all tests)
npx vitest run src/domain/totals.test.ts   # single file
npx vitest run -t "nombre del test"        # tests matching a name
npm run test:watch                   # vitest watch mode
npm run lint                         # oxlint (.oxlintrc.json)
npm run build                        # tsc -b typecheck + vite build
```

Tests run in Node (no jsdom). There are no component tests; tests cover `src/domain/` and the store.

## Architecture

Dependencies flow one way: **UI (`features/`, `components/`) → `store/` → `domain/`**.

- `src/domain/`: pure functions and types with no React or Zustand imports. All business rules live here: immutable edits to settings and logs, totals, dates, retention, and quantity parsing and formatting.
- `src/store/useAppStore.ts`: the single Zustand store. Each action is a thin wrapper that hands its state change to a `domain/` function. New logic belongs in `domain/` with a test, not inline in the store.
- `src/components/`: generic UI with no business logic.
- `src/features/dashboard` and `src/features/settings`: the two views. `App.tsx` switches between them with local `useState`. There is no router. The selected date is also local React state, not store state.

### Invariants to preserve

- **Only source data is persisted**: `settings` and `logs` (date → mealId → categoryId → quantity). Totals and progress are derived at render time (`domain/totals.ts`). Don't store computed values.
- **Zero values are never stored.** `withConsumption` (`domain/logs.ts`) deletes zero entries and prunes empty meals and days.
- **Orphan IDs are tolerated.** Logs may reference deleted meals or categories. Totals iterate over the current `settings` and ignore the rest, so deleting from settings doesn't require cleaning up logs.
- **Dates are local `YYYY-MM-DD` strings** (`domain/date.ts`). Never use `toISOString()` (UTC). Date keys sort correctly as strings, and `retention.ts` relies on that.
- **Quantities** go through `normalizeQuantity` (clamped to ≥ 0, rounded to 3 decimals to remove float noise). User input accepts `,` or `.` (`parseQuantity`). Display uses the `es` locale without thousands grouping (`formatQuantity`).
- Array order of `settings.categories` and `settings.meals` is the on-screen order (`moveById`).

### Persistence

The `localStorage` key is `porciones`, with `version: 1`. `partialize` saves only `{ settings, logs }`. `merge` purges logs older than 30 days (`RETENTION_DAYS`) on hydration. If the persisted schema changes, bump `version` and add a `migrate` in `useAppStore.ts`.

Store tests (`useAppStore.test.ts`) stub `window.localStorage` with `vi.stubGlobal`. They re-import the store after `vi.resetModules()` so each test hydrates from fresh storage. Follow the same pattern when testing persistence.

## Styling

Tailwind v4 is configured through `@tailwindcss/vite`, so there is no `tailwind.config`. Custom colors (`brand-50/500/600`) are defined in the `@theme` block of `src/index.css`.
