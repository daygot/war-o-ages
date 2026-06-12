import React from 'react';

/* Parchment panel — the card primitive. `framed` adds the inner rule
   ("double-bordered plate"); `dark` inverts to the council-table surface. */
export function Panel({ children, framed = false, dark = false, padding = 16, accent, style, className = '' }) {
  return (
    <div
      className={'panel ' + className}
      style={{
        padding,
        ...(dark ? {
          background: 'linear-gradient(180deg, var(--night), var(--night-2))',
          border: '1px solid var(--gold)',
          color: 'var(--night-text)',
        } : {}),
        ...(accent ? { borderLeft: `4px solid ${accent}` } : {}),
        ...style,
      }}
    >
      {framed && <div className="frame-rule" />}
      {children}
    </div>
  );
}
