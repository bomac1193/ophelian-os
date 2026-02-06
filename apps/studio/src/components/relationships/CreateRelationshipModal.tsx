/**
 * Create Relationship Modal Component
 * Form for creating new relationships between characters
 */

'use client';

import React, { useState } from 'react';
import type { Relationship, RelationshipType } from '@lcos/shared';
import styles from './CreateRelationshipModal.module.css';

interface CreateRelationshipModalProps {
  characterId: string;
  characterName: string;
  onClose: () => void;
  onSuccess: (relationship: Relationship) => void;
}

const RELATIONSHIP_TYPES: { value: RelationshipType; label: string; icon: string; description: string }[] = [
  { value: 'FRIEND', label: 'Friend', icon: '', description: 'A friendly, supportive relationship' },
  { value: 'RIVAL', label: 'Rival', icon: '', description: 'Competitive or antagonistic relationship' },
  { value: 'MENTOR', label: 'Mentor', icon: '', description: 'Guiding or teaching relationship' },
  { value: 'STUDENT', label: 'Student', icon: '', description: 'Learning or being guided' },
  { value: 'FAMILY', label: 'Family', icon: '', description: 'Family bond or kinship' },
  { value: 'ROMANTIC', label: 'Romantic', icon: '', description: 'Romantic or intimate relationship' },
  { value: 'ENEMY', label: 'Enemy', icon: '', description: 'Hostile or adversarial relationship' },
  { value: 'ALLY', label: 'Ally', icon: '', description: 'Strategic alliance or partnership' },
  { value: 'NEUTRAL', label: 'Neutral', icon: '', description: 'Neutral or undefined relationship' },
];

export function CreateRelationshipModal({
  characterId,
  characterName,
  onClose,
  onSuccess,
}: CreateRelationshipModalProps) {
  const [otherCharacterId, setOtherCharacterId] = useState('');
  const [relationshipType, setRelationshipType] = useState<RelationshipType>('FRIEND');
  const [strength, setStrength] = useState(50);
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/relationships', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          characterAId: characterId,
          characterBId: otherCharacterId,
          relationshipType,
          strength,
          description: description || null,
          isPublic,
          history: [],
          meta: {},
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create relationship');
      }

      const data = await response.json();
      onSuccess(data.relationship);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create relationship');
    } finally {
      setLoading(false);
    }
  };

  const getStrengthLabel = (value: number) => {
    if (value >= 80) return 'Very Strong';
    if (value >= 60) return 'Strong';
    if (value >= 40) return 'Moderate';
    if (value >= 20) return 'Weak';
    return 'Very Weak';
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Create New Relationship</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label className={styles.label}>From Character</label>
            <div className={styles.characterDisplay}>
              <span className={styles.characterName}>{characterName}</span>
              <span className={styles.characterId}>{characterId}</span>
            </div>
          </div>

          <div className={styles.section}>
            <label htmlFor="otherCharacter" className={styles.label}>
              To Character <span className={styles.required}>*</span>
            </label>
            <input
              id="otherCharacter"
              type="text"
              value={otherCharacterId}
              onChange={(e) => setOtherCharacterId(e.target.value)}
              placeholder="Enter character ID"
              className={styles.input}
              required
            />
            <p className={styles.hint}>The character ID of who this relationship is with</p>
          </div>

          <div className={styles.section}>
            <label className={styles.label}>
              Relationship Type <span className={styles.required}>*</span>
            </label>
            <div className={styles.typeGrid}>
              {RELATIONSHIP_TYPES.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setRelationshipType(type.value)}
                  className={`${styles.typeCard} ${relationshipType === type.value ? styles.selected : ''}`}
                  title={type.description}
                >
                  <span className={styles.typeIcon}>{type.icon}</span>
                  <span className={styles.typeLabel}>{type.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className={styles.section}>
            <label htmlFor="strength" className={styles.label}>
              Relationship Strength: {strength}% ({getStrengthLabel(strength)})
            </label>
            <input
              id="strength"
              type="range"
              min="0"
              max="100"
              value={strength}
              onChange={(e) => setStrength(Number(e.target.value))}
              className={styles.slider}
            />
            <div className={styles.strengthBar}>
              <div className={styles.strengthFill} style={{ width: `${strength}%` }} />
            </div>
          </div>

          <div className={styles.section}>
            <label htmlFor="description" className={styles.label}>
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the nature of this relationship..."
              className={styles.textarea}
              rows={3}
            />
          </div>

          <div className={styles.section}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Make this relationship public</span>
            </label>
            <p className={styles.hint}>Public relationships can be used in multi-character stories</p>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Creating...' : 'Create Relationship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
