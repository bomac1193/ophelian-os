/**
 * Symbol Legend Component
 * Interactive reference guide for all Orisha symbols
 * Part of Progressive Disclosure - makes Layer 1 discoverable
 */

'use client';

import React, { useState } from 'react';
import type { OrishaName } from '@lcos/oripheon';
import { getSymbolicImprint, ORISHA_DATA, SUBTASTE_DESIGNATIONS } from '@lcos/oripheon';
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
  const subtaste = SUBTASTE_DESIGNATIONS[imprint.aestheticClass];

  return (
    <div className={styles.card}>
      <EnhancedGatewayTooltip
        orisha={orisha}
        title={subtaste?.glyph || imprint.label}
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
              label={subtaste?.glyph || imprint.label}
              aestheticClass={imprint.aestheticClass}
              onClick={() => {}}
            />
          </div>

          {/* Glyph Name */}
          <div className={styles.orishaName}>{subtaste?.glyph || imprint.label}</div>

          {/* Classification & Label */}
          <div className={styles.orishaTitle}>{imprint.aestheticClass} · {subtaste?.label || ''}</div>

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

// Creative Phase descriptions
const CREATIVE_PHASES: Record<string, { label: string; description: string }> = {
  'genesis': { label: 'Genesis', description: 'Origin point — where new patterns emerge from chaos' },
  'vision': { label: 'Vision', description: 'Clarity forms — seeing what could be' },
  'refinement': { label: 'Refinement', description: 'Honing the craft — precision and mastery' },
  'manifestation': { label: 'Manifestation', description: 'Bringing form — will into reality' },
  'flow': { label: 'Flow', description: 'Sustaining force — continuous creation' },
};

// Map Orisha to their Creative Phase
const ORISHA_PHASES: Record<OrishaName, string> = {
  'Èṣù': 'genesis',
  'Obàtálá': 'genesis',
  'Ọya': 'genesis',
  'Ṣàngó': 'vision',
  'Ọ̀rúnmìlà': 'vision',
  'Ọ̀ṣọ́ọ̀sì': 'refinement',
  'Ọ̀sanyìn': 'refinement',
  'Ògún': 'manifestation',
  'Ọ̀ṣun': 'flow',
  'Yemọja': 'flow',
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
          Creative Phases
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

      {/* Creative Phase Constellation View */}
      {viewMode === 'tree' && (() => {
        // Helper to render a node
        const PhaseNode = ({ orisha }: { orisha: OrishaName }) => {
          const imprint = getSymbolicImprint(orisha);
          const subtaste = SUBTASTE_DESIGNATIONS[imprint.aestheticClass];
          return (
            <div style={{
              padding: '1rem',
              backgroundColor: '#000000',
              border: '1px solid var(--foreground)',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
              minWidth: '140px',
              textAlign: 'center',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.4)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'}
            >
              <div style={{ fontSize: '2rem', fontWeight: 300, marginBottom: '0.25rem' }}>{imprint.symbol}</div>
              <div style={{ fontSize: '0.875rem', fontWeight: 700 }}>{subtaste?.glyph || imprint.label}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '0.25rem' }}>{imprint.aestheticClass}</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--muted-foreground)', marginTop: '0.25rem', opacity: 0.7 }}>{subtaste?.label || ''}</div>
            </div>
          );
        };

        const phaseOrder = ['genesis', 'vision', 'refinement', 'manifestation', 'flow'];

        return (
          <div style={{
            maxWidth: '1000px',
            margin: '0 auto 3rem',
            padding: '2rem',
            border: '1px solid var(--foreground)',
            backgroundColor: '#000000',
          }}>
            {/* Title */}
            <h3 style={{
              fontSize: '0.875rem',
              fontWeight: 600,
              textTransform: 'uppercase',
              letterSpacing: '0.1em',
              color: 'var(--muted-foreground)',
              marginBottom: '0.5rem',
              textAlign: 'center',
            }}>
              Creative Phase Constellation
            </h3>
            <p style={{
              fontSize: '0.75rem',
              color: 'var(--muted-foreground)',
              textAlign: 'center',
              marginBottom: '2rem',
              opacity: 0.7,
            }}>
              The cycle of creation — from origin to sustaining force
            </p>

            {/* Phase Rows */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {phaseOrder.map((phase) => {
                const phaseInfo = CREATIVE_PHASES[phase];
                const orishasInPhase = ALL_ORISHAS.filter(o => ORISHA_PHASES[o] === phase);

                return (
                  <div key={phase} style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '2rem',
                    padding: '1.5rem',
                    borderBottom: phase !== 'flow' ? '1px solid var(--border)' : 'none',
                  }}>
                    {/* Phase Label */}
                    <div style={{ minWidth: '140px', flexShrink: 0 }}>
                      <div style={{
                        fontSize: '0.875rem',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.1em',
                        marginBottom: '0.25rem',
                      }}>
                        {phaseInfo.label}
                      </div>
                      <div style={{
                        fontSize: '0.7rem',
                        color: 'var(--muted-foreground)',
                        lineHeight: 1.4,
                      }}>
                        {phaseInfo.description}
                      </div>
                    </div>

                    {/* Phase Nodes */}
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {orishasInPhase.map((orisha) => (
                        <PhaseNode key={orisha} orisha={orisha} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Flow Arrow Indicator */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '1rem',
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border)',
            }}>
              <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
                Genesis
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>→</span>
              <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
                Vision
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>→</span>
              <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
                Refinement
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>→</span>
              <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
                Manifestation
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>→</span>
              <span style={{ fontSize: '0.625rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--muted-foreground)' }}>
                Flow
              </span>
              <span style={{ color: 'var(--muted-foreground)' }}>↻</span>
            </div>
          </div>
        );
      })()}

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
              Advanced View to see the complete archetype data: full configurations,
              sacred correspondences, and multi-modal signatures.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
