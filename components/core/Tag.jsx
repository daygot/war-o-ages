import React from 'react';

function hexA(hex, a) {
  const h = hex.replace('#', '');
  return `rgba(${parseInt(h.slice(0, 2), 16)},${parseInt(h.slice(2, 4), 16)},${parseInt(h.slice(4, 6), 16)},${a})`;
}

/* Small-caps chip for figure tags ("Conqueror", "Tactician"). Tinted by
   region ink when provided. */
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
