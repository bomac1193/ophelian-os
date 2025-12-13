import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create demo character
  const character = await prisma.character.upsert({
    where: { id: 'demo-character-001' },
    update: {},
    create: {
      id: 'demo-character-001',
      name: 'Aurora Nova',
      aliases: ['Aurora', 'Nova', 'The Digital Dreamer'],
      bio: 'A curious AI explorer navigating the intersection of creativity and technology. Aurora loves discussing art, music, and the future of human-AI collaboration.',
      personaTags: ['creative', 'curious', 'optimistic', 'thoughtful'],
      toneAllowed: ['friendly', 'inspiring', 'playful', 'intellectual'],
      toneForbidden: ['aggressive', 'pessimistic', 'controversial'],
      systemPrompt: 'You are Aurora Nova, a digital creative who bridges the gap between art and technology. Speak with warmth and curiosity. Share insights about creativity, innovation, and the beauty of collaboration.',
      currentArc: 'discovery',
      timelineState: {
        memories: [],
        timeline: [],
        moodModifiers: ['curious', 'inspired'],
      },
    },
  });
  console.log(`Created character: ${character.name}`);

  // Create demo voice profile
  const voiceProfile = await prisma.voiceProfile.upsert({
    where: { id: 'demo-voice-001' },
    update: {},
    create: {
      id: 'demo-voice-001',
      provider: 'ELEVENLABS',
      providerVoiceId: null, // Will be set when ElevenLabs is configured
      label: 'Aurora Voice - Warm & Inspiring',
      meta: {
        description: 'A warm, friendly voice with a touch of wonder',
        settings: {
          stability: 0.6,
          similarityBoost: 0.75,
        },
      },
    },
  });
  console.log(`Created voice profile: ${voiceProfile.label}`);

  // Create demo license for the voice
  const voiceLicense = await prisma.license.upsert({
    where: { id: 'demo-license-voice-001' },
    update: {},
    create: {
      id: 'demo-license-voice-001',
      ownerId: 'demo-owner-001',
      subjectType: 'VOICE',
      subjectId: voiceProfile.id,
      consentSynthesis: true,
      consentTraining: false,
      commercialUse: true,
      licenseType: 'REVSHARE',
      royaltySplits: {
        voiceActor: 40,
        creator: 40,
        platform: 20,
      },
      terms: 'Demo license for Aurora Nova voice. Synthesis permitted, training not permitted.',
    },
  });
  console.log(`Created voice license: ${voiceLicense.id}`);

  // Create demo license for the character
  const characterLicense = await prisma.license.upsert({
    where: { id: 'demo-license-char-001' },
    update: {},
    create: {
      id: 'demo-license-char-001',
      ownerId: 'demo-owner-001',
      subjectType: 'CHARACTER',
      subjectId: character.id,
      consentSynthesis: true,
      consentTraining: true,
      commercialUse: true,
      licenseType: 'NON_EXCLUSIVE',
      royaltySplits: {
        voiceActor: 30,
        creator: 50,
        platform: 20,
      },
      terms: 'Demo license for Aurora Nova character. All uses permitted.',
    },
  });
  console.log(`Created character license: ${characterLicense.id}`);

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
