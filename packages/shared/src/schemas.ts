import { z } from 'zod';
import {
  Platform,
  ContentStatus,
  ContentType,
  VoiceProvider,
  SubjectType,
  LicenseType,
  EventType,
} from './enums.js';

// Character schemas
export const CreateCharacterSchema = z.object({
  name: z.string().min(1).max(255),
  aliases: z.array(z.string()).default([]),
  bio: z.string().default(''),
  avatarUrl: z.string().nullable().default(null),
  avatarPosition: z.string().default('50% 50%'),
  personaTags: z.array(z.string()).default([]),
  toneAllowed: z.array(z.string()).default([]),
  toneForbidden: z.array(z.string()).default([]),
  systemPrompt: z.string().default(''),
  currentArc: z.string().nullable().default(null),
  timelineState: z.record(z.unknown()).default({}),
});
export type CreateCharacterInput = z.infer<typeof CreateCharacterSchema>;

export const CharacterSchema = CreateCharacterSchema.extend({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Character = z.infer<typeof CharacterSchema>;

// VoiceProfile schemas
export const CreateVoiceProfileSchema = z.object({
  provider: z.enum([VoiceProvider.ELEVENLABS, VoiceProvider.CHROMOX, VoiceProvider.NONE]),
  providerVoiceId: z.string().nullable().default(null),
  label: z.string().min(1).max(255),
  meta: z.record(z.unknown()).default({}),
});
export type CreateVoiceProfileInput = z.infer<typeof CreateVoiceProfileSchema>;

export const VoiceProfileSchema = CreateVoiceProfileSchema.extend({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type VoiceProfile = z.infer<typeof VoiceProfileSchema>;

// Royalty splits schema
export const RoyaltySplitsSchema = z.object({
  voiceActor: z.number().min(0).max(100),
  creator: z.number().min(0).max(100),
  platform: z.number().min(0).max(100),
});
export type RoyaltySplits = z.infer<typeof RoyaltySplitsSchema>;

// License schemas
export const CreateLicenseSchema = z.object({
  ownerId: z.string().min(1),
  subjectType: z.enum([SubjectType.VOICE, SubjectType.CHARACTER]),
  subjectId: z.string().min(1),
  consentSynthesis: z.boolean().default(false),
  consentTraining: z.boolean().default(false),
  commercialUse: z.boolean().default(false),
  licenseType: z.enum([LicenseType.EXCLUSIVE, LicenseType.NON_EXCLUSIVE, LicenseType.REVSHARE]),
  royaltySplits: RoyaltySplitsSchema.default({ voiceActor: 50, creator: 30, platform: 20 }),
  terms: z.string().nullable().default(null),
});
export type CreateLicenseInput = z.infer<typeof CreateLicenseSchema>;

export const LicenseSchema = CreateLicenseSchema.extend({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type License = z.infer<typeof LicenseSchema>;

// ContentItem schemas
export const CreateContentItemSchema = z.object({
  characterId: z.string().min(1),
  platform: z.enum([Platform.X, Platform.TIKTOK, Platform.INSTAGRAM]),
  contentType: z.enum([ContentType.POST, ContentType.SCRIPT]).default(ContentType.POST),
  text: z.string().default(''),
  status: z
    .enum([ContentStatus.DRAFT, ContentStatus.APPROVED, ContentStatus.PUBLISHED, ContentStatus.FAILED])
    .default(ContentStatus.DRAFT),
  scheduledFor: z.date().nullable().default(null),
  publishedUrl: z.string().nullable().default(null),
  meta: z.record(z.unknown()).default({}),
});
export type CreateContentItemInput = z.infer<typeof CreateContentItemSchema>;

export const ContentItemSchema = CreateContentItemSchema.extend({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type ContentItem = z.infer<typeof ContentItemSchema>;

// UsageEvent schemas
export const CreateUsageEventSchema = z.object({
  eventType: z.enum([EventType.VOICE_SYNTHESIS, EventType.PUBLISH]),
  characterId: z.string().nullable().default(null),
  voiceProfileId: z.string().nullable().default(null),
  contentItemId: z.string().nullable().default(null),
  platform: z.enum([Platform.X, Platform.TIKTOK, Platform.INSTAGRAM]).nullable().default(null),
  seconds: z.number().nullable().default(null),
  revenueCents: z.number().int().default(0),
  meta: z.record(z.unknown()).default({}),
});
export type CreateUsageEventInput = z.infer<typeof CreateUsageEventSchema>;

export const UsageEventSchema = CreateUsageEventSchema.extend({
  id: z.string().cuid(),
  createdAt: z.date(),
});
export type UsageEvent = z.infer<typeof UsageEventSchema>;

// Relationship schemas
export const RelationshipTypeEnum = z.enum([
  'FRIEND',
  'RIVAL',
  'MENTOR',
  'STUDENT',
  'FAMILY',
  'ROMANTIC',
  'ENEMY',
  'ALLY',
  'NEUTRAL',
]);
export type RelationshipType = z.infer<typeof RelationshipTypeEnum>;

export const CreateRelationshipSchema = z.object({
  characterAId: z.string().min(1),
  characterBId: z.string().min(1),
  relationshipType: RelationshipTypeEnum,
  strength: z.number().min(0).max(100).default(50),
  isPublic: z.boolean().default(true),
  description: z.string().nullable().default(null),
  history: z.array(z.object({
    timestamp: z.date(),
    event: z.string(),
    impactOnStrength: z.number(),
  })).default([]),
  meta: z.record(z.unknown()).default({}),
});
export type CreateRelationshipInput = z.infer<typeof CreateRelationshipSchema>;

export const RelationshipSchema = CreateRelationshipSchema.extend({
  id: z.string().cuid(),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type Relationship = z.infer<typeof RelationshipSchema>;

// API request schemas
export const GenerateContentRequestSchema = z.object({
  characterId: z.string().min(1),
  platform: z.enum([Platform.X, Platform.TIKTOK, Platform.INSTAGRAM]),
  intent: z.string().min(1),
  genomeData: z
    .object({
      orisha: z.string(),
      sephira: z.string(),
      lClass: z.string(),
    })
    .optional(),
});
export type GenerateContentRequest = z.infer<typeof GenerateContentRequestSchema>;

export const SettlementQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
});
export type SettlementQuery = z.infer<typeof SettlementQuerySchema>;

// Transmedia Story Engine schemas
export const StoryBeatTypeEnum = z.enum([
  'INTRODUCTION',
  'INCITING_INCIDENT',
  'RISING_ACTION',
  'CLIMAX',
  'FALLING_ACTION',
  'RESOLUTION',
  'CLIFFHANGER',
  'REVELATION',
  'REFLECTION',
  'TRANSFORMATION',
]);
export type StoryBeatType = z.infer<typeof StoryBeatTypeEnum>;

export const MediaTypeEnum = z.enum([
  'TEXT',
  'AUDIO',
  'VISUAL',
  'VIDEO',
  'INTERACTIVE',
]);
export type MediaType = z.infer<typeof MediaTypeEnum>;

export const PlatformTargetEnum = z.enum([
  'TWITTER',
  'INSTAGRAM',
  'TIKTOK',
  'PODCAST',
  'BLOG',
  'NEWSLETTER',
  'YOUTUBE',
]);
export type PlatformTarget = z.infer<typeof PlatformTargetEnum>;

export const StoryArcSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  theme: z.string(),
  targetAudience: z.string(),
  estimatedDuration: z.string(), // e.g., "3 episodes", "10 posts", "5 minutes"
});
export type StoryArc = z.infer<typeof StoryArcSchema>;

export const MediaAdaptationSchema = z.object({
  mediaType: MediaTypeEnum,
  platform: PlatformTargetEnum.optional(),
  content: z.string(),
  metadata: z.record(z.unknown()).default({}),
  duration: z.number().optional(), // seconds for audio/video
  wordCount: z.number().optional(), // for text
  imagePrompt: z.string().optional(), // for visual generation
});
export type MediaAdaptation = z.infer<typeof MediaAdaptationSchema>;

export const StoryBeatSchema = z.object({
  beatType: StoryBeatTypeEnum,
  coreNarrative: z.string().min(1), // Platform-agnostic story content
  emotionalTone: z.string(),
  characterIds: z.array(z.string()),
  relationshipDynamics: z.array(z.object({
    relationshipId: z.string(),
    evolutionNote: z.string(), // How this beat affects the relationship
  })).optional(),
  adaptations: z.array(MediaAdaptationSchema),
  sequenceOrder: z.number(),
  metadata: z.record(z.unknown()).default({}),
});
export type StoryBeat = z.infer<typeof StoryBeatSchema>;

export const CreateTransmediaStorySchema = z.object({
  title: z.string().min(1),
  arc: StoryArcSchema,
  primaryCharacterId: z.string().min(1),
  supportingCharacterIds: z.array(z.string()).default([]),
  targetMediaTypes: z.array(MediaTypeEnum),
  targetPlatforms: z.array(PlatformTargetEnum),
  genre: z.string(),
  tags: z.array(z.string()).default([]),
});
export type CreateTransmediaStoryInput = z.infer<typeof CreateTransmediaStorySchema>;

export const TransmediaStorySchema = CreateTransmediaStorySchema.extend({
  id: z.string(),
  beats: z.array(StoryBeatSchema),
  status: z.enum(['DRAFT', 'IN_PROGRESS', 'PUBLISHED', 'COMPLETED']),
  createdAt: z.date(),
  updatedAt: z.date(),
});
export type TransmediaStory = z.infer<typeof TransmediaStorySchema>;
