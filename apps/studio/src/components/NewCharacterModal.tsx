'use client';

import { useState } from 'react';
import { createCharacter } from '@/lib/api';

interface NewCharacterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewCharacterModal({ isOpen, onClose, onCreated }: NewCharacterModalProps) {
  const [name, setName] = useState('');
  const [bio, setBio] = useState('');
  const [aliases, setAliases] = useState('');
  const [personaTags, setPersonaTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createCharacter({
        name,
        bio,
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
      onClose();
      setName('');
      setBio('');
      setAliases('');
      setPersonaTags('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create character');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">New Character</h2>
          <button className="modal-close" onClick={onClose}>
            X
          </button>
        </div>

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

          {error && (
            <div style={{ color: 'var(--error)', marginBottom: '1rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          <div className="flex gap-2" style={{ justifyContent: 'flex-end' }}>
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading || !name}>
              {loading ? 'Creating...' : 'Create Character'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
