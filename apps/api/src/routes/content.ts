import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { GenerateContentRequestSchema, EventType, Platform } from '@lcos/shared';
import { generatePost } from '@lcos/content';
import { VoiceService } from '@lcos/voice';
import { SocialService } from '@lcos/social-connectors';

const voiceService = new VoiceService({
  elevenLabsApiKey: process.env.ELEVENLABS_API_KEY,
  storagePath: process.env.AUDIO_STORAGE_PATH || './storage/audio',
});

const socialService = new SocialService();

export async function contentRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /content/generate - Generate content draft
  fastify.post('/content/generate', async (request, reply) => {
    try {
      const body = GenerateContentRequestSchema.parse(request.body);

      // Get character
      const character = await prisma.character.findUnique({
        where: { id: body.characterId },
      });

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' });
      }

      // Generate content (now async with personality system)
      const generated = await generatePost({
        character: character as any, // Type coercion for Prisma -> shared types
        platform: body.platform as Platform,
        intent: body.intent,
      });

      // Create content item
      const contentItem = await prisma.contentItem.create({
        data: {
          characterId: body.characterId,
          platform: body.platform,
          contentType: 'POST',
          text: generated.text,
          status: 'DRAFT',
          meta: JSON.parse(JSON.stringify(generated.meta)), // Serialize for Prisma JSON field
        },
      });

      return reply.code(201).send(contentItem);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation error', details: error });
      }
      throw error;
    }
  });

  // GET /content - List all content items
  fastify.get('/content', async (_request, reply) => {
    const contentItems = await prisma.contentItem.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return reply.send(contentItems);
  });

  // GET /content/:id - Get a content item by ID
  fastify.get<{ Params: { id: string } }>('/content/:id', async (request, reply) => {
    const { id } = request.params;

    const contentItem = await prisma.contentItem.findUnique({
      where: { id },
    });

    if (!contentItem) {
      return reply.code(404).send({ error: 'Content item not found' });
    }

    return reply.send(contentItem);
  });

  // POST /content/:id/approve - Approve content for publishing
  fastify.post<{ Params: { id: string } }>('/content/:id/approve', async (request, reply) => {
    const { id } = request.params;

    const contentItem = await prisma.contentItem.findUnique({
      where: { id },
    });

    if (!contentItem) {
      return reply.code(404).send({ error: 'Content item not found' });
    }

    if (contentItem.status !== 'DRAFT') {
      return reply.code(400).send({
        error: 'Invalid status',
        message: `Cannot approve content with status: ${contentItem.status}`,
      });
    }

    const updated = await prisma.contentItem.update({
      where: { id },
      data: { status: 'APPROVED' },
    });

    return reply.send(updated);
  });

  // POST /content/:id/publish - Publish content
  fastify.post<{ Params: { id: string } }>('/content/:id/publish', async (request, reply) => {
    const { id } = request.params;

    const contentItem = await prisma.contentItem.findUnique({
      where: { id },
    });

    if (!contentItem) {
      return reply.code(404).send({ error: 'Content item not found' });
    }

    if (contentItem.status !== 'APPROVED') {
      return reply.code(400).send({
        error: 'Invalid status',
        message: `Content must be APPROVED before publishing. Current status: ${contentItem.status}`,
      });
    }

    // Publish via social connector
    const result = await socialService.publish(contentItem.platform as Platform, {
      text: contentItem.text,
    });

    if (!result.success) {
      const failed = await prisma.contentItem.update({
        where: { id },
        data: {
          status: 'FAILED',
          meta: { ...contentItem.meta as object, publishError: result.error },
        },
      });
      return reply.code(500).send({
        error: 'Publish failed',
        message: result.error,
        contentItem: failed,
      });
    }

    // Update content item
    const updated = await prisma.contentItem.update({
      where: { id },
      data: {
        status: 'PUBLISHED',
        publishedUrl: result.url,
        meta: { ...contentItem.meta as any, publishMeta: result.meta } as any,
      },
    });

    // Log usage event
    await prisma.usageEvent.create({
      data: {
        eventType: EventType.PUBLISH,
        characterId: contentItem.characterId,
        contentItemId: contentItem.id,
        platform: contentItem.platform,
        revenueCents: 0, // MVP: no revenue tracking yet
        meta: { publishUrl: result.url },
      },
    });

    return reply.send(updated);
  });

  // POST /content/:id/audio - Generate audio for content
  fastify.post<{ Params: { id: string } }>('/content/:id/audio', async (request, reply) => {
    const { id } = request.params;

    const contentItem = await prisma.contentItem.findUnique({
      where: { id },
    });

    if (!contentItem) {
      return reply.code(404).send({ error: 'Content item not found' });
    }

    // Get character to find associated voice profile
    const character = await prisma.character.findUnique({
      where: { id: contentItem.characterId },
    });

    if (!character) {
      return reply.code(404).send({ error: 'Character not found' });
    }

    // Find a voice profile (for MVP, just get the first one)
    const voiceProfile = await prisma.voiceProfile.findFirst();

    if (!voiceProfile) {
      return reply.code(404).send({ error: 'No voice profile available' });
    }

    // Generate audio
    const audioResult = await voiceService.generateAudio({
      voiceProfile: voiceProfile as any,
      text: contentItem.text,
    });

    // Log usage event
    await prisma.usageEvent.create({
      data: {
        eventType: EventType.VOICE_SYNTHESIS,
        characterId: contentItem.characterId,
        voiceProfileId: voiceProfile.id,
        contentItemId: contentItem.id,
        seconds: audioResult.seconds,
        revenueCents: 0, // MVP: no revenue tracking yet
        meta: {
          filePath: audioResult.filePath,
          provider: audioResult.provider,
        },
      },
    });

    return reply.send({
      contentItemId: id,
      audioFilePath: audioResult.filePath,
      durationSeconds: audioResult.seconds,
      provider: audioResult.provider,
    });
  });
}
