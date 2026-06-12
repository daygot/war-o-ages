import { BATTLEGROUNDS, IDEOLOGIES, POSITIONS, ROSTER } from './game-data';
import type { Battleground, DailyCampaign, Figure, Ideology, LegionPick, Position, ScoreResult } from './types';

export function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export function dailySeed(date = new Date()): number {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((Number(date) - Number(start)) / 86_400_000);
  return date.getFullYear() * 1000 + day;
}

export function initialsForName(name: string): string {
  const stopWords = new Set(['of', 'the', 'ibn', 'al', "de'", 'de']);
  const parts = name.split(/[\s-]+/).filter((part) => part && !stopWords.has(part.toLowerCase()));
  const initials = parts.slice(0, 2).map((part) => part[0]?.toUpperCase() ?? '').join('');
  return initials || name.slice(0, 2).toUpperCase();
}

function rankedCandidates(position: Position, seed: number, offset: number): Figure[] {
  return [...ROSTER]
    .map((figure) => {
      const tagFit = figure.tags.filter((tag) => position.tags.includes(tag)).length;
      const jitter = hashString(`${seed}:${offset}:${position.key}:${figure.id}`) % 17;
      return { figure, score: tagFit * 100 + figure.power + jitter };
    })
    .sort((a, b) => b.score - a.score)
    .map((candidate) => candidate.figure);
}

function draftLegion(seed: number, offset = 0): LegionPick[] {
  const used = new Set<string>();
  return POSITIONS.map((position, positionIndex) => {
    const figure = rankedCandidates(position, seed + positionIndex, offset).find((candidate) => !used.has(candidate.id)) ?? ROSTER[positionIndex];
    used.add(figure.id);
    return { position, figure };
  });
}

function pickBySeed<T>(items: T[], seed: number, salt: string): T {
  return items[hashString(`${seed}:${salt}`) % items.length];
}

export function buildDailyCampaign(seed = dailySeed()): DailyCampaign {
  return {
    seed,
    player: draftLegion(seed, 0),
    enemy: draftLegion(seed, 1),
    battleground: pickBySeed(BATTLEGROUNDS, seed, 'battleground'),
    ideology: pickBySeed(IDEOLOGIES, seed, 'ideology'),
  };
}

function countMatchingTags(picks: LegionPick[], tags: string[]): number {
  return picks.reduce((total, pick) => total + pick.figure.tags.filter((tag) => tags.includes(tag)).length, 0);
}

function repeatedTagSynergies(picks: LegionPick[]): string[] {
  const counts = new Map<string, number>();
  for (const pick of picks) {
    for (const tag of pick.figure.tags) {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
  }
  return [...counts.entries()]
    .filter(([, count]) => count >= 2)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, count]) => `${tag} x${count}`);
}

export function scoreLegion(picks: LegionPick[], battleground: Battleground, ideology: Ideology, seed: number): ScoreResult {
  const base = Math.round(picks.reduce((total, pick) => total + pick.figure.power * pick.position.weight, 0));
  const synergies = repeatedTagSynergies(picks);
  const synergyBonus = synergies.reduce((total, synergy) => {
    const count = Number(synergy.split('x')[1]);
    return total + Math.max(0, count - 1) * 0.05;
  }, 0);
  const battlefieldBonus = countMatchingTags(picks, battleground.favoredTags) * battleground.modifier;
  const ideologyBonus = countMatchingTags(picks, ideology.favoredTags) * ideology.modifier;
  const variance = ((hashString(`${seed}:verdict`) % 9) - 4) / 100;
  const final = Math.round(base * (1 + synergyBonus + battlefieldBonus + ideologyBonus + variance));

  return {
    base,
    synergyBonus,
    battlefieldBonus,
    ideologyBonus,
    final,
    synergies,
    breakdown: [
      { label: 'Base Muster', value: base },
      { label: 'Synergy Chronicle', value: Math.round(base * synergyBonus) },
      { label: `Battlefield: ${battleground.name}`, value: Math.round(base * battlefieldBonus) },
      { label: `Ideology: ${ideology.name}`, value: Math.round(base * ideologyBonus) },
    ],
  };
}
