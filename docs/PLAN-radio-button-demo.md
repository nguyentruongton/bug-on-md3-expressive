# PLAN-radio-button-demo

## Overview
Design and implement a demo page for the Material Design 3 `RadioButton` and `RadioGroup` components based on MD3 guidelines (Context7 reference: `/websites/m3_material_io`).

## Project Type
WEB

## Success Criteria
1. The demo page `apps/docs/app/(demo)/radio-button/page.tsx` (or matching directory) is created.
2. The page showcases all popular MD3 RadioButton use cases:
   - Basic Vertical / Horizontal Grouping
   - Controlled vs Uncontrolled states
   - Disabled States (disabled group and individual disabled radio)
   - Error States (validation emulation)
   - Usage with and without labels
3. Components interact correctly (inclusive of ripple and state layer morph animations).

## Tech Stack
- Next.js (App Router within `apps/docs`)
- React
- Tailwind CSS
- The newly created `RadioButton` and `RadioGroup` components from `packages/react/src/ui/radio-button.tsx`

## File Structure
- `apps/docs/app/demo/radio-button/page.tsx` (Path to be strictly verified based on `apps/docs` structure mapping)

## Task Breakdown

### Task 1: Initialize Demo Route
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`
- **INPUT**: Check `apps/docs/` for demo page layout routing.
- **OUTPUT**: Create the `page.tsx` skeleton for `radio-button`.
- **VERIFY**: Route `http://localhost:3000/demo/radio-button` loads without returning 404.

### Task 2: Build Basic MD3 Radio Groups
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`
- **INPUT**: `RadioButton` and `RadioGroup` specs from MD3 UI components.
- **OUTPUT**: Code showcasing Vertical, Horizontal group examples with uncontrolled and controlled forms.
- **VERIFY**: Components visually update active states accurately and align according to the Material Design specifications.

### Task 3: Interactive & Stateful Renderings (Error, Disabled)
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`
- **INPUT**: Error styling, Disabled attributes.
- **OUTPUT**: Complete examples section showing validation error styling, disabled states, standalone uncontrolled radios without labels for layout checks.
- **VERIFY**: Clicking disabled components triggers no ripple, error variant uses `--color-m3-error`, standard states default to `--color-m3-primary`.

## Phase X: Verification
- [ ] Lint: Pass (`npm run lint` or `pnpm lint`)
- [ ] Build: Success (`npm run build` or `pnpm build`)
- [ ] Style Match & Touch Target: Ensure touch targets are at least `48x48` as standard MD3 (the internal circle is `48x48`).
