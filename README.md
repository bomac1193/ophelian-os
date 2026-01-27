# Living Character OS (Bóveda)

**Creator-first infrastructure for AI characters: genome generation, relationship mapping, rights management, and multi-platform publishing.**

---

## Current Status

### What's Working Now

| Feature | Status | Location |
|---------|--------|----------|
| **Character Generator** | ✅ Complete | `/` (Characters page) |
| **Character Genome System** | ✅ Complete | `/genome` |
| **Nexus (Relationship Map)** | ✅ Complete | `/nexus` |
| **Scenes** | ✅ Complete | `/scenes` |
| **Globes (Worlds)** | ✅ Complete | `/globes` |
| **Usage Ledger** | ✅ Complete | `/ledger` |
| **Rights/Licensing** | 🔶 API Only | No UI yet |
| **Voice Synthesis** | 🔶 Stub | ElevenLabs integration ready |
| **Social Publishing** | 🔶 Stub | X/TikTok/Instagram stubs |

### Recent Additions

**Character Genome System** (January 2025)
- Orisha-based spiritual archetypes with caminos (paths)
- Kabbalah Tree of Life positioning with Sephiroth selection
- Kenneth Grant's Vodun-Kabbalah correspondences
- Hot/Cool psychological axis (Rada/Petwo)
- Multi-modal signatures (visual, voice, music, movement)
- AI system prompt generation from genome
- Export to JSON, Markdown, or system prompt format

**Nexus Visualization**
- Interactive node-based relationship mapping
- Drag-and-drop character/scene/world positioning
- Shift+click to create connections
- Snapshot save/restore for version control
- Generate Mythos (lore generation) for relationships

**Name Generation Enhancements**
- Aminal mode (animal-inspired names)
- Squishe mode (playful/cute names)
- Core dropdown for aesthetic symbol adornments
- Blend heritage option
- Mononym support
- Relic (sacred object) generation with modern symbolism
- Sample tweet generation

---

## Architecture

```
living-character-os/
├── apps/
│   ├── api/                 # Fastify API server with Prisma ORM
│   ├── studio/              # Next.js 14 App Router UI
│   └── publisher-worker/    # Background worker for scheduled publishing
├── packages/
│   ├── oripheon/            # Character & genome generation engine
│   │   ├── src/
│   │   │   ├── index.ts     # Main character generator
│   │   │   ├── types/       # Genome type definitions
│   │   │   ├── data/        # Orisha, Sephiroth, Paths reference data
│   │   │   └── lib/         # Genome generation & export
│   ├── canon/               # Character types & memory/timeline helpers
│   ├── rights/              # License validation for actions
│   ├── content/             # Content generation (stub for MVP)
│   ├── voice/               # Audio generation (stub + ElevenLabs)
│   ├── ledger/              # Usage tracking & settlement reporting
│   ├── social-connectors/   # Social platform publishing (stubs)
│   └── shared/              # Zod schemas & shared enums
└── tooling configs...
```

---

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL 14+

### Installation

```bash
cd living-character-os
pnpm install
```

### Configure Environment

```bash
cp .env.example .env
# Edit .env with your database connection and API key
```

### Set Up Database

```bash
pnpm db:push      # Sync schema to database
pnpm db:seed      # Optional: seed demo data
```

### Start Development

```bash
pnpm dev
```

This starts:
- **Studio UI**: http://localhost:3000
- **API Server**: http://localhost:3001

---

## Studio Pages

| Route | Purpose |
|-------|---------|
| `/` | Character library with Quick Generate modal |
| `/genome` | Character genome library |
| `/genome/create` | Multi-step genome creator |
| `/genome/[id]` | Genome detail view with system prompt export |
| `/scenes` | Scene/location management |
| `/globes` | World/setting management |
| `/nexus` | Visual relationship mapper |
| `/ledger` | Usage events and settlement reports |
| `/characters/[id]` | Character detail and content generation |

---

## Character Genome System

The genome system creates rich, consistent AI character definitions based on:

### Orisha Configuration
- **Head Orisha**: Primary spiritual archetype (Èṣù, Ògún, Ọ̀ṣun, Yemọja, Ṣàngó, Ọya, Obàtálá, Ọ̀rúnmìlà, Ọ̀ṣọ́ọ̀sì, Ọ̀sanyìn)
- **Camino**: Specific road/path of the Orisha
- **Secondary Influences**: Up to 3 additional Orisha with strength values

### Kabbalistic Position
- **Primary Sephira**: Position on Tree of Life (auto-suggested from Orisha via Kenneth Grant mappings)
- **Pillar**: Mercy, Severity, or Balance
- **Qliphothic Shadow**: The dark mirror aspect
- **Daath Relationship**: seeking, touched, integrated, or avoiding

### Psychological State
- **Hot/Cool Axis**: -1 (Rada/cool) to +1 (Petwo/hot)
- **Trajectory**: emergence, ascent, crisis, descent, integration, transcendence
- **Individuation Level**: 0-100%
- **Shadow Integration**: 0-100%
- **Active Archetypes**: Currently dominant psychological patterns

