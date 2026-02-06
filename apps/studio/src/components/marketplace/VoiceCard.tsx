/**
 * Voice Card Component
 * Displays a voice listing in the marketplace
 * Design: Circular profile, brutalist minimalism
 */

'use client';

import React from 'react';
import type { MarketplaceVoice } from './VoiceMarketplace';
import styles from './VoiceCard.module.css';

interface VoiceCardProps {
  voice: MarketplaceVoice;
  onLicense: () => void;
}

export function VoiceCard({ voice, onLicense }: VoiceCardProps) {
  const formatPrice = (cents: number) => {
    return `$${(cents / 100).toFixed(2)}`;
  };

  const renderStars = (rating: number) => {
    return '★'.repeat(Math.floor(rating)) + '☆'.repeat(5 - Math.floor(rating));
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={styles.card}>
      {/* Circular Profile Header */}
      <div className={styles.profileHeader}>
        <div className={styles.avatarCircle}>
          <span className={styles.avatarInitials}>
            {getInitials(voice.actorName)}
          </span>
        </div>
      </div>

      <div className={styles.header}>
        <div className={styles.nameSection}>
          <h3 className={styles.voiceName}>{voice.name}</h3>
          <p className={styles.actorName}>{voice.actorName}</p>
        </div>
        <div className={styles.rating}>
          <span className={styles.stars}>{renderStars(voice.rating)}</span>
          <span className={styles.ratingValue}>{voice.rating}</span>
        </div>
      </div>

      <p className={styles.description}>{voice.description}</p>

      <div className={styles.tags}>
        {voice.tags.map((tag) => (
          <span key={tag} className={styles.tag}>
            {tag}
          </span>
        ))}
      </div>

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{voice.stats.totalLicenses}</span>
          <span className={styles.statLabel}>Licenses</span>
        </div>
        <div className={styles.statDivider}></div>
        <div className={styles.statItem}>
          <span className={styles.statValue}>{voice.stats.usageCount.toLocaleString()}</span>
          <span className={styles.statLabel}>Uses</span>
        </div>
      </div>

      <div className={styles.pricing}>
        <div className={styles.priceSection}>
          <h4 className={styles.priceTitle}>Licensing</h4>
          <div className={styles.priceOptions}>
            <div className={styles.priceOption}>
              <span className={styles.priceLabel}>EXCLUSIVE</span>
              <span className={styles.priceValue}>{formatPrice(voice.pricing.exclusive)}</span>
            </div>
            <div className={styles.priceOption}>
              <span className={styles.priceLabel}>PER USE</span>
              <span className={styles.priceValue}>{formatPrice(voice.pricing.nonExclusive)}</span>
            </div>
            <div className={styles.priceOption}>
              <span className={styles.priceLabel}>REV SHARE</span>
              <span className={styles.priceValue}>
                {voice.pricing.revShare.voiceActor}/{voice.pricing.revShare.creator}/{voice.pricing.revShare.platform}
              </span>
            </div>
          </div>
        </div>
      </div>

      {voice.sampleUrl && (
        <div className={styles.audioSection}>
          <audio
            className={styles.audioPlayer}
            controls
            src={voice.sampleUrl}
            preload="metadata"
          >
            Your browser does not support audio playback.
          </audio>
        </div>
      )}

      <button
        className={styles.licenseButton}
        onClick={onLicense}
        disabled={!voice.available}
      >
        {voice.available ? 'LICENSE VOICE' : 'NOT AVAILABLE'}
      </button>
    </div>
  );
}
