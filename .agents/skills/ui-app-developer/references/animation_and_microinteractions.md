# Micro-Interactions & Animation Orchestration

Guidelines for physics-based springs, micro-interactions, skeleton loading, and UI motion.

---

## 1. Physics-Based Spring Timing & Keyframes

Use natural spring easing rather than robotic `linear` or standard `ease-in-out`:
```css
:root {
  --spring-bounce: cubic-bezier(0.34, 1.56, 0.64, 1);
  --spring-smooth: cubic-bezier(0.16, 1, 0.3, 1);
}

/* Button Click Compression */
.btn-primary {
  transition: transform 150ms var(--spring-smooth), box-shadow 150ms ease;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px -4px rgba(99, 102, 241, 0.5);
}

.btn-primary:active {
  transform: translateY(1px) scale(0.98);
}
```

---

## 2. Shimmer & Skeleton Loading State

Avoid jarring layout shifts (CLS) by using matching skeleton placeholders during async loading:

```css
@keyframes shimmer {
  0% {
    background-position: -200% 0;
  }
  100% {
    background-position: 200% 0;
  }
}

.skeleton-box {
  background: linear-gradient(
    90deg,
    rgba(255, 255, 255, 0.03) 25%,
    rgba(255, 255, 255, 0.08) 37%,
    rgba(255, 255, 255, 0.03) 63%
  );
  background-size: 200% 100%;
  animation: shimmer 1.8s infinite;
  border-radius: var(--radius-sm);
}
```

---

## 3. Staggered List Entrance (Pure CSS & Framer Motion)

```css
@keyframes slideUpFade {
  from {
    opacity: 0;
    transform: translateY(16px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.stagger-item {
  animation: slideUpFade 400ms var(--spring-smooth) forwards;
}

.stagger-item:nth-child(1) { animation-delay: 50ms; }
.stagger-item:nth-child(2) { animation-delay: 100ms; }
.stagger-item:nth-child(3) { animation-delay: 150ms; }
.stagger-item:nth-child(4) { animation-delay: 200ms; }
```
