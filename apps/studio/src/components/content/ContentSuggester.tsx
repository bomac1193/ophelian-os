'use client';

import React, { useState, useEffect } from 'react';
import type { OrishaName, SephiraName } from '@lcos/oripheon';
import { getGenomeSuggestedTopics } from '@lcos/content';
import styles from './ContentSuggester.module.css';

interface ContentSuggesterProps {
  characterName: string;
  orisha?: OrishaName;
  sephira?: SephiraName;
  onSelectTopic: (topic: string) => void;
}

export function ContentSuggester({
  characterName,
  orisha,
  sephira,
  onSelectTopic,
}: ContentSuggesterProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const hasGenomeData = orisha && sephira;

  const generateSuggestions = () => {
    if (!hasGenomeData) return;

    setIsRefreshing(true);

    // Small delay for animation
    setTimeout(() => {
      const topics = getGenomeSuggestedTopics(orisha, sephira);
      setSuggestions(topics);
      setIsRefreshing(false);
    }, 300);
  };

  useEffect(() => {
    if (hasGenomeData) {
      generateSuggestions();
    }
  }, [orisha, sephira]);

  if (!hasGenomeData) {
    return (
      <div className={styles.container}>
        <div className={styles.header}>
          <h4 className={styles.title}>Content Suggestions</h4>
        </div>
        <div className={styles.noGenome}>
          <span className={styles.noGenomeIcon}>💭</span>
          <p className={styles.noGenomeText}>
            No genome data available. Content suggestions require Orisha and Sephira information.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <h4 className={styles.title}>What {characterName} Wants to Discuss</h4>
          <p className={styles.subtitle}>
            Based on their genome signature
          </p>
        </div>
        <button
          type="button"
          onClick={generateSuggestions}
          className={styles.refreshButton}
          disabled={isRefreshing}
          aria-label="Refresh suggestions"
        >
          <span className={`${styles.refreshIcon} ${isRefreshing ? styles.refreshing : ''}`}>
            ↻
          </span>
        </button>
      </div>

      <div className={styles.suggestions}>
        {suggestions.map((topic, index) => (
          <button
            key={`${topic}-${index}`}
            type="button"
            onClick={() => onSelectTopic(topic)}
            className={styles.suggestionCard}
          >
            <span className={styles.suggestionIcon}>✨</span>
            <span className={styles.suggestionText}>{topic}</span>
            <span className={styles.suggestionArrow}>→</span>
          </button>
        ))}
      </div>

      <div className={styles.hint}>
        <span className={styles.hintIcon}>💡</span>
        <span className={styles.hintText}>
          Click any topic to auto-fill your content intent
        </span>
      </div>
    </div>
  );
}
