---
name: Premium Student Productivity
colors:
  surface: '#fdf7ff'
  surface-dim: '#ded8e0'
  surface-bright: '#fdf7ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f8f2fa'
  surface-container: '#f2ecf4'
  surface-container-high: '#ece6ee'
  surface-container-highest: '#e6e0e9'
  on-surface: '#1d1b20'
  on-surface-variant: '#494551'
  inverse-surface: '#322f35'
  inverse-on-surface: '#f5eff7'
  outline: '#7a7582'
  outline-variant: '#cbc4d2'
  surface-tint: '#6750a4'
  primary: '#4f378a'
  on-primary: '#ffffff'
  primary-container: '#6750a4'
  on-primary-container: '#e0d2ff'
  inverse-primary: '#cfbcff'
  secondary: '#63597c'
  on-secondary: '#ffffff'
  secondary-container: '#e1d4fd'
  on-secondary-container: '#645a7d'
  tertiary: '#765b00'
  on-tertiary: '#ffffff'
  tertiary-container: '#c9a74d'
  on-tertiary-container: '#503d00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e9ddff'
  primary-fixed-dim: '#cfbcff'
  on-primary-fixed: '#22005d'
  on-primary-fixed-variant: '#4f378a'
  secondary-fixed: '#e9ddff'
  secondary-fixed-dim: '#cdc0e9'
  on-secondary-fixed: '#1f1635'
  on-secondary-fixed-variant: '#4b4263'
  tertiary-fixed: '#ffdf93'
  tertiary-fixed-dim: '#e7c365'
  on-tertiary-fixed: '#241a00'
  on-tertiary-fixed-variant: '#594400'
  background: '#fdf7ff'
  on-background: '#1d1b20'
  surface-variant: '#e6e0e9'
typography:
  display:
    fontFamily: Plus Jakarta Sans
    fontSize: 48px
    fontWeight: '700'
    lineHeight: '1.1'
    letterSpacing: -0.02em
  headline-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: '1.2'
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '500'
    lineHeight: '1'
  headline-lg-mobile:
    fontFamily: Plus Jakarta Sans
    fontSize: 28px
    fontWeight: '600'
    lineHeight: '1.2'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-gap: 12px
  section-gap: 64px
---

## Brand & Style
The design system is centered on a "Sophisticated Focus" aesthetic. It balances the structured utility of a productivity tool with the soft, inviting nature of a lifestyle app. The visual language blends **Minimalism** with **Glassmorphism**, utilizing translucent layers and vibrant blurs to create depth without clutter. 

The target audience consists of students who seek a premium, high-performance environment that reduces academic anxiety. The emotional response should be one of "effortless organization"—making complex academic workloads feel manageable through generous whitespace, soft gradients, and a gentle tactile feel inspired by modern desktop operating systems.

## Colors
The color strategy employs a serene, cool-toned foundation to promote concentration. The **Primary Gradient** is reserved for high-impact actions, active states, and progress indicators, providing a youthful energy against the sterile academic backdrop.

The **Background** is not a flat white but a very subtle vertical gradient that mimics natural light. **Accents** are used sparingly for semantic signaling: Emerald for completed milestones, Sky Blue for helpful information, Amber for upcoming deadlines, and Rose for high-priority tasks or missed windows. Text contrast adheres to high accessibility standards, using deep slate tones instead of pure black to maintain the "soft" visual profile.

## Typography
The typography system uses **Plus Jakarta Sans** for headlines to inject a modern, friendly personality with its slightly rounded terminals. For body copy and functional UI elements, **Inter** provides maximum legibility and a systematic feel.

Hierarchy is established through weight and scale rather than color. Large display titles use tight letter spacing for a premium "editorial" look. Labels and metadata use a slightly increased letter spacing to ensure clarity at small sizes.

## Layout & Spacing
This design system utilizes a **fluid grid** model with generous margins to create a sense of "air" and focus. On desktop, a 12-column grid is used with large 24px gutters. Elements are often centered or grouped in the middle 8 columns to prevent eye strain.

**Spacing Rhythm:**
- **Mobile:** 4-column grid, 16px side margins.
- **Tablet:** 8-column grid, 24px side margins.
- **Desktop:** 12-column grid, 40px+ side margins for a centered content experience.

Whitespace is treated as a first-class functional element to separate distinct subject areas or task lists without the need for heavy dividers.

## Elevation & Depth
Depth is achieved through a combination of **Glassmorphism** and **Ambient Shadows**. 

1.  **Level 0 (Base):** The light background gradient.
2.  **Level 1 (Cards):** Pure white surfaces with a "deep" shadow (Blur: 40px, Y-Offset: 12px, Opacity: 4% Indigo-tinted). 
3.  **Level 2 (Modals/Popovers):** Glassmorphism effect. White background at 70% opacity with a 20px backdrop blur and a 1px semi-transparent white border to catch "light" at the edges.
4.  **Interactive States:** Elements "lift" slightly on hover by increasing the shadow spread and reducing the Y-offset, mimicking physical movement.

## Shapes
The shape language is exceptionally soft to counteract the stress of productivity. Standard UI components (buttons, small inputs) use **rounded-xl (0.75rem)**. Primary containers, cards, and large dashboard modules use **2xl (1.5rem)** or **3xl (2rem)** to create a friendly, "squishy" aesthetic.

Progress bars and status chips should always use **full pill-rounding** to distinguish them from structural layout containers.

## Components
- **Buttons:** Primary buttons use the Indigo-Purple gradient with white text and a soft shadow. Secondary buttons use a subtle "Glass" style (white 40% opacity, 1px border).
- **Cards:** White or translucent with `radius-2xl`. No heavy borders; use shadows or background contrast for definition.
- **Deadline Chips:** Small pill-shaped badges. High priority uses the Rose accent with 10% opacity background and 100% opacity text.
- **Progress Bars:** Thick (8px+) tracks with a soft grey background and the Primary Gradient for the fill. Fill ends are always rounded.
- **Inputs:** Minimalist with a soft grey background that turns white with a primary-colored glow on focus.
- **Icons:** 24px grid, 1.5pt line weight, rounded caps and joins. Avoid filled icons unless indicating an "active" navigation state.
- **Priority Badges:** Small dots or subtle text labels using the semantic accent colors (Emerald/Amber/Rose) to categorize tasks without overwhelming the view.