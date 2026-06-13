import React, { useState as dS, useEffect as dE, useRef as dR, useMemo as dM } from 'react';
import { WOA as D } from './legacyData';
import { Crest, StatRow, FigureCard, FigureRow, WaxSeal, Banner, IdeologyIcon, hexA } from './legacyComponents.jsx';
import { FormationBoard, CompassDial, TerrainBackdrop, TERRAIN_HALL } from './legacyBoard.jsx';
import { BookGlyph, BooksOverlay } from './legacyBooks.jsx';

function Sigil({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" aria-hidden="true">
      <circle cx="20" cy="20" r="18.5" fill="#2a2017" stroke="var(--gold)" strokeWidth="1.5" />
      <path d="M20,7 L24,18 L20,15 L16,18 Z" fill="var(--seal-2)" />
      <path d="M20,33 L16,22 L20,25 L24,22 Z" fill="var(--gold)" />
      <circle cx="20" cy="20" r="2.4" fill="var(--gold-bright)" />
    </svg>
  );
}

function dSeed() {
  const dt = new Date();
  return dt.getFullYear() * 1000 + Math.floor((dt - new Date(dt.getFullYear(), 0, 0)) / 86400000);
}
function dBuild(squad, bg, seed, ideology) {
  const r = D.scoreSquad(squad, bg, seed, ideology);
  return { squad, base: Math.round(r.base), syn: r.syn, synTotal: r.synTotal, bg: r.bg, final: Math.round(r.final), ideology: r.ideology };
}

const PHASES = ['Intro', 'Muster', 'Council', 'Battle', 'Verdict'];
const STEP_SCREENS = ['intro', 'spin', 'council', 'battle', 'result'];

// ── Command bar ───────────────────────────────────────────────
function DBar({ phaseIdx, battleground, right, onJump, onBooks }) {
  return (
    <div className="desk-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <Sigil size={46} />
        <div className="deco" style={{ fontSize: 33, fontWeight: 900, lineHeight: 1, whiteSpace: 'nowrap' }}>War <span className="wo-o">O</span>' Ages</div>
      </div>
      <div className="desk-steps">
        {PHASES.map((p, i) => (
          <button key={p} type="button"
            className={'desk-step desk-step-btn' + (i === phaseIdx ? ' on' : i < phaseIdx ? ' done' : '')}
            onClick={onJump ? () => onJump(STEP_SCREENS[i]) : undefined}
            title={`Jump to ${p}`}>{p}</button>
        ))}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 16, minWidth: 220 }}>
        {right ? <span className="label" style={{ fontSize: 11, whiteSpace: 'nowrap' }}>{right}</span> : null}
        <button type="button" className="btn btn-ghost" onClick={onBooks}
          title="Open the codex — every figure of the wheel"
          style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '9px 15px', fontSize: 11 }}>
          <BookGlyph size={14} color="var(--seal)" /> The Books
        </button>
      </div>
    </div>
  );
}

function RailTitle({ children, color }) {
  return (
    <div className="rail-title">
      <span className="caps" style={{ fontSize: 12, color: color || 'var(--ink)', whiteSpace: 'nowrap' }}>{children}</span>
      <span className="ln" />
    </div>
  );
}

// ── Cartographer's cartouche — persistent footer on every screen ──
// Twin chart rules meet at a compass rosette; the theatre's name is
// lettered beneath. Sits at the foot of the page, full bleed of the wrap.
function DeskCartouche({ battleground }) {
  const rule = { flex: 1, height: 7, boxSizing: 'border-box',
    borderTop: '1.4px solid rgba(107,85,50,0.5)', borderBottom: '0.8px solid rgba(107,85,50,0.3)' };
  return (
    <div className="desk-foot" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 7 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 20, width: '100%' }}>
        <span style={rule} />
        <svg width="40" height="40" viewBox="0 0 44 44" style={{ display: 'block', flexShrink: 0 }}>
          <g stroke="rgba(107,85,50,0.8)" fill="none">
            <circle cx="22" cy="22" r="20" strokeWidth="1.3" />
            <circle cx="22" cy="22" r="15.5" strokeWidth="0.7" />
          </g>
          <polygon points="22,9 24.4,19.6 35,22 24.4,24.4 22,35 19.6,24.4 9,22 19.6,19.6"
            fill="rgba(107,85,50,0.85)" />
          <circle cx="22" cy="22" r="1.7" fill="var(--paper-2, #ddcda6)" />
        </svg>
        <span style={rule} />
      </div>
      <div className="label" style={{ fontSize: 10, letterSpacing: '0.34em', color: 'rgba(107,85,50,0.7)', whiteSpace: 'nowrap' }}>
        {battleground.name.toUpperCase()} · THEATRE OF WAR
      </div>
    </div>
  );
}

// ── Your Legion ledger (left rail, always) ────────────────────
// Tiers of honour — mirrors the enemy warband's intro hierarchy:
// the commander's plate largest (nemesis-major proportions), the
// strategist & general at officer size, troops & allies at the
// standard ledger size. Nothing shrinks below today's row.
const LEGION_TIERS = {
  major:   { pad: '16px 16px 15px', crest: 62, name: 21,   sub: 13,   gap: 13 },
  officer: { pad: '12px 14px',      crest: 48, name: 17,   sub: 12.5, gap: 11 },
  minor:   { pad: '11px 12px',      crest: 40, name: 15.5, sub: 12,   gap: 10 },
};
const LEGION_TIER_OF = { commander: 'major', strategist: 'officer', general: 'officer', troops: 'minor', allies: 'minor' };

function LedgerRow({ pos, fig, active, tier, droppable, dragging, onDropFig }) {
  const T = LEGION_TIERS[tier || 'minor'];
  const [over, setOver] = dS(false);
  const dropProps = droppable ? {
    onDragOver: (e) => { e.preventDefault(); e.dataTransfer.dropEffect = 'move'; if (!over) setOver(true); },
    onDragLeave: () => setOver(false),
    onDrop: (e) => { e.preventDefault(); setOver(false); if (onDropFig) onDropFig(); },
  } : {};
  if (!fig) {
    return (
      <div className="panel" {...dropProps} style={{ padding: T.pad, display: 'flex', alignItems: 'center', gap: T.gap,
        opacity: active ? 1 : 0.65,
        boxShadow: over ? '0 0 0 3px var(--gold-bright)' : active ? '0 0 0 2px var(--gold-bright)' : undefined,
        background: over ? 'linear-gradient(180deg, rgba(212,175,79,0.22), rgba(255,250,235,0.5))' : undefined,
        outline: droppable && dragging && !over ? '2px dashed var(--gold)' : 'none', outlineOffset: 2,
        transition: 'box-shadow .15s, background .15s',
        animation: active && !over ? 'woaPulseGold 1.5s ease-in-out infinite' : 'none' }}>
        <Crest dashed placeholderAbbr={pos.abbr} size={T.crest} pos={pos.key} />
        <div style={{ flex: 1 }}>
          <div className="disp" style={{ fontSize: T.name, color: over ? 'var(--gold)' : active ? 'var(--seal)' : 'var(--ink-faint)' }}>The {pos.name}</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: T.sub, color: over ? 'var(--gold)' : 'var(--ink-faint)' }}>
            {droppable && dragging ? (over ? 'Release to lock in ✦' : 'Drag here to lock in') : active ? 'Now drawing…' : 'Awaiting summons'}
          </div>
        </div>
        <div className="label" style={{ fontSize: 10 }}>{pos.abbr}</div>
      </div>
    );
  }
  return (
    <div className="panel" style={{ padding: T.pad, display: 'flex', alignItems: 'center', gap: T.gap,
      borderLeft: `4px solid ${fig.regionInk}`, animation: 'woaFadeUp 0.4s ease both' }}>
      <Crest fig={fig} size={T.crest} pos={pos.key} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="disp" style={{ fontSize: T.name, lineHeight: 1.05 }}>{fig.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: T.sub, color: 'var(--ink-soft)' }}>{pos.name} · {fig.eraName}</div>
      </div>
      <div style={{ width: 106 }}><StatRow fig={fig} compact /></div>
    </div>
  );
}

