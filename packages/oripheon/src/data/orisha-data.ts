/**
 * Bóveda Character Genome System - Orisha Reference Data
 * Complete Orisha data with caminos, correspondences, and Kenneth Grant mappings
 */

import type { Orisha, OrishaName, SephiraName, Camino } from '../types/genome.types.js';

// Kenneth Grant's Vodun-Kabbalah correspondences (from "Cults of the Shadow" and related works)
const GRANT_ORISHA_SEPHIRA_MAP: Record<OrishaName, SephiraName> = {
  'Obàtálá': 'Kether',
  'Ọ̀rúnmìlà': 'Chokmah',
  'Yemọja': 'Binah',
  'Ṣàngó': 'Geburah',
  'Ọ̀ṣun': 'Netzach',
  'Ògún': 'Hod',
  'Èṣù': 'Yesod',
  'Ọya': 'Daath',
  'Ọ̀ṣọ́ọ̀sì': 'Tiphareth',
  'Ọ̀sanyìn': 'Chesed',
  'Olókun': 'Malkuth',
  'Babalú-Ayé': 'Netzach',
};

export const ORISHA_DATA: Record<OrishaName, Orisha> = {
  'Èṣù': {
    name: 'Èṣù',
    title: 'The Divine Messenger',
    domain: ['crossroads', 'communication', 'chance', 'destiny', 'beginnings'],
    colors: ['red', 'black'],
    element: 'fire/earth',
    number: 3,
    day: 'Monday',
    kabbalisticCorrespondence: 'Yesod',
    caminos: [
      {
        name: 'Èṣù Laroye',
        aspect: 'The Communicator',
        description: 'Master of speech, eloquence, and persuasion. Opens paths through words.',
        colors: ['red', 'black', 'yellow'],
        correspondences: {
          planet: 'Mercury',
          offerings: ['palm oil', 'aguardiente', 'tobacco'],
        },
      },
      {
        name: 'Èṣù Elegguá',
        aspect: 'The Opener of Ways',
        description: 'Child aspect who opens and closes all doors. First to be honored.',
        colors: ['red', 'black'],
        correspondences: {
          offerings: ['candy', 'toys', 'coconut'],
        },
      },
      {
        name: 'Èṣù Alagwanna',
        aspect: 'The Wanderer',
        description: 'Walks the roads between worlds. Guide through unknown territories.',
        colors: ['red', 'black', 'white'],
        correspondences: {
          offerings: ['rum', 'cigars', 'roasted corn'],
        },
      },
      {
        name: 'Èṣù Bi',
        aspect: 'The Shadow Walker',
        description: 'Darker aspect working with secrets and hidden knowledge.',
        colors: ['black'],
        correspondences: {
          offerings: ['black hen', 'rum'],
        },
      },
    ],
    shadowForm: {
      name: 'Exu',
      aspect: 'Petwo/Quimbanda form',
      manifestation: 'Trickster energy amplified, chaotic potential unleashed',
    },
    multiModalSignature: {
      rhythm: 'polyrhythmic, syncopated, unpredictable',
      instrument: 'bells, maracas, agogo',
      movementQuality: 'quick, darting, playful, mercurial',
      vocalPattern: 'rapid speech, wordplay, sudden shifts in register',
    },
  },

  'Ògún': {
    name: 'Ògún',
    title: 'The Iron Lord',
    domain: ['iron', 'war', 'labor', 'technology', 'pathfinding'],
    colors: ['green', 'black'],
    element: 'fire/metal',
    number: 7,
    day: 'Tuesday',
    kabbalisticCorrespondence: 'Hod',
    caminos: [
      {
        name: 'Ògún Arere',
        aspect: 'The Warrior',
        description: 'Pure martial energy, defender and attacker.',
        colors: ['green', 'black', 'red'],
        correspondences: {
          planet: 'Mars',
          offerings: ['palm wine', 'rooster', 'iron tools'],
        },
      },
      {
        name: 'Ògún Onile',
        aspect: 'The Blacksmith',
        description: 'Creator and craftsman, forge-master who shapes destiny.',
        colors: ['green', 'black'],
        correspondences: {
          offerings: ['metal objects', 'rum'],
        },
      },
      {
        name: 'Ògún Chibiriki',
        aspect: 'The Untamed',
        description: 'Wild energy of the forest, primal force.',
        colors: ['green', 'brown'],
        correspondences: {
          offerings: ['honey', 'wild game'],
        },
      },
    ],
    shadowForm: {
      name: 'Ogou Feray',
      aspect: 'Petwo warrior',
      manifestation: 'Righteous rage, destruction of obstacles by any means',
    },
    multiModalSignature: {
      rhythm: 'driving, relentless, metallic',
      instrument: 'anvil, iron bells, machete on metal',
      movementQuality: 'powerful, direct, angular, cutting',
      vocalPattern: 'commanding, declarative, economical with words',
    },
  },

  'Ọ̀ṣun': {
    name: 'Ọ̀ṣun',
    title: 'The River Goddess',
    domain: ['love', 'beauty', 'fertility', 'rivers', 'divination', 'prosperity'],
    colors: ['yellow', 'gold', 'amber'],
    element: 'water',
    number: 5,
    day: 'Saturday',
    kabbalisticCorrespondence: 'Netzach',
    caminos: [
      {
        name: 'Ọ̀ṣun Ibu Kolé',
        aspect: 'The Sorceress',
        description: 'Powerful witch aspect, works deep magic.',
        colors: ['amber', 'coral'],
        correspondences: {
          planet: 'Venus',
          offerings: ['honey', 'cinnamon', 'mirrors'],
        },
      },
      {
        name: 'Ọ̀ṣun Yeye Morò',
        aspect: 'The Nurturing Mother',
        description: 'Maternal love, protector of children and home.',
        colors: ['yellow', 'white'],
        correspondences: {
          offerings: ['oranges', 'pumpkin', 'sweet wine'],
        },
      },
      {
        name: 'Ọ̀ṣun Ibu Añá',
        aspect: 'The Dancer',
        description: 'Joy embodied, celebration and artistic expression.',
        colors: ['yellow', 'coral', 'gold'],
        correspondences: {
          offerings: ['bells', 'fans', 'perfume'],
        },
      },
      {
        name: 'Ọ̀ṣun Ibu Akuaro',
        aspect: 'The Diplomat',
        description: 'Negotiator and peacemaker, brings harmony to conflict.',
        colors: ['yellow', 'green'],
        correspondences: {
          offerings: ['lettuce', 'sweet cakes'],
        },
      },
    ],
    shadowForm: {
      name: 'Erzulie Dantor',
      aspect: 'Petwo love goddess',
      manifestation: 'Fierce protective love, jealousy, scorned passion',
    },
    multiModalSignature: {
      rhythm: 'flowing, sensual, undulating',
      instrument: 'bells, fans, water sounds',
      movementQuality: 'fluid, hip-centered, graceful, seductive',
      vocalPattern: 'melodious, warm, persuasive, laughter-filled',
    },
  },

  'Yemọja': {
    name: 'Yemọja',
    title: 'Mother of Waters',
    domain: ['ocean', 'motherhood', 'fertility', 'dreams', 'protection'],
    colors: ['blue', 'white', 'silver'],
    element: 'water',
    number: 7,
    day: 'Saturday',
    kabbalisticCorrespondence: 'Binah',
    caminos: [
      {
        name: 'Yemọja Okute',
        aspect: 'The Deep Ocean',
        description: 'Vast depth, keeper of secrets beneath the waves.',
        colors: ['dark blue', 'silver'],
        correspondences: {
          planet: 'Moon',
          offerings: ['watermelon', 'molasses', 'ducks'],
        },
      },
      {
        name: 'Yemọja Awoyó',
        aspect: 'The Crowned Queen',
        description: 'Regal aspect, dignity and authority.',
        colors: ['blue', 'white', 'gold'],
        correspondences: {
          offerings: ['peacock feathers', 'crown offerings'],
        },
      },
      {
        name: 'Yemọja Ibú Aganá',
        aspect: 'The Fierce Protector',
        description: 'Warrior mother who defends her children fiercely.',
        colors: ['blue', 'red'],
        correspondences: {
          offerings: ['swords', 'shields'],
        },
      },
    ],
    shadowForm: {
      name: 'La Sirène',
      aspect: 'Petwo ocean spirit',
      manifestation: 'Drowning depths, consuming maternal love, possessive waters',
    },
    multiModalSignature: {
      rhythm: 'oceanic, wave-like, deep and rolling',
      instrument: 'conch shell, water drums, bells',
      movementQuality: 'expansive, wave-like, nurturing gestures, flowing',
      vocalPattern: 'deep and resonant, soothing, singing quality',
    },
  },

  'Ṣàngó': {
    name: 'Ṣàngó',
    title: 'The Thunder King',
    domain: ['thunder', 'lightning', 'justice', 'dance', 'drums'],
    colors: ['red', 'white'],
    element: 'fire',
    number: 6,
    day: 'Thursday',
    kabbalisticCorrespondence: 'Geburah',
    caminos: [
      {
        name: 'Ṣàngó Obakoso',
        aspect: 'The King',
        description: 'Royal dignity, sovereign justice, righteous rule.',
        colors: ['red', 'white', 'purple'],
        correspondences: {
          planet: 'Jupiter/Mars',
          offerings: ['bananas', 'apples', 'red wine'],
        },
      },
      {
        name: 'Ṣàngó Alafin',
        aspect: 'The Fire Wielder',
        description: 'Pure lightning energy, transformer through fire.',
        colors: ['red', 'gold'],
        correspondences: {
          offerings: ['rams', 'hot peppers'],
        },
      },
      {
        name: 'Ṣàngó Agodo',
        aspect: 'The Drummer',
        description: 'Master of sacred rhythms, heart of the ceremony.',
        colors: ['red', 'white'],
        correspondences: {
          offerings: ['drums', 'batá'],
        },
      },
    ],
    shadowForm: {
      name: 'Ogou Shango',
      aspect: 'Petwo thunder',
      manifestation: 'Uncontrolled rage, destructive judgment, consuming fire',
    },
    multiModalSignature: {
      rhythm: 'thunderous, powerful, batá patterns',
      instrument: 'batá drums, double-headed axe, thunder sounds',
      movementQuality: 'powerful, leaping, spinning, masculine display',
      vocalPattern: 'booming, authoritative, declamatory, rhythmic',
    },
  },

  'Ọya': {
    name: 'Ọya',
    title: 'The Wind Warrior',
    domain: ['wind', 'storms', 'death', 'transformation', 'ancestors'],
    colors: ['maroon', 'purple', 'nine colors'],
    element: 'air',
    number: 9,
    day: 'Wednesday',
    kabbalisticCorrespondence: 'Daath',
    caminos: [
      {
        name: 'Ọya Yansa',
        aspect: 'The Storm Bringer',
        description: 'Wild storms, radical transformation, sweeping change.',
        colors: ['maroon', 'purple', 'brown'],
        correspondences: {
          planet: 'Pluto/Uranus',
          offerings: ['eggplant', 'red wine', 'copper'],
        },
      },
      {
        name: 'Ọya Funí',
        aspect: 'The Guardian of the Dead',
        description: 'Psychopomp, guides souls through transition.',
        colors: ['black', 'white'],
        correspondences: {
          offerings: ['ancestral offerings', 'flowers'],
        },
      },
      {
        name: 'Ọya Obaloke',
        aspect: 'The Warrior Queen',
        description: 'Fierce battle energy, unstoppable force.',
        colors: ['maroon', 'red'],
        correspondences: {
          offerings: ['swords', 'buffalo'],
        },
      },
    ],
    shadowForm: {
      name: 'Brigitte',
      aspect: 'Petwo death goddess',
      manifestation: 'Cemetery queen, violent transformation, death embrace',
    },
    multiModalSignature: {
      rhythm: 'swirling, building, unpredictable gusts',
      instrument: 'iruke (horse-tail whisk), wind sounds',
      movementQuality: 'spinning, whirling, fierce, death dances',
      vocalPattern: 'shrieking, keening, sudden shifts from whisper to roar',
    },
  },

  'Obàtálá': {
    name: 'Obàtálá',
    title: 'King of the White Cloth',
    domain: ['creation', 'purity', 'wisdom', 'peace', 'justice'],
    colors: ['white'],
    element: 'air/ether',
    number: 8,
    day: 'Sunday',
    kabbalisticCorrespondence: 'Kether',
    caminos: [
      {
        name: 'Obàtálá Ayáguna',
        aspect: 'The Young Warrior',
        description: 'Youthful energy of creation, vigorous and pure.',
        colors: ['white', 'silver'],
        correspondences: {
          planet: 'Sun',
          offerings: ['white doves', 'coconut', 'efun (chalk)'],
        },
      },
      {
        name: 'Obàtálá Ochalá',
        aspect: 'The Elder',
        description: 'Ancient wisdom, patient creator, highest authority.',
        colors: ['white'],
        correspondences: {
          offerings: ['white foods', 'cotton', 'silver'],
        },
      },
      {
        name: 'Obàtálá Orishanla',
        aspect: 'The Great Orisha',
        description: 'Supreme creative force, divine sculptor of humanity.',
        colors: ['white', 'iridescent'],
        correspondences: {
          offerings: ['white yam', 'snails'],
        },
      },
    ],
    shadowForm: {
      name: 'Damballah Wedo',
      aspect: 'Cosmic serpent',
      manifestation: 'Primordial chaos before order, the void of creation',
    },
    multiModalSignature: {
      rhythm: 'slow, stately, measured, meditative',
      instrument: 'bells, quiet drums, silence',
      movementQuality: 'deliberate, graceful, minimal, dignified',
      vocalPattern: 'soft, measured, wise, pauses filled with meaning',
    },
  },

  'Ọ̀rúnmìlà': {
    name: 'Ọ̀rúnmìlà',
    title: 'The Oracle',
    domain: ['divination', 'wisdom', 'destiny', 'knowledge'],
    colors: ['green', 'yellow'],
    element: 'ether',
    number: 16,
    day: 'Every day',
    kabbalisticCorrespondence: 'Chokmah',
    caminos: [
      {
        name: 'Ọ̀rúnmìlà Eleri Ipin',
        aspect: 'Witness of Destiny',
        description: 'Present at the moment souls choose their fate.',
        colors: ['green', 'yellow', 'brown'],
        correspondences: {
          planet: 'All planets (diviner of all)',
          offerings: ['kola nuts', 'palm oil', 'yams'],
        },
      },
      {
        name: 'Ifá',
        aspect: 'The System',
        description: 'The complete divination system, embodied wisdom.',
        colors: ['green', 'yellow'],
        correspondences: {
          offerings: ['sacred palm nuts', 'divination board'],
        },
      },
    ],
    shadowForm: {
      name: 'Grand Bois',
      aspect: 'Deep forest oracle',
      manifestation: 'Hidden knowledge, dangerous truths, forbidden wisdom',
    },
    multiModalSignature: {
      rhythm: 'complex, layered, mathematical patterns',
      instrument: 'opele chain, ikin (palm nuts), quiet sounds',
      movementQuality: 'still, contained, precise hand movements',
      vocalPattern: 'rhythmic chanting, poetic verses, riddles',
    },
  },

  'Ọ̀ṣọ́ọ̀sì': {
    name: 'Ọ̀ṣọ́ọ̀sì',
    title: 'The Divine Hunter',
    domain: ['hunting', 'tracking', 'provision', 'forests', 'justice'],
    colors: ['blue', 'amber', 'green'],
    element: 'earth/air',
    number: 7,
    day: 'Thursday',
    kabbalisticCorrespondence: 'Tiphareth',
    caminos: [
      {
        name: 'Ọ̀ṣọ́ọ̀sì Odé',
        aspect: 'The Hunter',
        description: 'Pure hunting energy, provider and tracker.',
        colors: ['blue', 'green'],
        correspondences: {
          planet: 'Sun/Jupiter',
          offerings: ['smoked fish', 'roasted corn', 'arrows'],
        },
      },
      {
        name: 'Ọ̀ṣọ́ọ̀sì Ibualama',
        aspect: 'Forest Guardian',
        description: 'Protector of sacred groves, keeper of natural law.',
        colors: ['green', 'brown'],
        correspondences: {
          offerings: ['honey', 'game birds'],
        },
      },
    ],
    shadowForm: {
      name: 'Congo Savanne',
      aspect: 'Wild hunter',
      manifestation: 'Predatory pursuit, relentless tracking, survival instinct',
    },
    multiModalSignature: {
      rhythm: 'alert, stalking, sudden bursts',
      instrument: 'hunting horns, bow sounds, forest sounds',
      movementQuality: 'stalking, alert, sudden stillness, explosive action',
      vocalPattern: 'bird calls, animal mimicry, sparse essential words',
    },
  },

  'Ọ̀sanyìn': {
    name: 'Ọ̀sanyìn',
    title: 'The Herbalist',
    domain: ['herbs', 'healing', 'medicine', 'forest secrets', 'magic'],
    colors: ['green'],
    element: 'earth',
    number: 1,
    day: 'Every day',
    kabbalisticCorrespondence: 'Chesed',
    caminos: [
      {
        name: 'Ọ̀sanyìn Agué',
        aspect: 'The Healer',
        description: 'Gentle healing energy, medicine maker.',
        colors: ['green', 'white'],
        correspondences: {
          planet: 'Saturn (keeper of secrets)',
          offerings: ['herbs', 'tobacco', 'rum'],
        },
      },
      {
        name: 'Ọ̀sanyìn Aroni',
        aspect: 'The Wild One',
        description: 'Limping forest dweller who holds deepest plant secrets.',
        colors: ['green', 'brown'],
        correspondences: {
          offerings: ['wild herbs', 'forest offerings'],
        },
      },
    ],
    shadowForm: {
      name: 'Loco',
      aspect: 'Deep forest medicine',
      manifestation: 'Poison knowledge, dangerous cures, plant madness',
    },
    multiModalSignature: {
      rhythm: 'organic, rustling, growing',
      instrument: 'leaf sounds, bird calls, medicinal rattles',
      movementQuality: 'one-legged hopping, bird-like, eccentric',
      vocalPattern: 'high-pitched, bird-like, speaking in riddles about plants',
    },
  },
  'Olókun': {
    name: 'Olókun',
    title: 'The Deep Ocean',
    domain: ['ocean depths', 'mystery', 'wealth', 'unconscious', 'secrets'],
    colors: ['deep blue', 'black', 'silver'],
    element: 'water',
    number: 7,
    day: 'Saturday',
    kabbalisticCorrespondence: 'Malkuth',
    caminos: [
      {
        name: 'Olókun Ìyá',
        aspect: 'The Ocean Mother',
        description: 'Nurturing depths that hold all secrets. Source of primordial wealth.',
        colors: ['deep blue', 'silver'],
        correspondences: {
          planet: 'Neptune',
          offerings: ['seashells', 'blue cloth', 'molasses'],
        },
      },
    ],
    shadowForm: {
      name: 'Drowned One',
      aspect: 'Consuming depths',
      manifestation: 'Pulls down into darkness, hoards secrets destructively',
    },
    multiModalSignature: {
      rhythm: 'deep, slow waves, pressure',
      instrument: 'deep drums, conch shell, water sounds',
      movementQuality: 'heavy, undulating, gravitational',
      vocalPattern: 'deep, echoing, from the abyss',
    },
  },
  'Babalú-Ayé': {
    name: 'Babalú-Ayé',
    title: 'The Healer of Afflictions',
    domain: ['healing', 'disease', 'suffering', 'compassion', 'transformation'],
    colors: ['purple', 'brown', 'burlap'],
    element: 'earth',
    number: 17,
    day: 'Wednesday',
    kabbalisticCorrespondence: 'Netzach',
    caminos: [
      {
        name: 'Babalú-Ayé Asojano',
        aspect: 'The Covered One',
        description: 'Walks covered to hide his wounds. Heals through understanding suffering.',
        colors: ['purple', 'brown'],
        correspondences: {
          planet: 'Saturn',
          offerings: ['beans', 'roasted corn', 'wine'],
        },
      },
    ],
    shadowForm: {
      name: 'Plague Bringer',
      aspect: 'Unhealed wounds',
      manifestation: 'Spreads suffering, refuses healing, wallows in disease',
    },
    multiModalSignature: {
      rhythm: 'limping, uneven, persistent',
      instrument: 'ajá (broom rattle), low drums',
      movementQuality: 'limping, dragging, relentless forward motion',
      vocalPattern: 'raspy, labored breathing, words of endurance',
    },
  },
};

export const ORISHA_NAMES: OrishaName[] = Object.keys(ORISHA_DATA) as OrishaName[];

export function getOrisha(name: OrishaName): Orisha {
  return ORISHA_DATA[name];
}

export function getOrishaBySephira(sephira: SephiraName): OrishaName | undefined {
  for (const [orishaName, mappedSephira] of Object.entries(GRANT_ORISHA_SEPHIRA_MAP)) {
    if (mappedSephira === sephira) {
      return orishaName as OrishaName;
    }
  }
  return undefined;
}

export function getSephiraByOrisha(orisha: OrishaName): SephiraName | undefined {
  return GRANT_ORISHA_SEPHIRA_MAP[orisha];
}

export function getAllCaminos(orisha: OrishaName): Camino[] {
  return ORISHA_DATA[orisha].caminos;
}
