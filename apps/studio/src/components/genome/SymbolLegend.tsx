/**
 * Symbol Legend Component
 * Interactive reference guide for all Orisha symbols
 * Part of Progressive Disclosure - makes Layer 1 discoverable
 */

'use client';

import React, { useState } from 'react';
import type { OrishaName } from '@lcos/oripheon';
import { getSymbolicImprint, ORISHA_DATA } from '@lcos/oripheon';
import { EnhancedGatewayTooltip } from './EnhancedGatewayTooltip';
import { SymbolicImprint } from './SymbolicImprint';
import styles from './SymbolLegend.module.css';

const ALL_ORISHAS: OrishaName[] = [
  'Èṣù',
  'Ògún',
  'Ọ̀ṣun',
  'Yemọja',
  'Ṣàngó',
  'Ọya',
  'Obàtálá',
  'Ọ̀rúnmìlà',
  'Ọ̀ṣọ́ọ̀sì',
  'Ọ̀sanyìn',
];

interface SymbolCardProps {
  orisha: OrishaName;
}

function SymbolCard({ orisha }: SymbolCardProps) {
  const imprint = getSymbolicImprint(orisha);
  const orishaData = ORISHA_DATA[orisha];

  return (
    <div className={styles.card}>
      <EnhancedGatewayTooltip
        orisha={orisha}
        title={imprint.label}
        keywords={imprint.keywords}
        essence={imprint.essence}
        creativePhase={imprint.creativePhase}
      >
        <div className={styles.cardContent}>
          {/* Symbol Display */}
          <div className={styles.symbolDisplay}>
            <SymbolicImprint
              symbol={imprint.symbol}
              primitive={imprint.primitive}
              label={imprint.label}
              aestheticClass={imprint.aestheticClass}
              onClick={() => {}}
            />
          </div>

          {/* Orisha Name */}
          <div className={styles.orishaName}>{orisha}</div>

          {/* Title */}
          <div className={styles.orishaTitle}>{orishaData.title}</div>

          {/* Key Info */}
          <div className={styles.keyInfo}>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Number:</span>
              <span className={styles.infoValue}>{orishaData.number}</span>
            </div>
            <div className={styles.infoRow}>
              <span className={styles.infoLabel}>Element:</span>
              <span className={styles.infoValue}>{orishaData.element}</span>
            </div>
          </div>

          {/* Color Palette */}
          <div className={styles.colorPalette}>
            {orishaData.colors.map((color, idx) => (
              <div
                key={idx}
                className={styles.colorSwatch}
                style={{ backgroundColor: color }}
                title={color}
              />
            ))}
          </div>
        </div>
      </EnhancedGatewayTooltip>
    </div>
  );
}

// Tree of Life positions for each Sephira
const SEPHIRA_POSITIONS: Record<string, { x: number; y: number; name: string }> = {
  'Kether': { x: 50, y: 5, name: 'Crown' },
  'Chokmah': { x: 75, y: 15, name: 'Wisdom' },
  'Binah': { x: 25, y: 15, name: 'Understanding' },
  'Daath': { x: 50, y: 25, name: 'Knowledge' },
  'Chesed': { x: 75, y: 35, name: 'Mercy' },
  'Geburah': { x: 25, y: 35, name: 'Severity' },
  'Tiphareth': { x: 50, y: 45, name: 'Beauty' },
  'Netzach': { x: 75, y: 60, name: 'Victory' },
  'Hod': { x: 25, y: 60, name: 'Splendor' },
  'Yesod': { x: 50, y: 75, name: 'Foundation' },
  'Malkuth': { x: 50, y: 92, name: 'Kingdom' },
};

// Map Orisha to their Sephira
const ORISHA_SEPHIRA: Record<OrishaName, string> = {
  'Ọ̀rúnmìlà': 'Kether',
  'Obàtálá': 'Kether',
  'Ọya': 'Chokmah',
  'Yemọja': 'Binah',
  'Èṣù': 'Daath',
  'Ògún': 'Geburah',
  'Ṣàngó': 'Tiphareth',
  'Ọ̀ṣun': 'Netzach',
  'Ọ̀ṣọ́ọ̀sì': 'Hod',
  'Ọ̀sanyìn': 'Yesod',
};

