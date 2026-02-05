/**
 * Progressive Disclosure System
 * Manages the three-layer reveal system for character genomes
 *
 * See DESIGN_PHILOSOPHY.md for full rationale
 */

import type { CharacterGenome } from '../types/genome.types.js';
import { getSymbolicImprint } from '../data/symbol-mapping.js';
import { ORISHA_DATA } from '../data/orisha-data.js';
import { SEPHIROTH_DATA } from '../data/sephiroth-data.js';

// ============================================================================
// LAYER 1: SURFACE (DEFAULT VIEW)
// ============================================================================

export interface SurfaceView {
  imprint: {
    symbol: string;      // λ
    primitive: string;   // ⬡
    label: string;       // Architect
    full: string;        // λ-Architect
  };
  classification: string; // L-3 (Industrial)
  state: {
    charge: number;      // +3
    stability: number;   // 0.72
    phase: string;       // Integration
  };
  lattice: {
    node: number;        // 5
    axis: string;        // Severity
    shadow: string;      // 5-inverse
  };
  markers: string[];     // [∞, λ, Δ, Φ]
}

export function getSurfaceView(genome: CharacterGenome): SurfaceView {
  const headOrisha = genome.orishaConfiguration.headOrisha;
  const imprint = getSymbolicImprint(headOrisha);
  const sephiraName = genome.kabbalisticPosition.primarySephira;
  const pillar = genome.kabbalisticPosition.pillar;

  // Extract node number from sephira (Kether=1, Malkuth=10, etc.)
  const nodeMap: Record<string, number> = {
    'Kether': 1, 'Chokmah': 2, 'Binah': 3,
    'Chesed': 4, 'Geburah': 5, 'Tiphareth': 6,
    'Netzach': 7, 'Hod': 8, 'Yesod': 9, 'Malkuth': 10
  };
  const nodeNumber = nodeMap[sephiraName] || 0;

  // Collect symbolic markers from secondary influences
  const markers = [imprint.symbol];
  if (genome.orishaConfiguration.secondaryInfluences) {
    genome.orishaConfiguration.secondaryInfluences.forEach(sec => {
      const secImprint = getSymbolicImprint(sec.orisha);
      if (secImprint && !markers.includes(secImprint.symbol)) {
        markers.push(secImprint.symbol);
      }
    });
  }

  return {
    imprint: {
      symbol: imprint.symbol,
      primitive: imprint.primitive,
      label: imprint.label,
      full: `${imprint.symbol}-${imprint.label}`,
    },
    classification: imprint.aestheticClass,
    state: {
      charge: Math.round(genome.psychologicalState.hotCoolAxis * 10),
      stability: genome.psychologicalState.shadowIntegration,
      phase: genome.psychologicalState.trajectory,
    },
    lattice: {
      node: nodeNumber,
      axis: pillar,
      shadow: `${nodeNumber}-inverse`,
    },
    markers,
  };
}

// ============================================================================
// LAYER 2: GATEWAY (TOOLTIPS & HINTS)
// ============================================================================

export interface GatewayHint {
  title: string;
  keywords: string[];
  essence: string;
  creativePhase: string;
  learnMoreUrl?: string;
}

export function getGatewayHint(genome: CharacterGenome): GatewayHint {
  const headOrisha = genome.orishaConfiguration.headOrisha;
  const imprint = getSymbolicImprint(headOrisha);

  return {
    title: `${imprint.symbol}-${imprint.label.toUpperCase()}`,
    keywords: imprint.keywords,
    essence: imprint.essence,
    creativePhase: `Primary Drive: ${imprint.creativePhase}`,
    learnMoreUrl: `/genome/${genome.id}/correspondences`,
  };
}

/**
 * Get tooltip text for a specific symbol
 */
export function getSymbolTooltip(symbol: string): string {
  const imprint = Object.values(getSymbolicImprint).find(
    (i: any) => i.symbol === symbol
  );

  if (!imprint) return '';

  return `${imprint.keywords.join(' · ')}\n\n${imprint.essence}\n\nPrimary Drive: ${imprint.creativePhase}`;
}

// ============================================================================
// LAYER 3: DEPTHS (FULL MYTHOLOGY)
// ============================================================================

