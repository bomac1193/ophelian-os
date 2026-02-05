/**
 * Collaborative Universe API Routes
 * CRUD operations for shared universes
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreateUniverseSchema } from '@lcos/shared';
import type { Universe, CreateUniverseInput } from '@lcos/shared';
import { universes, getNextUniverseId } from '../../../lib/universe-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const isPublic = searchParams.get('public');

    let filtered = universes;

    // Filter by user (creator or member)
    if (userId) {
      filtered = universes.filter(
        (u) =>
          u.creatorId === userId ||
          u.members.some((m) => m.userId === userId)
      );
    }

    // Filter by public/private
    if (isPublic !== null) {
      const publicFilter = isPublic === 'true';
      filtered = filtered.filter((u) => u.isPublic === publicFilter);
    }

    return NextResponse.json({ universes: filtered });
  } catch (error) {
    console.error('Error fetching universes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = CreateUniverseSchema.parse(body) as CreateUniverseInput;

    // In a real app, get from auth session
    const mockUserId = 'user_1';
    const mockUserName = 'Creator';

    // Create universe
    const universe: Universe = {
      ...validatedData,
      id: getNextUniverseId(),
      creatorId: mockUserId,
      creatorName: mockUserName,
      members: [
        {
          userId: mockUserId,
          userName: mockUserName,
          role: 'CREATOR',
          joinedAt: new Date(),
          contributionCount: 0,
        },
      ],
      characterPermissions: [],
      canonEvents: [],
      storyIds: [],
      characterIds: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    universes.push(universe);

    return NextResponse.json({ universe }, { status: 201 });
  } catch (error) {
    console.error('Error creating universe:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create universe' },
      { status: 400 }
    );
  }
}
