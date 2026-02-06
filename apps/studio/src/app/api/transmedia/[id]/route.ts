/**
 * Individual Transmedia Story API Routes
 * GET, PUT, DELETE operations for a specific story
 */

import { NextRequest, NextResponse } from 'next/server';
import type { TransmediaStory as _TransmediaStory } from '@lcos/shared';
import { transmediaStories } from '../../../../lib/transmedia-storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const story = transmediaStories.find((s) => s.id === params.id);

    if (!story) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ story });
  } catch (error) {
    console.error('Error fetching story:', error);
    return NextResponse.json(
      { error: 'Failed to fetch story' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyIndex = transmediaStories.findIndex((s) => s.id === params.id);

    if (storyIndex === -1) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    const body = await request.json();

    // Update story
    transmediaStories[storyIndex] = {
      ...transmediaStories[storyIndex],
      ...body,
      id: params.id, // Preserve ID
      updatedAt: new Date(),
    };

    return NextResponse.json({ story: transmediaStories[storyIndex] });
  } catch (error) {
    console.error('Error updating story:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update story' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const storyIndex = transmediaStories.findIndex((s) => s.id === params.id);

    if (storyIndex === -1) {
      return NextResponse.json(
        { error: 'Story not found' },
        { status: 404 }
      );
    }

    transmediaStories.splice(storyIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting story:', error);
    return NextResponse.json(
      { error: 'Failed to delete story' },
      { status: 500 }
    );
  }
}
