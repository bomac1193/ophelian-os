import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { VoiceProfile } from '@lcos/shared';
import { VoiceProvider, type AudioResult, type VoiceProviderConfig } from './base.js';

export class ElevenLabsProvider extends VoiceProvider {
  constructor(config: VoiceProviderConfig) {
    super(config);
  }

  get name(): string {
    return 'elevenlabs';
  }

  isAvailable(): boolean {
    return !!this.config.apiKey;
  }

  async generateAudio(profile: VoiceProfile, text: string): Promise<AudioResult> {
    if (!this.isAvailable()) {
      throw new Error('ElevenLabs API key not configured');
    }

    if (!profile.providerVoiceId) {
      throw new Error('No ElevenLabs voice ID configured for this profile');
    }

    // Ensure storage directory exists
    if (!existsSync(this.config.storagePath)) {
      mkdirSync(this.config.storagePath, { recursive: true });
    }

    // Make API call to ElevenLabs
    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${profile.providerVoiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.config.apiKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: 'eleven_monolingual_v1',
          voice_settings: {
            stability: 0.5,
            similarity_boost: 0.5,
          },
        }),
      }
    );

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`ElevenLabs API error: ${error}`);
    }

    // Get audio buffer
    const audioBuffer = await response.arrayBuffer();

    // Generate filename and save
    const timestamp = Date.now();
    const filename = `audio_${profile.id}_${timestamp}.mp3`;
    const filePath = join(this.config.storagePath, filename);

    writeFileSync(filePath, Buffer.from(audioBuffer));

    // Estimate duration (rough estimate: 150 words per minute average)
    const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
    const seconds = (wordCount / 150) * 60;

    return {
      filePath,
      seconds,
      provider: this.name,
      meta: {
        wordCount,
        profileLabel: profile.label,
        voiceId: profile.providerVoiceId,
      },
    };
  }
}
