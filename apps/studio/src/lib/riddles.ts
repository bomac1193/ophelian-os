/**
 * Riddle System for Genome Mystery Unlocking
 *
 * Provides various riddle types based on:
 * - Orisha sacred numbers
 * - Caminos (paths)
 * - Sephira correspondences
 * - Symbolic attributes
 */

import type { OrishaName, SephiraName } from '@lcos/oripheon';

export type RiddleType = 'sacred_number' | 'camino' | 'sephira' | 'element' | 'color_count';
export type DifficultyLevel = 'easy' | 'medium' | 'hard';

export interface Riddle {
  question: string;
  answer: string;
  hint?: string;
  type: RiddleType;
  difficulty: DifficultyLevel;
}

// Orisha sacred numbers
const ORISHA_NUMBERS: Record<OrishaName, number> = {
  'Èṣù': 3,
  'Ògún': 7,
  'Ọ̀ṣun': 5,
  'Yemọja': 7,
  'Ṣàngó': 6,
  'Ọya': 9,
  'Obàtálá': 8,
  'Ọ̀rúnmìlà': 16,
  'Ọ̀ṣọ́ọ̀sì': 7,
  'Ọ̀sanyìn': 1,
};

// Orisha elements
const ORISHA_ELEMENTS: Record<OrishaName, string> = {
  'Èṣù': 'crossroads',
  'Ògún': 'iron',
  'Ọ̀ṣun': 'river',
  'Yemọja': 'ocean',
  'Ṣàngó': 'thunder',
  'Ọya': 'wind',
  'Obàtálá': 'clouds',
  'Ọ̀rúnmìlà': 'wisdom',
  'Ọ̀ṣọ́ọ̀sì': 'forest',
  'Ọ̀sanyìn': 'herbs',
};

// Camino hints (simplified)
const CAMINO_HINTS: Record<string, { keyword: string; answer: string }> = {
  'Èṣù Bi': { keyword: 'born', answer: 'bi' },
  'Èṣù Laroye': { keyword: 'trickster', answer: 'laroye' },
  'Ògún Arere': { keyword: 'kind', answer: 'arere' },
  'Ògún Aguanile': { keyword: 'path clearer', answer: 'aguanile' },
  'Ọ̀ṣun Ibu Kole': { keyword: 'warrior', answer: 'kole' },
  'Ọ̀ṣun Ibu Asedan': { keyword: 'diviner', answer: 'asedan' },
  'Yemọja Asesu': { keyword: 'foamy', answer: 'asesu' },
  'Yemọja Mayalewo': { keyword: 'harbor', answer: 'mayalewo' },
};

/**
 * Generate a sacred number riddle
 */
function getSacredNumberRiddle(orisha: OrishaName): Riddle {
  const number = ORISHA_NUMBERS[orisha];
  return {
    question: 'What sacred number do I carry?',
    answer: String(number),
    hint: 'Check the gateway hints for numeric clues',
    type: 'sacred_number',
    difficulty: 'easy',
  };
}

/**
 * Generate an element riddle
 */
function getElementRiddle(orisha: OrishaName): Riddle {
  const element = ORISHA_ELEMENTS[orisha];
  const riddles: Record<string, string> = {
    'crossroads': 'Where paths meet and choices are made, I stand. What am I?',
    'iron': 'Forged in fire, I cut and build. What element am I?',
    'river': 'I flow with beauty and sweetness. What water am I?',
    'ocean': 'I am the mother of all waters, vast and deep. What am I?',
    'thunder': 'My voice shakes the heavens with justice. What force am I?',
    'wind': 'I sweep away the old to birth the new. What element am I?',
    'clouds': 'Pure and white, I shape creation from above. What am I?',
    'wisdom': 'I see all paths and guide you through fate. What gift do I give?',
    'forest': 'I hunt with precision in the wild. Where do I dwell?',
    'herbs': 'I heal with plants and natural cycles. What do I know?',
  };

  return {
    question: riddles[element] || 'What is my element?',
    answer: element,
    hint: `Think about what ${orisha} represents in nature`,
    type: 'element',
    difficulty: 'medium',
  };
}

/**
 * Generate a Sephira riddle
 */
