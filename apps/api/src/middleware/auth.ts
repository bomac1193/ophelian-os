import type { FastifyRequest, FastifyReply } from 'fastify';

const API_KEY = process.env.API_KEY || 'default-dev-key';

export async function authMiddleware(
  request: FastifyRequest,
  reply: FastifyReply
): Promise<void> {
  const apiKey = request.headers['x-api-key'];

  if (!apiKey || apiKey !== API_KEY) {
    reply.code(401).send({
      error: 'Unauthorized',
      message: 'Invalid or missing API key',
    });
    return;
  }
}
