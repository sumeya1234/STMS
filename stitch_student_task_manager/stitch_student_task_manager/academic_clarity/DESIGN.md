---
name: Academic Clarity
colors:
  surface: '#f8f9fa'
  surface-dim: '#d9dadb'
  surface-bright: '#f8f9fa'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f3f4f5'
  surface-container: '#edeeef'
  surface-container-high: '#e7e8e9'
  surface-container-highest: '#e1e3e4'
  on-surface: '#191c1d'
  on-surface-variant: '#464554'
  inverse-surface: '#2e3132'
  inverse-on-surface: '#f0f1f2'
  outline: '#767586'
  outline-variant: '#c7c4d7'
  surface-tint: '#494bd6'
  primary: '#4648d4'
  on-primary: '#ffffff'
  primary-container: '#6063ee'
  on-primary-container: '#fffbff'
  inverse-primary: '#c0c1ff'
  secondary: '#516162'
  on-secondary: '#ffffff'
  secondary-container: '#d4e6e7'
  on-secondary-container: '#576769'
  tertiary: '#904900'
  on-tertiary: '#ffffff'
  tertiary-container: '#b55d00'
  on-tertiary-container: '#fffbff'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#e1e0ff'
  primary-fixed-dim: '#c0c1ff'
  on-primary-fixed: '#07006c'
  on-primary-fixed-variant: '#2f2ebe'
  secondary-fixed: '#d4e6e7'
  secondary-fixed-dim: '#b8cacb'
  on-secondary-fixed: '#0e1e1f'
  on-secondary-fixed-variant: '#394a4b'
  tertiary-fixed: '#ffdcc5'
  tertiary-fixed-dim: '#ffb783'
  on-tertiary-fixed: '#301400'
  on-tertiary-fixed-variant: '#703700'
  background: '#f8f9fa'
  on-background: '#191c1d'
  surface-variant: '#e1e3e4'
typography:
  h1:
    fontSize: 32px
    fontWeight: '700'
    lineHeight: '1.2'
    letterSpacing: -0.02em
  h2:
    fontSize: 24px
    fontWeight: '600'
    lineHeight: '1.3'
    letterSpacing: -0.01em
  h3:
    fontSize: 20px
    fontWeight: '600'
    lineHeight: '1.4'
  body-lg:
    fontSize: 18px
    fontWeight: '400'
    lineHeight: '1.6'
  body-md:
    fontSize: 16px
    fontWeight: '400'
    lineHeight: '1.6'
  label-sm:
    fontSize: 14px
    fontWeight: '600'
    lineHeight: '1'
    letterSpacing: 0.05em
  caption:
    fontSize: 12px
    fontWeight: '400'
    lineHeight: '1.4'
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  unit: 8px
  container-max: 1200px
  gutter: 24px
  margin-mobile: 16px
  margin-desktop: 40px
  stack-sm: 8px
  stack-md: 16px
  stack-lg: 32px
---

## Brand & Style
The design system is built for the modern university student, focusing on reducing cognitive load during high-stress academic periods. It employs a **Minimalist** aesthetic with a **Soft/Friendly** overlay to create a workspace that feels calm and encouraging rather than clinical. The visual narrative centers on "breathable productivity," using generous negative space to prevent the interface from feeling cluttered. The overall experience should evoke a sense of organized peace, moving away from the aggressive urgency often found in professional task managers.

## Colors
The palette is rooted in a pristine white base to maximize clarity. We use a soft Indigo primary for action points and a very light Cyan for secondary highlights. 

Critical to the system are the functional priority colors: 
- **High Priority:** Use the vibrant Red (#EF4444) sparingly for tags and urgent deadlines.
- **Medium Priority:** A warm Yellow (#F59E0B) for steady-state tasks.
- **Low Priority:** A calming Green (#10B981) for flexible items.
- **Completed State:** A specific faded gray (#9CA3AF) applied to text and icons to visually "recede" finished items into the background.

## Typography
This design system utilizes **Plus Jakarta Sans** for its friendly, open apertures and modern geometric feel, which provides high readability for long task lists. The scale emphasizes a strong hierarchy: large, bold headers allow students to scan their daily agenda quickly, while body text maintains a generous line height (1.6) to ensure task descriptions are easy to digest. Labels are slightly tracked out and bolded for immediate identification of metadata like dates or course codes.

## Layout & Spacing
The layout follows a **Fixed Grid** model on desktop to keep the workspace contained and focused, transitioning to a fluid single-column on mobile. We employ a "Generous Whitespace" philosophy; vertical stacks use 16px or 32px increments to prevent the feeling of a "wall of text." Grouped tasks should have significant padding (24px) within their parent containers to maintain a sense of lightness.

## Elevation & Depth
Depth is created through **Ambient Shadows** and **Tonal Layers**. Rather than heavy borders, we use soft, diffused shadows (Blur: 20px, Opacity: 4%, Color: Primary-Tinted) to lift task cards off the subtle gray background. 
- **Level 0 (Base):** Subtle gray (#F9FAFB) for the main application background.
- **Level 1 (Cards):** Pure white surfaces with soft shadows for primary content.
- **Level 2 (Modals/Popovers):** Higher elevation with a slightly more pronounced shadow to indicate temporary focus.

## Shapes
The shape language is consistently **Rounded**, avoiding sharp corners to maintain the friendly brand personality. 
- **Standard Elements (Inputs/Cards):** 0.5rem (8px) radius.
- **Large Elements (Feature Cards):** 1rem (16px) radius.
- **Interactive Elements (Buttons/Tags):** Full pill-shape (999px) to encourage clicking and provide a soft, tactile feel.

## Components
- **Priority Tags:** Pill-shaped badges using a 10% opacity background of the priority color (Red, Yellow, or Green) with 100% opacity text of the same color.
- **Status Toggles:** Large, circular checkboxes that transform into a "Check" icon upon completion. When checked, the entire row's text should transition to the muted gray (#9CA3AF) with a subtle strikethrough.
- **Task Cards:** White background, 16px padding, and a 1px soft gray border or a very light ambient shadow.
- **Buttons:** Large, pill-shaped, and high-contrast for the primary action (e.g., "Add Task"). Use a subtle scale-down effect (0.98x) on click to provide tactile feedback.
- **Navigation Header:** A clean, fixed top bar with a white background and a subtle bottom border. It should include the student's profile, a search bar with rounded corners, and clear "Today/Upcoming/Calendar" navigation links.
- **Input Fields:** Soft gray background (#F3F4F6) that shifts to white with a Primary Color border on focus.