// The banner YOUR legion marches under — mirrors the enemy's plaque.
// Unfilled until the War Council chooses a cause.
function PlayerIdeologyPlaque({ def }) {
  if (!def) {
    return (
      <div className="panel" style={{ padding: '10px 13px', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 10, opacity: 0.78 }}>
        <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
          border: '1px dashed var(--line)', color: 'var(--ink-faint)', fontSize: 15 }}>⚑</div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="label" style={{ fontSize: 8.5 }}>Ideology</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--ink-faint)', lineHeight: 1.2 }}>
            — To be selected —
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="panel" style={{ padding: '10px 13px', marginBottom: 9, display: 'flex', alignItems: 'center', gap: 10,
      background: 'linear-gradient(180deg,#2a2017,#3a2c1c)', border: '1px solid var(--gold)', animation: 'woaPop 0.35s ease both' }}>
      <div style={{ flexShrink: 0, width: 34, height: 34, borderRadius: 3, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(212,175,79,0.14)', border: '1px solid rgba(212,175,79,0.45)' }}>
        <IdeologyIcon icon={def.icon} size={21} color="var(--gold-bright)" strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="label" style={{ fontSize: 8.5, color: '#a8896a' }}>Ideology</div>
        <div className="disp" style={{ fontSize: 16, color: '#e7d3a8', lineHeight: 1.1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{def.name}</div>
      </div>
    </div>
  );
}

function LegionLedger({ squad, activeKey, ideologyDef, hierarchy, draggingFig, onDropFig }) {
  return (
    <div>
      <RailTitle color="var(--c-EASIA)">Your Legion</RailTitle>
      <PlayerIdeologyPlaque def={ideologyDef || null} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {D.POSITIONS.map((p) => (
          <LedgerRow key={p.key} pos={p} fig={squad[p.key]} active={activeKey === p.key}
            tier={hierarchy ? LEGION_TIER_OF[p.key] : null}
            droppable={!!onDropFig && activeKey === p.key && !squad[p.key]}
            dragging={!!draggingFig}
            onDropFig={onDropFig} />
        ))}
      </div>
    </div>
  );
}

// ── Enemy Warband (right rail, always) ────────────────────────
// Pre-battle: commander / strategist sighted; the General, troops & allies
// concealed — but the banner they march under is flown openly.
// Battle onward: all five revealed.
const ENEMY_SIGHTED = ['commander', 'strategist'];

// The enemy's declared ideology — flown at the top of the warband.
function EnemyIdeologyPlaque({ def, compact }) {
  if (!def) return null;
  return (
    <div className="panel" style={{ padding: compact ? '10px 12px' : '11px 14px', marginBottom: compact ? 9 : 9,
      display: 'flex', alignItems: 'center', gap: compact ? 10 : 12,
      background: 'linear-gradient(180deg,#2a2017,#3a2c1c)', border: '1px solid rgba(143,45,34,0.65)' }}>
      <div style={{ flexShrink: 0, width: compact ? 32 : 34, height: compact ? 32 : 34, borderRadius: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(143,45,34,0.3)', border: '1px solid rgba(212,175,79,0.4)' }}>
        <IdeologyIcon icon={def.icon} size={compact ? 19 : 21} color="#e0907f" strokeWidth={1.8} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="label" style={{ fontSize: compact ? 8 : 8.5, color: '#a8896a' }}>Ideology</div>
        <div className="disp" style={{ fontSize: compact ? 14 : 16, color: '#e7d3a8', lineHeight: 1.1,
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{def.name}</div>
      </div>
    </div>
  );
}

// Narrow ledger row — keeps the enemy readable without claiming real estate.
function EnemyRowMini({ pos, fig, revealed }) {
  if (!revealed || !fig) {
    return (
      <div className="panel" style={{ padding: '10px 11px', display: 'flex', alignItems: 'center', gap: 9, opacity: 0.55 }}>
        <Crest dashed placeholderAbbr={pos.abbr} size={32} pos={pos.key} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="disp" style={{ fontSize: 13.5, color: 'var(--ink-faint)', letterSpacing: '0.05em', lineHeight: 1.1 }}>Unknown</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: 'var(--ink-faint)' }}>{pos.name}</div>
        </div>
      </div>
    );
  }
  return (
    <div className="panel" style={{ padding: '10px 11px', display: 'flex', alignItems: 'center', gap: 9,
      borderLeft: `3px solid ${fig.regionInk}`, animation: 'woaFadeUp 0.4s ease both' }}>
      <Crest fig={fig} size={32} pos={pos.key} dim />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="disp" style={{ fontSize: 14, lineHeight: 1.1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{fig.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: 'var(--ink-soft)' }}>{pos.name}</div>
      </div>
    </div>
  );
}

function EnemyRow({ pos, fig, revealed }) {
  if (!revealed || !fig) {
    return (
      <div className="panel" style={{ padding: '11px 12px', display: 'flex', alignItems: 'center', gap: 10, opacity: 0.6 }}>
        <Crest dashed placeholderAbbr={pos.abbr} size={40} pos={pos.key} />
        <div style={{ flex: 1 }}>
          <div className="disp" style={{ fontSize: 15.5, color: 'var(--ink-faint)', letterSpacing: '0.05em' }}>Unknown</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-faint)' }}>Concealed by fog of war</div>
        </div>
        <div className="label" style={{ fontSize: 10, color: 'var(--ink-faint)' }}>{pos.abbr}</div>
      </div>
    );
  }
  return (
    <div className="panel" style={{ padding: '10px 12px', display: 'flex', alignItems: 'center', gap: 10,
      borderLeft: `4px solid ${fig.regionInk}`, animation: 'woaFadeUp 0.4s ease both' }}>
      <Crest fig={fig} size={40} pos={pos.key} dim />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="disp" style={{ fontSize: 15.5, lineHeight: 1.05 }}>{fig.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-soft)' }}>{pos.name} · {fig.eraName}</div>
      </div>
    </div>
  );
}

// ── Nemesis cards — the sighted enemy officers, writ in menace ──
// Intro only: the commander & strategist you must answer for get an
// ember-lit, wax-red plate with a full-colour crest — the rest of the
// warband stays fogbound below them.
function NemesisCard({ fig, pos, major }) {
  return (
    <div className="panel" style={{ position: 'relative', overflow: 'hidden',
      padding: major ? '16px 16px 15px' : '12px 14px',
      background: 'linear-gradient(160deg, #321712 0%, #241b10 75%)',
      border: '1px solid rgba(143,45,34,0.8)',
      boxShadow: major
        ? '0 0 0 1px rgba(143,45,34,0.3), 0 10px 26px rgba(70,16,8,0.4)'
        : '0 6px 16px rgba(70,16,8,0.3)',
      display: 'flex', alignItems: 'center', gap: 13,
      animation: 'woaFadeUp 0.5s ease both' }}>
      {/* ember glow behind the crest */}
      <div style={{ position: 'absolute', left: -24, top: '50%', width: 150, height: 150, transform: 'translateY(-50%)',
        background: 'radial-gradient(circle, rgba(208,72,42,0.26), transparent 65%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', flexShrink: 0, filter: 'drop-shadow(0 3px 8px rgba(0,0,0,0.5))' }}>
        <Crest fig={fig} size={major ? 62 : 48} pos={pos.key} />
      </div>
      <div style={{ flex: 1, minWidth: 0, position: 'relative' }}>
        <div className="label" style={{ fontSize: 8.5, color: '#d98a76', letterSpacing: '0.2em' }}>
          Enemy {pos.name} · Sighted
        </div>
        <div className="disp" style={{ fontSize: major ? 21 : 16.5, color: '#f3cdb8', lineHeight: 1.08, margin: '3px 0 2px',
          textShadow: '0 2px 8px rgba(0,0,0,0.5)' }}>{fig.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: '#b08a78' }}>
          {fig.tier} · {fig.eraName} · {fig.regionName}
        </div>
        {major && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 7 }}>
            {fig.tags.slice(0, 3).map(t => (
              <span key={t} style={{ fontFamily: 'var(--display)', fontSize: 7.5, fontWeight: 700, textTransform: 'uppercase',
                letterSpacing: '0.1em', padding: '2px 6px', borderRadius: 2,
                color: '#e0907f', border: '1px solid rgba(208,72,42,0.45)', background: 'rgba(143,45,34,0.18)' }}>{t}</span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EnemyLedger({ enemy, revealAll, ideologyDef, compact, featured }) {
  const sighted = (p) => revealAll || ENEMY_SIGHTED.includes(p.key);
  const concealed = D.POSITIONS.filter((p) => !sighted(p)).length;
  return (
    <div>
      <RailTitle color="var(--seal)">Enemy Warband</RailTitle>
      {!revealAll && <EnemyIdeologyPlaque def={ideologyDef} compact={compact} />}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
        {D.POSITIONS.map((p) => featured && sighted(p) && enemy[p.key] ? (
          <NemesisCard key={p.key} fig={enemy[p.key]} pos={p} major={p.key === 'commander'} />
        ) : compact ? (
          <EnemyRowMini key={p.key} pos={p} fig={enemy[p.key]} revealed={sighted(p)} />
        ) : (
          <EnemyRow key={p.key} pos={p} fig={enemy[p.key]} revealed={sighted(p)} />
        ))}
      </div>
      {!revealAll && (
        <div style={{ marginTop: 9, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: compact ? 11 : 12, color: 'var(--ink-faint)', textAlign: 'center' }}>
          {featured
            ? `${concealed} ranks still ride beneath the fog — mark well the banners you can see.`
            : `${concealed} ranks concealed — fog of war prevails.`}
        </div>
      )}
    </div>
  );
}

// ── Re-roll tokens — top right of the Wheel of Ages ───────────
// One re-roll per ring, per war. Bare glyph + label, side by side;
// spent re-rolls simply fade to a lighter shade of the same ink.
function RerollGlyph({ size = 15, color }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color}
      strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"
      style={{ display: 'block', transition: 'stroke .25s' }}>
      <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
      <path d="M21 3v5h-5" />
      <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
      <path d="M8 16H3v5" />
    </svg>
  );
}

function RerollChip({ label, ink, inkSpent, available, enabled, onUse }) {
  const c = available ? ink : inkSpent;
  return (
    <button type="button" disabled={!enabled} onClick={enabled ? onUse : undefined}
      title={available ? `Re-roll the ${label.toLowerCase()} ring — once per war` : `${label} re-roll spent`}
      style={{
        display: 'flex', alignItems: 'center', gap: 6, padding: 2,
        background: 'none', border: 'none',
        fontFamily: 'var(--display)', fontSize: 11.5, fontWeight: 700,
        letterSpacing: '0.12em', textTransform: 'uppercase',
        color: c, cursor: enabled ? 'pointer' : 'default',
        transition: 'color .25s',
      }}>
      <RerollGlyph size={15} color={c} />
      {label}
    </button>
  );
}

function RerollChips({ rerolls, canUse, onReroll, inline }) {
  return (
    <div style={inline
      ? { display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 18 }
      : { position: 'absolute', top: 12, right: 14, zIndex: 8, display: 'flex', alignItems: 'center', gap: 16 }}>
      <RerollChip label="Region" ink="#8f2d22" inkSpent="rgba(143,45,34,0.3)"
        available={rerolls.region} enabled={canUse && rerolls.region} onUse={() => onReroll('region')} />
      <RerollChip label="Era" ink="#b08a2e" inkSpent="rgba(176,138,46,0.32)"
        available={rerolls.era} enabled={canUse && rerolls.era} onUse={() => onReroll('era')} />
    </div>
  );
}

// ── INTRO ─────────────────────────────────────────────────────
function DIntro({ battleground, enemy, enemyIdeology, onBegin }) {
  const hall = (typeof TERRAIN_HALL !== 'undefined' && TERRAIN_HALL[battleground.key]) || ['#4e4639', '#2c2820'];
  return (
    <div data-screen-label="Intro" style={{ paddingTop: 24 }}>
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <Sigil size={72} />
        <h1 className="deco" style={{ fontSize: 88, fontWeight: 900, letterSpacing: '0.03em', margin: '10px 0 6px', lineHeight: 0.95 }}>
          War <span className="wo-o">O</span>' Ages
        </h1>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 22, color: 'var(--ink-soft)', marginTop: 4 }}>
          Assemble a legion across history. Spin the wheel. Conquer the ages.
        </div>
      </div>

      <div className="desk-grid" style={{ alignItems: 'stretch' }}>
        {/* LEFT: empty formation preview — primes the player for what they're building */}
        <div className="rail-left">
          <LegionLedger squad={{}} activeKey={null} hierarchy />
        </div>

        {/* CENTER: today's battlefield — a candle-lit mural of the ground itself,
            stretched to stand shoulder to shoulder with the two warbands */}
        <div className="rail-center desk-mapwrap" style={{ display: 'flex', flexDirection: 'column' }}>
          <RailTitle>Today's Battlefield</RailTitle>
          <div className="panel" style={{ flex: 1, padding: 6, display: 'flex', flexDirection: 'column' }}>
            {/* the mural — the same hall the war map hangs in, headlining the ground */}
            <div style={{ position: 'relative', flex: 1, minHeight: 280, borderRadius: 2, overflow: 'hidden',
              border: '1px solid var(--panel-edge)',
              background: `radial-gradient(95% 95% at 50% 46%, ${hall[0]}, ${hall[1]} 96%)` }}>
              <svg width="100%" height="100%" viewBox="0 0 300 320" preserveAspectRatio="none"
                style={{ position: 'absolute', inset: 0 }}>
                <TerrainBackdrop terrain={battleground.key} />
              </svg>
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(circle at 4% 8%, rgba(255,140,20,0.16), transparent 30%), radial-gradient(circle at 96% 8%, rgba(255,140,20,0.16), transparent 30%), linear-gradient(0deg, rgba(14,9,3,0.5), transparent 45%)' }} />
              <div style={{ position: 'relative', height: '100%', display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '26px 30px', boxSizing: 'border-box' }}>
                <div className="label" style={{ fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold-bright)' }}>The Armies Converge Upon</div>
                <div className="disp" style={{ fontSize: 54, lineHeight: 1.05, color: '#f3e3b8', margin: '10px 0 8px',
                  textShadow: '0 3px 16px rgba(0,0,0,0.55)', textWrap: 'balance' }}>{battleground.name}</div>
                <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, color: '#cdb98f', maxWidth: 440, textWrap: 'balance' }}>
                  {battleground.terrain}
                </div>
              </div>
            </div>
            {/* the terms of the ground + the call to march */}
            <div style={{ padding: '16px 14px 14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                <span style={{ ...dPill('var(--c-EASIA)'), textAlign: 'center' }}>▲ {battleground.buff}</span>
                <span style={{ ...dPill('var(--seal)'), textAlign: 'center' }}>▼ {battleground.debuff}</span>
              </div>
              <button type="button" className="btn btn-primary"
                style={{ width: '100%', marginTop: 16, fontSize: 17, padding: '17px' }}
                onClick={onBegin}>Begin Campaign ✦</button>
              <div style={{ textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-faint)', marginTop: 10 }}>
                Spin the wheel of history. Fill all five ranks, then march.
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: enemy intel — the sighted officers writ large, rivalry first */}
        <div className="rail-right">
          <EnemyLedger enemy={enemy} revealAll={false} ideologyDef={enemyIdeology} featured />
        </div>
      </div>
    </div>
  );
}

const dPill = (c) => ({
  fontFamily: 'var(--display)', fontSize: 13, fontWeight: 600, textTransform: 'uppercase',
  letterSpacing: '0.08em', padding: '9px 14px', borderRadius: 3,
  border: `1px solid ${c}`, color: c, background: 'rgba(255,250,235,0.5)',
});

function SynergyRow({ s, delay = 0, fired }) {
  const colors = { buff: 'var(--c-EASIA)', risk: 'var(--gold)', penalty: 'var(--seal)', ideology: 'var(--gold)' };
  const c = colors[s.kind] || 'var(--ink-soft)';
  return (
    <div className="panel" style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 10,
      borderLeft: `4px solid ${c}`, animation: 'woaTick 0.4s ease both', animationDelay: `${delay}ms`,
      boxShadow: fired ? `0 0 0 2px ${hexA('#d4af4f', 0.5)}` : undefined }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="disp" style={{ fontSize: 14.5, color: 'var(--ink)' }}>{s.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-soft)' }}>{s.note}</div>
      </div>
      <div className="disp" style={{ fontSize: 18, color: c, whiteSpace: 'nowrap' }}>{s.pct > 0 ? '+' : ''}{s.pct}%</div>
    </div>
  );
}

// ── Candidate card (selection phase) ─────────────────────────
function CandidateCard({ fig, posKey, selected, onSelect, draggable, onDragStart, onDragEnd }) {
  return (
    <div role="button" tabIndex={0} onClick={onSelect}
      onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(); } }}
      draggable={draggable || undefined} onDragStart={onDragStart} onDragEnd={onDragEnd}
      className="panel" style={{
      textAlign: 'left', cursor: draggable ? 'grab' : 'pointer', userSelect: 'none',
      boxSizing: 'border-box', padding: '11px 12px', width: '100%',
      display: 'flex', gap: 10, alignItems: 'flex-start',
      borderLeft: `4px solid ${fig.regionInk}`,
      border: selected ? '1px solid var(--gold)' : '1px solid var(--panel-edge)',
      outline: selected ? '2px solid var(--gold-bright)' : 'none',
      outlineOffset: 1,
      background: selected ? 'linear-gradient(160deg,#2e2519,#3a2c1c)' : undefined,
      transition: 'outline .12s, background .15s, border-color .12s',
      animation: 'woaFadeUp 0.35s ease both',
    }}>
      <div style={{ flexShrink: 0 }}>
        <Crest fig={fig} size={40} pos={posKey} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="disp" style={{ fontSize: 15, lineHeight: 1.05, color: selected ? '#e7d3a8' : 'var(--ink)' }}>
          {fig.name}
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11,
          color: selected ? '#a8896a' : 'var(--ink-soft)', marginTop: 1 }}>
          {fig.eraName}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, marginTop: 5 }}>
          {fig.tags.slice(0, 3).map(t => (
            <span key={t} style={{
              fontFamily: 'var(--display)', fontSize: 7.5, fontWeight: 600, textTransform: 'uppercase',
              letterSpacing: '0.1em', padding: '1px 5px', borderRadius: 2,
              color: selected ? '#d4af4f' : fig.regionInk,
              border: `1px solid ${selected ? 'rgba(212,175,79,0.35)' : hexA(fig.regionInk, 0.35)}`,
              background: selected ? 'rgba(212,175,79,0.08)' : hexA(fig.regionInk, 0.07),
            }}>{t}</span>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 2, marginTop: 7 }}>
          {D.STAT_KEYS.map(k => (
            <div key={k} style={{ textAlign: 'center' }}>
              <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: 13,
                color: selected ? '#e7d3a8' : 'var(--ink)', lineHeight: 1 }}>{fig.stats[k]}</div>
              <div style={{ fontFamily: 'var(--display)', fontSize: 7, letterSpacing: '0.1em',
                color: selected ? '#9fd1a8' : 'var(--ink-faint)', marginTop: 1 }}>{k}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── SPIN / MUSTER ─────────────────────────────────────────────
// Flow: spin wheel → lands on region+era → choose from that pool → confirm
function DSpin({ squad, setSquad, battleground, exclude, onComplete, enemy, enemyIdeology, rerolls, setRerolls }) {
  const placed = D.POSITIONS.filter((p) => squad[p.key]);
  const stepIndex = placed.length;
  const pos = D.POSITIONS[Math.min(stepIndex, 4)];
  const done = stepIndex >= 5;

  const [phase, setPhase] = dS('idle'); // idle | spinning | selecting | confirming
  const [regionRot, setRegionRot] = dS(0);
  const [eraRot, setEraRot] = dS(0);
  const [landed, setLanded] = dS({ region: null, era: null });
  const [candidates, setCandidates] = dS([]);
  const [drawn, setDrawn] = dS(null);
  const [justPlaced, setJustPlaced] = dS(null);
  const [hint, setHint] = dS(null);
  const [dragFig, setDragFig] = dS(null); // candidate mid-drag toward the ledger
  const [rerollKind, setRerollKind] = dS(null); // which ring is mid-re-roll
  const timers = dR([]);
  dE(() => () => timers.current.forEach(clearTimeout), []);

  const regions = Object.values(D.REGIONS), eras = Object.values(D.ERAS);
  const currentSyn = D.detectSynergies(squad);

  function spin() {
    if (phase !== 'idle' || done) return;
    const used = D.squadList(squad).map((f) => f.name);
    let pool = D.poolFor(pos.key).filter((f) => !used.includes(f.name) && !(exclude || []).includes(f.name));
    if (!pool.length) pool = D.poolFor(pos.key);
    // Pick a seed figure to determine where the wheel lands
    const landFig = pool[Math.floor(Math.random() * pool.length)];
    const ri = regions.findIndex((r) => r.key === landFig.region);
    const ei = eras.findIndex((e) => e.key === landFig.era);
    const segR = 360 / regions.length, segE = 360 / eras.length;
    const targR = (-ri * segR % 360 + 360) % 360;
    const targE = ((180 - ei * segE) % 360 + 360) % 360;
    setRegionRot((r) => r + 360 * 4 + ((targR - r % 360) % 360 + 360) % 360);
    setEraRot((r) => r - 360 * 5 - ((r - targE) % 360 + 360) % 360);
    setLanded({ region: null, era: null }); setDrawn(null); setCandidates([]); setHint(null); setPhase('spinning');
    timers.current.push(setTimeout(() => setLanded({ region: landFig.region, era: null }), 3200));
    timers.current.push(setTimeout(() => setLanded({ region: landFig.region, era: landFig.era }), 3550));
    timers.current.push(setTimeout(() => {
      // Build candidate list: all eligible figures from that region+era
      const exactMatches = pool.filter(f => f.region === landFig.region && f.era === landFig.era);
      // Fallback: same region any era (rare edge case)
      const regionMatches = pool.filter(f => f.region === landFig.region);
      setCandidates(exactMatches.length > 0 ? exactMatches : regionMatches.length > 0 ? regionMatches : pool);
      setPhase('selecting');
    }, 3900));
  }

  function selectCandidate(fig) {
    setDrawn(fig);
  }

  // Re-roll a single ring — region or era — once each per war.
  // The wheel strip stays mounted and its dial animates in place: ONLY the
  // rerolled ring turns, the other holds exactly where it landed. The new
  // result is then resolved into a fresh candidate list.
  function reroll(kind) {
    if (phase !== 'selecting' || !rerolls[kind] || done) return;
    const used = D.squadList(squad).map((f) => f.name);
    let pool = D.poolFor(pos.key).filter((f) => !used.includes(f.name) && !(exclude || []).includes(f.name));
    if (!pool.length) pool = D.poolFor(pos.key);
    const curR = landed.region, curE = landed.era;
    // A re-roll can NEVER land back on the tile it started from, and every
    // other answerable tile gets an EQUAL chance — we pick among distinct
    // tiles first, not among figures (which would weight crowded tiles).
    // If NO figure answers in any other tile of the re-rolled ring while the
    // other ring holds, the other ring must give way too: both rings turn,
    // and the candidates always match where the wheel actually points.
    let newR = curR, newE = curE, spinBoth = false;
    if (kind === 'region') {
      const tiles = [...new Set(pool.filter((f) => f.era === curE && f.region !== curR).map((f) => f.region))];
      if (tiles.length) {
        newR = tiles[Math.floor(Math.random() * tiles.length)];
      } else {
        const alt = pool.filter((f) => f.region !== curR);
        if (alt.length) {
          const pick = alt[Math.floor(Math.random() * alt.length)];
          newR = pick.region; newE = pick.era; spinBoth = newE !== curE;
        }
      }
    } else {
      const tiles = [...new Set(pool.filter((f) => f.region === curR && f.era !== curE).map((f) => f.era))];
      if (tiles.length) {
        newE = tiles[Math.floor(Math.random() * tiles.length)];
      } else {
        const alt = pool.filter((f) => f.era !== curE);
        if (alt.length) {
          const pick = alt[Math.floor(Math.random() * alt.length)];
          newE = pick.era; newR = pick.region; spinBoth = newR !== curR;
        }
      }
    }
    setRerolls((r) => ({ ...r, [kind]: false }));
    const segR = 360 / regions.length, segE = 360 / eras.length;
    const spinRegion = kind === 'region' || (spinBoth && newR !== curR);
    const spinEra = kind === 'era' || (spinBoth && newE !== curE);
    if (spinRegion) {
      const ri = regions.findIndex((r) => r.key === newR);
      const targR = (-ri * segR % 360 + 360) % 360;
      setRegionRot((r) => r + 360 * 3 + ((targR - r % 360) % 360 + 360) % 360);
    }
    if (spinEra) {
      const ei = eras.findIndex((e) => e.key === newE);
      const targE = ((180 - ei * segE) % 360 + 360) % 360;
      setEraRot((r) => r - 360 * 4 - ((r - targE) % 360 + 360) % 360);
    }
    setLanded({ region: spinRegion ? null : curR, era: spinEra ? null : curE });
    const settle = spinEra ? 3500 : 3200; // era ring transition is the longer of the two
    setDrawn(null); setCandidates([]); setHint(null); setRerollKind(kind); setPhase('rerolling');
    timers.current.push(setTimeout(() => setLanded({ region: newR, era: newE }), settle));
    timers.current.push(setTimeout(() => {
      // Candidates must match EXACTLY where the wheel points — newR/newE were
      // chosen from tiles that are guaranteed to have answering figures, so
      // the old "same region, any era" fallback (which could resurface the
      // original era's figures) is gone.
      setCandidates(pool.filter(f => f.region === newR && f.era === newE));
      setRerollKind(null); setPhase('selecting');
    }, settle + 350));
  }

  function place(figArg) {
    const f = figArg || drawn;
    if (!f) return;
    setDrawn(f);
    setDragFig(null);
    setPhase('confirming');
    timers.current.push(setTimeout(() => {
      const next = { ...squad, [pos.key]: f };
      const before = D.detectSynergies(squad).length, after = D.detectSynergies(next);
      setSquad(next); setJustPlaced(pos.key); setDrawn(null); setCandidates([]);
      setPhase('idle'); setLanded({ region: null, era: null });
      if (after.length > before) {
        const fresh = after[after.length - 1];
        setHint(fresh);
        timers.current.push(setTimeout(() => setHint(null), 2800));
      }
      timers.current.push(setTimeout(() => setJustPlaced(null), 800));
      if (D.POSITIONS.filter((p) => next[p.key]).length >= 5) timers.current.push(setTimeout(onComplete, 700));
    }, 680));
  }

  const landedRegion = landed.region ? D.REGIONS[landed.region] : null;
  const landedEra = landed.era ? D.ERAS[landed.era] : null;

  // Responsive vertical budget — one row height for ALL phases, sized like the
  // post-spin muster view: map + wheel hold ~60% of the window, never stretching
  // to fill idle space. The candidate grid below shares the same budget.
  const [vh, setVh] = dS(() => window.innerHeight || 900);
  dE(() => {
    const f = () => setVh(window.innerHeight);
    window.addEventListener('resize', f);
    return () => window.removeEventListener('resize', f);
  }, []);
  const rowH = Math.round(Math.max(440, Math.min(640, vh - 500)));
  const dialSize = Math.max(216, Math.min(300, rowH - 250));
  const stripDial = Math.min(264, Math.max(208, rowH - 200));
  const gridMax = Math.max(200, vh - rowH - 234);
  const ghostH = Math.max(150, Math.min(260, vh - rowH - 218));

  return (
    <div data-screen-label="Muster" className="desk-grid foe-min">
      {/* LEFT: your growing legion + selected figure preview */}
      <div className="rail-left">
        <LegionLedger squad={squad} activeKey={done ? null : pos.key}
          draggingFig={phase === 'selecting' ? dragFig : null}
          onDropFig={phase === 'selecting' ? () => { if (dragFig) place(dragFig); } : null} />

        {/* Buff/debuff toasts surface on the LEFT, beside the legion they affect */}
        {hint && (
          <div className="panel" style={{ marginTop: 14, padding: '12px 16px', textAlign: 'center',
            background: 'linear-gradient(180deg,#2a2017,#3a2c1c)', border: '1px solid var(--gold)',
            animation: 'woaPop 0.4s ease both' }}>
            <div className="caps" style={{ fontSize: 10, color: 'var(--gold-bright)' }}>Synergy Stirring</div>
            <div className="disp" style={{ fontSize: 17, color: '#e7d3a8' }}>
              {hint.name} <span style={{ color: '#9fd1a8' }}>{hint.pct > 0 ? '+' : ''}{hint.pct}%</span>
            </div>
          </div>
        )}

        {drawn && (
          <div style={{ marginTop: 16,
            animation: phase === 'confirming'
              ? 'woaSealIn 0.65s cubic-bezier(.2,1.2,.3,1) both'
              : 'woaPop 0.45s ease both' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
              <span className="caps" style={{ fontSize: 11, color: 'var(--gold)' }}>
                {phase === 'confirming' ? '✦ Taking Position' : '✦ Selected'}
              </span>
              <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11, color: 'var(--ink-faint)' }}>
                {D.REGIONS[drawn.region].name}
              </span>
            </div>
            <FigureCard fig={drawn} positionName={`${pos.name} · ${drawn.eraName}`} pos={pos.key} />
          </div>
        )}

        {/* Active synergies — persist as legion builds */}
        {currentSyn.length > 0 && (
          <div style={{ marginTop: 20, animation: 'woaFadeUp 0.4s ease both' }}>
            <RailTitle color="var(--c-EASIA)">Active Synergies</RailTitle>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {currentSyn.map((s, i) => <SynergyRow key={s.name} s={s} delay={i * 60} />)}
            </div>
          </div>
        )}
      </div>

      {/* CENTER: war map + wheel side by side — the map holds the width, the wheel keeps a narrow column.
          rowH stretches the pair into tall windows and is shared with the candidate grid below. */}
      <div className="rail-center desk-mapwrap">
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0,1fr) 300px', gap: 18, alignItems: 'start' }}>
          {/* The War Map — wide anchor, never moves */}
          <div>
            <RailTitle>The War Map</RailTitle>
            <FormationBoard squad={squad} activePos={done ? null : pos.key} justPlaced={justPlaced}
              battleground={battleground} height={rowH} />
          </div>

          {/* The Wheel of Ages — narrow column, bottom-aligned to the map */}
          <div>
            <RailTitle color="var(--gold)">The Wheel of Ages</RailTitle>

            {(phase === 'idle' || phase === 'spinning') && (
              <div className="panel" style={{ padding: '10px 16px 14px', position: 'relative', height: rowH + 14,
                boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
                <div className="frame-rule" />
                {/* re-rolls anchored in the clear air above the dial */}
                <div style={{ paddingTop: 14, display: 'flex', justifyContent: 'center' }}>
                  <RerollChips rerolls={rerolls} canUse={false} onReroll={reroll} inline />
                </div>
                <div style={{ flex: 1, minHeight: 0, padding: '10px 0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CompassDial size={dialSize} regionRot={regionRot} eraRot={eraRot}
                    spinning={phase === 'spinning'} landedRegion={landed.region} landedEra={landed.era} />
                </div>
                {!done ? (
                  <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center', minHeight: 0 }}>
                    <div className="label">Now drawing</div>
                    <div className="disp" style={{ fontSize: 20, color: 'var(--ink)', margin: '2px 0 2px' }}>The {pos.name}</div>
                    <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-soft)', lineHeight: 1.35,
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {pos.blurb}
                    </div>
                    <div style={{ marginTop: 10, paddingTop: 6 }}>
                      {phase === 'idle' && (
                        <button className="btn btn-gold" style={{ width: '100%', fontSize: 13.5, padding: '12px 8px' }} onClick={spin}>
                          Spin the Wheel
                        </button>
                      )}
                      {phase === 'spinning' && (
                        <div className="caps" style={{ fontSize: 11, color: 'var(--seal)', padding: '13px 0', animation: 'woaFloat 1s ease-in-out infinite' }}>
                          {landed.region ? (landed.era ? 'Summoning…' : 'Era settling…') : 'The wheel turns…'}
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 14, color: 'var(--ink-soft)', textAlign: 'center' }}>
                    The legion stands assembled.
                  </div>
                )}
              </div>
            )}

            {/* After the wheel settles — the dial holds its column; verdict + confirm live with it.
                During a re-roll the dial spins its single ring in place. */}
            {(phase === 'selecting' || phase === 'confirming' || phase === 'rerolling') && (
              <div className="panel" style={{ padding: '10px 16px 14px', position: 'relative', height: rowH + 14,
                boxSizing: 'border-box', display: 'flex', flexDirection: 'column', textAlign: 'center',
                pointerEvents: phase === 'confirming' ? 'none' : 'auto' }}>
                <div className="frame-rule" />
                {/* re-rolls anchored in the clear air above the dial */}
                <div style={{ paddingTop: 14, display: 'flex', justifyContent: 'center' }}>
                  <RerollChips rerolls={rerolls} canUse={phase === 'selecting'} onReroll={reroll} inline />
                </div>
                <div style={{ flex: 1, minHeight: 0, padding: '8px 0 6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <CompassDial size={stripDial} regionRot={regionRot} eraRot={eraRot}
                    spinning={phase === 'rerolling'} landedRegion={landed.region} landedEra={landed.era} />
                </div>
                <div className="caps" style={{ fontSize: 10, color: phase === 'rerolling' ? 'var(--seal)' : 'var(--gold)' }}>
                  {phase === 'rerolling'
                    ? (rerollKind === 'region' ? 'The Region Ring Turns…' : 'The Era Ring Turns…')
                    : 'The Wheel Has Spoken'}
                </div>
                <div style={{ margin: '5px 0 2px' }}>
                  <div className="disp" style={{ fontSize: 22, lineHeight: 1.15, color: landedRegion ? landedRegion.ink : 'var(--ink-faint)' }}>
                    {landedRegion ? landedRegion.name : '· · ·'}
                  </div>
                  <div className="disp" style={{ fontSize: 16.5, lineHeight: 1.2, color: landedEra ? 'var(--ink-soft)' : 'var(--ink-faint)', marginTop: 3 }}>
                    {landedEra ? landedEra.name : '· · ·'}
                  </div>
                </div>
                <div style={{ marginTop: 12 }}>
                  {drawn && phase === 'selecting' && (
                    <button className="btn btn-primary" style={{ width: '100%', fontSize: 14, padding: '12px 8px' }} onClick={() => place()}>
                      Take Position ✦
                    </button>
                  )}
                  {phase === 'confirming' && (
                    <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--seal)', padding: '12px 0', animation: 'woaFloat 0.65s ease-in-out' }}>
                      Taking position…
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Candidate selection — full-width beneath the map + wheel, like a muster table */}
        {(phase === 'selecting' || phase === 'confirming') && candidates.length > 0 && (
          <div className="panel" style={{ padding: '12px 16px 14px', position: 'relative', marginTop: 12,
            pointerEvents: phase === 'confirming' ? 'none' : 'auto' }}>
            <div className="frame-rule" />
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 10, padding: '0 2px' }}>
              <div className="disp" style={{ fontSize: 19, whiteSpace: 'nowrap' }}>Choose your {pos.name}</div>
              <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, var(--line) 0%, var(--line) 55%, transparent 100%)', alignSelf: 'center' }} />
              <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>
                {drawn ? 'Drag to your legion, or confirm with Take Position ↗' : 'Select to preview — or drag a figure onto your legion to lock them in'}
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 10,
              maxHeight: gridMax, overflowY: 'auto' }}>
              {candidates.map(fig => (
                <CandidateCard key={fig.id} fig={fig} posKey={pos.key}
                  selected={drawn ? drawn.name === fig.name : false}
                  onSelect={() => selectCandidate(fig)}
                  draggable={phase === 'selecting'}
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', fig.name);
                    e.dataTransfer.effectAllowed = 'move';
                    requestAnimationFrame(() => { selectCandidate(fig); setDragFig(fig); });
                  }}
                  onDragEnd={() => setDragFig(null)} />
              ))}
            </div>
          </div>
        )}

        {/* Bottom band — the ghosted muster table, mirroring the real table's
            anatomy (same header row, same card grid) so the swap feels like the
            same furniture filling in rather than appearing. */}
        {!((phase === 'selecting' || phase === 'confirming') && candidates.length > 0) && (
          <div style={{ marginTop: 12, animation: 'woaFadeUp 0.5s ease both' }}>
            <div style={{ border: '1.5px dashed rgba(107,85,50,0.42)', borderRadius: 3,
              padding: '12px 16px 14px', height: ghostH, boxSizing: 'border-box',
              display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, padding: '0 2px' }}>
                <span className="disp" style={{ fontSize: 19, color: 'var(--ink-faint)', whiteSpace: 'nowrap', opacity: 0.75 }}>The Muster Table</span>
                <span style={{ flex: 1, height: 1, background: 'linear-gradient(90deg, rgba(107,85,50,0.3), transparent)', alignSelf: 'center' }} />
                <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--ink-faint)', whiteSpace: 'nowrap' }}>
                  — awaits the wheel's verdict —
                </span>
              </div>
              <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                gap: 10, marginTop: 10, alignContent: 'start', overflow: 'hidden',
                WebkitMaskImage: 'linear-gradient(180deg, #000 62%, transparent 97%)',
                maskImage: 'linear-gradient(180deg, #000 62%, transparent 97%)' }}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} style={{ height: 100, boxSizing: 'border-box', border: '1px dashed rgba(107,85,50,0.28)', borderRadius: 3,
                    display: 'flex', alignItems: 'flex-start', gap: 10, padding: '11px 12px' }}>
                    <div style={{ width: 40, height: 40, border: '1px dashed rgba(107,85,50,0.3)', borderRadius: 3, flexShrink: 0 }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ height: 10, width: '62%', background: 'rgba(107,85,50,0.12)', borderRadius: 2 }} />
                      <div style={{ height: 8, width: '38%', background: 'rgba(107,85,50,0.09)', borderRadius: 2, marginTop: 6 }} />
                      <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>
                        {[26, 32, 22].map((w, j) => (
                          <div key={j} style={{ width: w, height: 9, border: '1px dashed rgba(107,85,50,0.22)', borderRadius: 2 }} />
                        ))}
                      </div>
                      <div style={{ height: 8, width: '78%', background: 'rgba(107,85,50,0.07)', borderRadius: 2, marginTop: 9 }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT: enemy warband (persistent, minimized — focus stays on the muster) */}
      <div className="rail-right">
        <EnemyLedger enemy={enemy} revealAll={false} ideologyDef={enemyIdeology} compact />
      </div>
    </div>
  );
}

