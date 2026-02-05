'use client';

import type {
  VisualSignature,
  VoiceSignature,
  MusicSignature,
  MovementSignature,
  MultiModalSignature,
} from '../../lib/imprint-api';

interface MultiModalPreviewProps {
  signature?: MultiModalSignature | null;
  compact?: boolean;
}

function ColorSwatch({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '4px',
        backgroundColor: color,
        border: color.toLowerCase() === '#ffffff' ? '1px solid var(--border)' : 'none',
        boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
      }}
      title={color}
    />
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: 'inline-block',
        padding: '0.25rem 0.5rem',
        borderRadius: '12px',
        backgroundColor: 'var(--muted)',
        fontSize: '0.75rem',
        margin: '0.125rem',
      }}
    >
      {children}
    </span>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        padding: '1rem',
        backgroundColor: 'var(--card)',
        borderRadius: '12px',
        border: '1px solid var(--border)',
      }}
    >
      <h4
        style={{
          margin: '0 0 0.75rem',
          fontSize: '0.9rem',
          fontWeight: 600,
        }}
      >
        {title}
      </h4>
      {children}
    </div>
  );
}

function VisualPreview({ visual }: { visual: VisualSignature }) {
  return (
    <Section title="Visual Signature" >
      <div style={{ marginBottom: '0.75rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Primary Colors
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {visual.primaryColors.map((color, i) => (
            <ColorSwatch key={i} color={color} size={32} />
          ))}
        </div>
      </div>

      {visual.secondaryColors.length > 0 && (
        <div style={{ marginBottom: '0.75rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
            Secondary Colors
          </div>
          <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
            {visual.secondaryColors.map((color, i) => (
              <ColorSwatch key={i} color={color} size={20} />
            ))}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Aesthetic Style
        </div>
        <div style={{ fontWeight: 500 }}>{visual.aestheticStyle}</div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Light Quality
        </div>
        <div>{visual.lightQuality}</div>
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Patterns & Textures
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {visual.patterns.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
          {visual.textures.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>

      {visual.symbolMotifs.length > 0 && (
        <div style={{ marginTop: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
            Symbol Motifs
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {visual.symbolMotifs.map((s) => (
              <Chip key={s}>{s}</Chip>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function VoicePreview({ voice }: { voice: VoiceSignature }) {
  return (
    <Section title="Voice Signature" >
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Pitch Range
        </div>
        <div style={{ fontWeight: 500 }}>{voice.pitchRange}</div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Timbre
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {voice.timbre.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Speech Patterns
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {voice.speechPatterns.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Rhythmic Quality
        </div>
        <div>{voice.rhythmicQuality}</div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Emotional Resonance
        </div>
        <div>{voice.emotionalResonance}</div>
      </div>

      {voice.accentInfluences.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
            Accent Influences
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {voice.accentInfluences.map((a) => (
              <Chip key={a}>{a}</Chip>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function MusicPreview({ music }: { music: MusicSignature }) {
  return (
    <Section title="Music Signature" >
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
            Key Signature
          </div>
          <div style={{ fontWeight: 500 }}>{music.keySignature}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
            Mode
          </div>
          <div style={{ fontWeight: 500 }}>{music.mode}</div>
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Tempo Range
        </div>
        <div>
          {music.tempoRange.min} - {music.tempoRange.max} BPM
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Harmonic Complexity
        </div>
        <div>{music.harmonicComplexity}</div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Primary Instruments
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {music.primaryInstruments.map((i) => (
            <Chip key={i}>{i}</Chip>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Rhythmic Patterns
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {music.rhythmicPatterns.map((r) => (
            <Chip key={r}>{r}</Chip>
          ))}
        </div>
      </div>

      {music.genreInfluences.length > 0 && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
            Genre Influences
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {music.genreInfluences.map((g) => (
              <Chip key={g}>{g}</Chip>
            ))}
          </div>
        </div>
      )}
    </Section>
  );
}

function MovementPreview({ movement }: { movement: MovementSignature }) {
  return (
    <Section title="Movement Signature" >
      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Quality of Motion
        </div>
        <div style={{ fontWeight: 500 }}>{movement.qualityOfMotion}</div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
            Tempo Preference
          </div>
          <div>{movement.tempoPreference}</div>
        </div>
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
            Spatial Orientation
          </div>
          <div>{movement.spatialOrientation}</div>
        </div>
      </div>

      <div style={{ marginBottom: '0.5rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Gesture Vocabulary
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {movement.gestureVocabulary.map((g) => (
            <Chip key={g}>{g}</Chip>
          ))}
        </div>
      </div>

      {movement.danceInfluences.length > 0 && (
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
            Dance Influences
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap' }}>
            {movement.danceInfluences.map((d) => (
              <Chip key={d}>{d}</Chip>
            ))}
          </div>
        </div>
      )}

      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--muted-foreground)', marginBottom: '0.25rem' }}>
          Posture Characteristics
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap' }}>
          {movement.postureCharacteristics.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function MultiModalPreview({ signature, compact }: MultiModalPreviewProps) {
  if (!signature) {
    return (
      <div
        style={{
          padding: '2rem',
          textAlign: 'center',
          color: 'var(--muted-foreground)',
          backgroundColor: 'var(--muted)',
          borderRadius: '12px',
        }}
      >
        No multi-modal signature generated yet.
        <br />
        <span style={{ fontSize: '0.8rem' }}>
          Select an Orisha and configure the psychological state to generate signatures.
        </span>
      </div>
    );
  }

  if (compact) {
    // Compact view showing just colors and key attributes
    return (
      <div
        style={{
          padding: '1rem',
          backgroundColor: 'var(--card)',
          borderRadius: '12px',
          border: '1px solid var(--border)',
        }}
      >
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
          {signature.visual.primaryColors.map((color, i) => (
            <ColorSwatch key={i} color={color} size={28} />
          ))}
        </div>
        <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <strong>Voice:</strong> {signature.voice.pitchRange}, {signature.voice.timbre[0]}
        </div>
        <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}>
          <strong>Music:</strong> {signature.music.keySignature} {signature.music.mode}
        </div>
        <div style={{ fontSize: '0.8rem' }}>
          <strong>Movement:</strong> {signature.movement.qualityOfMotion}
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
      }}
    >
      <VisualPreview visual={signature.visual} />
      <VoicePreview voice={signature.voice} />
      <MusicPreview music={signature.music} />
      <MovementPreview movement={signature.movement} />
    </div>
  );
}
