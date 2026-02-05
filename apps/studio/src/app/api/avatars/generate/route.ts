/**
 * Avatar Generation API Route
 * Integrates with local Sembla for consent-first avatar generation
 */

import { NextRequest, NextResponse } from 'next/server';

// Local Sembla backend URL
const SEMBLA_URL = process.env.SEMBLA_URL || 'http://localhost:3000';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image');
    const characterId = formData.get('characterId');
    const consentName = formData.get('consentName');
    const consentEmail = formData.get('consentEmail');
    const gender = formData.get('gender') || 'androgynous';
    const skinTone = formData.get('skinTone') || 'neutral skin tone';
    const vibe = formData.get('vibe') || 'editorial';

    // Validate inputs
    if (!image || !(image instanceof File)) {
      return NextResponse.json(
        { error: 'Image file is required' },
        { status: 400 }
      );
    }

    if (!characterId) {
      return NextResponse.json(
        { error: 'Character ID is required' },
        { status: 400 }
      );
    }

    if (!consentName || !consentEmail) {
      return NextResponse.json(
        { error: 'Consent name and email are required' },
        { status: 400 }
      );
    }

    // Build consent JSON
    const consentJson = JSON.stringify({
      signerName: consentName,
      signerEmail: consentEmail,
      timestamp: new Date().toISOString(),
      characterId,
      rights: {
        aiGeneration: true,
        commercialUse: true,
        training: false, // User controls this
      },
      platform: 'Boveda',
    });

    // Prepare request to Sembla
    const semblaFormData = new FormData();
    semblaFormData.append('image', image);
    semblaFormData.append('options', JSON.stringify({
      email: consentEmail,
      gender,
      skinTone,
      vibe,
      consentJson,
      consentName,
      qr: `boveda-character-${characterId}`,
    }));

    // Call Sembla API
    const semblaResponse = await fetch(`${SEMBLA_URL}/api/generate`, {
      method: 'POST',
      body: semblaFormData,
    });

    if (!semblaResponse.ok) {
      const error = await semblaResponse.text();
      console.error('Sembla API error:', error);

      if (semblaResponse.status === 0 || error.includes('ECONNREFUSED')) {
        return NextResponse.json(
          {
            error: 'Sembla backend is not running. Start it with: cd ~/sembla && npm run dev',
          },
          { status: 503 }
        );
      }

      throw new Error(`Sembla API error: ${semblaResponse.status} - ${error}`);
    }

    const data = await semblaResponse.json();

    // Create license record for the avatar
    try {
      await fetch(`${request.nextUrl.origin}/api/licenses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerId: consentEmail,
          subjectType: 'CHARACTER',
          subjectId: characterId,
          consentSynthesis: true,
          consentTraining: false,
          commercialUse: true,
          licenseType: 'EXCLUSIVE',
          royaltySplits: { voiceActor: 100, creator: 0, platform: 0 },
          terms: `Avatar license for character ${characterId}. License token: ${data.licenseToken}`,
        }),
      });
    } catch (err) {
      console.warn('Failed to create license record:', err);
      // Continue anyway - the avatar was generated
    }

    // Return avatar details
    return NextResponse.json({
      outputUrl: data.outputUrl,
      licenseToken: data.licenseToken,
      descriptor: data.descriptor,
      consentJson,
      characterId,
    });
  } catch (error) {
    console.error('Avatar generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate avatar',
      },
      { status: 500 }
    );
  }
}
