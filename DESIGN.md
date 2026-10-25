---
name: Kinetic Arc HUD
colors:
  surface: '#0f131d'
  surface-dim: '#0f131d'
  surface-bright: '#353944'
  surface-container-lowest: '#0a0e18'
  surface-container-low: '#171b26'
  surface-container: '#1c1f2a'
  surface-container-high: '#262a35'
  surface-container-highest: '#313540'
  on-surface: '#dfe2f1'
  on-surface-variant: '#e6bdb8'
  inverse-surface: '#dfe2f1'
  inverse-on-surface: '#2c303b'
  outline: '#ac8884'
  outline-variant: '#5c403c'
  surface-tint: '#ffb4ab'
  primary: '#ffb4ab'
  on-primary: '#690005'
  primary-container: '#dc2626'
  on-primary-container: '#fff6f5'
  inverse-primary: '#bf0715'
  secondary: '#ffb95f'
  on-secondary: '#472a00'
  secondary-container: '#ee9800'
  on-secondary-container: '#5b3800'
  tertiary: '#4cd7f6'
  on-tertiary: '#003640'
  tertiary-container: '#007d92'
  on-tertiary-container: '#edfaff'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ffdad6'
  primary-fixed-dim: '#ffb4ab'
  on-primary-fixed: '#410002'
  on-primary-fixed-variant: '#93000b'
  secondary-fixed: '#ffddb8'
  secondary-fixed-dim: '#ffb95f'
  on-secondary-fixed: '#2a1700'
  on-secondary-fixed-variant: '#653e00'
  tertiary-fixed: '#acedff'
  tertiary-fixed-dim: '#4cd7f6'
  on-tertiary-fixed: '#001f26'
  on-tertiary-fixed-variant: '#004e5c'
  background: '#0f131d'
  on-background: '#dfe2f1'
  surface-variant: '#313540'
typography:
  display-lg:
    fontFamily: Space Grotesk
    fontSize: 56px
    fontWeight: '700'
    lineHeight: 64px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 36px
    fontWeight: '700'
    lineHeight: 44px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Space Grotesk
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 40px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Space Grotesk
    fontSize: 26px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-md:
    fontFamily: Space Grotesk
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: 0em
  headline-sm:
    fontFamily: Space Grotesk
    fontSize: 20px
    fontWeight: '500'
    lineHeight: 28px
    letterSpacing: 0.01em
  body-lg:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
    letterSpacing: 0em
  body-md:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
    letterSpacing: 0.01em
  body-sm:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-lg:
    fontFamily: Space Grotesk
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.06em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.08em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 10px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.12em
rounded:
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
  full: 9999px
spacing:
  gutter: 1.25rem
  gutter-mobile: 0.75rem
  margin: 2rem
  margin-mobile: 1rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

This design system channels an advanced cybernetic heads-up display engineered for precision, speed, and real-time mission telemetry. It combines industrial aerospace sophistication with tactical kinetic feedback. The interface evokes unyielding confidence, executive authority, and bleeding-edge computing power.

The visual style synthesizes **Futuristic High-Contrast HUD** with sleek **Tactical Glassmorphism**:
- Ultra-dense information structures arranged in angular, calibrated telemetry panels.
- Deep titanium chassis backgrounds overlaid with hot-rod crimson illumination and hyper-focused amber warning tracks.
- Subtle inner glow dynamics simulating powered micro-circuitry and active plasma capacitors.
- Clean, structural vector boundaries that feel engineered rather than merely drawn.

## Colors

The palette establishes an immediate high-energy technical presence anchored in deep void space:

- **Primary (`#DC2626` - Hot Rod Red):** Primary power conduits, lethal status states, critical alerts, and focused command action triggers. Supported by deeper shades (`#991B1B`, `#7F1D1D`) for tactical state transitions and volumetric depth.
- **Secondary (`#F59E0B` - Stark Gold / Amber):** Calibration markers, secondary metrics, high-voltage readouts, and sub-action triggers. Supported by lighter tints (`#FBBF24`, `#FEF3C7`) for sharp data points and warning badges.
- **Tertiary (`#06B6D4` - Arc Reactor Cyan):** High-energy feedback, hyper-focused indicators, system uptime pulses, and real-time link confirmations. Provides an electric counterpoint to the dominant warm spectrum.
- **Neutral Chassis (`#0B0F19` & `#111827` - Dark Titanium / Charcoal):** Monolithic carbon-titanium framework providing extreme contrast for illuminated vector tracks and light-emitting HUD metrics.

Surfaces default to deep charcoal with semi-translucent overlays (`rgba(17, 24, 39, 0.75)`), bound by crimson and gold hairline borders.

## Typography

The typographic hierarchy balances mechanical HUD readout telemetry with dense operational readability:

- **Headlines & Labels (`Space Grotesk`):** Engineered, geometric, and aggressive. Headings enforce a technological signature with tight tracking at large sizes. Sub-labels and technical data markers leverage uppercase treatments with expanded letter-spacing to emulate radar grid legends and cockpit diagnostics.
- **Body & Data Metrics (`Inter`):** Hyper-legible, neutral, and structurally sound. Body typography stays clean and unobtrusive, maximizing scanning speed across dark data tables and multi-tier interface streams.

