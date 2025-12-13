import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';
import { authMiddleware } from './middleware/auth.js';
import { characterRoutes } from './routes/characters.js';
import { voiceProfileRoutes } from './routes/voice-profiles.js';
import { licenseRoutes } from './routes/licenses.js';
import { contentRoutes } from './routes/content.js';
import { ledgerRoutes } from './routes/ledger.js';

const fastify = Fastify({
  logger: {
    level: process.env.LOG_LEVEL || 'info',
    transport:
      process.env.NODE_ENV === 'development'
        ? {
            target: 'pino-pretty',
            options: {
              translateTime: 'HH:MM:ss Z',
              ignore: 'pid,hostname',
            },
          }
        : undefined,
  },
});

async function start() {
  try {
    // Register CORS
    await fastify.register(cors, {
      origin: process.env.CORS_ORIGIN || '*',
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    });

    // Health check (no auth required)
    fastify.get('/health', async () => ({ status: 'ok', timestamp: new Date().toISOString() }));

    // Register auth middleware for all other routes
    fastify.addHook('onRequest', async (request, reply) => {
      // Skip auth for health check
      if (request.url === '/health') return;
      await authMiddleware(request, reply);
    });

    // Register routes
    await fastify.register(characterRoutes);
    await fastify.register(voiceProfileRoutes);
    await fastify.register(licenseRoutes);
    await fastify.register(contentRoutes);
    await fastify.register(ledgerRoutes);

    // Start server
    const port = parseInt(process.env.PORT || '3001', 10);
    const host = process.env.HOST || '0.0.0.0';

    await fastify.listen({ port, host });
    console.log(`API server running at http://${host}:${port}`);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

start();
