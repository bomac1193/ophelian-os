import type { VoiceProfile } from '@lcos/shared';
import { VoiceProvider } from '@lcos/shared';
import { StubVoiceProvider } from './providers/stub.js';
import { ElevenLabsProvider } from './providers/elevenlabs.js';
import type {
  AudioResult,
  VoiceProviderConfig,
  StyleControls,
  ProsodyHints,
  VoiceEmotion,
  GenerateAudioOptions as ProviderGenerateOptions,
} from './providers/base.js';

export { StubVoiceProvider } from './providers/stub.js';
export { ElevenLabsProvider } from './providers/elevenlabs.js';
export type {
  AudioResult,
  VoiceProviderConfig,
  StyleControls,
  ProsodyHints,
  VoiceEmotion,
} from './providers/base.js';
export type { GenerateAudioOptions as ProviderGenerateOptions } from './providers/base.js';

/** Simple service-level generation options */
export interface SimpleGenerateOptions {
  voiceProfile: VoiceProfile;
  text: string;
}

/** Enhanced service-level generation options with chromox features */
export interface EnhancedGenerateOptions extends SimpleGenerateOptions {
  styleControls?: StyleControls;
  prosodyHints?: ProsodyHints;
  emotion?: VoiceEmotion;
  pronunciationHints?: Record<string, string>;
  accentType?: string;
}

export interface VoiceServiceConfig {
  elevenLabsApiKey?: string;
  storagePath: string;
}

export class VoiceService {
  private stubProvider: StubVoiceProvider;
  private elevenLabsProvider: ElevenLabsProvider;

  constructor(config: VoiceServiceConfig) {
    const baseConfig: VoiceProviderConfig = {
      storagePath: config.storagePath,
    };

    this.stubProvider = new StubVoiceProvider(baseConfig);
    this.elevenLabsProvider = new ElevenLabsProvider({
      ...baseConfig,
      apiKey: config.elevenLabsApiKey,
    });
  }

  /** Simple generation (legacy interface) */
  async generateAudio(options: SimpleGenerateOptions): Promise<AudioResult> {
    const { voiceProfile, text } = options;

    // Select provider based on voice profile
    if (voiceProfile.provider === VoiceProvider.ELEVENLABS) {
      if (this.elevenLabsProvider.isAvailable()) {
        return this.elevenLabsProvider.generateAudio(voiceProfile, text);
      }
      // Fall back to stub if ElevenLabs not configured
      console.warn('ElevenLabs not available, using stub provider');
    }

    // Default to stub provider
    return this.stubProvider.generateAudio(voiceProfile, text);
  }

  /**
   * Enhanced generation with chromox-style options
   * Supports prosody, emotion, accent, and style controls
   */
  async generateAudioEnhanced(options: EnhancedGenerateOptions): Promise<AudioResult> {
    const { voiceProfile, text, styleControls, prosodyHints, emotion, pronunciationHints, accentType } = options;

    // Select provider based on voice profile
    if (voiceProfile.provider === VoiceProvider.ELEVENLABS) {
      if (this.elevenLabsProvider.isAvailable()) {
        return this.elevenLabsProvider.generateAudioEnhanced({
          profile: voiceProfile,
          text,
          styleControls,
          prosodyHints,
          emotion,
          pronunciationHints,
          accentType,
        });
      }
      console.warn('ElevenLabs not available, using stub provider');
    }

    // Default to stub provider (no enhanced features)
    return this.stubProvider.generateAudio(voiceProfile, text);
  }

  getAvailableProviders(): string[] {
    const providers: string[] = ['stub'];
    if (this.elevenLabsProvider.isAvailable()) {
      providers.push('elevenlabs');
    }
    return providers;
  }
}

// Convenience functions
export async function generateAudio(
  options: SimpleGenerateOptions,
  config: VoiceServiceConfig
): Promise<AudioResult> {
  const service = new VoiceService(config);
  return service.generateAudio(options);
}

export async function generateAudioEnhanced(
  options: EnhancedGenerateOptions,
  config: VoiceServiceConfig
): Promise<AudioResult> {
  const service = new VoiceService(config);
  return service.generateAudioEnhanced(options);
}
