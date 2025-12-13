import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { CreateVoiceProfileSchema } from '@lcos/shared';

export async function voiceProfileRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /voice-profiles - Create a new voice profile
  fastify.post('/voice-profiles', async (request, reply) => {
    try {
      const body = CreateVoiceProfileSchema.parse(request.body);

      const voiceProfile = await prisma.voiceProfile.create({
        data: body,
      });

      return reply.code(201).send(voiceProfile);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation error', details: error });
      }
      throw error;
    }
  });

  // GET /voice-profiles - List all voice profiles
  fastify.get('/voice-profiles', async (_request, reply) => {
    const voiceProfiles = await prisma.voiceProfile.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return reply.send(voiceProfiles);
  });

  // GET /voice-profiles/:id - Get a voice profile by ID
  fastify.get<{ Params: { id: string } }>('/voice-profiles/:id', async (request, reply) => {
    const { id } = request.params;

    const voiceProfile = await prisma.voiceProfile.findUnique({
      where: { id },
    });

    if (!voiceProfile) {
      return reply.code(404).send({ error: 'Voice profile not found' });
    }

    return reply.send(voiceProfile);
  });
}
