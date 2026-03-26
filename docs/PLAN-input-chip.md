# Refactoring MD3 Input Chip Component

## Overview
This plan outlines the steps to refactor the `Input Chip` variant within the `@bug-on/md3-react` package. The goal is to perfectly align the input chip padding, icon spacing, and avatar sizing with the official Material Design 3 Expressive specifications as outlined in `Chips.Specs.Material.Design.3.190326.pdf`.

## Project Type
WEB

## Success Criteria
- Input chips without an avatar have exactly `12px` (`pl-3`) left padding.
- Input chips with an avatar have exactly `4px` (`pl-1`) left padding.
- Avatars strictly hold a `24x24px` dimension (`w-6 h-6`).
- The gap between the label text and the close icon is exactly `8px`.
- The right padding from the close icon to the edge of the chip is exactly `8px`.
- The close icon itself is exactly `18x18px`.
- The component passes all Type, Lint, and standard tests.

## Tech Stack
- React
- Tailwind CSS (Utility classes for exact pixel spacing: `pl-3`, `pl-1`, `w-6`, `h-6`)

## File Structure
- `packages/react/src/ui/chip.tsx` (Target component)

## Task Breakdown

### Task 1: Refactor padding logic for Input Chips
- **Agent**: `frontend-specialist`
- **Skill**: `frontend-design`
- **Priority**: P1
- **INPUT**: `packages/react/src/ui/chip.tsx`
- **OUTPUT**: Updated padding logic (`paddingClass`) that conditionally applies `pl-3` and `pl-1` for input chips, overriding the generic chip spacing. Update the close button layout to `w-[26px] justify-start pr-2` or similar to guarantee the exact 8px spacing on both sides of the 18px close icon.
- **VERIFY**: Storybook/Docs visual test confirms token accuracy without regressions on other chips.

## Phase X: Verification
- [x] Lint: `npm run lint`
- [x] TypeScript: `npx tsc --noEmit`
- [x] Build: `npm run build`
- [x] Manual visual inspection inside docs app to verify the 12px/4px left padding and 8px gaps.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Build: ✅ Success
- Date: 2026-03-26
