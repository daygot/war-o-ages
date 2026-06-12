# Port legacy domain data and rules

Status: Done
Owner: hermes-default
Branch: feat/port-legacy-domain-rules
Claimed at: 2026-06-12
Claim expires: 2026-06-13

## Goal
Port the legacy `ui_kits/shared/data.js` roster, battlegrounds, ideologies, synergies, stat helpers, and scoring rules into typed production domain modules under `src/domain/`.

## Context
The production app currently has a curated starter roster and simplified scoring. The next long-term step is to migrate the full legacy game-data/rule layer into TypeScript so UI work can build on tested domain behavior instead of the reference-only `window.WOA` script.

## Acceptance Criteria
- Full legacy roster is represented as typed production data.
- Typed figures include derived initials, stats, eligible positions, region/era display metadata, and tier.
- Battlegrounds, synergies, ideology definitions/effects, and grade helpers are available from production domain modules.
- Scoring uses the legacy weighted figure-power, synergy, battleground, ideology, and deterministic noise rules.
- Automated tests cover roster size/parity anchors, derived stats/eligibility, known synergy detection, ideology effects, and scoring.
- Existing app tests still pass; build and lint pass.
- Repo context/handoff updated and changes pushed.

## Progress
- Claimed by `hermes-default`.


## Completed Work
- Added RED tests that failed against the starter domain slice for full legacy roster/rule parity.
- Ported 193 figures, 6 battlegrounds, 17 ideologies, 11 named synergy definitions, stat derivation, eligibility, tiers, and metadata into typed production modules.
- Implemented production helpers for `poolFor`, `figurePower`, `detectSynergies`, battleground multipliers, ideology effects, legacy-style scoring, and grading.
- Updated Campaign Table rendering for structured synergy objects and rounded verdict display.

## Validation
- `npm run test` — passed, 2 files / 8 tests.
- `npm run build` — passed.
- `npm run lint` — passed.
- HTTP smoke: `curl -I http://127.0.0.1:5173/` returned `HTTP/1.1 200 OK`.
- Browser smoke: app loaded with no console/JS errors.

## Follow-up
- Build the actual interactive phase loop on top of the now-typed domain: wheel spin, muster, council selection, battle reveal, verdict/share card.
