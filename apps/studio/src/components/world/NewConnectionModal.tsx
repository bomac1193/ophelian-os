'use client';

import { useState, useMemo, useEffect } from 'react';

interface NewConnectionModalProps {
  isOpen: boolean;
  sourceType?: string;
  targetType?: string;
  onClose: () => void;
  onCreate: (connectionType: string, lore: string) => Promise<void>;
}

// Connection types based on entity type combinations
const CONNECTION_TYPES: Record<string, string[]> = {
  'character-character': ['ally', 'enemy', 'mentor', 'family', 'rival', 'friend', 'lover'],
  'character-scene': ['appears_in', 'owns', 'haunts', 'born_at', 'died_at'],
  'scene-character': ['appears_in', 'owns', 'haunts', 'born_at', 'died_at'],
  'scene-world': ['located_in', 'gateway_to', 'hidden_within'],
  'world-scene': ['located_in', 'gateway_to', 'hidden_within'],
  'character-world': ['rules', 'exiled_from', 'created', 'protects'],
  'world-character': ['rules', 'exiled_from', 'created', 'protects'],
  'scene-scene': ['connected_to', 'part_of', 'leads_to'],
  'world-world': ['connected_to', 'part_of', 'contains'],
};

export function NewConnectionModal({ isOpen, sourceType, targetType, onClose, onCreate }: NewConnectionModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectionType, setConnectionType] = useState('');
  const [lore, setLore] = useState('');

  const availableTypes = useMemo(() => {
    if (!sourceType || !targetType) return ['connected_to'];
    const key = `${sourceType}-${targetType}`;
    return CONNECTION_TYPES[key] || ['connected_to'];
  }, [sourceType, targetType]);

  // Set default connection type when types change
  useEffect(() => {
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
      await onCreate(connectionType, lore.trim());
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

  const capitalize = (s: string) => s ? s.charAt(0).toUpperCase() + s.slice(1) : '';

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2 className="modal-title">Create Connection</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <div className="connection-preview">
          <span className="connection-entity-type">{capitalize(sourceType || '')}</span>
          <span className="connection-arrow-icon">&harr;</span>
          <span className="connection-entity-type">{capitalize(targetType || '')}</span>
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
