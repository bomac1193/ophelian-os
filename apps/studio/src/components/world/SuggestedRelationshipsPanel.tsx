'use client';

import { useState, useMemo } from 'react';
import type { Character, CreateRelationshipInput, RelationshipType } from '@/lib/api';

// ============================================================================
// INLINE COMPATIBILITY ENGINE
// (Mirrors packages/oripheon/src/data — inlined to avoid cross-package dependency)
// ============================================================================

type WuXingElement = 'wood' | 'fire' | 'earth' | 'metal' | 'water';
type PipelinePhase = 'genesis' | 'vision' | 'refinement' | 'manifestation' | 'flow';
type RelationalCycle = 'generating' | 'overcoming' | 'neutral';
type ComparisonPattern = 'mirror' | 'complement' | 'parallel' | 'friction' | 'neutral';
type SubtasteDesignation =
  | 'S-0 KĔṮU' | 'T-1 LŌRχE' | 'V-2 ØMÆRA' | 'L-3 Dū·ṂȺ' | 'C-4 ΞDŌN' | 'N-5 LIMŊ'
  | 'H-6 ȺBŌLT' | 'P-7 ȺRVŌ' | 'D-8 RŌχ' | 'F-9 K̄ALØN' | 'R-10 TΞχRA' | 'NULL SÆ';

interface Axes {
  orderChaos: number;
  mercyRuthlessness: number;
  introvertExtrovert: number;
  faithDoubt: number;
}

interface ProfileAnalysis {
  subtaste: SubtasteDesignation;
  phase: PipelinePhase;
  wuXingElement: WuXingElement;
  axes: Axes;
}

interface ContextualCompatibility {
  love: number;
  friendship: number;
  creativeTeam: number;
  storyTension: number;
}

interface ProfileComparison {
  pattern: ComparisonPattern;
  relationalCycle: RelationalCycle;
  overallDistance: number;
}

interface MentorDirection {
  mentorIsA: boolean;
}

interface RelationshipMatrix {
  base: ProfileComparison;
  contextual: ContextualCompatibility;
  suggestedRelationshipTypes: string[];
  mentorDirection: MentorDirection | null;
}

const PIPELINE: PipelinePhase[] = ['genesis', 'vision', 'refinement', 'manifestation', 'flow'];

const PHASE_MAP: Record<SubtasteDesignation, PipelinePhase> = {
  'S-0 KĔṮU': 'vision', 'T-1 LŌRχE': 'refinement', 'V-2 ØMÆRA': 'vision',
  'L-3 Dū·ṂȺ': 'manifestation', 'C-4 ΞDŌN': 'refinement', 'N-5 LIMŊ': 'flow',
  'H-6 ȺBŌLT': 'manifestation', 'P-7 ȺRVŌ': 'flow', 'D-8 RŌχ': 'flow',
  'F-9 K̄ALØN': 'genesis', 'R-10 TΞχRA': 'genesis', 'NULL SÆ': 'flow',
};

const ELEMENT_MAP: Record<PipelinePhase, WuXingElement> = {
  genesis: 'fire', vision: 'wood', refinement: 'metal', manifestation: 'earth', flow: 'water',
};

const WU_XING_GEN: Record<WuXingElement, WuXingElement> = {
  wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood',
};
const WU_XING_KE: Record<WuXingElement, WuXingElement> = {
  wood: 'earth', earth: 'water', water: 'fire', fire: 'metal', metal: 'wood',
};

