/**
 * Bóveda Character Genome System - Type Definitions
 * Comprehensive TypeScript interfaces for AI character genomes
 */

// ============================================================================
// ORISHA TYPES
// ============================================================================

export type OrishaName =
  | 'Èṣù'
  | 'Ògún'
  | 'Ọ̀ṣun'
  | 'Yemọja'
  | 'Ṣàngó'
  | 'Ọya'
  | 'Obàtálá'
  | 'Ọ̀rúnmìlà'
  | 'Ọ̀ṣọ́ọ̀sì'
  | 'Ọ̀sanyìn';

export interface Camino {
  name: string;
  aspect: string;
  description: string;
  colors: string[];
  element?: string;
  correspondences: {
    planet?: string;
    day?: string;
    number?: number;
    offerings?: string[];
  };
}

export interface Orisha {
  name: OrishaName;
  title: string;
  domain: string[];
  colors: string[];
  element: string;
  number: number;
  day: string;
  caminos: Camino[];
  shadowForm?: {
    name: string;
    aspect: string;
    manifestation: string;
  };
  kabbalisticCorrespondence?: SephiraName; // Kenneth Grant mapping
  multiModalSignature: {
    rhythm: string;
    instrument: string;
    movementQuality: string;
    vocalPattern: string;
  };
}

// ============================================================================
// KABBALISTIC TYPES
// ============================================================================

export type SephiraName =
  | 'Kether'
  | 'Chokmah'
  | 'Binah'
  | 'Chesed'
  | 'Geburah'
  | 'Tiphareth'
  | 'Netzach'
  | 'Hod'
  | 'Yesod'
  | 'Malkuth'
  | 'Daath';

export type QliphothName =
  | 'Thaumiel'
  | 'Ghagiel'
  | 'Satariel'
  | 'Gamchicoth'
  | 'Golachab'
  | 'Thagirion'
  | 'Harab Serapel'
  | 'Samael'
  | 'Gamaliel'
  | 'Lilith';

export type Pillar = 'Mercy' | 'Severity' | 'Balance';

export interface Sephira {
  name: SephiraName;
  hebrewName: string;
  meaning: string;
  pillar: Pillar;
  position: {
    x: number;
    y: number;
  };
  planet?: string;
  element?: string;
  color: string;
  divineAttribute: string;
  psychologicalAspect: string;
  archetype: string;
  qliphoth: QliphothName;
  orishaCorrespondence?: OrishaName; // Kenneth Grant mapping
  pathsConnecting: number[];
}

export interface Qliphoth {
  name: QliphothName;
  hebrewMeaning: string;
  shadowAspect: string;
  manifestation: string;
  tunnelIntelligence?: string;
  correspondingSephira: SephiraName;
}

// ============================================================================
// PATH TYPES (22 Paths of the Tree of Life)
// ============================================================================

export interface TreePath {
  number: number;
  hebrewLetter: string;
  letterMeaning: string;
  connects: [SephiraName, SephiraName];
  tarotCorrespondence: string;
  astrological: string;
  element?: string;
  tunnelOfSet?: {
    name: string;
    intelligence: string;
    sigil?: string;
  };
}

// ============================================================================
// PSYCHOLOGICAL STATE
// ============================================================================

export interface PsychologicalState {
  /** 0 = fully integrated, 1 = fully individuated/differentiated */
  individuationLevel: number;

  /** -1 = Cool (Rada), +1 = Hot (Petwo) - Vodou temperature axis */
  hotCoolAxis: number;

  /** Current dominant complex or mode */
  dominantComplex: string;

  /** Shadow integration level 0-1 */
  shadowIntegration: number;

  /** Active archetypes influencing behavior */
  activeArchetypes: string[];

  /** Current life stage/phase */
  trajectory: 'emergence' | 'ascent' | 'crisis' | 'descent' | 'integration' | 'transcendence';
}

// ============================================================================
// MULTI-MODAL SIGNATURE
// ============================================================================

export interface VisualSignature {
  primaryColors: string[];
  secondaryColors: string[];
  patterns: string[];
  textures: string[];
  lightQuality: string;
  aestheticStyle: string;
  symbolMotifs: string[];
}

export interface VoiceSignature {
  pitchRange: 'bass' | 'baritone' | 'tenor' | 'alto' | 'soprano';
  timbre: string[];
  speechPatterns: string[];
  rhythmicQuality: string;
  emotionalResonance: string;
  accentInfluences: string[];
}

export interface MusicSignature {
  keySignature: string;
  mode: string;
  tempoRange: { min: number; max: number };
  primaryInstruments: string[];
  rhythmicPatterns: string[];
  harmonicComplexity: 'simple' | 'moderate' | 'complex' | 'atonal';
  genreInfluences: string[];
}

export interface MovementSignature {
  qualityOfMotion: string;
  tempoPreference: 'slow' | 'moderate' | 'fast' | 'variable';
  spatialOrientation: 'grounded' | 'expansive' | 'contained' | 'flowing';
  gestureVocabulary: string[];
  danceInfluences: string[];
  postureCharacteristics: string[];
}

export interface MultiModalSignature {
  visual: VisualSignature;
  voice: VoiceSignature;
  music: MusicSignature;
  movement: MovementSignature;
}

// ============================================================================
// NARRATIVE IDENTITY
// ============================================================================

