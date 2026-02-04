# Expansion Strategy

## Current State Assessment

Boveda is a **web-only character creation studio** built as a Turbo monorepo with:

- **apps/studio**: Next.js 15 frontend — character generation, imprint system, charenome pipeline
- **apps/api**: Hono backend with Drizzle ORM + SQLite
- **packages/oripheon**: Decoupled generation engine — archetypes, subtaste classification, symbolic profiling

The system generates culturally-rich characters with aligned Orisha/Sephira/camino mappings, multi-modal signatures (visual, voice, music, movement), and symbolic profiling. The alignment system is deterministic and stress-tested (2000/2000 pass rate).

**What exists**: Character generation, imprint pipeline, subtaste classification, profile analysis/comparison, web UI.

**What does not exist**: Mobile app, geolocation, AR, multiplayer, marketplace, real-time interactions, rarity/scarcity systems, blockchain/NFT integration.

---

## Market Research

### Pokemon Go

| Metric | Value |
|--------|-------|
| Lifetime revenue | $8 billion+ |
| Annual revenue (2024) | ~$545 million |
| Peak annual revenue | $1.2 billion (2016) |
| Monthly active users (peak) | 232 million (2016) |
| Monthly active users (2024) | ~80 million |
| Acquisition price (Scopely) | $3.5 billion (2025) |
| Time to build | 2+ years, team of 200+ |
| Key tech | Google Maps API, AR camera, server infrastructure |

**Key takeaway**: Revenue has declined ~50% from peak but the IP (Pokemon) carries the product. Niantic's other location-based games (Harry Potter, NBA, Peridot) all underperformed or shut down — proving location-based gaming is IP-dependent, not mechanic-dependent.

### Steal a Brainrot

| Metric | Value |
|--------|-------|
| Monthly revenue | ~$11 million |
| Peak concurrent users | 25.8 million |
| Platform | Roblox (zero infrastructure cost) |
| Development model | Small team, rapid iteration |
| Core mechanic | 8-tier rarity system with scarcity-driven collecting |
| Player motivation | Rarity chasing, trading, social status |

**Key takeaway**: Built on Roblox's existing infrastructure and player base. Zero server costs, zero app store friction. Proves that scarcity + collecting + social status drives engagement without needing location tech or AR.

### Market Size (TAM)

| Segment | 2024 | 2030 (projected) | CAGR |
|---------|------|-------------------|------|
| Location-based gaming | $6.2B | $23-26B | 21-28% |
| AR gaming | $14.2B | $90-142B | 35-46% |
| Digital collectibles | $11.3B | $48-54B | 27-30% |
| Mobile gaming (total) | $98B | $140B+ | 6-8% |

---

## Value Assessment

### Features That Add Value

1. **Rarity/scarcity system for character archetypes** — The existing subtaste classification (F-9 ANVIL, G-2 SPARK, etc.) already creates natural rarity tiers. Some combinations are statistically rarer than others. This is inherent value, not excess.

2. **Profile comparison and compatibility** — `compareProfiles` already enables social dynamics (mirror/complement/friction/parallel). This drives trading and collecting motivation.

3. **Multi-modal signatures as collectible identity** — Visual color palettes, voice signatures, and music signatures make each character feel unique and displayable. This is the "show off" factor that drives Steal a Brainrot engagement.

4. **Cultural depth as differentiation** — Orisha/Sephira/Tarot alignment gives the system a mythological weight that generic character generators lack. This is the IP equivalent — the lore.

### Features That Are Excess (For Now)

1. **Blockchain/NFTs** — Adds friction (wallet setup, gas fees, crypto onboarding), alienates mainstream audience, and provides no gameplay benefit that a standard database can't handle. Digital scarcity works fine with server-side rarity controls.

2. **Full AR implementation** — Requires camera permissions, ARKit/ARCore integration, 3D model pipeline, and significant mobile development. High cost, marginal engagement lift over simpler approaches.

3. **Full location-based mechanics (GPS tracking)** — Requires continuous GPS polling, map licensing, server-side geofencing, battery optimization, and offline handling. Pokemon Go spent years and hundreds of millions on this. The mechanic itself doesn't retain players — the IP does.

4. **IoT hardware integration** — Physical devices add manufacturing, distribution, and support costs. Premature until digital product-market fit is proven.

---

## Expansion Paths

### Path A: Roblox-First (Lowest Risk)

Build a Roblox experience using the Oripheon engine as a backend API.

**What this looks like:**
- Players discover and collect character archetypes in a Roblox world
- Rarity tiers based on subtaste designation (some archetypes are harder to find)
- Trading between players using Roblox's built-in economy
- Character imprints displayed as visual avatars/auras
- Social spaces where players compare profiles

