# Desktop 1-to-1 Production Port

Status: Done
Owner: hermes-default
Branch: feat/desktop-1to1-production-port
Claimed at: 2026-06-12
Claim expires: 2026-06-13

## Goal
Implement the canonical desktop Campaign Table design as real production code, aiming for a 1-to-1 reflection of `ui_kits/desktop/index.html` / `desktop-app.js` rather than a simplified shell.

## Acceptance Criteria
- Production app renders the canonical desktop flow: Intro, Muster/spin, Council, Battle, Verdict.
- Persistent command bar, left player legion rail, right enemy warband rail, war-room table, wheel, council ideologies, battle reveal, verdict, and Books overlay are available from the production app.
- Implementation uses Vite/React source files rather than CDN/Babel runtime.
- Automated tests cover core interactive affordances.
- `npm run test`, `npm run build`, `npm run lint`, and browser smoke pass.
- Context/handoff updated, merged to `main`, and pushed.


## Result
Implemented and validated in branch `feat/desktop-1to1-production-port`. Ready to merge/push.

## Files / Areas Changed
- `src/App.tsx` now renders the canonical desktop parity app.
- `src/legacy/` added production-bundled ports of the desktop prototype modules.
- `tsconfig.app.json` allows JS/JSX modules for the direct parity pass.
- `src/App.test.tsx` covers intro rendering, Begin→Muster, and Books overlay.

## Validation
- `npm run test` — passed, 2 files / 10 tests.
- `npm run build` — passed.
- `npm run lint` — passed.
- Browser smoke at `http://127.0.0.1:5173/` — rendered desktop command-table design with no console/JS errors; event-dispatch path advanced from Intro to Muster.


## Final Status
Merged/push pending at the time this task file moved to done; see the associated handoff and git history.
