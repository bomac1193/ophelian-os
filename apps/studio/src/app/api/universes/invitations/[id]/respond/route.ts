/**
 * Universe Invitation Response API
 * Accept or reject universe invitations
 */

import { NextRequest, NextResponse } from 'next/server';
import type { UniverseMember } from '@lcos/shared';
import { universes, invitations } from '../../../../../../lib/universe-storage';

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { accept } = body; // true to accept, false to reject

    const invitationIndex = invitations.findIndex((inv) => inv.id === params.id);

    if (invitationIndex === -1) {
      return NextResponse.json(
        { error: 'Invitation not found' },
        { status: 404 }
      );
    }

    const invitation = invitations[invitationIndex];

    if (invitation.status !== 'PENDING') {
      return NextResponse.json(
        { error: 'Invitation already responded to' },
        { status: 400 }
      );
    }

    // Update invitation status
    invitations[invitationIndex].status = accept ? 'ACCEPTED' : 'REJECTED';
    invitations[invitationIndex].respondedAt = new Date();

    // If accepted, add user to universe
    if (accept) {
      const universeIndex = universes.findIndex((u) => u.id === invitation.universeId);

      if (universeIndex !== -1) {
        const newMember: UniverseMember = {
          userId: invitation.toUserId,
          userName: invitation.toUserName,
          role: invitation.role,
          joinedAt: new Date(),
          contributionCount: 0,
        };

        universes[universeIndex].members.push(newMember);
        universes[universeIndex].updatedAt = new Date();
      }
    }

    return NextResponse.json({
      invitation: invitations[invitationIndex],
      message: accept ? 'Invitation accepted' : 'Invitation rejected',
    });
  } catch (error) {
    console.error('Error responding to invitation:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to respond to invitation' },
      { status: 400 }
    );
  }
}
