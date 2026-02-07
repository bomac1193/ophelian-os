/**
 * Voice Marketplace Component
 * Browse and license professional voices
 */

'use client';

import React, { useState } from 'react';
import { VoiceCard } from './VoiceCard';
import { LicenseVoiceModal } from './LicenseVoiceModal';
import styles from './VoiceMarketplace.module.css';

// Mock voice data for MVP
// TODO: Replace with API call to backend
export interface MarketplaceVoice {
  id: string;
  name: string;
  actorName: string;
  description: string;
  tags: string[];
  sampleUrl?: string;
  chromoxPersonaId: string;
  pricing: {
    exclusive: number; // cents
    nonExclusive: number; // cents per use
    revShare: { voiceActor: number; creator: number; platform: number };
  };
  stats: {
    totalLicenses: number;
    rating: number;
    usageCount: number;
  };
  available: boolean;
}

const MOCK_VOICES: MarketplaceVoice[] = [
  {
    id: 'voice_1',
    name: 'Velvet Tone',
    actorName: 'Sarah Chen',
    description: 'Warm, sophisticated female voice. Perfect for meditation, audiobooks, and luxury brand content.',
    tags: ['Female', 'Warm', 'Sophisticated', 'Calm'],
    chromoxPersonaId: 'persona_velvet_001',
    pricing: {
      exclusive: 500000, // $5000
      nonExclusive: 100, // $1 per use
      revShare: { voiceActor: 50, creator: 30, platform: 20 },
    },
    stats: {
      totalLicenses: 12,
      rating: 4.9,
      usageCount: 847,
    },
    available: true,
  },
  {
    id: 'voice_2',
    name: 'Storm Voice',
    actorName: 'Marcus Thunder',
    description: 'Deep, powerful male voice with commanding presence. Ideal for action content, trailers, and gaming characters.',
    tags: ['Male', 'Deep', 'Powerful', 'Dramatic'],
    chromoxPersonaId: 'persona_storm_002',
    pricing: {
      exclusive: 750000, // $7500
      nonExclusive: 150, // $1.50 per use
      revShare: { voiceActor: 55, creator: 25, platform: 20 },
    },
    stats: {
      totalLicenses: 8,
      rating: 5.0,
      usageCount: 1203,
    },
    available: true,
  },
  {
    id: 'voice_3',
    name: 'Crystal Clear',
    actorName: 'Emma Bright',
    description: 'Bright, energetic female voice. Great for tutorials, explainers, and uplifting content.',
    tags: ['Female', 'Bright', 'Energetic', 'Friendly'],
    chromoxPersonaId: 'persona_crystal_003',
    pricing: {
      exclusive: 400000, // $4000
      nonExclusive: 80, // $0.80 per use
      revShare: { voiceActor: 50, creator: 30, platform: 20 },
    },
    stats: {
      totalLicenses: 23,
      rating: 4.8,
      usageCount: 2341,
    },
    available: true,
  },
  {
    id: 'voice_4',
    name: 'Shadow Whisper',
    actorName: 'Alex Noir',
    description: 'Mysterious, sultry androgynous voice. Perfect for thrillers, mysteries, and ASMR content.',
    tags: ['Androgynous', 'Mysterious', 'Sultry', 'ASMR'],
    chromoxPersonaId: 'persona_shadow_004',
    pricing: {
      exclusive: 600000, // $6000
      nonExclusive: 120, // $1.20 per use
      revShare: { voiceActor: 60, creator: 20, platform: 20 },
    },
    stats: {
      totalLicenses: 5,
      rating: 4.9,
      usageCount: 432,
    },
    available: true,
  },
];

export function VoiceMarketplace() {
  const [voices] = useState<MarketplaceVoice[]>(MOCK_VOICES);
  const [selectedVoice, setSelectedVoice] = useState<MarketplaceVoice | null>(null);
  const [filter, setFilter] = useState<string>('all');

  const handleLicense = (voice: MarketplaceVoice) => {
    setSelectedVoice(voice);
  };

  const handleLicenseSuccess = () => {
    setSelectedVoice(null);
    // TODO: Refresh licenses, show success message
  };

  const filteredVoices = filter === 'all'
    ? voices
    : voices.filter(v => v.tags.some(tag => tag.toLowerCase() === filter.toLowerCase()));

  const allTags = Array.from(new Set(voices.flatMap(v => v.tags)));

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Voices</h2>
        <div className={styles.filters}>
          <button
            className={`${styles.filterButton} ${filter === 'all' ? styles.active : ''}`}
            onClick={() => setFilter('all')}
          >
            All
          </button>
          {allTags.map((tag) => (
            <button
              key={tag}
              className={`${styles.filterButton} ${filter === tag.toLowerCase() ? styles.active : ''}`}
              onClick={() => setFilter(tag.toLowerCase())}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.stats}>
        <div className={styles.stat}>
          <span className={styles.statValue}>{voices.length}</span>
          <span className={styles.statLabel}>Available</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {voices.reduce((sum, v) => sum + v.stats.totalLicenses, 0)}
          </span>
          <span className={styles.statLabel}>Agreements</span>
        </div>
        <div className={styles.stat}>
          <span className={styles.statValue}>
            {voices.reduce((sum, v) => sum + v.stats.usageCount, 0).toLocaleString()}
          </span>
          <span className={styles.statLabel}>Renderings</span>
        </div>
      </div>

      <div className={styles.grid}>
        {filteredVoices.map((voice) => (
          <VoiceCard
            key={voice.id}
            voice={voice}
            onLicense={() => handleLicense(voice)}
          />
        ))}
      </div>

      {filteredVoices.length === 0 && (
        <div className={styles.emptyState}>
          <p>No voices match this filter</p>
        </div>
      )}

      {selectedVoice && (
        <LicenseVoiceModal
          voice={selectedVoice}
          onClose={() => setSelectedVoice(null)}
          onSuccess={handleLicenseSuccess}
        />
      )}
    </div>
  );
}
