# Decisions — War O' Ages

## 2026-06-12 — Adopt repo-first agentic collaboration
Decision: This repository uses the agentic collaboration template as a source-of-truth workflow for future human/AI collaboration.

Rationale: Future agents need durable context, task claims, and handoffs in the repo rather than relying on hidden chat history.

Implications:
- Agents must read `AGENTS.md` and `context/` before changing code.
- Substantial work should start from a task file and end with a handoff.
- Durable design/product decisions belong in `context/DECISIONS.md`.

## 2026-06-12 — Preserve illuminated war-atlas identity as a hard product constraint
Decision: War O' Ages should keep the parchment/walnut/sealing-wax/manuscript-gold aesthetic and chronicler voice.

Rationale: The distinctive manuscript-war-room identity is the product's differentiator and is already deeply documented in the design bundle.

Implications:
- Avoid generic modern web-game styling, glassmorphism, emoji, or tech-jargon UI copy.
- Future implementation should reuse and formalize existing tokens rather than replace them.

## 2026-06-12 — Keep current prototype static until productionization task is claimed
Decision: The current repo commit preserves the static design bundle as-is and does not immediately convert it to a build system.

Rationale: The user's immediate request is repo creation and GitHub push. Converting the prototype is a separate implementation task that should be claimed and validated explicitly.


## 2026-06-12 — Use Vite + React + TypeScript as the production app foundation
Decision: The production code path uses Vite, React, TypeScript, Vitest, Testing Library, and ESLint, with source code under `src/`.

Rationale: The legacy artifact bundle proved the design direction but relied on CDN React/Babel and global `window.WOA` scripts. A typed package-managed app gives future agents a safer foundation for game logic, tests, builds, and deployment.

Implications:
- `ui_kits/desktop/` remains the visual reference until the production app reaches parity.
- Domain/game rules should move into pure modules under `src/domain/` before UI wiring.
- Build/test/lint commands are mandatory validation gates for implementation changes.
