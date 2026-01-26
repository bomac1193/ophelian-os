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

// Mythos generation templates by relationship type
const LORE_TEMPLATES: Record<RelationshipType, string[]> = {
  ALLY: [
    'In the hollow between worlds, where {cosmicPlace} bleeds into mortal soil, {source} and {target} clasped hands and swore an oath that {cosmicConsequence}. The universe remembers.',
    'They say {source} once carried {target}\'s shadow across {cosmicPlace} when {target}\'s own had been stolen. Now their shadows move as one, and neither walks alone.',
    'Before {source} knew their own name, {target} spoke it into being during {mythicMoment}. This debt—if debt it can be called—binds them beyond death or distance.',
    '{source} and {target} drink from the same wellspring of purpose. When one bleeds, the other feels the wound. When one triumphs, both are lifted.',
    'The threads of {source} and {target} were woven together by {weaver} who laughed and said, "These two shall never be truly alone." And so it has been.',
  ],
  ENEMY: [
    '{source} carries a wound that will never heal—a wound {target} carved with {mythicWeapon}. Every breath is a reminder. Every heartbeat, a vow of reckoning.',
    'They were once {mythicBond} until {source} discovered {target}\'s {darkSecret}. Now they circle each other like dying stars, locked in a gravity of hatred.',
    'The name of {target} is ash in {source}\'s mouth. What {target} destroyed cannot be rebuilt—only avenged. And vengeance is patient.',
    '{source} and {target} are bound by mutual destruction. Neither will outlive the other by long. This they know. This they accept.',
    'In another life, another telling, {source} and {target} might have been {mythicBond}. But that story was burned when {cosmicBetrayal}. Only this bitter truth remains.',
  ],
  MENTOR: [
    '{source} found {target} drowning in {metaphoricalDarkness} and taught them to breathe shadow, to walk in darkness without becoming it. The student now exceeds the master\'s wildest fears—and proudest dreams.',
    'The {ancientKnowledge} that {source} carries was meant to die with them. Then {target} asked the question no one had asked in {timePeriod}. Now the flame passes on.',
    '{source} broke {target} down to nothing during their training—then rebuilt them, bone by bone, truth by truth. {target} emerged not as a copy, but as something {source} could never have imagined.',
    'What {source} teaches {target} cannot be found in any text or tradition. It is the wisdom of {mythicSource}—passed mouth to ear, soul to soul, across {timePeriod}.',
    '{target} once asked {source} why they were chosen. {source} replied: "Because your hunger frightens me. And only I am hungry enough to meet it."',
  ],
  FAMILY: [
    'The blood of {source} and {target} sings the same ancient song—a melody composed in {mythicOrigin} and carried through {generations} of joy and sorrow.',
    'They share more than blood. They share the same ghost in their veins, the same {ancestralLegacy} coiled in their marrow, the same {familyBurden} they cannot escape.',
    'When {source} looks at {target}, they see every ancestor who came before—and every descendant who will follow. The weight of lineage is their shared crown.',
    '{source} and {target} were not merely born into the same family. They were forged in the same crucible of {familyTrial}. What nearly destroyed them made them inseparable.',
    'Their {familyTie} was tested when {mythicChoice} demanded one betray the other. Instead, they found a third path—one that rewrote the rules of their bloodline forever.',
  ],
  RIVAL: [
    '{source} and {target} are two answers to the same question, two flames fighting for the same oxygen. The world may only have room for one. Neither will yield.',
    'Every achievement of {source} is a gauntlet thrown at {target}\'s feet. Every triumph of {target} is a wound to {source}\'s pride. They make each other magnificent.',
    'The {cosmicForce} that created {source} also created {target}—perhaps as a check, perhaps as a joke. Their rivalry is written in the architecture of existence itself.',
    'They have fought across {battlegrounds}. They have bested each other in {contests}. When one finally falls, the other will not celebrate—they will mourn the only worthy opponent they ever had.',
    '{source} dreams of {target}\'s defeat. {target} dreams of {source}\'s acknowledgment. Neither will ever be satisfied. Both will never stop trying.',
  ],
  FRIEND: [
    '{source} knows the {secretShame} that {target} has never spoken aloud. {target} knows the {hiddenFear} that haunts {source}\'s quietest moments. This knowledge is not a weapon—it is a bridge.',
    'When {cosmicEvent} stripped away everything else, {source} and {target} discovered they were the only real things left. That clarity has never faded.',
    'Their friendship was forged in {trialOfFriendship}. They emerged with matching scars and a bond that confounds those who observe it—effortless, unshakeable, eternal.',
    '{source} once told {target}: "If the world turns against you, I will burn beside you." {target} laughed and said: "Then we\'ll set a beautiful fire."',
    'They are the secret each other keeps. The truth each other protects. The home each other returns to when every other shelter has collapsed.',
  ],
  LOVER: [
    '{source} and {target} found each other in {liminalSpace}—that nowhere between dreams and waking where souls recognize their mirrors. They have been inseparable since.',
    'Their love was written before their bodies drew breath. {cosmicEntity} tried to keep them apart; {mythicObstacle} tried to destroy what they had. Love is more stubborn than gods.',
    'When {source} touches {target}, time slows. When {target} speaks {source}\'s name, {cosmicResonance}. This is not metaphor. This is the literal truth of their connection.',
    '{source} and {target} chose each other across {impossibleOdds}. Again and again, lifetime after lifetime, their souls reach for one another. Some loves are cosmic inevitability.',
    'They are the answer to each other\'s loneliness—not by completing what was missing, but by illuminating what was always there. Together, they are more themselves than they could ever be apart.',
  ],
  CUSTOM: [
    'There is no name for what {source} and {target} share. Scholars have tried; poets have failed. It exists in the space between categories, defying definition while demanding acknowledgment.',
    '{source} and {target} are connected by {mysteriousThread}—a bond that neither created and neither fully understands. They only know that to sever it would unmake them both.',
    'Their story began with {strangeBeginning}. How it will end, not even {cosmicEntity} can predict. But the middle—this living, breathing now—belongs entirely to them.',
    'Some connections are born of choice. Some of circumstance. What binds {source} and {target} is something older: {ancientForce} recognizing itself across two separate souls.',
    '{source} and {target} orbit each other like celestial bodies—each shaping the other\'s path through existence, each essential to the other\'s trajectory through the endless dark.',
  ],
};

