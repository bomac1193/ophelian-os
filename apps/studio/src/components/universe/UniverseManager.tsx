/**
 * Universe Manager Component
 * Manages collaborative universes and shared worlds
 */

'use client';

import React, { useState, useEffect } from 'react';
import { UniverseCard } from './UniverseCard';
import { CreateUniverseModal } from './CreateUniverseModal';
import type { Universe } from '@lcos/shared';
import styles from './UniverseManager.module.css';

export function UniverseManager() {
  const [universes, setUniverses] = useState<Universe[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'my' | 'public'>('my');

  // Mock user ID - in real app, get from auth
  const mockUserId = 'user_1';

  const fetchUniverses = async () => {
    try {
      setLoading(true);
      const endpoint =
        viewMode === 'my'
          ? `/api/universes?userId=${mockUserId}`
          : `/api/universes?public=true`;

      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error('Failed to fetch universes');
      }
      const data = await response.json();
      setUniverses(data.universes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load universes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniverses();
  }, [viewMode]);

  const handleUniverseCreated = (newUniverse: Universe) => {
    setUniverses([...universes, newUniverse]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteUniverse = async (universeId: string) => {
    if (!confirm('Are you sure you want to delete this universe?')) return;

    try {
      const response = await fetch(`/api/universes/${universeId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete universe');
      }

      setUniverses(universes.filter((u) => u.id !== universeId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete universe');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading universes...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>⚠️ {error}</p>
        <button onClick={fetchUniverses} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Collaborative Universes</h3>
          <p className={styles.subtitle}>
            {universes.length} {universes.length === 1 ? 'universe' : 'universes'}
          </p>
        </div>
        <div className={styles.actions}>
          <div className={styles.viewToggle}>
            <button
              className={`${styles.viewButton} ${viewMode === 'my' ? styles.active : ''}`}
              onClick={() => setViewMode('my')}
            >
              My Universes
            </button>
            <button
              className={`${styles.viewButton} ${viewMode === 'public' ? styles.active : ''}`}
              onClick={() => setViewMode('public')}
            >
              Public
            </button>
          </div>
          <button onClick={() => setIsCreateModalOpen(true)} className={styles.createButton}>
            + Create Universe
          </button>
        </div>
      </div>

      {universes.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🌌</div>
          <h4 className={styles.emptyTitle}>
            {viewMode === 'my' ? 'No universes yet' : 'No public universes available'}
          </h4>
          <p className={styles.emptyText}>
            {viewMode === 'my'
              ? 'Create a collaborative universe where multiple creators can share stories and characters'
              : 'Check back later for public universes to join'}
          </p>
          {viewMode === 'my' && (
            <button onClick={() => setIsCreateModalOpen(true)} className={styles.emptyButton}>
              Create First Universe
            </button>
          )}
        </div>
      ) : (
        <div className={styles.universeGrid}>
          {universes.map((universe) => (
            <UniverseCard
              key={universe.id}
              universe={universe}
              currentUserId={mockUserId}
              onDelete={() => handleDeleteUniverse(universe.id)}
            />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateUniverseModal
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleUniverseCreated}
        />
      )}
    </div>
  );
}
