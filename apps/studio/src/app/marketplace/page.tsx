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
      {/* Hero */}
      <div className={styles.hero}>
        <div className={styles.heroLabel}>
          THRESHOLD
        </div>

        <h1 className={styles.heroTitle}>
          Voice Access & Licensing
        </h1>

        <div className={styles.heroDivider}></div>

        <p className={styles.heroDescription}>
          Consent-based voice models available under clear, enforceable terms.
        </p>
        <p className={styles.heroDescription}>
          Each voice remains owned by its source. Access is granted by agreement.
        </p>
      </div>

      {/* How Access Works */}
      <div className={styles.sectionHeader}>
        <h2 className={styles.sectionTitle}>How Access Works</h2>
      </div>

      <div className={styles.features}>
        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>The Source</h3>
          <p className={styles.featureText}>
            Every voice originates from a real person.
          </p>
          <p className={styles.featureText}>
            Nothing is published without explicit consent.
          </p>
          <p className={styles.featureText}>
            Ownership never transfers. Attribution is preserved.
          </p>
        </div>

        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>The Agreement</h3>
          <p className={styles.featureText}>
            Each use is governed by clearly defined terms:
          </p>
          <ul className={styles.featureList}>
            <li>scope</li>
            <li>exclusivity (if applicable)</li>
            <li>revenue split</li>
            <li>duration</li>
          </ul>
          <p className={styles.featureText}>
            No hidden clauses.
          </p>
          <p className={styles.featureText}>
            No silent capture.
          </p>
          <p className={styles.featureText}>
            All conditions are visible before access is granted.
          </p>
        </div>

        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>The Return</h3>
          <p className={styles.featureText}>
            Revenue is distributed automatically and transparently.
          </p>
          <p className={styles.featureText}>
            Sources receive the majority share by default.
          </p>
          <p className={styles.featureText}>
            All transactions are recorded.
          </p>
          <p className={styles.featureText}>
            All accounting is auditable.
          </p>
        </div>

        <div className={styles.featureCard}>
          <h3 className={styles.featureTitle}>The Rendering</h3>
          <p className={styles.featureText}>
            Voices are generated using Chromox synthesis.
          </p>
          <p className={styles.featureText}>
            High-fidelity output designed to preserve tone, cadence, and character —
            without imitating identity beyond what has been licensed.
          </p>
          <p className={styles.featureText} style={{ fontStyle: 'italic' }}>
            Precision over spectacle.
          </p>
        </div>
      </div>

      {/* Marketplace Grid */}
      <VoiceMarketplace />
    </div>
  );
}
