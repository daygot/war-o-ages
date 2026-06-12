import React from 'react';

const DEFAULT_KEYS = ['PWR', 'CMD', 'GUI', 'VAL', 'DIP'];

/* Five-stat readout: PWR CMD GUI VAL DIP — big Cinzel numeral over a
   tracked-out micro label. */
export function StatRow({ stats, compact = false, keys = DEFAULT_KEYS }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${keys.length},1fr)`, gap: compact ? 2 : 6 }}>
      {keys.map(k => (
        <div key={k} style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: 'var(--display)', fontWeight: 800, fontSize: compact ? 14 : 17, color: 'var(--ink)', lineHeight: 1 }}>{stats[k]}</div>
          <div style={{ fontFamily: 'var(--display)', fontSize: 7.5, letterSpacing: '0.12em', color: 'var(--ink-faint)', marginTop: 2 }}>{k}</div>
        </div>
      ))}
    </div>
  );
}
