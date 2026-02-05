/**
 * Shared in-memory storage for transmedia stories
 * In production, this would be replaced with database queries
 */

import type { TransmediaStory } from '@lcos/shared';

// In-memory storage shared across all transmedia API routes
export const transmediaStories: TransmediaStory[] = [];
export let nextId = 1;

export function getNextId(): string {
  return `story_${nextId++}`;
}
