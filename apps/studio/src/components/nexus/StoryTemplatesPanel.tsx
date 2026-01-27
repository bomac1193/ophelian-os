'use client';

import { useState } from 'react';
import {
  storyTemplates,
  StoryTemplate,
  getTemplatesByTemperature,
  getTemplatesByEnergy,
} from '@/lib/story-templates';
import { StoryTemplateCard } from './StoryTemplateCard';
import { StoryTemplateDetail } from './StoryTemplateDetail';

interface StoryTemplatesPanelProps {
  onApplyTemplate?: (config: { primary: string; secondary?: string; shadow?: string }) => void;
  selectedTemplateId?: string;
}

type FilterType = 'all' | 'hot' | 'cool' | 'crossroads';
type EnergyFilter = 'all' | 'ascending' | 'descending' | 'cyclical' | 'lateral' | 'static';

export function StoryTemplatesPanel({
  onApplyTemplate,
  selectedTemplateId,
}: StoryTemplatesPanelProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<StoryTemplate | null>(null);
  const [temperatureFilter, setTemperatureFilter] = useState<FilterType>('all');
  const [energyFilter, setEnergyFilter] = useState<EnergyFilter>('all');

  const getFilteredTemplates = (): StoryTemplate[] => {
    let templates = storyTemplates;

    if (temperatureFilter !== 'all') {
      templates = getTemplatesByTemperature(temperatureFilter);
    }

    if (energyFilter !== 'all') {
      const energyFiltered = getTemplatesByEnergy(energyFilter);
      templates = templates.filter((t) => energyFiltered.some((e) => e.id === t.id));
    }

    return templates;
  };

  const filteredTemplates = getFilteredTemplates();

  const handleTemplateClick = (template: StoryTemplate) => {
    setSelectedTemplate(template);
  };

  const handleNavigateToTemplate = (templateId: string) => {
    const template = storyTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header */}
      <div
        style={{
          padding: '1rem 1.5rem',
          borderBottom: '1px solid var(--border)',
          backgroundColor: 'var(--card)',
        }}
      >
        <h2 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 600 }}>
          Story Templates
        </h2>
        <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: 'var(--muted-foreground)' }}>
          Universal narrative arcs derived from pre-colonial African sources and validated through
          post-colonial literature.
        </p>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {/* Temperature Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Temperature:</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {(['all', 'hot', 'cool', 'crossroads'] as FilterType[]).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setTemperatureFilter(filter)}
                  style={{
                    padding: '0.25rem 0.75rem',
                    borderRadius: '6px',
                    border: 'none',
                    backgroundColor:
                      temperatureFilter === filter ? 'var(--primary)' : 'var(--muted)',
                    color: temperatureFilter === filter ? 'white' : 'var(--foreground)',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                  }}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Energy Filter */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>Energy:</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {(['all', 'ascending', 'descending', 'cyclical', 'lateral', 'static'] as EnergyFilter[]).map(
                (filter) => (
                  <button
                    key={filter}
                    onClick={() => setEnergyFilter(filter)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      borderRadius: '6px',
                      border: 'none',
                      backgroundColor: energyFilter === filter ? 'var(--primary)' : 'var(--muted)',
                      color: energyFilter === filter ? 'white' : 'var(--foreground)',
                      fontSize: '0.75rem',
                      cursor: 'pointer',
                      textTransform: 'capitalize',
                    }}
                  >
                    {filter === 'all' ? 'All' : filter.charAt(0).toUpperCase() + filter.slice(1)}
                  </button>
                )
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflow: 'auto', padding: '1.5rem' }}>
        {selectedTemplate ? (
          <div>
            <button
              onClick={() => setSelectedTemplate(null)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                border: '1px solid var(--border)',
                backgroundColor: 'transparent',
                color: 'var(--foreground)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                marginBottom: '1rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              ← Back to Templates
            </button>
            <StoryTemplateDetail
              template={selectedTemplate}
              onApply={onApplyTemplate}
              onTemplateClick={handleNavigateToTemplate}
            />
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '1rem',
            }}
          >
            {filteredTemplates.map((template) => (
              <StoryTemplateCard
                key={template.id}
                template={template}
                selected={template.id === selectedTemplateId}
                onClick={() => handleTemplateClick(template)}
              />
            ))}
          </div>
        )}

        {filteredTemplates.length === 0 && !selectedTemplate && (
          <div
            style={{
              textAlign: 'center',
              padding: '3rem',
              color: 'var(--muted-foreground)',
            }}
          >
            No templates match the selected filters.
          </div>
        )}
      </div>
    </div>
  );
}
