'use client';

import { useRef, useState, useEffect } from 'react';
import { createCharacter } from '@/lib/api';
import {
  ORIPHEON_API_URL,
  ORIPHEON_GENDERS,
  ORIPHEON_ORDERS,
  formatOripheonName,
  generateOripheonAvatar,
  oripheonAvatarToCreateCharacterInput,
  generateLCOSCharacter,
  lcosGeneratedToCreateCharacterInput,
  type OripheonAvatar,
  type OripheonAvatarGenerationParams,
  type OripheonGender,
  type OripheonOrderType,
  type LCOSGeneratedCharacter,
} from '@/lib/oripheon';
import { ImageUpload } from './ImageUpload';

interface NewCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewCharacterModal({ isOpen, onClose, onCreated }: NewCharacterModalProps) {
  const [mode, setMode] = useState<'quick' | 'oripheon' | 'manual'>('quick');
  const oripheonAbortRef = useRef<AbortController | null>(null);
  const lcosAbortRef = useRef<AbortController | null>(null);

  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [aliases, setAliases] = useState('');
  const [personaTags, setPersonaTags] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Quick mode (built-in LCOS generator)
  const [lcosGenerated, setLcosGenerated] = useState<LCOSGeneratedCharacter | null>(null);
  const [lcosGenerating, setLcosGenerating] = useState(false);
  const [lcosHeritage, setLcosHeritage] = useState<string>('');
  const [lcosGender, setLcosGender] = useState<string>('');
  const [lcosSeed, setLcosSeed] = useState<string>('');
  const [lcosAvatarUrl, setLcosAvatarUrl] = useState<string | null>(null);
  const [creatingFromLcos, setCreatingFromLcos] = useState(false);

