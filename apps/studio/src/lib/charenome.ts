/**
 * Charenome - Synced Character + Genome Generation
 * Maps character traits/orders to Orisha and genome parameters
 */

import type { LCOSGeneratedCharacter } from './oripheon';

// Order to Orisha mapping
export const ORDER_TO_ORISHA: Record<string, string> = {
  trickster: 'Èṣù',
  angel: 'Obàtálá',
  demon: 'Ṣàngó',
  jinn: 'Èṣù',
  human: 'Ọ̀ṣọ́ọ̀sì',
  titan: 'Ògún',
  fae: 'Ọ̀ṣun',
  yokai: 'Ọya',
  elemental: 'Ṣàngó',
  nephilim: 'Ògún',
  archon: 'Ọ̀rúnmìlà',
  dragonkin: 'Ṣàngó',
  construct: 'Ògún',
  eldritch: 'Ọya',
};

// Orisha to camino suggestions
export const ORISHA_CAMINOS: Record<string, string[]> = {
  'Èṣù': ['Èṣù Laroye', 'Èṣù Elegguá', 'Èṣù Alagwanna', 'Èṣù Bi'],
  'Ògún': ['Ògún Arere', 'Ògún Onile', 'Ògún Chibiriki'],
  'Ọ̀ṣun': ['Ọ̀ṣun Ibu Kolé', 'Ọ̀ṣun Yeye Morí', 'Ọ̀ṣun Ibu Añá'],
  'Yemọja': ['Yemọja Asesu', 'Yemọja Okute', 'Yemọja Mayalewo'],
  'Ṣàngó': ['Ṣàngó Obakoso', 'Ṣàngó Alafin', 'Ṣàngó Obalube'],
  'Ọya': ['Ọya Yansa', 'Ọya Oriri', 'Ọya Funke'],
  'Obàtálá': ['Obàtálá Ayáguna', 'Obàtálá Oshanlá', 'Obàtálá Orishanla'],
  'Ọ̀rúnmìlà': ['Ọ̀rúnmìlà Eleri Ipin', 'Ọ̀rúnmìlà Ibikeje'],
  'Ọ̀ṣọ́ọ̀sì': ['Ọ̀ṣọ́ọ̀sì Odde', 'Ọ̀ṣọ́ọ̀sì Ibualama'],
  'Ọ̀sanyìn': ['Ọ̀sanyìn Aguanile', 'Ọ̀sanyìn Ode'],
};

// Orisha to Sephira (Kenneth Grant correspondences)
export const ORISHA_TO_SEPHIRA: Record<string, string> = {
  'Obàtálá': 'Kether',
  'Ọ̀rúnmìlà': 'Chokmah',
  'Yemọja': 'Binah',
  'Ọ̀sanyìn': 'Chesed',
  'Ṣàngó': 'Geburah',
  'Ọ̀ṣọ́ọ̀sì': 'Tiphareth',
  'Ọ̀ṣun': 'Netzach',
  'Ògún': 'Hod',
  'Èṣù': 'Yesod',
  'Ọya': 'Daath',
};

// Voice type derivation based on Orisha energy and gender
export type VoiceType = 'bass' | 'baritone' | 'tenor' | 'countertenor' | 'contralto' | 'mezzo-soprano' | 'soprano';

export interface VoiceProfile {
  type: VoiceType;
  quality: string;
  pattern: string;
  tweetStyle: string;
}

const ORISHA_VOICE_QUALITIES: Record<string, { energy: 'hot' | 'cool' | 'crossroads'; quality: string; pattern: string }> = {
  'Èṣù': { energy: 'crossroads', quality: 'mercurial, playful with sudden shifts', pattern: 'rapid speech, wordplay, provocative' },
  'Ògún': { energy: 'hot', quality: 'commanding, metallic edge', pattern: 'direct, economical, declarative' },
  'Ọ̀ṣun': { energy: 'cool', quality: 'honeyed, seductive, flowing', pattern: 'melodic, persuasive, emotionally rich' },
  'Yemọja': { energy: 'cool', quality: 'deep, oceanic, nurturing', pattern: 'maternal wisdom, protective undertones' },
  'Ṣàngó': { energy: 'hot', quality: 'thunderous, authoritative', pattern: 'bold proclamations, righteous fire' },
  'Ọya': { energy: 'crossroads', quality: 'fierce, transformative, cutting', pattern: 'winds of change, truthful even when harsh' },
  'Obàtálá': { energy: 'cool', quality: 'serene, measured, pure', pattern: 'wise, considered, peaceful' },
  'Ọ̀rúnmìlà': { energy: 'cool', quality: 'knowing, prophetic', pattern: 'cryptic wisdom, ancient knowledge' },
  'Ọ̀ṣọ́ọ̀sì': { energy: 'hot', quality: 'sharp, precise, focused', pattern: 'hunter\'s patience, then sudden strike' },
  'Ọ̀sanyìn': { energy: 'cool', quality: 'mysterious, healing', pattern: 'speaks in riddles, plant wisdom' },
};

