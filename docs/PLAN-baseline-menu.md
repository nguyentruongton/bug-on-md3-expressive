# Baseline Menu Refactor Plan

## Overview
Refactor the `Menu` component (the Baseline variant) to accurately reflect the Material Design 3 specifications for the original popup menu. The Vertical Menu (M3 Expressive) is already correct and should not be affected. The refactor focuses on fixing discrepancies in border radius, spacing, and color for the Baseline Menu, while maintaining the shared architecture.

## Project Type
WEB

## Success Criteria
- The Baseline Menu (`Menu` component) matches MD3 Baseline specs:
  - Menu container: 4dp border radius, 8dp top/bottom padding.
  - Menu items: 48dp height, 12dp left/right padding, 12dp spacing between icon and text.
  - Menu items state layer: spans full width (no rounded corners inside, edge-to-edge).
  - Colors: Uses `SurfaceContainerLow` / `OnSurface` for defaults, and `SecondaryContainer` for selected states instead of `TertiaryContainer` (which is used in the Expressive variants).
  - Divider: 1dp height, 8dp top/bottom margin.
- The `VerticalMenu` (Expressive variant) remains unchanged and fully functional.

## Tech Stack
- React
- Radix UI (Dropdown Menu)
- Tailwind CSS
- Framer Motion

## File Structure
Changes will be localized to the existing menu components:
- `packages/react/src/ui/menu/menu-tokens.ts`
- `packages/react/src/ui/menu/menu-context.tsx`
- `packages/react/src/ui/menu/menu.tsx`
- `packages/react/src/ui/menu/menu-item.tsx`
- `packages/react/src/ui/menu/menu-divider.tsx`

## Task Breakdown

### Task 1: Define Baseline Tokens
**Agent**: `frontend-specialist` | **Skill**: `frontend-design`
**Description**: Add baseline-specific colors, padding, and shape constants to `menu-tokens.ts`.
- **INPUT**: `menu-tokens.ts`
- **OUTPUT**: Add `BASELINE_COLORS` mapping to Surface / SecondaryContainer tokens. Update `MENU_BASELINE_ITEM_HORIZONTAL_PADDING` to `px-3` (12px). Add `BASELINE_ITEM_SHAPE` as `rounded-none`.
- **VERIFY**: Constants are exported and do not break existing STANDARD/VIBRANT exports.

### Task 2: Extend Menu Context
**Agent**: `frontend-specialist` | **Skill**: `frontend-design`
**Description**: Update `MenuContext` to track `menuVariant`.
- **INPUT**: `menu-context.tsx`
- **OUTPUT**: Add `menuVariant?: "baseline" | "expressive"` to context state. `VerticalMenu` will pass `"expressive"`, while `Menu` will default to `"baseline"`.
- **VERIFY**: Context correctly provides `menuVariant` down the tree.

### Task 3: Refactor Menu.tsx (Popup)
**Agent**: `frontend-specialist` | **Skill**: `frontend-design`
**Description**: Update the root `Menu` and `MenuContent` to use baseline styling.
- **INPUT**: `menu.tsx`
- **OUTPUT**: Read `menuVariant`. If baseline, use `BASELINE_COLORS.containerBg`, apply 8dp top/bottom padding (`py-2`), and ensure 4dp container radius.
- **VERIFY**: The popup container renders correctly with `#F3EDF7` (SurfaceContainer) and 4dp corners.

### Task 4: Refactor MenuItem.tsx
**Agent**: `frontend-specialist` | **Skill**: `frontend-design`
**Description**: Differentiate `MenuItem` styling based on `menuVariant`.
- **INPUT**: `menu-item.tsx`
- **OUTPUT**: Read `menuVariant` from context. If `"baseline"`:
  - Apply `px-3` (12px) horizontal padding instead of `px-4`.
  - Apply `rounded-none` (edge-to-edge hover state layer).
  - Use `BASELINE_COLORS` for default, hover, focus, and selected states (e.g. `bg-m3-secondary-container` for selected).
  - Ensure icon-to-text spacing remains `12px` (`mr-3`).
- **VERIFY**: Baseline items touch the edges of the popup horizontally, have 12px padding, and selected state uses the correct color. Expressive vertical items are unchanged.

### Task 5: Refactor MenuDivider.tsx
**Agent**: `frontend-specialist` | **Skill**: `frontend-design`
**Description**: Adjust the popup menu divider padding to match the 16dp total spec (8dp top, 8dp bottom).
- **INPUT**: `menu-divider.tsx`
- **OUTPUT**: Set margin to `my-2` (8px) for baseline dividers.
- **VERIFY**: Dividers inside `Menu` render with 8px top and 8px bottom space.

## Phase X: Verification
- [x] Run Lint check: `npm run lint`
- [x] Run UI validation: Ensure Vertical Menu displays expressive shapes and colors.
- [x] Run UI validation: Ensure Popup Menu displays 4dp corners, edge-to-edge hover states, and 12px horizontal padding.
- [x] Run tests (if applicable).

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-04-20
