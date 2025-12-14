-- CreateEnum
CREATE TYPE "VoiceProviderEnum" AS ENUM ('ELEVENLABS', 'NONE');

-- CreateEnum
CREATE TYPE "SubjectTypeEnum" AS ENUM ('VOICE', 'CHARACTER');

-- CreateEnum
CREATE TYPE "LicenseTypeEnum" AS ENUM ('EXCLUSIVE', 'NON_EXCLUSIVE', 'REVSHARE');

-- CreateEnum
CREATE TYPE "PlatformEnum" AS ENUM ('X', 'TIKTOK', 'INSTAGRAM');

-- CreateEnum
CREATE TYPE "ContentTypeEnum" AS ENUM ('POST', 'SCRIPT');

-- CreateEnum
CREATE TYPE "ContentStatusEnum" AS ENUM ('DRAFT', 'APPROVED', 'PUBLISHED', 'FAILED');

-- CreateEnum
CREATE TYPE "EventTypeEnum" AS ENUM ('VOICE_SYNTHESIS', 'PUBLISH');

-- CreateTable
CREATE TABLE "Character" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "aliases" TEXT[],
    "bio" TEXT NOT NULL DEFAULT '',
    "personaTags" TEXT[],
    "toneAllowed" TEXT[],
    "toneForbidden" TEXT[],
    "systemPrompt" TEXT NOT NULL DEFAULT '',
    "currentArc" TEXT,
    "timelineState" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoiceProfile" (
    "id" TEXT NOT NULL,
    "provider" "VoiceProviderEnum" NOT NULL,
    "providerVoiceId" TEXT,
    "label" TEXT NOT NULL,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoiceProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,
    "subjectType" "SubjectTypeEnum" NOT NULL,
    "subjectId" TEXT NOT NULL,
    "consentSynthesis" BOOLEAN NOT NULL DEFAULT false,
    "consentTraining" BOOLEAN NOT NULL DEFAULT false,
    "commercialUse" BOOLEAN NOT NULL DEFAULT false,
    "licenseType" "LicenseTypeEnum" NOT NULL,
    "royaltySplits" JSONB NOT NULL DEFAULT '{"voiceActor": 50, "creator": 30, "platform": 20}',
    "terms" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "License_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContentItem" (
    "id" TEXT NOT NULL,
    "characterId" TEXT NOT NULL,
    "platform" "PlatformEnum" NOT NULL,
    "contentType" "ContentTypeEnum" NOT NULL DEFAULT 'POST',
    "text" TEXT NOT NULL,
    "status" "ContentStatusEnum" NOT NULL DEFAULT 'DRAFT',
    "scheduledFor" TIMESTAMP(3),
    "publishedUrl" TEXT,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ContentItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UsageEvent" (
    "id" TEXT NOT NULL,
    "eventType" "EventTypeEnum" NOT NULL,
    "characterId" TEXT,
    "voiceProfileId" TEXT,
    "contentItemId" TEXT,
    "platform" "PlatformEnum",
    "seconds" DOUBLE PRECISION,
    "revenueCents" INTEGER NOT NULL DEFAULT 0,
    "meta" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UsageEvent_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "License_subjectId_idx" ON "License"("subjectId");

-- CreateIndex
CREATE INDEX "License_ownerId_idx" ON "License"("ownerId");

-- CreateIndex
CREATE INDEX "ContentItem_characterId_idx" ON "ContentItem"("characterId");

-- CreateIndex
CREATE INDEX "ContentItem_status_idx" ON "ContentItem"("status");

-- CreateIndex
CREATE INDEX "ContentItem_scheduledFor_idx" ON "ContentItem"("scheduledFor");

-- CreateIndex
CREATE INDEX "UsageEvent_characterId_idx" ON "UsageEvent"("characterId");

-- CreateIndex
CREATE INDEX "UsageEvent_voiceProfileId_idx" ON "UsageEvent"("voiceProfileId");

-- CreateIndex
CREATE INDEX "UsageEvent_createdAt_idx" ON "UsageEvent"("createdAt");
