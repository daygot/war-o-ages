export type RegionKey = 'EASIA' | 'MEDIT' | 'MIDE' | 'AFRIC' | 'AMER' | 'WEUR' | 'EEUR' | 'SASIA';
export type EraKey = 'ANCIENT' | 'CLASSIC' | 'MEDIEV' | 'EARLYM' | 'MODERN' | 'PRESENT';
export type PositionKey = 'commander' | 'strategist' | 'general' | 'troops' | 'allies';

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

export interface Figure {
  id: string;
  name: string;
  region: RegionKey;
  era: EraKey;
  tags: string[];
  power: number;
  civilization: string;
}

export interface Ideology {
  key: string;
  name: string;
  tenet: string;
  favoredTags: string[];
  modifier: number;
}

export interface Battleground {
  key: string;
  name: string;
  terrain: string;
  region?: RegionKey;
  favoredTags: string[];
  modifier: number;
}

export interface LegionPick {
  position: Position;
  figure: Figure;
}

export interface ScoreBreakdownLine {
  label: string;
  value: number;
}

export interface ScoreResult {
  base: number;
  synergyBonus: number;
  battlefieldBonus: number;
  ideologyBonus: number;
  final: number;
  synergies: string[];
  breakdown: ScoreBreakdownLine[];
}

export interface DailyCampaign {
  seed: number;
  player: LegionPick[];
  enemy: LegionPick[];
  battleground: Battleground;
  ideology: Ideology;
}
