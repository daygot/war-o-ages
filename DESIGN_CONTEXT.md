# War O' Ages — Design System Context

## Project Overview
**War O' Ages** is a daily web game where players assemble a legion of historical figures across 4,000 years, spin the Wheel of Ages to draft units (Commander, Strategist, General, Troops, Allies), choose an ideology, and battle daily enemies. The payoff is a shareable result card.

**Aesthetic:** "Illuminated war-atlas" — aged parchment, walnut ink, sealing-wax red, manuscript gold, engraved Cinzel capitals, italic EB Garamond narration, heraldic shields, candle-lit war-room atmosphere. Everything looks printed, stamped, or inked — never "webby."

---

## Core Design Tokens

### Colors
- **Parchment grounds:** `--paper #e6dabf`, `--panel #f3ecd9`, `--paper-2 #ece1c8`
- **Walnut ink:** `--ink #2a2017` (primary), `--ink-soft #5e4f3a` (secondary), `--ink-faint #8a795c` (tertiary)
- **Accents:** 
  - Sealing-wax red: `--seal #8f2d22` (primary action, emphasis, enemy)
  - Manuscript gold: `--gold #b08a2e`, `--gold-bright #d4af4f` (ceremony, borders, focus)
- **Dark surfaces (council table):** `--night #2a2017` → `--night-2 #3a2c1c`, text `--night-text #e7d3a8`
- **Region inks (8 territory colors):**
  - East Asia: `--c-EASIA #3f7d5a` (jade green)
  - Mediterranean: `--c-MEDIT #9a6a1f` (ochre)
  - Middle East: `--c-MIDE #2f6f86` (lapis teal)
  - Sub-Saharan Africa: `--c-AFRIC #b5642a` (terracotta)
  - The Americas: `--c-AMER #2d8079` (verdigris)
  - Western Europe: `--c-WEUR #3a5a8c` (ultramarine)
  - Eastern Europe: `--c-EEUR #8a3b5a` (mulberry)
  - South & SE Asia: `--c-SASIA #a8602c` (sienna)

### Typography
- **Display (Cinzel):** engraved capitals, weights 600–900, tracked-out for `.caps`/`.label`/buttons
- **Body (EB Garamond):** narrative & flavor, often italic
- **Wordmark (Cinzel Decorative):** with the "O" swapped to plain Cinzel for closed counter
- **Scale:** 92px wordmark → 8px micro-labels; hierarchy from face + tracking + color, not weight alone
- **Classes:**
  - `.disp` — display heading
  - `.caps` — spaced small caps (section headers)
  - `.label` — micro label, all-caps, 10px
  - `.serif-it` — narrative italic

### Surfaces & Panels
- **`.panel`** — parchment gradient, 1px edge border, 3px radius max, inner top highlight, soft drop shadow
- **`.frame-rule`** — inner 1px rule inset 5px (double-bordered "plate" look)
- **Background texture:** radial gradients (warm light top, walnut shadow bottom) + inline SVG fractal-noise grain at 5% opacity
- **Vignette & foxing:** inset box-shadow + subtle brown spots for aging
- **List rows:** 4px region-ink left border
- **Shadows:** warm brown, never gray/black-blue

### Buttons
- **`.btn-primary`** — wax red, one per screen, main action, letterpress style with hard 2px bottom edge-shadow
- **`.btn-gold`** — ceremonial (e.g., "Spin the Wheel"), bright gold
- **`.btn-ghost`** — parchment, secondary/dismissive actions
- **Press:** `translateY(1px)` (sink)
- **Hover:** `brightness(1.06)` on primary, underline-grow on text steps
- **Typography:** Cinzel uppercase, letter-spaced 0.14em, font-weight 700

### Motion
- `woaFadeUp` — entrances, staggered 50–80ms
- `woaPop` — placements, slight overshoot
- `woaSealIn` — wax seal stamps with rotation
- `woaTick` — log lines slide in
- `woaFloat` — gentle idle bob
- `woaPulseGold` — active-slot focus ring
- **Wheel spins:** 3.1–3.4s decelerating `cubic-bezier(0.16,0.9,0.2,1)` with multi-revolution wind-up
- **Score countups:** cubic ease-out
- No bounces beyond pop overshoot; no infinite spinners

---

## Layout & Composition

