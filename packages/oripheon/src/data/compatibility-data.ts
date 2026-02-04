/**
 * Contextual Compatibility Matrix
 *
 * Computes relationship compatibility across multiple contexts (love, friendship,
 * creative team, story tension) using Wu Xing cycles, growth/stress arrows,
 * axis signatures, and comparison patterns.
 *
 * Relationship type suggestions use refined logic:
 * - ENEMY vs RIVAL: distinguished by mutual stress arrows and overcoming directionality
 * - MENTOR: directional — requires generating cycle flowing from mentor, growth arrow targeting mentee
 * - SIBLING: distinct from FAMILY — shared origin axes, divergent temperament axes
 */

import {
  type ProfileAnalysis,
  type ProfileComparison,
  type PipelinePhase,
  type WuXingElement,
  compareProfiles,
  SUBTASTE_ARROWS,
  PIPELINE_ORDER,
  WU_XING_DATA,
} from './subtaste-data.js';

// ============================================================================
// TYPES
// ============================================================================

export interface ContextualCompatibility {
  love: number;        // 0-1
  friendship: number;  // 0-1
  creativeTeam: number; // 0-1
  storyTension: number; // 0-1
}

export type SuggestedRelationshipType = 'ALLY' | 'FRIEND' | 'RIVAL' | 'ENEMY' | 'LOVER' | 'FAMILY' | 'MENTOR';

export interface MentorDirection {
  mentorIsA: boolean;  // true = profileA mentors profileB, false = B mentors A
}

export interface RelationshipMatrix {
  base: ProfileComparison;
  contextual: ContextualCompatibility;
  suggestedRelationshipTypes: SuggestedRelationshipType[];
  mentorDirection: MentorDirection | null;
  narrative: string;
}

// ============================================================================
// HELPERS
// ============================================================================

function clamp01(v: number): number {
  return Math.max(0, Math.min(1, v));
}

/** A's growth arrow points to B's subtaste code */
function growthArrowAtoB(a: string, b: string): boolean {
  return SUBTASTE_ARROWS[a]?.growth === b;
}

/** A's stress arrow points to B's subtaste code */
function stressArrowAtoB(a: string, b: string): boolean {
  return SUBTASTE_ARROWS[a]?.stress === b;
}

/** Bidirectional growth arrow check */
function hasGrowthArrow(a: string, b: string): boolean {
  return growthArrowAtoB(a, b) || growthArrowAtoB(b, a);
}

/** Bidirectional stress arrow check */
function hasStressArrow(a: string, b: string): boolean {
  return stressArrowAtoB(a, b) || stressArrowAtoB(b, a);
}

/** Mutual stress arrows: both point at each other */
function hasMutualStressArrows(a: string, b: string): boolean {
  return stressArrowAtoB(a, b) && stressArrowAtoB(b, a);
}

/** Get phase index (0-4) for pipeline ordering */
function phaseIndex(phase: PipelinePhase): number {
  return PIPELINE_ORDER.indexOf(phase);
}

/** Check if A's element generates B's element (directional) */
function elementGeneratesDirectional(elementA: WuXingElement, elementB: WuXingElement): boolean {
  return WU_XING_DATA[elementA].generating === elementB;
}

/** Check adjacent or same phase (for sibling detection) */
function adjacentPhases(phaseA: PipelinePhase, phaseB: PipelinePhase): boolean {
  const idxA = phaseIndex(phaseA);
  const idxB = phaseIndex(phaseB);
  return Math.abs(idxA - idxB) <= 1 || (idxA === 0 && idxB === 4) || (idxA === 4 && idxB === 0);
}

// ============================================================================
// MENTOR DETECTION
// ============================================================================

/**
 * Detect directional mentor relationship.
 * A mentors B when:
 * 1. A's element generates B's element (directional sheng cycle)
 * 2. B's growth arrow points to A's subtaste (A is what B grows toward)
 * 3. A is at a later pipeline phase than B
 *
 * Requires at least 2 of 3 conditions.
 */
function detectMentor(a: ProfileAnalysis, b: ProfileAnalysis): MentorDirection | null {
  // Check A mentors B
  let aMentorsB = 0;
  if (elementGeneratesDirectional(a.wuXingElement, b.wuXingElement)) aMentorsB++;
  if (growthArrowAtoB(b.subtaste.code, a.subtaste.code)) aMentorsB++; // B grows toward A
  if (phaseIndex(a.phase) > phaseIndex(b.phase)) aMentorsB++;

  // Check B mentors A
  let bMentorsA = 0;
  if (elementGeneratesDirectional(b.wuXingElement, a.wuXingElement)) bMentorsA++;
  if (growthArrowAtoB(a.subtaste.code, b.subtaste.code)) bMentorsA++; // A grows toward B
  if (phaseIndex(b.phase) > phaseIndex(a.phase)) bMentorsA++;

  if (aMentorsB >= 2 && aMentorsB > bMentorsA) return { mentorIsA: true };
  if (bMentorsA >= 2 && bMentorsA > aMentorsB) return { mentorIsA: false };
  return null;
}

