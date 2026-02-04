/**
 * Relic Generator Module
 * Generates relic objects, origins, pseudonyms, sacred numbers, sample posts, and backstories.
 * Ported from Slayt characterGenerator.js
 */

import {
  RELIC_OBJECTS,
  RELIC_CATEGORIES,
  RELIC_ORIGINS,
  RELIC_ACTIONS,
  RELIC_ERA_ARCHAIC,
  RELIC_ERA_MODERN,
  RELIC_ERA_TIMELESS,
  ARCHETYPE_NUMBERS,
  MODERN_SYMBOLISM,
  MODERN_SYMBOLISM_CATEGORIES,
  MODERN_RELIC_TWEETS,
  TWEET_TONES,
  RELIC_PSEUDONYMS,
  type RelicCategory,
} from '../data/relic-data.js';

// ============================================================================
// TYPES
// ============================================================================

type RNG = () => number;

export type RelicEra = 'archaic' | 'modern' | 'timeless';

export interface Relic {
  object: string;
  category: RelicCategory;
  origin: string;
}

export interface ArchetypeInfo {
  system: string;
  archetype: string;
  meaning: string;
  coreDesire: string;
  shadowThemes: string[];
  goldenGifts: string[];
}

export interface RelicGenerationOptions {
  era?: RelicEra;
  lockedRelic?: Relic;
  arcana: ArchetypeInfo;
  order: string;
}

export interface RelicGenerationResult {
  relics: Relic[];
  pseudonym: string;
  backstory: string;
  sacredNumber: number;
  samplePost?: string;
  relicName: string;
}

// ============================================================================
// UTILITY (local)
// ============================================================================

function randomChoice<T>(rng: RNG, list: T[]): T {
  return list[Math.floor(rng() * list.length)]!;
}

// ============================================================================
// RELIC OBJECT SELECTION
// ============================================================================

function getEraData(era: RelicEra) {
  if (era === 'modern') return RELIC_ERA_MODERN;
  if (era === 'timeless') return RELIC_ERA_TIMELESS;
  return RELIC_ERA_ARCHAIC;
}

/** Pick a relic object from era-appropriate pool */
export function selectRelicObject(rng: RNG, era: RelicEra): Relic {
  const eraData = getEraData(era);
  const object = randomChoice(rng, eraData.objects);

  return {
    object,
    category: era === 'archaic' ? 'symbolic' : era === 'timeless' ? 'strange' : 'mundane_twisted',
    origin: '',
  };
}

/** Generate relics from the standard category pools */
export function generateRelics(rng: RNG, count: number = 2): Relic[] {
  const relics: Relic[] = [];
  const usedCategories = new Set<RelicCategory>();

  for (let i = 0; i < count; i++) {
    let category: RelicCategory;
    const availableCategories = RELIC_CATEGORIES.filter(c => !usedCategories.has(c));

    if (availableCategories.length > 0) {
      category = randomChoice(rng, availableCategories);
    } else {
      category = randomChoice(rng, RELIC_CATEGORIES);
    }

    usedCategories.add(category);

    const object = randomChoice(rng, RELIC_OBJECTS[category]);
    const origin = randomChoice(rng, RELIC_ORIGINS);

    relics.push({ object, category, origin });
  }

  return relics;
}

// ============================================================================
// SACRED NUMBER
// ============================================================================

/** Get sacred number for an archetype */
export function getSacredNumber(archetype: string, rng: RNG): number {
  const normalized = archetype.toLowerCase().replace(/ /g, '_');
  const numbers = ARCHETYPE_NUMBERS[normalized] || [Math.floor(rng() * 10), Math.floor(rng() * 100)];
  return randomChoice(rng, numbers);
}

// ============================================================================
// MODERN SYMBOLISM
// ============================================================================

/** Generate modern symbolism string from brand categories */
export function generateModernSymbolism(rng: RNG, arcana: ArchetypeInfo): string {
  const category = randomChoice(rng, MODERN_SYMBOLISM_CATEGORIES);
  const symbol = randomChoice(rng, MODERN_SYMBOLISM[category]);
  const number = getSacredNumber(arcana.archetype, rng);

  const formats = [
    `${number} ${symbol}`,
    `${symbol} (${number})`,
    `${symbol} x ${number}`,
    `${symbol} at ${number}`,
    `${symbol} // ${number}`,
    `${symbol} [${number}]`,
  ];

  return randomChoice(rng, formats);
}

