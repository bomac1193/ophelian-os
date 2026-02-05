import type { TimelineEvent, EventType } from '../components/timeline';

/**
 * Generate mock timeline events for a character
 * This creates a believable evolution story until real event tracking is implemented
 */
export function generateMockTimeline(character: {
  id: string;
  name: string;
  createdAt: Date | string;
  currentArc?: string | null;
}): TimelineEvent[] {
  const events: TimelineEvent[] = [];
  const createdDate = typeof character.createdAt === 'string'
    ? new Date(character.createdAt)
    : character.createdAt;

  // Event 1: Character creation
  events.push({
    id: `${character.id}-creation`,
    timestamp: createdDate,
    type: 'creation',
    title: `${character.name} was born`,
    description: 'The character genome was forged, their essence defined by Orisha and Sephira.',
  });

  // Event 2: Arc start (if current arc exists)
  if (character.currentArc) {
    const arcStartDate = new Date(createdDate);
    arcStartDate.setDate(arcStartDate.getDate() + 1);

    events.push({
      id: `${character.id}-arc-start`,
      timestamp: arcStartDate,
      type: 'arc_start',
      title: `Began "${character.currentArc}"`,
      description: 'A new chapter unfolds in their story.',
      metadata: {
        arcName: character.currentArc,
      },
    });
  }

  // Event 3: Milestone (character's first week)
  const weekDate = new Date(createdDate);
  weekDate.setDate(weekDate.getDate() + 7);

  if (weekDate < new Date()) {
    events.push({
      id: `${character.id}-milestone-week`,
      timestamp: weekDate,
      type: 'milestone',
      title: 'One week of existence',
      description: `${character.name} has been exploring their world for a week.`,
    });
  }

  // Event 4: Transformation (character's first month)
  const monthDate = new Date(createdDate);
  monthDate.setMonth(monthDate.getMonth() + 1);

  if (monthDate < new Date()) {
    events.push({
      id: `${character.id}-transformation-month`,
      timestamp: monthDate,
      type: 'transformation',
      title: 'First transformation',
      description: 'Through experiences and interactions, subtle changes begin to emerge.',
    });
  }

  return events;
}

/**
 * Add a new timeline event for a character
 * In the future, this will persist to the database
 */
export function addTimelineEvent(
  characterId: string,
  event: Omit<TimelineEvent, 'id'>
): TimelineEvent {
  const newEvent: TimelineEvent = {
    ...event,
    id: `${characterId}-${event.type}-${Date.now()}`,
  };

  // TODO: Persist to database when backend is ready
  // For now, just return the event

  return newEvent;
}

/**
 * Get template for common event types
 */
export function getEventTemplate(
  type: EventType,
  characterName: string
): Partial<TimelineEvent> {
  const templates: Record<EventType, Partial<TimelineEvent>> = {
    creation: {
      type: 'creation',
      title: `${characterName} was created`,
      description: 'Character genome forged with Orisha and Sephira essence.',
    },
    arc_start: {
      type: 'arc_start',
      title: 'New story arc begins',
      description: 'A new chapter in the character\'s journey.',
    },
    arc_end: {
      type: 'arc_end',
      title: 'Story arc concluded',
      description: 'This chapter of the journey comes to an end.',
    },
    relationship: {
      type: 'relationship',
      title: 'New relationship formed',
      description: `${characterName} connects with another character.`,
    },
    transformation: {
      type: 'transformation',
      title: 'Character transformation',
      description: 'A significant change or evolution in personality or goals.',
    },
    milestone: {
      type: 'milestone',
      title: 'Milestone reached',
      description: 'An important moment in the character\'s development.',
    },
    content_published: {
      type: 'content_published',
      title: 'Content published',
      description: `${characterName} shared their voice with the world.`,
    },
  };

  return templates[type];
}

/**
 * Calculate character age/duration
 */
export function getCharacterAge(createdAt: Date | string): string {
  const created = typeof createdAt === 'string' ? new Date(createdAt) : createdAt;
  const now = new Date();
  const diffMs = now.getTime() - created.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Created today';
  if (diffDays === 1) return '1 day old';
  if (diffDays < 7) return `${diffDays} days old`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks old`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months old`;

  const years = Math.floor(diffDays / 365);
  return `${years} year${years > 1 ? 's' : ''} old`;
}
