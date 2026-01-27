/**
 * Bóveda Character Genome System - Genome Generator
 * Core algorithm for generating character genomes
 */

import type {
  CharacterGenome,
  GenomeGenerationOptions,
  OrishaConfiguration,
  KabbalisticPosition,
  PsychologicalState,
  NarrativeIdentity,
  InvariantMarkers,
  EvolutionRules,
  OrishaName,
  SephiraName,
  QliphothName,
  Pillar,
} from '../types/genome.types.js';
import { ORISHA_DATA, ORISHA_NAMES, getSephiraByOrisha, getAllCaminos } from '../data/orisha-data.js';
import { SEPHIROTH_DATA, SEPHIRA_NAMES, getQliphothBySephira, getOrishaCorrespondence } from '../data/sephiroth-data.js';
import { deriveMultiModalSignature } from './multimodal-derivation.js';

// ============================================================================
// PRNG (Seeded Random Number Generator)
// ============================================================================

type RNG = () => number;

function createRng(seed: number): RNG {
  let state = seed;
  return () => {
    state = (state * 1103515245 + 12345) & 0x7fffffff;
    return state / 0x7fffffff;
  };
}

function randomChoice<T>(rng: RNG, list: readonly T[]): T {
  return list[Math.floor(rng() * list.length)]!;
}

