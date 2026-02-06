'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getCharacters, type Character } from '@/lib/api';
import { NewCharacterModal } from '@/components/NewCharacterModal';

// Helper to check if character is a relic
function isRelic(character: Character) {
  const ts = character.timelineState as Record<string, any>;
  const gen = ts?.oripheon?.generated;
  return !!(gen?.relics && gen.relics.length > 0);
}

// Helper to get classification code (e.g., "X-4") from character's subtaste data
function getClassification(character: Character): string | null {
  const ts = character.timelineState as Record<string, any>;
  return ts?.oripheon?.generated?.subtaste?.code || null;
}

// Helper to get archetype label (e.g., "Cull") from character's subtaste data
function getArchetype(character: Character): string | null {
  const ts = character.timelineState as Record<string, any>;
  return ts?.oripheon?.generated?.subtaste?.label || null;
}

function CharacterCard({ character }: { character: Character }) {
  const archetype = getArchetype(character);
  const classification = getClassification(character);

  return (
    <Link
      href={`/characters/${character.id}`}
      style={{ textDecoration: 'none', color: 'inherit' }}
    >
      <div className="card character-card" style={{ cursor: 'pointer' }}>
        <div className="character-card-header">
          <div className="character-avatar-circle">
            {character.avatarUrl ? (
              <img
                src={character.avatarUrl}
                alt={character.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: character.avatarPosition || '50% 50%',
                }}
              />
            ) : (
              <span className="character-avatar-placeholder">
                {character.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <h3 className="card-title">{character.name}</h3>
        </div>
        <p className="card-description">
          {character.bio?.slice(0, 100) || 'No bio'}
          {character.bio && character.bio.length > 100 ? '...' : ''}
        </p>
        {(archetype || classification) && (
          <div style={{
            display: 'flex',
            gap: '0.5rem',
            marginTop: '1rem',
            flexWrap: 'wrap',
          }}>
            {classification && (
              <span style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid var(--foreground)',
                borderRadius: '0',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--foreground)',
                backgroundColor: 'transparent',
              }}>
                {classification}
              </span>
            )}
            {archetype && (
              <span style={{
                padding: '0.25rem 0.75rem',
                border: '1px solid var(--foreground)',
                borderRadius: '0',
                fontSize: '0.75rem',
                fontWeight: 500,
                color: 'var(--foreground)',
                backgroundColor: 'transparent',
              }}>
                {archetype}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}

export default function CharactersPage() {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);

  const loadData = async () => {
    try {
      setLoading(true);
      const charactersData = await getCharacters();
      setCharacters(charactersData);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load characters');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Separate characters and relics
  const regularCharacters = characters.filter(c => !isRelic(c));
  const relics = characters.filter(c => isRelic(c));

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Characters</h1>
        <button className="btn btn-secondary" onClick={() => setShowModal(true)}>
          New Character
        </button>
      </div>

      {loading && <div className="loading">Loading characters...</div>}

      {error && (
        <div className="card" style={{ borderColor: 'var(--error)' }}>
          <p style={{ color: 'var(--error)' }}>{error}</p>
          <button className="btn btn-secondary mt-4" onClick={loadData}>
            Retry
          </button>
        </div>
      )}

      {!loading && !error && characters.length === 0 && (
        <div className="empty-state">
          <p>No characters yet. Create your first character to get started.</p>
        </div>
      )}

      {!loading && !error && regularCharacters.length > 0 && (
        <div style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: 'var(--foreground)',
          }}>
            Characters
          </h2>
          <div className="grid grid-cols-2">
            {regularCharacters.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
              />
            ))}
          </div>
        </div>
      )}

      {!loading && !error && relics.length > 0 && (
        <div>
          <h2 style={{
            fontFamily: 'var(--font-heading)',
            fontSize: '1.25rem',
            fontWeight: 600,
            marginBottom: '1rem',
            color: 'var(--foreground)',
          }}>
            Relics
          </h2>
          <div className="grid grid-cols-2">
            {relics.map((character) => (
              <CharacterCard
                key={character.id}
                character={character}
              />
            ))}
          </div>
        </div>
      )}

      <NewCharacterModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onCreated={loadData}
      />
    </div>
  );
}
