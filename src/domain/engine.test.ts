import { describe, expect, it } from 'vitest';
import { buildDailyCampaign, initialsForName, scoreLegion } from './engine';
import { POSITIONS } from './game-data';

describe('domain engine', () => {
  it('creates deterministic initials without particles', () => {
    expect(initialsForName("Lorenzo de' Medici")).toBe('LM');
    expect(initialsForName('Khalid ibn al-Walid')).toBe('KW');
  });

  it('builds the same daily campaign for the same seed', () => {
    const first = buildDailyCampaign(2026163);
    const second = buildDailyCampaign(2026163);

    expect(first.seed).toBe(2026163);
    expect(second.player.map((pick) => pick.figure.name)).toEqual(first.player.map((pick) => pick.figure.name));
    expect(first.player).toHaveLength(POSITIONS.length);
    expect(first.enemy).toHaveLength(POSITIONS.length);
  });

  it('scores a legion with base strength, synergy, battlefield, and ideology modifiers', () => {
    const campaign = buildDailyCampaign(2026163);
    const result = scoreLegion(campaign.player, campaign.battleground, campaign.ideology, campaign.seed);

    expect(result.base).toBeGreaterThan(0);
    expect(result.final).toBeGreaterThan(result.base * 0.5);
    expect(result.synergies.length).toBeGreaterThan(0);
    expect(result.breakdown.some((line) => line.label.includes('Ideology'))).toBe(true);
  });
});
