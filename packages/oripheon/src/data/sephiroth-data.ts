/**
 * Bóveda Character Genome System - Sephiroth Reference Data
 * Complete Tree of Life data with Qliphoth (shadow) aspects
 */

import type { Sephira, Qliphoth, SephiraName, QliphothName, Pillar, OrishaName } from '../types/genome.types.js';

// Kenneth Grant's Vodun-Kabbalah correspondences
const GRANT_SEPHIRA_ORISHA_MAP: Record<SephiraName, OrishaName | undefined> = {
  'Kether': 'Obàtálá',
  'Chokmah': 'Ọ̀rúnmìlà',
  'Binah': 'Yemọja',
  'Chesed': 'Ọ̀sanyìn',
  'Geburah': 'Ṣàngó',
  'Tiphareth': 'Ọ̀ṣọ́ọ̀sì',
  'Netzach': 'Ọ̀ṣun',
  'Hod': 'Ògún',
  'Yesod': 'Èṣù',
  'Malkuth': undefined, // Earth, the manifest world
  'Daath': 'Ọya',
};

export const SEPHIROTH_DATA: Record<SephiraName, Sephira> = {
  'Kether': {
    name: 'Kether',
    hebrewName: 'כתר',
    meaning: 'Crown',
    pillar: 'Balance',
    position: { x: 200, y: 30 },
    planet: 'Primum Mobile (First Swirlings)',
    color: 'white brilliance',
    divineAttribute: 'Divine Will',
    psychologicalAspect: 'The Higher Self, Pure Being',
    archetype: 'The Source, The One',
    qliphoth: 'Thaumiel',
    orishaCorrespondence: 'Obàtálá',
    pathsConnecting: [1, 2, 3],
  },
  'Chokmah': {
    name: 'Chokmah',
    hebrewName: 'חכמה',
    meaning: 'Wisdom',
    pillar: 'Mercy',
    position: { x: 300, y: 120 },
    planet: 'Neptune/Zodiac',
    color: 'grey',
    divineAttribute: 'Creative Force',
    psychologicalAspect: 'The Wise Father, Primordial Masculine',
    archetype: 'The All-Father, The Initiator',
    qliphoth: 'Ghagiel',
    orishaCorrespondence: 'Ọ̀rúnmìlà',
    pathsConnecting: [1, 4, 5, 6],
  },
  'Binah': {
    name: 'Binah',
    hebrewName: 'בינה',
    meaning: 'Understanding',
    pillar: 'Severity',
    position: { x: 100, y: 120 },
    planet: 'Saturn',
    color: 'black',
    divineAttribute: 'Divine Understanding',
    psychologicalAspect: 'The Great Mother, Primordial Feminine',
    archetype: 'The Dark Mother, Form-Giver',
    qliphoth: 'Satariel',
    orishaCorrespondence: 'Yemọja',
    pathsConnecting: [2, 5, 8],
  },
  'Chesed': {
    name: 'Chesed',
    hebrewName: 'חסד',
    meaning: 'Mercy',
    pillar: 'Mercy',
    position: { x: 300, y: 240 },
    planet: 'Jupiter',
    color: 'blue',
    divineAttribute: 'Divine Love and Mercy',
    psychologicalAspect: 'Benevolent Authority, Expansive Love',
    archetype: 'The Loving Father, The King',
    qliphoth: 'Gamchicoth',
    orishaCorrespondence: 'Ọ̀sanyìn',
    pathsConnecting: [4, 7, 13, 19],
  },
  'Geburah': {
    name: 'Geburah',
    hebrewName: 'גבורה',
    meaning: 'Severity/Strength',
    pillar: 'Severity',
    position: { x: 100, y: 240 },
    planet: 'Mars',
    color: 'red',
    divineAttribute: 'Divine Power and Judgment',
    psychologicalAspect: 'Discipline, Necessary Destruction',
    archetype: 'The Warrior, The Judge',
    qliphoth: 'Golachab',
    orishaCorrespondence: 'Ṣàngó',
    pathsConnecting: [6, 8, 14, 18],
  },
  'Tiphareth': {
    name: 'Tiphareth',
    hebrewName: 'תפארת',
    meaning: 'Beauty',
    pillar: 'Balance',
    position: { x: 200, y: 280 },
    planet: 'Sun',
    color: 'yellow/gold',
    divineAttribute: 'Divine Harmony',
    psychologicalAspect: 'The Self, The Integrated Ego',
    archetype: 'The Sacrificed God, The Mediator',
    qliphoth: 'Thagirion',
    orishaCorrespondence: 'Ọ̀ṣọ́ọ̀sì',
    pathsConnecting: [3, 7, 9, 13, 14, 15, 17, 20],
  },
  'Netzach': {
    name: 'Netzach',
    hebrewName: 'נצח',
    meaning: 'Victory/Eternity',
    pillar: 'Mercy',
    position: { x: 300, y: 380 },
    planet: 'Venus',
    color: 'green/emerald',
    divineAttribute: 'Divine Passion',
    psychologicalAspect: 'Emotions, Desire, Artistic Expression',
    archetype: 'The Lover, The Artist',
    qliphoth: 'Harab Serapel',
    orishaCorrespondence: 'Ọ̀ṣun',
    pathsConnecting: [15, 19, 21, 22],
  },
  'Hod': {
    name: 'Hod',
    hebrewName: 'הוד',
    meaning: 'Glory/Splendor',
    pillar: 'Severity',
    position: { x: 100, y: 380 },
    planet: 'Mercury',
    color: 'orange',
    divineAttribute: 'Divine Intellect',
    psychologicalAspect: 'Rational Mind, Communication',
    archetype: 'The Messenger, The Magician',
    qliphoth: 'Samael',
    orishaCorrespondence: 'Ògún',
    pathsConnecting: [16, 18, 20, 23],
  },
  'Yesod': {
    name: 'Yesod',
    hebrewName: 'יסוד',
    meaning: 'Foundation',
    pillar: 'Balance',
    position: { x: 200, y: 420 },
    planet: 'Moon',
    color: 'violet/purple',
    divineAttribute: 'Divine Foundation',
    psychologicalAspect: 'The Unconscious, Dreams, Astral Body',
    archetype: 'The Dreamer, The Psychic',
    qliphoth: 'Gamaliel',
    orishaCorrespondence: 'Èṣù',
    pathsConnecting: [17, 21, 23, 25],
  },
  'Malkuth': {
    name: 'Malkuth',
    hebrewName: 'מלכות',
    meaning: 'Kingdom',
    pillar: 'Balance',
    position: { x: 200, y: 520 },
    planet: 'Earth',
    element: 'Earth',
    color: 'citrine/olive/russet/black',
    divineAttribute: 'Divine Presence in Matter',
    psychologicalAspect: 'Physical Body, Material World',
    archetype: 'The Bride, The Queen',
    qliphoth: 'Lilith',
    orishaCorrespondence: undefined,
    pathsConnecting: [22, 24, 25],
  },
  'Daath': {
    name: 'Daath',
    hebrewName: 'דעת',
    meaning: 'Knowledge',
    pillar: 'Balance',
    position: { x: 200, y: 150 },
    color: 'prismatic/none',
    divineAttribute: 'Hidden Knowledge',
    psychologicalAspect: 'The Abyss, Crossing Point',
    archetype: 'The Gate, The Invisible Sephira',
    qliphoth: 'Thagirion', // Complex relationship
    orishaCorrespondence: 'Ọya',
    pathsConnecting: [], // Daath has no formal paths
  },
};

