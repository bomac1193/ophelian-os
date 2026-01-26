import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { z } from 'zod';

const UpdatePositionSchema = z.object({
  x: z.number(),
  y: z.number(),
});

const BatchUpdatePositionSchema = z.array(
  z.object({
    characterId: z.string().min(1),
    x: z.number(),
    y: z.number(),
  })
);

export async function positionRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /positions - Get all character positions
  fastify.get('/positions', async (_request, reply) => {
    const positions = await prisma.characterPosition.findMany();
    return reply.send(positions);
  });

  // GET /positions/:characterId - Get position for a specific character
  fastify.get<{ Params: { characterId: string } }>('/positions/:characterId', async (request, reply) => {
    const { characterId } = request.params;

    const position = await prisma.characterPosition.findUnique({
      where: { characterId },
    });

    if (!position) {
      return reply.code(404).send({ error: 'Position not found' });
    }

    return reply.send(position);
  });

  // PUT /positions/:characterId - Upsert position for a character
  fastify.put<{ Params: { characterId: string } }>('/positions/:characterId', async (request, reply) => {
    const { characterId } = request.params;

    try {
      const body = UpdatePositionSchema.parse(request.body);

      // Verify character exists
      const character = await prisma.character.findUnique({
        where: { id: characterId },
      });

      if (!character) {
        return reply.code(404).send({ error: 'Character not found' });
      }

      const position = await prisma.characterPosition.upsert({
        where: { characterId },
        update: { x: body.x, y: body.y },
        create: { characterId, x: body.x, y: body.y },
      });

      return reply.send(position);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation error', details: error });
      }
      throw error;
    }
  });

  // PUT /positions/batch - Batch update positions
  fastify.put('/positions/batch', async (request, reply) => {
    try {
      const positions = BatchUpdatePositionSchema.parse(request.body);

      // Verify all characters exist
      const characterIds = positions.map((p) => p.characterId);
      const characters = await prisma.character.findMany({
        where: { id: { in: characterIds } },
        select: { id: true },
      });

      const existingIds = new Set(characters.map((c) => c.id));
      const missingIds = characterIds.filter((id) => !existingIds.has(id));

      if (missingIds.length > 0) {
        return reply.code(400).send({
          error: 'Some characters not found',
          missingIds,
        });
      }

      // Use transaction to update all positions
      const results = await prisma.$transaction(
        positions.map((pos) =>
          prisma.characterPosition.upsert({
            where: { characterId: pos.characterId },
            update: { x: pos.x, y: pos.y },
            create: { characterId: pos.characterId, x: pos.x, y: pos.y },
          })
        )
      );

      return reply.send(results);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation error', details: error });
      }
      throw error;
    }
  });

  // DELETE /positions/:characterId - Delete a position
  fastify.delete<{ Params: { characterId: string } }>('/positions/:characterId', async (request, reply) => {
    const { characterId } = request.params;

    const position = await prisma.characterPosition.findUnique({
      where: { characterId },
    });

    if (!position) {
      return reply.code(404).send({ error: 'Position not found' });
    }

    await prisma.characterPosition.delete({
      where: { characterId },
    });

    return reply.code(204).send();
  });
}
