/**
 * Relationship Card Component
 * Displays a single relationship between characters
 */

'use client';

import React, { useState } from 'react';
import type { Relationship } from '@lcos/shared';
import styles from './RelationshipCard.module.css';

interface RelationshipCardProps {
  relationship: Relationship;
  currentCharacterId: string;
  onDelete: () => void;
  onUpdateStrength: (newStrength: number) => void;
}

const RELATIONSHIP_ICONS: Record<string, string> = {
  FRIEND: '',
  RIVAL: '',
  MENTOR: '',
  STUDENT: '',
  FAMILY: '',
  ROMANTIC: '',
  ENEMY: '',
  ALLY: '',
  NEUTRAL: '',
};

const RELATIONSHIP_COLORS: Record<string, string> = {
  FRIEND: '#64ffda',
  RIVAL: '#ff6b6b',
  MENTOR: '#ffd700',
  STUDENT: '#4facfe',
  FAMILY: '#f093fb',
  ROMANTIC: '#ff6b9d',
  ENEMY: '#ff4444',
  ALLY: '#00f2fe',
  NEUTRAL: '#a8b2d1',
};

export function RelationshipCard({
  relationship,
  currentCharacterId,
  onDelete,
  onUpdateStrength,
}: RelationshipCardProps) {
  const [isEditingStrength, setIsEditingStrength] = useState(false);
  const [tempStrength, setTempStrength] = useState(relationship.strength);

  // Determine the "other" character (not the current one)
  const otherCharacterId =
    relationship.characterAId === currentCharacterId
      ? relationship.characterBId
      : relationship.characterAId;

  const handleSaveStrength = () => {
    onUpdateStrength(tempStrength);
    setIsEditingStrength(false);
  };

  const getStrengthLabel = (strength: number) => {
    if (strength >= 80) return 'Very Strong';
    if (strength >= 60) return 'Strong';
    if (strength >= 40) return 'Moderate';
    if (strength >= 20) return 'Weak';
    return 'Very Weak';
  };

  return (
    <div
      className={styles.card}
      style={{ '--relationship-color': RELATIONSHIP_COLORS[relationship.relationshipType] } as React.CSSProperties}
    >
      <div className={styles.header}>
        <div className={styles.type}>
          <span className={styles.icon}>
            {RELATIONSHIP_ICONS[relationship.relationshipType]}
          </span>
          <span className={styles.typeName}>
            {relationship.relationshipType.replace('_', ' ')}
          </span>
        </div>
        <button onClick={onDelete} className={styles.deleteButton} title="Delete relationship">
          ×
        </button>
      </div>

      <div className={styles.content}>
        <div className={styles.characterInfo}>
          <span className={styles.characterLabel}>With:</span>
          <span className={styles.characterId}>{otherCharacterId}</span>
        </div>

        {relationship.description && (
          <p className={styles.description}>{relationship.description}</p>
        )}

        <div className={styles.strengthSection}>
          <div className={styles.strengthHeader}>
            <span className={styles.strengthLabel}>Relationship Strength</span>
            {!isEditingStrength && (
              <button
                onClick={() => {
                  setTempStrength(relationship.strength);
                  setIsEditingStrength(true);
                }}
                className={styles.editButton}
              >
                ✏️
              </button>
            )}
          </div>

          {isEditingStrength ? (
            <div className={styles.strengthEdit}>
              <input
                type="range"
                min="0"
                max="100"
                value={tempStrength}
                onChange={(e) => setTempStrength(Number(e.target.value))}
                className={styles.slider}
              />
              <div className={styles.strengthValue}>{tempStrength}%</div>
              <div className={styles.editActions}>
                <button onClick={handleSaveStrength} className={styles.saveButton}>
                  Save
                </button>
                <button
                  onClick={() => setIsEditingStrength(false)}
                  className={styles.cancelButton}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <div className={styles.strengthBar}>
                <div
                  className={styles.strengthFill}
                  style={{ width: `${relationship.strength}%` }}
                />
              </div>
              <div className={styles.strengthInfo}>
                <span className={styles.strengthPercentage}>{relationship.strength}%</span>
                <span className={styles.strengthText}>
                  {getStrengthLabel(relationship.strength)}
                </span>
              </div>
            </>
          )}
        </div>

        {relationship.history.length > 0 && (
          <div className={styles.history}>
            <h5 className={styles.historyTitle}>Recent History</h5>
            <div className={styles.historyEvents}>
              {relationship.history.slice(-3).reverse().map((event, idx) => (
                <div key={idx} className={styles.historyEvent}>
                  <span className={styles.eventText}>{event.event}</span>
                  <span className={`${styles.eventImpact} ${event.impactOnStrength >= 0 ? styles.positive : styles.negative}`}>
                    {event.impactOnStrength >= 0 ? '+' : ''}{event.impactOnStrength}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
