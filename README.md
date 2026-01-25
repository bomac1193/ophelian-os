# Ophelian OS

**Creator-first infrastructure for AI character rights, voice synthesis, and revenue.**

---

## The Problem

The AI character and virtual influencer market is projected to reach $35B by 2028, yet the infrastructure protecting creators remains fragmented and opaque:

- **Voice actors lose $300M+ annually** to unauthorized AI voice clones with no consent trail or compensation
- **Character creators have no unified ledger** tracking how their IP is used across platforms, making royalty enforcement impossible
- **Rights fragmentation**: consent for voice synthesis, AI training, and commercial use are conflated or ignored entirely
- **Revenue leakage**: multi-party royalty splits (voice actor, character creator, platform) are calculated manually, leading to disputes and delayed payments

Studios, agencies, and independent creators need a single source of truth that validates consent *before* any AI action occurs and settles revenue *automatically* when usage happens.

---

## What Ophelian OS Does

Ophelian OS is an **off-chain rights and publishing infrastructure** for AI characters. It provides:

1. **Consent-gated actions** — Every voice synthesis, content generation, and publish action is validated against explicit licenses before execution
2. **Usage ledger** — Immutable event log of every AI action with timestamps, platforms, and revenue attribution
3. **Automated settlement** — Monthly royalty calculation with configurable splits between voice actors, creators, and platforms
4. **Multi-platform publishing** — Scheduled content delivery to X/Twitter, TikTok, and Instagram with status tracking

---

## Guiding Policy

> **Validate consent first. Record everything. Settle fairly.**

Every feature in Ophelian OS flows from this principle. We reject the industry pattern of "use first, negotiate later" that has eroded creator trust. Instead:

- No voice synthesis without an active license with `synthesis: true`
- No AI training without explicit `training: true` consent
- No commercial publishing without `commercialUse: true` permission
- Every action writes to the ledger before returning success

---

## Strategic Objectives

### 1. Eliminate unauthorized AI voice usage

**Target**: 100% of voice synthesis requests validated against license consent flags before audio generation.

**How**: The `@lcos/rights` engine sits between every synthesis request and the voice provider. Requests without valid licenses fail immediately. Usage events are logged for audit and settlement.

### 2. Reduce royalty settlement time from weeks to seconds

**Target**: Automated monthly settlement reports with per-party breakdowns, replacing manual spreadsheet reconciliation.

**How**: The `@lcos/ledger` package records revenue-bearing events in real-time. `computeMonthlySettlement()` aggregates by character, voice profile, and license to produce instant, auditable reports with royalty splits already calculated.

---

## Architecture

```
ophelian-os/
├── apps/
│   ├── api/              # Fastify API server with Prisma ORM
│   ├── studio/           # Next.js 14 App Router UI
│   └── publisher-worker/ # Background worker for scheduled publishing
├── packages/
│   ├── canon/            # Character types & memory/timeline helpers
│   ├── rights/           # License validation for actions
│   ├── content/          # Content generation (stub for MVP)
│   ├── voice/            # Audio generation (stub + ElevenLabs provider)
│   ├── ledger/           # Usage tracking & settlement reporting
│   ├── social-connectors/# Social platform publishing (X stub)
│   └── shared/           # Zod schemas & shared enums
└── tooling configs...
```

## Prerequisites

- Node.js 18+
- pnpm 9+
- PostgreSQL 14+

## Quick Start

1. **Clone and install dependencies**

```bash
cd living-character-os
pnpm install
```

2. **Configure environment**

```bash
cp .env.example .env
# Edit .env with your database connection and API key
```

3. **Set up database**

```bash
# Make sure PostgreSQL is running
pnpm db:migrate
pnpm db:seed
```

4. **Start development servers**

```bash
pnpm dev
```

This starts:
- **Studio UI**: http://localhost:3000
- **API Server**: http://localhost:3001
- **Publisher Worker**: Background process

### Optional: Advanced (External) Character Creator

The Studio "Advanced (External)" character creator uses the separate **Oripheon** server (default `http://localhost:3333`).

1. Start Oripheon (in your `oripheon/` folder):

```bash
npm install
npm run dev
```

2. In Studio (`http://localhost:3000`): click `New Character` → `Advanced (External)`:
   - `Order` + `Path` dropdowns
   - Clickable suggested chips for `Desired Traits` and `Desired Skills`

