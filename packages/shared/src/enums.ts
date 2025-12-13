export const Platform = {
  X: 'X',
  TIKTOK: 'TIKTOK',
  INSTAGRAM: 'INSTAGRAM',
} as const;
export type Platform = (typeof Platform)[keyof typeof Platform];

export const ContentStatus = {
  DRAFT: 'DRAFT',
  APPROVED: 'APPROVED',
  PUBLISHED: 'PUBLISHED',
  FAILED: 'FAILED',
} as const;
export type ContentStatus = (typeof ContentStatus)[keyof typeof ContentStatus];

export const ContentType = {
  POST: 'POST',
  SCRIPT: 'SCRIPT',
} as const;
export type ContentType = (typeof ContentType)[keyof typeof ContentType];

export const VoiceProvider = {
  ELEVENLABS: 'ELEVENLABS',
  NONE: 'NONE',
} as const;
export type VoiceProvider = (typeof VoiceProvider)[keyof typeof VoiceProvider];

export const SubjectType = {
  VOICE: 'VOICE',
  CHARACTER: 'CHARACTER',
} as const;
export type SubjectType = (typeof SubjectType)[keyof typeof SubjectType];

export const LicenseType = {
  EXCLUSIVE: 'EXCLUSIVE',
  NON_EXCLUSIVE: 'NON_EXCLUSIVE',
  REVSHARE: 'REVSHARE',
} as const;
export type LicenseType = (typeof LicenseType)[keyof typeof LicenseType];

export const EventType = {
  VOICE_SYNTHESIS: 'VOICE_SYNTHESIS',
  PUBLISH: 'PUBLISH',
} as const;
export type EventType = (typeof EventType)[keyof typeof EventType];

export const LicenseAction = {
  SYNTHESIZE_VOICE: 'SYNTHESIZE_VOICE',
  TRAIN_VOICE: 'TRAIN_VOICE',
  PUBLISH_CONTENT: 'PUBLISH_CONTENT',
} as const;
export type LicenseAction = (typeof LicenseAction)[keyof typeof LicenseAction];