// Fill-in elements for mythos templates
const COSMIC_PLACES = [
  'the Threshold of Unbecoming', 'the Dreaming Wastes', 'the space between heartbeats',
  'the Hollow Where Names Are Forgotten', 'the Ocean of Unfinished Stories', 'the Wound in the World',
  'the Garden of What Might Have Been', 'the Library of Burning Truths', 'the edge of the last map',
];

const COSMIC_CONSEQUENCES = [
  'echoes still in the chambers of eternity', 'caused the stars to briefly weep',
  'altered the trajectory of their descendants for seven generations', 'left a mark that time itself cannot erase',
  'woke something ancient and watching', 'rewrote a small piece of fate\'s ledger',
];

const MYTHIC_MOMENTS = [
  'the hour when all clocks stopped', 'the night the moon split in two',
  'the moment between a prayer and its answer', 'the breath before the world changed',
  'the silence after the last song', 'the instant when possibility crystallized into destiny',
];

const WEAVERS = [
  'the Spinner of Unlikely Threads', 'a dying god\'s final act of mischief',
  'the Dream That Dreams Itself', 'accident wearing the mask of purpose',
  'the same force that turns seeds into forests', 'the echo of an ancient wish',
];

const MYTHIC_WEAPONS = [
  'words sharper than forgetting', 'a truth that should never have been spoken',
  'silence more cutting than any blade', 'a betrayal wrapped in kindness',
  'the weapon of absolute indifference', 'a smile hiding infinite cruelty',
];

const MYTHIC_BONDS = [
  'two halves of the same star', 'the left and right hands of destiny',
  'mirrors reflecting each other\'s light', 'threads in the same tapestry',
  'voices in the same song', 'branches of the same impossible tree',
];

