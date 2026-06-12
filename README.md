# War O' Ages — Design System

**War O' Ages** (formerly "Battle Across Time" — that name is archived) is a daily web game: assemble a legion of historical figures across 4,000 years of history, spin the two-ring **Wheel of Ages** (region × era) to draft each of five ranks — Commander, Strategist, General, Troops, Allies — choose the **ideology** your legion fights for, then battle a daily enemy squad on a themed battleground. The payoff is a shareable, wax-sealed **result card** ("can you conquer history?"). Think Wordle-style daily ritual meets fantasy-draft debate bait.

**The aesthetic is an "illuminated war-atlas":** aged parchment, walnut ink, sealing-wax red, manuscript gold, engraved Cinzel capitals, italic EB Garamond narration, heraldic shield crests, a candle-lit war-room table. Everything looks like it was printed, stamped, or inked — never "webby".

## Sources

- Codebase: handoff bundle mounted at `battle-across-time/` (Claude Design export, June 2026). Primary file: `battle-across-time/project/War O' Ages - Desktop.html` plus shared engine (`styles.css`, `data.js`, `components.jsx`, `board.jsx`, `screens-a.jsx`, `screens-b.jsx`, `desktop-app.jsx`, `app.jsx`).
- Chat transcripts in `battle-across-time/chats/` (5 sessions) record the design intent: keep + refine the parchment theme, desktop-first, conventional roulette pointer, rotation-aware wheel labels, name set to "War O' Ages".
- Raw icon uploads (crown / feather / swords) from `battle-across-time/project/uploads/` → copied to `assets/icons/`.

## Products / surfaces

1. **Desktop "Campaign Table"** — browser game at ≥1280px. Sticky command bar (sigil + wordmark, INTRO · MUSTER · COUNCIL · BATTLE · VERDICT step nav), three-column war table (Your Legion ledger | War Map | Wheel of Ages), then full-width Battle and Verdict screens.
2. **Mobile app** — same flow in a 402×874 iOS frame, one screen per phase, single-column.
3. **Shareable result card** — the virality centerpiece; double-bordered plate with score, wax seal grade, two army crest-strips, synergies ribbon, epigraph quote, `waroages.io` footer.

---

## CONTENT FUNDAMENTALS

**Voice: a chronicler narrating your campaign.** Copy is written in a mock-epic, illuminated-manuscript register — playful but never breaking character. The game speaks *to* the player as a commander ("Your Legion", "your cause") and *about* events like a chronicle ("History will remember your legion", "The chronicles record a noble loss").

- **Person:** second person for the player ("You", "Your Legion"); the system narrates in third person ("The wheel turns…", "The armies take the field…", "The dust has not yet settled…").
- **Casing:** Title Case for proper nouns of the game world — ranks ("The Commander"), screens ("The War Council"), features ("Wheel of Ages", "Daily Battlefield"). Labels and buttons render in uppercase via CSS (`.label`, `.caps`, `.btn`), but are written in Title Case in source.
- **Definite article + epithet:** ranks and entities take "The" — "The Strategist", "The Enemy Musters", "The Battle is Joined", "Reveal the Verdict".
- **Sentences:** short, declarative triads on the title screen: "Assemble a legion across history. Spin the wheel. Conquer the ages."
- **Italic Garamond = narrative/flavor**; upright Cinzel = structure/data. Flavor lines are full sentences with a wry edge: "Endless grass; cavalry rules.", "A free host answers to no throne", "An army that will not strike".
- **Numbers:** modifiers always signed percentages ("+20%", "−5%"); scores big bare integers; progress as "Rank 3 / 5".
- **Emoji: never.** Decorations are unicode glyphs in-character: ✦ (gold star separator, button suffix), ⚔ (battle), ▲▼ (buff/debuff), ⚑, ⬡, · (interpunct separators), curly quotes for epigraphs.
- **No tech jargon:** "Take Position ✦", "March to War", "New War", "Share the Chronicle" — never "Submit", "Continue", "OK".
- **Microcopy under disabled actions** explains in-world: "Choose an ideology before you march."

## VISUAL FOUNDATIONS

**Color.** Parchment grounds (`--paper #e6dabf`, panels `#f3ecd9`) with walnut ink text (`--ink #2a2017`, soft `#5e4f3a`, faint `#8a795c`). Two accents only: sealing-wax red (`--seal #8f2d22`) for primary actions/emphasis/the enemy, and manuscript gold (`--gold #b08a2e` / bright `#d4af4f`) for ceremony, borders, focus. A dark "council table" surface (`#2a2017→#3a2c1c` gradient, text `#e7d3a8`) inverts panels for toasts/selected-ideology plates. Eight muted **region inks** (jade, ochre, lapis, terracotta, verdigris, ultramarine, mulberry, sienna) color-code provenance everywhere a figure appears. Positive = jade green `--c-EASIA`; negative = seal red. On-dark positive/negative soften to `#9fd1a8`/`#e0907f`.

**Type.** Cinzel (display; weights 600–900, tracked-out uppercase for `.caps`/`.label`/buttons), Cinzel Decorative (wordmark only — with the "O" swapped back to plain Cinzel via `.wo-o` for its closed counter), EB Garamond (body; italic for all narrative/flavor). Scale runs from 92px wordmark on desktop intro down to 8px micro-labels with wide letter-spacing (0.18–0.34em). Body text is rarely large; hierarchy comes from face + tracking + color, not weight alone.

