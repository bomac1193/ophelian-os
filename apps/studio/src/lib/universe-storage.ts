/**
 * Shared in-memory storage for collaborative universes
 * In production, this would be replaced with database queries
 */

import type { Universe, UniverseInvitation } from '@lcos/shared';

// In-memory storage shared across all universe API routes
export const universes: Universe[] = [];
export const invitations: UniverseInvitation[] = [];
export let nextUniverseId = 1;
export let nextInvitationId = 1;

export function getNextUniverseId(): string {
  return `universe_${nextUniverseId++}`;
}

export function getNextInvitationId(): string {
  return `invite_${nextInvitationId++}`;
}
