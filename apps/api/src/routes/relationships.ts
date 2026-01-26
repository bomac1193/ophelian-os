import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import { z } from 'zod';

const RelationshipTypeEnum = z.enum([
  'ALLY',
  'ENEMY',
  'MENTOR',
  'FAMILY',
  'RIVAL',
  'FRIEND',
  'LOVER',
  'CUSTOM',
]);

type RelationshipType = z.infer<typeof RelationshipTypeEnum>;

const CreateRelationshipSchema = z.object({
  sourceCharacterId: z.string().min(1),
  targetCharacterId: z.string().min(1),
  relationshipType: RelationshipTypeEnum.default('CUSTOM'),
  customTypeName: z.string().nullable().optional(),
  sourceRole: z.string().nullable().optional(),
  targetRole: z.string().nullable().optional(),
  lore: z.string().default(''),
});

const UpdateRelationshipSchema = z.object({
  relationshipType: RelationshipTypeEnum.optional(),
  customTypeName: z.string().nullable().optional(),
  sourceRole: z.string().nullable().optional(),
  targetRole: z.string().nullable().optional(),
  lore: z.string().optional(),
});

const GenerateLoreSchema = z.object({
  sourceCharacterId: z.string().min(1),
  targetCharacterId: z.string().min(1),
  relationshipType: RelationshipTypeEnum.optional(),
  randomizeType: z.boolean().default(false),
});

// Lore generation templates by relationship type
const LORE_TEMPLATES: Record<RelationshipType, string[]> = {
  ALLY: [
    '{source} and {target} forged their alliance during {event}. Together they have {achievement}, and their bond remains unshakeable.',
    'When {source} faced {challenge}, it was {target} who stood by their side. Since that day, they have been inseparable allies.',
    'The alliance between {source} and {target} began unexpectedly during {event}. What started as necessity became genuine trust.',
    '{source} saved {target} from {danger}, creating a debt of honor that evolved into true friendship and alliance.',
  ],
  ENEMY: [
    'The enmity between {source} and {target} began when {betrayal}. Neither has forgotten, and neither will forgive.',
    '{source} and {target} were once {pastRelation}, until {event} tore them apart. Now only hatred remains.',
    'Their rivalry turned to hatred when {source} {action} that {target} could never accept. War between them is inevitable.',
    'The feud between {source} and {target} has claimed {cost}. Both seek the other\'s downfall.',
  ],
  MENTOR: [
    '{source} took {target} under their wing after recognizing {quality}. Years of training have shaped {target} into who they are today.',
    'When {target} showed promise in {skill}, {source} became their guide. The lessons taught go far beyond mere technique.',
    '{source} saw in {target} what others missed. Through patience and wisdom, they unlocked {target}\'s true potential.',
    'The bond between {source} and {target} transcends simple teaching. {source} imparts not just knowledge, but a way of life.',
  ],
  FAMILY: [
    '{source} and {target} share blood and history. Their family has weathered {hardship}, making their bond unbreakable.',
    'Growing up together, {source} and {target} developed a bond that goes beyond mere relation. They are family in every sense.',
    'The {familyTie} between {source} and {target} was tested when {event}, but ultimately proved stronger than any trial.',
    '{source} has always protected {target}, as family does. Together they carry the legacy of their lineage.',
  ],
  RIVAL: [
    '{source} and {target} have competed since {origin}. Their rivalry pushes both to greater heights.',
    'Neither {source} nor {target} can accept being second to the other. Their competition defines them both.',
    'The rivalry between {source} and {target} is legendary. Each victory for one drives the other to train harder.',
    '{source} and {target} respect each other deeply, yet neither will rest until they prove themselves the superior.',
  ],
  FRIEND: [
    '{source} and {target} met during {event} and discovered kindred spirits. Their friendship has endured through {trials}.',
    'When {source} needed someone to trust, {target} was there. Their friendship is built on {foundation}.',
    'The bond between {source} and {target} defies explanation. Some friendships simply feel like destiny.',
    '{source} and {target} share everything: {shared}. In each other, they found the friend they always needed.',
  ],
  LOVER: [
    '{source} and {target} first met during {event}. What began as {beginning} blossomed into profound love.',
    'The love between {source} and {target} was forbidden by {obstacle}, yet their hearts would not be denied.',
    '{source} never believed in love until {target} entered their life. Together they discovered what it means to truly care for another.',
    'Through {hardship} and {joy}, {source} and {target} have built a love that will echo through the ages.',
  ],
  CUSTOM: [
    '{source} and {target} share a unique connection. Their paths intertwined during {event}, forever changing both.',
    'The bond between {source} and {target} defies simple categorization. It is something entirely their own.',
    'When {source} encountered {target}, neither expected what would follow. Their story continues to unfold.',
    '{source} and {target} understand each other in ways others cannot fathom. Their connection runs deep.',
  ],
};

