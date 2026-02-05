/**
 * Genome Skeleton Loading Component
 * Provides visual feedback while genome data loads
 */

'use client';

import React from 'react';
import styles from './GenomeSkeleton.module.css';

export function GenomeSkeleton() {
  return (
    <div className={styles.container}>
      {/* Header Skeleton */}
      <div className={styles.header}>
        <div className={`${styles.skeleton} ${styles.title}`} />
      </div>

      {/* Symbol Display Skeleton */}
      <div className={styles.symbolSection}>
        <div className={`${styles.skeleton} ${styles.symbol}`} />
        <div className={`${styles.skeleton} ${styles.label}`} />
        <div className={`${styles.skeleton} ${styles.classification}`} />
      </div>

      {/* State Profile Skeleton */}
      <div className={styles.stateProfile}>
        <div className={`${styles.skeleton} ${styles.sectionTitle}`} />

        {/* Charge bar */}
        <div className={styles.statBar}>
          <div className={styles.statHeader}>
            <div className={`${styles.skeleton} ${styles.statLabel}`} />
            <div className={`${styles.skeleton} ${styles.statValue}`} />
          </div>
          <div className={`${styles.skeleton} ${styles.bar}`} />
        </div>

        {/* Stability bar */}
        <div className={styles.statBar}>
          <div className={styles.statHeader}>
            <div className={`${styles.skeleton} ${styles.statLabel}`} />
            <div className={`${styles.skeleton} ${styles.statValue}`} />
          </div>
          <div className={`${styles.skeleton} ${styles.bar}`} />
        </div>

        {/* Phase */}
        <div className={`${styles.skeleton} ${styles.phase}`} />
      </div>

      {/* Lattice Position Skeleton */}
      <div className={styles.latticeSection}>
        <div className={`${styles.skeleton} ${styles.sectionTitle}`} />
        <div className={`${styles.skeleton} ${styles.latticeInfo}`} />
        <div className={`${styles.skeleton} ${styles.latticeInfo}`} />
      </div>

      {/* Markers Skeleton */}
      <div className={styles.markersSection}>
        <div className={`${styles.skeleton} ${styles.sectionTitle}`} />
        <div className={styles.markerList}>
          <div className={`${styles.skeleton} ${styles.marker}`} />
          <div className={`${styles.skeleton} ${styles.marker}`} />
          <div className={`${styles.skeleton} ${styles.marker}`} />
        </div>
      </div>
    </div>
  );
}

/**
 * Compact skeleton for card views
 */
export function GenomeCardSkeleton() {
  return (
    <div className={styles.cardContainer}>
      <div className={`${styles.skeleton} ${styles.cardSymbol}`} />
      <div className={`${styles.skeleton} ${styles.cardLabel}`} />
      <div className={`${styles.skeleton} ${styles.cardClass}`} />
    </div>
  );
}

/**
 * Symbol Legend skeleton
 */
export function SymbolLegendSkeleton() {
  return (
    <div className={styles.gridContainer}>
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className={styles.legendCard}>
          <div className={`${styles.skeleton} ${styles.legendSymbol}`} />
          <div className={`${styles.skeleton} ${styles.legendName}`} />
          <div className={`${styles.skeleton} ${styles.legendTitle}`} />
          <div className={styles.legendInfo}>
            <div className={`${styles.skeleton} ${styles.legendInfoItem}`} />
            <div className={`${styles.skeleton} ${styles.legendInfoItem}`} />
          </div>
          <div className={styles.colorSwatches}>
            <div className={`${styles.skeleton} ${styles.colorSwatch}`} />
            <div className={`${styles.skeleton} ${styles.colorSwatch}`} />
            <div className={`${styles.skeleton} ${styles.colorSwatch}`} />
          </div>
        </div>
      ))}
    </div>
  );
}
