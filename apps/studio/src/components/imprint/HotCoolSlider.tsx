'use client';

interface HotCoolSliderProps {
  value: number; // -1 (cool/Rada) to 1 (hot/Petwo)
  onChange?: (value: number) => void;
  disabled?: boolean;
  showLabels?: boolean;
}

export function HotCoolSlider({
  value,
  onChange,
  disabled,
  showLabels = true,
}: HotCoolSliderProps) {
  // Convert -1 to 1 range to 0-100 for the slider
  const sliderValue = ((value + 1) / 2) * 100;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSliderValue = parseFloat(e.target.value);
    const newValue = (newSliderValue / 100) * 2 - 1;
    onChange?.(newValue);
  };

  // Calculate gradient position based on value
  const gradientPosition = sliderValue;

  // Determine the current state label
  const getStateLabel = () => {
    if (value <= -0.7) return { label: 'Very Cool (Rada)', description: 'Serene, measured, traditional' };
    if (value <= -0.3) return { label: 'Cool', description: 'Calm, balanced, composed' };
    if (value < 0.3) return { label: 'Balanced', description: 'Adaptive, flexible, centered' };
    if (value < 0.7) return { label: 'Hot', description: 'Passionate, intense, dynamic' };
    return { label: 'Very Hot (Petwo)', description: 'Fierce, transformative, wild' };
  };

  const stateInfo = getStateLabel();

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label className="label">Hot/Cool Axis</label>

      <p style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)', margin: 0 }}>
        The psychological temperature: Cool (Rada) represents measured tradition,
        Hot (Petwo) represents fierce transformation.
      </p>

      <div
        style={{
          position: 'relative',
          padding: '1rem',
          borderRadius: '12px',
          backgroundColor: 'var(--card)',
          border: '1px solid var(--border)',
        }}
      >
        {/* Gradient background bar */}
        <div
          style={{
            height: '12px',
            borderRadius: '6px',
            background: 'linear-gradient(to right, #3b82f6, #8b5cf6, #ef4444)',
            marginBottom: '0.75rem',
            position: 'relative',
          }}
        >
          {/* Position indicator */}
          <div
            style={{
              position: 'absolute',
              left: `${gradientPosition}%`,
              top: '50%',
              transform: 'translate(-50%, -50%)',
              width: '20px',
              height: '20px',
              borderRadius: '50%',
              backgroundColor: 'white',
              border: '3px solid var(--foreground)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
              transition: 'left 0.1s ease',
            }}
          />
        </div>

        {/* Invisible range input overlaying the gradient */}
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          value={sliderValue}
          onChange={handleChange}
          disabled={disabled}
          style={{
            width: '100%',
            position: 'absolute',
            top: '1rem',
            left: 0,
            right: 0,
            height: '12px',
            opacity: 0,
            cursor: disabled ? 'not-allowed' : 'pointer',
          }}
        />

        {/* Labels */}
        {showLabels && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              fontSize: '0.75rem',
              color: 'var(--muted-foreground)',
            }}
          >
            <span style={{ color: '#3b82f6' }}>Cool (Rada)</span>
            <span style={{ color: '#8b5cf6' }}>Balanced</span>
            <span style={{ color: '#ef4444' }}>Hot (Petwo)</span>
          </div>
        )}

        {/* Current state display */}
        <div
          style={{
            marginTop: '1rem',
            padding: '0.75rem',
            borderRadius: '8px',
            backgroundColor: 'var(--muted)',
            textAlign: 'center',
          }}
        >
          <div style={{ fontWeight: 600, marginBottom: '0.25rem' }}>{stateInfo.label}</div>
          <div style={{ fontSize: '0.8rem', color: 'var(--muted-foreground)' }}>
            {stateInfo.description}
          </div>
        </div>
      </div>

      {/* Value display */}
      <div
        style={{
          fontSize: '0.8rem',
          color: 'var(--muted-foreground)',
          textAlign: 'center',
        }}
      >
        Value: {value.toFixed(2)}
      </div>
    </div>
  );
}
