/**
 * Create Universe Modal Component
 * Form for creating new collaborative universes
 */

'use client';

import React, { useState } from 'react';
import type { Universe } from '@lcos/shared';
import styles from './CreateUniverseModal.module.css';

interface CreateUniverseModalProps {
  onClose: () => void;
  onSuccess: (universe: Universe) => void;
}

export function CreateUniverseModal({ onClose, onSuccess }: CreateUniverseModalProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [genre, setGenre] = useState('');
  const [setting, setSetting] = useState('');
  const [rules, setRules] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [allowContributions, setAllowContributions] = useState(true);
  const [requiresApproval, setRequiresApproval] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch('/api/universes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          description,
          genre,
          setting,
          rules: rules.split('\n').filter((r) => r.trim()),
          isPublic,
          allowContributions,
          requiresApproval,
          tags: [],
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to create universe');
      }

      const data = await response.json();
      onSuccess(data.universe);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create universe');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3 className={styles.title}>Create Collaborative Universe</h3>
          <button onClick={onClose} className={styles.closeButton}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.section}>
            <label htmlFor="name" className={styles.label}>
              Universe Name <span className={styles.required}>*</span>
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter universe name"
              className={styles.input}
              required
            />
          </div>

          <div className={styles.section}>
            <label htmlFor="description" className={styles.label}>
              Description <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe your universe..."
              className={styles.textarea}
              rows={3}
              required
            />
          </div>

          <div className={styles.row}>
            <div className={styles.section}>
              <label htmlFor="genre" className={styles.label}>
                Genre <span className={styles.required}>*</span>
              </label>
              <input
                id="genre"
                type="text"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                placeholder="e.g., Fantasy, Sci-Fi"
                className={styles.input}
                required
              />
            </div>

            <div className={styles.section}>
              <label htmlFor="setting" className={styles.label}>
                Setting <span className={styles.required}>*</span>
              </label>
              <input
                id="setting"
                type="text"
                value={setting}
                onChange={(e) => setSetting(e.target.value)}
                placeholder="e.g., Modern Earth"
                className={styles.input}
                required
              />
            </div>
          </div>

          <div className={styles.section}>
            <label htmlFor="rules" className={styles.label}>
              Universe Rules (Optional)
            </label>
            <textarea
              id="rules"
              value={rules}
              onChange={(e) => setRules(e.target.value)}
              placeholder="One rule per line..."
              className={styles.textarea}
              rows={4}
            />
            <p className={styles.hint}>Define world-building rules and guidelines</p>
          </div>

          <div className={styles.section}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={isPublic}
                onChange={(e) => setIsPublic(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Make universe public</span>
            </label>
            <p className={styles.hint}>Public universes can be discovered by other creators</p>
          </div>

          <div className={styles.section}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={allowContributions}
                onChange={(e) => setAllowContributions(e.target.checked)}
                className={styles.checkbox}
              />
              <span>Allow contributions from members</span>
            </label>
          </div>

          <div className={styles.section}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={requiresApproval}
                onChange={(e) => setRequiresApproval(e.target.checked)}
                className={styles.checkbox}
                disabled={!allowContributions}
              />
              <span>Require approval for new contributions</span>
            </label>
          </div>

          {error && <div className={styles.error}>{error}</div>}

          <div className={styles.actions}>
            <button type="button" onClick={onClose} className={styles.cancelButton} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className={styles.submitButton} disabled={loading}>
              {loading ? 'Creating...' : 'Create Universe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
