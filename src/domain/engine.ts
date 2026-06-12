import { BATTLEGROUNDS, IDEOLOGIES, POSITIONS, ROSTER, SYNERGY_DEFS } from './game-data';
import type {
  ActiveSynergy,
  Battleground,
  DailyCampaign,
  Figure,
  Grade,
  Ideology,
  IdeologyEffect,
  LegionPick,
  Position,
  PositionKey,
  ScoreResult,
  StatKey,
} from './types';

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
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0]?.[0] ?? ''}${parts.at(-1)?.[0] ?? ''}`.toUpperCase();
}

function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, value));
}

type Squad = Partial<Record<PositionKey, Figure>>;

function squadFromPicks(picks: LegionPick[]): Squad {
  return Object.fromEntries(picks.map((pick) => [pick.position.key, pick.figure]));
}

function squadList(squad: Squad): Figure[] {
  return Object.values(squad).filter((figure): figure is Figure => Boolean(figure));
}

function has(squad: Squad, name: string): boolean {
  return squadList(squad).some((figure) => figure.name === name);
}

function countRegion(squad: Squad, region: Figure['region']): number {
  return squadList(squad).filter((figure) => figure.region === region).length;
}

function countCivilization(squad: Squad, civilization: string): number {
  return squadList(squad).filter((figure) => figure.civilization === civilization).length;
}

function countTag(squad: Squad, tag: string): number {
  return squadList(squad).filter((figure) => figure.tags.includes(tag)).length;
}

function hasTag(squad: Squad, tag: string): boolean {
  return countTag(squad, tag) > 0;
}

function distinctRegions(squad: Squad): number {
  return new Set(squadList(squad).map((figure) => figure.region)).size;
}

function erasRepresented(squad: Squad): number {
  return new Set(squadList(squad).map((figure) => figure.era)).size;
}

function maxRegionCount(squad: Squad): number {
  const counts = new Map<Figure['region'], number>();
  let best = 0;
  for (const figure of squadList(squad)) {
    const next = (counts.get(figure.region) ?? 0) + 1;
    counts.set(figure.region, next);
    best = Math.max(best, next);
  }
  return best;
}

function activeSynergy(key: string): ActiveSynergy {
  const synergy = SYNERGY_DEFS.find((candidate) => candidate.key === key);
  if (!synergy) throw new Error(`Missing synergy definition: ${key}`);
  return synergy;
}

export function poolFor(positionKey: PositionKey): Figure[] {
  return ROSTER.filter((figure) => figure.eligiblePositions.includes(positionKey));
}

const POSITION_STATS: Record<PositionKey, StatKey[]> = {
  commander: ['PWR', 'CMD'],
  strategist: ['GUI', 'DIP'],
  general: ['PWR', 'CMD', 'GUI'],
  troops: ['VAL', 'PWR'],
  allies: ['DIP', 'GUI'],
};

export function figurePower(figure: Figure, positionKey: PositionKey): number {
  const keys = POSITION_STATS[positionKey];
  const average = keys.reduce((sum, key) => sum + figure.stats[key], 0) / keys.length;
  return figure.power * 0.5 + average * 0.5;
}

export function detectSynergies(picks: LegionPick[]): ActiveSynergy[] {
  const squad = squadFromPicks(picks);
  const commander = squad.commander;
  const general = squad.general;
  const allies = squad.allies;

  return [
    countRegion(squad, 'EASIA') >= 2 ? activeSynergy('dragon-court') : null,
    has(squad, 'Julius Caesar') && has(squad, 'Roman Legions') ? activeSynergy('sons-of-rome') : null,
    has(squad, 'Genghis Khan') && has(squad, 'Mongol Horsemen') ? activeSynergy('steppe-riders') : null,
    countCivilization(squad, 'Norse') >= 2 ? activeSynergy('viking-brotherhood') : null,
    has(squad, 'Aristotle') && has(squad, 'Plato') ? activeSynergy('philosopher-kings') : null,
    has(squad, 'Zheng He') && has(squad, 'Marco Polo') ? activeSynergy('silk-road-pact') : null,
    countTag(squad, 'Conqueror') >= 3 ? activeSynergy('warlords-gambit') : null,
    commander && ['EASIA', 'SASIA', 'MIDE'].includes(commander.region) && general && ['WEUR', 'EEUR', 'MEDIT'].includes(general.region)
      ? activeSynergy('east-meets-west')
      : null,
    commander?.region === 'EASIA' && commander.tags.includes('Emperor') && has(squad, 'Confucius') ? activeSynergy('mandate-of-heaven') : null,
    erasRepresented(squad) >= 4 ? activeSynergy('age-gap-clash') : null,
    commander?.civilization === 'Rome' && allies?.tags.includes('Diplomat') ? activeSynergy('pax-romana') : null,
  ].filter((synergy): synergy is ActiveSynergy => Boolean(synergy));
}

function battlegroundByCivilization(squad: Squad, buffCivilizations: string[], debuffCivilizations: string[]): number {
  let multiplier = 1;
  for (const figure of squadList(squad)) {
    if (buffCivilizations.includes(figure.civilization)) multiplier += 0.04;
    if (debuffCivilizations.includes(figure.civilization)) multiplier -= 0.025;
  }
  return clamp(multiplier, 0.82, 1.22);
}

function battlegroundByTag(squad: Squad, buffTags: string[], debuffTags: string[], amount: number): number {
  let multiplier = 1;
  for (const figure of squadList(squad)) {
    if (buffTags.some((tag) => figure.tags.includes(tag))) multiplier += amount * 0.5;
    if (debuffTags.some((tag) => figure.tags.includes(tag))) multiplier -= 0.02;
  }
  return clamp(multiplier, 0.85, 1.25);
}

export function battlegroundMultiplier(picks: LegionPick[], battleground: Battleground): number {
  const squad = squadFromPicks(picks);
  switch (battleground.key) {
    case 'steppe':
      return battlegroundByCivilization(squad, ['Mongol', 'Persia', 'Egypt', 'Huns', 'Scythia', 'Comanche'], ['Greece', 'Rome', 'Swiss']);
    case 'jungle':
      return battlegroundByCivilization(squad, ['Aztec', 'Zulu', 'Vietnam', 'Nepal', 'Inca'], ['Rome', 'France', 'Britain', 'Germany', 'Norse']);
    case 'mountain':
      return battlegroundByTag(squad, [], ['Conqueror'], 0.15);
    case 'coast':
      return battlegroundByTag(squad, ['Admiral'], [], 0.2);
    case 'desert':
      return battlegroundByCivilization(squad, ['Arabia', 'Persia', 'Egypt', 'Ottoman', 'Mali', 'Songhai'], ['Norse', 'Rus']);
    case 'walls':
      return battlegroundByCivilization(squad, ['Rome', 'Ottoman', 'Byzantine', 'China'], ['Mongol', 'Huns']);
    default:
      return 1;
  }
}

function clampPct(value: number, low: number, high: number): number {
  return clamp(Math.round(value), low, high);
}

export function ideologyEffect(picks: LegionPick[], ideology: Ideology): IdeologyEffect {
  const squad = squadFromPicks(picks);
  switch (ideology.key) {
    case 'conquest': {
      const ambitions = countTag(squad, 'Emperor') + countTag(squad, 'Conqueror') + countTag(squad, 'Warlord');
      return { pct: clampPct(5 + 4 * ambitions, 5, 25), note: ambitions ? `${ambitions} sovereign ${ambitions > 1 ? 'ambitions' : 'ambition'} press the conquest` : 'Naked ambition drives the host' };
    }
    case 'democracy': {
      const regions = distinctRegions(squad);
      return { pct: clampPct(3 + 4 * (regions - 1), 3, 23), note: `A coalition of ${regions} ${regions > 1 ? 'peoples' : 'people'}` };
    }
    case 'communism': {
      const radicals = countTag(squad, 'Radical');
      const masses = squad.troops ? 8 : 0;
      return { pct: clampPct(4 + 6 * radicals + masses, 4, 26), note: radicals ? `${radicals} radical ${radicals > 1 ? 'theorists' : 'theorist'} rouse the masses` : 'The masses stir without a theorist' };
    }
    case 'socialism': {
      const reformers = countTag(squad, 'Reformer');
      const masses = squad.troops ? 6 : 0;
      return { pct: clampPct(5 + 5 * reformers + masses, 5, 24), note: reformers ? 'Reformers bind the ranks in common cause' : 'Solidarity without a guiding hand' };
    }
    case 'capitalism': {
      const capital = countTag(squad, 'Merchant') * 2 + countTag(squad, 'Diplomat') + countTag(squad, 'Coalition Builder');
      return { pct: clampPct(4 + 4 * capital, 4, 24), note: capital ? 'Coin and trade bankroll the campaign' : 'An empty war-chest' };
    }
    case 'nationalism': {
      const most = maxRegionCount(squad);
      return { pct: clampPct(2 + 5 * (most - 1), 2, 24), note: most > 1 ? `${most} of one homeland march as one` : 'A host of strangers, loyal to none' };
    }
    case 'independence': {
      const revolutionary = hasTag(squad, 'Revolutionary') ? 10 : 0;
      const spread = Math.max(0, distinctRegions(squad) - 2) * 4;
      return { pct: clampPct(6 + revolutionary + spread, 6, 24), note: revolutionary ? 'Revolutionaries raise the standard' : 'A people rises against its masters' };
    }
    case 'anarchism': {
      const kings = countTag(squad, 'Emperor');
      return { pct: clampPct(16 - 6 * kings, -8, 18), note: kings ? `${kings} crowned ${kings > 1 ? 'heads' : 'head'} betray the cause` : 'A free host answers to no throne' };
    }
    case 'faith': {
      const prophet = hasTag(squad, 'Prophet');
      return { pct: prophet ? 20 : 7, note: prophet ? 'A prophet sanctifies the host' : 'Faith alone steels the ranks' };
    }
    case 'islam': {
      const prophet = hasTag(squad, 'Prophet') ? 8 : 0;
      const middleEast = countRegion(squad, 'MIDE') * 4;
      return { pct: clampPct(5 + prophet + middleEast, 5, 24), note: prophet || middleEast ? 'The faithful answer the call' : 'A creed with few believers' };
    }
    case 'buddhism': {
      const calm = countTag(squad, 'Philosopher') + (hasTag(squad, 'Prophet') ? 2 : 0);
      const fury = countTag(squad, 'Berserker');
      return { pct: clampPct(4 + 5 * calm - 2 * fury, -4, 22), note: calm ? 'Calm discipline guides each strike' : 'No still mind among the host' };
    }
    case 'hinduism': {
      const sacred = countRegion(squad, 'SASIA') * 5 + countTag(squad, 'Philosopher') * 3;
      return { pct: clampPct(5 + sacred, 5, 24), note: sacred ? 'Dharma binds the host to its duty' : 'A faith far from its homeland' };
    }
    case 'theocracy': {
      const prophet = hasTag(squad, 'Prophet');
      const kings = countTag(squad, 'Emperor');
      return { pct: clampPct((prophet ? 10 : 0) + 4 * kings, 3, 24), note: prophet && kings ? 'God and crown rule as one' : prophet ? 'A prophet without a throne' : 'A throne without a heaven' };
    }
    case 'pacifism': {
      const moral = hasTag(squad, 'Prophet') || hasTag(squad, 'Philosopher') || hasTag(squad, 'Reformer');
      return { pct: moral ? 16 : -8, note: moral ? 'The moral high ground holds firm' : 'An army that will not strike' };
    }
    case 'reason': {
      const learned = countTag(squad, 'Scholar') + countTag(squad, 'Philosopher') + countTag(squad, 'Advisor') + countTag(squad, 'Tactician');
      return { pct: clampPct(4 * learned, 0, 24), note: learned ? `${learned} learned ${learned > 1 ? 'minds' : 'mind'} counsel the war` : 'No scholar lights the way' };
    }
    case 'stoicism': {
      const steadyMinds = countTag(squad, 'Scholar') + countTag(squad, 'Advisor');
      const troops = squad.troops ? 4 : 0;
      return { pct: clampPct(5 + 4 * steadyMinds + troops, 5, 22), note: steadyMinds ? 'Tempered minds outlast the storm' : 'Endurance without a guiding calm' };
    }
    case 'honor': {
      const warriors = countTag(squad, 'Warrior Culture') + countTag(squad, 'Berserker');
      return { pct: clampPct(6 + 6 * warriors, 6, 26), note: warriors ? `${warriors} warrior ${warriors > 1 ? 'bands' : 'band'} swear the oath` : 'An oath sworn by few' };
    }
    default:
      return { pct: 0, note: 'No banner raised' };
  }
}

function rankedCandidates(position: Position, seed: number, offset: number): Figure[] {
  return poolFor(position.key)
    .map((figure) => {
      const tagFit = figure.tags.filter((tag) => position.tags.includes(tag)).length;
      const jitter = hashString(`${seed}:${offset}:${position.key}:${figure.id}`) % 17;
      return { figure, score: tagFit * 100 + figurePower(figure, position.key) + jitter };
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

export function gradeFor(score: number): Grade {
  if (score >= 96) return { letter: 'S', label: 'Immortal', color: '#8f2d22' };
  if (score >= 86) return { letter: 'A', label: 'Conqueror', color: '#b08a2e' };
  if (score >= 74) return { letter: 'B', label: 'Contender', color: '#3a5a8c' };
  if (score >= 60) return { letter: 'C', label: 'Skirmisher', color: '#3f7d5a' };
  return { letter: 'D', label: 'Footnote', color: '#6b5d48' };
}

export function scoreLegion(picks: LegionPick[], battleground: Battleground, ideology: Ideology, seed: number): ScoreResult {
  const base = picks.reduce((total, pick) => total + figurePower(pick.figure, pick.position.key) * pick.position.weight, 0);
  const namedSynergies = detectSynergies(picks);
  const ideologyResult = ideologyEffect(picks, ideology);
  const ideologySynergy: ActiveSynergy = {
    key: ideology.key,
    name: ideology.name,
    kind: 'ideology',
    banner: true,
    pct: ideologyResult.pct,
    note: ideologyResult.note,
  };
  const synergies = [...namedSynergies, ideologySynergy];
  const synergyTotal = synergies.reduce((sum, synergy) => sum + synergy.pct, 0) / 100;
  const bg = battlegroundMultiplier(picks, battleground);
  const noise = ((hashString(String(seed)) % 700) / 100) - 3.5;
  const final = Math.max(0, base * (1 + synergyTotal) * bg + noise);
  const grade = gradeFor(final);

  return {
    base,
    synergyTotal,
    battlegroundMultiplier: bg,
    final,
    synergies,
    ideology: ideologySynergy,
    grade,
    synergyBonus: synergyTotal,
    battlefieldBonus: bg - 1,
    ideologyBonus: ideologyResult.pct / 100,
    breakdown: [
      { label: 'Base Muster', value: Math.round(base) },
      { label: 'Synergy Chronicle', value: Math.round(base * synergyTotal) },
      { label: `Battlefield: ${battleground.name}`, value: Math.round(base * (bg - 1)) },
      { label: `Ideology: ${ideology.name}`, value: ideologyResult.pct },
      { label: `Grade: ${grade.letter} — ${grade.label}`, value: Math.round(final) },
    ],
  };
}
