/**
 * Transmedia Story API Routes
 * CRUD operations for transmedia stories
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreateTransmediaStorySchema } from '@lcos/shared';
import type { TransmediaStory, CreateTransmediaStoryInput } from '@lcos/shared';
import { transmediaStories, getNextId } from '../../../lib/transmedia-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get('characterId');

    // Filter by character if specified
    let filtered = transmediaStories;
    if (characterId) {
      filtered = transmediaStories.filter(
        (story) =>
          story.primaryCharacterId === characterId ||
          story.supportingCharacterIds.includes(characterId)
      );
    }

    return NextResponse.json({ stories: filtered });
  } catch (error) {
    console.error('Error fetching transmedia stories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch transmedia stories' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = CreateTransmediaStorySchema.parse(body) as CreateTransmediaStoryInput;

    // Create transmedia story with empty beats (to be generated later)
    const story: TransmediaStory = {
      ...validatedData,
      id: getNextId(),
      beats: [],
      status: 'DRAFT',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    transmediaStories.push(story);

    return NextResponse.json({ story }, { status: 201 });
  } catch (error) {
    console.error('Error creating transmedia story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create transmedia story' },
      { status: 400 }
    );
  }
}
