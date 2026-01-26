'use client';

import { useState } from 'react';
import type { CreateSceneInput } from '@/lib/api';

interface NewSceneModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateSceneInput) => Promise<void>;
}

export function NewSceneModal({ isOpen, onClose, onCreate }: NewSceneModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<'location' | 'event'>('location');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await onCreate({
        name: name.trim(),
        type,
        description: description.trim() || undefined,
      });
      // Reset form
      setName('');
      setType('location');
      setDescription('');
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create scene');
    } finally {
      setLoading(false);
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div className="modal-overlay" onClick={handleOverlayClick}>
      <div className="modal modal-sm">
        <div className="modal-header">
          <h2 className="modal-title">Create Scene</h2>
          <button className="modal-close" onClick={onClose}>
            &times;
          </button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="label">Name</label>
            <input
              type="text"
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., The Dark Forest, The Coronation"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Type</label>
            <select
              className="select"
              value={type}
              onChange={(e) => setType(e.target.value as 'location' | 'event')}
            >
              <option value="location">Location</option>
              <option value="event">Event</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Description (optional)</label>
            <textarea
              className="input textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this scene..."
              rows={3}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Scene'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
