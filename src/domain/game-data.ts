import type { Battleground, Era, Figure, Ideology, Position, Region } from './types';

export const REGIONS = {
  EASIA: { key: 'EASIA', name: 'East Asia', short: 'East Asia', wheel: 'East Asia', ink: '#3f7d5a', mono: 'EA', glyph: '龍' },
  MEDIT: { key: 'MEDIT', name: 'Mediterranean', short: 'Mediterr.', wheel: 'The Med', ink: '#9a6a1f', mono: 'ME', glyph: 'Ω' },
  MIDE: { key: 'MIDE', name: 'Middle East', short: 'Middle East', wheel: 'Middle East', ink: '#2f6f86', mono: 'MD', glyph: '☾' },
  AFRIC: { key: 'AFRIC', name: 'Sub-Saharan Africa', short: 'Africa', wheel: 'Africa', ink: '#b5642a', mono: 'AF', glyph: '⌘' },
  AMER: { key: 'AMER', name: 'The Americas', short: 'Americas', wheel: 'The Americas', ink: '#2d8079', mono: 'AM', glyph: '☉' },
  WEUR: { key: 'WEUR', name: 'Western Europe', short: 'W. Europe', wheel: 'Western Europe', ink: '#3a5a8c', mono: 'WE', glyph: '✠' },
  EEUR: { key: 'EEUR', name: 'Eastern Europe', short: 'E. Europe', wheel: 'Eastern Europe', ink: '#8a3b5a', mono: 'EE', glyph: '☦' },
  SASIA: { key: 'SASIA', name: 'South & SE Asia', short: 'S. Asia', wheel: 'South Asia', ink: '#a8602c', mono: 'SA', glyph: 'ॐ' },
} as const satisfies Record<string, Region>;

export const ERAS = {
  ANCIENT: { key: 'ANCIENT', name: 'Ancient', span: '3000–500 BCE', short: 'Ancient' },
  CLASSIC: { key: 'CLASSIC', name: 'Classical', span: '500 BCE–500 CE', short: 'Classical' },
  MEDIEV: { key: 'MEDIEV', name: 'Medieval', span: '500–1400 CE', short: 'Medieval' },
  EARLYM: { key: 'EARLYM', name: 'Early Modern', span: '1400–1800 CE', short: 'Early Modern' },
  MODERN: { key: 'MODERN', name: 'Modern', span: '1800–1950 CE', short: 'Modern' },
  PRESENT: { key: 'PRESENT', name: 'Present', span: '1950–present', short: 'Present' },
} as const satisfies Record<string, Era>;

export const POSITIONS: Position[] = [
  { key: 'commander', name: 'Commander', abbr: 'CMD', weight: 0.28, blurb: 'Base attack & army morale', tags: ['Emperor', 'Conqueror', 'Warlord'] },
  { key: 'strategist', name: 'Strategist', abbr: 'STR', weight: 0.22, blurb: 'Synergy activation & hidden combos', tags: ['Philosopher', 'Scholar', 'Tactician', 'Advisor'] },
  { key: 'general', name: 'General', abbr: 'GEN', weight: 0.22, blurb: 'Battlefield effectiveness', tags: ['General', 'Admiral', 'Revolutionary'] },
  { key: 'troops', name: 'Troops', abbr: 'TRP', weight: 0.16, blurb: 'Raw fighting force & endurance', tags: ['Warrior Culture', 'Berserker', 'Empire Builder'] },
  { key: 'allies', name: 'Allies', abbr: 'ALY', weight: 0.12, blurb: 'Diplomatic & cross-region buffs', tags: ['Diplomat', 'Coalition Builder', 'Merchant'] },
];

const figure = (id: string, name: string, region: Figure['region'], era: Figure['era'], tags: string[], power: number, civilization: string): Figure => ({
  id,
  name,
  region,
  era,
  tags,
  power,
  civilization,
});

