'use client';

import { TreeOfLifeVisualization } from './TreeOfLifeVisualization';

// Sephira data for display
const SEPHIRA_DATA = [
  { name: 'Kether', meaning: 'Crown', pillar: 'Balance', qliphoth: 'Thaumiel' },
  { name: 'Chokmah', meaning: 'Wisdom', pillar: 'Mercy', qliphoth: 'Ghagiel' },
  { name: 'Binah', meaning: 'Understanding', pillar: 'Severity', qliphoth: 'Satariel' },
  { name: 'Chesed', meaning: 'Mercy', pillar: 'Mercy', qliphoth: 'Gamchicoth' },
  { name: 'Geburah', meaning: 'Strength', pillar: 'Severity', qliphoth: 'Golachab' },
  { name: 'Tiphareth', meaning: 'Beauty', pillar: 'Balance', qliphoth: 'Thagirion' },
  { name: 'Netzach', meaning: 'Victory', pillar: 'Mercy', qliphoth: "A'arab Zaraq" },
  { name: 'Hod', meaning: 'Splendor', pillar: 'Severity', qliphoth: 'Samael' },
  { name: 'Yesod', meaning: 'Foundation', pillar: 'Balance', qliphoth: 'Gamaliel' },
  { name: 'Malkuth', meaning: 'Kingdom', pillar: 'Balance', qliphoth: 'Lilith' },
];

const DAATH_RELATIONSHIPS = ['seeking', 'touched', 'integrated', 'avoiding'] as const;

interface SephiraSelectorProps {
  selectedSephira?: string | null;
  daathRelationship?: (typeof DAATH_RELATIONSHIPS)[number];
  suggestedSephira?: string | null;
  onSephiraChange?: (sephira: string) => void;
  onDaathRelationshipChange?: (relationship: (typeof DAATH_RELATIONSHIPS)[number]) => void;
  showQliphoth?: boolean;
  disabled?: boolean;
}

export function SephiraSelector({
  selectedSephira,
  daathRelationship = 'seeking',
  suggestedSephira,
  onSephiraChange,
  onDaathRelationshipChange,
  showQliphoth = false,
  disabled,
}: SephiraSelectorProps) {
  const selectedData = SEPHIRA_DATA.find((s) => s.name === selectedSephira);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label className="label">Kabbalistic Position</label>

      {suggestedSephira && suggestedSephira !== selectedSephira && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--primary-muted)',
            borderRadius: '8px',
            fontSize: '0.875rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <span>Suggested based on Orisha: </span>
          <strong>{suggestedSephira}</strong>
          <button
            type="button"
            onClick={() => onSephiraChange?.(suggestedSephira)}
            disabled={disabled}
            style={{
              marginLeft: 'auto',
              padding: '0.25rem 0.75rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: 'var(--primary)',
              color: 'white',
              cursor: disabled ? 'not-allowed' : 'pointer',
              fontSize: '0.8rem',
            }}
          >
            Use Suggestion
          </button>
        </div>
      )}

      <div
        style={{
          display: 'flex',
          gap: '2rem',
          flexWrap: 'wrap',
          alignItems: 'flex-start',
        }}
      >
        {/* Tree of Life visualization */}
        <div
          style={{
            flex: '0 0 auto',
            padding: '1rem',
            backgroundColor: 'var(--card)',
            borderRadius: '12px',
            border: '1px solid var(--border)',
          }}
        >
          <TreeOfLifeVisualization
            selectedSephira={selectedSephira}
            onSephiraSelect={disabled ? undefined : onSephiraChange}
            showDaath={true}
            showQliphoth={showQliphoth}
            width={300}
            height={450}
          />
        </div>

        {/* Sephira details and list */}
        <div style={{ flex: '1 1 300px', minWidth: '280px' }}>
          {/* Selected Sephira details */}
          {selectedData && (
            <div
              style={{
                padding: '1rem',
                backgroundColor: 'var(--card)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                marginBottom: '1rem',
              }}
            >
              <h4 style={{ margin: '0 0 0.5rem', fontSize: '1.1rem' }}>
                {selectedData.name} — {selectedData.meaning}
              </h4>
              <div
                style={{
                  display: 'flex',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <span
                  style={{
                    padding: '0.25rem 0.5rem',
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    backgroundColor:
                      selectedData.pillar === 'Mercy'
                        ? '#3b82f620'
                        : selectedData.pillar === 'Severity'
                          ? '#ef444420'
                          : '#f59e0b20',
                    color:
                      selectedData.pillar === 'Mercy'
                        ? '#3b82f6'
                        : selectedData.pillar === 'Severity'
                          ? '#ef4444'
                          : '#f59e0b',
                  }}
                >
                  Pillar of {selectedData.pillar}
                </span>
              </div>
              <p
                style={{
                  margin: 0,
                  fontSize: '0.875rem',
                  color: 'var(--muted-foreground)',
                }}
              >
                <strong>Qliphothic Shadow:</strong> {selectedData.qliphoth}
              </p>
            </div>
          )}

          {/* Daath relationship */}
          <div
            style={{
              padding: '1rem',
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
              marginBottom: '1rem',
            }}
          >
            <label
              style={{
                fontSize: '0.875rem',
                fontWeight: 500,
                display: 'block',
                marginBottom: '0.5rem',
              }}
            >
              Relationship with Daath (Hidden Knowledge)
            </label>
            <select
              value={daathRelationship}
              onChange={(e) =>
                onDaathRelationshipChange?.(e.target.value as (typeof DAATH_RELATIONSHIPS)[number])
              }
              disabled={disabled}
              style={{
                width: '100%',
                padding: '0.5rem',
                borderRadius: '6px',
                border: '1px solid var(--border)',
                backgroundColor: 'var(--background)',
                color: 'var(--foreground)',
                fontSize: '0.875rem',
              }}
            >
              <option value="seeking">Seeking — Actively pursuing hidden knowledge</option>
              <option value="touched">Touched — Has glimpsed the abyss</option>
              <option value="integrated">Integrated — Has crossed and returned</option>
              <option value="avoiding">Avoiding — Shuns forbidden knowledge</option>
            </select>
          </div>

          {/* Quick select list */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '0.5rem',
            }}
          >
            {SEPHIRA_DATA.map((sephira) => {
              const isSelected = selectedSephira === sephira.name;
              const isSuggested = suggestedSephira === sephira.name;

              return (
                <button
                  key={sephira.name}
                  type="button"
                  onClick={() => onSephiraChange?.(sephira.name)}
                  disabled={disabled}
                  style={{
                    padding: '0.5rem',
                    borderRadius: '6px',
                    border: `2px solid ${isSelected ? 'var(--primary)' : isSuggested ? 'var(--primary)' : 'var(--border)'}`,
                    backgroundColor: isSelected ? 'var(--primary)' : 'transparent',
                    color: isSelected ? 'white' : 'var(--foreground)',
                    cursor: disabled ? 'not-allowed' : 'pointer',
                    fontSize: '0.8rem',
                    textAlign: 'left',
                    opacity: disabled ? 0.5 : 1,
                    borderStyle: isSuggested && !isSelected ? 'dashed' : 'solid',
                  }}
                >
                  <strong>{sephira.name}</strong>
                  <br />
                  <span style={{ opacity: 0.8, fontSize: '0.75rem' }}>{sephira.meaning}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
