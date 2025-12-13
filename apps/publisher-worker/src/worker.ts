import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { SocialService } from '@lcos/social-connectors';
import { EventType, Platform } from '@lcos/shared';

const prisma = new PrismaClient();
const socialService = new SocialService();

const POLL_INTERVAL_MS = parseInt(process.env.POLL_INTERVAL_MS || '30000', 10);

async function processScheduledContent(): Promise<void> {
  const now = new Date();

  // Find all APPROVED content items with scheduledFor <= now
  const items = await prisma.contentItem.findMany({
    where: {
      status: 'APPROVED',
      scheduledFor: {
        lte: now,
      },
    },
    orderBy: {
      scheduledFor: 'asc',
    },
  });

  if (items.length === 0) {
    return;
  }

  console.log(`[Worker] Found ${items.length} items to publish`);

  for (const item of items) {
    console.log(`[Worker] Processing content item ${item.id} for ${item.platform}`);

    try {
      // Publish via social connector
      const result = await socialService.publish(item.platform as Platform, {
        text: item.text,
      });

      if (result.success) {
        // Update content item to PUBLISHED
        await prisma.contentItem.update({
          where: { id: item.id },
          data: {
            status: 'PUBLISHED',
            publishedUrl: result.url,
            meta: { ...(item.meta as object), publishMeta: result.meta },
          },
        });

        // Log usage event
        await prisma.usageEvent.create({
          data: {
            eventType: EventType.PUBLISH,
            characterId: item.characterId,
            contentItemId: item.id,
            platform: item.platform,
            revenueCents: 0,
            meta: { publishUrl: result.url, publishedBy: 'worker' },
          },
        });

        console.log(`[Worker] Successfully published ${item.id} to ${item.platform}: ${result.url}`);
      } else {
        // Mark as failed
        await prisma.contentItem.update({
          where: { id: item.id },
          data: {
            status: 'FAILED',
            meta: { ...(item.meta as object), publishError: result.error },
          },
        });

        console.error(`[Worker] Failed to publish ${item.id}: ${result.error}`);
      }
    } catch (error) {
      // Mark as failed on exception
      await prisma.contentItem.update({
        where: { id: item.id },
        data: {
          status: 'FAILED',
          meta: {
            ...(item.meta as object),
            publishError: error instanceof Error ? error.message : 'Unknown error',
          },
        },
      });

      console.error(`[Worker] Exception publishing ${item.id}:`, error);
    }
  }
}

async function runPollingLoop(): Promise<void> {
  console.log(`[Worker] Starting publisher worker (polling every ${POLL_INTERVAL_MS}ms)`);

  while (true) {
    try {
      await processScheduledContent();
    } catch (error) {
      console.error('[Worker] Error in polling loop:', error);
    }

    // Wait before next poll
    await new Promise((resolve) => setTimeout(resolve, POLL_INTERVAL_MS));
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('[Worker] Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('[Worker] Shutting down...');
  await prisma.$disconnect();
  process.exit(0);
});

// Start the worker
runPollingLoop().catch((error) => {
  console.error('[Worker] Fatal error:', error);
  process.exit(1);
});
