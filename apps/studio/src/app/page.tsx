'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCharacters, type Character } from '@/lib/api';
import { NewCharacterModal } from '@/components/NewCharacterModal';

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadCharacters = async () => {
    try {
      setLoading(true);
      const data = await getCharacters();
      setCharacters(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCharacters();
  }, []);

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Characters</h1>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          New Character
        </button>
      </div>

      {loading && <div className="loading">Loading characters...</div>}

      {error && (
        <div className="card" style={{ borderColor: 'var(--error)' }}>
          <p style={{ color: 'var(--error)' }}>{error}</p>
          <button className="btn btn-secondary mt-4" onClick={loadCharacters}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && characters.length === 0 && (
        <div className="empty-state">
          <p>No characters yet. Create your first character to get started.</p>
        </div>
      )}

      {!loading && !error && characters.length > 0 && (
        <div className="grid grid-cols-2">
          {characters.map((character) => (
            <Link
              key={character.id}
              href={`/characters/${character.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div className="card" style={{ cursor: 'pointer' }}>
                <h3 className="card-title">{character.name}</h3>
                <p className="card-description">
                  {character.bio?.slice(0, 100) || 'No bio'}
                  {character.bio && character.bio.length > 100 ? '...' : ''}
                </p>
                {character.personaTags.length > 0 && (
                  <div className="mt-4 flex gap-2" style={{ flexWrap: 'wrap' }}>
                    {character.personaTags.slice(0, 4).map((tag) => (
                      <span key={tag} className="badge badge-draft">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <NewCharacterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={loadCharacters}
      />
    </div>
  );
}
