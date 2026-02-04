'use client';

import { useState, useEffect, useRef } from 'react';
import {
  RELICS,
  loadUnlocks,
  unlockRelic,
  tryPasswordAgainstAll,
  getActiveRiddle,
  type ReliquaryUnlocks,
} from '@/lib/reliquary';
import { RelicCard } from './RelicCard';

export function Reliquary() {
  const [unlocks, setUnlocks] = useState<ReliquaryUnlocks>({});
  const [justUnlockedId, setJustUnlockedId] = useState<string | null>(null);

  // Solve input state
  const [password, setPassword] = useState('');
  const [checking, setChecking] = useState(false);
  const [feedback, setFeedback] = useState<'idle' | 'wrong' | 'success'>('idle');
  const [lastUnlockedName, setLastUnlockedName] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setUnlocks(loadUnlocks());
  }, []);

  const unlockedCount = Object.keys(unlocks).length;
  const totalCount = RELICS.length;
  const activeRiddle = getActiveRiddle(unlocks);

  const handleSolve = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password.trim() || checking) return;

    setChecking(true);
    setFeedback('idle');

    const matchedId = await tryPasswordAgainstAll(password, unlocks);

    if (matchedId) {
      const updated = unlockRelic(matchedId);
      setUnlocks(updated);
      setJustUnlockedId(matchedId);
      setFeedback('success');
      const relic = RELICS.find((r) => r.id === matchedId);
      setLastUnlockedName(relic?.name || null);
      setPassword('');
      setTimeout(() => {
        setJustUnlockedId(null);
        setFeedback('idle');
        setLastUnlockedName(null);
      }, 3000);
    } else {
      setFeedback('wrong');
      setTimeout(() => {
        setFeedback('idle');
        setPassword('');
        inputRef.current?.focus();
      }, 600);
    }

    setChecking(false);
  };

  return (
    <div className="reliquary">
      <div className="reliquary-header">
        <h2 className="reliquary-title">The Reliquary</h2>
        <p className="reliquary-subtitle">The Scattered Collection</p>
      </div>

      {/* Solve Section */}
      <div className={`reliquary-solve ${feedback === 'wrong' ? 'reliquary-shake' : ''} ${feedback === 'success' ? 'reliquary-solve-success' : ''}`}>
        {unlockedCount < totalCount ? (
          <>
            {activeRiddle ? (
              <div className="reliquary-solve-riddle">
                <span className="reliquary-solve-riddle-label">Active riddle</span>
                <p className="reliquary-solve-riddle-text">{activeRiddle.riddle}</p>
              </div>
            ) : unlockedCount === 0 ? (
              <p className="reliquary-solve-hint">
                Find the first password in the world. Enter it below.
              </p>
            ) : null}

            <form onSubmit={handleSolve} className="reliquary-solve-form">
              <input
                ref={inputRef}
                type="text"
                className="reliquary-solve-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Speak the word..."
                autoComplete="off"
                spellCheck={false}
                disabled={checking || feedback === 'success'}
              />
              <button
                type="submit"
                className="btn btn-primary reliquary-solve-btn"
                disabled={!password.trim() || checking || feedback === 'success'}
              >
                {checking ? '...' : 'Attempt'}
              </button>
            </form>

            {feedback === 'success' && lastUnlockedName && (
              <p className="reliquary-solve-result-success">
                Relic recovered: {lastUnlockedName}
              </p>
            )}
            {feedback === 'wrong' && (
              <p className="reliquary-solve-result-wrong">
                The vault does not recognise this word.
              </p>
            )}
          </>
        ) : (
          <p className="reliquary-solve-complete">
            All relics have been recovered. The Scattered Collection is whole.
          </p>
        )}
      </div>

      {/* Progress */}
      <div className="reliquary-progress">
        <div className="reliquary-progress-bar">
          <div
            className="reliquary-progress-fill"
            style={{ width: `${(unlockedCount / totalCount) * 100}%` }}
          />
        </div>
        <span className="reliquary-progress-text">
          {unlockedCount} / {totalCount} relics recovered
        </span>
      </div>

      {/* Relic Grid */}
      <div className="reliquary-grid">
        {RELICS.map((relic, index) => {
          const isUnlocked = !!unlocks[relic.id];
          const nextRelic = RELICS[index + 1];
          const nextRiddle = isUnlocked ? nextRelic?.riddle : undefined;

          return (
            <RelicCard
              key={relic.id}
              relic={relic}
              unlocked={isUnlocked}
              unlockedAt={unlocks[relic.id]?.unlockedAt}
              onClick={() => {
                if (!isUnlocked) {
                  inputRef.current?.focus();
                }
              }}
              justUnlocked={justUnlockedId === relic.id}
              nextRiddle={nextRiddle}
            />
          );
        })}
      </div>
    </div>
  );
}
