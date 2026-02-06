'use client';

import { useState } from 'react';
import type { CreateWorldInput } from '@/lib/api';
import { storyTemplates, temperatureColors, energySymbols } from '@/lib/story-templates';

interface NewWorldModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: CreateWorldInput) => Promise<void>;
}

export function NewWorldModal({ isOpen, onClose, onCreate }: NewWorldModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState('');
  const [type, setType] = useState<'setting' | 'story'>('setting');
  const [description, setDescription] = useState('');
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | undefined>();
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);

  if (!isOpen) return null;

  const selectedTemplate = selectedTemplateId
    ? storyTemplates.find(t => t.id === selectedTemplateId)
    : undefined;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Name is required');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const metadata: Record<string, unknown> = {};
      if (selectedTemplateId) {
        metadata.storyArc = {
          primaryTemplateId: selectedTemplateId,
          currentPhase: 1,
          appliedAt: new Date().toISOString(),
        };
      }

      await onCreate({
        name: name.trim(),
        type,
        description: description.trim() || undefined,
        metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
      });
      // Reset form
      setName('');
      setType('setting');
      setDescription('');
      setSelectedTemplateId(undefined);
      setShowTemplateSelector(false);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create globe');
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
          <h2 className="modal-title">Create Globe</h2>
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
              placeholder="e.g., The Realm of Shadows, War of the Roses"
              autoFocus
              required
            />
          </div>

          <div className="form-group">
            <label className="label">Type</label>
            <select
              className="select"
              value={type}
              onChange={(e) => setType(e.target.value as 'setting' | 'story')}
            >
              <option value="setting">Setting</option>
              <option value="story">Story</option>
            </select>
          </div>

          <div className="form-group">
            <label className="label">Description (optional)</label>
            <textarea
              className="input textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe this globe..."
              rows={3}
            />
          </div>

          {/* Story Template Selector */}
          <div className="form-group">
            <label className="label">Story Template (optional)</label>
            {!showTemplateSelector ? (
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%' }}
                onClick={() => setShowTemplateSelector(true)}
              >
                Add Story Template
              </button>
            ) : (
              <div style={{ border: '1px solid var(--border)', borderRadius: '8px', padding: '0.75rem' }}>
                {selectedTemplate ? (
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '0.5rem',
                      backgroundColor: 'var(--muted)',
                      borderRadius: '6px',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span
                        style={{
                          width: '10px',
                          height: '10px',
                          borderRadius: '50%',
                          backgroundColor: temperatureColors[selectedTemplate.temperature].bg,
                        }}
                      />
                      <span style={{ fontWeight: 500 }}>{selectedTemplate.name}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                        {energySymbols[selectedTemplate.primaryEnergy]}
                      </span>
                    </div>
                    <button
                      type="button"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '1.2rem',
                        color: 'var(--muted-foreground)',
                      }}
                      onClick={() => setSelectedTemplateId(undefined)}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                    {storyTemplates.map((template) => {
                      const tempColor = temperatureColors[template.temperature];
                      return (
                        <div
                          key={template.id}
                          onClick={() => setSelectedTemplateId(template.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.5rem',
                            padding: '0.5rem',
                            cursor: 'pointer',
                            borderRadius: '4px',
                            marginBottom: '0.25rem',
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--muted)')}
                          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        >
                          <span
                            style={{
                              width: '8px',
                              height: '8px',
                              borderRadius: '50%',
                              backgroundColor: tempColor.bg,
                              flexShrink: 0,
                            }}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 500 }}>{template.name}</div>
                            <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)' }}>
                              {template.question}
                            </div>
                          </div>
                          <span style={{ fontSize: '0.75rem', opacity: 0.6 }}>
                            {energySymbols[template.primaryEnergy]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <button
                  type="button"
                  style={{
                    marginTop: '0.5rem',
                    fontSize: '0.75rem',
                    color: 'var(--muted-foreground)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    textDecoration: 'underline',
                  }}
                  onClick={() => {
                    setShowTemplateSelector(false);
                    setSelectedTemplateId(undefined);
                  }}
                >
                  Remove template
                </button>
              </div>
            )}
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Creating...' : 'Create Globe'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
