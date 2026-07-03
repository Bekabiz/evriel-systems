# Evriel Systems — Complete Design System Reference
> Adapted from Auros.global (extracted via Refero). Deep teal abyss with bioluminescent teal-to-lavender gradients, particle sphere hero, aggressive display typography, tonal depth surfaces.

**Visual reference:** https://auros.global
**DO NOT copy Auros content — only the visual system. All content comes from the existing Evriel Systems repo.**

---

## 1. Design Philosophy

Evriel Systems should read as an **abyssal observatory** — a near-black teal abyss punctuated by luminous data points, subtle lavender warmth, and a single particle sphere that anchors the visual identity.

Typography carries the brand's confidence — a geometric sans (Inter, as Matter substitute) is pushed to extreme sizes, from 10px tracked-out eyebrow labels to 96px+ display type that crouches aggressively tight. Surfaces are whisper-thin: the card layer sits just one shade above the canvas, creating depth through tonal difference rather than shadows. Accents are rationed — a teal-to-cyan gradient signals action, a barely-there lavender border whispers warmth against the cool field, and small mint dots prefix section labels like navigation beacons.

**The teal can be made very slightly lighter than Auros** — just a touch — to feel warmer and more approachable. But stay in the deep-ocean range.

### Key Rules
- Every section must have its own unique visual identity — NO repeating card grids
- Depth through tonal contrast, NEVER drop shadows
- Gradients are rationed and purposeful
- Particle sphere or 3D visual is the hero centerpiece
- Large display type with aggressive negative tracking
- Lavender/pink is a warm accent ONLY — never a fill or primary color

---

## 2. Complete Color Tokens

### Surfaces (dark → darker → elevated)
| Name | Hex | Role |
|------|-----|------|
| Abyssal Teal | `#012624` | Page canvas, primary background — the dominant field everything floats on |
| Midnight Current | `#011d1c` | Card surface, elevated panels — one step deeper than canvas, pressed into the void |
| Tide Pool Teal | `#003734` | Interactive card backgrounds, subtle filled actions, secondary surface lift |

### Text & UI
| Name | Hex | Role |
|------|-----|------|
| Snow Sheet | `#ffffff` | Primary headings, nav text, icon strokes, logo — the bright typographic surface |
| Fog Veil | `#bbc7c6` | Body text, secondary copy, muted borders — the dim chorus against white headlines |
| Ice Mist | `#edfffe` | Highlight borders, accent strokes, light decorative edges — a breath of cool light |
| Ash Gray | `#333333` | Dark borders and separators for elevated surfaces |

### Accents
| Name | Hex | Role |
|------|-----|------|
| Lilac Wisp | `#fde9ff` | Accent border tint, warm complement — used SPARINGLY on hover and decorative edges |
| Current Teal | `#00827c` | Teal dot indicators, gradient start point |
| Aurora Cyan | `#cbfffc` | Gradient midpoints, bright accent |
| Twilight Lavender | `#fad1ff` | Gradient endpoint — warm lavender that breaks the teal monotony |

---

## 3. Complete Gradient System

### Current Gradient — Primary CTA ONLY
```css
linear-gradient(90deg, #00827c 0%, #cbfffc 100%)
```
The dark teal start grounds the button in brand, the bright cyan end makes it appear "switched on." Used ONLY on filled CTA buttons.

### Aurora Gradient — Ghost buttons, decorative borders
```css
linear-gradient(90deg, #cbfffc 0%, #edfffe 26%, #fffdfa 48%, #fad1ff 89%)
```
Spans cool-to-warm spectrum. The lavender endpoint is the only warm color in the system — a brief, distant warmth at the end of an otherwise cool sweep. Used on ghost button borders and partner CTA.

### Twilight Radial — Atmospheric section backgrounds
```css
radial-gradient(ellipse, #fad1ff 0%, #fffdfa 45%, #edfffe 85%, #cbfffc 100%)
```
Creates the impression of a distant light source or underwater glow. Used at very low opacity on the `#012624` canvas. Never as a full-bleed background.

### Gradient Rules
- Gradients should NEVER be used as full-bleed page backgrounds
- They always sit on top of the `#012624` canvas at reduced opacity
- Or as button fills where they are the entire element
- Current Gradient = primary action ONLY
- Aurora Gradient = secondary/ghost ONLY
- Twilight = atmospheric decoration ONLY

---

## 4. Complete Typography System