export function deriveVoiceProfile(orisha: string, gender: string): VoiceProfile {
  const orishaVoice = ORISHA_VOICE_QUALITIES[orisha] || ORISHA_VOICE_QUALITIES['Èṣù'];

  // Determine voice type based on gender and energy
  let type: VoiceType;
  if (gender === 'masculine') {
    if (orishaVoice.energy === 'hot') type = 'baritone';
    else if (orishaVoice.energy === 'cool') type = 'tenor';
    else type = Math.random() > 0.5 ? 'baritone' : 'tenor';
  } else if (gender === 'feminine') {
    if (orishaVoice.energy === 'hot') type = 'mezzo-soprano';
    else if (orishaVoice.energy === 'cool') type = 'soprano';
    else type = Math.random() > 0.5 ? 'mezzo-soprano' : 'contralto';
  } else {
    // Neutral
    if (orishaVoice.energy === 'hot') type = 'tenor';
    else if (orishaVoice.energy === 'cool') type = 'countertenor';
    else type = 'tenor';
  }

  return {
    type,
    quality: orishaVoice.quality,
    pattern: orishaVoice.pattern,
    tweetStyle: getTweetStyle(orisha),
  };
}

function getTweetStyle(orisha: string): string {
  const styles: Record<string, string> = {
    'Èṣù': 'witty, ironic, uses wordplay and double meanings. asks provocative questions.',
    'Ògún': 'direct, no-nonsense, speaks of work and struggle. uses action verbs.',
    'Ọ̀ṣun': 'sensual, luxurious, speaks of beauty and pleasure. uses flowing language.',
    'Yemọja': 'nurturing, protective, speaks of family and care. uses inclusive language.',
    'Ṣàngó': 'bold, fiery, speaks of justice and power. uses emphatic statements.',
    'Ọya': 'fierce, transformative, speaks of change and truth. cuts through pretense.',
    'Obàtálá': 'serene, wise, speaks of peace and creation. uses measured, calm language.',
    'Ọ̀rúnmìlà': 'cryptic, knowing, speaks in proverbs and riddles. references fate.',
    'Ọ̀ṣọ́ọ̀sì': 'precise, observant, speaks of goals and hunting. uses targeting language.',
    'Ọ̀sanyìn': 'mystical, herbal, speaks of healing and secrets. uses nature metaphors.',
  };
  return styles[orisha] || styles['Èṣù'];
}

// Sample tweet templates by Orisha
const TWEET_TEMPLATES: Record<string, string[]> = {
  'Èṣù': [
    "the door you fear to open is the one you've already walked through. which version of you remembers?",
    "they call it luck. i call it knowing which crossroads to stand at.",
    "every message you send arrives at two destinations. the question is: which one did you intend?",
    "chaos isn't the absence of order—it's order refusing to explain itself.",
  ],
  'Ògún': [
    "built it with my hands. burned the blueprint. the work is the only truth.",
    "they asked for permission. i was already finished.",
    "iron doesn't negotiate. neither do i.",
    "the path exists because i cut it. stand aside or be cleared.",
  ],
  'Ọ̀ṣun': [
    "honey catches what force cannot. remember who taught you that.",
    "my reflection knows secrets yours is too afraid to show.",
    "abundance isn't given—it's attracted. what are you radiating?",
    "the river doesn't rush. it arrives when the landscape surrenders.",
  ],
  'Yemọja': [
    "the tide remembers every shore it has ever touched. so do i.",
    "i carried you before you knew how to carry yourself. that debt has no expiration.",
    "depth isn't measured in distance—it's measured in what you protect.",
    "come to the water when you've forgotten your own reflection.",
  ],
  'Ṣàngó': [
    "JUSTICE DOESN'T WHISPER. it arrives with thunder and you will know its name.",
    "my fire doesn't ask permission to illuminate. stand in the light or explain your shadows.",
    "they wanted a king. they got a storm with a crown.",
    "the throne isn't taken—it's manifested through righteous fire.",
  ],
  'Ọya': [
    "transformation isn't gentle. neither am i.",
    "the wind carries every secret you thought you buried. i'm listening.",
    "death is just change that refuses to apologize. i relate.",
    "clear the space or i will. your attachment isn't my problem.",
  ],
  'Obàtálá': [
    "in silence, creation speaks loudest. have you learned to listen yet?",
    "purity isn't absence—it's presence of what truly matters.",
    "i shaped worlds from stillness. what have you shaped from noise?",
    "white holds all colors. remember that before you judge what seems empty.",
  ],
  'Ọ̀rúnmìlà': [
    "your future called. it left a message you won't understand until it's already happened.",
    "the pattern was set before your ancestors dreamed. you're just now noticing.",
    "wisdom isn't knowing the answer. it's remembering you already knew the question.",
    "fate doesn't negotiate, but it does send messengers. i am one.",
  ],
  'Ọ̀ṣọ́ọ̀sì': [
    "i don't chase. i position. then i release.",
    "the target reveals itself to those who know how to wait.",
    "precision is patience that learned when to strike.",
    "they see the arrow. i see the entire trajectory before i draw.",
  ],
  'Ọ̀sanyìn': [
    "the forest knows your name. it told me when you stopped listening.",
    "every leaf holds a secret. every root holds a cure. every wound holds a teacher.",
    "they call it medicine. i call it conversation with what grows.",
    "healing isn't fixing what's broken—it's remembering what was never broken.",
  ],
};

