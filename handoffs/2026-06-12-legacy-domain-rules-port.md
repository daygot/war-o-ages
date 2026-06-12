# Handoff — Legacy Domain Rules Port

Date: 2026-06-12
Owner: hermes-default
Branch: feat/port-legacy-domain-rules

## Goal
Port the legacy `ui_kits/shared/data.js` game-data/rule layer into typed production domain modules.

## Summary
The production domain now contains the full legacy roster/rule catalog and tests for parity anchors. The app no longer has only a curated starter data slice; it can draft/score from the 193-figure catalog with legacy-style stats, eligibility, battlegrounds, named synergies, ideology effects, and grades.

## Files Changed
- `src/domain/types.ts` — expanded domain types for stats, synergies, ideology effects, grades, and richer figures.
- `src/domain/game-data.ts` — ported full roster/rule catalog and derived figure enrichment.
- `src/domain/engine.ts` — ported pure domain behavior for pools, figure power, synergies, battleground multipliers, ideology effects, scoring, campaign generation, and grades.
- `src/domain/engine.test.ts` — added parity/behavior tests.
- `src/features/campaign/CampaignTable.tsx` — renders structured synergies and rounded verdict scores.
- `context/CURRENT.md`, `context/ARCHITECTURE.md`, `context/DECISIONS.md` — updated durable project state.
- `tasks/done/2026-06-12-port-legacy-domain-rules.md` — completed task record.

## Decisions Made
- Keep legacy `ui_kits/shared/data.js` as reference-only. Production imports should use `src/domain/*`.
- Preserve compatibility aliases on `ScoreResult` during UI migration while exposing richer structured scoring fields.

## Validation
- `npm run test` — passed, 2 files / 8 tests.
- `npm run build` — passed.
- `npm run lint` — passed.
- `curl -I http://127.0.0.1:5173/` — `HTTP/1.1 200 OK`.
- Browser smoke — loaded `War O' Ages`, no console/JS errors.

## Known Issues
- UI phase flow remains a shell; it does not yet implement wheel spin, rank-by-rank drafting, player council choice, reveal animation, or share card.
- The data port is intentionally source-compatible by behavior, not byte-for-byte identical to the global `window.WOA` object.

## Recommended Next Step
Build the actual Campaign Table phase interactions using the typed domain as the source of truth.

## Review Readiness
Ready to merge after commit/push and final remote verification.
