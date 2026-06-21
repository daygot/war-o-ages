// Figure chronicles — the lore shown in hover placards and The Books detail.
//
// Curated entries are hand-written for the marquee figures (a punchy `hook`
// plus a `body` of a few sentences). Every other figure falls back to a
// generated overview drawn from its own data (civilisation, era, role, tier,
// standout stats) so the placard is never empty and never invents history.

import { STAT_KEYS } from '../domain/game-data';

export interface Chronicle {
  hook: string;
  body: string;
}

// The minimal figure shape the chronicle layer reads from (LegacyFigure
// satisfies this).
interface FigureLike {
  id: string;
  civ?: string;
  civilization?: string;
  regionName: string;
  eraName: string;
  tier: string;
  stats: Record<string, number>;
  eligible?: string[];
  eligiblePositions?: string[];
}

// Keyed by figure id (see src/domain/game-data.ts).
const CURATED: Record<string, Chronicle> = {
  'genghis-khan': {
    hook: 'Built the largest contiguous land empire in history — from a fatherless outcast.',
    body: 'Temüjin united the warring Mongol clans, then carved an empire from the Pacific to the Caspian. His armies were ruthless, but he also ran a meritocracy, guaranteed religious freedom, and protected the Silk Road.',
  },
  'julius-caesar': {
    hook: 'Conquered Gaul, crossed the Rubicon, and broke the Roman Republic in the process.',
    body: 'General, populist, and writer, Caesar made himself dictator for life and was stabbed 23 times for it. The calendar we use, the month of July, and the title "Caesar" all carry his name.',
  },
  'alexander-the-great': {
    hook: 'Never lost a battle and conquered the known world before turning 33.',
    body: 'Tutored by Aristotle, he toppled the Persian Empire, reached India, and spread Greek culture across three continents. When there were no more worlds to conquer, legend says, he wept.',
  },
  'napoleon-bonaparte': {
    hook: 'A Corsican artillery officer who crowned himself Emperor of the French.',
    body: 'He redrew the map of Europe, wrote a legal code still in use today, and won dazzling victories at Austerlitz and beyond — until Russia\'s winter and Waterloo undid him. He was not, in fact, especially short.',
  },
  'qin-shi-huang': {
    hook: 'Unified China, then built an army of terracotta to guard him in death.',
    body: 'The first emperor standardised writing, currency, and roads, and joined early walls into the first Great Wall. Obsessed with immortality, he may have died swallowing mercury pills meant to grant it.',
  },
  'cyrus-the-great': {
    hook: 'Founded history\'s first superpower and wrote an early charter of human rights.',
    body: 'The Persian king ruled with rare tolerance, freeing the Jews from Babylon and respecting local customs across his vast realm. Even his enemies, the Greeks, held him up as the model of a just ruler.',
  },
  'attila-the-hun': {
    hook: 'The "Scourge of God" who made the Roman Empire pay him to stay away.',
    body: 'His horsemen terrorised Europe from the Rhine to the gates of Constantinople. He died on his own wedding night — of a nosebleed, by most accounts — and his burial place has never been found.',
  },
  'shaka-zulu': {
    hook: 'Revolutionised African warfare and forged the Zulu into a feared empire.',
    body: 'He replaced the throwing spear with the short stabbing iklwa and the encircling "buffalo horns" formation. A brilliant, brutal innovator, he was assassinated by his own half-brothers.',
  },
  'mansa-musa': {
    hook: 'Likely the richest person who ever lived — and he gave it away by the sackful.',
    body: 'The Mali emperor\'s pilgrimage to Mecca was so lavish that the gold he handed out crashed Egypt\'s economy for years. He turned Timbuktu into a jewel of scholarship and trade.',
  },
  'montezuma-ii': {
    hook: 'The Aztec emperor who welcomed Cortés — and lost an empire for it.',
    body: 'Moctezuma ruled a Tenochtitlan of a quarter-million people when the Spanish arrived. Whether he mistook them for gods is disputed; that his hesitation proved fatal is not.',
  },
  'timur': {
    hook: 'Claimed Genghis\'s mantle and left pyramids of skulls from Delhi to Damascus.',
    body: 'Lame in one leg ("Tamerlane"), he built a glittering capital at Samarkand while his campaigns killed millions. He died marching to conquer Ming China.',
  },
  'sun-tzu': {
    hook: 'Wrote the book on war — literally — 2,500 years ago.',
    body: '"The Art of War" still sits on the shelves of generals and CEOs alike. To prove a point to a skeptical king, he supposedly turned the royal concubines into a drilling army.',
  },
  'zhuge-liang': {
    hook: 'The strategist so cunning he won battles he had no army to fight.',
    body: 'Chancellor of Shu Han, he is the brain behind countless "Romance of the Three Kingdoms" legends — including the Empty Fort, where he bluffed an enemy army by calmly playing the zither at an open gate.',
  },
  'aristotle': {
    hook: 'Tutor to Alexander and a founding mind of Western science.',
    body: 'He wrote on logic, biology, ethics, poetry, and politics — and his framework dominated European thought for nearly two thousand years. He was, by trade, also a marine biologist.',
  },
  'machiavelli': {
    hook: 'Gave his name to ruthless cunning — but meant it as practical advice.',
    body: '"The Prince" argued that a ruler must sometimes choose fear over love and results over virtue. A Florentine diplomat, he wrote it partly hoping to win back a job after being tortured and exiled.',
  },
  'hannibal-barca': {
    hook: 'Marched war elephants over the Alps to bring Rome to its knees.',
    body: 'For 15 years he ravaged Italy and annihilated a larger Roman army at Cannae — still taught as the perfect battle of encirclement. Rome only beat him by attacking his home, Carthage.',
  },
  'yi-sun-sin': {
    hook: 'Won every one of his naval battles — including one at 13 ships against 333.',
    body: 'The Korean admiral\'s armoured "turtle ships" shattered Japan\'s invasion fleets. He died in his final victory, struck by a bullet, ordering his men to hide his death so the battle would not falter.',
  },
  'khalid-ibn-al-walid': {
    hook: 'Undefeated in over a hundred battles, he toppled two empires.',
    body: 'The "Drawn Sword of God" shattered both Byzantine and Sasanian armies, winning the Levant for the early Caliphate. He died in bed, lamenting that a warrior of his record should not.',
  },
  'subotai': {
    hook: 'Genghis\'s greatest general — and one of history\'s most successful.',
    body: 'He directed campaigns across an unmatched span of territory, coordinating armies hundreds of miles apart by relay. The son of a blacksmith, he conquered or raided some thirty nations.',
  },
  'saladin': {
    hook: 'Retook Jerusalem from the Crusaders — and won their respect doing it.',
    body: 'Sultan of Egypt and Syria, he united the Muslim world and beat the Crusader states at Hattin. Famous for his chivalry, he sent his own doctor and gifts of fruit and ice to his sick rival, Richard the Lionheart.',
  },
  'erwin-rommel': {
    hook: 'The "Desert Fox," respected even by the enemies he outmanoeuvred.',
    body: 'His Afrika Korps ran rings around Allied forces in North Africa. Implicated in the plot to kill Hitler, he was forced to take poison in exchange for his family\'s safety.',
  },
  'cleopatra-vii': {
    hook: 'The last pharaoh — who spoke nine languages and seduced two Roman titans.',
    body: 'Cleopatra allied with Caesar and then Mark Antony to keep Egypt independent. Greek by descent, she was the first of her dynasty to learn Egyptian. Her death by asp is legend; poison is likelier.',
  },
  'kublai-khan': {
    hook: 'Grandson of Genghis who conquered China and hosted Marco Polo.',
    body: 'He founded the Yuan dynasty and a "stately pleasure-dome" at Xanadu. His attempts to invade Japan were twice wrecked by typhoons the Japanese called kamikaze — "divine wind."',
  },
  'mehmed-ii': {
    hook: 'Took Constantinople at 21 and ended the Roman Empire for good.',
    body: 'The Ottoman sultan breached the legendary walls with the largest cannon yet built, and hauled warships overland to bypass the chain across the Golden Horn. He styled himself heir to the Caesars.',
  },
  'confucius': {
    hook: 'A wandering teacher whose ideas shaped half the world\'s population.',
    body: 'He never held high office, yet his teachings on virtue, family, and good government became the backbone of Chinese civilisation for two millennia. His collected sayings fill the "Analects."',
  },
  'karl-marx': {
    hook: 'A broke journalist whose book started revolutions on every continent.',
    body: 'Marx co-wrote "The Communist Manifesto" and spent decades in the British Library writing "Das Kapital." Largely ignored in his lifetime, he reshaped the 20th century after his death.',
  },
  'mahatma-gandhi': {
    hook: 'Toppled the British Empire with salt, spinning wheels, and no weapons.',
    body: 'His nonviolent resistance freed India and inspired Martin Luther King Jr. and Mandela. He owned almost nothing, walked hundreds of miles in protest, and was assassinated months after independence.',
  },
  'plato': {
    hook: 'Asked what justice is — and Western philosophy has been answering ever since.',
    body: 'Student of Socrates, teacher of Aristotle, he founded the Academy and wrote dialogues on everything from love to the ideal state. The whole tradition, one scholar quipped, is "footnotes to Plato."',
  },
  'mao-zedong': {
    hook: 'Won a continent with peasant armies — then convulsed it for decades.',
    body: 'He led the Communists to victory in 1949 and founded the People\'s Republic. His Great Leap Forward and Cultural Revolution caused tens of millions of deaths and upheavals.',
  },
  'vladimir-lenin': {
    hook: 'Returned from exile in a sealed train and seized an empire.',
    body: 'He led the Bolshevik Revolution and founded the Soviet Union, the first communist state. The Germans smuggled him into Russia hoping he\'d cause chaos — he did far more than they bargained for.',
  },
  'joan-of-arc': {
    hook: 'A teenage peasant who led France\'s armies on the word of angels.',
    body: 'Claiming visions, she rallied the French to lift the siege of Orléans and crown a king. Captured and burned at 19, she was made a saint five centuries later.',
  },
  'nelson-mandela': {
    hook: 'Spent 27 years in prison, then walked out and forgave his jailers.',
    body: 'He led the fight against apartheid and became South Africa\'s first Black president, choosing reconciliation over revenge. He shared a Nobel Peace Prize with the man who freed him.',
  },
  'sitting-bull': {
    hook: 'The Lakota holy man whose vision foretold Custer\'s last stand.',
    body: 'He united the Sioux against the U.S. Army and saw their victory at Little Bighorn in a vision before it happened. Later a star of Buffalo Bill\'s Wild West show, he was killed by police arresting him.',
  },
  'winston-churchill': {
    hook: 'Rallied a nation with words when it stood alone against Hitler.',
    body: 'Half-American, a painter and Nobel laureate in Literature, he led Britain through its darkest hour with bulldog defiance and unforgettable speeches. Voted out the moment the war was won.',
  },
  'george-washington': {
    hook: 'Won a revolution, then handed power back — and stunned the world.',
    body: 'He led ragged colonists to beat the British Empire, chaired the writing of the Constitution, and walked away after two terms when he could have been king. A staggering moment of restraint.',
  },
  'abraham-lincoln': {
    hook: 'Held a nation together through civil war and ended American slavery.',
    body: 'Self-taught from frontier poverty, he wrote the Emancipation Proclamation and the Gettysburg Address. He was assassinated days after the war ended, at the moment of victory.',
  },
  'catherine-the-great': {
    hook: 'A German princess who seized Russia\'s throne and made it a great power.',
    body: 'She overthrew her own husband, expanded the empire, and traded letters with Enlightenment philosophers. A patron of art and learning — and the source of endless (mostly invented) gossip.',
  },
  'peter-the-great': {
    hook: 'Dragged Russia into the modern age — sometimes by the beard.',
    body: 'He toured Europe in disguise to learn shipbuilding, founded St. Petersburg on a swamp, and taxed beards to westernise his court. He stood nearly seven feet tall.',
  },
  'suleiman-the-magnificent': {
    hook: 'Brought the Ottoman Empire to its dazzling peak.',
    body: 'Lawgiver, poet, and conqueror, he besieged Vienna, ruled from Baghdad to Algiers, and presided over a golden age of art and architecture. His love letters to Roxelana survive.',
  },
  'elizabeth-i': {
    hook: 'The "Virgin Queen" who defeated the Spanish Armada and named an age.',
    body: 'She steadied a divided England, championed Shakespeare\'s stage, and ruled 44 years without marrying — playing suitors against each other to keep her crown and her country free.',
  },
  'hernan-cortes': {
    hook: 'Burned his own ships so his men could not turn back.',
    body: 'With a few hundred soldiers, native allies, and smallpox doing much of the work, he toppled the Aztec Empire. A ruthless gambler who defied his own governor to do it.',
  },
  'akbar-the-great': {
    hook: 'The illiterate Mughal emperor who built an empire on tolerance.',
    body: 'He could not read, yet kept a vast library and hosted debates among Hindus, Muslims, Christians, and Jains. He abolished the tax on non-Muslims and ruled most of the subcontinent.',
  },
  'miyamoto-musashi': {
    hook: 'Undefeated in 61 duels — some won with a wooden sword.',
    body: 'Japan\'s legendary swordsman fought his first duel at 13 and later founded a two-sword style. In his final years he wrote "The Book of Five Rings," still read as a classic of strategy.',
  },
  'horatio-nelson': {
    hook: 'Lost an arm and an eye, then crushed Napoleon\'s fleet at Trafalgar.',
    body: 'Britain\'s greatest admiral won by breaking every rule of naval line warfare. He died in the hour of his triumph, signalling "England expects that every man will do his duty."',
  },
  'ramesses-ii': {
    hook: 'Reigned 66 years, fathered 100 children, and built like a god.',
    body: 'Ramesses the Great plastered Egypt with colossal statues of himself and signed history\'s first known peace treaty after the Battle of Kadesh — which he loudly claimed to have won.',
  },
  'boudica': {
    hook: 'The warrior queen who burned Roman London to the ground.',
    body: 'Flogged by Romans who seized her late husband\'s kingdom, she led a furious British revolt that destroyed three cities before being crushed. To the Romans she was a terror; to Britain, a legend.',
  },
  'wu-zetian': {
    hook: 'China\'s only female emperor — and she ruled with an iron hand.',
    body: 'She rose from concubine to sole ruler, founding her own dynasty and running a secret police to keep it. Capable and merciless, she expanded the empire and the civil-service exams alike.',
  },
  'charlemagne': {
    hook: 'United Western Europe and was crowned its first emperor since Rome.',
    body: '"The Father of Europe" conquered much of the continent, sparked a revival of learning, and was crowned Holy Roman Emperor on Christmas Day, 800. He never quite learned to write.',
  },
  'simon-bolivar': {
    hook: 'Liberated six nations from Spanish rule.',
    body: '"El Libertador" freed Venezuela, Colombia, Ecuador, Peru, Panama, and the country named for him — Bolivia. He dreamed of a united Latin America and died disillusioned that it fell to infighting.',
  },
  'tokugawa-ieyasu': {
    hook: 'Won the throne of Japan by outliving and outwaiting everyone else.',
    body: 'After victory at Sekigahara he founded a shogunate that ruled in peace for 250 years. "The patient one" — the man who, in the proverb, would wait for the bird to sing.',
  },
  'darius-i': {
    hook: 'Organised the Persian Empire into the ancient world\'s finest machine.',
    body: 'He built the Royal Road and a relay post system, standardised coinage, and dug an early Suez canal. His invasion of Greece, though, ended on the field of Marathon.',
  },
  'ashoka': {
    hook: 'Conquered with such bloodshed that he renounced war forever.',
    body: 'Horrified by the slaughter at Kalinga, the Mauryan emperor embraced Buddhism and spread it across Asia, carving edicts of tolerance and mercy into pillars still standing today.',
  },
  'otto-von-bismarck': {
    hook: 'Forged Germany with "blood and iron" — and kept the peace after.',
    body: 'The Iron Chancellor united dozens of states into an empire through three calculated wars, then spent twenty years building alliances to prevent the next one. He also invented the welfare state to outflank the socialists.',
  },
  'hatshepsut': {
    hook: 'One of Egypt\'s most successful pharaohs — who happened to be a woman.',
    body: 'She ruled for two decades of peace and prosperity, mounting grand trading expeditions and building works, sometimes depicted wearing a false beard. Successors later tried to erase her from the record.',
  },
  'nzinga-of-ndongo': {
    hook: 'Fought the Portuguese slave trade for thirty relentless years.',
    body: 'Queen of Ndongo and Matamba in present-day Angola, she was a master diplomat and guerrilla leader. Legend says that, offered no chair at a negotiation, she had a servant kneel as her throne.',
  },
  'sun-bin': {
    hook: 'Crippled by a jealous rival, he out-thought him to a famous death.',
    body: 'A descendant of Sun Tzu, his kneecaps were removed by the envious general Pang Juan. Sun Bin took his revenge at Maling, luring his rival into a night ambush by the light of a single tree.',
  },
};

