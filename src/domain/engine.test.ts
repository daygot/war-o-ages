import { describe, expect, it } from 'vitest';
import {
  buildDailyCampaign,
  detectSynergies,
  gradeFor,
  initialsForName,
  poolFor,
  scoreLegion,
} from './engine';
import { BATTLEGROUNDS, IDEOLOGIES, POSITIONS, ROSTER, SYNERGY_DEFS } from './game-data';
import type { Figure, LegionPick, PositionKey } from './types';

function byName(name: string): Figure {
  const figure = ROSTER.find((candidate) => candidate.name === name);
  if (!figure) throw new Error(`Missing test figure: ${name}`);
  return figure;
}

function picksByPosition(names: Record<PositionKey, string>): LegionPick[] {
  return POSITIONS.map((position) => ({ position, figure: byName(names[position.key]) }));
}

describe('domain engine', () => {
  it('creates deterministic initials without particles', () => {
    expect(initialsForName("Lorenzo de' Medici")).toBe('LM');
    expect(initialsForName('Khalid ibn al-Walid')).toBe('KW');
  });

  it('ports the full legacy roster and rule catalog into typed production data', () => {
    expect(ROSTER).toHaveLength(193);
    expect(BATTLEGROUNDS).toHaveLength(6);
    expect(IDEOLOGIES).toHaveLength(17);
    expect(SYNERGY_DEFS).toHaveLength(11);

    expect(ROSTER.map((figure) => figure.name)).toEqual(
      expect.arrayContaining([
        'Qin Shi Huang',
        'People\'s Liberation Army',
        'Lech Wałęsa',
        'Aristotle Onassis',
      ]),
    );
  });

  it('derives legacy initials, stats, eligibility, metadata, and tiers for figures', () => {
    const genghis = byName('Genghis Khan');

    expect(genghis.id).toBe('genghis-khan');
    expect(genghis.initials).toBe('GK');
    expect(genghis.power).toBe(96);
    expect(genghis.stats).toEqual({ PWR: 98, CMD: 89, GUI: 81, VAL: 88, DIP: 83 });
    expect(genghis.eligiblePositions).toEqual(['commander', 'allies']);
    expect(genghis.regionName).toBe('East Asia');
    expect(genghis.eraName).toBe('Medieval');
    expect(genghis.tier).toBe('Legendary');
  });

  it('builds position pools from legacy eligibility rules', () => {
    const commanderNames = poolFor('commander').map((figure) => figure.name);

    expect(commanderNames).toContain('Genghis Khan');
    expect(commanderNames).toContain('Qin Shi Huang');
    expect(commanderNames).not.toContain('Sun Tzu');
    expect(poolFor('strategist').map((figure) => figure.name)).toContain('Sun Tzu');
  });

  it('detects named legacy synergies for a drafted legion', () => {
    const picks = picksByPosition({
      commander: 'Genghis Khan',
      strategist: 'Sun Tzu',
      general: 'Hannibal Barca',
      troops: 'Mongol Horsemen',
      allies: 'Kublai Khan',
    });

    expect(detectSynergies(picks).map((synergy) => synergy.name)).toEqual([
      'Dragon Court',
      'Steppe Riders',
      'East Meets West',
    ]);
  });

  it('scores legions with legacy weighted stats, named synergies, battleground, ideology, and grade', () => {
    const picks = picksByPosition({
      commander: 'Genghis Khan',
      strategist: 'Sun Tzu',
      general: 'Hannibal Barca',
      troops: 'Mongol Horsemen',
      allies: 'Kublai Khan',
    });
    const battleground = BATTLEGROUNDS.find((candidate) => candidate.key === 'steppe');
    const ideology = IDEOLOGIES.find((candidate) => candidate.key === 'conquest');

    if (!battleground || !ideology) throw new Error('Missing test battleground or ideology');

    const result = scoreLegion(picks, battleground, ideology, 4242);

    expect(result.base).toBeCloseTo(90.755, 3);
    expect(result.synergies.map((synergy) => synergy.name)).toContain('Steppe Riders');
    expect(result.ideology?.pct).toBe(17);
    expect(result.battlegroundMultiplier).toBeCloseTo(1.12, 2);
    expect(result.final).toBeCloseTo(172.418, 3);
    expect(gradeFor(result.final)).toMatchObject({ letter: 'S', label: 'Immortal' });
  });

  it('builds the same daily campaign for the same seed', () => {
    const first = buildDailyCampaign(2026163);
    const second = buildDailyCampaign(2026163);

    expect(first.seed).toBe(2026163);
    expect(second.player.map((pick) => pick.figure.name)).toEqual(first.player.map((pick) => pick.figure.name));
    expect(first.player).toHaveLength(POSITIONS.length);
    expect(first.enemy).toHaveLength(POSITIONS.length);
  });
});
