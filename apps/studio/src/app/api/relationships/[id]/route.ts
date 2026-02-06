/**
 * Individual Relationship API Routes
 * GET, PUT, DELETE operations for a specific relationship
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreateRelationshipSchema } from '@lcos/shared';
import type { Relationship as _Relationship, CreateRelationshipInput } from '@lcos/shared';
import { relationships } from '../../../../lib/relationship-storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const relationship = relationships.find((r) => r.id === params.id);

    if (!relationship) {
      return NextResponse.json(
        { error: 'Relationship not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ relationship });
  } catch (error) {
    console.error('Error fetching relationship:', error);
    return NextResponse.json(
      { error: 'Failed to fetch relationship' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const relationshipIndex = relationships.findIndex((r) => r.id === params.id);

    if (relationshipIndex === -1) {
      return NextResponse.json(
        { error: 'Relationship not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = CreateRelationshipSchema.parse(body) as CreateRelationshipInput;

    // Update relationship
    relationships[relationshipIndex] = {
      ...relationships[relationshipIndex],
      ...validatedData,
      updatedAt: new Date(),
    };

    return NextResponse.json({ relationship: relationships[relationshipIndex] });
  } catch (error) {
    console.error('Error updating relationship:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update relationship' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const relationshipIndex = relationships.findIndex((r) => r.id === params.id);

    if (relationshipIndex === -1) {
      return NextResponse.json(
        { error: 'Relationship not found' },
        { status: 404 }
      );
    }

    relationships.splice(relationshipIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting relationship:', error);
    return NextResponse.json(
      { error: 'Failed to delete relationship' },
      { status: 500 }
    );
  }
}