### Font
**Primary:** Inter (as Matter substitute)
**Fallbacks:** DM Sans, Satoshi, ui-sans-serif, system-ui, sans-serif
**Weights:** 400 (regular), 500 (medium) — NEVER 600+

### Full Type Scale

| Role | Size | Weight | Line Height | Letter Spacing | Usage |
|------|------|--------|-------------|----------------|-------|
| eyebrow | 10px | 500 | 1.4 | +2.4px | Section labels, uppercase |
| caption | 12px | 500 | 1.4 | +1.44px | Nav items, button labels, uppercase |
| body | 14px | 400 | 1.5 | +0.77px | Body copy, descriptions |
| body-lg | 16px | 400 | 1.5 | — | Hero subhead, larger body |
| subheading | 20px | 500 | 1.4 | — | Section subheads, card titles |
| heading-sm | 24px | 400 | 1.4 | -0.29px | Card headings |
| heading | 36px | 400 | 1.3 | -0.47px | Section headings |
| heading-lg | 61px | 500 | 1.1 | -1.22px | Large section titles |
| 86px | 86px | 500 | 1.0 | — | Hero headline |
| display | 96px | 500 | 1.0 | -3.84px | Display type |
| display-xl | 295px | 500 | 1.0 | -13.57px | Giant decorative numbers |

### Typography Rules
- Weight 400 dominates everything; 500 ONLY for emphasized labels and key actions
- NEVER use bold (600+) weights — size and tracking do the work
- Negative letter-spacing for 24px+ sizes ONLY
- Wide positive tracking (+1.44px to +2.4px) for small uppercase text (eyebrows, nav, buttons)
- Tight negative tracking (-0.5px to -14px) for display headlines
- All nav items and button labels are UPPERCASE with wide tracking

---

## 5. Spacing & Layout

### Spacing Scale
| Value | Usage |
|-------|-------|
| 4px | Base unit |
| 12px | Tight internal spacing |
| 16px | Nav padding, tight gaps |
| 20px | Element gap (between related elements) |
| 24px | Subhead to body gap |
| 28px | Button padding vertical |
| 32px | Medium section internal |
| 36px | Card internal sections |
| 40px | Card padding |
| 48px | Medium section spacing |
| 64px | Section internal spacing |
| 68px | Section gap (between sections) |
| 80px | Large section spacing |
| 120px | Hero internal spacing |
| 140-172px | Hero top/bottom padding |

### Layout
- **Page max-width:** 1200px centered
- **Section gap:** 68px vertical
- **Card padding:** 40px all sides
- **Element gap:** 20px between related items
- **Density:** Spacious — generous whitespace everywhere
- **Full-bleed dark canvas** with max-width content container

### Border Radius
| Element | Radius |
|---------|--------|
| Buttons | 6px |
| Tags | 6px |
| Inputs | 6px |
| Cards | 16px |
| Avatars | 9999px (circle) |
- NEVER mix radii — 6px for controls, 16px for cards, no exceptions

---

## 6. Surface & Elevation System

Elevation is achieved through tonal contrast, NOT shadows.

| Level | Name | Value | Purpose |
|-------|------|-------|---------|
| 0 | Abyss | `#012624` | Page background — the deep teal void |
| 1 | Trench | `#011d1c` | Card surface — pressed into the void |
| 2 | Reef | `#003734` | Elevated/interactive containers |

Each step is just one shade apart — creates a pressed-in, low-relief topography.
- **NO drop shadows anywhere** — not on cards, not on buttons, nowhere
- **NO visible borders on cards** — tonal difference does the work
- The particle sphere and gradient washes do the visual work that shadows do elsewhere

---

## 7. Component Specifications

### 7.1 Top Navigation Bar
- Fixed top bar, full-bleed, transparent background (no fill)
- Logo left: Evriel hexagonal mark + "Evriel" wordmark + "SYSTEMS" sub-label
- Nav items center: uppercase Inter 12px, letter-spacing 1.44px, color `#ffffff`
- Ghost CTA right: "LET'S TALK" with Aurora gradient border
- Height ~64px, padding 16px horizontal
- No border, no background — sits directly on the teal canvas

### 7.2 Gradient CTA Button (Primary Action)
- Background: Current Gradient (`#00827c → #cbfffc`)
- Text: `#011d1c` (dark), Inter 12px uppercase, weight 500, letter-spacing 1.44px
- Border-radius: 6px
- Padding: 14px 28px
- Includes small arrow icon (↗) after label
- This is the ONLY high-contrast luminous button

