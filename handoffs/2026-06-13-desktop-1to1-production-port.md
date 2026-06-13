# Handoff — Desktop 1-to-1 Production Port

Date: 2026-06-13
Branch: `feat/desktop-1to1-production-port`
Status: Ready to merge/push

## Goal
Implement the canonical `ui_kits/desktop` Campaign Table design as real production code rather than the simplified shell.

## Summary
- Ported the approved desktop prototype into Vite/React production modules under `src/legacy/`.
- Wired `src/App.tsx` to render the full desktop parity flow.
- Kept typed domain data/rules as the data source through `src/legacy/legacyData.ts`.
- Added UI regression coverage for canonical intro affordances, Begin→Muster, and Books overlay.

## Files Changed
- `src/App.tsx`
- `src/App.test.tsx`
- `src/legacy/DesktopApp.jsx`
- `src/legacy/legacyData.ts`
- `src/legacy/legacyComponents.jsx`
- `src/legacy/legacyBoard.jsx`
- `src/legacy/legacyBooks.jsx`
- `tsconfig.app.json`
- `context/CURRENT.md`
- `context/ARCHITECTURE.md`
- `context/DESIGN.md`
- `tasks/active/2026-06-12-desktop-1to1-production-port.md`
- `agents/status.md`

## Decisions Made
- Preserve 1-to-1 design parity first by porting the canonical JSX prototype directly into production imports.
- Allow JS/JSX during this parity pass (`allowJs: true`, `checkJs: false`) rather than rewriting everything to TSX and risking visual/behavior drift.
- Keep `src/domain/*` as source of truth and use `legacyData.ts` as the compatibility adapter.

## Commands / Checks Run
- `npm run test` — passed, 2 files / 10 tests.
- `npm run build` — passed.
- `npm run lint` — passed.
- Browser smoke via local Vite dev server at `http://127.0.0.1:5173/` — no console/JS errors; visual layout matched parchment desktop command-table structure.

## Known Issues / Risks
- The parity modules are large `.jsx` files. They should be incrementally typed/refactored after visual parity is stable.
- A browser-tool coordinate click did not trigger Begin, but Testing Library click and in-browser event dispatch advanced to Muster; no app runtime errors were observed.
- Full manual dogfood through all five ranks, ideology choice, battle reveal, verdict/share, and Books filters remains recommended.

## Recommended Next Step
Merge this branch to `main`, push, then run a deeper manual dogfood pass and record concrete discrepancies as focused tasks.