const DARK_SECRETS = [
  'hunger for the hollow crown', 'true name whispered to the enemy',
  'the bodies buried beneath the foundation', 'the lie that everything else was built upon',
  'the price they paid in other people\'s blood', 'the self they murdered to become who they are',
];

const COSMIC_BETRAYALS = [
  '{target} chose the world over {source}', '{source} discovered they had always been {target}\'s sacrifice',
  'the truth of what {target} traded for power was revealed', '{target}\'s loyalty proved to be the longest con',
];

const METAPHORICAL_DARKNESS = [
  'the absence where meaning should be', 'grief so total it had become geography',
  'the certainty of their own worthlessness', 'a despair that had become comfortable',
  'the wreckage of their former self', 'questions that devoured every answer',
];

const ANCIENT_KNOWLEDGE = [
  'Wisdom That Weighs More Than Mountains', 'the Art of Seeing What Is Actually There',
  'knowledge that cost three civilizations their existence', 'truths the gods themselves have forgotten',
  'the craft of making something from nothing', 'secrets encoded in the spaces between words',
];

const TIME_PERIODS = [
  'a thousand years', 'seventeen lifetimes', 'time out of memory',
  'epochs beyond counting', 'the full turning of the great wheel', 'ages that have no names',
];

const MYTHIC_SOURCES = [
  'the First Teacher, who instructed the gods', 'those who built the world before this one',
  'the Keepers of Necessary Secrets', 'the tradition that predates language itself',
  'the original sin of creation', 'those who remember what everyone else has chosen to forget',
];

const MYTHIC_ORIGINS = [
  'the Forge of First Things', 'the dream of a sleeping god', 'the collision of two impossible wishes',
  'the fertile darkness before the first light', 'the echo of the universe\'s first word',
];

const GENERATIONS = [
  'a hundred generations', 'uncountable ancestors', 'blood memory stretching back to the first dawn',
  'lineages that predate written history', 'an unbroken chain from the beginning',
];

const ANCESTRAL_LEGACIES = [
  'curse that manifests as blessing', 'gift that feels like burden', 'duty that transcends choice',
  'power that demands constant sacrifice', 'destiny that allows no deviation',
];

const FAMILY_BURDENS = [
  'the weight of expectations written in DNA', 'the inherited enemies of their bloodline',
  'the debt their ancestors could never pay', 'the prophecy that named them before birth',
];

const FAMILY_TRIALS = [
  'the War of Inheritance', 'the Shattering of the Old House', 'the Long Exile',
  'the Trial of Blood and Choice', 'the generation that nearly ended the line',
];

const FAMILY_TIES = [
  'bond forged in shared survival', 'connection deeper than choice',
  'link that neither time nor death can sever', 'tie written in the very atoms of their being',
];

const MYTHIC_CHOICES = [
  'the Choice of One Life or Many', 'the Moment When Loyalty and Survival Diverged',
  'the Test That Has Destroyed Every Family Before Them', 'the Impossible Decision That Required Both',
];

const COSMIC_FORCES = [
  'the Architect of Necessary Oppositions', 'whatever designs the patterns in chaos',
  'the force that ensures balance through conflict', 'the Universe\'s sense of dramatic irony',
];

const BATTLEGROUNDS = [
  'fields both physical and philosophical', 'the arenas of reputation and deed',
  'territories of the heart and mind', 'every stage where excellence can be displayed',
];

const CONTESTS = [
  'games of wit and endurance', 'competitions that left observers speechless',
  'challenges that would have destroyed lesser spirits', 'trials that became legendary in the telling',
];

const SECRET_SHAMES = [
  'failure that haunts their proudest moments', 'weakness they have never shown another soul',
  'the self-doubt that gnaws beneath their confidence', 'the choice they would unmake if they could',
];

const HIDDEN_FEARS = [
  'terror of becoming what they hate', 'fear of being truly known and found wanting',
  'dread of the silence when the purpose is fulfilled', 'horror of the person they were before',
];

const COSMIC_EVENTS = [
  'the Unraveling', 'the moment when pretense became impossible', 'the collapse of comfortable illusions',
  'the Stripping of Masks', 'the hour when all debts came due',
];