const GROWTH_ARROWS: Record<SubtasteDesignation, SubtasteDesignation> = {
  'S-0 KĔṮU': 'D-8 RŌχ', 'T-1 LŌRχE': 'N-5 LIMŊ', 'V-2 ØMÆRA': 'L-3 Dū·ṂȺ',
  'L-3 Dū·ṂȺ': 'S-0 KĔṮU', 'C-4 ΞDŌN': 'H-6 ȺBŌLT', 'N-5 LIMŊ': 'V-2 ØMÆRA',
  'H-6 ȺBŌLT': 'T-1 LŌRχE', 'P-7 ȺRVŌ': 'C-4 ΞDŌN', 'D-8 RŌχ': 'F-9 K̄ALØN',
  'F-9 K̄ALØN': 'N-5 LIMŊ', 'R-10 TΞχRA': 'H-6 ȺBŌLT', 'NULL SÆ': 'R-10 TΞχRA',
};
const STRESS_ARROWS: Record<SubtasteDesignation, SubtasteDesignation> = {
  'S-0 KĔṮU': 'R-10 TΞχRA', 'T-1 LŌRχE': 'P-7 ȺRVŌ', 'V-2 ØMÆRA': 'C-4 ΞDŌN',
  'L-3 Dū·ṂȺ': 'D-8 RŌχ', 'C-4 ΞDŌN': 'R-10 TΞχRA', 'N-5 LIMŊ': 'NULL SÆ',
  'H-6 ȺBŌLT': 'F-9 K̄ALØN', 'P-7 ȺRVŌ': 'L-3 Dū·ṂȺ', 'D-8 RŌχ': 'N-5 LIMŊ',
  'F-9 K̄ALØN': 'C-4 ΞDŌN', 'R-10 TΞχRA': 'S-0 KĔṮU', 'NULL SÆ': 'T-1 LŌRχE',
};

const SUBTASTE_LABELS: Record<SubtasteDesignation, string> = {
  'S-0 KĔṮU': 'Witness', 'T-1 LŌRχE': 'Recursion', 'V-2 ØMÆRA': 'Translation',
  'L-3 Dū·ṂȺ': 'Transport', 'C-4 ΞDŌN': 'Interruption', 'N-5 LIMŊ': 'Binding',
  'H-6 ȺBŌLT': 'Amplification', 'P-7 ȺRVŌ': 'Dampening', 'D-8 RŌχ': 'Shadow',
  'F-9 K̄ALØN': 'Ignition', 'R-10 TΞχRA': 'Division', 'NULL SÆ': 'Anchor',
};

function deriveSubtaste(axes: Axes): SubtasteDesignation {
  const { orderChaos, mercyRuthlessness, introvertExtrovert, faithDoubt } = axes;
  const authority = (orderChaos + (1 - mercyRuthlessness)) / 2;
  const intuition = (faithDoubt + (1 - introvertExtrovert)) / 2;
  const action = (orderChaos + introvertExtrovert) / 2;
  const reception = ((1 - orderChaos) + (1 - introvertExtrovert)) / 2;

  if (authority > 0.7 && orderChaos > 0.6) return 'S-0 KĔṮU';
  if (introvertExtrovert < 0.35 && faithDoubt < 0.4) return 'T-1 LŌRχE';
  if (faithDoubt > 0.7 && intuition > 0.6) return 'V-2 ØMÆRA';
  if (mercyRuthlessness < 0.4 && action < 0.4) return 'L-3 Dū·ṂȺ';
  if (mercyRuthlessness > 0.65 && orderChaos > 0.4 && orderChaos < 0.7) return 'C-4 ΞDŌN';
  if (introvertExtrovert > 0.65 && faithDoubt > 0.5) return 'N-5 LIMŊ';
  if (mercyRuthlessness < 0.35 && introvertExtrovert > 0.55) return 'H-6 ȺBŌLT';
  if (introvertExtrovert < 0.4 && orderChaos > 0.6) return 'P-7 ȺRVŌ';
  if (orderChaos < 0.35 && reception > 0.5) return 'D-8 RŌχ';
  if (action > 0.6 && mercyRuthlessness > 0.55) return 'F-9 K̄ALØN';
  if (orderChaos < 0.25) return 'R-10 TΞχRA';
  return 'NULL SÆ';
}

function analyzeProfile(axes: Axes): ProfileAnalysis {
  const subtaste = deriveSubtaste(axes);
  const phase = PHASE_MAP[subtaste];
  return { subtaste, phase, wuXingElement: ELEMENT_MAP[phase], axes };
}

