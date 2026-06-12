/* War O' Ages — data layer (plain JS, attaches to window.WOA) */
(function () {
  // ── Regions (8) ─────────────────────────────────────────────
  const REGIONS = {
    EASIA: { key: 'EASIA', name: 'East Asia',        short: 'East Asia',   wheel: 'East Asia',      ink: '#3f7d5a', mono: 'EA', glyph: '龍' },
    MEDIT: { key: 'MEDIT', name: 'Mediterranean',    short: 'Mediterr.',   wheel: 'The Med',        ink: '#9a6a1f', mono: 'ME', glyph: 'Ω' },
    MIDE:  { key: 'MIDE',  name: 'Middle East',       short: 'Middle East', wheel: 'Middle East',    ink: '#2f6f86', mono: 'MD', glyph: '☾' },
    AFRIC: { key: 'AFRIC', name: 'Sub-Saharan Africa',short: 'Africa',     wheel: 'Africa',         ink: '#b5642a', mono: 'AF', glyph: '⌘' },
    AMER:  { key: 'AMER',  name: 'The Americas',       short: 'Americas',   wheel: 'The Americas',   ink: '#2d8079', mono: 'AM', glyph: '☉' },
    WEUR:  { key: 'WEUR',  name: 'Western Europe',     short: 'W. Europe',  wheel: 'Western Europe', ink: '#3a5a8c', mono: 'WE', glyph: '✠' },
    EEUR:  { key: 'EEUR',  name: 'Eastern Europe',     short: 'E. Europe',  wheel: 'Eastern Europe', ink: '#8a3b5a', mono: 'EE', glyph: '☦' },
    SASIA: { key: 'SASIA', name: 'South & SE Asia',    short: 'S. Asia',    wheel: 'South Asia',     ink: '#a8602c', mono: 'SA', glyph: 'ॐ' },
  };

  // ── Eras (5) ────────────────────────────────────────────────
  const ERAS = {
    ANCIENT: { key: 'ANCIENT', name: 'Ancient',      span: '3000–500 BCE',  short: 'Ancient' },
    CLASSIC: { key: 'CLASSIC', name: 'Classical',    span: '500 BCE–500 CE',short: 'Classical' },
    MEDIEV:  { key: 'MEDIEV',  name: 'Medieval',      span: '500–1400 CE',   short: 'Medieval' },
    EARLYM:  { key: 'EARLYM',  name: 'Early Modern',  span: '1400–1800 CE',  short: 'Early Modern' },
    MODERN:  { key: 'MODERN',  name: 'Modern',        span: '1800–1950 CE',  short: 'Modern' },
  PRESENT: { key: 'PRESENT', name: 'Present',       span: '1950–present',  short: 'Present' },
  };

  // ── Positions (5) ───────────────────────────────────────────
  // Ideology is no longer a muster rank — it became a banner the player
  // chooses in the War Council (see IDEOLOGIES). Weights re-sum to 1.0.
  const POSITIONS = [
    { key: 'commander',  name: 'Commander',  abbr: 'CMD', weight: 0.28, blurb: 'Base attack & army morale', tags: ['Emperor','Conqueror','Warlord'] },
    { key: 'strategist', name: 'Strategist', abbr: 'STR', weight: 0.22, blurb: 'Synergy activation & hidden combos', tags: ['Philosopher','Scholar','Tactician','Advisor'] },
    { key: 'general',    name: 'General',    abbr: 'GEN', weight: 0.22, blurb: 'Battlefield effectiveness', tags: ['General','Admiral','Revolutionary'] },
    { key: 'troops',     name: 'Troops',     abbr: 'TRP', weight: 0.16, blurb: 'Raw fighting force & endurance', tags: ['Warrior Culture','Berserker','Empire Builder'] },
    { key: 'allies',     name: 'Allies',     abbr: 'ALY', weight: 0.12, blurb: 'Diplomatic & cross-region buffs', tags: ['Diplomat','Coalition Builder','Merchant'] },
  ];

  // ── Roster ─────────────────────────────────────────────────
  // [name, region, era, [tags], pr, civ]
  const R = (name, region, era, tags, pr, civ) => ({ name, region, era, tags, pr, civ: civ || '' });
  const ROSTER_RAW = [
    // Commanders
    R('Genghis Khan','EASIA','MEDIEV',['Conqueror','Warlord','Coalition Builder'],96,'Mongol'),
    R('Julius Caesar','MEDIT','CLASSIC',['Emperor','General','Tactician'],95,'Rome'),
    R('Alexander the Great','MEDIT','CLASSIC',['Conqueror','General','Scholar'],95,'Greece'),
    R('Napoleon Bonaparte','WEUR','MODERN',['Emperor','General','Tactician'],93,'France'),
    R('Qin Shi Huang','EASIA','CLASSIC',['Emperor','Conqueror'],88,'China'),
    R('Cyrus the Great','MIDE','CLASSIC',['Emperor','Diplomat'],86,'Persia'),
    R('Attila the Hun','EEUR','CLASSIC',['Warlord','Berserker'],84,'Huns'),
    R('Shaka Zulu','AFRIC','MODERN',['Conqueror','Warlord'],82,'Zulu'),
    R('Chandragupta Maurya','SASIA','CLASSIC',['Emperor','General'],80,'India'),
    R('Mansa Musa','AFRIC','MEDIEV',['Emperor','Diplomat'],78,'Mali'),
    R('Montezuma II','AMER','EARLYM',['Emperor','Warlord'],70,'Aztec'),
    R('Harald Hardrada','WEUR','MEDIEV',['Warlord','Berserker'],74,'Norse'),
    R('Timur','MIDE','MEDIEV',['Conqueror','Warlord'],85,'Timurid'),
    R('Pachacuti','AMER','MEDIEV',['Emperor','Empire Builder'],76,'Inca'),
    // Strategists
    R('Sun Tzu','EASIA','CLASSIC',['Tactician','Scholar'],92,'China'),
    R('Zhuge Liang','EASIA','CLASSIC',['Advisor','Scholar','Tactician'],88,'China'),
    R('Aristotle','MEDIT','CLASSIC',['Philosopher','Scholar'],90,'Greece'),
    R('Chanakya','SASIA','CLASSIC',['Advisor','Scholar','Tactician'],84,'India'),
    R('Machiavelli','MEDIT','EARLYM',['Advisor','Scholar'],82,'Italy'),
    R('Sun Bin','EASIA','CLASSIC',['Tactician','Scholar'],76,'China'),
    R('Belisarius','EEUR','MEDIEV',['Tactician','General'],80,'Byzantine'),
    R('Sima Yi','EASIA','CLASSIC',['Advisor','Tactician'],78,'China'),
    R('Ibn Khaldun','MIDE','MEDIEV',['Scholar','Philosopher'],79,'Arabia'),
    R('Frederick the Great','EEUR','EARLYM',['Tactician','Emperor'],83,'Prussia'),
    R('Cao Cao','EASIA','CLASSIC',['Tactician','General','Warlord'],81,'China'),
    R('Thucydides','MEDIT','CLASSIC',['Scholar','Advisor'],72,'Greece'),
    // Generals
    R('Hannibal Barca','MEDIT','CLASSIC',['General','Tactician'],90,'Carthage'),
    R('Yi Sun-sin','EASIA','EARLYM',['Admiral','General'],86,'Korea'),
    R('Khalid ibn al-Walid','MIDE','MEDIEV',['General','Conqueror'],85,'Arabia'),
    R('Subotai','EASIA','MEDIEV',['General','Tactician'],84,'Mongol'),
    R('Duke of Wellington','WEUR','MODERN',['General'],80,'Britain'),
    R('Georgy Zhukov','EEUR','MODERN',['General','Tactician'],83,'Rus'),
    R('Vo Nguyen Giap','SASIA','MODERN',['General','Revolutionary'],78,'Vietnam'),
    R('Scipio Africanus','MEDIT','CLASSIC',['General','Tactician'],82,'Rome'),
    R('Erwin Rommel','WEUR','MODERN',['General','Tactician'],79,'Germany'),
    R('Saladin','MIDE','MEDIEV',['General','Emperor','Diplomat'],86,'Arabia'),
    R('Toyotomi Hideyoshi','EASIA','EARLYM',['Conqueror','General'],79,'Japan'),
    R('Ulysses S. Grant','AMER','MODERN',['General','Emperor'],76,'USA'),
    // Troops
    R('Spartan Warriors','MEDIT','CLASSIC',['Berserker','Warrior Culture'],84,'Greece'),
    R('Mongol Horsemen','EASIA','MEDIEV',['Berserker','Warrior Culture'],88,'Mongol'),
    R('Roman Legions','MEDIT','CLASSIC',['Warrior Culture','Empire Builder'],90,'Rome'),
    R('Viking Raiders','WEUR','MEDIEV',['Berserker','Warrior Culture'],82,'Norse'),
    R('Janissaries','MIDE','EARLYM',['Warrior Culture','Empire Builder'],80,'Ottoman'),
    R('Samurai','EASIA','MEDIEV',['Warrior Culture','Berserker'],83,'Japan'),
    R('Zulu Impis','AFRIC','MODERN',['Warrior Culture','Berserker'],78,'Zulu'),
    R('Jaguar Warriors','AMER','EARLYM',['Warrior Culture','Berserker'],75,'Aztec'),
    R('Swiss Pikemen','WEUR','EARLYM',['Warrior Culture','Mercenary'],74,'Swiss'),
    R('Gurkhas','SASIA','MODERN',['Warrior Culture','Berserker'],76,'Nepal'),
    R('Mamluk Cavalry','MIDE','MEDIEV',['Warrior Culture','Empire Builder'],79,'Egypt'),
    R('Persian Immortals','MIDE','ANCIENT',['Warrior Culture','Empire Builder'],81,'Persia'),
    // Allies
    R('Cleopatra VII','MEDIT','CLASSIC',['Diplomat','Coalition Builder'],84,'Egypt'),
    R('Kublai Khan','EASIA','MEDIEV',['Coalition Builder','Emperor'],86,'Mongol'),
    R('Henry the Navigator','WEUR','EARLYM',['Coalition Builder','Merchant'],72,'Iberia'),
    R('Otto von Bismarck','WEUR','MODERN',['Diplomat','Coalition Builder'],82,'Germany'),
    R('Zheng He','EASIA','EARLYM',['Diplomat','Merchant','Admiral'],80,'China'),
    R('Marco Polo','MEDIT','MEDIEV',['Merchant','Diplomat'],70,'Venice'),
    R('Mehmed II','MIDE','EARLYM',['Coalition Builder','Conqueror'],84,'Ottoman'),
    R("Lorenzo de' Medici",'MEDIT','EARLYM',['Merchant','Diplomat'],71,'Italy'),
    R('Nzinga of Ndongo','AFRIC','EARLYM',['Diplomat','Coalition Builder'],76,'Ndongo'),
    R('Tokugawa Ieyasu','EASIA','EARLYM',['Coalition Builder','General'],81,'Japan'),
    // Thinkers, prophets & revolutionaries — formerly "Ideology",
    // now reclassified to their nearest military role.
    R('Confucius','EASIA','CLASSIC',['Philosopher','Reformer'],88,'China'),       // → Strategist
    R('Karl Marx','WEUR','MODERN',['Philosopher','Radical'],85,'Germany'),        // → Strategist
    R('Mahatma Gandhi','SASIA','MODERN',['Diplomat','Reformer'],86,'India'),      // → Allies
    R('Plato','MEDIT','CLASSIC',['Philosopher','Scholar'],87,'Greece'),           // → Strategist
    R('Thomas Jefferson','AMER','EARLYM',['Diplomat','Reformer'],78,'USA'),       // → Allies
    R('Mao Zedong','EASIA','MODERN',['Warlord','Radical'],80,'China'),            // → Commander
    R('Vladimir Lenin','EEUR','MODERN',['Advisor','Reformer'],81,'Rus'),          // → Strategist
    R('Joan of Arc','WEUR','MEDIEV',['General','Prophet'],79,'France'),           // → General
    R('Robespierre','WEUR','EARLYM',['Advisor','Radical'],70,'France'),           // → Strategist
    R('Buddha','SASIA','CLASSIC',['Philosopher','Prophet'],84,'India'),           // → Strategist
    R('Rousseau','WEUR','EARLYM',['Philosopher','Reformer'],74,'France'),         // → Strategist
    R('Che Guevara','AMER','MODERN',['Revolutionary','Radical'],75,'Cuba'),       // → General
    // ── Present era ──
    R('Nelson Mandela','AFRIC','PRESENT',['Diplomat','Coalition Builder'],88,'South Africa'),
    R('Deng Xiaoping','EASIA','PRESENT',['Advisor','Reformer'],83,'China'),
    R('Lee Kuan Yew','SASIA','PRESENT',['Emperor','Advisor'],82,'Singapore'),
    R('Henry Kissinger','WEUR','PRESENT',['Advisor','Diplomat'],80,'USA'),
    R('Ho Chi Minh','SASIA','PRESENT',['Revolutionary','Warlord'],80,'Vietnam'),
    R('Xi Jinping','EASIA','PRESENT',['Emperor','Conqueror'],80,'China'),
    R('Barack Obama','AMER','PRESENT',['Diplomat','Coalition Builder'],78,'USA'),
    R('Angela Merkel','WEUR','PRESENT',['Diplomat','Coalition Builder'],79,'Germany'),
    R('Vladimir Putin','EEUR','PRESENT',['Warlord','Emperor'],78,'Rus'),
    R('Fidel Castro','AMER','PRESENT',['Revolutionary','Warlord'],74,'Cuba'),
    R('Mikhail Gorbachev','EEUR','PRESENT',['Diplomat','Reformer'],75,'Rus'),
    R('Moshe Dayan','MIDE','PRESENT',['General','Tactician'],79,'Israel'),
    R('Patrice Lumumba','AFRIC','PRESENT',['Diplomat','Revolutionary'],72,'Congo'),
    R('Kofi Annan','AFRIC','PRESENT',['Diplomat','Coalition Builder'],76,'Ghana'),
    R('IDF Paratroopers','MIDE','PRESENT',['Warrior Culture','Tactician'],76,'Israel'),
    R('Viet Cong','SASIA','PRESENT',['Warrior Culture','Berserker'],73,'Vietnam'),
    R('Green Berets','AMER','PRESENT',['Warrior Culture','Tactician'],74,'USA'),
    // ── Codex expansion — every region × era answers the wheel ──
    // Ancient
    R('Sargon of Akkad','MIDE','ANCIENT',['Conqueror','Empire Builder'],82,'Akkad'),
    R('Hammurabi','MIDE','ANCIENT',['Emperor','Advisor'],78,'Babylon'),
    R('Ramesses II','MIDE','ANCIENT',['Emperor','General'],84,'Egypt'),
    R('Hatshepsut','MIDE','ANCIENT',['Emperor','Merchant','Diplomat'],76,'Egypt'),
    R('Nebuchadnezzar II','MIDE','ANCIENT',['Emperor','Empire Builder'],79,'Babylon'),
    R('Assyrian Siege Corps','MIDE','ANCIENT',['Warrior Culture','Empire Builder'],77,'Assyria'),
    R('Phoenician Merchants','MEDIT','ANCIENT',['Merchant','Diplomat'],72,'Phoenicia'),
    R('Mycenaean Spearmen','MEDIT','ANCIENT',['Warrior Culture','Berserker'],70,'Mycenae'),
    R('Fu Hao','EASIA','ANCIENT',['General','Prophet'],74,'China'),
    R('Duke of Zhou','EASIA','ANCIENT',['Advisor','Scholar'],77,'China'),
    R('Shang Bronze Warriors','EASIA','ANCIENT',['Warrior Culture','Empire Builder'],71,'China'),
    R('Vedic Rishis','SASIA','ANCIENT',['Philosopher','Scholar'],73,'India'),
    R('Indus Merchants','SASIA','ANCIENT',['Merchant','Diplomat'],69,'India'),
    R('Piye of Kush','AFRIC','ANCIENT',['Conqueror','Emperor'],75,'Kush'),
    R('Kushite Archers','AFRIC','ANCIENT',['Warrior Culture','Berserker'],72,'Kush'),
    R('Queen of Sheba','AFRIC','ANCIENT',['Diplomat','Merchant'],74,'Sheba'),
    R('Olmec Priest-Kings','AMER','ANCIENT',['Emperor','Prophet'],68,'Olmec'),
    R('Chavín Oracle','AMER','ANCIENT',['Advisor','Prophet'],67,'Chavin'),
    R('Celtic War Bands','WEUR','ANCIENT',['Warrior Culture','Berserker'],71,'Celts'),
    R('Druid Conclave','WEUR','ANCIENT',['Advisor','Prophet'],69,'Celts'),
    R('Scythian Horse Archers','EEUR','ANCIENT',['Warrior Culture','Berserker'],76,'Scythia'),
    R('Tomyris','EEUR','ANCIENT',['Warlord','General'],75,'Scythia'),
    // Classical
    R('Ashoka','SASIA','CLASSIC',['Emperor','Reformer'],85,'India'),
    R('Darius I','MIDE','CLASSIC',['Emperor','Empire Builder'],83,'Persia'),
    R('Zenobia','MIDE','CLASSIC',['Warlord','Diplomat'],77,'Palmyra'),
    R('King Ezana','AFRIC','CLASSIC',['Emperor','Reformer'],72,'Aksum'),
    R('Aksumite Spearmen','AFRIC','CLASSIC',['Warrior Culture','Empire Builder'],70,'Aksum'),
    R('Maya Astronomer-Priests','AMER','CLASSIC',['Scholar','Advisor'],71,'Maya'),
    R('Teotihuacan Spearthrowers','AMER','CLASSIC',['Warrior Culture','Berserker'],70,'Teotihuacan'),
    R('Vercingetorix','WEUR','CLASSIC',['Warlord','Revolutionary'],76,'Gaul'),
    R('Boudica','WEUR','CLASSIC',['Warlord','Revolutionary'],75,'Britain'),
    R('Arminius','WEUR','CLASSIC',['General','Tactician'],78,'Germania'),
    R('Decebalus','EEUR','CLASSIC',['Warlord','General'],73,'Dacia'),
    R('Sarmatian Cataphracts','EEUR','CLASSIC',['Warrior Culture','Empire Builder'],72,'Scythia'),
    // Medieval
    R('Charlemagne','WEUR','MEDIEV',['Emperor','Empire Builder'],88,'Franks'),
    R('William the Conqueror','WEUR','MEDIEV',['Conqueror','General'],83,'Normandy'),
    R('El Cid','WEUR','MEDIEV',['General','Warlord'],79,'Iberia'),
    R('Eleanor of Aquitaine','WEUR','MEDIEV',['Diplomat','Advisor'],76,'France'),
    R('Enrico Dandolo','MEDIT','MEDIEV',['Coalition Builder','Admiral'],74,'Venice'),
    R('Knights Hospitaller','MEDIT','MEDIEV',['Warrior Culture','Empire Builder'],73,'Crusaders'),
    R('Rajendra Chola','SASIA','MEDIEV',['Emperor','Admiral'],80,'Chola'),
    R('Rajput Cavalry','SASIA','MEDIEV',['Warrior Culture','Berserker'],74,'India'),
    R('Alexander Nevsky','EEUR','MEDIEV',['General','Diplomat'],78,'Rus'),
    R('Jan Žižka','EEUR','MEDIEV',['General','Tactician'],79,'Bohemia'),
    R('Varangian Guard','EEUR','MEDIEV',['Warrior Culture','Berserker'],75,'Byzantine'),
    R('Sundiata Keita','AFRIC','MEDIEV',['Conqueror','Empire Builder'],79,'Mali'),
    R('Great Zimbabwe Traders','AFRIC','MEDIEV',['Merchant','Diplomat'],68,'Zimbabwe'),
    R('Toltec Warriors','AMER','MEDIEV',['Warrior Culture','Berserker'],69,'Toltec'),
    R('Minamoto no Yoshitsune','EASIA','MEDIEV',['General','Tactician'],80,'Japan'),
    R('Wu Zetian','EASIA','MEDIEV',['Emperor','Advisor'],81,'China'),
    // Early Modern
    R('Akbar the Great','SASIA','EARLYM',['Emperor','Diplomat'],86,'Mughal'),
    R('Shivaji','SASIA','EARLYM',['General','Tactician'],80,'Maratha'),
    R('Mughal War Elephants','SASIA','EARLYM',['Warrior Culture','Empire Builder'],73,'Mughal'),
    R('Tipu Sultan','SASIA','EARLYM',['Warlord','General'],75,'Mysore'),
    R('Suleiman the Magnificent','MIDE','EARLYM',['Emperor','Diplomat'],87,'Ottoman'),
    R('Elizabeth I','WEUR','EARLYM',['Emperor','Diplomat'],82,'Britain'),
    R('Hernán Cortés','WEUR','EARLYM',['Conqueror','General'],76,'Spain'),
    R('Oliver Cromwell','WEUR','EARLYM',['General','Radical'],77,'Britain'),
    R('Spanish Tercios','WEUR','EARLYM',['Warrior Culture','Empire Builder'],76,'Spain'),
    R('George Washington','AMER','EARLYM',['General','Coalition Builder'],83,'USA'),
    R('Atahualpa','AMER','EARLYM',['Emperor','Warlord'],71,'Inca'),
    R('Túpac Amaru II','AMER','EARLYM',['Revolutionary','Radical'],70,'Inca'),
    R('Andrea Doria','MEDIT','EARLYM',['Admiral','Tactician'],75,'Genoa'),
    R('Askia the Great','AFRIC','EARLYM',['Emperor','Scholar'],77,'Songhai'),
    R('Songhai Cavalry','AFRIC','EARLYM',['Warrior Culture','Empire Builder'],71,'Songhai'),
    R('Ivan the Terrible','EEUR','EARLYM',['Emperor','Warlord'],78,'Rus'),
    R('Peter the Great','EEUR','EARLYM',['Emperor','Reformer'],84,'Rus'),
    R('Catherine the Great','EEUR','EARLYM',['Emperor','Diplomat'],83,'Rus'),
    R('Winged Hussars','EEUR','EARLYM',['Warrior Culture','Berserker'],78,'Poland'),
    R('Jan Sobieski','EEUR','EARLYM',['General','Coalition Builder'],79,'Poland'),
    R('Miyamoto Musashi','EASIA','EARLYM',['Berserker','Scholar'],76,'Japan'),
    R('Kangxi Emperor','EASIA','EARLYM',['Emperor','Scholar'],84,'China'),
    // Modern
    R('Giuseppe Garibaldi','MEDIT','MODERN',['Revolutionary','General'],81,'Italy'),
    R('Camillo Cavour','MEDIT','MODERN',['Advisor','Diplomat'],76,'Italy'),
    R('Simón Bolívar','AMER','MODERN',['Revolutionary','General'],85,'Colombia'),
    R('Andrew Jackson','AMER','MODERN',['General','Warlord'],82,'USA'),
    R('Abraham Lincoln','AMER','MODERN',['Diplomat','Reformer'],84,'USA'),
    R('Sitting Bull','AMER','MODERN',['Warlord','Prophet'],76,'Lakota'),
    R('Comanche Riders','AMER','MODERN',['Warrior Culture','Berserker'],72,'Comanche'),
    R('Horatio Nelson','WEUR','MODERN',['Admiral','Tactician'],84,'Britain'),
    R('Winston Churchill','WEUR','MODERN',['Coalition Builder','Advisor'],85,'Britain'),
    R('Mustafa Kemal Atatürk','MIDE','MODERN',['General','Reformer'],84,'Turkey'),
    R('Muhammad Ali Pasha','MIDE','MODERN',['Emperor','Reformer'],75,'Egypt'),
    R('Menelik II','AFRIC','MODERN',['Emperor','General'],79,'Ethiopia'),
    R('Samori Touré','AFRIC','MODERN',['Warlord','Revolutionary'],74,'Mali'),
    R('Mikhail Kutuzov','EEUR','MODERN',['General','Tactician'],80,'Rus'),
    R('Cossack Host','EEUR','MODERN',['Warrior Culture','Berserker'],73,'Rus'),
    R('Meiji Emperor','EASIA','MODERN',['Emperor','Reformer'],82,'Japan'),
    R('Tōgō Heihachirō','EASIA','MODERN',['Admiral','Tactician'],80,'Japan'),
    R('Empress Dowager Cixi','EASIA','MODERN',['Advisor','Diplomat'],72,'China'),
    R('Rani Lakshmibai','SASIA','MODERN',['Revolutionary','General'],75,'India'),
    R('Sikh Khalsa','SASIA','MODERN',['Warrior Culture','Berserker'],74,'Punjab'),
    // Present
    R('Charles de Gaulle','WEUR','PRESENT',['General','Coalition Builder'],81,'France'),
    R('Margaret Thatcher','WEUR','PRESENT',['Reformer','Diplomat'],77,'Britain'),
    R('SAS Commandos','WEUR','PRESENT',['Warrior Culture','Tactician'],75,'Britain'),
    R('Aristotle Onassis','MEDIT','PRESENT',['Merchant','Coalition Builder'],70,'Greece'),
    R('Italian Alpini','MEDIT','PRESENT',['Warrior Culture','Tactician'],71,'Italy'),
    R('Golda Meir','MIDE','PRESENT',['Advisor','Diplomat'],77,'Israel'),
    R('Anwar Sadat','MIDE','PRESENT',['Diplomat','Reformer'],76,'Egypt'),
    R('Haile Selassie','AFRIC','PRESENT',['Emperor','Diplomat'],76,'Ethiopia'),
    R('Josip Broz Tito','EEUR','PRESENT',['Warlord','Coalition Builder'],78,'Yugoslavia'),
    R('Lech Wałęsa','EEUR','PRESENT',['Revolutionary','Reformer'],73,'Poland'),
    R("People's Liberation Army",'EASIA','PRESENT',['Warrior Culture','Empire Builder'],75,'China'),
    R('Indira Gandhi','SASIA','PRESENT',['Emperor','Advisor'],76,'India'),
  ];

  // ── helpers: deterministic hash for stable jitter ───────────
  function hash(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
    return (h >>> 0);
  }
  const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

  function initials(name) {
    const stop = { of: 1, the: 1, ibn: 1, al: 1, de: 1, "de'": 1 };
    const parts = name.split(/[\s-]+/).filter(w => !stop[w.toLowerCase()]);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  const TAG_STATS = {
    'Conqueror':        { PWR: 10, CMD: 6,  VAL: 5 },
    'Warlord':          { PWR: 12, VAL: 8,  DIP: -4 },
    'Emperor':          { CMD: 12, DIP: 6,  GUI: 3 },
    'Berserker':        { PWR: 8,  VAL: 12, GUI: -6 },
    'Warrior Culture':  { VAL: 11, PWR: 6 },
    'Empire Builder':   { CMD: 8,  DIP: 5 },
    'General':          { PWR: 6,  CMD: 8,  GUI: 5 },
    'Admiral':          { GUI: 6,  CMD: 5,  VAL: 4 },
    'Tactician':        { GUI: 13, PWR: 2 },
    'Scholar':          { GUI: 10, DIP: 4 },
    'Philosopher':      { GUI: 8,  DIP: 10, PWR: -6 },
    'Advisor':          { GUI: 11, DIP: 5 },
    'Diplomat':         { DIP: 14, GUI: 4,  PWR: -4 },
    'Coalition Builder':{ DIP: 12, CMD: 4 },
    'Merchant':         { DIP: 10, GUI: 5 },
    'Prophet':          { DIP: 12, CMD: 6 },
    'Reformer':         { DIP: 9,  GUI: 6 },
    'Radical':          { DIP: 8,  PWR: 4,  CMD: -4 },
    'Revolutionary':    { PWR: 6,  VAL: 7,  DIP: 4 },
    'Mercenary':        { PWR: 5,  VAL: 5,  DIP: -6 },
  };
  const STAT_KEYS = ['PWR', 'CMD', 'GUI', 'VAL', 'DIP'];
  const STAT_LABELS = { PWR: 'Power', CMD: 'Command', GUI: 'Guile', VAL: 'Valor', DIP: 'Diplomacy' };

  function computeStats(fig) {
    const out = {};
    STAT_KEYS.forEach((k, i) => {
      let v = fig.pr * 0.66 + 16;
      fig.tags.forEach(t => { const b = TAG_STATS[t]; if (b && b[k]) v += b[k]; });
      const j = (hash(fig.name + k) % 9) - 4; // -4..4
      out[k] = clamp(Math.round(v + j), 34, 99);
    });
    return out;
  }

  function eligiblePositions(fig) {
    return POSITIONS.filter(p => p.tags.some(t => fig.tags.includes(t))).map(p => p.key);
  }

  // build enriched roster
  const ROSTER = ROSTER_RAW.map(f => {
    const stats = computeStats(f);
    return {
      ...f,
      id: f.name,
      init: initials(f.name),
      stats,
      eligible: eligiblePositions(f),
      regionInk: REGIONS[f.region].ink,
      regionName: REGIONS[f.region].name,
      eraName: ERAS[f.era].name,
      tier: f.pr >= 88 ? 'Legendary' : f.pr >= 78 ? 'Elite' : f.pr >= 62 ? 'Notable' : 'Historic',
    };
  });

  function poolFor(positionKey) {
    return ROSTER.filter(f => f.eligible.includes(positionKey));
  }

  // weighted power of a figure for a given position (favors relevant stats)
  const POS_STAT = {
    commander: ['PWR', 'CMD'], strategist: ['GUI', 'DIP'], general: ['PWR', 'CMD', 'GUI'],
    troops: ['VAL', 'PWR'], allies: ['DIP', 'GUI'],
  };
  function figurePower(fig, positionKey) {
    const keys = POS_STAT[positionKey] || STAT_KEYS;
    const avg = keys.reduce((s, k) => s + fig.stats[k], 0) / keys.length;
    return fig.pr * 0.5 + avg * 0.5;
  }

  // ── Battlegrounds ──────────────────────────────────────────
  const BATTLEGROUNDS = [
    { key: 'steppe', name: 'Steppe Plains', terrain: 'Endless grass; cavalry rules.',
      buff: 'Cavalry cultures +20%', debuff: 'Heavy infantry −10%',
      mult: (sq) => bgMult(sq, ['Mongol','Persia','Egypt','Huns','Scythia','Comanche'], ['Greece','Rome','Swiss']) },
    { key: 'jungle', name: 'Dense Jungle', terrain: 'Choked canopy; ambush country.',
      buff: 'Aztec / Zulu / SE-Asian +15%', debuff: 'European armies −10%',
      mult: (sq) => bgMult(sq, ['Aztec','Zulu','Vietnam','Nepal','Inca'], ['Rome','France','Britain','Germany','Norse']) },
    { key: 'mountain', name: 'Mountain Pass', terrain: 'Narrow defiles favour the dug-in.',
      buff: 'All defenders +15%', debuff: 'Conquerors −5%',
      mult: (sq) => bgMultTag(sq, [], ['Conqueror'], 0.15) },
    { key: 'coast', name: 'Coastal Siege', terrain: 'Salt wind and siege towers.',
      buff: 'Admirals on team +20%', debuff: 'Landlocked civ −10%',
      mult: (sq) => bgMultTag(sq, ['Admiral'], [], 0.20) },
    { key: 'desert', name: 'Desert Campaign', terrain: 'Sun-scorched dunes, no water.',
      buff: 'Arab / Persian / Egyptian +15%', debuff: 'Norse / Russian −12%',
      mult: (sq) => bgMult(sq, ['Arabia','Persia','Egypt','Ottoman','Mali','Songhai'], ['Norse','Rus']) },
    { key: 'walls', name: 'City Walls', terrain: 'Stone ramparts and boiling oil.',
      buff: 'Siege empires +15%', debuff: 'Nomadic cultures −10%',
      mult: (sq) => bgMult(sq, ['Rome','Ottoman','Byzantine','China'], ['Mongol','Huns']) },
  ];
  function squadList(sq) { return Object.values(sq).filter(Boolean); }
  function bgMult(sq, buffCivs, debuffCivs) {
    let m = 1;
    squadList(sq).forEach(f => {
      if (buffCivs.includes(f.civ)) m += 0.04;
      if (debuffCivs.includes(f.civ)) m -= 0.025;
    });
    return clamp(m, 0.82, 1.22);
  }
  function bgMultTag(sq, buffTags, debuffTags, amt) {
    let m = 1;
    squadList(sq).forEach(f => {
      if (buffTags.some(t => f.tags.includes(t))) m += amt * 0.5;
      if (debuffTags.some(t => f.tags.includes(t))) m -= 0.02;
    });
    return clamp(m, 0.85, 1.25);
  }

  // ── Synergies ──────────────────────────────────────────────
  // each: detect(squad) -> bool ; returns {name, pct, kind, note}
  const has = (sq, name) => squadList(sq).some(f => f.name === name);
  const countRegion = (sq, r) => squadList(sq).filter(f => f.region === r).length;
  const countCiv = (sq, c) => squadList(sq).filter(f => f.civ === c).length;
  const countTag = (sq, t) => squadList(sq).filter(f => f.tags.includes(t)).length;
  const erasOf = (sq) => new Set(squadList(sq).map(f => f.era)).size;

  const SYNERGY_DEFS = [
    { name: 'Dragon Court',     kind: 'buff',    pct: 12, note: 'Two or more East Asian figures', test: sq => countRegion(sq, 'EASIA') >= 2 },
    { name: 'Sons of Rome',     kind: 'buff',    pct: 20, note: 'Caesar marches with the Legions', test: sq => has(sq, 'Julius Caesar') && has(sq, 'Roman Legions') },
    { name: 'Steppe Riders',    kind: 'buff',    pct: 30, note: 'Genghis rides with Mongol Horsemen', test: sq => has(sq, 'Genghis Khan') && has(sq, 'Mongol Horsemen') },
    { name: 'Viking Brotherhood',kind: 'buff',   pct: 15, note: 'Two or more Norse figures', test: sq => countCiv(sq, 'Norse') >= 2 },
    { name: 'Philosopher Kings',kind: 'buff',    pct: 18, note: 'Aristotle and Plato confer', test: sq => has(sq, 'Aristotle') && has(sq, 'Plato') },
    { name: 'Silk Road Pact',   kind: 'buff',    pct: 25, note: 'Zheng He & Marco Polo open the road', test: sq => has(sq, 'Zheng He') && has(sq, 'Marco Polo') },
    { name: "Warlord's Gambit", kind: 'risk',    pct: 10, note: 'Three or more Conqueror tags', test: sq => countTag(sq, 'Conqueror') >= 3 },
    { name: 'East Meets West',  kind: 'buff',    pct: 8,  note: 'Asian Commander + European General', test: sq => sq.commander && ['EASIA','SASIA','MIDE'].includes(sq.commander.region) && sq.general && ['WEUR','EEUR','MEDIT'].includes(sq.general.region) },
    { name: 'Mandate of Heaven',kind: 'buff',    pct: 22, note: 'East-Asian Emperor counselled by Confucius', test: sq => sq.commander && sq.commander.region === 'EASIA' && sq.commander.tags.includes('Emperor') && has(sq, 'Confucius') },
    { name: 'Age Gap Clash',    kind: 'penalty', pct: -5, note: 'Four or more eras under one banner', test: sq => erasOf(sq) >= 4 },
    { name: 'Pax Romana',       kind: 'buff',    pct: 10, note: 'Roman Commander + a Diplomat ally', test: sq => sq.commander && sq.commander.civ === 'Rome' && sq.allies && sq.allies.tags.includes('Diplomat') },
  ];

  function detectSynergies(squad) {
    return SYNERGY_DEFS.filter(s => { try { return s.test(squad); } catch (e) { return false; } });
  }

  // ── Ideologies ──────────────────────────────────────────
  // The cause a legion fights for. Chosen by the player in the War Council
  // (NOT drawn at muster). Each returns a % modifier computed from the
  // assembled squad, so the banner you raise is a real strategic choice.
  const distinctRegions = (sq) => new Set(squadList(sq).map(f => f.region)).size;
  const hasTag = (sq, t) => squadList(sq).some(f => f.tags.includes(t));
  const clampPct = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(v)));
  const maxRegionCount = (sq) => { const m = {}; let best = 0; squadList(sq).forEach(f => { m[f.region] = (m[f.region]||0)+1; best = Math.max(best, m[f.region]); }); return best; };

  // The full wheel of causes — political, spiritual and philosophical
  // movements a legion may rally behind. Grouped only for the player's sake;
  // each returns a % modifier read off the assembled squad.
  const IDEOLOGIES = [
    // ── Political ──
    { key: 'conquest', name: 'Imperial Conquest', icon: 'crown', group: 'Political',
      tenet: 'Expand the realm; let no border stand.',
      blurb: 'Rewards crowns and conquerors — the more ambition in the ranks, the harder it strikes.',
      effect: (sq) => { const n = countTag(sq,'Emperor') + countTag(sq,'Conqueror') + countTag(sq,'Warlord');
        return { pct: clampPct(5 + 4*n, 5, 25), note: n ? `${n} sovereign ${n>1?'ambitions':'ambition'} press the conquest` : 'Naked ambition drives the host' }; } },
    { key: 'democracy', name: 'Democracy', icon: 'scales', group: 'Political',
      tenet: 'Rule by the will of the many.',
      blurb: 'A coalition drawn from many lands fights as a union of equals — diversity is its strength.',
      effect: (sq) => { const reg = distinctRegions(sq); return { pct: clampPct(3 + 4*(reg-1), 3, 23), note: `A coalition of ${reg} ${reg>1?'peoples':'people'}` }; } },
    { key: 'communism', name: 'Communism', icon: 'star', group: 'Political',
      tenet: 'All power to the masses.',
      blurb: 'Radical theorists and the massed common soldier turn class struggle into combat strength.',
      effect: (sq) => { const r = countTag(sq,'Radical'); const masses = sq.troops ? 8 : 0;
        return { pct: clampPct(4 + 6*r + masses, 4, 26), note: r ? `${r} radical ${r>1?'theorists':'theorist'} rouse the masses` : 'The masses stir without a theorist' }; } },
    { key: 'socialism', name: 'Socialism', icon: 'fasces', group: 'Political',
      tenet: 'Share the spoils; lift the common soldier.',
      blurb: 'Reformers and a broad rank-and-file forge solidarity that holds the line.',
      effect: (sq) => { const r = countTag(sq,'Reformer'); const masses = sq.troops ? 6 : 0;
        return { pct: clampPct(5 + 5*r + masses, 5, 24), note: r ? 'Reformers bind the ranks in common cause' : 'Solidarity without a guiding hand' }; } },
    { key: 'capitalism', name: 'Capitalism', icon: 'coin', group: 'Political',
      tenet: 'War is won with the deepest purse.',
      blurb: 'Merchants and diplomats fund the war machine; gold buys what valor cannot.',
      effect: (sq) => { const n = countTag(sq,'Merchant')*2 + countTag(sq,'Diplomat') + countTag(sq,'Coalition Builder');
        return { pct: clampPct(4 + 4*n, 4, 24), note: n ? 'Coin and trade bankroll the campaign' : 'An empty war-chest' }; } },
    { key: 'nationalism', name: 'Nationalism', icon: 'flag', group: 'Political',
      tenet: 'One people, one homeland, one army.',
      blurb: 'A host drawn mostly from a single land fights with fierce, unbroken loyalty.',
      effect: (sq) => { const m = maxRegionCount(sq); return { pct: clampPct(2 + 5*(m-1), 2, 24), note: m>1 ? `${m} of one homeland march as one` : 'A host of strangers, loyal to none' }; } },
    { key: 'independence', name: 'Independence', icon: 'chain', group: 'Political',
      tenet: 'Throw off the chains of empire.',
      blurb: 'A revolutionary at the head of a broad, many-peopled uprising fights with the fury of the free.',
      effect: (sq) => { const rev = hasTag(sq,'Revolutionary') ? 10 : 0; const spread = Math.max(0, distinctRegions(sq)-2) * 4;
        return { pct: clampPct(6 + rev + spread, 6, 24), note: rev ? 'Revolutionaries raise the standard' : 'A people rises against its masters' }; } },
    { key: 'anarchism', name: 'Anarchism', icon: 'circleA', group: 'Political',
      tenet: 'No masters, no crowns, no chains.',
      blurb: 'Thrives on a leaderless rabble; every emperor and king under the banner only weighs it down.',
      effect: (sq) => { const kings = countTag(sq,'Emperor'); return { pct: clampPct(16 - 6*kings, -8, 18), note: kings ? `${kings} crowned ${kings>1?'heads':'head'} betray the cause` : 'A free host answers to no throne' }; } },
    // ── Spiritual & Religious ──
    { key: 'faith', name: 'Christendom', icon: 'cross', group: 'Spiritual',
      tenet: 'March beneath a righteous cross.',
      blurb: 'A prophet in the ranks sanctifies the war and steels every soldier’s resolve.',
      effect: (sq) => { const p = hasTag(sq,'Prophet'); return { pct: p ? 20 : 7, note: p ? 'A prophet sanctifies the host' : 'Faith alone steels the ranks' }; } },
    { key: 'islam', name: 'Islam', icon: 'crescent', group: 'Spiritual',
      tenet: 'Unite the faithful under one creed.',
      blurb: 'Devotion runs deepest among the peoples of the Middle East and a prophet’s call.',
      effect: (sq) => { const p = hasTag(sq,'Prophet') ? 8 : 0; const m = countRegion(sq,'MIDE')*4;
        return { pct: clampPct(5 + p + m, 5, 24), note: (p||m) ? 'The faithful answer the call' : 'A creed with few believers' }; } },
    { key: 'buddhism', name: 'Buddhism', icon: 'wheel', group: 'Spiritual',
      tenet: 'Still the mind; master the battle.',
      blurb: 'Philosophers and the enlightened fight with serene discipline — clarity over fury.',
      effect: (sq) => { const n = countTag(sq,'Philosopher') + (hasTag(sq,'Prophet')?2:0); const fury = countTag(sq,'Berserker');
        return { pct: clampPct(4 + 5*n - 2*fury, -4, 22), note: n ? 'Calm discipline guides each strike' : 'No still mind among the host' }; } },
    { key: 'hinduism', name: 'Hinduism', icon: 'om', group: 'Spiritual',
      tenet: 'Duty (dharma) on the field of battle.',
      blurb: 'The peoples of South Asia and their sages fight as a sacred duty foretold.',
      effect: (sq) => { const s = countRegion(sq,'SASIA')*5 + countTag(sq,'Philosopher')*3;
        return { pct: clampPct(5 + s, 5, 24), note: s ? 'Dharma binds the host to its duty' : 'A faith far from its homeland' }; } },
    { key: 'theocracy', name: 'Theocracy', icon: 'banner', group: 'Spiritual',
      tenet: 'The divine rules through the throne.',
      blurb: 'A prophet beside a crowned ruler fuses heaven and empire into one terrible authority.',
      effect: (sq) => { const p = hasTag(sq,'Prophet'); const k = countTag(sq,'Emperor');
        return { pct: clampPct((p?10:0) + 4*k, 3, 24), note: (p&&k) ? 'God and crown rule as one' : p ? 'A prophet without a throne' : 'A throne without a heaven' }; } },
    // ── Philosophical ──
    { key: 'pacifism', name: 'Pacifism', icon: 'olive', group: 'Philosophical',
      tenet: 'Conquer hearts, not lands.',
      blurb: 'A perilous creed: with a moral leader it wins by conscience; without one, an army that won’t kill falters.',
      effect: (sq) => { const moral = hasTag(sq,'Prophet') || hasTag(sq,'Philosopher') || hasTag(sq,'Reformer');
        return { pct: moral ? 16 : -8, note: moral ? 'The moral high ground holds firm' : 'An army that will not strike' }; } },
    { key: 'reason', name: 'Enlightenment', icon: 'sun', group: 'Philosophical',
      tenet: 'Let reason sharpen every blade.',
      blurb: 'Scholars, philosophers and tacticians turn cold logic into battlefield advantage.',
      effect: (sq) => { const n = countTag(sq,'Scholar') + countTag(sq,'Philosopher') + countTag(sq,'Advisor') + countTag(sq,'Tactician');
        return { pct: clampPct(4*n, 0, 24), note: n ? `${n} learned ${n>1?'minds':'mind'} counsel the war` : 'No scholar lights the way' }; } },
    { key: 'stoicism', name: 'Stoicism', icon: 'column', group: 'Philosophical',
      tenet: 'Endure all; complain of nothing.',
      blurb: 'Scholars and steady advisors temper the legion to outlast any hardship.',
      effect: (sq) => { const n = countTag(sq,'Scholar') + countTag(sq,'Advisor'); const steady = sq.troops ? 4 : 0;
        return { pct: clampPct(5 + 4*n + steady, 5, 22), note: n ? 'Tempered minds outlast the storm' : 'Endurance without a guiding calm' }; } },
    { key: 'honor', name: 'Warrior Code', icon: 'shield', group: 'Philosophical',
      tenet: 'Death before dishonor.',
      blurb: 'Warrior cultures and berserkers fight twice as fiercely beneath a banner of honor.',
      effect: (sq) => { const n = countTag(sq,'Warrior Culture') + countTag(sq,'Berserker');
        return { pct: clampPct(6 + 6*n, 6, 26), note: n ? `${n} warrior ${n>1?'bands':'band'} swear the oath` : 'An oath sworn by few' }; } },
  ];
  function ideologyByKey(k) { return IDEOLOGIES.find(d => d.key === k) || null; }
  function ideologyEffect(squad, key) { const d = ideologyByKey(key); return d ? d.effect(squad) : null; }

  // ── Scoring ─────────────────────────────────────────────────
  function scoreSquad(squad, battleground, rngSeed, ideologyKey) {
    let base = 0;
    POSITIONS.forEach(p => {
      const f = squad[p.key];
      if (f) base += figurePower(f, p.key) * p.weight;
    });
    // base ~ 34..99 → scale toward an NBA-like 50..120 score
    const syn = detectSynergies(squad).slice();
    const def = ideologyKey ? ideologyByKey(ideologyKey) : null;
    let ideology = null;
    if (def) {
      const e = def.effect(squad);
      ideology = { key: def.key, name: def.name, kind: 'ideology', banner: true, pct: e.pct, note: e.note };
      syn.push(ideology);
    }
    const synTotal = syn.reduce((s, x) => s + x.pct, 0) / 100;
    const bg = battleground ? battleground.mult(squad) : 1;
    const noise = rngSeed != null ? ((hash('' + rngSeed) % 700) / 100 - 3.5) : 0; // -3.5..3.5
    const final = base * (1 + synTotal) * bg + noise;
    return { base, syn, synTotal, bg, final: Math.max(0, final), ideology };
  }

  // ── Enemy generation ───────────────────────────────────────
  function pick(arr, rng) { return arr[Math.floor(rng() * arr.length)]; }
  function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

  function generateEnemy(seed, avoidNames) {
    const rng = mulberry32(seed || 1234);
    const avoid = new Set(avoidNames || []);
    const squad = {};
    POSITIONS.forEach(p => {
      let pool = poolFor(p.key).filter(f => !avoid.has(f.name) && !squadList(squad).some(s => s.name === f.name));
      // random draw — a fair, varied foe (keeps outcomes close & debate-baity)
      squad[p.key] = pool[Math.floor(rng() * pool.length)];
    });
    return squad;
  }

  // grade from final score
  function gradeFor(score) {
    if (score >= 96) return { letter: 'S', label: 'Immortal', color: '#8f2d22' };
    if (score >= 86) return { letter: 'A', label: 'Conqueror', color: '#b08a2e' };
    if (score >= 74) return { letter: 'B', label: 'Contender', color: '#3a5a8c' };
    if (score >= 60) return { letter: 'C', label: 'Skirmisher', color: '#3f7d5a' };
    return { letter: 'D', label: 'Footnote', color: '#6b5d48' };
  }

  window.WOA = {
    REGIONS, ERAS, POSITIONS, ROSTER, BATTLEGROUNDS, IDEOLOGIES,
    STAT_KEYS, STAT_LABELS, SYNERGY_DEFS,
    poolFor, figurePower, detectSynergies, scoreSquad, generateEnemy, gradeFor,
    ideologyByKey, ideologyEffect,
    squadList, initials, hash, mulberry32,
  };
})();
