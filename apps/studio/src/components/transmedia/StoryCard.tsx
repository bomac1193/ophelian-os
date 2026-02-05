/**
 * Story Card Component
 * Displays a single transmedia story with its beats and adaptations
 */

'use client';

import React, { useState } from 'react';
import type { TransmediaStory } from '@lcos/shared';
import styles from './StoryCard.module.css';

interface StoryCardProps {
  story: TransmediaStory;
  onDelete: () => void;
  onGenerateBeats: () => void;
}

const STATUS_COLORS: Record<string, string> = {
  DRAFT: '#ffd700',
  IN_PROGRESS: '#4facfe',
  PUBLISHED: '#64ffda',
  COMPLETED: '#a8b2d1',
};

const STATUS_LABELS: Record<string, string> = {
  DRAFT: 'Draft',
  IN_PROGRESS: 'In Progress',
  PUBLISHED: 'Published',
  COMPLETED: 'Completed',
};

export function StoryCard({ story, onDelete, onGenerateBeats }: StoryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h4 className={styles.title}>{story.title}</h4>
          <span
            className={styles.status}
            style={{ backgroundColor: STATUS_COLORS[story.status] }}
          >
            {STATUS_LABELS[story.status]}
          </span>
        </div>
        <button onClick={onDelete} className={styles.deleteButton} title="Delete story">
          ×
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.arcInfo}>
          <h5 className={styles.sectionTitle}>Story Arc</h5>
          <p className={styles.arcName}>{story.arc.name}</p>
          <p className={styles.arcDescription}>{story.arc.description}</p>
          <div className={styles.metadata}>
            <span className={styles.metaItem}>
              <strong>Theme:</strong> {story.arc.theme}
            </span>
            <span className={styles.metaItem}>
              <strong>Genre:</strong> {story.genre}
            </span>
          </div>
        </div>

        <div className={styles.platformsSection}>
          <h5 className={styles.sectionTitle}>Target Platforms</h5>
          <div className={styles.platformTags}>
            {story.targetPlatforms.map((platform) => (
              <span key={platform} className={styles.platformTag}>
                {getPlatformIcon(platform)} {platform}
              </span>
            ))}
          </div>
        </div>

        <div className={styles.mediaTypesSection}>
          <h5 className={styles.sectionTitle}>Media Types</h5>
          <div className={styles.mediaTags}>
            {story.targetMediaTypes.map((type) => (
              <span key={type} className={styles.mediaTag}>
                {getMediaIcon(type)} {type}
              </span>
            ))}
          </div>
        </div>

        {story.beats.length === 0 ? (
          <div className={styles.noBeats}>
            <p>No story beats generated yet</p>
            <button onClick={onGenerateBeats} className={styles.generateButton}>
              Generate Story Beats
            </button>
          </div>
        ) : (
          <div className={styles.beatsSection}>
            <div className={styles.beatsSummary} onClick={() => setExpanded(!expanded)}>
              <h5 className={styles.sectionTitle}>
                Story Beats ({story.beats.length})
              </h5>
              <span className={styles.expandIcon}>{expanded ? '▼' : '▶'}</span>
            </div>

            {expanded && (
              <div className={styles.beatsList}>
                {story.beats.map((beat, idx) => (
                  <div key={idx} className={styles.beatItem}>
                    <div className={styles.beatHeader}>
                      <span className={styles.beatNumber}>{idx + 1}</span>
                      <span className={styles.beatType}>{beat.beatType}</span>
                      <span className={styles.beatTone}>{beat.emotionalTone}</span>
                    </div>
                    <p className={styles.beatNarrative}>{beat.coreNarrative}</p>
                    <div className={styles.adaptationsCount}>
                      {beat.adaptations.length} adaptation{beat.adaptations.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function getPlatformIcon(platform: string): string {
  const icons: Record<string, string> = {
    TWITTER: '🐦',
    INSTAGRAM: '📷',
    TIKTOK: '🎵',
    PODCAST: '🎙️',
    BLOG: '📝',
    NEWSLETTER: '📧',
    YOUTUBE: '📹',
  };
  return icons[platform] || '📱';
}

function getMediaIcon(type: string): string {
  const icons: Record<string, string> = {
    TEXT: '📄',
    AUDIO: '🔊',
    VISUAL: '🖼️',
    VIDEO: '🎬',
    INTERACTIVE: '🎮',
  };
  return icons[type] || '📱';
}
