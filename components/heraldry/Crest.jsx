import React from 'react';

export function shade(hex, amt) {
  const h = hex.replace('#', '');
  let r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  const f = amt < 0 ? 0 : 255, p = Math.abs(amt);
  r = Math.round((f - r) * p + r); g = Math.round((f - g) * p + g); b = Math.round((f - b) * p + b);
  return `rgb(${r},${g},${b})`;
}

/* Rank emblems — faint heraldic charges in the shield base (Lucide
   crown/feather/swords paths + house chevrons/rings), drawn in the
   crest's 0..100/0..116 space. */
const POS_EMBLEM = {
  commander: (s, w) => (<g transform="translate(36 74) scale(1.17)" fill="none" stroke={s} strokeWidth={w / 1.17} strokeLinecap="round" strokeLinejoin="round">
    <path d="M11.562 3.266a.5.5 0 0 1 .876 0L15.39 8.87a1 1 0 0 0 1.516.294L21.183 5.5a.5.5 0 0 1 .798.519l-2.834 10.246a1 1 0 0 1-.956.734H5.81a1 1 0 0 1-.957-.734L2.02 6.02a.5.5 0 0 1 .798-.519l4.276 3.664a1 1 0 0 0 1.516-.294z" />
    <path d="M5 21h14" />
  </g>),
  strategist: (s, w) => (<g transform="translate(36 74) scale(1.17)" fill="none" stroke={s} strokeWidth={w / 1.17} strokeLinecap="round" strokeLinejoin="round">
    <path d="M12.67 19a2 2 0 0 0 1.416-.588l6.154-6.172a6 6 0 0 0-8.49-8.49L5.586 9.914A2 2 0 0 0 5 11.328V18a1 1 0 0 0 1 1z" />
    <path d="M16 8 2 22" />
    <path d="M17.5 15H9" />
  </g>),
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
  troops: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M40,88 L50,82 L60,88" /><path d="M40,93 L50,87 L60,93" /><path d="M40,98 L50,92 L60,98" /></g>),
  allies: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="45.5" cy="89" r="6.8" /><circle cx="54.5" cy="89" r="6.8" /></g>),
};

let crestUid = 0;

/* Heraldic shield crest — region-ink gradient fill, gold stroke,
   Cinzel initials, optional rank emblem. `dashed` renders the empty
   slot; `dim` is the fog-of-war treatment. */
export function Crest({ initials = '', ink = '#9c8a66', size = 54, pos, dashed = false, dim = false }) {
  const emblem = pos && POS_EMBLEM[pos];
  const textY = emblem ? 50 : 62;
  const w = size, h = size * 1.16;
  const gid = React.useMemo(() => 'dscrest' + (++crestUid), []);
  return (
    <svg width={w} height={h} viewBox="0 0 100 116" style={{ display: 'block', filter: dim ? 'grayscale(0.5) opacity(0.6)' : 'drop-shadow(0 2px 3px rgba(60,40,16,0.3))' }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(ink, 0.22)} />
          <stop offset="1" stopColor={shade(ink, -0.18)} />
        </linearGradient>
      </defs>
      <path d="M8,6 H92 V58 C92,90 62,106 50,112 C38,106 8,90 8,58 Z"
        fill={dashed ? 'rgba(120,96,54,0.10)' : `url(#${gid})`}
        stroke={dashed ? 'rgba(120,96,54,0.5)' : 'var(--gold)'}
        strokeWidth={dashed ? 2 : 2.5}
        strokeDasharray={dashed ? '5 4' : 'none'} />
      {!dashed && <path d="M16,14 H84 V56 C84,82 60,96 50,101 C40,96 16,82 16,56 Z"
        fill="none" stroke="rgba(255,245,225,0.26)" strokeWidth="1.2" />}
      {emblem && <g opacity={0.7}>{emblem(dashed ? 'rgba(120,96,54,0.6)' : '#ffffff', 2.3)}</g>}
      <text x="50" y={textY} textAnchor="middle" dominantBaseline="middle"
        fontFamily="Cinzel, serif" fontWeight="800"
        fontSize={initials.length > 2 ? 30 : 38}
        fill={dashed ? 'rgba(120,96,54,0.7)' : '#f4e6c9'}
        style={{ letterSpacing: '0.02em' }}>{initials}</text>
    </svg>
  );
}
