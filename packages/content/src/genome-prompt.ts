/**
 * Genome-Driven Content Generation
 * Translates Orisha-Kabbalah genome into LLM prompts
 *
 * This is the Blue Ocean differentiator: Character DNA → Content Style
 */

import type { OrishaName, SephiraName } from '@lcos/oripheon';
import type { PersonalityProfile } from './personality.js';

// ============================================================================
// ORISHA → CREATIVE VOICE MAPPING
// ============================================================================

interface OrishaVoice {
  tone: string[];
  style: string[];
  themes: string[];
  openings: string[];
  avoidances: string[];
}

export const ORISHA_VOICES: Record<OrishaName, OrishaVoice> = {
  'Èṣù': {
    tone: ['playful', 'provocative', 'unpredictable', 'witty'],
    style: ['trickster wisdom', 'paradoxical', 'question-raising', 'liminal'],
    themes: ['crossroads', 'change', 'communication', 'choice', 'beginnings'],
    openings: ['What if...', 'Consider this...', 'At the crossroads...', 'The messenger brings...'],
    avoidances: ['predictable', 'conventional', 'boring', 'straightforward'],
  },

  'Ògún': {
    tone: ['direct', 'powerful', 'decisive', 'commanding'],
    style: ['forge-focused', 'action-oriented', 'builder mindset', 'obstacle-crusher'],
    themes: ['creation', 'work', 'technology', 'determination', 'pathfinding'],
    openings: ['Build...', 'Forge ahead...', 'Clear the path...', 'Iron will demands...'],
    avoidances: ['passive', 'weak', 'hesitant', 'flowery'],
  },

  'Ọ̀ṣun': {
    tone: ['sensual', 'magnetic', 'charming', 'sweet'],
    style: ['flowing', 'beauty-focused', 'seductive', 'abundant'],
    themes: ['love', 'beauty', 'prosperity', 'fertility', 'attraction'],
    openings: ['Let it flow...', 'Beauty reveals...', 'Sweet as honey...', 'Irresistible...'],
    avoidances: ['harsh', 'ugly', 'crude', 'repulsive'],
  },

  'Yemọja': {
    tone: ['nurturing', 'deep', 'maternal', 'protective'],
    style: ['oceanic', 'vast', 'all-encompassing', 'rhythmic'],
    themes: ['motherhood', 'depths', 'secrets', 'protection', 'origins'],
    openings: ['From the depths...', 'Mother knows...', 'The ocean holds...', 'Embrace this...'],
    avoidances: ['shallow', 'childish', 'reckless', 'abandoning'],
  },

  'Ṣàngó': {
    tone: ['authoritative', 'passionate', 'intense', 'regal'],
    style: ['thunderous', 'dramatic', 'justice-driven', 'sovereign'],
    themes: ['power', 'justice', 'passion', 'thunder', 'leadership'],
    openings: ['I decree...', 'Justice demands...', 'The thunder speaks...', 'Bow before...'],
    avoidances: ['weak', 'unjust', 'submissive', 'quiet'],
  },

  'Ọya': {
    tone: ['fierce', 'transformative', 'intense', 'storm-like'],
    style: ['whirlwind', 'death-rebirth', 'revolutionary', 'unstoppable'],
    themes: ['change', 'death', 'transformation', 'ancestors', 'winds'],
    openings: ['The storm comes...', 'Transformation awaits...', 'Sweep away...', 'From death, life...'],
    avoidances: ['stagnant', 'gentle', 'status quo', 'comfortable'],
  },

  'Obàtálá': {
    tone: ['wise', 'pure', 'calm', 'dignified'],
    style: ['cloud-like', 'creator-focused', 'pristine', 'measured'],
    themes: ['creation', 'purity', 'wisdom', 'peace', 'clarity'],
    openings: ['In purity...', 'The creator speaks...', 'Clear as clouds...', 'Wisdom says...'],
    avoidances: ['dirty', 'chaotic', 'violent', 'impure'],
  },

  'Ọ̀rúnmìlà': {
    tone: ['prophetic', 'wise', 'complex', 'paradoxical'],
    style: ['oracle-like', 'fate-reading', 'infinite', 'layered'],
    themes: ['destiny', 'divination', 'wisdom', 'choice', 'knowledge'],
    openings: ['The oracle sees...', 'Destiny reveals...', 'Wisdom infinite...', 'Choose wisely...'],
    avoidances: ['simplistic', 'ignorant', 'fatalistic', 'blind'],
  },

  'Ọ̀ṣọ́ọ̀sì': {
    tone: ['focused', 'precise', 'patient', 'determined'],
    style: ['hunter-tracker', 'provision-minded', 'wilderness', 'sharp'],
    themes: ['hunting', 'provision', 'focus', 'wilderness', 'justice'],
    openings: ['Track this...', 'The arrow flies...', 'Hunt with purpose...', 'Wilderness teaches...'],
    avoidances: ['scattered', 'wasteful', 'lost', 'aimless'],
  },

  'Ọ̀sanyìn': {
    tone: ['healing', 'mysterious', 'herbal', 'wise'],
    style: ['medicinal', 'plant-focused', 'cyclical', 'balanced'],
    themes: ['healing', 'herbs', 'medicine', 'balance', 'nature'],
    openings: ['The herb knows...', 'Heal with...', 'Balance requires...', 'Nature provides...'],
    avoidances: ['poison', 'sickness', 'imbalance', 'synthetic'],
  },
};

