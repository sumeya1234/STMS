---
name: Academic Clarity
colors:
  surface: '#f8f9ff'
  surface-dim: '#cbdbf5'
  surface-bright: '#f8f9ff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#eff4ff'
  surface-container: '#e5eeff'
  surface-container-high: '#dce9ff'
  surface-container-highest: '#d3e4fe'
  on-surface: '#0b1c30'
  on-surface-variant: '#3c4a42'
  inverse-surface: '#213145'
  inverse-on-surface: '#eaf1ff'
  outline: '#6c7a71'
  outline-variant: '#bbcabf'
  surface-tint: '#006c49'
  primary: '#006c49'
  on-primary: '#ffffff'
  primary-container: '#10b981'
  on-primary-container: '#00422b'
  inverse-primary: '#4edea3'
  secondary: '#2b6954'
  on-secondary: '#ffffff'
  secondary-container: '#adedd3'
  on-secondary-container: '#306d58'
  tertiary: '#a43a3a'
  on-tertiary: '#ffffff'
  tertiary-container: '#fc7c78'
  on-tertiary-container: '#711419'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#6ffbbe'
  primary-fixed-dim: '#4edea3'
  on-primary-fixed: '#002113'
  on-primary-fixed-variant: '#005236'
  secondary-fixed: '#b0f0d6'
  secondary-fixed-dim: '#95d3ba'
  on-secondary-fixed: '#002117'
  on-secondary-fixed-variant: '#0b513d'
  tertiary-fixed: '#ffdad7'
  tertiary-fixed-dim: '#ffb3af'
  on-tertiary-fixed: '#410005'
  on-tertiary-fixed-variant: '#842225'
  background: '#f8f9ff'
  on-background: '#0b1c30'
  surface-variant: '#d3e4fe'
typography:
  h1:
    fontFamily: Plus Jakarta Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontFamily: Plus Jakarta Sans
    fontSize: 30px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontFamily: Plus Jakarta Sans
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontFamily: Plus Jakarta Sans
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontFamily: Plus Jakarta Sans
    fontSize: 14px
    fontWeight: '500'
    lineHeight: '1.2'
  button:
    fontFamily: Plus Jakarta Sans
    fontSize: 15px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.01em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 40px
  container-max: 1280px
  gutter: 24px
---

## Brand & Style

The design system is centered on "Academic Clarity"—a visual philosophy that prioritizes focus, precision, and intellectual growth. It targets researchers, students, and educators who require an environment free from distraction but rich in functional depth. 

The aesthetic style is **Minimalist-Modern**. It leverages significant whitespace and a restricted color palette to reduce cognitive load. By shifting from Indigo to Emerald Green, the system moves toward a theme of organic growth and "go" signals, while maintaining a professional, disciplined structure. The UI should feel like a premium digital workspace: light, airy, and intentional.

## Colors

This design system utilizes **Emerald Green (#10B981)** as the singular high-energy accent. This color is reserved strictly for primary actions, active navigation indicators, and success states to ensure it remains a powerful meaningful signal.

- **Primary:** Emerald Green (#10B981) for interactive prominence.
- **Secondary:** Deep Emerald (#064E3B) for dark mode accents or high-contrast text elements.
- **Neutrals:** A range of Slate grays (#64748B) to handle secondary text and borders, ensuring the green pops against a sophisticated backdrop.
- **Functional:** Standardized reds for errors and ambers for warnings, but always subordinate to the primary emerald.

In **Dark Mode**, the emerald maintains its hex value but is often paired with lower-opacity backgrounds (10-20%) to create glowing active states without overwhelming the user's vision.

## Typography

The system exclusively uses **Plus Jakarta Sans** to achieve a modern, approachable, and highly readable academic environment. Its slightly wider apertures and geometric foundations provide the "Academic Clarity" required for long-form reading and complex data management.

Headlines use tighter letter-spacing and heavier weights to anchor pages. Body text is set with generous line heights (1.6) to ensure maximum legibility during research sessions. Emerald Green is used sparingly in typography, reserved for links or active breadcrumb segments.

## Layout & Spacing

The design system employs a **Fixed Grid** model for desktop experiences to maintain a disciplined "page-like" feel, transitioning to a fluid model for mobile. 

A strict 4px baseline grid governs all spacing. Vertical rhythm is maintained by using 16px (md) and 24px (lg) increments for component separation. Page margins are set to 40px on desktop to provide a "frame" for the content, enhancing the sense of focus.

## Elevation & Depth

To maintain a clean and flat "academic" aesthetic, depth is primarily communicated through **Tonal Layers** and **Low-Contrast Outlines** rather than heavy shadows.

- **Surface Levels:** The base background is the lowest level. Content cards sit on a "Level 1" surface, distinguished by a subtle 1px border (#E2E8F0 in light mode).
- **Shadows:** When necessary (e.g., dropdowns or modals), use a single, highly diffused "Ambient Shadow" with 0% offset, 15px blur, and 5% opacity.
- **Active State:** Interactive elements do not lift; instead, they utilize an Emerald Green inner-glow or a solid color fill to indicate focus.

## Shapes

The shape language is defined by **Soft Geometricism**. A standard corner radius of **8px (0.5rem)** is applied to all primary UI elements including buttons, input fields, and cards. This radius strikes a balance between the precision of a sharp corner and the friendliness of a full round.

For smaller elements like tags or checkboxes, a 4px radius is used. Large containers or "paper" sheets may scale up to 12px to emphasize their role as primary content holders.

## Components

- **Buttons:** Primary buttons are solid Emerald Green (#10B981) with white text. Secondary buttons use a ghost style with an Emerald Green border and text. All buttons feature an 8px radius.
- **Navigation:** Active states in sidebars or top-navs are indicated by a 4px vertical Emerald Green bar and a 10% opacity Emerald background tint.
- **Inputs:** Standardized 8px rounded corners. Focus states transition the border color from light gray to Emerald Green with a 2px outer ring.
- **Chips/Tags:** Used for academic subjects or status. They feature a 4px radius and utilize the secondary color palette (pale green background with deep green text).
- **Cards:** White or dark slate backgrounds with an 8px radius and a subtle 1px border. No shadows are used for static cards.
- **Progress Indicators:** Linear bars use Emerald Green for completion, contrasting against a light gray track.