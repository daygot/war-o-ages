# Current State — War O' Ages

_Last updated: 2026-06-12_

## Active Goal
Migrate the design-artifact bundle into a robust, package-managed application foundation for longer-term development.

## Implementation State
- GitHub repository exists at `https://github.com/daygot/war-o-ages` (private).
- Production app shell now lives at the repo root via Vite: `index.html` → `src/main.tsx` → `src/App.tsx`.
- Stack: React, TypeScript, Vite, Vitest, Testing Library, ESLint.
- Typed game/domain modules live under `src/domain/` with deterministic campaign drafting and scoring.
- Reusable UI components live under `src/components/` and the Campaign Table feature lives under `src/features/campaign/`.
- Existing static design artifacts remain as references under `ui_kits/`, `components/`, `tokens/`, `uploads/`, `README.md`, and `DESIGN_CONTEXT.md`.

## Latest Validation Snapshot
- `npm install` completed successfully with 0 vulnerabilities.
- `npm run test` passed: 2 files / 4 tests.
- `npm run build` passed and produced `dist/`.
- `npm run lint` passed.
- Dev server smoke check: `curl -I http://127.0.0.1:5173/` returned `HTTP/1.1 200 OK`.
- Browser smoke check loaded `War O' Ages`, rendered the production Campaign Table shell, and reported no console/JS errors.

## Active Work
- None currently claimed after productionization setup is committed/pushed.

## Known Blockers / Risks
- The new production app is an architectural slice, not full feature parity with the legacy desktop prototype.
- `src/domain/game-data.ts` intentionally ports a curated starter roster, not the entire legacy `ui_kits/shared/data.js` catalog yet.
- The legacy prototype still depends on CDN React/Babel and should remain reference-only until feature parity is reached.
- Mobile remains unresolved; see `tasks/backlog/2026-06-12-audit-mobile-surface.md`.

## Recommended Next Actions
1. Port the full legacy roster, battlegrounds, ideologies, and synergy rules into typed domain modules with tests.
2. Build the actual phase interactions: wheel spin, rank-by-rank muster, ideology selection, battle reveal, verdict/share card.
3. Decide deployment target and add CI for `npm run lint`, `npm run test`, and `npm run build`.
4. Audit mobile surface availability and either restore mobile artifacts or update docs/tasks accordingly.
