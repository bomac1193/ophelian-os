'use client';

import { useState, useEffect } from 'react';
import styles from './AdvancedViewProgress.module.css';

interface AdvancedViewProgressProps {
  genomeCount: number;
  accountAgeDays: number;
  hasUnlocked: boolean;
  onUnlock?: () => void;
}

export function AdvancedViewProgress({
  genomeCount,
  accountAgeDays,
  hasUnlocked,
  onUnlock,
}: AdvancedViewProgressProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const [justUnlocked, setJustUnlocked] = useState(false);

  const GENOME_THRESHOLD = 3;
  const DAYS_THRESHOLD = 7;

  const genomeProgress = Math.min(genomeCount / GENOME_THRESHOLD, 1);
  const daysProgress = Math.min(accountAgeDays / DAYS_THRESHOLD, 1);

  // Check if user just unlocked (for celebration)
  useEffect(() => {
    if (hasUnlocked && !justUnlocked) {
      setJustUnlocked(true);
      setShowCelebration(true);
      onUnlock?.();

      // Auto-hide celebration after 5 seconds
      setTimeout(() => {
        setShowCelebration(false);
      }, 5000);
    }
  }, [hasUnlocked, justUnlocked, onUnlock]);

  if (hasUnlocked && !showCelebration) {
    return (
      <div className={styles.unlockedBadge}>
        <span className={styles.unlockedIcon}>✓</span>
        <span>Advanced View Unlocked</span>
      </div>
    );
  }

  if (showCelebration) {
    return (
      <div className={styles.celebrationModal}>
        <div className={styles.celebrationContent}>
          <div className={styles.celebrationIcon}>🔓</div>
          <h2 className={styles.celebrationTitle}>Sacred Knowledge Unlocked!</h2>
          <p className={styles.celebrationText}>
            You have earned access to the Depths layer - the full mythology, correspondences, and sacred wisdom of the genomes.
          </p>
          <button
            type="button"
            onClick={() => setShowCelebration(false)}
            className={styles.celebrationButton}
          >
            Explore the Depths
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.progressContainer}>
      <div className={styles.progressHeader}>
        <h3 className={styles.progressTitle}>Unlock Advanced View</h3>
        <p className={styles.progressDescription}>
          Earn access to the Depths layer by creating genomes or being on the platform
        </p>
      </div>

      {/* Genome Count Progress */}
      <div className={styles.progressItem}>
        <div className={styles.progressLabel}>
          <span>Create Genomes</span>
          <span className={styles.progressCount}>
            {genomeCount}/{GENOME_THRESHOLD}
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${genomeProgress * 100}%` }}
          />
        </div>
        {genomeCount >= GENOME_THRESHOLD && (
          <div className={styles.progressComplete}>✓ Complete</div>
        )}
      </div>

      {/* Account Age Progress */}
      <div className={styles.progressItem}>
        <div className={styles.progressLabel}>
          <span>Time on Platform</span>
          <span className={styles.progressCount}>
            {Math.min(accountAgeDays, DAYS_THRESHOLD)}/{DAYS_THRESHOLD} days
          </span>
        </div>
        <div className={styles.progressBar}>
          <div
            className={styles.progressFill}
            style={{ width: `${daysProgress * 100}%` }}
          />
        </div>
        {accountAgeDays >= DAYS_THRESHOLD && (
          <div className={styles.progressComplete}>✓ Complete</div>
        )}
      </div>

      <div className={styles.progressFooter}>
        <p className={styles.progressHint}>
          {genomeCount < GENOME_THRESHOLD ? (
            <>Create {GENOME_THRESHOLD - genomeCount} more {GENOME_THRESHOLD - genomeCount === 1 ? 'genome' : 'genomes'} to unlock</>
          ) : accountAgeDays < DAYS_THRESHOLD ? (
            <>{DAYS_THRESHOLD - Math.floor(accountAgeDays)} more days to unlock</>
          ) : (
            'You qualify for Advanced View!'
          )}
        </p>
      </div>
    </div>
  );
}
