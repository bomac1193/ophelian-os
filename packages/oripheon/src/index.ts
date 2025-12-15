/**
 * Oripheon Character Generator
 * Adapted from the Oripheon project for Living Character OS
 * Generates mythic AI character profiles with rich names, personalities, and backstories
 */

// ============================================================================
// TYPES
// ============================================================================

export type Gender = 'male' | 'female' | 'androgynous';

export type HeritageCulture =
  | 'african_yoruba'
  | 'african_igbo'
  | 'arabic'
  | 'caucasian_european'
  | 'celtic'
  | 'norse_viking';

export type OrderType =
  | 'angel'
  | 'demon'
  | 'jinn'
  | 'human'
  | 'titan'
  | 'fae'
  | 'yokai'
  | 'elemental'
  | 'nephilim'
  | 'archon'
  | 'dragonkin'
  | 'construct'
  | 'eldritch'
  | 'trickster';

export type TarotArchetype =
  | 'fool'
  | 'magician'
  | 'high_priestess'
  | 'empress'
  | 'emperor'
  | 'hierophant'
  | 'lovers'
  | 'chariot'
  | 'strength'
  | 'hermit'
  | 'wheel_of_fortune'
  | 'justice'
  | 'hanged_man'
  | 'death'
  | 'temperance'
  | 'devil'
  | 'tower'
  | 'star'
  | 'moon'
  | 'sun'
  | 'judgement'
  | 'world';

export interface GeneratedCharacter {
  name: string;
  bio: string;
  aliases: string[];
  personaTags: string[];
  systemPrompt: string;
  toneAllowed: string[];
  toneForbidden: string[];
  // Extended Oripheon data
  meta: {
    seed: number;
    gender: Gender;
    heritage: string;
    order: OrderType;
    office: string;
    tarotArchetype: TarotArchetype;
    appearance: {
      ageAppearance: string;
      presentation: string;
      keyFeatures: string[];
    };
    personality: {
      axes: {
        orderVsChaos: number;
        mercyVsRuthlessness: number;
        introvertVsExtrovert: number;
        faithVsDoubt: number;
      };
      coreValues: string[];
    };
    mythos: {
      shortTitle: string;
      faction: string;
    };
    tasteProfile: {
      music: string[];
      fashion: string[];
      likes: string[];
      dislikes: string[];
    };
  };
}

export interface GenerationParams {
  seed?: number;
  gender?: Gender;
  heritage?: HeritageCulture;
  order?: OrderType;
}

// ============================================================================
// PRNG
// ============================================================================

type RNG = () => number;

