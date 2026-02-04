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
        stroke={isConnected ? '#ffffff' : 'rgba(255,255,255,0.15)'}
        strokeWidth={isConnected ? 1.5 : 0.75}
        strokeOpacity={isConnected ? 0.9 : 0.4}
        filter={isConnected ? 'url(#pathGlow)' : undefined}
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
        {/* Outer glow ring for selected */}
        {isSelected && (
          <>
            <circle
              cx={x}
              cy={y}
              r={radius + 12}
              fill="none"
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={1}
              filter="url(#nodeGlow)"
            />
            <circle
              cx={x}
              cy={y}
              r={radius + 6}
              fill="none"
              stroke="rgba(255,255,255,0.4)"
              strokeWidth={1.5}
              filter="url(#nodeGlow)"
              className="animate-pulse"
            />
          </>
        )}

        {/* Hover glow */}
        {isHovered && !isSelected && (
          <circle
            cx={x}
            cy={y}
            r={radius + 4}
            fill="none"
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={1}
            filter="url(#nodeGlow)"
          />
        )}

        {/* Main circle */}
        <circle
          cx={x}
          cy={y}
          r={radius}
          fill={isSelected ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.8)'}
          stroke={isSelected ? '#ffffff' : isDaath ? 'rgba(255,255,255,0.3)' : 'rgba(255,255,255,0.5)'}
          strokeWidth={isSelected ? 2 : isDaath ? 1 : 1.5}
          strokeDasharray={isDaath ? '4,3' : undefined}
          opacity={isDaath ? 0.7 : 1}
          filter={isSelected ? 'url(#nodeGlow)' : undefined}
          style={{
            transition: 'all 0.3s ease',
            transform: isHovered ? `scale(1.08)` : undefined,
            transformOrigin: `${x}px ${y}px`,
          }}
        />

        {/* Sephira name */}
        <text
          x={x}
          y={y - 4}
          textAnchor="middle"
          fill={isSelected ? '#ffffff' : 'rgba(255,255,255,0.85)'}
          fontSize={10 * Math.min(scaleX, scaleY)}
          fontWeight={isSelected ? '600' : '400'}
          fontFamily="monospace"
          letterSpacing="0.5px"
          filter={isSelected ? 'url(#textGlow)' : undefined}
        >
          {sephira.name}
        </text>

        {/* Hebrew name */}
        <text
          x={x}
          y={y + 10}
          textAnchor="middle"
          fill={isSelected ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)'}
          fontSize={9 * Math.min(scaleX, scaleY)}
          fontFamily="serif"
        >
          {sephira.hebrewName}
        </text>
      </g>
    );
  };

  // Render Qliphothic shadow (inverted tree below)
  const renderQliphoth = () => {
    if (!showQliphoth) return null;

    const qliphothY = height * 0.95;

    return (
      <g opacity={0.2} transform={`scale(1, -0.4) translate(0, ${-qliphothY * 3.5})`}>
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
              stroke="rgba(255,255,255,0.15)"
              strokeWidth={0.5}
              strokeOpacity={0.3}
            />
          );
        })}
        {/* Sephiroth as dark circles */}
        {SEPHIROTH.map((sephira) => {
          const x = sephira.x * scaleX;
          const y = sephira.y * scaleY;
          const r = 20 * Math.min(scaleX, scaleY);
          return (
            <circle
              key={`qlip-${sephira.name}`}
              cx={x}
              cy={y}
              r={r}
              fill="rgba(255,255,255,0.05)"
              stroke="rgba(255,255,255,0.1)"
              strokeWidth={0.5}
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
        <defs>
          {/* Bio-tech glow filter for nodes */}
          <filter id="nodeGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Subtle glow for active paths */}
          <filter id="pathGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Text glow for selected labels */}
          <filter id="textGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Subtle radial vignette */}
          <radialGradient id="treeVignette" cx="50%" cy="45%" r="65%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.03)" />
            <stop offset="100%" stopColor="transparent" />
          </radialGradient>

          {/* Vertical scan line effect */}
          <pattern id="scanlines" width="4" height="4" patternUnits="userSpaceOnUse">
            <line x1="0" y1="0" x2="0" y2="4" stroke="rgba(255,255,255,0.02)" strokeWidth="1" />
          </pattern>
        </defs>

        {/* Black background */}
        <rect x={0} y={0} width={width} height={height} fill="#0a0a0a" rx={8} />

        {/* Scanline overlay */}
        <rect x={0} y={0} width={width} height={height} fill="url(#scanlines)" rx={8} />

        {/* Subtle center glow */}
        <rect x={0} y={0} width={width} height={height} fill="url(#treeVignette)" rx={8} />

        {/* Pillar guidelines — monochrome, very subtle */}
        <line
          x1={80 * scaleX}
          y1={50 * scaleY}
          x2={80 * scaleX}
          y2={450 * scaleY}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
          strokeDasharray="2,6"
        />
        <line
          x1={200 * scaleX}
          y1={20 * scaleY}
          x2={200 * scaleX}
          y2={560 * scaleY}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
          strokeDasharray="2,6"
        />
        <line
          x1={320 * scaleX}
          y1={50 * scaleY}
          x2={320 * scaleX}
          y2={450 * scaleY}
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={1}
          strokeDasharray="2,6"
        />

        {/* Pillar labels — minimal */}
        <text
          x={80 * scaleX}
          y={470 * scaleY}
          textAnchor="middle"
          fill="rgba(255,255,255,0.15)"
          fontSize={8 * Math.min(scaleX, scaleY)}
          fontFamily="monospace"
          letterSpacing="2px"
        >
          SEVERITY
        </text>
        <text
          x={200 * scaleX}
          y={575 * scaleY}
          textAnchor="middle"
          fill="rgba(255,255,255,0.15)"
          fontSize={8 * Math.min(scaleX, scaleY)}
          fontFamily="monospace"
          letterSpacing="2px"
        >
          BALANCE
        </text>
        <text
          x={320 * scaleX}
          y={470 * scaleY}
          textAnchor="middle"
          fill="rgba(255,255,255,0.15)"
          fontSize={8 * Math.min(scaleX, scaleY)}
          fontFamily="monospace"
          letterSpacing="2px"
        >
          MERCY
        </text>

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
            backgroundColor: 'rgba(0,0,0,0.95)',
            border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '4px',
            padding: '8px 14px',
            fontSize: '0.8rem',
            fontFamily: 'monospace',
            color: 'rgba(255,255,255,0.9)',
            boxShadow: '0 0 20px rgba(255,255,255,0.05)',
            zIndex: 10,
            whiteSpace: 'nowrap',
            letterSpacing: '0.3px',
          }}
        >
          <strong style={{ color: '#ffffff' }}>
            {hoveredSephira === 'Daath'
              ? DAATH.name
              : SEPHIROTH.find((s) => s.name === hoveredSephira)?.name}
          </strong>
          <span style={{ color: 'rgba(255,255,255,0.4)', margin: '0 6px' }}>//</span>
          <span style={{ color: 'rgba(255,255,255,0.6)' }}>
            {hoveredSephira === 'Daath'
              ? DAATH.meaning
              : SEPHIROTH.find((s) => s.name === hoveredSephira)?.meaning}
          </span>
        </div>
      )}
    </div>
  );
}
