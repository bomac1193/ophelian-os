import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { CreateCharacterSchema } from '@lcos/shared';

export async function characterRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /characters - Create a new character
  fastify.post('/characters', async (request, reply) => {
    try {
      const body = CreateCharacterSchema.parse(request.body);

      const character = await prisma.character.create({
        data: body,
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
}