// ============================================================================
// SEPHIRA → THEMATIC GUIDANCE
// ============================================================================

interface SephiraTheme {
  essence: string;
  contentFocus: string[];
  tonalGuidance: string;
}

export const SEPHIRA_THEMES: Record<SephiraName, SephiraTheme> = {
  'Kether': {
    essence: 'Crown - Pure consciousness, unity, divine source',
    contentFocus: ['unity', 'source', 'divinity', 'totality', 'transcendence'],
    tonalGuidance: 'Speak from the highest perspective, unifying all things',
  },

  'Chokmah': {
    essence: 'Wisdom - Raw creative force, masculine energy',
    contentFocus: ['wisdom', 'creativity', 'force', 'innovation', 'spark'],
    tonalGuidance: 'Channel creative breakthrough energy, be the spark',
  },

  'Binah': {
    essence: 'Understanding - Form-giver, feminine receptivity',
    contentFocus: ['understanding', 'form', 'structure', 'depth', 'womb'],
    tonalGuidance: 'Give shape to ideas, hold space for gestation',
  },

  'Chesed': {
    essence: 'Mercy - Loving-kindness, abundance, expansion',
    contentFocus: ['mercy', 'abundance', 'giving', 'expansion', 'generosity'],
    tonalGuidance: 'Be generous and expansive, give freely',
  },

  'Geburah': {
    essence: 'Severity - Strength, discipline, judgment',
    contentFocus: ['strength', 'discipline', 'judgment', 'boundaries', 'cutting'],
    tonalGuidance: 'Be strong and decisive, cut what doesn\'t serve',
  },

  'Tiphareth': {
    essence: 'Beauty - Harmony, balance, heart center',
    contentFocus: ['beauty', 'harmony', 'balance', 'heart', 'integration'],
    tonalGuidance: 'Harmonize all elements, speak from the heart',
  },

  'Netzach': {
    essence: 'Victory - Passion, desire, perseverance',
    contentFocus: ['victory', 'passion', 'desire', 'art', 'endurance'],
    tonalGuidance: 'Be passionate and persistent, victory through feeling',
  },

  'Hod': {
    essence: 'Splendor - Intellect, communication, structure',
    contentFocus: ['intellect', 'communication', 'logic', 'splendor', 'form'],
    tonalGuidance: 'Communicate with clarity and intellectual rigor',
  },

  'Yesod': {
    essence: 'Foundation - Subconscious, dreams, connection',
    contentFocus: ['foundation', 'dreams', 'subconscious', 'connection', 'bridge'],
    tonalGuidance: 'Bridge conscious and unconscious, speak to dreams',
  },

  'Malkuth': {
    essence: 'Kingdom - Physical manifestation, Earth, reality',
    contentFocus: ['manifestation', 'physical', 'earth', 'practical', 'real'],
    tonalGuidance: 'Ground in physical reality, make it tangible',
  },

  'Daath': {
    essence: 'Knowledge - Hidden, abyss, forbidden wisdom',
    contentFocus: ['hidden knowledge', 'abyss', 'mystery', 'forbidden', 'threshold'],
    tonalGuidance: 'Speak the unspeakable, reveal hidden truths',
  },
};

// ============================================================================
// L-CLASS → AESTHETIC STYLE
// ============================================================================

interface AestheticStyle {
  visualLanguage: string[];
  writingStyle: string;
  avoid: string[];
}

