/**
 * Merch Design Generation API
 * Generates merchandise designs from character genome
 */

import { NextRequest, NextResponse } from 'next/server';
import type { MerchDesign } from '@lcos/shared';
import { merchDesigns, getNextDesignId } from '../../../../../lib/merch-storage';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { characterId, characterName, visualSignature, style = 'minimalist' } = body;

    // Generate design based on character's visual signature
    const design = generateDesignFromGenome(characterId, characterName, visualSignature, style);

    merchDesigns.push(design);

    return NextResponse.json({ design }, { status: 201 });
  } catch (error) {
    console.error('Error generating merch design:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate design' },
      { status: 400 }
    );
  }
}

function generateDesignFromGenome(
  characterId: string,
  characterName: string,
  visualSignature: any,
  style: string
): MerchDesign {
  // Extract colors from character's visual signature
  const colors = visualSignature?.primaryColors || ['#667eea', '#764ba2', '#f093fb'];

  // Generate AI prompt based on character aesthetics
  const aestheticStyle = visualSignature?.aestheticStyle || 'modern minimalist';
  const patterns = visualSignature?.patterns?.join(', ') || 'geometric, abstract';
  const symbols = visualSignature?.symbolMotifs?.join(', ') || 'celestial, mystical';

  const imagePrompt = `Create a ${style} merchandise design for character "${characterName}".
Style: ${aestheticStyle}.
Incorporate patterns: ${patterns}.
Include symbolic elements: ${symbols}.
Color palette: ${colors.join(', ')}.
Design should work well on apparel and accessories.
High contrast, bold, suitable for print-on-demand.`;

  // In production, this would call DALL-E or Midjourney API
  const mockImageUrl = `https://placeholder.co/800x800/${colors[0].replace('#', '')}/${colors[1].replace('#', '')}?text=${characterName}+Merch`;

  return {
    id: getNextDesignId(),
    characterId,
    designName: `${characterName} ${style} Design`,
    imageUrl: mockImageUrl,
    imagePrompt,
    genomeInspired: true,
    colors,
    style,
    consentToken: `consent_${characterId}_${Date.now()}`,
    createdAt: new Date(),
  };
}
