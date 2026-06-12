import type { Battleground, Era, Figure, FigureStats, Ideology, Position, PositionKey, Region, StatKey, SynergyDefinition } from './types';

function hashString(value: string): number {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function initialsForName(name: string): string {
  const stopWords = new Set(['of', 'the', 'ibn', 'al', "de'", 'de']);
  const parts = name.split(/[\s-]+/).filter((part) => part && !stopWords.has(part.toLowerCase()));
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0]?.[0] ?? ''}${parts.at(-1)?.[0] ?? ''}`.toUpperCase();
}

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

export const STAT_KEYS: StatKey[] = ['PWR', 'CMD', 'GUI', 'VAL', 'DIP'];
export const STAT_LABELS: Record<StatKey, string> = { PWR: 'Power', CMD: 'Command', GUI: 'Guile', VAL: 'Valor', DIP: 'Diplomacy' };

export const TAG_STATS: Record<string, Partial<FigureStats>> = {
  Conqueror: { PWR: 10, CMD: 6, VAL: 5 },
  Warlord: { PWR: 12, VAL: 8, DIP: -4 },
  Emperor: { CMD: 12, DIP: 6, GUI: 3 },
  Berserker: { PWR: 8, VAL: 12, GUI: -6 },
  'Warrior Culture': { VAL: 11, PWR: 6 },
  'Empire Builder': { CMD: 8, DIP: 5 },
  General: { PWR: 6, CMD: 8, GUI: 5 },
  Admiral: { GUI: 6, CMD: 5, VAL: 4 },
  Tactician: { GUI: 13, PWR: 2 },
  Scholar: { GUI: 10, DIP: 4 },
  Philosopher: { GUI: 8, DIP: 10, PWR: -6 },
  Advisor: { GUI: 11, DIP: 5 },
  Diplomat: { DIP: 14, GUI: 4, PWR: -4 },
  'Coalition Builder': { DIP: 12, CMD: 4 },
  Merchant: { DIP: 10, GUI: 5 },
  Prophet: { DIP: 12, CMD: 6 },
  Reformer: { DIP: 9, GUI: 6 },
  Radical: { DIP: 8, PWR: 4, CMD: -4 },
  Revolutionary: { PWR: 6, VAL: 7, DIP: 4 },
  Mercenary: { PWR: 5, VAL: 5, DIP: -6 },
};

function clamp(value: number, low: number, high: number): number {
  return Math.max(low, Math.min(high, value));
}

function computeStats(figure: RawFigure): FigureStats {
  return Object.fromEntries(STAT_KEYS.map((key) => {
    let value = figure.power * 0.66 + 16;
    for (const tag of figure.tags) value += TAG_STATS[tag]?.[key] ?? 0;
    const jitter = (hashString(figure.name + key) % 9) - 4;
    return [key, clamp(Math.round(value + jitter), 34, 99)];
  })) as FigureStats;
}

function eligiblePositions(figure: Pick<Figure, 'tags'>): PositionKey[] {
  return POSITIONS.filter((position) => position.tags.some((tag) => figure.tags.includes(tag))).map((position) => position.key);
}

function tierFor(power: number): Figure['tier'] {
  if (power >= 88) return 'Legendary';
  if (power >= 78) return 'Elite';
  if (power >= 62) return 'Notable';
  return 'Historic';
}

interface RawFigure {
  id: string;
  name: string;
  region: Figure['region'];
  era: Figure['era'];
  tags: string[];
  power: number;
  civilization: string;
}

const rawFigure = (id: string, name: string, region: Figure['region'], era: Figure['era'], tags: string[], power: number, civilization: string): RawFigure => ({
  id,
  name,
  region,
  era,
  tags,
  power,
  civilization,
});

const ROSTER_RAW: RawFigure[] = [
  rawFigure("genghis-khan", "Genghis Khan", 'EASIA', 'MEDIEV', ["Conqueror", "Warlord", "Coalition Builder"], 96, "Mongol"),
  rawFigure("julius-caesar", "Julius Caesar", 'MEDIT', 'CLASSIC', ["Emperor", "General", "Tactician"], 95, "Rome"),
  rawFigure("alexander-the-great", "Alexander the Great", 'MEDIT', 'CLASSIC', ["Conqueror", "General", "Scholar"], 95, "Greece"),
  rawFigure("napoleon-bonaparte", "Napoleon Bonaparte", 'WEUR', 'MODERN', ["Emperor", "General", "Tactician"], 93, "France"),
  rawFigure("qin-shi-huang", "Qin Shi Huang", 'EASIA', 'CLASSIC', ["Emperor", "Conqueror"], 88, "China"),
  rawFigure("cyrus-the-great", "Cyrus the Great", 'MIDE', 'CLASSIC', ["Emperor", "Diplomat"], 86, "Persia"),
  rawFigure("attila-the-hun", "Attila the Hun", 'EEUR', 'CLASSIC', ["Warlord", "Berserker"], 84, "Huns"),
  rawFigure("shaka-zulu", "Shaka Zulu", 'AFRIC', 'MODERN', ["Conqueror", "Warlord"], 82, "Zulu"),
  rawFigure("chandragupta-maurya", "Chandragupta Maurya", 'SASIA', 'CLASSIC', ["Emperor", "General"], 80, "India"),
  rawFigure("mansa-musa", "Mansa Musa", 'AFRIC', 'MEDIEV', ["Emperor", "Diplomat"], 78, "Mali"),
  rawFigure("montezuma-ii", "Montezuma II", 'AMER', 'EARLYM', ["Emperor", "Warlord"], 70, "Aztec"),
  rawFigure("harald-hardrada", "Harald Hardrada", 'WEUR', 'MEDIEV', ["Warlord", "Berserker"], 74, "Norse"),
  rawFigure("timur", "Timur", 'MIDE', 'MEDIEV', ["Conqueror", "Warlord"], 85, "Timurid"),
  rawFigure("pachacuti", "Pachacuti", 'AMER', 'MEDIEV', ["Emperor", "Empire Builder"], 76, "Inca"),
  rawFigure("sun-tzu", "Sun Tzu", 'EASIA', 'CLASSIC', ["Tactician", "Scholar"], 92, "China"),
  rawFigure("zhuge-liang", "Zhuge Liang", 'EASIA', 'CLASSIC', ["Advisor", "Scholar", "Tactician"], 88, "China"),
  rawFigure("aristotle", "Aristotle", 'MEDIT', 'CLASSIC', ["Philosopher", "Scholar"], 90, "Greece"),
  rawFigure("chanakya", "Chanakya", 'SASIA', 'CLASSIC', ["Advisor", "Scholar", "Tactician"], 84, "India"),
  rawFigure("machiavelli", "Machiavelli", 'MEDIT', 'EARLYM', ["Advisor", "Scholar"], 82, "Italy"),
  rawFigure("sun-bin", "Sun Bin", 'EASIA', 'CLASSIC', ["Tactician", "Scholar"], 76, "China"),
  rawFigure("belisarius", "Belisarius", 'EEUR', 'MEDIEV', ["Tactician", "General"], 80, "Byzantine"),
  rawFigure("sima-yi", "Sima Yi", 'EASIA', 'CLASSIC', ["Advisor", "Tactician"], 78, "China"),
  rawFigure("ibn-khaldun", "Ibn Khaldun", 'MIDE', 'MEDIEV', ["Scholar", "Philosopher"], 79, "Arabia"),
  rawFigure("frederick-the-great", "Frederick the Great", 'EEUR', 'EARLYM', ["Tactician", "Emperor"], 83, "Prussia"),
  rawFigure("cao-cao", "Cao Cao", 'EASIA', 'CLASSIC', ["Tactician", "General", "Warlord"], 81, "China"),
  rawFigure("thucydides", "Thucydides", 'MEDIT', 'CLASSIC', ["Scholar", "Advisor"], 72, "Greece"),
  rawFigure("hannibal-barca", "Hannibal Barca", 'MEDIT', 'CLASSIC', ["General", "Tactician"], 90, "Carthage"),
  rawFigure("yi-sun-sin", "Yi Sun-sin", 'EASIA', 'EARLYM', ["Admiral", "General"], 86, "Korea"),
  rawFigure("khalid-ibn-al-walid", "Khalid ibn al-Walid", 'MIDE', 'MEDIEV', ["General", "Conqueror"], 85, "Arabia"),
  rawFigure("subotai", "Subotai", 'EASIA', 'MEDIEV', ["General", "Tactician"], 84, "Mongol"),
  rawFigure("duke-of-wellington", "Duke of Wellington", 'WEUR', 'MODERN', ["General"], 80, "Britain"),
  rawFigure("georgy-zhukov", "Georgy Zhukov", 'EEUR', 'MODERN', ["General", "Tactician"], 83, "Rus"),
  rawFigure("vo-nguyen-giap", "Vo Nguyen Giap", 'SASIA', 'MODERN', ["General", "Revolutionary"], 78, "Vietnam"),
  rawFigure("scipio-africanus", "Scipio Africanus", 'MEDIT', 'CLASSIC', ["General", "Tactician"], 82, "Rome"),
  rawFigure("erwin-rommel", "Erwin Rommel", 'WEUR', 'MODERN', ["General", "Tactician"], 79, "Germany"),
  rawFigure("saladin", "Saladin", 'MIDE', 'MEDIEV', ["General", "Emperor", "Diplomat"], 86, "Arabia"),
  rawFigure("toyotomi-hideyoshi", "Toyotomi Hideyoshi", 'EASIA', 'EARLYM', ["Conqueror", "General"], 79, "Japan"),
  rawFigure("ulysses-s-grant", "Ulysses S. Grant", 'AMER', 'MODERN', ["General", "Emperor"], 76, "USA"),
  rawFigure("spartan-warriors", "Spartan Warriors", 'MEDIT', 'CLASSIC', ["Berserker", "Warrior Culture"], 84, "Greece"),
  rawFigure("mongol-horsemen", "Mongol Horsemen", 'EASIA', 'MEDIEV', ["Berserker", "Warrior Culture"], 88, "Mongol"),
  rawFigure("roman-legions", "Roman Legions", 'MEDIT', 'CLASSIC', ["Warrior Culture", "Empire Builder"], 90, "Rome"),
  rawFigure("viking-raiders", "Viking Raiders", 'WEUR', 'MEDIEV', ["Berserker", "Warrior Culture"], 82, "Norse"),
  rawFigure("janissaries", "Janissaries", 'MIDE', 'EARLYM', ["Warrior Culture", "Empire Builder"], 80, "Ottoman"),
  rawFigure("samurai", "Samurai", 'EASIA', 'MEDIEV', ["Warrior Culture", "Berserker"], 83, "Japan"),
  rawFigure("zulu-impis", "Zulu Impis", 'AFRIC', 'MODERN', ["Warrior Culture", "Berserker"], 78, "Zulu"),
  rawFigure("jaguar-warriors", "Jaguar Warriors", 'AMER', 'EARLYM', ["Warrior Culture", "Berserker"], 75, "Aztec"),
  rawFigure("swiss-pikemen", "Swiss Pikemen", 'WEUR', 'EARLYM', ["Warrior Culture", "Mercenary"], 74, "Swiss"),
  rawFigure("gurkhas", "Gurkhas", 'SASIA', 'MODERN', ["Warrior Culture", "Berserker"], 76, "Nepal"),
  rawFigure("mamluk-cavalry", "Mamluk Cavalry", 'MIDE', 'MEDIEV', ["Warrior Culture", "Empire Builder"], 79, "Egypt"),
  rawFigure("persian-immortals", "Persian Immortals", 'MIDE', 'ANCIENT', ["Warrior Culture", "Empire Builder"], 81, "Persia"),
  rawFigure("cleopatra-vii", "Cleopatra VII", 'MEDIT', 'CLASSIC', ["Diplomat", "Coalition Builder"], 84, "Egypt"),
  rawFigure("kublai-khan", "Kublai Khan", 'EASIA', 'MEDIEV', ["Coalition Builder", "Emperor"], 86, "Mongol"),
  rawFigure("henry-the-navigator", "Henry the Navigator", 'WEUR', 'EARLYM', ["Coalition Builder", "Merchant"], 72, "Iberia"),
  rawFigure("otto-von-bismarck", "Otto von Bismarck", 'WEUR', 'MODERN', ["Diplomat", "Coalition Builder"], 82, "Germany"),
  rawFigure("zheng-he", "Zheng He", 'EASIA', 'EARLYM', ["Diplomat", "Merchant", "Admiral"], 80, "China"),
  rawFigure("marco-polo", "Marco Polo", 'MEDIT', 'MEDIEV', ["Merchant", "Diplomat"], 70, "Venice"),
  rawFigure("mehmed-ii", "Mehmed II", 'MIDE', 'EARLYM', ["Coalition Builder", "Conqueror"], 84, "Ottoman"),
  rawFigure("lorenzo-de-medici", "Lorenzo de' Medici", 'MEDIT', 'EARLYM', ["Merchant", "Diplomat"], 71, "Italy"),
  rawFigure("nzinga-of-ndongo", "Nzinga of Ndongo", 'AFRIC', 'EARLYM', ["Diplomat", "Coalition Builder"], 76, "Ndongo"),
  rawFigure("tokugawa-ieyasu", "Tokugawa Ieyasu", 'EASIA', 'EARLYM', ["Coalition Builder", "General"], 81, "Japan"),
  rawFigure("confucius", "Confucius", 'EASIA', 'CLASSIC', ["Philosopher", "Reformer"], 88, "China"),
  rawFigure("karl-marx", "Karl Marx", 'WEUR', 'MODERN', ["Philosopher", "Radical"], 85, "Germany"),
  rawFigure("mahatma-gandhi", "Mahatma Gandhi", 'SASIA', 'MODERN', ["Diplomat", "Reformer"], 86, "India"),
  rawFigure("plato", "Plato", 'MEDIT', 'CLASSIC', ["Philosopher", "Scholar"], 87, "Greece"),
  rawFigure("thomas-jefferson", "Thomas Jefferson", 'AMER', 'EARLYM', ["Diplomat", "Reformer"], 78, "USA"),
  rawFigure("mao-zedong", "Mao Zedong", 'EASIA', 'MODERN', ["Warlord", "Radical"], 80, "China"),
  rawFigure("vladimir-lenin", "Vladimir Lenin", 'EEUR', 'MODERN', ["Advisor", "Reformer"], 81, "Rus"),
  rawFigure("joan-of-arc", "Joan of Arc", 'WEUR', 'MEDIEV', ["General", "Prophet"], 79, "France"),
  rawFigure("robespierre", "Robespierre", 'WEUR', 'EARLYM', ["Advisor", "Radical"], 70, "France"),
  rawFigure("buddha", "Buddha", 'SASIA', 'CLASSIC', ["Philosopher", "Prophet"], 84, "India"),
  rawFigure("rousseau", "Rousseau", 'WEUR', 'EARLYM', ["Philosopher", "Reformer"], 74, "France"),
  rawFigure("che-guevara", "Che Guevara", 'AMER', 'MODERN', ["Revolutionary", "Radical"], 75, "Cuba"),
  rawFigure("nelson-mandela", "Nelson Mandela", 'AFRIC', 'PRESENT', ["Diplomat", "Coalition Builder"], 88, "South Africa"),
  rawFigure("deng-xiaoping", "Deng Xiaoping", 'EASIA', 'PRESENT', ["Advisor", "Reformer"], 83, "China"),
  rawFigure("lee-kuan-yew", "Lee Kuan Yew", 'SASIA', 'PRESENT', ["Emperor", "Advisor"], 82, "Singapore"),
  rawFigure("henry-kissinger", "Henry Kissinger", 'WEUR', 'PRESENT', ["Advisor", "Diplomat"], 80, "USA"),
  rawFigure("ho-chi-minh", "Ho Chi Minh", 'SASIA', 'PRESENT', ["Revolutionary", "Warlord"], 80, "Vietnam"),
  rawFigure("xi-jinping", "Xi Jinping", 'EASIA', 'PRESENT', ["Emperor", "Conqueror"], 80, "China"),
  rawFigure("barack-obama", "Barack Obama", 'AMER', 'PRESENT', ["Diplomat", "Coalition Builder"], 78, "USA"),
  rawFigure("angela-merkel", "Angela Merkel", 'WEUR', 'PRESENT', ["Diplomat", "Coalition Builder"], 79, "Germany"),
  rawFigure("vladimir-putin", "Vladimir Putin", 'EEUR', 'PRESENT', ["Warlord", "Emperor"], 78, "Rus"),
  rawFigure("fidel-castro", "Fidel Castro", 'AMER', 'PRESENT', ["Revolutionary", "Warlord"], 74, "Cuba"),
  rawFigure("mikhail-gorbachev", "Mikhail Gorbachev", 'EEUR', 'PRESENT', ["Diplomat", "Reformer"], 75, "Rus"),
  rawFigure("moshe-dayan", "Moshe Dayan", 'MIDE', 'PRESENT', ["General", "Tactician"], 79, "Israel"),
  rawFigure("patrice-lumumba", "Patrice Lumumba", 'AFRIC', 'PRESENT', ["Diplomat", "Revolutionary"], 72, "Congo"),
  rawFigure("kofi-annan", "Kofi Annan", 'AFRIC', 'PRESENT', ["Diplomat", "Coalition Builder"], 76, "Ghana"),
  rawFigure("idf-paratroopers", "IDF Paratroopers", 'MIDE', 'PRESENT', ["Warrior Culture", "Tactician"], 76, "Israel"),
  rawFigure("viet-cong", "Viet Cong", 'SASIA', 'PRESENT', ["Warrior Culture", "Berserker"], 73, "Vietnam"),
  rawFigure("green-berets", "Green Berets", 'AMER', 'PRESENT', ["Warrior Culture", "Tactician"], 74, "USA"),
  rawFigure("sargon-of-akkad", "Sargon of Akkad", 'MIDE', 'ANCIENT', ["Conqueror", "Empire Builder"], 82, "Akkad"),
  rawFigure("hammurabi", "Hammurabi", 'MIDE', 'ANCIENT', ["Emperor", "Advisor"], 78, "Babylon"),
  rawFigure("ramesses-ii", "Ramesses II", 'MIDE', 'ANCIENT', ["Emperor", "General"], 84, "Egypt"),
  rawFigure("hatshepsut", "Hatshepsut", 'MIDE', 'ANCIENT', ["Emperor", "Merchant", "Diplomat"], 76, "Egypt"),
  rawFigure("nebuchadnezzar-ii", "Nebuchadnezzar II", 'MIDE', 'ANCIENT', ["Emperor", "Empire Builder"], 79, "Babylon"),
  rawFigure("assyrian-siege-corps", "Assyrian Siege Corps", 'MIDE', 'ANCIENT', ["Warrior Culture", "Empire Builder"], 77, "Assyria"),
  rawFigure("phoenician-merchants", "Phoenician Merchants", 'MEDIT', 'ANCIENT', ["Merchant", "Diplomat"], 72, "Phoenicia"),
  rawFigure("mycenaean-spearmen", "Mycenaean Spearmen", 'MEDIT', 'ANCIENT', ["Warrior Culture", "Berserker"], 70, "Mycenae"),
  rawFigure("fu-hao", "Fu Hao", 'EASIA', 'ANCIENT', ["General", "Prophet"], 74, "China"),
  rawFigure("duke-of-zhou", "Duke of Zhou", 'EASIA', 'ANCIENT', ["Advisor", "Scholar"], 77, "China"),
  rawFigure("shang-bronze-warriors", "Shang Bronze Warriors", 'EASIA', 'ANCIENT', ["Warrior Culture", "Empire Builder"], 71, "China"),
  rawFigure("vedic-rishis", "Vedic Rishis", 'SASIA', 'ANCIENT', ["Philosopher", "Scholar"], 73, "India"),
  rawFigure("indus-merchants", "Indus Merchants", 'SASIA', 'ANCIENT', ["Merchant", "Diplomat"], 69, "India"),
  rawFigure("piye-of-kush", "Piye of Kush", 'AFRIC', 'ANCIENT', ["Conqueror", "Emperor"], 75, "Kush"),
  rawFigure("kushite-archers", "Kushite Archers", 'AFRIC', 'ANCIENT', ["Warrior Culture", "Berserker"], 72, "Kush"),
  rawFigure("queen-of-sheba", "Queen of Sheba", 'AFRIC', 'ANCIENT', ["Diplomat", "Merchant"], 74, "Sheba"),
  rawFigure("olmec-priest-kings", "Olmec Priest-Kings", 'AMER', 'ANCIENT', ["Emperor", "Prophet"], 68, "Olmec"),
  rawFigure("chavin-oracle", "Chavín Oracle", 'AMER', 'ANCIENT', ["Advisor", "Prophet"], 67, "Chavin"),
  rawFigure("celtic-war-bands", "Celtic War Bands", 'WEUR', 'ANCIENT', ["Warrior Culture", "Berserker"], 71, "Celts"),
  rawFigure("druid-conclave", "Druid Conclave", 'WEUR', 'ANCIENT', ["Advisor", "Prophet"], 69, "Celts"),
  rawFigure("scythian-horse-archers", "Scythian Horse Archers", 'EEUR', 'ANCIENT', ["Warrior Culture", "Berserker"], 76, "Scythia"),
  rawFigure("tomyris", "Tomyris", 'EEUR', 'ANCIENT', ["Warlord", "General"], 75, "Scythia"),
  rawFigure("ashoka", "Ashoka", 'SASIA', 'CLASSIC', ["Emperor", "Reformer"], 85, "India"),
  rawFigure("darius-i", "Darius I", 'MIDE', 'CLASSIC', ["Emperor", "Empire Builder"], 83, "Persia"),
  rawFigure("zenobia", "Zenobia", 'MIDE', 'CLASSIC', ["Warlord", "Diplomat"], 77, "Palmyra"),
  rawFigure("king-ezana", "King Ezana", 'AFRIC', 'CLASSIC', ["Emperor", "Reformer"], 72, "Aksum"),
  rawFigure("aksumite-spearmen", "Aksumite Spearmen", 'AFRIC', 'CLASSIC', ["Warrior Culture", "Empire Builder"], 70, "Aksum"),
  rawFigure("maya-astronomer-priests", "Maya Astronomer-Priests", 'AMER', 'CLASSIC', ["Scholar", "Advisor"], 71, "Maya"),
  rawFigure("teotihuacan-spearthrowers", "Teotihuacan Spearthrowers", 'AMER', 'CLASSIC', ["Warrior Culture", "Berserker"], 70, "Teotihuacan"),
  rawFigure("vercingetorix", "Vercingetorix", 'WEUR', 'CLASSIC', ["Warlord", "Revolutionary"], 76, "Gaul"),
  rawFigure("boudica", "Boudica", 'WEUR', 'CLASSIC', ["Warlord", "Revolutionary"], 75, "Britain"),
  rawFigure("arminius", "Arminius", 'WEUR', 'CLASSIC', ["General", "Tactician"], 78, "Germania"),
  rawFigure("decebalus", "Decebalus", 'EEUR', 'CLASSIC', ["Warlord", "General"], 73, "Dacia"),
  rawFigure("sarmatian-cataphracts", "Sarmatian Cataphracts", 'EEUR', 'CLASSIC', ["Warrior Culture", "Empire Builder"], 72, "Scythia"),
  rawFigure("charlemagne", "Charlemagne", 'WEUR', 'MEDIEV', ["Emperor", "Empire Builder"], 88, "Franks"),
  rawFigure("william-the-conqueror", "William the Conqueror", 'WEUR', 'MEDIEV', ["Conqueror", "General"], 83, "Normandy"),
  rawFigure("el-cid", "El Cid", 'WEUR', 'MEDIEV', ["General", "Warlord"], 79, "Iberia"),
  rawFigure("eleanor-of-aquitaine", "Eleanor of Aquitaine", 'WEUR', 'MEDIEV', ["Diplomat", "Advisor"], 76, "France"),
  rawFigure("enrico-dandolo", "Enrico Dandolo", 'MEDIT', 'MEDIEV', ["Coalition Builder", "Admiral"], 74, "Venice"),
  rawFigure("knights-hospitaller", "Knights Hospitaller", 'MEDIT', 'MEDIEV', ["Warrior Culture", "Empire Builder"], 73, "Crusaders"),
  rawFigure("rajendra-chola", "Rajendra Chola", 'SASIA', 'MEDIEV', ["Emperor", "Admiral"], 80, "Chola"),
  rawFigure("rajput-cavalry", "Rajput Cavalry", 'SASIA', 'MEDIEV', ["Warrior Culture", "Berserker"], 74, "India"),
  rawFigure("alexander-nevsky", "Alexander Nevsky", 'EEUR', 'MEDIEV', ["General", "Diplomat"], 78, "Rus"),
  rawFigure("jan-zizka", "Jan Žižka", 'EEUR', 'MEDIEV', ["General", "Tactician"], 79, "Bohemia"),
  rawFigure("varangian-guard", "Varangian Guard", 'EEUR', 'MEDIEV', ["Warrior Culture", "Berserker"], 75, "Byzantine"),
  rawFigure("sundiata-keita", "Sundiata Keita", 'AFRIC', 'MEDIEV', ["Conqueror", "Empire Builder"], 79, "Mali"),
  rawFigure("great-zimbabwe-traders", "Great Zimbabwe Traders", 'AFRIC', 'MEDIEV', ["Merchant", "Diplomat"], 68, "Zimbabwe"),
  rawFigure("toltec-warriors", "Toltec Warriors", 'AMER', 'MEDIEV', ["Warrior Culture", "Berserker"], 69, "Toltec"),
  rawFigure("minamoto-no-yoshitsune", "Minamoto no Yoshitsune", 'EASIA', 'MEDIEV', ["General", "Tactician"], 80, "Japan"),
  rawFigure("wu-zetian", "Wu Zetian", 'EASIA', 'MEDIEV', ["Emperor", "Advisor"], 81, "China"),
  rawFigure("akbar-the-great", "Akbar the Great", 'SASIA', 'EARLYM', ["Emperor", "Diplomat"], 86, "Mughal"),
  rawFigure("shivaji", "Shivaji", 'SASIA', 'EARLYM', ["General", "Tactician"], 80, "Maratha"),
  rawFigure("mughal-war-elephants", "Mughal War Elephants", 'SASIA', 'EARLYM', ["Warrior Culture", "Empire Builder"], 73, "Mughal"),
  rawFigure("tipu-sultan", "Tipu Sultan", 'SASIA', 'EARLYM', ["Warlord", "General"], 75, "Mysore"),
  rawFigure("suleiman-the-magnificent", "Suleiman the Magnificent", 'MIDE', 'EARLYM', ["Emperor", "Diplomat"], 87, "Ottoman"),
  rawFigure("elizabeth-i", "Elizabeth I", 'WEUR', 'EARLYM', ["Emperor", "Diplomat"], 82, "Britain"),
  rawFigure("hernan-cortes", "Hernán Cortés", 'WEUR', 'EARLYM', ["Conqueror", "General"], 76, "Spain"),
  rawFigure("oliver-cromwell", "Oliver Cromwell", 'WEUR', 'EARLYM', ["General", "Radical"], 77, "Britain"),
  rawFigure("spanish-tercios", "Spanish Tercios", 'WEUR', 'EARLYM', ["Warrior Culture", "Empire Builder"], 76, "Spain"),
  rawFigure("george-washington", "George Washington", 'AMER', 'EARLYM', ["General", "Coalition Builder"], 83, "USA"),
  rawFigure("atahualpa", "Atahualpa", 'AMER', 'EARLYM', ["Emperor", "Warlord"], 71, "Inca"),
  rawFigure("tupac-amaru-ii", "Túpac Amaru II", 'AMER', 'EARLYM', ["Revolutionary", "Radical"], 70, "Inca"),
  rawFigure("andrea-doria", "Andrea Doria", 'MEDIT', 'EARLYM', ["Admiral", "Tactician"], 75, "Genoa"),
  rawFigure("askia-the-great", "Askia the Great", 'AFRIC', 'EARLYM', ["Emperor", "Scholar"], 77, "Songhai"),
  rawFigure("songhai-cavalry", "Songhai Cavalry", 'AFRIC', 'EARLYM', ["Warrior Culture", "Empire Builder"], 71, "Songhai"),
  rawFigure("ivan-the-terrible", "Ivan the Terrible", 'EEUR', 'EARLYM', ["Emperor", "Warlord"], 78, "Rus"),
  rawFigure("peter-the-great", "Peter the Great", 'EEUR', 'EARLYM', ["Emperor", "Reformer"], 84, "Rus"),
  rawFigure("catherine-the-great", "Catherine the Great", 'EEUR', 'EARLYM', ["Emperor", "Diplomat"], 83, "Rus"),
  rawFigure("winged-hussars", "Winged Hussars", 'EEUR', 'EARLYM', ["Warrior Culture", "Berserker"], 78, "Poland"),
  rawFigure("jan-sobieski", "Jan Sobieski", 'EEUR', 'EARLYM', ["General", "Coalition Builder"], 79, "Poland"),
  rawFigure("miyamoto-musashi", "Miyamoto Musashi", 'EASIA', 'EARLYM', ["Berserker", "Scholar"], 76, "Japan"),
  rawFigure("kangxi-emperor", "Kangxi Emperor", 'EASIA', 'EARLYM', ["Emperor", "Scholar"], 84, "China"),
  rawFigure("giuseppe-garibaldi", "Giuseppe Garibaldi", 'MEDIT', 'MODERN', ["Revolutionary", "General"], 81, "Italy"),
  rawFigure("camillo-cavour", "Camillo Cavour", 'MEDIT', 'MODERN', ["Advisor", "Diplomat"], 76, "Italy"),
  rawFigure("simon-bolivar", "Simón Bolívar", 'AMER', 'MODERN', ["Revolutionary", "General"], 85, "Colombia"),
  rawFigure("andrew-jackson", "Andrew Jackson", 'AMER', 'MODERN', ["General", "Warlord"], 82, "USA"),
  rawFigure("abraham-lincoln", "Abraham Lincoln", 'AMER', 'MODERN', ["Diplomat", "Reformer"], 84, "USA"),
  rawFigure("sitting-bull", "Sitting Bull", 'AMER', 'MODERN', ["Warlord", "Prophet"], 76, "Lakota"),
  rawFigure("comanche-riders", "Comanche Riders", 'AMER', 'MODERN', ["Warrior Culture", "Berserker"], 72, "Comanche"),
  rawFigure("horatio-nelson", "Horatio Nelson", 'WEUR', 'MODERN', ["Admiral", "Tactician"], 84, "Britain"),
  rawFigure("winston-churchill", "Winston Churchill", 'WEUR', 'MODERN', ["Coalition Builder", "Advisor"], 85, "Britain"),
  rawFigure("mustafa-kemal-ataturk", "Mustafa Kemal Atatürk", 'MIDE', 'MODERN', ["General", "Reformer"], 84, "Turkey"),
  rawFigure("muhammad-ali-pasha", "Muhammad Ali Pasha", 'MIDE', 'MODERN', ["Emperor", "Reformer"], 75, "Egypt"),
  rawFigure("menelik-ii", "Menelik II", 'AFRIC', 'MODERN', ["Emperor", "General"], 79, "Ethiopia"),
  rawFigure("samori-toure", "Samori Touré", 'AFRIC', 'MODERN', ["Warlord", "Revolutionary"], 74, "Mali"),
  rawFigure("mikhail-kutuzov", "Mikhail Kutuzov", 'EEUR', 'MODERN', ["General", "Tactician"], 80, "Rus"),
  rawFigure("cossack-host", "Cossack Host", 'EEUR', 'MODERN', ["Warrior Culture", "Berserker"], 73, "Rus"),
  rawFigure("meiji-emperor", "Meiji Emperor", 'EASIA', 'MODERN', ["Emperor", "Reformer"], 82, "Japan"),
  rawFigure("togo-heihachiro", "Tōgō Heihachirō", 'EASIA', 'MODERN', ["Admiral", "Tactician"], 80, "Japan"),
  rawFigure("empress-dowager-cixi", "Empress Dowager Cixi", 'EASIA', 'MODERN', ["Advisor", "Diplomat"], 72, "China"),
  rawFigure("rani-lakshmibai", "Rani Lakshmibai", 'SASIA', 'MODERN', ["Revolutionary", "General"], 75, "India"),
  rawFigure("sikh-khalsa", "Sikh Khalsa", 'SASIA', 'MODERN', ["Warrior Culture", "Berserker"], 74, "Punjab"),
  rawFigure("charles-de-gaulle", "Charles de Gaulle", 'WEUR', 'PRESENT', ["General", "Coalition Builder"], 81, "France"),
  rawFigure("margaret-thatcher", "Margaret Thatcher", 'WEUR', 'PRESENT', ["Reformer", "Diplomat"], 77, "Britain"),
  rawFigure("sas-commandos", "SAS Commandos", 'WEUR', 'PRESENT', ["Warrior Culture", "Tactician"], 75, "Britain"),
  rawFigure("aristotle-onassis", "Aristotle Onassis", 'MEDIT', 'PRESENT', ["Merchant", "Coalition Builder"], 70, "Greece"),
  rawFigure("italian-alpini", "Italian Alpini", 'MEDIT', 'PRESENT', ["Warrior Culture", "Tactician"], 71, "Italy"),
  rawFigure("golda-meir", "Golda Meir", 'MIDE', 'PRESENT', ["Advisor", "Diplomat"], 77, "Israel"),
  rawFigure("anwar-sadat", "Anwar Sadat", 'MIDE', 'PRESENT', ["Diplomat", "Reformer"], 76, "Egypt"),
  rawFigure("haile-selassie", "Haile Selassie", 'AFRIC', 'PRESENT', ["Emperor", "Diplomat"], 76, "Ethiopia"),
  rawFigure("josip-broz-tito", "Josip Broz Tito", 'EEUR', 'PRESENT', ["Warlord", "Coalition Builder"], 78, "Yugoslavia"),
  rawFigure("lech-waesa", "Lech Wałęsa", 'EEUR', 'PRESENT', ["Revolutionary", "Reformer"], 73, "Poland"),
  rawFigure("people-s-liberation-army", "People's Liberation Army", 'EASIA', 'PRESENT', ["Warrior Culture", "Empire Builder"], 75, "China"),
  rawFigure("indira-gandhi", "Indira Gandhi", 'SASIA', 'PRESENT', ["Emperor", "Advisor"], 76, "India"),
];

export const ROSTER: Figure[] = ROSTER_RAW.map((figure) => {
  const stats = computeStats(figure);
  return {
    ...figure,
    initials: initialsForName(figure.name),
    stats,
    eligiblePositions: eligiblePositions(figure),
    regionInk: REGIONS[figure.region].ink,
    regionName: REGIONS[figure.region].name,
    eraName: ERAS[figure.era].name,
    tier: tierFor(figure.power),
  };
});

export const BATTLEGROUNDS: Battleground[] = [
  { key: 'steppe', name: 'Steppe Plains', terrain: 'Endless grass; cavalry rules.', buff: 'Cavalry cultures +20%', debuff: 'Heavy infantry −10%', favoredTags: ['Mongol', 'Persia', 'Egypt', 'Huns', 'Scythia', 'Comanche'] },
  { key: 'jungle', name: 'Dense Jungle', terrain: 'Choked canopy; ambush country.', buff: 'Aztec / Zulu / SE-Asian +15%', debuff: 'European armies −10%', favoredTags: ['Aztec', 'Zulu', 'Vietnam', 'Nepal', 'Inca'] },
  { key: 'mountain', name: 'Mountain Pass', terrain: 'Narrow defiles favour the dug-in.', buff: 'All defenders +15%', debuff: 'Conquerors −5%', favoredTags: ['Defenders'] },
  { key: 'coast', name: 'Coastal Siege', terrain: 'Salt wind and siege towers.', buff: 'Admirals on team +20%', debuff: 'Landlocked civ −10%', favoredTags: ['Admiral'] },
  { key: 'desert', name: 'Desert Campaign', terrain: 'Sun-scorched dunes, no water.', buff: 'Arab / Persian / Egyptian +15%', debuff: 'Norse / Russian −12%', favoredTags: ['Arabia', 'Persia', 'Egypt', 'Ottoman', 'Mali', 'Songhai'] },
  { key: 'walls', name: 'City Walls', terrain: 'Stone ramparts and boiling oil.', buff: 'Siege empires +15%', debuff: 'Nomadic cultures −10%', favoredTags: ['Rome', 'Ottoman', 'Byzantine', 'China'] },
];

export const SYNERGY_DEFS: SynergyDefinition[] = [
  { key: 'dragon-court', name: 'Dragon Court', kind: 'buff', pct: 12, note: 'Two or more East Asian figures' },
  { key: 'sons-of-rome', name: 'Sons of Rome', kind: 'buff', pct: 20, note: 'Caesar marches with the Legions' },
  { key: 'steppe-riders', name: 'Steppe Riders', kind: 'buff', pct: 30, note: 'Genghis rides with Mongol Horsemen' },
  { key: 'viking-brotherhood', name: 'Viking Brotherhood', kind: 'buff', pct: 15, note: 'Two or more Norse figures' },
  { key: 'philosopher-kings', name: 'Philosopher Kings', kind: 'buff', pct: 18, note: 'Aristotle and Plato confer' },
  { key: 'silk-road-pact', name: 'Silk Road Pact', kind: 'buff', pct: 25, note: 'Zheng He & Marco Polo open the road' },
  { key: 'warlords-gambit', name: "Warlord's Gambit", kind: 'risk', pct: 10, note: 'Three or more Conqueror tags' },
  { key: 'east-meets-west', name: 'East Meets West', kind: 'buff', pct: 8, note: 'Asian Commander + European General' },
  { key: 'mandate-of-heaven', name: 'Mandate of Heaven', kind: 'buff', pct: 22, note: 'East-Asian Emperor counselled by Confucius' },
  { key: 'age-gap-clash', name: 'Age Gap Clash', kind: 'penalty', pct: -5, note: 'Four or more eras under one banner' },
  { key: 'pax-romana', name: 'Pax Romana', kind: 'buff', pct: 10, note: 'Roman Commander + a Diplomat ally' },
];

export const IDEOLOGIES: Ideology[] = [
  { key: 'conquest', name: 'Imperial Conquest', icon: 'crown', group: 'Political', tenet: 'Expand the realm; let no border stand.', blurb: 'Rewards crowns and conquerors — the more ambition in the ranks, the harder it strikes.', favoredTags: ['Emperor', 'Conqueror', 'Warlord'] },
  { key: 'democracy', name: 'Democracy', icon: 'scales', group: 'Political', tenet: 'Rule by the will of the many.', blurb: 'A coalition drawn from many lands fights as a union of equals — diversity is its strength.', favoredTags: ['Diplomat', 'Coalition Builder'] },
  { key: 'communism', name: 'Communism', icon: 'star', group: 'Political', tenet: 'All power to the masses.', blurb: 'Radical theorists and the massed common soldier turn class struggle into combat strength.', favoredTags: ['Radical', 'Warrior Culture'] },
  { key: 'socialism', name: 'Socialism', icon: 'fasces', group: 'Political', tenet: 'Share the spoils; lift the common soldier.', blurb: 'Reformers and a broad rank-and-file forge solidarity that holds the line.', favoredTags: ['Reformer', 'Warrior Culture'] },
  { key: 'capitalism', name: 'Capitalism', icon: 'coin', group: 'Political', tenet: 'War is won with the deepest purse.', blurb: 'Merchants and diplomats fund the war machine; gold buys what valor cannot.', favoredTags: ['Merchant', 'Diplomat', 'Coalition Builder'] },
  { key: 'nationalism', name: 'Nationalism', icon: 'flag', group: 'Political', tenet: 'One people, one homeland, one army.', blurb: 'A host drawn mostly from a single land fights with fierce, unbroken loyalty.', favoredTags: ['Emperor', 'Warrior Culture'] },
  { key: 'independence', name: 'Independence', icon: 'chain', group: 'Political', tenet: 'Throw off the chains of empire.', blurb: 'A revolutionary at the head of a broad, many-peopled uprising fights with the fury of the free.', favoredTags: ['Revolutionary', 'Diplomat'] },
  { key: 'anarchism', name: 'Anarchism', icon: 'circleA', group: 'Political', tenet: 'No masters, no crowns, no chains.', blurb: 'Thrives on a leaderless rabble; every emperor and king under the banner only weighs it down.', favoredTags: ['Radical', 'Reformer'] },
  { key: 'faith', name: 'Christendom', icon: 'cross', group: 'Spiritual', tenet: 'March beneath a righteous cross.', blurb: 'A prophet in the ranks sanctifies the war and steels every soldier’s resolve.', favoredTags: ['Prophet'] },
  { key: 'islam', name: 'Islam', icon: 'crescent', group: 'Spiritual', tenet: 'Unite the faithful under one creed.', blurb: 'Devotion runs deepest among the peoples of the Middle East and a prophet’s call.', favoredTags: ['Prophet'] },
  { key: 'buddhism', name: 'Buddhism', icon: 'wheel', group: 'Spiritual', tenet: 'Still the mind; master the battle.', blurb: 'Philosophers and the enlightened fight with serene discipline — clarity over fury.', favoredTags: ['Philosopher', 'Prophet'] },
  { key: 'hinduism', name: 'Hinduism', icon: 'om', group: 'Spiritual', tenet: 'Duty (dharma) on the field of battle.', blurb: 'The peoples of South Asia and their sages fight as a sacred duty foretold.', favoredTags: ['Philosopher'] },
  { key: 'theocracy', name: 'Theocracy', icon: 'banner', group: 'Spiritual', tenet: 'The divine rules through the throne.', blurb: 'A prophet beside a crowned ruler fuses heaven and empire into one terrible authority.', favoredTags: ['Prophet', 'Emperor'] },
  { key: 'pacifism', name: 'Pacifism', icon: 'olive', group: 'Philosophical', tenet: 'Conquer hearts, not lands.', blurb: 'A perilous creed: with a moral leader it wins by conscience; without one, an army that won’t kill falters.', favoredTags: ['Prophet', 'Philosopher', 'Reformer'] },
  { key: 'reason', name: 'Enlightenment', icon: 'sun', group: 'Philosophical', tenet: 'Let reason sharpen every blade.', blurb: 'Scholars, philosophers and tacticians turn cold logic into battlefield advantage.', favoredTags: ['Scholar', 'Philosopher', 'Advisor', 'Tactician'] },
  { key: 'stoicism', name: 'Stoicism', icon: 'column', group: 'Philosophical', tenet: 'Endure all; complain of nothing.', blurb: 'Scholars and steady advisors temper the legion to outlast any hardship.', favoredTags: ['Scholar', 'Advisor'] },
  { key: 'honor', name: 'Warrior Code', icon: 'shield', group: 'Philosophical', tenet: 'Death before dishonor.', blurb: 'Warrior cultures and berserkers fight twice as fiercely beneath a banner of honor.', favoredTags: ['Warrior Culture', 'Berserker'] },
];
