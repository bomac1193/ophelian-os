/**
 * Universe Card Component
 * Displays a single collaborative universe
 */

'use client';

import React from 'react';
import type { Universe } from '@lcos/shared';
import styles from './UniverseCard.module.css';

interface UniverseCardProps {
  universe: Universe;
  currentUserId: string;
  onDelete: () => void;
}

export function UniverseCard({ universe, currentUserId, onDelete }: UniverseCardProps) {
  const isCreator = universe.creatorId === currentUserId;
  const userMember = universe.members.find((m) => m.userId === currentUserId);

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <div className={styles.titleSection}>
          <h4 className={styles.title}>{universe.name}</h4>
          <div className={styles.badges}>
            {universe.isPublic && <span className={styles.badge}>Public</span>}
            {isCreator && <span className={styles.badgeCreator}>Creator</span>}
            {userMember && !isCreator && (
              <span className={styles.badgeMember}>{userMember.role}</span>
            )}
          </div>
        </div>
        {isCreator && (
          <button onClick={onDelete} className={styles.deleteButton} title="Delete universe">
            ×
          </button>
        )}
      </div>

      <div className={styles.content}>
        <p className={styles.description}>{universe.description}</p>

        <div className={styles.metadata}>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Genre:</span>
            <span className={styles.metaValue}>{universe.genre}</span>
          </div>
          <div className={styles.metaRow}>
            <span className={styles.metaLabel}>Setting:</span>
            <span className={styles.metaValue}>{universe.setting}</span>
          </div>
        </div>

        <div className={styles.stats}>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{universe.members.length}</span>
            <span className={styles.statLabel}>Members</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{universe.characterIds.length}</span>
            <span className={styles.statLabel}>Characters</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{universe.storyIds.length}</span>
            <span className={styles.statLabel}>Stories</span>
          </div>
          <div className={styles.statItem}>
            <span className={styles.statNumber}>{universe.canonEvents.length}</span>
            <span className={styles.statLabel}>Events</span>
          </div>
        </div>

        {universe.rules.length > 0 && (
          <div className={styles.rulesSection}>
            <h5 className={styles.rulesTitle}>Universe Rules</h5>
            <ul className={styles.rulesList}>
              {universe.rules.slice(0, 3).map((rule, idx) => (
                <li key={idx} className={styles.ruleItem}>
                  {rule}
                </li>
              ))}
              {universe.rules.length > 3 && (
                <li className={styles.moreRules}>+{universe.rules.length - 3} more</li>
              )}
            </ul>
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.creator}>By {universe.creatorName}</span>
          <button className={styles.viewButton}>View Details →</button>
        </div>
      </div>
    </div>
  );
}
