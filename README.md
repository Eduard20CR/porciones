# Porciones

**Live app:** https://porciones-dieta.netlify.app/

A daily portion tracker for people following a portion-based nutrition plan ("1 milk, 2 fruits, 8 starches…").
You set a daily target for each food group and split it across your meals. Then you log what you actually ate,
and the app shows how close you are to each target.

The app runs entirely in the browser. There are no accounts and no server, and your data stays on your device.
The interface is in Spanish.

## Features

### Daily dashboard

- **Daily summary**: one progress bar per food group, showing consumed vs. daily target (e.g. `5 / 8 porc.`).
  It is the sum of all meals of the day.
- **Meal cards**: each meal lists the categories planned for it with their target, plus a − / + stepper
  to log what you ate.
  - A ✓ appears when you hit a meal's target exactly. The text turns amber when you go over it.
  - **+ Añadir categoría** lets you log something you didn't plan for that meal.
- **Date navigation**: move to the previous or next day, or jump back to today, to review or fix past entries.

### Settings

- **Your name**, shown as a greeting on the dashboard.
- **Categories** (food groups): name, unit (`porc.`, `L`, `g`…), daily target, and stepper increment
  (e.g. `1` for portions, `0.25` for liters). Categories can be reordered and deleted.
  A warning appears when a category's meal targets don't add up to its daily target.
- **Meals**: name and per-category target for each meal. Meals can be added, reordered and deleted.

### Data and privacy

- Everything is saved automatically in the browser's `localStorage`. Nothing is sent anywhere.
- Logs older than **30 days** are deleted when the app opens.
- Data is per browser and per device. Clearing site data resets the app to the default plan.

### Default plan

New users start with an example plan that they can edit in Settings:

| Category  | Daily target |
| --------- | ------------ |
| Leches    | 1 porc.      |
| Frutas    | 2 porc.      |
| Vegetales | 3 porc.      |
| Harinas   | 8 porc.      |
| Proteínas | 13 porc.     |
| Grasas    | 4 porc.      |
| Líquidos  | 3 L          |

The default meals are Desayuno, Almuerzo, Merienda and Cena. The plan is defined in `src/domain/defaults.ts`.

## Getting started

Requires Node.js and npm.

```bash
npm install
npm run dev          # start the dev server
npm test             # run tests once (Vitest)
npm run test:watch   # tests in watch mode
npm run lint         # lint (oxlint)
npm run build        # typecheck + production build into dist/
npm run preview      # serve the production build locally
```

## Tech stack

React 19 · TypeScript · Vite · Zustand (with `persist`) · Tailwind CSS v4 · Vitest · oxlint

## Architecture

Dependencies flow in one direction: **UI → store → domain**.

```
src/
  domain/      Types and pure functions (totals, dates, retention, immutable edits). No React or Zustand.
  store/       A single Zustand store persisted to localStorage. Actions delegate to domain/.
  components/  Generic UI with no business logic (Card, Stepper, ProgressBar…).
  features/
    dashboard/ Date navigation, daily summary and meal cards.
    settings/  Name, categories and meals.
```

Design principles:

- **Only source data is stored**: the settings, and consumption by date → meal → category.
  Totals and progress are computed at render time (`domain/totals.ts`).
- **Zero values are never stored.** IDs of deleted categories or meals that remain in old logs are ignored
  when computing totals.
- **Dates are local** (`YYYY-MM-DD`). Never use `toISOString()`, which uses UTC.
- The selected date and the current view are local React state, not global state.

## Data model

```ts
Settings = { personName, categories: Category[], meals: Meal[] }
Category = { id, name, unit, dailyTarget, step }
Meal     = { id, name, targets: { [categoryId]: number } }
Logs     = { [date]: { meals: { [mealId]: { [categoryId]: number } } } }
```

State is persisted in `localStorage` under the key `porciones` (`version: 1`). If the schema changes, bump the
version and add a `migrate` function in `src/store/useAppStore.ts`.
