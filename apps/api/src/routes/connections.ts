import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';

type EntityType = 'CHARACTER' | 'SCENE' | 'WORLD';

interface CreateConnectionBody {
  sourceType: EntityType;
  sourceId: string;
  targetType: EntityType;
  targetId: string;
  connectionType: string;
  lore?: string;
}

interface UpdateConnectionBody {
  connectionType?: string;
  lore?: string;
}

export async function connectionRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /connections - Create a new connection
  fastify.post('/connections', async (request, reply) => {
    const body = request.body as CreateConnectionBody;

    if (!body.sourceType || !body.sourceId || !body.targetType || !body.targetId || !body.connectionType) {
      return reply.code(400).send({ error: 'sourceType, sourceId, targetType, targetId, and connectionType are required' });
    }

    // Prevent self-connections
    if (body.sourceType === body.targetType && body.sourceId === body.targetId) {
      return reply.code(400).send({ error: 'Cannot create a connection from an entity to itself' });
    }

    // Check if connection already exists
    const existing = await prisma.worldConnection.findFirst({
      where: {
        OR: [
          {
            sourceType: body.sourceType,
            sourceId: body.sourceId,
            targetType: body.targetType,
            targetId: body.targetId,
          },
          {
            sourceType: body.targetType,
            sourceId: body.targetId,
            targetType: body.sourceType,
            targetId: body.sourceId,
          },
        ],
      },
    });

    if (existing) {
      return reply.code(409).send({ error: 'A connection already exists between these entities' });
    }

    const connection = await prisma.worldConnection.create({
      data: {
        sourceType: body.sourceType,
        sourceId: body.sourceId,
        targetType: body.targetType,
        targetId: body.targetId,
        connectionType: body.connectionType,
        lore: body.lore || '',
      },
    });

    return reply.code(201).send(connection);
  });

  // GET /connections - List all connections
  fastify.get('/connections', async (request, reply) => {
    const { entityType, entityId } = request.query as { entityType?: EntityType; entityId?: string };

    let where = {};
    if (entityType && entityId) {
      where = {
        OR: [
          { sourceType: entityType, sourceId: entityId },
          { targetType: entityType, targetId: entityId },
        ],
      };
    }

    const connections = await prisma.worldConnection.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return reply.send(connections);
  });

  // GET /connections/:id - Get a connection by ID
  fastify.get<{ Params: { id: string } }>('/connections/:id', async (request, reply) => {
    const { id } = request.params;

    const connection = await prisma.worldConnection.findUnique({
      where: { id },
    });

    if (!connection) {
      return reply.code(404).send({ error: 'Connection not found' });
    }

    return reply.send(connection);
  });

  // PATCH /connections/:id - Update a connection
  fastify.patch<{ Params: { id: string } }>('/connections/:id', async (request, reply) => {
    const { id } = request.params;
    const body = request.body as UpdateConnectionBody;

    const connection = await prisma.worldConnection.findUnique({
      where: { id },
    });

    if (!connection) {
      return reply.code(404).send({ error: 'Connection not found' });
    }

    const updated = await prisma.worldConnection.update({
      where: { id },
      data: {
        connectionType: body.connectionType,
        lore: body.lore,
      },
    });

    return reply.send(updated);
  });

  // DELETE /connections/:id - Delete a connection
  fastify.delete<{ Params: { id: string } }>('/connections/:id', async (request, reply) => {
    const { id } = request.params;

    const connection = await prisma.worldConnection.findUnique({
      where: { id },
    });

    if (!connection) {
      return reply.code(404).send({ error: 'Connection not found' });
    }

    await prisma.worldConnection.delete({
      where: { id },
    });

    return reply.code(204).send();
  });
}
