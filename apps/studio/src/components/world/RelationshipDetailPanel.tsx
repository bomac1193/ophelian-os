'use client';

import { useState } from 'react';
import type { Character, CharacterRelationship, RelationshipType, UpdateRelationshipInput } from '@/lib/api';
import { generateRelationshipLore } from '@/lib/api';

interface RelationshipDetailPanelProps {
  relationship: CharacterRelationship;
  characters: Character[];
  onClose: () => void;
  onUpdate: (id: string, data: UpdateRelationshipInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
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

export function RelationshipDetailPanel({
  relationship,
  characters,
  onClose,
  onUpdate,
  onDelete,
}: RelationshipDetailPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [relationshipType, setRelationshipType] = useState<RelationshipType>(relationship.relationshipType);
  const [customTypeName, setCustomTypeName] = useState(relationship.customTypeName || '');
  const [sourceRole, setSourceRole] = useState(relationship.sourceRole || '');
  const [targetRole, setTargetRole] = useState(relationship.targetRole || '');
  const [lore, setLore] = useState(relationship.lore);

  const sourceCharacter = characters.find((c) => c.id === relationship.sourceCharacterId);
  const targetCharacter = characters.find((c) => c.id === relationship.targetCharacterId);

  const handleSave = async () => {
    setLoading(true);
    setError(null);
    try {
      await onUpdate(relationship.id, {
        relationshipType,
        customTypeName: customTypeName || null,
        sourceRole: sourceRole || null,
        targetRole: targetRole || null,
        lore,
      });
      setIsEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update relationship');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this relationship?')) return;
    setLoading(true);
    setError(null);
    try {
      await onDelete(relationship.id);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete relationship');
      setLoading(false);
    }
  };

  const handleGenerateLore = async (randomizeType: boolean) => {
    setGenerating(true);
    setError(null);

    try {
      const result = await generateRelationshipLore({
        sourceCharacterId: relationship.sourceCharacterId,
        targetCharacterId: relationship.targetCharacterId,
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

  const getDisplayType = () => {
    if (relationship.customTypeName) return relationship.customTypeName;
    return relationship.relationshipType.toLowerCase().replace('_', ' ');
  };

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <h2 className="detail-panel-title">Relationship</h2>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="relationship-preview">
        <div className="relationship-character">
          <span className="relationship-character-name">{sourceCharacter?.name || 'Unknown'}</span>
          {!isEditing && relationship.sourceRole && (
            <span className="relationship-role">({relationship.sourceRole})</span>
          )}
        </div>
        <div className="relationship-arrow">
          <span className="relationship-type-badge">{getDisplayType()}</span>
        </div>
        <div className="relationship-character">
          <span className="relationship-character-name">{targetCharacter?.name || 'Unknown'}</span>
          {!isEditing && relationship.targetRole && (
            <span className="relationship-role">({relationship.targetRole})</span>
          )}
        </div>
      </div>

      {isEditing ? (
        <div className="edit-form">
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
                placeholder="e.g., Brother in Arms"
              />
            </div>
          )}

          <div className="form-group">
            <label className="label">{sourceCharacter?.name}'s Role</label>
            <input
              type="text"
              className="input"
              value={sourceRole}
              onChange={(e) => setSourceRole(e.target.value)}
              placeholder="e.g., Protector, Teacher"
            />
          </div>

          <div className="form-group">
            <label className="label">{targetCharacter?.name}'s Role</label>
            <input
              type="text"
              className="input"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
              placeholder="e.g., Student, Ward"
            />
          </div>

          <div className="form-group">
            <label className="label">Lore / History</label>
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

          <div className="detail-actions">
            <button className="btn btn-secondary" onClick={() => setIsEditing(false)} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </div>
        </div>
      ) : (
        <>
          {relationship.lore && (
            <div className="detail-section">
              <label className="label">Lore / History</label>
              <p className="detail-text">{relationship.lore}</p>
            </div>
          )}

          <div className="detail-actions">
            <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              {loading ? 'Deleting...' : 'Delete'}
            </button>
          </div>
        </>
      )}
    </div>
  );
}
