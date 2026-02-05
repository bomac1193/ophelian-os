/**
 * Voice Generation API Route
 * Integrates with local Chromox voice synthesis backend
 */

import { NextRequest, NextResponse } from 'next/server';

// Local Chromox backend URL
const CHROMOX_URL = process.env.CHROMOX_URL || 'http://localhost:4414';

// Map Boveda character to Chromox persona ID
// TODO: Create a proper mapping system in the database
function getPersonaIdForCharacter(characterId: string): string {
  // For now, use a default persona or allow configuration
  return process.env.DEFAULT_CHROMOX_PERSONA_ID || 'default-persona';
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      characterId,
      text,
      styleControls = {},
      emotion = 'neutral',
    } = body;

    // Validate input
    if (!text || typeof text !== 'string' || !text.trim()) {
      return NextResponse.json(
        { error: 'Text is required' },
        { status: 400 }
      );
    }

    if (!characterId) {
      return NextResponse.json(
        { error: 'Character ID is required' },
        { status: 400 }
      );
    }

    // Get the Chromox persona ID for this character
    const personaId = getPersonaIdForCharacter(characterId);

    // Map emotion to style prompt
    const emotionToStyleMap: Record<string, string> = {
      neutral: 'natural, balanced delivery',
      happy: 'bright, uplifting, energetic',
      sad: 'soft, melancholic, gentle',
      angry: 'intense, powerful, forceful',
      excited: 'energetic, vibrant, enthusiastic',
      calm: 'smooth, relaxed, peaceful',
    };

    const stylePrompt = emotionToStyleMap[emotion] || 'natural delivery';

    // Map Boveda style controls to Chromox controls
    const chromoxControls = {
      brightness: styleControls.clarity ?? 0.5,
      breathiness: 0.3,
      energy: styleControls.energy ?? 0.5,
      formant: 0.5,
      vibratoDepth: 0.3,
      vibratoRate: 0.5,
      roboticism: 0.0,
      glitch: 0.0,
      stereoWidth: 0.5,
    };

    // Call local Chromox backend
    const formData = new FormData();
    formData.append('personaId', personaId);
    formData.append('lyrics', text);
    formData.append('stylePrompt', stylePrompt);
    formData.append('controls', JSON.stringify(chromoxControls));
    formData.append('effects', JSON.stringify({ preset: 'clean' }));

    const chromoxResponse = await fetch(`${CHROMOX_URL}/api/render`, {
      method: 'POST',
      body: formData,
    });

    if (!chromoxResponse.ok) {
      const error = await chromoxResponse.text();
      console.error('Chromox API error:', error);

      // Check if Chromox backend is running
      if (chromoxResponse.status === 0 || error.includes('ECONNREFUSED')) {
        return NextResponse.json(
          {
            error: 'Chromox backend is not running. Start it with: cd ~/chromox/backend && npm run dev',
          },
          { status: 503 }
        );
      }

      throw new Error(`Chromox API error: ${chromoxResponse.status} - ${error}`);
    }

    const data = await chromoxResponse.json();

    // Return the audio URL and metadata
    return NextResponse.json({
      audioUrl: data.audioUrl,
      filePath: data.render?.audioPath || '',
      seconds: 10, // Estimate, Chromox doesn't return duration
      provider: 'chromox-local',
      meta: {
        personaId,
        stylePrompt,
        controls: chromoxControls,
        renderId: data.render?.id,
      },
    });
  } catch (error) {
    console.error('Voice generation error:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Failed to generate audio',
      },
      { status: 500 }
    );
  }
}
