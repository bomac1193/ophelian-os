/**
 * Create Story Modal Component
 * Form for creating new transmedia stories
 */

'use client';

import React, { useState } from 'react';
import type { TransmediaStory } from '@lcos/shared';
import styles from './CreateStoryModal.module.css';

interface CreateStoryModalProps {
  characterId: string;
  characterName: string;
  onClose: () => void;
  onSuccess: (story: TransmediaStory) => void;
}

const MEDIA_TYPES = [
  { value: 'TEXT', label: 'Text', icon: '' },
  { value: 'AUDIO', label: 'Audio', icon: '' },
  { value: 'VISUAL', label: 'Visual', icon: '' },
  { value: 'VIDEO', label: 'Video', icon: '' },
  { value: 'INTERACTIVE', label: 'Interactive', icon: '' },
];

const PLATFORMS = [
  { value: 'TWITTER', label: 'Twitter', icon: '' },
  { value: 'INSTAGRAM', label: 'Instagram', icon: '' },
  { value: 'TIKTOK', label: 'TikTok', icon: '' },
  { value: 'PODCAST', label: 'Podcast', icon: '' },
  { value: 'BLOG', label: 'Blog', icon: '' },
  { value: 'NEWSLETTER', label: 'Newsletter', icon: '' },
  { value: 'YOUTUBE', label: 'YouTube', icon: '' },
];

export function CreateStoryModal({
  characterId,
  characterName: _characterName,
  onClose,
  onSuccess,
}: CreateStoryModalProps) {
  const [title, setTitle] = useState('');
  const [arcName, setArcName] = useState('');
  const [arcDescription, setArcDescription] = useState('');
  const [theme, setTheme] = useState('');
  const [genre, setGenre] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [selectedMediaTypes, setSelectedMediaTypes] = useState<string[]>(['TEXT']);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['TWITTER']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/transmedia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          arc: {
            name: arcName,
            description: arcDescription,
            theme,
            targetAudience,
            estimatedDuration: '5 episodes',
          },
          primaryCharacterId: characterId,
          supportingCharacterIds: [],
          targetMediaTypes: selectedMediaTypes,
          targetPlatforms: selectedPlatforms,
          genre,
          tags: [],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create story');
      }

      const data = await response.json();
      onSuccess(data.story);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create story');
    } finally {
      setLoading(false);
    }
  };

  const toggleMediaType = (type: string) => {
    setSelectedMediaTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const togglePlatform = (platform: string) => {
    setSelectedPlatforms((prev) =>
      prev.includes(platform) ? prev.filter((p) => p !== platform) : [...prev, platform]
    );
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Create Transmedia Story</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label htmlFor="title" className={styles.label}>
              Story Title <span className={styles.required}>*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter story title"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.section}>
            <label htmlFor="arcName" className={styles.label}>
              Story Arc Name <span className={styles.required}>*</span>
            </label>
            <input
              id="arcName"
              type="text"
              value={arcName}
              onChange={(e) => setArcName(e.target.value)}
              placeholder="e.g., The Hero's Journey"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.section}>
            <label htmlFor="arcDescription" className={styles.label}>
              Arc Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="arcDescription"
              value={arcDescription}
              onChange={(e) => setArcDescription(e.target.value)}
              placeholder="Describe the story arc..."
              className={styles.textarea}
              rows={3}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.section}>
              <label htmlFor="theme" className={styles.label}>
                Theme <span className={styles.required}>*</span>
              </label>
              <input
                id="theme"
                type="text"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                placeholder="e.g., Redemption, Love, Justice"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.section}>
              <label htmlFor="genre" className={styles.label}>
                Genre <span className={styles.required}>*</span>
              </label>
              <input
                id="genre"
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g., Fantasy, Sci-Fi, Drama"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.section}>
            <label htmlFor="targetAudience" className={styles.label}>
              Target Audience <span className={styles.required}>*</span>
            </label>
            <input
              id="targetAudience"
              type="text"
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              placeholder="e.g., Young Adults, General Audience"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              Media Types <span className={styles.required}>*</span>
            </label>
            <div className={styles.optionsGrid}>
              {MEDIA_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => toggleMediaType(type.value)}
                  className={`${styles.optionCard} ${selectedMediaTypes.includes(type.value) ? styles.selected : ''}`}
                >
                  <span className={styles.optionIcon}>{type.icon}</span>
                  <span className={styles.optionLabel}>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              Target Platforms <span className={styles.required}>*</span>
            </label>
            <div className={styles.optionsGrid}>
              {PLATFORMS.map((platform) => (
                <button
                  key={platform.value}
                  type="button"
                  onClick={() => togglePlatform(platform.value)}
                  className={`${styles.optionCard} ${selectedPlatforms.includes(platform.value) ? styles.selected : ''}`}
                >
                  <span className={styles.optionIcon}>{platform.icon}</span>
                  <span className={styles.optionLabel}>{platform.label}</span>
                </button>
              ))}
            </div>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Creating...' : 'Create Story'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
