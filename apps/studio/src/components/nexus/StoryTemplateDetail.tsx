'use client';

import { useState } from 'react';
import {
  StoryTemplate,
  getTemplateById,
  getCompatibleTemplates,
  getShadowTemplate,
  temperatureColors,
  energySymbols,
} from '@/lib/story-templates';

interface StoryTemplateDetailProps {
  template: StoryTemplate;
  onClose?: () => void;
  onApply?: (config: { primary: string; secondary?: string; shadow?: string }) => void;
  onTemplateClick?: (templateId: string) => void;
}

export function StoryTemplateDetail({
  template,
  onClose,
  onApply,
  onTemplateClick,
}: StoryTemplateDetailProps) {
  const [selectedSecondary, setSelectedSecondary] = useState<string | undefined>();
  const [showAncient, setShowAncient] = useState(false);
  const [showModern, setShowModern] = useState(false);

  const tempColor = temperatureColors[template.temperature];
  const energySymbol = energySymbols[template.primaryEnergy];
  const compatibleTemplates = getCompatibleTemplates(template.id);
  const shadowTemplate = getShadowTemplate(template.id);

  const handleApply = () => {
    onApply?.({
      primary: template.id,
      secondary: selectedSecondary,
      shadow: template.shadowType,
    });
  };

  return (
    <div
      style={{
        backgroundColor: 'var(--card)',
        borderRadius: '16px',
        border: '1px solid var(--border)',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          padding: '1.5rem',
          background: `linear-gradient(135deg, ${tempColor.bg}20 0%, transparent 100%)`,
          borderBottom: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>{template.name}</h2>
              <span
                style={{
                  padding: '0.25rem 0.75rem',
                  borderRadius: '12px',
                  backgroundColor: tempColor.bg,
                  color: tempColor.text,
                  fontSize: '0.75rem',
                  fontWeight: 500,
                  textTransform: 'capitalize',
                }}
              >
                {template.temperature}
              </span>
              <span
                style={{
                  width: '28px',
                  height: '28px',
                  borderRadius: '50%',
                  backgroundColor: 'var(--muted)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1rem',
                }}
                title={template.primaryEnergy}
              >
                {energySymbol}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '1.1rem', fontStyle: 'italic', color: 'var(--muted-foreground)' }}>
              "{template.question}"
            </p>
          </div>
          {onClose && (
            <button
              onClick={onClose}
              style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                border: 'none',
                backgroundColor: 'var(--muted)',
                color: 'var(--foreground)',
                cursor: 'pointer',
                fontSize: '1.2rem',
              }}
            >
              ×
            </button>
          )}
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
          <span
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'var(--muted)',
              fontSize: '0.8rem',
            }}
          >
            Motion: {template.motion}
          </span>
          <span
            style={{
              padding: '0.375rem 0.75rem',
              borderRadius: '8px',
              backgroundColor: 'var(--muted)',
              fontSize: '0.8rem',
              textTransform: 'capitalize',
            }}
          >
            Energy: {template.primaryEnergy}
          </span>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '1.5rem' }}>
        {/* Description */}
        <p style={{ margin: '0 0 1.5rem', lineHeight: 1.7, fontSize: '0.95rem' }}>
          {template.description}
        </p>

        {/* Phases */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', fontWeight: 600 }}>
            The Five Phases
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {template.phases.map((phase, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  gap: '1rem',
                  padding: '1rem',
                  backgroundColor: 'var(--muted)',
                  borderRadius: '10px',
                  borderLeft: `4px solid ${tempColor.bg}`,
                }}
              >
                <div
                  style={{
                    width: '28px',
                    height: '28px',
                    borderRadius: '50%',
                    backgroundColor: tempColor.bg,
                    color: tempColor.text,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.8rem',
                    fontWeight: 600,
                    flexShrink: 0,
                  }}
                >
                  {phase.order}
                </div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{phase.name}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
                    {phase.description}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Compatible Secondary Types */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 600 }}>
            Compatible Secondary Types
          </h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {compatibleTemplates.map((ct) => {
              const ctColor = temperatureColors[ct.temperature];
              const isSelected = selectedSecondary === ct.id;
              return (
                <button
                  key={ct.id}
                  onClick={() => {
                    if (onTemplateClick) {
                      onTemplateClick(ct.id);
                    } else {
                      setSelectedSecondary(isSelected ? undefined : ct.id);
                    }
                  }}
                  style={{
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    border: `2px solid ${isSelected ? ctColor.bg : 'var(--border)'}`,
                    backgroundColor: isSelected ? `${ctColor.bg}20` : 'transparent',
                    color: 'var(--foreground)',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <span
                    style={{
                      width: '8px',
                      height: '8px',
                      borderRadius: '50%',
                      backgroundColor: ctColor.bg,
                    }}
                  />
                  {ct.name}
                </button>
              );
            })}
          </div>
        </div>

        {/* Shadow Type */}
        {shadowTemplate && (
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ margin: '0 0 0.75rem', fontSize: '1rem', fontWeight: 600 }}>
              Shadow Type
            </h3>
            <p style={{ margin: '0 0 0.5rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
              What is often repressed when {template.name} is the primary arc:
            </p>
            <button
              onClick={() => onTemplateClick?.(shadowTemplate.id)}
              style={{
                padding: '0.75rem 1rem',
                borderRadius: '8px',
                border: '2px dashed var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--foreground)',
                cursor: onTemplateClick ? 'pointer' : 'default',
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                width: '100%',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  backgroundColor: temperatureColors[shadowTemplate.temperature].bg,
                }}
              />
              <strong>{shadowTemplate.name}</strong>
              <span style={{ color: 'var(--muted-foreground)' }}>— "{shadowTemplate.question}"</span>
            </button>
          </div>
        )}

        {/* Sources */}
        <div style={{ marginBottom: '1.5rem' }}>
          <button
            onClick={() => setShowAncient(!showAncient)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '0.5rem',
            }}
          >
            <span>Ancient Sources</span>
            <span>{showAncient ? '▼' : '▶'}</span>
          </button>
          {showAncient && (
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
              {template.ancientSources.map((source, i) => (
                <li key={i} style={{ marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>
                  {source}
                </li>
              ))}
            </ul>
          )}

          <button
            onClick={() => setShowModern(!showModern)}
            style={{
              width: '100%',
              padding: '0.75rem 1rem',
              borderRadius: '8px',
              border: '1px solid var(--border)',
              backgroundColor: 'transparent',
              color: 'var(--foreground)',
              cursor: 'pointer',
              fontSize: '0.9rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span>Modern Examples</span>
            <span>{showModern ? '▼' : '▶'}</span>
          </button>
          {showModern && (
            <ul style={{ margin: '0.5rem 0 0', paddingLeft: '1.5rem', fontSize: '0.85rem' }}>
              {template.modernExamples.map((example, i) => (
                <li key={i} style={{ marginBottom: '0.25rem', color: 'var(--muted-foreground)' }}>
                  {example}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Apply Button */}
        {onApply && (
          <button
            onClick={handleApply}
            style={{
              width: '100%',
              padding: '1rem',
              borderRadius: '10px',
              border: 'none',
              backgroundColor: tempColor.bg,
              color: tempColor.text,
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: 600,
            }}
          >
            Apply {template.name}
            {selectedSecondary && ` + ${getTemplateById(selectedSecondary)?.name}`}
          </button>
        )}
      </div>
    </div>
  );
}
