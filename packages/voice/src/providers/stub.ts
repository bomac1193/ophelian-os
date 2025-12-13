import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { VoiceProfile } from '@lcos/shared';
import { VoiceProvider, type AudioResult, type VoiceProviderConfig } from './base.js';

export class StubVoiceProvider extends VoiceProvider {
  constructor(config: VoiceProviderConfig) {
    super(config);
  }

  get name(): string {
    return 'stub';
  }

  isAvailable(): boolean {
    return true;
  }

  async generateAudio(profile: VoiceProfile, text: string): Promise<AudioResult> {
    // Ensure storage directory exists
    if (!existsSync(this.config.storagePath)) {
      mkdirSync(this.config.storagePath, { recursive: true });
    }

    // Calculate estimated duration (words / 2.2 words per second)
    const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
    const seconds = wordCount / 2.2;

    // Generate a unique filename
    const timestamp = Date.now();
    const filename = `audio_${profile.id}_${timestamp}.txt`;
    const filePath = join(this.config.storagePath, filename);

    // Write placeholder file
    const content = [
      '=== AUDIO PLACEHOLDER ===',
      `Profile: ${profile.label} (${profile.id})`,
      `Provider: ${profile.provider}`,
      `Generated: ${new Date().toISOString()}`,
      `Word count: ${wordCount}`,
      `Estimated duration: ${seconds.toFixed(2)} seconds`,
      '',
      '=== TEXT ===',
      text,
      '',
      '=== END ===',
    ].join('\n');

    writeFileSync(filePath, content, 'utf-8');

    return {
      filePath,
      seconds,
      provider: this.name,
      meta: {
        wordCount,
        profileLabel: profile.label,
        isPlaceholder: true,
      },
    };
  }
}