**Advantages:**
- Zero infrastructure cost (Roblox handles servers, payments, matchmaking)
- Access to 70M+ daily active users
- Built-in economy and trading system
- Rapid iteration cycle
- Steal a Brainrot proves the model works on this platform

**Disadvantages:**
- Roblox takes 75% revenue cut (developer gets ~25%)
- Limited visual fidelity
- Platform dependency
- Younger demographic skew

**Estimated scope:** Roblox Luau client + HTTP calls to Oripheon API. Small team feasible.

### Path B: Web Collectible Platform (Medium Risk)

Expand the current studio into a social collecting platform.

**What this looks like:**
- Public profiles showing character collections
- Rarity tiers with limited "drops" (time-gated generation windows)
- Leaderboards for collection completeness
- Profile comparison as a social feature
- Trading/gifting between users
- Daily/weekly generation limits creating scarcity

**Advantages:**
- Builds on existing codebase (Next.js, Oripheon)
- No mobile development required
- Full revenue control
- Can iterate quickly on web

**Disadvantages:**
- Must drive own traffic (no built-in marketplace)
- Web-only limits casual engagement
- Needs authentication and social features built from scratch

**Estimated scope:** Moderate — auth, social features, rarity system, trading backend.

### Path C: Full Mobile App (Highest Risk, Highest Ceiling)

Native mobile app with simplified location-based discovery.

**What this looks like:**
- Lightweight location triggers (city/neighborhood level, not GPS tracking)
- Characters appear in different zones based on cultural archetypes
- Camera-based "reveal" mechanic (point camera at landmark to discover)
- Collection, trading, social profiles
- Push notifications for nearby discoveries

**Advantages:**
- Highest engagement potential
- Push notifications drive retention
- Camera mechanic feels magical without full AR complexity
- Location adds real-world exploration motivation

**Disadvantages:**
- Requires iOS + Android development (React Native or native)
- Location services require battery optimization, permissions handling
- App store review process and 30% cut
- Significant infrastructure for geolocation services

**Estimated scope:** Large — mobile development, backend geolocation, push infrastructure.

---

## Multi-App Strategy

The key architectural advantage is **Oripheon as a standalone generation engine**. This enables a hub-and-spoke model:

```
                    Oripheon API
                   (generation engine)
                         |
            +------------+------------+
            |            |            |
         Studio      Roblox        Mobile
       (creation)   (collecting)   (discovery)
```

### How This Works

1. **Oripheon** becomes a REST/GraphQL API service that any client can call
2. **Studio** remains the creation/design tool for deep character work
3. **Roblox experience** handles social collecting and trading
4. **Mobile app** (future) adds location-based discovery
5. All share the same character database, rarity pools, and generation rules

### Revenue Model Per Platform

| Platform | Model | Take Rate |
|----------|-------|-----------|
| Studio (web) | Subscription for unlimited generation | 100% (Stripe) |
| Roblox | In-experience purchases (Robux) | ~25% after Roblox cut |
| Mobile | IAP for generation tokens + discovery boosts | ~70% after App Store cut |

### Shared Systems

- **Rarity engine**: Server-side control of how many of each subtaste/tier exist globally
- **Profile database**: Characters are cross-platform — generate on Studio, display on Roblox
- **Event system**: Time-limited drops, seasonal archetypes, cultural calendar events
- **Trading ledger**: Server-authoritative ownership tracking (no blockchain needed)

---

## Recommended Sequence

1. **Now**: Ship the current Studio as a polished web product. Validate that people care about character generation and imprint depth.

2. **Validation**: Add rarity tiers and collection mechanics to Studio (Path B lite). Measure engagement — do users come back? Do they share? Do they want to trade?

3. **Scale**: If engagement validates, build the Roblox experience (Path A) to access a massive existing audience with minimal infrastructure investment.

4. **Expand**: If Roblox proves the collecting/trading model, invest in the mobile app (Path C) for the premium experience with location-based discovery.

Each step de-risks the next. No step requires blockchain, and each generates revenue independently.

---

## Key Risks

| Risk | Mitigation |
|------|------------|
| No existing IP/brand recognition | Cultural depth (Orisha/Tarot/Sephira) serves as pseudo-IP; lean into mythology |
| Platform dependency (Roblox) | Web platform runs independently; Roblox is additive |
| Character generation feels "random" | Alignment system ensures coherent, meaningful results (stress-tested) |
| Scarcity feels artificial | Tie rarity to real mythological significance, not just numbers |
| Competition from established studios | Start niche (Afro-Caribbean mythology), expand from cultural authority position |