// ============================================================================
// SAMPLE POST
// ============================================================================

/** Generate a sample social media post from tone templates */
export function generateSamplePost(rng: RNG): string {
  const category = randomChoice(rng, TWEET_TONES);
  return randomChoice(rng, MODERN_RELIC_TWEETS[category]);
}

// ============================================================================
// PSEUDONYM
// ============================================================================

/** Generate a short pseudonym for relic objects */
export function generatePseudonym(rng: RNG): string {
  return randomChoice(rng, RELIC_PSEUDONYMS);
}

// ============================================================================
// RELIC NAME
// ============================================================================

/** Transform object description into a title-case name */
export function generateRelicName(object: string): string {
  let objectName = object;
  if (objectName.startsWith('a ')) {
    objectName = objectName.slice(2);
  } else if (objectName.startsWith('an ')) {
    objectName = objectName.slice(3);
  }

  const words = objectName.split(' ');
  const skipWords = ['a', 'an', 'the', 'of', 'from', 'that', 'which', 'who', 'with', 'to', 'in', 'on', 'at', 'for'];
  const titleCase = words.map((word, idx) => {
    if (idx === 0 || !skipWords.includes(word.toLowerCase())) {
      return word.charAt(0).toUpperCase() + word.slice(1);
    }
    return word;
  }).join(' ');

  return titleCase;
}

// ============================================================================
// RELIC BACKSTORY
// ============================================================================

