/**
 * Story Beat Generation API
 * Generates transmedia story beats adapted for multiple platforms
 */

import { NextRequest, NextResponse } from 'next/server';
import type { StoryBeat, MediaAdaptation } from '@lcos/shared';
import { transmediaStories } from '../../../../../lib/transmedia-storage';

export async function POST(
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

    const story = transmediaStories[storyIndex];
    const body = await request.json();
    const { numBeats = 5 } = body;

    // Generate story beats based on story arc
    const generatedBeats: StoryBeat[] = generateStoryBeats(story, numBeats);

    // Update story with generated beats
    transmediaStories[storyIndex] = {
      ...story,
      beats: generatedBeats,
      status: 'IN_PROGRESS',
      updatedAt: new Date(),
    };

    return NextResponse.json({ story: transmediaStories[storyIndex] });
  } catch (error) {
    console.error('Error generating story beats:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate story beats' },
      { status: 400 }
    );
  }
}

// Story beat generation logic
function generateStoryBeats(story: any, numBeats: number): StoryBeat[] {
  const beatTypes: any[] = [
    'INTRODUCTION',
    'INCITING_INCIDENT',
    'RISING_ACTION',
    'CLIMAX',
    'FALLING_ACTION',
    'RESOLUTION',
  ];

  const beats: StoryBeat[] = [];

  for (let i = 0; i < numBeats; i++) {
    const beatType = beatTypes[Math.min(i, beatTypes.length - 1)];
    const beat = generateBeat(story, beatType, i);
    beats.push(beat);
  }

  return beats;
}

function generateBeat(story: any, beatType: any, sequenceOrder: number): StoryBeat {
  const coreNarrative = generateCoreNarrative(story, beatType);
  const adaptations = generateMediaAdaptations(story, coreNarrative, beatType);

  return {
    beatType,
    coreNarrative,
    emotionalTone: getEmotionalTone(beatType),
    characterIds: [story.primaryCharacterId, ...story.supportingCharacterIds],
    adaptations,
    sequenceOrder,
    metadata: {},
  };
}

function generateCoreNarrative(story: any, beatType: any): string {
  const templates: Record<string, string> = {
    INTRODUCTION: `Meet the characters in ${story.arc.name}. ${story.arc.description}`,
    INCITING_INCIDENT: `An unexpected event disrupts the ordinary world, forcing the protagonist to take action. The story theme of "${story.arc.theme}" begins to emerge.`,
    RISING_ACTION: `The tension builds as characters face increasing challenges. Relationships are tested and new alliances form.`,
    CLIMAX: `The moment of greatest tension arrives. Everything the characters have worked towards comes to a head in this pivotal moment.`,
    FALLING_ACTION: `The aftermath of the climax unfolds. Characters begin to process what has happened and the consequences become clear.`,
    RESOLUTION: `The story reaches its conclusion. The theme of "${story.arc.theme}" is fully realized as characters find their new normal.`,
  };

  return templates[beatType] || 'A significant story moment unfolds.';
}

function generateMediaAdaptations(story: any, coreNarrative: string, beatType: any): MediaAdaptation[] {
  const adaptations: MediaAdaptation[] = [];

  // Generate adaptations for each target media type
  story.targetMediaTypes.forEach((mediaType: any) => {
    story.targetPlatforms.forEach((platform: any) => {
      const adaptation = adaptMediaToPlatform(coreNarrative, mediaType, platform, beatType);
      adaptations.push(adaptation);
    });
  });

  return adaptations;
}

function adaptMediaToPlatform(
  coreNarrative: string,
  mediaType: any,
  platform: any,
  beatType: any
): MediaAdaptation {
  const adaptations: Record<string, Record<string, any>> = {
    TWITTER: {
      TEXT: {
        content: `${coreNarrative.substring(0, 260)}...\n\n🧵 Thread continues...`,
        wordCount: 40,
      },
    },
    INSTAGRAM: {
      TEXT: {
        content: `${coreNarrative}\n\n#storytelling #transmedia`,
        imagePrompt: `Visual representation of: ${coreNarrative}`,
      },
      VISUAL: {
        content: coreNarrative,
        imagePrompt: `Create a cinematic image representing ${beatType}: ${coreNarrative}`,
      },
    },
    TIKTOK: {
      VIDEO: {
        content: `[Video Script]\n\n${coreNarrative}\n\n[Visual: Dynamic cuts showing the scene]\n[Audio: Trending sound or original score]`,
        duration: 60,
      },
    },
    PODCAST: {
      AUDIO: {
        content: `[Podcast Segment]\n\n"${coreNarrative}"\n\n[Host explores themes and character motivations]`,
        duration: 300,
      },
    },
    BLOG: {
      TEXT: {
        content: `# Story Beat: ${beatType}\n\n${coreNarrative}\n\nThis moment represents a crucial turning point in our narrative, where characters must confront their deepest challenges and make choices that will define their journey.`,
        wordCount: 500,
      },
    },
    NEWSLETTER: {
      TEXT: {
        content: `Dear Reader,\n\n${coreNarrative}\n\nJoin us next time as the story continues to unfold.\n\nUntil then,\nYour Storyteller`,
        wordCount: 300,
      },
    },
    YOUTUBE: {
      VIDEO: {
        content: `[YouTube Video Script]\n\nIntro: Welcome back to the series!\n\nMain Content: ${coreNarrative}\n\nOutro: Subscribe for the next episode!`,
        duration: 600,
      },
    },
  };

  const platformAdaptation = adaptations[platform]?.[mediaType];

  return {
    mediaType,
    platform,
    content: platformAdaptation?.content || coreNarrative,
    metadata: {},
    duration: platformAdaptation?.duration,
    wordCount: platformAdaptation?.wordCount,
    imagePrompt: platformAdaptation?.imagePrompt,
  };
}

function getEmotionalTone(beatType: any): string {
  const tones: Record<string, string> = {
    INTRODUCTION: 'Curious and inviting',
    INCITING_INCIDENT: 'Tense and urgent',
    RISING_ACTION: 'Building suspense',
    CLIMAX: 'Intense and dramatic',
    FALLING_ACTION: 'Reflective and contemplative',
    RESOLUTION: 'Satisfying and hopeful',
  };

  return tones[beatType] || 'Engaging';
}
