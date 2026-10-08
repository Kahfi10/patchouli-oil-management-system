# Accessibility & WCAG 2.2 AA Compliance

Complete checklist and implementation guide for accessible frontend applications.

---

## 1. Contrast Requirements (WCAG 2.2 AA)

- **Normal Text** (< 18pt or < 14pt bold): Minimum **4.5:1** contrast ratio against the background.
- **Large Text** ($\ge$ 18pt or $\ge$ 14pt bold): Minimum **3:1** contrast ratio.
- **Active UI Components & Graphic Elements**: Minimum **3:1** contrast ratio against adjacent colors.

---

## 2. Accessible Form Controls & Labels

Every form input must be explicitly associated with a label:
```html
<!-- Correct Pattern: Explicit ID Binding -->
<div class="form-group">
  <label for="user-email" class="form-label">Email Address</label>
  <input 
    type="email" 
    id="user-email" 
    name="email" 
    class="form-input" 
    aria-describedby="email-hint email-error" 
    required
  />
  <span id="email-hint" class="hint-text">We'll never share your email.</span>
  <span id="email-error" class="error-text" role="alert" aria-live="assertive"></span>
</div>
```

---

## 3. Keyboard Navigation & Focus Visible Ring

Never remove focus outlines without providing an accessible alternative:
```css
/* Bad */
*:focus { outline: none; }

/* Good: Visible, High-Contrast Offset Focus Ring */
:focus-visible {
  outline: 2px solid var(--accent-primary, #6366f1);
  outline-offset: 3px;
  border-radius: var(--radius-sm, 6px);
}
```

---

## 4. Modal Dialog Accessibility Checklist

- [ ] Wrap in `<dialog>` or `role="dialog"` with `aria-modal="true"`.
- [ ] Connect title with `aria-labelledby="dialog-title"`.
- [ ] Trap keyboard focus inside the dialog while open.
- [ ] Close the modal on `Escape` key press and return focus to the trigger button.
- [ ] Disable body scrolling while modal is active (`overflow: hidden`).
