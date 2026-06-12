# War O' Ages — Project Context

## Purpose
War O' Ages is a daily web game concept and design-system repository. Players assemble a legion of historical figures across 4,000 years, spin the two-ring Wheel of Ages to draft five ranks, choose an ideology, battle a daily enemy squad, and share a wax-sealed result card.

## Current Audience
- Product/design collaborators evolving the illuminated war-atlas experience.
- Frontend agents turning the current static UI kit into a maintainable web app.
- Future game-design agents expanding rosters, balance, and daily challenge logic.

## Product Goals
1. Preserve the distinctive illuminated war-atlas identity: parchment, walnut ink, sealing-wax red, manuscript gold, engraved capitals, heraldic crests, and chronicler voice.
2. Maintain the complete desktop Campaign Table flow as the canonical reference: Intro → Muster → Council → Battle → Verdict.
3. Use the shared game engine files as the immediate source for prototype behavior and content.
4. Prepare the repo for agentic collaboration so future agents can claim tasks, record decisions, and hand off work without relying on hidden chat history.

## Non-Goals
- No live production backend yet.
- No user accounts, payments, analytics, or deployment secrets in this repository.
- No flat/generic web-game rebrand; the medieval manuscript tone is a core constraint.

## Success Criteria
- A collaborator can open `ui_kits/desktop/index.html` and inspect the current interactive prototype.
- Design tokens and components are documented enough for implementation agents to extend without drifting from the house style.
- Every substantial future change has a task claim, validation note, and handoff.

## Key Commands
- Preview locally: `python3 -m http.server 4173` from the repo root, then open `http://127.0.0.1:4173/ui_kits/desktop/`.
- Validate static preview availability: `curl -I http://127.0.0.1:4173/ui_kits/desktop/`.
- Git status: `git status -sb`.

## Key Files and Directories
- `README.md` — design-system overview and product/aesthetic brief.
- `DESIGN_CONTEXT.md` — condensed design context for agents.
- `styles.css` and `tokens/` — global CSS and design tokens.
- `components/` — JSX component references for core, heraldry, and game UI.
- `ui_kits/desktop/` — interactive desktop Campaign Table prototype.
- `ui_kits/shared/` — shared data, board, components, and screen logic.
- `uploads/` — source screenshots and exploratory HTML options.
- `context/` — durable repo collaboration context.
- `tasks/`, `handoffs/`, `agents/` — agentic coordination workflow.