// Fill-in elements for templates
const EVENTS = [
  'the great storm', 'the festival of lights', 'a chance encounter at the crossroads',
  'the siege of the old city', 'a journey to distant lands', 'the darkest night',
  'a shared moment of crisis', 'the tournament of champions', 'an unexpected rescue',
  'a fateful bargain', 'the collapse of the old order', 'a whispered prophecy',
];

const CHALLENGES = [
  'overwhelming darkness', 'betrayal from within', 'an impossible choice',
  'the loss of everything dear', 'enemies on all sides', 'a crisis of faith',
];

const ACHIEVEMENTS = [
  'overcome impossible odds', 'discovered ancient secrets', 'saved countless lives',
  'built something lasting', 'proven their worth', 'changed the course of history',
];

const DANGERS = [
  'certain death', 'eternal imprisonment', 'a terrible curse',
  'powerful enemies', 'their own demons', 'the shadows of the past',
];

const BETRAYALS = [
  '{source} discovered {target}\'s deception', 'a terrible secret came to light',
  'one chose power over loyalty', 'trust was shattered by ambition',
];

const QUALITIES = [
  'raw talent', 'unshakeable determination', 'hidden potential',
  'a spark of greatness', 'wisdom beyond their years', 'courage in the face of fear',
];

const SKILLS = [
  'the ancient arts', 'combat', 'strategy', 'diplomacy', 'the mystical ways', 'leadership',
];

const HARDSHIPS = [
  'war and strife', 'loss and grief', 'exile and wandering',
  'persecution', 'natural disasters', 'dark times',
];

const FOUNDATIONS = [
  'mutual respect', 'shared struggles', 'unwavering loyalty',
  'honest communication', 'tested trust', 'countless shared experiences',
];

const SHARED = [
  'dreams and fears', 'laughter and tears', 'victories and defeats',
  'secrets and hopes', 'adventures and quiet moments', 'the good times and the bad',
];

const BEGINNINGS = [
  'mere curiosity', 'reluctant partnership', 'an unlikely friendship',
  'mutual admiration', 'a shared glance', 'friendly competition',
];

const OBSTACLES = [
  'ancient traditions', 'warring factions', 'family expectations',
  'duty and honor', 'the laws of the land', 'fate itself',
];

const FAMILY_TIES = [
  'sibling bond', 'parent-child relationship', 'ancestral connection',
  'chosen family bond', 'clan loyalty', 'blood oath',
];

const PAST_RELATIONS = [
  'close friends', 'trusted allies', 'devoted partners',
  'sworn companions', 'blood brothers', 'fellow warriors',
];

const ACTIONS = [
  'committed an unforgivable act', 'made a choice', 'revealed a truth',
  'broke a sacred oath', 'chose another path', 'abandoned them',
];

