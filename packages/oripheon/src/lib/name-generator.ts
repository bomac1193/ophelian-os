/**
 * Name Generator Module
 * Generates character names with heritage pools, blending, mononym, aminal, variance, and aesthetic adornment.
 * Ported from Slayt characterGenerator.js
 */

import {
  CULTURE_NAMES,
  CULTURE_LABELS,
  HERITAGE_CULTURES,
  BLENDED_HERITAGE_LABELS,
  NAME_SYLLABLES,
  ALL_ANIMALS,
  LETTER_SUBS_MILD,
  LETTER_SUBS_HEAVY,
  GLITCH_GLYPHS,
  SPACING_CHARS,
  CORE_SYMBOLS,
  LEGACY_CORE_MAP,
  type HeritageCulture,
  type AestheticCore,
} from '../data/name-data.js';

// ============================================================================
// TYPES
// ============================================================================

type RNG = () => number;

export type NameMode = 'standard' | 'squishe' | 'simple' | 'aminal-blend' | 'aminal-clear';

export interface NameGenerationOptions {
  heritage?: HeritageCulture;
  gender: 'masculine' | 'feminine' | 'neutral';
  blendHeritage?: boolean;
  mononym?: boolean;
  mononymType?: 'squishe' | 'simple' | 'aminal-blend' | 'aminal-clear';
  core?: AestheticCore | string;
  variance?: number; // 0-100
}

export interface NameGenerationResult {
  name: string;
  heritageLabel: string;
  heritage: HeritageCulture;
}

// ============================================================================
// UTILITY (local)
// ============================================================================

function randomChoice<T>(rng: RNG, list: T[]): T {
  return list[Math.floor(rng() * list.length)]!;
}

// ============================================================================
// STANDARD NAME GENERATION
// ============================================================================

export function generateStandardName(
  rng: RNG,
  heritage: HeritageCulture,
  gender: 'masculine' | 'feminine' | 'neutral'
): { firstName: string; lastName: string } {
  const cultureNames = CULTURE_NAMES[heritage];
  const namePool = gender === 'feminine' ? cultureNames.female : cultureNames.male;
  const firstName = randomChoice(rng, namePool);
  const lastName = randomChoice(rng, cultureNames.surnames);
  return { firstName, lastName };
}

// ============================================================================
// BLENDED NAME GENERATION
// ============================================================================

export function generateBlendedName(rng: RNG, gender: 'masculine' | 'feminine' | 'neutral'): string {
  const prefix = randomChoice(rng, NAME_SYLLABLES.prefixes);
  const syllableCount = Math.floor(rng() * 3) + 1;

  let name = prefix;

  for (let i = 0; i < syllableCount - 1; i++) {
    if (rng() > 0.4) {
      name += randomChoice(rng, NAME_SYLLABLES.middles);
    }
  }

  const suffix = randomChoice(rng, NAME_SYLLABLES.suffixes);
  name += suffix;

  if (gender === 'feminine' && rng() > 0.5) {
    if (!name.endsWith('a') && !name.endsWith('ia') && !name.endsWith('ah')) {
      const femEndings = ['a', 'ia', 'aia', 'ella', 'ina', 'ara'];
      name = name.replace(/[aeiou]$/, '') + randomChoice(rng, femEndings);
    }
  } else if (gender === 'masculine' && rng() > 0.5) {
    if (!name.match(/[^aeiou]$/)) {
      const mascEndings = ['n', 'r', 's', 'x', 'th', 'k', 'us', 'os', 'an', 'on'];
      name = name + randomChoice(rng, mascEndings);
    }
  }

  return name;
}

// ============================================================================
// MONONYM GENERATION
// ============================================================================

