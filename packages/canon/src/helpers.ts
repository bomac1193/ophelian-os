import type { Character } from '@lcos/shared';
import type { Memory, TimelineEvent, CharacterState, ArcDefinition } from './types.js';

export function createCharacterState(character: Character): CharacterState {
  const timelineState = character.timelineState as Record<string, unknown> | null;

  return {
    character,
    memories: (timelineState?.memories as Memory[]) || [],
    timeline: (timelineState?.timeline as TimelineEvent[]) || [],
    activeArc: character.currentArc,
    moodModifiers: [],
  };
}

export function addMemory(state: CharacterState, memory: Omit<Memory, 'id'>): CharacterState {
  const newMemory: Memory = {
    ...memory,
    id: generateId(),
  };

  return {
    ...state,
    memories: [...state.memories, newMemory].sort((a, b) => b.importance - a.importance),
  };
}

export function addTimelineEvent(
  state: CharacterState,
  event: Omit<TimelineEvent, 'id'>
): CharacterState {
  const newEvent: TimelineEvent = {
    ...event,
    id: generateId(),
  };

  return {
    ...state,
    timeline: [...state.timeline, newEvent],
  };
}

export function setActiveArc(state: CharacterState, arc: ArcDefinition | null): CharacterState {
  const newState = addTimelineEvent(state, {
    timestamp: new Date(),
    eventType: 'arc_change',
    description: arc ? `Started arc: ${arc.name}` : 'Ended current arc',
    data: { arc: arc || null },
  });

  return {
    ...newState,
    activeArc: arc?.id || null,
    moodModifiers: arc ? arc.toneShift : [],
  };
}

export function getRelevantMemories(state: CharacterState, tags: string[], limit = 5): Memory[] {
  return state.memories
    .filter((memory) => memory.tags.some((tag) => tags.includes(tag)))
    .slice(0, limit);
}

export function getRecentTimeline(state: CharacterState, limit = 10): TimelineEvent[] {
  return [...state.timeline].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, limit);
}

export function buildContextPrompt(state: CharacterState): string {
  const { character } = state;
  const parts: string[] = [];

  parts.push(`Character: ${character.name}`);
  if (character.aliases.length > 0) {
    parts.push(`Also known as: ${character.aliases.join(', ')}`);
  }
  parts.push(`Bio: ${character.bio}`);

  if (character.personaTags.length > 0) {
    parts.push(`Persona: ${character.personaTags.join(', ')}`);
  }

  if (character.toneAllowed.length > 0) {
    parts.push(`Allowed tones: ${character.toneAllowed.join(', ')}`);
  }

  if (character.toneForbidden.length > 0) {
    parts.push(`Forbidden tones: ${character.toneForbidden.join(', ')}`);
  }

  if (state.activeArc) {
    parts.push(`Current arc: ${state.activeArc}`);
  }

  if (state.moodModifiers.length > 0) {
    parts.push(`Current mood modifiers: ${state.moodModifiers.join(', ')}`);
  }

  const recentMemories = state.memories.slice(0, 3);
  if (recentMemories.length > 0) {
    parts.push('Recent memories:');
    recentMemories.forEach((m) => parts.push(`  - ${m.content}`));
  }

  if (character.systemPrompt) {
    parts.push(`\nSystem instructions: ${character.systemPrompt}`);
  }

  return parts.join('\n');
}

export function serializeTimelineState(state: CharacterState): Record<string, unknown> {
  return {
    memories: state.memories,
    timeline: state.timeline,
    moodModifiers: state.moodModifiers,
  };
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