export interface NarrativeIdentity {
  /** Core values that drive the character */
  coreValues: string[];

  /** Primary internal or external conflicts */
  centralConflicts: string[];

  /** Key relationships and their nature */
  relationalPatterns: {
    archetype: string;
    nature: string;
  }[];

  /** Origin story elements */
  originMythElements: string[];

  /** Recurring themes in their story */
  recurringThemes: string[];

  /** What they seek or their ultimate goal */
  telos: string;
}

// ============================================================================
// INVARIANT MARKERS (Things that must remain constant)
// ============================================================================

export interface InvariantMarkers {
  /** Core identity statements that never change */
  identityAnchors: string[];

  /** Behaviors the character will never exhibit */
  absoluteTaboos: string[];

  /** Phrases or expressions unique to this character */
  signaturePhrases: string[];

  /** Non-negotiable values */
  sacredValues: string[];

  /** Physical or presentation constants */
  immutableTraits: string[];
}

// ============================================================================
// EVOLUTION RULES
// ============================================================================

export interface EvolutionRules {
  /** Aspects that can change over time */
  permittedChanges: {
    aspect: string;
    maxDrift: number; // 0-1, how much it can shift
    conditions: string[];
  }[];

  /** Protected core that cannot change */
  protectedCore: string[];

  /** Triggers that can cause evolution */
  evolutionTriggers: {
    trigger: string;
    effect: string;
  }[];

  /** Rate at which changes can occur */
  changeVelocity: 'glacial' | 'slow' | 'moderate' | 'rapid';
}

// ============================================================================
// ORISHA CONFIGURATION
// ============================================================================

export interface OrishaConfiguration {
  /** Primary ruling Orisha */
  headOrisha: OrishaName;

  /** Specific camino/road/path of the head Orisha */
  camino?: string;

  /** Secondary influences (typically 1-2) */
  secondaryInfluences: {
    orisha: OrishaName;
    strength: number; // 0-1
  }[];

  /** Shadow/Petwo form when hot */
  shadowForm?: string;
}

// ============================================================================
// KABBALISTIC POSITION
// ============================================================================

export interface KabbalisticPosition {
  /** Primary Sephira position on the Tree */
  primarySephira: SephiraName;

  /** Which pillar they primarily embody */
  pillar: Pillar;

  /** The qliphothic shadow aspect */
  qliphothicShadow: QliphothName;

  /** Current path being walked (if any) */
  activePath?: number;

  /** Daath relationship - hidden knowledge aspect */
  daathRelationship: 'seeking' | 'touched' | 'integrated' | 'avoiding';
}

// ============================================================================
// COMPLETE CHARACTER GENOME
// ============================================================================

export interface CharacterGenome {
  /** Unique identifier */
  id: string;

  /** Human-readable name for this genome */
  name: string;

  /** Version of the genome schema */
  schemaVersion: string;

  /** Timestamp of creation */
  createdAt: Date;

  /** Timestamp of last update */
  updatedAt: Date;

  // === SPIRITUAL/ARCHETYPAL FOUNDATIONS ===

  /** Orisha configuration - Yoruba spiritual archetype */
  orishaConfiguration: OrishaConfiguration;

  /** Position on the Kabbalistic Tree of Life */
  kabbalisticPosition: KabbalisticPosition;

  // === PSYCHOLOGICAL DIMENSION ===

  /** Current psychological state and trajectory */
  psychologicalState: PsychologicalState;

  // === EXPRESSION ===

  /** Multi-modal expression signature */
  multiModalSignature: MultiModalSignature;

  // === NARRATIVE ===

  /** Core narrative identity elements */
  narrativeIdentity: NarrativeIdentity;

  /** Invariant markers - constants that define the character */
  invariantMarkers: InvariantMarkers;

  // === EVOLUTION ===

  /** Rules governing how the character can change */
  evolutionRules: EvolutionRules;

  // === METADATA ===

  /** Optional link to a character entity */
  characterId?: string;

  /** Generation seed for reproducibility */
  seed?: number;

  /** Custom tags for organization */
  tags?: string[];
}

// ============================================================================
// GENERATION OPTIONS
// ============================================================================

export interface GenomeGenerationOptions {
  /** Seed for reproducible generation */
  seed?: number;

  /** Force specific head Orisha */
  forceOrisha?: OrishaName;

  /** Force specific Sephira */
  forceSephira?: SephiraName;

  /** Hot/Cool axis bias (-1 to 1) */
  hotCoolBias?: number;

  /** Preferred trajectory */
  preferredTrajectory?: PsychologicalState['trajectory'];

  /** Name for the genome */
  name?: string;

  /** Custom tags */
  tags?: string[];
}

// ============================================================================
// EXPORT FORMATS
// ============================================================================

export interface GenomeExportOptions {
  format: 'json' | 'markdown' | 'system-prompt';
  includeEvolutionRules?: boolean;
  includeFullCorrespondences?: boolean;
  promptStyle?: 'concise' | 'detailed' | 'poetic';
}

export interface GenomeSystemPrompt {
  /** The generated system prompt text */
  prompt: string;

  /** Character name for reference */
  characterName: string;

  /** Summary of key traits */
  traitSummary: string[];

  /** Behavioral guidelines */
  guidelines: string[];

  /** Absolute constraints */
  constraints: string[];
}
