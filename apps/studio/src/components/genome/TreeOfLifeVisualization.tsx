'use client';

import { useState, useMemo } from 'react';

interface SephiraData {
  name: string;
  hebrewName: string;
  meaning: string;
  pillar: 'Mercy' | 'Severity' | 'Balance';
  x: number;
  y: number;
}

interface PathData {
  from: string;
  to: string;
}

// Sephiroth positions for 400x600 viewport
const SEPHIROTH: SephiraData[] = [
  { name: 'Kether', hebrewName: 'כֶּתֶר', meaning: 'Crown', pillar: 'Balance', x: 200, y: 40 },
  { name: 'Chokmah', hebrewName: 'חָכְמָה', meaning: 'Wisdom', pillar: 'Mercy', x: 320, y: 100 },
  { name: 'Binah', hebrewName: 'בִּינָה', meaning: 'Understanding', pillar: 'Severity', x: 80, y: 100 },
  { name: 'Chesed', hebrewName: 'חֶסֶד', meaning: 'Mercy', pillar: 'Mercy', x: 320, y: 220 },
  { name: 'Geburah', hebrewName: 'גְּבוּרָה', meaning: 'Strength', pillar: 'Severity', x: 80, y: 220 },
  { name: 'Tiphareth', hebrewName: 'תִּפְאֶרֶת', meaning: 'Beauty', pillar: 'Balance', x: 200, y: 280 },
  { name: 'Netzach', hebrewName: 'נֵצַח', meaning: 'Victory', pillar: 'Mercy', x: 320, y: 380 },
  { name: 'Hod', hebrewName: 'הוֹד', meaning: 'Splendor', pillar: 'Severity', x: 80, y: 380 },
  { name: 'Yesod', hebrewName: 'יְסוֹד', meaning: 'Foundation', pillar: 'Balance', x: 200, y: 440 },
  { name: 'Malkuth', hebrewName: 'מַלְכוּת', meaning: 'Kingdom', pillar: 'Balance', x: 200, y: 540 },
];

// Daath - the hidden Sephira
const DAATH: SephiraData = {
  name: 'Daath',
  hebrewName: 'דַּעַת',
  meaning: 'Knowledge',
  pillar: 'Balance',
  x: 200,
  y: 160,
};

// 22 paths connecting the Sephiroth
const PATHS: PathData[] = [
  { from: 'Kether', to: 'Chokmah' },
  { from: 'Kether', to: 'Binah' },
  { from: 'Kether', to: 'Tiphareth' },
  { from: 'Chokmah', to: 'Binah' },
  { from: 'Chokmah', to: 'Chesed' },
  { from: 'Chokmah', to: 'Tiphareth' },
  { from: 'Binah', to: 'Geburah' },
  { from: 'Binah', to: 'Tiphareth' },
  { from: 'Chesed', to: 'Geburah' },
  { from: 'Chesed', to: 'Tiphareth' },
  { from: 'Chesed', to: 'Netzach' },
  { from: 'Geburah', to: 'Tiphareth' },
  { from: 'Geburah', to: 'Hod' },
  { from: 'Tiphareth', to: 'Netzach' },
  { from: 'Tiphareth', to: 'Hod' },
  { from: 'Tiphareth', to: 'Yesod' },
  { from: 'Netzach', to: 'Hod' },
  { from: 'Netzach', to: 'Yesod' },
  { from: 'Netzach', to: 'Malkuth' },
  { from: 'Hod', to: 'Yesod' },
  { from: 'Hod', to: 'Malkuth' },
  { from: 'Yesod', to: 'Malkuth' },
];

// Pillar colors
const PILLAR_COLORS = {
  Mercy: '#3b82f6', // Blue
  Severity: '#ef4444', // Red
  Balance: '#f59e0b', // Gold/Amber
};

interface TreeOfLifeVisualizationProps {
  selectedSephira?: string | null;
  onSephiraSelect?: (sephira: string) => void;
  showDaath?: boolean;
  showQliphoth?: boolean;
  highlightPaths?: boolean;
  className?: string;
  width?: number;
  height?: number;
}

