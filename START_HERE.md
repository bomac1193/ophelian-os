# 🚀 Starting Bóveda

## Quick Start (Recommended)

```bash
cd /home/sphinxy/boveda
./start-boveda.sh
```

This script:
- Cleans up port conflicts automatically
- Starts API on port 3001
- Starts Studio on port 3100
- Shows real-time logs

**Access points:**
- Studio UI: http://localhost:3100
- API Server: http://localhost:3001
- API Key: `ophelian-dev-key-2026`

---

## Manual Start (Alternative)

If you prefer to run manually:

```bash
cd /home/sphinxy/boveda

# Clean up conflicting processes
lsof -ti:3001,3100 | xargs -r kill -9 2>/dev/null

# Start dev server
pnpm dev
```

---

## Testing the API

```bash
# Test health (no auth required)
curl http://localhost:3001/health

# Test characters endpoint (with auth)
curl -H "x-api-key: ophelian-dev-key-2026" http://localhost:3001/characters | jq '.'

# Test genome generation
curl -X POST -H "x-api-key: ophelian-dev-key-2026" \
  -H "Content-Type: application/json" \
  http://localhost:3001/genomes/generate | jq '.'
```

---

## Running the Stress Test

```bash
./stress-test.sh
```

This will test all endpoints and show you what's working.

---

## Current Project Status

✅ **COMPLETE:**
- Character genome system (Orisha/Kabbalah backend)
- Nexus relationship visualization
- Scenes & Globes (worldbuilding)
- Usage ledger & rights API
- Database with 14 characters

🔧 **IN PROGRESS:**
- Task #2: Infrastructure stability (cleanup script created)
- Biotech aesthetic system design (Task #17)
- Chromox visual generation integration (Task #18)

📋 **NEXT UP:**
- Task #3: Express Genome Creator (5-min onboarding)
- Task #7: LLM integration (Claude/GPT content generation)
- Task #5: Autonomous content suggester

---

## Blue Ocean Strategy Files

**Read these for full context:**

1. **Implementation Roadmap:**
   ```bash
   cat NEXT_MOVE_PLAN.md
   ```

2. **Biotech Aesthetic System:**
   ```bash
   cat BIOTECH_AESTHETIC_PLAN.md
   ```

3. **Task List:**
   ```bash
   /tasks
   ```

---

## Key Strategic Changes

### Before → After

**Positioning:**
- Before: "AI character platform with spiritual archetypes"
- After: "Biotech platform for sequencing living AI character genomes"

**Onboarding:**
- Before: 30-minute learning curve (explain Kabbalah/Orisha)
- After: 5-minute genome sequencing (mythology hidden in "Advanced View")

**Visual Identity:**
- Before: Text-only genomes, manual avatar creation
- After: Auto-generated visuals via Chromox AI integration

**Target Market:**
- Before: Spiritual/esoteric creatives
- After: Sci-fi creators, content creators, indie game devs, social media influencers

---

## Architecture Overview

```
boveda/
├── apps/
│   ├── api/              # Fastify REST API (port 3001)
│   ├── studio/           # Next.js UI (port 3100)
│   └── publisher-worker/ # Background job processor
├── packages/
│   ├── oripheon/         # Character generation engine
│   ├── canon/            # Character types & memory
│   ├── rights/           # License validation
│   ├── voice/            # Audio generation stubs
│   ├── content/          # Content generation stubs
│   ├── ledger/           # Usage tracking
│   └── social-connectors/# Platform publishing stubs
└── docs/
    ├── START_HERE.md           # This file
    ├── NEXT_MOVE_PLAN.md       # Full roadmap
    └── BIOTECH_AESTHETIC_PLAN.md # Frontend redesign

```

---

## Troubleshooting

**Port conflicts:**
```bash
# See what's using ports
lsof -i:3001
lsof -i:3100

# Kill specific port
lsof -ti:3001 | xargs kill -9
```

**Database issues:**
```bash
# Check database connection
psql -U sphinxy -d living_character_os -c "SELECT COUNT(*) FROM \"Character\";"

# Reset database (CAUTION: deletes data)
pnpm db:push
```

**Clean restart:**
```bash
# Kill all boveda processes
pkill -f "boveda.*turbo"
pkill -f "boveda.*tsx"
pkill -f "boveda.*next"

# Then restart
./start-boveda.sh
```

---

## Environment Variables

Key variables in `.env`:

```bash
# Database
DATABASE_URL="postgresql://sphinxy@localhost/living_character_os?host=/var/run/postgresql"

# API
API_URL="http://localhost:3001"
API_KEY="ophelian-dev-key-2026"

# Studio
NEXT_PUBLIC_API_URL="http://localhost:3001"
NEXT_PUBLIC_API_KEY="ophelian-dev-key-2026"

# Cloudinary (for images)
CLOUDINARY_CLOUD_NAME="..."
CLOUDINARY_API_KEY="..."
CLOUDINARY_API_SECRET="..."

# Optional: Voice & Content (stubs for now)
ELEVENLABS_API_KEY=""
ANTHROPIC_API_KEY=""  # Coming in Task #7
OPENAI_API_KEY=""     # Coming in Task #7
CHROMOX_API_KEY=""    # Coming in Task #18
```

---

## Next Steps

1. **Start the server:**
   ```bash
   ./start-boveda.sh
   ```

2. **Verify it works:**
   - Visit http://localhost:3100
   - Run `./stress-test.sh`

3. **Choose next task:**
   - Task #17: Biotech aesthetic (revolutionary but complex)
   - Task #3: Express creator (practical, immediate value)
   - Task #7: LLM integration (enables content generation)

4. **Review strategy:**
   - Read `BIOTECH_AESTHETIC_PLAN.md`
   - Read `NEXT_MOVE_PLAN.md`

---

**You're ready to launch!** 🚀
