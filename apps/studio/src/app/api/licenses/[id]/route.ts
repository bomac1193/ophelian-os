/**
 * Individual License API Routes
 * GET, PUT, DELETE operations for a specific license
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreateLicenseSchema } from '@lcos/shared';
import type { License, CreateLicenseInput } from '@lcos/shared';

// Import the in-memory storage (shared with main route)
// In production, this would be database queries
const licenses: License[] = [];

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const license = licenses.find((l) => l.id === params.id);

    if (!license) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ license });
  } catch (error) {
    console.error('Error fetching license:', error);
    return NextResponse.json(
      { error: 'Failed to fetch license' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const licenseIndex = licenses.findIndex((l) => l.id === params.id);

    if (licenseIndex === -1) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      );
    }

    const body = await request.json();
    const validatedData = CreateLicenseSchema.parse(body) as CreateLicenseInput;

    // Update license
    licenses[licenseIndex] = {
      ...licenses[licenseIndex],
      ...validatedData,
      updatedAt: new Date(),
    };

    return NextResponse.json({ license: licenses[licenseIndex] });
  } catch (error) {
    console.error('Error updating license:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to update license' },
      { status: 400 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const licenseIndex = licenses.findIndex((l) => l.id === params.id);

    if (licenseIndex === -1) {
      return NextResponse.json(
        { error: 'License not found' },
        { status: 404 }
      );
    }

    licenses.splice(licenseIndex, 1);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting license:', error);
    return NextResponse.json(
      { error: 'Failed to delete license' },
      { status: 500 }
    );
  }
}
