/**
 * Genome Display Component
 * Implements the three-layer progressive disclosure system
 *
 * See /DESIGN_PHILOSOPHY.md for full rationale
 */

import React, { useState } from 'react';
import { SymbolicImprint, MarkerList } from './SymbolicImprint';
import { GatewayTooltip } from './GatewayTooltip';
import { AdvancedView } from './AdvancedView';

interface GenomeDisplayProps {
  genome: {
    id: string;
    // Layer 1: Surface
    surface: {
      imprint: {
        symbol: string;
        primitive: string;
        label: string;
        full: string;
      };
      classification: string;
      state: {
        charge: number;
        stability: number;
        phase: string;
      };
      lattice: {
        node: number;
        axis: string;
        shadow: string;
      };
      markers: string[];
    };
    // Layer 2: Gateway
    gateway: {
      title: string;
      keywords: string[];
      essence: string;
      creativePhase: string;
      learnMoreUrl?: string;
    };
    // Layer 3: Depths (optional, requires access)
    depths?: any;
  };
  hasAdvancedAccess?: boolean;
}

export function GenomeDisplay({ genome, hasAdvancedAccess = false }: GenomeDisplayProps) {
  const [showAdvanced, setShowAdvanced] = useState(false);

  const { surface, gateway, depths } = genome;

  return (
    <div className="genome-display" style={{
      backgroundColor: '#0a0a0a',
      border: '1px solid rgba(255, 255, 255, 0.1)',
      borderRadius: '8px',
      padding: '2rem',
    }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5 }}>
          CHARACTER GENOME
        </h2>
      </div>

      {/* Layer 1 + 2: Surface with Gateway Tooltip */}
      <div style={{ marginBottom: '2rem' }}>
        <GatewayTooltip
          title={gateway.title}
          keywords={gateway.keywords}
          essence={gateway.essence}
          creativePhase={gateway.creativePhase}
          learnMoreUrl={gateway.learnMoreUrl}
        >
          <div>
            <SymbolicImprint
              symbol={surface.imprint.symbol}
              primitive={surface.imprint.primitive}
              label={surface.imprint.label}
              aestheticClass={surface.classification}
              onClick={() => {}}
            />
          </div>
        </GatewayTooltip>
      </div>

      {/* State Profile */}
      <div style={{
        backgroundColor: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid rgba(255, 255, 255, 0.05)',
        borderRadius: '4px',
        padding: '1.5rem',
        marginBottom: '2rem',
      }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5 }}>
          STATE PROFILE
        </h3>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {/* Charge */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Charge</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {surface.state.charge > 0 ? '+' : ''}{surface.state.charge}
              </span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${Math.abs(surface.state.charge) * 10}%`,
                  backgroundColor: surface.state.charge > 0 ? '#f59e0b' : '#3b82f6',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Stability */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Stability</span>
              <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>
                {Math.round(surface.state.stability * 100)}%
              </span>
            </div>
            <div style={{ height: '4px', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '2px', overflow: 'hidden' }}>
              <div
                style={{
                  height: '100%',
                  width: `${surface.state.stability * 100}%`,
                  backgroundColor: '#8b5cf6',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Phase */}
          <div>
            <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>Phase: </span>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>{surface.state.phase}</span>
          </div>
        </div>
      </div>

      {/* Lattice Position */}
      <div style={{ marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '0.875rem', fontWeight: 600, marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', opacity: 0.5 }}>
          LATTICE POSITION
        </h3>
        <div style={{ fontSize: '0.875rem', display: 'grid', gap: '0.5rem' }}>
          <div>
            <span style={{ opacity: 0.7 }}>Node: </span>
            <span style={{ fontWeight: 600 }}>{surface.lattice.node}</span>
            <span style={{ opacity: 0.5, marginLeft: '0.5rem' }}>({surface.lattice.axis} Axis)</span>
          </div>
          <div>
            <span style={{ opacity: 0.7 }}>Shadow Node: </span>
            <span style={{ fontWeight: 600 }}>{surface.lattice.shadow}</span>
          </div>
        </div>
      </div>

      {/* Symbolic Markers */}
      <MarkerList markers={surface.markers} />

      {/* Layer 3: Advanced View Toggle */}
      {hasAdvancedAccess && depths && (
        <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(255, 255, 255, 0.1)' }}>
          <button
            onClick={() => setShowAdvanced(true)}
            style={{
              width: '100%',
              padding: '0.75rem',
              backgroundColor: 'rgba(139, 92, 246, 0.1)',
              border: '1px solid rgba(139, 92, 246, 0.3)',
              borderRadius: '4px',
              color: '#c4b5fd',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(139, 92, 246, 0.1)';
              e.currentTarget.style.borderColor = 'rgba(139, 92, 246, 0.3)';
            }}
          >
            Show Full Archetype Data
          </button>
        </div>
      )}

      {/* No Access Message */}
      {!hasAdvancedAccess && (
        <div style={{
          marginTop: '2rem',
          paddingTop: '2rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          textAlign: 'center',
          opacity: 0.5,
        }}>
          <p style={{ fontSize: '0.75rem' }}>
            Create 3 characters to unlock Advanced View
          </p>
        </div>
      )}

      {/* Advanced View Modal */}
      {depths && (
        <AdvancedView
          data={depths}
          isOpen={showAdvanced}
          onClose={() => setShowAdvanced(false)}
        />
      )}
    </div>
  );
}
