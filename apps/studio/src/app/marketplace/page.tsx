/**
 * Voice Actor IP Marketplace
 * Blue Ocean Feature: Browse and license professional voices
 */

'use client';

import { useState, useEffect } from 'react';
import { VoiceMarketplace } from '../../components/marketplace/VoiceMarketplace';
import styles from './marketplace.module.css';

export default function MarketplacePage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>🎭 Voice Actor Marketplace</h1>
          <p className={styles.subtitle}>
            License professional voices from talented voice actors. Fair revenue sharing. Ethical AI.
          </p>
        </div>
        <div className={styles.heroBadge}>
          <div className={styles.badgeIcon}>🌊</div>
          <div className={styles.badgeText}>
            <span className={styles.badgeLabel}>Blue Ocean Innovation</span>
            <span className={styles.badgeValue}>First AI Voice IP Marketplace</span>
          </div>
        </div>
      </div>

      <div className={styles.features}>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>✅</div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Consent-First</h3>
            <p className={styles.featureText}>All voices are licensed with explicit consent</p>
          </div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>💰</div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Revenue Share</h3>
            <p className={styles.featureText}>Voice actors earn per usage with transparent splits</p>
          </div>
        </div>
        <div className={styles.feature}>
          <div className={styles.featureIcon}>🎤</div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Professional Quality</h3>
            <p className={styles.featureText}>Studio-grade voice clones via Chromox</p>
          </div>
        </div>
      </div>

      <VoiceMarketplace />
    </div>
  );
}
