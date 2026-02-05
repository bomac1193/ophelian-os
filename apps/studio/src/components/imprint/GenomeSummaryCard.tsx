'use client';

import { useState } from 'react';
import type { CharacterGenome } from '../../lib/imprint-api';
import { getSurfaceView, getGatewayHint } from '@lcos/oripheon';
import { SymbolicImprint } from '../genome';
import puzzleStyles from '../genome/GenomePuzzleUnlock.module.css';
import styles from './GenomeSummaryCard.module.css';

interface GenomeSummaryCardProps {
  genome: CharacterGenome;
  onClick?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onExport?: () => void;
  selected?: boolean;
}

export function GenomeSummaryCard({
  genome,
  onClick,
  onEdit,
  onDelete,
  onExport,
  selected,
}: GenomeSummaryCardProps) {
  const { orishaConfiguration, kabbalisticPosition, psychologicalState, multiModalSignature } = genome;
  const [detailsUnlocked, setDetailsUnlocked] = useState(false);
  const [answer, setAnswer] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [error, setError] = useState('');

  // Get primary colors for visual display
  const primaryColors = multiModalSignature?.visual?.primaryColors || [];

  // Determine hot/cool label
  const hotCool = psychologicalState?.hotCoolAxis || 0;
  const temperatureLabel =
    hotCool <= -0.5 ? 'Cool' : hotCool >= 0.5 ? 'Hot' : 'Balanced';

  // Simple riddle based on Orisha number
  const orishaNumbers: Record<string, number> = {
    'Èṣù': 3, 'Ògún': 7, 'Ọ̀ṣun': 5, 'Yemọja': 7,
    'Ṣàngó': 6, 'Ọya': 9, 'Obàtálá': 8, 'Ọ̀rúnmìlà': 16,
    'Ọ̀ṣọ́ọ̀sì': 7, 'Ọ̀sanyìn': 1,
  };

  const correctAnswer = String(orishaNumbers[orishaConfiguration?.headOrisha] || 0);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (answer.trim() === correctAnswer) {
      setDetailsUnlocked(true);
      setError('');
    } else {
      setAttempts(prev => prev + 1);
      setError('Incorrect');
      setAnswer('');
      if (attempts >= 1) {
        setShowHint(true);
      }
    }
  };

  return (
    <div
      onClick={onClick}
      className={`${styles.card} ${selected ? styles.selected : ''} ${!onClick ? styles.nonClickable : ''}`}
    >
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h3 className={styles.title}>
            {genome.name}
          </h3>
          <p className={styles.date}>
            Created {new Date(genome.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Color swatches */}
        <div className={styles.colorSwatches}>
          {primaryColors.slice(0, 3).map((color, i) => (
            <div
              key={i}
              className={`${styles.colorSwatch} ${color.toLowerCase() === '#ffffff' ? styles.white : ''}`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>
      </div>

      {/* Symbolic Imprint Display */}
      {(() => {
        try {
          const surface = getSurfaceView(genome);
          return (
            <div className={styles.imprintDisplay}>
              <div className={styles.imprintContent}>
                <span className={styles.imprintSymbol}>
                  {surface.imprint.symbol}
                </span>
                <span className={styles.imprintPrimitive}>
                  {surface.imprint.primitive}
                </span>
                <span className={styles.imprintLabel}>
                  {surface.imprint.label}
                </span>
              </div>
              <div className={styles.imprintClassification}>
                {surface.classification}
              </div>
            </div>
          );
        } catch (e) {
          console.error('Error rendering symbolic imprint:', e);
          return null;
        }
      })()}

      {/* Unlock Deep Mysteries */}
      {!detailsUnlocked ? (
        <div
          onClick={(e) => e.stopPropagation()}
          className={styles.lockSection}
        >
          <div className={styles.lockHeader}>
            Deep Knowledge Locked
          </div>
          <div className={styles.lockRiddle}>
            What sacred number do I carry?
          </div>

          <form onSubmit={handleUnlock} className={styles.unlockForm}>
            <input
              type="text"
              value={answer}
              onChange={(e) => {
                e.stopPropagation();
                setAnswer(e.target.value);
              }}
              onClick={(e) => e.stopPropagation()}
              placeholder="Answer..."
              className={`${styles.unlockInput} ${error ? styles.error : ''} ${puzzleStyles.inputField}`}
              autoComplete="off"
            />
            <button
              type="submit"
              onClick={(e) => e.stopPropagation()}
              className={`${styles.unlockButton} ${puzzleStyles.submitButton}`}
            >
              Unlock
            </button>
          </form>

          {error && (
            <div className={`${styles.errorMessage} ${puzzleStyles.errorMessage}`}>
              {error}
            </div>
          )}

          {showHint && (
            <div className={`${styles.hintBox} ${puzzleStyles.hintBox}`}>
              Hint: Check the gateway hints above
            </div>
          )}
        </div>
      ) : (
        <div
          className={`${styles.detailsContainer} ${puzzleStyles.detailsContainer}`}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Orisha & Sephira info */}
          <div className={styles.badges}>
            <span className={`${styles.badge} ${styles.orisha}`}>
              {orishaConfiguration?.headOrisha || 'Unknown'}
              {orishaConfiguration?.camino && ` (${orishaConfiguration.camino.split(' ').pop()})`}
            </span>
            <span className={`${styles.badge} ${styles.sephira}`}>
              {kabbalisticPosition?.primarySephira || 'Unknown'}
            </span>
            <span className={`${styles.badge} ${styles.temperature} ${styles[temperatureLabel.toLowerCase()]}`}>
              {temperatureLabel}
            </span>
          </div>

          {/* Trajectory */}
          <div className={styles.trajectory}>
            <span className={styles.trajectoryLabel}>Trajectory: </span>
            <span className={styles.trajectoryValue}>
              {psychologicalState?.trajectory || 'Unknown'}
            </span>
          </div>

          {/* Tags */}
          {genome.tags && genome.tags.length > 0 && (
            <div className={styles.tags}>
              {genome.tags.map((tag) => (
                <span key={tag} className={styles.tag}>
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Character link */}
      {genome.characterId && (
        <div className={styles.characterLink}>
          Linked to character
        </div>
      )}

      {/* Actions */}
      {(onEdit || onDelete || onExport) && (
        <div className={styles.actions}>
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              className={styles.actionButton}
            >
              Edit
            </button>
          )}
          {onExport && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onExport();
              }}
              className={styles.actionButton}
            >
              Export
            </button>
          )}
          {onDelete && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              className={`${styles.actionButton} ${styles.delete}`}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
