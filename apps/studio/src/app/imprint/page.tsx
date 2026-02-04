'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { getImprints, deleteImprint, exportImprint, type CharacterImprint } from '../../lib/imprint-api';
import { ImprintSummaryCard } from '../../components/imprint';

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

  useEffect(() => {
    fetchImprints();
  }, [fetchImprints]);

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

  return (
    <div className="container" style={{ padding: '2rem' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Character Imprints</h1>
          <p className="page-subtitle">Create and manage character imprints for AI-driven personalities.</p>
        </div>
        <Link
          href="/imprint/create"
          className="btn btn-secondary"
          style={{ textDecoration: 'none' }}
        >
          New Imprint
        </Link>
      </div>

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
    </div>
  );
}