// ── COUNCIL ───────────────────────────────────────────────────
function DIdeologyRow({ def, squad, selected, onSelect }) {
  const eff = def.effect(squad);
  const pos = eff.pct >= 0;
  return (
    <button type="button" onClick={onSelect} className="panel ideo-row" style={{
      scrollSnapAlign: 'center', textAlign: 'left', cursor: 'pointer', padding: '11px 13px',
      display: 'flex', gap: 12, alignItems: 'center', width: '100%',
      border: selected ? '1px solid var(--gold)' : '1px solid var(--panel-edge)',
      boxShadow: selected ? '0 0 0 2px var(--gold-bright)' : undefined,
      background: selected ? 'linear-gradient(180deg, rgba(212,175,79,0.18), rgba(255,250,235,0.4))' : undefined,
      transform: selected ? 'scale(1.012)' : 'none',
      transition: 'box-shadow .15s, border-color .15s, transform .15s',
    }}>
      <div style={{ flexShrink: 0, width: 40, height: 40, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: selected ? 'var(--seal)' : 'rgba(120,96,54,0.10)',
        border: `1px solid ${selected ? 'var(--gold)' : 'var(--line)'}` }}>
        <IdeologyIcon icon={def.icon} size={24} color={selected ? '#f4e6c9' : 'var(--ink-soft)'} strokeWidth={1.7} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
          <span className="disp" style={{ fontSize: 17, color: 'var(--ink)', lineHeight: 1.05 }}>{def.name}</span>
          <span className="disp" style={{ fontSize: 15, color: pos ? 'var(--c-EASIA)' : 'var(--seal)', whiteSpace: 'nowrap' }}>
            {pos ? '+' : ''}{eff.pct}%
          </span>
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--ink-soft)', marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {def.tenet}
        </div>
      </div>
    </button>
  );
}

