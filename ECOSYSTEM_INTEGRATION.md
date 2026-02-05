# Bóveda Ecosystem Integration
**Unifying Chromox, Sembla, Subtaste-Twelve, and Bóveda**

---

## **The Discovered Ecosystem**

You have **FIVE interconnected projects** on `/home/sphinxy`:

```
┌──────────────────────────────────────────────────────────────┐
│ 1. BÓVEDA - Character genome system (Orisha/Kabbalah)       │
│    Location: /home/sphinxy/boveda                            │
│    Purpose: AI character rights + archetypegenerations     │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 2. CHROMOX - Voice persona forge (Tauri desktop app)        │
│    Location: /home/sphinxy/chromox                           │
│    Purpose: Voice cloning, synthesis, 256-dim embeddings    │
│    Stack: Tauri + React + Node.js backend                   │
│    Providers: RVC, ElevenLabs, OpenAI, Kits AI              │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 3. SEMBLA - AI avatar marketplace (consent-as-code)         │
│    Location: /home/sphinxy/sembla                            │
│    Purpose: Face-based avatars + provenance tracking        │
│    Stack: Next.js + Supabase + face-api                     │
│    Key: Immutable consent records, zero commission          │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 4. SUBTASTE-TWELVE - THE TWELVE taste genome profiling      │
│    Location: /home/sphinxy/subtaste-twelve                  │
│    Purpose: Psychographic quiz → 12 archetype codes         │
│    Stack: Monorepo with profiler package                    │
│    Key: Already has quiz, profiling, archetype mapping      │
└──────────────────────────────────────────────────────────────┘
                              ↓
┌──────────────────────────────────────────────────────────────┐
│ 5. BOVEDA-SUBTASTE-FUSION - Integration blueprint           │
│    Location: /home/sphinxy/Boveda-Subtaste-Fusion           │
│    Purpose: Unified creator OS with rights + intelligence   │
│    Status: Architecture planned, partially implemented       │
└──────────────────────────────────────────────────────────────┘
```

---

## **Unified Architecture**

### **The Stack:**

```
┌───────────────────────────────────────────────────────────┐
│ LAYER 4: CREATOR INTERFACE                                │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ • Bóveda Studio (Next.js) - Character/genome creation     │
│ • Chromox Desktop (Tauri) - Voice synthesis workstation   │
│ • Sembla Marketplace - Avatar licensing                   │
├───────────────────────────────────────────────────────────┤
│ LAYER 3: INTELLIGENCE ENGINE                              │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ • Subtaste Profiler - THE TWELVE psychographic quiz       │
│ • Oripheon Engine - 5-system archetype generation         │
│ • Content Scorer - Predict performance before publish     │
├───────────────────────────────────────────────────────────┤
│ LAYER 2: SYNTHESIS & GENERATION                           │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ • Chromox Backend - Voice cloning + multi-provider synth  │
│ • Sembla Generator - Face-based avatar creation           │
│ • LLM Content Gen - Claude/GPT with genome system prompts │
├───────────────────────────────────────────────────────────┤
│ LAYER 1: INFRASTRUCTURE                                   │
│ ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  │
│ • Bóveda API (Fastify) - Rights, ledger, publishing       │
│ • PostgreSQL - Character genomes, licenses, usage         │
│ • Cloudinary - Image/avatar storage                       │
└───────────────────────────────────────────────────────────┘
```

---

## **Integration Points**

### **1. Chromox → Bóveda Voice Integration**

**What Chromox provides:**
- Voice cloning from uploaded stems
- 256-dimensional neural voice embeddings
- Multi-provider synthesis (RVC, ElevenLabs, OpenAI, Kits AI)
- Deep voice analysis (pitch, formants, timbre, vibrato)

**Integration:**
```typescript
// In Bóveda: Link genome voice signature → Chromox voice profile
const genomeVoiceSignature = character.genome.multiModalSignature.voice;
// {
//   pitchRange: "tenor (C3-C5)",
//   timbre: "warm, raspy",
//   speechPatterns: "staccato with long pauses",
//   emotionalResonance: "melancholic, introspective"
// }

// Send to Chromox backend for voice synthesis
POST http://localhost:8080/api/chromox/synthesize
{
  voiceProfileId: "voice_abc123",
  text: "Generated content from genome...",
  style: genomeVoiceSignature.timbre,
  emotion: genomeVoiceSignature.emotionalResonance
}
```