export function generateMononym(
  rng: RNG,
  heritage: HeritageCulture,
  gender: 'masculine' | 'feminine' | 'neutral',
  type: 'squishe' | 'simple'
): string {
  if (type === 'simple') {
    const cultureNames = CULTURE_NAMES[heritage];
    const namePool = gender === 'feminine' ? cultureNames.female : cultureNames.male;
    return randomChoice(rng, namePool);
  }

  // Squishe: blended mononym
  if (rng() > 0.5) {
    return generateBlendedName(rng, gender);
  }

  // Blend from two culture names
  const culture1 = randomChoice(rng, HERITAGE_CULTURES);
  const culture2 = randomChoice(rng, HERITAGE_CULTURES.filter(c => c !== culture1));

  const names1 = CULTURE_NAMES[culture1];
  const names2 = CULTURE_NAMES[culture2];

  const pool1 = gender === 'feminine' ? names1.female : names1.male;
  const pool2 = gender === 'feminine' ? names2.female : names2.male;

  const name1 = randomChoice(rng, pool1);
  const name2 = randomChoice(rng, pool2);

  const splitPoint1 = Math.floor(name1.length * (0.3 + rng() * 0.4));
  const splitPoint2 = Math.floor(name2.length * (0.4 + rng() * 0.3));

  const blended = name1.slice(0, splitPoint1) + name2.slice(splitPoint2);
  return blended.charAt(0).toUpperCase() + blended.slice(1).toLowerCase();
}

// ============================================================================
// AMINAL NAME GENERATION
// ============================================================================

export function generateAminalName(
  rng: RNG,
  baseName: string,
  type: 'aminal-blend' | 'aminal-clear',
  gender?: 'masculine' | 'feminine' | 'neutral'
): string {
  if (type === 'aminal-blend') {
    return generateAminalNameBlended(rng, baseName);
  }
  return generateAminalNameClear(rng, baseName, gender || 'neutral');
}

function generateAminalNameBlended(rng: RNG, baseName: string): string {
  const animal = randomChoice(rng, ALL_ANIMALS);
  const strategy = Math.floor(rng() * 5);

  switch (strategy) {
    case 0: {
      const nameSplit = Math.floor(baseName.length * (0.4 + rng() * 0.3));
      const animalSplit = Math.floor(animal.length * (0.3 + rng() * 0.4));
      return baseName.slice(0, nameSplit) + animal.slice(animalSplit).toLowerCase();
    }
    case 1: {
      const animalSplit = Math.floor(animal.length * (0.4 + rng() * 0.3));
      const nameSplit = Math.floor(baseName.length * (0.3 + rng() * 0.4));
      return animal.slice(0, animalSplit) + baseName.slice(nameSplit).toLowerCase();
    }
    case 2: {
      const combined = animal.slice(0, 3) + baseName.slice(1, 4) + animal.slice(-2);
      return combined.charAt(0).toUpperCase() + combined.slice(1).toLowerCase();
    }
    case 3: {
      const animalPrefix = animal.slice(0, Math.min(3, animal.length));
      const nameFragment = baseName.slice(Math.floor(baseName.length * 0.3));
      return animalPrefix + nameFragment.toLowerCase();
    }
    case 4:
    default: {
      const namePrefix = baseName.slice(0, Math.floor(baseName.length * 0.6));
      const animalSuffix = animal.slice(-Math.min(3, animal.length));
      return namePrefix + animalSuffix.toLowerCase();
    }
  }
}

function generateAminalNameClear(
  rng: RNG,
  baseName: string,
  _gender: 'masculine' | 'feminine' | 'neutral'
): string {
  const animal = randomChoice(rng, ALL_ANIMALS);
  const pattern = Math.floor(rng() * 6);

  switch (pattern) {
    case 0:
      return `${baseName} the ${animal}`;
    case 1:
      return `${animal} ${baseName}`;
    case 2:
      return `${baseName} ${animal}`;
    case 3:
      return `${baseName} of the ${animal}`;
    case 4:
      return `The ${animal} ${baseName}`;
    case 5:
    default:
      return `${baseName}-${animal}`;
  }
}

// ============================================================================
// VARIANCE APPLICATION
// ============================================================================

/**
 * Apply variance (glitch distortion) to a name.
 * variance: 0-100. 0 = no change, 100 = maximum distortion.
 */
