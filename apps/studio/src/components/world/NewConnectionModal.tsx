'use client';

import { useState, useMemo } from 'react';
import type { EntityType, CreateConnectionInput } from '@/lib/api';

interface Entity {
  type: EntityType;
  id: string;
  name: string;
}

interface NewConnectionModalProps {
  isOpen: boolean;
  source: Entity;
  target: Entity;
  onClose: () => void;
  onCreate: (data: CreateConnectionInput) => Promise<void>;
}

// Connection types based on entity type combinations
const CONNECTION_TYPES: Record<string, string[]> = {
  'CHARACTER-CHARACTER': ['ally', 'enemy', 'mentor', 'family', 'rival', 'friend', 'lover'],
  'CHARACTER-SCENE': ['appears_in', 'owns', 'haunts', 'born_at', 'died_at'],
  'SCENE-CHARACTER': ['appears_in', 'owns', 'haunts', 'born_at', 'died_at'],
  'SCENE-WORLD': ['located_in', 'gateway_to', 'hidden_within'],
  'WORLD-SCENE': ['located_in', 'gateway_to', 'hidden_within'],
  'CHARACTER-WORLD': ['rules', 'exiled_from', 'created', 'protects'],
  'WORLD-CHARACTER': ['rules', 'exiled_from', 'created', 'protects'],
  'SCENE-SCENE': ['connected_to', 'part_of', 'leads_to'],
  'WORLD-WORLD': ['connected_to', 'part_of', 'contains'],
};

export function NewConnectionModal({ isOpen, source, target, onClose, onCreate }: NewConnectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionType, setConnectionType] = useState('');
  const [lore, setLore] = useState('');

  const availableTypes = useMemo(() => {
    const key = `${source.type}-${target.type}`;
    return CONNECTION_TYPES[key] || ['connected_to'];
  }, [source.type, target.type]);

  // Set default connection type when types change
  useMemo(() => {
    if (availableTypes.length > 0 && !availableTypes.includes(connectionType)) {
      setConnectionType(availableTypes[0]);
    }
  }, [availableTypes, connectionType]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!connectionType) {
      setError('Connection type is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreate({
        sourceType: source.type,
        sourceId: source.id,
        targetType: target.type,
        targetId: target.id,
        connectionType,
        lore: lore.trim() || undefined,
      });
      // Reset form
      setConnectionType(availableTypes[0] || '');
      setLore('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create connection');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const getEntityTypeLabel = (type: EntityType) => {
    return type.charAt(0) + type.slice(1).toLowerCase();
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal">
        <div className="modal-header">
          <h2 className="modal-title">Create Connection</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="connection-preview">
          <div className="connection-entity">
            <span className="connection-entity-type">{getEntityTypeLabel(source.type)}</span>
            <span className="connection-entity-name">{source.name}</span>
          </div>
          <div className="connection-arrow">
            <span className="connection-arrow-icon">&harr;</span>
          </div>
          <div className="connection-entity">
            <span className="connection-entity-type">{getEntityTypeLabel(target.type)}</span>
            <span className="connection-entity-name">{target.name}</span>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Connection Type</label>
            <select
              className="select"
              value={connectionType}
              onChange={(e) => setConnectionType(e.target.value)}
              required
            >
              {availableTypes.map((type) => (
                <option key={type} value={type}>
                  {type.replace(/_/g, ' ')}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="label">Lore / Notes (optional)</label>
            <textarea
              className="input textarea"
              value={lore}
              onChange={(e) => setLore(e.target.value)}
              placeholder="Describe this connection..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
