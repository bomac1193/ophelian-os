'use client';

import { useEffect, useState } from 'react';
import {
  getWorlds,
  createWorld,
  updateWorld,
  deleteWorld,
  type World,
  type CreateWorldInput,
  type UpdateWorldInput,
} from '@/lib/api';

export default function GlobesPage() {
  const [globes, setGlobes] = useState<World[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGlobe, setEditingGlobe] = useState<World | null>(null);
  const [formData, setFormData] = useState<CreateWorldInput>({
    name: '',
    type: 'setting',
    description: '',
  });

  const loadGlobes = async () => {
    try {
      const data = await getWorlds();
      setGlobes(data);
    } catch (error) {
      console.error('Failed to load globes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGlobes();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingGlobe) {
        await updateWorld(editingGlobe.id, formData as UpdateWorldInput);
      } else {
        await createWorld(formData);
      }
      await loadGlobes();
      closeModal();
    } catch (error) {
      console.error('Failed to save globe:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this globe?')) return;
    try {
      await deleteWorld(id);
      await loadGlobes();
    } catch (error) {
      console.error('Failed to delete globe:', error);
    }
  };

  const openModal = (globe?: World) => {
    if (globe) {
      setEditingGlobe(globe);
      setFormData({
        name: globe.name,
        type: globe.type,
        description: globe.description || '',
      });
    } else {
      setEditingGlobe(null);
      setFormData({ name: '', type: 'setting', description: '' });
    }
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingGlobe(null);
    setFormData({ name: '', type: 'setting', description: '' });
  };

  const getTypeIcon = (type: string) => {
    return type === 'story' ? '\u2756' : '\u2B22';
  };

  if (loading) {
    return <div className="loading">Loading globes...</div>;
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1 className="page-title">Globes</h1>
          <p className="page-subtitle">Worlds and realms in your universe</p>
        </div>
        <button className="btn btn-primary" onClick={() => openModal()}>
          + New Globe
        </button>
      </div>

      {globes.length === 0 ? (
        <div className="empty-state">
          <p>No globes yet. Create your first globe to get started.</p>
        </div>
      ) : (
        <div className="entity-grid">
          {globes.map((globe) => (
            <div key={globe.id} className="entity-card globe-card">
              <div className="entity-card-header">
                <div className="entity-card-icon globe-icon">
                  {getTypeIcon(globe.type)}
                </div>
                <div className="entity-card-meta">
                  <span className="entity-type-badge globe-badge">{globe.type}</span>
                </div>
              </div>
              <h3 className="entity-card-title">{globe.name}</h3>
              {globe.description && (
                <p className="entity-card-description">{globe.description}</p>
              )}
              <div className="entity-card-actions">
                <button className="btn btn-sm btn-secondary" onClick={() => openModal(globe)}>
                  Edit
                </button>
                <button className="btn btn-sm btn-danger" onClick={() => handleDelete(globe.id)}>
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal modal-sm">
            <div className="modal-header">
              <h2 className="modal-title">{editingGlobe ? 'Edit Globe' : 'New Globe'}</h2>
              <button className="modal-close" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="label">Name</label>
                <input
                  type="text"
                  className="input"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g., The Realm of Shadows"
                  required
                />
              </div>
              <div className="form-group">
                <label className="label">Type</label>
                <select
                  className="select"
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value as 'setting' | 'story' })}
                >
                  <option value="setting">Setting</option>
                  <option value="story">Story</option>
                </select>
              </div>
              <div className="form-group">
                <label className="label">Description</label>
                <textarea
                  className="input textarea"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe this globe..."
                  rows={4}
                />
              </div>
              <div className="modal-actions">
                <button type="button" className="btn btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingGlobe ? 'Save' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
