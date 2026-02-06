'use client';

import { useState } from 'react';
import Link from 'next/link';
import type { Character } from '@/lib/api';
import { syncOripheonData } from '@/lib/api';
import { getSubtasteInfo } from '@/components/world/SuggestedRelationshipsPanel';

const WU_XING_SYMBOLS: Record<string, string> = {
  wood: '\u6728 Wood',
  fire: '\u706b Fire',
  earth: '\u571f Earth',
  metal: '\u91d1 Metal',
  water: '\u6c34 Water',
};

interface CharacterDetailPanelProps {
  character: Character;
  onClose: () => void;
  onRefresh?: () => void;
}

export function CharacterDetailPanel({ character, onClose, onRefresh }: CharacterDetailPanelProps) {
  const [showSubtaste, setShowSubtaste] = useState(false);
  const [syncing, setSyncing] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const subtasteInfo = getSubtasteInfo(character);
  const hasOripheonData = !!(character.timelineState as any)?.oripheon?.generated;
  const hexagram = (character.timelineState as any)?.oripheon?.generated?.hexagram as {
    presentHexagram: { number: number; name: string; chinese: string; image: string; judgment: string; lines: boolean[] };
    transformingHexagram: { number: number; name: string; chinese: string; lines: boolean[] } | null;
    movingLines: number[];
  } | undefined;

  const handleSyncOripheon = async () => {
    setSyncing(true);
    try {
      await syncOripheonData(character.id);
      onRefresh?.();
    } catch (error) {
      console.error('Failed to sync oripheon data:', error);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <h2 className="detail-panel-title">Character Details</h2>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="character-info-header">
        <div className="character-info-avatar">
          {character.avatarUrl ? (
            <img
              src={character.avatarUrl}
              alt={character.name}
              style={{ objectPosition: character.avatarPosition || '50% 50%' }}
            />
          ) : (
            <span className="character-avatar-placeholder">{getInitials(character.name)}</span>
          )}
        </div>
        <div className="character-info-name">{character.name}</div>
      </div>

      {character.aliases.length > 0 && (
        <div className="detail-section">
          <label className="label">Aliases</label>
          <div className="tag-list">
            {character.aliases.map((alias, i) => (
              <span key={i} className="tag">
                {alias}
              </span>
            ))}
          </div>
        </div>
      )}

      {character.bio && (
        <div className="detail-section">
          <label className="label">Bio</label>
          <p className="detail-text">{character.bio}</p>
        </div>
      )}

      {character.personaTags.length > 0 && (
        <div className="detail-section">
          <label className="label">Persona Tags</label>
          <div className="tag-list">
            {character.personaTags.map((tag, i) => (
              <span key={i} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {character.currentArc && (
        <div className="detail-section">
          <label className="label">Current Arc</label>
          <p className="detail-text">{character.currentArc}</p>
        </div>
      )}

      {/* Subtaste Compatibility Reference */}
      {subtasteInfo && (
        <div className="detail-section">
          <div
            className="subtaste-ref-header"
            onClick={() => setShowSubtaste(!showSubtaste)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => { if (e.key === 'Enter') setShowSubtaste(!showSubtaste); }}
          >
            <label className="label" style={{ cursor: 'pointer', margin: 0 }}>
              Subtaste Profile
            </label>
            <span className="subtaste-ref-toggle">{showSubtaste ? '\u2212' : '+'}</span>
          </div>

          {/* Always show the designation tag */}
          <div className="subtaste-ref-designation">
            <span className="subtaste-ref-tag">{subtasteInfo.subtaste}</span>
            <span className="subtaste-ref-label">{subtasteInfo.label}</span>
          </div>

          {showSubtaste && (
            <div className="subtaste-ref-body">
              {/* Wu Xing Element */}
              <div className="subtaste-ref-row">
                <span className="subtaste-ref-key">Wu Xing</span>
                <span className="subtaste-ref-val">
                  {WU_XING_SYMBOLS[subtasteInfo.wuXingElement] || subtasteInfo.wuXingElement}
                  <span className="subtaste-ref-dim"> ({subtasteInfo.phase} phase)</span>
                </span>
              </div>

              {/* Growth Arrow */}
              <div className="subtaste-ref-row">
                <span className="subtaste-ref-key">Growth &rarr;</span>
                <span className="subtaste-ref-val">
                  {subtasteInfo.growth}
                  <span className="subtaste-ref-dim"> ({subtasteInfo.growthLabel})</span>
                </span>
              </div>

              {/* Stress Arrow */}
              <div className="subtaste-ref-row">
                <span className="subtaste-ref-key">Stress &rarr;</span>
                <span className="subtaste-ref-val subtaste-ref-stress">
                  {subtasteInfo.stress}
                  <span className="subtaste-ref-dim"> ({subtasteInfo.stressLabel})</span>
                </span>
              </div>

              {/* Element Relationships */}
              <div className="subtaste-ref-row">
                <span className="subtaste-ref-key">Generates</span>
                <span className="subtaste-ref-val">
                  {WU_XING_SYMBOLS[subtasteInfo.generates] || subtasteInfo.generates} types
                </span>
              </div>

              <div className="subtaste-ref-row">
                <span className="subtaste-ref-key">Overcome by</span>
                <span className="subtaste-ref-val subtaste-ref-stress">
                  {WU_XING_SYMBOLS[subtasteInfo.overcomeBy] || subtasteInfo.overcomeBy} types
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* I Ching Hexagram - Brutalist Module */}
      {hexagram && (
        <div className="detail-section">
          <label className="label">I Ching State</label>
          <div style={{
            display: 'flex',
            gap: '1rem',
            marginTop: '0.5rem',
            padding: '1rem',
            background: '#000000',
            border: '1px solid var(--border)',
          }}>
            {/* Present Hexagram */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '3px',
                alignItems: 'center',
                padding: '0.75rem',
                border: '1px solid var(--border)',
              }}>
                {[...hexagram.presentHexagram.lines].reverse().map((yang, i) => (
                  <div key={i} style={{
                    width: '32px',
                    height: '4px',
                    background: yang ? 'var(--foreground)' : 'transparent',
                    borderLeft: yang ? 'none' : '12px solid var(--foreground)',
                    borderRight: yang ? 'none' : '12px solid var(--foreground)',
                  }} />
                ))}
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.5rem',
                fontWeight: 700,
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                color: 'var(--muted-foreground)',
              }}>
                Present
              </div>
            </div>

            {/* Transformation Arrow */}
            {hexagram.transformingHexagram && (
              <div style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.25rem',
              }}>
                <div style={{ fontSize: '1.25rem', color: 'var(--foreground)' }}>→</div>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.5rem',
                  fontWeight: 600,
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                }}>
                  {hexagram.movingLines.length > 0 ? `${hexagram.movingLines.length} moving` : 'static'}
                </div>
              </div>
            )}

            {/* Transforming Hexagram */}
            {hexagram.transformingHexagram && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '3px',
                  alignItems: 'center',
                  padding: '0.75rem',
                  border: '1px solid var(--border)',
                  opacity: 0.6,
                }}>
                  {[...hexagram.transformingHexagram.lines].reverse().map((yang, i) => (
                    <div key={i} style={{
                      width: '32px',
                      height: '4px',
                      background: yang ? 'var(--foreground)' : 'transparent',
                      borderLeft: yang ? 'none' : '12px solid var(--foreground)',
                      borderRight: yang ? 'none' : '12px solid var(--foreground)',
                    }} />
                  ))}
                </div>
                <div style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.5rem',
                  fontWeight: 700,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--muted-foreground)',
                }}>
                  Becoming
                </div>
              </div>
            )}

            {/* Hexagram Info */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
              <div style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '0.875rem',
                fontWeight: 600,
                color: 'var(--foreground)',
              }}>
                <span style={{ marginRight: '0.375rem' }}>{hexagram.presentHexagram.chinese}</span>
                #{hexagram.presentHexagram.number}
              </div>
              <div style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.03em',
                textTransform: 'uppercase',
                color: 'var(--foreground)',
              }}>
                {hexagram.presentHexagram.name}
              </div>
              <div style={{
                fontFamily: 'var(--font-body)',
                fontSize: '0.6875rem',
                color: 'var(--muted-foreground)',
                lineHeight: 1.4,
              }}>
                {hexagram.presentHexagram.image}
              </div>
              {hexagram.transformingHexagram && (
                <div style={{
                  marginTop: '0.25rem',
                  paddingTop: '0.375rem',
                  borderTop: '1px solid var(--border)',
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.5625rem',
                  fontWeight: 500,
                  letterSpacing: '0.05em',
                  color: 'var(--muted-foreground)',
                }}>
                  → {hexagram.transformingHexagram.chinese} {hexagram.transformingHexagram.name}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <div className="detail-actions">
        <Link href={`/characters/${character.id}`} className="btn btn-primary">
          View Full Profile
        </Link>
        <button
          className="btn btn-secondary"
          onClick={handleSyncOripheon}
          disabled={syncing}
        >
          {syncing ? 'Syncing...' : hasOripheonData ? 'Sync Oripheon Data' : 'Generate Oripheon Data'}
        </button>
      </div>
    </div>
  );
}