export const QLIPHOTH_DATA: Record<QliphothName, Qliphoth> = {
  'Thaumiel': {
    name: 'Thaumiel',
    hebrewMeaning: 'Twin Gods',
    shadowAspect: 'Division, duality, the illusion of separateness from the divine',
    manifestation: 'Pride, atheism, the belief that one can be god',
    tunnelIntelligence: 'Amprodias',
    correspondingSephira: 'Kether',
  },
  'Ghagiel': {
    name: 'Ghagiel',
    hebrewMeaning: 'The Hinderers',
    shadowAspect: 'Chaos, confusion, disruption of order',
    manifestation: 'Interference, obstacles, meaningless rebellion',
    tunnelIntelligence: 'Baratchial',
    correspondingSephira: 'Chokmah',
  },
  'Satariel': {
    name: 'Satariel',
    hebrewMeaning: 'The Concealers',
    shadowAspect: 'Hiding, obscuring, withholding understanding',
    manifestation: 'Secrets kept too long, stagnation in grief',
    tunnelIntelligence: 'Gargophias',
    correspondingSephira: 'Binah',
  },
  'Gamchicoth': {
    name: 'Gamchicoth',
    hebrewMeaning: 'The Devourers',
    shadowAspect: 'Greed, gluttony, consuming without giving',
    manifestation: 'Excess that destroys, taking without limit',
    tunnelIntelligence: 'Dagdagiel',
    correspondingSephira: 'Chesed',
  },
  'Golachab': {
    name: 'Golachab',
    hebrewMeaning: 'Burning Bodies',
    shadowAspect: 'Destructive wrath, cruelty, violence without purpose',
    manifestation: 'Rage that consumes self and others',
    tunnelIntelligence: 'A\'ano\'nin',
    correspondingSephira: 'Geburah',
  },
  'Thagirion': {
    name: 'Thagirion',
    hebrewMeaning: 'The Disputers',
    shadowAspect: 'Pride, vanity, ugliness masked as beauty',
    manifestation: 'False light, ego inflation, spiritual bypass',
    tunnelIntelligence: 'Zamradiel',
    correspondingSephira: 'Tiphareth',
  },
  'Harab Serapel': {
    name: 'Harab Serapel',
    hebrewMeaning: 'Ravens of Death',
    shadowAspect: 'Lust without love, emotion without reason',
    manifestation: 'Addiction, obsession, emotional vampirism',
    tunnelIntelligence: 'Characith',
    correspondingSephira: 'Netzach',
  },
  'Samael': {
    name: 'Samael',
    hebrewMeaning: 'Poison of God',
    shadowAspect: 'Deception, lies, false communication',
    manifestation: 'Intellect used for harm, cruel wit',
    tunnelIntelligence: 'Temphioth',
    correspondingSephira: 'Hod',
  },
  'Gamaliel': {
    name: 'Gamaliel',
    hebrewMeaning: 'The Obscene Ones',
    shadowAspect: 'Pollution of dreams, distorted instincts',
    manifestation: 'Nightmares, perversion, unconscious corruption',
    tunnelIntelligence: 'Malkunofat',
    correspondingSephira: 'Yesod',
  },
  'Lilith': {
    name: 'Lilith',
    hebrewMeaning: 'Night Specter',
    shadowAspect: 'Material obsession, denial of spirit',
    manifestation: 'Slavery to matter, spiritual death in life',
    tunnelIntelligence: 'Naamah',
    correspondingSephira: 'Malkuth',
  },
};

