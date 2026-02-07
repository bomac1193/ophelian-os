# Glyph Iterations

## Overview

Developing a custom symbol system for THE TWELVE, drawing from African visual traditions rather than Greek mathematical notation.

## Visual Sources

### Adinkra (Akan/Ghana)
- Ideographic symbols encoding proverbs and concepts
- Bold, geometric, high contrast
- Each symbol carries philosophical weight
- Reference: [Adinkra Symbol Index](https://www.adinkra.org/)

### Veves (Haitian Vodou)
- Ritual drawings invoking Lwa/spirits
- Intricate linework, symmetrical, often radial
- Already connected to Orisha tradition through diaspora
- Cosmograms mapping spiritual geography

### Ron Eglash Fractals (African Fractal Geometry)
- Self-similar patterns in architecture, textiles, braiding
- Recursive structures encoding social/spiritual hierarchies
- Scaling patterns that work at multiple sizes
- Reference: *African Fractals* by Ron Eglash

### Nsibidi (Nigeria)
- Ideographic writing system (Ekoi/Ejagham peoples)
- Abstract, gestural, historically secretive
- Encodes concepts, narratives, social relationships
- Perfect for progressive disclosure aesthetic

---

## The Twelve Glyphs

### Genesis Phase (Fire/Creation)

#### F-9 ANVIL — Ògún
- **Domain:** Forge, structure, iron, creation through will
- **Current symbol:** λ ⬡
- **Visual direction:**
  - Hammer/anvil motif
  - Angular, industrial fractal
  - Adinkra reference: *Dwennimmen* (ram's horns - strength)
  - Sharp edges, downward force
- **Iterations:**
  1.
  2.
  3.

#### R-10 SCHISM — Ọya
- **Domain:** Storm, transformation, death, clearing
- **Current symbol:** Ψ ▲
- **Visual direction:**
  - Lightning/wind veve
  - Split/fractured form
  - Adinkra reference: *Akofena* (sword of war - courage)
  - Movement, diagonal energy
- **Iterations:**
  1.
  2.
  3.

---

### Vision Phase (Wood/Scouting)

#### S-0 KETH — Obàtálá
- **Domain:** Purity, creation from void, wholeness, standard
- **Current symbol:** Θ ○
- **Visual direction:**
  - Sun/radiating center
  - Pure white/empty space
  - Adinkra reference: *Adinkrahene* (chief of symbols - leadership)
  - Circular, emanating
- **Iterations:**
  1.
  2.
  3.

#### V-2 OMEN — Èṣù
- **Domain:** Crossroads, chaos, change, trickster
- **Current symbol:** Δ ×
- **Visual direction:**
  - X-form / crossroads
  - Branching paths
  - Veve reference: Papa Legba's crossroads veve
  - Adinkra reference: *Nkyinkyim* (twisting - initiative, dynamism)
- **Iterations:**
  1.
  2.
  3.

---

### Refinement Phase (Metal/Editing)

#### T-1 STRATA — Ọ̀rúnmìlà
- **Domain:** Fate, divination, wisdom, seeing layers
- **Current symbol:** ∞ ◇
- **Visual direction:**
  - Layered/stacked forms
  - Divination board pattern (Opon Ifá)
  - Fractal nesting - patterns within patterns
  - Adinkra reference: *Nyansapo* (wisdom knot)
- **Iterations:**
  1.
  2.
  3.

#### C-4 CULL — Ọ̀ṣọ́ọ̀sì
- **Domain:** Precision, hunting, focus, essential editing
- **Current symbol:** Ξ ▶
- **Visual direction:**
  - Arrow/bow motif
  - Single point of focus
  - Nsibidi: directional gesture
  - Adinkra reference: *Akoma* (heart - patience, focus)
- **Iterations:**
  1.
  2.
  3.

---

### Manifestation Phase (Earth/Driving)

#### L-3 SILT — Yemọja
- **Domain:** Nurture, ocean depths, mother, gestation
- **Current symbol:** Φ ●
- **Visual direction:**
  - Wave/water pattern
  - Containing vessel
  - Veve reference: La Sirene (mermaid, ocean mother)
  - Adinkra reference: *Akoko Nan* (hen's leg - nurturing)
- **Iterations:**
  1.
  2.
  3.

#### H-6 TOLL — Ṣàngó
- **Domain:** Justice, thunder, authority, advocacy
- **Current symbol:** Ω ■
- **Visual direction:**
  - Double-headed axe (Oshe Shango)
  - Thunder/lightning bolt
  - Vertical power, grounded authority
  - Adinkra reference: *Ohene Aniwa* (king's eye - vigilance)
- **Iterations:**
  1.
  2.
  3.

---

### Flow Phase (Water/Channeling)

#### N-5 LIMN — Ọ̀ṣun
- **Domain:** Beauty, attraction, river, fluidity
- **Current symbol:** Σ ≈
- **Visual direction:**
  - River/flowing water
  - Mirror/reflection
  - Veve reference: Erzulie's heart veve
  - Adinkra reference: *Sankofa* (return and retrieve - reflection)
- **Iterations:**
  1.
  2.
  3.

#### P-7 VAULT — Ọ̀sanyìn
- **Domain:** Medicine, cycles, herbs, restoration, archive
- **Current symbol:** Π +
- **Visual direction:**
  - Plant/leaf motif
  - Spiral growth pattern
  - Fractal branching (like a tree)
  - Adinkra reference: *Aya* (fern - endurance, resourcefulness)
- **Iterations:**
  1.
  2.
  3.

#### D-8 WICK — Olókun
- **Domain:** Deep ocean, secrets, unconscious, channel
- **Current symbol:** Γ ◆
- **Visual direction:**
  - Spiral descent
  - Depth/pressure
  - Nsibidi: water/depth concept
  - Adinkra reference: *Sesa Wo Suban* (transformation)
- **Iterations:**
  1.
  2.
  3.

#### NULL VOID — Babalú-Ayé
- **Domain:** Wounds, healing, transformation through suffering
- **Current symbol:** α ◎
- **Visual direction:**
  - Scarification pattern
  - Open/closed circle (wound/healed)
  - Textured surface (skin, earth)
  - Adinkra reference: *Owuo Atwedee* (ladder of death - mortality)
- **Iterations:**
  1.
  2.
  3.

---

## Design Constraints

### Technical Requirements
- Must work at 16x16px (favicon/small icon)
- Must work at 120x120px (card display)
- Must work at 512x512px (hero display)
- Single color (white on black, black on white)
- SVG format for scalability

### Aesthetic Requirements
- Cohesive family - recognizable as THE TWELVE
- Distinct from each other at small sizes
- Encode meaning through form
- Work with brutalist minimal aesthetic
- No gradients, single stroke weight

### Cultural Considerations
- Honor source traditions without appropriation
- Create new forms inspired by, not copied from
- Document influences transparently
- System is syncretic by design (Yoruba + Kabbalah + new)

---

## Implementation Notes

### File Structure
```
/public/glyphs/
  anvil.svg
  schism.svg
  keth.svg
  omen.svg
  strata.svg
  cull.svg
  silt.svg
  toll.svg
  limn.svg
  vault.svg
  wick.svg
  void.svg
```

### Component Updates Needed
- `SymbolicImprint.tsx` - render SVG instead of text character
- `SymbolLegend.tsx` - display new glyphs
- `symbol-mapping.ts` - update symbol type to reference SVG paths or components

---

## Iteration Log

| Date | Glyph | Notes |
|------|-------|-------|
| | | |

---

## References

- Eglash, Ron. *African Fractals: Modern Computing and Indigenous Design*. Rutgers University Press, 1999.
- Thompson, Robert Farris. *Flash of the Spirit*. Vintage, 1984.
- Nsibidi documentation: [nsibidi.org](https://nsibidi.org)
- Adinkra symbols: [adinkra.org](https://adinkra.org)
