'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { GenomeCreator } from '../../../components/genome';
import type { CharacterGenome } from '../../../lib/genome-api';

function GenomeCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialName = searchParams.get('name') || undefined;
  const seedParam = searchParams.get('seed');
  const initialSeed = seedParam ? parseInt(seedParam, 10) : undefined;

  const handleSave = (genome: CharacterGenome) => {
    router.push(`/genome/${genome.id}`);
  };

  const handleCancel = () => {
    router.push('/genome');
  };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem' }}>Create Character Genome</h1>
        <p style={{ margin: 0, color: 'var(--muted-foreground)' }}>
          Configure the spiritual, psychological, and multi-modal attributes of your character.
        </p>
      </div>

      {/* Creator */}
      <div
        style={{
          padding: '1.5rem',
          backgroundColor: 'var(--card)',
          borderRadius: '16px',
          border: '1px solid var(--border)',
        }}
      >
        <GenomeCreator
          initialName={initialName}
          initialSeed={initialSeed}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default function GenomeCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
          Loading...
        </div>
      }
    >
      <GenomeCreateContent />
    </Suspense>
  );
}
