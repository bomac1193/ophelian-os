'use client';

import { StoryTemplate, temperatureColors, energySymbols } from '@/lib/story-templates';

interface StoryTemplateCardProps {
  template: StoryTemplate;
  selected?: boolean;
  compact?: boolean;
  onClick?: () => void;
}

export function StoryTemplateCard({
  template,
  selected,
  compact,
  onClick,
}: StoryTemplateCardProps) {
  const tempColor = temperatureColors[template.temperature];
  const energySymbol = energySymbols[template.primaryEnergy];

  if (compact) {
    return (
      <div
        onClick={onClick}
        style={{
          padding: '0.75rem',
          backgroundColor: selected ? 'var(--primary)' : 'var(--card)',
          borderRadius: '8px',
          border: `2px solid ${selected ? 'var(--primary)' : 'var(--border)'}`,
          cursor: onClick ? 'pointer' : 'default',
          transition: 'all 0.2s ease',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              backgroundColor: tempColor.bg,
            }}
          />
          <span style={{ fontWeight: 600, color: selected ? 'white' : 'var(--foreground)' }}>
            {template.name}
          </span>
          <span style={{ fontSize: '0.75rem', opacity: 0.7, color: selected ? 'white' : 'var(--muted-foreground)' }}>
            {energySymbol}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      style={{
        padding: '1.25rem',
        backgroundColor: selected ? `${tempColor.bg}15` : 'var(--card)',
        borderRadius: '12px',
        border: `2px solid ${selected ? tempColor.bg : 'var(--border)'}`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.2s ease',
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <div>
          <h3 style={{ margin: '0 0 0.25rem', fontSize: '1.1rem', fontWeight: 600 }}>
            {template.name}
          </h3>
          <p style={{ margin: 0, fontSize: '0.9rem', fontStyle: 'italic', color: 'var(--muted-foreground)' }}>
            "{template.question}"
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {/* Temperature badge */}
          <span
            style={{
              padding: '0.25rem 0.5rem',
              borderRadius: '12px',
              backgroundColor: tempColor.bg,
              color: tempColor.text,
              fontSize: '0.7rem',
              fontWeight: 500,
              textTransform: 'capitalize',
            }}
          >
            {template.temperature}
          </span>
          {/* Energy symbol */}
          <span
            style={{
              width: '24px',
              height: '24px',
              borderRadius: '50%',
              backgroundColor: 'var(--muted)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.9rem',
            }}
            title={template.primaryEnergy}
          >
            {energySymbol}
          </span>
        </div>
      </div>

      {/* Motion */}
      <div style={{ marginBottom: '0.75rem' }}>
        <span
          style={{
            padding: '0.25rem 0.5rem',
            borderRadius: '6px',
            backgroundColor: 'var(--muted)',
            fontSize: '0.75rem',
          }}
        >
          {template.motion}
        </span>
      </div>

      {/* Description */}
      <p
        style={{
          margin: '0 0 0.75rem',
          fontSize: '0.85rem',
          lineHeight: 1.5,
          color: 'var(--muted-foreground)',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}
      >
        {template.description}
      </p>

      {/* Phases preview */}
      <div style={{ display: 'flex', gap: '0.25rem', marginTop: '0.5rem' }}>
        {template.phases.map((phase, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: '4px',
              borderRadius: '2px',
              backgroundColor: tempColor.bg,
              opacity: 0.3 + (i * 0.15),
            }}
            title={phase.name}
          />
        ))}
      </div>
    </div>
  );
}
