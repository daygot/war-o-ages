import React from 'react';

/* Centered ceremonial heading: gold ✦ between fading hairlines, display
   title, optional italic subtitle. */
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