/** Compose a full relic origin backstory with giver + context */
export function generateRelicBackstory(
  rng: RNG,
  relic: Relic,
  arcana: ArchetypeInfo,
  order: string,
  era: RelicEra
): string {
  const eraData = getEraData(era);

  const context = randomChoice(rng, eraData.contexts);
  const giver = randomChoice(rng, eraData.givers);
  const action = randomChoice(rng, RELIC_ACTIONS);

  const objectDesc = relic.object.charAt(0).toUpperCase() + relic.object.slice(1);

  const sacredNumber = getSacredNumber(arcana.archetype, rng);
  const altNumber = getSacredNumber(arcana.archetype, rng);

  const natureDescriptors = era === 'timeless' ? [
    `It radiates ${sacredNumber} frequencies of ${arcana.coreDesire.toLowerCase()}, half council flat, half cathedral`,
    `It carries the ${generateModernSymbolism(rng, arcana)} but in cuneiform`,
    `It whispers of ${arcana.shadowThemes[0] || 'forgotten things'} in patois and Old English simultaneously`,
    `It dreams in ${generateModernSymbolism(rng, arcana)} while chanting vespers`,
    `It vibrates between ${randomChoice(rng, ['Harrods', 'the V&A', 'Christie\'s', 'the Louvre'])} and ${randomChoice(rng, ['Poundland', 'the bando', 'a car boot', 'Primark'])} at ${sacredNumber} Hz`,
    `Its energy reads ${altNumber} on scales that predate language but postdate Uber Eats`,
    `It is simultaneously on display at the British Museum and on sale at ${randomChoice(rng, ['TK Maxx', 'Cash Converters', 'the market', 'a man\'s boot'])}`,
    `It embodies ${arcana.meaning.toLowerCase()} the way a kebab embodies the divine`,
  ] : era === 'modern' ? [
    `It carries the ${generateModernSymbolism(rng, arcana)}`,
    `It embodies ${sacredNumber} frequencies of ${arcana.coreDesire.toLowerCase()}`,
    `It whispers of ${arcana.shadowThemes[0] || 'forgotten things'} - ${generateModernSymbolism(rng, arcana)}`,
    `It dreams in ${generateModernSymbolism(rng, arcana)}`,
    `It vibrates at ${sacredNumber} - the ${arcana.meaning.toLowerCase()} frequency`,
    `Its energy reads ${altNumber} on the ${randomChoice(rng, ['Asda', 'Lidl', 'Tesco', 'bando', 'ends', 'block'])} scale`,
  ] : [
    `It carries the weight of ${arcana.meaning.toLowerCase()}`,
    `It embodies ${arcana.coreDesire.toLowerCase()}`,
    `It whispers of ${arcana.shadowThemes[0] || 'forgotten things'}`,
    `It dreams of ${arcana.goldenGifts[0] || 'impossible things'}`,
  ];
  const nature = randomChoice(rng, natureDescriptors);

  const purposes = era === 'timeless' ? [
    `It has ${sacredNumber} stars on Trustpilot and ${altNumber} prayers answered`,
    `Its warranty is written on vellum but expires when the 5G drops`,
    `It was listed on Vinted by a medieval saint and bought by a roadman in Zone 3`,
    `Sotheby's won't touch it. Your nan keeps it on the mantelpiece next to the urn`,
    `The British Museum wants it back but it's already been through ${sacredNumber} car boots`,
    `It's got ${sacredNumber} followers in this realm and ${altNumber} worshippers in the next`,
    `It shows up in your Shein basket and your ancestor's burial goods at the same time`,
    `No one knows if it's couture or contraband - ${generateModernSymbolism(rng, arcana)}`,
    `It's been through the wash ${sacredNumber} times across ${altNumber} centuries and still slaps`,
    `The imam, the priest, and the chicken-shop owner all claim it belongs to them`,
    `It appreciates in value every solstice and depreciates every Primark sale`,
    `It exists in ${sacredNumber} dimensions but only fits in a JD Sports bag`,
  ] : era === 'modern' ? [
    `It has ${sacredNumber} stars but no reviews`,
    `Its warranty expired ${sacredNumber} dimensions ago`,
    `It was recalled but never returned - ${generateModernSymbolism(rng, arcana)}`,
    `It shows up in everyone's algorithm at exactly ${sacredNumber}`,
    `It auto-updates at ${sacredNumber} o'clock in timezones that don't exist`,
    `It's always in stock at ${randomChoice(rng, ['Asda', 'Tesco', 'the bando', 'that corner shop', 'Lidl middle aisle'])} but never ships`,
    `${generateModernSymbolism(rng, arcana)} - it knows your order before you do`,
    `Starbucks named a drink after it but only staff can see the menu`,
    `McDonald's ice cream machine works when it's nearby - ${sacredNumber}% of the time`,
    `The Deliveroo rider who carries it has been on shift since ${altNumber}`,
    `It has ${sacredNumber} unread notifications from the void`,
    `It got banned from ${randomChoice(rng, ['TikTok', 'Instagram', 'Twitter', 'the group chat', 'the bando'])} for speaking truth`,
  ] : [
    'Those who possess it find their path altered',
    'It chooses its keeper, not the other way around',
    'It has passed through many hands, remembering each',
    'It waits for the one who understands its purpose',
    'It transforms all who dare to hold it',
    'It speaks only to those ready to listen',
  ];
  const purpose = randomChoice(rng, purposes);

  return `${objectDesc}, ${action} ${giver} ${context}. ${nature}. ${purpose}.`;
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

/** Generate a complete relic with all associated data */
export function generateRelic(rng: RNG, options: RelicGenerationOptions): RelicGenerationResult {
  const eraRoll = rng();
  const era: RelicEra = options.era || (eraRoll < 0.33 ? 'archaic' : eraRoll < 0.66 ? 'modern' : 'timeless');

  // Use locked relic if provided, otherwise generate a new one based on era
  const relic = options.lockedRelic || selectRelicObject(rng, era);
  const relics = [relic];

  const relicName = generateRelicName(relic.object);
  const pseudonym = generatePseudonym(rng);
  const backstory = generateRelicBackstory(rng, relic, options.arcana, options.order, era);
  const sacredNumber = getSacredNumber(options.arcana.archetype, rng);

  let samplePost: string | undefined;
  if (era === 'modern' || era === 'timeless') {
    samplePost = generateSamplePost(rng);
  }

  return {
    relics,
    pseudonym,
    backstory,
    sacredNumber,
    samplePost,
    relicName,
  };
}
