# Corrected Integration & Aesthetic Plan

## **Key Clarifications from User**

### **1. Aesthetic: Clean + Symbolic (NOT Gothic)**

**What I Got Wrong:**
- ❌ Proposed overly mystical "grimoire" language
- ❌ Hexadecimal ciphers (0xBF7A)
- ❌ Redacted text (▓▓▓)
- ❌ "INITIATE CLEARANCE" locks

**What You Actually Want:**
- ✅ Keep current L-class system (L-3, L-7, etc.)
- ✅ Add mathematical symbols as visual markers (λ, Σ, Δ, Ω, Φ, ∞, Ψ, Θ, Ξ, Π)
- ✅ Add geometric primitives as icons (⬡, 〰️, ⚡, ♛, ●, ◇, ◆, ○, ▶, +)
- ✅ Clean, technical, accessible language
- ✅ Kabbalah/Orisha visible only in Admin view

---

### **2. Subtaste: Already Exists in Boveda**

**What's Already There:**
- ✅ `packages/oripheon/src/data/subtaste-data.ts`
- ✅ 12 Subtaste designations (S-0, T-1, T-2, etc.)
- ✅ Glyphs (KETH, STRATA, etc.)
- ✅ Creative phases (genesis, vision, refinement, manifestation, flow)
- ✅ Computed in character generation

**What's Missing from Slayt:**
- ❌ Onboarding quiz (3 questions, best/worst card selection)
- ❌ Training UI (BestWorstQuestion.jsx + QuizModal.jsx)
- ❌ genomeApi calls for quiz questions/submission

---

## **Corrected UI Design**

### **Frontend (Clean + Symbolic)**

```
┌────────────────────────────────────────────────────┐
│  CHARACTER GENOME                                  │
├────────────────────────────────────────────────────┤
│                                                    │
│  IMPRINT: λ-Architect          ⬡                  │
│  Classification: L-3 (Industrial Precision)        │
│  Primitive: Cube                                   │
│                                                    │
│  ┌──────────────────────────────────────────┐     │
│  │  STATE PROFILE                           │     │
│  ├──────────────────────────────────────────┤     │
│  │  Charge: +3        ████████░░            │     │
│  │  Stability: 72%    ███████░░░            │     │
│  │  Phase: Integration                      │     │
│  └──────────────────────────────────────────┘     │
│                                                    │
│  LATTICE POSITION                                  │
│  Node: 5 (Severity Axis)                          │
│  Shadow Node: 5-inverse                           │
│  Daath: Seeking                                   │
│                                                    │
│  SYMBOLIC MARKERS                                  │
│  ∞  λ  Δ  Φ                                       │
│                                                    │
│  [Show Full Archetype Data] ← Admin toggle        │
│                                                    │
└────────────────────────────────────────────────────┘
```

### **Backend/Admin View (When Toggled)**

```
┌────────────────────────────────────────────────────┐
│  FULL ARCHETYPE DATA                               │
├────────────────────────────────────────────────────┤
│                                                    │
│  ORISHA CONFIGURATION                              │
│  Head: Ògún (The Forge, War, Iron)                │
│  Camino: Ògún Alárà (The Mason King)              │
│  Secondary: Ṣàngó (40%), Èṣù (25%)                │
│                                                    │
│  KABBALISTIC POSITION                              │
│  Sephira: Geburah (5th Sephira)                   │
│  Meaning: Severity, Strength, Judgment            │
│  Pillar: Severity                                 │
│  Qliphoth: Golachab (Burning Bodies)              │
│                                                    │
│  CORRESPONDENCES                                   │
│  Tarot: Five of Wands                             │
│  Jung: Warrior                                    │
│  Norse: Thor                                      │
│  Element: Fire                                    │
│                                                    │
└────────────────────────────────────────────────────┘
```

**Key Differences:**
- Frontend: Minimal, symbolic, L-class notation
- Backend: Full mythology revealed for admins/power users
- NO overly mystical language on frontend
- Symbols are visual markers, not cryptic ciphers

---

## **Slayt Quiz Integration**

### **What to Import from Slayt**

**Components:**
```
/home/sphinxy/Slayt/client/src/components/genome/
├── BestWorstQuestion.jsx  ← Port to Boveda
└── QuizModal.jsx          ← Port to Boveda
```

