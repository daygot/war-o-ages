# Architecture — War O' Ages

_Last updated: 2026-06-13_

## Production Stack
- Vite application shell.
- React + TypeScript for app bootstrap, tests, and domain modules.
- JSX modules are temporarily allowed for the direct desktop parity port.
- Vitest + Testing Library for domain and UI regression tests.
- ESLint for static quality gates.
- GitHub Actions deploys the static `dist/` artifact to GitHub Pages at `https://daygot.github.io/war-o-ages/`.
- Existing CSS token files remain imported through `src/styles/app.css` → `../../styles.css`.

## Source Layout
- `index.html` — production app entry point.
- `src/main.tsx` — React root bootstrap.
- `src/App.tsx` — app shell; currently renders `src/legacy/DesktopApp.jsx`.
- `src/domain/` — pure typed domain model and game engine (`types.ts`, `game-data.ts`, `engine.ts`).
- `src/legacy/` — Vite-bundled desktop parity port from the approved design prototype:
  - `legacyData.ts` adapts typed domain exports to the prototype's `WOA` API shape.
  - `legacyComponents.jsx` ports crests, cards, stats, banners, wax seals, and shared primitives.
  - `legacyBoard.jsx` ports the formation board, terrain backdrops, war table, and Wheel of Ages.
  - `legacyBooks.jsx` ports the Books/codex overlay.
  - `DesktopApp.jsx` composes the full desktop flow and state machine.
- `src/components/` and `src/features/campaign/` — earlier simplified typed production slice retained for future refactor/reference, not currently rendered by `App`.
- `src/styles/` — app-level CSS that imports the legacy token system.
- `ui_kits/` — legacy design/prototype reference; no longer required at runtime for the production app path.

## Data / Control Flow
1. Vite serves `index.html` and bundles `src/main.tsx`; local builds use `/`, GitHub Actions builds use `/war-o-ages/` for GitHub Pages asset paths.
2. `App` renders the desktop parity `DesktopApp`.
3. `DesktopApp` owns campaign UI state: intro, muster/spin, council, battle, result, Books overlay, seed, enemy, battleground, ideology, rerolls, and twist.
4. `legacyData.ts` delegates domain behavior to `src/domain/engine.ts` and domain catalog data from `src/domain/game-data.ts`, then exposes the legacy-friendly shape consumed by the ported design components.
5. React components render the canonical illuminated war-atlas / command-table visual system using imported token CSS.

## Migration Strategy
1. Preserve legacy artifacts as references until parity is proven.
2. Port domain rules with tests.
3. Port the approved desktop prototype into production imports for a 1-to-1 behavioral/visual baseline.
4. Dogfood parity and fix concrete discrepancies.
5. Incrementally type/refactor the JSX parity modules to TSX without changing visible behavior.
6. Maintain GitHub Pages CI/deployment with test, lint, build, and Pages artifact upload.

## Safety and Security Notes
- Do not commit credentials, analytics tokens, deployment secrets, or private API keys.
- Keep build artifacts (`dist/`) uncommitted.
- Treat uploaded screenshots/source artifacts as design references; verify rights before public release.

## Typed Legacy Domain Port
- `src/domain/game-data.ts` is the production TypeScript home for the legacy `window.WOA` catalog. It exports the full roster, battlegrounds, ideologies, stat labels, tag stat modifiers, and synergy definitions.
- `src/domain/engine.ts` owns pure behavior: position pools, figure power, named synergy detection, battleground multipliers, ideology effects, deterministic drafting, scoring, and grading.
- `src/legacy/legacyData.ts` is the only compatibility adapter between typed domain modules and the direct desktop prototype port.
