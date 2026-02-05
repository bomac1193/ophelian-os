'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import { ImprintCreator } from '../../../components/imprint';
import { incrementGenomeCount } from '../../../lib/user-progress';
import type { CharacterImprint } from '../../../lib/imprint-api';

function ImprintCreateContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialName = searchParams.get('name') || undefined;
  const seedParam = searchParams.get('seed');
  const initialSeed = seedParam ? parseInt(seedParam, 10) : undefined;

  const handleSave = async (imprint: CharacterImprint) => {
    // Increment user's genome count for progression tracking
    await incrementGenomeCount();
    router.push(`/imprint/${imprint.id}`);
  };

  const handleCancel = () => {
    router.push('/imprint');
  };

  return (
    <div className="container" style={{ padding: '2rem', maxWidth: '1000px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ margin: '0 0 0.5rem', fontSize: '1.75rem' }}>Create Character Imprint</h1>
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
        <ImprintCreator
          initialName={initialName}
          initialSeed={initialSeed}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      </div>
    </div>
  );
}

export default function ImprintCreatePage() {
  return (
    <Suspense
      fallback={
        <div className="container" style={{ padding: '2rem', textAlign: 'center' }}>
          Loading...
        </div>
      }
    >
      <ImprintCreateContent />
    </Suspense>
  );
}
