'use client';

import { useEffect, useState, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getImprint,
  updateImprint,
  deleteImprint,
  exportImprint,
  generatePrompt,
  type CharacterImprint,
  type ImprintSystemPrompt,
} from '../../../lib/imprint-api';
import { TreeOfLifeVisualization, MultiModalPreview } from '../../../components/imprint';
import { GenomeDisplay, GenomePuzzleUnlock } from '../../../components/genome';
import { ContentGenerator, ContentSuggester } from '../../../components/content';
import { CharacterTimeline } from '../../../components/timeline';
import { VoiceGenerator } from '../../../components/voice/VoiceGenerator';
import { AvatarGenerator } from '../../../components/avatar/AvatarGenerator';
import { RelationshipManager } from '../../../components/relationships/RelationshipManager';
import { TransmediaStoryManager } from '../../../components/transmedia/TransmediaStoryManager';
import { getSurfaceView, getGatewayHint, getDepthsView } from '@lcos/oripheon';
import { refreshUserProgress } from '../../../lib/user-progress';
import { generateMockTimeline, getCharacterAge } from '../../../lib/timeline-utils';
import puzzleStyles from '../../../components/genome/GenomePuzzleUnlock.module.css';

export default function ImprintDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [genome, setGenome] = useState<CharacterImprint | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [_saving, setSaving] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState<ImprintSystemPrompt | null>(null);
  const [promptLoading, setPromptLoading] = useState(false);
  const [promptStyle, setPromptStyle] = useState<'concise' | 'detailed' | 'poetic'>('detailed');
  const [activeTab, setActiveTab] = useState<'overview' | 'multimodal' | 'narrative' | 'prompt' | 'content' | 'timeline' | 'voice' | 'avatar' | 'relationships' | 'stories'>('overview');
  const [mysteriesUnlocked, setMysteriesUnlocked] = useState(false);
  const [hasAdvancedAccess, setHasAdvancedAccess] = useState(false);
  const [suggestedIntent, setSuggestedIntent] = useState<string>('');

  const fetchImprint = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getImprint(id);
      setGenome(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch imprint');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchImprint();
  }, [fetchImprint]);

  useEffect(() => {
    // Fetch user progress to determine advanced access
    async function checkAccess() {
      try {
        const progress = await refreshUserProgress();
        setHasAdvancedAccess(progress.hasAdvancedAccess);
      } catch {
        // Default to no access on error
        setHasAdvancedAccess(false);
      }
    }
    checkAccess();
  }, []);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this imprint? This cannot be undone.')) return;

    try {
      await deleteImprint(id);
      router.push('/imprint');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete imprint');
    }
  };

  const handleExport = async (format: 'json' | 'markdown' | 'system-prompt') => {
    try {
      const exported = await exportImprint(id, format, promptStyle);
      const blob = new Blob([exported], {
        type: format === 'json' ? 'application/json' : 'text/plain',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imprint-${id}.${format === 'json' ? 'json' : format === 'markdown' ? 'md' : 'txt'}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export imprint');
    }
  };

  const handleGeneratePrompt = async () => {
    setPromptLoading(true);
    setError(null);

    try {
      const prompt = await generatePrompt(id, promptStyle);
      setSystemPrompt(prompt);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate prompt');
    } finally {
      setPromptLoading(false);
    }
  };

  const handleNameChange = async (newName: string) => {
    if (!genome) return;
    setSaving(true);

    try {
      const updated = await updateImprint(id, { name: newName });
      setGenome(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update name');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
        Loading imprint...
      </div>
    );
  }

  if (error && !genome) {
    return (
      <div className="container" style={{ padding: '2rem' }}>
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--destructive)',
            color: 'white',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
        <Link href="/imprint" style={{ color: 'var(--primary)' }}>
          Back to Imprint Library
        </Link>
      </div>
    );
  }

  if (!genome) return null;

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          marginBottom: '2rem',
          flexWrap: 'wrap',
          gap: '1rem',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <Link href="/imprint" style={{ color: 'var(--muted-foreground)', textDecoration: 'none' }}>
              Imprints
            </Link>
            <span style={{ color: 'var(--muted-foreground)' }}>/</span>
          </div>
          <h1
            contentEditable
            suppressContentEditableWarning
            onBlur={(e) => handleNameChange(e.currentTarget.textContent || genome.name)}
            style={{
              margin: '0 0 0.5rem',
              fontSize: '1.75rem',
              outline: 'none',
              cursor: 'text',
              padding: '0.25rem',
              borderRadius: '4px',
            }}
          >
            {genome.name}
          </h1>
          <p style={{ margin: 0, color: 'var(--muted-foreground)', fontSize: '0.875rem' }}>
            Created {new Date(genome.createdAt).toLocaleDateString()} | Schema v{genome.schemaVersion}
            {genome.seed && ` | Seed: ${genome.seed}`}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <select
            value={promptStyle}
            onChange={(e) => setPromptStyle(e.target.value as 'concise' | 'detailed' | 'poetic')}
            style={{
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
            }}
          >
            <option value="concise">Concise</option>
            <option value="detailed">Detailed</option>
            <option value="poetic">Poetic</option>
          </select>
          <button
            type="button"
            onClick={() => handleExport('json')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Export JSON
          </button>
          <button
            type="button"
            onClick={() => handleExport('system-prompt')}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Export Prompt
          </button>
          <button
            type="button"
            onClick={handleDelete}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--destructive)',
              backgroundColor: 'transparent',
              color: 'var(--destructive)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Delete
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--destructive)',
            color: 'white',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Tabs */}
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          borderBottom: '1px solid var(--border)',
          paddingBottom: '0.5rem',
        }}
      >
        {(['overview', 'timeline', 'multimodal', 'narrative', 'prompt', 'content', 'voice', 'avatar', 'relationships', 'stories'] as const).map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px 6px 0 0',
              border: 'none',
              backgroundColor: activeTab === tab ? 'var(--primary)' : 'transparent',
              color: activeTab === tab ? 'white' : 'var(--foreground)',
              cursor: 'pointer',
              fontSize: '0.875rem',
              fontWeight: activeTab === tab ? 600 : 400,
              textTransform: 'capitalize',
            }}
          >
            {tab === 'multimodal' ? 'Multi-Modal' : tab === 'prompt' ? 'System Prompt' : tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'overview' && (
        <>
          {/* Progressive Disclosure Genome Display */}
          <div style={{ marginBottom: '2rem' }}>
            {(() => {
              const surface = getSurfaceView(genome as any);
              const gateway = getGatewayHint(genome as any);
              const depths = hasAdvancedAccess ? getDepthsView(genome as any) : undefined;

              return (
                <GenomeDisplay
                  genome={{
                    id: genome.id,
                    surface,
                    gateway,
                    depths,
                  }}
                  orisha={genome.orishaConfiguration.headOrisha as any}
                  hasAdvancedAccess={hasAdvancedAccess}
                />
              );
            })()}
          </div>

          {/* Puzzle Unlock for Deep Mysteries */}
          <div style={{ marginBottom: '2rem' }}>
            <div
              style={{
                marginBottom: '1rem',
                fontSize: '0.875rem',
                color: 'var(--muted-foreground)',
              }}
            >
              The full genome mysteries (Orisha configuration, Kabbalistic position, and psychological state)
              are protected by sacred knowledge. Solve the riddle to unlock the depths.
            </div>
            <GenomePuzzleUnlock
              genome={genome}
              onUnlock={() => setMysteriesUnlocked(true)}
              isUnlocked={mysteriesUnlocked}
            />
          </div>

          {mysteriesUnlocked && (
            <div
              className={puzzleStyles.detailsContainer}
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem',
              }}
            >
              {/* Orisha Configuration */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Orisha Configuration</h3>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                Head Orisha
              </div>
              <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>{genome.orishaConfiguration.headOrisha}</div>
            </div>
            {genome.orishaConfiguration.camino && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                  Camino
                </div>
                <div>{genome.orishaConfiguration.camino}</div>
              </div>
            )}
            {genome.orishaConfiguration.secondaryInfluences.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                  Secondary Influences
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {genome.orishaConfiguration.secondaryInfluences.map((inf) => (
                    <span
                      key={inf.orisha}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--muted)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {inf.orisha} ({Math.round(inf.strength * 100)}%)
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Kabbalistic Position */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Kabbalistic Position</h3>
            <div style={{ display: 'flex', gap: '1rem' }}>
              <TreeOfLifeVisualization
                selectedSephira={genome.kabbalisticPosition.primarySephira}
                showDaath={true}
                width={150}
                height={225}
              />
              <div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                    Primary Sephira
                  </div>
                  <div style={{ fontWeight: 600 }}>{genome.kabbalisticPosition.primarySephira}</div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                    Pillar
                  </div>
                  <div>{genome.kabbalisticPosition.pillar}</div>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                    Qliphothic Shadow
                  </div>
                  <div>{genome.kabbalisticPosition.qliphothicShadow}</div>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                    Daath Relationship
                  </div>
                  <div style={{ textTransform: 'capitalize' }}>{genome.kabbalisticPosition.daathRelationship}</div>
                </div>
              </div>
            </div>
          </div>

          {/* Psychological State */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Psychological State</h3>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                Trajectory
              </div>
              <div style={{ fontWeight: 600, textTransform: 'capitalize' }}>
                {genome.psychologicalState.trajectory}
              </div>
            </div>
            <div style={{ marginBottom: '0.75rem' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                Hot/Cool Axis
              </div>
              <div
                style={{
                  height: '8px',
                  borderRadius: '4px',
                  background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ef4444)',
                  position: 'relative',
                  marginBottom: '0.25rem',
                }}
              >
                <div
                  style={{
                    position: 'absolute',
                    left: `${((genome.psychologicalState.hotCoolAxis + 1) / 2) * 100}%`,
                    top: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '12px',
                    height: '12px',
                    borderRadius: '50%',
                    backgroundColor: 'white',
                    border: '2px solid var(--foreground)',
                  }}
                />
              </div>
              <div style={{ fontSize: '0.8rem' }}>
                {genome.psychologicalState.hotCoolAxis.toFixed(2)} (
                {genome.psychologicalState.hotCoolAxis <= -0.3
                  ? 'Cool'
                  : genome.psychologicalState.hotCoolAxis >= 0.3
                    ? 'Hot'
                    : 'Balanced'}
                )
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                  Individuation
                </div>
                <div>{Math.round(genome.psychologicalState.individuationLevel * 100)}%</div>
              </div>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                  Shadow Integration
                </div>
                <div>{Math.round(genome.psychologicalState.shadowIntegration * 100)}%</div>
              </div>
            </div>
            {genome.psychologicalState.activeArchetypes.length > 0 && (
              <div style={{ marginTop: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                  Active Archetypes
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {genome.psychologicalState.activeArchetypes.map((arch) => (
                    <span
                      key={arch}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--muted)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {arch}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Invariant Markers */}
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Invariant Markers</h3>
            {genome.invariantMarkers.identityAnchors.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                  Identity Anchors
                </div>
                <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                  {genome.invariantMarkers.identityAnchors.map((a, i) => (
                    <li key={i}>{a}</li>
                  ))}
                </ul>
              </div>
            )}
            {genome.invariantMarkers.absoluteTaboos.length > 0 && (
              <div style={{ marginBottom: '0.75rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                  Absolute Taboos
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {genome.invariantMarkers.absoluteTaboos.map((t) => (
                    <span
                      key={t}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--destructive)',
                        color: 'white',
                        fontSize: '0.75rem',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {genome.invariantMarkers.sacredValues.length > 0 && (
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                  Sacred Values
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {genome.invariantMarkers.sacredValues.map((v) => (
                    <span
                      key={v}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--primary-muted)',
                        fontSize: '0.75rem',
                      }}
                    >
                      {v}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
            </div>
          )}
        </>
      )}

      {activeTab === 'multimodal' && <MultiModalPreview signature={genome.multiModalSignature} />}

      {activeTab === 'narrative' && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem',
          }}
        >
          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Core Values</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {genome.narrativeIdentity.coreValues.map((v) => (
                <span
                  key={v}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--muted)',
                    fontSize: '0.875rem',
                  }}
                >
                  {v}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Central Conflicts</h3>
            <ul style={{ margin: 0, paddingLeft: '1.25rem' }}>
              {genome.narrativeIdentity.centralConflicts.map((c, i) => (
                <li key={i} style={{ marginBottom: '0.5rem' }}>
                  {c}
                </li>
              ))}
            </ul>
          </div>

          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Recurring Themes</h3>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {genome.narrativeIdentity.recurringThemes.map((t) => (
                <span
                  key={t}
                  style={{
                    padding: '0.375rem 0.75rem',
                    borderRadius: '12px',
                    backgroundColor: 'var(--muted)',
                    fontSize: '0.875rem',
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div
            style={{
              padding: '1.5rem',
              backgroundColor: 'var(--card)',
              borderRadius: '12px',
              border: '1px solid var(--border)',
            }}
          >
            <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Telos (Purpose)</h3>
            <p style={{ margin: 0, lineHeight: 1.6 }}>{genome.narrativeIdentity.telos}</p>
          </div>

          {genome.narrativeIdentity.relationalPatterns.length > 0 && (
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--card)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
                gridColumn: '1 / -1',
              }}
            >
              <h3 style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>Relational Patterns</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {genome.narrativeIdentity.relationalPatterns.map((rp, i) => (
                  <div
                    key={i}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: 'var(--muted)',
                      borderRadius: '8px',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{rp.archetype}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>{rp.nature}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'prompt' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>
              Generate an AI system prompt from this imprint configuration.
            </p>
            <button
              type="button"
              onClick={handleGeneratePrompt}
              disabled={promptLoading}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: 'var(--primary)',
                color: 'white',
                cursor: promptLoading ? 'not-allowed' : 'pointer',
                fontSize: '0.875rem',
              }}
            >
              {promptLoading ? 'Generating...' : 'Generate Prompt'}
            </button>
          </div>

          {systemPrompt && (
            <div
              style={{
                padding: '1.5rem',
                backgroundColor: 'var(--card)',
                borderRadius: '12px',
                border: '1px solid var(--border)',
              }}
            >
              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                  Character Name
                </div>
                <div style={{ fontWeight: 600 }}>{systemPrompt.characterName}</div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                  Trait Summary
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {systemPrompt.traitSummary.map((t) => (
                    <span
                      key={t}
                      style={{
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        backgroundColor: 'var(--muted)',
                        fontSize: '0.8rem',
                      }}
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ marginBottom: '1rem' }}>
                <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
                  System Prompt
                </div>
                <pre
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--muted)',
                    borderRadius: '8px',
                    fontSize: '0.85rem',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    maxHeight: '400px',
                    overflow: 'auto',
                    margin: 0,
                  }}
                >
                  {systemPrompt.prompt}
                </pre>
              </div>

              <button
                type="button"
                onClick={() => navigator.clipboard.writeText(systemPrompt.prompt)}
                style={{
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--border)',
                  backgroundColor: 'transparent',
                  color: 'var(--foreground)',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Copy to Clipboard
              </button>
            </div>
          )}

          {!systemPrompt && !promptLoading && (
            <div
              style={{
                padding: '3rem',
                textAlign: 'center',
                color: 'var(--muted-foreground)',
                backgroundColor: 'var(--muted)',
                borderRadius: '12px',
              }}
            >
              Click &quot;Generate Prompt&quot; to create an AI system prompt from this imprint.
            </div>
          )}
        </div>
      )}

      {activeTab === 'content' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>
            Generate authentic content using {genome.name}&apos;s genome signature.
            The Orisha essence, Sephira themes, and aesthetic class will shape the voice and style.
          </p>

          <ContentSuggester
            characterName={genome.name}
            orisha={genome.orishaConfiguration.headOrisha as any}
            sephira={genome.kabbalisticPosition.primarySephira as any}
            onSelectTopic={(topic) => setSuggestedIntent(`Share insights about ${topic}`)}
          />

          <ContentGenerator
            characterId={id}
            characterName={genome.name}
            orisha={genome.orishaConfiguration.headOrisha as any}
            sephira={genome.kabbalisticPosition.primarySephira as any}
            lClass={(genome.multiModalSignature as any)?.aestheticClass}
            suggestedIntent={suggestedIntent}
          />
        </div>
      )}

      {activeTab === 'timeline' && (
        <div>
          <p style={{ margin: '0 0 1.5rem', color: 'var(--muted-foreground)' }}>
            {genome.name}&apos;s journey through time. {getCharacterAge(genome.createdAt)}.
          </p>
          <CharacterTimeline
            characterName={genome.name}
            events={generateMockTimeline({
              id: genome.id,
              name: genome.name,
              createdAt: genome.createdAt,
              currentArc: genome.narrativeIdentity?.telos,
            })}
            onEventClick={(event) => {
              console.log('Timeline event clicked:', event);
            }}
          />
        </div>
      )}

      {activeTab === 'voice' && (
        <div>
          <p style={{ margin: '0 0 1.5rem', color: 'var(--muted-foreground)' }}>
            Synthesize text into {genome.name}&apos;s voice using advanced prosody and emotion controls.
          </p>
          <VoiceGenerator
            characterId={id}
            characterName={genome.name}
          />
        </div>
      )}

      {activeTab === 'avatar' && (
        <div>
          <p style={{ margin: '0 0 1.5rem', color: 'var(--muted-foreground)' }}>
            Generate a consent-tracked avatar for {genome.name}. Every avatar includes an immutable consent record.
          </p>
          <AvatarGenerator
            characterId={id}
            characterName={genome.name}
          />
        </div>
      )}

      {activeTab === 'relationships' && (
        <div>
          <p style={{ margin: '0 0 1.5rem', color: 'var(--muted-foreground)' }}>
            Define and manage {genome.name}&apos;s relationships with other characters.
            Relationships enable multi-character stories and dynamic interactions.
          </p>
          <RelationshipManager
            characterId={id}
            characterName={genome.name}
          />
        </div>
      )}

      {activeTab === 'stories' && (
        <div>
          <p style={{ margin: '0 0 1.5rem', color: 'var(--muted-foreground)' }}>
            Create transmedia stories featuring {genome.name} that adapt across multiple platforms and media types.
            Stories leverage character relationships and maintain narrative consistency.
          </p>
          <TransmediaStoryManager
            characterId={id}
            characterName={genome.name}
          />
        </div>
      )}

      {/* Tags */}
      {genome.tags && genome.tags.length > 0 && (
        <div style={{ marginTop: '2rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.5rem' }}>
            Tags
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
            {genome.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  padding: '0.25rem 0.5rem',
                  borderRadius: '12px',
                  backgroundColor: 'var(--muted)',
                  fontSize: '0.8rem',
                }}
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
