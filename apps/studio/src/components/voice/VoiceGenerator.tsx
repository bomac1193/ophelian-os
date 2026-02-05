/**
 * Voice Generator Component
 * Text-to-speech synthesis with local Chromox integration
 */

'use client';

import React, { useState } from 'react';
import styles from './VoiceGenerator.module.css';

type VoiceEmotion = 'neutral' | 'happy' | 'sad' | 'angry' | 'excited' | 'calm';

interface VoiceGeneratorProps {
  characterId: string;
  characterName: string;
  initialText?: string;
}

interface AudioResult {
  audioUrl: string;
  filePath: string;
  seconds: number;
  provider: string;
  meta?: {
    personaId: string;
    renderId: string;
  };
}

export function VoiceGenerator({
  characterId,
  characterName,
  initialText = '',
}: VoiceGeneratorProps) {
  const [text, setText] = useState(initialText);
  const [isGenerating, setIsGenerating] = useState(false);
  const [audioResult, setAudioResult] = useState<AudioResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Emotion/style selection
  const [emotion, setEmotion] = useState<VoiceEmotion>('neutral');

  // Chromox-specific style controls
  const [brightness, setBrightness] = useState(0.5);
  const [breathiness, setBreathiness] = useState(0.3);
  const [energy, setEnergy] = useState(0.5);
  const [formant, setFormant] = useState(0.5);
  const [vibratoDepth, setVibratoDepth] = useState(0.3);
  const [vibratoRate, setVibratoRate] = useState(0.5);

  const handleGenerate = async () => {
    if (!text.trim()) {
      setError('Please enter text to synthesize');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setAudioResult(null);

    try {
      const response = await fetch('/api/voice/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId,
          text,
          emotion,
          styleControls: {
            brightness,
            breathiness,
            energy,
            formant,
            vibratoDepth,
            vibratoRate,
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        const errorMsg = errorData.error || 'Failed to generate audio';
        throw new Error(errorMsg);
      }

      const data = await response.json();
      setAudioResult(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate audio');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h3 className={styles.title}>🎤 Voice Synthesis</h3>
        <p className={styles.subtitle}>Generate audio as {characterName} using local Chromox</p>
      </div>

      {/* Text Input */}
      <div className={styles.section}>
        <label className={styles.label}>Text / Lyrics</label>
        <textarea
          className={styles.textarea}
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Enter text or lyrics to synthesize..."
          rows={6}
        />
      </div>

      {/* Emotion/Style Selection */}
      <div className={styles.section}>
        <label className={styles.label}>Emotion / Style</label>
        <select
          className={styles.select}
          value={emotion}
          onChange={(e) => setEmotion(e.target.value as VoiceEmotion)}
        >
          <option value="neutral">Neutral</option>
          <option value="happy">Happy</option>
          <option value="sad">Sad</option>
          <option value="angry">Angry</option>
          <option value="excited">Excited</option>
          <option value="calm">Calm</option>
        </select>
      </div>

      {/* Chromox Style Controls */}
      <div className={styles.advancedSection}>
        <h4 className={styles.sectionTitle}>🎚️ Voice Controls</h4>

        <div className={styles.controlGroup}>
          <div className={styles.control}>
            <label className={styles.controlLabel}>
              Brightness: {brightness.toFixed(2)}
            </label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.05"
              value={brightness}
              onChange={(e) => setBrightness(parseFloat(e.target.value))}
            />
            <p className={styles.controlHint}>Tonal brightness and clarity</p>
          </div>

          <div className={styles.control}>
            <label className={styles.controlLabel}>
              Breathiness: {breathiness.toFixed(2)}
            </label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.05"
              value={breathiness}
              onChange={(e) => setBreathiness(parseFloat(e.target.value))}
            />
            <p className={styles.controlHint}>Airiness and breath presence</p>
          </div>

          <div className={styles.control}>
            <label className={styles.controlLabel}>
              Energy: {energy.toFixed(2)}
            </label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.05"
              value={energy}
              onChange={(e) => setEnergy(parseFloat(e.target.value))}
            />
            <p className={styles.controlHint}>Vocal intensity and power</p>
          </div>

          <div className={styles.control}>
            <label className={styles.controlLabel}>
              Formant: {formant.toFixed(2)}
            </label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.05"
              value={formant}
              onChange={(e) => setFormant(parseFloat(e.target.value))}
            />
            <p className={styles.controlHint}>Voice character and timbre</p>
          </div>

          <div className={styles.control}>
            <label className={styles.controlLabel}>
              Vibrato Depth: {vibratoDepth.toFixed(2)}
            </label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.05"
              value={vibratoDepth}
              onChange={(e) => setVibratoDepth(parseFloat(e.target.value))}
            />
            <p className={styles.controlHint}>Amount of pitch variation</p>
          </div>

          <div className={styles.control}>
            <label className={styles.controlLabel}>
              Vibrato Rate: {vibratoRate.toFixed(2)}
            </label>
            <input
              type="range"
              className={styles.slider}
              min="0"
              max="1"
              step="0.05"
              value={vibratoRate}
              onChange={(e) => setVibratoRate(parseFloat(e.target.value))}
            />
            <p className={styles.controlHint}>Speed of pitch oscillation</p>
          </div>
        </div>
      </div>

      {/* Generate Button */}
      <button
        className={styles.generateButton}
        onClick={handleGenerate}
        disabled={isGenerating || !text.trim()}
      >
        {isGenerating ? 'Generating...' : '🎵 Generate Voice'}
      </button>

      {/* Error Display */}
      {error && (
        <div className={styles.error}>
          ⚠️ {error}
        </div>
      )}

      {/* Audio Result */}
      {audioResult && (
        <div className={styles.result}>
          <h4 className={styles.resultTitle}>✅ Audio Generated</h4>
          <div className={styles.audioInfo}>
            <p>Provider: {audioResult.provider}</p>
            {audioResult.meta?.renderId && (
              <p>Render ID: {audioResult.meta.renderId}</p>
            )}
          </div>
          <audio
            className={styles.audioPlayer}
            controls
            src={audioResult.audioUrl}
            autoPlay
          >
            Your browser does not support audio playback.
          </audio>
          <a
            href={audioResult.audioUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.downloadLink}
          >
            📥 Open in new tab
          </a>
        </div>
      )}

      {/* Info Banner */}
      <div className={styles.infoBanner}>
        <p className={styles.infoText}>
          ℹ️ Make sure Chromox backend is running: <code>cd ~/chromox/backend && npm run dev</code>
        </p>
      </div>
    </div>
  );
}
