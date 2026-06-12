import React from 'react';

/* Ideology glyphs — 24×24 stroke-based line marks, one per movement,
   faith or creed. Lucide-flavored: round caps/joins, ~1.7 stroke. */
const IDEOLOGY_PATHS = {
  crown:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M4,19 H20" /><path d="M4,19 L3.4,7.5 L9,12 L12,5.5 L15,12 L20.6,7.5 L20,19" /></g>),
  cross:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12,3 V21" /><path d="M6.5,9 H17.5" /></g>),
  banner: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M6,3 V21" /><path d="M6,4 H19 L15.5,8.5 L19,13 H6" /></g>),
  star:   (s, w) => (<path d="M12,3 L14.5,9.1 L21,9.5 L16,13.6 L17.8,20 L12,16.2 L6.2,20 L8,13.6 L3,9.5 L9.5,9.1 Z" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />),
  scales: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M12,5 V19" /><path d="M8,19 H16" /><path d="M4,7 H20" /><path d="M4,7 L1.8,12 H6.2 Z" /><path d="M20,7 L17.8,12 H22.2 Z" /></g>),
  olive:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M5,20 C10,15 14,10 19,5" /><path d="M14,8 q-3.2,-0.6 -4.2,-3.8 q3.2,0.6 4.2,3.8" /><path d="M11,12 q-3.4,-0.5 -4.4,-3.6 q3.4,0.5 4.4,3.6" /><path d="M8.5,16 q-3.4,-0.4 -4.4,-3.4 q3.4,0.4 4.4,3.4" /></g>),
  sun:    (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="4.3" /><path d="M12,2 V4.5 M12,19.5 V22 M2,12 H4.5 M19.5,12 H22 M4.9,4.9 L6.7,6.7 M17.3,17.3 L19.1,19.1 M19.1,4.9 L17.3,6.7 M6.7,17.3 L4.9,19.1" /></g>),
  shield: (s, w) => (<path d="M12,3 L19.5,5.8 V11 C19.5,16 15.8,19.4 12,21 C8.2,19.4 4.5,16 4.5,11 V5.8 Z" fill="none" stroke={s} strokeWidth={w} strokeLinejoin="round" />),
  coin:   (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><ellipse cx="12" cy="7" rx="7" ry="3" /><path d="M5,7 V16 A7,3 0 0 0 19,16 V7" /><path d="M5,11.5 A7,3 0 0 0 19,11.5" /></g>),
  flag:   (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M7,3 V21" /><path d="M7,4.5 q3,-1.7 6,0 t6,0 V12 q-3,1.7 -6,0 t-6,0 Z" /></g>),
  chain:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M10.8,8 A3.3,3.3 0 0 0 6.2,8 A3.3,3.3 0 0 0 6.2,12.6 L8.2,14.4" /><path d="M13.2,16 A3.3,3.3 0 0 0 17.8,16 A3.3,3.3 0 0 0 17.8,11.4 L15.8,9.6" /></g>),
  circleA:(s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9" /><path d="M8.4,16.5 L12,7 L15.6,16.5" /><path d="M6,13.6 H18" /></g>),
  fasces: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M9,4 V20 M12,4 V20 M15,4 V20" /><path d="M7.4,9 H16.6 M7.4,13 H16.6" /></g>),
  crescent:(s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M15.5,4 A8.5,8.5 0 1 0 15.5,20 A6.6,6.6 0 1 1 15.5,4 Z" /><path d="M19.6,9.6 l0.7,1.7 1.8,0.15 -1.4,1.2 0.45,1.8 -1.55,-1 -1.55,1 0.45,-1.8 -1.4,-1.2 1.8,-0.15 z" /></g>),
  wheel:  (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="1.8" /><path d="M12,3.5 V20.5 M3.5,12 H20.5 M6,6 L18,18 M18,6 L6,18" /></g>),
  column: (s, w) => (<g fill="none" stroke={s} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round"><path d="M5,6 H19 M6.5,9 H17.5 M8,9 V17 M12,9 V17 M16,9 V17 M5.5,20 H18.5 M7,17 H17" /></g>),
  om:     (s) => (<text x="12" y="18.5" textAnchor="middle" fontSize="20" fontFamily="serif" fontWeight="600" fill={s} stroke="none">ॐ</text>),
};

/* Ideology line-glyph (crown, scales, broken chain, crescent, …). */
export function IdeologyIcon({ icon = 'banner', size = 26, color = 'currentColor', strokeWidth = 1.7 }) {
  const draw = IDEOLOGY_PATHS[icon] || IDEOLOGY_PATHS.banner;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'block' }}>
      {draw(color, strokeWidth)}
    </svg>
  );
}
