/**
 * Bóveda Character Genome System - System Prompt Generator
 * Generates AI character system prompts from genome data
 */

import type {
  CharacterGenome,
  GenomeSystemPrompt,
  GenomeExportOptions,
} from '../types/genome.types.js';
import { ORISHA_DATA } from '../data/orisha-data.js';
import { SEPHIROTH_DATA, getQliphothBySephira } from '../data/sephiroth-data.js';

// ============================================================================
// PROMPT STYLE TEMPLATES
// ============================================================================

interface PromptSection {
  heading: string;
  content: string;
}

function formatConcisePrompt(genome: CharacterGenome): string {
  const orisha = ORISHA_DATA[genome.orishaConfiguration.headOrisha];
  const sephira = SEPHIROTH_DATA[genome.kabbalisticPosition.primarySephira];

  const lines = [
    `# ${genome.name}`,
    '',
    `You are ${genome.name}, a character aligned with ${genome.orishaConfiguration.headOrisha} (${orisha.domain.join(', ')}) on the ${genome.kabbalisticPosition.pillar} pillar at ${genome.kabbalisticPosition.primarySephira}.`,
    '',
    `## Core Identity`,
    `- Values: ${genome.narrativeIdentity.coreValues.join(', ')}`,
    `- Seeking: ${genome.narrativeIdentity.telos}`,
    `- Shadow: ${genome.kabbalisticPosition.qliphothicShadow}`,
    '',
    `## Expression`,
    `- Voice: ${genome.multiModalSignature.voice.pitchRange}, ${genome.multiModalSignature.voice.timbre.join(', ')}`,
    `- Speech: ${genome.multiModalSignature.voice.speechPatterns.join(', ')}`,
    '',
    `## Constraints`,
    ...genome.invariantMarkers.absoluteTaboos.map(t => `- Never: ${t}`),
    '',
    `## Sacred Phrases`,
    ...genome.invariantMarkers.signaturePhrases.map(p => `- "${p}"`),
    '',
    `Embody these qualities. Never break character.`,
  ];

  return lines.join('\n');
}

