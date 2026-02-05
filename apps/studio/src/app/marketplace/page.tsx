/**
 * Voice Actor IP Marketplace
 * Blue Ocean Feature: Browse and license professional voices
 * Design: Sembla meets Disney - Future fashion AI agency aesthetic
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
      {/* Hero Section - Editorial Fashion Magazine Style */}
      <div className={styles.hero}>
        <div className={styles.heroContent}>
          <div className={styles.badge}>
            <span className={styles.badgeDot}></span>
            Industry-First IP Marketplace
          </div>
          <h1 className={styles.title}>
            Professional Voice Talent
            <span className={styles.titleGradient}>for AI Characters</span>
          </h1>
          <p className={styles.subtitle}>
            License studio-grade voices from professional actors. Fair compensation.
            Ethical AI. Transparent revenue sharing.
          </p>
        </div>

        {/* Stats Showcase */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statValue}>100+</div>
            <div className={styles.statLabel}>Voice Artists</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>70%</div>
            <div className={styles.statLabel}>Artist Revenue Share</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statValue}>100%</div>
            <div className={styles.statLabel}>Consent-Based</div>
          </div>
        </div>
      </div>

      {/* Value Props - Clean Feature Grid */}
      <div className={styles.features}>
        <div className={styles.featureCard}>
          <div className={styles.featureIconContainer}>
            <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Consent-First</h3>
            <p className={styles.featureText}>
              Every voice is licensed with explicit consent. Blockchain-verified provenance ensures artists retain control.
            </p>
          </div>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIconContainer}>
            <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 2V6M12 18V22M6 12H2M22 12H18M19.07 4.93L16.24 7.76M7.76 16.24L4.93 19.07M19.07 19.07L16.24 16.24M7.76 7.76L4.93 4.93" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Fair Compensation</h3>
            <p className={styles.featureText}>
              Voice actors earn 70% per usage. Transparent splits. Real-time analytics. No hidden fees.
            </p>
          </div>
        </div>

        <div className={styles.featureCard}>
          <div className={styles.featureIconContainer}>
            <svg className={styles.featureIcon} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M19 11H5M19 11C20.1046 11 21 11.8954 21 13V19C21 20.1046 20.1046 21 19 21H5C3.89543 21 3 20.1046 3 19V13C3 11.8954 3.89543 11 5 11M19 11V9C19 7.89543 18.1046 7 17 7M5 11V9C5 7.89543 5.89543 7 7 7M7 7V5C7 3.89543 7.89543 3 9 3H15C16.1046 3 17 3.89543 17 5V7M7 7H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className={styles.featureContent}>
            <h3 className={styles.featureTitle}>Studio Quality</h3>
            <p className={styles.featureText}>
              Professional-grade voice clones via Chromox. Indistinguishable from human performance.
            </p>
          </div>
        </div>
      </div>

      {/* Marketplace Grid */}
      <VoiceMarketplace />
    </div>
  );
}