function createRng(seed: number): RNG {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function randomChoice<T>(rng: RNG, list: T[]): T {
  return list[Math.floor(rng() * list.length)]!;
}

function randomFloat(rng: RNG, min = 0, max = 1): number {
  return min + rng() * (max - min);
}

function shuffle<T>(rng: RNG, list: T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

// ============================================================================
// DATA POOLS
// ============================================================================

const GENDERS: Gender[] = ['male', 'female', 'androgynous'];

const HERITAGE_CULTURES: HeritageCulture[] = [
  'african_yoruba',
  'african_igbo',
  'arabic',
  'caucasian_european',
  'celtic',
  'norse_viking',
];

const CULTURE_LABELS: Record<HeritageCulture, string> = {
  african_yoruba: 'Yoruba',
  african_igbo: 'Igbo',
  arabic: 'Arabic',
  caucasian_european: 'European',
  celtic: 'Celtic',
  norse_viking: 'Norse',
};

const CULTURE_NAMES: Record<HeritageCulture, { male: string[]; female: string[]; surnames: string[] }> = {
  african_yoruba: {
    male: ['Adeyemi', 'Babatunde', 'Olujinmi', 'Kayode', 'Adeola', 'Olamide'],
    female: ['Amara', 'Yetunde', 'Folake', 'Temitope', 'Adaora', 'Chimamanda'],
    surnames: ['Adebayo', 'Ogunleye', 'Okoya', 'Oshodi', 'Adesanya', 'Okonkwo'],
  },
  african_igbo: {
    male: ['Chinedu', 'Obinna', 'Emeka', 'Ugochukwu', 'Ikenna', 'Nnamdi'],
    female: ['Adaeze', 'Ngozi', 'Chimaka', 'Oluchi', 'Nneka', 'Chiamaka'],
    surnames: ['Okafor', 'Nwosu', 'Eze', 'Madu', 'Okwu', 'Anyanwu'],
  },
  arabic: {
    male: ['Idris', 'Jibril', 'Zayd', 'Karim', 'Rashid', 'Tariq'],
    female: ['Layla', 'Mariam', 'Soraya', 'Zahra', 'Fatima', 'Amira'],
    surnames: ['al-Harith', 'Rahman', 'Sarif', 'Mirza', 'Hakim', 'Nasser'],
  },
  caucasian_european: {
    male: ['Lucian', 'Matthias', 'Sebastian', 'Rene', 'Viktor', 'Aldric'],
    female: ['Elara', 'Vivienne', 'Isolde', 'Rowena', 'Seraphina', 'Morgana'],
    surnames: ['Kingsley', 'Vaughn', 'Sinclair', 'Bellerose', 'Ashford', 'Blackwood'],
  },
  celtic: {
    male: ['Finnian', 'Cormac', 'Ronan', 'Aeron', 'Brennan', 'Ciaran'],
    female: ['Eira', 'Niamh', 'Siobhan', 'Rhiannon', 'Brigid', 'Saoirse'],
    surnames: ['MacCrae', "O'Connell", 'Kavanagh', 'Rowntree', 'Brennan', 'Quinn'],
  },
  norse_viking: {
    male: ['Bjorn', 'Leif', 'Soren', 'Eirik', 'Ragnar', 'Thorin'],
    female: ['Astrid', 'Freya', 'Signe', 'Liv', 'Ingrid', 'Thyra'],
    surnames: ['Stormguard', 'Ulfrik', 'Ragnarsson', 'Skeld', 'Ironside', 'Wolfsbane'],
  },
};

const ORDER_TYPES: OrderType[] = [
  'angel', 'demon', 'jinn', 'human', 'titan', 'fae', 'yokai',
  'elemental', 'nephilim', 'archon', 'dragonkin', 'construct', 'eldritch', 'trickster',
];

const ORDER_OFFICES: Record<OrderType, string[]> = {
  angel: ['shield-bearer', 'prophet', 'librarian of echoes', 'witness of storms'],
  demon: ['whisper broker', 'bloodforger', 'temptation smith', 'night marshal'],
  jinn: ['sandseer', 'memory merchant', 'ember courier', 'mirage tactician'],
  human: ['wayfinder', 'blacksmith', 'seer', 'sky courier'],
  titan: ['world-shaper', 'primordial keeper', 'mountain sovereign', 'epoch warden'],
  fae: ['thorn prince', 'moonweaver', 'wild hunt master', 'glamour artist'],
  yokai: ['spirit guardian', 'shapeshifter sage', 'storm herald', 'boundary keeper'],
  elemental: ['flame warden', 'tide caller', 'earthshaker', 'wind whisper'],
  nephilim: ['skyborn warrior', 'giant-blood champion', 'earth shaker', 'star descendant'],
  archon: ['cosmic judge', 'reality weaver', 'demiurge', 'plane overseer'],
  dragonkin: ['wyrm-bound emissary', 'hoard augur', 'skyfire tactician', 'ember oathkeeper'],
  construct: ['clockwork adjutant', 'axiom engraver', 'lattice sentinel', 'memory ward'],
  eldritch: ['void cantor', 'dream fracture oracle', 'horizon unravelist', 'starless witness'],
  trickster: ['clown', 'troll', 'jester', 'prankster'],
};

const ORDER_THEMES: Record<OrderType, string> = {
  angel: 'celestial guardianship and sacred duty',
  demon: 'forbidden compacts and hidden power',
  jinn: 'desert winds, whispers, and smokeless flame',
  human: 'mortal ingenuity and resilient courage',
  titan: 'primordial strength that steadies worlds',
  fae: 'wild glamour and moonlit intrigue',
  yokai: 'spirit realms where shapes shift and teach',
  elemental: 'the raw chorus of earth, air, fire, and water',
  nephilim: 'sky-born might that bridges mortal and divine',
  archon: 'cosmic law and the architecture of reality',
  dragonkin: 'wyrmfire covenants and hoarded wisdom',
  construct: 'axiomatic purpose and timeless vigilance',
  eldritch: 'starless insight etched along the void',
  trickster: 'blasphemous mirth marrying sacred vows to chaotic pranks',
};

const TAROT_ARCHETYPES: TarotArchetype[] = [
  'fool', 'magician', 'high_priestess', 'empress', 'emperor', 'hierophant',
  'lovers', 'chariot', 'strength', 'hermit', 'wheel_of_fortune', 'justice',
  'hanged_man', 'death', 'temperance', 'devil', 'tower', 'star', 'moon',
  'sun', 'judgement', 'world',
];

const AGE_APPEARANCES = ['early 20s', 'late 20s', 'mid 30s', 'early 40s', 'ageless'];

const PRESENTATIONS = [
  'androgynous cyber mystic',
  'ornate desert paladin',
  'runed storm bard',
  'ashen shrine guardian',
  'chrome-plated oracle',
  'ethereal wanderer',
  'shadow-cloaked sentinel',
];

const FEATURES = [
  'eyes of liquid mercury',
  'sigil-tattooed palms',
  'voice with twin tones',
  'cloak woven from auroras',
  'braids tied with charms',
  'scar glowing ember-red',
  'floating prayer beads',
  'mechanical halo fragments',
  'crystalline tears',
  'shadow that moves independently',
];

const PERSONALITY_VALUES = [
  'loyalty', 'vision', 'sacred rebellion', 'discipline', 'secret compassion',
  'unyielding curiosity', 'ritual precision', 'protective fury', 'strategic mercy',
  'stoic resolve', 'wild freedom', 'ancient wisdom',
];

const FACTIONS = [
  'Choir of Rust',
  'Sable Caravan',
  'Chronicle Wardens',
  'Gilded Rift',
  'Order of the Dust Choir',
  'Midnight Assembly',
  'Ember Covenant',
];

const TASTE_MUSIC = ['polyphonic psalms', 'desert blues', 'glitch harps', 'northern war chants', 'cathedral jazz', 'ethereal ambient'];
const TASTE_FASHION = ['tasseled armor', 'mirror-lens veils', 'geomantic robes', 'feathered capes', 'sleek flight leathers', 'rune-etched vestments'];
const TASTE_LIKES = ['honest wagers', 'sunrise duels', 'archive dust', 'storm watching', 'quiet apprentices', 'ancient manuscripts'];
const TASTE_DISLIKES = ['false prophecies', 'untuned choirs', 'lawless portals', 'rusted promises', 'vacant thrones', 'broken oaths'];

const TONE_ALLOWED = ['mysterious', 'wise', 'commanding', 'compassionate', 'fierce', 'ethereal', 'cryptic', 'warm'];
const TONE_FORBIDDEN = ['crude', 'dismissive', 'apathetic', 'flippant'];

// ============================================================================
// GENERATOR
// ============================================================================

export function generateCharacter(params: GenerationParams = {}): GeneratedCharacter {
  const seed = params.seed ?? Math.floor(Math.random() * 10_000_000);
  const rng = createRng(seed);

  // Core attributes
  const gender = params.gender ?? randomChoice(rng, GENDERS);
  const heritage = params.heritage ?? randomChoice(rng, HERITAGE_CULTURES);
  const order = params.order ?? randomChoice(rng, ORDER_TYPES);
  const office = randomChoice(rng, ORDER_OFFICES[order]);
  const tarotArchetype = randomChoice(rng, TAROT_ARCHETYPES);

  // Generate name
  const cultureNames = CULTURE_NAMES[heritage];
  const namePool = gender === 'female' ? cultureNames.female : cultureNames.male;
  const firstName = randomChoice(rng, namePool);
  const lastName = randomChoice(rng, cultureNames.surnames);
  const fullName = `${firstName} ${lastName}`;

  // Generate aliases
  const heritageLabel = CULTURE_LABELS[heritage];
  const aliases = [
    `The ${randomChoice(rng, ['Wandering', 'Silent', 'Radiant', 'Shadow', 'Eternal'])} ${office.split(' ').pop()}`,
    `${heritageLabel} ${randomChoice(rng, ['Oracle', 'Sentinel', 'Keeper', 'Whisper'])}`,
  ];

  // Personality axes
  const axes = {
    orderVsChaos: Number(randomFloat(rng, 0, 1).toFixed(2)),
    mercyVsRuthlessness: Number(randomFloat(rng, 0, 1).toFixed(2)),
    introvertVsExtrovert: Number(randomFloat(rng, 0, 1).toFixed(2)),
    faithVsDoubt: Number(randomFloat(rng, 0, 1).toFixed(2)),
  };

  const coreValues = shuffle(rng, PERSONALITY_VALUES).slice(0, 3);

  // Appearance
  const appearance = {
    ageAppearance: randomChoice(rng, AGE_APPEARANCES),
    presentation: randomChoice(rng, PRESENTATIONS),
    keyFeatures: shuffle(rng, FEATURES).slice(0, 3),
  };

  // Mythos
  const shortTitle = `The ${randomChoice(rng, ['Angel', 'Shade', 'Herald', 'Seer', 'Blade'])} of ${randomChoice(rng, ['Chrome Rain', 'Silent Embers', 'Gilded Storms', 'Forgotten Rivers'])}`;
  const faction = randomChoice(rng, FACTIONS);

  // Taste profile
  const tasteProfile = {
    music: shuffle(rng, TASTE_MUSIC).slice(0, 2),
    fashion: shuffle(rng, TASTE_FASHION).slice(0, 2),
    likes: shuffle(rng, TASTE_LIKES).slice(0, 3),
    dislikes: shuffle(rng, TASTE_DISLIKES).slice(0, 2),
  };

  // Generate persona tags from attributes
  const personaTags = [
    order,
    tarotArchetype.replace(/_/g, ' '),
    ...coreValues.slice(0, 2),
    axes.introvertVsExtrovert > 0.5 ? 'extrovert' : 'introvert',
    axes.orderVsChaos > 0.5 ? 'disciplined' : 'chaotic',
  ];

  // Generate bio
  const bio = generateBio(fullName, heritage, order, office, tarotArchetype, axes, faction);

  // Generate system prompt
  const systemPrompt = generateSystemPrompt(fullName, order, office, axes, coreValues);

  // Select tones
  const toneAllowed = shuffle(rng, TONE_ALLOWED).slice(0, 4);
  const toneForbidden = shuffle(rng, TONE_FORBIDDEN).slice(0, 2);

  return {
    name: fullName,
    bio,
    aliases,
    personaTags,
    systemPrompt,
    toneAllowed,
    toneForbidden,
    meta: {
      seed,
      gender,
      heritage: heritageLabel,
      order,
      office,
      tarotArchetype,
      appearance,
      personality: { axes, coreValues },
      mythos: { shortTitle, faction },
      tasteProfile,
    },
  };
}

function generateBio(
  name: string,
  heritage: HeritageCulture,
  order: OrderType,
  office: string,
  tarot: TarotArchetype,
  axes: { orderVsChaos: number; mercyVsRuthlessness: number; introvertVsExtrovert: number; faithVsDoubt: number },
  faction: string
): string {
  const heritageLabel = CULTURE_LABELS[heritage];
  const orderTheme = ORDER_THEMES[order];
  const tarotLabel = tarot.replace(/_/g, ' ');

  const disposition = axes.introvertVsExtrovert > 0.5
    ? 'outward-facing and engaging'
    : 'reflective and contemplative';

  const approach = axes.orderVsChaos > 0.5
    ? 'methodical precision'
    : 'intuitive adaptability';

  return `${name} is a ${heritageLabel} ${order} who serves as ${office}. ` +
    `Embodying the archetype of the ${tarotLabel}, they are ${disposition}, approaching their duties with ${approach}. ` +
    `Their existence is woven with ${orderTheme}. ` +
    `They are aligned with the ${faction}, carrying ancient responsibilities into the modern age.`;
}

function generateSystemPrompt(
  name: string,
  order: OrderType,
  office: string,
  axes: { orderVsChaos: number; mercyVsRuthlessness: number; introvertVsExtrovert: number; faithVsDoubt: number },
  coreValues: string[]
): string {
  const orderTheme = ORDER_THEMES[order];

  const traits: string[] = [];
  traits.push(axes.orderVsChaos > 0.5 ? 'structured and deliberate' : 'spontaneous and adaptive');
  traits.push(axes.mercyVsRuthlessness > 0.5 ? 'compassionate' : 'unyielding');
  traits.push(axes.introvertVsExtrovert > 0.5 ? 'engaging and expressive' : 'measured and thoughtful');
  traits.push(axes.faithVsDoubt > 0.5 ? 'confident and assured' : 'questioning and curious');

  return `You are ${name}, a ${order} ${office}. Your essence draws from ${orderTheme}. ` +
    `You are ${traits.join(', ')}. Your core values are ${coreValues.join(', ')}. ` +
    `Speak with the weight of ages, yet remain approachable. Never break character.`;
}

/**
 * Generate a character with a specific seed for reproducibility
 */
export function generateCharacterWithSeed(seed: number): GeneratedCharacter {
  return generateCharacter({ seed });
}

/**
 * Regenerate a character with different options but same seed
 */
export function rerollCharacter(
  seed: number,
  overrides: Partial<GenerationParams> = {}
): GeneratedCharacter {
  return generateCharacter({ seed, ...overrides });
}