const TRIALS_OF_FRIENDSHIP = [
  'the Long Night of Doubt', 'circumstances that should have made them enemies',
  'the test that revealed them to each other', 'the crisis that burned away everything except truth',
];

const LIMINAL_SPACES = [
  'the moment between lightning and thunder', 'the pause at the peak of the swing',
  'the instant when sleep surrenders to waking', 'the threshold where one self ends and another begins',
];

const COSMIC_ENTITIES = [
  'the Keeper of Distances', 'the Architect of Loneliness', 'the forces that prefer suffering',
  'those who profit from separation', 'the entropy that unweaves all connections',
];

const MYTHIC_OBSTACLES = [
  'the Ocean of Forgetting', 'the Wall of Previous Selves', 'the Army of Reasonable Objections',
  'the Labyrinth of Almost-Right Alternatives', 'the infinite patience of those who wished them ill',
];

const COSMIC_RESONANCES = [
  'somewhere, a bell begins to ring that will not stop', 'color returns to things long grey',
  'the world briefly remembers what it could be', 'something wounded begins to heal',
];

const IMPOSSIBLE_ODDS = [
  'distance measured in lifetimes', 'the certainty of their own mutual destruction',
  'every force in creation conspiring to keep them apart', 'the weight of histories that should have made this impossible',
];

const MYSTERIOUS_THREADS = [
  'a cord visible only in certain light', 'a resonance in frequencies only they can hear',
  'a recognition that precedes all memory', 'a gravity that operates across any distance',
];

const STRANGE_BEGINNINGS = [
  'a misunderstanding that revealed a deeper understanding', 'an ending that was actually a doorway',
  'a mistake that turned out to be the only right choice', 'a collision of incompatible destinies',
];

