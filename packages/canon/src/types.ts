import type { Character } from '@lcos/shared';

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  eventType: 'arc_change' | 'memory_added' | 'personality_shift' | 'relationship_update';
  description: string;
  data: Record<string, unknown>;
}

export interface Memory {
  id: string;
  content: string;
  importance: number; // 1-10
  timestamp: Date;
  tags: string[];
  relatedCharacterIds: string[];
}

export interface CharacterState {
  character: Character;
  memories: Memory[];
  timeline: TimelineEvent[];
  activeArc: string | null;
  moodModifiers: string[];
}

export interface ArcDefinition {
  id: string;
  name: string;
  description: string;
  objectives: string[];
  duration: 'short' | 'medium' | 'long';
  toneShift: string[];
}
