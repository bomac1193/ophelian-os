# Action Plan - Bóveda (Living Character OS)

**Last Updated:** 2026-02-05
**Status:** Progressive Disclosure System Complete, Ready for Next Phase

---

## Current State

### ✅ Recently Completed (Task #17)

**Progressive Disclosure System** - Fully implemented and committed to GitHub
- Three-layer genome display system (Surface → Gateway → Depths)
- Symbol mapping library (∞, ♦, ◊, etc. → Orishas)
- React components:
  - `GenomeDisplay` - Main orchestrator
  - `SymbolicImprint` - L-class + symbols (Surface layer)
  - `GatewayTooltip` - Hover hints (Gateway layer)
  - `AdvancedView` - Full mythology (Depths layer, unlocked after 3 characters)
- Demo page live at `/genome-demo` (localhost:3100)
- Comprehensive documentation:
  - `DESIGN_PHILOSOPHY.md` - Strategic rationale & blue ocean positioning
  - `IMPLEMENTATION_SUMMARY.md` - Technical architecture
  - `INTEGRATION_STATUS.md` - Testing & next steps

### 🟢 System Health

**API Server** (localhost:3001)
- Running successfully with database connection
- All endpoints operational:
  - `/characters` - 200 OK
  - `/genomes` - 200 OK
  - `/scenes` - 200 OK
  - `/worlds` - 200 OK
  - `/relationships` - 200 OK
  - `/connections` - 200 OK
  - `/snapshots` - 200 OK

**Studio Frontend** (localhost:3100)
- Next.js 14 app running
- Characters page loading existing characters successfully
- Genome demo page functional at `/genome-demo`

**Development Environment**
- Turbo monorepo with pnpm workspaces
- TypeScript compilation working
- Environment variables configured (.env symlinked to apps/api)

---

## What Needs to Be Added

### 🎯 High Priority - UI Integration

#### 1. Integrate Progressive Disclosure into Existing Pages
**Goal:** Replace placeholder genome displays with the new system

**Pages to Update:**
- `/imprint/[id]` - Character detail page
  - Add `GenomeDisplay` component
  - Replace current genome visualization
  - Show symbolic imprint prominently

- `/characters` - Characters list page
  - Update `GenomeSummaryCard` to show symbolic imprints
  - Add L-class badge to each character card
  - Consider adding gateway hints on hover

- `/imprint/create` - Character creation flow
  - Show symbolic imprint preview as user selects Orishas
  - Display gateway hints to guide selection
  - Optionally show advanced view if user is eligible

**Technical Tasks:**
- [ ] Update character detail page to use `GenomeDisplay`
- [ ] Refactor `GenomeSummaryCard` component
- [ ] Add symbolic imprint to character creation preview
- [ ] Move inline styles to CSS modules for maintainability
- [ ] Add CSS transitions and animations for layer reveals

#### 2. Genome API Route Fixes
**Current Issue:** `/api/genome` endpoint needs attention

**Tasks:**
- [ ] Review and test genome creation endpoint
- [ ] Ensure proper error handling for missing data
- [ ] Add validation for Orisha configuration
- [ ] Return proper symbolic imprint data in API responses

### 🔄 Medium Priority - Feature Enhancements

#### 3. Advanced View Unlock System
**Goal:** Implement progression mechanics for depths layer

**Tasks:**
- [ ] Add user progress tracking (character count, account age)
- [ ] Implement unlock notification when user reaches 3 characters
- [ ] Add visual indicator showing progress toward unlock (e.g., "2/3 characters created")
- [ ] Create onboarding tooltip explaining the unlock system
- [ ] Consider gamification elements (badges, achievements)

#### 4. Symbol Library Expansion
**Goal:** Complete the symbol-to-Orisha mapping

**Tasks:**
- [ ] Review and finalize symbol assignments for all Orishas
- [ ] Add alternative symbols for visual variety
- [ ] Create symbol legend/guide in UI
- [ ] Document symbol meanings in user-facing help

#### 5. Gateway Layer Enhancement
**Goal:** Improve tooltip content and interactivity

**Tasks:**
- [ ] Write compelling gateway hints for all Orishas
- [ ] Add click-to-expand functionality for longer hints
- [ ] Implement keyboard navigation for tooltips
- [ ] A/B test different hint phrasings for curiosity optimization
- [ ] Add analytics to track which hints drive most engagement

### 📚 Low Priority - Documentation & Polish

#### 6. User Documentation
**Tasks:**
- [ ] Create user guide for understanding genome displays
- [ ] Add tooltips/help icons throughout the app
- [ ] Write blog post or help article about progressive disclosure system
- [ ] Create video walkthrough for onboarding

#### 7. Developer Experience
**Tasks:**
- [ ] Add Storybook stories for genome components
- [ ] Write unit tests for progressive disclosure logic
- [ ] Add visual regression tests for genome displays
- [ ] Document component API and usage patterns

#### 8. Performance Optimization
**Tasks:**
- [ ] Lazy load `AdvancedView` component
- [ ] Optimize re-renders in `GenomeDisplay`
- [ ] Add loading states and skeleton screens
- [ ] Implement caching for genome data

### 🚀 Future Enhancements

#### 9. Advanced Features (Post-MVP)
- **Comparative View:** Side-by-side genome comparison
- **Evolution Timeline:** Show how genome changes over character development
- **Social Sharing:** Generate shareable genome cards
- **Customization:** Allow users to choose preferred symbol sets
- **Interactive Mythology:** Click Sephira/Orisha for deep-dive articles
- **Genome Analytics:** Show rarity/uniqueness metrics

#### 10. Strategic Positioning
- **Market Differentiation:** Emphasize "accessible yet deep" positioning
- **Content Marketing:** Publish articles about progressive disclosure UX
- **Community Building:** Create Discord/forum for deep lore discussions
- **Partnerships:** Explore collaborations with spiritual/gaming communities

---

## Immediate Next Steps

### Recommended Order:
1. ✅ **Test the demo page** (`/genome-demo`) - COMPLETED: Demo page working
2. ✅ **Integrate into character detail page** - COMPLETED: Added to `/imprint/[id]` overview tab
3. ✅ **Update character cards** - COMPLETED: Added ImprintBadge to GenomeSummaryCard
4. **Implement unlock tracking** to complete the progression loop - IN PROGRESS
5. **Polish and optimize** based on user feedback

### Quick Wins:
- ✅ Add `GenomeDisplay` to one existing page (character detail) - DONE
- Write 5-10 compelling gateway hints - TODO
- Create CSS module to replace inline styles - TODO
- Add simple fade-in animations for layer reveals - TODO

---

## Technical Debt to Address

- **Inline Styles:** Move to CSS modules or styled-components
- **Type Safety:** Ensure all genome data properly typed
- **Error Handling:** Add fallbacks for missing/malformed data
- **Accessibility:** Add ARIA labels, keyboard navigation, screen reader support
- **Testing:** Add unit tests for progressive disclosure functions

---

## Success Metrics

### User Engagement:
- % of users who hover over symbols (gateway engagement)
- % of users who unlock advanced view
- Time spent viewing genome displays
- Character creation completion rate

### Business Goals:
- User retention after seeing advanced view
- Community discussion about lore/mythology
- Differentiation from competitors (qualitative feedback)

---

## Notes

- Progressive disclosure system is ready for production use
- All code committed to `main` branch (commit: 59f2712)
- Documentation comprehensive and up-to-date
- System is designed to scale with additional Orishas/features

**Key Insight:** This system allows Bóveda to be both accessible (Surface layer) AND deeply engaging (Depths layer) - a true blue ocean position that competitors can't easily replicate.
