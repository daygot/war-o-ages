export type RegionKey = 'EASIA' | 'MEDIT' | 'MIDE' | 'AFRIC' | 'AMER' | 'WEUR' | 'EEUR' | 'SASIA';
export type EraKey = 'ANCIENT' | 'CLASSIC' | 'MEDIEV' | 'EARLYM' | 'MODERN' | 'PRESENT';
export type PositionKey = 'commander' | 'strategist' | 'general' | 'troops' | 'allies';
export type StatKey = 'PWR' | 'CMD' | 'GUI' | 'VAL' | 'DIP';
export type SynergyKind = 'buff' | 'risk' | 'penalty' | 'ideology';
export type FigureTier = 'Legendary' | 'Elite' | 'Notable' | 'Historic';

export interface Region {
  key: RegionKey;
  name: string;
  short: string;
  wheel: string;
  ink: string;
  mono: string;
  glyph: string;
}

export interface Era {
  key: EraKey;
  name: string;
  span: string;
  short: string;
}

export interface Position {
  key: PositionKey;
  name: string;
  abbr: string;
  weight: number;
  blurb: string;
  tags: string[];
}

export type FigureStats = Record<StatKey, number>;

export interface Figure {
  id: string;
  name: string;
  region: RegionKey;
  era: EraKey;
  tags: string[];
  power: number;
  civilization: string;
  initials: string;
  stats: FigureStats;
  eligiblePositions: PositionKey[];
  regionInk: string;
  regionName: string;
  eraName: string;
  tier: FigureTier;
}

export interface IdeologyEffect {
  pct: number;
  note: string;
}

export interface Ideology {
  key: string;
  name: string;
  icon: string;
  group: 'Political' | 'Spiritual' | 'Philosophical';
  tenet: string;
  blurb: string;
  favoredTags: string[];
}

export interface Battleground {
  key: string;
  name: string;
  terrain: string;
  buff: string;
  debuff: string;
  favoredTags: string[];
}

export interface SynergyDefinition {
  key: string;
  name: string;
  kind: SynergyKind;
  pct: number;
  note: string;
}

export interface ActiveSynergy extends SynergyDefinition {
  banner?: boolean;
}

export interface LegionPick {
  position: Position;
  figure: Figure;
}

export interface ScoreBreakdownLine {
  label: string;
  value: number;
}

export interface Grade {
  letter: 'S' | 'A' | 'B' | 'C' | 'D';
  label: string;
  color: string;
}

export interface ScoreResult {
  base: number;
  final: number;
  synergies: ActiveSynergy[];
  synergyTotal: number;
  battlegroundMultiplier: number;
  ideology?: ActiveSynergy | null;
  breakdown: ScoreBreakdownLine[];
  grade: Grade;
  /** Compatibility aliases retained for the initial production UI while it migrates. */
  synergyBonus: number;
  battlefieldBonus: number;
  ideologyBonus: number;
}

export interface DailyCampaign {
  seed: number;
  player: LegionPick[];
  enemy: LegionPick[];
  battleground: Battleground;
  ideology: Ideology;
}
