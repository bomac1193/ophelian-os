/**
 * Bóveda Character Genome System - Export Functionality
 * Export genomes in various formats (JSON, Markdown, System Prompt)
 */

import type {
  CharacterGenome,
  GenomeExportOptions,
} from '../types/genome.types.js';
import { ORISHA_DATA } from '../data/orisha-data.js';
import { SEPHIROTH_DATA, getQliphothBySephira } from '../data/sephiroth-data.js';
import { getPath } from '../data/paths-data.js';
import { generateSystemPrompt, formatInvariantMarkers, formatEvolutionRules } from './system-prompt-generator.js';

// ============================================================================
// JSON EXPORT
// ============================================================================

export function exportGenomeAsJSON(genome: CharacterGenome, pretty = true): string {
  if (pretty) {
    return JSON.stringify(genome, null, 2);
  }
  return JSON.stringify(genome);
}

export function parseGenomeFromJSON(jsonString: string): CharacterGenome {
  const parsed = JSON.parse(jsonString);

  // Restore Date objects
  parsed.createdAt = new Date(parsed.createdAt);
  parsed.updatedAt = new Date(parsed.updatedAt);

  return parsed as CharacterGenome;
}

// ============================================================================
// MARKDOWN EXPORT
// ============================================================================

export function exportGenomeAsMarkdown(
  genome: CharacterGenome,
  options: GenomeExportOptions = { format: 'markdown' }
): string {
  const orisha = ORISHA_DATA[genome.orishaConfiguration.headOrisha];
  const sephira = SEPHIROTH_DATA[genome.kabbalisticPosition.primarySephira];
  const qliphoth = getQliphothBySephira(genome.kabbalisticPosition.primarySephira);

  const sections: string[] = [];

  // Header
  sections.push(`# Character Genome: ${genome.name}`);
  sections.push('');
  sections.push(`**Schema Version:** ${genome.schemaVersion}`);
  sections.push(`**Created:** ${genome.createdAt.toISOString()}`);
  sections.push(`**Updated:** ${genome.updatedAt.toISOString()}`);
  sections.push(`**Seed:** ${genome.seed || 'N/A'}`);
  sections.push('');
  sections.push('---');
  sections.push('');

  // Orisha Configuration
  sections.push('## Orisha Configuration');
  sections.push('');
  sections.push(`### Head Orisha: ${genome.orishaConfiguration.headOrisha}`);
  sections.push(`- **Title:** ${orisha.title}`);
  sections.push(`- **Domains:** ${orisha.domain.join(', ')}`);
  sections.push(`- **Element:** ${orisha.element}`);
  sections.push(`- **Colors:** ${orisha.colors.join(', ')}`);
  sections.push(`- **Number:** ${orisha.number}`);
  sections.push(`- **Day:** ${orisha.day}`);
  if (genome.orishaConfiguration.camino) {
    sections.push(`- **Camino:** ${genome.orishaConfiguration.camino}`);
  }
  sections.push('');

  if (genome.orishaConfiguration.secondaryInfluences.length > 0) {
    sections.push('### Secondary Influences');
    for (const inf of genome.orishaConfiguration.secondaryInfluences) {
      const secOrisha = ORISHA_DATA[inf.orisha];
      sections.push(`- **${inf.orisha}** (${secOrisha.domain[0]}): ${Math.round(inf.strength * 100)}% strength`);
    }
    sections.push('');
  }

  if (genome.orishaConfiguration.shadowForm) {
    sections.push(`### Shadow Form: ${genome.orishaConfiguration.shadowForm}`);
    sections.push('');
  }

  // Kabbalistic Position
  sections.push('## Kabbalistic Position');
  sections.push('');
  sections.push(`### Primary Sephira: ${genome.kabbalisticPosition.primarySephira}`);
  sections.push(`- **Hebrew:** ${sephira.hebrewName}`);
  sections.push(`- **Meaning:** ${sephira.meaning}`);
  sections.push(`- **Pillar:** ${genome.kabbalisticPosition.pillar}`);
  sections.push(`- **Planet:** ${sephira.planet || 'N/A'}`);
  sections.push(`- **Color:** ${sephira.color}`);
  sections.push(`- **Divine Attribute:** ${sephira.divineAttribute}`);
  sections.push(`- **Psychological Aspect:** ${sephira.psychologicalAspect}`);
  sections.push(`- **Archetype:** ${sephira.archetype}`);
  sections.push('');

  sections.push(`### Qliphothic Shadow: ${genome.kabbalisticPosition.qliphothicShadow}`);
  sections.push(`- **Hebrew Meaning:** ${qliphoth.hebrewMeaning}`);
  sections.push(`- **Shadow Aspect:** ${qliphoth.shadowAspect}`);
  sections.push(`- **Manifestation:** ${qliphoth.manifestation}`);
  sections.push('');

  sections.push(`**Daath Relationship:** ${genome.kabbalisticPosition.daathRelationship}`);
  if (genome.kabbalisticPosition.activePath) {
    const path = getPath(genome.kabbalisticPosition.activePath);
    if (path) {
      sections.push(`**Active Path:** Path ${path.number} (${path.hebrewLetter} - ${path.tarotCorrespondence})`);
    }
  }
  sections.push('');

  // Psychological State
  sections.push('## Psychological State');
  sections.push('');
  sections.push(`- **Trajectory:** ${genome.psychologicalState.trajectory}`);
  sections.push(`- **Individuation Level:** ${Math.round(genome.psychologicalState.individuationLevel * 100)}%`);
  sections.push(`- **Hot/Cool Axis:** ${genome.psychologicalState.hotCoolAxis.toFixed(2)} (${genome.psychologicalState.hotCoolAxis > 0 ? 'Hot/Petwo' : 'Cool/Rada'})`);
  sections.push(`- **Shadow Integration:** ${Math.round(genome.psychologicalState.shadowIntegration * 100)}%`);
  sections.push(`- **Dominant Complex:** ${genome.psychologicalState.dominantComplex}`);
  sections.push(`- **Active Archetypes:** ${genome.psychologicalState.activeArchetypes.join(', ')}`);
  sections.push('');

  // Multi-Modal Signature
  sections.push('## Multi-Modal Signature');
  sections.push('');

  // Visual
  sections.push('### Visual');
  sections.push(`- **Primary Colors:** ${genome.multiModalSignature.visual.primaryColors.join(', ')}`);
  sections.push(`- **Secondary Colors:** ${genome.multiModalSignature.visual.secondaryColors.join(', ')}`);
  sections.push(`- **Patterns:** ${genome.multiModalSignature.visual.patterns.join(', ')}`);
  sections.push(`- **Textures:** ${genome.multiModalSignature.visual.textures.join(', ')}`);
  sections.push(`- **Light Quality:** ${genome.multiModalSignature.visual.lightQuality}`);
  sections.push(`- **Aesthetic Style:** ${genome.multiModalSignature.visual.aestheticStyle}`);
  sections.push(`- **Symbol Motifs:** ${genome.multiModalSignature.visual.symbolMotifs.join(', ')}`);
  sections.push('');

  // Voice
  sections.push('### Voice');
  sections.push(`- **Pitch Range:** ${genome.multiModalSignature.voice.pitchRange}`);
  sections.push(`- **Timbre:** ${genome.multiModalSignature.voice.timbre.join(', ')}`);
  sections.push(`- **Speech Patterns:** ${genome.multiModalSignature.voice.speechPatterns.join(', ')}`);
  sections.push(`- **Rhythmic Quality:** ${genome.multiModalSignature.voice.rhythmicQuality}`);
  sections.push(`- **Emotional Resonance:** ${genome.multiModalSignature.voice.emotionalResonance}`);
  sections.push(`- **Accent Influences:** ${genome.multiModalSignature.voice.accentInfluences.join(', ')}`);
  sections.push('');

  // Music
  sections.push('### Music');
  sections.push(`- **Key Signature:** ${genome.multiModalSignature.music.keySignature}`);
  sections.push(`- **Mode:** ${genome.multiModalSignature.music.mode}`);
  sections.push(`- **Tempo Range:** ${genome.multiModalSignature.music.tempoRange.min}-${genome.multiModalSignature.music.tempoRange.max} BPM`);
  sections.push(`- **Primary Instruments:** ${genome.multiModalSignature.music.primaryInstruments.join(', ')}`);
  sections.push(`- **Rhythmic Patterns:** ${genome.multiModalSignature.music.rhythmicPatterns.join(', ')}`);
  sections.push(`- **Harmonic Complexity:** ${genome.multiModalSignature.music.harmonicComplexity}`);
  sections.push(`- **Genre Influences:** ${genome.multiModalSignature.music.genreInfluences.join(', ')}`);
  sections.push('');

  // Movement
  sections.push('### Movement');
  sections.push(`- **Quality of Motion:** ${genome.multiModalSignature.movement.qualityOfMotion}`);
  sections.push(`- **Tempo Preference:** ${genome.multiModalSignature.movement.tempoPreference}`);
  sections.push(`- **Spatial Orientation:** ${genome.multiModalSignature.movement.spatialOrientation}`);
  sections.push(`- **Gesture Vocabulary:** ${genome.multiModalSignature.movement.gestureVocabulary.join(', ')}`);
  sections.push(`- **Dance Influences:** ${genome.multiModalSignature.movement.danceInfluences.join(', ')}`);
  sections.push(`- **Posture Characteristics:** ${genome.multiModalSignature.movement.postureCharacteristics.join(', ')}`);
  sections.push('');

  // Narrative Identity
  sections.push('## Narrative Identity');
  sections.push('');
  sections.push(`**Core Values:** ${genome.narrativeIdentity.coreValues.join(', ')}`);
  sections.push('');
  sections.push(`**Central Conflicts:** ${genome.narrativeIdentity.centralConflicts.join(', ')}`);
  sections.push('');
  sections.push('**Relational Patterns:**');
  for (const rp of genome.narrativeIdentity.relationalPatterns) {
    sections.push(`- ${rp.archetype}: ${rp.nature}`);
  }
  sections.push('');
  sections.push(`**Origin Myth Elements:** ${genome.narrativeIdentity.originMythElements.join(', ')}`);
  sections.push('');
  sections.push(`**Recurring Themes:** ${genome.narrativeIdentity.recurringThemes.join(', ')}`);
  sections.push('');
  sections.push(`**Telos:** ${genome.narrativeIdentity.telos}`);
  sections.push('');

  // Invariant Markers
  sections.push(formatInvariantMarkers(genome));
  sections.push('');

  // Evolution Rules (optional)
  if (options.includeEvolutionRules !== false) {
    sections.push(formatEvolutionRules(genome));
    sections.push('');
  }

  // Footer
  sections.push('---');
  sections.push('');
  sections.push('*Generated by Bóveda Character Genome System*');

  return sections.join('\n');
}

