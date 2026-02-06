/**
 * Relationship Manager Component
 * Displays and manages character relationships
 */

'use client';

import React, { useState, useEffect } from 'react';
import { RelationshipCard } from './RelationshipCard';
import { CreateRelationshipModal } from './CreateRelationshipModal';
import { RelationshipNetwork } from './RelationshipNetwork';
import type { Relationship } from '@lcos/shared';
import styles from './RelationshipManager.module.css';

interface RelationshipManagerProps {
  characterId: string;
  characterName: string;
}

export function RelationshipManager({ characterId, characterName }: RelationshipManagerProps) {
  const [relationships, setRelationships] = useState<Relationship[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'list' | 'network'>('list');

  const fetchRelationships = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/relationships?characterId=${characterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch relationships');
      }
      const data = await response.json();
      setRelationships(data.relationships);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load relationships');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRelationships();
  }, [characterId]);

  const handleCreateRelationship = () => {
    setIsCreateModalOpen(true);
  };

  const handleRelationshipCreated = (newRelationship: Relationship) => {
    setRelationships([...relationships, newRelationship]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteRelationship = async (relationshipId: string) => {
    if (!confirm('Are you sure you want to delete this relationship?')) return;

    try {
      const response = await fetch(`/api/relationships/${relationshipId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete relationship');
      }

      setRelationships(relationships.filter((r) => r.id !== relationshipId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete relationship');
    }
  };

  const handleUpdateStrength = async (relationshipId: string, newStrength: number) => {
    try {
      const relationship = relationships.find((r) => r.id === relationshipId);
      if (!relationship) return;

      const response = await fetch(`/api/relationships/${relationshipId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...relationship,
          strength: newStrength,
          history: [
            ...relationship.history,
            {
              timestamp: new Date(),
              event: 'Strength updated manually',
              impactOnStrength: newStrength - relationship.strength,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update relationship');
      }

      const data = await response.json();
      setRelationships(
        relationships.map((r) => (r.id === relationshipId ? data.relationship : r))
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to update relationship');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading relationships...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>⚠️ {error}</p>
        <button onClick={fetchRelationships} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{characterName}'s Relationships</h3>
          <p className={styles.subtitle}>
            {relationships.length} {relationships.length === 1 ? 'connection' : 'connections'}
          </p>
        </div>
        <div className={styles.actions}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'list' ? styles.active : ''}`}
              onClick={() => setViewMode('list')}
            >
              📋 List
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'network' ? styles.active : ''}`}
              onClick={() => setViewMode('network')}
            >
              🕸️ Network
            </button>
          </div>
          <button onClick={handleCreateRelationship} className={styles.createButton}>
            Add Relationship
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <>
          {relationships.length === 0 ? (
            <div className={styles.emptyState}>
              <h4 className={styles.emptyTitle}>No relationships yet</h4>
              <p className={styles.emptyText}>
                Create relationships to enable multi-character stories and interactions
              </p>
              <button onClick={handleCreateRelationship} className={styles.emptyButton}>
                Create First Relationship
              </button>
            </div>
          ) : (
            <div className={styles.relationshipGrid}>
              {relationships.map((relationship) => (
                <RelationshipCard
                  key={relationship.id}
                  relationship={relationship}
                  currentCharacterId={characterId}
                  onDelete={() => handleDeleteRelationship(relationship.id)}
                  onUpdateStrength={(newStrength) =>
                    handleUpdateStrength(relationship.id, newStrength)
                  }
                />
              ))}
            </div>
          )}
        </>
      ) : (
        <RelationshipNetwork
          characterId={characterId}
          relationships={relationships}
        />
      )}

      {isCreateModalOpen && (
        <CreateRelationshipModal
          characterId={characterId}
          characterName={characterName}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleRelationshipCreated}
        />
      )}
    </div>
  );
}
