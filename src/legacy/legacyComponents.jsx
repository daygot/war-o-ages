import React, { useState, useRef, useLayoutEffect } from 'react';
import { createPortal } from 'react-dom';
import { WOA } from './legacyData';
import { chronicleFor } from './chronicles';

const TIER_INK = {
  Legendary: 'var(--gold-bright)', Elite: 'var(--seal)',
  Notable: 'var(--ink)', Historic: 'var(--ink-faint)',
};

// ── Position emblems — subtle heraldic charges in the shield base ──
// Each suggests the rank's purpose; rendered faintly behind/below the
// initials so the badge reads as both "who" (initials + region colour)
// and "what role" (emblem). Drawn in the crest's 0..100 / 0..116 space.
const POS_EMBLEM = {
  // crown — Lucide crown (24x24 → placed in shield emblem area)
  commander: (s, w) => (<g transform="translate(36 74) scale(1.17)" fill="none" stroke={s} strokeWidth={w / 1.17} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
    <path d="M5 21h14" />
  </g>),
  // feather — Lucide feather
  strategist: (s, w) => (<g transform="translate(36 74) scale(1.17)" fill="none" stroke={s} strokeWidth={w / 1.17} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z" />
    <path d="M16 8 2 22" />
    <path d="M17.5 15H9" />
  </g>),
  // swords — Lucide swords
  general: (s, w) => (<g transform="translate(36 74) scale(1.17)" fill="none" stroke={s} strokeWidth={w / 1.17} strokeLinecap="round" strokeLinejoin="round">
    <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" />
    <line x1="13" x2="19" y1="19" y2="13" />
    <line x1="16" x2="20" y1="16" y2="20" />
    <line x1="19" x2="21" y1="21" y2="19" />
    <polyline points="14.5 6.5 18 3 21 3 21 6 17.5 9.5" />
    <line x1="5" x2="9" y1="14" y2="18" />
    <line x1="7" x2="4" y1="17" y2="20" />
    <line x1="3" x2="5" y1="19" y2="21" />
  </g>),
  // massed ranks — three chevrons
  troops:     (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M40,88 L50,82 L60,88" /><path d="M40,93 L50,87 L60,93" /><path d="M40,98 L50,92 L60,98" /></g>),
  // alliance — two interlocking rings
  allies:     (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="45.5" cy="89" r="6.8" /><circle cx="54.5" cy="89" r="6.8" /></g>),
};

// ── Ideology glyphs (24×24, stroke-based) ────────────────────
// Used by the War Council ideology wheel. Simple, legible line marks —
// one recognisable mark per movement, faith or creed.
const BANNER_PATHS = {
  crown:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4,19 H20" /><path d="M4,19 L3.4,7.5 L9,12 L12,5.5 L15,12 L20.6,7.5 L20,19" /></g>),
  cross:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12,3 V21" /><path d="M6.5,9 H17.5" /></g>),
  banner: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M6,3 V21" /><path d="M6,4 H19 L15.5,8.5 L19,13 H6" /></g>),
  star:   (s, w) => (<path d="M12,3 L14.5,9.1 L21,9.5 L16,13.6 L17.8,20 L12,16.2 L6.2,20 L8,13.6 L3,9.5 L9.5,9.1 Z" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />),
  scales: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12,5 V19" /><path d="M8,19 H16" /><path d="M4,7 H20" /><path d="M4,7 L1.8,12 H6.2 Z" /><path d="M20,7 L17.8,12 H22.2 Z" /></g>),
  olive:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M5,20 C10,15 14,10 19,5" /><path d="M14,8 q-3.2,-0.6 -4.2,-3.8 q3.2,0.6 4.2,3.8" /><path d="M11,12 q-3.4,-0.5 -4.4,-3.6 q3.4,0.5 4.4,3.6" /><path d="M8.5,16 q-3.4,-0.4 -4.4,-3.4 q3.4,0.4 4.4,3.4" /></g>),
  sun:    (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.3" /><path d="M12,2 V4.5 M12,19.5 V22 M2,12 H4.5 M19.5,12 H22 M4.9,4.9 L6.7,6.7 M17.3,17.3 L19.1,19.1 M19.1,4.9 L17.3,6.7 M6.7,17.3 L4.9,19.1" /></g>),
  shield: (s, w) => (<path d="M12,3 L19.5,5.8 V11 C19.5,16 15.8,19.4 12,21 C8.2,19.4 4.5,16 4.5,11 V5.8 Z" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />),
  // coin — wealth / capital
  coin:   (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="7" rx="7" ry="3" /><path d="M5,7 V16 A7,3 0 0 0 19,16 V7" /><path d="M5,11.5 A7,3 0 0 0 19,11.5" /></g>),
  // flag — nation / banner of a people
  flag:   (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M7,3 V21" /><path d="M7,4.5 q3,-1.7 6,0 t6,0 V12 q-3,1.7 -6,0 t-6,0 Z" /></g>),
  // broken chain — liberation / independence
  chain:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10.8,8 A3.3,3.3 0 0 0 6.2,8 A3.3,3.3 0 0 0 6.2,12.6 L8.2,14.4" /><path d="M13.2,16 A3.3,3.3 0 0 0 17.8,16 A3.3,3.3 0 0 0 17.8,11.4 L15.8,9.6" /></g>),
  // circle-A — anarchism
  circleA:(s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8.4,16.5 L12,7 L15.6,16.5" /><path d="M6,13.6 H18" /></g>),
  // fasces — bound rods, authoritarian order
  fasces: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M9,4 V20 M12,4 V20 M15,4 V20" /><path d="M7.4,9 H16.6 M7.4,13 H16.6" /></g>),
  // crescent & star — Islam
  crescent:(s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M15.5,4 A8.5,8.5 0 1 0 15.5,20 A6.6,6.6 0 1 1 15.5,4 Z" /><path d="M19.6,9.6 l0.7,1.7 1.8,0.15 -1.4,1.2 0.45,1.8 -1.55,-1 -1.55,1 0.45,-1.8 -1.4,-1.2 1.8,-0.15 z" /></g>),
  // dharma wheel — Buddhism
  wheel:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="1.8" /><path d="M12,3.5 V20.5 M3.5,12 H20.5 M6,6 L18,18 M18,6 L6,18" /></g>),
  // classical column — Stoicism
  column: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M5,6 H19 M6.5,9 H17.5 M8,9 V17 M12,9 V17 M16,9 V17 M5.5,20 H18.5 M7,17 H17" /></g>),
  // Om — Hindu / Dharmic
  om:     (s) => (<text x="12" y="18.5" textAnchor="middle" fontSize="20" fontFamily="serif" fontWeight="600" fill={s} stroke="none">ॐ</text>),


};
export function BannerIcon({ icon, size = 26, color = 'currentColor', strokeWidth = 1.7 }) {
  const draw = BANNER_PATHS[icon] || BANNER_PATHS.banner;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      {draw(color, strokeWidth)}
    </svg>
  );
}

// ── Heraldic crest sigil ──────────────────────────────────────
export function Crest({ fig, size = 54, dashed = false, placeholderAbbr, ink, dim = false, pos }) {
  const color = ink || (fig ? fig.regionInk : '#9c8a66');
  const mono = fig ? fig.init : (placeholderAbbr || '');
  const emblem = pos && POS_EMBLEM[pos];
  const textY = emblem ? 50 : 62;
  const w = size, h = size * 1.16;
  const gid = 'cg' + (fig ? fig.id.replace(/[^a-z]/gi, '') : (placeholderAbbr || 'x')) + (pos || '') + Math.round(size);
  return (
    <svg width={w} height={h} viewBox="0 0 100 116" style={{ display: 'block', filter: dim ? 'grayscale(0.5) opacity(0.6)' : 'drop-shadow(0 2px 3px rgba(60,40,16,0.3))' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(color, 0.22)} />
          <stop offset="1" stopColor={shade(color, -0.18)} />
        </linearGradient>
      </defs>
      <path d="M8,6 H92 V58 C92,90 62,106 50,112 C38,106 8,90 8,58 Z"
        fill={dashed ? 'rgba(120,96,54,0.10)' : `url(#${gid})`}
        stroke={dashed ? 'rgba(120,96,54,0.5)' : 'var(--gold)'}
        strokeWidth={dashed ? 2 : 2.5}
        strokeDasharray={dashed ? '5 4' : 'none'} />
      {!dashed && <path d="M16,14 H84 V56 C84,82 60,96 50,101 C40,96 16,82 16,56 Z"
        fill="none" stroke="rgba(255,245,225,0.26)" strokeWidth="1.2" />}
      {emblem && (() => {
        const emblemOpa = 0.7;
        const emblemColor = dashed ? 'rgba(120,96,54,0.6)' : '#ffffff';
        return <g opacity={emblemOpa}>{emblem(emblemColor, 2.3)}</g>;
      })()}
      <text x="50" y={textY} textAnchor="middle" dominantBaseline="middle"
        fontFamily="Cinzel, serif" fontWeight="800"
        fontSize={mono.length > 2 ? 30 : 38}
        fill={dashed ? 'rgba(120,96,54,0.7)' : '#f4e6c9'}
        style={{ letterSpacing: '0.02em' }}>{mono}</text>
    </svg>
  );
}

export function shade(hex, amt) {
  const h = hex.replace('#', '');
  let r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const f = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((f - r) * p + r); g = Math.round((f - g) * p + g); b = Math.round((f - b) * p + b);
  return `rgb(${r},${g},${b})`;
}

// ── Region/era + tag chips ────────────────────────────────────
export function Tag({ children, ink }) {
  return (
    <span style={{
      fontFamily: 'var(--display)', fontSize: 8.5, fontWeight: 600, textTransform: 'uppercase',
      letterSpacing: '0.12em', padding: '2px 6px', borderRadius: 2,
      color: ink || 'var(--ink-soft)', border: `1px solid ${ink ? hexA(ink, 0.45) : 'var(--line)'}`,
      background: ink ? hexA(ink, 0.08) : 'rgba(120,96,54,0.06)', whiteSpace: 'nowrap',
    }}>{children}</span>
  );
}
export function hexA(hex, a) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0,2),16)},${parseInt(h.slice(2,4),16)},${parseInt(h.slice(4,6),16)},${a})`;
}

// ── Stat row (PWR CMD GUI VAL DIP) ────────────────────────────
export function StatRow({ fig, compact = false }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: compact ? 2 : 6 }}>
      {WOA.STAT_KEYS.map(k => (
        <div key={k} style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: compact ? 14 : 17, color: 'var(--ink)', lineHeight: 1 }}>{fig.stats[k]}</div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 7.5, letterSpacing: '0.12em', color: 'var(--ink-faint)', marginTop: 2 }}>{k}</div>
        </div>
      ))}
    </div>
  );
}

// ── Figure card (full) ────────────────────────────────────────
export function FigureCard({ fig, positionName, style, animate, pos }) {
  if (!fig) return null;
  return (
    <div className="panel" style={{ padding: '12px 13px 11px', animation: animate ? 'woaPop 0.5s ease both' : 'none', ...style }}>
      <div className="frame-rule" />
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
        <Crest fig={fig} size={50} pos={pos} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {positionName && <div className="label" style={{ color: fig.regionInk, marginBottom: 1 }}>{positionName}</div>}
          <div className="disp" style={{ fontSize: 18, marginBottom: 2, color: 'var(--ink)' }}>{fig.name}</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 12.5, color: 'var(--ink-soft)', fontStyle: 'italic' }}>
            {fig.regionName} · {fig.eraName} · <span style={{ color: fig.regionInk, fontStyle: 'normal', fontWeight: 600 }}>{fig.tier}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 7 }}>
            {fig.tags.map(t => <Tag key={t} ink={fig.regionInk}>{t}</Tag>)}
          </div>
        </div>
      </div>
      <div className="hr-rule" style={{ margin: '10px 0 9px' }} />
      <StatRow fig={fig} />
    </div>
  );
}

// ── Compact roster row (result list, 82-0 style) ──────────────
export function FigureRow({ fig, positionAbbr, hidden, animate, delay = 0, pos }) {
  if (hidden || !fig) {
    return (
      <div className="panel" style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.85 }}>
        <Crest dashed placeholderAbbr={positionAbbr} size={40} pos={pos} />
        <div style={{ flex: 1 }}>
          <div className="disp" style={{ fontSize: 15, color: 'var(--ink-faint)', letterSpacing: '0.1em' }}>UNKNOWN</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-faint)' }}>Concealed by fog of war</div>
        </div>
        <div className="disp" style={{ fontSize: 22, color: 'var(--ink-faint)' }}>???</div>
      </div>
    );
  }
  return (
    <div className="panel" style={{ padding: '9px 12px', display: 'flex', alignItems: 'center', gap: 11,
      borderLeft: `4px solid ${fig.regionInk}`, animation: animate ? `woaFadeUp 0.45s ease both` : 'none', animationDelay: `${delay}ms` }}>
      <Crest fig={fig} size={38} pos={pos} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="disp" style={{ fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.1 }}>{fig.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-soft)' }}>{fig.regionName} · {fig.eraName}</div>
      </div>
      <div style={{ width: 132, flexShrink: 0 }}><StatRow fig={fig} compact /></div>
    </div>
  );
}

// ── Wax seal (grade) ──────────────────────────────────────────
export function WaxSeal({ grade, size = 86, animate }) {
  const s = size;
  return (
    <div style={{ width: s, height: s, position: 'relative', animation: animate ? 'woaSealIn 0.7s cubic-bezier(.2,1.2,.3,1) both' : 'none' }}>
      <svg width={s} height={s} viewBox="0 0 100 100">
        <defs>
          <radialGradient id={'wax' + grade.letter} cx="40%" cy="35%" r="75%">
            <stop offset="0" stopColor={shade(grade.color, 0.28)} />
            <stop offset="0.7" stopColor={grade.color} />
            <stop offset="1" stopColor={shade(grade.color, -0.3)} />
          </radialGradient>
        </defs>
        <path d={scallop(50, 50, 42, 38, 12)} fill={'url(#wax' + grade.letter + ')'} stroke={shade(grade.color, -0.35)} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="32" fill="none" stroke={shade(grade.color, 0.35)} strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--deco)', fontWeight: 900, fontSize: s * 0.42, color: '#f6e8cd', lineHeight: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>{grade.letter}</div>
      </div>
    </div>
  );
}
export function scallop(cx, cy, rOuter, rInner, points) {
  let d = '';
  const total = points * 2;
  for (let i = 0; i < total; i++) {
    const r = i % 2 === 0 ? rOuter : rInner;
    const a = (Math.PI * 2 * i) / total - Math.PI / 2;
    const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
    d += (i === 0 ? 'M' : 'L') + x.toFixed(1) + ',' + y.toFixed(1) + ' ';
  }
  return d + 'Z';
}

// ── Banner heading ────────────────────────────────────────────
export function Banner({ children, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 14 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, justifyContent: 'center' }}>
        <span style={{ flex: 1, maxWidth: 50, height: 1, background: 'linear-gradient(90deg,transparent,var(--line))' }} />
        <span style={{ fontFamily: 'var(--display)', fontSize: 9, letterSpacing: '0.34em', color: 'var(--gold)', fontWeight: 700 }}>✦</span>
        <span style={{ flex: 1, maxWidth: 50, height: 1, background: 'linear-gradient(90deg,var(--line),transparent)' }} />
      </div>
      <div className="disp" style={{ fontSize: 24, margin: '6px 0 2px' }}>{children}</div>
      {sub && <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink-soft)' }}>{sub}</div>}
    </div>
  );
}

// Alias under the project's terminology — every chooser now speaks "Ideology".
export const IdeologyIcon = BannerIcon;

// ── Figure placard — the lore card shown on hover and in The Books ──
export function FigurePlacard({ fig, pos, showFootnote = true }) {
  const { hook, body } = chronicleFor(fig);
  return (
    <div className="panel" style={{ width: 330, padding: '15px 17px 14px', boxShadow: '0 18px 50px rgba(20,12,4,0.4)' }}>
      <div className="frame-rule" />
      <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
        <Crest fig={fig} size={44} pos={pos} />
        <div style={{ minWidth: 0 }}>
          <div className="disp" style={{ fontSize: 19, lineHeight: 1.05 }}>{fig.name}</div>
          <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-soft)', marginTop: 2 }}>
            {fig.regionName} · {fig.eraName} · <span style={{ color: TIER_INK[fig.tier] || 'var(--ink)', fontStyle: 'normal', fontWeight: 700 }}>{fig.tier}</span>
          </div>
        </div>
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 13.5, color: 'var(--seal)', lineHeight: 1.4, margin: '12px 0 0' }}>
        {hook}
      </div>
      <div style={{ fontFamily: 'var(--serif)', fontSize: 13, color: 'var(--ink)', lineHeight: 1.5, marginTop: 7 }}>
        {body}
      </div>
      {showFootnote && (
        <div className="caps" style={{ fontSize: 8.5, letterSpacing: '0.18em', color: 'var(--ink-faint)', textAlign: 'center', marginTop: 12 }}>
          Open the Books for the full chronicle
        </div>
      )}
    </div>
  );
}

// Wraps a figure card so hovering it raises a placard, portaled to <body>
// (so it escapes rail overflow) and clamped to the viewport.
export function FigureHover({ fig, pos, children, style, block }) {
  const anchorRef = useRef(null);
  const cardRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState(null);

  // Position once, after the placard has rendered (so its real height is
  // known). Depends only on `open`, so it never loops.
  useLayoutEffect(() => {
    if (!open) { setCoords(null); return; }
    const anchor = anchorRef.current?.getBoundingClientRect();
    if (!anchor) return;
    const ph = cardRef.current?.getBoundingClientRect();
    const W = ph?.width || 330;
    const H = ph?.height || 220;
    let left = anchor.right + 12;
    if (left + W > window.innerWidth - 8) left = anchor.left - W - 12;
    if (left < 8) left = 8;
    let top = anchor.top;
    if (top + H > window.innerHeight - 8) top = window.innerHeight - 8 - H;
    if (top < 8) top = 8;
    setCoords({ left, top });
  }, [open]);

  return (
    <div ref={anchorRef} onMouseEnter={() => setOpen(true)} onMouseLeave={() => setOpen(false)}
      style={{ position: 'relative', display: block ? 'block' : undefined, ...style }}>
      {children}
      {open && createPortal(
        <div ref={cardRef} style={{ position: 'fixed', left: coords?.left ?? -9999, top: coords?.top ?? -9999,
          zIndex: 80, pointerEvents: 'none', opacity: coords ? 1 : 0, transition: 'opacity .12s ease' }}>
          <FigurePlacard fig={fig} pos={pos} />
        </div>,
        document.body,
      )}
    </div>
  );
}