// ============================================================================
// SYSTEM PROMPT EXPORT
// ============================================================================

export function exportGenomeAsSystemPrompt(
  genome: CharacterGenome,
  style: 'concise' | 'detailed' | 'poetic' = 'detailed'
): string {
  const result = generateSystemPrompt(genome, {
    format: 'system-prompt',
    promptStyle: style,
  });
  return result.prompt;
}

// ============================================================================
// COMPACT SUMMARY EXPORT
// ============================================================================

export function exportGenomeSummary(genome: CharacterGenome): string {
  const orisha = ORISHA_DATA[genome.orishaConfiguration.headOrisha];

  const lines = [
    `**${genome.name}**`,
    `Orisha: ${genome.orishaConfiguration.headOrisha} (${orisha.title})`,
    `Sephira: ${genome.kabbalisticPosition.primarySephira} (${genome.kabbalisticPosition.pillar})`,
    `Shadow: ${genome.kabbalisticPosition.qliphothicShadow}`,
    `Trajectory: ${genome.psychologicalState.trajectory}`,
    `Temp: ${genome.psychologicalState.hotCoolAxis > 0 ? 'Hot' : 'Cool'}`,
    `Values: ${genome.narrativeIdentity.coreValues.slice(0, 3).join(', ')}`,
    `Telos: ${genome.narrativeIdentity.telos}`,
  ];

  return lines.join('\n');
}

// ============================================================================
// MAIN EXPORT FUNCTION
// ============================================================================

export function exportGenome(
  genome: CharacterGenome,
  options: GenomeExportOptions
): string {
  switch (options.format) {
    case 'json':
      return exportGenomeAsJSON(genome);
    case 'markdown':
      return exportGenomeAsMarkdown(genome, options);
    case 'system-prompt':
      return exportGenomeAsSystemPrompt(genome, options.promptStyle);
    default:
      throw new Error(`Unknown export format: ${options.format}`);
  }
}
