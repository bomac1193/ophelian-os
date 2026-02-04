'use client';

import { type Relic } from '@/lib/reliquary';

interface RelicCardProps {
  relic: Relic;
  unlocked: boolean;
  unlockedAt?: string;
  onClick: () => void;
  justUnlocked?: boolean;
  nextRiddle?: string;
}

export function RelicCard({ relic, unlocked, unlockedAt, onClick, justUnlocked, nextRiddle }: RelicCardProps) {
  if (!unlocked) {
    return (
      <div className="relic-card relic-locked" onClick={onClick} title="Click to attempt unlock">
        <div className="relic-orb">
          <span className="relic-orb-icon">?</span>
        </div>
        <p className="relic-name-hidden">???</p>
        <span className="relic-tier">Tier {relic.tier}</span>
      </div>
    );
  }

  return (
    <div className={`relic-card relic-unlocked ${justUnlocked ? 'relic-crack' : ''}`}>
      <div className="relic-icon">{relic.icon}</div>
      <h3 className="relic-name">{relic.name}</h3>
      <p className="relic-description">{relic.description}</p>
      <p className="relic-lore">{relic.lore}</p>
      {unlockedAt && (
        <p className="relic-timestamp">
          Unlocked {new Date(unlockedAt).toLocaleDateString()}
        </p>
      )}
      {nextRiddle && (
        <div className="relic-riddle">
          <span className="relic-riddle-label">Next clue:</span>
          <p className="relic-riddle-text">{nextRiddle}</p>
        </div>
      )}
    </div>
  );
}
