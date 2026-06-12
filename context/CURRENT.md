# Current State — War O' Ages

_Last updated: 2026-06-12_

## Active Goal
Migrate the design-artifact bundle into a robust, package-managed application foundation for longer-term development.

## Implementation State
- GitHub repository exists at `https://github.com/daygot/war-o-ages` (private).
- Production app shell lives at the repo root via Vite: `index.html` → `src/main.tsx` → `src/App.tsx`.
- Stack: React, TypeScript, Vite, Vitest, Testing Library, ESLint.
- Typed game/domain modules live under `src/domain/` with deterministic campaign drafting and legacy-derived scoring.
- The production domain now ports the full legacy `ui_kits/shared/data.js` roster/rules catalog into TypeScript:
  - 193 typed figures.
  - 6 battlegrounds.
  - 17 War Council ideologies.
  - 11 named synergy definitions.
  - derived stats, initials, eligible positions, region/era display metadata, and tiers.
- Reusable UI components live under `src/components/` and the Campaign Table feature lives under `src/features/campaign/`.
- Existing static design artifacts remain as references under `ui_kits/`, `components/`, `tokens/`, `uploads/`, `README.md`, and `DESIGN_CONTEXT.md`.

## Latest Validation Snapshot
- `npm run test` passed: 2 files / 8 tests.
- `npm run build` passed and produced `dist/`.
- `npm run lint` passed.
- Dev server smoke check: `curl -I http://127.0.0.1:5173/` returned `HTTP/1.1 200 OK`.
- Browser smoke check loaded `War O' Ages`, rendered the production Campaign Table shell with richer domain data, and reported no console/JS errors.

## Active Work
- `feat/port-legacy-domain-rules` completed locally and ready to commit/merge/push.

## Known Blockers / Risks
- The typed domain rules are now much closer to the legacy reference, but the interactive UI still remains an architectural shell rather than full feature parity.
- The Campaign Table still needs real phase interactions: wheel spin, rank-by-rank muster, player ideology selection, battle reveal, verdict/share card.
- Mobile remains unresolved; see `tasks/backlog/2026-06-12-audit-mobile-surface.md`.

## Recommended Next Actions
1. Build the actual phase interactions: wheel spin, rank-by-rank muster, ideology selection, battle reveal, verdict/share card.
2. Add CI for `npm run lint`, `npm run test`, and `npm run build`.
3. Audit mobile surface availability and either restore mobile artifacts or update docs/tasks accordingly.
