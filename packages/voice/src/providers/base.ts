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

export abstract class VoiceProvider {
  protected config: VoiceProviderConfig;

  constructor(config: VoiceProviderConfig) {
    this.config = config;
  }

  abstract generateAudio(profile: VoiceProfile, text: string): Promise<AudioResult>;
  abstract get name(): string;
  abstract isAvailable(): boolean;
}
