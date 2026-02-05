/**
 * Symbol Mapping System
 * Maps Orisha → Mathematical Symbols + Geometric Primitives
 *
 * Part of the Progressive Disclosure System (see DESIGN_PHILOSOPHY.md)
 *
 * Layer 1: Users see symbols (λ, ⬡) and L-class
 * Layer 2: Tooltips show brief correspondences
 * Layer 3: Advanced View reveals full Orisha/Kabbalah
 */

import type { OrishaName, SephiraName } from '../types/genome.types.js';

// ============================================================================
// SYMBOL TYPES
// ============================================================================

export type MathSymbol = 'λ' | 'Σ' | 'Δ' | 'Ω' | 'Φ' | '∞' | 'Ψ' | 'Θ' | 'Ξ' | 'Π';

export type GeometricPrimitive = '⬡' | '●' | '▲' | '⚡' | '♛' | '◇' | '◆' | '○' | '▶' | '+' | '〰️';

export type AestheticClass =
  | 'L-0'  // Liminal/Paradox
  | 'L-1'  // Chaotic/Threshold
  | 'L-3'  // Industrial/Forge
  | 'L-5'  // Predatory/Hunt
  | 'L-6'  // Medicinal/Healing
  | 'L-7'  // Fluid/Beauty
  | 'L-8'  // Maternal/Nurture
  | 'L-9'  // Regal/Sovereignty
  | 'L-10' // Prophetic/Oracle
  | 'L-11' // Pure/Creation';

export interface SymbolicImprint {
  // Layer 1: What users see by default
  symbol: MathSymbol;
  primitive: GeometricPrimitive;
  aestheticClass: AestheticClass;
  label: string; // e.g., "Architect", "Flow", "Threshold"

  // Layer 2: Brief context (tooltips)
  keywords: string[]; // e.g., ["Forge", "Structure", "Creation"]
  essence: string; // One-sentence description
  creativePhase: 'genesis' | 'vision' | 'refinement' | 'manifestation' | 'flow';

  // Layer 3: Full mythology (Advanced View)
  orisha: OrishaName;
  sephira: SephiraName;
}

// ============================================================================
// CORE IMPRINT MAPPINGS
// ============================================================================

