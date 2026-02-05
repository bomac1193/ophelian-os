/**
 * First Visit Guide
 * Onboarding tooltip for Symbol System
 * Shows once per user to explain the three layers
 */

'use client';

import React, { useState, useEffect } from 'react';
import styles from './FirstVisitGuide.module.css';

interface FirstVisitGuideProps {
  storageKey: string;
  title: string;
  content: string | React.ReactNode;
  position?: 'center' | 'top' | 'bottom';
}

export function FirstVisitGuide({
  storageKey,
  title,
  content,
  position = 'center',
}: FirstVisitGuideProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Check if user has already seen this guide
    const hasSeenGuide = localStorage.getItem(storageKey);
    if (!hasSeenGuide) {
      // Show after a brief delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [storageKey]);

  const handleDismiss = () => {
    localStorage.setItem(storageKey, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={handleDismiss} />

      {/* Guide Modal */}
      <div className={`${styles.guide} ${styles[position]}`}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            type="button"
            onClick={handleDismiss}
            className={styles.closeButton}
            aria-label="Close"
          >
            ×
          </button>
        </div>

        <div className={styles.content}>{content}</div>

        <div className={styles.footer}>
          <button
            type="button"
            onClick={handleDismiss}
            className={styles.gotItButton}
          >
            Got it!
          </button>
        </div>
      </div>
    </>
  );
}

/**
 * Pre-built guide for Symbol Legend page
 */
export function SymbolLegendGuide() {
  return (
    <FirstVisitGuide
      storageKey="symbolLegendGuide_v1"
      title="Welcome to the Symbol System"
      content={
        <div className={styles.guideContent}>
          <p>
            Every character in Bóveda has a unique <strong>symbolic imprint</strong> that
            reveals their creative archetype.
          </p>

          <div className={styles.layers}>
            <div className={styles.layer}>
              <div className={styles.layerNumber}>1</div>
              <div className={styles.layerText}>
                <strong>Surface Layer</strong>
                <span>Mathematical symbol + geometric primitive + L-class</span>
              </div>
            </div>

            <div className={styles.layer}>
              <div className={styles.layerNumber}>2</div>
              <div className={styles.layerText}>
                <strong>Gateway Layer</strong>
                <span>Hover for keywords and essence, click to expand</span>
              </div>
            </div>

            <div className={styles.layer}>
              <div className={styles.layerNumber}>3</div>
              <div className={styles.layerText}>
                <strong>Depths Layer</strong>
                <span>Unlock after creating 3 characters</span>
              </div>
            </div>
          </div>

          <p className={styles.tip}>
            <strong>Pro tip:</strong> Hover over any symbol card to see its sacred
            correspondences and deeper meaning!
          </p>
        </div>
      }
    />
  );
}

/**
 * Pre-built guide for Character Creation
 */
export function CharacterCreationGuide() {
  return (
    <FirstVisitGuide
      storageKey="characterCreationSymbols_v1"
      title="Understanding Your Character's Genome"
      position="top"
      content={
        <div className={styles.guideContent}>
          <p>
            As you select your character's Orisha, Sephira, and Psychology, watch the
            <strong> symbolic imprint</strong> preview update in real-time.
          </p>

          <p>
            This unique signature represents your character's creative DNA—their
            aesthetic class, symbolic expression, and archetypal energy.
          </p>

          <p className={styles.tip}>
            Visit the <strong>Symbols</strong> page to explore all 10 Orisha archetypes
            and their meanings.
          </p>
        </div>
      }
    />
  );
}
