import React from 'react';
import { shade } from './Crest.jsx';

function scallop(cx, cy, rOuter, rInner, points) {
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

/* Scalloped wax-seal grade stamp. Pass a grade {letter, color};
   `animate` stamps it in with the woaSealIn rotation. */
export function WaxSeal({ grade = { letter: 'A', color: '#8f2d22' }, size = 86, animate = false }) {
  const s = size;
  return (
    <div style={{ width: s, height: s, position: 'relative', animation: animate ? 'woaSealIn 0.7s cubic-bezier(.2,1.2,.3,1) both' : 'none' }}>
      <svg width={s} height={s} viewBox="0 0 100 100">
        <defs>
          <radialGradient id={'dswax' + grade.letter} cx="40%" cy="35%" r="75%">
            <stop offset="0" stopColor={shade(grade.color, 0.28)} />
            <stop offset="0.7" stopColor={grade.color} />
            <stop offset="1" stopColor={shade(grade.color, -0.3)} />
          </radialGradient>
        </defs>
        <path d={scallop(50, 50, 42, 38, 12)} fill={'url(#dswax' + grade.letter + ')'} stroke={shade(grade.color, -0.35)} strokeWidth="1.5" />
        <circle cx="50" cy="50" r="32" fill="none" stroke={shade(grade.color, 0.35)} strokeWidth="1" strokeDasharray="2 3" opacity="0.7" />
      </svg>
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ fontFamily: 'var(--deco)', fontWeight: 900, fontSize: s * 0.42, color: '#f6e8cd', lineHeight: 0.9, textShadow: '0 1px 2px rgba(0,0,0,0.4)' }}>{grade.letter}</div>
      </div>
    </div>
  );
}
