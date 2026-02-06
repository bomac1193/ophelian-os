/**
 * Voice Actor IP Marketplace
 * Design: Chanel × Apple × Disney Minimalist Brutalism
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
      {/* Hero - Ruler/Magician Energy */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>
          THE VOICE MARKETPLACE
        </div>

        <h1 className={styles.heroTitle}>
          Professional Talent
        </h1>

        <p className={styles.heroSubtitle}>
          Licensed for Characters
        </p>

        <div className={styles.heroDivider}></div>

        <p className={styles.heroDescription}>
          Studio-grade voices. Ethical licensing. Fair compensation.
        </p>
      </div>

      {/* Stats - Monochrome Grid */}
      <div className={styles.stats}>
        <div className={styles.statBlock}>
          <div className={styles.statNumber}>100+</div>
          <div className={styles.statLabel}>VOICE ARTISTS</div>
        </div>

        <div className={styles.statDivider}></div>

        <div className={styles.statBlock}>
          <div className={styles.statNumber}>70%</div>
          <div className={styles.statLabel}>ARTIST REVENUE</div>
        </div>

        <div className={styles.statDivider}></div>

        <div className={styles.statBlock}>
          <div className={styles.statNumber}>100%</div>
          <div className={styles.statLabel}>CONSENT-BASED</div>
        </div>
      </div>

      {/* Features - Minimal Cards */}
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Consent-First</h3>
          <p className={styles.featureText}>
            Every voice is licensed with explicit consent.
            Blockchain-verified provenance ensures artists retain control.
          </p>
        </div>

        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Fair Compensation</h3>
          <p className={styles.featureText}>
            Voice actors earn 70% per usage.
            Transparent splits. Real-time analytics. No hidden fees.
          </p>
        </div>

        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Studio Quality</h3>
          <p className={styles.featureText}>
            Professional-grade voice clones via Chromox.
            Indistinguishable from human performance.
          </p>
        </div>
      </div>

      {/* Marketplace Grid */}
      <VoiceMarketplace />
    </div>
  );
}