function DIdeologyWheel({ squad, ideology, setIdeology }) {
  let lastGroup = null;
  return (
    <div style={{ position: 'relative' }}>
      <div className="ideo-wheel" style={{ maxHeight: 360, overflowY: 'auto', scrollSnapType: 'y proximity',
        display: 'flex', flexDirection: 'column', gap: 8, padding: '4px 14px 4px 4px' }}>
        {D.IDEOLOGIES.map((d) => {
          const head = d.group !== lastGroup ? d.group : null;
          lastGroup = d.group;
          return (
            <React.Fragment key={d.key}>
              {head && (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: head === D.IDEOLOGIES[0].group ? '2px 0 0' : '8px 0 0' }}>
                  <span className="caps" style={{ fontSize: 10, color: 'var(--gold)' }}>{head}</span>
                  <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
                </div>
              )}
              <DIdeologyRow def={d} squad={squad} selected={ideology === d.key} onSelect={() => setIdeology(d.key)} />
            </React.Fragment>
          );
        })}
      </div>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 22, pointerEvents: 'none', background: 'linear-gradient(180deg, var(--panel), transparent)' }} />
      <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 22, pointerEvents: 'none', background: 'linear-gradient(0deg, var(--panel), transparent)' }} />
    </div>
  );
}

// ── The Hung Standards — council banner ───────────────────
// Five pennants hang from a single lance in three tiers of honour:
// the commander centre (tallest, gold-trimmed), strategist & general
// flanking at officer size, troops & allies outermost and smallest.
const PENNANT_TIERS = {
  commander: { w: 124, h: 148, tail: 28, box: 168, crest: 62, crestTop: 31, name: 16,   stroke: 2,   ring: 3.4, star: 1.15 },
  officer:   { w: 106, h: 126, tail: 23, box: 144, crest: 52, crestTop: 28, name: 14.5, stroke: 1.7, ring: 3,   star: 1 },
  minor:     { w: 90,  h: 104, tail: 19, box: 122, crest: 44, crestTop: 24, name: 13,   stroke: 1.4, ring: 2.8, star: 0.8 },
};

