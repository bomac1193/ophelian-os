/**
 * Enhanced ElevenLabs Voice Provider
 * Adapted from Chromox project with prosody support, pronunciation dictionaries,
 * and advanced voice settings
 */
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';
import type { VoiceProfile } from '@lcos/shared';
import {
  VoiceProvider,
  type AudioResult,
  type VoiceProviderConfig,
  type GenerateAudioOptions,
  type StyleControls,
  type ProsodyHints,
  type VoiceEmotion,
} from './base.js';

interface ElevenLabsVoiceSettings {
  stability: number;
  similarity_boost: number;
  style?: number;
  use_speaker_boost?: boolean;
}

export class ElevenLabsProvider extends VoiceProvider {
  private baseUrl = 'https://api.elevenlabs.io/v1';

  constructor(config: VoiceProviderConfig) {
    super(config);
  }

  get name(): string {
    return 'elevenlabs';
  }

  isAvailable(): boolean {
    return !!this.config.apiKey;
  }

  /**
   * Simple text-to-speech generation (legacy interface)
   */
  async generateAudio(profile: VoiceProfile, text: string): Promise<AudioResult> {
    return this.generateAudioEnhanced({ profile, text });
  }

  /**
   * Enhanced generation with full chromox-style options
   */
  async generateAudioEnhanced(options: GenerateAudioOptions): Promise<AudioResult> {
    const { profile, text, styleControls, prosodyHints, emotion } = options;

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

    // Build enhanced voice settings
    const voiceSettings = this.buildVoiceSettings(styleControls, prosodyHints, emotion);

    // Select model based on use case
    const modelId = this.selectModel(options);

    // Make API call to ElevenLabs
    const response = await fetch(
      `${this.baseUrl}/text-to-speech/${profile.providerVoiceId}`,
      {
        method: 'POST',
        headers: {
          'xi-api-key': this.config.apiKey!,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          model_id: modelId,
          voice_settings: voiceSettings,
          output_format: 'mp3_44100_128', // High quality stereo
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

    // Estimate duration (words per second based on prosody)
    const wordsPerSecond = this.estimateWordsPerSecond(prosodyHints);
    const wordCount = text.split(/\s+/).filter((w) => w.length > 0).length;
    const seconds = wordCount / wordsPerSecond;

    return {
      filePath,
      seconds,
      provider: this.name,
      meta: {
        wordCount,
        profileLabel: profile.label,
        voiceId: profile.providerVoiceId,
        modelId,
        voiceSettings,
        emotion,
        prosodyHints,
      },
    };
  }

  /**
   * Build voice settings from style controls and prosody hints
   * Adapted from Chromox's ElevenLabsProviderEnhanced
   */
  private buildVoiceSettings(
    controls?: StyleControls,
    prosody?: ProsodyHints,
    emotion?: VoiceEmotion
  ): ElevenLabsVoiceSettings {
    // Base settings
    let stability = controls?.stability ?? 0.5;
    let similarityBoost = controls?.similarityBoost ?? 0.75;
    let style = controls?.energy ?? 0.5;

    // Adjust stability based on prosody rhythm
    if (prosody?.rhythm === 'syllable-timed') {
      // More variation for African/Caribbean accents
      stability = Math.max(0.3, stability * 0.9);
    } else if (prosody?.rhythm === 'stress-timed') {
      // More stable for American/British English
      stability = Math.min(0.8, stability * 1.1);
    }

    // Adjust style based on emotion
    if (emotion === 'excited' || emotion === 'happy') {
      style = Math.min(1.0, style * 1.3);
    } else if (emotion === 'calm' || emotion === 'sad') {
      style = Math.max(0.0, style * 0.7);
    } else if (emotion === 'angry') {
      style = Math.min(1.0, style * 1.2);
      stability = Math.max(0.3, stability * 0.8);
    }

    // Adjust tempo effect on stability
    if (prosody?.tempo === 'fast') {
      stability = Math.max(0.4, stability * 0.95);
    } else if (prosody?.tempo === 'slow') {
      stability = Math.min(0.9, stability * 1.1);
    }

    return {
      stability: this.clamp(stability, 0, 1),
      similarity_boost: this.clamp(similarityBoost, 0, 1),
      style: this.clamp(style, 0, 1),
      use_speaker_boost: true, // Always use for clarity
    };
  }

  /**
   * Select the best model based on generation options
   */
  private selectModel(options: GenerateAudioOptions): string {
    // Use turbo model for faster generation when no special requirements
    // Use multilingual for accent support
    if (options.accentType || options.pronunciationHints) {
      return 'eleven_multilingual_v2';
    }

    // Use turbo for standard generation (faster, still high quality)
    return 'eleven_turbo_v2_5';
  }

  /**
   * Estimate words per second based on prosody
   */
  private estimateWordsPerSecond(prosody?: ProsodyHints): number {
    // Base rate: 2.5 words per second (150 wpm)
    let wps = 2.5;

    if (prosody?.tempo === 'fast') {
      wps = 3.0;
    } else if (prosody?.tempo === 'slow') {
      wps = 2.0;
    }

    return wps;
  }

  private clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
  }
}
