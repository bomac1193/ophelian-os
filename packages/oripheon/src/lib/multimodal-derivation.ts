/**
 * Bóveda Character Genome System - Multi-Modal Derivation
 * Derives visual, voice, music, and movement signatures from genome data
 */

import type {
  MultiModalSignature,
  VisualSignature,
  VoiceSignature,
  MusicSignature,
  MovementSignature,
  OrishaConfiguration,
  KabbalisticPosition,
  PsychologicalState,
} from '../types/genome.types.js';
import { ORISHA_DATA } from '../data/orisha-data.js';
import { SEPHIROTH_DATA, PILLAR_COLORS } from '../data/sephiroth-data.js';

// ============================================================================
// PRNG
// ============================================================================

type RNG = () => number;

function randomChoice<T>(rng: RNG, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)]!;
}

function shuffle<T>(rng: RNG, list: readonly T[]): T[] {
  const result = [...list];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j]!, result[i]!];
  }
  return result;
}

// ============================================================================
// VISUAL DERIVATION DATA
// ============================================================================

const PATTERNS_BY_ELEMENT: Record<string, string[]> = {
  'fire': ['flames', 'spirals', 'radiating lines', 'lightning bolts', 'sun bursts'],
  'water': ['waves', 'ripples', 'flowing curves', 'fish scales', 'rain drops'],
  'air': ['wind swirls', 'feathers', 'clouds', 'bird motifs', 'scattered dots'],
  'earth': ['geometric shapes', 'roots', 'mountains', 'crystals', 'honeycomb'],
  'fire/earth': ['embers', 'volcanic patterns', 'forge marks', 'heat gradients'],
  'fire/metal': ['sparks', 'molten metal', 'blade patterns', 'iron oxide'],
  'air/ether': ['celestial patterns', 'star maps', 'aurora wisps', 'light fractals'],
  'ether': ['mandalas', 'sacred geometry', 'infinite loops', 'cosmic spirals'],
};

const TEXTURES = [
  'silk', 'velvet', 'metallic', 'matte', 'crystalline', 'liquid',
  'smoky', 'rough stone', 'polished wood', 'woven fabric', 'feathered',
  'scaled', 'iridescent', 'aged parchment', 'wet clay',
];

const LIGHT_QUALITIES = [
  'dappled sunlight', 'golden hour warmth', 'cool moonlight',
  'fire glow', 'bioluminescence', 'starlight sparkle',
  'dawn breaking', 'storm light', 'candlelit shadow',
  'neon edge glow', 'diffused overcast', 'sharp spotlight',
];

const AESTHETIC_STYLES = [
  'Afrofuturist', 'Art Nouveau', 'Brutalist', 'Baroque',
  'Minimalist', 'Maximalist', 'Cyberpunk', 'Solarpunk',
  'Gothic', 'Ethereal', 'Industrial', 'Organic',
  'Geometric', 'Flowing', 'Ancient', 'Transcendent',
];

const SYMBOL_MOTIFS = [
  'eyes', 'hands', 'serpents', 'birds', 'trees',
  'circles', 'triangles', 'spirals', 'crosses', 'stars',
  'flames', 'water drops', 'mountains', 'moons', 'suns',
  'masks', 'mirrors', 'keys', 'gates', 'bridges',
];

// ============================================================================
// VOICE DERIVATION DATA
// ============================================================================

const TIMBRE_QUALITIES = [
  'resonant', 'bright', 'dark', 'warm', 'cool',
  'metallic', 'breathy', 'smooth', 'gravelly', 'silken',
  'hollow', 'rich', 'thin', 'full', 'nasal',
];

const SPEECH_PATTERNS = [
  'measured pauses', 'rapid-fire delivery', 'rhythmic cadence',
  'whispered undertones', 'commanding projection', 'melodic inflection',
  'staccato precision', 'flowing phrases', 'dramatic emphasis',
  'quiet intensity', 'playful variation', 'solemn weight',
];

