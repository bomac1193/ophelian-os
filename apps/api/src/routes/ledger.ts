import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { SettlementQuerySchema } from '@lcos/shared';
import { createLedgerService } from '@lcos/ledger';

const ledgerService = createLedgerService({
  async getUsageEventsForMonth(month: string) {
    const [year, monthNum] = month.split('-').map(Number);
    const startDate = new Date(year, monthNum - 1, 1);
    const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);

    const events = await prisma.usageEvent.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    return events.map((e) => ({
      ...e,
      meta: e.meta as Record<string, unknown>,
      eventType: e.eventType as 'VOICE_SYNTHESIS' | 'PUBLISH',
      platform: e.platform as 'X' | 'TIKTOK' | 'INSTAGRAM' | null,
    }));
  },

  async getLicenseBySubjectId(subjectId: string) {
    const license = await prisma.license.findFirst({
      where: { subjectId },
    });

    if (!license) return null;

    return {
      ...license,
      subjectType: license.subjectType as 'VOICE' | 'CHARACTER',
      licenseType: license.licenseType as 'EXCLUSIVE' | 'NON_EXCLUSIVE' | 'REVSHARE',
      royaltySplits: license.royaltySplits as {
        voiceActor: number;
        creator: number;
        platform: number;
      },
    };
  },
});

export async function ledgerRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /ledger/settlement - Get monthly settlement
  fastify.get<{ Querystring: { month: string } }>(
    '/ledger/settlement',
    async (request, reply) => {
      try {
        const query = SettlementQuerySchema.parse(request.query);
        const settlement = await ledgerService.computeMonthlySettlement(query.month);
        return reply.send(settlement);
      } catch (error) {
        if (error instanceof Error && error.name === 'ZodError') {
          return reply.code(400).send({
            error: 'Validation error',
            message: 'Month must be in YYYY-MM format',
          });
        }
        throw error;
      }
    }
  );

  // GET /ledger/events - List usage events
  fastify.get<{ Querystring: { month?: string; limit?: string } }>(
    '/ledger/events',
    async (request, reply) => {
      const { month, limit = '100' } = request.query;

      let where = {};
      if (month) {
        const [year, monthNum] = month.split('-').map(Number);
        const startDate = new Date(year, monthNum - 1, 1);
        const endDate = new Date(year, monthNum, 0, 23, 59, 59, 999);
        where = {
          createdAt: {
            gte: startDate,
            lte: endDate,
          },
        };
      }

      const events = await prisma.usageEvent.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        take: parseInt(limit, 10),
      });

      return reply.send(events);
    }
  );
}
