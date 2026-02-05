'use client';

import React, { useState } from 'react';
import styles from './CharacterTimeline.module.css';

export type EventType =
  | 'creation'
  | 'arc_start'
  | 'arc_end'
  | 'relationship'
  | 'transformation'
  | 'milestone'
  | 'content_published';

export interface TimelineEvent {
  id: string;
  timestamp: Date;
  type: EventType;
  title: string;
  description?: string;
  metadata?: {
    arcName?: string;
    relatedCharacterId?: string;
    relatedCharacterName?: string;
    contentUrl?: string;
    genomeBefore?: any;
    genomeAfter?: any;
  };
}

interface CharacterTimelineProps {
  characterName: string;
  events: TimelineEvent[];
  onEventClick?: (event: TimelineEvent) => void;
}

const EVENT_ICONS: Record<EventType, string> = {
  creation: '✨',
  arc_start: '📖',
  arc_end: '🏁',
  relationship: '🤝',
  transformation: '🦋',
  milestone: '⭐',
  content_published: '📱',
};

const EVENT_COLORS: Record<EventType, string> = {
  creation: 'rgba(139, 92, 246, 0.8)',
  arc_start: 'rgba(59, 130, 246, 0.8)',
  arc_end: 'rgba(34, 197, 94, 0.8)',
  relationship: 'rgba(236, 72, 153, 0.8)',
  transformation: 'rgba(168, 85, 247, 0.8)',
  milestone: 'rgba(251, 191, 36, 0.8)',
  content_published: 'rgba(14, 165, 233, 0.8)',
};

export function CharacterTimeline({
  characterName,
  events,
  onEventClick,
}: CharacterTimelineProps) {
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);

  const sortedEvents = [...events].sort(
    (a, b) => b.timestamp.getTime() - a.timestamp.getTime()
  );

  const formatDate = (date: Date) => {
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return date.toLocaleDateString();
  };

  const handleEventClick = (event: TimelineEvent) => {
    setSelectedEvent(event);
    onEventClick?.(event);
  };

  if (events.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h3 className={styles.title}>{characterName}&apos;s Journey</h3>
          <p className={styles.subtitle}>Evolution Timeline</p>
        </div>
        <div className={styles.empty}>
          <span className={styles.emptyIcon}>📖</span>
          <p className={styles.emptyText}>
            No events yet. The story begins here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>{characterName}&apos;s Journey</h3>
          <p className={styles.subtitle}>{events.length} events</p>
        </div>
        <div className={styles.legend}>
          <span className={styles.legendLabel}>Timeline</span>
        </div>
      </div>

      <div className={styles.timeline}>
        {sortedEvents.map((event, index) => (
          <div
            key={event.id}
            className={`${styles.eventItem} ${
              selectedEvent?.id === event.id ? styles.eventItemSelected : ''
            }`}
            onClick={() => handleEventClick(event)}
          >
            <div className={styles.eventMarker}>
              <div
                className={styles.eventDot}
                style={{ backgroundColor: EVENT_COLORS[event.type] }}
              >
                <span className={styles.eventIcon}>
                  {EVENT_ICONS[event.type]}
                </span>
              </div>
              {index < sortedEvents.length - 1 && (
                <div className={styles.eventLine} />
              )}
            </div>

            <div className={styles.eventContent}>
              <div className={styles.eventCard}>
                <div className={styles.eventCardHeader}>
                  <span
                    className={styles.eventType}
                    style={{
                      backgroundColor: `${EVENT_COLORS[event.type]}33`,
                      color: EVENT_COLORS[event.type],
                    }}
                  >
                    {event.type.replace('_', ' ')}
                  </span>
                  <span className={styles.eventDate}>
                    {formatDate(event.timestamp)}
                  </span>
                </div>

                <h4 className={styles.eventTitle}>{event.title}</h4>

                {event.description && (
                  <p className={styles.eventDescription}>{event.description}</p>
                )}

                {event.metadata && (
                  <div className={styles.eventMetadata}>
                    {event.metadata.arcName && (
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>Arc:</span>
                        <span className={styles.metadataValue}>
                          {event.metadata.arcName}
                        </span>
                      </div>
                    )}
                    {event.metadata.relatedCharacterName && (
                      <div className={styles.metadataItem}>
                        <span className={styles.metadataLabel}>With:</span>
                        <span className={styles.metadataValue}>
                          {event.metadata.relatedCharacterName}
                        </span>
                      </div>
                    )}
                    {event.metadata.contentUrl && (
                      <a
                        href={event.metadata.contentUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={styles.metadataLink}
                        onClick={(e) => e.stopPropagation()}
                      >
                        View Content →
                      </a>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
