import type { FastifyInstance } from 'fastify';
import { prisma } from '../db.js';
import {
  generateGenome,
  generateGenomeForOrisha,
  generateGenomeForSephira,
  rerollGenome,
  generateSystemPrompt,
  exportGenome,
  type CharacterGenome,
  type GenomeGenerationOptions,
  type OrishaName,
  type SephiraName,
} from '@lcos/oripheon';

// Convert Prisma genome to full CharacterGenome
function toCharacterGenome(prismaGenome: any): CharacterGenome {
  return {
    id: prismaGenome.id,
    name: prismaGenome.name,
    schemaVersion: prismaGenome.schemaVersion,
    createdAt: prismaGenome.createdAt,
    updatedAt: prismaGenome.updatedAt,
    orishaConfiguration: prismaGenome.orishaConfiguration,
    kabbalisticPosition: prismaGenome.kabbalisticPosition,
    psychologicalState: prismaGenome.psychologicalState,
    multiModalSignature: prismaGenome.multiModalSignature,
    narrativeIdentity: prismaGenome.narrativeIdentity,
    invariantMarkers: prismaGenome.invariantMarkers,
    evolutionRules: prismaGenome.evolutionRules,
    characterId: prismaGenome.characterId || undefined,
    seed: prismaGenome.seed || undefined,
    tags: prismaGenome.tags || [],
  };
}

