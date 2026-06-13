import { BATTLEGROUNDS, ERAS, IDEOLOGIES, POSITIONS, REGIONS, ROSTER, STAT_KEYS, STAT_LABELS, SYNERGY_DEFS } from '../domain/game-data';
import { battlegroundMultiplier, detectSynergies, figurePower, gradeFor, hashString, ideologyEffect, poolFor as domainPoolFor, scoreLegion } from '../domain/engine';
import type { Battleground, Figure, Ideology, LegionPick, PositionKey } from '../domain/types';

type LegacyFigure = Figure & { pr: number; civ: string; init: string; eligible: PositionKey[]; };
type LegacySquad = Partial<Record<PositionKey, LegacyFigure>>;

const legacyFigure = (figure: Figure): LegacyFigure => ({
  ...figure,
  pr: figure.power,
  civ: figure.civilization,
  init: figure.initials,
  eligible: figure.eligiblePositions,
});

const legacyRoster = ROSTER.map(legacyFigure);
const byId = new Map(legacyRoster.map((figure) => [figure.id, figure]));
const byName = new Map(legacyRoster.map((figure) => [figure.name, figure]));

function toLegacyFigure(figure: Figure): LegacyFigure {
  return byId.get(figure.id) ?? byName.get(figure.name) ?? legacyFigure(figure);
}

function squadList(squad: LegacySquad): LegacyFigure[] {
  return Object.values(squad).filter((figure): figure is LegacyFigure => Boolean(figure));
}

function picksFromSquad(squad: LegacySquad): LegionPick[] {
  const picks: LegionPick[] = [];
  for (const position of POSITIONS) {
    const figure = squad[position.key];
    if (figure) {
      picks.push({ position, figure });
    }
  }
  return picks;
}

function ideologyByKey(key: string | null | undefined): Ideology | null {
  return IDEOLOGIES.find((ideology) => ideology.key === key) ?? null;
}

const noIdeology: Ideology = {
  key: 'none',
  name: 'No Banner',
  icon: 'banner',
  group: 'Political',
  tenet: 'No cause has been raised.',
  blurb: 'The host fights without a unifying banner.',
  favoredTags: [],
};

function scoreSquad(squad: LegacySquad, battleground: Battleground, rngSeed: number, ideologyKey?: string | null) {
  const picks = picksFromSquad(squad);
  const ideology = ideologyByKey(ideologyKey) ?? noIdeology;
  const scored = scoreLegion(picks, battleground, ideology, rngSeed);
  return {
    base: scored.base,
    syn: scored.synergies,
    synTotal: scored.synergyTotal,
    bg: scored.battlegroundMultiplier,
    final: scored.final,
    ideology: ideology.key === 'none' ? null : scored.ideology,
  };
}

function generateEnemy(seed = 1234, avoidNames: string[] = []): LegacySquad {
  const rng = mulberry32(seed || 1234);
  const avoid = new Set(avoidNames);
  const squad: LegacySquad = {};
  for (const position of POSITIONS) {
    const pool = domainPoolFor(position.key)
      .map(toLegacyFigure)
      .filter((figure) => !avoid.has(figure.name) && !squadList(squad).some((picked) => picked.name === figure.name));
    squad[position.key] = pool[Math.floor(rng() * pool.length)];
  }
  return squad;
}

function poolFor(positionKey: PositionKey): LegacyFigure[] {
  return domainPoolFor(positionKey).map(toLegacyFigure);
}

function mulberry32(seed: number) {
  return function random() {
    const a = seed | 0;
    seed = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function legacyIdeologyEffect(squad: LegacySquad, key: string) {
  const def = ideologyByKey(key);
  return def ? ideologyEffect(picksFromSquad(squad), def) : null;
}

function legacyDetectSynergies(squad: LegacySquad) {
  return detectSynergies(picksFromSquad(squad));
}

function legacyFigurePower(figure: LegacyFigure, positionKey: PositionKey) {
  return figurePower(figure, positionKey);
}

export const WOA = {
  REGIONS,
  ERAS,
  POSITIONS,
  ROSTER: legacyRoster,
  BATTLEGROUNDS,
  IDEOLOGIES,
  STAT_KEYS,
  STAT_LABELS,
  SYNERGY_DEFS,
  poolFor,
  figurePower: legacyFigurePower,
  detectSynergies: legacyDetectSynergies,
  scoreSquad,
  generateEnemy,
  gradeFor,
  ideologyByKey,
  ideologyEffect: legacyIdeologyEffect,
  squadList,
  initials: (name: string) => name,
  hash: hashString,
  mulberry32,
  battlegroundMultiplier,
};
