# Current State — War O' Ages

_Last updated: 2026-06-13_

## Active Goal
Production app now targets 1-to-1 desktop Campaign Table parity with the canonical `ui_kits/desktop/index.html` / `desktop-app.js` design.

## Implementation State
- GitHub repository exists at `https://github.com/daygot/war-o-ages` (private).
- Production app shell lives at the repo root via Vite: `index.html` → `src/main.tsx` → `src/App.tsx`.
- Stack: React, TypeScript, Vite, Vitest, Testing Library, ESLint.
- `src/App.tsx` now renders the canonical desktop Campaign Table production port from `src/legacy/DesktopApp.jsx`.
- `src/legacy/` contains the production-bundled version of the approved desktop prototype:
  - `DesktopApp.jsx` — full desktop flow: Intro, Muster, Council, Battle, Verdict.
  - `legacyData.ts` — adapter from typed `src/domain/*` data/rules into the legacy `WOA` shape expected by the prototype flow.
  - `legacyComponents.jsx`, `legacyBoard.jsx`, `legacyBooks.jsx` — component, board/wheel, terrain, and Books overlay modules ported from `ui_kits/shared/` and `ui_kits/desktop/` into Vite imports.
- Typed game/domain modules remain under `src/domain/` with the full legacy catalog already ported:
  - 193 typed figures.
  - 6 battlegrounds.
  - 17 War Council ideologies.
  - 11 named synergy definitions.
  - derived stats, initials, eligible positions, region/era display metadata, and tiers.
- Earlier simplified production components under `src/components/` and `src/features/campaign/` remain in the repo but are no longer the active app path.
- Original static design artifacts remain as references under `ui_kits/`, `components/`, `tokens/`, `uploads/`, `README.md`, and `DESIGN_CONTEXT.md`.

## Latest Validation Snapshot
- `npm run test` passed: 2 files / 10 tests.
- `npm run build` passed and produced `dist/`.
- `npm run lint` passed.
- Browser smoke check loaded `http://127.0.0.1:5173/`, rendered the parchment desktop command-table design, showed no console/JS errors, opened the Muster screen through the app event path, and confirmed the visual layout: top command bar, left legion rail, center battlefield/war-map area, right enemy warband rail, and Books button.

## Active Work
- Desktop 1-to-1 production port is ready to merge/push after final commit.

## Known Blockers / Risks
- This is intentionally a direct production port of the canonical desktop prototype. Some modules remain `.jsx` with `allowJs` enabled to keep the approved design faithful and avoid a risky rewrite during the parity pass.
- Browser tool coordinate click did not advance the Begin button, but Testing Library click and in-browser event dispatch both advanced to Muster; top phase navigation also works. No runtime console errors were observed.
- Mobile remains unresolved; see `tasks/backlog/2026-06-12-audit-mobile-surface.md`.

## Recommended Next Actions
1. Run a deeper manual dogfood pass through full rank filling, ideology choice, battle reveal, verdict, and Books filtering.
2. Convert `src/legacy/*.jsx` to typed `.tsx` incrementally once visual/behavior parity is stable.
3. Add CI for `npm run lint`, `npm run test`, and `npm run build`.
4. Audit mobile surface availability and either restore mobile artifacts or update docs/tasks accordingly.