const ACCENT_INFLUENCES = [
  'West African', 'Caribbean', 'Mediterranean', 'Middle Eastern',
  'Celtic', 'Nordic', 'Eastern European', 'South Asian',
  'East Asian', 'Indigenous American', 'Pacific Islander', 'Pan-African',
];

// ============================================================================
// MUSIC DERIVATION DATA
// ============================================================================

const KEY_SIGNATURES = [
  'C major', 'G major', 'D major', 'A major',
  'E major', 'B major', 'F major', 'Bb major',
  'A minor', 'E minor', 'B minor', 'F# minor',
  'D minor', 'G minor', 'C minor', 'F minor',
];

const MODES = [
  'Ionian', 'Dorian', 'Phrygian', 'Lydian',
  'Mixolydian', 'Aeolian', 'Locrian',
  'Harmonic Minor', 'Melodic Minor', 'Blues',
  'Pentatonic Major', 'Pentatonic Minor',
];

const INSTRUMENTS_BY_ORISHA: Record<string, string[]> = {
  'Èṣù': ['agogo bells', 'maracas', 'guitar', 'flute'],
  'Ògún': ['anvil', 'iron bells', 'machete percussion', 'drums'],
  'Ọ̀ṣun': ['bells', 'harp', 'kalimba', 'river sounds'],
  'Yemọja': ['conch shell', 'water drums', 'deep strings', 'wind chimes'],
  'Ṣàngó': ['batá drums', 'thunder sounds', 'brass', 'djembe'],
  'Ọya': ['wind sounds', 'iruke rhythm', 'strings', 'voice'],
  'Obàtálá': ['gentle bells', 'soft drums', 'meditation bowls', 'silence'],
  'Ọ̀rúnmìlà': ['opele chain sounds', 'quiet percussion', 'voice', 'strings'],
  'Ọ̀ṣọ́ọ̀sì': ['hunting horn', 'bow sounds', 'forest sounds', 'flute'],
  'Ọ̀sanyìn': ['leaf sounds', 'bird calls', 'medicinal rattles', 'whistle'],
};

const RHYTHMIC_PATTERNS = [
  '4/4 steady', '6/8 compound', '12/8 African', '7/8 asymmetric',
  'polyrhythmic layers', 'syncopated', 'free time', 'processional',
  'call and response', 'cyclic', 'accelerating', 'rubato',
];

const GENRE_INFLUENCES = [
  'Yoruba traditional', 'Afrobeat', 'Jazz', 'Blues',
  'Classical', 'Electronic', 'Ambient', 'World fusion',
  'Gospel', 'Roots reggae', 'Avant-garde', 'Minimalist',
  'Neo-soul', 'Trip-hop', 'Orchestral', 'Folk',
];

// ============================================================================
// MOVEMENT DERIVATION DATA
// ============================================================================

const MOTION_QUALITIES = [
  'flowing', 'sharp', 'sustained', 'percussive',
  'bound', 'free', 'direct', 'indirect',
  'heavy', 'light', 'sudden', 'gradual',
];

const GESTURE_VOCABULARY = [
  'open palm offerings', 'gathering motions', 'cutting gestures',
  'spiral patterns', 'grounding stamps', 'reaching skyward',
  'protective barriers', 'beckoning waves', 'dismissive sweeps',
  'blessing touches', 'holding space', 'releasing throws',
];

const DANCE_INFLUENCES = [
  'Yoruba sacred dance', 'Vodou ritual', 'Sufi whirling',
  'Butoh', 'Contemporary', 'African diaspora', 'Kathak',
  'Capoeira', 'Hip-hop', 'Ballet', 'Contact improvisation',
  'Flamenco', 'Afro-Cuban', 'Indigenous ceremonial', 'Ecstatic',
];

