'use client';

import { useState } from 'react';

// Orisha data for the selector
const ORISHA_DATA = [
  {
    name: 'Èṣù',
    domain: 'Crossroads, Communication, Chaos',
    colors: ['#FF0000', '#000000'],
    description: 'Trickster messenger who opens and closes paths',
    caminos: ['Èṣù Elegbá', 'Èṣù Laroye', 'Èṣù Afrá', 'Èṣù Odara'],
  },
  {
    name: 'Ògún',
    domain: 'Iron, War, Labor, Technology',
    colors: ['#228B22', '#000000'],
    description: 'Lord of iron, tools, and creative destruction',
    caminos: ['Ògún Onílé', 'Ògún Arere', 'Ògún Alagbede', 'Ògún Shibiriki'],
  },
  {
    name: 'Ọ̀ṣun',
    domain: 'Rivers, Love, Fertility, Diplomacy',
    colors: ['#FFD700', '#FFA500'],
    description: 'Sweet waters of sensuality and abundance',
    caminos: ['Ọ̀ṣun Yeyé Morí', 'Ọ̀ṣun Ibú Kolé', 'Ọ̀ṣun Ibu Aña', 'Ọ̀ṣun Olodi'],
  },
  {
    name: 'Yemọja',
    domain: 'Ocean, Motherhood, Protection',
    colors: ['#0077BE', '#FFFFFF'],
    description: 'Mother of waters and nurturer of life',
    caminos: ['Yemọja Okuti', 'Yemọja Asesú', 'Yemọja Mayaleo', 'Yemọja Awoyó'],
  },
  {
    name: 'Ṣàngó',
    domain: 'Thunder, Justice, Dance, Kingship',
    colors: ['#FF0000', '#FFFFFF'],
    description: 'King of thunder and divine justice',
    caminos: ['Ṣàngó Aganjú', 'Ṣàngó Obakoso', 'Ṣàngó Alafi Alafi', 'Ṣàngó Obalufe'],
  },
  {
    name: 'Ọya',
    domain: 'Wind, Storms, Transformation, Death',
    colors: ['#800020', '#FF4500'],
    description: 'Warrior goddess of winds and change',
    caminos: ['Ọya Yansa', 'Ọya Obinidodo', 'Ọya Ayawa', 'Ọya Odé'],
  },
  {
    name: 'Obàtálá',
    domain: 'Creation, Purity, Wisdom, Peace',
    colors: ['#FFFFFF', '#F5F5DC'],
    description: 'Father of all Orisha, sculptor of humanity',
    caminos: ['Obàtálá Ayágguna', 'Obàtálá Ochagriñán', 'Obàtálá Obanlá', 'Obàtálá Oshalufón'],
  },
  {
    name: 'Ọ̀rúnmìlà',
    domain: 'Divination, Wisdom, Destiny',
    colors: ['#008000', '#FFD700'],
    description: 'Witness to destiny, master of Ifá divination',
    caminos: ['Ọ̀rúnmìlà Ibiyii', 'Ọ̀rúnmìlà Elérí Ipin'],
  },
  {
    name: 'Ọ̀ṣọ́ọ̀sì',
    domain: 'Hunting, Forests, Justice',
    colors: ['#228B22', '#0077BE'],
    description: 'Divine hunter who never misses his mark',
    caminos: ['Ọ̀ṣọ́ọ̀sì Odé Mata', 'Ọ̀ṣọ́ọ̀sì Ibualamo', 'Ọ̀ṣọ́ọ̀sì Bomi'],
  },
  {
    name: 'Ọ̀sanyìn',
    domain: 'Herbs, Medicine, Nature Magic',
    colors: ['#228B22', '#8B4513'],
    description: 'One-legged master of herbal medicine',
    caminos: ['Ọ̀sanyìn Aguaddo', 'Ọ̀sanyìn Aroni'],
  },
];

interface OrishaSelectorProps {
  selectedOrisha?: string | null;
  selectedCamino?: string | null;
  secondaryInfluences?: { orisha: string; strength: number }[];
  onOrishaChange?: (orisha: string) => void;
  onCaminoChange?: (camino: string | undefined) => void;
  onSecondaryChange?: (influences: { orisha: string; strength: number }[]) => void;
  disabled?: boolean;
}

