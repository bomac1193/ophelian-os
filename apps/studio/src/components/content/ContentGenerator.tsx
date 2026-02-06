/**
 * Content Generator Component
 * Genome-driven content generation UI
 * Uses character's Orisha/Sephira/L-class to generate authentic content
 */

'use client';

import React, { useState, useEffect } from 'react';
import type { OrishaName, SephiraName } from '@lcos/oripheon';
import styles from './ContentGenerator.module.css';

type Platform = 'X' | 'INSTAGRAM' | 'TIKTOK';

interface ContentGeneratorProps {
  characterId: string;
  characterName: string;
  orisha?: OrishaName;
  sephira?: SephiraName;
  lClass?: string;
  suggestedIntent?: string;
}

interface GeneratedContent {
  text: string;
  platform: Platform;
  intent: string;
  genomeInfluence: {
    orisha: string;
    sephira: string;
    lClass: string;
  };
}

export function ContentGenerator({
  characterId,
  characterName,
  orisha,
  sephira,
  lClass,
  suggestedIntent,
}: ContentGeneratorProps) {
  const [platform, setPlatform] = useState<Platform>('X');
  const [intent, setIntent] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [error, setError] = useState<string | null>(null);

  const hasGenomeData = orisha && sephira && lClass;

  // Update intent when suggestion is selected
  useEffect(() => {
    if (suggestedIntent) {
      setIntent(suggestedIntent);
      setError(null);
    }
  }, [suggestedIntent]);

  const handleGenerate = async () => {
    if (!intent.trim()) {
      setError('Please enter an intent for the content');
      return;
    }

    setIsGenerating(true);
    setError(null);

    try {
      const response = await fetch('/api/content/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterId,
          platform,
          intent,
          genomeData: hasGenomeData
            ? {
                orisha,
                sephira,
                lClass,
              }
            : undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate content');
      }

      const data = await response.json();

      setGeneratedContent({
        text: data.text,
        platform,
        intent,
        genomeInfluence: {
          orisha: orisha || 'N/A',
          sephira: sephira || 'N/A',
          lClass: lClass || 'N/A',
        },
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent.text);
    }
  };

  const handleReset = () => {
    setGeneratedContent(null);
    setIntent('');
    setError(null);
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h3 className={styles.title}>Generate Content</h3>
        {hasGenomeData && (
          <div className={styles.genomeBadge}>
            <span className={styles.genomeBadgeIcon}></span>
            <span className={styles.genomeBadgeText}>Genome-Driven</span>
          </div>
        )}
      </div>

      {!hasGenomeData && (
        <div className={styles.warning}>
          <span className={styles.warningIcon}>⚠️</span>
          <span className={styles.warningText}>
            No genome data available. Content will use basic personality system.
          </span>
        </div>
      )}

      {/* Input Form */}
      {!generatedContent && (
        <div className={styles.form}>
          {/* Platform Selection */}
          <div className={styles.field}>
            <label className={styles.label}>Platform</label>
            <div className={styles.platformButtons}>
              {(['X', 'INSTAGRAM', 'TIKTOK'] as Platform[]).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPlatform(p)}
                  className={`${styles.platformButton} ${
                    platform === p ? styles.platformButtonActive : ''
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Intent Input */}
          <div className={styles.field}>
            <label className={styles.label}>
              Intent
              <span className={styles.labelHint}>
                What should {characterName} communicate?
              </span>
            </label>
            <textarea
              value={intent}
              onChange={(e) => setIntent(e.target.value)}
              placeholder="e.g., Share wisdom about creative transformation..."
              className={styles.textarea}
              rows={3}
            />
          </div>

          {/* Genome Preview */}
          {hasGenomeData && (
            <div className={styles.genomePreview}>
              <div className={styles.genomePreviewTitle}>Genome Influence</div>
              <div className={styles.genomePreviewGrid}>
                <div className={styles.genomePreviewItem}>
                  <span className={styles.genomePreviewLabel}>Orisha</span>
                  <span className={styles.genomePreviewValue}>{orisha}</span>
                </div>
                <div className={styles.genomePreviewItem}>
                  <span className={styles.genomePreviewLabel}>Sephira</span>
                  <span className={styles.genomePreviewValue}>{sephira}</span>
                </div>
                <div className={styles.genomePreviewItem}>
                  <span className={styles.genomePreviewLabel}>L-Class</span>
                  <span className={styles.genomePreviewValue}>{lClass}</span>
                </div>
              </div>
            </div>
          )}

          {/* Error Display */}
          {error && (
            <div className={styles.error}>
              <span className={styles.errorIcon}></span>
              <span className={styles.errorText}>{error}</span>
            </div>
          )}

          {/* Generate Button */}
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating || !intent.trim()}
            className={styles.generateButton}
          >
            {isGenerating ? (
              <>
                <span className={styles.spinner} />
                Generating...
              </>
            ) : (
              <>Generate Content</>
            )}
          </button>
        </div>
      )}

      {/* Generated Content Display */}
      {generatedContent && (
        <div className={styles.result}>
          <div className={styles.resultHeader}>
            <div className={styles.resultTitle}>Generated Content</div>
            <div className={styles.resultPlatform}>{generatedContent.platform}</div>
          </div>

          <div className={styles.resultContent}>{generatedContent.text}</div>

          {/* Genome Influence Indicator */}
          {hasGenomeData && (
            <div className={styles.resultGenome}>
              <div className={styles.resultGenomeTitle}>
                Influenced by {characterName}'s Genome
              </div>
              <div className={styles.resultGenomeDetails}>
                {generatedContent.genomeInfluence.orisha} · {generatedContent.genomeInfluence.sephira} · {generatedContent.genomeInfluence.lClass}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className={styles.resultActions}>
            <button
              type="button"
              onClick={handleCopy}
              className={styles.copyButton}
            >
              Copy to Clipboard
            </button>
            <button
              type="button"
              onClick={handleReset}
              className={styles.resetButton}
            >
              Generate Another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