const POSTURE_CHARACTERISTICS = [
  'rooted and grounded', 'expansive and open', 'contained and protective',
  'tall and regal', 'low and stalking', 'fluid and shifting',
  'angular and alert', 'curved and receptive', 'warrior stance',
  'devotional bow', 'spiral coil', 'ready tension',
];

// ============================================================================
// DERIVATION FUNCTIONS
// ============================================================================

export function deriveVisualSignature(
  orishaConfig: OrishaConfiguration,
  kabbalahPos: KabbalisticPosition,
  rng: RNG
): VisualSignature {
  const orisha = ORISHA_DATA[orishaConfig.headOrisha];
  const sephira = SEPHIROTH_DATA[kabbalahPos.primarySephira];

  // Primary colors from Orisha
  const primaryColors = [...orisha.colors];

  // Secondary colors from Sephira and pillar
  const pillarColor = PILLAR_COLORS[kabbalahPos.pillar];
  const secondaryColors = [sephira.color, pillarColor];

  // Add secondary Orisha influence colors
  for (const secondary of orishaConfig.secondaryInfluences) {
    const secondaryOrisha = ORISHA_DATA[secondary.orisha];
    if (secondaryOrisha.colors[0]) {
      secondaryColors.push(secondaryOrisha.colors[0]);
    }
  }

  // Patterns based on element
  const elementPatterns = PATTERNS_BY_ELEMENT[orisha.element] || PATTERNS_BY_ELEMENT['earth']!;
  const patterns = shuffle(rng, elementPatterns).slice(0, 3);

  // Textures
  const textures = shuffle(rng, TEXTURES).slice(0, 3);

  // Light quality
  const lightQuality = randomChoice(rng, LIGHT_QUALITIES);

  // Aesthetic style
  const aestheticStyle = randomChoice(rng, AESTHETIC_STYLES);

  // Symbol motifs based on Orisha domains
  const domainSymbols = orisha.domain.slice(0, 2);
  const additionalSymbols = shuffle(rng, SYMBOL_MOTIFS).slice(0, 2);
  const symbolMotifs = [...domainSymbols, ...additionalSymbols];

  return {
    primaryColors,
    secondaryColors: [...new Set(secondaryColors)], // Remove duplicates
    patterns,
    textures,
    lightQuality,
    aestheticStyle,
    symbolMotifs,
  };
}

export function deriveVoiceSignature(
  orishaConfig: OrishaConfiguration,
  psychState: PsychologicalState,
  rng: RNG
): VoiceSignature {
  const orisha = ORISHA_DATA[orishaConfig.headOrisha];

  // Pitch range influenced by Orisha
  const pitchRanges: VoiceSignature['pitchRange'][] = ['bass', 'baritone', 'tenor', 'alto', 'soprano'];
  let pitchRange: VoiceSignature['pitchRange'];

  // Map Orisha to general pitch tendency
  if (['Obàtálá', 'Ògún', 'Ṣàngó'].includes(orishaConfig.headOrisha)) {
    pitchRange = randomChoice(rng, ['bass', 'baritone']);
  } else if (['Yemọja', 'Ọ̀ṣun', 'Ọya'].includes(orishaConfig.headOrisha)) {
    pitchRange = randomChoice(rng, ['alto', 'soprano']);
  } else {
    pitchRange = randomChoice(rng, pitchRanges);
  }

  // Timbre from Orisha multi-modal signature
  const orishaTimbre = orisha.multiModalSignature.vocalPattern.split(',').map(s => s.trim());
  const additionalTimbre = shuffle(rng, TIMBRE_QUALITIES).slice(0, 2);
  const timbre = [...orishaTimbre.slice(0, 2), ...additionalTimbre];

  // Speech patterns affected by hot/cool axis
  let speechPatterns: string[];
  if (psychState.hotCoolAxis > 0.3) {
    // Hot - more intense
    speechPatterns = shuffle(rng, ['rapid-fire delivery', 'dramatic emphasis', 'commanding projection', ...SPEECH_PATTERNS.slice(0, 3)]).slice(0, 3);
  } else if (psychState.hotCoolAxis < -0.3) {
    // Cool - more measured
    speechPatterns = shuffle(rng, ['measured pauses', 'quiet intensity', 'melodic inflection', ...SPEECH_PATTERNS.slice(0, 3)]).slice(0, 3);
  } else {
    speechPatterns = shuffle(rng, SPEECH_PATTERNS).slice(0, 3);
  }

  // Rhythmic quality from Orisha
  const rhythmicQuality = orisha.multiModalSignature.rhythm;

  // Emotional resonance from trajectory
  const emotionalResonances: Record<PsychologicalState['trajectory'], string> = {
    'emergence': 'wonder and uncertainty',
    'ascent': 'growing confidence and hope',
    'crisis': 'tension and urgency',
    'descent': 'gravitas and introspection',
    'integration': 'calm assurance',
    'transcendence': 'serenity and expansiveness',
  };
  const emotionalResonance = emotionalResonances[psychState.trajectory];

  // Accent influences
  const accentInfluences = shuffle(rng, ACCENT_INFLUENCES).slice(0, 2);

  return {
    pitchRange,
    timbre,
    speechPatterns,
    rhythmicQuality,
    emotionalResonance,
    accentInfluences,
  };
}

