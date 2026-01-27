/**
 * Bóveda Studio - Genome API Client
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'default-dev-key';

// Types matching the genome system
export interface OrishaConfiguration {
  headOrisha: string;
  camino?: string;
  secondaryInfluences: {
    orisha: string;
    strength: number;
  }[];
  shadowForm?: string;
}

export interface KabbalisticPosition {
  primarySephira: string;
  pillar: 'Mercy' | 'Severity' | 'Balance';
  qliphothicShadow: string;
  activePath?: number;
  daathRelationship: 'seeking' | 'touched' | 'integrated' | 'avoiding';
}

export interface PsychologicalState {
  individuationLevel: number;
  hotCoolAxis: number;
  dominantComplex: string;
  shadowIntegration: number;
  activeArchetypes: string[];
  trajectory: 'emergence' | 'ascent' | 'crisis' | 'descent' | 'integration' | 'transcendence';
}

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
  pitchRange: string;
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
  harmonicComplexity: string;
  genreInfluences: string[];
}

export interface MovementSignature {
  qualityOfMotion: string;
  tempoPreference: string;
  spatialOrientation: string;
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

export interface NarrativeIdentity {
  coreValues: string[];
  centralConflicts: string[];
  relationalPatterns: { archetype: string; nature: string }[];
  originMythElements: string[];
  recurringThemes: string[];
  telos: string;
}

export interface InvariantMarkers {
  identityAnchors: string[];
  absoluteTaboos: string[];
  signaturePhrases: string[];
  sacredValues: string[];
  immutableTraits: string[];
}

export interface EvolutionRules {
  permittedChanges: {
    aspect: string;
    maxDrift: number;
    conditions: string[];
  }[];
  protectedCore: string[];
  evolutionTriggers: { trigger: string; effect: string }[];
  changeVelocity: 'glacial' | 'slow' | 'moderate' | 'rapid';
}

export interface CharacterGenome {
  id: string;
  name: string;
  schemaVersion: string;
  createdAt: string;
  updatedAt: string;
  orishaConfiguration: OrishaConfiguration;
  kabbalisticPosition: KabbalisticPosition;
  psychologicalState: PsychologicalState;
  multiModalSignature: MultiModalSignature;
  narrativeIdentity: NarrativeIdentity;
  invariantMarkers: InvariantMarkers;
  evolutionRules: EvolutionRules;
  characterId?: string;
  seed?: number;
  tags?: string[];
}

export interface GenomeGenerationOptions {
  name?: string;
  seed?: number;
  forceOrisha?: string;
  forceSephira?: string;
  hotCoolBias?: number;
  preferredTrajectory?: string;
  tags?: string[];
}

export interface GenomeSystemPrompt {
  prompt: string;
  characterName: string;
  traitSummary: string[];
  guidelines: string[];
  constraints: string[];
}

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || error.error || `API error: ${response.status}`);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json();
}

// CRUD Operations

export async function createGenome(options?: GenomeGenerationOptions): Promise<CharacterGenome> {
  return apiFetch<CharacterGenome>('/genomes', {
    method: 'POST',
    body: JSON.stringify(options || {}),
  });
}

export async function getGenomes(filters?: {
  orisha?: string;
  sephira?: string;
  trajectory?: string;
  tag?: string;
}): Promise<CharacterGenome[]> {
  const params = new URLSearchParams();
  if (filters?.orisha) params.set('orisha', filters.orisha);
  if (filters?.sephira) params.set('sephira', filters.sephira);
  if (filters?.trajectory) params.set('trajectory', filters.trajectory);
  if (filters?.tag) params.set('tag', filters.tag);

  const queryString = params.toString();
  const endpoint = queryString ? `/genomes?${queryString}` : '/genomes';

  return apiFetch<CharacterGenome[]>(endpoint);
}

export async function getGenome(id: string): Promise<CharacterGenome> {
  return apiFetch<CharacterGenome>(`/genomes/${id}`);
}

export async function updateGenome(id: string, data: Partial<CharacterGenome>): Promise<CharacterGenome> {
  return apiFetch<CharacterGenome>(`/genomes/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function deleteGenome(id: string): Promise<void> {
  await apiFetch<void>(`/genomes/${id}`, {
    method: 'DELETE',
  });
}

// Generation (without saving)

export async function generateGenome(options?: GenomeGenerationOptions): Promise<CharacterGenome> {
  return apiFetch<CharacterGenome>('/genomes/generate', {
    method: 'POST',
    body: JSON.stringify(options || {}),
  });
}

export async function generateGenomeForOrisha(
  orisha: string,
  options?: Omit<GenomeGenerationOptions, 'forceOrisha'>
): Promise<CharacterGenome> {
  return apiFetch<CharacterGenome>(`/genomes/generate/orisha/${orisha}`, {
    method: 'POST',
    body: JSON.stringify(options || {}),
  });
}

export async function generateGenomeForSephira(
  sephira: string,
  options?: Omit<GenomeGenerationOptions, 'forceSephira'>
): Promise<CharacterGenome> {
  return apiFetch<CharacterGenome>(`/genomes/generate/sephira/${sephira}`, {
    method: 'POST',
    body: JSON.stringify(options || {}),
  });
}

export async function rerollGenome(
  seed: number,
  options?: Partial<GenomeGenerationOptions>
): Promise<CharacterGenome> {
  return apiFetch<CharacterGenome>(`/genomes/reroll/${seed}`, {
    method: 'POST',
    body: JSON.stringify(options || {}),
  });
}

// Prompt Generation

export async function generatePrompt(
  genomeId: string,
  style: 'concise' | 'detailed' | 'poetic' = 'detailed'
): Promise<GenomeSystemPrompt> {
  return apiFetch<GenomeSystemPrompt>(`/genomes/${genomeId}/generate-prompt`, {
    method: 'POST',
    body: JSON.stringify({ style }),
  });
}

// Export

export async function exportGenome(
  genomeId: string,
  format: 'json' | 'markdown' | 'system-prompt',
  promptStyle?: 'concise' | 'detailed' | 'poetic'
): Promise<string> {
  const response = await fetch(`${API_URL}/genomes/${genomeId}/export`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
    },
    body: JSON.stringify({ format, promptStyle }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || error.error || `API error: ${response.status}`);
  }

  return response.text();
}

// Character Linking

export async function linkGenomeToCharacter(genomeId: string, characterId: string): Promise<CharacterGenome> {
  return apiFetch<CharacterGenome>(`/genomes/${genomeId}/link/${characterId}`, {
    method: 'POST',
  });
}

export async function unlinkGenome(genomeId: string): Promise<CharacterGenome> {
  return apiFetch<CharacterGenome>(`/genomes/${genomeId}/link`, {
    method: 'DELETE',
  });
}
