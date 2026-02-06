/**
 * Transmedia Story Manager Component
 * Manages and displays transmedia stories for a character
 */

'use client';

import React, { useState, useEffect } from 'react';
import { StoryCard } from './StoryCard';
import { CreateStoryModal } from './CreateStoryModal';
import type { TransmediaStory } from '@lcos/shared';
import styles from './TransmediaStoryManager.module.css';

interface TransmediaStoryManagerProps {
  characterId: string;
  characterName: string;
}

export function TransmediaStoryManager({ characterId, characterName }: TransmediaStoryManagerProps) {
  const [stories, setStories] = useState<TransmediaStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/transmedia?characterId=${characterId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch stories');
      }
      const data = await response.json();
      setStories(data.stories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStories();
  }, [characterId]);

  const handleStoryCreated = (newStory: TransmediaStory) => {
    setStories([...stories, newStory]);
    setIsCreateModalOpen(false);
  };

  const handleDeleteStory = async (storyId: string) => {
    if (!confirm('Are you sure you want to delete this story?')) return;

    try {
      const response = await fetch(`/api/transmedia/${storyId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete story');
      }

      setStories(stories.filter((s) => s.id !== storyId));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to delete story');
    }
  };

  const handleGenerateBeats = async (storyId: string) => {
    try {
      const response = await fetch(`/api/transmedia/${storyId}/generate-beats`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ numBeats: 6 }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story beats');
      }

      const data = await response.json();
      setStories(stories.map((s) => (s.id === storyId ? data.story : s)));
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Failed to generate story beats');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading transmedia stories...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <p>{error}</p>
        <button onClick={fetchStories} className={styles.retryButton}>
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>Transmedia Stories</h3>
          <p className={styles.subtitle}>
            {stories.length} {stories.length === 1 ? 'story' : 'stories'} featuring {characterName}
          </p>
        </div>
        <button onClick={() => setIsCreateModalOpen(true)} className={styles.createButton}>
          Create Story
        </button>
      </div>

      {stories.length === 0 ? (
        <div className={styles.emptyState}>
          <h4 className={styles.emptyTitle}>No transmedia stories yet</h4>
          <p className={styles.emptyText}>
            Create stories that adapt across multiple platforms and media types
          </p>
          <button onClick={() => setIsCreateModalOpen(true)} className={styles.emptyButton}>
            Create First Story
          </button>
        </div>
      ) : (
        <div className={styles.storyGrid}>
          {stories.map((story) => (
            <StoryCard
              key={story.id}
              story={story}
              onDelete={() => handleDeleteStory(story.id)}
              onGenerateBeats={() => handleGenerateBeats(story.id)}
            />
          ))}
        </div>
      )}

      {isCreateModalOpen && (
        <CreateStoryModal
          characterId={characterId}
          characterName={characterName}
          onClose={() => setIsCreateModalOpen(false)}
          onSuccess={handleStoryCreated}
        />
      )}
    </div>
  );
}