function CouncilPennant({ fig, pos, tier = 'minor' }) {
  if (!fig) return null;
  const T = PENNANT_TIERS[tier] || PENNANT_TIERS.minor;
  const major = tier === 'commander';
  const { w, h, tail } = T;
  const bodyH = h - tail;
  const ink = fig.regionInk;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: T.box, zIndex: 2 }}>
      <div style={{ position: 'relative', width: w, height: h }}>
        <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ display: 'block', filter: 'drop-shadow(0 6px 9px rgba(0,0,0,0.42))' }}>
          {/* hanging rings */}
          <circle cx={w * 0.2} cy={3.5} r={T.ring} fill="none" stroke="#b08c3c" strokeWidth="1.6" />
          <circle cx={w * 0.8} cy={3.5} r={T.ring} fill="none" stroke="#b08c3c" strokeWidth="1.6" />
          {/* banner body — swallow point */}
          <path d={`M2,6 H${w - 2} V${bodyH} L${w / 2},${h - 5} L2,${bodyH} Z`}
            fill={ink} stroke={major ? 'var(--gold-bright)' : 'var(--gold)'} strokeWidth={T.stroke} strokeLinejoin="round" />
          {/* inner inlay panel */}
          <path d={`M8,13 H${w - 8} V${bodyH - 6} L${w / 2},${h - 12} L8,${bodyH - 6} Z`}
            fill="rgba(20,12,4,0.18)" stroke="rgba(231,211,168,0.5)" strokeWidth="0.8" strokeLinejoin="round" />
          {/* top sleeve */}
          <rect x={2} y={6} width={w - 4} height={9} fill="rgba(14,9,3,0.32)" />
          {/* corner studs */}
          <circle cx={9.5} cy={20.5} r={1.7} fill="#d4af4f" opacity="0.85" />
          <circle cx={w - 9.5} cy={20.5} r={1.7} fill="#d4af4f" opacity="0.85" />
          <circle cx={9.5} cy={bodyH - 1} r={1.7} fill="#d4af4f" opacity="0.7" />
          <circle cx={w - 9.5} cy={bodyH - 1} r={1.7} fill="#d4af4f" opacity="0.7" />
          {/* tail star — a gold device filling the swallow point */}
          <g transform={`translate(${w / 2}, ${bodyH + tail * 0.12}) scale(${T.star})`}>
            <path d="M0,-6.5 L1.9,-1.9 L6.5,0 L1.9,1.9 L0,6.5 L-1.9,1.9 L-6.5,0 L-1.9,-1.9 Z" fill="#d4af4f" opacity="0.9" />
            <circle r="1.3" fill={ink} />
          </g>
          {/* tail tassel */}
          <line x1={w / 2} y1={h - 5} x2={w / 2} y2={h - 1.5} stroke="#b08c3c" strokeWidth="1.4" />
          <circle cx={w / 2} cy={h - 1.5} r="2" fill="#b08c3c" />
        </svg>
        <div style={{ position: 'absolute', top: T.crestTop, left: '50%', transform: 'translateX(-50%)' }}>
          <Crest fig={fig} size={T.crest} pos={pos.key} />
        </div>
      </div>
      <div className="disp" style={{ fontSize: T.name, color: major ? '#f3e3b8' : '#e7d3a8', marginTop: 9,
        textAlign: 'center', lineHeight: 1.15, maxWidth: '100%', textWrap: 'balance' }}>{fig.name}</div>
      <div className="label" style={{ fontSize: 8, color: '#8a7350', marginTop: 3 }}>{pos.name.toUpperCase()}</div>
    </div>
  );
}