// ============================================================================
// SIBLING DETECTION
// ============================================================================

/**
 * Detect sibling pattern.
 * Siblings share origin (close on orderChaos and faithDoubt — "upbringing" axes)
 * but diverge on temperament (mercyRuthlessness and introvertExtrovert — individual axes).
 * Also requires same or adjacent pipeline phase.
 */
function isSiblingPattern(a: ProfileAnalysis, b: ProfileAnalysis): boolean {
  const originClose =
    Math.abs(a.axes.orderChaos - b.axes.orderChaos) < 0.2 &&
    Math.abs(a.axes.faithDoubt - b.axes.faithDoubt) < 0.2;

  const temperamentDiverge =
    Math.abs(a.axes.mercyRuthlessness - b.axes.mercyRuthlessness) > 0.3 ||
    Math.abs(a.axes.introvertExtrovert - b.axes.introvertExtrovert) > 0.3;

  return originClose && temperamentDiverge && adjacentPhases(a.phase, b.phase);
}

// ============================================================================
// ENEMY vs RIVAL DETECTION
// ============================================================================

/**
 * Distinguish ENEMY from RIVAL.
 * ENEMY: mutual stress arrows OR (overcoming cycle + friction pattern). Existential threat.
 * RIVAL: one-way overcoming + moderate distance. Respectful challenge.
 */
function classifyAntagonism(
  a: ProfileAnalysis,
  b: ProfileAnalysis,
  pattern: string,
  relationalCycle: string,
): 'ENEMY' | 'RIVAL' {
  const mutual = hasMutualStressArrows(a.subtaste.code, b.subtaste.code);
  if (mutual) return 'ENEMY';
  if (relationalCycle === 'overcoming' && pattern === 'friction') return 'ENEMY';
  return 'RIVAL';
}

// ============================================================================
// MAIN COMPUTATION
// ============================================================================

