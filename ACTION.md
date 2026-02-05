# Action Plan - Bóveda (Living Character OS)

**Last Updated:** 2026-02-05
**Status:** Visual Polish Complete, Multi-Type Riddle System Live, All Emojis Removed

---

## Current State

### ✅ Recently Completed (Tasks #22, #23, #24)

**Progressive Disclosure System - Fully Integrated**
- Three-layer genome display system (Surface → Gateway → Depths)
- Symbol mapping library (∞, ♦, ◊, etc. → Orishas)
- React components:
  - `GenomeDisplay` - Main orchestrator
  - `SymbolicImprint` - L-class + symbols (Surface layer)
  - `GatewayTooltip` - Hover hints (Gateway layer)
  - `AdvancedView` - Full mythology (Depths layer, unlocked after 3 characters)
- **INTEGRATED:** Progressive disclosure now live on imprint pages
  - `/imprint/[id]` - Shows three-layer display with collapsible details
  - `/imprint` - Character cards show symbolic imprints
  - Symbolic imprints visible in Character Oripheon Status section
- Demo page live at `/genome-demo` (localhost:3100)

**Genome Sync System - Fixed and Verified**
- All 14 characters now have genomes (was 12/14 with errors)
- Fixed 'caminos' undefined error (removed invalid Aganjú mapping)
- Created comprehensive `genome-stress-test.sh` script
- `/genomes/sync-all` endpoint working perfectly
- Stress test results: 14/14 characters, 8/8 relics, 0 errors, 9ms response time

**UI Improvements**
- Relics separated from regular characters in dedicated section
- **Removed ALL emojis from interface:**
  - Removed 4 emojis from MultiModalPreview component (🎨, 🎤, 🎵, 💃)
  - Replaced emoji-like Unicode in symbolic primitives:
    - Ọ̀ṣun: '〰️' → '≈' (approximately equal - flow)
    - Èṣù: '⚡' → '×' (multiplication - threshold)
    - Ṣàngó: '♛' → '■' (filled square - sovereignty)
- Symbolic imprints displayed consistently across all character views

**Interactive Puzzle System (New!)**
- Replaced simple expandable with riddle-based authentication for deep genome mysteries
- Dynamic riddles generated from genome properties (Orisha sacred numbers, Sephira names)
- Hint system unlocks after 2 failed attempts
- Smooth animations: fade-in, slide-down, shake on error, shimmer effects
- Gateway hints guide users to discover answers
- Makes knowledge discovery engaging and aligned with mysterious aesthetic

**Enhanced Character Creation Flow (New!)**
- Live symbolic imprint preview during creation
- Real-time updates as users select Orisha/Sephira/Psychology
- Shows Surface layer (L-class + symbol) and Gateway hints immediately
- Auto-generates preview genome when selections change
- Educates users about symbolic meaning while they create

**Visual Polish & CSS Refactoring (Latest Session)**
- **CSS Modules Migration:**
  - GenomeSummaryCard: 200+ lines of inline styles → CSS module
  - MultiModalPreview: 300+ lines of inline styles → CSS module
  - Total: 500+ lines converted for better maintainability
- **Page Load Animations:**
  - Card fade-in-up on mount (0.3s)
  - Symbolic imprint fade-in with 0.1s delay
  - Staggered section animations (0.05s-0.2s delays)
  - All animations use ease-out timing
- **Refined Hover States:**
  - Cards: lift (-2px) + shadow on hover
  - Buttons: background color + lift (-1px)
  - Color swatches: scale (1.1x) + enhanced shadow
  - Section cards: lift (-2px) + shadow
  - Chips: lift (-1px) + subtle color change
- **Smooth Transitions:**
  - All interactive elements: 0.2s ease transitions
  - Consistent timing across all components

**Multi-Type Riddle System (Latest Session)**
- **5 Riddle Types:**
  1. Sacred Number (easy) - Orisha numerology
  2. Element (medium) - Natural correspondences
  3. Sephira (hard) - Kabbalistic tree
  4. Camino (medium) - Orisha path names
  5. Color Count (easy) - Palette analysis
- **Difficulty System:**
  - Color-coded badges (green/orange/red)
  - Easy: Numbers and colors
  - Medium: Elements and paths
  - Hard: Mystical correspondences
- **Smart Features:**
  - Random riddle selection per genome
  - Case-insensitive validation
  - Dynamic hints based on riddle type
  - 50+ unique riddle variations

**Three-Layer System Properly Aligned (Latest Session)**
- **Layer 1 (Surface):** Symbolic imprint always visible on all cards
- **Layer 2 (Gateway):** Basic details (Orisha/Sephira/trajectory) via simple expand on list cards
- **Layer 3 (Depths):** Full mythology unlocked via puzzle on detail pages only
- **Removed:** 4th layer confusion - puzzles no longer block basic info
- **UX Benefit:** Casual users get quick access, engaged users earn deep wisdom

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

