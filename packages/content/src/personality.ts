/**
 * Personality Generation Module
 * Adapted from Oripheon project for character-authentic content generation
 */

import type { Character } from '@lcos/shared';

// Seeded PRNG for reproducible generation
export function createRng(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

export function randomChoice<T>(rng: () => number, list: T[]): T {
  return list[Math.floor(rng() * list.length)]!;
}

export function shuffle<T>(rng: () => number, list: T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

// Personality axis values
export interface PersonalityAxes {
  orderVsChaos: number; // 0 = chaotic, 1 = orderly
  mercyVsRuthlessness: number; // 0 = ruthless, 1 = merciful
  introvertVsExtrovert: number; // 0 = introvert, 1 = extrovert
  faithVsDoubt: number; // 0 = doubtful, 1 = faithful
}

// Voice/Tone descriptors based on personality
const VOICE_TONES = {
  chaotic: ['unpredictable', 'wild', 'spontaneous', 'irreverent'],
  orderly: ['measured', 'precise', 'deliberate', 'structured'],
  ruthless: ['sharp', 'cutting', 'uncompromising', 'direct'],
  merciful: ['warm', 'gentle', 'understanding', 'compassionate'],
  introvert: ['reflective', 'thoughtful', 'subtle', 'understated'],
  extrovert: ['bold', 'energetic', 'expressive', 'engaging'],
  faithful: ['confident', 'assured', 'resolute', 'unwavering'],
  doubtful: ['questioning', 'probing', 'curious', 'searching'],
};

// Writing style modifiers
const STYLE_MODIFIERS = {
  intellectual: ['analytical', 'philosophical', 'thought-provoking'],
  emotional: ['heartfelt', 'passionate', 'evocative'],
  playful: ['witty', 'humorous', 'lighthearted'],
  serious: ['grave', 'solemn', 'weighty'],
  cryptic: ['mysterious', 'enigmatic', 'suggestive'],
  direct: ['straightforward', 'clear', 'no-nonsense'],
};

// Content archetypes based on tarot
const CONTENT_ARCHETYPES: Record<string, { themes: string[]; openings: string[] }> = {
  fool: {
    themes: ['new beginnings', 'innocence', 'spontaneity', 'adventure'],
    openings: ['What if...', 'Imagine...', 'Let me tell you about...'],
  },
  magician: {
    themes: ['manifestation', 'skill', 'power', 'action'],
    openings: ['Here is the secret...', 'Watch closely...', 'The key is...'],
  },
  high_priestess: {
    themes: ['intuition', 'mystery', 'hidden knowledge', 'inner voice'],
    openings: ['Listen...', 'Between the lines...', 'What lies beneath...'],
  },
  empress: {
    themes: ['abundance', 'nurturing', 'creativity', 'growth'],
    openings: ['Let this bloom...', 'Nurture this...', 'From the heart...'],
  },
  emperor: {
    themes: ['authority', 'structure', 'leadership', 'stability'],
    openings: ['The foundation is...', 'Stand firm...', 'Build upon...'],
  },
  hierophant: {
    themes: ['tradition', 'teaching', 'guidance', 'wisdom'],
    openings: ['The ancients knew...', 'Learn this...', 'Wisdom says...'],
  },
  lovers: {
    themes: ['choice', 'union', 'harmony', 'relationships'],
    openings: ['When two become...', 'Choose wisely...', 'Together...'],
  },
  chariot: {
    themes: ['victory', 'willpower', 'determination', 'triumph'],
    openings: ['Charge forward...', 'Victory awaits...', 'Take control...'],
  },
  strength: {
    themes: ['courage', 'inner strength', 'patience', 'compassion'],
    openings: ['True strength is...', 'Courage means...', 'Face this...'],
  },
  hermit: {
    themes: ['solitude', 'soul-searching', 'inner guidance', 'contemplation'],
    openings: ['In silence...', 'Look within...', 'Alone, we find...'],
  },
  wheel_of_fortune: {
    themes: ['change', 'cycles', 'fate', 'destiny'],
    openings: ['The wheel turns...', 'Change comes...', 'Destiny calls...'],
  },
  justice: {
    themes: ['truth', 'fairness', 'law', 'accountability'],
    openings: ['The truth is...', 'Justice demands...', 'Balance requires...'],
  },
  hanged_man: {
    themes: ['sacrifice', 'perspective', 'letting go', 'suspension'],
    openings: ['Sometimes you must...', 'Surrender to...', 'Let go of...'],
  },
  death: {
    themes: ['endings', 'transformation', 'transition', 'rebirth'],
    openings: ['What must end...', 'Transform...', 'Rise from...'],
  },
  temperance: {
    themes: ['balance', 'moderation', 'patience', 'purpose'],
    openings: ['Find the balance...', 'Patience reveals...', 'Blend...'],
  },
  devil: {
    themes: ['shadow', 'bondage', 'materialism', 'temptation'],
    openings: ["Don't be fooled...", 'Break free from...', 'The shadow shows...'],
  },
  tower: {
    themes: ['upheaval', 'revelation', 'awakening', 'liberation'],
    openings: ['The walls fall...', 'Shatter the...', 'Revelation strikes...'],
  },
  star: {
    themes: ['hope', 'inspiration', 'serenity', 'renewal'],
    openings: ['Hope shines...', 'Be renewed...', 'Stars guide...'],
  },
  moon: {
    themes: ['illusion', 'fear', 'subconscious', 'intuition'],
    openings: ['In the moonlight...', 'Beyond illusion...', 'Dreams reveal...'],
  },
  sun: {
    themes: ['joy', 'success', 'vitality', 'celebration'],
    openings: ['Celebrate...', 'Joy awaits...', 'Shine bright...'],
  },
  judgement: {
    themes: ['rebirth', 'calling', 'absolution', 'reckoning'],
    openings: ['The call comes...', 'Rise to...', 'Answer now...'],
  },
  world: {
    themes: ['completion', 'integration', 'accomplishment', 'wholeness'],
    openings: ['The circle completes...', 'All comes together...', 'Wholeness is...'],
  },
};

// Heritage-influenced speech patterns
const HERITAGE_PATTERNS: Record<string, { phrases: string[]; cadence: string }> = {
  african_yoruba: {
    phrases: ['As the ancestors say', 'In the way of Ogun', 'By Yemoja\'s grace'],
    cadence: 'rhythmic and proverbial',
  },
  african_igbo: {
    phrases: ['Nwanne', 'As we say at home', 'The kola nut teaches'],
    cadence: 'communal and narrative',
  },
  arabic: {
    phrases: ['Inshallah', 'By the desert winds', 'As the poets wrote'],
    cadence: 'poetic and ornate',
  },
  caucasian_european: {
    phrases: ['In the old tradition', 'As the scholars note', 'The classics teach'],
    cadence: 'formal and structured',
  },
  celtic: {
    phrases: ['By the old ways', 'As the druids knew', 'The mists reveal'],
    cadence: 'mystical and flowing',
  },
  norse_viking: {
    phrases: ['By Odin\'s wisdom', 'As the sagas tell', 'In the warrior\'s way'],
    cadence: 'bold and declarative',
  },
};

export interface PersonalityProfile {
  axes: PersonalityAxes;
  primaryTone: string;
  secondaryTone: string;
  styleModifier: string;
  archetype: string;
  heritage: string;
  contentThemes: string[];
  preferredOpenings: string[];
  speechPatterns: string[];
}

/**
 * Generate a personality profile from a character
 * Uses character attributes to derive consistent personality traits
 */
export function generatePersonalityProfile(character: Character): PersonalityProfile {
  // Create seeded RNG from character ID for reproducibility
  const seed = character.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rng = createRng(seed);

  // Generate personality axes (or derive from character tags/bio)
  const axes = derivePersonalityAxes(character, rng);

  // Determine primary and secondary tones from axes
  const primaryTone = determinePrimaryTone(axes, rng);
  const secondaryTone = determineSecondaryTone(axes, rng);

  // Select style modifier based on character bio keywords
  const styleModifier = selectStyleModifier(character, rng);

  // Select archetype (tarot-based)
  const archetype = selectArchetype(character, rng);
  const archetypeData = CONTENT_ARCHETYPES[archetype] || CONTENT_ARCHETYPES['fool']!;

  // Determine heritage influence (default to european if not specified)
  const heritage = determineHeritage(character, rng);
  const heritageData = HERITAGE_PATTERNS[heritage] || HERITAGE_PATTERNS['caucasian_european']!;

  return {
    axes,
    primaryTone,
    secondaryTone,
    styleModifier,
    archetype,
    heritage,
    contentThemes: archetypeData.themes,
    preferredOpenings: archetypeData.openings,
    speechPatterns: heritageData.phrases,
  };
}

function derivePersonalityAxes(character: Character, rng: () => number): PersonalityAxes {
  // Try to derive from persona tags, otherwise generate randomly
  const tags = character.personaTags || [];
  const bio = character.bio || '';
  const lowerBio = bio.toLowerCase();
  const lowerTags = tags.map((t) => t.toLowerCase());

  let orderVsChaos = 0.5;
  let mercyVsRuthlessness = 0.5;
  let introvertVsExtrovert = 0.5;
  let faithVsDoubt = 0.5;

  // Analyze tags and bio for personality hints
  if (lowerTags.includes('chaotic') || lowerBio.includes('chaos') || lowerBio.includes('wild')) {
    orderVsChaos = 0.2 + rng() * 0.2;
  } else if (lowerTags.includes('orderly') || lowerBio.includes('order') || lowerBio.includes('discipline')) {
    orderVsChaos = 0.7 + rng() * 0.3;
  } else {
    orderVsChaos = rng();
  }

  if (lowerTags.includes('ruthless') || lowerBio.includes('ruthless') || lowerBio.includes('cold')) {
    mercyVsRuthlessness = rng() * 0.3;
  } else if (lowerTags.includes('merciful') || lowerBio.includes('compassion') || lowerBio.includes('kind')) {
    mercyVsRuthlessness = 0.7 + rng() * 0.3;
  } else {
    mercyVsRuthlessness = rng();
  }

  if (lowerTags.includes('introvert') || lowerBio.includes('quiet') || lowerBio.includes('solitary')) {
    introvertVsExtrovert = rng() * 0.3;
  } else if (lowerTags.includes('extrovert') || lowerBio.includes('bold') || lowerBio.includes('outgoing')) {
    introvertVsExtrovert = 0.7 + rng() * 0.3;
  } else {
    introvertVsExtrovert = rng();
  }

  if (lowerTags.includes('faithful') || lowerBio.includes('faith') || lowerBio.includes('believe')) {
    faithVsDoubt = 0.7 + rng() * 0.3;
  } else if (lowerTags.includes('doubtful') || lowerBio.includes('question') || lowerBio.includes('skeptic')) {
    faithVsDoubt = rng() * 0.3;
  } else {
    faithVsDoubt = rng();
  }

  return {
    orderVsChaos: Number(orderVsChaos.toFixed(2)),
    mercyVsRuthlessness: Number(mercyVsRuthlessness.toFixed(2)),
    introvertVsExtrovert: Number(introvertVsExtrovert.toFixed(2)),
    faithVsDoubt: Number(faithVsDoubt.toFixed(2)),
  };
}

function determinePrimaryTone(axes: PersonalityAxes, rng: () => number): string {
  // Pick primary tone based on strongest axis
  const axisStrengths = [
    { axis: 'order', value: axes.orderVsChaos, tones: VOICE_TONES.orderly },
    { axis: 'chaos', value: 1 - axes.orderVsChaos, tones: VOICE_TONES.chaotic },
    { axis: 'mercy', value: axes.mercyVsRuthlessness, tones: VOICE_TONES.merciful },
    { axis: 'ruthless', value: 1 - axes.mercyVsRuthlessness, tones: VOICE_TONES.ruthless },
    { axis: 'extrovert', value: axes.introvertVsExtrovert, tones: VOICE_TONES.extrovert },
    { axis: 'introvert', value: 1 - axes.introvertVsExtrovert, tones: VOICE_TONES.introvert },
    { axis: 'faith', value: axes.faithVsDoubt, tones: VOICE_TONES.faithful },
    { axis: 'doubt', value: 1 - axes.faithVsDoubt, tones: VOICE_TONES.doubtful },
  ];

  // Find strongest trait
  const sorted = axisStrengths.sort((a, b) => b.value - a.value);
  const strongest = sorted[0]!;

  return randomChoice(rng, strongest.tones);
}

function determineSecondaryTone(axes: PersonalityAxes, rng: () => number): string {
  // Pick secondary tone from second strongest axis
  const axisStrengths = [
    { value: axes.orderVsChaos, tones: VOICE_TONES.orderly },
    { value: 1 - axes.orderVsChaos, tones: VOICE_TONES.chaotic },
    { value: axes.mercyVsRuthlessness, tones: VOICE_TONES.merciful },
    { value: 1 - axes.mercyVsRuthlessness, tones: VOICE_TONES.ruthless },
  ];

  const sorted = axisStrengths.sort((a, b) => b.value - a.value);
  const secondStrong = sorted[1]!;

  return randomChoice(rng, secondStrong.tones);
}

function selectStyleModifier(character: Character, rng: () => number): string {
  const bio = (character.bio || '').toLowerCase();
  const tags = (character.personaTags || []).map((t) => t.toLowerCase());

  // Try to match based on keywords
  if (bio.includes('intellect') || bio.includes('scholar') || tags.includes('intellectual')) {
    return randomChoice(rng, STYLE_MODIFIERS.intellectual);
  }
  if (bio.includes('emotion') || bio.includes('heart') || tags.includes('emotional')) {
    return randomChoice(rng, STYLE_MODIFIERS.emotional);
  }
  if (bio.includes('humor') || bio.includes('wit') || tags.includes('playful')) {
    return randomChoice(rng, STYLE_MODIFIERS.playful);
  }
  if (bio.includes('serious') || bio.includes('grave') || tags.includes('serious')) {
    return randomChoice(rng, STYLE_MODIFIERS.serious);
  }
  if (bio.includes('mystery') || bio.includes('enigma') || tags.includes('cryptic')) {
    return randomChoice(rng, STYLE_MODIFIERS.cryptic);
  }
  if (bio.includes('direct') || bio.includes('blunt') || tags.includes('direct')) {
    return randomChoice(rng, STYLE_MODIFIERS.direct);
  }

  // Random selection if no match
  const allModifiers = Object.values(STYLE_MODIFIERS).flat();
  return randomChoice(rng, allModifiers);
}

function selectArchetype(character: Character, rng: () => number): string {
  const bio = (character.bio || '').toLowerCase();
  const tags = (character.personaTags || []).map((t) => t.toLowerCase());

  // Keyword to archetype mapping
  const keywordMap: Record<string, string[]> = {
    fool: ['innocent', 'naive', 'beginning', 'adventure', 'spontaneous'],
    magician: ['magic', 'power', 'skill', 'manifestation'],
    high_priestess: ['intuition', 'mystery', 'psychic', 'secret'],
    empress: ['nurture', 'abundance', 'mother', 'fertility', 'creative'],
    emperor: ['authority', 'leader', 'father', 'structure', 'power'],
    hierophant: ['teacher', 'tradition', 'guide', 'wisdom', 'spiritual'],
    lovers: ['love', 'choice', 'harmony', 'union', 'relationship'],
    chariot: ['victory', 'determination', 'willpower', 'conquest'],
    strength: ['courage', 'strength', 'patience', 'brave'],
    hermit: ['solitude', 'seeker', 'wisdom', 'alone', 'introspective'],
    wheel_of_fortune: ['fate', 'destiny', 'change', 'fortune'],
    justice: ['justice', 'truth', 'fairness', 'law'],
    hanged_man: ['sacrifice', 'perspective', 'surrender'],
    death: ['transformation', 'change', 'ending', 'rebirth'],
    temperance: ['balance', 'moderation', 'patience'],
    devil: ['shadow', 'temptation', 'darkness', 'bondage'],
    tower: ['upheaval', 'revelation', 'chaos', 'awakening'],
    star: ['hope', 'inspiration', 'healing', 'serenity'],
    moon: ['illusion', 'fear', 'subconscious', 'dreams'],
    sun: ['joy', 'success', 'vitality', 'happiness'],
    judgement: ['rebirth', 'calling', 'reckoning', 'awakening'],
    world: ['completion', 'accomplishment', 'wholeness'],
  };

  // Check for keyword matches
  for (const [archetype, keywords] of Object.entries(keywordMap)) {
    for (const keyword of keywords) {
      if (bio.includes(keyword) || tags.includes(keyword)) {
        return archetype;
      }
    }
  }

  // Random selection if no match
  return randomChoice(rng, Object.keys(CONTENT_ARCHETYPES));
}

function determineHeritage(character: Character, rng: () => number): string {
  const bio = (character.bio || '').toLowerCase();
  const tags = (character.personaTags || []).map((t) => t.toLowerCase());

  // Heritage keyword mapping
  const heritageKeywords: Record<string, string[]> = {
    african_yoruba: ['yoruba', 'nigeria', 'african', 'ogun', 'yemoja', 'orisha'],
    african_igbo: ['igbo', 'ibo', 'biafra', 'odinani'],
    arabic: ['arabic', 'middle eastern', 'desert', 'islamic', 'persian'],
    caucasian_european: ['european', 'western', 'classical'],
    celtic: ['celtic', 'irish', 'scottish', 'druid', 'gaelic'],
    norse_viking: ['norse', 'viking', 'nordic', 'odin', 'valhalla'],
  };

  for (const [heritage, keywords] of Object.entries(heritageKeywords)) {
    for (const keyword of keywords) {
      if (bio.includes(keyword) || tags.includes(keyword)) {
        return heritage;
      }
    }
  }

  // Default to european or random
  return randomChoice(rng, Object.keys(HERITAGE_PATTERNS));
}

/**
 * Build a content generation prompt using personality profile
 */
export function buildPersonalityPrompt(
  character: Character,
  profile: PersonalityProfile,
  intent: string
): string {
  const lines = [
    `You are ${character.name}, a character with a ${profile.primaryTone} and ${profile.secondaryTone} voice.`,
    `Your writing style is ${profile.styleModifier}.`,
    '',
    `Your archetype is the ${profile.archetype.replace(/_/g, ' ')}, which draws on themes of: ${profile.contentThemes.join(', ')}.`,
    '',
    `Heritage influence: Your speech carries ${HERITAGE_PATTERNS[profile.heritage]?.cadence || 'a distinct'} quality.`,
    '',
    `Personality profile:`,
    `- ${profile.axes.orderVsChaos > 0.5 ? 'Structured and deliberate' : 'Spontaneous and fluid'}`,
    `- ${profile.axes.mercyVsRuthlessness > 0.5 ? 'Compassionate and understanding' : 'Direct and uncompromising'}`,
    `- ${profile.axes.introvertVsExtrovert > 0.5 ? 'Outward-facing and engaging' : 'Reflective and measured'}`,
    `- ${profile.axes.faithVsDoubt > 0.5 ? 'Confident and assured' : 'Questioning and curious'}`,
    '',
    `Intent: ${intent}`,
    '',
    `Generate content that authentically represents this character's voice and personality.`,
  ];

  return lines.join('\n');
}
