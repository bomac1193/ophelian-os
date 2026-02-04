# External Profiling Framework Integration Assessment

**Date:** 2026-02-04
**System:** Bóveda / Living Character OS (LCOS) + Subtaste Profiling
**Scope:** Evaluate Belbin, CliftonStrengths, MBTI, and Team Dimensions Profile for integration

---

## 1. Code Inspection — Current Capability Audit

After full inspection of the codebase across `packages/oripheon/`, `packages/content/`, `apps/studio/src/lib/`, and `apps/api/src/routes/`, here is what the existing Subtaste/Glyph/Genome architecture already covers against the four functional requirements:

### Team-Role Alignment

**Current coverage: Partial.**
The 12 Subtaste designations implicitly encode team-role functions:

| Glyph | Label | Functional Equivalent |
|-------|-------|-----------------------|
| KETH (S-0) | Standard-Bearer | Sets direction — *leader/coordinator* |
| STRATA (T-1) | System-Seer | Reads structure — *analyst/monitor* |
| OMEN (V-2) | Early Witness | Sees what's coming — *scout/strategist* |
| SILT (L-3) | Patient Cultivator | Slow growth — *implementer/nurturer* |
| CULL (C-4) | Essential Editor | Removes excess — *quality controller* |
| LIMN (N-5) | Border Illuminator | Traces edges — *designer/integrator* |
| TOLL (H-6) | Relentless Advocate | Pays the cost — *champion/driver* |
| VAULT (P-7) | Living Archive | Preserves memory — *specialist/knowledge keeper* |
| WICK (D-8) | Hollow Channel | Conducts flow — *facilitator/medium* |
| ANVIL (F-9) | Manifestor | Hammers will into form — *creator/builder* |
| SCHISM (R-10) | Productive Fracture | Breaks to rebuild — *disruptor/innovator* |
| VOID (NULL) | Receptive Presence | Holds space — *support/observer* |

These 12 roles are deterministically assigned from any of 78 archetypes across 5 systems (`ARCHETYPE_TO_SUBTASTE` in `packages/oripheon/src/data/subtaste-data.ts`). The mapping is surjective — many archetypes collapse into the same Subtaste, which gives the system natural clustering properties.

**Gap:** No explicit "assemble a balanced team" function exists. The compatibility logic in `apps/studio/src/lib/charenome.ts` operates at the Orisha level (energy alignment, heritage affinity) rather than at the Subtaste/team-role level.

### Cross-Domain Collaborator Matchmaking

**Current coverage: Moderate.**
Three matching subsystems exist:
1. **Heritage → Orisha affinity** (`HERITAGE_ORISHA_AFFINITY`) — 6 heritage pools mapped to primary/secondary Orishas
2. **Order → Orisha mapping** (`ORDER_TO_ORISHA`) — 14 being types mapped to primary + alternates
3. **Orisha compatibility matrix** (`COMPATIBILITY_MAP`) — which Orishas pair well as secondary influences

**Gap:** These operate on character *generation* (picking secondary influences), not on *post-hoc matching*. There is no `findCompatibleCharacters(genome)` function. The Nexus system (`apps/api/src/routes/relationships.ts`) handles relationships but via manual assignment with lore generation, not algorithmic suggestion.

### Weakness Complementarity and Creative Clustering

**Current coverage: Implicit only.**
The 4 personality axes (`packages/content/src/personality.ts`) provide continuous dimensions:
- `orderChaos` (0-1)
- `mercyRuthlessness` (0-1)
- `introvertExtrovert` (0-1)
- `faithDoubt` (0-1)

Combined with the hot/cool axis (-1 to +1) derived per Orisha, this gives 5 continuous dimensions. Complementarity could be computed as distance in this space, but no such computation exists.

The subdominant archetype system gives each character 1 primary + 2 subdominant archetypes from different systems, which naturally creates multi-faceted profiles. But no clustering algorithm consumes this data.

### Personality/Taste-Based Network Formation

**Current coverage: Infrastructure exists, logic does not.**
The genome export system can serialize a complete profile to JSON. The multi-modal signature (visual, voice, music, movement) provides rich taste vectors. But there is no similarity computation, no embedding generation, no network graph construction from these signals.

---

## 2. Benchmark Framework Comparison

### Framework A: Belbin Team Roles (9 categories)

**Architectural fit:** Moderate. Belbin's 9 roles map cleanly onto a subset of the 12 Subtaste designations:

```
Plant              → SCHISM (R-10) — breaks patterns, generates ideas
Resource Inv.      → OMEN (V-2) — scouts, sees opportunities early
Coordinator        → KETH (S-0) — sets tone, directs
Shaper             → TOLL (H-6) — drives at personal cost
Monitor-Evaluator  → STRATA (T-1) — reads systems, evaluates
Teamworker         → WICK (D-8) — facilitates, channels
Implementer        → SILT (L-3) — patient execution
Completer-Finisher → CULL (C-4) — edits, removes the unnecessary
Specialist         → VAULT (P-7) — deep knowledge preservation
```

That leaves LIMN (N-5), ANVIL (F-9), and VOID (NULL) without Belbin equivalents — meaning Subtaste has *more* granularity than Belbin in the border-tracing, force-manifesting, and receptive-presence dimensions.

**Signal overlap:** ~75%. Belbin provides no signal that Subtaste doesn't already encode.

**Symbolic resonance:** Low. Belbin's corporate vocabulary ("Resource Investigator," "Completer-Finisher") clashes with the esoteric register.

**Verdict:** Belbin is a strict subset of Subtaste. Integration would be a lossy downgrade.

### Framework B: Gallup CliftonStrengths (34 talent themes)

