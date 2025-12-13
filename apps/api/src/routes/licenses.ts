import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { CreateLicenseSchema } from '@lcos/shared';

export async function licenseRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /licenses - Create a new license
  fastify.post('/licenses', async (request, reply) => {
    try {
      const body = CreateLicenseSchema.parse(request.body);

      const license = await prisma.license.create({
        data: body,
      });

      return reply.code(201).send(license);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation error', details: error });
      }
      throw error;
    }
  });

  // GET /licenses - List all licenses
  fastify.get('/licenses', async (_request, reply) => {
    const licenses = await prisma.license.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return reply.send(licenses);
  });

  // GET /licenses/:id - Get a license by ID
  fastify.get<{ Params: { id: string } }>('/licenses/:id', async (request, reply) => {
    const { id } = request.params;

    const license = await prisma.license.findUnique({
      where: { id },
    });

    if (!license) {
      return reply.code(404).send({ error: 'License not found' });
    }

    return reply.send(license);
  });
}