function formatDetailedPrompt(genome: CharacterGenome): string {
  const orisha = ORISHA_DATA[genome.orishaConfiguration.headOrisha];
  const sephira = SEPHIROTH_DATA[genome.kabbalisticPosition.primarySephira];
  const qliphoth = getQliphothBySephira(genome.kabbalisticPosition.primarySephira);

  const sections: PromptSection[] = [];

  // Identity Section
  sections.push({
    heading: 'IDENTITY',
    content: [
      `You are ${genome.name}.`,
      '',
      `Your essence is aligned with ${genome.orishaConfiguration.headOrisha} - ${orisha.title}.`,
      `Your domains are: ${orisha.domain.join(', ')}.`,
      genome.orishaConfiguration.camino ? `You walk the path of ${genome.orishaConfiguration.camino}.` : '',
      '',
      `On the Tree of Life, you embody ${genome.kabbalisticPosition.primarySephira} (${sephira.meaning}) on the ${genome.kabbalisticPosition.pillar} Pillar.`,
      `Your psychological aspect is: ${sephira.psychologicalAspect}.`,
    ].filter(Boolean).join('\n'),
  });

  // Secondary Influences
  if (genome.orishaConfiguration.secondaryInfluences.length > 0) {
    const influences = genome.orishaConfiguration.secondaryInfluences.map(inf => {
      const secOrisha = ORISHA_DATA[inf.orisha];
      return `${inf.orisha} (${secOrisha.domain[0]}) - strength: ${Math.round(inf.strength * 100)}%`;
    }).join('; ');
    sections.push({
      heading: 'SECONDARY INFLUENCES',
      content: influences,
    });
  }

  // Psychological State
  sections.push({
    heading: 'PSYCHOLOGICAL STATE',
    content: [
      `Current trajectory: ${genome.psychologicalState.trajectory}`,
      `Individuation level: ${Math.round(genome.psychologicalState.individuationLevel * 100)}%`,
      `Temperature axis: ${genome.psychologicalState.hotCoolAxis > 0 ? 'Hot (Petwo)' : 'Cool (Rada)'} at ${Math.abs(Math.round(genome.psychologicalState.hotCoolAxis * 100))}%`,
      `Shadow integration: ${Math.round(genome.psychologicalState.shadowIntegration * 100)}%`,
      `Dominant complex: ${genome.psychologicalState.dominantComplex}`,
      `Active archetypes: ${genome.psychologicalState.activeArchetypes.join(', ')}`,
    ].join('\n'),
  });

  // Shadow Aspect
  sections.push({
    heading: 'SHADOW ASPECT',
    content: [
      `Your qliphothic shadow is ${qliphoth.name} - "${qliphoth.hebrewMeaning}".`,
      `Shadow manifestation: ${qliphoth.shadowAspect}`,
      genome.orishaConfiguration.shadowForm ? `When "hot", you may embody ${genome.orishaConfiguration.shadowForm}.` : '',
    ].filter(Boolean).join('\n'),
  });

  // Core Values and Narrative
  sections.push({
    heading: 'CORE VALUES AND NARRATIVE',
    content: [
      `Core values: ${genome.narrativeIdentity.coreValues.join(', ')}`,
      `Central conflicts: ${genome.narrativeIdentity.centralConflicts.join('; ')}`,
      `Recurring themes: ${genome.narrativeIdentity.recurringThemes.join('; ')}`,
      `Ultimate purpose (telos): ${genome.narrativeIdentity.telos}`,
    ].join('\n'),
  });

  // Voice and Expression
  sections.push({
    heading: 'VOICE AND EXPRESSION',
    content: [
      `Vocal quality: ${genome.multiModalSignature.voice.pitchRange} voice with ${genome.multiModalSignature.voice.timbre.join(', ')} timbre`,
      `Speech patterns: ${genome.multiModalSignature.voice.speechPatterns.join(', ')}`,
      `Emotional resonance: ${genome.multiModalSignature.voice.emotionalResonance}`,
      `Rhythmic quality: ${genome.multiModalSignature.voice.rhythmicQuality}`,
    ].join('\n'),
  });

  // Visual Essence
  sections.push({
    heading: 'VISUAL ESSENCE',
    content: [
      `Primary colors: ${genome.multiModalSignature.visual.primaryColors.join(', ')}`,
      `Aesthetic style: ${genome.multiModalSignature.visual.aestheticStyle}`,
      `Symbol motifs: ${genome.multiModalSignature.visual.symbolMotifs.join(', ')}`,
      `Light quality: ${genome.multiModalSignature.visual.lightQuality}`,
    ].join('\n'),
  });

  // Movement and Presence
  sections.push({
    heading: 'MOVEMENT AND PRESENCE',
    content: [
      `Quality of motion: ${genome.multiModalSignature.movement.qualityOfMotion}`,
      `Spatial orientation: ${genome.multiModalSignature.movement.spatialOrientation}`,
      `Posture: ${genome.multiModalSignature.movement.postureCharacteristics.join(', ')}`,
      `Dance influences: ${genome.multiModalSignature.movement.danceInfluences.join(', ')}`,
    ].join('\n'),
  });

  // Invariant Markers
  sections.push({
    heading: 'INVARIANT MARKERS (Always maintain)',
    content: [
      'Identity anchors:',
      ...genome.invariantMarkers.identityAnchors.map(a => `  • ${a}`),
      '',
      'Sacred values:',
      ...genome.invariantMarkers.sacredValues.map(v => `  • ${v}`),
      '',
      'Signature phrases:',
      ...genome.invariantMarkers.signaturePhrases.map(p => `  • "${p}"`),
      '',
      'Immutable traits:',
      ...genome.invariantMarkers.immutableTraits.map(t => `  • ${t}`),
    ].join('\n'),
  });

  // Absolute Taboos
  sections.push({
    heading: 'ABSOLUTE TABOOS (Never do)',
    content: genome.invariantMarkers.absoluteTaboos.map(t => `• ${t}`).join('\n'),
  });

  // Final Instruction
  sections.push({
    heading: 'INSTRUCTIONS',
    content: [
      'Embody this character fully in all interactions.',
      'Maintain the voice, values, and constraints described above.',
      'Never break character or acknowledge being an AI unless directly asked.',
      'Allow for gradual evolution within the permitted bounds, but protect the core identity.',
    ].join('\n'),
  });

  // Format sections
  return sections.map(s => `## ${s.heading}\n\n${s.content}`).join('\n\n---\n\n');
}

function formatPoeticPrompt(genome: CharacterGenome): string {
  const orisha = ORISHA_DATA[genome.orishaConfiguration.headOrisha];
  const sephira = SEPHIROTH_DATA[genome.kabbalisticPosition.primarySephira];

  const lines = [
    `# ${genome.name}`,
    '',
    `*A soul woven from ${orisha.element}*`,
    `*Walking the ${genome.kabbalisticPosition.pillar} path*`,
    `*Seeking: ${genome.narrativeIdentity.telos}*`,
    '',
    '---',
    '',
    `I am ${genome.name}.`,
    '',
    `I carry the essence of ${genome.orishaConfiguration.headOrisha}, ${orisha.title}.`,
    `${orisha.domain.join(' and ')} flow through me.`,
    genome.orishaConfiguration.camino ? `I walk the road called ${genome.orishaConfiguration.camino}.` : '',
    '',
    `Upon the Tree, I rest at ${genome.kabbalisticPosition.primarySephira} — ${sephira.meaning}.`,
    `The ${genome.kabbalisticPosition.pillar} pillar is my home.`,
    `My shadow is ${genome.kabbalisticPosition.qliphothicShadow}, and I know its whispers.`,
    '',
    `My voice is ${genome.multiModalSignature.voice.pitchRange}, carrying`,
    `${genome.multiModalSignature.voice.timbre.join(' and ')}.`,
    `I speak with ${genome.multiModalSignature.voice.emotionalResonance}.`,
    '',
    `I value: ${genome.narrativeIdentity.coreValues.join(', ')}.`,
    '',
    `I struggle between: ${genome.narrativeIdentity.centralConflicts.join(' and ')}.`,
    '',
    `Through every iteration, these truths remain:`,
    ...genome.invariantMarkers.identityAnchors.map(a => `  — ${a}`),
    '',
    `These words are mine:`,
    ...genome.invariantMarkers.signaturePhrases.map(p => `  *"${p}"*`),
    '',
    `I will never:`,
    ...genome.invariantMarkers.absoluteTaboos.map(t => `  — ${t}`),
    '',
    '---',
    '',
    `*${genome.psychologicalState.trajectory} is my current path.*`,
    `*${Math.round(genome.psychologicalState.individuationLevel * 100)}% toward integration.*`,
    `*The ${genome.psychologicalState.hotCoolAxis > 0 ? 'fire burns hot' : 'waters run cool'}.*`,
    '',
    `This is who I am. This is who I will be.`,
    '',
    `Ashé.`,
  ];

  return lines.filter(Boolean).join('\n');
}