function getWuXingRelation(a: WuXingElement, b: WuXingElement): RelationalCycle {
  if (a === b) return 'neutral';
  if (WU_XING_GEN[a] === b || WU_XING_GEN[b] === a) return 'generating';
  if (WU_XING_KE[a] === b || WU_XING_KE[b] === a) return 'overcoming';
  return 'neutral';
}

function clamp01(v: number): number { return Math.max(0, Math.min(1, v)); }
function phaseIdx(p: PipelinePhase): number { return PIPELINE.indexOf(p); }

function adjacentPhases(pa: PipelinePhase, pb: PipelinePhase): boolean {
  const ia = phaseIdx(pa), ib = phaseIdx(pb);
  return Math.abs(ia - ib) <= 1 || (ia === 0 && ib === 4) || (ia === 4 && ib === 0);
}

function detectMentor(a: ProfileAnalysis, b: ProfileAnalysis): MentorDirection | null {
  let aMb = 0, bMa = 0;
  if (WU_XING_GEN[a.wuXingElement] === b.wuXingElement) aMb++;
  if (GROWTH_ARROWS[b.subtaste] === a.subtaste) aMb++;
  if (phaseIdx(a.phase) > phaseIdx(b.phase)) aMb++;
  if (WU_XING_GEN[b.wuXingElement] === a.wuXingElement) bMa++;
  if (GROWTH_ARROWS[a.subtaste] === b.subtaste) bMa++;
  if (phaseIdx(b.phase) > phaseIdx(a.phase)) bMa++;
  if (aMb >= 2 && aMb > bMa) return { mentorIsA: true };
  if (bMa >= 2 && bMa > aMb) return { mentorIsA: false };
  return null;
}

function isSiblingPattern(a: ProfileAnalysis, b: ProfileAnalysis): boolean {
  const originClose = Math.abs(a.axes.orderChaos - b.axes.orderChaos) < 0.2 &&
    Math.abs(a.axes.faithDoubt - b.axes.faithDoubt) < 0.2;
  const tempDiverge = Math.abs(a.axes.mercyRuthlessness - b.axes.mercyRuthlessness) > 0.3 ||
    Math.abs(a.axes.introvertExtrovert - b.axes.introvertExtrovert) > 0.3;
  return originClose && tempDiverge && adjacentPhases(a.phase, b.phase);
}

function classifyAntagonism(
  a: ProfileAnalysis, b: ProfileAnalysis, pattern: string, cycle: string,
): 'ENEMY' | 'RIVAL' {
  if (STRESS_ARROWS[a.subtaste] === b.subtaste && STRESS_ARROWS[b.subtaste] === a.subtaste) return 'ENEMY';
  if (cycle === 'overcoming' && pattern === 'friction') return 'ENEMY';
  return 'RIVAL';
}