export async function genomeRoutes(fastify: FastifyInstance): Promise<void> {
  // POST /genomes - Create a new genome (optionally with generation options)
  fastify.post('/genomes', async (request, reply) => {
    const body = request.body as {
      name?: string;
      seed?: number;
      forceOrisha?: OrishaName;
      forceSephira?: SephiraName;
      hotCoolBias?: number;
      preferredTrajectory?: string;
      tags?: string[];
      // Or provide a full genome object
      genome?: CharacterGenome;
    } | undefined;

    let genome: CharacterGenome;

    if (body?.genome) {
      // Use provided genome
      genome = body.genome;
    } else {
      // Generate a new genome
      const options: GenomeGenerationOptions = {
        name: body?.name,
        seed: body?.seed,
        forceOrisha: body?.forceOrisha,
        forceSephira: body?.forceSephira,
        hotCoolBias: body?.hotCoolBias,
        preferredTrajectory: body?.preferredTrajectory as any,
        tags: body?.tags,
      };
      genome = generateGenome(options);
    }

    // Save to database
    const saved = await prisma.characterGenome.create({
      data: {
        id: genome.id,
        name: genome.name,
        schemaVersion: genome.schemaVersion,
        seed: genome.seed,
        tags: genome.tags || [],
        orishaConfiguration: genome.orishaConfiguration as any,
        kabbalisticPosition: genome.kabbalisticPosition as any,
        psychologicalState: genome.psychologicalState as any,
        multiModalSignature: genome.multiModalSignature as any,
        narrativeIdentity: genome.narrativeIdentity as any,
        invariantMarkers: genome.invariantMarkers as any,
        evolutionRules: genome.evolutionRules as any,
      },
    });

    return reply.code(201).send(toCharacterGenome(saved));
  });

  // GET /genomes - List all genomes
  fastify.get('/genomes', async (request, reply) => {
    const query = request.query as {
      orisha?: string;
      sephira?: string;
      trajectory?: string;
      tag?: string;
    };

    const where: any = {};

    // Filter by Orisha (stored in JSON, so we use path filtering)
    // Note: Prisma doesn't support JSON path filtering on all databases
    // For PostgreSQL, we can use raw queries or application-level filtering

    const genomes = await prisma.characterGenome.findMany({
      orderBy: { createdAt: 'desc' },
    });

    // Application-level filtering for JSON fields
    let filtered = genomes;

    if (query.orisha) {
      filtered = filtered.filter((g: any) =>
        g.orishaConfiguration?.headOrisha === query.orisha
      );
    }

    if (query.sephira) {
      filtered = filtered.filter((g: any) =>
        g.kabbalisticPosition?.primarySephira === query.sephira
      );
    }

    if (query.trajectory) {
      filtered = filtered.filter((g: any) =>
        g.psychologicalState?.trajectory === query.trajectory
      );
    }

    if (query.tag) {
      filtered = filtered.filter((g: any) =>
        g.tags?.includes(query.tag)
      );
    }

    return reply.send(filtered.map(toCharacterGenome));
  });

  // GET /genomes/:id - Get a genome by ID
  fastify.get<{ Params: { id: string } }>('/genomes/:id', async (request, reply) => {
    const { id } = request.params;

    const genome = await prisma.characterGenome.findUnique({
      where: { id },
    });

    if (!genome) {
      return reply.code(404).send({ error: 'Genome not found' });
    }

    return reply.send(toCharacterGenome(genome));
  });

  // PATCH /genomes/:id - Update a genome
  fastify.patch<{ Params: { id: string } }>('/genomes/:id', async (request, reply) => {
    const { id } = request.params;
    const body = request.body as Partial<{
      name: string;
      tags: string[];
      orishaConfiguration: any;
      kabbalisticPosition: any;
      psychologicalState: any;
      multiModalSignature: any;
      narrativeIdentity: any;
      invariantMarkers: any;
      evolutionRules: any;
    }>;

    const existing = await prisma.characterGenome.findUnique({
      where: { id },
    });

    if (!existing) {
      return reply.code(404).send({ error: 'Genome not found' });
    }

    const updated = await prisma.characterGenome.update({
      where: { id },
      data: body,
    });

    return reply.send(toCharacterGenome(updated));
  });

  // DELETE /genomes/:id - Delete a genome
  fastify.delete<{ Params: { id: string } }>('/genomes/:id', async (request, reply) => {
    const { id } = request.params;

    const existing = await prisma.characterGenome.findUnique({
      where: { id },
    });

    if (!existing) {
      return reply.code(404).send({ error: 'Genome not found' });
    }

    await prisma.characterGenome.delete({
      where: { id },
    });

    return reply.code(204).send();
  });

  // POST /genomes/:id/generate-prompt - Generate AI system prompt from genome
  fastify.post<{
    Params: { id: string };
    Body?: { style?: 'concise' | 'detailed' | 'poetic' };
  }>('/genomes/:id/generate-prompt', async (request, reply) => {
    const { id } = request.params;
    const body = request.body;

    const dbGenome = await prisma.characterGenome.findUnique({
      where: { id },
    });

    if (!dbGenome) {
      return reply.code(404).send({ error: 'Genome not found' });
    }

    const genome = toCharacterGenome(dbGenome);
    const result = generateSystemPrompt(genome, {
      format: 'system-prompt',
      promptStyle: body?.style || 'detailed',
    });

    return reply.send(result);
  });

  // POST /genomes/:id/export - Export genome in various formats
  fastify.post<{
    Params: { id: string };
    Body?: { format?: 'json' | 'markdown' | 'system-prompt'; promptStyle?: 'concise' | 'detailed' | 'poetic' };
  }>('/genomes/:id/export', async (request, reply) => {
    const { id } = request.params;
    const body = request.body;

    const dbGenome = await prisma.characterGenome.findUnique({
      where: { id },
    });

    if (!dbGenome) {
      return reply.code(404).send({ error: 'Genome not found' });
    }

    const genome = toCharacterGenome(dbGenome);
    const format = body?.format || 'json';

    const exported = exportGenome(genome, {
      format,
      promptStyle: body?.promptStyle || 'detailed',
    });

    // Set appropriate content type
    if (format === 'json') {
      reply.header('Content-Type', 'application/json');
    } else {
      reply.header('Content-Type', 'text/plain');
    }

    return reply.send(exported);
  });

  // POST /genomes/:id/link/:characterId - Link genome to character
  fastify.post<{
    Params: { id: string; characterId: string };
  }>('/genomes/:id/link/:characterId', async (request, reply) => {
    const { id, characterId } = request.params;

    // Check genome exists
    const genome = await prisma.characterGenome.findUnique({
      where: { id },
    });

    if (!genome) {
      return reply.code(404).send({ error: 'Genome not found' });
    }

    // Check character exists
    const character = await prisma.character.findUnique({
      where: { id: characterId },
    });

    if (!character) {
      return reply.code(404).send({ error: 'Character not found' });
    }

    // Check if character already has a genome
    const existingLink = await prisma.characterGenome.findUnique({
      where: { characterId },
    });

    if (existingLink && existingLink.id !== id) {
      return reply.code(400).send({ error: 'Character already has a linked genome' });
    }

    // Update the link
    const updated = await prisma.characterGenome.update({
      where: { id },
      data: { characterId },
    });

    return reply.send(toCharacterGenome(updated));
  });

  // DELETE /genomes/:id/link - Unlink genome from character
  fastify.delete<{ Params: { id: string } }>('/genomes/:id/link', async (request, reply) => {
    const { id } = request.params;

    const genome = await prisma.characterGenome.findUnique({
      where: { id },
    });

    if (!genome) {
      return reply.code(404).send({ error: 'Genome not found' });
    }

    const updated = await prisma.characterGenome.update({
      where: { id },
      data: { characterId: null },
    });

    return reply.send(toCharacterGenome(updated));
  });

  // POST /genomes/generate - Generate a new genome without saving
  fastify.post('/genomes/generate', async (request, reply) => {
    const body = request.body as {
      name?: string;
      seed?: number;
      forceOrisha?: OrishaName;
      forceSephira?: SephiraName;
      hotCoolBias?: number;
      preferredTrajectory?: string;
      tags?: string[];
    } | undefined;

    const options: GenomeGenerationOptions = {
      name: body?.name,
      seed: body?.seed,
      forceOrisha: body?.forceOrisha,
      forceSephira: body?.forceSephira,
      hotCoolBias: body?.hotCoolBias,
      preferredTrajectory: body?.preferredTrajectory as any,
      tags: body?.tags,
    };

    const genome = generateGenome(options);
    return reply.send(genome);
  });

  // POST /genomes/generate/orisha/:orisha - Generate genome for specific Orisha
  fastify.post<{ Params: { orisha: string } }>('/genomes/generate/orisha/:orisha', async (request, reply) => {
    const { orisha } = request.params;
    const body = request.body as Partial<GenomeGenerationOptions> | undefined;

    try {
      const genome = generateGenomeForOrisha(orisha as OrishaName, body || {});
      return reply.send(genome);
    } catch (error) {
      return reply.code(400).send({ error: `Invalid Orisha: ${orisha}` });
    }
  });

  // POST /genomes/generate/sephira/:sephira - Generate genome for specific Sephira
  fastify.post<{ Params: { sephira: string } }>('/genomes/generate/sephira/:sephira', async (request, reply) => {
    const { sephira } = request.params;
    const body = request.body as Partial<GenomeGenerationOptions> | undefined;

    try {
      const genome = generateGenomeForSephira(sephira as SephiraName, body || {});
      return reply.send(genome);
    } catch (error) {
      return reply.code(400).send({ error: `Invalid Sephira: ${sephira}` });
    }
  });

  // POST /genomes/reroll/:seed - Regenerate genome with same seed but different options
  fastify.post<{ Params: { seed: string } }>('/genomes/reroll/:seed', async (request, reply) => {
    const seed = parseInt(request.params.seed, 10);

    if (isNaN(seed)) {
      return reply.code(400).send({ error: 'Invalid seed - must be a number' });
    }

    const body = request.body as Partial<GenomeGenerationOptions> | undefined;
    const genome = rerollGenome(seed, body || {});

    return reply.send(genome);
  });

  // POST /genomes/sync-all - Generate genomes for all characters without genomes
  fastify.post('/genomes/sync-all', async (request, reply) => {
    const { force } = request.body as { force?: boolean } || {};

    // Get all characters
    const characters = await prisma.character.findMany();

    // Get existing genomes
    const existingGenomes = await prisma.characterGenome.findMany({
      where: {
        characterId: { not: null },
      },
    });

    const existingCharacterIds = new Set(
      existingGenomes.map((g) => g.characterId).filter(Boolean)
    );

    const results: Array<{
      characterId: string;
      characterName: string;
      status: 'generated' | 'already_exists' | 'linked' | 'error';
      genomeId?: string;
      error?: string;
    }> = [];

    for (const character of characters) {
      try {
        // Skip if already has genome and not forcing
        if (existingCharacterIds.has(character.id) && !force) {
          results.push({
            characterId: character.id,
            characterName: character.name,
            status: 'already_exists',
          });
          continue;
        }

        // Generate genome based on character's oripheon data if available
        const oripheonData = (character.timelineState as any)?.oripheon?.generated;
        const options: GenomeGenerationOptions = {
          name: `${character.name} Genome`,
        };

        // If character has orisha from oripheon, use it
        if (oripheonData?.arcana?.archetype) {
          const archetype = oripheonData.arcana.archetype;
          // Map common archetypes to Orishas if possible
          // This is a basic mapping - extend as needed
          // Only includes Orishas that exist in ORISHA_DATA
          const archetypeToOrisha: Record<string, OrishaName> = {
            'eleggua': 'Èṣù',
            'obatala': 'Obàtálá',
            'oshun': 'Ọ̀ṣun',
            'yemoja': 'Yemọja',
            'shango': 'Ṣàngó',
            'oya': 'Ọya',
            'ogun': 'Ògún',
            'orunmila': 'Ọ̀rúnmìlà',
            'osanyin': 'Ọ̀sanyìn',
            'oshoosi': 'Ọ̀ṣọ́ọ̀sì',
          };

          const orishaName = archetypeToOrisha[archetype.toLowerCase()];
          if (orishaName) {
            options.forceOrisha = orishaName;
          }
        }

        // Use oripheon seed if available
        if (oripheonData?.seed) {
          options.seed = oripheonData.seed;
        }

        // Generate the genome
        const genome = generateGenome(options);

        // Save to database with character link
        const saved = await prisma.characterGenome.create({
          data: {
            id: genome.id,
            name: genome.name,
            schemaVersion: genome.schemaVersion,
            seed: genome.seed,
            tags: genome.tags || [],
            characterId: character.id, // Link to character
            orishaConfiguration: genome.orishaConfiguration as any,
            kabbalisticPosition: genome.kabbalisticPosition as any,
            psychologicalState: genome.psychologicalState as any,
            multiModalSignature: genome.multiModalSignature as any,
            narrativeIdentity: genome.narrativeIdentity as any,
            invariantMarkers: genome.invariantMarkers as any,
            evolutionRules: genome.evolutionRules as any,
          },
        });

        results.push({
          characterId: character.id,
          characterName: character.name,
          status: 'generated',
          genomeId: saved.id,
        });
      } catch (error) {
        results.push({
          characterId: character.id,
          characterName: character.name,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        });
      }
    }

    const summary = {
      total: characters.length,
      generated: results.filter((r) => r.status === 'generated').length,
      alreadyExists: results.filter((r) => r.status === 'already_exists').length,
      errors: results.filter((r) => r.status === 'error').length,
    };

    return reply.send({
      summary,
      results,
    });
  });
}
