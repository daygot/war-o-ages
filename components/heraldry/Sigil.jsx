import React from 'react';

/* War O' Ages round sigil — dark badge, opposed wax-red and gold
   pennants, bright gold pivot. The app mark; sits beside the wordmark. */
export function Sigil({ size = 30 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" style={{ display: 'block' }}>
      <circle cx="20" cy="20" r="18.5" fill="#2a2017" stroke="var(--gold)" strokeWidth="1.5" />
      <path d="M20,7 L24,18 L20,15 L16,18 Z" fill="var(--seal-2)" />
      <path d="M20,33 L16,22 L20,25 L24,22 Z" fill="var(--gold)" />
      <circle cx="20" cy="20" r="2.4" fill="var(--gold-bright)" />
    </svg>
  );
}
