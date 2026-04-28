# Styling & Design Tokens (AI Guide)

This guide explains how to style custom elements to match the `@bug-on/md3-react` system.

## 1. Tailwind v4 Plugin
The library provides a Tailwind plugin that maps MD3 color roles to utility classes.

### Color Roles
Use the `m3-` prefix followed by the MD3 role:
- **Primary**: `bg-m3-primary`, `text-m3-on-primary`, `border-m3-primary-container`
- **Surface**: `bg-m3-surface`, `bg-m3-surface-container-low`, `bg-m3-surface-variant`
- **Error**: `text-m3-error`, `bg-m3-error-container`

### State Opacity
MD3 states use opacity overlays. We provide shortcuts:
- `hover:bg-m3-primary/8` (8% opacity overlay)
- `active:bg-m3-primary/12` (12% opacity overlay)

## 2. Design Tokens
Tokens are available in `packages/tokens`.

### Typography Scale
Use these Tailwind classes for standard MD3 type scales:
- `text-m3-display-large`, `text-m3-headline-medium`, `text-m3-title-small`
- `text-m3-body-large`, `text-m3-label-medium`

### Shapes
Shapes in MD3 Expressive are dynamic.
- `rounded-m3-none`: 0px
- `rounded-m3-extra-small`: 4px
- `rounded-m3-small`: 8px
- `rounded-m3-medium`: 12px
- `rounded-m3-large`: 16px
- `rounded-m3-extra-large`: 28px
- `rounded-m3-full`: Pill (9999px or half-height)

## 3. Motion (Springs)
We prefer springs over durations. When using Framer Motion, use these constants:

```tsx
import { SPRING_TRANSITION, SPRING_TRANSITION_FAST } from "@bug-on/md3-react";

<m.div animate={{ scale: 1 }} transition={SPRING_TRANSITION} />
```

- `SPRING_TRANSITION`: Standard damping, good for general movement.
- `SPRING_TRANSITION_FAST`: Higher stiffness, good for subtle feedback (hover/tap).

## 4. Icon Styles
Icons should always use the `Icon` component for consistent variable font settings:
```tsx
<Icon name="search" weight={500} size={24} />
```
Available weights: 100, 200, 300, 400 (default), 500, 600, 700.