  // Advanced Oripheon mode (external API)
  const [oripheonSeed, setOripheonSeed] = useState<string>('');
  const [oripheonOrder, setOripheonOrder] = useState<OripheonOrderType | ''>('');
  const [oripheonGender, setOripheonGender] = useState<OripheonGender | ''>('');
  const [oripheonLengthPreference, setOripheonLengthPreference] = useState<'' | 'short' | 'long'>(
    ''
  );
  const [personaDescription, setPersonaDescription] = useState('');
  const [desiredTraits, setDesiredTraits] = useState('');
  const [desiredSkills, setDesiredSkills] = useState('');
  const [preferredNames, setPreferredNames] = useState('');
  const [sigilBloomEnabled, setSigilBloomEnabled] = useState(false);
  const [sigilBloomIntensity, setSigilBloomIntensity] = useState(35);
  const [generatedAvatar, setGeneratedAvatar] = useState<OripheonAvatar | null>(null);
  const [oripheonAvatarUrl, setOripheonAvatarUrl] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);
  const [creatingFromOripheon, setCreatingFromOripheon] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // Auto-generate when modal opens in quick mode
  useEffect(() => {
    if (isOpen && mode === 'quick' && !lcosGenerated && !lcosGenerating) {
      // Delay to avoid setState during render
      const timeoutId = setTimeout(() => {
        handleGenerateLCOS();
      }, 0);
      return () => clearTimeout(timeoutId);
    }
  }, [isOpen, mode, lcosGenerated, lcosGenerating]);

  if (!isOpen) return null;

  const resetState = () => {
    oripheonAbortRef.current?.abort();
    oripheonAbortRef.current = null;
    lcosAbortRef.current?.abort();
    lcosAbortRef.current = null;

    setMode('quick');
    setError(null);
    setLoading(false);
    setGenerating(false);
    setCreatingFromOripheon(false);

    setName('');
    setBio('');
    setAliases('');
    setPersonaTags('');
    setAvatarUrl(null);

    // Quick mode state
    setLcosGenerated(null);
    setLcosGenerating(false);
    setLcosHeritage('');
    setLcosGender('');
    setLcosSeed('');
    setLcosAvatarUrl(null);
    setCreatingFromLcos(false);

    // Advanced Oripheon state
    setOripheonSeed('');
    setOripheonOrder('');
    setOripheonGender('');
    setOripheonLengthPreference('');
    setPersonaDescription('');
    setDesiredTraits('');
    setDesiredSkills('');
    setPreferredNames('');
    setSigilBloomEnabled(false);
    setSigilBloomIntensity(35);
    setGeneratedAvatar(null);
    setOripheonAvatarUrl(null);
  };

  const handleClose = () => {
    resetState();
    onClose();
  };

  // LCOS Quick Generate handler
  const handleGenerateLCOS = async () => {
    lcosAbortRef.current?.abort();
    const controller = new AbortController();
    lcosAbortRef.current = controller;

    setLcosGenerating(true);
    setError(null);

    try {
      const seedNumber = Number(lcosSeed);
      const generated = await generateLCOSCharacter(
        {
          seed: Number.isFinite(seedNumber) && seedNumber > 0 ? seedNumber : undefined,
          heritage: lcosHeritage || undefined,
          gender: lcosGender || undefined,
        },
        { signal: controller.signal }
      );
      setLcosGenerated(generated);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      setError(err instanceof Error ? err.message : 'Failed to generate character');
    } finally {
      if (lcosAbortRef.current === controller) {
        lcosAbortRef.current = null;
      }
      setLcosGenerating(false);
    }
  };

  const handleCreateFromLCOS = async () => {
    if (!lcosGenerated) return;
    setCreatingFromLcos(true);
    setError(null);

    try {
      const characterData = lcosGeneratedToCreateCharacterInput(lcosGenerated);
      // Add avatar URL if uploaded
      if (lcosAvatarUrl) {
        (characterData as any).avatarUrl = lcosAvatarUrl;
      }
      await createCharacter(characterData);
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setCreatingFromLcos(false);
    }
  };

  const parseCsv = (value: string): string[] =>
    value
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createCharacter({
        name,
        bio,
        avatarUrl: avatarUrl || undefined,
        aliases: aliases
          .split(',')
          .map((a) => a.trim())
          .filter(Boolean),
        personaTags: personaTags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
      });
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateOripheon = async () => {
    oripheonAbortRef.current?.abort();
    const controller = new AbortController();
    oripheonAbortRef.current = controller;

    setGenerating(true);
    setError(null);

    try {
      const seedNumber = Number(oripheonSeed);
      const params: OripheonAvatarGenerationParams = {
        ...(Number.isFinite(seedNumber) && seedNumber > 0 ? { seed: seedNumber } : {}),
        ...(oripheonOrder
          ? {
              being: { order: oripheonOrder },
            }
          : {}),
        ...(oripheonGender || oripheonLengthPreference
          ? {
              identity: {
                ...(oripheonGender ? { gender: oripheonGender } : {}),
                ...(oripheonLengthPreference ? { lengthPreference: oripheonLengthPreference } : {}),
              },
            }
          : {}),
        prompt: {
          ...(personaDescription.trim() ? { personaDescription: personaDescription.trim() } : {}),
          ...(desiredTraits.trim() ? { desiredTraits: parseCsv(desiredTraits) } : {}),
          ...(desiredSkills.trim() ? { desiredSkills: parseCsv(desiredSkills) } : {}),
          ...(preferredNames.trim() ? { preferredNames: parseCsv(preferredNames) } : {}),
          sigilBloom: { enabled: sigilBloomEnabled, intensity: sigilBloomIntensity },
        },
      };

      const avatar = await generateOripheonAvatar(params, { signal: controller.signal });
      setGeneratedAvatar(avatar);
    } catch (err) {
      if (err instanceof Error && err.name === 'AbortError') {
        return;
      }
      const message =
        err instanceof Error
          ? err.message
          : `Failed to generate avatar via Oripheon (${ORIPHEON_API_URL})`;
      setError(
        `${message}. Make sure Oripheon is running (in your \`oripheon/\` folder: \`npm run dev\`).`
      );
    } finally {
      if (oripheonAbortRef.current === controller) {
        oripheonAbortRef.current = null;
      }
      setGenerating(false);
    }
  };

  const handleCreateFromOripheon = async () => {
    if (!generatedAvatar) return;
    setCreatingFromOripheon(true);
    setError(null);

    try {
      const characterData = oripheonAvatarToCreateCharacterInput(generatedAvatar);
      // Add avatar URL if uploaded
      if (oripheonAvatarUrl) {
        (characterData as any).avatarUrl = oripheonAvatarUrl;
      }
      await createCharacter(characterData);
      onCreated();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setCreatingFromOripheon(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 720 }}>
        <div className="modal-header">
          <h2 className="modal-title">New Character</h2>
          <button className="modal-close" onClick={handleClose}>
            X
          </button>
        </div>

        <div className="flex gap-2" style={{ marginBottom: '1rem' }}>
          <button
            type="button"
            className={mode === 'quick' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setMode('quick')}
          >
            Quick Generate
          </button>
          <button
            type="button"
            className={mode === 'oripheon' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setMode('oripheon')}
          >
            Advanced (External)
          </button>
          <button
            type="button"
            className={mode === 'manual' ? 'btn btn-primary' : 'btn btn-secondary'}
            onClick={() => setMode('manual')}
          >
            Manual
          </button>
        </div>

        {mode === 'quick' && (
          <div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
              Instantly generate a unique character using the built-in Oripheon engine.
            </p>

            <div className="grid grid-cols-3 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Heritage</label>
                <select
                  className="input"
                  value={lcosHeritage}
                  onChange={(e) => setLcosHeritage(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="yoruba">Yoruba</option>
                  <option value="igbo">Igbo</option>
                  <option value="arabic">Arabic</option>
                  <option value="celtic">Celtic</option>
                  <option value="norse">Norse</option>
                  <option value="european">European</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Gender</label>
                <select
                  className="input"
                  value={lcosGender}
                  onChange={(e) => setLcosGender(e.target.value)}
                >
                  <option value="">Any</option>
                  <option value="masculine">Masculine</option>
                  <option value="feminine">Feminine</option>
                  <option value="neutral">Neutral</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Seed</label>
                <input
                  type="number"
                  className="input"
                  value={lcosSeed}
                  onChange={(e) => setLcosSeed(e.target.value)}
                  placeholder="Random"
                />
              </div>
            </div>

            {lcosGenerated && (
              <div className="card" style={{ marginTop: '1rem', marginBottom: '1rem' }}>
                <h3 className="card-title">{lcosGenerated.name}</h3>
                <p className="card-description" style={{ whiteSpace: 'pre-wrap' }}>
                  {lcosGenerated.backstory}
                </p>
                <div className="mt-4 flex gap-2" style={{ flexWrap: 'wrap' }}>
                  <span className="badge badge-draft">{lcosGenerated.heritage}</span>
                  <span className="badge badge-draft">{lcosGenerated.order?.name}</span>
                  <span className="badge badge-draft">{lcosGenerated.arcana?.archetype}</span>
                  <span className="badge badge-draft">{lcosGenerated.gender}</span>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-4" style={{ fontSize: '0.875rem' }}>
                  <div>
                    <strong>Appearance:</strong> {lcosGenerated.appearance?.build}, {lcosGenerated.appearance?.distinctiveTrait}
                  </div>
                  <div>
                    <strong>Style:</strong> {lcosGenerated.appearance?.styleAesthetic}
                  </div>
                  <div>
                    <strong>Voice:</strong> {lcosGenerated.personality?.voiceTone}
                  </div>
                  <div>
                    <strong>Core Desire:</strong> {lcosGenerated.personality?.coreDesire}
                  </div>
                </div>
                <p className="mt-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  Seed: {lcosGenerated.seed}
                </p>
              </div>
            )}

            {lcosGenerated && (
              <ImageUpload
                value={lcosAvatarUrl}
                onChange={setLcosAvatarUrl}
                disabled={lcosGenerating || creatingFromLcos}
              />
            )}

            {lcosGenerating && !lcosGenerated && (
              <div className="card" style={{ marginTop: '1rem', marginBottom: '1rem', textAlign: 'center', padding: '2rem' }}>
                <p>Generating character...</p>
              </div>
            )}

            {error && (
              <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <div className="flex gap-2" style={{ justifyContent: 'flex-end', marginTop: '1rem' }}>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGenerateLCOS}
                disabled={lcosGenerating || creatingFromLcos}
              >
                {lcosGenerating ? 'Generating...' : lcosGenerated ? 'Reroll' : 'Generate'}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateFromLCOS}
                disabled={!lcosGenerated || lcosGenerating || creatingFromLcos}
              >
                {creatingFromLcos ? 'Creating...' : 'Create Character'}
              </button>
            </div>
          </div>
        )}

        {mode === 'oripheon' && (
          <div>
            <p className="text-sm" style={{ color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
              Advanced generation using external Oripheon API (requires running Oripheon server at {ORIPHEON_API_URL}).
            </p>
            <div className="form-group">
              <label className="label">Persona Description</label>
              <textarea
                className="input"
                value={personaDescription}
                onChange={(e) => setPersonaDescription(e.target.value)}
                rows={2}
                placeholder="e.g., Solar tactician guarding nomad convoys"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Order</label>
                <select
                  className="input"
                  value={oripheonOrder}
                  onChange={(e) => setOripheonOrder(e.target.value as OripheonOrderType | '')}
                >
                  <option value="">Any</option>
                  {ORIPHEON_ORDERS.map((order) => (
                    <option key={order} value={order}>
                      {order}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Gender</label>
                <select
                  className="input"
                  value={oripheonGender}
                  onChange={(e) => setOripheonGender(e.target.value as OripheonGender | '')}
                >
                  <option value="">Any</option>
                  {ORIPHEON_GENDERS.map((gender) => (
                    <option key={gender} value={gender}>
                      {gender}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Name Length</label>
                <select
                  className="input"
                  value={oripheonLengthPreference}
                  onChange={(e) =>
                    setOripheonLengthPreference(e.target.value as 'short' | 'long' | '')
                  }
                >
                  <option value="">Any</option>
                  <option value="short">Short</option>
                  <option value="long">Long</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: 0 }}>
                <label className="label">Seed (optional)</label>
                <input
                  type="number"
                  className="input"
                  value={oripheonSeed}
                  onChange={(e) => setOripheonSeed(e.target.value)}
                  placeholder="e.g., 42"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="label">Desired Traits (comma-separated)</label>
              <input
                type="text"
                className="input"
                value={desiredTraits}
                onChange={(e) => setDesiredTraits(e.target.value)}
                placeholder="e.g., Stoic, Strategic"
              />
            </div>

            <div className="form-group">
              <label className="label">Desired Skills (comma-separated)</label>
              <input
                type="text"
                className="input"
                value={desiredSkills}
                onChange={(e) => setDesiredSkills(e.target.value)}
                placeholder="e.g., Storm weaving, Battlefield medicine"
              />
            </div>

            <div className="form-group">
              <label className="label">Preferred Names (comma-separated)</label>
              <input
                type="text"
                className="input"
                value={preferredNames}
                onChange={(e) => setPreferredNames(e.target.value)}
                placeholder="e.g., Astra, Kael"
              />
            </div>

            <div className="form-group">
              <div className="flex gap-2" style={{ alignItems: 'center' }}>
                <input
                  id="sigilBloomEnabled"
                  type="checkbox"
                  checked={sigilBloomEnabled}
                  onChange={(e) => setSigilBloomEnabled(e.target.checked)}
                />
                <label className="label" htmlFor="sigilBloomEnabled" style={{ marginBottom: 0 }}>
                  Sigil Bloom
                </label>
                <div style={{ flex: 1 }} />
                <span className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {sigilBloomIntensity}
                </span>
              </div>
              <input
                type="range"
                min={0}
                max={100}
                value={sigilBloomIntensity}
                onChange={(e) => setSigilBloomIntensity(Number(e.target.value))}
                disabled={!sigilBloomEnabled}
                style={{ width: '100%' }}
              />
            </div>

            {generatedAvatar && (
              <div className="card" style={{ marginBottom: '1rem' }}>
                <h3 className="card-title">{formatOripheonName(generatedAvatar.identity.primaryName)}</h3>
                <p className="card-description" style={{ whiteSpace: 'pre-wrap' }}>
                  {generatedAvatar.mythos.shortTitle}
                </p>
                <div className="mt-4 flex gap-2" style={{ flexWrap: 'wrap' }}>
                  <span className="badge badge-draft">{generatedAvatar.being.order}</span>
                  <span className="badge badge-draft">{generatedAvatar.being.office}</span>
                  <span className="badge badge-draft">
                    {generatedAvatar.being.tarotArchetype.replace(/_/g, ' ')}
                  </span>
                  <span className="badge badge-draft">{generatedAvatar.identity.gender}</span>
                </div>
                <p className="mt-4 text-sm" style={{ color: 'var(--muted-foreground)' }}>
                  {generatedAvatar.personality.summary}
                </p>
              </div>
            )}

            <ImageUpload
              value={oripheonAvatarUrl}
              onChange={setOripheonAvatarUrl}
              disabled={generating || creatingFromOripheon}
            />

            {error && (
              <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleGenerateOripheon}
                disabled={generating || creatingFromOripheon}
              >
                {generating ? 'Generating...' : generatedAvatar ? 'Reroll' : 'Generate'}
              </button>
              <button
                type="button"
                className="btn btn-primary"
                onClick={handleCreateFromOripheon}
                disabled={!generatedAvatar || generating || creatingFromOripheon}
              >
                {creatingFromOripheon ? 'Creating...' : 'Create Character'}
              </button>
            </div>
          </div>
        )}

        {mode === 'manual' && (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="label">Name *</label>
              <input
                type="text"
                className="input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Character name"
              />
            </div>

            <div className="form-group">
              <label className="label">Bio</label>
              <textarea
                className="input"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                rows={3}
                placeholder="Character biography and background"
              />
            </div>

            <div className="form-group">
              <label className="label">Aliases (comma-separated)</label>
              <input
                type="text"
                className="input"
                value={aliases}
                onChange={(e) => setAliases(e.target.value)}
                placeholder="e.g., Nova, The Digital Dreamer"
              />
            </div>

            <div className="form-group">
              <label className="label">Persona Tags (comma-separated)</label>
              <input
                type="text"
                className="input"
                value={personaTags}
                onChange={(e) => setPersonaTags(e.target.value)}
                placeholder="e.g., creative, curious, optimistic"
              />
            </div>

            <ImageUpload
              value={avatarUrl}
              onChange={setAvatarUrl}
              disabled={loading}
            />

            {error && (
              <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>
                {error}
              </div>
            )}

            <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
              <button type="button" className="btn btn-secondary" onClick={handleClose}>
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={loading || !name}>
                {loading ? 'Creating...' : 'Create Character'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
