# Productionize Desktop Campaign Table Prototype

Status: Done
Owner: hermes-default
Branch: feat/productionize-desktop-prototype
Claimed at: 2026-06-12
Completed at: 2026-06-12

## Goal
Turn the current CDN/Babel static desktop prototype into a package-managed, testable long-term web application foundation while preserving the War O' Ages design language.

## Completed Work
- Added Vite + React + TypeScript app shell.
- Added Vitest, Testing Library, ESLint, TypeScript configs, and package scripts.
- Added typed domain/game modules for regions, eras, positions, starter roster, daily campaign drafting, and scoring.
- Added reusable core components, crest rendering, figure cards, and a production Campaign Table shell.
- Preserved `ui_kits/desktop/` as the legacy visual reference.
- Documented architecture and validation commands.

## Validation
- `npm install` completed with 0 vulnerabilities.
- `npm run test` passed: 2 files / 4 tests.
- `npm run build` passed.
- `npm run lint` passed.
- Browser smoke check loaded the new app at `http://127.0.0.1:5173/` with no console errors.

## Follow-Up
- Port the complete legacy roster/scoring rules.
- Build full phase interactions and share-card flow.
- Add CI and deployment target.
