'use client';

import { useState, useCallback, useEffect } from 'react';
import { OrishaSelector } from './OrishaSelector';
import { SephiraSelector } from './SephiraSelector';
import { HotCoolSlider } from './HotCoolSlider';
import { MultiModalPreview } from './MultiModalPreview';
import { LiveImprintPreview } from '../genome';
import {
  generateGenome,
  createGenome,
  type CharacterGenome,
  type GenomeGenerationOptions,
} from '../../lib/imprint-api';

// Orisha to Sephira mapping (Kenneth Grant correspondences)
const ORISHA_SEPHIRA_MAP: Record<string, string> = {
  Èṣù: 'Daath',
  Ògún: 'Geburah',
  Ọ̀ṣun: 'Netzach',
  Yemọja: 'Binah',
  Ṣàngó: 'Tiphareth',
  Ọya: 'Geburah',
  Obàtálá: 'Kether',
  Ọ̀rúnmìlà: 'Chokmah',
  Ọ̀ṣọ́ọ̀sì: 'Netzach',
  Ọ̀sanyìn: 'Hod',
};

type Step = 'identity' | 'orisha' | 'sephira' | 'psychology' | 'multimodal' | 'narrative' | 'evolution' | 'review';

const STEPS: { id: Step; label: string }[] = [
  { id: 'identity', label: 'Identity' },
  { id: 'orisha', label: 'Orisha' },
  { id: 'sephira', label: 'Sephira' },
  { id: 'psychology', label: 'Psychology' },
  { id: 'multimodal', label: 'Multi-Modal' },
  { id: 'narrative', label: 'Narrative' },
  { id: 'evolution', label: 'Evolution' },
  { id: 'review', label: 'Review' },
];

const TRAJECTORIES = [
  { value: 'emergence', label: 'Emergence', description: 'Beginning of individuation' },
  { value: 'ascent', label: 'Ascent', description: 'Rising toward integration' },
  { value: 'crisis', label: 'Crisis', description: 'Confronting shadow' },
  { value: 'descent', label: 'Descent', description: 'Journey into depths' },
  { value: 'integration', label: 'Integration', description: 'Unifying opposites' },
  { value: 'transcendence', label: 'Transcendence', description: 'Beyond duality' },
];

interface GenomeCreatorProps {
  initialName?: string;
  initialSeed?: number;
  onSave?: (genome: CharacterGenome) => void;
  onCancel?: () => void;
}