export const ROSTER: Figure[] = [
  figure('genghis-khan', 'Genghis Khan', 'EASIA', 'MEDIEV', ['Conqueror', 'Warlord', 'Coalition Builder'], 96, 'Mongol'),
  figure('julius-caesar', 'Julius Caesar', 'MEDIT', 'CLASSIC', ['Emperor', 'General', 'Tactician'], 95, 'Rome'),
  figure('alexander-the-great', 'Alexander the Great', 'MEDIT', 'CLASSIC', ['Conqueror', 'General', 'Scholar'], 95, 'Greece'),
  figure('napoleon-bonaparte', 'Napoleon Bonaparte', 'WEUR', 'MODERN', ['Emperor', 'General', 'Tactician'], 93, 'France'),
  figure('sun-tzu', 'Sun Tzu', 'EASIA', 'CLASSIC', ['Tactician', 'Scholar'], 92, 'China'),
  figure('zhuge-liang', 'Zhuge Liang', 'EASIA', 'CLASSIC', ['Advisor', 'Scholar', 'Tactician'], 88, 'China'),
  figure('chanakya', 'Chanakya', 'SASIA', 'CLASSIC', ['Advisor', 'Scholar', 'Tactician'], 84, 'India'),
  figure('hannibal-barca', 'Hannibal Barca', 'MEDIT', 'CLASSIC', ['General', 'Tactician'], 90, 'Carthage'),
  figure('yi-sun-sin', 'Yi Sun-sin', 'EASIA', 'EARLYM', ['Admiral', 'General'], 86, 'Korea'),
  figure('khalid-ibn-al-walid', 'Khalid ibn al-Walid', 'MIDE', 'MEDIEV', ['General', 'Conqueror'], 85, 'Arabia'),
  figure('roman-legions', 'Roman Legions', 'MEDIT', 'CLASSIC', ['Warrior Culture', 'Empire Builder'], 90, 'Rome'),
  figure('mongol-horsemen', 'Mongol Horsemen', 'EASIA', 'MEDIEV', ['Berserker', 'Warrior Culture'], 88, 'Mongol'),
  figure('samurai', 'Samurai', 'EASIA', 'MEDIEV', ['Warrior Culture', 'Berserker'], 83, 'Japan'),
  figure('cleopatra-vii', 'Cleopatra VII', 'MEDIT', 'CLASSIC', ['Diplomat', 'Coalition Builder'], 84, 'Egypt'),
  figure('kublai-khan', 'Kublai Khan', 'EASIA', 'MEDIEV', ['Coalition Builder', 'Emperor'], 86, 'Mongol'),
  figure('lorenzo-medici', "Lorenzo de' Medici", 'MEDIT', 'EARLYM', ['Merchant', 'Diplomat'], 71, 'Italy'),
  figure('nelson-mandela', 'Nelson Mandela', 'AFRIC', 'PRESENT', ['Diplomat', 'Coalition Builder'], 88, 'South Africa'),
  figure('simón-bolívar', 'Simón Bolívar', 'AMER', 'MODERN', ['Revolutionary', 'General'], 85, 'Colombia'),
  figure('charlemagne', 'Charlemagne', 'WEUR', 'MEDIEV', ['Emperor', 'Empire Builder'], 88, 'Franks'),
  figure('winged-hussars', 'Winged Hussars', 'EEUR', 'EARLYM', ['Warrior Culture', 'Berserker'], 78, 'Poland'),
];

export const IDEOLOGIES: Ideology[] = [
  { key: 'imperium', name: 'Imperium', tenet: 'Order by crown and column.', favoredTags: ['Emperor', 'Empire Builder'], modifier: 0.1 },
  { key: 'liberation', name: 'Liberation', tenet: 'An army for the unchained.', favoredTags: ['Revolutionary', 'Reformer', 'Diplomat'], modifier: 0.09 },
  { key: 'glory', name: 'Glory', tenet: 'Let the chronicles gild the charge.', favoredTags: ['Conqueror', 'General', 'Warlord'], modifier: 0.08 },
  { key: 'wisdom', name: 'Wisdom', tenet: 'Ink before iron; counsel before conquest.', favoredTags: ['Scholar', 'Advisor', 'Tactician'], modifier: 0.09 },
];

export const BATTLEGROUNDS: Battleground[] = [
  { key: 'steppe', name: 'The Endless Steppe', terrain: 'Endless grass; cavalry rules.', region: 'EASIA', favoredTags: ['Berserker', 'Conqueror'], modifier: 0.08 },
  { key: 'forum', name: 'The Broken Forum', terrain: 'Marble, dust, and public judgment.', region: 'MEDIT', favoredTags: ['Emperor', 'Diplomat'], modifier: 0.07 },
  { key: 'citadel', name: 'The Torchlit Citadel', terrain: 'Stone gates swallow weak assaults.', favoredTags: ['Tactician', 'Empire Builder'], modifier: 0.08 },
  { key: 'delta', name: 'The River Delta', terrain: 'Supply lines decide the day.', favoredTags: ['Merchant', 'Coalition Builder'], modifier: 0.06 },
];
