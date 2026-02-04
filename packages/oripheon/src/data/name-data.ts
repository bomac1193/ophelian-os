/**
 * Name Generator Data
 * Heritage pools, blending syllables, animal pools, variance maps, aesthetics
 * Ported from Slayt characterGenerator.js
 */

// ============================================================================
// HERITAGE NAME POOLS
// ============================================================================

export type HeritageCulture =
  | 'african_yoruba'
  | 'african_igbo'
  | 'arabic'
  | 'caucasian_european'
  | 'celtic'
  | 'norse_viking';

export const HERITAGE_CULTURES: HeritageCulture[] = [
  'african_yoruba',
  'african_igbo',
  'arabic',
  'caucasian_european',
  'celtic',
  'norse_viking',
];

export const CULTURE_LABELS: Record<HeritageCulture, string> = {
  african_yoruba: 'Yoruba',
  african_igbo: 'Igbo',
  arabic: 'Arabic',
  caucasian_european: 'European',
  celtic: 'Celtic',
  norse_viking: 'Norse',
};

export const CULTURE_NAMES: Record<HeritageCulture, { male: string[]; female: string[]; surnames: string[] }> = {
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

// ============================================================================
// BLENDING SYLLABLE POOLS
// ============================================================================

export const NAME_SYLLABLES = {
  prefixes: [
    'Ae', 'Al', 'An', 'Ar', 'As', 'Ba', 'Be', 'Br', 'Ca', 'Ce', 'Chi', 'Ci', 'Da', 'De', 'Di',
    'El', 'Em', 'Er', 'Es', 'Fa', 'Fe', 'Ga', 'Gi', 'Ha', 'He', 'Id', 'Il', 'In', 'Is', 'Ja',
    'Ka', 'Ke', 'Ki', 'Ko', 'La', 'Le', 'Li', 'Lo', 'Lu', 'Ma', 'Me', 'Mi', 'Mo', 'Na', 'Ne',
    'Ni', 'No', 'Nu', 'Ob', 'Og', 'Ol', 'On', 'Or', 'Os', 'Ra', 'Re', 'Ri', 'Ro', 'Sa', 'Se',
    'Sh', 'Si', 'So', 'Ta', 'Te', 'Th', 'Ti', 'To', 'Tr', 'Ty', 'Ul', 'Um', 'Un', 'Va', 'Ve',
    'Vi', 'Vo', 'Wa', 'We', 'Ya', 'Ye', 'Yi', 'Za', 'Ze', 'Zi', 'Zo',
  ],
  middles: [
    'da', 'de', 'di', 'do', 'du', 'la', 'le', 'li', 'lo', 'lu', 'na', 'ne', 'ni', 'no', 'nu',
    'ra', 're', 'ri', 'ro', 'ru', 'sa', 'se', 'si', 'so', 'su', 'ta', 'te', 'ti', 'to', 'tu',
    'va', 've', 'vi', 'vo', 'vu', 'ka', 'ke', 'ki', 'ko', 'ku', 'ma', 'me', 'mi', 'mo', 'mu',
    'ba', 'be', 'bi', 'bo', 'bu', 'ga', 'ge', 'gi', 'go', 'gu', 'sha', 'shi', 'sho', 'cha',
    'chi', 'cho', 'tha', 'thi', 'tho', 'zha', 'zhi', 'zho', 'nda', 'ndi', 'mba', 'mbi',
  ],
  suffixes: [
    'a', 'ah', 'an', 'ar', 'as', 'ax', 'el', 'en', 'er', 'es', 'eth', 'ia', 'id', 'il', 'in',
    'ion', 'ir', 'is', 'ith', 'ix', 'o', 'on', 'or', 'os', 'oth', 'ox', 'u', 'uk', 'un', 'ur',
    'us', 'uth', 'yn', 'yr', 'ys', 'ae', 'ai', 'ao', 'ei', 'eo', 'io', 'iu', 'ou', 'ua', 'ue',
  ],
};

// ============================================================================
// BLENDED HERITAGE LABELS
// ============================================================================

export const BLENDED_HERITAGE_LABELS = [
  'Cosmopolitan',
  'Wanderer',
  'Nomadic',
  'Multiversal',
  'Transcendent',
  'Unbound',
  'Liminal',
  'Crossroads-born',
  'Wayward',
  'Starwoven',
  'Dreamforged',
  'Veilcrossed',
];

// ============================================================================
// ANIMAL NAME POOLS
// ============================================================================

export const MYTHICAL_BEASTS = [
  // Classic mythical
  'Griffin', 'Phoenix', 'Dragon', 'Sphinx', 'Chimera', 'Manticore', 'Basilisk',
  'Hydra', 'Pegasus', 'Unicorn', 'Cerberus', 'Minotaur', 'Centaur', 'Kraken',
  'Leviathan', 'Behemoth', 'Thunderbird', 'Roc', 'Wyvern', 'Cockatrice',
  // Cultural mythical
  'Kitsune', 'Tengu', 'Yokai', 'Tanuki', 'Qilin', 'Fenghuang', 'Naga',
  'Garuda', 'Simurgh', 'Lamassu', 'Ammit', 'Anubis', 'Sobek', 'Quetzal',
  // Fae and spirits
  'Selkie', 'Kelpie', 'Banshee', 'Dryad', 'Nymph', 'Sylph', 'Salamander',
  'Ifrit', 'Djinn', 'Golem', 'Wraith', 'Shade', 'Specter', 'Revenant',
  // Modern/fantasy
  'Direwolf', 'Shadowcat', 'Stormhawk', 'Voidwalker', 'Starweaver', 'Moonbeast',
  'Sunbird', 'Nightcrawler', 'Frostfang', 'Emberwing', 'Thornback', 'Ironhide',
];

export const REAL_ANIMALS = [
  // Predators
  'Wolf', 'Lion', 'Tiger', 'Panther', 'Leopard', 'Jaguar', 'Lynx', 'Fox',
  'Bear', 'Hawk', 'Eagle', 'Falcon', 'Owl', 'Raven', 'Crow', 'Vulture',
  'Shark', 'Viper', 'Cobra', 'Python', 'Scorpion', 'Spider', 'Mantis',
  // Majestic
  'Stag', 'Elk', 'Moose', 'Horse', 'Stallion', 'Mare', 'Ram', 'Bull',
  'Elephant', 'Rhino', 'Gorilla', 'Whale', 'Dolphin', 'Orca', 'Seal',
  // Birds
  'Swan', 'Crane', 'Heron', 'Peacock', 'Kingfisher', 'Jay', 'Magpie',
  'Sparrow', 'Finch', 'Robin', 'Wren', 'Lark', 'Nightingale', 'Dove',
  // Reptiles & others
  'Salamander', 'Newt', 'Frog', 'Toad', 'Turtle', 'Tortoise', 'Gecko',
  'Chameleon', 'Iguana', 'Monitor', 'Crocodile', 'Alligator',
  // Insects & small
  'Moth', 'Butterfly', 'Beetle', 'Ant', 'Bee', 'Wasp', 'Dragonfly',
  'Cricket', 'Cicada', 'Firefly', 'Ladybug', 'Scarab',
];

export const ALL_ANIMALS = [...MYTHICAL_BEASTS, ...REAL_ANIMALS];

// ============================================================================
// VARIANCE SUBSTITUTION MAPS
// ============================================================================

/** Mild letter substitutions — used when variance 0-50% */
export const LETTER_SUBS_MILD: Record<string, string[]> = {
  a: ['@', 'α'], e: ['3', 'ε'], i: ['1', 'ι'], o: ['0', 'ø'],
  s: ['$', '§'], t: ['+', '†'], n: ['η', 'ñ'], l: ['ℓ', '|'],
};

/** Heavy letter substitutions — used when variance > 50% */
export const LETTER_SUBS_HEAVY: Record<string, string[]> = {
  a: ['@', 'α', 'Δ', '∀', 'ä', 'â'], e: ['3', 'ε', '€', 'ξ', 'ë'],
  i: ['1', 'ι', '!', '¡', 'ï'], o: ['0', 'ø', 'Θ', '◯', 'ö'],
  s: ['$', '§', '5', 'Σ', 'ß'], t: ['+', '†', '‡', '7', 'τ'],
  n: ['η', 'ñ', 'π', '∩'], l: ['ℓ', '|', '£', 'Λ', '1'],
  r: ['®', 'ℝ', 'я'], c: ['(', '¢', '©'], g: ['9', 'ğ'],
  b: ['ß', '6', '♭'], d: ['∂', 'ð'], f: ['ƒ', 'φ'],
  h: ['#', 'ħ'], k: ['κ', 'ĸ'], m: ['μ', '♏'], p: ['ρ', '¶'],
  u: ['µ', 'ü', 'ú', '∪'], v: ['√', '∨'], w: ['ω', 'ψ'],
  x: ['×', '✖', 'χ'], y: ['¥', 'ψ', 'ÿ'], z: ['ζ', '2'],
};

/** Glitch combining diacritics — used at >75% variance */
export const GLITCH_GLYPHS = ['̸', '̷', '̶', '̴', '̵', '͓', '͎', '͙', '͚', '͖'];

/** Spacing characters for variance distortion */
export const SPACING_CHARS = [' ', ' ', '\u2009', '\u200A', '\u2006'];

// ============================================================================
// 8 AESTHETIC ADORNMENT SYSTEMS
// ============================================================================

export type AestheticCore =
  | 'drowned_mall'
  | 'hex_garden'
  | 'sugar_rot'
  | 'dead_channel'
  | 'spore_drift'
  | 'wrong_room'
  | 'bone_clean'
  | 'lambda';

export const AESTHETIC_CORES: AestheticCore[] = [
  'drowned_mall', 'hex_garden', 'sugar_rot', 'dead_channel',
  'spore_drift', 'wrong_room', 'bone_clean', 'lambda',
];

export const CORE_SYMBOLS: Record<AestheticCore, { prefix: string[]; suffix: string[]; wrap: [string, string][] }> = {
  drowned_mall: {
    prefix: ['永', '夢', '新', '愛', '空', '星', '月', '光', '幻', '神'],
    suffix: ['永', '夢', '新', '愛', '空', '星', '月', '光', '幻', '神'],
    wrap: [['永 ', ' 夢'], ['｢', '｣'], ['【', '】'], ['「', '」'], ['『', '』'], ['〖', '〗']],
  },
  hex_garden: {
    prefix: ['☽', '✧', '☆', '⁂', '✦', '◈', '❋', '✵', '❂', '☾'],
    suffix: ['☾', '✧', '☆', '⁂', '✦', '◈', '❋', '✵', '❂', '☽'],
    wrap: [['☽ ', ' ☾'], ['✧ ', ' ✧'], ['⁂ ', ' ⁂'], ['✦ ', ' ✦'], ['☆ ', ' ☆']],
  },
  sugar_rot: {
    prefix: ['xX', '~', '★', '♥', '✖', '☆', '♪', '⚡', '✿', '❤'],
    suffix: ['Xx', '~', '★', '♥', '✖', '☆', '♪', '⚡', '✿', '❤'],
    wrap: [['xX', 'Xx'], ['~', '~'], ['★', '★'], ['xX★', '★Xx'], ['♥', '♥'], ['x', 'x']],
  },
  dead_channel: {
    prefix: ['†', '‡', '∆', 'Ω', 'Ξ', '◊', '▼', '■', '●', '◆'],
    suffix: ['†', '‡', '∆', 'Ω', 'Ξ', '◊', '▲', '■', '●', '◆'],
    wrap: [['†', '†'], ['∆', '∆'], ['▼', '▲'], ['◊', '◊'], ['‡', '‡'], ['Ω', 'Ω']],
  },
  spore_drift: {
    prefix: ['✿', '❀', '☘', '⚘', '❁', '✾', '❃', '✤', '✥', '❋'],
    suffix: ['✿', '❀', '☘', '⚘', '❁', '✾', '❃', '✤', '✥', '❋'],
    wrap: [['✿ ', ' ✿'], ['❀ ', ' ❀'], ['☘ ', ' ☘'], ['⚘ ', ' ⚘'], ['✾ ', ' ✾']],
  },
  wrong_room: {
    prefix: ['▲', '◯', '◇', '⌂', '░', '▓', '◉', '◎', '☐', '⊕'],
    suffix: ['▲', '◯', '◇', '⌂', '░', '▓', '◉', '◎', '☐', '⊕'],
    wrap: [['▲▲ ', ' ▲▲'], ['◇ ', ' ◇'], ['░░ ', ' ░░'], ['⌂ ', ' ⌂'], ['◯ ', ' ◯']],
  },
  bone_clean: {
    prefix: ['—', '·', '|', '/', '\\'],
    suffix: ['—', '·', '|', '/', '\\'],
    wrap: [['— ', ' —'], ['· ', ' ·'], ['| ', ' |'], ['/ ', ' /'], ['. ', ' .']],
  },
  lambda: {
    prefix: ['Σ', 'Λ', 'Δ', 'Π', 'Ψ', 'Φ', 'Θ', 'Ω', 'ℵ', '∂'],
    suffix: ['Σ', 'Λ', 'Δ', 'Π', 'Ψ', 'Φ', 'Θ', 'Ω', 'ℵ', '∂'],
    wrap: [['λ(', ')'], ['Σ{', '}'], ['∀ ', ' ∃'], ['⟨', '⟩'], ['∫ ', ' dx'], ['Λ.', '.Ω']],
  },
};

/** Labels for aesthetic cores (display in UI) */
export const AESTHETIC_CORE_LABELS: Record<AestheticCore, string> = {
  drowned_mall: 'Drowned Mall (永夢)',
  hex_garden: 'Hex Garden (☽☾)',
  sugar_rot: 'Sugar Rot (xX★Xx)',
  dead_channel: 'Dead Channel (†∆)',
  spore_drift: 'Spore Drift (✿❀)',
  wrong_room: 'Wrong Room (▲◇)',
  bone_clean: 'Bone Clean (—·)',
  lambda: 'Lambda (Σ∂)',
};

/** Maps old core names to new canonical names for backwards compatibility */
export const LEGACY_CORE_MAP: Record<string, AestheticCore> = {
  vaporwave: 'drowned_mall',
  witchy: 'hex_garden',
  scene: 'sugar_rot',
  cybergoth: 'dead_channel',
  fairycore: 'spore_drift',
  weirdcore: 'wrong_room',
};
