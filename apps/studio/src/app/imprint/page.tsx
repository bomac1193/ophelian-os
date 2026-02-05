'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getImprints, deleteImprint, exportImprint, type CharacterImprint } from '../../lib/imprint-api';
import { getCharacters, syncAllOripheonData, syncOripheonData, type Character } from '../../lib/api';
import { ImprintSummaryCard } from '../../components/imprint';
import { getSurfaceView } from '@lcos/oripheon';

type FilterKey = 'orisha' | 'sephira' | 'trajectory' | 'tag';

const ORISHA_OPTIONS = [
  'Èṣù', 'Ògún', 'Ọ̀ṣun', 'Yemọja', 'Ṣàngó', 'Ọya', 'Obàtálá', 'Ọ̀rúnmìlà', 'Ọ̀ṣọ́ọ̀sì', 'Ọ̀sanyìn',
];

const SEPHIRA_OPTIONS = [
  'Kether', 'Chokmah', 'Binah', 'Chesed', 'Geburah', 'Tiphareth', 'Netzach', 'Hod', 'Yesod', 'Malkuth',
];

const TRAJECTORY_OPTIONS = ['emergence', 'ascent', 'crisis', 'descent', 'integration', 'transcendence'];

export default function ImprintLibraryPage() {
  const [imprints, setImprints] = useState<CharacterImprint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [characters, setCharacters] = useState<Character[]>([]);
  const [syncingAll, setSyncingAll] = useState(false);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [syncResult, setSyncResult] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<FilterKey, string>>({
    orisha: '',
    sephira: '',
    trajectory: '',
    tag: '',
  });

  const fetchImprints = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const filterParams: { orisha?: string; sephira?: string; trajectory?: string; tag?: string } = {};
      if (filters.orisha) filterParams.orisha = filters.orisha;
      if (filters.sephira) filterParams.sephira = filters.sephira;
      if (filters.trajectory) filterParams.trajectory = filters.trajectory;
      if (filters.tag) filterParams.tag = filters.tag;

      const data = await getImprints(Object.keys(filterParams).length > 0 ? filterParams : undefined);
      setImprints(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch imprints');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const fetchCharacters = useCallback(async () => {
    try {
      const chars = await getCharacters();
      setCharacters(chars);
    } catch {
      // Characters section is supplementary, don't block on errors
    }
  }, []);

  useEffect(() => {
    fetchImprints();
    fetchCharacters();
  }, [fetchImprints, fetchCharacters]);

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this imprint?')) return;

    try {
      await deleteImprint(id);
      setImprints(imprints.filter((g) => g.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete imprint');
    }
  };

  const handleExport = async (id: string) => {
    try {
      const exported = await exportImprint(id, 'json');
      const blob = new Blob([exported], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `imprint-${id}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to export imprint');
    }
  };

  const handleFilterChange = (key: FilterKey, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const handleSyncAll = async () => {
    setSyncingAll(true);
    setSyncResult(null);
    try {
      const result = await syncAllOripheonData();
      const generated = result.results.filter(r => r.status === 'generated').length;
      const enriched = result.results.filter(r => r.status === 'enriched').length;
      const skipped = result.results.filter(r => r.status === 'already_complete').length;
      setSyncResult(`${generated} generated, ${enriched} enriched, ${skipped} already complete`);
      await fetchCharacters();
    } catch (err) {
      setSyncResult(err instanceof Error ? err.message : 'Sync failed');
    } finally {
      setSyncingAll(false);
    }
  };

  const handleSyncOne = async (characterId: string) => {
    setSyncingId(characterId);
    try {
      await syncOripheonData(characterId);
      await fetchCharacters();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to sync character');
    } finally {
      setSyncingId(null);
    }
  };

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Character Imprints</h1>
          <p className="page-subtitle">Create and manage character imprints for AI-driven personalities.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button
            className="btn btn-secondary"
            onClick={handleSyncAll}
            disabled={syncingAll}
            style={{ whiteSpace: 'nowrap' }}
          >
            {syncingAll ? 'Syncing...' : 'Sync All Oripheon'}
          </button>
          <Link
            href="/imprint/create"
            className="btn btn-secondary"
            style={{ textDecoration: 'none' }}
          >
            New Imprint
          </Link>
        </div>
      </div>

      {/* Sync Result */}
      {syncResult && (
        <div
          style={{
            padding: '0.75rem 1rem',
            backgroundColor: 'var(--card)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            marginBottom: '1rem',
            fontSize: '0.875rem',
            color: 'var(--foreground)',
          }}
        >
          {syncResult}
        </div>
      )}

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '1rem',
          flexWrap: 'wrap',
          marginBottom: '1.5rem',
          padding: '1rem',
          backgroundColor: 'var(--card)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ flex: '1 1 150px', minWidth: '150px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>
            Orisha
          </label>
          <select
            value={filters.orisha}
            onChange={(e) => handleFilterChange('orisha', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
            }}
          >
            <option value="">All Orisha</option>
            {ORISHA_OPTIONS.map((o) => (
              <option key={o} value={o}>
                {o}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 150px', minWidth: '150px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>
            Sephira
          </label>
          <select
            value={filters.sephira}
            onChange={(e) => handleFilterChange('sephira', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
            }}
          >
            <option value="">All Sephira</option>
            {SEPHIRA_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 150px', minWidth: '150px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>
            Trajectory
          </label>
          <select
            value={filters.trajectory}
            onChange={(e) => handleFilterChange('trajectory', e.target.value)}
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
            }}
          >
            <option value="">All Trajectories</option>
            {TRAJECTORY_OPTIONS.map((t) => (
              <option key={t} value={t} style={{ textTransform: 'capitalize' }}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div style={{ flex: '1 1 150px', minWidth: '150px' }}>
          <label style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', display: 'block', marginBottom: '0.25rem' }}>
            Tag
          </label>
          <input
            type="text"
            value={filters.tag}
            onChange={(e) => handleFilterChange('tag', e.target.value)}
            placeholder="Filter by tag..."
            style={{
              width: '100%',
              padding: '0.5rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'var(--background)',
              color: 'var(--foreground)',
              fontSize: '0.875rem',
            }}
          />
        </div>

        {(filters.orisha || filters.sephira || filters.trajectory || filters.tag) && (
          <button
            type="button"
            onClick={() => setFilters({ orisha: '', sephira: '', trajectory: '', tag: '' })}
            style={{
              alignSelf: 'flex-end',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              cursor: 'pointer',
              fontSize: '0.875rem',
            }}
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Error */}
      {error && (
        <div
          style={{
            padding: '1rem',
            backgroundColor: 'var(--destructive)',
            color: 'white',
            borderRadius: '8px',
            marginBottom: '1rem',
          }}
        >
          {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--muted-foreground)',
          }}
        >
          Loading imprints...
        </div>
      )}

      {/* Imprint list */}
      {!loading && imprints.length === 0 && (
        <div
          style={{
            padding: '3rem',
            textAlign: 'center',
            color: 'var(--muted-foreground)',
            backgroundColor: 'var(--muted)',
            borderRadius: '12px',
          }}
        >
          <p style={{ margin: '0 0 1rem', fontSize: '1.1rem' }}>No imprints found.</p>
          <Link
            href="/imprint/create"
            style={{
              color: 'var(--primary)',
              textDecoration: 'underline',
            }}
          >
            Create your first imprint
          </Link>
        </div>
      )}

      {!loading && imprints.length > 0 && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '1rem',
          }}
        >
          {imprints.map((imprint) => (
            <ImprintSummaryCard
              key={imprint.id}
              genome={imprint}
              onClick={() => (window.location.href = `/imprint/${imprint.id}`)}
              onEdit={() => (window.location.href = `/imprint/${imprint.id}`)}
              onDelete={() => handleDelete(imprint.id)}
              onExport={() => handleExport(imprint.id)}
            />
          ))}
        </div>
      )}

      {/* Count */}
      {!loading && imprints.length > 0 && (
        <p
          style={{
            marginTop: '1.5rem',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--muted-foreground)',
          }}
        >
          Showing {imprints.length} imprint{imprints.length !== 1 ? 's' : ''}
        </p>
      )}

      {/* Character Oripheon Status */}
      {characters.length > 0 && (() => {
        // Separate relics from regular characters
        const relics = characters.filter(char => {
          const ts = char.timelineState as Record<string, any>;
          return ts?.oripheon?.generated?.relics && ts.oripheon.generated.relics.length > 0;
        });
        const regularCharacters = characters.filter(char => {
          const ts = char.timelineState as Record<string, any>;
          return !ts?.oripheon?.generated?.relics || ts.oripheon.generated.relics.length === 0;
        });

        const renderCharacterCard = (char: Character) => {
          const ts = char.timelineState as Record<string, any>;
          const gen = ts?.oripheon?.generated;
          const hasAxes = !!gen?.personality?.axes;
          const hasArcana = !!gen?.arcana;
          const hasHexagram = !!gen?.hexagram;
          const hasSubtaste = !!gen?.subtaste;
          const isComplete = hasAxes && hasArcana && hasHexagram && hasSubtaste;
          const hasNothing = !hasAxes && !hasArcana && !hasHexagram && !hasSubtaste;

          // Find associated genome/imprint for this character
          const characterGenome = imprints.find(imp => imp.characterId === char.id);

          return (
            <div
              key={char.id}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: 'var(--card)',
                border: `1px solid ${isComplete ? 'var(--border)' : 'var(--destructive, #c44)'}`,
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '0.75rem',
              }}
            >
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: '0.875rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {char.name}
                </div>

                {/* Show symbolic imprint if genome exists */}
                {characterGenome && (() => {
                  try {
                    const surface = getSurfaceView(characterGenome);
                    return (
                      <div style={{
                        marginTop: '0.5rem',
                        padding: '0.25rem 0.5rem',
                        backgroundColor: 'var(--muted)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                      }}>
                        <span style={{ fontSize: '1rem' }}>{surface.imprint.symbol}</span>
                        <span style={{ opacity: 0.7 }}>{surface.imprint.primitive}</span>
                        <span style={{ fontWeight: 600 }}>{surface.imprint.label}</span>
                        <span style={{ opacity: 0.5, marginLeft: 'auto' }}>{surface.classification}</span>
                      </div>
                    );
                  } catch (e) {
                    return null;
                  }
                })()}

                {/* Oripheon status */}
                <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '2px', display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  <span style={{ color: hasAxes ? 'var(--foreground)' : 'var(--muted-foreground)', opacity: hasAxes ? 1 : 0.4 }}>
                    {hasAxes ? '\u2713' : '\u2717'} Axes
                  </span>
                  <span style={{ color: hasArcana ? 'var(--foreground)' : 'var(--muted-foreground)', opacity: hasArcana ? 1 : 0.4 }}>
                    {hasArcana ? '\u2713' : '\u2717'} Arcana
                  </span>
                  <span style={{ color: hasHexagram ? 'var(--foreground)' : 'var(--muted-foreground)', opacity: hasHexagram ? 1 : 0.4 }}>
                    {hasHexagram ? '\u2713' : '\u2717'} Hexagram
                  </span>
                  <span style={{ color: hasSubtaste ? 'var(--foreground)' : 'var(--muted-foreground)', opacity: hasSubtaste ? 1 : 0.4 }}>
                    {hasSubtaste ? '\u2713' : '\u2717'} Subtaste
                  </span>
                </div>
                {gen?.arcana?.archetype && (
                  <div style={{ fontSize: '0.7rem', color: 'var(--muted-foreground)', marginTop: '2px' }}>
                    {gen.arcana.archetype}{gen.subtaste?.glyph ? ` \u00b7 ${gen.subtaste.glyph}` : ''}
                    {gen.hexagram?.presentHexagram ? ` \u00b7 ${gen.hexagram.presentHexagram.chinese} #${gen.hexagram.presentHexagram.number}` : ''}
                  </div>
                )}
              </div>
              {!isComplete && (
                <button
                  className="btn btn-secondary"
                  style={{ fontSize: '0.75rem', padding: '0.25rem 0.5rem', whiteSpace: 'nowrap', flexShrink: 0 }}
                  onClick={() => handleSyncOne(char.id)}
                  disabled={syncingId === char.id || syncingAll}
                >
                  {syncingId === char.id ? '...' : hasNothing ? 'Generate' : 'Sync'}
                </button>
              )}
              {isComplete && (
                <span style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', flexShrink: 0 }}>Complete</span>
              )}
            </div>
          );
        };

        return (
          <div style={{ marginTop: '2.5rem' }}>
            {/* Regular Characters Section */}
            {regularCharacters.length > 0 && (
              <div style={{ marginBottom: '2rem' }}>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Characters</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                  Regular characters with oripheon data (axes, arcana, hexagram, subtaste).
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {regularCharacters.map(renderCharacterCard)}
                </div>
              </div>
            )}

            {/* Relics Section */}
            {relics.length > 0 && (
              <div>
                <h2 style={{ fontSize: '1.25rem', marginBottom: '0.5rem' }}>Relics</h2>
                <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', marginBottom: '1rem' }}>
                  Sacred objects and artifacts with their own oripheon signatures.
                </p>
                <div
                  style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '0.75rem',
                  }}
                >
                  {relics.map(renderCharacterCard)}
                </div>
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
