/**
 * Symbol Legend Component
 * Interactive reference guide for all Orisha symbols
 * Part of Progressive Disclosure - makes Layer 1 discoverable
 */

'use client';

import React, { useState } from 'react';
import type { OrishaName } from '@lcos/oripheon';
import { SYMBOLIC_IMPRINTS, getSymbolicImprint } from '@lcos/oripheon';
import { ORISHA_DATA } from '@lcos/oripheon';
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

interface SymbolLegendProps {
  searchable?: boolean;
}

export function SymbolLegend({ searchable = false }: SymbolLegendProps) {
  const [searchQuery, setSearchQuery] = useState('');

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

      {/* Orisha Grid */}
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