export function generateSampleTweet(orisha: string, rng?: () => number): string {
  const templates = TWEET_TEMPLATES[orisha] || TWEET_TEMPLATES['Èṣù'];
  const random = rng ? rng() : Math.random();
  return templates[Math.floor(random * templates.length)]!;
}

// Hot/Cool axis derivation
export function deriveHotCoolAxis(orisha: string): number {
  const hotCoolMap: Record<string, number> = {
    'Ṣàngó': 0.9,    // Very hot
    'Ògún': 0.7,     // Hot
    'Ọ̀ṣọ́ọ̀sì': 0.5,  // Moderate hot
    'Èṣù': 0.0,      // Crossroads/neutral
    'Ọya': 0.1,      // Crossroads leaning hot
    'Obàtálá': -0.8, // Very cool
    'Yemọja': -0.7,  // Cool
    'Ọ̀ṣun': -0.5,   // Moderate cool
    'Ọ̀rúnmìlà': -0.6, // Cool
    'Ọ̀sanyìn': -0.4, // Moderate cool
  };
  return hotCoolMap[orisha] ?? 0;
}

// Trajectory based on Orisha
export function deriveTrajectory(orisha: string): string {
  const trajectoryMap: Record<string, string> = {
    'Obàtálá': 'transcendence',
    'Ọ̀rúnmìlà': 'integration',
    'Yemọja': 'integration',
    'Ọ̀sanyìn': 'emergence',
    'Ṣàngó': 'ascent',
    'Ọ̀ṣọ́ọ̀sì': 'ascent',
    'Ọ̀ṣun': 'emergence',
    'Ògún': 'crisis',
    'Èṣù': 'crisis',
    'Ọya': 'descent',
  };
  return trajectoryMap[orisha] ?? 'emergence';
}

// Generate charenome preview data
export interface CharenomePreview {
  orisha: string;
  camino: string;
  sephira: string;
  hotCoolAxis: number;
  trajectory: string;
  voice: VoiceProfile;
  sampleTweet: string;
  secondaryInfluences: Array<{ orisha: string; strength: number }>;
}

export function generateCharenomePreview(character: LCOSGeneratedCharacter): CharenomePreview {
  // Determine primary Orisha from order
  const orderName = character.order?.name?.toLowerCase() || 'human';
  const orisha = ORDER_TO_ORISHA[orderName] || 'Èṣù';

  // Select camino
  const caminos = ORISHA_CAMINOS[orisha] || [];
  const camino = caminos[Math.floor(Math.random() * caminos.length)] || '';

  // Get Sephira
  const sephira = ORISHA_TO_SEPHIRA[orisha] || 'Malkuth';

  // Derive psychological state
  const hotCoolAxis = deriveHotCoolAxis(orisha);
  const trajectory = deriveTrajectory(orisha);

  // Derive voice profile
  const voice = deriveVoiceProfile(orisha, character.gender || 'neutral');

  // Generate sample tweet
  const sampleTweet = generateSampleTweet(orisha);

  // Generate secondary influences (based on compatible energies)
  const secondaryInfluences = generateSecondaryInfluences(orisha);

  return {
    orisha,
    camino,
    sephira,
    hotCoolAxis,
    trajectory,
    voice,
    sampleTweet,
    secondaryInfluences,
  };
}