export function OrishaSelector({
  selectedOrisha,
  selectedCamino,
  secondaryInfluences = [],
  onOrishaChange,
  onCaminoChange,
  onSecondaryChange,
  disabled,
}: OrishaSelectorProps) {
  const [expanded, setExpanded] = useState<string | null>(null);

  const _selectedOrishaData = ORISHA_DATA.find((o) => o.name === selectedOrisha);

  const handleOrishaClick = (orisha: string) => {
    if (disabled) return;
    if (selectedOrisha === orisha) {
      setExpanded(expanded === orisha ? null : orisha);
    } else {
      onOrishaChange?.(orisha);
      onCaminoChange?.(undefined);
      setExpanded(orisha);
    }
  };

  const handleSecondaryToggle = (orisha: string) => {
    if (disabled || orisha === selectedOrisha) return;

    const exists = secondaryInfluences.find((i) => i.orisha === orisha);
    if (exists) {
      onSecondaryChange?.(secondaryInfluences.filter((i) => i.orisha !== orisha));
    } else if (secondaryInfluences.length < 3) {
      onSecondaryChange?.([...secondaryInfluences, { orisha, strength: 0.5 }]);
    }
  };

  const handleStrengthChange = (orisha: string, strength: number) => {
    onSecondaryChange?.(
      secondaryInfluences.map((i) => (i.orisha === orisha ? { ...i, strength } : i))
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <label className="label">Head Orisha</label>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
          gap: '0.75rem',
        }}
      >
        {ORISHA_DATA.map((orisha) => {
          const isSelected = selectedOrisha === orisha.name;
          const isExpanded = expanded === orisha.name;
          const isSecondary = secondaryInfluences.some((i) => i.orisha === orisha.name);

          return (
            <div
              key={orisha.name}
              onClick={() => handleOrishaClick(orisha.name)}
              style={{
                border: `2px solid ${isSelected ? orisha.colors[0] : isSecondary ? 'var(--primary)' : 'var(--border)'}`,
                borderRadius: '12px',
                padding: '1rem',
                cursor: disabled ? 'not-allowed' : 'pointer',
                backgroundColor: isSelected ? `${orisha.colors[0]}15` : 'var(--card)',
                transition: 'all 0.2s ease',
                opacity: disabled ? 0.5 : 1,
              }}
            >
              {/* Color swatches */}
              <div style={{ display: 'flex', gap: '4px', marginBottom: '0.5rem' }}>
                {orisha.colors.map((color, i) => (
                  <div
                    key={i}
                    style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '4px',
                      backgroundColor: color,
                      border: color === '#FFFFFF' ? '1px solid var(--border)' : 'none',
                    }}
                  />
                ))}
              </div>

              <h4 style={{ margin: '0 0 0.25rem', fontSize: '1rem', fontWeight: 600 }}>
                {orisha.name}
              </h4>
              <p
                style={{
                  margin: '0 0 0.5rem',
                  fontSize: '0.75rem',
                  color: 'var(--muted-foreground)',
                }}
              >
                {orisha.domain}
              </p>

              {isSelected && (
                <p style={{ margin: 0, fontSize: '0.8rem', lineHeight: 1.4 }}>
                  {orisha.description}
                </p>
              )}

              {/* Camino selector when expanded */}
              {isSelected && isExpanded && orisha.caminos && (
                <div style={{ marginTop: '0.75rem' }}>
                  <label
                    style={{
                      fontSize: '0.75rem',
                      color: 'var(--muted-foreground)',
                      display: 'block',
                      marginBottom: '0.5rem',
                    }}
                  >
                    Select Camino (Road)
                  </label>
                  <select
                    value={selectedCamino || ''}
                    onChange={(e) => onCaminoChange?.(e.target.value || undefined)}
                    onClick={(e) => e.stopPropagation()}
                    disabled={disabled}
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      borderRadius: '6px',
                      border: '1px solid var(--border)',
                      backgroundColor: 'var(--background)',
                      color: 'var(--foreground)',
                      fontSize: '0.875rem',
                    }}
                  >
                    <option value="">General {orisha.name}</option>
                    {orisha.caminos.map((camino) => (
                      <option key={camino} value={camino}>
                        {camino}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Secondary influences */}
      <div style={{ marginTop: '1rem' }}>
        <label className="label">Secondary Influences (up to 3)</label>
        <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', margin: '0 0 0.75rem' }}>
          Click on other Orisha cards while holding Ctrl/Cmd, or use the checkboxes below
        </p>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {ORISHA_DATA.filter((o) => o.name !== selectedOrisha).map((orisha) => {
            const influence = secondaryInfluences.find((i) => i.orisha === orisha.name);
            const isSecondary = !!influence;

            return (
              <div
                key={orisha.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.5rem 0.75rem',
                  borderRadius: '8px',
                  border: `1px solid ${isSecondary ? orisha.colors[0] : 'var(--border)'}`,
                  backgroundColor: isSecondary ? `${orisha.colors[0]}10` : 'transparent',
                  cursor: disabled ? 'not-allowed' : 'pointer',
                  opacity: disabled ? 0.5 : 1,
                }}
                onClick={() => handleSecondaryToggle(orisha.name)}
              >
                <input
                  type="checkbox"
                  checked={isSecondary}
                  onChange={() => {}}
                  disabled={disabled || (!isSecondary && secondaryInfluences.length >= 3)}
                  style={{ cursor: 'inherit' }}
                />
                <span style={{ fontSize: '0.875rem' }}>{orisha.name}</span>

                {isSecondary && (
                  <input
                    type="range"
                    min="0.1"
                    max="0.9"
                    step="0.1"
                    value={influence?.strength || 0.5}
                    onChange={(e) => handleStrengthChange(orisha.name, parseFloat(e.target.value))}
                    onClick={(e) => e.stopPropagation()}
                    disabled={disabled}
                    style={{ width: '60px' }}
                    title={`Strength: ${Math.round((influence?.strength || 0.5) * 100)}%`}
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
