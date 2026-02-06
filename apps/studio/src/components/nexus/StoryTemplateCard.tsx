'use client';

import { StoryTemplate, energySymbols } from '@/lib/story-templates';
import styles from './StoryTemplateCard.module.css';

interface StoryTemplateCardProps {
  template: StoryTemplate;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function StoryTemplateCard({
  template,
  selected,
  compact,
  onClick,
}: StoryTemplateCardProps) {
  const energySymbol = energySymbols[template.primaryEnergy];

  if (compact) {
    return (
      <div
        onClick={onClick}
        className={`${styles.card} ${styles.cardCompact} ${selected ? styles.cardSelected : ''}`}
      >
        <div className={styles.compactContent}>
          <span className={styles.compactDot} />
          <span className={styles.compactTitle}>{template.name}</span>
          <span className={styles.compactSymbol}>{energySymbol}</span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={`${styles.card} ${selected ? styles.cardSelected : ''}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h3 className={styles.title}>{template.name}</h3>
          <p className={styles.question}>"{template.question}"</p>
        </div>
        <div className={styles.badges}>
          {/* Temperature badge */}
          <span className={`${styles.tempBadge} ${
            template.temperature === 'hot' ? styles.tempBadgeHot :
            template.temperature === 'cool' ? styles.tempBadgeCool :
            styles.tempBadgeCrossroads
          }`}>
            {template.temperature}
          </span>
          {/* Energy symbol */}
          <span className={styles.energyIcon} title={template.primaryEnergy}>
            {energySymbol}
          </span>
        </div>
      </div>

      {/* Description */}
      <p className={styles.description}>
        {template.description}
      </p>

      {/* Meta */}
      <div className={styles.meta}>
        <div className={styles.metaItem}>
          <div className={styles.metaLabel}>Motion</div>
          <div className={styles.metaValue}>{template.motion}</div>
        </div>
        <div className={styles.metaItem}>
          <div className={styles.metaLabel}>Phases</div>
          <div className={styles.metaValue}>{template.phases.length}</div>
        </div>
      </div>
    </div>
  );
}
