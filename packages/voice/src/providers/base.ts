import type { VoiceProfile } from '@lcos/shared';

export interface AudioResult {
  filePath: string;
  seconds: number;
  provider: string;
  meta: Record<string, unknown>;
}

export interface VoiceProviderConfig {
  apiKey?: string;
  storagePath: string;
}

/**
 * Style controls for voice synthesis
 * Adapted from Chromox project
 */
export interface StyleControls {
  /** Voice stability - 0 = more variation, 1 = more stable */
  stability?: number;
  /** Similarity to reference voice - 0 = less similar, 1 = more similar */
  similarityBoost?: number;
  /** Energy/expressiveness - 0 = calm, 1 = energetic */
  energy?: number;
  /** Voice clarity - 0 = warm, 1 = clear */
  clarity?: number;
}

/**
 * Prosody hints for natural speech rhythm
 * Adapted from Chromox project
 */
export interface ProsodyHints {
  /** Speech rhythm pattern */
  rhythm?: 'syllable-timed' | 'stress-timed' | 'mora-timed';
  /** Intonation pattern */
  intonation?: 'rising' | 'falling' | 'flat' | 'melodic';
  /** Speaking tempo */
  tempo?: 'fast' | 'moderate' | 'slow';
}

/**
 * Emotion for voice synthesis */
export type VoiceEmotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'calm';

/**
 * Extended generation options for enhanced voice synthesis
 */
export interface GenerateAudioOptions {
  /** Text to synthesize */
  text: string;
  /** Voice profile to use */
  profile: VoiceProfile;
  /** Style controls for voice manipulation */
  styleControls?: StyleControls;
  /** Prosody hints for natural speech */
  prosodyHints?: ProsodyHints;
  /** Emotion to convey */
  emotion?: VoiceEmotion;
  /** Pronunciation hints for specific words */
  pronunciationHints?: Record<string, string>;
  /** Accent type for dialect support */
  accentType?: string;
}

export abstract class VoiceProvider {
  protected config: VoiceProviderConfig;

  constructor(config: VoiceProviderConfig) {
    this.config = config;
  }

  /** Simple text-to-speech generation */
  abstract generateAudio(profile: VoiceProfile, text: string): Promise<AudioResult>;

  /** Enhanced generation with full options (default falls back to simple) */
  async generateAudioEnhanced(options: GenerateAudioOptions): Promise<AudioResult> {
    return this.generateAudio(options.profile, options.text);
  }

  abstract get name(): string;
  abstract isAvailable(): boolean;
}