export function computeRelationshipMatrix(
  profileA: ProfileAnalysis,
  profileB: ProfileAnalysis,
): RelationshipMatrix {
  const base = compareProfiles(profileA, profileB);

  const { pattern, relationalCycle, overallDistance } = base;
  const growthArrow = hasGrowthArrow(profileA.subtaste.code, profileB.subtaste.code);
  const stressArrow = hasStressArrow(profileA.subtaste.code, profileB.subtaste.code);
  const samePhase = profileA.phase === profileB.phase;

  const energyContrast = Math.abs(profileA.axes.introvertExtrovert - profileB.axes.introvertExtrovert);
  const sameEnergy = energyContrast < 0.2;

  // Detect refined relationships
  const mentorDirection = detectMentor(profileA, profileB);
  const siblingPattern = isSiblingPattern(profileA, profileB);
  const antagonismType = (pattern === 'friction' || relationalCycle === 'overcoming' || stressArrow)
    ? classifyAntagonism(profileA, profileB, pattern, relationalCycle)
    : null;

  // ----------------------------------------
  // LOVE
  // ----------------------------------------
  let love = 0.4;
  if (pattern === 'complement') love += 0.25;
  if (pattern === 'mirror') love += 0.2;
  if (relationalCycle === 'generating') love += 0.15;
  if (energyContrast > 0.3) love += 0.1;
  if (growthArrow) love += 0.1;
  if (pattern === 'friction') love -= 0.1;
  if (relationalCycle === 'overcoming') love -= 0.05;
  if (siblingPattern) love -= 0.15; // siblings aren't lovers

  // ----------------------------------------
  // FRIENDSHIP
  // ----------------------------------------
  let friendship = 0.4;
  if (pattern === 'parallel') friendship += 0.25;
  if (pattern === 'complement') friendship += 0.15;
  if (sameEnergy) friendship += 0.15;
  if (samePhase) friendship += 0.1;
  if (siblingPattern) friendship += 0.1; // siblings can be friends
  if (pattern === 'friction') friendship -= 0.15;
  if (relationalCycle === 'overcoming') friendship -= 0.1;

  // ----------------------------------------
  // CREATIVE TEAM
  // ----------------------------------------
  let creativeTeam = 0.35;
  if (pattern === 'complement') creativeTeam += 0.25;
  if (!samePhase) creativeTeam += 0.1;
  if (relationalCycle === 'generating') creativeTeam += 0.2;
  if (growthArrow) creativeTeam += 0.1;
  if (mentorDirection) creativeTeam += 0.1; // mentor-mentee pairs work well creatively
  if (pattern === 'parallel') creativeTeam += 0.05;
  if (pattern === 'mirror') creativeTeam -= 0.05;

  // ----------------------------------------
  // STORY TENSION
  // ----------------------------------------
  let storyTension = 0.3;
  if (pattern === 'friction') storyTension += 0.3;
  if (relationalCycle === 'overcoming') storyTension += 0.2;
  if (stressArrow) storyTension += 0.15;
  if (antagonismType === 'ENEMY') storyTension += 0.1; // enemies produce more tension than rivals
  if (overallDistance > 0.5) storyTension += 0.1;
  if (pattern === 'mirror') storyTension -= 0.1;
  if (pattern === 'parallel') storyTension -= 0.05;

  const contextual: ContextualCompatibility = {
    love: clamp01(love),
    friendship: clamp01(friendship),
    creativeTeam: clamp01(creativeTeam),
    storyTension: clamp01(storyTension),
  };

  // ----------------------------------------
  // SUGGESTED RELATIONSHIP TYPES (refined)
  // ----------------------------------------
  const suggested: SuggestedRelationshipType[] = [];

  // Antagonism: ENEMY or RIVAL (never both)
  if (antagonismType === 'ENEMY') {
    suggested.push('ENEMY');
  } else if (antagonismType === 'RIVAL') {
    suggested.push('RIVAL');
  }

  // Mentor (directional)
  if (mentorDirection) {
    suggested.push('MENTOR');
  }

  // Sibling (distinct from generic FAMILY)
  if (siblingPattern) {
    suggested.push('FAMILY'); // FAMILY covers siblings in the API type system
  }

  // Mirror → LOVER (but not if sibling)
  if (pattern === 'mirror' && !siblingPattern) {
    suggested.push('LOVER');
  }

  // Complement → ALLY, FRIEND
  if (pattern === 'complement') {
    suggested.push('ALLY', 'FRIEND');
  }

  // Parallel → FRIEND
  if (pattern === 'parallel') {
    suggested.push('FRIEND');
  }

  // Growth arrow without mentor → ALLY
  if (growthArrow && !mentorDirection) {
    suggested.push('ALLY');
  }

  // Deduplicate
  const uniqueSuggested = [...new Set(suggested)];

  // Fallback
  if (uniqueSuggested.length === 0) {
    const maxContext = Math.max(contextual.love, contextual.friendship, contextual.creativeTeam, contextual.storyTension);
    if (maxContext === contextual.love) uniqueSuggested.push('LOVER');
    else if (maxContext === contextual.friendship) uniqueSuggested.push('FRIEND');
    else if (maxContext === contextual.creativeTeam) uniqueSuggested.push('ALLY');
    else uniqueSuggested.push('RIVAL');
  }

  // ----------------------------------------
  // NARRATIVE
  // ----------------------------------------
  const topContext = Object.entries(contextual)
    .sort(([, a], [, b]) => b - a)[0]!;

  const contextLabels: Record<string, string> = {
    love: 'romantic connection',
    friendship: 'friendship',
    creativeTeam: 'creative collaboration',
    storyTension: 'dramatic tension',
  };

  let narrative = `${base.narrative} Their strongest potential lies in ${contextLabels[topContext[0]]} (${Math.round(topContext[1] * 100)}%).`;

  if (mentorDirection) {
    narrative += ` A directional mentor bond exists — ${mentorDirection.mentorIsA ? 'the first' : 'the second'} can guide the other's growth.`;
  } else if (growthArrow) {
    narrative += ' A growth arrow connects them — one can elevate the other.';
  }

  if (antagonismType === 'ENEMY') {
    narrative += ' Mutual stress arrows or deep overcoming marks this as an existential conflict.';
  } else if (antagonismType === 'RIVAL') {
    narrative += ' A respectful challenge exists — rivalry that sharpens both.';
  } else if (stressArrow) {
    narrative += ' A stress arrow connects them — potential for volatility.';
  }

  if (siblingPattern) {
    narrative += ' Shared origin axes with divergent temperaments suggest a sibling bond.';
  }

  return {
    base,
    contextual,
    suggestedRelationshipTypes: uniqueSuggested,
    mentorDirection,
    narrative,
  };
}
