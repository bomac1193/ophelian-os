/**
 * Shared in-memory storage for relationships
 * In production, this would be replaced with database queries
 */

import type { Relationship } from '@lcos/shared';

// In-memory storage shared across all relationship API routes
export const relationships: Relationship[] = [];
export let nextId = 1;

export function getNextId(): string {
  return `rel_${nextId++}`;
}
