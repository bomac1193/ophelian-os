/**
 * Archetype Dynamics Component
 * Shows growth/stress arrows and shadow forms for THE TWELVE subtaste system
 */

'use client';

import React from 'react';
import { SUBTASTE_ARROWS, SUBTASTE_DESIGNATIONS, type SubtasteDesignation } from '@lcos/oripheon';
import styles from './ArchetypeDynamics.module.css';

interface ArchetypeDynamicsProps {
  aestheticClass: string;
  compact?: boolean;
}

export function ArchetypeDynamics({ aestheticClass, compact = false }: ArchetypeDynamicsProps) {
  const currentSubtaste = SUBTASTE_DESIGNATIONS[aestheticClass];
  const arrows = SUBTASTE_ARROWS[aestheticClass];

  if (!currentSubtaste || !arrows) {
    return null;
  }

  const growthSubtaste = SUBTASTE_DESIGNATIONS[arrows.growth];
  const stressSubtaste = SUBTASTE_DESIGNATIONS[arrows.stress];

  if (compact) {
    return (
      <div className={styles.compactContainer}>
        <div className={styles.compactArrows}>
          <div className={styles.compactArrow} title={`Growth → ${growthSubtaste?.glyph || arrows.growth}`}>
            <span className={styles.arrowIcon}>↗</span>
            <span className={styles.arrowGlyph}>{growthSubtaste?.glyph || arrows.growth}</span>
          </div>
          <div className={styles.compactArrow} title={`Stress → ${stressSubtaste?.glyph || arrows.stress}`}>
            <span className={styles.arrowIcon}>↘</span>
            <span className={styles.arrowGlyph}>{stressSubtaste?.glyph || arrows.stress}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>Archetype Dynamics</span>
        <span className={styles.subtitle}>THE TWELVE Integration Patterns</span>
      </div>

      {/* Current State */}
      <div className={styles.currentState}>
        <div className={styles.glyphDisplay}>
          <span className={styles.glyph}>{currentSubtaste.glyph}</span>
          <span className={styles.code}>{currentSubtaste.code}</span>
        </div>
        <div className={styles.labelInfo}>
          <span className={styles.label}>{currentSubtaste.label}</span>
          <span className={styles.description}>{currentSubtaste.description}</span>
        </div>
      </div>

      {/* Arrows Section */}
      <div className={styles.arrowsGrid}>
        {/* Growth Arrow */}
        <div className={styles.arrowCard}>
          <div className={styles.arrowHeader}>
            <span className={styles.arrowLabel}>Growth</span>
            <span className={styles.arrowDirection}>↗</span>
          </div>
          {growthSubtaste && (
            <>
              <div className={styles.arrowGlyphLarge}>{growthSubtaste.glyph}</div>
              <div className={styles.arrowDetails}>
                <span className={styles.arrowCode}>{growthSubtaste.code}</span>
                <span className={styles.arrowName}>{growthSubtaste.label}</span>
              </div>
              <div className={styles.arrowDescription}>
                {growthSubtaste.description}
              </div>
              <div className={styles.arrowHint}>
                In periods of security and growth, this archetype moves toward {growthSubtaste.glyph} energy —
                {' '}{getGrowthHint(currentSubtaste, growthSubtaste)}
              </div>
            </>
          )}
        </div>

        {/* Stress Arrow */}
        <div className={styles.arrowCard}>
          <div className={styles.arrowHeader}>
            <span className={styles.arrowLabel}>Stress</span>
            <span className={styles.arrowDirection}>↘</span>
          </div>
          {stressSubtaste && (
            <>
              <div className={styles.arrowGlyphLarge}>{stressSubtaste.glyph}</div>
              <div className={styles.arrowDetails}>
                <span className={styles.arrowCode}>{stressSubtaste.code}</span>
                <span className={styles.arrowName}>{stressSubtaste.label}</span>
              </div>
              <div className={styles.arrowDescription}>
                {stressSubtaste.description}
              </div>
              <div className={styles.arrowHint}>
                Under pressure, this archetype regresses toward {stressSubtaste.glyph} shadow —
                {' '}{getStressHint(currentSubtaste, stressSubtaste)}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Shadow Form */}
      <div className={styles.shadowSection}>
        <div className={styles.shadowHeader}>
          <span className={styles.shadowTitle}>Shadow Manifestation</span>
          <span className={styles.shadowSubtitle}>When the archetype loses balance</span>
        </div>
        <div className={styles.shadowContent}>
          <div className={styles.shadowGlyph}>☍</div>
          <div className={styles.shadowText}>
            {getShadowForm(currentSubtaste)}
          </div>
        </div>
      </div>
    </div>
  );
}

function getGrowthHint(current: SubtasteDesignation, _growth: SubtasteDesignation): string {
  const hints: Record<string, string> = {
    'S-0': 'becoming a conduit rather than a standard-bearer, allowing others to flow through.',
    'T-1': 'illuminating edges rather than reading layers, sharing what was hidden.',
    'V-2': 'cultivating patience, nurturing what was seen rather than just witnessing.',
    'L-3': 'setting standards, becoming a center rather than accumulating quietly.',
    'C-4': 'advocating relentlessly, championing what remains after editing.',
    'N-5': 'witnessing early, seeing what approaches at the borders being illuminated.',
    'H-6': 'reading systems, understanding the structure behind what is championed.',
    'P-7': 'editing the essential, curating the archive rather than hoarding.',
    'D-8': 'manifesting will, channeling toward creation rather than reception.',
    'F-9': 'illuminating borders, shaping the edges of what is forged.',
    'R-10': 'advocating for the broken, championing through fracture.',
    'NULL': 'breaking productively, creating through receptive destruction.',
  };
  return hints[current.code] || 'expanding their creative expression.';
}

function getStressHint(current: SubtasteDesignation, _stress: SubtasteDesignation): string {
  const hints: Record<string, string> = {
    'S-0': 'fracturing productively becomes destruction without purpose, breaking the standard.',
    'T-1': 'preserving obsessively becomes hoarding knowledge, refusing to release.',
    'V-2': 'editing ruthlessly becomes cutting what shouldn\'t be cut, premature judgment.',
    'L-3': 'becoming hollow becomes losing the self that was cultivating, empty patience.',
    'C-4': 'fracturing becomes destruction without essence, cutting into nothing.',
    'N-5': 'losing form becomes void without borders, formless illumination.',
    'H-6': 'forcing manifestation becomes hammering without direction, exhausted advocacy.',
    'P-7': 'losing patience becomes scattered preservation, anxious archiving.',
    'D-8': 'losing borders becomes formless reception, overwhelmed channeling.',
    'F-9': 'cutting essence becomes destruction of the work, sabotaged creation.',
    'R-10': 'setting rigid standards becomes judging the broken, condemning fracture.',
    'NULL': 'reading systems becomes over-analysis, paralyzed reception.',
  };
  return hints[current.code] || 'losing their creative balance.';
}

function getShadowForm(subtaste: SubtasteDesignation): string {
  const shadows: Record<string, string> = {
    'S-0': 'The False Standard — Sets arbitrary rules that serve ego rather than truth. Becomes a tyrant of normalcy, crushing deviation under the weight of "how things should be." The center becomes a prison.',
    'T-1': 'The Paranoid Analyst — Sees systems everywhere, including where none exist. Finds patterns in chaos and builds labyrinths of meaning that trap rather than illuminate. The layers become prisons.',
    'V-2': 'The Doom Prophet — Sees only darkness approaching. Every vision becomes catastrophe, every omen a curse. The early witness becomes the eternal mourner.',
    'L-3': 'The Stagnant Pool — Patience becomes paralysis. Growth stops, and cultivation becomes hoarding. The silt settles into mud that nothing can grow through.',
    'C-4': 'The Butcher — Cuts without discrimination. Removes the essential along with the excess, leaving wounds that cannot heal. The editor becomes the destroyer.',
    'N-5': 'The False Boundary — Traces borders where none should exist. Separates what should be whole, illuminates divisions that create rather than reveal difference.',
    'H-6': 'The Martyr Complex — Pays costs that were never asked for. Champions causes that need no champion, then demands recognition for unrequested sacrifice.',
    'P-7': 'The Hoarder — Preserves everything, even what should be released. The archive becomes a tomb, memory becomes chains. Nothing can leave, nothing can change.',
    'D-8': 'The Hollow Vessel — Empties so completely that nothing remains. Becomes a void that consumes rather than conducts. The channel becomes a drain.',
    'F-9': 'The Obsessed Creator — Hammers will into shapes that break under their own weight. Forces creation where none is needed, manifests destruction through excess.',
    'R-10': 'The Chaos Agent — Breaks without purpose. Fractures what should remain whole, finds destruction where growth was possible. The schism becomes a wound.',
    'NULL': 'The Absence — The still point becomes emptiness. Presence becomes void, and the receptive becomes the absent. Nothing is held because nothing is there.',
  };
  return shadows[subtaste.code] || 'A distorted reflection of the archetype\'s true nature emerges when balance is lost.';
}

export default ArchetypeDynamics;
