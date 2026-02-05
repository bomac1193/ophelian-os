/**
 * Universe Character Management API
 * Add/remove characters and manage permissions
 */

import { NextRequest, NextResponse } from 'next/server';
import type { CharacterPermission } from '@lcos/shared';
import { universes } from '../../../../../lib/universe-storage';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const universeIndex = universes.findIndex((u) => u.id === params.id);

    if (universeIndex === -1) {
      return NextResponse.json(
        { error: 'Universe not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { characterId, permissions, licenseTerms, royaltyShare } = body;

    // Check if character already in universe
    const existingPermission = universes[universeIndex].characterPermissions.find(
      (cp) => cp.characterId === characterId
    );

    if (existingPermission) {
      return NextResponse.json(
        { error: 'Character already in universe' },
        { status: 400 }
      );
    }

    // In real app, get from auth
    const mockUserId = 'user_1';

    const characterPermission: CharacterPermission = {
      characterId,
      ownerId: mockUserId,
      permissions: permissions || {
        canRead: true,
        canUseInStories: false,
        canModifyRelationships: false,
        canAdaptPersonality: false,
      },
      licenseTerms,
      royaltyShare,
    };

    universes[universeIndex].characterPermissions.push(characterPermission);
    if (!universes[universeIndex].characterIds.includes(characterId)) {
      universes[universeIndex].characterIds.push(characterId);
    }
    universes[universeIndex].updatedAt = new Date();

    return NextResponse.json({ universe: universes[universeIndex] });
  } catch (error) {
    console.error('Error adding character to universe:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to add character' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get('characterId');

    if (!characterId) {
      return NextResponse.json(
        { error: 'characterId required' },
        { status: 400 }
      );
    }

    const universeIndex = universes.findIndex((u) => u.id === params.id);

    if (universeIndex === -1) {
      return NextResponse.json(
        { error: 'Universe not found' },
        { status: 404 }
      );
    }

    // Remove character permission
    universes[universeIndex].characterPermissions = universes[universeIndex].characterPermissions.filter(
      (cp) => cp.characterId !== characterId
    );

    // Remove character ID
    universes[universeIndex].characterIds = universes[universeIndex].characterIds.filter(
      (id) => id !== characterId
    );

    universes[universeIndex].updatedAt = new Date();

    return NextResponse.json({ universe: universes[universeIndex] });
  } catch (error) {
    console.error('Error removing character from universe:', error);
    return NextResponse.json(
      { error: 'Failed to remove character' },
      { status: 500 }
    );
  }
}
