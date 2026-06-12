# Handoff — Production App Foundation

Date: 2026-06-12
Agent: hermes-default
Branch: feat/productionize-desktop-prototype

## Goal
Migrate War O' Ages from a design-artifact bundle toward a robust long-term app architecture.

## Summary
Set up a package-managed Vite + React + TypeScript codebase at the repo root. The new production path renders a Campaign Table architecture slice using typed domain modules and reusable components. Legacy artifacts remain intact as visual/design references.

## Files Changed
- Added package/tooling: `package.json`, `package-lock.json`, `vite.config.ts`, `tsconfig*.json`, `eslint.config.js`, `vitest.setup.ts`.
- Added production app: `index.html`, `src/main.tsx`, `src/App.tsx`, `src/styles/app.css`.
- Added domain modules/tests: `src/domain/types.ts`, `src/domain/game-data.ts`, `src/domain/engine.ts`, `src/domain/engine.test.ts`.
- Added UI/components: `src/components/core.tsx`, `src/components/Crest.tsx`, `src/components/FigureCard.tsx`, `src/features/campaign/CampaignTable.tsx`, `src/App.test.tsx`.
- Added architecture docs: `docs/ARCHITECTURE.md` and updated `context/ARCHITECTURE.md`, `context/CURRENT.md`, `context/CONVENTIONS.md`, `context/DECISIONS.md`.

## Decisions Made
- Use Vite + React + TypeScript as the production foundation.
- Keep legacy `ui_kits/` artifacts as references until feature parity.
- Put game rules in pure typed modules before porting complex UI interactions.

## Commands / Checks Run
- `npm install`
- `npm run test`
- `npm run build`
- `npm run lint`
- `curl -I http://127.0.0.1:5173/`
- Browser smoke check at `http://127.0.0.1:5173/` with no console/JS errors.

## Known Issues
- New app is an architectural slice, not full desktop prototype parity.
- Starter typed roster is curated; full legacy data still needs migration.
- Mobile artifact mismatch remains open.

## Recommended Next Step
Port the full legacy roster/scoring/synergy data into `src/domain/` with tests, then implement the wheel and phase transitions against the typed engine.

## Ready for Review?
Yes. Local validation passed; branch should be pushed for review/merge.
