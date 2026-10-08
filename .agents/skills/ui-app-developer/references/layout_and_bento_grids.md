# Bento Grids & Responsive Layouts

This guide covers modern CSS Grid compositions, Bento grid designs, and responsive layouts.

---

## 1. Bento Grid Architecture

A Bento Grid organizes asymmetric modules into a unified, high-aesthetic layout.

```css
.bento-container {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 1.5rem;
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
}

/* Feature Hero - 8 Columns, spans 2 rows */
.bento-item-hero {
  grid-column: span 8;
  grid-row: span 2;
  min-height: 420px;
}

/* Side Widget - 4 Columns */
.bento-item-side {
  grid-column: span 4;
  grid-row: span 1;
}

/* Compact Metric - 4 Columns */
.bento-item-metric {
  grid-column: span 4;
  grid-row: span 1;
}

/* Full Width Banner - 12 Columns */
.bento-item-banner {
  grid-column: span 12;
}

/* Tablet Breakpoint (Under 1024px) */
@media (max-width: 1024px) {
  .bento-container {
    grid-template-columns: repeat(6, 1fr);
  }
  .bento-item-hero {
    grid-column: span 6;
  }
  .bento-item-side, .bento-item-metric {
    grid-column: span 3;
  }
  .bento-item-banner {
    grid-column: span 6;
  }
}

/* Mobile Breakpoint (Under 640px) */
@media (max-width: 640px) {
  .bento-container {
    grid-template-columns: 1fr;
    gap: 1rem;
    padding: 1rem;
  }
  .bento-item-hero,
  .bento-item-side,
  .bento-item-metric,
  .bento-item-banner {
    grid-column: span 1;
    grid-row: auto;
    min-height: auto;
  }
}
```

---

## 2. Dynamic Sticky Navigation & Header Glass

```css
.header-glass {
  position: sticky;
  top: 1rem;
  z-index: 50;
  margin: 0 auto;
  max-width: 1100px;
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  background: rgba(15, 23, 42, 0.75);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-pill);
  padding: 0.75rem 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.3);
}
```
