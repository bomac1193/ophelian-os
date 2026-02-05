/**
 * Social Media Publishing API
 * Exports character content to SLAYT for multi-platform distribution
 *
 * This is a gateway endpoint that delegates to SLAYT microservice
 * SLAYT runs independently and handles platform-specific adaptation
 */

import { NextRequest, NextResponse } from 'next/server';

// SLAYT service configuration
const SLAYT_API_URL = process.env.SLAYT_API_URL || 'http://localhost:3002';
const SLAYT_API_KEY = process.env.SLAYT_API_KEY || 'slayt-dev-key';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      characterId,
      characterName,
      genome,
      content,
      platforms,
      settings,
    } = body;

    // Validate required fields
    if (!characterId || !characterName || !content) {
      return NextResponse.json(
        { error: 'characterId, characterName, and content are required' },
        { status: 400 }
      );
    }

    // Prepare payload for SLAYT
    const slaytPayload = {
      character: {
        id: characterId,
        name: characterName,
        genome: {
          visualSignature: genome?.visual || null,
          personality: {
            orisha: genome?.orisha || null,
            sephira: genome?.sephira || null,
            traits: genome?.traits || [],
          },
          voice: genome?.voice || null,
        },
      },
      content: {
        type: content.type || 'story',
        text: content.text,
        media: content.media || [],
        metadata: content.metadata || {},
      },
      platforms: platforms || ['TWITTER', 'INSTAGRAM', 'TIKTOK'],
      settings: {
        scheduleTime: settings?.scheduleTime || null,
        autoAdapt: settings?.autoAdapt !== false,
        includeHashtags: settings?.includeHashtags !== false,
        includeAttribution: settings?.includeAttribution !== false,
      },
      source: 'boveda',
      timestamp: new Date().toISOString(),
    };

    // Check if SLAYT is available
    const isSlayAvailable = await checkSlaytAvailability();

    if (!isSlayAvailable) {
      // SLAYT not running - return helpful error
      return NextResponse.json(
        {
          error: 'SLAYT service not available',
          message: 'SLAYT is not running. Start SLAYT service to enable social publishing.',
          instructions: 'Run: cd /path/to/slayt && npm run dev',
          payload: slaytPayload, // Return payload so user can manually process
        },
        { status: 503 }
      );
    }

    // Call SLAYT API
    const slaytResponse = await fetch(`${SLAYT_API_URL}/api/publish`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${SLAYT_API_KEY}`,
        'X-Source': 'boveda',
      },
      body: JSON.stringify(slaytPayload),
    });

    if (!slaytResponse.ok) {
      const errorData = await slaytResponse.json().catch(() => ({}));
      throw new Error(errorData.error || 'SLAYT publishing failed');
    }

    const result = await slaytResponse.json();

    // Return success with SLAYT response
    return NextResponse.json({
      success: true,
      message: 'Content published successfully',
      slaytResponse: result,
      publishedTo: platforms,
      characterId,
      timestamp: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error publishing to SLAYT:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to publish content',
        details: 'Check that SLAYT service is running and accessible',
      },
      { status: 500 }
    );
  }
}

/**
 * Check if SLAYT service is available
 */
async function checkSlaytAvailability(): Promise<boolean> {
  try {
    const response = await fetch(`${SLAYT_API_URL}/health`, {
      method: 'GET',
      headers: { 'Authorization': `Bearer ${SLAYT_API_KEY}` },
      signal: AbortSignal.timeout(2000), // 2 second timeout
    });
    return response.ok;
  } catch {
    return false;
  }
}

/**
 * GET endpoint to check SLAYT connection status
 */
export async function GET() {
  const isAvailable = await checkSlaytAvailability();

  return NextResponse.json({
    slaytAvailable: isAvailable,
    slaytUrl: SLAYT_API_URL,
    message: isAvailable
      ? 'SLAYT service is connected and ready'
      : 'SLAYT service is not available. Start SLAYT to enable social publishing.',
  });
}
