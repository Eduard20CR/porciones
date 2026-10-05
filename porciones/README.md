# Porciones

Tracker de porciones diarias basado en un plan nutricional. Cada comida tiene un objetivo por categoría
(proteínas, harinas, líquidos…) y se registra lo que realmente se consumió. El resumen diario se calcula
sumando todas las comidas.

Sin backend: la configuración y los registros se guardan en `localStorage`. Los registros de más de 30 días
se eliminan al abrir la app.

## Scripts

```bash
npm install
npm run dev         # servidor de desarrollo
npm test            # tests (vitest)
npm run lint        # oxlint
npm run build       # typecheck + build de producción
```

## Stack

React 19 · TypeScript · Vite · Zustand (`persist`) · Tailwind CSS v4 · Vitest

## Arquitectura

Las dependencias van en un solo sentido: **UI → store → domain**.

```
src/
  domain/      Tipos y funciones puras (totales, fechas, retención, edición inmutable). Sin React ni Zustand.
  store/       Un store de Zustand con persistencia en localStorage. Las acciones delegan en domain/.
  components/  UI genérica sin lógica de negocio (Card, Stepper, ProgressBar…).
  features/
    dashboard/ Navegación de fecha, resumen diario y tarjetas de comida.
    settings/  Nombre, categorías y comidas.
```

Principios:

- **Solo se guardan datos fuente**: la configuración y el consumo por fecha → comida → categoría.
  Los totales y el progreso se calculan al renderizar (`domain/totals.ts`).
- **Los valores 0 no se guardan**, y los IDs de categorías o comidas eliminadas se ignoran al calcular.
- **Las fechas son locales** (`YYYY-MM-DD`), nunca `toISOString()`, que usa UTC.
- La fecha seleccionada y la vista actual son estado local de React, no global.

## Modelo de datos

```ts
Settings = { personName, categories: Category[], meals: Meal[] }
Category = { id, name, unit, dailyTarget, step }
Meal     = { id, name, targets: { [categoryId]: number } }
Logs     = { [date]: { meals: { [mealId]: { [categoryId]: number } } } }
```

Se persiste en `localStorage` con la clave `porciones` (`version: 1`). Si el esquema cambia, sube la versión y
añade `migrate` en `src/store/useAppStore.ts`.