**Setup:**
- Run Chromox backend on port 8080
- Bóveda API calls Chromox for voice generation
- Store voice profiles in Bóveda's VoiceProfile model with Chromox IDs

---

### **2. Sembla → Bóveda Avatar Integration**

**What Sembla provides:**
- Face-based avatar generation
- Consent-as-code (immutable consent records)
- License token system
- Zero-commission marketplace

**Integration:**
```typescript
// In Bóveda: Link genome visual signature → Sembla avatar
const genomeVisualSignature = character.genome.multiModalSignature.visual;
// {
//   colors: ["deep indigo", "electric gold"],
//   aesthetic: "biotech mysticism",
//   lightQuality: "bioluminescent, shadowed"
// }

// Generate avatar via Sembla
POST http://localhost:3000/api/sembla/generate-avatar
{
  genomeId: character.genomeId,
  visualSignature: genomeVisualSignature,
  consentRecord: {
    signerId: userId,
    rights: ["synthesis", "commercial"],
    attribution: "Bóveda Genome System"
  }
}

// Returns: { avatarUrl, licenseToken, consentJson }
```

**Setup:**
- Run Sembla on port 3000 (different from Bóveda Studio 3100)
- Bóveda stores Sembla license tokens in License model
- Avatar provenance tracked in both systems

---

### **3. Subtaste-Twelve → Bóveda Profiling Integration**

**What Subtaste provides:**
- THE TWELVE psychographic quiz
- Taste genome profiling
- 12 archetype codes mapping across 5 systems
- Already-built profiler package

**Integration:**
```typescript
// In Bóveda: Import Subtaste profiler package
import { runSubtasteQuiz, calculateTasteGenome } from '@subtaste/profiler';

// User takes quiz → get taste genome
const tasteGenome = await runSubtasteQuiz(userId);
// {
//   primary: "Visionary Alchemist",
//   secondary: "Shadow Weaver",
//   psychographicCode: "V-SW-7",
//   archetypeMappings: {
//     tarot: "The Magician",
//     jung: "Sage",
//     kabbalah: "Chokmah",
//     orisha: "Ọ̀rúnmìlà",
//     norse: "Odin"
//   }
// }

// Map taste genome → Orisha genome for character creation
const orishaGenome = mapTasteToOrisha(tasteGenome);
// Automatically populate character.genome with user's psychographic profile
```