function computeMatrix(a: ProfileAnalysis, b: ProfileAnalysis): RelationshipMatrix {
  const deltas = {
    orderChaos: Math.abs(a.axes.orderChaos - b.axes.orderChaos),
    mercyRuthlessness: Math.abs(a.axes.mercyRuthlessness - b.axes.mercyRuthlessness),
    introvertExtrovert: Math.abs(a.axes.introvertExtrovert - b.axes.introvertExtrovert),
    faithDoubt: Math.abs(a.axes.faithDoubt - b.axes.faithDoubt),
  };
  const dist = Math.sqrt(
    deltas.orderChaos ** 2 + deltas.mercyRuthlessness ** 2 +
    deltas.introvertExtrovert ** 2 + deltas.faithDoubt ** 2
  ) / 2;

  const cycle = getWuXingRelation(a.wuXingElement, b.wuXingElement);
  let pattern: ComparisonPattern;
  if (dist < 0.15) pattern = 'mirror';
  else if (dist < 0.35) pattern = 'parallel';
  else if (dist > 0.7) pattern = 'friction';
  else {
    const close = Object.values(deltas).filter(d => d < 0.2).length;
    const far = Object.values(deltas).filter(d => d > 0.5).length;
    pattern = close >= 2 && far >= 1 ? 'complement' : 'neutral';
  }

  const growthArrow = GROWTH_ARROWS[a.subtaste] === b.subtaste || GROWTH_ARROWS[b.subtaste] === a.subtaste;
  const stressArrow = STRESS_ARROWS[a.subtaste] === b.subtaste || STRESS_ARROWS[b.subtaste] === a.subtaste;
  const samePhase = a.phase === b.phase;
  const energyContrast = Math.abs(a.axes.introvertExtrovert - b.axes.introvertExtrovert);
  const sameEnergy = energyContrast < 0.2;

  const mentorDirection = detectMentor(a, b);
  const siblingPattern = isSiblingPattern(a, b);
  const antagonism = (pattern === 'friction' || cycle === 'overcoming' || stressArrow)
    ? classifyAntagonism(a, b, pattern, cycle) : null;

  let love = 0.4;
  if (pattern === 'complement') love += 0.25;
  if (pattern === 'mirror') love += 0.2;
  if (cycle === 'generating') love += 0.15;
  if (energyContrast > 0.3) love += 0.1;
  if (growthArrow) love += 0.1;
  if (pattern === 'friction') love -= 0.1;
  if (siblingPattern) love -= 0.15;

  let friendship = 0.4;
  if (pattern === 'parallel') friendship += 0.25;
  if (pattern === 'complement') friendship += 0.15;
  if (sameEnergy) friendship += 0.15;
  if (samePhase) friendship += 0.1;
  if (siblingPattern) friendship += 0.1;
  if (pattern === 'friction') friendship -= 0.15;

  let creativeTeam = 0.35;
  if (pattern === 'complement') creativeTeam += 0.25;
  if (!samePhase) creativeTeam += 0.1;
  if (cycle === 'generating') creativeTeam += 0.2;
  if (growthArrow) creativeTeam += 0.1;
  if (mentorDirection) creativeTeam += 0.1;

  let storyTension = 0.3;
  if (pattern === 'friction') storyTension += 0.3;
  if (cycle === 'overcoming') storyTension += 0.2;
  if (stressArrow) storyTension += 0.15;
  if (antagonism === 'ENEMY') storyTension += 0.1;
  if (dist > 0.5) storyTension += 0.1;

  const suggested: string[] = [];
  if (antagonism === 'ENEMY') suggested.push('ENEMY');
  else if (antagonism === 'RIVAL') suggested.push('RIVAL');
  if (mentorDirection) suggested.push('MENTOR');
  if (siblingPattern) suggested.push('FAMILY');
  if (pattern === 'mirror' && !siblingPattern) suggested.push('LOVER');
  if (pattern === 'complement') suggested.push('ALLY', 'FRIEND');
  if (pattern === 'parallel') suggested.push('FRIEND');
  if (growthArrow && !mentorDirection) suggested.push('ALLY');
  const unique = [...new Set(suggested)];
  if (unique.length === 0) unique.push('FRIEND');

  return {
    base: { pattern, relationalCycle: cycle, overallDistance: dist },
    contextual: {
      love: clamp01(love), friendship: clamp01(friendship),
      creativeTeam: clamp01(creativeTeam), storyTension: clamp01(storyTension),
    },
    suggestedRelationshipTypes: unique,
    mentorDirection,
  };
}

// ============================================================================
// EXPORTED: compute suggestion for two specific characters (used by modal)
// ============================================================================

export function computeSuggestionForPair(
  source: Character,
  target: Character,
): { suggestedType: string; score: number; mentorDirection: MentorDirection | null; narrative: string } | null {
  const axesA = extractAxes(source);
  const axesB = extractAxes(target);
  if (!axesA || !axesB) return null;

  const profileA = analyzeProfile(axesA);
  const profileB = analyzeProfile(axesB);
  const matrix = computeMatrix(profileA, profileB);

  const topCtx = Object.entries(matrix.contextual)
    .sort(([, a], [, b]) => b - a)[0]!;

  const ctxLabels: Record<string, string> = {
    love: 'romantic', friendship: 'friendship', creativeTeam: 'creative', storyTension: 'tension',
  };

  const suggestedType = matrix.suggestedRelationshipTypes[0] || 'FRIEND';
  const score = topCtx[1];
  const mentorLabel = matrix.mentorDirection
    ? (matrix.mentorDirection.mentorIsA ? `${source.name} mentors ${target.name}` : `${target.name} mentors ${source.name}`)
    : '';

  let narrative = `Suggested: ${suggestedType} (${Math.round(score * 100)}% ${ctxLabels[topCtx[0]]})`;
  if (mentorLabel) narrative += ` \u2014 ${mentorLabel}`;

  return { suggestedType, score, mentorDirection: matrix.mentorDirection, narrative };
}

