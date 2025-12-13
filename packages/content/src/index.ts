import type { Character, Platform } from '@lcos/shared';
import { createCharacterState, buildContextPrompt } from '@lcos/canon';

export interface GeneratePostOptions {
  character: Character;
  platform: Platform;
  intent: string;
}

export interface GeneratedPost {
  text: string;
  meta: {
    platform: Platform;
    intent: string;
    characterContext: string;
    generatedAt: Date;
  };
}

const PLATFORM_LIMITS: Record<Platform, number> = {
  X: 280,
  TIKTOK: 2200,
  INSTAGRAM: 2200,
};

const PLATFORM_STYLES: Record<Platform, string> = {
  X: 'concise and punchy',
  TIKTOK: 'trendy and engaging with hashtags',
  INSTAGRAM: 'visual and aesthetic with emojis',
};

export function generatePost(options: GeneratePostOptions): GeneratedPost {
  const { character, platform, intent } = options;
  const state = createCharacterState(character);
  const context = buildContextPrompt(state);

  // Stub implementation - returns deterministic placeholder text
  // In production, this would call an LLM with the context
  const stub = generateStubContent(character, platform, intent);

  return {
    text: stub,
    meta: {
      platform,
      intent,
      characterContext: context,
      generatedAt: new Date(),
    },
  };
}

function generateStubContent(
  character: Character,
  platform: Platform,
  intent: string
): string {
  const limit = PLATFORM_LIMITS[platform];
  const style = PLATFORM_STYLES[platform];

  const templates: Record<string, string> = {
    promote: `Hey, it's ${character.name}! Just wanted to share something exciting with you all. Stay tuned for more updates coming soon!`,
    engage: `${character.name} here. What's everyone up to today? Drop your thoughts below!`,
    announce: `Big news from ${character.name}! Something special is in the works. Can't wait to show you what's coming next.`,
    story: `Let me tell you a story... ${character.name} has been on quite a journey lately. Here's what happened...`,
    default: `${character.name} is thinking about: ${intent}. What do you all think about this?`,
  };

  const intentKey = Object.keys(templates).find((key) =>
    intent.toLowerCase().includes(key)
  );
  let text = templates[intentKey || 'default'];

  // Add platform-specific flavor
  if (platform === 'X') {
    text = text.slice(0, limit);
  } else if (platform === 'TIKTOK') {
    text += ' #fyp #viral #content';
  } else if (platform === 'INSTAGRAM') {
    text += ' ✨🙌';
  }

  // Ensure we don't exceed platform limits
  if (text.length > limit) {
    text = text.slice(0, limit - 3) + '...';
  }

  return text;
}

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