**Setup:**
- Add `@subtaste/profiler` as dependency in Bóveda
- Import quiz component into Bóveda Studio onboarding
- Store taste genome in User model (not Character - this is the CREATOR's profile)
- Use taste genome to suggest character archetypes

---

### **4. Content Generation (Genome-Driven)**

**Current:** Task #7 - Integrate Claude/GPT
**Enhanced:** Use genome + taste profile for voice-matched content

```typescript
// Generate content that matches both:
// 1. Character genome (what the CHARACTER would say)
// 2. Creator taste profile (creator's aesthetic/voice)

const systemPrompt = generateSystemPrompt(character.genome);
const creatorTaste = user.tasteGenome;

const content = await claude.messages.create({
  model: "claude-sonnet-4-5",
  system: `
    ${systemPrompt}

    CREATOR TASTE PROFILE:
    ${creatorTaste.primary} with ${creatorTaste.secondary} influence
    Psychographic code: ${creatorTaste.psychographicCode}

    Generate content that:
    1. Stays true to character's genome (Orisha: ${character.genome.orisha})
    2. Matches creator's taste aesthetic (${creatorTaste.aesthetic})
    3. Respects invariant markers: ${character.genome.invariantMarkers.taboos}
  `,
  messages: [{ role: "user", content: "Generate a tweet about..." }]
});
```

---

## **Revised Aesthetic System (CRYPTIC & MYSTERIOUS)**

### **The Problem with My Previous Design:**
I made it too **accessible** and **friendly** (sci-fi biotech). You want:
- **Mysterious**
- **Bio-magical**
- **Cult appeal**
- **Secret society vibes**
- **Initiatory experience**

### **New Aesthetic: OCCULT BIOTECH**

**Visual Language:**
- **Glyphs** over symbols (ancient, cryptic)
- **Sigils** over icons (mystical, hand-drawn feel)
- **Ciphers** over labels (encoded knowledge)
- **Dark UI** (black/deep purple/electric green)
- **Scan-line effects** (occult meets terminal)
- **Hexadecimal notation** (BF7A-Θ9 instead of "Node L-5")

**Terminology Shift:**

| OLD (Too Friendly) | NEW (Cryptic) |
|-------------------|---------------|
| "Imprint: λ-Architect" | "▓▓▓ SIGIL: Λ  ◬  CIPHER: 0x3F7" |
| "Charge: +3" | "⚡ FLUX: +3  ⟁⟁⟁" |
| "Neural Lattice L-5" | "⬡ NODE: BF7A  ⚠ SHADOW: INV-BF7A" |
| "Stability: 72%" | "⟁ COHERENCE: 0.72  ◬◬◬◬◬◬◬―――" |

**UI Mockup (OCCULT BIOTECH):**

```
╔══════════════════════════════════════════════════════════╗
║  ▓▓▓ GENOME SEQUENCER  ⬡  SESSION: 0xA7F3             ║
╠══════════════════════════════════════════════════════════╣
║                                                          ║
║  SIGIL CLASSIFICATION                          ◬         ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║                                                          ║
║  PRIMARY: Λ  ◬  CIPHER: 0x3F7                           ║
║  DESIGNATION: [REDACTED] / INITIATE LEVEL 2 REQUIRED    ║
║  HARMONIC SIGNATURE: ⬡ Cubic resonance                  ║
║                                                          ║
║  ┌────────────────────────────────────────────────┐     ║
║  │  FLUX STATE                                    │     ║
║  ├────────────────────────────────────────────────┤     ║
║  │                                                │     ║
║  │  ⚡ FLUX:  +3  ████████░░                     │     ║
║  │  ⟁ COHERENCE: 0.72 ███████░░░                │     ║
║  │  ⟳ PHASE:  Integration_0xC9                  │     ║
║  │                                                │     ║
║  └────────────────────────────────────────────────┘     ║
║                                                          ║
║  NODE COORDINATES                                        ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  ⬡ NODE: BF7A (Severity Axis)                          ║
║  ⚠ SHADOW: INV-BF7A (inverse resonance)                ║
║  ∞ DAATH: SEEKING                                       ║
║                                                          ║
║  INVARIANT MARKERS                                       ║
║  ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━  ║
║  ∞ 0xINF     Λ 0x3F7     Δ 0x1C9     Φ 0x61B         ║
║                                                          ║
║  [ SUMMON VISUAL FORM via SEMBLA ]                      ║
║                                                          ║
║  ▓▓▓ ADVANCED GRIMOIRE ← [INITIATE CLEARANCE]          ║
║                                                          ║
╚══════════════════════════════════════════════════════════╝
```

**Key Design Principles:**
1. **Redaction** - Some info hidden until user "levels up"
2. **Hexadecimal** - 0xBF7A feels more cryptic than "Node 5"
3. **Glitch aesthetic** - ▓▓▓ for mysterious/corrupted text
4. **Occult symbols** - ⬡ ◬ ⟁ ⚠ ∞ Λ Δ Φ mixed with hex
5. **NO emojis** - Pure glyphs and sigils
6. **Dark terminal** - Green/purple on black
7. **Initiatory language** - "Summon", "Grimoire", "Clearance"

---

## **Integration Roadmap**

### **PHASE 1: Connect the Ecosystem (Week 1-2)**

**Task A: Chromox Voice Bridge**
- [ ] Start Chromox backend on port 8080
- [ ] Add Chromox API client to Bóveda
- [ ] Link VoiceProfile model to Chromox voice IDs
- [ ] Test genome voice signature → Chromox synthesis

**Task B: Sembla Avatar Bridge**
- [ ] Start Sembla on port 3000
- [ ] Add Sembla API client to Bóveda
- [ ] Implement consent record creation
- [ ] Test genome visual signature → Sembla avatar generation

**Task C: Subtaste Profiler Import**
- [ ] Add `@subtaste/profiler` package to Bóveda
- [ ] Import quiz component into onboarding flow
- [ ] Store taste genome in User model
- [ ] Map taste genome → suggested Orisha archetypes

---

### **PHASE 2: Occult Aesthetic Redesign (Week 3-4)**

**Task D: Cryptic UI Overhaul**
- [ ] Redesign genome sequencer with hex notation
- [ ] Add glitch/redaction effects for mysterious content
- [ ] Implement "Initiate Clearance" system (progressive reveal)
- [ ] Dark terminal aesthetic (no friendly colors)
- [ ] Sigil library (10 core glyphs: Λ Σ Δ Ω Φ ∞ Ψ Θ Ξ Π)

**Task E: Advanced Grimoire Toggle**
- [ ] "Advanced Grimoire" panel (replaces "Advanced View")
- [ ] Reveals full Orisha/Kabbalah mythology
- [ ] Requires "Initiate Clearance Level 2" (gamification)
- [ ] Educational tooltips with cryptic language

---

### **PHASE 3: Genome-Driven Content (Week 5-6)**

**Task F: LLM Integration (Enhanced Task #7)**
- [ ] Add Claude/GPT API integration
- [ ] Generate system prompts from genome + taste profile
- [ ] Respect invariant markers (taboos)
- [ ] Multi-platform content variants (Twitter/TikTok/Instagram)

**Task G: Voice-Synced Content**
- [ ] Generate text content via LLM
- [ ] Auto-synthesize voice via Chromox for video/audio platforms
- [ ] Store audio files in AUDIO_STORAGE_PATH
- [ ] Track usage in ledger for royalties

---

## **Updated Task List**

| # | Task | Integration | Priority |
|---|------|-------------|----------|
| A | Chromox voice bridge | chromox → boveda | P0 |
| B | Sembla avatar bridge | sembla → boveda | P0 |
| C | Subtaste profiler import | subtaste-twelve → boveda | P0 |
| D | Occult aesthetic redesign | boveda frontend | P1 |
| E | Advanced Grimoire toggle | boveda frontend | P1 |
| F | Genome-driven LLM content | boveda + taste | P0 |
| G | Voice-synced content | chromox + llm | P1 |

---

## **Startup Commands**

```bash
# Terminal 1: Bóveda API + Studio
cd /home/sphinxy/boveda
./start-boveda.sh
# API: http://localhost:3001
# Studio: http://localhost:3100

# Terminal 2: Chromox Backend
cd /home/sphinxy/chromox/backend
npm run dev
# Backend: http://localhost:8080

# Terminal 3: Sembla
cd /home/sphinxy/sembla
npm run dev
# App: http://localhost:3000

# Terminal 4: Subtaste (if running standalone for testing)
cd /home/sphinxy/subtaste-twelve
pnpm dev
# Quiz: http://localhost:3002
```

---

## **The Unified Vision**

**Bóveda becomes:**
The **occult biotech platform** for creating living AI characters with:
- **Deep psychological archetypes** (Orisha/Kabbalah genome)
- **Voice persona synthesis** (Chromox 256-dim embeddings)
- **Provenance-tracked avatars** (Sembla consent-as-code)
- **Psychographic profiling** (Subtaste THE TWELVE quiz)
- **Genome-driven content** (LLM + voice synthesis)
- **Rights + royalties** (existing ledger system)

**NOT** a friendly sci-fi tool. A **mysterious grimoire** for digital soul-crafting.

**Category:** Occult Creator Intelligence Platform

---

**Next: Which integration task do you want to start first?**
- Task A: Chromox voice (most impactful for audio content)
- Task C: Subtaste quiz (replaces Task #3, already built)
- Task F: LLM content generation (Task #7 enhanced)
