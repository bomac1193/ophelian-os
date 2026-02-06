'use client';

import React, { useState, useMemo } from 'react';
import styles from './PsychometricDashboard.module.css';

interface PsychometricData {
  // Big Five Traits
  openness: number;
  conscientiousness: number;
  extraversion: number;
  agreeableness: number;
  neuroticism: number;

  // Jungian Functions
  thinkingFeeling: number; // -1 = Thinking, 1 = Feeling
  sensingIntuition: number; // -1 = Sensing, 1 = Intuition

  // Character Metrics
  shadowIntegration: number;
  individuationLevel: number;
  archetypalStrength: number;
  narrativeCoherence: number;

  // Engagement Metrics
  contentGenerated: number;
  storiesCreated: number;
  relationshipsFormed: number;
  voiceSyntheses: number;
}

interface PsychometricDashboardProps {
  characterId: string;
  characterName: string;
  orisha?: string;
  sephira?: string;
  trajectory?: string;
  hotCoolAxis?: number;
  activeArchetypes?: string[];
}

function RadialGauge({
  value,
  label,
  color = 'var(--foreground)'
}: {
  value: number;
  label: string;
  color?: string;
}) {
  const percentage = Math.round(value * 100);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - (value * circumference);

  return (
    <div className={styles.gauge}>
      <svg viewBox="0 0 100 100" className={styles.gaugeSvg}>
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--border)"
          strokeWidth="8"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="square"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          transform="rotate(-90 50 50)"
          className={styles.gaugeProgress}
        />
        <text
          x="50"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          className={styles.gaugeValue}
        >
          {percentage}%
        </text>
      </svg>
      <div className={styles.gaugeLabel}>{label}</div>
    </div>
  );
}

function AxisBar({
  value,
  leftLabel,
  rightLabel,
}: {
  value: number;
  leftLabel: string;
  rightLabel: string;
}) {
  const position = ((value + 1) / 2) * 100;

  return (
    <div className={styles.axisContainer}>
      <div className={styles.axisLabels}>
        <span>{leftLabel}</span>
        <span>{rightLabel}</span>
      </div>
      <div className={styles.axisTrack}>
        <div
          className={styles.axisMarker}
          style={{ left: `${position}%` }}
        />
      </div>
    </div>
  );
}

function MetricCard({
  value,
  label,
  icon,
}: {
  value: number | string;
  label: string;
  icon: string;
}) {
  return (
    <div className={styles.metricCard}>
      <div className={styles.metricIcon}>{icon}</div>
      <div className={styles.metricValue}>{value}</div>
      <div className={styles.metricLabel}>{label}</div>
    </div>
  );
}