**Backgrounds.** Always textured parchment: layered radial gradients (warm light top, walnut shadow bottom) + an inline-SVG fractal-noise grain at 5% opacity, multiply-blended. A vignette (`inset box-shadow`) plus faint "foxing" spots ages the page. Dark surfaces (war map, share-card ribbon) use radial torch-glow gradients. No photography, no flat solids.

**Panels/cards.** `.panel` = vertical parchment gradient, 1px `--panel-edge` border, **3px radius max** (2–4px everywhere; only crests/circles rounder), inner top highlight + soft drop shadow `0 4px 14px rgba(70,50,24,0.22)`. Ceremonial panels add `.frame-rule` — a 1px inner rule inset 5px — the signature "double-bordered plate". List rows use a **4px region-ink left border**. The share card doubles down: 2px outer `#6e5418` border + 1px gold inner frame.

**Buttons.** Letterpress style: vertical gradient, 1px darker border, hard 2px bottom edge-shadow + colored glow. Press = `translateY(1px)` (sink); hover = `brightness(1.06)` on primary, underline-grow on text steps. Three variants: wax-red primary (one per screen), gold ceremonial (the spin), parchment ghost.

**Motion.** Short, eased, ceremonial: `woaFadeUp` (entrances, staggered 50–80ms), `woaPop` (placements, slight overshoot), `woaSealIn` (wax seal stamps in with rotation), `woaTick` (log lines slide in), `woaFloat` (gentle idle bob), `woaPulseGold` (active-slot focus ring). Wheel spins are 3.1–3.4s decelerating `cubic-bezier(0.16,0.9,0.2,1)` with multi-revolution wind-up; scores count up with cubic ease-out. No bounces beyond the pop overshoot, no infinite spinners.

**Borders & shadows.** Hairlines in `--line #c2ad81`, often with a 1px cream emboss highlight below (`.hr-rule`). Shadows are warm brown, never gray/black-blue. Focus/selection = `0 0 0 2px var(--gold-bright)` ring.

**Layout.** Desktop: max-width 1640px wrap, sticky top command bar fading into parchment, 330/1fr/400 three-column grid with `.rail-title` (small-caps + hairline) heading each rail. Mobile: single column, absolute-inset scrolling screen, CTA pinned at flow end. Section headers everywhere = small-caps label + flexed hairline (+ optional italic annotation right).

**Transparency/blur:** none — opacity is used for aging and dimming (e.g. `grayscale(0.5) opacity(0.6)` for fog-of-war crests), never glassmorphism.

## ICONOGRAPHY

- **No icon font, no emoji.** Three icon channels:
  1. **Unicode glyphs as in-character marks** — ✦ ⚔ ▲ ▼ ⚑ ⬡ ☾ ✠ ॐ Ω 龍 — used inline in labels, buttons and region monograms.
  2. **Inline stroke SVGs, Lucide-flavored** (24×24, `stroke-width` \~1.7–2.3, round caps/joins): rank emblems on crests (crown / feather / swords are literal Lucide paths; chevrons and rings are house-drawn in the same style) and the 17 **ideology glyphs** (`IdeologyIcon`: crown, scales, star, fasces, coin, flag, broken chain, circle-A, cross, crescent, dharma wheel, om, banner, olive branch, sun, column, shield).
  3. **Heraldic devices drawn in SVG**: the `Sigil` (round dark badge, red/gold opposed pennants), `Crest` shields (region-ink gradient fill, gold stroke, initials in Cinzel), the `WaxSeal` scalloped grade stamp, the compass dial, the war table.
- Raw uploads of the rank icons (crown / feather / swords as SVG + white PNGs) live in `assets/icons/` — prefer the React components (`Crest`, `IdeologyIcon`) which already embed the paths.
- If you need icons beyond the set, use **Lucide** (CDN) at stroke-width 1.7–2, colored `var(--ink-soft)` or region inks — it matches the house style the emblems were lifted from.

## Index

- `styles.css` — global entry; imports everything under `tokens/`.
- `tokens/` — `fonts.css`, `colors.css`, `typography.css`, `surfaces.css`, `buttons.css`, `motion.css`, `layout.css`.
- `guidelines/` — foundation specimen cards (Design System tab).
- `assets/icons/` — crown / feather / swords (svg + white png).
- `components/core/` — `Button`, `Panel`, `Tag`, `Banner`, `SectionRule`.
- `components/heraldry/` — `Sigil`, `Crest`, `WaxSeal`, `IdeologyIcon`.
- `components/game/` — `StatRow`, `FigureCard`, `FigureRow`, `SynergyRow`, `CompassDial`.
- `ui_kits/desktop/` — interactive desktop Campaign Table recreation (full intro→spin→council→battle→verdict flow).
- `ui_kits/mobile/` — mobile flow recreation at 402×874 in an iOS frame.
- `ui_kits/shared/` — the game engine both kits load: `data.js` (regions, eras, roster, synergies, ideologies), `components.js`, `board.js` (war map + wheel), `screens-a.js`, `screens-b.js`. Kept as `.js` on purpose — not part of the compiled component bundle.
- `SKILL.md` — agent skill entry point.
