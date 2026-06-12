import React from 'react';

/* Left-aligned rail/section header: small-caps title + hairline filling
   the rest of the row, optional italic annotation on the right. */
export function SectionRule({ children, color, right }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
      <span className="caps" style={{ fontSize: 12, color: color || 'var(--ink)' }}>{children}</span>
      <span style={{ flex: 1, height: 1, background: 'var(--line)' }} />
      {right && <span style={{ fontFamily: 'var(--serif)', fontStyle: 'italic', fontSize: 12, color: 'var(--ink-faint)' }}>{right}</span>}
    </div>
  );
}
