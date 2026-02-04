'use client';

import type { CharacterGenome } from '../../lib/imprint-api';

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

  // Get primary colors for visual display
  const primaryColors = multiModalSignature?.visual?.primaryColors || [];

  // Determine hot/cool label
  const hotCool = psychologicalState?.hotCoolAxis || 0;
  const temperatureLabel =
    hotCool <= -0.5 ? 'Cool' : hotCool >= 0.5 ? 'Hot' : 'Balanced';

  return (
    <div
      onClick={onClick}
      style={{
        padding: '1rem',
        backgroundColor: 'var(--card)',
        borderRadius: '12px',
        border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '0.75rem',
        }}
      >
        <div>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 600 }}>
            {genome.name}
          </h3>
          <p
            style={{
              margin: 0,
              fontSize: '0.75rem',
              color: 'var(--muted-foreground)',
            }}
          >
            Created {new Date(genome.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Color swatches */}
        <div style={{ display: 'flex', gap: '4px' }}>
          {primaryColors.slice(0, 3).map((color, i) => (
            <div
              key={i}
              style={{
                width: '20px',
                height: '20px',
                borderRadius: '4px',
                backgroundColor: color,
                border: color.toLowerCase() === '#ffffff' ? '1px solid var(--border)' : 'none',
              }}
            />
          ))}
        </div>
      </div>

      {/* Orisha & Sephira info */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          marginBottom: '0.75rem',
        }}
      >
        <span
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            backgroundColor: 'var(--primary-muted)',
            fontSize: '0.75rem',
          }}
        >
          {orishaConfiguration?.headOrisha || 'Unknown'}
          {orishaConfiguration?.camino && ` (${orishaConfiguration.camino.split(' ').pop()})`}
        </span>
        <span
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            backgroundColor: 'var(--muted)',
            fontSize: '0.75rem',
          }}
        >
          {kabbalisticPosition?.primarySephira || 'Unknown'}
        </span>
        <span
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            backgroundColor:
              temperatureLabel === 'Hot'
                ? '#ef444420'
                : temperatureLabel === 'Cool'
                  ? '#3b82f620'
                  : '#8b5cf620',
            color:
              temperatureLabel === 'Hot'
                ? '#ef4444'
                : temperatureLabel === 'Cool'
                  ? '#3b82f6'
                  : '#8b5cf6',
            fontSize: '0.75rem',
          }}
        >
          {temperatureLabel}
        </span>
      </div>

      {/* Trajectory */}
      <div style={{ marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Trajectory: </span>
        <span style={{ fontSize: '0.8rem', textTransform: 'capitalize' }}>
          {psychologicalState?.trajectory || 'Unknown'}
        </span>
      </div>

      {/* Tags */}
      {genome.tags && genome.tags.length > 0 && (
        <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {genome.tags.map((tag) => (
            <span
              key={tag}
              style={{
                padding: '0.125rem 0.375rem',
                borderRadius: '4px',
                backgroundColor: 'var(--muted)',
                fontSize: '0.7rem',
                color: 'var(--muted-foreground)',
              }}
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Character link */}
      {genome.characterId && (
        <div
          style={{
            fontSize: '0.75rem',
            color: 'var(--primary)',
            marginBottom: '0.75rem',
          }}
        >
          Linked to character
        </div>
      )}

      {/* Actions */}
      {(onEdit || onDelete || onExport) && (
        <div
          style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '0.5rem',
            paddingTop: '0.75rem',
            borderTop: '1px solid var(--border)',
          }}
        >
          {onEdit && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--foreground)',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
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
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--foreground)',
                cursor: 'pointer',
                fontSize: '0.8rem',
              }}
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
              style={{
                padding: '0.375rem 0.75rem',
                borderRadius: '6px',
                border: '1px solid var(--destructive)',
                backgroundColor: 'transparent',
                color: 'var(--destructive)',
                cursor: 'pointer',
                fontSize: '0.8rem',
                marginLeft: 'auto',
              }}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
}