function getSephiraRiddle(sephira: SephiraName): Riddle {
  const sephiraQuestions: Record<SephiraName, { question: string; shortAnswer: string }> = {
    'Kether': { question: 'I am the Crown, the source of all. What am I called?', shortAnswer: 'kether' },
    'Chokmah': { question: 'I am Wisdom, the first emanation. What am I?', shortAnswer: 'chokmah' },
    'Binah': { question: 'I am Understanding, the great mother. What am I?', shortAnswer: 'binah' },
    'Chesed': { question: 'I am Mercy and loving-kindness. What am I?', shortAnswer: 'chesed' },
    'Geburah': { question: 'I am Severity and strength. What am I?', shortAnswer: 'geburah' },
    'Tiphareth': { question: 'I am Beauty, the heart of the tree. What am I?', shortAnswer: 'tiphareth' },
    'Netzach': { question: 'I am Victory and endurance. What am I?', shortAnswer: 'netzach' },
    'Hod': { question: 'I am Splendor and intellect. What am I?', shortAnswer: 'hod' },
    'Yesod': { question: 'I am Foundation, the gateway of dreams. What am I?', shortAnswer: 'yesod' },
    'Malkuth': { question: 'I am Kingdom, the manifest world. What am I?', shortAnswer: 'malkuth' },
    'Daath': { question: 'I am Knowledge, the hidden gateway. What am I?', shortAnswer: 'daath' },
  };

  const data = sephiraQuestions[sephira];
  return {
    question: data.question,
    answer: data.shortAnswer,
    hint: `This is a Kabbalistic sphere on the Tree of Life`,
    type: 'sephira',
    difficulty: 'hard',
  };
}

/**
 * Generate a camino riddle (if available)
 */
function getCaminoRiddle(camino?: string): Riddle | null {
  if (!camino || !CAMINO_HINTS[camino]) {
    return null;
  }

  const { keyword, answer } = CAMINO_HINTS[camino];
  return {
    question: `I walk the path of the ${keyword}. What is my path called?`,
    answer: answer,
    hint: 'Look at the full name of my Orisha path',
    type: 'camino',
    difficulty: 'medium',
  };
}

/**
 * Generate a color count riddle
 */
function getColorCountRiddle(primaryColors: string[]): Riddle {
  const count = primaryColors.length;
  return {
    question: 'How many primary colors dance in my signature?',
    answer: String(count),
    hint: 'Count the color swatches above',
    type: 'color_count',
    difficulty: 'easy',
  };
}

/**
 * Get a random riddle for a genome
 */
export function getRandomRiddle(
  orisha: OrishaName,
  sephira: SephiraName,
  camino?: string,
  primaryColors?: string[],
  difficulty?: DifficultyLevel
): Riddle {
  const allRiddles: Riddle[] = [
    getSacredNumberRiddle(orisha),
    getElementRiddle(orisha),
    getSephiraRiddle(sephira),
  ];

  if (camino) {
    const caminoRiddle = getCaminoRiddle(camino);
    if (caminoRiddle) {
      allRiddles.push(caminoRiddle);
    }
  }

  if (primaryColors && primaryColors.length > 0) {
    allRiddles.push(getColorCountRiddle(primaryColors));
  }

  // Filter by difficulty if specified
  const filteredRiddles = difficulty
    ? allRiddles.filter(r => r.difficulty === difficulty)
    : allRiddles;

  // Return random riddle from available options
  const riddles = filteredRiddles.length > 0 ? filteredRiddles : allRiddles;
  return riddles[Math.floor(Math.random() * riddles.length)];
}

/**
 * Get a specific riddle by type
 */
export function getRiddleByType(
  type: RiddleType,
  orisha: OrishaName,
  sephira: SephiraName,
  camino?: string,
  primaryColors?: string[]
): Riddle {
  switch (type) {
    case 'sacred_number':
      return getSacredNumberRiddle(orisha);
    case 'element':
      return getElementRiddle(orisha);
    case 'sephira':
      return getSephiraRiddle(sephira);
    case 'camino':
      return getCaminoRiddle(camino) || getSacredNumberRiddle(orisha);
    case 'color_count':
      return primaryColors
        ? getColorCountRiddle(primaryColors)
        : getSacredNumberRiddle(orisha);
    default:
      return getSacredNumberRiddle(orisha);
  }
}

/**
 * Validate an answer (case-insensitive, trimmed)
 */
export function validateAnswer(userAnswer: string, correctAnswer: string): boolean {
  return userAnswer.trim().toLowerCase() === correctAnswer.trim().toLowerCase();
}
