import { useId } from 'react';
import type { PositionKey } from '../domain/types';

function shade(hex: string, amount: number): string {
  const raw = hex.replace('#', '');
  const channel = (start: number) => parseInt(raw.slice(start, start + 2), 16);
  const target = amount < 0 ? 0 : 255;
  const ratio = Math.abs(amount);
  const mix = (value: number) => Math.round((target - value) * ratio + value);
  return `rgb(${mix(channel(0))}, ${mix(channel(2))}, ${mix(channel(4))})`;
}

const rankMarks: Record<PositionKey, string> = {
  commander: '♛',
  strategist: '✒',
  general: '⚔',
  troops: '▲',
  allies: '⬡',
};

type CrestProps = {
  initials: string;
  ink: string;
  position?: PositionKey;
  size?: number;
  dim?: boolean;
};

export function Crest({ initials, ink, position, size = 58, dim = false }: CrestProps) {
  const id = useId().replace(/:/g, '');
  const height = size * 1.16;

  return (
    <svg
      className="crest"
      width={size}
      height={height}
      viewBox="0 0 100 116"
      aria-label={`${initials} crest`}
      style={{ filter: dim ? 'grayscale(0.5) opacity(0.6)' : undefined }}
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={shade(ink, 0.22)} />
          <stop offset="1" stopColor={shade(ink, -0.18)} />
        </linearGradient>
      </defs>
      <path d="M8,6 H92 V58 C92,90 62,106 50,112 C38,106 8,90 8,58 Z" fill={`url(#${id})`} stroke="var(--gold)" strokeWidth="2.5" />
      <path d="M16,14 H84 V56 C84,82 60,96 50,101 C40,96 16,82 16,56 Z" fill="none" stroke="rgba(255,245,225,0.26)" strokeWidth="1.2" />
      {position ? <text x="50" y="84" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="18" fill="rgba(255,255,255,0.72)">{rankMarks[position]}</text> : null}
      <text x="50" y="48" textAnchor="middle" dominantBaseline="middle" fontFamily="Cinzel, serif" fontWeight="800" fontSize={initials.length > 2 ? 30 : 38} fill="#f4e6c9">
        {initials}
      </text>
    </svg>
  );
}