export function applyVariance(name: string, variance: number, rng: RNG): string {
  if (variance <= 0) return name;
  const v = variance / 100; // normalize to 0-1

  const subs = v > 0.5 ? LETTER_SUBS_HEAVY : LETTER_SUBS_MILD;
  let result = '';

  const words = name.split(' ');
  const processedWords: string[] = [];

  for (const word of words) {
    let processed = '';
    for (let i = 0; i < word.length; i++) {
      const ch = word[i]!;
      const lower = ch.toLowerCase();

      // Never replace first letter of a word (maintains readability)
      if (i === 0) {
        // Case scramble at high variance
        if (v > 0.3 && rng() < v * 0.25) {
          processed += ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase();
        } else {
          processed += ch;
        }
        continue;
      }

      // Letter substitution
      if (subs[lower] && rng() < v * 0.6) {
        processed += randomChoice(rng, subs[lower]!);
        continue;
      }

      // Case scramble
      if (v > 0.3 && rng() < v * 0.25) {
        processed += ch === ch.toUpperCase() ? ch.toLowerCase() : ch.toUpperCase();
        continue;
      }

      // Glitch glyph overlay at very high variance
      if (v > 0.75 && rng() < (v - 0.75) * 2) {
        processed += ch + randomChoice(rng, GLITCH_GLYPHS);
        continue;
      }

      processed += ch;
    }
    processedWords.push(processed);
  }

  // Insert spacing distortion between words
  if (v > 0.15) {
    result = processedWords.join(randomChoice(rng, SPACING_CHARS));
  } else {
    result = processedWords.join(' ');
  }

  return result;
}

// ============================================================================
// AESTHETIC APPLICATION
// ============================================================================

/**
 * Apply aesthetic adornment symbols to a name.
 * Supports both new canonical names (drowned_mall) and legacy names (vaporwave).
 */
export function applyAesthetic(name: string, core: AestheticCore | string, rng: RNG): string {
  // Resolve legacy name if needed
  const resolvedCore = (LEGACY_CORE_MAP[core] || core) as AestheticCore;
  const symbols = CORE_SYMBOLS[resolvedCore];
  if (!symbols) return name;

  const style = Math.floor(rng() * 3);

  switch (style) {
    case 0: {
      const [left, right] = randomChoice(rng, symbols.wrap);
      return `${left}${name}${right}`;
    }
    case 1: {
      const prefix = randomChoice(rng, symbols.prefix);
      return `${prefix} ${name}`;
    }
    case 2:
    default: {
      const prefix = randomChoice(rng, symbols.prefix);
      const suffix = randomChoice(rng, symbols.suffix);
      return `${prefix}${name}${suffix}`;
    }
  }
}

// ============================================================================
// MAIN ENTRY POINT
// ============================================================================

/**
 * Generate a character name combining all modes.
 * Returns the final name, the heritage label, and the internal heritage culture.
 */
export function generateCharacterName(rng: RNG, options: NameGenerationOptions): NameGenerationResult {
  const {
    gender,
    blendHeritage = false,
    mononym = false,
    mononymType = 'squishe',
    core,
    variance = 0,
  } = options;

  // Determine heritage
  let heritage: HeritageCulture;
  let heritageLabel: string;

  if (blendHeritage) {
    heritage = randomChoice(rng, HERITAGE_CULTURES);
    heritageLabel = randomChoice(rng, BLENDED_HERITAGE_LABELS);
  } else {
    heritage = options.heritage || randomChoice(rng, HERITAGE_CULTURES);
    heritageLabel = CULTURE_LABELS[heritage];
  }

  // Get base name for aminal modes
  const cultureNames = CULTURE_NAMES[heritage];
  const namePool = gender === 'feminine' ? cultureNames.female : cultureNames.male;
  const baseName = randomChoice(rng, namePool);

  let fullName: string;

  if (mononym && mononymType === 'squishe') {
    fullName = generateMononym(rng, heritage, gender, 'squishe');
  } else if (mononym && mononymType === 'simple') {
    fullName = baseName;
  } else if (mononym && mononymType === 'aminal-blend') {
    fullName = generateAminalName(rng, baseName, 'aminal-blend');
  } else if (mononym && mononymType === 'aminal-clear') {
    fullName = generateAminalName(rng, baseName, 'aminal-clear', gender);
  } else if (blendHeritage && !mononym) {
    const firstName = generateBlendedName(rng, gender);
    const lastName = generateBlendedName(rng, 'neutral');
    fullName = `${firstName} ${lastName}`;
  } else {
    const { firstName, lastName } = generateStandardName(rng, heritage, gender);
    fullName = `${firstName} ${lastName}`;
  }

  // Apply variance distortion
  if (variance > 0) {
    fullName = applyVariance(fullName, variance, rng);
  }

  // Apply aesthetic adornment
  if (core) {
    fullName = applyAesthetic(fullName, core, rng);
  }

  return {
    name: fullName,
    heritageLabel,
    heritage,
  };
}
