import type { Character, Platform } from '@lcos/shared';
import { createCharacterState, buildContextPrompt } from '@lcos/canon';
import {
  generatePersonalityProfile,
  buildPersonalityPrompt,
  type PersonalityProfile,
} from './personality.js';
import {
  buildGenomePrompt,
  getGenomeSuggestedTopics,
  type GenomePromptData,
} from './genome-prompt.js';

export interface GeneratePostOptions {
  character: Character;
  platform: Platform;
  intent: string;
  /** Optional genome data for genome-driven generation */
  genomeData?: GenomePromptData;
  /** Optional LLM provider function for real content generation */
  llmProvider?: (prompt: string) => Promise<string>;
}

export interface GeneratedPost {
  text: string;
  meta: {
    platform: Platform;
    intent: string;
    characterContext: string;
    personalityProfile: PersonalityProfile;
    generatedAt: Date;
    generationMethod: 'stub' | 'llm';
  };
}

const PLATFORM_LIMITS: Record<Platform, number> = {
  X: 280,
  TIKTOK: 2200,
  INSTAGRAM: 2200,
};

// Platform-specific style guidance
export const PLATFORM_STYLES: Record<Platform, string> = {
  X: 'concise and punchy, max 280 chars, no hashtags unless essential',
  TIKTOK: 'trendy and engaging, use 3-5 relevant hashtags, conversational tone',
  INSTAGRAM: 'visual and aesthetic, use emojis sparingly, can include longer captions',
};

/**
 * Generate content for a character on a specific platform
 * Uses genome-driven generation when available, falls back to personality system
 */
export async function generatePost(options: GeneratePostOptions): Promise<GeneratedPost> {
  const { character, platform, intent, genomeData, llmProvider } = options;
  const state = createCharacterState(character);
  const context = buildContextPrompt(state);

  // Generate personality profile from character
  const personalityProfile = generatePersonalityProfile(character);

  let text: string;
  let generationMethod: 'stub' | 'llm' = 'stub';

  if (llmProvider) {
    // Build genome-enhanced prompt if genome data available
    const prompt = genomeData
      ? buildGenomePrompt(
          { ...genomeData, personalityProfile },
          `Platform: ${platform}\nIntent: ${intent}\n\n${character.systemPrompt || ''}`
        )
      : buildLLMPrompt(character, personalityProfile, platform, intent);

    try {
      text = await llmProvider(prompt);
      generationMethod = 'llm';
      // Ensure text fits platform limits
      const limit = PLATFORM_LIMITS[platform];
      if (text.length > limit) {
        text = text.slice(0, limit - 3) + '...';
      }
    } catch (error) {
      console.warn('LLM generation failed, falling back to stub:', error);
      text = generatePersonalityAwareStub(character, personalityProfile, platform, intent);
    }
  } else {
    // Use personality-aware stub generation
    text = generatePersonalityAwareStub(character, personalityProfile, platform, intent);
  }

  return {
    text,
    meta: {
      platform,
      intent,
      characterContext: context,
      personalityProfile,
      generatedAt: new Date(),
      generationMethod,
    },
  };
}

/**
 * Build LLM prompt with personality context
 */
function buildLLMPrompt(
  character: Character,
  profile: PersonalityProfile,
  platform: Platform,
  intent: string
): string {
  const personalityPrompt = buildPersonalityPrompt(character, profile, intent);
  const platformStyle = PLATFORM_STYLES[platform];
  const limit = PLATFORM_LIMITS[platform];

  return `${personalityPrompt}

Platform: ${platform}
Style guidance: ${platformStyle}
Character limit: ${limit}

${character.systemPrompt ? `Character system prompt: ${character.systemPrompt}\n` : ''}
${character.toneAllowed?.length ? `Allowed tones: ${character.toneAllowed.join(', ')}\n` : ''}
${character.toneForbidden?.length ? `Forbidden tones: ${character.toneForbidden.join(', ')}\n` : ''}

Write a single post as ${character.name}. Stay in character. Output only the post text, nothing else.`;
}

/**
 * Generate personality-aware stub content
 * Uses personality profile to create more authentic placeholder content
 */
function generatePersonalityAwareStub(
  character: Character,
  profile: PersonalityProfile,
  platform: Platform,
  intent: string
): string {
  const limit = PLATFORM_LIMITS[platform];

  // Select opening based on personality archetype
  const openings = profile.preferredOpenings;
  const opening = openings[Math.floor(Math.random() * openings.length)] || '';

  // Build content based on intent and personality
  const intentTemplates: Record<string, (c: Character, p: PersonalityProfile) => string> = {
    promote: (c, p) =>
      `${opening} ${c.name} here with something ${p.primaryTone}. Stay tuned for what's coming.`,
    engage: (c, p) =>
      `${opening} ${c.name} wants to know: what ${p.contentThemes[0] || 'matters'} to you today?`,
    announce: (c, p) =>
      `${opening} Big news from ${c.name}. Something ${p.secondaryTone} is on the horizon.`,
    story: (c, p) =>
      `${opening} Let me share a ${p.styleModifier} tale about ${p.contentThemes[0] || 'the journey'}...`,
    reflect: (c, p) =>
      `${opening} ${c.name} reflects on ${p.contentThemes[0] || 'what matters'}. ${p.speechPatterns[0] || ''}`,
    inspire: (c, p) =>
      `${opening} ${p.speechPatterns[0] || ''} ${c.name} believes in ${p.contentThemes[0] || 'you'}.`,
  };

  // Find matching intent or use default
  const intentKey = Object.keys(intentTemplates).find((key) =>
    intent.toLowerCase().includes(key)
  );

  let text =
    intentKey && intentTemplates[intentKey]
      ? intentTemplates[intentKey](character, profile)
      : `${opening} ${character.name} ponders: ${intent}. What are your thoughts?`;

  // Add platform-specific flavor
  if (platform === 'TIKTOK') {
    const hashtag = profile.contentThemes[0]?.replace(/\s+/g, '') || 'content';
    text += ` #${hashtag} #fyp`;
  } else if (platform === 'INSTAGRAM') {
    text += ' ✨';
  }

  // Ensure we don't exceed platform limits
  if (text.length > limit) {
    text = text.slice(0, limit - 3) + '...';
  }

  return text;
}

// Re-export personality module
export {
  generatePersonalityProfile,
  buildPersonalityPrompt,
  type PersonalityProfile,
  type PersonalityAxes,
} from './personality.js';

// Re-export genome-driven generation
export {
  buildGenomePrompt,
  getGenomeSuggestedTopics,
  type GenomePromptData,
  ORISHA_VOICES,
  SEPHIRA_THEMES,
  L_CLASS_AESTHETICS,
} from './genome-prompt.js';

export function validateContentForPlatform(
  text: string,
  platform: Platform
): { valid: boolean; reason?: string } {
  const limit = PLATFORM_LIMITS[platform];

  if (text.length === 0) {
    return { valid: false, reason: 'Content cannot be empty' };
  }

  if (text.length > limit) {
    return {
      valid: false,
      reason: `Content exceeds ${platform} character limit of ${limit}`,
    };
  }

  return { valid: true };
}
