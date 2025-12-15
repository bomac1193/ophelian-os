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
  provider: z.enum([VoiceProvider.ELEVENLABS, VoiceProvider.NONE]),
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

// API request schemas
export const GenerateContentRequestSchema = z.object({
  characterId: z.string().min(1),
  platform: z.enum([Platform.X, Platform.TIKTOK, Platform.INSTAGRAM]),
  intent: z.string().min(1),
});
export type GenerateContentRequest = z.infer<typeof GenerateContentRequestSchema>;

export const SettlementQuerySchema = z.object({
  month: z.string().regex(/^\d{4}-\d{2}$/, 'Month must be in YYYY-MM format'),
});
export type SettlementQuery = z.infer<typeof SettlementQuerySchema>;