export const SYMBOLIC_IMPRINTS: Record<OrishaName, SymbolicImprint> = {
  'Ògún': {
    symbol: 'λ',
    primitive: '⬡',
    aestheticClass: 'L-3',
    label: 'Architect',
    keywords: ['Forge', 'Structure', 'Creation'],
    essence: 'Shapes raw material into form through will and craft',
    creativePhase: 'manifestation',
    orisha: 'Ògún',
    sephira: 'Geburah',
  },

  'Ọ̀ṣun': {
    symbol: 'Σ',
    primitive: '〰️',
    aestheticClass: 'L-7',
    label: 'Flow',
    keywords: ['Beauty', 'Attraction', 'Fluidity'],
    essence: 'Channels desire and beauty to create irresistible currents',
    creativePhase: 'flow',
    orisha: 'Ọ̀ṣun',
    sephira: 'Netzach',
  },

  'Èṣù': {
    symbol: 'Δ',
    primitive: '⚡',
    aestheticClass: 'L-1',
    label: 'Threshold',
    keywords: ['Chaos', 'Change', 'Crossroads'],
    essence: 'Disrupts patterns to enable transformation and new possibilities',
    creativePhase: 'genesis',
    orisha: 'Èṣù',
    sephira: 'Daath',
  },

  'Ṣàngó': {
    symbol: 'Ω',
    primitive: '♛',
    aestheticClass: 'L-9',
    label: 'Sovereign',
    keywords: ['Justice', 'Thunder', 'Authority'],
    essence: 'Commands through presence and delivers swift judgment',
    creativePhase: 'vision',
    orisha: 'Ṣàngó',
    sephira: 'Tiphareth',
  },

  'Yemọja': {
    symbol: 'Φ',
    primitive: '●',
    aestheticClass: 'L-8',
    label: 'Harmonic',
    keywords: ['Nurture', 'Depths', 'Mother'],
    essence: 'Holds space for all things to gestate and emerge in wholeness',
    creativePhase: 'flow',
    orisha: 'Yemọja',
    sephira: 'Binah',
  },

  'Ọ̀rúnmìlà': {
    symbol: '∞',
    primitive: '◇',
    aestheticClass: 'L-0',
    label: 'Paradox',
    keywords: ['Fate', 'Divination', 'Wisdom'],
    essence: 'Sees all possible futures and guides through uncertainty',
    creativePhase: 'vision',
    orisha: 'Ọ̀rúnmìlà',
    sephira: 'Kether',
  },

  'Obàtálá': {
    symbol: 'Θ',
    primitive: '○',
    aestheticClass: 'L-11',
    label: 'Void',
    keywords: ['Purity', 'Creation', 'Wholeness'],
    essence: 'Manifests form from emptiness through perfect clarity',
    creativePhase: 'genesis',
    orisha: 'Obàtálá',
    sephira: 'Kether',
  },

  'Ọ̀ṣọ́ọ̀sì': {
    symbol: 'Ξ',
    primitive: '▶',
    aestheticClass: 'L-5',
    label: 'Hunter',
    keywords: ['Precision', 'Wilderness', 'Focus'],
    essence: 'Tracks truth through complexity with unwavering aim',
    creativePhase: 'refinement',
    orisha: 'Ọ̀ṣọ́ọ̀sì',
    sephira: 'Hod',
  },

  'Ọ̀sanyìn': {
    symbol: 'Π',
    primitive: '+',
    aestheticClass: 'L-6',
    label: 'Healer',
    keywords: ['Medicine', 'Cycles', 'Restoration'],
    essence: 'Restores balance through knowledge of natural rhythms',
    creativePhase: 'refinement',
    orisha: 'Ọ̀sanyìn',
    sephira: 'Yesod',
  },

  'Ọya': {
    symbol: 'Ψ',
    primitive: '▲',
    aestheticClass: 'L-10',
    label: 'Oracle',
    keywords: ['Storm', 'Transformation', 'Death'],
    essence: 'Clears away what no longer serves to birth the new',
    creativePhase: 'genesis',
    orisha: 'Ọya',
    sephira: 'Chokmah',
  },
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get symbolic imprint for an Orisha
 */
export function getSymbolicImprint(orisha: OrishaName): SymbolicImprint {
  return SYMBOLIC_IMPRINTS[orisha];
}

/**
 * Get frontend display label (Layer 1)
 */
export function getImprintLabel(orisha: OrishaName): string {
  const imprint = SYMBOLIC_IMPRINTS[orisha];
  return `${imprint.symbol}-${imprint.label}`;
}

/**
 * Get tooltip text (Layer 2)
 */
export function getImprintTooltip(orisha: OrishaName): string {
  const imprint = SYMBOLIC_IMPRINTS[orisha];
  return `${imprint.keywords.join(' · ')}\n\n${imprint.essence}`;
}

/**
 * Format full imprint display (Layer 1 default UI)
 */
export function formatImprintDisplay(orisha: OrishaName): {
  symbol: string;
  primitive: string;
  label: string;
  aestheticClass: string;
} {
  const imprint = SYMBOLIC_IMPRINTS[orisha];
  return {
    symbol: imprint.symbol,
    primitive: imprint.primitive,
    label: imprint.label,
    aestheticClass: imprint.aestheticClass,
  };
}

// ============================================================================
// REVERSE LOOKUPS
// ============================================================================

/**
 * Get Orisha from symbol
 */
export function getOrishaFromSymbol(symbol: MathSymbol): OrishaName | null {
  const entry = Object.entries(SYMBOLIC_IMPRINTS).find(
    ([_, imprint]) => imprint.symbol === symbol
  );
  return entry ? (entry[0] as OrishaName) : null;
}

/**
 * Get Orisha from aesthetic class
 */
export function getOrishaFromAesthetic(aestheticClass: AestheticClass): OrishaName | null {
  const entry = Object.entries(SYMBOLIC_IMPRINTS).find(
    ([_, imprint]) => imprint.aestheticClass === aestheticClass
  );
  return entry ? (entry[0] as OrishaName) : null;
}