export function TreeOfLifeVisualization({
  selectedSephira,
  onSephiraSelect,
  showDaath = true,
  showQliphoth = false,
  highlightPaths = true,
  className,
  width = 400,
  height = 600,
}: TreeOfLifeVisualizationProps) {
  const [hoveredSephira, setHoveredSephira] = useState<string | null>(null);

  // Scale factor for responsive sizing
  const scaleX = width / 400;
  const scaleY = height / 600;

  const getSephiraPosition = (name: string): { x: number; y: number } | null => {
    if (name === 'Daath') return { x: DAATH.x * scaleX, y: DAATH.y * scaleY };
    const sephira = SEPHIROTH.find((s) => s.name === name);
    return sephira ? { x: sephira.x * scaleX, y: sephira.y * scaleY } : null;
  };

  // Paths connected to selected Sephira
  const connectedPaths = useMemo(() => {
    if (!selectedSephira || !highlightPaths) return new Set<string>();
    const connected = new Set<string>();
    PATHS.forEach((path) => {
      if (path.from === selectedSephira || path.to === selectedSephira) {
        connected.add(`${path.from}-${path.to}`);
      }
    });
    return connected;
  }, [selectedSephira, highlightPaths]);

  const renderPath = (path: PathData, index: number) => {
    const from = getSephiraPosition(path.from);
    const to = getSephiraPosition(path.to);
    if (!from || !to) return null;

    const pathKey = `${path.from}-${path.to}`;
    const isConnected = connectedPaths.has(pathKey);

    return (
      <line
        key={index}
        x1={from.x}
        y1={from.y}
        x2={to.x}
        y2={to.y}
        stroke={isConnected ? 'var(--primary)' : 'var(--border)'}
        strokeWidth={isConnected ? 2.5 : 1.5}
        strokeOpacity={isConnected ? 1 : 0.4}
      />
    );
  };

  const renderSephira = (sephira: SephiraData, isDaath = false) => {
    const x = sephira.x * scaleX;
    const y = sephira.y * scaleY;
    const radius = 28 * Math.min(scaleX, scaleY);
    const isSelected = selectedSephira === sephira.name;
    const isHovered = hoveredSephira === sephira.name;
    const isInteractive = !!onSephiraSelect;

    return (
      <g
        key={sephira.name}
        onClick={() => onSephiraSelect?.(sephira.name)}
        onMouseEnter={() => setHoveredSephira(sephira.name)}
        onMouseLeave={() => setHoveredSephira(null)}
        style={{ cursor: isInteractive ? 'pointer' : 'default' }}
      >
        {/* Glow effect for selected */}
        {isSelected && (
          <circle
            cx={x}
            cy={y}
            r={radius + 8}
            fill="none"
            stroke={PILLAR_COLORS[sephira.pillar]}
            strokeWidth={3}
            strokeOpacity={0.5}
            className="animate-pulse"
          />
        )}

        {/* Main circle */}
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={isSelected ? PILLAR_COLORS[sephira.pillar] : 'var(--background)'}
          stroke={PILLAR_COLORS[sephira.pillar]}
          strokeWidth={isDaath ? 2 : 3}
          strokeDasharray={isDaath ? '5,3' : undefined}
          opacity={isDaath ? 0.7 : 1}
          style={{
            transition: 'all 0.2s ease',
            transform: isHovered ? `scale(1.1)` : undefined,
            transformOrigin: `${x}px ${y}px`,
          }}
        />

        {/* Sephira name */}
        <text
          x={x}
          y={y - 4}
          textAnchor="middle"
          fill={isSelected ? 'white' : 'var(--foreground)'}
          fontSize={10 * Math.min(scaleX, scaleY)}
          fontWeight="bold"
        >
          {sephira.name}
        </text>

        {/* Hebrew name */}
        <text
          x={x}
          y={y + 10}
          textAnchor="middle"
          fill={isSelected ? 'rgba(255,255,255,0.8)' : 'var(--muted-foreground)'}
          fontSize={9 * Math.min(scaleX, scaleY)}
        >
          {sephira.hebrewName}
        </text>
      </g>
    );
  };

  // Render Qliphothic shadow (inverted tree below)
  const renderQliphoth = () => {
    if (!showQliphoth) return null;

    const qliphothY = height * 0.95; // Start of qliphothic reflection

    return (
      <g opacity={0.3} transform={`scale(1, -0.4) translate(0, ${-qliphothY * 3.5})`}>
        {/* Paths */}
        {PATHS.map((path, i) => {
          const from = getSephiraPosition(path.from);
          const to = getSephiraPosition(path.to);
          if (!from || !to) return null;
          return (
            <line
              key={`qlip-path-${i}`}
              x1={from.x}
              y1={from.y}
              x2={to.x}
              y2={to.y}
              stroke="var(--destructive)"
              strokeWidth={1}
              strokeOpacity={0.3}
            />
          );
        })}
        {/* Sephiroth as dark circles */}
        {SEPHIROTH.map((sephira) => {
          const x = sephira.x * scaleX;
          const y = sephira.y * scaleY;
          const radius = 20 * Math.min(scaleX, scaleY);
          return (
            <circle
              key={`qlip-${sephira.name}`}
              cx={x}
              cy={y}
              r={radius}
              fill="var(--destructive)"
              opacity={0.2}
            />
          );
        })}
      </g>
    );
  };

  return (
    <div className={className} style={{ position: 'relative' }}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: 'visible' }}
      >
        {/* Background gradient */}
        <defs>
          <radialGradient id="treeGlow" cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.1} />
            <stop offset="100%" stopColor="transparent" stopOpacity={0} />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={width} height={height} fill="url(#treeGlow)" />

        {/* Pillar guidelines (optional visual aid) */}
        <line
          x1={80 * scaleX}
          y1={50 * scaleY}
          x2={80 * scaleX}
          y2={450 * scaleY}
          stroke={PILLAR_COLORS.Severity}
          strokeWidth={1}
          strokeOpacity={0.1}
          strokeDasharray="4,4"
        />
        <line
          x1={200 * scaleX}
          y1={20 * scaleY}
          x2={200 * scaleX}
          y2={560 * scaleY}
          stroke={PILLAR_COLORS.Balance}
          strokeWidth={1}
          strokeOpacity={0.1}
          strokeDasharray="4,4"
        />
        <line
          x1={320 * scaleX}
          y1={50 * scaleY}
          x2={320 * scaleX}
          y2={450 * scaleY}
          stroke={PILLAR_COLORS.Mercy}
          strokeWidth={1}
          strokeOpacity={0.1}
          strokeDasharray="4,4"
        />

        {/* Qliphothic shadow */}
        {renderQliphoth()}

        {/* Paths */}
        {PATHS.map(renderPath)}

        {/* Sephiroth */}
        {SEPHIROTH.map((s) => renderSephira(s))}

        {/* Daath (hidden Sephira) */}
        {showDaath && renderSephira(DAATH, true)}
      </svg>

      {/* Tooltip for hovered Sephira */}
      {hoveredSephira && (
        <div
          style={{
            position: 'absolute',
            bottom: '8px',
            left: '50%',
            transform: 'translateX(-50%)',
            backgroundColor: 'var(--popover)',
            border: '1px solid var(--border)',
            borderRadius: '8px',
            padding: '8px 12px',
            fontSize: '0.875rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            zIndex: 10,
            whiteSpace: 'nowrap',
          }}
        >
          <strong>
            {hoveredSephira === 'Daath'
              ? DAATH.name
              : SEPHIROTH.find((s) => s.name === hoveredSephira)?.name}
          </strong>
          {' — '}
          {hoveredSephira === 'Daath'
            ? DAATH.meaning
            : SEPHIROTH.find((s) => s.name === hoveredSephira)?.meaning}
        </div>
      )}
    </div>
  );
}