function TraitBar({
  trait,
  value,
}: {
  trait: string;
  value: number;
}) {
  const percentage = Math.round(value * 100);

  return (
    <div className={styles.traitBar}>
      <div className={styles.traitHeader}>
        <span className={styles.traitName}>{trait}</span>
        <span className={styles.traitValue}>{percentage}%</span>
      </div>
      <div className={styles.traitTrack}>
        <div
          className={styles.traitFill}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

export function PsychometricDashboard({
  characterId,
  characterName,
  orisha,
  sephira,
  trajectory,
  hotCoolAxis = 0,
  activeArchetypes = [],
}: PsychometricDashboardProps) {
  const [timeRange, setTimeRange] = useState<'7d' | '30d' | '90d' | 'all'>('30d');

  // Generate psychometric data based on character genome
  const psychometrics = useMemo<PsychometricData>(() => {
    // Seed based on character ID for consistency
    const seed = characterId.split('').reduce((a, b) => a + b.charCodeAt(0), 0);
    const seededRandom = (offset: number) => {
      const x = Math.sin(seed + offset) * 10000;
      return x - Math.floor(x);
    };

    // Generate Big Five based on Orisha/Sephira influence
    const orishaModifiers: Record<string, Partial<PsychometricData>> = {
      'Èṣù': { openness: 0.85, extraversion: 0.75, conscientiousness: 0.45 },
      'Ògún': { conscientiousness: 0.9, openness: 0.6, agreeableness: 0.4 },
      'Ọ̀ṣun': { agreeableness: 0.85, extraversion: 0.8, openness: 0.7 },
      'Yemọja': { agreeableness: 0.9, neuroticism: 0.3, conscientiousness: 0.75 },
      'Ṣàngó': { extraversion: 0.95, openness: 0.7, neuroticism: 0.5 },
      'Ọya': { openness: 0.9, neuroticism: 0.6, extraversion: 0.7 },
      'Obàtálá': { conscientiousness: 0.85, agreeableness: 0.8, neuroticism: 0.2 },
    };

    const base = orishaModifiers[orisha || ''] || {};

    return {
      openness: base.openness ?? (0.4 + seededRandom(1) * 0.5),
      conscientiousness: base.conscientiousness ?? (0.4 + seededRandom(2) * 0.5),
      extraversion: base.extraversion ?? (0.3 + seededRandom(3) * 0.6),
      agreeableness: base.agreeableness ?? (0.4 + seededRandom(4) * 0.5),
      neuroticism: base.neuroticism ?? (0.2 + seededRandom(5) * 0.5),
      thinkingFeeling: hotCoolAxis,
      sensingIntuition: trajectory === 'transcendence' ? 0.6 : trajectory === 'emergence' ? -0.3 : 0,
      shadowIntegration: 0.3 + seededRandom(6) * 0.5,
      individuationLevel: 0.4 + seededRandom(7) * 0.4,
      archetypalStrength: 0.5 + seededRandom(8) * 0.4,
      narrativeCoherence: 0.6 + seededRandom(9) * 0.3,
      contentGenerated: Math.floor(seededRandom(10) * 150),
      storiesCreated: Math.floor(seededRandom(11) * 12),
      relationshipsFormed: Math.floor(seededRandom(12) * 8),
      voiceSyntheses: Math.floor(seededRandom(13) * 45),
    };
  }, [characterId, orisha, trajectory, hotCoolAxis]);

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h2 className={styles.title}>Psychometric Analytics</h2>
          <p className={styles.subtitle}>
            Deep personality insights for {characterName}
          </p>
        </div>
        <div className={styles.timeSelector}>
          {(['7d', '30d', '90d', 'all'] as const).map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => setTimeRange(range)}
              className={`${styles.timeButton} ${timeRange === range ? styles.timeButtonActive : ''}`}
            >
              {range === 'all' ? 'All Time' : range.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Core Metrics */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Core Metrics</h3>
        <div className={styles.gaugeGrid}>
          <RadialGauge
            value={psychometrics.shadowIntegration}
            label="Shadow Integration"
          />
          <RadialGauge
            value={psychometrics.individuationLevel}
            label="Individuation"
          />
          <RadialGauge
            value={psychometrics.archetypalStrength}
            label="Archetypal Strength"
          />
          <RadialGauge
            value={psychometrics.narrativeCoherence}
            label="Narrative Coherence"
          />
        </div>
      </div>

      {/* Big Five Personality */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Big Five Personality Model</h3>
        <div className={styles.traitsContainer}>
          <TraitBar trait="Openness" value={psychometrics.openness} />
          <TraitBar trait="Conscientiousness" value={psychometrics.conscientiousness} />
          <TraitBar trait="Extraversion" value={psychometrics.extraversion} />
          <TraitBar trait="Agreeableness" value={psychometrics.agreeableness} />
          <TraitBar trait="Neuroticism" value={psychometrics.neuroticism} />
        </div>
      </div>

      {/* Jungian Axes */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Cognitive Functions</h3>
        <div className={styles.axesContainer}>
          <AxisBar
            value={psychometrics.thinkingFeeling}
            leftLabel="Thinking"
            rightLabel="Feeling"
          />
          <AxisBar
            value={psychometrics.sensingIntuition}
            leftLabel="Sensing"
            rightLabel="Intuition"
          />
        </div>
      </div>

      {/* Active Archetypes */}
      {activeArchetypes.length > 0 && (
        <div className={styles.section}>
          <h3 className={styles.sectionTitle}>Active Archetypes</h3>
          <div className={styles.archetypeGrid}>
            {activeArchetypes.map((archetype) => (
              <div key={archetype} className={styles.archetypeChip}>
                {archetype}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Genome Influence */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Genome Influence</h3>
        <div className={styles.influenceGrid}>
          {orisha && (
            <div className={styles.influenceCard}>
              <div className={styles.influenceLabel}>Primary Orisha</div>
              <div className={styles.influenceValue}>{orisha}</div>
            </div>
          )}
          {sephira && (
            <div className={styles.influenceCard}>
              <div className={styles.influenceLabel}>Sephira Position</div>
              <div className={styles.influenceValue}>{sephira}</div>
            </div>
          )}
          {trajectory && (
            <div className={styles.influenceCard}>
              <div className={styles.influenceLabel}>Trajectory</div>
              <div className={styles.influenceValue} style={{ textTransform: 'capitalize' }}>
                {trajectory}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Engagement Stats */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>Engagement Metrics</h3>
        <div className={styles.metricsGrid}>
          <MetricCard
            value={psychometrics.contentGenerated}
            label="Content Generated"
            icon="C"
          />
          <MetricCard
            value={psychometrics.storiesCreated}
            label="Stories Created"
            icon="S"
          />
          <MetricCard
            value={psychometrics.relationshipsFormed}
            label="Relationships"
            icon="R"
          />
          <MetricCard
            value={psychometrics.voiceSyntheses}
            label="Voice Syntheses"
            icon="V"
          />
        </div>
      </div>

      {/* Insights */}
      <div className={styles.section}>
        <h3 className={styles.sectionTitle}>AI Insights</h3>
        <div className={styles.insightsList}>
          <div className={styles.insight}>
            <div className={styles.insightBullet} />
            <div className={styles.insightText}>
              {characterName}'s high {psychometrics.openness > 0.7 ? 'openness' : psychometrics.conscientiousness > 0.7 ? 'conscientiousness' : 'balance'} suggests
              strong creative potential in {orisha === 'Èṣù' ? 'liminal narratives' : orisha === 'Ọ̀ṣun' ? 'relational dynamics' : 'archetypal expression'}.
            </div>
          </div>
          <div className={styles.insight}>
            <div className={styles.insightBullet} />
            <div className={styles.insightText}>
              Shadow integration at {Math.round(psychometrics.shadowIntegration * 100)}% indicates
              {psychometrics.shadowIntegration > 0.6 ? ' advanced self-awareness' : ' room for deeper exploration'} of unconscious patterns.
            </div>
          </div>
          <div className={styles.insight}>
            <div className={styles.insightBullet} />
            <div className={styles.insightText}>
              The {trajectory || 'current'} trajectory aligns with {sephira || 'kabbalistic'} energies,
              suggesting themes of {trajectory === 'transcendence' ? 'ascension and wisdom' : 'emergence and transformation'}.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