export interface DepthsView {
  orisha: {
    name: string;
    title: string;
    camino: {
      name: string;
      aspect: string;
      description: string;
    };
    domain: string[];
    colors: string[];
    element: string;
    number: number;
    day: string;
    planet?: string;
    offerings?: string[];
    shadowForm?: {
      name: string;
      aspect: string;
      manifestation: string;
    };
  };
  kabbalah: {
    sephira: {
      name: string;
      hebrewName: string;
      meaning: string;
      pillar: string;
      planet?: string;
      archangel?: string;
      choir?: string;
    };
    qliphoth?: {
      name: string;
      meaning: string;
    };
    paths?: Array<{
      from: string;
      to: string;
      tarot?: string;
    }>;
  };
  correspondences: {
    tarot?: string[];
    jung?: string;
    norse?: string;
    iching?: string;
    enneagram?: string;
    mbti?: string;
  };
  psychological: {
    strengths: string[];
    shadowTendencies: string[];
    integrationPath: string;
  };
}

export function getDepthsView(genome: CharacterGenome): DepthsView {
  const orishaConfig = genome.orishaConfiguration;
  const kabbalistic = genome.kabbalisticPosition;

  // Get full Orisha data
  const orishaData = ORISHA_DATA[orishaConfig.headOrisha];
  const sephiraData = SEPHIROTH_DATA[kabbalistic.primarySephira];

  // Parse camino if it exists
  const caminoData = orishaConfig.camino ? {
    name: orishaConfig.camino,
    aspect: '',
    description: orishaConfig.camino,
  } : {
    name: 'Primary Path',
    aspect: '',
    description: 'The main road of this Orisha',
  };

  return {
    orisha: {
      name: orishaConfig.headOrisha,
      title: orishaData.title,
      camino: caminoData,
      domain: orishaData.domain,
      colors: orishaData.colors,
      element: orishaData.element,
      number: orishaData.number,
      day: orishaData.day,
      planet: undefined, // multiModalSignature doesn't have planet field
      offerings: [], // Would need to be populated from camino data
      shadowForm: orishaData.shadowForm,
    },
    kabbalah: {
      sephira: {
        name: sephiraData.name,
        hebrewName: sephiraData.hebrewName,
        meaning: sephiraData.meaning,
        pillar: sephiraData.pillar,
        planet: sephiraData.planet,
        archangel: undefined, // Not in Sephira type
        choir: undefined, // Not in Sephira type
      },
      qliphoth: kabbalistic.qliphothicShadow ? {
        name: kabbalistic.qliphothicShadow,
        meaning: sephiraData.qliphoth, // Use the qliphoth name from sephira
      } : undefined,
      paths: undefined, // Paths not in Sephira type, would need separate data
    },
    correspondences: {
      tarot: [], // Would need tarot correspondence data
      jung: '', // Would come from genome analysis
      norse: '',
      iching: '',
      enneagram: '',
      mbti: '',
    },
    psychological: {
      strengths: genome.narrativeIdentity?.coreValues || [],
      shadowTendencies: genome.narrativeIdentity?.centralConflicts || [],
      integrationPath: genome.narrativeIdentity?.telos || 'Balance opposing forces within',
    },
  };
}

// ============================================================================
// USER PREFERENCE MANAGEMENT
// ============================================================================

export type DisclosureLevel = 'surface' | 'gateway' | 'depths';

/**
 * Determines what level of detail to show based on user preference
 */
export function getDisclosureLevel(
  userPreference: DisclosureLevel = 'surface',
  hasAdvancedAccess: boolean = false
): DisclosureLevel {
  if (userPreference === 'depths' && !hasAdvancedAccess) {
    return 'gateway'; // Fallback if user doesn't have access
  }
  return userPreference;
}

/**
 * Check if user has earned advanced view access
 * (Can be based on: admin status, character count, time on platform, etc.)
 */
export function hasAdvancedViewAccess(user: {
  isAdmin?: boolean;
  characterCount?: number;
  createdAt?: Date;
}): boolean {
  // Admin always has access
  if (user.isAdmin) return true;

  // Unlock after creating 3 characters
  if (user.characterCount && user.characterCount >= 3) return true;

  // Unlock after 7 days on platform
  if (user.createdAt) {
    const daysSinceJoin = (Date.now() - user.createdAt.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceJoin >= 7) return true;
  }

  return false;
}