### 7.3 Ghost Outline Button (Secondary)
- Background: transparent
- Border: 1px with Aurora gradient (cyan→white→lavender)
- Text: `#ffffff`, Inter 12px uppercase, weight 500, letter-spacing 1.44px
- Border-radius: 6px
- Padding: 14px 24px

### 7.4 Section Eyebrow Label
- 6px circular dot in `#00827c`
- 12px gap
- Uppercase text in Inter 12px, weight 500, letter-spacing 1.44px, color `#bbc7c6`
- Example: ● ABOUT  ● INDUSTRIES  ● SERVICES

### 7.5 Content Cards
- Background: `#011d1c` (Trench — one shade deeper than canvas)
- NO visible border — tonal difference separates from canvas
- Border-radius: 16px
- Padding: 40px
- Heading: Inter 24px, weight 400, `#ffffff`
- Body: Inter 14px, `#bbc7c6`
- Top-right corner: 28×28px ghost button with ↗ icon, 1px `#edfffe` border, 6px radius
- NO drop shadow

### 7.6 Particle Sphere (Hero Centerpiece)
- 3D particle sphere rendered in teal/cyan tones
- Particles densely packed, glowing with bioluminescent effect
- Floating in the hero space against the deep teal void
- Responds to mouse movement (particles shift)
- The single most distinctive brand element
- Build with Three.js, or CSS 3D particles, or animated SVG

### 7.7 Floating Arrow Link
- 28×28px ghost button
- 1px border in `#bbc7c6` or `#edfffe`
- 6px radius
- Contains ↗ icon in white
- No fill — tonal only

### 7.8 Connection Node Illustration
- Network of white circular nodes connected by thin lines
- Organic clusters, not grid-like
- White fills, no borders
- Floating on teal canvas
- Represents intelligent system connections
- Used as section decoration

### 7.9 Hero Section
- Centered single-column layout
- Small uppercase eyebrow: "AI · AUTOMATION · INTELLIGENT SYSTEMS" (spaced caps, `#cbfffc`)
- Large display headline: Inter 86px+, weight 500, `#ffffff`, negative tracking
- Subhead: Inter 16px, `#bbc7c6`, line-height 1.5
- Gradient CTA button + Ghost button side by side
- Particle sphere floating behind/beside text
- Gradient wash background (Twilight radial at low opacity)

### 7.10 Gradient Wash Background
- Large radial gradient overlaid on teal canvas at very low opacity
- Uses Aurora multi-stop gradient or teal-to-cyan spotlight
- Creates sense of glowing horizon or underwater light shaft
- NEVER full-bleed — always on top of `#012624` canvas

---

## 8. Section-by-Section Content (from existing Evriel Systems repo)

### Hero
- Eyebrow: "AI · AUTOMATION · INTELLIGENT SYSTEMS"
- Headline: "Connecting Intelligence with Business"
- Subhead: "Helping organizations leverage AI, automation, and intelligent systems to improve efficiency, make better decisions, and build sustainable competitive advantages."
- CTA: "Start a Conversation" (gradient) + "Our Work" (ghost)
- Visual: Particle sphere

### About — "Intelligence With Purpose"
- Section eyebrow: ● ABOUT
- Headline: "Intelligence With Purpose"
- Body copy about Evriel Systems founding, Bereket Teshome, cross-industry experience
- Convergence diagram: People + Processes + Information + Technology → Intelligent Systems
- Stats: AI-Driven Innovation, Multi-Industry Expertise, 24/7 Intelligence, Future-Ready Growth
- Challenges solved: Fragmented Information, Repetitive Manual Work, Disconnected Systems, Inefficient Communication, Slow Decision-Making

### Outcomes — "Where intelligence creates real impact"
- 5 outcomes with rotating display:
  1. AI-Powered Efficiency
  2. Smarter Decision-Making
  3. Operational Visibility
  4. Growth & Competitiveness
  5. Digital Transformation

### Industries (11 total)
Construction & Engineering, Manufacturing & Industrial, Tourism & Hospitality, Retail & Commerce, Import & Export, Professional Services, Marketing & SEO, European Projects, NGOs & Associations, Education & Training, Startups & SMEs
- Each with description text
- Interactive selector/orbit — but NOT the old hexagonal orbit. Design something unique.

