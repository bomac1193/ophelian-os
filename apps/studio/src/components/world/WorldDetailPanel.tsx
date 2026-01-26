'use client';

import type { World, UpdateWorldInput } from '@/lib/api';
import { useState } from 'react';

interface WorldDetailPanelProps {
  world: World;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateWorldInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function WorldDetailPanel({ world, onClose, onUpdate, onDelete }: WorldDetailPanelProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(world.name);
  const [type, setType] = useState(world.type);
  const [description, setDescription] = useState(world.description || '');

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(world.id, {
        name,
        type: type as 'setting' | 'story',
        description: description || null,
      });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this world?')) return;
    setLoading(true);
    try {
      await onDelete(world.id);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (t: string) => {
    return t === 'story' ? '\u2756' : '\u2B22';
  };

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <h2 className="detail-panel-title">World Details</h2>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="world-info-header">
        <div className="world-info-icon">
          {world.imageUrl ? (
            <img src={world.imageUrl} alt={world.name} />
          ) : (
            <span className="world-icon-placeholder">{getTypeIcon(world.type)}</span>
          )}
        </div>
        {editing ? (
          <input
            type="text"
            className="input"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        ) : (
          <div className="world-info-name">{world.name}</div>
        )}
      </div>

      <div className="detail-section">
        <label className="label">Type</label>
        {editing ? (
          <select
            className="select"
            value={type}
            onChange={(e) => setType(e.target.value as 'setting' | 'story')}
          >
            <option value="setting">Setting</option>
            <option value="story">Story</option>
          </select>
        ) : (
          <p className="detail-text">{world.type}</p>
        )}
      </div>

      <div className="detail-section">
        <label className="label">Description</label>
        {editing ? (
          <textarea
            className="input textarea"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
          />
        ) : (
          <p className="detail-text">{world.description || 'No description'}</p>
        )}
      </div>

      {world.tags.length > 0 && (
        <div className="detail-section">
          <label className="label">Tags</label>
          <div className="tag-list">
            {world.tags.map((tag, i) => (
              <span key={i} className="tag">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="detail-actions">
        {editing ? (
          <>
            <button className="btn btn-secondary" onClick={() => setEditing(false)} disabled={loading}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleSave} disabled={loading}>
              {loading ? 'Saving...' : 'Save'}
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-secondary" onClick={() => setEditing(true)}>
              Edit
            </button>
            <button className="btn btn-danger" onClick={handleDelete} disabled={loading}>
              Delete
            </button>
          </>
        )}
      </div>
    </div>
  );
}
