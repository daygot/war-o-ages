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
- For current static prototype work, start a local HTTP server from repo root and request the desktop UI:
  - `python3 -m http.server 4173`
  - `curl -I http://127.0.0.1:4173/ui_kits/desktop/`
- If package tooling is added later, document the new install/build/test commands here.

## Design Conventions
- Use `context/DESIGN.md`, `README.md`, and `DESIGN_CONTEXT.md` before frontend/design edits.
- Preserve in-world chronicler copy and Title Case proper nouns.
- No emoji; use in-character glyphs such as ✦, ⚔, ▲, ▼, ⚑, ⬡, ·.
- Warm brown shadows, hard letterpress buttons, parchment surfaces, and minimal border radii are expected.
