import type { FastifyInstance } from 'fastify';
import { Prisma } from '@prisma/client';
import { prisma } from '../db.js';

interface SnapshotData {
  characterPositions: { characterId: string; x: number; y: number }[];
  scenePositions: { sceneId: string; x: number; y: number }[];
  worldPositions: { worldId: string; x: number; y: number }[];
  relationships: {
    sourceCharacterId: string;
    targetCharacterId: string;
    relationshipType: string;
    customTypeName?: string | null;
    sourceRole?: string | null;
    targetRole?: string | null;
    lore: string;
  }[];
  connections: {
    sourceType: string;
    sourceId: string;
    targetType: string;
    targetId: string;
    connectionType: string;
    lore: string;
  }[];
}

interface CreateSnapshotBody {
  name: string;
  description?: string;
}

export async function snapshotRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /snapshots - List all snapshots
  fastify.get('/snapshots', async (_request, reply) => {
    const snapshots = await prisma.nexusSnapshot.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return reply.send(snapshots);
  });

  // GET /snapshots/:id - Get a snapshot by ID
  fastify.get<{ Params: { id: string } }>('/snapshots/:id', async (request, reply) => {
    const { id } = request.params;

    const snapshot = await prisma.nexusSnapshot.findUnique({
      where: { id },
    });

    if (!snapshot) {
      return reply.code(404).send({ error: 'Snapshot not found' });
    }

    return reply.send(snapshot);
  });

  // POST /snapshots - Create a new snapshot from current state
  fastify.post('/snapshots', async (request, reply) => {
    const body = request.body as CreateSnapshotBody;

    if (!body.name) {
      return reply.code(400).send({ error: 'Name is required' });
    }

    // Gather current Nexus state
    const [characterPositions, scenePositions, worldPositions, relationships, connections] = await Promise.all([
      prisma.characterPosition.findMany(),
      prisma.scenePosition.findMany(),
      prisma.worldPosition.findMany(),
      prisma.characterRelationship.findMany(),
      prisma.worldConnection.findMany(),
    ]);

    const data: SnapshotData = {
      characterPositions: characterPositions.map(p => ({
        characterId: p.characterId,
        x: p.x,
        y: p.y,
      })),
      scenePositions: scenePositions.map(p => ({
        sceneId: p.sceneId,
        x: p.x,
        y: p.y,
      })),
      worldPositions: worldPositions.map(p => ({
        worldId: p.worldId,
        x: p.x,
        y: p.y,
      })),
      relationships: relationships.map(r => ({
        sourceCharacterId: r.sourceCharacterId,
        targetCharacterId: r.targetCharacterId,
        relationshipType: r.relationshipType,
        customTypeName: r.customTypeName,
        sourceRole: r.sourceRole,
        targetRole: r.targetRole,
        lore: r.lore,
      })),
      connections: connections.map(c => ({
        sourceType: c.sourceType,
        sourceId: c.sourceId,
        targetType: c.targetType,
        targetId: c.targetId,
        connectionType: c.connectionType,
        lore: c.lore,
      })),
    };

    const snapshot = await prisma.nexusSnapshot.create({
      data: {
        name: body.name,
        description: body.description || null,
        data: data as unknown as Prisma.InputJsonValue,
      },
    });

    return reply.code(201).send(snapshot);
  });

  // POST /snapshots/:id/restore - Restore a snapshot
  fastify.post<{ Params: { id: string } }>('/snapshots/:id/restore', async (request, reply) => {
    const { id } = request.params;

    const snapshot = await prisma.nexusSnapshot.findUnique({
      where: { id },
    });

    if (!snapshot) {
      return reply.code(404).send({ error: 'Snapshot not found' });
    }

    const data = snapshot.data as unknown as SnapshotData;

    // Clear existing relationships and connections
    await prisma.characterRelationship.deleteMany({});
    await prisma.worldConnection.deleteMany({});

    // Restore positions (upsert to handle new/changed entities)
    for (const pos of data.characterPositions) {
      const characterExists = await prisma.character.findUnique({ where: { id: pos.characterId } });
      if (characterExists) {
        await prisma.characterPosition.upsert({
          where: { characterId: pos.characterId },
          create: { characterId: pos.characterId, x: pos.x, y: pos.y },
          update: { x: pos.x, y: pos.y },
        });
      }
    }

    for (const pos of data.scenePositions) {
      const sceneExists = await prisma.scene.findUnique({ where: { id: pos.sceneId } });
      if (sceneExists) {
        await prisma.scenePosition.upsert({
          where: { sceneId: pos.sceneId },
          create: { sceneId: pos.sceneId, x: pos.x, y: pos.y },
          update: { x: pos.x, y: pos.y },
        });
      }
    }

    for (const pos of data.worldPositions) {
      const worldExists = await prisma.world.findUnique({ where: { id: pos.worldId } });
      if (worldExists) {
        await prisma.worldPosition.upsert({
          where: { worldId: pos.worldId },
          create: { worldId: pos.worldId, x: pos.x, y: pos.y },
          update: { x: pos.x, y: pos.y },
        });
      }
    }

    // Restore relationships (only if both characters exist)
    for (const rel of data.relationships) {
      const [source, target] = await Promise.all([
        prisma.character.findUnique({ where: { id: rel.sourceCharacterId } }),
        prisma.character.findUnique({ where: { id: rel.targetCharacterId } }),
      ]);

      if (source && target) {
        await prisma.characterRelationship.create({
          data: {
            sourceCharacterId: rel.sourceCharacterId,
            targetCharacterId: rel.targetCharacterId,
            relationshipType: rel.relationshipType as any,
            customTypeName: rel.customTypeName,
            sourceRole: rel.sourceRole,
            targetRole: rel.targetRole,
            lore: rel.lore,
          },
        });
      }
    }

    // Restore connections (only if both entities exist)
    for (const conn of data.connections) {
      let sourceExists = false;
      let targetExists = false;

      // Check if source exists
      if (conn.sourceType === 'CHARACTER') {
        sourceExists = !!(await prisma.character.findUnique({ where: { id: conn.sourceId } }));
      } else if (conn.sourceType === 'SCENE') {
        sourceExists = !!(await prisma.scene.findUnique({ where: { id: conn.sourceId } }));
      } else if (conn.sourceType === 'WORLD') {
        sourceExists = !!(await prisma.world.findUnique({ where: { id: conn.sourceId } }));
      }

      // Check if target exists
      if (conn.targetType === 'CHARACTER') {
        targetExists = !!(await prisma.character.findUnique({ where: { id: conn.targetId } }));
      } else if (conn.targetType === 'SCENE') {
        targetExists = !!(await prisma.scene.findUnique({ where: { id: conn.targetId } }));
      } else if (conn.targetType === 'WORLD') {
        targetExists = !!(await prisma.world.findUnique({ where: { id: conn.targetId } }));
      }

      if (sourceExists && targetExists) {
        await prisma.worldConnection.create({
          data: {
            sourceType: conn.sourceType as any,
            sourceId: conn.sourceId,
            targetType: conn.targetType as any,
            targetId: conn.targetId,
            connectionType: conn.connectionType,
            lore: conn.lore,
          },
        });
      }
    }

    return reply.send({ message: 'Snapshot restored successfully' });
  });

  // DELETE /snapshots/:id - Delete a snapshot
  fastify.delete<{ Params: { id: string } }>('/snapshots/:id', async (request, reply) => {
    const { id } = request.params;

    const snapshot = await prisma.nexusSnapshot.findUnique({
      where: { id },
    });

    if (!snapshot) {
      return reply.code(404).send({ error: 'Snapshot not found' });
    }

    await prisma.nexusSnapshot.delete({
      where: { id },
    });

    return reply.code(204).send();
  });

  // PATCH /snapshots/:id - Update snapshot name/description
  fastify.patch<{ Params: { id: string } }>('/snapshots/:id', async (request, reply) => {
    const { id } = request.params;
    const body = request.body as { name?: string; description?: string };

    const snapshot = await prisma.nexusSnapshot.findUnique({
      where: { id },
    });

    if (!snapshot) {
      return reply.code(404).send({ error: 'Snapshot not found' });
    }

    const updated = await prisma.nexusSnapshot.update({
      where: { id },
      data: {
        ...(body.name && { name: body.name }),
        ...(body.description !== undefined && { description: body.description }),
      },
    });

    return reply.send(updated);
  });
}
