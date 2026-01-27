/**
 * Bóveda Character Genome System - Paths Reference Data
 * The 22 Paths of the Tree of Life and Tunnels of Set
 */

import type { TreePath, SephiraName } from '../types/genome.types.js';

/**
 * The 22 Paths of the Tree of Life
 * Each path corresponds to a Hebrew letter, Tarot card, and astrological attribution
 */
export const TREE_PATHS: TreePath[] = [
  // Paths from Kether
  {
    number: 11,
    hebrewLetter: 'Aleph',
    letterMeaning: 'Ox',
    connects: ['Kether', 'Chokmah'],
    tarotCorrespondence: 'The Fool',
    astrological: 'Air',
    element: 'Air',
    tunnelOfSet: {
      name: 'Amprodias',
      intelligence: 'The Chaotic Void before manifestation',
    },
  },
  {
    number: 12,
    hebrewLetter: 'Beth',
    letterMeaning: 'House',
    connects: ['Kether', 'Binah'],
    tarotCorrespondence: 'The Magician',
    astrological: 'Mercury',
    tunnelOfSet: {
      name: 'Baratchial',
      intelligence: 'The Lightning Flash descending',
    },
  },
  {
    number: 13,
    hebrewLetter: 'Gimel',
    letterMeaning: 'Camel',
    connects: ['Kether', 'Tiphareth'],
    tarotCorrespondence: 'The High Priestess',
    astrological: 'Moon',
    tunnelOfSet: {
      name: 'Gargophias',
      intelligence: 'The Hidden Gate',
    },
  },

  // Paths from Chokmah
  {
    number: 14,
    hebrewLetter: 'Daleth',
    letterMeaning: 'Door',
    connects: ['Chokmah', 'Binah'],
    tarotCorrespondence: 'The Empress',
    astrological: 'Venus',
    tunnelOfSet: {
      name: 'Dagdagiel',
      intelligence: 'The Fishy Ones',
    },
  },
  {
    number: 15,
    hebrewLetter: 'Heh',
    letterMeaning: 'Window',
    connects: ['Chokmah', 'Tiphareth'],
    tarotCorrespondence: 'The Star',
    astrological: 'Aquarius',
    tunnelOfSet: {
      name: 'Hemethterith',
      intelligence: 'The Breaking Apart',
    },
  },
  {
    number: 16,
    hebrewLetter: 'Vav',
    letterMeaning: 'Nail',
    connects: ['Chokmah', 'Chesed'],
    tarotCorrespondence: 'The Hierophant',
    astrological: 'Taurus',
    tunnelOfSet: {
      name: 'Uriens',
      intelligence: 'The Flaming Ones',
    },
  },

  // Paths from Binah
  {
    number: 17,
    hebrewLetter: 'Zain',
    letterMeaning: 'Sword',
    connects: ['Binah', 'Tiphareth'],
    tarotCorrespondence: 'The Lovers',
    astrological: 'Gemini',
    tunnelOfSet: {
      name: 'Zamradiel',
      intelligence: 'The Clangers',
    },
  },
  {
    number: 18,
    hebrewLetter: 'Cheth',
    letterMeaning: 'Fence',
    connects: ['Binah', 'Geburah'],
    tarotCorrespondence: 'The Chariot',
    astrological: 'Cancer',
    tunnelOfSet: {
      name: 'Characith',
      intelligence: 'The Destroyers',
    },
  },

  // Paths from Chesed
  {
    number: 19,
    hebrewLetter: 'Teth',
    letterMeaning: 'Serpent',
    connects: ['Chesed', 'Geburah'],
    tarotCorrespondence: 'Strength',
    astrological: 'Leo',
    tunnelOfSet: {
      name: 'Temphioth',
      intelligence: 'The Smiters',
    },
  },
  {
    number: 20,
    hebrewLetter: 'Yod',
    letterMeaning: 'Hand',
    connects: ['Chesed', 'Tiphareth'],
    tarotCorrespondence: 'The Hermit',
    astrological: 'Virgo',
    tunnelOfSet: {
      name: 'Yamatu',
      intelligence: 'The Bloody Ones',
    },
  },
  {
    number: 21,
    hebrewLetter: 'Kaph',
    letterMeaning: 'Palm',
    connects: ['Chesed', 'Netzach'],
    tarotCorrespondence: 'Wheel of Fortune',
    astrological: 'Jupiter',
    tunnelOfSet: {
      name: 'Kurgasiax',
      intelligence: 'The Crunchers',
    },
  },

  // Paths from Geburah
  {
    number: 22,
    hebrewLetter: 'Lamed',
    letterMeaning: 'Ox Goad',
    connects: ['Geburah', 'Tiphareth'],
    tarotCorrespondence: 'Justice',
    astrological: 'Libra',
    tunnelOfSet: {
      name: 'Lafcursiax',
      intelligence: 'The Torturers',
    },
  },
  {
    number: 23,
    hebrewLetter: 'Mem',
    letterMeaning: 'Water',
    connects: ['Geburah', 'Hod'],
    tarotCorrespondence: 'The Hanged Man',
    astrological: 'Water',
    element: 'Water',
    tunnelOfSet: {
      name: 'Malkunofat',
      intelligence: 'The Drowning Ones',
    },
  },

  // Paths from Tiphareth
  {
    number: 24,
    hebrewLetter: 'Nun',
    letterMeaning: 'Fish',
    connects: ['Tiphareth', 'Netzach'],
    tarotCorrespondence: 'Death',
    astrological: 'Scorpio',
    tunnelOfSet: {
      name: 'Niantiel',
      intelligence: 'The Wailing Ones',
    },
  },
  {
    number: 25,
    hebrewLetter: 'Samekh',
    letterMeaning: 'Prop',
    connects: ['Tiphareth', 'Yesod'],
    tarotCorrespondence: 'Temperance',
    astrological: 'Sagittarius',
    tunnelOfSet: {
      name: 'Saksaksalim',
      intelligence: 'The Testers',
    },
  },
  {
    number: 26,
    hebrewLetter: 'Ayin',
    letterMeaning: 'Eye',
    connects: ['Tiphareth', 'Hod'],
    tarotCorrespondence: 'The Devil',
    astrological: 'Capricorn',
    tunnelOfSet: {
      name: 'A\'ano\'nin',
      intelligence: 'The Molestors',
    },
  },

  // Paths from Netzach
  {
    number: 27,
    hebrewLetter: 'Peh',
    letterMeaning: 'Mouth',
    connects: ['Netzach', 'Hod'],
    tarotCorrespondence: 'The Tower',
    astrological: 'Mars',
    tunnelOfSet: {
      name: 'Parfaxitas',
      intelligence: 'The Dispersers',
    },
  },
  {
    number: 28,
    hebrewLetter: 'Tzaddi',
    letterMeaning: 'Fish Hook',
    connects: ['Netzach', 'Yesod'],
    tarotCorrespondence: 'The Emperor',
    astrological: 'Aries',
    tunnelOfSet: {
      name: 'Tzuflifu',
      intelligence: 'The Scratchers',
    },
  },
  {
    number: 29,
    hebrewLetter: 'Qoph',
    letterMeaning: 'Back of Head',
    connects: ['Netzach', 'Malkuth'],
    tarotCorrespondence: 'The Moon',
    astrological: 'Pisces',
    tunnelOfSet: {
      name: 'Qulielfi',
      intelligence: 'The Succubi',
    },
  },

  // Paths from Hod
  {
    number: 30,
    hebrewLetter: 'Resh',
    letterMeaning: 'Head',
    connects: ['Hod', 'Yesod'],
    tarotCorrespondence: 'The Sun',
    astrological: 'Sun',
    tunnelOfSet: {
      name: 'Raflifu',
      intelligence: 'The Decomposers',
    },
  },
  {
    number: 31,
    hebrewLetter: 'Shin',
    letterMeaning: 'Tooth',
    connects: ['Hod', 'Malkuth'],
    tarotCorrespondence: 'Judgement',
    astrological: 'Fire',
    element: 'Fire',
    tunnelOfSet: {
      name: 'Shalicu',
      intelligence: 'The Fanged Ones',
    },
  },

  // Path from Yesod to Malkuth
  {
    number: 32,
    hebrewLetter: 'Tav',
    letterMeaning: 'Cross',
    connects: ['Yesod', 'Malkuth'],
    tarotCorrespondence: 'The World',
    astrological: 'Saturn',
    tunnelOfSet: {
      name: 'Thantifaxath',
      intelligence: 'The Returners',
    },
  },
];

