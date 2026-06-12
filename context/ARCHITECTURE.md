# Architecture — War O' Ages

_Last updated: 2026-06-12_

## Production Stack
- Vite application shell.
- React + TypeScript for UI and state composition.
- Vitest + Testing Library for domain and UI regression tests.
- ESLint for static quality gates.
- Existing CSS token files remain imported through `src/styles/app.css`.

## Source Layout
- `index.html` — production app entry point.
- `src/main.tsx` — React root bootstrap.
- `src/App.tsx` — app shell.
- `src/domain/` — pure typed domain model and game engine (`types.ts`, `game-data.ts`, `engine.ts`).
- `src/components/` — reusable UI/design-system components translated from artifacts.
- `src/features/campaign/` — Campaign Table feature composition.
- `src/styles/` — app-level CSS that imports the legacy token system.
- `docs/ARCHITECTURE.md` — longer-form migration/architecture notes.
- `ui_kits/` — legacy design/prototype reference, not the production app path.

## Data / Control Flow
1. Vite serves `index.html` and bundles `src/main.tsx`.
2. `CampaignTable` creates a deterministic daily campaign using pure domain functions.
3. Domain functions draft player/enemy legions, pick battlefield/ideology, and calculate score breakdowns.
4. React components render the Campaign Table shell using the existing illuminated war-atlas token language.

## Migration Strategy
1. Preserve legacy artifacts as references until parity.
2. Port domain rules first with tests.
3. Port reusable components second.
4. Compose feature screens and interactions from typed modules.
5. Add CI/deployment only once local validation is stable.

## Safety and Security Notes
- Do not commit credentials, analytics tokens, deployment secrets, or private API keys.
- Keep build artifacts (`dist/`) uncommitted.
- Treat uploaded screenshots/source artifacts as design references; verify rights before public release.