export function GenomeCreator({ initialName, initialSeed, onSave, onCancel }: GenomeCreatorProps) {
  const [currentStep, setCurrentStep] = useState<Step>('identity');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [name, setName] = useState(initialName || '');
  const [seed, setSeed] = useState<number | undefined>(initialSeed);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState('');

  // Orisha configuration
  const [headOrisha, setHeadOrisha] = useState<string | null>(null);
  const [camino, setCamino] = useState<string | undefined>();
  const [secondaryInfluences, setSecondaryInfluences] = useState<{ orisha: string; strength: number }[]>([]);

  // Kabbalistic position
  const [primarySephira, setPrimarySephira] = useState<string | null>(null);
  const [daathRelationship, setDaathRelationship] = useState<'seeking' | 'touched' | 'integrated' | 'avoiding'>('seeking');

  // Psychological state
  const [hotCoolAxis, setHotCoolAxis] = useState(0);
  const [trajectory, setTrajectory] = useState('emergence');
  const [individuationLevel, setIndividuationLevel] = useState(0.5);
  const [shadowIntegration, setShadowIntegration] = useState(0.3);

  // Generated genome preview
  const [previewGenome, setPreviewGenome] = useState<CharacterGenome | null>(null);

  // Get suggested Sephira based on selected Orisha
  const suggestedSephira = headOrisha ? ORISHA_SEPHIRA_MAP[headOrisha] : null;

  // Generate preview when Orisha or Sephira changes
  useEffect(() => {
    if (headOrisha && primarySephira) {
      handleGeneratePreview();
    }
  }, [headOrisha, primarySephira]);

  // Generate preview when entering multimodal step
  useEffect(() => {
    if (headOrisha && primarySephira && currentStep === 'multimodal') {
      handleGeneratePreview();
    }
  }, [currentStep]);

  const handleGeneratePreview = useCallback(async () => {
    if (!headOrisha) return;

    setIsGenerating(true);
    setError(null);

    try {
      const options: GenomeGenerationOptions = {
        name: name || undefined,
        seed,
        forceOrisha: headOrisha,
        forceSephira: primarySephira || undefined,
        hotCoolBias: hotCoolAxis,
        preferredTrajectory: trajectory,
        tags: tags.length > 0 ? tags : undefined,
      };

      const genome = await generateGenome(options);
      setPreviewGenome(genome);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate preview');
    } finally {
      setIsGenerating(false);
    }
  }, [headOrisha, primarySephira, hotCoolAxis, trajectory, name, seed, tags]);

  const handleSave = useCallback(async () => {
    if (!previewGenome) {
      setError('Please generate a genome preview first');
      return;
    }

    setIsSaving(true);
    setError(null);

    try {
      const saved = await createGenome({
        name: name || previewGenome.name,
        seed: previewGenome.seed,
        forceOrisha: headOrisha || undefined,
        forceSephira: primarySephira || undefined,
        hotCoolBias: hotCoolAxis,
        preferredTrajectory: trajectory,
        tags,
      });

      onSave?.(saved);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save genome');
    } finally {
      setIsSaving(false);
    }
  }, [previewGenome, name, headOrisha, primarySephira, hotCoolAxis, trajectory, tags, onSave]);

  const handleAddTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      setTags([...tags, tag]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const currentStepIndex = STEPS.findIndex((s) => s.id === currentStep);

  const canProceed = () => {
    switch (currentStep) {
      case 'identity':
        return true; // Name is optional
      case 'orisha':
        return !!headOrisha;
      case 'sephira':
        return !!primarySephira;
      case 'psychology':
        return true;
      case 'multimodal':
        return !!previewGenome;
      case 'narrative':
        return true;
      case 'evolution':
        return true;
      case 'review':
        return !!previewGenome;
      default:
        return true;
    }
  };

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].id);
    }
  };

  const goPrev = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].id);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'identity':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="label">Character Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter character name (or leave blank for generated name)"
                className="input"
              />
            </div>

            <div className="form-group">
              <label className="label">Generation Seed (optional)</label>
              <input
                type="number"
                value={seed || ''}
                onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                placeholder="Enter a seed for reproducible generation"
                className="input"
              />
              <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', margin: '0.5rem 0 0' }}>
                Using the same seed will generate the same character each time.
              </p>
            </div>

            <div className="form-group">
              <label className="label">Tags</label>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="Add tag..."
                  className="input"
                  style={{ flex: 1 }}
                />
                <button type="button" onClick={handleAddTag} className="button secondary">
                  Add
                </button>
              </div>
              <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
                {tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '12px',
                      backgroundColor: 'var(--muted)',
                      fontSize: '0.8rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem',
                    }}
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      style={{
                        border: 'none',
                        background: 'none',
                        cursor: 'pointer',
                        padding: 0,
                        color: 'var(--muted-foreground)',
                      }}
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>
          </div>
        );

      case 'orisha':
        return (
          <OrishaSelector
            selectedOrisha={headOrisha}
            selectedCamino={camino}
            secondaryInfluences={secondaryInfluences}
            onOrishaChange={setHeadOrisha}
            onCaminoChange={setCamino}
            onSecondaryChange={setSecondaryInfluences}
          />
        );

      case 'sephira':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <SephiraSelector
              selectedSephira={primarySephira}
              daathRelationship={daathRelationship}
              suggestedSephira={suggestedSephira}
              onSephiraChange={setPrimarySephira}
              onDaathRelationshipChange={setDaathRelationship}
            />

            {headOrisha && (
              <LiveImprintPreview
                genome={previewGenome}
                isGenerating={isGenerating}
              />
            )}
          </div>
        );

      case 'psychology':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {headOrisha && primarySephira && (
              <LiveImprintPreview
                genome={previewGenome}
                isGenerating={isGenerating}
              />
            )}

            <HotCoolSlider value={hotCoolAxis} onChange={setHotCoolAxis} />

            <div className="form-group">
              <label className="label">Psychological Trajectory</label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {TRAJECTORIES.map((t) => (
                  <button
                    key={t.value}
                    type="button"
                    onClick={() => setTrajectory(t.value)}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '8px',
                      border: `2px solid ${trajectory === t.value ? 'var(--primary)' : 'var(--border)'}`,
                      backgroundColor: trajectory === t.value ? 'var(--primary)' : 'transparent',
                      color: trajectory === t.value ? 'white' : 'var(--foreground)',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{t.label}</div>
                    <div style={{ fontSize: '0.75rem', opacity: 0.8 }}>{t.description}</div>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="label">Individuation Level</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={individuationLevel}
                onChange={(e) => setIndividuationLevel(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                <span>Collective</span>
                <span>{Math.round(individuationLevel * 100)}%</span>
                <span>Individuated</span>
              </div>
            </div>

            <div className="form-group">
              <label className="label">Shadow Integration</label>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={shadowIntegration}
                onChange={(e) => setShadowIntegration(parseFloat(e.target.value))}
                style={{ width: '100%' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                <span>Repressed</span>
                <span>{Math.round(shadowIntegration * 100)}%</span>
                <span>Integrated</span>
              </div>
            </div>
          </div>
        );

      case 'multimodal':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '0.5rem',
              }}
            >
              <label className="label" style={{ margin: 0 }}>
                Multi-Modal Signature Preview
              </label>
              <button
                type="button"
                onClick={handleGeneratePreview}
                disabled={isGenerating || !headOrisha}
                className="button secondary"
              >
                {isGenerating ? 'Generating...' : 'Regenerate'}
              </button>
            </div>

            <MultiModalPreview signature={previewGenome?.multiModalSignature} />
          </div>
        );

      case 'narrative':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
              The narrative identity is automatically derived from the Orisha and psychological configuration.
              Review the generated elements below.
            </p>

            {previewGenome?.narrativeIdentity ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Core Values</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {previewGenome.narrativeIdentity.coreValues.map((v) => (
                      <span
                        key={v}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--muted)',
                          fontSize: '0.8rem',
                        }}
                      >
                        {v}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Central Conflicts</h4>
                  <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem' }}>
                    {previewGenome.narrativeIdentity.centralConflicts.map((c) => (
                      <li key={c}>{c}</li>
                    ))}
                  </ul>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Recurring Themes</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {previewGenome.narrativeIdentity.recurringThemes.map((t) => (
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

                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Telos (Purpose)</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem' }}>{previewGenome.narrativeIdentity.telos}</p>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                  backgroundColor: 'var(--muted)',
                  borderRadius: '12px',
                }}
              >
                Generate a preview to see narrative elements.
              </div>
            )}
          </div>
        );

      case 'evolution':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <p style={{ color: 'var(--muted-foreground)', fontSize: '0.9rem' }}>
              Evolution rules define how the character can change over time while preserving their core identity.
            </p>

            {previewGenome?.evolutionRules ? (
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Change Velocity</h4>
                  <p style={{ margin: 0, fontSize: '0.85rem', textTransform: 'capitalize' }}>
                    {previewGenome.evolutionRules.changeVelocity}
                  </p>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Protected Core</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                    {previewGenome.evolutionRules.protectedCore.map((c) => (
                      <span
                        key={c}
                        style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          backgroundColor: 'var(--destructive)',
                          color: 'white',
                          fontSize: '0.75rem',
                        }}
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                <div
                  style={{
                    padding: '1rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                    gridColumn: '1 / -1',
                  }}
                >
                  <h4 style={{ margin: '0 0 0.5rem', fontSize: '0.9rem' }}>Permitted Changes</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {previewGenome.evolutionRules.permittedChanges.map((change, i) => (
                      <div
                        key={i}
                        style={{
                          padding: '0.5rem',
                          backgroundColor: 'var(--muted)',
                          borderRadius: '6px',
                          fontSize: '0.85rem',
                        }}
                      >
                        <strong>{change.aspect}</strong>
                        <span style={{ color: 'var(--muted-foreground)' }}>
                          {' '}
                          — max drift: {Math.round(change.maxDrift * 100)}%
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                  backgroundColor: 'var(--muted)',
                  borderRadius: '12px',
                }}
              >
                Generate a preview to see evolution rules.
              </div>
            )}
          </div>
        );

      case 'review':
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {previewGenome ? (
              <>
                <div
                  style={{
                    padding: '1.5rem',
                    backgroundColor: 'var(--card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border)',
                  }}
                >
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1.25rem' }}>
                    {previewGenome.name}
                  </h3>

                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                      gap: '1rem',
                    }}
                  >
                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                        Head Orisha
                      </div>
                      <div style={{ fontWeight: 500 }}>
                        {previewGenome.orishaConfiguration.headOrisha}
                        {previewGenome.orishaConfiguration.camino && (
                          <span style={{ fontWeight: 400, color: 'var(--muted-foreground)' }}>
                            {' '}
                            ({previewGenome.orishaConfiguration.camino})
                          </span>
                        )}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                        Primary Sephira
                      </div>
                      <div style={{ fontWeight: 500 }}>
                        {previewGenome.kabbalisticPosition.primarySephira}
                        <span style={{ fontWeight: 400, color: 'var(--muted-foreground)' }}>
                          {' '}
                          (Pillar of {previewGenome.kabbalisticPosition.pillar})
                        </span>
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                        Trajectory
                      </div>
                      <div style={{ fontWeight: 500, textTransform: 'capitalize' }}>
                        {previewGenome.psychologicalState.trajectory}
                      </div>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
                        Temperature
                      </div>
                      <div style={{ fontWeight: 500 }}>
                        {previewGenome.psychologicalState.hotCoolAxis <= -0.3
                          ? 'Cool'
                          : previewGenome.psychologicalState.hotCoolAxis >= 0.3
                            ? 'Hot'
                            : 'Balanced'}
                      </div>
                    </div>
                  </div>
                </div>

                <MultiModalPreview signature={previewGenome.multiModalSignature} compact />

                {previewGenome.seed && (
                  <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', textAlign: 'center' }}>
                    Seed: {previewGenome.seed}
                  </p>
                )}
              </>
            ) : (
              <div
                style={{
                  padding: '2rem',
                  textAlign: 'center',
                  color: 'var(--muted-foreground)',
                  backgroundColor: 'var(--muted)',
                  borderRadius: '12px',
                }}
              >
                No genome generated. Go back to previous steps and complete the configuration.
              </div>
            )}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Step indicators */}
      <div
        style={{
          display: 'flex',
          gap: '0.25rem',
          overflowX: 'auto',
          paddingBottom: '0.5rem',
        }}
      >
        {STEPS.map((step, index) => {
          const isActive = step.id === currentStep;
          const isCompleted = index < currentStepIndex;

          return (
            <button
              key={step.id}
              type="button"
              onClick={() => setCurrentStep(step.id)}
              style={{
                flex: '1 1 auto',
                minWidth: '80px',
                padding: '0.5rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: isActive
                  ? 'var(--primary)'
                  : isCompleted
                    ? 'var(--primary-muted)'
                    : 'var(--muted)',
                color: isActive ? 'white' : 'var(--foreground)',
                cursor: 'pointer',
                fontSize: '0.75rem',
                fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s ease',
              }}
            >
              {step.label}
            </button>
          );
        })}
      </div>

      {/* Error display */}
      {error && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--destructive)',
            color: 'white',
            borderRadius: '8px',
            fontSize: '0.875rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Step content */}
      <div style={{ minHeight: '400px' }}>{renderStepContent()}</div>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          paddingTop: '1rem',
          borderTop: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {onCancel && (
            <button type="button" onClick={onCancel} className="button secondary">
              Cancel
            </button>
          )}
          {currentStepIndex > 0 && (
            <button type="button" onClick={goPrev} className="button secondary">
              Previous
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {currentStep === 'review' ? (
            <button
              type="button"
              onClick={handleSave}
              disabled={isSaving || !previewGenome}
              className="button primary"
            >
              {isSaving ? 'Saving...' : 'Save Genome'}
            </button>
          ) : (
            <button
              type="button"
              onClick={goNext}
              disabled={!canProceed()}
              className="button primary"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