// ============================================================================
// EXPORTED: get subtaste info for a character (used by detail panel)
// ============================================================================

export interface SubtasteInfo {
  subtaste: SubtasteDesignation;
  label: string;
  phase: PipelinePhase;
  wuXingElement: WuXingElement;
  growth: SubtasteDesignation;
  growthLabel: string;
  stress: SubtasteDesignation;
  stressLabel: string;
  generates: WuXingElement;
  overcomeBy: WuXingElement;
}

export function getSubtasteInfo(character: Character): SubtasteInfo | null {
  const axes = extractAxes(character);
  if (!axes) return null;

  const profile = analyzeProfile(axes);
  const el = profile.wuXingElement;

  return {
    subtaste: profile.subtaste,
    label: SUBTASTE_LABELS[profile.subtaste],
    phase: profile.phase,
    wuXingElement: el,
    growth: GROWTH_ARROWS[profile.subtaste],
    growthLabel: SUBTASTE_LABELS[GROWTH_ARROWS[profile.subtaste]],
    stress: STRESS_ARROWS[profile.subtaste],
    stressLabel: SUBTASTE_LABELS[STRESS_ARROWS[profile.subtaste]],
    generates: WU_XING_GEN[el],
    overcomeBy: WU_XING_KE[el] === el ? el : (() => {
      // find what overcomes this element
      for (const [k, v] of Object.entries(WU_XING_KE)) {
        if (v === el) return k as WuXingElement;
      }
      return el;
    })(),
  };
}

// ============================================================================
// COMPONENT TYPES
// ============================================================================

interface SuggestedRelationshipsPanelProps {
  selectedCharacter: Character;
  allCharacters: Character[];
  onCreateRelationship: (data: CreateRelationshipInput) => Promise<void>;
}

type ContextTab = 'love' | 'friendship' | 'creativeTeam' | 'storyTension';

interface ScoredCharacter {
  character: Character;
  matrix: RelationshipMatrix;
  score: number;
  profileB: ProfileAnalysis;
}

// ============================================================================
// HELPERS
// ============================================================================

function extractAxes(character: Character): Axes | null {
  const oripheon = character.timelineState?.oripheon as
    | { generated?: { personality?: { axes?: Record<string, number> } } }
    | undefined;

  const axes = oripheon?.generated?.personality?.axes;
  if (
    axes &&
    typeof axes.orderChaos === 'number' &&
    typeof axes.mercyRuthlessness === 'number' &&
    typeof axes.introvertExtrovert === 'number' &&
    typeof axes.faithDoubt === 'number'
  ) {
    return {
      orderChaos: axes.orderChaos,
      mercyRuthlessness: axes.mercyRuthlessness,
      introvertExtrovert: axes.introvertExtrovert,
      faithDoubt: axes.faithDoubt,
    };
  }
  return null;
}

const TAB_LABELS: Record<ContextTab, string> = {
  love: 'Love',
  friendship: 'Friend',
  creativeTeam: 'Creative',
  storyTension: 'Tension',
};

const WU_XING_SYMBOLS: Record<string, string> = {
  wood: '\u6728',   // 木
  fire: '\u706b',   // 火
  earth: '\u571f',  // 土
  metal: '\u91d1',  // 金
  water: '\u6c34',  // 水
};

const CYCLE_LABELS: Record<string, string> = {
  generating: 'Sheng',
  overcoming: 'Ke',
  neutral: '\u2014',
};

// ============================================================================
// COMPONENT
// ============================================================================

