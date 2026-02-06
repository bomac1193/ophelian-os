# Boveda Design System V2
## High Fashion Minimalist Brutalism

**Aesthetic Formula:**
Chanel (timeless elegance) + Apple (functional luxury) + Disney (character magic) + Brutalism (bold structure)

---

## Typography Hierarchy

### Display/Hero: **Didot** (Fashion Editorial)
**Purpose:** Ultra-luxury, high-contrast serif for major headlines
**Characteristics:**
- High contrast between thick and thin strokes
- Used by Vogue, Harper's Bazaar, Chanel
- Conveys prestige, sophistication, timelessness
- Uncompromising elegance

**Usage:**
- Page titles (H1): 72-96px, weight 400 (thin stroke beauty)
- Major headings: 48-64px, weight 400
- Pull quotes: 36px, weight 400, italic

**Fallback:** `'Didot', 'Bodoni Moda', 'Playfair Display', serif`

### Headers: **Cormorant Garamond** (Accessible Luxury)
**Purpose:** Classic serif for section headers and subheadings
**Characteristics:**
- Garamond family, optimized for screens
- Refined but readable
- Literary, sophisticated, trustworthy
- More accessible than Didot for smaller sizes

**Usage:**
- Section headers (H2): 32-48px, weight 500-600
- Card titles (H3): 20-28px, weight 600
- Feature labels: 16-18px, weight 600

**Fallback:** `'Cormorant Garamond', 'Garamond', 'Georgia', serif`

### UI Elements: **Futura** (Geometric Precision)
**Purpose:** Modernist sans for buttons, labels, metadata
**Characteristics:**
- Pure geometric construction
- Used by Apple, Louis Vuitton, Volkswagen
- Timeless modernism
- Clean, precise, functional

**Usage:**
- Buttons: 14-16px, weight 500-700, uppercase, letter-spacing 0.1em
- Labels/Tags: 11-13px, weight 500, uppercase, letter-spacing 0.12em
- Stats/Numbers: 40-80px, weight 700

**Fallback:** `'Futura', 'Century Gothic', 'Avenir', sans-serif`

### Body Text: **System Sans** (Apple Minimalism)
**Purpose:** Maximum readability, native performance
**Characteristics:**
- OS-native fonts (SF Pro on Mac, Segoe on Windows)
- Invisible design - doesn't call attention to itself
- Optimized for each platform

**Usage:**
- Body text: 16-18px, weight 400, line-height 1.7
- Descriptions: 15px, weight 400, line-height 1.6
- Small text: 13-14px, weight 400

**Stack:** `-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`

---

## Color Palette: Brutalist Monochrome

### Primary Scale (Black & White)
```css
--pure-black: #000000;        /* Chanel black - headers, icons */
--rich-black: #0A0A0A;        /* Backgrounds (dark mode) */
--charcoal: #1A1A1A;          /* Cards, surfaces */
--smoke: #F8F8F8;             /* Backgrounds (light mode) */
--pure-white: #FFFFFF;        /* Text on dark, surfaces */
```

### Accent (Minimal, Strategic)
```css
--accent-gold: #D4AF37;       /* Chanel gold - premium highlights */
--accent-silver: #C0C0C0;     /* Subtle hover states */
--accent-red: #DC143C;        /* CTAs, urgency (Dior red) */
```

### Semantic
```css
--success: #2D7A3E;           /* Muted green */
--warning: #8B6914;           /* Muted gold */
--error: #8B2635;             /* Muted red */
```

---

## Layout Principles

### 1. Brutalist Grid
- Strict 12-column grid
- Mathematical spacing (8px base unit)
- Asymmetric layouts
- Bold, unapologetic structure

### 2. Apple White Space
- Generous margins (80-120px page margins)
- Element spacing: 40-80px between major sections
- Breathing room = luxury

### 3. Chanel Minimalism
- Remove all unnecessary elements
- One accent color per screen maximum
- Black, white, and one statement element
- "Luxury is refusal"

### 4. Disney Character Focus
- Content is the hero (voices, characters)
- UI recedes into background
- Magical micro-interactions
- Warm, inviting despite minimalism

---

## Component Patterns

