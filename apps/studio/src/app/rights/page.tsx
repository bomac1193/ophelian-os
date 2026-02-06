/**
 * Rights Management Page
 * Blue Ocean Feature: IP licensing and royalty management
 */

'use client';

import { useState, useEffect } from 'react';
import { LicenseManager } from '../../components/rights/LicenseManager';
import styles from './rights.module.css';

export default function RightsPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.title}>Rights Management</h1>
          <p className={styles.subtitle}>
            License your voice IP, track usage, and manage royalty splits
          </p>
        </div>
      </div>

      <div className={styles.infoCard}>
        <h3 className={styles.infoTitle}>How It Works</h3>
        <ul className={styles.infoList}>
          <li>
            <strong>Voice Actors:</strong> Clone your voice in Chromox, create a license, set your royalty terms
          </li>
          <li>
            <strong>Creators:</strong> Browse licensed voices, use them in characters, share revenue per usage
          </li>
          <li>
            <strong>Platform:</strong> Track all usage, ensure consent, distribute royalties transparently
          </li>
        </ul>
      </div>

      <LicenseManager />
    </div>
  );
}
