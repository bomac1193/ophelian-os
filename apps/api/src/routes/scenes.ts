import type { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';
import { prisma } from '../db.js';

interface CreateSceneBody {
  name: string;
  description?: string;
  type?: 'location' | 'event';
  imageUrl?: string;
  tags?: string[];
  metadata?: Prisma.InputJsonValue;
}

interface UpdateSceneBody {
  name?: string;
  description?: string | null;
  type?: 'location' | 'event';
  imageUrl?: string | null;
  tags?: string[];
  metadata?: Prisma.InputJsonValue | null;
}

export async function sceneRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /scenes - Create a new scene
  fastify.post('/scenes', async (request, reply) => {
    const body = request.body as CreateSceneBody;

    if (!body.name) {
      return reply.code(400).send({ error: 'Name is required' });
    }

    const scene = await prisma.scene.create({
      data: {
        name: body.name,
        description: body.description,
        type: body.type || 'location',
        imageUrl: body.imageUrl,
        tags: body.tags || [],
        metadata: body.metadata,
      },
    });

    return reply.code(201).send(scene);
  });

  // GET /scenes - List all scenes
  fastify.get('/scenes', async (_request, reply) => {
    const scenes = await prisma.scene.findMany({
      orderBy: { createdAt: 'desc' },
      include: { position: true },
    });

    return reply.send(scenes);
  });

  // GET /scenes/:id - Get a scene by ID
  fastify.get<{ Params: { id: string } }>('/scenes/:id', async (request, reply) => {
    const { id } = request.params;

    const scene = await prisma.scene.findUnique({
      where: { id },
      include: { position: true },
    });

    if (!scene) {
      return reply.code(404).send({ error: 'Scene not found' });
    }

    return reply.send(scene);
  });

  // PATCH /scenes/:id - Update a scene
  fastify.patch<{ Params: { id: string } }>('/scenes/:id', async (request, reply) => {
    const { id } = request.params;
    const body = request.body as UpdateSceneBody;

    const scene = await prisma.scene.findUnique({
      where: { id },
    });

    if (!scene) {
      return reply.code(404).send({ error: 'Scene not found' });
    }

    const updated = await prisma.scene.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        type: body.type,
        imageUrl: body.imageUrl,
        tags: body.tags,
        metadata: body.metadata === null ? Prisma.DbNull : body.metadata,
      },
      include: { position: true },
    });

    return reply.send(updated);
  });

  // DELETE /scenes/:id - Delete a scene
  fastify.delete<{ Params: { id: string } }>('/scenes/:id', async (request, reply) => {
    const { id } = request.params;

    const scene = await prisma.scene.findUnique({
      where: { id },
    });

    if (!scene) {
      return reply.code(404).send({ error: 'Scene not found' });
    }

    // Delete associated connections
    await prisma.worldConnection.deleteMany({
      where: {
        OR: [
          { sourceType: 'SCENE', sourceId: id },
          { targetType: 'SCENE', targetId: id },
        ],
      },
    });

    // Delete the scene (position will cascade)
    await prisma.scene.delete({
      where: { id },
    });

    return reply.code(204).send();
  });

  // PUT /scenes/:id/position - Update scene position
  fastify.put<{ Params: { id: string } }>('/scenes/:id/position', async (request, reply) => {
    const { id } = request.params;
    const { x, y } = request.body as { x: number; y: number };

    const scene = await prisma.scene.findUnique({
      where: { id },
    });

    if (!scene) {
      return reply.code(404).send({ error: 'Scene not found' });
    }

    const position = await prisma.scenePosition.upsert({
      where: { sceneId: id },
      create: { sceneId: id, x, y },
      update: { x, y },
    });

    return reply.send(position);
  });
}