function CouncilBanner({ squad }) {
  const order = ['troops', 'strategist', 'commander', 'general', 'allies'];
  const tierOf = { commander: 'commander', strategist: 'officer', general: 'officer', troops: 'minor', allies: 'minor' };
  const posByKey = {};
  D.POSITIONS.forEach((p) => { posByKey[p.key] = p; });
  return (
    <div className="panel" style={{ padding: 6, position: 'relative' }}>
      <div style={{ position: 'relative', borderRadius: 2, overflow: 'hidden', border: '1px solid var(--panel-edge)',
        background: 'radial-gradient(110% 140% at 50% 0%, #3a2c1c 0%, #241b10 80%)', padding: '26px 18px 16px' }}>
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none',
          background: 'radial-gradient(circle at 3% 10%, rgba(255,140,20,0.13), transparent 30%), radial-gradient(circle at 97% 10%, rgba(255,140,20,0.13), transparent 30%)' }} />
        {/* the lance the standards hang from */}
        <div style={{ position: 'absolute', top: 33, left: 26, right: 26, height: 5, borderRadius: 3,
          background: 'linear-gradient(180deg, #a8843c, #6e5418)', boxShadow: '0 2px 4px rgba(0,0,0,0.45)' }} />
        <div style={{ position: 'absolute', top: 29.5, left: 15, width: 12, height: 12, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #d4af4f, #8a6c20)', border: '1px solid #6e5418' }} />
        <div style={{ position: 'absolute', top: 29.5, right: 15, width: 12, height: 12, borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 30%, #d4af4f, #8a6c20)', border: '1px solid #6e5418' }} />
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', gap: 8, paddingTop: 10 }}>
          {order.map((k) => <CouncilPennant key={k} fig={squad[k]} pos={posByKey[k]} tier={tierOf[k]} />)}
        </div>
      </div>
    </div>
  );
}

function DCouncil({ squad, battleground, ideology, setIdeology, onMarch, enemy, enemyIdeology }) {
  const syn = D.detectSynergies(squad);
  const selDef = ideology ? D.ideologyByKey(ideology) : null;
  const selEff = selDef ? selDef.effect(squad) : null;

  return (
    <div data-screen-label="Council" className="desk-grid foe-min">
      {/* LEFT: completed legion + its ideology & synergies */}
      <div className="rail-left">
        <LegionLedger squad={squad} ideologyDef={selDef} />

        <div style={{ marginTop: 22 }}>
          <RailTitle color="var(--gold)">Ideology</RailTitle>
          {selDef ? (
            <div className="panel" style={{ padding: '14px 16px', marginBottom: 14,
              background: 'linear-gradient(180deg,#2a2017,#3a2c1c)', border: '1px solid var(--gold)',
              animation: 'woaPop 0.35s ease both' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <IdeologyIcon icon={selDef.icon} size={28} color="var(--gold-bright)" strokeWidth={1.8} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="disp" style={{ fontSize: 18, color: '#e7d3a8', lineHeight: 1.05 }}>{selDef.name}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: '#b89c6a' }}>{selEff.note}</div>
                </div>
                <div className="disp" style={{ fontSize: 22, color: selEff.pct >= 0 ? '#9fd1a8' : '#e0907f', whiteSpace: 'nowrap' }}>
                  {selEff.pct >= 0 ? '+' : ''}{selEff.pct}%
                </div>
              </div>
              <div style={{ fontFamily: 'var(--serif)', fontSize: 12, color: '#cdb98f', marginTop: 9, lineHeight: 1.45 }}>
                {selDef.blurb}
              </div>
            </div>
          ) : (
            <div className="panel" style={{ padding: 14, marginBottom: 14, textAlign: 'center',
              fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--ink-faint)' }}>
              Choose an ideology to see its battle effect.
            </div>
          )}

          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 9 }}>
            <span className="caps" style={{ fontSize: 11 }}>Synergies & De-Buffs</span>
            <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          </div>
          {syn.length === 0 ? (
            <div className="panel" style={{ padding: 14, fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--ink-faint)', textAlign: 'center' }}>
              No synergies stirred — your legion fights on raw merit.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
              {syn.map((s, i) => <SynergyRow key={s.name} s={s} delay={i * 70} />)}
            </div>
          )}
        </div>
      </div>

      {/* CENTER: ideology picker + march */}
      <div className="rail-center desk-mapwrap">
        <RailTitle color="var(--gold)">The War Council</RailTitle>
        <CouncilBanner squad={squad} />
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 15, color: 'var(--ink-soft)', margin: '14px 0 16px', textAlign: 'center' }}>
          Your legion stands assembled. Choose the banner they fight for.
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 11 }}>
          <span className="caps" style={{ fontSize: 12, color: 'var(--gold)' }}>Choose an Ideology</span>
          <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-faint)' }}>
            scroll · effect on your legion
          </span>
        </div>
        <div className="panel" style={{ padding: 6, position: 'relative' }}>
          <div className="frame-rule" />
          <DIdeologyWheel squad={squad} ideology={ideology} setIdeology={setIdeology} />
        </div>
        <button className="btn btn-primary" disabled={!ideology}
          style={{ width: '100%', marginTop: 20, fontSize: 18, padding: '18px',
            opacity: ideology ? 1 : 0.5, cursor: ideology ? 'pointer' : 'not-allowed' }}
          onClick={ideology ? onMarch : undefined}>
          ⚔ March to War
        </button>
        {!ideology && (
          <div style={{ textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--ink-faint)', marginTop: 9 }}>
            Choose an ideology before you march.
          </div>
        )}
      </div>

      {/* RIGHT: enemy warband — minimized, banner flown */}
      <div className="rail-right">
        <EnemyLedger enemy={enemy} revealAll={false} ideologyDef={enemyIdeology} compact />
      </div>
    </div>
  );
}