**Functionality:**
1. **3-Question Quiz Flow**
   - User sees 3 questions
   - Each question has 4 cards
   - Pick BEST and WORST card from each question
   - Submit responses

2. **Best/Worst Card Selection**
   ```jsx
   // Each card has:
   {
     id: "card_1",
     label: "Strategic Planner",
     description: "Methodical, systems-thinking, long-term vision"
   }

   // User picks:
   { best: "card_1", worst: "card_3" }
   ```

3. **Training Loop**
   - Initial quiz: 3 questions → subtaste designation
   - Progressive: System learns from character creation choices
   - Honing mode: Re-quiz to refine profile

### **Integration Points**

**API Endpoints to Add:**
```typescript
// In Boveda API (Fastify)
GET  /api/onboarding/quiz-questions    // Get 3 questions
POST /api/onboarding/submit-quiz       // Submit responses
GET  /api/onboarding/taste-profile     // Get user's taste genome
```

**Database:**
```sql
-- Add to User model
tasteProfile: {
  subtaste: { code, glyph, label, description, phase },
  responses: Array<QuizResponse>,
  lastUpdated: DateTime
}
```

**UI Flow:**
```
1. New user signs up
2. "Complete your taste profile" prompt
3. QuizModal opens with 3 questions
4. User picks best/worst from cards
5. Submit → compute subtaste from responses
6. Map subtaste → suggested character archetypes
7. User creates characters influenced by their taste
```

---

## **Updated Task Priorities**

### **HIGHEST PRIORITY: Core Ecosystem**

**Task #19: Chromox Voice Integration**
- Connect local Chromox backend (port 8080)
- Voice synthesis for audio/video content
- Multi-provider: RVC, ElevenLabs, OpenAI, Kits AI

**Task #21: Slayt Quiz Onboarding** (REVISED)
- Port BestWorstQuestion + QuizModal from Slayt
- 3-question best/worst card selection
- Store taste profile in User model
- Map to existing subtaste-data in oripheon

**Task #7: Genome + Taste LLM Content**
- Claude/GPT integration
- Use character genome + creator taste profile
- Voice-matched content generation

### **AESTHETIC REFINEMENT:**

**Task #17: Clean Symbolic UI** (REVISED)
- Add symbol library (λ Σ Δ Ω Φ ∞ Ψ Θ Ξ Π)
- Add primitive icons (⬡ 〰️ ⚡ ♛ ● ◇ ◆ ○ ▶ +)
- Admin toggle for full archetype data
- Keep L-class system as is

### **AVATAR & RIGHTS:**

**Task #20: Sembla Avatar Integration**
- Connect Sembla (port 3000)
- Face-based avatars + consent tracking
- License token system

---

## **What's Already in Boveda (Don't Rebuild)**

✅ **Subtaste System:**
- 12 designations (S-0 through T-11)
- Creative phases
- Archetype mapping
- `packages/oripheon/src/data/subtaste-data.ts`

✅ **L-Class Aesthetic System:**
- Already referenced in code
- Just needs UI components with symbols

✅ **Character Genome:**
- Full Orisha/Kabbalah backend
- Multi-modal signatures
- System prompt generation

---

## **What to Port from Slayt**

🔄 **Quiz Onboarding Only:**
- BestWorstQuestion.jsx (UI component)
- QuizModal.jsx (flow logic)
- genomeApi quiz methods (adapt to Fastify)

**DO NOT port:**
- ❌ Full profiler package (subtaste already in Boveda)
- ❌ Slayt content scheduling (different scope)
- ❌ Slayt character generator (Boveda has oripheon)

---

## **Startup Commands**

```bash
# Terminal 1: Bóveda
cd /home/sphinxy/boveda
./start-boveda.sh
# API: 3001, Studio: 3100

# Terminal 2: Chromox (for voice)
cd /home/sphinxy/chromox/backend
npm run dev
# Backend: 8080

# Terminal 3: Sembla (for avatars)
cd /home/sphinxy/sembla
npm run dev
# App: 3000
```

---

## **Next Steps**

**Which task to start?**

1. **Task #21** - Import Slayt quiz (quick win, unblocks onboarding)
2. **Task #19** - Chromox voice (high impact for audio content)
3. **Task #7** - LLM content generation (immediate value)
4. **Task #17** - UI symbols (polish existing system)

**Recommendation: Start with Task #21** - it's the missing onboarding piece and will make the whole system feel complete.
