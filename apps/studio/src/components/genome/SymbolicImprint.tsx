/**
 * Symbolic Imprint Display Component
 * Shows Layer 1 (Surface) view of character genome
 */

import React from 'react';

interface SymbolicImprintProps {
  symbol: string;      // λ
  primitive: string;   // ⬡
  label: string;       // Architect
  aestheticClass: string; // L-3 (Industrial)
  onHover?: () => void;
  onClick?: () => void;
}

export function SymbolicImprint({
  symbol,
  primitive,
  label,
  aestheticClass,
  onHover,
  onClick,
}: SymbolicImprintProps) {
  return (
    <div
      className="symbolic-imprint"
      onMouseEnter={onHover}
      onClick={onClick}
      style={{ cursor: onClick ? 'pointer' : 'default' }}
    >
      <div className="imprint-header">
        <span className="imprint-symbol" style={{ fontSize: '2rem', fontWeight: 300 }}>
          {symbol}
        </span>
        <span className="imprint-primitive" style={{ fontSize: '1.5rem', marginLeft: '0.5rem', opacity: 0.7 }}>
          {primitive}
        </span>
      </div>
      <div className="imprint-label" style={{ fontSize: '1.25rem', fontWeight: 500, marginTop: '0.25rem' }}>
        {symbol}-{label}
      </div>
      <div className="imprint-class" style={{ fontSize: '0.875rem', opacity: 0.6, marginTop: '0.125rem' }}>
        Classification: {aestheticClass}
      </div>
    </div>
  );
}

interface ImprintBadgeProps {
  symbol: string;
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
}

export function ImprintBadge({ symbol, size = 'md', showTooltip = true }: ImprintBadgeProps) {
  const sizeMap = {
    sm: '1rem',
    md: '1.5rem',
    lg: '2rem',
  };

  return (
    <span
      className="imprint-badge"
      style={{
        fontSize: sizeMap[size],
        fontWeight: 300,
        opacity: 0.9,
        cursor: showTooltip ? 'help' : 'default',
      }}
      title={showTooltip ? 'Hover for details' : undefined}
    >
      {symbol}
    </span>
  );
}

interface MarkerListProps {
  markers: string[];
}

export function MarkerList({ markers }: MarkerListProps) {
  return (
    <div className="marker-list" style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
      <span style={{ fontSize: '0.75rem', opacity: 0.5, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
        Symbolic Markers
      </span>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {markers.map((marker, i) => (
          <span
            key={i}
            style={{
              fontSize: '1.125rem',
              fontWeight: 300,
              opacity: 0.7,
              cursor: 'help',
            }}
            title="Hover for meaning"
          >
            {marker}
          </span>
        ))}
      </div>
    </div>
  );
}