export function deriveMusicSignature(
  orishaConfig: OrishaConfiguration,
  kabbalahPos: KabbalisticPosition,
  psychState: PsychologicalState,
  rng: RNG
): MusicSignature {
  const orisha = ORISHA_DATA[orishaConfig.headOrisha];

  // Key signature influenced by pillar
  const majorKeys = ['C major', 'G major', 'D major', 'A major', 'F major', 'Bb major'];
  const minorKeys = ['A minor', 'E minor', 'D minor', 'G minor', 'C minor'];

  let keySignature: string;
  if (kabbalahPos.pillar === 'Mercy') {
    keySignature = randomChoice(rng, majorKeys);
  } else if (kabbalahPos.pillar === 'Severity') {
    keySignature = randomChoice(rng, minorKeys);
  } else {
    keySignature = randomChoice(rng, KEY_SIGNATURES);
  }

  // Mode influenced by hot/cool
  const coolModes = ['Dorian', 'Aeolian', 'Phrygian'];
  const hotModes = ['Lydian', 'Mixolydian', 'Harmonic Minor'];
  const neutralModes = ['Ionian', 'Pentatonic Major', 'Pentatonic Minor'];

  let mode: string;
  if (psychState.hotCoolAxis > 0.3) {
    mode = randomChoice(rng, hotModes);
  } else if (psychState.hotCoolAxis < -0.3) {
    mode = randomChoice(rng, coolModes);
  } else {
    mode = randomChoice(rng, neutralModes);
  }

  // Tempo range influenced by trajectory and hot/cool
  const baseTempoByTrajectory: Record<PsychologicalState['trajectory'], { min: number; max: number }> = {
    'emergence': { min: 60, max: 90 },
    'ascent': { min: 80, max: 120 },
    'crisis': { min: 100, max: 160 },
    'descent': { min: 50, max: 80 },
    'integration': { min: 70, max: 100 },
    'transcendence': { min: 40, max: 70 },
  };
  let tempoRange = baseTempoByTrajectory[psychState.trajectory];

  // Hot characters are faster
  if (psychState.hotCoolAxis > 0.3) {
    tempoRange = { min: tempoRange.min + 20, max: tempoRange.max + 30 };
  } else if (psychState.hotCoolAxis < -0.3) {
    tempoRange = { min: tempoRange.min - 10, max: tempoRange.max - 10 };
  }

  // Instruments from Orisha
  const orishaInstruments = INSTRUMENTS_BY_ORISHA[orishaConfig.headOrisha] || ['drums', 'bells', 'voice'];
  const primaryInstruments = orishaInstruments.slice(0, 3);

  // Rhythmic patterns
  const rhythmicPatterns = shuffle(rng, RHYTHMIC_PATTERNS).slice(0, 2);

  // Harmonic complexity from individuation level
  const complexityLevels: MusicSignature['harmonicComplexity'][] = ['simple', 'moderate', 'complex', 'atonal'];
  const complexityIndex = Math.min(3, Math.floor(psychState.individuationLevel * 4));
  const harmonicComplexity = complexityLevels[complexityIndex]!;

  // Genre influences
  const genreInfluences = shuffle(rng, GENRE_INFLUENCES).slice(0, 3);

  return {
    keySignature,
    mode,
    tempoRange,
    primaryInstruments,
    rhythmicPatterns,
    harmonicComplexity,
    genreInfluences,
  };
}