// ── BATTLE ────────────────────────────────────────────────────
// Three-column symmetric layout: your legion + live score | dispatches | enemy + live score.
// Both full rosters visible throughout the animation — the tension is legible.
function DBattle({ player, enemy, battleground, onReveal, onGo }) {
  const pDef = player.ideology ? D.ideologyByKey(player.ideology.key) : null;
  const eDef = enemy.ideology ? D.ideologyByKey(enemy.ideology.key) : null;
  const [p, setP] = dS(0), [e, setE] = dS(0);
  const [log, setLog] = dS([]), [done, setDone] = dS(false), [shake, setShake] = dS(false), [shakeE, setShakeE] = dS(false);
  const [twistPopup, setTwistPopup] = dS(null);
  const timers = dR([]);
  dE(() => () => timers.current.forEach(clearTimeout), []);

  function anim(setter, from, to, dur, delay) {
    timers.current.push(setTimeout(() => {
      const s = performance.now();
      const step = (n) => {
        const k = Math.min(1, (n - s) / dur);
        setter(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay));
  }

  dE(() => {
    const T = (fn, t) => timers.current.push(setTimeout(fn, t));
    // Every movement of a tally on this screen must correlate to a dispatch
    // line — BOTH warbands' synergies, ideologies and field effects are
    // dispatched, and each side's score ticks only when its line lands.
    function ledger(side, sc) {
      const evs = sc.syn.map(s => ({ side, ...s }));
      const fieldPct = Math.round((sc.bg - 1) * 100);
      if (fieldPct !== 0) evs.push({ side, name: battleground.name, pct: fieldPct, field: true });
      let cum = 0, bgOn = false;
      const pts = evs.map(ev => {
        if (ev.field) bgOn = true; else cum += ev.pct;
        return Math.round(sc.base * (1 + cum / 100) * (bgOn ? sc.bg : 1));
      });
      // the last dispatch lands exactly on the final tally (absorbs rounding)
      if (pts.length) pts[pts.length - 1] = Math.round(sc.final);
      return { evs, pts };
    }
    const you = ledger('you', player);
    const foe = ledger('foe', enemy);
    // entrance — base strength as the armies take the field; a side with no
    // events at all simply enters at its final tally (nothing left to move it)
    anim(setP, 0, you.evs.length ? player.base : Math.round(player.final), 1100, 200);
    anim(setE, 0, foe.evs.length ? enemy.base : Math.round(enemy.final), 1100, 400);
    // interleave dispatches — the two sides trade blows
    const seq = [];
    for (let i = 0; i < Math.max(you.evs.length, foe.evs.length); i++) {
      if (you.evs[i]) seq.push({ ev: you.evs[i], to: you.pts[i] });
      if (foe.evs[i]) seq.push({ ev: foe.evs[i], to: foe.pts[i] });
    }
    let t = 1500, prevP = player.base, prevE = enemy.base;
    seq.forEach(({ ev, to }) => {
      const isYou = ev.side === 'you';
      const from = isYou ? prevP : prevE;
      if (isYou) prevP = to; else prevE = to;
      T(() => {
        setLog((l) => [...l, ev]);
        if (isYou) { setShake(true); T(() => setShake(false), 240); }
        else { setShakeE(true); T(() => setShakeE(false), 240); }
      }, t);
      anim(isYou ? setP : setE, from, to, 520, t + 80);
      t += 700;
    });
    T(() => setDone(true), t + 300);
  }, []);

  // Reveal the Verdict — fate may interject with one last dispatch (50%).
  // The popup names the event and its percentage, but the settled tally
  // is saved for the verdict screen.
  function reveal() {
    const tw = onReveal ? onReveal() : null;
    if (tw) setTwistPopup(tw); else onGo();
  }

  return (
    <div data-screen-label="Battle" className="desk-grid" style={{ paddingTop: 8, alignItems: 'stretch' }}>
      {/* LEFT: your legion — roster stretches to anchor against the centre column */}
      <div className="rail-left" style={{ display: 'flex', flexDirection: 'column' }}>
        <RailTitle color="var(--c-EASIA)">Your Legion</RailTitle>
        <PlayerIdeologyPlaque def={pDef} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {D.POSITIONS.map((pp) => {
            const fig = player.squad[pp.key];
            return (
              <div key={pp.key} className="panel" style={{ flex: 1, minHeight: 58, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 10,
                borderLeft: fig ? `4px solid ${fig.regionInk}` : '4px solid var(--line)' }}>
                <Crest fig={fig} size={40} pos={pp.key} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="disp" style={{ fontSize: 15, lineHeight: 1.1 }}>{fig ? fig.name : '—'}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-soft)' }}>{pp.name}{fig ? ` · ${fig.eraName}` : ''}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CENTER: tally board + dispatches — anchored top and bottom against the rails */}
      <div className="rail-center desk-mapwrap" style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <div className="deco" style={{ fontSize: 40, fontWeight: 900, color: 'var(--seal)', animation: 'woaPop 0.5s ease both' }}>
            ⚔ The Battle is Joined ⚔
          </div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 16, color: 'var(--ink-soft)', marginTop: 4 }}>
            {battleground.name} · {battleground.terrain}
          </div>
        </div>

        {/* the tally board — both armies' strength, writ large between their rosters */}
        <div className="panel" style={{ padding: '16px 26px 14px', marginBottom: 14,
          background: 'linear-gradient(180deg,#2a2017,#3a2c1c)', border: '1px solid var(--gold)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center' }}>
            <div style={{ textAlign: 'center' }}>
              <div className="label" style={{ fontSize: 9.5, color: '#a8896a' }}>Your Legion</div>
              <div className="disp" style={{ fontSize: 62, lineHeight: 1.05, color: '#9fd1a8',
                animation: shake ? 'woaPop 0.24s ease' : 'none',
                textShadow: p >= e ? '0 2px 14px rgba(63,125,90,0.45)' : 'none' }}>{p}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0 26px' }}>
              <div className="disp" style={{ fontSize: 24, color: '#8a7350' }}>⚔</div>
              <div className="label" style={{ fontSize: 9, color: '#8a7350', marginTop: 2 }}>versus</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div className="label" style={{ fontSize: 9.5, color: '#a8896a' }}>Enemy Forces</div>
              <div className="disp" style={{ fontSize: 62, lineHeight: 1.05, color: '#e0907f',
                animation: shakeE ? 'woaPop 0.24s ease' : 'none',
                textShadow: e > p ? '0 2px 14px rgba(143,45,34,0.5)' : 'none' }}>{e}</div>
            </div>
          </div>
        </div>

        <div className="panel" style={{ padding: 20, flex: 1, minHeight: 220, display: 'flex', flexDirection: 'column' }}>
          <div className="frame-rule" />
          <div className="label" style={{ textAlign: 'center', marginBottom: 4 }}>Dispatches from the Field</div>
          <div style={{ textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-faint)', marginBottom: 12 }}>
            Green tidings favour your legion · red bode ill
          </div>
          <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 9, alignContent: 'start' }}>
            {/* fixed columns: your dispatches LEFT, the foe's RIGHT */}
            <div style={{ gridColumn: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="caps" style={{ fontSize: 10.5, color: 'var(--c-EASIA)', whiteSpace: 'nowrap' }}>✦ Your Legion</span>
              <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
            </div>
            <div style={{ gridColumn: 2, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
              <span className="caps" style={{ fontSize: 10.5, color: 'var(--seal)', whiteSpace: 'nowrap' }}>Enemy Forces ⚔</span>
            </div>
            {log.length === 0 && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', fontFamily: 'var(--serif)', fontStyle: 'italic', color: 'var(--ink-faint)', fontSize: 15, padding: '24px 0' }}>
                The armies take the field…
              </div>
            )}
            {log.map((ev, i) => {
              const isFoe = ev.side === 'foe';
              // colour = what it means for YOU; arrow = which way that side's tally moved
              const goodForYou = isFoe ? ev.pct < 0 : ev.pct >= 0;
              const pctInk = goodForYou ? 'var(--c-EASIA)' : 'var(--seal)';
              const icon = ev.field ? '⬡' : ev.kind === 'ideology' ? '⚑' : isFoe ? '⚔' : '✦';
              return (
                <div key={i} style={{ gridColumn: isFoe ? 2 : 1, display: 'flex', alignItems: 'center', gap: 9, padding: '8px 11px', borderRadius: 3,
                  background: isFoe ? 'rgba(143,45,34,0.07)' : 'rgba(63,125,90,0.07)',
                  border: '1px solid var(--line)',
                  borderLeft: `3px solid ${isFoe ? 'var(--seal)' : 'var(--c-EASIA)'}`,
                  animation: 'woaTick 0.4s ease both' }}>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 11, color: isFoe ? 'var(--seal)' : 'var(--c-EASIA)' }}>{icon}</span>
                  <span className="disp" style={{ flex: 1, fontSize: 14.5, minWidth: 0 }}>{ev.name}</span>
                  <span className="disp" style={{ fontSize: 16, color: pctInk, whiteSpace: 'nowrap' }}>
                    {ev.pct >= 0 ? '▲' : '▼'} {ev.pct > 0 ? '+' : ''}{ev.pct}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ textAlign: 'center', marginTop: 18 }}>
          {done ? (
            <button className="btn btn-primary"
              style={{ minWidth: 300, fontSize: 17, padding: '16px 36px', animation: 'woaPop 0.4s ease both' }}
              onClick={reveal}>Reveal the Verdict ✦</button>
          ) : (
            <button className="btn btn-ghost" style={{ minWidth: 300, opacity: 0.7 }} disabled>
              The dust has not yet settled…
            </button>
          )}
        </div>
      </div>

      {/* RIGHT: enemy forces — fog lifts at battle start */}
      <div className="rail-right" style={{ display: 'flex', flexDirection: 'column' }}>
        <RailTitle color="var(--seal)">Enemy Forces</RailTitle>
        <EnemyIdeologyPlaque def={eDef} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 9 }}>
          {D.POSITIONS.map((pp) => {
            const fig = enemy.squad[pp.key];
            return (
              <div key={pp.key} className="panel" style={{ flex: 1, minHeight: 58, padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 10,
                borderLeft: fig ? `4px solid ${fig.regionInk}` : '4px solid var(--line)' }}>
                <Crest fig={fig} size={40} pos={pp.key} dim />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="disp" style={{ fontSize: 15, lineHeight: 1.1 }}>{fig ? fig.name : '—'}</div>
                  <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-soft)' }}>{pp.name}{fig ? ` · ${fig.eraName}` : ''}</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* fate interjects — the dispatch is read HERE; how the tally settles is saved for the verdict */}
      {twistPopup && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 90, background: 'rgba(20,14,6,0.62)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'woaFadeUp 0.3s ease both' }}>
          <div className="panel" style={{ width: 480, maxWidth: '88vw', padding: '30px 34px 26px', textAlign: 'center',
            border: '2px solid #6e5418', boxShadow: '0 24px 60px rgba(0,0,0,0.5)', position: 'relative',
            animation: 'woaSealIn 0.55s cubic-bezier(.2,1.2,.3,1) both' }}>
            <div className="frame-rule" />
            <div className="label" style={{ fontSize: 10, letterSpacing: '0.3em', color: 'var(--gold)' }}>A Final Dispatch Arrives</div>
            <div className="deco" style={{ fontSize: 34, fontWeight: 900, color: 'var(--seal)', margin: '8px 0 12px' }}>✦ A Twist of Fate ✦</div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 17, color: 'var(--ink)', lineHeight: 1.5, textWrap: 'pretty' }}>
              {twistPopup.text}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10, margin: '16px 0 4px' }}>
              <span className="disp" style={{ fontSize: 30, lineHeight: 1, color: twistPopup.pct >= 0 ? 'var(--c-EASIA)' : 'var(--seal)' }}>
                {twistPopup.pct > 0 ? '+' : ''}{twistPopup.pct}%
              </span>
              <span style={{ fontFamily: 'var(--display)', fontSize: 10, fontWeight: 700, letterSpacing: '0.12em',
                textTransform: 'uppercase', padding: '4px 9px', borderRadius: 2,
                color: twistPopup.side === 'player' ? 'var(--c-EASIA)' : 'var(--seal)',
                border: `1px solid ${twistPopup.side === 'player' ? 'var(--c-EASIA)' : 'var(--seal)'}`,
                background: 'rgba(255,250,235,0.6)' }}>
                {twistPopup.side === 'player' ? 'Your Legion' : 'Enemy Forces'}
              </span>
            </div>
            <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12.5, color: 'var(--ink-faint)' }}>
              How the tally settles… the verdict will tell.
            </div>
            <button className="btn btn-primary" style={{ width: '100%', marginTop: 16, fontSize: 15, padding: '14px' }} onClick={onGo}>
              March to the Verdict ✦
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Twists of fate — the final RNG event ───────────────────
// Half of all wars end with one last dispatch: a boon or a blunder,
// starring a figure from either warband, worth 5–25% of that side's
// tally — revealed only AFTER the player calls for the verdict.
const TWIST_BOONS = [
  (n) => `${n} delivers a pre-dawn speech so stirring that even the pack mules form a shield wall.`,
  (n) => `A wandering bard debuts “The Ballad of ${n}” mid-battle. By the third verse, the charge writes itself.`,
  (n) => `${n} challenges the enemy champion to single combat — and wins before the trumpets finish.`,
  (n) => `${n} discovers high ground that appears on no map. The cartographers are still arguing.`,
  (n) => `An eagle circles ${n}'s standard thrice, then salutes. The omens are unanimous.`,
  (n) => `${n} deciphers the enemy's signal flags and answers with insults. The foe breaks formation to argue back.`,
  (n) => `${n} rallies the baggage train into a second cavalry. The cooks fight magnificently.`,
  (n) => `A fog lifts at precisely the hour ${n} foretold, and the host strikes as one.`,
];
const TWIST_BLUNDERS = [
  (n) => `${n} pauses to consult the omens; a pigeon relieves itself upon the battle plans.`,
  (n) => `${n}'s war elephant panics and flattens the supply tents, two standards, and a week of rations.`,
  (n) => `${n} arrives fashionably late to the flank, having stopped to accept a local honour.`,
  (n) => `${n} misreads the map and conquers the wrong hill. It is, admittedly, a very nice hill.`,
  (n) => `${n}'s stirring speech runs long; half the vanguard dozes off against their spears.`,
  (n) => `${n} duels the enemy herald over a point of etiquette. Both armies stop to watch.`,
  (n) => `The great engine ${n} commissioned fires backwards. Once.`,
  (n) => `${n} declares the ground “inauspicious” and reorders the whole formation mid-charge.`,
];

function makeTwist(scored) {
  if (Math.random() < 0.5) return null; // half of all wars end quietly
  const side = Math.random() < 0.5 ? 'player' : 'foe';
  const figs = D.squadList(side === 'player' ? scored.player.squad : scored.foe.squad);
  if (!figs.length) return null;
  const fig = figs[Math.floor(Math.random() * figs.length)];
  const good = Math.random() < 0.5;
  const pool = good ? TWIST_BOONS : TWIST_BLUNDERS;
  const text = pool[Math.floor(Math.random() * pool.length)](fig.name);
  const pct = (good ? 1 : -1) * (5 + Math.floor(Math.random() * 21)); // ±5..25%, capped at 25
  return { side, fig, text, pct, good, helpsYou: (side === 'player') === good };
}

const ResultCard = React.forwardRef(function ResultCard({ player, enemy, battleground, win, grade, twist }, ref) {
  const bgPct = Math.round((player.bg - 1) * 100);
  const reckoning = [
    ...player.syn.map(s => ({ ...s, tag: s.kind === 'ideology' ? 'Ideology' : (s.pct >= 0 ? 'Synergy' : 'De-Buff') })),
    ...(bgPct !== 0 ? [{ name: battleground.name, pct: bgPct, note: 'The ground itself took a side', tag: 'Field' }] : []),
    ...(twist ? [{ name: 'Twist of Fate', pct: twist.pct, note: twist.text, tag: 'Fate',
      side: twist.side === 'player' ? 'Your Legion' : 'The Enemy' }] : []),
  ];
  return (
    <div ref={ref} style={{
      position: 'relative', borderRadius: 4, overflow: 'hidden',
      background: 'linear-gradient(170deg, #efe6cf 0%, #e2d3ad 100%)',
      border: '2px solid #6e5418',
      boxShadow: '0 10px 30px rgba(60,40,16,0.35)', padding: 3,
    }}>
      <div style={{ border: '1px solid var(--gold)', borderRadius: 2, padding: '16px 17px 14px', position: 'relative' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div className="deco" style={{ fontSize: 17, fontWeight: 900, color: 'var(--ink)', lineHeight: 1 }}>War <span className="wo-o">O</span>' Ages</div>
            <div className="label" style={{ fontSize: 8, marginTop: 2 }}>{battleground.name} · Daily Battlefield</div>
          </div>
          <Sigil size={28} />
        </div>
        <div className="hr-rule" style={{ margin: '12px 0' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', alignItems: 'center', textAlign: 'center' }}>
          <div>
            <div className="label" style={{ fontSize: 9 }}>You</div>
            <div className="disp" style={{ fontSize: 64, color: win ? 'var(--seal)' : 'var(--ink-soft)', lineHeight: 1 }}>{Math.round(player.final)}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5, padding: '0 12px' }}>
            <WaxSeal grade={win ? grade : { letter: grade.letter, label: grade.label, color: '#8a795c' }} size={76} animate />
            <div className="deco" style={{ fontSize: 15, fontWeight: 900, letterSpacing: '0.06em', color: win ? 'var(--seal)' : 'var(--ink-soft)' }}>{win ? 'WON' : 'LOST'}</div>
          </div>
          <div>
            <div className="label" style={{ fontSize: 9 }}>Foe</div>
            <div className="disp" style={{ fontSize: 64, color: 'var(--ink-soft)', lineHeight: 1 }}>{Math.round(enemy.final)}</div>
          </div>
        </div>
        <div className="hr-rule" style={{ margin: '14px 0 10px' }} />
        <div className="label" style={{ fontSize: 8.5, marginBottom: 7 }}>The Reckoning</div>
        {reckoning.length === 0 ? (
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-faint)', textAlign: 'center', padding: '3px 0 1px' }}>
            No synergies stirred — the legion fought on raw merit.
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
            {reckoning.map((s) => {
              const accent = s.pct >= 0 ? 'var(--c-EASIA)' : 'var(--seal)';
              const sideInk = s.side === 'The Enemy' ? 'var(--seal)' : 'var(--c-EASIA)';
              return (
                <div key={s.tag + s.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 9px',
                  borderRadius: 3, background: 'rgba(255,250,235,0.55)', border: '1px solid var(--line)',
                  borderLeft: `3px solid ${accent}` }}>
                  <span style={{ fontFamily: 'var(--display)', fontSize: 7.5, fontWeight: 700, letterSpacing: '0.12em',
                    textTransform: 'uppercase', color: accent, width: 54, flexShrink: 0 }}>{s.tag}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                      <span className="disp" style={{ fontSize: 12.5, lineHeight: 1.1, color: 'var(--ink)' }}>{s.name}</span>
                      {s.side && (
                        <span style={{ fontFamily: 'var(--display)', fontSize: 7, fontWeight: 700, letterSpacing: '0.1em',
                          textTransform: 'uppercase', padding: '1.5px 5px', borderRadius: 2, whiteSpace: 'nowrap',
                          color: sideInk, border: `1px solid ${sideInk}`, background: 'rgba(255,250,235,0.6)' }}>{s.side}</span>
                      )}
                    </div>
                    {s.note && <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 10, color: 'var(--ink-soft)', lineHeight: 1.25, marginTop: 1 }}>{s.note}</div>}
                  </div>
                  <span className="disp" style={{ fontSize: 15, color: accent, whiteSpace: 'nowrap' }}>
                    {s.pct > 0 ? '+' : ''}{s.pct}%
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <div style={{ textAlign: 'center', marginTop: 13 }}>
          <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-soft)' }}>
            “{win ? quoteWin(player) : quoteLoss(enemy)}”
          </span>
        </div>
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <span className="caps" style={{ fontSize: 8, color: 'var(--ink-faint)' }}>waroages.io · can you conquer history?</span>
        </div>
      </div>
    </div>
  );
});

function quoteWin(p) {
  const star = D.POSITIONS.map(x => p.squad[x.key]).filter(Boolean).sort((a, b) => b.pr - a.pr)[0];
  return `${star.name} led ${Math.round(p.final)} souls to glory.`;
}
function quoteLoss(e) {
  const star = D.POSITIONS.map(x => e.squad[x.key]).filter(Boolean).sort((a, b) => b.pr - a.pr)[0];
  return `${star.name}'s host proved one rank too strong.`;
}

function DResult({ player, enemy, battleground, twist, onReplay }) {
  const adjP = twist && twist.side === 'player' ? Math.max(0, Math.round(player.final * (1 + twist.pct / 100))) : Math.round(player.final);
  const adjE = twist && twist.side === 'foe' ? Math.max(0, Math.round(enemy.final * (1 + twist.pct / 100))) : Math.round(enemy.final);
  // pending → popup → counting → settled; no twist skips straight to settled
  const [stage, setStage] = dS(twist ? 'pending' : 'settled');
  const [showP, setShowP] = dS(Math.round(player.final));
  const [showE, setShowE] = dS(Math.round(enemy.final));
  const timers = dR([]);
  dE(() => {
    // fate applies itself — the dispatch was already read on the battle
    // screen; here the tally settles, with full licence to flip the verdict
    if (twist) timers.current.push(setTimeout(applyTwist, 1100));
    return () => timers.current.forEach(clearTimeout);
  }, []);

  function applyTwist() {
    setStage('counting');
    const from = twist.side === 'player' ? Math.round(player.final) : Math.round(enemy.final);
    const to = twist.side === 'player' ? adjP : adjE;
    const setter = twist.side === 'player' ? setShowP : setShowE;
    timers.current.push(setTimeout(() => {
      const start = performance.now(), dur = 1500;
      const step = (now) => {
        const k = Math.min(1, (now - start) / dur);
        setter(Math.round(from + (to - from) * (1 - Math.pow(1 - k, 3))));
        if (k < 1) requestAnimationFrame(step); else setStage('settled');
      };
      requestAnimationFrame(step);
    }, 250));
  }

  const win = showP >= showE;
  const grade = D.gradeFor(showP);
  const pDef = player.ideology ? D.ideologyByKey(player.ideology.key) : null;
  const eDef = enemy.ideology ? D.ideologyByKey(enemy.ideology.key) : null;
  const shownPlayer = { ...player, final: showP };
  const shownEnemy = { ...enemy, final: showE };
  const counting = stage === 'counting';
  return (
    <div data-screen-label="Verdict" style={{ maxWidth: 1320, margin: '0 auto', paddingTop: 6 }}>
      <div style={{ textAlign: 'center' }}>
        <div className="deco" style={{ fontSize: 76, fontWeight: 900, margin: '6px 0 0',
          color: win ? 'var(--seal)' : 'var(--ink-soft)', transition: 'color .4s',
          animation: counting ? 'woaPop 0.45s ease' : 'none' }}>
          {win ? 'Victory' : 'Defeat'}
        </div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 20, color: 'var(--ink-soft)' }}>
          {win ? 'History will remember your legion.' : 'The chronicles record a noble loss.'}
        </div>
      </div>
      <div className="result-grid" style={{ marginTop: 30 }}>
        <div className="res-you">
          <RailTitle color="var(--c-EASIA)">Your Legion</RailTitle>
          <PlayerIdeologyPlaque def={pDef} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {D.POSITIONS.map((p, i) => <FigureRow key={p.key} fig={player.squad[p.key]} positionAbbr={p.abbr} animate delay={i * 50} pos={p.key} />)}
          </div>
        </div>
        <div className="res-card">
          <div style={{ animation: counting ? 'woaPop 0.5s ease both' : 'none',
            filter: counting ? 'drop-shadow(0 0 18px rgba(212,175,79,0.45))' : 'none', transition: 'filter .6s' }}>
            <ResultCard player={shownPlayer} enemy={shownEnemy} battleground={battleground} win={win} grade={grade}
              twist={stage === 'counting' || stage === 'settled' ? twist : null} />
          </div>
          <div style={{ display: 'flex', gap: 12, marginTop: 16 }}>
            <button className="btn btn-primary" style={{ flex: 2 }}>⤴ Share the Chronicle</button>
            <button className="btn btn-ghost" style={{ flex: 1 }} onClick={onReplay}>New War</button>
          </div>
        </div>
        <div className="res-foe">
          <RailTitle color="var(--seal)">Enemy Roster Revealed</RailTitle>
          <EnemyIdeologyPlaque def={eDef} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
            {D.POSITIONS.map((p, i) => <FigureRow key={p.key} fig={enemy.squad[p.key]} positionAbbr={p.abbr} animate delay={i * 50} pos={p.key} />)}
          </div>
        </div>
      </div>

      {/* the twist of fate now announces itself on the battle screen;
          here it simply takes effect — see applyTwist above */}
    </div>
  );
}

// ── APP ───────────────────────────────────────────────────────
export function DesktopApp() {
  const [seed, setSeed] = dS(dSeed());
  const [screen, setScreen] = dS('intro');
  const [squad, setSquad] = dS({});
  const [ideology, setIdeology] = dS(null);
  const [scored, setScored] = dS(null);
  // Battleground is drawn at random for every campaign — each war is fought
  // on fresh ground, and the war-room backdrop redraws to match.
  const [bgIdx, setBgIdx] = dS(() => Math.floor(Math.random() * D.BATTLEGROUNDS.length));
  const battleground = D.BATTLEGROUNDS[bgIdx];
  const [enemy, setEnemy] = dS(() => D.generateEnemy(seed, []));
  const enemyIdeology = dM(() => D.IDEOLOGIES[(seed + 3) % D.IDEOLOGIES.length].key, [seed]);
  const enemyIdeologyDef = D.ideologyByKey(enemyIdeology);
  const [rerolls, setRerolls] = dS({ region: true, era: true });
  const [booksOpen, setBooksOpen] = dS(false);
  const [twist, setTwist] = dS(null);
  const enemyNames = D.squadList(enemy).map((f) => f.name);
  const phaseIdx = { intro: 0, spin: 1, council: 2, battle: 3, result: 4 }[screen];

  function newWar() {
    const s = Math.floor(Math.random() * 1e6);
    setSeed(s); setEnemy(D.generateEnemy(s, [])); setSquad({}); setIdeology(null); setScored(null); setTwist(null);
    setBgIdx(Math.floor(Math.random() * D.BATTLEGROUNDS.length));
    setRerolls({ region: true, era: true }); setScreen('intro');
  }

  function enterBattle() {
    setScored({
      player: dBuild(squad, battleground, seed + 7, ideology),
      foe: dBuild(enemy, battleground, seed + 13, enemyIdeology),
    });
    setScreen('battle');
  }

  function jumpTo(target) {
    if (target === 'intro' || target === 'spin') { setScreen(target); return; }
    let sq = squad;
    if (D.POSITIONS.some((p) => !sq[p.key])) { sq = D.generateEnemy(seed + 99, enemyNames); setSquad(sq); }
    if (target === 'council') { setScreen('council'); return; }
    const sc = {
      player: dBuild(sq, battleground, seed + 7, ideology),
      foe: dBuild(enemy, battleground, seed + 13, enemyIdeology),
    };
    setScored(sc);
    setTwist(target === 'result' ? makeTwist(sc) : null);
    setScreen(target);
  }

  const rightLabel = screen === 'spin'
    ? `Rank ${Math.min(D.POSITIONS.filter((p) => squad[p.key]).length + 1, 5)} / 5`
    : '';

  return (
    <div className="woa-desk">
      <div className="desk-wrap">
        <DBar phaseIdx={phaseIdx} battleground={battleground} right={rightLabel} onJump={jumpTo} onBooks={() => setBooksOpen(true)} />
        {screen === 'intro'   && <DIntro battleground={battleground} enemy={enemy} enemyIdeology={enemyIdeologyDef} onBegin={() => setScreen('spin')} />}
        {screen === 'spin'    && <DSpin squad={squad} setSquad={setSquad} battleground={battleground} exclude={enemyNames} onComplete={() => setScreen('council')} enemy={enemy} enemyIdeology={enemyIdeologyDef} rerolls={rerolls} setRerolls={setRerolls} />}
        {screen === 'council' && <DCouncil squad={squad} battleground={battleground} ideology={ideology} setIdeology={setIdeology} onMarch={enterBattle} enemy={enemy} enemyIdeology={enemyIdeologyDef} />}
        {screen === 'battle'  && scored && <DBattle player={scored.player} enemy={scored.foe} battleground={battleground}
          onReveal={() => { const tw = makeTwist(scored); setTwist(tw); return tw; }}
          onGo={() => setScreen('result')} />}
        {screen === 'result'  && scored && <DResult player={scored.player} enemy={scored.foe} battleground={battleground} twist={twist} onReplay={newWar} />}
        <DeskCartouche battleground={battleground} />
        <BooksOverlay open={booksOpen} onClose={() => setBooksOpen(false)} />
      </div>
    </div>
  );
}

export default DesktopApp;
