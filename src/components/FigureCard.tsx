import { REGIONS } from '../domain/game-data';
import { initialsForName } from '../domain/engine';
import type { LegionPick } from '../domain/types';
import { Crest } from './Crest';
import { Tag } from './core';

type FigureCardProps = {
  pick: LegionPick;
  compact?: boolean;
};

export function FigureCard({ pick, compact = false }: FigureCardProps) {
  const region = REGIONS[pick.figure.region];
  return (
    <article className={`figure-card ${compact ? 'figure-card-compact' : ''}`} style={{ borderLeftColor: region.ink }}>
      <Crest initials={initialsForName(pick.figure.name)} ink={region.ink} position={pick.position.key} size={compact ? 44 : 58} />
      <div className="figure-copy">
        <div className="label">The {pick.position.name}</div>
        <h3>{pick.figure.name}</h3>
        <p>{pick.figure.civilization} · {region.short}</p>
        <div className="tag-row">
          {pick.figure.tags.slice(0, compact ? 2 : 3).map((tag) => <Tag key={tag}>{tag}</Tag>)}
        </div>
      </div>
      <strong className="figure-power">{pick.figure.power}</strong>
    </article>
  );
}