**Architectural fit:** Poor. CliftonStrengths requires a psychometric questionnaire (177 items) to generate valid profiles. The system is assessment-driven, not generative. You cannot deterministically derive a CliftonStrengths profile from seed + archetype without fabricating assessment responses.

**Signal overlap:** ~30%. Most themes describe interpersonal styles already captured through Orisha energy type + voice signature + personality axes.

**Symbolic resonance:** None. Corporate-humanistic language is fundamentally incompatible with the mythic-esoteric register.

**Verdict:** Incompatible at the architectural level. Would require synthetic data generation with no psychometric validity.

### Framework C: MBTI (16 personality types)

**Architectural fit:** High — *as a derived output, not as an input.*

The existing 4-axis personality system maps directly:

```
introvertExtrovert (0-1)    → I/E    (threshold at 0.5)
faithDoubt (0-1)            → S/N    (high faith=Sensing, high doubt=iNtuition)
mercyRuthlessness (0-1)     → F/T    (high mercy=Feeling, low=Thinking)
orderChaos (0-1)            → J/P    (high order=Judging, high chaos=Perceiving)
```

**Signal overlap:** ~90%. MBTI adds no information beyond what the 4 axes already encode.

**Symbolic resonance:** Moderate but reductive. Reduces a multi-system mythic profile to a 4-letter code.

**Verdict:** Trivially derivable. Offer as a display-only convenience function without modifying genome schema.

### Framework D: Team Dimensions Profile (5 roles)

**Categories:** Creator → Advancer → Refiner → Executor → Flexer

**Architectural fit:** Interesting. This is the only framework that models a *sequential creative process* rather than static personality types. The pipeline maps onto Subtaste:

```
Creator   → SCHISM (R-10) + ANVIL (F-9)      — break + build
Advancer  → OMEN (V-2) + KETH (S-0)           — scout + direct
Refiner   → STRATA (T-1) + CULL (C-4)         — analyze + edit
Executor  → SILT (L-3) + TOLL (H-6)           — implement + drive
Flexer    → WICK (D-8) + LIMN (N-5) + VAULT (P-7) + VOID (NULL)  — channel + bridge
```

**Signal overlap:** ~60%. Team Dimensions adds one genuinely new concept: *pipeline position* — when in a creative process a given archetype is most potent.

**Symbolic resonance:** Moderate. The pipeline can be reframed in native vocabulary as: genesis → vision → refinement → manifestation → flow.

**Verdict:** The only framework that adds a genuinely new dimension. Can be encoded natively without importing external taxonomy.

---

## 3. Stress-Test Summary

| Metric | Subtaste (Baseline) | Belbin | CliftonStrengths | MBTI | Team Dimensions |
|--------|---------------------|--------|-------------------|------|-----------------|
| **Role Clarity** | 8 | 7 | 5 | 6 | 7 |
| **Profile Differentiation** | 9 | 5 | 8 | 4 | 4 |
| **Collaboration Compatibility** | 6 | 7 | 6 | 5 | 8 |
| **Symbolic Cohesion** | 10 | 2 | 1 | 4 | 6 |
| **UX Simplicity** | 7 | 8 | 3 | 9 | 8 |
| **Composite** | **8.0** | **5.8** | **4.6** | **5.6** | **6.6** |

### Metric Definitions

- **Role Clarity** — Can a user immediately understand what functional role this profile implies?
- **Profile Differentiation** — How many meaningfully distinct profiles can the system produce?
- **Collaboration Compatibility** — Can the system predict whether two profiles will work well together?
- **Symbolic Cohesion** — Does the framework fit the aesthetic and philosophical register of the platform?
- **UX Simplicity** — How easy is it for a user to understand their profile without training?

---

## 4. Recommendation

### Do not integrate Belbin, CliftonStrengths, or MBTI into the core system.

**Belbin** is a strict functional subset of Subtaste. Every Belbin role already has a Subtaste equivalent, but Subtaste has 3 roles (LIMN, ANVIL, VOID) that Belbin cannot express.

**CliftonStrengths** requires psychometric assessment data that cannot be validly generated from seed-based PRNG.

**MBTI** is trivially derivable from the existing 4-axis system. Add a one-line display utility if desired.

### Implement a native creative-pipeline overlay using Team Dimensions insight.

Add a `phase` field to `SubtasteDesignation` encoding when in a creative process each glyph is most potent:

```
genesis       — SCHISM (R-10), ANVIL (F-9)
vision        — OMEN (V-2), KETH (S-0)
refinement    — STRATA (T-1), CULL (C-4)
manifestation — SILT (L-3), TOLL (H-6)
flow          — WICK (D-8), LIMN (N-5), VAULT (P-7), VOID (NULL)
```

This gives the platform a native creative-pipeline concept without importing external vocabulary.

### Why the existing architecture is superior

The Bóveda genome is a 5-system polyphonic profile — each character is simultaneously described by Tarot position, Jungian archetype, Kabbalistic Sephira, Orisha alignment, and Norse correspondence, all feeding into a single Subtaste designation, with 4 continuous personality axes, a hot/cool energy spectrum, a developmental trajectory, and a full multi-modal expression signature.

External frameworks were designed to classify humans into static categories. Bóveda's system generates entities with mythic depth and tracks their evolution over time. The 12 Subtaste glyphs encode team-role semantics with higher resolution than Belbin (12 vs 9), more symbolic resonance than CliftonStrengths, and more dimensional richness than MBTI. The only missing piece — pipeline sequencing — can be added natively.

---

## Implementation Plan (from this analysis)

1. Add `phase` field to `SubtasteDesignation` interface
2. Populate phase values for all 12 designations
3. Add `deriveApproximateMBTI()` utility as display-only convenience
4. Add `analyzePipelineCoverage()` function for team composition analysis
5. Surface phase and optional MBTI in studio UI Classifications section