## Layout & Spacing

The layout is built upon a high-density **12-column fluid tactical grid** that anchors content into modular telemetry units:

- **Grid Architecture:** Desktop views utilize a 12-column framework with `1.25rem` gutters and a `2rem` outer chassis boundary. Mobile adapts to a 4-column flow with tight `0.75rem` gutters and `1rem` outer margins.
- **Spacing Rhythm:** Micro-spacers (`space-xs`, `space-sm`) define compact data clusters, metric indicators, and HUD bracket spacing. Macro-spacers (`space-lg`, `space-xl`) separate distinct operational modules (e.g., flight metrics vs. diagnostics).
- **Reflow & Docking:** Panels dock edge-to-edge horizontally where possible, separated by 1px sub-dividers, emulating unified instrument panels rather than isolated floating consumer cards.

## Elevation & Depth

Visual hierarchy uses physical-cyber layer stacking, combining hairline borders with internal photonic luminescence:

- **Base Chassis (Level 0):** `#0B0F19` void space, grounding all active layers.
- **HUD Panel Surface (Level 1):** `#111827` rendered with 75% opacity and `backdrop-filter: blur(12px)`. Outlined with a 1px border (`rgba(220, 38, 38, 0.25)` or `rgba(245, 158, 11, 0.2)`).
- **Active / Focused Layer (Level 2):** Elevated components add high-energy perimeter glow: `box-shadow: 0 0 16px rgba(220, 38, 38, 0.35), inset 0 0 12px rgba(220, 38, 38, 0.15)`.
- **Reactor Core State (Level 3 / Overdrive):** Arc Cyan (`#06B6D4`) or Core Red (`#DC2626`) edge discharge: `box-shadow: 0 0 24px rgba(6, 182, 212, 0.5), 0 0 8px rgba(255, 255, 255, 0.3)`.

Drop shadows are reserved exclusively for luminous light emission; traditional soft black shadows are strictly prohibited.

## Shapes

The shape system adopts precise geometric curves (Roundedness: 2):
- Standard modules and structural enclosures utilize `0.5rem` (`rounded`) corners, reflecting precision-milled titanium casing.
- Interactive controls and status pills scale to `1rem` (`rounded-lg`) for tactile affordance.
- Dialog and master flight consoles scale to `1.5rem` (`rounded-xl`), framed with crisp mechanical hairline strokes.
- Where appropriate, corner clipping (chamfers) or pseudo-brackets are simulated using subtle border overlays to amplify the cyber-chassis metaphor.

## Components

### Buttons
- **Primary Kinetic Trigger:** Solid crimson background (`#DC2626`) with bright titanium white text (`#FFFFFF`), uppercase `label-md`. Border: 1px solid `#F87171`. On hover, transitions to high-intensity glow (`box-shadow: 0 0 18px rgba(220, 38, 38, 0.6)`) with subtle translateY(-1px).
- **Secondary (Telemetry/Amber):** Titanium frame with translucent gold fill (`rgba(245, 158, 11, 0.1)`), amber border (`#F59E0B`), and `#FEF3C7` text. Glows amber on focus.
- **Ghost/HUD Action:** Transparent background, 1px perimeter border in `rgba(255, 255, 255, 0.2)`, cyan text highlight (`#06B6D4`) on hover.

### Chips & Telemetry Tags
- Pill containers with `0.25rem` horizontal padding and tight `label-sm` monospaced styling.
- Status variants: Active/Online (`rgba(6, 182, 212, 0.15)` bg with `#06B6D4` border), Critical/Alert (`rgba(220, 38, 38, 0.15)` bg with `#DC2626` border), Standby (`rgba(245, 158, 11, 0.15)` bg with `#F59E0B` border).

### Input Fields & Selectors
- Background: `#0B0F19` with a subtle titanium stroke (`#1F2937`).
- Text: Crisp `#F3F4F6` with uppercase `label-md` floating identifiers.
- Focus State: Border snaps to `#DC2626` with a concentrated internal/external radial neon bleed (`box-shadow: 0 0 8px rgba(220, 38, 38, 0.4)`). Caret is styled in `#06B6D4`.

### Lists & Data Streams
- Compact alternating rows styled with translucent charcoal dividers (`1px solid rgba(255, 255, 255, 0.05)`).
- Leading micro-indicators (red or cyan diagnostic pips) alongside telemetry values rendered in `Space Grotesk`.

### Checkboxes & Switches
- **Checkboxes:** Square with `0.25rem` corners, 1.5px crimson outline. Checked state fills with `#DC2626` containing a sharp, stark-white vector mark.
- **Switches:** Titanium capsule track with an illuminated cyan or crimson thumb that pulses when active.

### Cards & HUD Modules
- Translucent dark charcoal chassis (`rgba(17, 24, 39, 0.85)`).
- Top border features an accent strip (2px solid `#DC2626` or `#F59E0B`).
- Corner detail: Subtle 1px structural tick marks positioned at panel boundaries to enforce the heads-up display cockpit aesthetic.

### System Diagnostic Meters (Specialized Component)
- Segmented linear progress bars consisting of distinct glowing blocks.
- Core levels render in `#06B6D4`, transitioning to `#F59E0B` at 75% load, and flashing `#DC2626` above 90% capacity.