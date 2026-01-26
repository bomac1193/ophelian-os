'use client';

import { useState } from 'react';
import type { Character, CharacterRelationship } from '@/lib/api';

interface RelationshipDetailPanelProps {
  relationship: CharacterRelationship;
  sourceCharacter: Character;
  targetCharacter: Character;
  onClose: () => void;
  onDelete: (id: string) => Promise<void>;
}

export function RelationshipDetailPanel({
  relationship,
  sourceCharacter,
  targetCharacter,
  onClose,
  onDelete,
}: RelationshipDetailPanelProps) {
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this relationship?')) return;
    setLoading(true);
    try {
      await onDelete(relationship.id);
    } finally {
      setLoading(false);
    }
  };

  const getDisplayType = () => {
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

      <div className="relationship-preview">
        <div className="relationship-character">
          <span className="relationship-character-name">{sourceCharacter.name}</span>
        </div>
        <div className="relationship-arrow">
          <span className="relationship-type-badge">{getDisplayType()}</span>
        </div>
        <div className="relationship-character">
          <span className="relationship-character-name">{targetCharacter.name}</span>
        </div>
      </div>

      {relationship.lore && (
        <div className="detail-section">
          <label className="label">Lore</label>
          <p className="detail-text">{relationship.lore}</p>
        </div>
      )}

      <div className="detail-actions">
        <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
          {loading ? 'Deleting...' : 'Delete Relationship'}
        </button>
      </div>
    </div>
  );
}