export const L_CLASS_AESTHETICS: Record<string, AestheticStyle> = {
  'L-0': {
    visualLanguage: ['paradoxical', 'liminal', 'infinite', 'impossible', 'contradictory'],
    writingStyle: 'Embrace contradiction and paradox, blur boundaries',
    avoid: ['binary thinking', 'either-or', 'simple'],
  },

  'L-1': {
    visualLanguage: ['chaotic', 'threshold', 'edgy', 'boundary-crossing', 'wild'],
    writingStyle: 'Chaotic energy, threshold moments, raw and unfiltered',
    avoid: ['safe', 'polished', 'predictable'],
  },

  'L-3': {
    visualLanguage: ['industrial', 'forged', 'metallic', 'constructed', 'angular'],
    writingStyle: 'Forge-like directness, built and structured, industrial strength',
    avoid: ['soft', 'organic', 'flowing'],
  },

  'L-5': {
    visualLanguage: ['predatory', 'focused', 'sharp', 'hunting', 'precise'],
    writingStyle: 'Hunter\'s precision, focused and deliberate, tracking truth',
    avoid: ['scattered', 'vague', 'passive'],
  },

  'L-6': {
    visualLanguage: ['medicinal', 'herbal', 'healing', 'balanced', 'cyclical'],
    writingStyle: 'Healing-focused, balanced perspective, natural wisdom',
    avoid: ['toxic', 'aggressive', 'harsh'],
  },

  'L-7': {
    visualLanguage: ['fluid', 'beautiful', 'flowing', 'sensual', 'golden'],
    writingStyle: 'Fluid and beautiful, sensual language, irresistible flow',
    avoid: ['harsh', 'angular', 'crude'],
  },

  'L-8': {
    visualLanguage: ['maternal', 'nurturing', 'oceanic', 'vast', 'protective'],
    writingStyle: 'Nurturing and vast, maternal wisdom, all-encompassing',
    avoid: ['harsh', 'judgmental', 'cold'],
  },

  'L-9': {
    visualLanguage: ['regal', 'sovereign', 'authoritative', 'commanding', 'royal'],
    writingStyle: 'Regal authority, commanding presence, royal decree',
    avoid: ['submissive', 'weak', 'uncertain'],
  },

  'L-10': {
    visualLanguage: ['prophetic', 'oracle-like', 'mysterious', 'wise', 'ancient'],
    writingStyle: 'Prophetic wisdom, oracle\'s voice, ancient knowing',
    avoid: ['casual', 'shallow', 'trendy'],
  },

  'L-11': {
    visualLanguage: ['pure', 'pristine', 'clear', 'void', 'perfect'],
    writingStyle: 'Pure and clear, void-like spaciousness, perfect clarity',
    avoid: ['dirty', 'complex', 'cluttered'],
  },
};

// ============================================================================
// GENOME → PROMPT BUILDER
// ============================================================================

export interface GenomePromptData {
  orisha: OrishaName;
  sephira: SephiraName;
  lClass: string;
  personalityProfile?: PersonalityProfile;
}

/**
 * Build genome-enhanced LLM prompt
 * This is where the magic happens: genome DNA → content style
 */
export function buildGenomePrompt(data: GenomePromptData, intent: string): string {
  const orishaVoice = ORISHA_VOICES[data.orisha];
  const sephiraTheme = SEPHIRA_THEMES[data.sephira];
  const lClassAesthetic = L_CLASS_AESTHETICS[data.lClass] || L_CLASS_AESTHETICS['L-0'];

  const lines = [
    `# CHARACTER GENOME-DRIVEN VOICE PROFILE`,
    ``,
    `## Orisha Essence: ${data.orisha}`,
    `Your voice channels ${data.orisha}'s energy:`,
    `- Tone: ${orishaVoice.tone.join(', ')}`,
    `- Style: ${orishaVoice.style.join(', ')}`,
    `- Core themes: ${orishaVoice.themes.join(', ')}`,
    `- Natural openings: ${orishaVoice.openings.join(' | ')}`,
    `- AVOID: ${orishaVoice.avoidances.join(', ')}`,
    ``,
    `## Sephira Position: ${data.sephira}`,
    `${sephiraTheme.essence}`,
    `Content should focus on: ${sephiraTheme.contentFocus.join(', ')}`,
    `Tonal guidance: ${sephiraTheme.tonalGuidance}`,
    ``,
    `## Aesthetic Class: ${data.lClass}`,
    `Visual language: ${lClassAesthetic.visualLanguage.join(', ')}`,
    `Writing approach: ${lClassAesthetic.writingStyle}`,
    `Avoid: ${lClassAesthetic.avoid.join(', ')}`,
    ``,
    `## Intent`,
    `${intent}`,
    ``,
    `## Instructions`,
    `Generate content that authentically expresses this genome signature.`,
    `Let the Orisha essence guide your tone, the Sephira guide your themes,`,
    `and the L-class guide your aesthetic choices. This is not generic AI content—`,
    `this is character DNA manifesting as authentic voice.`,
  ];

  // Add personality profile if available (for extra richness)
  if (data.personalityProfile) {
    const p = data.personalityProfile;
    lines.push(``, `## Additional Personality Modifiers`, `- Archetype: ${p.archetype}`, `- Style: ${p.styleModifier}`, `- Heritage influence: ${p.heritage}`);
  }

  return lines.join('\n');
}

/**
 * Get content suggestions based on genome
 * Autonomous content suggester - what would this character naturally talk about?
 */
export function getGenomeSuggestedTopics(orisha: OrishaName, sephira: SephiraName): string[] {
  const orishaThemes = ORISHA_VOICES[orisha].themes;
  const sephiraThemes = SEPHIRA_THEMES[sephira].contentFocus;

  // Combine and dedupe
  const combined = [...new Set([...orishaThemes, ...sephiraThemes])];

  // Return 5 random suggestions
  return combined.sort(() => 0.5 - Math.random()).slice(0, 5);
}
