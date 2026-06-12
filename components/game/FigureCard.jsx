import React from 'react';
import { Crest } from '../heraldry/Crest.jsx';
import { Tag } from '../core/Tag.jsx';
import { StatRow } from './StatRow.jsx';

/* Full figure card — crest, rank label, name, provenance line, trait
   tags, embossed rule, stat row. The drafted-figure reveal. */
export function FigureCard({ fig, positionName, pos, animate = false, style }) {
  if (!fig) return null;
  return (
    <div className="panel" style={{ padding: '12px 13px 11px', animation: animate ? 'woaPop 0.5s ease both' : 'none', ...style }}>
      <div className="frame-rule" />
      <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', position: 'relative' }}>
        <Crest initials={fig.init} ink={fig.regionInk} size={50} pos={pos} />
        <div style={{ flex: 1, minWidth: 0 }}>
          {positionName && <div className="label" style={{ color: fig.regionInk, marginBottom: 1 }}>{positionName}</div>}
          <div className="disp" style={{ fontSize: 18, marginBottom: 2, color: 'var(--ink)' }}>{fig.name}</div>
          <div style={{ fontFamily: 'var(--serif)', fontSize: 12.5, color: 'var(--ink-soft)', fontStyle: 'italic' }}>
            {fig.regionName} · {fig.eraName} · <span style={{ color: fig.regionInk, fontStyle: 'normal', fontWeight: 600 }}>{fig.tier}</span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 7 }}>
            {(fig.tags || []).map(t => <Tag key={t} ink={fig.regionInk}>{t}</Tag>)}
          </div>
        </div>
      </div>
      <div className="hr-rule" style={{ margin: '10px 0 9px' }} />
      <StatRow stats={fig.stats} />
    </div>
  );
}
