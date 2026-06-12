# Conventions — War O' Ages

## Agent Workflow
- Follow `AGENTS.md` startup and shutdown protocols.
- Work on one focused task at a time.
- Update `agents/status.md` when claiming/releasing work.
- Put resumable summaries in `handoffs/`.

## Git Workflow
- Default branch: `main`.
- Prefer short conventional commits, e.g. `chore: initialize war o ages repository`.
- Do not commit secrets or machine-specific credentials.
- Quote the local project path because it contains spaces and an apostrophe.

## Validation
- Production app commands:
  - `npm install`
  - `npm run dev -- --port 5173`
  - `npm run lint`
  - `npm run test`
  - `npm run build`
- Browser smoke check: open `http://127.0.0.1:5173/` and confirm no console/JS errors.
- Legacy static prototype reference remains available from repo root with:
  - `python3 -m http.server 4173`
  - `curl -I http://127.0.0.1:4173/ui_kits/desktop/`

## Design Conventions
- Use `context/DESIGN.md`, `README.md`, and `DESIGN_CONTEXT.md` before frontend/design edits.
- Preserve in-world chronicler copy and Title Case proper nouns.
- No emoji; use in-character glyphs such as ✦, ⚔, ▲, ▼, ⚑, ⬡, ·.
- Warm brown shadows, hard letterpress buttons, parchment surfaces, and minimal border radii are expected.
