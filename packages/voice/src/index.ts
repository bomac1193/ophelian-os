import type { VoiceProfile } from '@lcos/shared';
import { VoiceProvider } from '@lcos/shared';
import { StubVoiceProvider } from './providers/stub.js';
import { ElevenLabsProvider } from './providers/elevenlabs.js';
import type { AudioResult, VoiceProviderConfig } from './providers/base.js';

export { StubVoiceProvider } from './providers/stub.js';
export { ElevenLabsProvider } from './providers/elevenlabs.js';
export type { AudioResult, VoiceProviderConfig } from './providers/base.js';

export interface GenerateAudioOptions {
  voiceProfile: VoiceProfile;
  text: string;
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

  async generateAudio(options: GenerateAudioOptions): Promise<AudioResult> {
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

  getAvailableProviders(): string[] {
    const providers: string[] = ['stub'];
    if (this.elevenLabsProvider.isAvailable()) {
      providers.push('elevenlabs');
    }
    return providers;
  }
}

// Convenience function
export async function generateAudio(
  options: GenerateAudioOptions,
  config: VoiceServiceConfig
): Promise<AudioResult> {
  const service = new VoiceService(config);
  return service.generateAudio(options);
}
