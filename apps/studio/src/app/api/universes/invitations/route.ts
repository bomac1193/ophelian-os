/**
 * Universe Invitation API
 * Send and manage universe invitations
 */

import { NextRequest, NextResponse } from 'next/server';
import type { UniverseInvitation } from '@lcos/shared';
import { universes, invitations, getNextInvitationId } from '../../../../lib/universe-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const status = searchParams.get('status');

    let filtered = invitations;

    // Filter by recipient
    if (userId) {
      filtered = invitations.filter((inv) => inv.toUserId === userId);
    }

    // Filter by status
    if (status) {
      filtered = filtered.filter((inv) => inv.status === status);
    }

    return NextResponse.json({ invitations: filtered });
  } catch (error) {
    console.error('Error fetching invitations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch invitations' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { universeId, toUserId, toUserName, role, message } = body;

    // Find universe
    const universe = universes.find((u) => u.id === universeId);
    if (!universe) {
      return NextResponse.json(
        { error: 'Universe not found' },
        { status: 404 }
      );
    }

    // In real app, get from auth
    const mockFromUserId = 'user_1';
    const mockFromUserName = 'Creator';

    // Check if user already a member
    const isMember = universe.members.some((m) => m.userId === toUserId);
    if (isMember) {
      return NextResponse.json(
        { error: 'User is already a member of this universe' },
        { status: 400 }
      );
    }

    // Check for existing pending invitation
    const existingInvite = invitations.find(
      (inv) =>
        inv.universeId === universeId &&
        inv.toUserId === toUserId &&
        inv.status === 'PENDING'
    );

    if (existingInvite) {
      return NextResponse.json(
        { error: 'Pending invitation already exists' },
        { status: 400 }
      );
    }

    const invitation: UniverseInvitation = {
      id: getNextInvitationId(),
      universeId,
      universeName: universe.name,
      fromUserId: mockFromUserId,
      fromUserName: mockFromUserName,
      toUserId,
      toUserName,
      role: role || 'CONTRIBUTOR',
      status: 'PENDING',
      message,
      createdAt: new Date(),
    };

    invitations.push(invitation);

    return NextResponse.json({ invitation }, { status: 201 });
  } catch (error) {
    console.error('Error creating invitation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create invitation' },
      { status: 400 }
    );
  }
}