const POSITION_LABELS: Record<string, string> = {
  commander: 'a commander', strategist: 'a strategist', general: 'a general',
  troops: 'fighting troops', allies: 'an ally',
};

function joinList(parts: string[]): string {
  if (parts.length <= 1) return parts[0] ?? '';
  if (parts.length === 2) return `${parts[0]} or ${parts[1]}`;
  return `${parts.slice(0, -1).join(', ')}, or ${parts[parts.length - 1]}`;
}

// Build a tasteful, fact-free overview from the figure's own attributes.
function generated(fig: FigureLike): Chronicle {
  const civ = fig.civ || fig.civilization || fig.regionName;
  const roles = (fig.eligible || fig.eligiblePositions || [])
    .map((k: string) => POSITION_LABELS[k]).filter(Boolean);
  const roleLine = roles.length ? `Serves as ${joinList(roles)}.` : '';
  const top = STAT_KEYS
    .map((k) => ({ k, v: fig.stats?.[k] ?? 0 }))
    .sort((a, b) => b.v - a.v)
    .slice(0, 2);
  const statLine = top.length
    ? `Strongest in ${top.map((s) => `${s.k} ${s.v}`).join(' and ')}.`
    : '';
  const tierWord = fig.tier === 'Legendary' ? 'A legendary force'
    : fig.tier === 'Elite' ? 'An elite presence'
    : fig.tier === 'Notable' ? 'A notable figure'
    : 'A figure';
  return {
    hook: `${civ} · ${fig.eraName}`,
    body: `${tierWord} of the ${fig.regionName} theatre. ${roleLine} ${statLine}`.replace(/\s+/g, ' ').trim(),
  };
}

export function chronicleFor(fig: FigureLike): Chronicle & { curated: boolean } {
  const c = fig && CURATED[fig.id];
  if (c) return { ...c, curated: true };
  return { ...generated(fig), curated: false };
}