### Services (4)
1. **AI Automation** — Email automation, Workflow automation, AI assistants, Customer communication
2. **Business Intelligence** — Reporting dashboards, Operational analytics, Decision support, Data visualization
3. **Intelligent Systems** — Industry-specific platforms, Knowledge management, AI-powered tools
4. **Digital Transformation** — Process redesign, Digital strategy, Technology integration
- Each with flow diagram: e.g., Email → AI Analysis → Automation → Action

### Projects (5)
1. **AI Business Integration** — AI communication system for civil engineering firm
2. **Funding Intelligence** — EU funding opportunity discovery
3. **Workforce AI** (ClockET) — GPS attendance, employee verification, workforce analytics
4. **Domain Intel** — AI-powered domain qualification and SEO intelligence
5. **Project Vision** (In Development) — Construction intelligence platform
- Each expandable with Challenge → Solution → Results

### Process — "How We Work"
4 steps: Discover → Design → Build → Evolve

### Trust & Security
Data privacy, secure infrastructure, transparent processes, compliance-ready

### Contact
- Email: contact@evrielsystems.com
- Form: Name, Email, Company, Service interest checkboxes, Message
- CTA: "Let's Build Something Intelligent"

---

## 9. Do's and Don'ts

### DO
- Use Inter as the sole brand typeface
- Push display type large and tight: 86px+ headlines with negative letter-spacing
- Differentiate surfaces through tonal depth (#012624 → #011d1c → #003734), NEVER through drop shadows
- Use teal-to-cyan gradient EXCLUSIVELY for primary actions
- Use cyan-to-lavender multi-stop gradient for ghost/secondary buttons
- Prefix section labels with a 6px teal dot indicator + uppercase eyebrow text
- Maintain generous spacing: 40px card padding, 68px between sections, 20px between elements
- Reserve lavender `#fde9ff` as a warm accent border tint, NEVER as a fill
- Make every section visually unique — different layouts, compositions, interactions
- Use the particle sphere as the main visual identity element

### DON'T
- Do NOT add drop shadows or box-elevation to cards or buttons
- Do NOT use lavender/pink as a primary color or background fill
- Do NOT use bright saturated colors on the dark canvas — all chromatic accents should be muted or gradient-washed
- Do NOT break the radius discipline: 6px for controls, 16px for cards — no mixing
- Do NOT use bold (600+) weights — the system is 400/500 only
- Do NOT add visible borders to cards — let tonal difference create separation
- Do NOT use tight tracking on small text — reserve negative letter-spacing for 24px+ only
- Do NOT use hexagonal rings, SVG blueprint diagrams, or generic orbit visualizations
- Do NOT use bronze, copper, warm beige, or any warm earth tones
- Do NOT repeat the same card layout across multiple sections
- Do NOT use generic "AI SaaS template" layouts

---

## 10. Animation & Motion

### Hero — Particle Sphere
- Three.js particle sphere OR CSS 3D particle system
- Reacts to mouse/cursor proximity (particles shift away or glow brighter)
- Slow ambient rotation
- Teal/cyan color range with occasional white accents
- Optional: scroll-controlled video sequence (GSAP ScrollTrigger + canvas frame playback)

### Scroll Animations (GSAP ScrollTrigger)
- Sections fade + slide in on scroll entry
- Cards stagger in with 100-150ms delays between each
- Gradient washes pulse subtly as sections enter viewport
- Node-network connection lines draw themselves on scroll
- Numbers/stats count up when entering viewport

### Hover Interactions
- Ghost buttons: Aurora gradient border intensifies, subtle glow
- Cards: shift from Trench (#011d1c) to Reef (#003734) background
- Nav links: opacity fade
- Arrow buttons: slight scale + border brightens

### Transitions
- All transitions use `cubic-bezier(0.16, 1, 0.3, 1)` easing
- Duration: 0.3s for hovers, 0.7-1.2s for scroll reveals
- Respect `prefers-reduced-motion`

---

## 11. Full CSS Custom Properties

```css
:root {
  /* ===== COLORS ===== */
  --color-abyssal-teal: #012624;
  --color-midnight-current: #011d1c;
  --color-tide-pool-teal: #003734;
  --color-fog-veil: #bbc7c6;
  --color-ice-mist: #edfffe;
  --color-ash-gray: #333333;
  --color-snow-sheet: #ffffff;
  --color-lilac-wisp: #fde9ff;
  --color-current-gradient: #00827c;
  --color-aurora-gradient: #cbfffc;
  --color-twilight-gradient: #fad1ff;

  /* ===== GRADIENTS ===== */
  --gradient-current: linear-gradient(90deg, #00827c 0%, #cbfffc 100%);
  --gradient-aurora: linear-gradient(90deg, #cbfffc 0%, #edfffe 26%, #fffdfa 48%, #fad1ff 89%);
  --gradient-twilight: linear-gradient(90deg, #cbfffc 0%, #edfffe 26%, #fffdfa 48%, #fad1ff 89%);

  /* ===== TYPOGRAPHY ===== */
  --font-primary: 'Inter', ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  --font-weight-regular: 400;
  --font-weight-medium: 500;

  /* Type Scale */
  --text-eyebrow: 10px;
  --leading-eyebrow: 1.4;
  --tracking-eyebrow: 2.4px;
  --text-caption: 12px;
  --leading-caption: 1.4;
  --tracking-caption: 1.44px;
  --text-body: 14px;
  --leading-body: 1.5;
  --tracking-body: 0.77px;
  --text-body-lg: 16px;
  --leading-body-lg: 1.5;
  --text-subheading: 20px;
  --leading-subheading: 1.4;
  --text-heading-sm: 24px;
  --leading-heading-sm: 1.4;
  --tracking-heading-sm: -0.29px;
  --text-heading: 36px;
  --leading-heading: 1.3;
  --tracking-heading: -0.47px;
  --text-heading-lg: 61px;
  --leading-heading-lg: 1.1;
  --tracking-heading-lg: -1.22px;
  --text-display: 96px;
  --leading-display: 1;
  --tracking-display: -3.84px;
  --text-display-xl: 295px;
  --leading-display-xl: 1;
  --tracking-display-xl: -13.57px;

  /* ===== SPACING ===== */
  --spacing-unit: 4px;
  --spacing-12: 12px;
  --spacing-16: 16px;
  --spacing-20: 20px;
  --spacing-24: 24px;
  --spacing-28: 28px;
  --spacing-32: 32px;
  --spacing-36: 36px;
  --spacing-40: 40px;
  --spacing-48: 48px;
  --spacing-64: 64px;
  --spacing-80: 80px;
  --spacing-120: 120px;
  --spacing-140: 140px;
  --spacing-156: 156px;
  --spacing-160: 160px;
  --spacing-172: 172px;

  /* ===== LAYOUT ===== */
  --page-max-width: 1200px;
  --section-gap: 68px;
  --card-padding: 40px;
  --element-gap: 20px;

  /* ===== BORDER RADIUS ===== */
  --radius-md: 6px;
  --radius-xl: 12px;
  --radius-2xl: 16px;
  --radius-tags: 6px;
  --radius-cards: 16px;
  --radius-inputs: 6px;
  --radius-avatars: 9999px;
  --radius-buttons: 6px;

  /* ===== SURFACES ===== */
  --surface-abyss: #012624;
  --surface-trench: #011d1c;
  --surface-reef: #003734;
}
```

---

## 12. Prompt for Claude Code

Drop this file into the repo root as `EVRIEL-DESIGN-REFERENCE.md`, then tell Claude Code:

```
Read EVRIEL-DESIGN-REFERENCE.md completely before writing any code.

Rebuild the Evriel Systems website (src/App.jsx) using this design system.
Keep ALL existing content from the current App.jsx — services, industries, projects, about, contact, insights, privacy policy.

Visual direction:
- Deep teal canvas (#012624) with the Auros.global aesthetic
- Particle sphere or 3D particle system in the hero (Three.js or CSS)
- Teal-to-cyan-to-lavender gradient system as specified
- Inter font with the full type scale (aggressive negative tracking on display)
- Tonal depth surfaces — NO drop shadows anywhere
- Every section must be visually unique — different layouts, not repeated card grids
- GSAP ScrollTrigger for scroll-driven animations
- Ghost buttons with Aurora gradient borders
- Section eyebrows with teal dot prefix

The site should feel like auros.global applied to an AI implementation company.
Make it beautiful. Make every section feel unique. Make it memorable.
```

---

## 13. Similar Brands for Additional Reference
- **Wintermute** — Dark teal canvas, single bright CTA gradient, spacious centered hero
- **Jump Crypto** — Deep dark background, luminous accent gradients, uppercase tracked-out nav
- **Galaxy Digital** — Dark-mode institutional finance, teal-leaning palette, tight display type
- **Amberdata** — Teal-dark canvas, particle/data visualization as hero centerpiece
- **B2C2** — Abyssal dark theme, white display type, gradient CTAs cool-to-warm spectrum
