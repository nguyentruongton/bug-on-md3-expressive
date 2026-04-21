# Project Plan: Menu Component Demo Pages

## Overview
This plan outlines the creation of comprehensive demo pages for the newly implemented MD3 Expressive Menu component within the `apps/docs` documentation site. The demo will showcase all practical use cases of the menu, including basic usage, selection states, grouped menus, submenus, and color variants, matching the Material Design 3 guidelines.

## Project Type
WEB (Next.js Documentation Site)

## Success Criteria
- The `/components/menus` page renders correctly with the MDX content.
- All practical use cases of the MD3 Expressive Menu are showcased via `ComponentPreview`.
- The demo components are well-structured and use the tokens and classes defined in `globals.css` and `menu-tokens.ts`.
- The page includes an overview, anatomy/props documentation, and interactive examples.

## Tech Stack
- Next.js (App Router)
- MDX (`next-mdx-remote`)
- Tailwind CSS v4
- Framer Motion

## File Structure
```
├── apps/docs/
│   ├── content/components/
│   │   └── menus.mdx                     (Main documentation content)
│   ├── components/demos/menus/
│   │   ├── menu-basic-demo.tsx           (Simple action menu)
│   │   ├── menu-selection-demo.tsx       (Single-select & Multi-select)
│   │   ├── menu-grouped-demo.tsx         (MenuGroup & MenuDivider)
│   │   ├── menu-icons-demo.tsx           (Leading icons & Trailing shortcuts)
│   │   ├── menu-supporting-text-demo.tsx (Supporting text)
│   │   ├── menu-submenu-demo.tsx         (Nested SubMenu)
│   │   └── menu-vibrant-demo.tsx         (Vibrant color variant)
```

## Task Breakdown

### Task 1: Create Demo Components
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `react-best-practices`
- **Priority**: P0
- **Dependencies**: None
- **OUTPUT**: Create the demo files in `apps/docs/components/demos/menus/` demonstrating each capability of the `Menu` component.
  - `menu-basic-demo.tsx`
  - `menu-selection-demo.tsx`
  - `menu-grouped-demo.tsx`
  - `menu-icons-demo.tsx`
  - `menu-supporting-text-demo.tsx`
  - `menu-submenu-demo.tsx`
  - `menu-vibrant-demo.tsx`
- **VERIFY**: Files are created without TS errors.

### Task 2: Register Demos in Component Registry
- **Agent**: `frontend-specialist`
- **Priority**: P0
- **Dependencies**: Task 1
- **OUTPUT**: Update `apps/docs/components/mdx/component-preview.tsx` or the relevant registry to include the newly created menu demos so they can be rendered in MDX.
- **VERIFY**: Demos are successfully imported and mapped.

### Task 3: Create Menus MDX Page
- **Agent**: `frontend-specialist`
- **Priority**: P0
- **Dependencies**: Task 2
- **OUTPUT**: Create `apps/docs/content/components/menus.mdx` containing the documentation, usage guidelines, and embedding the `<ComponentPreview name="..." />` blocks for each case.
- **VERIFY**: The MDX file is present and properly formatted.

## ✅ PHASE X: Verification Checklist
- [ ] Navigate to `http://localhost:3000/components/menus` in the browser and verify the page loads (no 404).
- [ ] Verify all interactive demos function correctly (open/close, selection state, submenus).
- [ ] Ensure the vibrant variant displays correctly.
- [ ] Check keyboard accessibility (Arrow keys, Enter, Escape) on the demos.
- [ ] Verify shape morphing animations trigger correctly on hover within groups.
