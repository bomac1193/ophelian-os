/**
 * Merch Products API Routes
 * CRUD operations for merchandise products
 */

import { NextRequest, NextResponse } from 'next/server';
import { CreateMerchProductSchema } from '@lcos/shared';
import type { MerchProduct, CreateMerchProductInput } from '@lcos/shared';
import { merchProducts, getNextProductId } from '../../../../lib/merch-storage';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const characterId = searchParams.get('characterId');
    const creatorId = searchParams.get('creatorId');

    let filtered = merchProducts;

    // Filter by character
    if (characterId) {
      filtered = filtered.filter((p) => p.characterId === characterId);
    }

    // Filter by creator
    if (creatorId) {
      filtered = filtered.filter((p) => p.creatorId === creatorId);
    }

    // Only show active products by default
    filtered = filtered.filter((p) => p.isActive);

    return NextResponse.json({ products: filtered });
  } catch (error) {
    console.error('Error fetching merch products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate input
    const validatedData = CreateMerchProductSchema.parse(body) as CreateMerchProductInput;

    // Mock user - in real app, get from auth
    const mockCreatorId = 'user_1';
    const mockCreatorName = 'Creator';

    // Calculate revenue share (Creator 70%, Platform 30%)
    const revenueShare = {
      creator: 70,
      platform: 30,
      printProvider: 0, // Cost is deducted from base price
    };

    const product: MerchProduct = {
      ...validatedData,
      id: getNextProductId(),
      creatorId: mockCreatorId,
      creatorName: mockCreatorName,
      salesCount: 0,
      revenue: 0,
      revenueShare,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    merchProducts.push(product);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Error creating merch product:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create product' },
      { status: 400 }
    );
  }
}