### Desktop
- Max-width 1640px wrap
- Sticky command bar (sigil + wordmark, step nav: INTRO · MUSTER · COUNCIL · BATTLE · VERDICT)
- Three-column war table: Your Legion | War Map | Wheel of Ages
- Full-width Battle and Verdict screens
- Rail titles: small-caps + hairline

### Mobile
- 402×874 iOS frame
- Single column, absolute-inset scrolling screen
- CTA pinned at flow end

---

## Content Voice

**Chronicler narrating the campaign.** Mock-epic, illuminated-manuscript register—playful but never breaking character.

- **Person:** 2nd for player ("Your Legion"), 3rd for narration ("The wheel turns…")
- **Casing:** Title Case for proper nouns; uppercase via CSS (`.label`, `.caps`, `.btn`)
- **Definite article + epithet:** "The Strategist", "The Battle is Joined", "Reveal the Verdict"
- **Italic Garamond = narrative/flavor** (full sentences, wry edge); upright Cinzel = structure/data
- **Numbers:** signed percentages ("+20%", "−5%"); scores as bare integers; progress as "Rank 3 / 5"
- **No emoji, no tech jargon.** Unicode glyphs in-character: ✦ ⚔ ▲▼ ⚑ ⬡ ·
- **Microcopy under disabled actions** explains in-world: "Choose an ideology before you march."

---

## Iconography

**Three channels:**

1. **Unicode glyphs** — ✦ ⚔ ▲ ▼ ⚑ ⬡ ☾ ✠ ॐ Ω 龍 (inline in labels, buttons, monograms)
2. **Inline stroke SVGs** (24×24, Lucide-flavored, stroke-width ~1.7–2.3, round caps/joins):
   - Rank emblems: crown / feather / swords (literal Lucide paths)
   - Chevrons, rings (house-drawn, same style)
   - 17 ideology glyphs (crown, scales, star, fasces, coin, flag, broken chain, circle-A, cross, crescent, dharma wheel, om, banner, olive branch, sun, column, shield)
3. **Heraldic devices in SVG:**
   - `Sigil` — round dark badge, red/gold opposed pennants
   - `Crest` — shield (region-ink gradient fill, gold stroke, Cinzel initials, rank emblem)
   - `WaxSeal` — scalloped grade stamp
   - Compass dial, war table

---

## Components (React)

### Core
- **`Button`** — variant: 'primary' | 'gold' | 'ghost'; fullWidth, disabled, onClick
- **`Panel`** — framed, dark, padding, accent (left-border color), className
- **`SectionRule`** — section header with hairline
- **`Tag`** — small label badge
- **`Banner`** — alert / notification strip

### Heraldry
- **`Crest`** — initials, ink (region color), size, pos (rank: commander|strategist|general|troops|allies), dashed, dim
- **`IdeologyIcon`** — ideology glyph (17 types)
- **`Sigil`** — round badge with pennants
- **`WaxSeal`** — grade stamp (Legendary, Victorious, Honorable, etc.)

### Game
- **`FigureCard`** — displays a historical figure (crest, name, era, buffs/debuffs)
- **`FigureRow`** — row of figures (ledger format)
- **`StatRow`** — stat + value pair (army strength, synergies, etc.)
- **`CompassDial`** — 8-direction compass (region selector, war map)

---

## Production Files

- **Handoff:** `battle-across-time/` folder (Claude Design export, June 2026)
  - Primary: `battle-across-time/project/War O' Ages - Desktop.html`
  - Shared engine: `styles.css`, `data.js`, `components.jsx`, `board.jsx`, `screens-a.jsx`, `screens-b.jsx`, `desktop-app.jsx`, `app.jsx`
- **Chat transcripts:** `battle-across-time/chats/` (5 sessions record design intent)
- **UI Kits:** Desktop (≥1280px) and mobile (402×874 iOS frame) recreations with full flows

---

## Key Principles

✦ **Authenticity over novelty** — everything looks like it was printed, stamped, or inked
✦ **Restraint with color** — parchment + walnut + red + gold only (plus region inks for meaning)
✦ **Typography as hierarchy** — Cinzel structure, Garamond narrative
✦ **Texture over flatness** — gradients, grain, vignette, foxing, shadows
✦ **Ceremonial motion** — short, eased, never distracting
✦ **In-world voice** — every word serves the chronicler's tone
