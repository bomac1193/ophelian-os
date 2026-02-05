/**
 * Relationship Management API Routes
 * CRUD operations for character relationships
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreateRelationshipSchema } from '@lcos/shared';
import type { Relationship, CreateRelationshipInput } from '@lcos/shared';
import { relationships, getNextId } from '../../../lib/relationship-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get('characterId');

    // Filter by character if specified
    let filtered = relationships;
    if (characterId) {
      filtered = relationships.filter(
        (r) => r.characterAId === characterId || r.characterBId === characterId
      );
    }

    return NextResponse.json({ relationships: filtered });
  } catch (error) {
    console.error('Error fetching relationships:', error);
    return NextResponse.json(
      { error: 'Failed to fetch relationships' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = CreateRelationshipSchema.parse(body) as CreateRelationshipInput;

    // Prevent self-relationships
    if (validatedData.characterAId === validatedData.characterBId) {
      return NextResponse.json(
        { error: 'Characters cannot have relationships with themselves' },
        { status: 400 }
      );
    }

    // Check for duplicate relationships
    const existing = relationships.find(
      (r) =>
        (r.characterAId === validatedData.characterAId &&
          r.characterBId === validatedData.characterBId) ||
        (r.characterAId === validatedData.characterBId &&
          r.characterBId === validatedData.characterAId)
    );

    if (existing) {
      return NextResponse.json(
        { error: 'Relationship already exists between these characters' },
        { status: 400 }
      );
    }

    // Create relationship
    const relationship: Relationship = {
      ...validatedData,
      id: getNextId(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    relationships.push(relationship);

    return NextResponse.json({ relationship }, { status: 201 });
  } catch (error) {
    console.error('Error creating relationship:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create relationship' },
      { status: 400 }
    );
  }
}
