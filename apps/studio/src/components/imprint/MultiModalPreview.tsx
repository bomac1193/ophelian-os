'use client';

import type {
  VisualSignature,
  VoiceSignature,
  MusicSignature,
  MovementSignature,
  MultiModalSignature,
} from '../../lib/imprint-api';
import styles from './MultiModalPreview.module.css';

interface MultiModalPreviewProps {
  signature?: MultiModalSignature | null;
  compact?: boolean;
}

function ColorSwatch({ color, size = 24 }: { color: string; size?: number }) {
  return (
    <div
      className={`${styles.colorSwatch} ${color.toLowerCase() === '#ffffff' ? styles.white : ''}`}
      style={{
        width: size,
        height: size,
        backgroundColor: color,
      }}
      title={color}
    />
  );
}

function Chip({ children }: { children: React.ReactNode }) {
  return (
    <span className={styles.chip}>
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
    <div className={styles.section}>
      <h4 className={styles.sectionTitle}>
        {title}
      </h4>
      {children}
    </div>
  );
}

function VisualPreview({ visual }: { visual: VisualSignature }) {
  return (
    <Section title="Visual Signature" >
      <div className={styles.fieldGroup}>
        <div className={styles.fieldLabel}>
          Primary Colors
        </div>
        <div className={styles.colorGrid}>
          {visual.primaryColors.map((color, i) => (
            <ColorSwatch key={i} color={color} size={32} />
          ))}
        </div>
      </div>

      {visual.secondaryColors.length > 0 && (
        <div className={styles.fieldGroup}>
          <div className={styles.fieldLabel}>
            Secondary Colors
          </div>
          <div className={styles.colorGridSecondary}>
            {visual.secondaryColors.map((color, i) => (
              <ColorSwatch key={i} color={color} size={20} />
            ))}
          </div>
        </div>
      )}

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Aesthetic Style
        </div>
        <div className={styles.fieldValue}>{visual.aestheticStyle}</div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Light Quality
        </div>
        <div>{visual.lightQuality}</div>
      </div>

      <div>
        <div className={styles.fieldLabel}>
          Patterns & Textures
        </div>
        <div className={styles.chipContainer}>
          {visual.patterns.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
          {visual.textures.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>

      {visual.symbolMotifs.length > 0 && (
        <div className={styles.fieldGroupSmall}>
          <div className={styles.fieldLabel}>
            Symbol Motifs
          </div>
          <div className={styles.chipContainer}>
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
      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Pitch Range
        </div>
        <div className={styles.fieldValue}>{voice.pitchRange}</div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Timbre
        </div>
        <div className={styles.chipContainer}>
          {voice.timbre.map((t) => (
            <Chip key={t}>{t}</Chip>
          ))}
        </div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Speech Patterns
        </div>
        <div className={styles.chipContainer}>
          {voice.speechPatterns.map((p) => (
            <Chip key={p}>{p}</Chip>
          ))}
        </div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Rhythmic Quality
        </div>
        <div>{voice.rhythmicQuality}</div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Emotional Resonance
        </div>
        <div>{voice.emotionalResonance}</div>
      </div>

      {voice.accentInfluences.length > 0 && (
        <div>
          <div className={styles.fieldLabel}>
            Accent Influences
          </div>
          <div className={styles.chipContainer}>
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
      <div className={styles.twoColumnGrid}>
        <div>
          <div className={styles.fieldLabel}>
            Key Signature
          </div>
          <div className={styles.fieldValue}>{music.keySignature}</div>
        </div>
        <div>
          <div className={styles.fieldLabel}>
            Mode
          </div>
          <div className={styles.fieldValue}>{music.mode}</div>
        </div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Tempo Range
        </div>
        <div>
          {music.tempoRange.min} - {music.tempoRange.max} BPM
        </div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Harmonic Complexity
        </div>
        <div>{music.harmonicComplexity}</div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Primary Instruments
        </div>
        <div className={styles.chipContainer}>
          {music.primaryInstruments.map((i) => (
            <Chip key={i}>{i}</Chip>
          ))}
        </div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Rhythmic Patterns
        </div>
        <div className={styles.chipContainer}>
          {music.rhythmicPatterns.map((r) => (
            <Chip key={r}>{r}</Chip>
          ))}
        </div>
      </div>

      {music.genreInfluences.length > 0 && (
        <div>
          <div className={styles.fieldLabel}>
            Genre Influences
          </div>
          <div className={styles.chipContainer}>
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
      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Quality of Motion
        </div>
        <div className={styles.fieldValue}>{movement.qualityOfMotion}</div>
      </div>

      <div className={styles.twoColumnGrid}>
        <div>
          <div className={styles.fieldLabel}>
            Tempo Preference
          </div>
          <div>{movement.tempoPreference}</div>
        </div>
        <div>
          <div className={styles.fieldLabel}>
            Spatial Orientation
          </div>
          <div>{movement.spatialOrientation}</div>
        </div>
      </div>

      <div className={styles.fieldGroupSmall}>
        <div className={styles.fieldLabel}>
          Gesture Vocabulary
        </div>
        <div className={styles.chipContainer}>
          {movement.gestureVocabulary.map((g) => (
            <Chip key={g}>{g}</Chip>
          ))}
        </div>
      </div>

      {movement.danceInfluences.length > 0 && (
        <div className={styles.fieldGroupSmall}>
          <div className={styles.fieldLabel}>
            Dance Influences
          </div>
          <div className={styles.chipContainer}>
            {movement.danceInfluences.map((d) => (
              <Chip key={d}>{d}</Chip>
            ))}
          </div>
        </div>
      )}

      <div>
        <div className={styles.fieldLabel}>
          Posture Characteristics
        </div>
        <div className={styles.chipContainer}>
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
      <div className={styles.noSignature}>
        No multi-modal signature generated yet.
        <br />
        <span className={styles.hint}>
          Select an Orisha and configure the psychological state to generate signatures.
        </span>
      </div>
    );
  }

  if (compact) {
    // Compact view showing just colors and key attributes
    return (
      <div className={styles.compactView}>
        <div className={styles.compactColors}>
          {signature.visual.primaryColors.map((color, i) => (
            <ColorSwatch key={i} color={color} size={28} />
          ))}
        </div>
        <div className={styles.compactInfo}>
          <strong>Voice:</strong> {signature.voice.pitchRange}, {signature.voice.timbre[0]}
        </div>
        <div className={styles.compactInfo}>
          <strong>Music:</strong> {signature.music.keySignature} {signature.music.mode}
        </div>
        <div className={styles.compactInfo}>
          <strong>Movement:</strong> {signature.movement.qualityOfMotion}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.fullView}>
      <VisualPreview visual={signature.visual} />
      <VoicePreview voice={signature.voice} />
      <MusicPreview music={signature.music} />
      <MovementPreview movement={signature.movement} />
    </div>
  );
}
