'use client';

import { useState, useRef, useEffect } from 'react';
import { getEnhancedHint, type OrishaName } from '@lcos/oripheon';
import styles from './EnhancedGatewayTooltip.module.css';

interface EnhancedGatewayTooltipProps {
  orisha: OrishaName;
  title: string;
  keywords: string[];
  essence: string;
  creativePhase: string;
  children: React.ReactNode;
}

export function EnhancedGatewayTooltip({
  orisha,
  title,
  keywords,
  essence,
  creativePhase,
  children,
}: EnhancedGatewayTooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const enhancedHint = getEnhancedHint(orisha);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isVisible) return;

      if (e.key === 'Escape') {
        setIsVisible(false);
        setIsExpanded(false);
      } else if (e.key === 'Enter' || e.key === ' ') {
        if (isVisible && tooltipRef.current?.contains(document.activeElement)) {
          e.preventDefault();
          setIsExpanded(!isExpanded);
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isVisible, isExpanded]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setIsVisible(false);
        setIsExpanded(false);
      }
    };

    if (isVisible) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isVisible]);

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      ref={wrapperRef}
      className={styles.wrapper}
      onMouseEnter={() => setIsVisible(true)}
      onMouseLeave={() => {
        if (!isExpanded) {
          setIsVisible(false);
        }
      }}
      tabIndex={0}
      role="button"
      aria-label="Show gateway hint"
    >
      {children}

      {isVisible && (
        <div
          ref={tooltipRef}
          className={`${styles.tooltip} ${isExpanded ? styles.expanded : ''}`}
          onClick={handleToggleExpand}
          role="dialog"
          aria-label="Gateway hint dialog"
        >
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            <div className={styles.keywords}>
              {keywords.map((keyword, i) => (
                <span key={i} className={styles.keyword}>
                  {keyword}
                  {i < keywords.length - 1 && <span className={styles.separator}>·</span>}
                </span>
              ))}
            </div>
          </div>

          {/* Short Hint */}
          <div className={styles.shortHint}>
            "{enhancedHint.shortHint}"
          </div>

          {/* Essence */}
          {!isExpanded && (
            <div className={styles.essence}>{essence}</div>
          )}

          {/* Expanded Content */}
          {isExpanded && (
            <div className={styles.expandedContent}>
              <div className={styles.expandedText}>
                {enhancedHint.expandedContent}
              </div>

              {/* Correspondences */}
              <div className={styles.correspondences}>
                <div className={styles.correspondenceTitle}>Sacred Correspondences</div>
                <div className={styles.correspondenceGrid}>
                  {enhancedHint.correspondences.element && (
                    <div className={styles.correspondenceItem}>
                      <span className={styles.correspondenceLabel}>Element</span>
                      <span className={styles.correspondenceValue}>
                        {enhancedHint.correspondences.element}
                      </span>
                    </div>
                  )}
                  {enhancedHint.correspondences.day && (
                    <div className={styles.correspondenceItem}>
                      <span className={styles.correspondenceLabel}>Day</span>
                      <span className={styles.correspondenceValue}>
                        {enhancedHint.correspondences.day}
                      </span>
                    </div>
                  )}
                  {enhancedHint.correspondences.number && (
                    <div className={styles.correspondenceItem}>
                      <span className={styles.correspondenceLabel}>Number</span>
                      <span className={styles.correspondenceValue}>
                        {enhancedHint.correspondences.number}
                      </span>
                    </div>
                  )}
                  {enhancedHint.correspondences.colors && (
                    <div className={styles.correspondenceItem}>
                      <span className={styles.correspondenceLabel}>Colors</span>
                      <span className={styles.correspondenceValue}>
                        {enhancedHint.correspondences.colors.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actionable Insight */}
              <div className={styles.insight}>
                <div className={styles.insightIcon}>⚡</div>
                <div className={styles.insightText}>
                  {enhancedHint.actionableInsight}
                </div>
              </div>

              {/* Creative Phase */}
              <div className={styles.creativePhase}>{creativePhase}</div>
            </div>
          )}

          {/* Expand Button */}
          <button
            type="button"
            className={styles.expandButton}
            onClick={handleToggleExpand}
            aria-label={isExpanded ? 'Collapse' : 'Expand'}
          >
            {isExpanded ? 'Show Less ▲' : 'Learn More ▼'}
          </button>
        </div>
      )}
    </div>
  );
}