interface SymbolLegendProps {
  searchable?: boolean;
}

export function SymbolLegend({ searchable = false }: SymbolLegendProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'tree'>('grid');

  const filteredOrishas = searchQuery
    ? ALL_ORISHAS.filter((orisha) => {
        const imprint = getSymbolicImprint(orisha);
        const orishaData = ORISHA_DATA[orisha];
        const searchLower = searchQuery.toLowerCase();

        return (
          orisha.toLowerCase().includes(searchLower) ||
          imprint.label.toLowerCase().includes(searchLower) ||
          imprint.keywords.some(k => k.toLowerCase().includes(searchLower)) ||
          orishaData.title.toLowerCase().includes(searchLower) ||
          imprint.aestheticClass.toLowerCase().includes(searchLower)
        );
      })
    : ALL_ORISHAS;

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <h1 className={styles.title}>Symbol Legend</h1>
        <p className={styles.subtitle}>
          Discover the symbolic language of character genomes. Each Orisha represents
          a creative archetype expressed through mathematical symbols and geometric primitives.
        </p>
      </div>

      {/* Search (optional) */}
      {searchable && (
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Search by name, symbol, or trait..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      )}

      {/* Legend Info */}
      <div className={styles.legendInfo}>
        <div className={styles.legendItem}>
          <div className={styles.legendIcon}>λ</div>
          <div className={styles.legendText}>
            <strong>Mathematical Symbol</strong>
            <span>Represents the Orisha's core essence</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendIcon}>⬡</div>
          <div className={styles.legendText}>
            <strong>Geometric Primitive</strong>
            <span>Visual signature for quick recognition</span>
          </div>
        </div>
        <div className={styles.legendItem}>
          <div className={styles.legendIcon}>L-3</div>
          <div className={styles.legendText}>
            <strong>Aesthetic Class</strong>
            <span>L-0 to L-11, each with unique qualities</span>
          </div>
        </div>
      </div>

      {/* View Mode Toggle */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '2rem' }}>
        <button
          onClick={() => setViewMode('grid')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            backgroundColor: viewMode === 'grid' ? 'var(--foreground)' : '#000000',
            color: viewMode === 'grid' ? 'var(--background)' : 'var(--foreground)',
            border: '1px solid var(--foreground)',
            borderRadius: '0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Grid View
        </button>
        <button
          onClick={() => setViewMode('tree')}
          style={{
            padding: '0.5rem 1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            backgroundColor: viewMode === 'tree' ? 'var(--foreground)' : '#000000',
            color: viewMode === 'tree' ? 'var(--background)' : 'var(--foreground)',
            border: '1px solid var(--foreground)',
            borderRadius: '0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          Tree of Life
        </button>
      </div>

      {/* Grid View */}
      {viewMode === 'grid' && (
        <>
          <div className={styles.grid}>
            {filteredOrishas.map((orisha) => (
              <SymbolCard key={orisha} orisha={orisha} />
            ))}
          </div>

          {/* No Results */}
          {filteredOrishas.length === 0 && (
            <div className={styles.noResults}>
              <p>No symbols found matching "{searchQuery}"</p>
              <button
                onClick={() => setSearchQuery('')}
                className={styles.clearButton}
              >
                Clear Search
              </button>
            </div>
          )}
        </>
      )}

      {/* Tree of Life View */}
      {viewMode === 'tree' && (
        <div style={{
          position: 'relative',
          width: '100%',
          maxWidth: '800px',
          height: '700px',
          margin: '0 auto 3rem',
          border: '1px solid var(--foreground)',
          backgroundColor: '#000000',
        }}>
          {/* Tree of Life title */}
          <div style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
            letterSpacing: '0.1em',
            color: 'var(--muted-foreground)',
          }}>
            Tree of Life - Kabbalistic Arrangement
          </div>

          {/* Render each Orisha at its Sephira position */}
          {ALL_ORISHAS.map((orisha) => {
            const sephira = ORISHA_SEPHIRA[orisha];
            const position = SEPHIRA_POSITIONS[sephira];
            if (!position) return null;

            const imprint = getSymbolicImprint(orisha);

            // For Kether, offset second orisha
            const isSecondKether = orisha === 'Obàtálá' && sephira === 'Kether';
            const offsetX = isSecondKether ? 8 : 0;

            return (
              <div
                key={orisha}
                style={{
                  position: 'absolute',
                  left: `${position.x + offsetX}%`,
                  top: `${position.y}%`,
                  transform: 'translate(-50%, -50%)',
                  textAlign: 'center',
                }}
              >
                <EnhancedGatewayTooltip
                  orisha={orisha}
                  title={imprint.label}
                  keywords={imprint.keywords}
                  essence={imprint.essence}
                  creativePhase={imprint.creativePhase}
                >
                  <div style={{
                    padding: '0.5rem',
                    backgroundColor: '#000000',
                    border: '1px solid var(--foreground)',
                    cursor: 'pointer',
                    transition: 'border-color 0.2s ease',
                    minWidth: '80px',
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'}
                  >
                    <div style={{ fontSize: '1.5rem', fontWeight: 300 }}>{imprint.symbol}</div>
                    <div style={{ fontSize: '0.7rem', fontWeight: 600, marginTop: '0.25rem' }}>{imprint.aestheticClass}</div>
                    <div style={{ fontSize: '0.6rem', color: 'var(--muted-foreground)', marginTop: '0.125rem' }}>{imprint.label}</div>
                  </div>
                </EnhancedGatewayTooltip>
                {/* Sephira name below */}
                <div style={{
                  fontSize: '0.55rem',
                  color: 'var(--muted-foreground)',
                  marginTop: '0.25rem',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}>
                  {sephira}
                </div>
              </div>
            );
          })}

          {/* Connection lines would go here - simplified for now */}
          <svg style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            opacity: 0.2,
          }}>
            {/* Simplified path connections */}
            <line x1="50%" y1="8%" x2="75%" y2="18%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="50%" y1="8%" x2="25%" y2="18%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="75%" y1="18%" x2="50%" y2="28%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="25%" y1="18%" x2="50%" y2="28%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="50%" y1="28%" x2="50%" y2="48%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="75%" y1="18%" x2="75%" y2="38%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="25%" y1="18%" x2="25%" y2="38%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="75%" y1="38%" x2="50%" y2="48%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="25%" y1="38%" x2="50%" y2="48%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="50%" y1="48%" x2="75%" y2="63%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="50%" y1="48%" x2="25%" y2="63%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="75%" y1="63%" x2="50%" y2="78%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="25%" y1="63%" x2="50%" y2="78%" stroke="var(--foreground)" strokeWidth="1" />
            <line x1="50%" y1="78%" x2="50%" y2="95%" stroke="var(--foreground)" strokeWidth="1" />
          </svg>
        </div>
      )}

      {/* Usage Guide */}
      <div className={styles.usageGuide}>
        <h2 className={styles.guideTitle}>How to Read Symbolic Imprints</h2>
        <div className={styles.guideContent}>
          <div className={styles.guideSection}>
            <h3>Layer 1: Surface</h3>
            <p>
              Every character displays their imprint upfront: a mathematical symbol
              paired with a geometric primitive, plus their L-class aesthetic classification.
              This is your first clue to their creative archetype.
            </p>
          </div>
          <div className={styles.guideSection}>
            <h3>Layer 2: Gateway</h3>
            <p>
              Hover over any symbol to reveal keywords and essence. Click to expand
              and discover sacred correspondences, actionable insights, and deeper context
              about the Orisha's creative energy.
            </p>
          </div>
          <div className={styles.guideSection}>
            <h3>Layer 3: Depths</h3>
            <p>
              After creating 3 characters or spending 7 days in the system, unlock
              Advanced View to see the complete mythology: full Orisha configurations,
              Kabbalistic correspondences, and multi-modal signatures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
