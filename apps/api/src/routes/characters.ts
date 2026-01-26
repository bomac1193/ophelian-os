import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { CreateCharacterSchema } from '@lcos/shared';
import { generateCharacter, generateCharacterWithSeed, rerollCharacter, generateLCOSCharacter } from '@lcos/oripheon';

export async function characterRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /characters - Create a new character
  fastify.post('/characters', async (request, reply) => {
    try {
      const body = CreateCharacterSchema.parse(request.body);

      const character = await prisma.character.create({
        data: body as any,
      });

      return reply.code(201).send(character);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation error', details: error });
      }
      throw error;
    }
  });

  // GET /characters - List all characters
  fastify.get('/characters', async (_request, reply) => {
    const characters = await prisma.character.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return reply.send(characters);
  });

  // GET /characters/:id - Get a character by ID
  fastify.get<{ Params: { id: string } }>('/characters/:id', async (request, reply) => {
    const { id } = request.params;

    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return reply.code(404).send({ error: 'Character not found' });
    }

    return reply.send(character);
  });

  // PATCH /characters/:id - Update a character
  fastify.patch<{ Params: { id: string } }>('/characters/:id', async (request, reply) => {
    const { id } = request.params;
    const body = request.body as {
      name?: string;
      bio?: string;
      avatarUrl?: string;
      avatarPosition?: string;
      aliases?: string[];
      personaTags?: string[];
      toneAllowed?: string[];
      toneForbidden?: string[];
      systemPrompt?: string;
      currentArc?: string | null;
    };

    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return reply.code(404).send({ error: 'Character not found' });
    }

    const updated = await prisma.character.update({
      where: { id },
      data: body,
    });

    return reply.send(updated);
  });

  // DELETE /characters/:id - Delete a character
  fastify.delete<{ Params: { id: string } }>('/characters/:id', async (request, reply) => {
    const { id } = request.params;

    const character = await prisma.character.findUnique({
      where: { id },
    });

    if (!character) {
      return reply.code(404).send({ error: 'Character not found' });
    }

    // Delete associated content items first
    await prisma.contentItem.deleteMany({
      where: { characterId: id },
    });

    // Delete the character
    await prisma.character.delete({
      where: { id },
    });

    return reply.code(204).send();
  });

  // POST /characters/generate - Generate a random character using LCOS Oripheon
  fastify.post('/characters/generate', async (request, reply) => {
    const body = request.body as {
      seed?: number;
      heritage?: string;
      gender?: string;
      blendHeritage?: boolean;
      mononym?: boolean;
      relic?: boolean;
      relicEra?: 'archaic' | 'modern';
      lockedRelic?: { object: string; category: string; origin: string };
    } | undefined;

    // Use the extended LCOS generator with multiple archetype systems
    const generated = generateLCOSCharacter({
      seed: body?.seed,
      heritage: body?.heritage,
      gender: body?.gender,
      blendHeritage: body?.blendHeritage,
      mononym: body?.mononym,
      relic: body?.relic,
      relicEra: body?.relicEra,
      lockedRelic: body?.lockedRelic as any,
    });

    return reply.send(generated);
  });

  // POST /characters/generate/:seed - Generate a character with specific seed
  fastify.post<{ Params: { seed: string } }>('/characters/generate/:seed', async (request, reply) => {
    const seed = parseInt(request.params.seed, 10);

    if (isNaN(seed)) {
      return reply.code(400).send({ error: 'Invalid seed - must be a number' });
    }

    const generated = generateCharacterWithSeed(seed);
    return reply.send(generated);
  });

  // POST /characters/reroll/:seed - Reroll a character with optional overrides
  fastify.post<{ Params: { seed: string } }>('/characters/reroll/:seed', async (request, reply) => {
    const seed = parseInt(request.params.seed, 10);

    if (isNaN(seed)) {
      return reply.code(400).send({ error: 'Invalid seed - must be a number' });
    }

    const body = request.body as { heritage?: string; gender?: string } | undefined;
    const generated = rerollCharacter(seed, {
      heritage: body?.heritage as any,
      gender: body?.gender as any,
    });

    return reply.send(generated);
  });
}
