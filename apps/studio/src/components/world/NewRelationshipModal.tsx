'use client';

import { useState } from 'react';
import type { Character, RelationshipType, CreateRelationshipInput } from '@/lib/api';
import { generateRelationshipLore } from '@/lib/api';

interface NewRelationshipModalProps {
  isOpen: boolean;
  sourceCharacter: Character;
  targetCharacter: Character;
  onClose: () => void;
  onCreate: (data: CreateRelationshipInput) => Promise<void>;
}

const RELATIONSHIP_TYPES: RelationshipType[] = [
  'ALLY',
  'ENEMY',
  'MENTOR',
  'FAMILY',
  'RIVAL',
  'FRIEND',
  'LOVER',
  'CUSTOM',
];

export function NewRelationshipModal({
  isOpen,
  sourceCharacter,
  targetCharacter,
  onClose,
  onCreate,
}: NewRelationshipModalProps) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [relationshipType, setRelationshipType] = useState<RelationshipType>('ALLY');
  const [customTypeName, setCustomTypeName] = useState('');
  const [sourceRole, setSourceRole] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [lore, setLore] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await onCreate({
        sourceCharacterId: sourceCharacter.id,
        targetCharacterId: targetCharacter.id,
        relationshipType,
        customTypeName: relationshipType === 'CUSTOM' ? customTypeName : null,
        sourceRole: sourceRole || null,
        targetRole: targetRole || null,
        lore,
      });
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create relationship');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateLore = async (randomizeType: boolean) => {
    setGenerating(true);
    setError(null);

    try {
      const result = await generateRelationshipLore({
        sourceCharacterId: sourceCharacter.id,
        targetCharacterId: targetCharacter.id,
        relationshipType: randomizeType ? undefined : relationshipType,
        randomizeType,
      });

      if (randomizeType) {
        setRelationshipType(result.relationshipType);
      }
      setLore(result.lore);
      if (result.sourceRole) setSourceRole(result.sourceRole);
      if (result.targetRole) setTargetRole(result.targetRole);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate lore');
    } finally {
      setGenerating(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Create Relationship</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="relationship-preview">
          <div className="relationship-character">
            <span className="relationship-character-name">{sourceCharacter.name}</span>
          </div>
          <div className="relationship-arrow">
            <span className="relationship-arrow-icon">&rarr;</span>
          </div>
          <div className="relationship-character">
            <span className="relationship-character-name">{targetCharacter.name}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Relationship Type</label>
            <select
              className="select"
              value={relationshipType}
              onChange={(e) => setRelationshipType(e.target.value as RelationshipType)}
            >
              {RELATIONSHIP_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type.toLowerCase().replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {relationshipType === 'CUSTOM' && (
            <div className="form-group">
              <label className="label">Custom Type Name</label>
              <input
                type="text"
                className="input"
                value={customTypeName}
                onChange={(e) => setCustomTypeName(e.target.value)}
                placeholder="e.g., Brother in Arms, Sworn Enemy"
                required={relationshipType === 'CUSTOM'}
              />
            </div>
          )}

          <div className="form-group">
            <label className="label">{sourceCharacter.name}'s Role (optional)</label>
            <input
              type="text"
              className="input"
              value={sourceRole}
              onChange={(e) => setSourceRole(e.target.value)}
              placeholder="e.g., Protector, Teacher, Leader"
            />
          </div>

          <div className="form-group">
            <label className="label">{targetCharacter.name}'s Role (optional)</label>
            <input
              type="text"
              className="input"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Student, Ward, Follower"
            />
          </div>

          <div className="form-group">
            <label className="label">Lore / History (optional)</label>
            <textarea
              className="input textarea"
              value={lore}
              onChange={(e) => setLore(e.target.value)}
              placeholder="Describe the history and nature of this relationship..."
              rows={4}
            />
            <div className="generate-buttons">
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleGenerateLore(false)}
                disabled={generating}
              >
                {generating ? 'Generating...' : 'Generate Lore'}
              </button>
              <button
                type="button"
                className="btn btn-secondary btn-sm"
                onClick={() => handleGenerateLore(true)}
                disabled={generating}
              >
                {generating ? 'Generating...' : 'Randomize All'}
              </button>
            </div>
            <p className="generate-hint">
              "Generate Lore" creates history based on selected type. "Randomize All" picks a random type and generates matching lore.
            </p>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Relationship'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
