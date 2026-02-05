/**
 * Individual Universe API Routes
 * GET, PUT, DELETE operations for a specific universe
 */

import { NextRequest, NextResponse } from 'next/server';
import { universes } from '../../../../lib/universe-storage';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const universe = universes.find((u) => u.id === params.id);

    if (!universe) {
      return NextResponse.json(
        { error: 'Universe not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ universe });
  } catch (error) {
    console.error('Error fetching universe:', error);
    return NextResponse.json(
      { error: 'Failed to fetch universe' },
      { status: 500 }
    );
  }
}

export async function PUT(
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

    // Update universe
    universes[universeIndex] = {
      ...universes[universeIndex],
      ...body,
      id: params.id, // Preserve ID
      updatedAt: new Date(),
    };

    return NextResponse.json({ universe: universes[universeIndex] });
  } catch (error) {
    console.error('Error updating universe:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update universe' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
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

    universes.splice(universeIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting universe:', error);
    return NextResponse.json(
      { error: 'Failed to delete universe' },
      { status: 500 }
    );
  }
}
