# Design System & Modern CSS Token Architecture

Guidelines for establishing a flexible, maintainable, and stunning design token architecture.

---

## 1. Token Hierarchy

```text
Global Primitives (Raw values)
  └── Semantic Tokens (Meaning & Intent: surface, on-surface, primary, muted)
        └── Component Tokens (Specific scopes: button-primary-bg, card-radius)
```

### Complete Token CSS Template
```css
:root {
  /* Surface Palette - Dark Theme First */
  --bg-app: #080c14;
  --bg-surface-1: #0f172a;
  --bg-surface-2: #1e293b;
  --bg-surface-3: #334155;

  /* Accent & Gradients */
  --accent-cyan: #06b6d4;
  --accent-violet: #8b5cf6;
  --accent-fuchsia: #d946ef;
  --accent-emerald: #10b981;
  --gradient-aurora: linear-gradient(135deg, #06b6d4 0%, #8b5cf6 50%, #d946ef 100%);
  --gradient-card-border: linear-gradient(180deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.02) 100%);

  /* Typography Scales (Major Third: 1.25) */
  --font-xs: 0.75rem;     /* 12px */
  --font-sm: 0.875rem;    /* 14px */
  --font-base: 1rem;       /* 16px */
  --font-lg: 1.25rem;     /* 20px */
  --font-xl: 1.563rem;    /* 25px */
  --font-2xl: 1.953rem;   /* 31.25px */
  --font-3xl: 2.441rem;   /* 39px */
  --font-display: clamp(2.5rem, 5vw, 4rem);

  /* Spacing Scale (8pt Grid) */
  --space-1: 0.25rem;  /* 4px */
  --space-2: 0.5rem;   /* 8px */
  --space-3: 0.75rem;  /* 12px */
  --space-4: 1rem;     /* 16px */
  --space-6: 1.5rem;   /* 24px */
  --space-8: 2rem;     /* 32px */
  --space-12: 3rem;    /* 48px */
  --space-16: 4rem;    /* 64px */

  /* Border Radii */
  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 16px;
  --radius-xl: 24px;
  --radius-pill: 9999px;
}
```

---

## 2. Card Glow & Hardware Border Techniques

To achieve a sleek modern SaaS look:
```css
.modern-card {
  position: relative;
  background: var(--bg-surface-1);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid rgba(255, 255, 255, 0.07);
  box-shadow: 
    0 10px 30px -10px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 255, 255, 0.12);
  overflow: hidden;
  transition: transform 250ms var(--ease-spring), border-color 250ms ease;
}

.modern-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--gradient-aurora);
  opacity: 0;
  transition: opacity 300ms ease;
}

.modern-card:hover {
  transform: translateY(-3px);
  border-color: rgba(139, 92, 246, 0.3);
}

.modern-card:hover::before {
  opacity: 1;
}
```
