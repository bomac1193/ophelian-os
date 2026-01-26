'use client';

import type { Scene, UpdateSceneInput } from '@/lib/api';
import { useState } from 'react';

interface SceneDetailPanelProps {
  scene: Scene;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateSceneInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function SceneDetailPanel({ scene, onClose, onUpdate, onDelete }: SceneDetailPanelProps) {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(scene.name);
  const [type, setType] = useState(scene.type);
  const [description, setDescription] = useState(scene.description || '');

  const handleSave = async () => {
    setLoading(true);
    try {
      await onUpdate(scene.id, {
        name,
        type: type as 'location' | 'event',
        description: description || null,
      });
      setEditing(false);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this scene?')) return;
    setLoading(true);
    try {
      await onDelete(scene.id);
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (t: string) => {
    return t === 'event' ? '\u2605' : '\u25A0';
  };

  return (
    <div className="detail-panel">
      <div className="detail-panel-header">
        <h2 className="detail-panel-title">Scene Details</h2>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
      </div>

      <div className="scene-info-header">
        <div className="scene-info-icon">
          {scene.imageUrl ? (
            <img src={scene.imageUrl} alt={scene.name} />
          ) : (
            <span className="scene-icon-placeholder">{getTypeIcon(scene.type)}</span>
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
          <div className="scene-info-name">{scene.name}</div>
        )}
      </div>

      <div className="detail-section">
        <label className="label">Type</label>
        {editing ? (
          <select
            className="select"
            value={type}
            onChange={(e) => setType(e.target.value as 'location' | 'event')}
          >
            <option value="location">Location</option>
            <option value="event">Event</option>
          </select>
        ) : (
          <p className="detail-text">{scene.type}</p>
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
          <p className="detail-text">{scene.description || 'No description'}</p>
        )}
      </div>

      {scene.tags.length > 0 && (
        <div className="detail-section">
          <label className="label">Tags</label>
          <div className="tag-list">
            {scene.tags.map((tag, i) => (
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
