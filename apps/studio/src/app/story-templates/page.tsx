'use client';

import { useState } from 'react';
import {
  storyTemplates,
  StoryTemplate,
  getTemplatesByTemperature,
  getTemplatesByEnergy,
  temperatureColors,
  energySymbols,
} from '@/lib/story-templates';
import { StoryTemplateCard } from '@/components/nexus/StoryTemplateCard';
import { StoryTemplateDetail } from '@/components/nexus/StoryTemplateDetail';

type FilterType = 'all' | 'hot' | 'cool' | 'crossroads';
type EnergyFilter = 'all' | 'ascending' | 'descending' | 'cyclical' | 'lateral' | 'static';

export default function StoryTemplatesPage() {
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

  const handleNavigateToTemplate = (templateId: string) => {
    const template = storyTemplates.find((t) => t.id === templateId);
    if (template) {
      setSelectedTemplate(template);
    }
  };

  // Group templates by temperature
  const hotTemplates = filteredTemplates.filter((t) => t.temperature === 'hot');
  const coolTemplates = filteredTemplates.filter((t) => t.temperature === 'cool');
  const crossroadsTemplates = filteredTemplates.filter((t) => t.temperature === 'crossroads');

  return (
    <div className="page-container">
      <div className="page-header">
        <h1 className="page-title">Story Templates</h1>
        <p className="page-subtitle">
          Universal narrative arcs derived from pre-colonial African sources and validated through
          post-colonial literature.
        </p>
      </div>

      {/* Filters */}
      <div
        style={{
          display: 'flex',
          gap: '1.5rem',
          flexWrap: 'wrap',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: 'var(--card)',
          borderRadius: '0',
          border: '1px solid var(--border)',
        }}
      >
        {/* Temperature Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
            Temperature:
          </span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            {(['all', 'hot', 'cool', 'crossroads'] as FilterType[]).map((filter) => {
              const isActive = temperatureFilter === filter;
              const _colors =
                filter === 'all'
                  ? { bg: 'var(--primary)', text: 'white' }
                  : temperatureColors[filter as 'hot' | 'cool' | 'crossroads'];
              return (
                <button
                  key={filter}
                  onClick={() => setTemperatureFilter(filter)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '0',
                    border: 'none',
                    backgroundColor: isActive ? '#8B5CF6' : 'var(--muted)',
                    color: isActive ? '#FFFFFF' : 'var(--foreground)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textTransform: 'capitalize',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'all 0.15s ease',
                  }}
                >
                  {filter}
                </button>
              );
            })}
          </div>
        </div>

        {/* Energy Filter */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--muted-foreground)', fontWeight: 500 }}>
            Energy:
          </span>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {(
              ['all', 'ascending', 'descending', 'cyclical', 'lateral', 'static'] as EnergyFilter[]
            ).map((filter) => {
              const isActive = energyFilter === filter;
              return (
                <button
                  key={filter}
                  onClick={() => setEnergyFilter(filter)}
                  style={{
                    padding: '0.375rem 0.875rem',
                    borderRadius: '0',
                    border: 'none',
                    backgroundColor: isActive ? '#8B5CF6' : 'var(--muted)',
                    color: isActive ? '#FFFFFF' : 'var(--foreground)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    fontWeight: isActive ? 500 : 400,
                    transition: 'all 0.15s ease',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem',
                  }}
                >
                  {filter !== 'all' && (
                    <span>{energySymbols[filter as keyof typeof energySymbols]}</span>
                  )}
                  {filter.charAt(0).toUpperCase() + filter.slice(1)}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', gap: '2rem' }}>
        {/* Template List */}
        <div style={{ flex: selectedTemplate ? '0 0 400px' : 1 }}>
          {temperatureFilter === 'all' && energyFilter === 'all' ? (
            <>
              {/* Hot Templates */}
              {hotTemplates.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '0',
                        backgroundColor: temperatureColors.hot.bg,
                      }}
                    />
                    Hot Templates
                    <span style={{ fontWeight: 400, color: 'var(--muted-foreground)' }}>
                      — Transformative energy, conflict, disruption
                    </span>
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: selectedTemplate
                        ? '1fr'
                        : 'repeat(auto-fill, minmax(280px, 320px))',
                      gap: '1rem',
                    }}
                  >
                    {hotTemplates.map((template) => (
                      <StoryTemplateCard
                        key={template.id}
                        template={template}
                        selected={selectedTemplate?.id === template.id}
                        compact={!!selectedTemplate}
                        onClick={() => setSelectedTemplate(template)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Cool Templates */}
              {coolTemplates.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '0',
                        backgroundColor: temperatureColors.cool.bg,
                      }}
                    />
                    Cool Templates
                    <span style={{ fontWeight: 400, color: 'var(--muted-foreground)' }}>
                      — Cyclical patterns, inheritance, communion
                    </span>
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: selectedTemplate
                        ? '1fr'
                        : 'repeat(auto-fill, minmax(280px, 320px))',
                      gap: '1rem',
                    }}
                  >
                    {coolTemplates.map((template) => (
                      <StoryTemplateCard
                        key={template.id}
                        template={template}
                        selected={selectedTemplate?.id === template.id}
                        compact={!!selectedTemplate}
                        onClick={() => setSelectedTemplate(template)}
                      />
                    ))}
                  </div>
                </div>
              )}

              {/* Crossroads Templates */}
              {crossroadsTemplates.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2
                    style={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <span
                      style={{
                        width: '12px',
                        height: '12px',
                        borderRadius: '0',
                        backgroundColor: temperatureColors.crossroads.bg,
                      }}
                    />
                    Crossroads Templates
                    <span style={{ fontWeight: 400, color: 'var(--muted-foreground)' }}>
                      — Liminal spaces, encounter, descent
                    </span>
                  </h2>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: selectedTemplate
                        ? '1fr'
                        : 'repeat(auto-fill, minmax(280px, 320px))',
                      gap: '1rem',
                    }}
                  >
                    {crossroadsTemplates.map((template) => (
                      <StoryTemplateCard
                        key={template.id}
                        template={template}
                        selected={selectedTemplate?.id === template.id}
                        compact={!!selectedTemplate}
                        onClick={() => setSelectedTemplate(template)}
                      />
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            /* Filtered View */
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: selectedTemplate
                  ? '1fr'
                  : 'repeat(auto-fill, minmax(280px, 320px))',
                gap: '1rem',
              }}
            >
              {filteredTemplates.map((template) => (
                <StoryTemplateCard
                  key={template.id}
                  template={template}
                  selected={selectedTemplate?.id === template.id}
                  compact={!!selectedTemplate}
                  onClick={() => setSelectedTemplate(template)}
                />
              ))}
            </div>
          )}

          {filteredTemplates.length === 0 && (
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

        {/* Detail Panel */}
        {selectedTemplate && (
          <div style={{ flex: 1, minWidth: 0 }}>
            <StoryTemplateDetail
              template={selectedTemplate}
              onClose={() => setSelectedTemplate(null)}
              onTemplateClick={handleNavigateToTemplate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
