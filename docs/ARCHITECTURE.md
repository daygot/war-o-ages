# Architecture Notes

War O' Ages is moving from a design-artifact bundle to a package-managed React/TypeScript application. The legacy files stay in place as reference material while new production code lives under `src/`.

## Layers

- `src/domain/` — pure game/domain model: typed regions, eras, ranks, roster, draft selection, scoring, and daily seed logic. No React imports.
- `src/components/` — reusable design-system components translated from the artifact bundle: buttons, panels, crests, tags, section rules.
- `src/features/campaign/` — product feature composition for the Campaign Table flow.
- `src/app/` — application shell, layout, and provider wiring.
- `src/styles/` — app-level CSS that imports existing tokens and adds production layout styles.

## Migration Strategy

1. Keep `ui_kits/desktop/` as the canonical visual reference until the new app reaches feature parity.
2. Port behavior into pure modules first so tests can lock down scoring/draft rules.
3. Port reusable UI components second, preserving class names and design tokens where practical.
4. Compose feature screens from typed domain data rather than `window.WOA` globals.
5. Add package-managed validation (`npm run test`, `npm run build`) before deleting or archiving any legacy artifact.

## Current App Shell

The root `index.html` loads `src/main.tsx` through Vite. This is the production path. The legacy browser-only prototype remains available at `ui_kits/desktop/index.html`.
