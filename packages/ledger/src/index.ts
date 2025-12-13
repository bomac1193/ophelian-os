import type { UsageEvent, License, RoyaltySplits } from '@lcos/shared';
import { calculateRoyaltySplit } from '@lcos/rights';

export interface UsageEventData {
  eventType: 'VOICE_SYNTHESIS' | 'PUBLISH';
  characterId?: string | null;
  voiceProfileId?: string | null;
  contentItemId?: string | null;
  platform?: 'X' | 'TIKTOK' | 'INSTAGRAM' | null;
  seconds?: number | null;
  revenueCents?: number;
  meta?: Record<string, unknown>;
}

export interface OwnerSettlement {
  ownerId: string;
  totalRevenueCents: number;
  voiceActorShareCents: number;
  creatorShareCents: number;
  platformShareCents: number;
  eventCount: number;
  events: {
    eventId: string;
    eventType: string;
    revenueCents: number;
    timestamp: Date;
  }[];
}

export interface MonthlySettlement {
  month: string;
  generatedAt: Date;
  owners: OwnerSettlement[];
  totals: {
    totalRevenueCents: number;
    totalVoiceActorShareCents: number;
    totalCreatorShareCents: number;
    totalPlatformShareCents: number;
    totalEventCount: number;
  };
}

export interface LedgerDependencies {
  getUsageEventsForMonth: (month: string) => Promise<UsageEvent[]>;
  getLicenseBySubjectId: (subjectId: string) => Promise<License | null>;
}

export function createLedgerService(deps: LedgerDependencies) {
  return {
    async computeMonthlySettlement(month: string): Promise<MonthlySettlement> {
      // Parse month (YYYY-MM format)
      const [year, monthNum] = month.split('-').map(Number);
      if (!year || !monthNum || monthNum < 1 || monthNum > 12) {
        throw new Error('Invalid month format. Expected YYYY-MM');
      }

      const events = await deps.getUsageEventsForMonth(month);

      // Group events by owner
      const ownerMap = new Map<string, OwnerSettlement>();

      for (const event of events) {
        // Get the subject ID (voice profile or character)
        const subjectId = event.voiceProfileId || event.characterId;
        if (!subjectId) continue;

        // Get license for this subject
        const license = await deps.getLicenseBySubjectId(subjectId);
        if (!license) continue;

        const ownerId = license.ownerId;
        const royaltySplits = license.royaltySplits as RoyaltySplits;

        // Calculate splits for this event
        const splits = calculateRoyaltySplit(event.revenueCents, royaltySplits);

        // Get or create owner settlement
        let settlement = ownerMap.get(ownerId);
        if (!settlement) {
          settlement = {
            ownerId,
            totalRevenueCents: 0,
            voiceActorShareCents: 0,
            creatorShareCents: 0,
            platformShareCents: 0,
            eventCount: 0,
            events: [],
          };
          ownerMap.set(ownerId, settlement);
        }

        // Update settlement
        settlement.totalRevenueCents += event.revenueCents;
        settlement.voiceActorShareCents += splits.voiceActor;
        settlement.creatorShareCents += splits.creator;
        settlement.platformShareCents += splits.platform;
        settlement.eventCount += 1;
        settlement.events.push({
          eventId: event.id,
          eventType: event.eventType,
          revenueCents: event.revenueCents,
          timestamp: event.createdAt,
        });
      }

      // Calculate totals
      const owners = Array.from(ownerMap.values());
      const totals = {
        totalRevenueCents: owners.reduce((sum, o) => sum + o.totalRevenueCents, 0),
        totalVoiceActorShareCents: owners.reduce((sum, o) => sum + o.voiceActorShareCents, 0),
        totalCreatorShareCents: owners.reduce((sum, o) => sum + o.creatorShareCents, 0),
        totalPlatformShareCents: owners.reduce((sum, o) => sum + o.platformShareCents, 0),
        totalEventCount: owners.reduce((sum, o) => sum + o.eventCount, 0),
      };

      return {
        month,
        generatedAt: new Date(),
        owners,
        totals,
      };
    },
  };
}

export type LedgerService = ReturnType<typeof createLedgerService>;