/**
 * Get a path by its number (11-32)
 */
export function getPath(pathNumber: number): TreePath | undefined {
  return TREE_PATHS.find(p => p.number === pathNumber);
}

/**
 * Get all paths connecting to a specific Sephira
 */
export function getPathsForSephira(sephiraName: SephiraName): TreePath[] {
  return TREE_PATHS.filter(
    p => p.connects[0] === sephiraName || p.connects[1] === sephiraName
  );
}

/**
 * Get the path connecting two specific Sephiroth
 */
export function getPathBetween(sephira1: SephiraName, sephira2: SephiraName): TreePath | undefined {
  return TREE_PATHS.find(
    p => (p.connects[0] === sephira1 && p.connects[1] === sephira2) ||
         (p.connects[0] === sephira2 && p.connects[1] === sephira1)
  );
}

/**
 * Get path by Tarot card
 */
export function getPathByTarot(tarotCard: string): TreePath | undefined {
  return TREE_PATHS.find(
    p => p.tarotCorrespondence.toLowerCase() === tarotCard.toLowerCase()
  );
}

/**
 * Get path by Hebrew letter
 */
export function getPathByLetter(letter: string): TreePath | undefined {
  return TREE_PATHS.find(
    p => p.hebrewLetter.toLowerCase() === letter.toLowerCase()
  );
}