export function SuggestedRelationshipsPanel({
  selectedCharacter,
  allCharacters,
  onCreateRelationship,
}: SuggestedRelationshipsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [activeTab, setActiveTab] = useState<ContextTab>('love');
  const [creating, setCreating] = useState<string | null>(null);

  const selectedAxes = extractAxes(selectedCharacter);
  const selectedProfile = useMemo(
    () => (selectedAxes ? analyzeProfile(selectedAxes) : null),
    [selectedAxes?.orderChaos, selectedAxes?.mercyRuthlessness, selectedAxes?.introvertExtrovert, selectedAxes?.faithDoubt],
  );

  const scored: ScoredCharacter[] = useMemo(() => {
    if (!selectedProfile) return [];

    return allCharacters
      .filter(c => c.id !== selectedCharacter.id)
      .map(c => {
        const axes = extractAxes(c);
        if (!axes) return null;
        const profileB = analyzeProfile(axes);
        const matrix = computeMatrix(selectedProfile, profileB);
        return { character: c, matrix, score: matrix.contextual[activeTab], profileB };
      })
      .filter((x): x is ScoredCharacter => x !== null)
      .sort((a, b) => b.score - a.score);
  }, [selectedProfile, allCharacters, selectedCharacter.id, activeTab]);

  if (!selectedProfile || scored.length === 0) return null;

  const handleCreate = async (targetId: string, suggestedType: RelationshipType) => {
    setCreating(targetId);
    try {
      await onCreateRelationship({
        sourceCharacterId: selectedCharacter.id,
        targetCharacterId: targetId,
        relationshipType: suggestedType,
      });
    } finally {
      setCreating(null);
    }
  };

  return (
    <div className="suggested-panel">
      <div
        className="suggested-panel-header"
        onClick={() => setCollapsed(!collapsed)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter') setCollapsed(!collapsed); }}
      >
        <span className="suggested-panel-title">Suggested Relationships</span>
        <span className="suggested-panel-toggle">{collapsed ? '+' : '\u2212'}</span>
      </div>

      {!collapsed && (
        <>
          <div className="suggested-tabs">
            {(Object.keys(TAB_LABELS) as ContextTab[]).map(tab => (
              <button
                key={tab}
                className={`suggested-tab${activeTab === tab ? ' suggested-tab-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {TAB_LABELS[tab]}
              </button>
            ))}
          </div>

          <div className="suggested-cards">
            {scored.slice(0, 6).map(({ character, matrix, score, profileB }) => {
              const pct = Math.round(score * 100);
              const topSuggested = matrix.suggestedRelationshipTypes[0] || 'ALLY';
              const mentorNote = matrix.mentorDirection
                ? (matrix.mentorDirection.mentorIsA ? 'mentors \u2192' : '\u2190 mentored by')
                : '';

              return (
                <div key={character.id} className="suggested-card">
                  <div className="suggested-card-top">
                    <span className="suggested-card-name">{character.name}</span>
                    <span className="suggested-card-pct">{pct}%</span>
                  </div>

                  <div className="suggested-bar-track">
                    <div className="suggested-bar-fill" style={{ width: `${pct}%` }} />
                  </div>

                  <div className="suggested-card-meta">
                    <span className="suggested-wu-xing">
                      {WU_XING_SYMBOLS[selectedProfile.wuXingElement] || '?'}
                      {' '}
                      {CYCLE_LABELS[matrix.base.relationalCycle]}
                      {' '}
                      {WU_XING_SYMBOLS[profileB.wuXingElement] || '?'}
                    </span>
                    <span className="suggested-types">
                      {matrix.suggestedRelationshipTypes.slice(0, 2).join(' / ')}
                    </span>
                  </div>

                  {mentorNote && (
                    <div className="suggested-mentor-note">{mentorNote}</div>
                  )}

                  <button
                    className="btn btn-sm suggested-create-btn"
                    disabled={creating === character.id}
                    onClick={() => handleCreate(character.id, topSuggested as RelationshipType)}
                  >
                    {creating === character.id ? '...' : `+ ${topSuggested}`}
                  </button>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
