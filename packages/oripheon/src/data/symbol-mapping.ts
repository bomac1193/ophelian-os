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

export type MathSymbol = 'λ' | 'Σ' | 'Δ' | 'Ω' | 'Φ' | '∞' | 'Ψ' | 'Θ' | 'Ξ' | 'Π' | 'Γ' | 'α';

export type GeometricPrimitive = '⬡' | '●' | '▲' | '×' | '◆' | '◇' | '■' | '○' | '▶' | '+' | '≈' | '◎';

export type AestheticClass =
  | 'S-0'  // KĔṮU - Witness
  | 'T-1'  // LŌRχE - Recursion
  | 'V-2'  // ØMÆRA - Translation
  | 'L-3'  // Dū·ṂȺ - Transport
  | 'C-4'  // ΞDŌN - Interruption
  | 'N-5'  // LIMŊ - Binding
  | 'H-6'  // ȺBŌLT - Amplification
  | 'P-7'  // ȺRVŌ - Dampening
  | 'D-8'  // RŌχ - Shadow
  | 'F-9'  // K̄ALØN - Ignition
  | 'R-10' // TΞχRA - Division
  | 'NULL'; // SÆ - Anchor

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
    aestheticClass: 'F-9',
    label: 'K̄ALØN',
    keywords: ['Forge', 'Structure', 'Creation'],
    essence: 'Shapes raw material into form through will and craft',
    creativePhase: 'genesis',
    orisha: 'Ògún',
    sephira: 'Geburah',
  },

  'Ọ̀ṣun': {
    symbol: 'Σ',
    primitive: '≈',
    aestheticClass: 'N-5',
    label: 'LIMŊ',
    keywords: ['Beauty', 'Attraction', 'Fluidity'],
    essence: 'Channels desire and beauty to create irresistible currents',
    creativePhase: 'flow',
    orisha: 'Ọ̀ṣun',
    sephira: 'Netzach',
  },

  'Èṣù': {
    symbol: 'Δ',
    primitive: '×',
    aestheticClass: 'V-2',
    label: 'ØMÆRA',
    keywords: ['Chaos', 'Change', 'Crossroads'],
    essence: 'Disrupts patterns to enable transformation and new possibilities',
    creativePhase: 'vision',
    orisha: 'Èṣù',
    sephira: 'Daath',
  },

  'Ṣàngó': {
    symbol: 'Ω',
    primitive: '■',
    aestheticClass: 'H-6',
    label: 'ȺBŌLT',
    keywords: ['Justice', 'Thunder', 'Authority'],
    essence: 'Commands through presence and delivers swift judgment',
    creativePhase: 'manifestation',
    orisha: 'Ṣàngó',
    sephira: 'Tiphareth',
  },

  'Yemọja': {
    symbol: 'Φ',
    primitive: '●',
    aestheticClass: 'L-3',
    label: 'Dū·ṂȺ',
    keywords: ['Nurture', 'Depths', 'Mother'],
    essence: 'Holds space for all things to gestate and emerge in wholeness',
    creativePhase: 'manifestation',
    orisha: 'Yemọja',
    sephira: 'Binah',
  },

  'Ọ̀rúnmìlà': {
    symbol: '∞',
    primitive: '◇',
    aestheticClass: 'T-1',
    label: 'LŌRχE',
    keywords: ['Fate', 'Divination', 'Wisdom'],
    essence: 'Sees all possible futures and guides through uncertainty',
    creativePhase: 'refinement',
    orisha: 'Ọ̀rúnmìlà',
    sephira: 'Kether',
  },

  'Obàtálá': {
    symbol: 'Θ',
    primitive: '○',
    aestheticClass: 'S-0',
    label: 'KĔṮU',
    keywords: ['Purity', 'Creation', 'Wholeness'],
    essence: 'Manifests form from emptiness through perfect clarity',
    creativePhase: 'vision',
    orisha: 'Obàtálá',
    sephira: 'Kether',
  },

  'Ọ̀ṣọ́ọ̀sì': {
    symbol: 'Ξ',
    primitive: '▶',
    aestheticClass: 'C-4',
    label: 'ΞDŌN',
    keywords: ['Precision', 'Wilderness', 'Focus'],
    essence: 'Tracks truth through complexity with unwavering aim',
    creativePhase: 'refinement',
    orisha: 'Ọ̀ṣọ́ọ̀sì',
    sephira: 'Hod',
  },

  'Ọ̀sanyìn': {
    symbol: 'Π',
    primitive: '+',
    aestheticClass: 'P-7',
    label: 'ȺRVŌ',
    keywords: ['Medicine', 'Cycles', 'Restoration'],
    essence: 'Restores balance through knowledge of natural rhythms',
    creativePhase: 'flow',
    orisha: 'Ọ̀sanyìn',
    sephira: 'Yesod',
  },

  'Ọya': {
    symbol: 'Ψ',
    primitive: '▲',
    aestheticClass: 'R-10',
    label: 'TΞχRA',
    keywords: ['Storm', 'Transformation', 'Death'],
    essence: 'Clears away what no longer serves to birth the new',
    creativePhase: 'genesis',
    orisha: 'Ọya',
    sephira: 'Chokmah',
  },

  'Olókun': {
    symbol: 'Γ',
    primitive: '◆',
    aestheticClass: 'D-8',
    label: 'RŌχ',
    keywords: ['Depths', 'Secrets', 'Unconscious'],
    essence: 'Channels the unfathomable currents of the deep',
    creativePhase: 'flow',
    orisha: 'Olókun',
    sephira: 'Malkuth',
  },

  'Babalú-Ayé': {
    symbol: 'α',
    primitive: '◎',
    aestheticClass: 'NULL',
    label: 'SÆ',
    keywords: ['Wounds', 'Healing', 'Transformation'],
    essence: 'Transmutes suffering into medicine for the world',
    creativePhase: 'flow',
    orisha: 'Babalú-Ayé',
    sephira: 'Malkuth',
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