const COSTS = [
  'many lives', 'years of peace', 'entire kingdoms',
  'countless resources', 'their own humanity', 'everything they once held dear',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateLore(
  sourceName: string,
  targetName: string,
  relationshipType: RelationshipType,
  sourceTraits: string[] = [],
  targetTraits: string[] = []
): { lore: string; sourceRole?: string; targetRole?: string } {
  const templates = LORE_TEMPLATES[relationshipType];
  let template = randomFrom(templates);

  // Replace placeholders
  template = template.replace(/{source}/g, sourceName);
  template = template.replace(/{target}/g, targetName);
  template = template.replace(/{event}/g, randomFrom(EVENTS));
  template = template.replace(/{challenge}/g, randomFrom(CHALLENGES));
  template = template.replace(/{achievement}/g, randomFrom(ACHIEVEMENTS));
  template = template.replace(/{danger}/g, randomFrom(DANGERS));
  template = template.replace(/{betrayal}/g, randomFrom(BETRAYALS).replace(/{source}/g, sourceName).replace(/{target}/g, targetName));
  template = template.replace(/{quality}/g, randomFrom(QUALITIES));
  template = template.replace(/{skill}/g, randomFrom(SKILLS));
  template = template.replace(/{hardship}/g, randomFrom(HARDSHIPS));
  template = template.replace(/{foundation}/g, randomFrom(FOUNDATIONS));
  template = template.replace(/{shared}/g, randomFrom(SHARED));
  template = template.replace(/{beginning}/g, randomFrom(BEGINNINGS));
  template = template.replace(/{obstacle}/g, randomFrom(OBSTACLES));
  template = template.replace(/{familyTie}/g, randomFrom(FAMILY_TIES));
  template = template.replace(/{pastRelation}/g, randomFrom(PAST_RELATIONS));
  template = template.replace(/{action}/g, randomFrom(ACTIONS));
  template = template.replace(/{cost}/g, randomFrom(COSTS));
  template = template.replace(/{trials}/g, randomFrom(HARDSHIPS));
  template = template.replace(/{joy}/g, randomFrom(['triumph', 'celebration', 'happiness', 'success']));

  // Generate roles based on relationship type
  const roles = generateRoles(relationshipType, sourceName, targetName);

  return {
    lore: template,
    ...roles,
  };
}

function generateRoles(
  relationshipType: RelationshipType,
  sourceName: string,
  targetName: string
): { sourceRole?: string; targetRole?: string } {
  const rolesByType: Record<RelationshipType, { source: string[]; target: string[] }> = {
    ALLY: {
      source: ['Sworn Companion', 'Battle Brother', 'Trusted Ally', 'Shield-Bearer'],
      target: ['Sworn Companion', 'Battle Sister', 'Trusted Ally', 'Sword-Arm'],
    },
    ENEMY: {
      source: ['Nemesis', 'Sworn Foe', 'Bitter Enemy', 'Betrayer'],
      target: ['Nemesis', 'Sworn Foe', 'Bitter Enemy', 'The Betrayed'],
    },
    MENTOR: {
      source: ['Master', 'Teacher', 'Guide', 'Sage'],
      target: ['Apprentice', 'Student', 'Disciple', 'Protégé'],
    },
    FAMILY: {
      source: ['Elder', 'Guardian', 'Protector', 'Kin'],
      target: ['Heir', 'Ward', 'Blood', 'Kin'],
    },
    RIVAL: {
      source: ['Challenger', 'Competitor', 'Adversary', 'Contender'],
      target: ['Challenger', 'Competitor', 'Adversary', 'Contender'],
    },
    FRIEND: {
      source: ['Confidant', 'Companion', 'True Friend', 'Kindred Spirit'],
      target: ['Confidant', 'Companion', 'True Friend', 'Kindred Spirit'],
    },
    LOVER: {
      source: ['Beloved', 'Heart\'s Desire', 'Soulmate', 'Devoted'],
      target: ['Beloved', 'Heart\'s Desire', 'Soulmate', 'Devoted'],
    },
    CUSTOM: {
      source: ['Connected', 'Bound', 'Linked', 'Intertwined'],
      target: ['Connected', 'Bound', 'Linked', 'Intertwined'],
    },
  };

  const roles = rolesByType[relationshipType];
  return {
    sourceRole: randomFrom(roles.source),
    targetRole: randomFrom(roles.target),
  };
}

export async function relationshipRoutes(fastify: FastifyInstance): Promise<void> {
  // GET /relationships - List all relationships (with optional characterId filter)
  fastify.get<{ Querystring: { characterId?: string } }>('/relationships', async (request, reply) => {
    const { characterId } = request.query;

    const where = characterId
      ? {
          OR: [{ sourceCharacterId: characterId }, { targetCharacterId: characterId }],
        }
      : undefined;

    const relationships = await prisma.characterRelationship.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });

    return reply.send(relationships);
  });

  // GET /relationships/:id - Get a relationship by ID
  fastify.get<{ Params: { id: string } }>('/relationships/:id', async (request, reply) => {
    const { id } = request.params;

    const relationship = await prisma.characterRelationship.findUnique({
      where: { id },
    });

    if (!relationship) {
      return reply.code(404).send({ error: 'Relationship not found' });
    }

    return reply.send(relationship);
  });

  // POST /relationships - Create a new relationship
  fastify.post('/relationships', async (request, reply) => {
    try {
      const body = CreateRelationshipSchema.parse(request.body);

      // Verify both characters exist
      const [sourceChar, targetChar] = await Promise.all([
        prisma.character.findUnique({ where: { id: body.sourceCharacterId } }),
        prisma.character.findUnique({ where: { id: body.targetCharacterId } }),
      ]);

      if (!sourceChar) {
        return reply.code(400).send({ error: 'Source character not found' });
      }
      if (!targetChar) {
        return reply.code(400).send({ error: 'Target character not found' });
      }

      // Check for existing relationship
      const existing = await prisma.characterRelationship.findUnique({
        where: {
          sourceCharacterId_targetCharacterId: {
            sourceCharacterId: body.sourceCharacterId,
            targetCharacterId: body.targetCharacterId,
          },
        },
      });

      if (existing) {
        return reply.code(409).send({ error: 'Relationship already exists between these characters' });
      }

      const relationship = await prisma.characterRelationship.create({
        data: body,
      });

      return reply.code(201).send(relationship);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation error', details: error });
      }
      throw error;
    }
  });

  // POST /relationships/generate-lore - Generate lore for a relationship
  fastify.post('/relationships/generate-lore', async (request, reply) => {
    try {
      const body = GenerateLoreSchema.parse(request.body);

      // Fetch both characters
      const [sourceChar, targetChar] = await Promise.all([
        prisma.character.findUnique({ where: { id: body.sourceCharacterId } }),
        prisma.character.findUnique({ where: { id: body.targetCharacterId } }),
      ]);

      if (!sourceChar) {
        return reply.code(400).send({ error: 'Source character not found' });
      }
      if (!targetChar) {
        return reply.code(400).send({ error: 'Target character not found' });
      }

      // Determine relationship type
      let relationshipType: RelationshipType;
      if (body.randomizeType) {
        const types: RelationshipType[] = ['ALLY', 'ENEMY', 'MENTOR', 'FAMILY', 'RIVAL', 'FRIEND', 'LOVER'];
        relationshipType = randomFrom(types);
      } else {
        relationshipType = body.relationshipType || 'CUSTOM';
      }

      // Generate lore
      const result = generateLore(
        sourceChar.name,
        targetChar.name,
        relationshipType,
        sourceChar.personaTags,
        targetChar.personaTags
      );

      return reply.send({
        relationshipType,
        lore: result.lore,
        sourceRole: result.sourceRole,
        targetRole: result.targetRole,
      });
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation error', details: error });
      }
      throw error;
    }
  });

  // PATCH /relationships/:id - Update a relationship
  fastify.patch<{ Params: { id: string } }>('/relationships/:id', async (request, reply) => {
    const { id } = request.params;

    try {
      const body = UpdateRelationshipSchema.parse(request.body);

      const relationship = await prisma.characterRelationship.findUnique({
        where: { id },
      });

      if (!relationship) {
        return reply.code(404).send({ error: 'Relationship not found' });
      }

      const updated = await prisma.characterRelationship.update({
        where: { id },
        data: body,
      });

      return reply.send(updated);
    } catch (error) {
      if (error instanceof Error && error.name === 'ZodError') {
        return reply.code(400).send({ error: 'Validation error', details: error });
      }
      throw error;
    }
  });

  // DELETE /relationships/:id - Delete a relationship
  fastify.delete<{ Params: { id: string } }>('/relationships/:id', async (request, reply) => {
    const { id } = request.params;

    const relationship = await prisma.characterRelationship.findUnique({
      where: { id },
    });

    if (!relationship) {
      return reply.code(404).send({ error: 'Relationship not found' });
    }

    await prisma.characterRelationship.delete({
      where: { id },
    });

    return reply.code(204).send();
  });
}
