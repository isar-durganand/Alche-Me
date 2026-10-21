# Alche-Me — Design System & Shell Architecture Reference

> **Phase:** 02 — Design system and responsive shell  
> **Status:** Production Ready & Verified  
> **Aesthetic Philosophy:** Restrained, high-contrast, authentic scientific laboratory aesthetics (strictly avoiding generic AI gradients, noisy blurs, and decorative-only glassmorphism).

---

## 1. Design Tokens Specification

### Semantic Palette
```css
:root {
  color-scheme: dark;
  --cq-bg: #101317;                  /* Laboratory deep graphite base */
  --cq-surface: #171c22;             /* Workstation surface */
  --cq-surface-raised: #202730;      /* Elevated cards & containers */
  --cq-surface-hover: #262e3a;       /* Interactive hover state */
  --cq-border: #303944;              /* Crisp structure delineation */
  --cq-border-focus: #56b4e9;        /* Input focus indicator */
  --cq-text: #f3f5f7;                /* Primary readable white/off-white */
  --cq-text-muted: #a9b2bd;          /* Secondary metadata & labels */
  --cq-accent: #56b4e9;              /* Scientific cyan focus & brand */
  --cq-accent-hover: #419cd0;        /* Active interactive hover */
  --cq-accent-subtle: rgba(86, 180, 233, 0.12); /* Subtle highlight backgrounds */
  --cq-success: #55b889;             /* Validated stoichiometry / pass */
  --cq-warning: #e7b45a;             /* Caution / safety note / unstable chelate */
  --cq-danger: #e47777;              /* Toxic reagent / titration overshoot */
  --cq-focus: #8bd3ff;               /* 2px accessible focus ring */
}
```

### High-Contrast Mode
```css
.high-contrast {
  --cq-bg: #000000;
  --cq-surface: #0a0d11;
  --cq-surface-raised: #141a22;
  --cq-border: #526377;
  --cq-text: #ffffff;
  --cq-text-muted: #c8d1dc;
  --cq-accent: #78caff;
  --cq-focus: #ffffff;
}
```

### Spacing & Border Radii
- `--cq-radius-sm: 6px` (Badges, tooltips, tags)
- `--cq-radius-md: 10px` (Buttons, inputs, tabs)
- `--cq-radius-lg: 16px` (Cards, panels, modal dialogs)
- Spacing follows 4px increments: 4px (`space-1`), 8px (`space-2`), 12px (`space-3`), 16px (`space-4`), 24px (`space-6`), 32px (`space-8`).

---

## 2. Reusable Component Inventory

All components are located in `src/components/ui/` and exported via `src/components/ui/index.ts`:

1. **Button (`Button.tsx`)**:
   - Variants: `primary`, `secondary`, `outline`, `ghost`, `danger`
   - Sizes: `sm` (32px), `md` (40px), `lg` (48px)
   - Features: Accessible focus ring (`focus-visible:outline-2`), loading spinner with `aria-busy`, left/right icon slots, active scale press feedback.
2. **Card (`Card.tsx`)**:
   - Compound primitives: `Card`, `CardHeader`, `CardTitle`, `CardDescription`, `CardContent`, `CardFooter`.
   - Variants: `default`, `raised`, `interactive` (with hover border accent and subtle elevation).
3. **Badge (`Badge.tsx`)**:
   - Variants: `neutral`, `accent`, `success`, `warning`, `danger`
   - Features: Optional live pulsing or static status dot, small & medium sizes.
4. **Tabs (`Tabs.tsx`)**:
   - Accessible navigation with `role="tablist"` and `role="tab"`.
   - Keyboard arrow navigation (`ArrowLeft`, `ArrowRight`, `Home`, `End`).
5. **Modal (`Modal.tsx`)**:
   - `role="dialog"`, `aria-modal="true"`.
   - Backdrop click dismiss, `Escape` key handler, focus trap, body scroll lock.
6. **Input (`Input.tsx`)**:
   - Accessible label linking, leading icon, clearable button (`onClear`), error validation text.
7. **ProgressBar (`ProgressBar.tsx`)**:
   - Accessible with `role="progressbar"`, `aria-valuenow`, `aria-valuemin="0"`, `aria-valuemax="100"`.
   - Color variants (`accent`, `success`, `warning`, `danger`).
8. **Alert (`Alert.tsx`)**:
   - Severity icons, message body, dismissible button.
9. **Skeleton (`Skeleton.tsx`)**:
   - Pulse animation placeholder for loading states.
10. **Tooltip (`Tooltip.tsx`)**:
    - Accessible tooltip with hover and keyboard focus triggers.

---

## 3. Responsive Shell Architecture

Implemented in `src/components/layout/AppShell.tsx`:
- **Desktop (1024px+):** Left persistent sidebar with brand logo, core navigation links, active badges, and live session status.
- **Tablet (768px–1023px):** Header with breadcrumb trail, high-contrast toggle, and expandable mobile drawer.
- **Mobile (<768px):** Sticky top bar with hamburger menu drawer plus fixed bottom thumb-navigation bar for effortless single-handed navigation.
- **Keyboard Navigation:** Includes a hidden `#main-content` skip link accessible via `Tab` on entry, and clean semantic `<header>`, `<nav>`, `<aside>`, `<main>` landmarks.
