---
name: ui-app-developer
description: >-
  Master-grade UI/UX design engineering, front-end aesthetics, and interactive application interface guide.
  Use this skill whenever designing or implementing modern web, mobile, and desktop user interfaces, design systems,
  component libraries, responsive layouts, micro-animations, glassmorphism, dark/light themes, typography scales,
  accessibility (WCAG 2.2 AA), and ensuring visually stunning, WOW-factor user experiences.
---

# UI/UX & Frontend Design Engineering Skill

This skill guides the creation of state-of-the-art, visually captivating, highly accessible, and performance-optimized user interfaces that deliver an immediate "WOW" factor.

---

## 1. Visual Aesthetics & Design Philosophy

Every application UI must feel premium, alive, and deliberate. Basic, generic default layouts are strictly avoided.

```text
┌─────────────────────────────────────────────────────────────┐
│ 1. Deep Layering & Surface Elevation                        │
│    └── Dark/slate palettes, frosted glass, subtle borders   │
├─────────────────────────────────────────────────────────────┤
│ 2. Modern Typography Hierarchy                              │
│    └── Curated fonts (Inter, Outfit, Plus Jakarta Sans)     │
├─────────────────────────────────────────────────────────────┤
│ 3. Asymmetric Dynamic Layouts (Bento Grids)                 │
│    └── Balanced proportions, fluid responsive scaling       │
├─────────────────────────────────────────────────────────────┤
│ 4. Kinetic Feedback & Micro-Interactions                    │
│    └── Spring curves, staggered entrances, magnetic hovers  │
├─────────────────────────────────────────────────────────────┤
│ 5. Universal Usability & Accessibility (WCAG 2.2 AA)        │
│    └── High contrast, focus rings, semantic landmark tags   │
└─────────────────────────────────────────────────────────────┘
```

### Core Design Rules:
- **No Raw Primary Colors**: Never use saturated default primaries (e.g. pure `#ff0000` or `#0000ff`). Use curated HSL/OKLCH color palettes with tailored undertones.
- **Subtle Multi-Layer Borders**: Use translucent borders (`border: 1px solid rgba(255, 255, 255, 0.08)`) paired with inset highlight shadows (`box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1)`) for high-end hardware/glass feel.
- **Glassmorphism Done Right**: Combine `backdrop-filter: blur(16px)` with semi-transparent surfaces (`rgba(15, 23, 42, 0.75)`).

For detailed token schemes, see [`references/design_system_and_tokens.md`](./references/design_system_and_tokens.md).

---

## 2. Design Tokens & CSS Architecture

Establish a comprehensive design token foundation in `tokens.css` or `:root`:

```css
:root {
  /* Color Primitives (OKLCH or HSL) */
  --bg-canvas: #090d16;
  --bg-surface: #111827;
  --bg-elevated: #1e293b;
  --bg-glass: rgba(17, 24, 39, 0.72);
  
  --border-subtle: rgba(255, 255, 255, 0.08);
  --border-active: rgba(99, 102, 241, 0.5);

  --accent-primary: #6366f1;
  --accent-primary-hover: #4f46e5;
  --accent-gradient: linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%);

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  /* Typography Scale */
  --font-family-display: 'Outfit', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-body: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  --font-family-mono: 'JetBrains Mono', monospace;

  /* Elevation Shadows */
  --shadow-subtle: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.2);
  --shadow-glow: 0 0 25px -5px rgba(99, 102, 241, 0.35);

  /* Physics Springs */
  --ease-spring: cubic-bezier(0.16, 1, 0.3, 1);
  --duration-fast: 150ms;
  --duration-normal: 280ms;
}
```

---

## 3. High-Impact Layouts & Bento Grid Composition

Avoid repetitive 1-column or plain 3-column rows. Organize content through **Bento Grid** composition:

```html
<section class="bento-grid">
  <!-- Hero Featured Card (Span 2x2) -->
  <article class="bento-card hero-span">
    <div class="card-glow"></div>
    <h3>Main Analytics Telemetry</h3>
  </article>

  <!-- Metric Widget Card (Span 1x1) -->
  <article class="bento-card metric-widget">
    <span class="badge">Live</span>
    <p class="stat-number">99.98%</p>
    <p class="stat-label">Uptime SLA</p>
  </article>

  <!-- Interactive Control Card (Span 1x1) -->
  <article class="bento-card action-widget">
    <h3>Quick Trigger</h3>
  </article>
</section>
```

Refer to [`references/layout_and_bento_grids.md`](./references/layout_and_bento_grids.md) for complete responsive CSS Grid bento code.

---

## 4. Component States & Micro-Interactions

Every interactive element (button, card, input, tab) must handle all states gracefully:

1. **Default State**: Crisp boundaries and readable typography.
2. **Hover State**: Subtle translateY lift (`transform: translateY(-2px)`), glow shadow amplification, and smooth border color transition.
3. **Active/Pressed State**: Tactile micro-compression (`transform: scale(0.98)`).
4. **Focus-Visible State**: High-contrast outline ring with offset (`outline: 2px solid var(--accent-primary); outline-offset: 2px;`).
5. **Disabled State**: Opacity reduction (`opacity: 0.5; pointer-events: none;`).
6. **Loading State**: Content hidden from assistive tech with an animated spinner or pulse skeleton.

See [`references/animation_and_microinteractions.md`](./references/animation_and_microinteractions.md) for production-ready CSS and Framer Motion recipes.

---

## 5. Accessibility (a11y) & WCAG 2.2 AA Standards

- **Contrast Ratios**:
  - Normal Text ($\ge 4.5:1$).
  - Large Text ($\ge 3:1$).
  - UI Components & Borders ($\ge 3:1$).
- **Semantic Hierarchy**:
  - Exactly one `<h1>` per view.
  - Proper landmark regions: `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.
- **Screen Reader Support**:
  - Dynamic content changes wrapped in `aria-live="polite"`.
  - Icon-only buttons must have `aria-label="Description"`.
  - Modals must implement focus trapping and escape-key listener (`Escape`).

Audit contrast and a11y compliance with [`scripts/verify_a11y_contrast.py`](./scripts/verify_a11y_contrast.py).
Detailed accessibility checklists in [`references/accessibility_and_wcag.md`](./references/accessibility_and_wcag.md).

---

## 6. Frontend Execution Workflow

When building a UI view or component:

1. **Define Visual Hierarchy**: Sketch layout topology (Hero, Primary Action, Secondary Widgets).
2. **Establish Theme Tokens**: Validate contrast ratios and color palette consistency.
3. **Assemble Semantic Structure**: Use HTML5 semantic elements with descriptive classes and ARIA attributes.
4. **Apply Modern Styling**: Layer background gradients, surface card styling, glassmorphism, and typography.
5. **Add Responsive Breakpoints**: Mobile ($\le 640px$), Tablet ($641px - 1024px$), Desktop ($> 1024px$).
6. **Inject Micro-Animations**: Add spring hover effects, skeleton shimmers, and page transitions.
7. **Accessibility & Cross-Browser Audit**: Test keyboard navigation (`Tab`, `Shift+Tab`, `Space`, `Enter`), screen-reader labels, and contrast compliance.