const ANCIENT_FORCES = [
  'the pattern-recognition of the cosmos', 'the same fire that burns in distant stars',
  'kinship older than their individual souls', 'the universe\'s way of knowing itself',
];

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generateMythos(
  sourceName: string,
  targetName: string,
  relationshipType: RelationshipType,
  sourceTraits: string[] = [],
  targetTraits: string[] = []
): { lore: string; sourceRole?: string; targetRole?: string } {
  const templates = LORE_TEMPLATES[relationshipType];
  let template = randomFrom(templates);

  // Replace character names
  template = template.replace(/{source}/g, sourceName);
  template = template.replace(/{target}/g, targetName);

  // Replace mythic placeholders
  template = template.replace(/{cosmicPlace}/g, randomFrom(COSMIC_PLACES));
  template = template.replace(/{cosmicConsequence}/g, randomFrom(COSMIC_CONSEQUENCES));
  template = template.replace(/{mythicMoment}/g, randomFrom(MYTHIC_MOMENTS));
  template = template.replace(/{weaver}/g, randomFrom(WEAVERS));
  template = template.replace(/{mythicWeapon}/g, randomFrom(MYTHIC_WEAPONS));
  template = template.replace(/{mythicBond}/g, randomFrom(MYTHIC_BONDS));
  template = template.replace(/{darkSecret}/g, randomFrom(DARK_SECRETS));
  template = template.replace(/{cosmicBetrayal}/g, randomFrom(COSMIC_BETRAYALS).replace(/{source}/g, sourceName).replace(/{target}/g, targetName));
  template = template.replace(/{metaphoricalDarkness}/g, randomFrom(METAPHORICAL_DARKNESS));
  template = template.replace(/{ancientKnowledge}/g, randomFrom(ANCIENT_KNOWLEDGE));
  template = template.replace(/{timePeriod}/g, randomFrom(TIME_PERIODS));
  template = template.replace(/{mythicSource}/g, randomFrom(MYTHIC_SOURCES));
  template = template.replace(/{mythicOrigin}/g, randomFrom(MYTHIC_ORIGINS));
  template = template.replace(/{generations}/g, randomFrom(GENERATIONS));
  template = template.replace(/{ancestralLegacy}/g, randomFrom(ANCESTRAL_LEGACIES));
  template = template.replace(/{familyBurden}/g, randomFrom(FAMILY_BURDENS));
  template = template.replace(/{familyTrial}/g, randomFrom(FAMILY_TRIALS));
  template = template.replace(/{familyTie}/g, randomFrom(FAMILY_TIES));
  template = template.replace(/{mythicChoice}/g, randomFrom(MYTHIC_CHOICES));
  template = template.replace(/{cosmicForce}/g, randomFrom(COSMIC_FORCES));
  template = template.replace(/{battlegrounds}/g, randomFrom(BATTLEGROUNDS));
  template = template.replace(/{contests}/g, randomFrom(CONTESTS));
  template = template.replace(/{secretShame}/g, randomFrom(SECRET_SHAMES));
  template = template.replace(/{hiddenFear}/g, randomFrom(HIDDEN_FEARS));
  template = template.replace(/{cosmicEvent}/g, randomFrom(COSMIC_EVENTS));
  template = template.replace(/{trialOfFriendship}/g, randomFrom(TRIALS_OF_FRIENDSHIP));
  template = template.replace(/{liminalSpace}/g, randomFrom(LIMINAL_SPACES));
  template = template.replace(/{cosmicEntity}/g, randomFrom(COSMIC_ENTITIES));
  template = template.replace(/{mythicObstacle}/g, randomFrom(MYTHIC_OBSTACLES));
  template = template.replace(/{cosmicResonance}/g, randomFrom(COSMIC_RESONANCES));
  template = template.replace(/{impossibleOdds}/g, randomFrom(IMPOSSIBLE_ODDS));
  template = template.replace(/{mysteriousThread}/g, randomFrom(MYSTERIOUS_THREADS));
  template = template.replace(/{strangeBeginning}/g, randomFrom(STRANGE_BEGINNINGS));
  template = template.replace(/{ancientForce}/g, randomFrom(ANCIENT_FORCES));

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
      source: ['The Unshakeable', 'Oath-Keeper', 'Shadow That Guards', 'The Steady Hand'],
      target: ['The Unbroken', 'Keeper of Promises', 'Light in Darkness', 'The Open Door'],
    },
    ENEMY: {
      source: ['The Wound That Won\'t Heal', 'Bearer of Grudges', 'The Reckoning', 'Hunger for Justice'],
      target: ['The Original Sin', 'The Debt Unpaid', 'The Unanswered Wrong', 'The Breaking Point'],
    },
    MENTOR: {
      source: ['Keeper of the Flame', 'The Voice That Shapes', 'Architect of Becoming', 'The Last Teacher'],
      target: ['The Hunger That Learns', 'Vessel of Promise', 'The Question Made Flesh', 'Tomorrow\'s Echo'],
    },
    FAMILY: {
      source: ['Blood of My Blood', 'The Anchor', 'Keeper of the Line', 'The Inherited Duty'],
      target: ['Continuation', 'The Promise Fulfilled', 'Next Thread in the Weave', 'Living Legacy'],
    },
    RIVAL: {
      source: ['The Mirror That Challenges', 'Worthy Opponent', 'The Standard-Bearer', 'Keeper of the Bar'],
      target: ['The Equal Flame', 'Refiner\'s Fire', 'The Measuring Stick', 'The Other Path'],
    },
    FRIEND: {
      source: ['The Sanctuary', 'Keeper of Secrets', 'The Unwavering', 'Home in Human Form'],
      target: ['The Accepting', 'Harbor in Storms', 'The Understanding', 'The Chosen Family'],
    },
    LOVER: {
      source: ['The Completed Equation', 'Heart\'s True North', 'The Answer', 'Reason Enough'],
      target: ['The Belonging', 'Soul\'s Mirror', 'The Inevitable', 'The Found'],
    },
    CUSTOM: {
      source: ['The Entangled', 'Thread in the Pattern', 'Part of the Mystery', 'The Resonance'],
      target: ['The Connected', 'Piece of the Puzzle', 'Half of the Equation', 'The Harmonic'],
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

      // Generate mythos
      const result = generateMythos(
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