/**
 * Hebrew letters in order (for reference)
 */
export const HEBREW_LETTERS = [
  'Aleph', 'Beth', 'Gimel', 'Daleth', 'Heh', 'Vav', 'Zain', 'Cheth',
  'Teth', 'Yod', 'Kaph', 'Lamed', 'Mem', 'Nun', 'Samekh', 'Ayin',
  'Peh', 'Tzaddi', 'Qoph', 'Resh', 'Shin', 'Tav'
];

/**
 * Major Arcana Tarot correspondences
 */
export const TAROT_CORRESPONDENCES = {
  'The Fool': 11,
  'The Magician': 12,
  'The High Priestess': 13,
  'The Empress': 14,
  'The Hierophant': 16,
  'The Lovers': 17,
  'The Chariot': 18,
  'Strength': 19,
  'The Hermit': 20,
  'Wheel of Fortune': 21,
  'Justice': 22,
  'The Hanged Man': 23,
  'Death': 24,
  'Temperance': 25,
  'The Devil': 26,
  'The Tower': 27,
  'The Star': 15,
  'The Emperor': 28,
  'The Moon': 29,
  'The Sun': 30,
  'Judgement': 31,
  'The World': 32,
};

/**
 * SVG connection lines for rendering Tree of Life paths
 */
export interface PathConnection {
  from: SephiraName;
  to: SephiraName;
  pathNumber: number;
  letter: string;
}

export function getPathConnections(): PathConnection[] {
  return TREE_PATHS.map(path => ({
    from: path.connects[0],
    to: path.connects[1],
    pathNumber: path.number,
    letter: path.hebrewLetter,
  }));
}