### 🎯 High Priority - Polish & Refinement

#### 1. Visual Polish (Partially Complete)
**Goal:** Improve aesthetics and code maintainability

**Completed:**
- ✅ CSS transitions and animations for puzzle unlock
- ✅ Smooth fade-in for details reveal
- ✅ Hover effects and shimmer effects on buttons
- ✅ Shake animation for error states
- ✅ Live preview animations in creation flow
- ✅ Move inline styles to CSS modules
  - GenomeSummaryCard.tsx → GenomeSummaryCard.module.css
  - MultiModalPreview.tsx → MultiModalPreview.module.css
  - 500+ lines of inline styles converted to maintainable CSS
- ✅ Add page load animations for symbolic imprints
  - Card fade-in-up on mount
  - Staggered section animations (0.05s-0.2s delays)
  - Symbolic imprint display fade-in with delay
- ✅ Refine hover states across all components
  - Cards: lift + shadow effect
  - Buttons: background + lift
  - Color swatches: scale + enhanced shadow
  - Sections: lift + shadow
  - Chips: subtle lift + color change

**Remaining:**
- [ ] Consider adding sound effects for puzzle unlocks (optional)

#### 2. Additional Riddle Types ✅ COMPLETE
**Goal:** Expand puzzle variety

**Completed:**
- ✅ Add more riddle variations for each Orisha
  - 5 riddle types: sacred_number, element, sephira, camino, color_count
  - Random selection provides variety on each page load
- ✅ Create riddles based on Caminos (paths)
  - 8 camino riddles with keyword hints
- ✅ Add difficulty levels (easy/medium/hard)
  - Easy: sacred numbers, color counts
  - Medium: elements, caminos
  - Hard: Sephira correspondences
  - Color-coded badges (green/orange/red)
- ✅ Case-insensitive answer validation
- ✅ Dynamic hints based on riddle type

**Future Enhancements:**
- [ ] Consider adding image-based puzzles for visual learners
- [ ] Track user solve times for analytics
- [ ] Add more camino variations (currently 8, could expand to 20+)

### 🔄 Medium Priority - Feature Enhancements

#### 3. Advanced View Unlock System ✅ COMPLETE
**Goal:** Implement progression mechanics for depths layer

**Completed:**
- ✅ Add user progress tracking (genome count, account age)
  - localStorage-based tracking (MVP)
  - Automatic count increment on genome creation
- ✅ Implement unlock notification when user reaches 3 genomes
  - Celebration modal with smooth animations
  - "Sacred Knowledge Unlocked!" messaging
- ✅ Add visual indicator showing progress toward unlock
  - Progress bars with shimmer animation
  - "X/3 genomes" and "X/7 days" displays
  - Real-time progress updates
- ✅ Unlock celebration and badge system
  - Modal celebration on first unlock
  - "Advanced View Unlocked" badge thereafter
  - Smooth animations (fadeIn, slideUp, scale)

**Future Enhancements:**
- [ ] Replace localStorage with backend API for persistence
- [ ] Add cross-device progress sync
- [ ] Create onboarding tooltip explaining the unlock system
- [ ] Consider additional gamification (badges, achievements)

#### 4. Symbol Library Expansion
**Goal:** Complete the symbol-to-Orisha mapping

**Tasks:**
- [ ] Review and finalize symbol assignments for all Orishas
- [ ] Add alternative symbols for visual variety
- [ ] Create symbol legend/guide in UI
- [ ] Document symbol meanings in user-facing help

#### 5. Gateway Layer Enhancement ✅ COMPLETE
**Goal:** Improve tooltip content and interactivity

**Completed:**
- ✅ Write compelling gateway hints for all 10 Orishas
  - Poetic short hints ("The forge burns eternal...")
  - 100+ word expanded narratives for each
  - Sacred correspondences (element, day, number, colors)
  - Actionable character insights
- ✅ Add click-to-expand functionality
  - Hover shows short hint + keywords
  - Click expands to full content
  - Smooth animations (fadeIn, expandHeight)
- ✅ Implement keyboard navigation
  - Tab to focus, Enter/Space to expand
  - Escape to close, click outside to dismiss
  - Full accessibility support
- ✅ Glass-morphism visual design
  - Frosted glass backdrop-filter effect
  - Animated gradient titles with shimmer
  - Sacred correspondences grid layout
  - Actionable insight callout boxes

**Future Enhancements:**
- [ ] A/B test different hint phrasings for curiosity optimization
- [ ] Add analytics to track which hints drive most engagement
- [ ] Add sound effects on expand (optional)

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
