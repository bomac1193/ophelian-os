/**
 * License Management API Routes
 * CRUD operations for IP licenses
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreateLicenseSchema } from '@lcos/shared';
import type { License, CreateLicenseInput } from '@lcos/shared';

// In-memory storage for MVP
// TODO: Replace with database in production
const licenses: License[] = [];
let nextId = 1;

export async function GET() {
  try {
    return NextResponse.json({ licenses });
  } catch (error) {
    console.error('Error fetching licenses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch licenses' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = CreateLicenseSchema.parse(body) as CreateLicenseInput;

    // Create license
    const license: License = {
      ...validatedData,
      id: `license_${nextId++}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    licenses.push(license);

    return NextResponse.json({ license }, { status: 201 });
  } catch (error) {
    console.error('Error creating license:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create license' },
      { status: 400 }
    );
  }
}
