# MD3 Expressive Tooltip Component

## Overview
Implement a fully spec-compliant Material Design 3 Tooltip component system with two variants: **PlainTooltip** and **RichTooltip**, plus a **TooltipBox** wrapper. The implementation must match Android Compose logic and official MD3 specs exactly, leveraging Framer Motion and Tailwind CSS.

## Project Type
**WEB** (Primary Agent: `frontend-specialist`)

## Success Criteria
- PlainTooltip renders with correct MD3 tokens (color, shape, font, padding, size).
- RichTooltip renders all 5 configurations correctly.
- Caret renders on all 4 sides and points toward anchor correctly.
- Entry/Exit animations function exactly as specified (spring physics, dynamic transform origin).
- Positioning algorithm correctly flips placement when near viewport edge and prevents off-screen rendering.
- Proper trigger behaviors: Hover (400ms delay), Focus (immediate), Long-press (500ms).
- Global mutex ensures only ONE tooltip is visible at a time.
- Fully accessible: `role="tooltip"`, `aria-describedby`, correct keyboard navigation.
- Safe for Server-Side Rendering (SSR) and tree-shaking.

## Tech Stack
- **React**: Functional components and hooks.
- **TypeScript**: Strict typing across all component APIs.
- **Tailwind CSS v3+**: Styling referencing MD3 design tokens.
- **Framer Motion v11+**: Animations and layout transitions.

## File Structure

```text
packages/react/src/ui/tooltip/
├── index.ts
├── Tooltip.tsx
├── TooltipBox.tsx
├── PlainTooltip.tsx
├── RichTooltip.tsx
├── TooltipCaretShape.tsx
├── useTooltipState.ts
├── useTooltipPosition.ts
├── tooltip.tokens.ts
└── tooltip.types.ts

apps/docs/components/demos/tooltip/
└── Tooltip.stories.tsx
```

## Task Breakdown

### Task 1: TypeScript Interfaces & Design Tokens
**Agent:** `frontend-specialist` | **Skill:** `frontend-design`
**INPUT:** MD3 Tooltip Tokens from spec.
**OUTPUT:** `tooltip.types.ts` and `tooltip.tokens.ts` defining all types (`TooltipPlacement`, `TooltipTrigger`) and tailwind mapping.
**VERIFY:** `npx tsc --noEmit` passes cleanly.

### Task 2: State Hooks Implementation (Global Mutex)
**Agent:** `frontend-specialist` | **Skill:** `react-best-practices`
**INPUT:** `BasicTooltipStateImpl` logic requirements.
**OUTPUT:** `useTooltipState.ts` containing the global mutex (set of dismiss callbacks) and state/timer management for duration-based auto-dismiss.
**VERIFY:** Hook correctly tracks `isVisible`, and consecutive calls across instances dismiss previously active tooltips.

### Task 3: Positioning Hook Implementation
**Agent:** `frontend-specialist` | **Skill:** `react-best-practices`
**INPUT:** `PopupPositionProvider` logic.
**OUTPUT:** `useTooltipPosition.ts` using `ResizeObserver`, window inner dimensions, and `getBoundingClientRect` to calculate optimal placement and actual side.
**VERIFY:** Hook correctly flips from `top` to `bottom` lacking viewport space, calculates boundaries properly, SSR-safe.

### Task 4: Caret & Tooltip Components (Plain & Rich)
**Agent:** `frontend-specialist` | **Skill:** `frontend-design`
**INPUT:** `PlainTooltipProps`, `RichTooltipProps`, and MD3 visual spec.
**OUTPUT:** `TooltipCaretShape.tsx`, `PlainTooltip.tsx`, `RichTooltip.tsx`.
**VERIFY:** Components compile, use correct specified CSS mappings (e.g. `var(--md-sys-color-inverse-surface)`), display correctly with truncation.

### Task 5: TooltipBox Wrapper & Animations
**Agent:** `frontend-specialist` | **Skill:** `frontend-design`
**INPUT:** Trigger constraints (hover, focus, long-press) and animation specs.
**OUTPUT:** `TooltipBox.tsx` using `ReactDOM.createPortal` and `framer-motion` `<AnimatePresence>`.
**VERIFY:** Trigger timeouts behave as specified. Animations run correctly based on actual origin. React Portals do not break context. Focus moves successfully for Rich tooltips.

### Task 6: Export & Stories Integration
**Agent:** `frontend-specialist` | **Skill:** `webapp-testing`
**INPUT:** Finished components.
**OUTPUT:** `index.ts` exported via `packages/react/src/index.ts`, and comprehensive `Tooltip.stories.tsx` (using Next.js/React context for stories depending on the project structure).
**VERIFY:** Storybook or docs render all variants successfully without console warnings.

## Phase X: Final Verification
- [ ] No purple/violet hex codes used directly
- [ ] Socratic Gate was respected
- [ ] Only 1 tooltip active at a time evaluated
- [ ] Hover is ignored gracefully on touch devices
- [ ] `npm run lint && npx tsc --noEmit` passes

## ✅ PHASE X COMPLETE
*To be filled out during execution phase*