### Multi-Modal Signature
Automatically derived from Orisha + psychological state:
- **Visual**: Colors, patterns, textures, light quality, aesthetic style
- **Voice**: Pitch range, timbre, speech patterns, emotional resonance
- **Music**: Key signature, mode, tempo, instruments, rhythmic patterns
- **Movement**: Quality of motion, spatial orientation, gesture vocabulary

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/genomes` | Create and save genome |
| GET | `/genomes` | List genomes (filterable) |
| GET | `/genomes/:id` | Get genome by ID |
| PATCH | `/genomes/:id` | Update genome |
| DELETE | `/genomes/:id` | Delete genome |
| POST | `/genomes/generate` | Generate without saving |
| POST | `/genomes/generate/orisha/:orisha` | Generate for specific Orisha |
| POST | `/genomes/generate/sephira/:sephira` | Generate for specific Sephira |
| POST | `/genomes/:id/generate-prompt` | Generate AI system prompt |
| POST | `/genomes/:id/export` | Export as JSON/markdown/prompt |
| POST | `/genomes/:id/link/:characterId` | Link genome to character |

---

## Next Steps

### Phase 1: Integration & Polish (Current)
- [ ] Link genomes to characters in the UI (button on character detail page)
- [ ] Display linked genome info on character cards
- [ ] Add genome-based system prompt to character's AI configuration
- [ ] Improve Tree of Life visualization with path highlighting
- [ ] Add genome comparison view

### Phase 2: AI Integration
- [ ] Connect genome multi-modal signatures to actual AI generation
- [ ] Use voice signature for ElevenLabs voice selection/cloning parameters
- [ ] Use visual signature for image generation prompts (Midjourney/DALL-E)
- [ ] Use music signature for audio generation (Suno/Udio)

### Phase 3: Content & Publishing
- [ ] Build out content generation with LLM integration (Claude/GPT)
- [ ] Implement real social connectors (X API, TikTok, Instagram)
- [ ] Add content scheduling UI
- [ ] Implement content approval workflow

### Phase 4: Rights & Revenue
- [ ] Build license management UI
- [ ] Implement consent validation before AI actions
- [ ] Add royalty split configuration UI
- [ ] Build settlement dashboard with export

### Phase 5: Advanced Features
- [ ] Character evolution over time (genome drift within permitted bounds)
- [ ] Multi-character scene generation
- [ ] Relationship-driven content (using Nexus connections)
- [ ] Voice cloning consent flow

---

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `API_KEY` | API authentication key | `default-dev-key` |
| `NEXT_PUBLIC_API_URL` | API URL for Studio | `http://localhost:3001` |
| `NEXT_PUBLIC_API_KEY` | API key for Studio | `default-dev-key` |
| `ELEVENLABS_API_KEY` | ElevenLabs API key | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `CLOUDINARY_API_KEY` | Cloudinary API key | - |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | - |

---

## Development Commands

```bash
# Run all apps in dev mode
pnpm dev

# Build all packages
pnpm build

# Build specific package
cd packages/oripheon && pnpm build

# Database commands
pnpm db:push       # Sync schema (dev)
pnpm db:migrate    # Run migrations (prod)
pnpm db:seed       # Seed demo data
pnpm db:generate   # Regenerate Prisma client

# Lint and format
pnpm lint
pnpm format
```

---

## Key Files

### Genome System
- `packages/oripheon/src/types/genome.types.ts` - TypeScript interfaces
- `packages/oripheon/src/data/orisha-data.ts` - Orisha reference data
- `packages/oripheon/src/data/sephiroth-data.ts` - Sephiroth reference data
- `packages/oripheon/src/lib/genome-generator.ts` - Generation algorithm
- `packages/oripheon/src/lib/system-prompt-generator.ts` - AI prompt generation
- `apps/api/src/routes/genomes.ts` - API endpoints
- `apps/studio/src/components/genome/` - UI components

### Character Generator
- `packages/oripheon/src/index.ts` - Main generator (1900+ lines)

### Nexus
- `apps/studio/src/app/nexus/page.tsx` - Relationship visualization
- `apps/api/src/routes/relationships.ts` - Relationship API
- `apps/api/src/routes/snapshots.ts` - Snapshot save/restore

---

## Domain Models

### CharacterGenome (New)
- Orisha configuration (head, camino, secondary influences)
- Kabbalistic position (sephira, pillar, qliphoth, daath relationship)
- Psychological state (hot/cool, trajectory, individuation, shadow)
- Multi-modal signature (visual, voice, music, movement)
- Narrative identity (values, conflicts, themes, telos)
- Invariant markers (identity anchors, taboos, sacred values)
- Evolution rules (permitted changes, protected core, velocity)
- Optional link to Character

### Character
- Persona definition (name, bio, aliases, avatar)
- Tone controls (allowed/forbidden)
- System prompt for AI generation
- Timeline state for memory/arc tracking
- Optional link to CharacterGenome

### CharacterRelationship
- Source and target characters
- Relationship type (ally, enemy, mentor, family, rival, friend, lover, custom)
- Roles and lore text

### Scene / World
- Name, description, type
- Image URL
- Position on Nexus canvas
- Connections to characters and other entities

### License
- Owner, subject type/ID
- Consent flags (synthesis, training, commercial)
- License type and royalty splits

### UsageEvent
- Event type (voice synthesis, publish)
- Revenue tracking for settlement

---

## License

Private - All rights reserved