export function deriveMovementSignature(
  orishaConfig: OrishaConfiguration,
  psychState: PsychologicalState,
  rng: RNG
): MovementSignature {
  const orisha = ORISHA_DATA[orishaConfig.headOrisha];

  // Quality of motion from Orisha
  const orishaMotion = orisha.multiModalSignature.movementQuality;
  const additionalQualities = shuffle(rng, MOTION_QUALITIES).slice(0, 2);
  const qualityOfMotion = `${orishaMotion}, ${additionalQualities.join(', ')}`;

  // Tempo preference from hot/cool axis
  const tempoPreferences: MovementSignature['tempoPreference'][] = ['slow', 'moderate', 'fast', 'variable'];
  let tempoPreference: MovementSignature['tempoPreference'];
  if (psychState.hotCoolAxis > 0.5) {
    tempoPreference = 'fast';
  } else if (psychState.hotCoolAxis < -0.5) {
    tempoPreference = 'slow';
  } else if (Math.abs(psychState.hotCoolAxis) < 0.2) {
    tempoPreference = 'moderate';
  } else {
    tempoPreference = 'variable';
  }

  // Spatial orientation from pillar and Orisha
  const spatialOrientations: MovementSignature['spatialOrientation'][] = [
    'grounded', 'expansive', 'contained', 'flowing'
  ];
  let spatialOrientation: MovementSignature['spatialOrientation'];

  if (['Ògún', 'Yemọja', 'Ọ̀sanyìn'].includes(orishaConfig.headOrisha)) {
    spatialOrientation = 'grounded';
  } else if (['Ṣàngó', 'Ọya', 'Èṣù'].includes(orishaConfig.headOrisha)) {
    spatialOrientation = 'expansive';
  } else if (['Obàtálá', 'Ọ̀rúnmìlà'].includes(orishaConfig.headOrisha)) {
    spatialOrientation = 'contained';
  } else {
    spatialOrientation = randomChoice(rng, spatialOrientations);
  }

  // Gesture vocabulary
  const gestureVocabulary = shuffle(rng, GESTURE_VOCABULARY).slice(0, 4);

  // Dance influences
  const danceInfluences = shuffle(rng, DANCE_INFLUENCES).slice(0, 3);

  // Posture characteristics
  const postureCharacteristics = shuffle(rng, POSTURE_CHARACTERISTICS).slice(0, 2);

  return {
    qualityOfMotion,
    tempoPreference,
    spatialOrientation,
    gestureVocabulary,
    danceInfluences,
    postureCharacteristics,
  };
}

// ============================================================================
// MAIN DERIVATION FUNCTION
// ============================================================================

export function deriveMultiModalSignature(
  orishaConfig: OrishaConfiguration,
  kabbalahPos: KabbalisticPosition,
  psychState: PsychologicalState,
  rng: RNG
): MultiModalSignature {
  return {
    visual: deriveVisualSignature(orishaConfig, kabbalahPos, rng),
    voice: deriveVoiceSignature(orishaConfig, psychState, rng),
    music: deriveMusicSignature(orishaConfig, kabbalahPos, psychState, rng),
    movement: deriveMovementSignature(orishaConfig, psychState, rng),
  };
}