function generateSecondaryInfluences(primaryOrisha: string): Array<{ orisha: string; strength: number }> {
  // Compatible pairings based on energy
  const compatibilityMap: Record<string, string[]> = {
    'Èṣù': ['Ògún', 'Ọya', 'Ọ̀ṣọ́ọ̀sì'],
    'Ògún': ['Èṣù', 'Ṣàngó', 'Ọ̀ṣọ́ọ̀sì'],
    'Ọ̀ṣun': ['Yemọja', 'Obàtálá', 'Ọ̀rúnmìlà'],
    'Yemọja': ['Ọ̀ṣun', 'Obàtálá', 'Ọ̀sanyìn'],
    'Ṣàngó': ['Ògún', 'Ọya', 'Ọ̀ṣọ́ọ̀sì'],
    'Ọya': ['Ṣàngó', 'Èṣù', 'Yemọja'],
    'Obàtálá': ['Ọ̀rúnmìlà', 'Yemọja', 'Ọ̀ṣun'],
    'Ọ̀rúnmìlà': ['Obàtálá', 'Ọ̀sanyìn', 'Èṣù'],
    'Ọ̀ṣọ́ọ̀sì': ['Ògún', 'Èṣù', 'Ọ̀sanyìn'],
    'Ọ̀sanyìn': ['Ọ̀rúnmìlà', 'Ọ̀ṣọ́ọ̀sì', 'Ọ̀ṣun'],
  };

  const compatible = compatibilityMap[primaryOrisha] || [];
  const numSecondary = Math.floor(Math.random() * 2) + 1; // 1-2 secondary

  const shuffled = [...compatible].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, numSecondary).map(orisha => ({
    orisha,
    strength: Number((0.2 + Math.random() * 0.4).toFixed(2)),
  }));
}

// Create full charenome (character + genome) data for API
export interface CharenomeData {
  character: {
    name: string;
    bio: string;
    aliases: string[];
    personaTags: string[];
    systemPrompt?: string;
    avatarUrl?: string;
  };
  genome: {
    name: string;
    orishaConfiguration: {
      headOrisha: string;
      camino?: string;
      secondaryInfluences: Array<{ orisha: string; strength: number }>;
    };
    kabbalisticPosition: {
      primarySephira: string;
      pillar: 'mercy' | 'severity' | 'balance';
      qliphothicShadow?: string;
      daathRelationship: 'seeking' | 'touched' | 'integrated' | 'avoiding';
    };
    psychologicalState: {
      hotCoolAxis: number;
      trajectory: string;
      individuationLevel: number;
      shadowIntegration: number;
      activeArchetypes: string[];
    };
    narrativeIdentity: {
      coreValues: string[];
      centralConflicts: string[];
      narrativeThemes: string[];
      telos: string;
    };
  };
}

export function buildCharenomeData(
  character: LCOSGeneratedCharacter,
  preview: CharenomePreview,
  avatarUrl?: string
): CharenomeData {
  // Determine pillar from Sephira
  const pillarMap: Record<string, 'mercy' | 'severity' | 'balance'> = {
    'Chokmah': 'mercy', 'Chesed': 'mercy', 'Netzach': 'mercy',
    'Binah': 'severity', 'Geburah': 'severity', 'Hod': 'severity',
    'Kether': 'balance', 'Tiphareth': 'balance', 'Yesod': 'balance', 'Malkuth': 'balance', 'Daath': 'balance',
  };

  const pillar = pillarMap[preview.sephira] || 'balance';

  // Build core values from arcana
  const coreValues = [
    character.personality?.coreDesire || 'self-discovery',
    ...(character.arcana?.goldenGifts || []).slice(0, 2),
  ].filter(Boolean);

  // Build conflicts from shadow themes
  const centralConflicts = (character.arcana?.shadowThemes || ['inner conflict']).slice(0, 2);

  // Build narrative themes
  const narrativeThemes = [
    character.order?.name || 'human',
    character.arcana?.archetype || 'seeker',
    preview.trajectory,
  ];

  return {
    character: {
      name: character.name,
      bio: character.backstory || '',
      aliases: character.pseudonym ? [character.pseudonym] : [],
      personaTags: [
        character.order?.name || 'human',
        character.arcana?.archetype || 'seeker',
        preview.voice.type,
      ],
      avatarUrl,
    },
    genome: {
      name: `${character.name} Genome`,
      orishaConfiguration: {
        headOrisha: preview.orisha,
        camino: preview.camino,
        secondaryInfluences: preview.secondaryInfluences,
      },
      kabbalisticPosition: {
        primarySephira: preview.sephira,
        pillar,
        daathRelationship: preview.sephira === 'Daath' ? 'touched' : 'seeking',
      },
      psychologicalState: {
        hotCoolAxis: preview.hotCoolAxis,
        trajectory: preview.trajectory,
        individuationLevel: 30 + Math.floor(Math.random() * 40),
        shadowIntegration: 20 + Math.floor(Math.random() * 30),
        activeArchetypes: [character.arcana?.archetype || 'seeker'],
      },
      narrativeIdentity: {
        coreValues,
        centralConflicts,
        narrativeThemes,
        telos: character.personality?.coreDesire || 'to discover true self',
      },
    },
  };
}
