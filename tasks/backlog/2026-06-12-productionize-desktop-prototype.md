# Productionize Desktop Campaign Table Prototype

Status: Backlog
Owner: Unclaimed
Branch: feat/productionize-desktop-prototype
Created: 2026-06-12

## Goal
Turn the current CDN/Babel static desktop prototype into a package-managed app while preserving the War O' Ages design language.

## Scope
- Choose a lightweight frontend build setup.
- Move shared scripts into modules/components.
- Preserve current desktop behavior and visual fidelity.
- Add a repeatable build/test command.

## Acceptance Criteria
- `npm install` and a documented dev command work from a clean checkout.
- The Campaign Table renders through the new app entry point.
- Existing `ui_kits/desktop/` remains available or is intentionally archived with a note.
- Validation commands are recorded in `context/CONVENTIONS.md`.
