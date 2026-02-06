'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  getCharacter,
  getContent,
  generateContent,
  approveContent,
  publishContent,
  generateAudio,
  updateCharacter,
  deleteCharacter,
  type Character,
  type ContentItem,
} from '@/lib/api';
import { ImageUpload } from '@/components/ImageUpload';
import { DraggableAvatar } from '@/components/DraggableAvatar';
import { RepositionableCircleAvatar } from '@/components/RepositionableCircleAvatar';

export default function CharacterDetailPage() {
  const params = useParams();
  const router = useRouter();
  const characterId = params.id as string;

  const [character, setCharacter] = useState<Character | null>(null);
  const [contentItems, setContentItems] = useState<ContentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Generate form state
  const [platform, setPlatform] = useState<'X' | 'TIKTOK' | 'INSTAGRAM'>('X');
  const [intent, setIntent] = useState('');
  const [generating, setGenerating] = useState(false);

  // Action states
  const [actionLoading, setActionLoading] = useState<Record<string, boolean>>({});
  const [avatarUpdating, setAvatarUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Editable name state
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState('');
  const [savingName, setSavingName] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const [char, content] = await Promise.all([getCharacter(characterId), getContent()]);
      setCharacter(char);
      setContentItems(content.filter((c) => c.characterId === characterId));
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [characterId]);

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!intent.trim()) return;

    setGenerating(true);
    try {
      await generateContent(characterId, platform, intent);
      setIntent('');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate content');
    } finally {
      setGenerating(false);
    }
  };

  const handleApprove = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await approveContent(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to approve');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handlePublish = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [id]: true }));
    try {
      await publishContent(id);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to publish');
    } finally {
      setActionLoading((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleGenerateAudio = async (id: string) => {
    setActionLoading((prev) => ({ ...prev, [`audio-${id}`]: true }));
    try {
      const result = await generateAudio(id);
      alert(`Audio generated: ${result.audioFilePath} (${result.durationSeconds.toFixed(1)}s)`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate audio');
    } finally {
      setActionLoading((prev) => ({ ...prev, [`audio-${id}`]: false }));
    }
  };

  const handleAvatarChange = async (url: string | null) => {
    setAvatarUpdating(true);
    try {
      const updated = await updateCharacter(characterId, { avatarUrl: url });
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update avatar');
    } finally {
      setAvatarUpdating(false);
    }
  };

  const handleAvatarPositionChange = async (position: string) => {
    setAvatarUpdating(true);
    try {
      const updated = await updateCharacter(characterId, { avatarPosition: position });
      setCharacter(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update avatar position');
    } finally {
      setAvatarUpdating(false);
    }
  };

  const handleNameEdit = () => {
    if (character) {
      setEditedName(character.name);
      setIsEditingName(true);
    }
  };

  const handleNameSave = async () => {
    if (!editedName.trim() || editedName === character?.name) {
      setIsEditingName(false);
      return;
    }

    setSavingName(true);
    try {
      const updated = await updateCharacter(characterId, { name: editedName.trim() });
      setCharacter(updated);
      setIsEditingName(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update name');
    } finally {
      setSavingName(false);
    }
  };

  const handleNameCancel = () => {
    setIsEditingName(false);
    setEditedName('');
  };

  const handleDelete = async () => {
    if (!character) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete "${character.name}"? This will also delete all associated content. This action cannot be undone.`
    );

    if (!confirmed) return;

    setDeleting(true);
    try {
      await deleteCharacter(characterId);
      router.push('/');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete character');
      setDeleting(false);
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'DRAFT':
        return 'badge-draft';
      case 'APPROVED':
        return 'badge-approved';
      case 'PUBLISHED':
        return 'badge-published';
      case 'FAILED':
        return 'badge-failed';
      default:
        return 'badge-draft';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="page-container">
        <div className="card" style={{ borderColor: 'var(--error)' }}>
          <p style={{ color: 'var(--error)' }}>{error}</p>
          <button
            onClick={loadData}
            style={{
              marginTop: '1rem',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              border: '1px solid var(--foreground)',
              borderRadius: '0',
              background: 'transparent',
              cursor: 'pointer',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!character) {
    return (
      <div className="page-container">
        <div className="empty-state">
          <p>Character not found</p>
          <Link
            href="/"
            style={{
              marginTop: '1rem',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              border: '1px solid var(--foreground)',
              borderRadius: '0',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'}
          >
            Back to Characters
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <Link
            href="/"
            style={{
              color: 'var(--foreground)',
              fontSize: '0.875rem',
              padding: '0.5rem 1rem',
              border: '1px solid var(--foreground)',
              borderRadius: '0',
              textDecoration: 'none',
              display: 'inline-block',
              transition: 'border-color 0.2s ease',
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.6)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--foreground)'}
          >
            &larr; Back to Characters
          </Link>
          {isEditingName ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
              <input
                type="text"
                className="input"
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleNameSave();
                  if (e.key === 'Escape') handleNameCancel();
                }}
                autoFocus
                style={{ fontSize: '1.5rem', fontWeight: 'bold', padding: '0.25rem 0.5rem' }}
              />
              <button
                className="btn btn-primary btn-sm"
                onClick={handleNameSave}
                disabled={savingName}
                style={{ background: 'var(--success)', borderColor: 'var(--success)' }}
              >
                {savingName ? '...' : 'Save'}
              </button>
              <button className="btn btn-secondary btn-sm" onClick={handleNameCancel}>
                Cancel
              </button>
            </div>
          ) : (
            <h1
              className="page-title"
              style={{ marginTop: '0.5rem', cursor: 'pointer' }}
              onClick={handleNameEdit}
              title="Click to edit name"
            >
              {character.name}
              <span style={{ marginLeft: '0.5rem', fontSize: '0.875rem', color: 'var(--muted-foreground)' }}>
                (edit)
              </span>
            </h1>
          )}
        </div>
        <button
          onClick={handleDelete}
          disabled={deleting}
          style={{
            color: 'var(--error)',
            fontSize: '0.875rem',
            padding: '0.5rem 1rem',
            border: '1px solid var(--error)',
            borderRadius: '0',
            background: 'transparent',
            cursor: deleting ? 'not-allowed' : 'pointer',
            transition: 'border-color 0.2s ease',
          }}
          onMouseEnter={(e) => {
            if (!deleting) e.currentTarget.style.borderColor = 'rgba(255, 107, 107, 0.6)';
          }}
          onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--error)'}
        >
          {deleting ? 'Deleting...' : 'Delete Character'}
        </button>
      </div>

      <div className="grid grid-cols-3">
        <div style={{ gridColumn: 'span 2' }}>
          {/* Generate Content Form */}
          <div className="card mb-4">
            <h3 className="card-title">Generate Content</h3>
            <form onSubmit={handleGenerate} className="mt-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-group">
                  <label className="label">Platform</label>
                  <select
                    className="select"
                    value={platform}
                    onChange={(e) => setPlatform(e.target.value as 'X' | 'TIKTOK' | 'INSTAGRAM')}
                  >
                    <option value="X">X (Twitter)</option>
                    <option value="TIKTOK">TikTok</option>
                    <option value="INSTAGRAM">Instagram</option>
                  </select>
                </div>
                <div className="form-group">
                  <label className="label">Intent</label>
                  <input
                    type="text"
                    className="input"
                    value={intent}
                    onChange={(e) => setIntent(e.target.value)}
                    placeholder="e.g., promote new project, engage followers"
                  />
                </div>
              </div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={generating || !intent.trim()}
              >
                {generating ? 'Generating...' : 'Generate Draft'}
              </button>
            </form>
          </div>

          {/* Content Table */}
          <div className="card">
            <h3 className="card-title">Content</h3>
            {contentItems.length === 0 ? (
              <div className="empty-state">
                <p>No content yet. Generate your first draft above.</p>
              </div>
            ) : (
              <table className="table mt-4">
                <thead>
                  <tr>
                    <th>Platform</th>
                    <th>Text</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contentItems.map((item) => (
                    <tr key={item.id}>
                      <td>{item.platform}</td>
                      <td style={{ maxWidth: '300px' }}>
                        {item.text.slice(0, 80)}
                        {item.text.length > 80 ? '...' : ''}
                      </td>
                      <td>
                        <span className={`badge ${getStatusBadgeClass(item.status)}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          {item.status === 'DRAFT' && (
                            <button
                              className="btn btn-sm btn-secondary"
                              onClick={() => handleApprove(item.id)}
                              disabled={actionLoading[item.id]}
                            >
                              {actionLoading[item.id] ? '...' : 'Approve'}
                            </button>
                          )}
                          {item.status === 'APPROVED' && (
                            <button
                              className="btn btn-sm btn-primary"
                              onClick={() => handlePublish(item.id)}
                              disabled={actionLoading[item.id]}
                            >
                              {actionLoading[item.id] ? '...' : 'Publish'}
                            </button>
                          )}
                          <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => handleGenerateAudio(item.id)}
                            disabled={actionLoading[`audio-${item.id}`]}
                          >
                            {actionLoading[`audio-${item.id}`] ? '...' : 'Audio'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* Character Info Sidebar */}
        <div>
          <div className="card">
            {/* Character Header: Name, Avatar, Description */}
            <div className="character-info-header">
              {isEditingName ? (
                <input
                  type="text"
                  className="input"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleNameSave();
                    if (e.key === 'Escape') handleNameCancel();
                  }}
                  style={{
                    fontSize: '1.125rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                  }}
                />
              ) : (
                <h3
                  className="character-info-name"
                  style={{ cursor: 'pointer' }}
                  onClick={handleNameEdit}
                  title="Click to edit"
                >
                  {character.name}
                </h3>
              )}

              {/* Avatar Circle */}
              {character.avatarUrl ? (
                <RepositionableCircleAvatar
                  src={character.avatarUrl}
                  position={character.avatarPosition || '50% 50%'}
                  onPositionChange={handleAvatarPositionChange}
                  size={120}
                  disabled={avatarUpdating}
                />
              ) : (
                <div className="character-info-avatar">
                  <span className="character-avatar-placeholder" style={{ fontSize: '3rem' }}>
                    {character.name.charAt(0).toUpperCase()}
                  </span>
                </div>
              )}

              <p className="card-description" style={{ textAlign: 'center' }}>
                {character.bio || 'No bio provided'}
              </p>
            </div>

            {/* Avatar Management */}
            <div className="mt-4">
              <strong style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.5rem' }}>
                AVATAR
              </strong>
              {character.avatarUrl ? (
                <DraggableAvatar
                  src={character.avatarUrl}
                  position={character.avatarPosition}
                  onPositionChange={handleAvatarPositionChange}
                  onRemove={() => handleAvatarChange(null)}
                  onReplace={handleAvatarChange}
                  disabled={avatarUpdating}
                />
              ) : (
                <ImageUpload
                  value={character.avatarUrl}
                  onChange={handleAvatarChange}
                  disabled={avatarUpdating}
                />
              )}
            </div>

            <div>
              {character.aliases.length > 0 && (
                <div className="mt-4">
                  <strong style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    ALIASES
                  </strong>
                  <p style={{ fontSize: '0.875rem' }}>{character.aliases.join(', ')}</p>
                </div>
              )}

              {character.personaTags.length > 0 && (
                <div className="mt-4">
                  <strong style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    PERSONA TAGS
                  </strong>
                  <div className="flex gap-2 mt-4" style={{ flexWrap: 'wrap' }}>
                    {character.personaTags.map((tag) => (
                      <span key={tag} className="badge badge-draft">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {character.currentArc && (
                <div className="mt-4">
                  <strong style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)' }}>
                    CURRENT ARC
                  </strong>
                  <p style={{ fontSize: '0.875rem' }}>{character.currentArc}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