If `http://localhost:3000` is blank, restart `pnpm dev` (and avoid running `next build` at the same time as `next dev`).

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `API_KEY` | API authentication key | `default-dev-key` |
| `API_URL` | API base URL (for studio) | `http://localhost:3001` |
| `ELEVENLABS_API_KEY` | ElevenLabs API key (optional) | - |
| `AUDIO_STORAGE_PATH` | Local path for audio files | `./storage/audio` |

## API Endpoints

All endpoints require `x-api-key` header (except `/health`).

### Characters

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/characters` | Create character |
| GET | `/characters` | List characters |
| GET | `/characters/:id` | Get character |

### Voice Profiles

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/voice-profiles` | Create voice profile |
| GET | `/voice-profiles` | List voice profiles |
| GET | `/voice-profiles/:id` | Get voice profile |

### Licenses

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/licenses` | Create license |
| GET | `/licenses` | List licenses |
| GET | `/licenses/:id` | Get license |

### Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/content/generate` | Generate content draft |
| GET | `/content` | List content items |
| GET | `/content/:id` | Get content item |
| POST | `/content/:id/approve` | Approve for publishing |
| POST | `/content/:id/publish` | Publish immediately |
| POST | `/content/:id/audio` | Generate audio |

### Ledger

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/ledger/settlement?month=YYYY-MM` | Get monthly settlement |
| GET | `/ledger/events` | List usage events |

## Domain Models

### Character
- Stores persona definition with name, bio, aliases
- Tone controls (allowed/forbidden tones)
- System prompt for AI generation
- Timeline state for memory/arc tracking

### VoiceProfile
- Provider integration (ELEVENLABS or NONE stub)
- Label and metadata for voice settings

### License (Off-chain Rights)
- Owner ID (wallet/org as string)
- Subject type (VOICE or CHARACTER)
- Consent flags for synthesis, training, commercial use
- License type (EXCLUSIVE, NON_EXCLUSIVE, REVSHARE)
- Royalty splits JSON

### ContentItem
- Platform targeting (X, TikTok, Instagram)
- Status workflow (DRAFT → APPROVED → PUBLISHED/FAILED)
- Scheduling support

### UsageEvent
- Event tracking for VOICE_SYNTHESIS and PUBLISH
- Revenue in cents for settlement calculations

## Package Responsibilities

### @lcos/canon
Character types and memory/timeline helpers for maintaining character state.

### @lcos/rights
License validation with `validateLicenseForAction(action, license)`:
- `SYNTHESIZE_VOICE` - Requires voice license with synthesis consent
- `TRAIN_VOICE` - Requires voice license with training consent
- `PUBLISH_CONTENT` - Requires commercial use permission

### @lcos/content
Content generation stub that returns deterministic placeholder text.
Platform-aware with character limits and styling.

### @lcos/voice
Audio generation with provider abstraction:
- **StubProvider**: Writes text placeholder, estimates duration
- **ElevenLabsProvider**: Real TTS integration (requires API key)

### @lcos/ledger
Usage tracking and settlement:
- `recordUsageEvent(data)` - Log usage
- `computeMonthlySettlement(month)` - Calculate royalty splits

### @lcos/social-connectors
Social platform publishing:
- **XConnector**: Stub returning fake URLs

## Publisher Worker

Background worker that:
1. Polls every 30 seconds
2. Finds APPROVED content with `scheduledFor <= now`
3. Publishes via social connectors
4. Logs usage events
5. Updates status (PUBLISHED or FAILED)

## Studio UI

Minimal Notion-like interface with:
- Characters list with create modal
- Character detail page with content generation
- Drafts table with approve/publish/audio actions
- Ledger settlement viewer

## Development

```bash
# Run all apps in dev mode
pnpm dev

# Build all packages
pnpm build

# Lint all packages
pnpm lint

# Format code
pnpm format

# Database commands
pnpm db:migrate    # Run migrations
pnpm db:seed       # Seed demo data
pnpm db:generate   # Regenerate Prisma client
```

## Extending

### Adding a new social connector

1. Create connector in `packages/social-connectors/src/connectors/`
2. Extend `SocialConnector` base class
3. Register in `SocialService` constructor

### Adding real LLM content generation

1. Update `packages/content/src/index.ts`
2. Replace stub with OpenAI/Anthropic/etc call
3. Use `buildContextPrompt()` from `@lcos/canon`

### Adding real voice synthesis

1. Configure `ELEVENLABS_API_KEY` in `.env`
2. Create voice profile with `providerVoiceId`
3. Audio generation will use ElevenLabs API

## License

Private - All rights reserved