### Hero Section
```
[Thin Didot 96px]
Professional Voice Talent

[Garamond 48px, muted]
For AI Characters

[Futura 13px, uppercase, tracked]
INDUSTRY-FIRST MARKETPLACE
```

### Cards
- Pure white or pure black backgrounds
- No borders (use shadows for elevation)
- Single hairline dividers (1px, 10% opacity)
- Hover: subtle scale (1.02) + shadow depth

### Buttons
- **Primary**: Black background, white Futura text, uppercase
- **Secondary**: 1px black border, black Futura text, uppercase
- **Tertiary**: Text only, Futura, underline on hover
- No rounded corners on buttons (brutalist)
- Generous padding (16px 32px minimum)

### Typography Scale
```
Display: 96px / 72px / 64px (Didot)
H1: 48px (Garamond)
H2: 32px (Garamond)
H3: 24px (Garamond)
H4: 20px (Garamond)
Body: 18px (System)
Small: 14px (System)
Tiny: 12px (Futura, uppercase)
```

---

## Iconography

### Style
- Line icons only (no filled)
- 1.5px stroke weight
- Minimal detail
- Pure geometric shapes where possible

### Usage
- Icons are decorative only (not semantic)
- Always paired with text labels
- Size: 24px standard, 32px for features

---

## Motion & Animation

### Principles
- Subtle, precise (Apple-like)
- Ease curves: cubic-bezier(0.4, 0.0, 0.2, 1)
- Duration: 200-400ms maximum
- Purpose: feedback, not decoration

### Interactions
- Hover: lift + shadow (4-8px translate)
- Click: subtle scale down (0.98)
- Transitions: opacity, transform (never color)

---

## Responsive Strategy

### Breakpoints
- Desktop: 1440px+
- Laptop: 1024-1439px
- Tablet: 768-1023px
- Mobile: <768px

### Mobile Adaptations
- Didot size reduces 30-40%
- Maintain white space proportions
- Single column layouts
- Touch targets: 44px minimum

---

## Implementation Guidelines

### Font Loading
```html
<!-- Google Fonts -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&display=swap">

<!-- Adobe Fonts (for Didot alternative: Bodoni Moda) -->
<link href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700;800&display=swap">

<!-- Futura alternative: Outfit -->
<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&display=swap">
```

### CSS Architecture
```css
:root {
  /* Typography */
  --font-display: 'Bodoni Moda', 'Didot', serif;
  --font-heading: 'Cormorant Garamond', 'Garamond', serif;
  --font-ui: 'Outfit', 'Futura', sans-serif;
  --font-body: -apple-system, BlinkMacSystemFont, sans-serif;

  /* Spacing (8px base) */
  --space-xs: 8px;
  --space-sm: 16px;
  --space-md: 24px;
  --space-lg: 32px;
  --space-xl: 48px;
  --space-2xl: 64px;
  --space-3xl: 96px;
}
```

---

## Inspiration References

### Chanel
- Extreme minimalism
- Black and white dominance
- Timeless, not trendy
- Quality materials (analogy: premium fonts)

### Apple
- Functional luxury
- White space as a feature
- Precision alignment
- System fonts for body (invisible design)

### Brutalism
- Bold, unapologetic structure
- High contrast
- Asymmetric grids
- No decoration for decoration's sake

### Disney
- Character-focused
- Warm despite minimalism
- Magical moments (subtle animations)
- Approachable luxury

---

## Brand Voice

### Tone
- **Authoritative** (not arrogant): "The voice marketplace"
- **Refined** (not stuffy): "Professional talent, fairly compensated"
- **Clear** (not cold): "70% to artists, every time"
- **Magical** (not childish): "Your character, brought to life"

### Writing Style
- Short sentences
- Active voice
- No jargon
- No emojis (use typography for emphasis)
- Italics for subtle emphasis
- Uppercase Futura for labels/metadata

---

## Success Metrics

**User Perception:**
- "This is the most sophisticated marketplace I've seen"
- "Finally, AI that looks like it respects creators"
- "This feels like a luxury experience"

**Design Quality:**
- Typography hierarchy instantly clear
- Zero visual clutter
- Premium feel without pretension
- Timeless aesthetic (won't look dated in 5 years)