function randomFloat(rng: RNG, min = 0, max = 1): number {
  return min + rng() * (max - min);
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
// ID GENERATION
// ============================================================================

function generateId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
  let id = '';
  for (let i = 0; i < 25; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

// ============================================================================
// ORISHA SELECTION
// ============================================================================

function selectOrishaWithCamino(rng: RNG, forceOrisha?: OrishaName): OrishaConfiguration {
  const headOrisha = forceOrisha || randomChoice(rng, ORISHA_NAMES);
  const orishaData = ORISHA_DATA[headOrisha];

  // Select a camino (path/road) for the head Orisha
  const caminos = getAllCaminos(headOrisha);
  const selectedCamino = caminos.length > 0 ? randomChoice(rng, caminos).name : undefined;

  // Select 0-2 secondary influences (different from head)
  const availableForSecondary = ORISHA_NAMES.filter(o => o !== headOrisha);
  const numSecondary = Math.floor(rng() * 3); // 0, 1, or 2
  const secondaryInfluences: OrishaConfiguration['secondaryInfluences'] = [];

  const shuffledAvailable = shuffle(rng, availableForSecondary);
  for (let i = 0; i < numSecondary && i < shuffledAvailable.length; i++) {
    secondaryInfluences.push({
      orisha: shuffledAvailable[i]!,
      strength: Number(randomFloat(rng, 0.2, 0.6).toFixed(2)),
    });
  }

  // Determine shadow form based on Orisha data
  const shadowForm = orishaData.shadowForm?.name;

  return {
    headOrisha,
    camino: selectedCamino,
    secondaryInfluences,
    shadowForm,
  };
}

// ============================================================================
// KABBALISTIC POSITION DERIVATION
// ============================================================================

function deriveSephiraFromOrisha(orisha: OrishaName, rng: RNG, forceSephira?: SephiraName): SephiraName {
  // If forced, use that
  if (forceSephira) return forceSephira;

  // Use Kenneth Grant's correspondence
  const mappedSephira = getSephiraByOrisha(orisha);

  // 80% chance to use the mapped correspondence, 20% random
  if (mappedSephira && rng() < 0.8) {
    return mappedSephira;
  }

  // Random selection from all Sephiroth (excluding Daath for primary position usually)
  const candidates = SEPHIRA_NAMES.filter(s => s !== 'Daath');
  return randomChoice(rng, candidates);
}

function deriveKabbalisticPosition(
  orishaConfig: OrishaConfiguration,
  rng: RNG,
  forceSephira?: SephiraName
): KabbalisticPosition {
  const primarySephira = deriveSephiraFromOrisha(orishaConfig.headOrisha, rng, forceSephira);
  const sephiraData = SEPHIROTH_DATA[primarySephira];

  const qliphoth = getQliphothBySephira(primarySephira);

  // Determine Daath relationship based on Orisha and randomness
  const daathRelationships: KabbalisticPosition['daathRelationship'][] = [
    'seeking', 'touched', 'integrated', 'avoiding'
  ];

  // Oya-aligned characters have stronger Daath relationship
  let daathRelationship: KabbalisticPosition['daathRelationship'];
  if (orishaConfig.headOrisha === 'Ọya') {
    daathRelationship = rng() < 0.6 ? 'touched' : randomChoice(rng, ['integrated', 'seeking']);
  } else {
    daathRelationship = randomChoice(rng, daathRelationships);
  }

  return {
    primarySephira,
    pillar: sephiraData.pillar,
    qliphothicShadow: qliphoth.name,
    activePath: rng() < 0.3 ? Math.floor(rng() * 22) + 11 : undefined,
    daathRelationship,
  };
}

// ============================================================================
// PSYCHOLOGICAL STATE GENERATION
// ============================================================================

const TRAJECTORY_OPTIONS: PsychologicalState['trajectory'][] = [
  'emergence', 'ascent', 'crisis', 'descent', 'integration', 'transcendence'
];

const DOMINANT_COMPLEXES = [
  'Hero Complex', 'Mother Complex', 'Father Complex', 'Shadow Complex',
  'Anima/Animus Complex', 'Persona Complex', 'Self Complex', 'Puer/Puella Complex',
  'Senex Complex', 'Trickster Complex', 'Divine Child Complex', 'Martyr Complex',
];

const ACTIVE_ARCHETYPES = [
  'The Warrior', 'The Healer', 'The Sage', 'The Sovereign',
  'The Lover', 'The Orphan', 'The Seeker', 'The Destroyer',
  'The Creator', 'The Caregiver', 'The Magician', 'The Innocent',
];

function generatePsychologicalState(
  rng: RNG,
  hotCoolBias?: number,
  preferredTrajectory?: PsychologicalState['trajectory']
): PsychologicalState {
  // Hot/Cool axis: -1 (Cool/Rada) to +1 (Hot/Petwo)
  let hotCoolAxis: number;
  if (hotCoolBias !== undefined) {
    // Apply bias with some variance
    hotCoolAxis = Number((hotCoolBias + randomFloat(rng, -0.3, 0.3)).toFixed(2));
    hotCoolAxis = Math.max(-1, Math.min(1, hotCoolAxis)); // Clamp
  } else {
    hotCoolAxis = Number(randomFloat(rng, -1, 1).toFixed(2));
  }

  const trajectory = preferredTrajectory || randomChoice(rng, TRAJECTORY_OPTIONS);

  // Individuation level correlates with trajectory
  let individuationLevel: number;
  switch (trajectory) {
    case 'emergence':
      individuationLevel = randomFloat(rng, 0.1, 0.3);
      break;
    case 'ascent':
      individuationLevel = randomFloat(rng, 0.3, 0.5);
      break;
    case 'crisis':
      individuationLevel = randomFloat(rng, 0.4, 0.6);
      break;
    case 'descent':
      individuationLevel = randomFloat(rng, 0.5, 0.7);
      break;
    case 'integration':
      individuationLevel = randomFloat(rng, 0.7, 0.85);
      break;
    case 'transcendence':
      individuationLevel = randomFloat(rng, 0.85, 1.0);
      break;
    default:
      individuationLevel = randomFloat(rng, 0.3, 0.7);
  }

  // Shadow integration often correlates with individuation
  const shadowIntegration = Number((individuationLevel * randomFloat(rng, 0.7, 1.2)).toFixed(2));

  return {
    individuationLevel: Number(individuationLevel.toFixed(2)),
    hotCoolAxis,
    dominantComplex: randomChoice(rng, DOMINANT_COMPLEXES),
    shadowIntegration: Math.min(1, shadowIntegration),
    activeArchetypes: shuffle(rng, ACTIVE_ARCHETYPES).slice(0, 2 + Math.floor(rng() * 3)),
    trajectory,
  };
}

// ============================================================================
// NARRATIVE IDENTITY GENERATION
// ============================================================================

const CORE_VALUES = [
  'Truth', 'Justice', 'Compassion', 'Courage', 'Wisdom',
  'Loyalty', 'Honor', 'Freedom', 'Creativity', 'Service',
  'Power', 'Knowledge', 'Love', 'Balance', 'Transformation',
  'Protection', 'Tradition', 'Innovation', 'Harmony', 'Independence',
];

const CENTRAL_CONFLICTS = [
  'Individual vs. Collective', 'Tradition vs. Change', 'Duty vs. Desire',
  'Faith vs. Doubt', 'Order vs. Chaos', 'Light vs. Shadow',
  'Self vs. Other', 'Past vs. Future', 'Nature vs. Nurture',
  'Power vs. Responsibility', 'Love vs. Fear', 'Control vs. Surrender',
];

const RELATIONAL_ARCHETYPES = [
  { archetype: 'Mentor', nature: 'Guides through wisdom' },
  { archetype: 'Shadow Twin', nature: 'Mirrors the disowned self' },
  { archetype: 'Beloved', nature: 'Completes through union' },
  { archetype: 'Rival', nature: 'Challenges through competition' },
  { archetype: 'Trickster Ally', nature: 'Disrupts for growth' },
  { archetype: 'Sacred Wound', nature: 'Represents core trauma' },
  { archetype: 'Divine Child', nature: 'Embodies potential' },
  { archetype: 'Wise Elder', nature: 'Offers ancestral guidance' },
];

const ORIGIN_MYTH_ELEMENTS = [
  'Abandoned by divine parents', 'Marked by prophecy', 'Born during cosmic event',
  'Survived great catastrophe', 'Chosen by ancient power', 'Emerged from void',
  'Created through ritual', 'Awakened from long sleep', 'Transformed by sacrifice',
  'Crossed between worlds', 'Inherited cursed bloodline', 'Made covenant with entity',
];

const RECURRING_THEMES = [
  'Redemption through suffering', 'Power and its corruption', 'The price of knowledge',
  'Cycles of death and rebirth', 'The nature of identity', 'Fate versus free will',
  'The sacred and profane', 'Boundaries and their crossing', 'Memory and forgetting',
  'The mask and the face', 'Creation and destruction', 'The journey home',
];

const TELOS_OPTIONS = [
  'To transcend the cycle', 'To restore what was lost', 'To become the bridge',
  'To embody perfect balance', 'To awaken the sleeping god', 'To close the wound',
  'To complete the great work', 'To remember the forgotten name', 'To unite the divided',
  'To transform the shadow', 'To return to source', 'To break the chain',
];

function generateNarrativeIdentity(rng: RNG, orishaConfig: OrishaConfiguration): NarrativeIdentity {
  return {
    coreValues: shuffle(rng, CORE_VALUES).slice(0, 3 + Math.floor(rng() * 2)),
    centralConflicts: shuffle(rng, CENTRAL_CONFLICTS).slice(0, 2),
    relationalPatterns: shuffle(rng, RELATIONAL_ARCHETYPES).slice(0, 2 + Math.floor(rng() * 2)),
    originMythElements: shuffle(rng, ORIGIN_MYTH_ELEMENTS).slice(0, 2),
    recurringThemes: shuffle(rng, RECURRING_THEMES).slice(0, 3),
    telos: randomChoice(rng, TELOS_OPTIONS),
  };
}

// ============================================================================
// INVARIANT MARKERS GENERATION
// ============================================================================

function generateInvariantMarkers(
  rng: RNG,
  orishaConfig: OrishaConfiguration,
  kabbalahPos: KabbalisticPosition,
  narrative: NarrativeIdentity
): InvariantMarkers {
  const orisha = ORISHA_DATA[orishaConfig.headOrisha];

  // Identity anchors based on Orisha
  const identityAnchors = [
    `Servant of ${orishaConfig.headOrisha}`,
    `Walker of the ${kabbalahPos.pillar} Pillar`,
    `Bearer of ${orisha.domain[0]} essence`,
  ];

  // Taboos based on Orisha nature
  const absoluteTaboos: string[] = [];
  switch (orishaConfig.headOrisha) {
    case 'Obàtálá':
      absoluteTaboos.push('Never speak in anger', 'Never consume red substances');
      break;
    case 'Ṣàngó':
      absoluteTaboos.push('Never act without honor', 'Never betray a sworn oath');
      break;
    case 'Ọ̀ṣun':
      absoluteTaboos.push('Never deny beauty its due', 'Never poison waters');
      break;
    case 'Ògún':
      absoluteTaboos.push('Never refuse honest labor', 'Never let a blade rust');
      break;
    default:
      absoluteTaboos.push('Never deny the crossroads', 'Never forget offerings');
  }

  // Signature phrases
  const signaturePhrases = [
    `Ashé - So it is willed`,
    `The ${kabbalahPos.primarySephira} remembers`,
    `${orisha.colors[0]} marks my path`,
  ];

  return {
    identityAnchors,
    absoluteTaboos,
    signaturePhrases,
    sacredValues: narrative.coreValues.slice(0, 2),
    immutableTraits: [
      `${orisha.element} affinity`,
      `${orisha.number} as sacred number`,
    ],
  };
}

// ============================================================================
// EVOLUTION RULES GENERATION
// ============================================================================

function generateEvolutionRules(
  rng: RNG,
  psychState: PsychologicalState,
  invariants: InvariantMarkers
): EvolutionRules {
  const changeVelocityOptions: EvolutionRules['changeVelocity'][] = [
    'glacial', 'slow', 'moderate', 'rapid'
  ];

  // Higher individuation = slower change (more stable)
  let velocityIndex = Math.floor((1 - psychState.individuationLevel) * 3);
  velocityIndex = Math.max(0, Math.min(3, velocityIndex));
  const changeVelocity = changeVelocityOptions[velocityIndex]!;

  return {
    permittedChanges: [
      {
        aspect: 'Psychological State / Hot-Cool Axis',
        maxDrift: 0.3,
        conditions: ['Major life event', 'Ritual transformation', 'Crisis resolution'],
      },
      {
        aspect: 'Secondary Orisha Influences',
        maxDrift: 0.2,
        conditions: ['Extended devotional practice', 'Divine visitation'],
      },
      {
        aspect: 'Active Path on Tree',
        maxDrift: 1.0, // Can fully change
        conditions: ['Completion of current path work', 'Initiatory experience'],
      },
    ],
    protectedCore: [
      'Head Orisha',
      'Primary Sephira',
      ...invariants.identityAnchors,
      ...invariants.sacredValues,
    ],
    evolutionTriggers: [
      { trigger: 'Crisis event', effect: 'May shift trajectory' },
      { trigger: 'Integration milestone', effect: 'Increase individuation' },
      { trigger: 'Shadow encounter', effect: 'Modify hot/cool axis' },
      { trigger: 'Relational transformation', effect: 'Update active archetypes' },
    ],
    changeVelocity,
  };
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================

export function generateGenome(options: GenomeGenerationOptions = {}): CharacterGenome {
  const seed = options.seed ?? Math.floor(Math.random() * 10_000_000);
  const rng = createRng(seed);

  // Step 1: Select Orisha configuration
  const orishaConfiguration = selectOrishaWithCamino(rng, options.forceOrisha);

  // Step 2: Derive Kabbalistic position
  const kabbalisticPosition = deriveKabbalisticPosition(
    orishaConfiguration,
    rng,
    options.forceSephira
  );

  // Step 3: Generate psychological state
  const psychologicalState = generatePsychologicalState(
    rng,
    options.hotCoolBias,
    options.preferredTrajectory
  );

  // Step 4: Derive multi-modal signature
  const multiModalSignature = deriveMultiModalSignature(
    orishaConfiguration,
    kabbalisticPosition,
    psychologicalState,
    rng
  );

  // Step 5: Generate narrative identity
  const narrativeIdentity = generateNarrativeIdentity(rng, orishaConfiguration);

  // Step 6: Generate invariant markers
  const invariantMarkers = generateInvariantMarkers(
    rng,
    orishaConfiguration,
    kabbalisticPosition,
    narrativeIdentity
  );

  // Step 7: Generate evolution rules
  const evolutionRules = generateEvolutionRules(
    rng,
    psychologicalState,
    invariantMarkers
  );

  const now = new Date();

  return {
    id: generateId(),
    name: options.name || `Genome-${seed}`,
    schemaVersion: '1.0.0',
    createdAt: now,
    updatedAt: now,
    orishaConfiguration,
    kabbalisticPosition,
    psychologicalState,
    multiModalSignature,
    narrativeIdentity,
    invariantMarkers,
    evolutionRules,
    seed,
    tags: options.tags || [],
  };
}

/**
 * Regenerate a genome with the same seed but different options
 */
export function rerollGenome(
  seed: number,
  overrides: Partial<GenomeGenerationOptions> = {}
): CharacterGenome {
  return generateGenome({ seed, ...overrides });
}

/**
 * Create a genome with a specific Orisha
 */
export function generateGenomeForOrisha(
  orisha: OrishaName,
  options: Omit<GenomeGenerationOptions, 'forceOrisha'> = {}
): CharacterGenome {
  return generateGenome({ ...options, forceOrisha: orisha });
}

/**
 * Create a genome with a specific Sephira
 */
export function generateGenomeForSephira(
  sephira: SephiraName,
  options: Omit<GenomeGenerationOptions, 'forceSephira'> = {}
): CharacterGenome {
  return generateGenome({ ...options, forceSephira: sephira });
}