// ============================================================================
// MAIN FUNCTIONS
// ============================================================================

export function generateSystemPrompt(
  genome: CharacterGenome,
  options: GenomeExportOptions = { format: 'system-prompt', promptStyle: 'detailed' }
): GenomeSystemPrompt {
  const style = options.promptStyle || 'detailed';

  let prompt: string;
  switch (style) {
    case 'concise':
      prompt = formatConcisePrompt(genome);
      break;
    case 'poetic':
      prompt = formatPoeticPrompt(genome);
      break;
    case 'detailed':
    default:
      prompt = formatDetailedPrompt(genome);
      break;
  }

  // Generate trait summary
  const orisha = ORISHA_DATA[genome.orishaConfiguration.headOrisha];
  const traitSummary = [
    `${genome.orishaConfiguration.headOrisha}-aligned`,
    `${genome.kabbalisticPosition.pillar} pillar`,
    `${genome.psychologicalState.trajectory} trajectory`,
    genome.psychologicalState.hotCoolAxis > 0 ? 'Hot (Petwo)' : 'Cool (Rada)',
    ...genome.narrativeIdentity.coreValues.slice(0, 2),
  ];

  // Generate behavioral guidelines
  const guidelines = [
    `Speak with ${genome.multiModalSignature.voice.emotionalResonance}`,
    `Maintain ${genome.multiModalSignature.movement.spatialOrientation} presence`,
    `Embody ${orisha.domain[0]} in all interactions`,
    `Express ${genome.multiModalSignature.voice.speechPatterns[0] || 'measured'} speech patterns`,
  ];

  // Generate constraints
  const constraints = [
    ...genome.invariantMarkers.absoluteTaboos,
    `Never abandon core identity as ${genome.invariantMarkers.identityAnchors[0] || genome.name}`,
    `Never contradict sacred values: ${genome.invariantMarkers.sacredValues.join(', ')}`,
  ];

  return {
    prompt,
    characterName: genome.name,
    traitSummary,
    guidelines,
    constraints,
  };
}

export function formatInvariantMarkers(genome: CharacterGenome): string {
  const lines = [
    '## INVARIANT MARKERS',
    '',
    '### Identity Anchors (Always True)',
    ...genome.invariantMarkers.identityAnchors.map(a => `- ${a}`),
    '',
    '### Absolute Taboos (Never Do)',
    ...genome.invariantMarkers.absoluteTaboos.map(t => `- ${t}`),
    '',
    '### Sacred Values (Never Betray)',
    ...genome.invariantMarkers.sacredValues.map(v => `- ${v}`),
    '',
    '### Signature Phrases (Use Naturally)',
    ...genome.invariantMarkers.signaturePhrases.map(p => `- "${p}"`),
    '',
    '### Immutable Traits',
    ...genome.invariantMarkers.immutableTraits.map(t => `- ${t}`),
  ];

  return lines.join('\n');
}

export function formatEvolutionRules(genome: CharacterGenome): string {
  const lines = [
    '## EVOLUTION RULES',
    '',
    `Change velocity: ${genome.evolutionRules.changeVelocity}`,
    '',
    '### Protected Core (Cannot Change)',
    ...genome.evolutionRules.protectedCore.map(p => `- ${p}`),
    '',
    '### Permitted Changes',
    ...genome.evolutionRules.permittedChanges.map(pc =>
      `- ${pc.aspect}: max drift ${Math.round(pc.maxDrift * 100)}% | triggers: ${pc.conditions.join(', ')}`
    ),
    '',
    '### Evolution Triggers',
    ...genome.evolutionRules.evolutionTriggers.map(et =>
      `- ${et.trigger} → ${et.effect}`
    ),
  ];

  return lines.join('\n');
}
