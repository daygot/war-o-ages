import React from 'react';
import { Crest } from '../heraldry/Crest.jsx';
import { StatRow } from './StatRow.jsx';

/* Compact roster row — region-ink left border, small crest, name +
   provenance, compact stats. `hidden` renders the fog-of-war UNKNOWN row. */
export function FigureRow({ fig, positionAbbr, pos, hidden = false, animate = false, delay = 0 }) {
  if (hidden || !fig) {
    return (
      <div className="panel" style={{ padding: '11px 13px', display: 'flex', alignItems: 'center', gap: 12, opacity: 0.85 }}>
        <Crest dashed initials={positionAbbr || ''} size={40} pos={pos} />
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
      borderLeft: `4px solid ${fig.regionInk}`, animation: animate ? 'woaFadeUp 0.45s ease both' : 'none', animationDelay: `${delay}ms` }}>
      <Crest initials={fig.init} ink={fig.regionInk} size={38} pos={pos} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div className="disp" style={{ fontSize: 15.5, color: 'var(--ink)', lineHeight: 1.1 }}>{fig.name}</div>
        <div style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 11.5, color: 'var(--ink-soft)' }}>{fig.regionName} · {fig.eraName}</div>
      </div>
      <div style={{ width: 132, flexShrink: 0 }}><StatRow stats={fig.stats} compact /></div>
    </div>
  );
}
