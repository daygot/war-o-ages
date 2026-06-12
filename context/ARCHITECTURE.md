# Architecture — War O' Ages

## Current Stack
- Static HTML/CSS/JS prototype.
- React 18 UMD and ReactDOM loaded from CDN.
- Babel standalone in the browser for JSX-style shared scripts.
- CSS design system in `styles.css` importing files from `tokens/`.

## Major Components
- `ui_kits/desktop/index.html` boots the desktop Campaign Table.
- `ui_kits/desktop/desktop-app.js` orchestrates the desktop flow and command table.
- `ui_kits/desktop/books.js` renders the Books/Codex interface.
- `ui_kits/shared/data.js` contains regions, eras, roster, battlegrounds, synergies, and ideologies.
- `ui_kits/shared/components.js`, `board.js`, `screens-a.js`, and `screens-b.js` provide shared prototype UI and game screens.
- `components/` holds JSX reference components for future implementation.
- `tokens/` holds design tokens for color, type, surfaces, buttons, motion, and layout.

## Data / Control Flow
1. Browser loads global CSS and CDN dependencies.
2. Shared `window.WOA` data/helpers are loaded.
3. Desktop app builds seeded daily battle state and advances phases: Intro → Muster → Council → Battle → Verdict.
4. UI renders local state only; no backend/API persistence exists yet.

## Safety and Security Notes
- Do not commit credentials, analytics tokens, deployment secrets, or private API keys.
- Treat uploaded screenshots as product/design assets; verify licensing before public launch.
- CDN dependencies should be pinned or replaced with package-managed dependencies before production.