export const SEPHIRA_NAMES: SephiraName[] = [
  'Kether', 'Chokmah', 'Binah', 'Chesed', 'Geburah',
  'Tiphareth', 'Netzach', 'Hod', 'Yesod', 'Malkuth', 'Daath'
];

export const QLIPHOTH_NAMES: QliphothName[] = Object.keys(QLIPHOTH_DATA) as QliphothName[];

export function getSephira(name: SephiraName): Sephira {
  return SEPHIROTH_DATA[name];
}

export function getQliphoth(name: QliphothName): Qliphoth {
  return QLIPHOTH_DATA[name];
}

export function getQliphothBySephira(sephiraName: SephiraName): Qliphoth {
  const sephira = SEPHIROTH_DATA[sephiraName];
  return QLIPHOTH_DATA[sephira.qliphoth];
}

export function getSephirothByPillar(pillar: Pillar): Sephira[] {
  return Object.values(SEPHIROTH_DATA).filter(s => s.pillar === pillar);
}

export function getOrishaCorrespondence(sephiraName: SephiraName): OrishaName | undefined {
  return GRANT_SEPHIRA_ORISHA_MAP[sephiraName];
}

// Tree of Life position helpers for SVG rendering
export interface TreePosition {
  x: number;
  y: number;
}

export const TREE_POSITIONS: Record<SephiraName, TreePosition> = {
  'Kether': { x: 200, y: 30 },
  'Chokmah': { x: 300, y: 120 },
  'Binah': { x: 100, y: 120 },
  'Daath': { x: 200, y: 150 },
  'Chesed': { x: 300, y: 240 },
  'Geburah': { x: 100, y: 240 },
  'Tiphareth': { x: 200, y: 280 },
  'Netzach': { x: 300, y: 380 },
  'Hod': { x: 100, y: 380 },
  'Yesod': { x: 200, y: 420 },
  'Malkuth': { x: 200, y: 520 },
};

// Pillar colors for visualization
export const PILLAR_COLORS: Record<Pillar, string> = {
  'Mercy': '#3b82f6',    // Blue
  'Severity': '#ef4444', // Red
  'Balance': '#eab308',  // Gold
};
