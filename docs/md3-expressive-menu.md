# PLAN: MD3 Expressive Menus Component

> **Slug:** `md3-expressive-menu`  
> **Type:** WEB — React UI Library  
> **Agent:** `frontend-specialist` + `frontend-design` skill  
> **Status:** 🟡 PLANNING

---

## Overview

Implement the **MD3 Expressive Menus** component system for the `@bug-on/md3-react` package. This is NOT a standard M3 menu — it is the **Expressive update (2025)** featuring:

- **Shape Morphing**: Border-radius changes dynamically based on item position, hover, and selection state
- **MenuGroup with Gap-based Grouping**: Groups separated by physical gaps (segmented layout), replacing traditional dividers
- **Two Color Variants**: Standard (`SurfaceContainerLow`) and Vibrant (`TertiaryContainer`)
- **Framer Motion Animations**: Spring-based enter/exit with dynamic transform-origin from anchor position
- **Full A11y**: Focus trap, keyboard nav, ARIA roles

**Key insight:** The repo previously had a basic `dropdown.tsx` built on Radix UI. The new MD3 Expressive Menu is a **distinct component** (`menu/`) that fully supersedes it. `dropdown.tsx` has been successfully removed to maintain a single source of truth and a clean codebase.

---

## Project Type

**WEB** — React 19 + Tailwind CSS v4 + Framer Motion (`motion/react`) + Radix UI `@radix-ui/react-dropdown-menu`

---

## Success Criteria

- [ ] `Menu`, `MenuItem`, `MenuGroup`, `MenuDivider`, `SubMenu` exported from `packages/react/src/index.ts`
- [ ] Shape morphing works for all 4 item positions: `standalone`, `leading`, `middle`, `trailing`
- [ ] Group hover triggers shape morph animation (FastSpatial spring: stiffness 300, damping 25)
- [ ] Both `standard` and `vibrant` color variants render correctly
- [ ] Enter/exit animation scales from 0.8 to 1.0 with dynamic transform-origin
- [ ] Selected item shows check icon with expand/collapse horizontal animation
- [ ] Keyboard: Arrow keys, Enter/Space, Escape, Home/End all functional
- [ ] Focus trapped inside menu; restored to anchor on close
- [ ] SubMenu opens on ArrowRight, closes on ArrowLeft/Escape
- [ ] All items meet 48dp min-height
- [ ] TypeScript: zero errors (`pnpm run lint`)
- [ ] Vitest: tests passing (`pnpm run test`)

---

## Tech Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Framework | React 19 (functional + hooks) | Repo standard |
| Primitives | `@radix-ui/react-dropdown-menu` | Already in deps; handles a11y, focus trap, portals |
| Animation | `motion/react` (`AnimatePresence`, `m.div`) | Repo standard (see `fab-menu.tsx`, `dropdown.tsx`) |
| Styling | Tailwind CSS v4 + `cn()` util | Repo standard |
| Testing | Vitest + `@testing-library/react` | Repo standard |
| Token source | `StandardMenuTokens`, `VibrantMenuTokens`, `SegmentedMenuTokens` | Per Kotlin source specs |

---

## Token Mapping (Kotlin → Tailwind)

### Color Tokens

| Kotlin Token | Tailwind Class | Used On |
|---|---|---|
| `SurfaceContainerLow` | `bg-m3-surface-container-low` | Standard group container |
| `TertiaryContainer` | `bg-m3-tertiary-container` | Vibrant group container |
| `OnSurface` | `text-m3-on-surface` | Standard item label |
| `OnTertiaryContainer` | `text-m3-on-tertiary-container` | Vibrant item label |
| `OnSurfaceVariant` | `text-m3-on-surface-variant` | Standard icons/trailing |
| `TertiaryContainer` (selected std) | `bg-m3-tertiary-container` | Standard selected container |
| `OnTertiaryContainer` (selected std) | `text-m3-on-tertiary-container` | Standard selected text |
| `Tertiary` (vibrant selected) | `bg-m3-tertiary` | Vibrant selected container |
| `OnTertiary` (vibrant selected) | `text-m3-on-tertiary` | Vibrant selected text |

### Shape Tokens (from SegmentedMenuTokens)

| Shape Role | Tailwind |
|---|---|
| Container popup | `rounded-xs` (CornerExtraSmall) |
| Group standalone active | `rounded-xl` (CornerLarge) |
| Group inactive (post-hover) | `rounded-sm` (CornerSmall) |
| Item middle/standalone | `rounded-xs` |
| Item leading (first) | `rounded-t-md rounded-b-xs` |
| Item trailing (last) | `rounded-t-xs rounded-b-md` |
| Item selected | `rounded-md` (CornerMedium) |
| Group leading | `rounded-t-xl rounded-b-sm` |
| Group trailing | `rounded-t-sm rounded-b-xl` |

### Spacing

| Token | Value |
|---|---|
| Item horizontal padding | 16dp leading, 16dp trailing (12dp compact) |
| Leading icon size | 20dp |
| Trailing icon size | 20dp |
| Item min-height | 48dp |
| Group gap | 2dp (`SegmentedGap`) |
| Group internal padding | 4dp (`GroupPadding`) |
| Menu min-width | 112dp |
| Menu max-width | 280dp |

---

## File Structure

```
packages/react/src/ui/menu/
├── index.ts              # Barrel export
├── menu.tsx              # Root <Menu>, <MenuTrigger>, <MenuContent>
├── menu-item.tsx         # <MenuItem> with all slots
├── menu-group.tsx        # <MenuGroup> gap + shape morphing
├── menu-divider.tsx      # <MenuDivider> horizontal line
├── sub-menu.tsx          # <SubMenu> nested menu
├── menu-context.tsx      # MenuContext (colorVariant, focus state)
├── menu-tokens.ts        # Design token constants (px values)
├── menu-types.ts         # All TypeScript interfaces & types
├── menu-animations.ts    # Framer Motion variant definitions
└── menu.test.tsx         # Vitest tests
```

**Modified files:**
- `packages/react/src/index.ts` — add new `Menu*` exports

---

## TypeScript API

```typescript
// menu-types.ts

export type MenuColorVariant = 'standard' | 'vibrant';
export type MenuItemPosition = 'standalone' | 'leading' | 'middle' | 'trailing';

export interface MenuProps {
  children: React.ReactNode;
  colorVariant?: MenuColorVariant;       // default: 'standard'
  className?: string;
}

export interface MenuContentProps {
  children: React.ReactNode;
  sideOffset?: number;
  side?: 'top' | 'bottom' | 'left' | 'right';
  align?: 'start' | 'center' | 'end';
  hasOverflow?: boolean;
  colorVariant?: MenuColorVariant;
  className?: string;
}

export interface MenuItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  leadingIcon?: React.ReactNode;
  trailingIcon?: React.ReactNode;
  supportingText?: React.ReactNode;
  trailingText?: string;
  selected?: boolean;
  disabled?: boolean;
  itemPosition?: MenuItemPosition;
  colorVariant?: MenuColorVariant;
  keepOpen?: boolean;
}

export interface MenuGroupProps {
  children: React.ReactNode;
  label?: string;
  index?: number;
  count?: number;
  colorVariant?: MenuColorVariant;
  className?: string;
}
```

---

## Animation Specifications

```typescript
// menu-animations.ts

export const MENU_CONTAINER_VARIANTS = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1, scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 25, mass: 0.8 }
  },
  exit: { opacity: 0, scale: 0.8, transition: { duration: 0.15 } }
};

export const CHECK_ICON_VARIANTS = {
  hidden: { opacity: 0, width: 0, marginRight: 0 },
  visible: {
    opacity: 1, width: 20, marginRight: 8,
    transition: { type: 'spring', stiffness: 380, damping: 30 }
  },
  exit: { opacity: 0, width: 0, marginRight: 0, transition: { duration: 0.12 } }
};

// Group shape morph spring (FastSpatial)
export const GROUP_SHAPE_SPRING = { type: 'spring', stiffness: 300, damping: 25 };
```

---

## Task Breakdown

### TASK-01: Types & Tokens ← P0 (No deps)
- **Output:** `menu-types.ts`, `menu-tokens.ts`
- **Input:** All 4 Kotlin token files
- **Verify:** TS compiles; constants exported

### TASK-02: Context & Animations ← P0 (deps: TASK-01)
- **Output:** `menu-context.tsx`, `menu-animations.ts`
- **Key:** `MenuContext` holds `colorVariant`, `activeFocusIndex`
- **Verify:** `useMenuContext` hook works; variants compile

### TASK-03: MenuDivider ← P1 (deps: TASK-01)
- **Output:** `menu-divider.tsx`
- **Spec:** `mx-3 my-0.5 h-px bg-m3-outline-variant`, `role="separator"`

### TASK-04: MenuGroup ← P1 (deps: TASK-01, TASK-02)
- **Output:** `menu-group.tsx`
- **Shape logic:**
  - Tracks `isHovered` + `hasBeenHovered` (mirrors Kotlin `shapeByInteraction`)
  - `animate={{ borderRadius }}` via `motion/react` (CSS shorthand string)
  - Active shape: standalone=`"16px"`, leading=`"16px 16px 6px 6px"`, trailing=`"6px 6px 16px 16px"`, middle=`"6px"`
  - Inactive shape: `"6px"` (CornerSmall) after hover-out
- **Auto-inject `itemPosition`:** Use `React.Children.map` + `React.cloneElement` with position index
- **Verify:** Shape transitions on hover

### TASK-05: MenuItem ← P1 (deps: TASK-01, TASK-02, TASK-03)
- **Output:** `menu-item.tsx`
- **Layout grid:**
  ```
  [16px] [20px icon] [12px] [label block flex-1] [8px] [20px trailing] [12px]
  min-h-12 (48px)
  ```
- **Shape classes by position:**
  - `leading` → `rounded-t-md rounded-b-xs`
  - `middle` → `rounded-xs`
  - `trailing` → `rounded-t-xs rounded-b-md`
  - `standalone` → `rounded-xs`
  - `selected=true` overrides all → `rounded-md`
- **Check icon:** `<AnimatePresence>` wraps `<m.span>` with `CHECK_ICON_VARIANTS`
- **Verify:** Positions render correct radii; icon animates in/out; disabled opacity 0.38

### TASK-06: Root Menu (Menu, MenuTrigger, MenuContent) ← P1 (deps: TASK-02, TASK-04, TASK-05)
- **Output:** `menu.tsx`
- **Architecture:**
  - `Menu` = `RadixDropdown.Root` + provides `MenuContext`
  - `MenuTrigger` = re-export `RadixDropdown.Trigger`
  - `MenuContent` = `RadixDropdown.Portal` → `AnimatePresence` → `m.div` (container variants)
  - Transform-origin via CSS var: `style={{ transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)' }}`
- **Verify:** Opens/closes with spring; portal renders above content; colorVariant propagates via context

### TASK-07: SubMenu ← P2 (deps: TASK-05, TASK-06)
- **Output:** `sub-menu.tsx`
- **Architecture:** `RadixDropdown.Sub` + `SubTrigger` (styled as `MenuItem`) + `SubContent` with animation
- **Verify:** Opens ArrowRight; closes ArrowLeft/Escape; nested chains work

### TASK-08: Barrel Export ← P2 (deps: TASK-03 → TASK-07)
- **Output:** `ui/menu/index.ts` + update `src/index.ts`
- **Verify:** `import { Menu, MenuItem, MenuGroup } from '@bug-on/md3-react'` resolves in TS

### TASK-09: Tests ← P3 (deps: TASK-08)
- **Output:** `menu.test.tsx`
- **10 test cases:**
  1. Menu renders children when open
  2. MenuItem: correct shape class per `itemPosition`
  3. MenuItem: check icon visible when `selected=true`
  4. MenuItem: disabled state — opacity 0.38, not interactive
  5. MenuGroup: shape morph fires on mouseenter
  6. MenuDivider: renders with `role="separator"`
  7. Standard variant applies `surface-container-low` classes
  8. Vibrant variant applies `tertiary-container` classes
  9. Keyboard: ArrowDown moves focus to next item
  10. Keyboard: Escape closes menu and returns focus to trigger
- **Verify:** `pnpm run test` — all 10 pass

---

## Task Dependency Graph

```
TASK-01 (Types) ──┬──► TASK-02 (Context) ──┬──► TASK-04 (Group) ──┐
                  │                          │                        ├──► TASK-06 (Menu) ──┬──► TASK-07 (SubMenu) ──► TASK-08 (Barrel) ──► TASK-09 (Tests)
                  ├──► TASK-03 (Divider) ───┴──► TASK-05 (Item) ───┘                       │
                  └─────────────────────────────────────────────────────────────────────────┘
Parallel OK: TASK-01+TASK-02, TASK-03+TASK-04 (after TASK-01)
```

---

## Implementation Notes

### Shape Morphing via motion/react

Use `animate` prop directly with CSS `borderRadius` string instead of Tailwind classes — Tailwind classes cannot be animated between values:

```tsx
<m.div
  animate={{
    borderRadius: hovered ? activeRadius : inactiveRadius
  }}
  transition={{ type: 'spring', stiffness: 300, damping: 25 }}
>
```

### Transform Origin

Radix sets `--radix-dropdown-menu-content-transform-origin` CSS variable automatically:

```tsx
<m.div
  style={{ transformOrigin: 'var(--radix-dropdown-menu-content-transform-origin)' }}
  variants={MENU_CONTAINER_VARIANTS}
  initial="hidden" animate="visible" exit="exit"
>
```

### Auto-position Injection in MenuGroup

```tsx
const count = React.Children.count(children);
React.Children.map(children, (child, index) => {
  if (!React.isValidElement(child)) return child;
  const position: MenuItemPosition =
    count === 1 ? 'standalone' :
    index === 0 ? 'leading' :
    index === count - 1 ? 'trailing' : 'middle';
  return React.cloneElement(child, { itemPosition: position, colorVariant });
});
```

### Backward Compatibility

`dropdown.tsx` has been deprecated and fully replaced by the new Menu system.

---

## Risk Areas

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| `rounded-xs` Tailwind class may not exist | Medium | Check `packages/tailwind`; use `rounded-[2px]` fallback |
| Framer `animate.borderRadius` vs Tailwind class conflict | Medium | Use `style` + motion animate instead of CSS classes for morphing |
| `React.cloneElement` fragile with non-MenuItem children | Low | Guard with `displayName` check before cloning |
| Radix CSS var `--radix-dropdown-menu-content-transform-origin` | Low | Radix v2 supports natively; fallback to `top left` |

---

## Phase X: Verification Checklist

### Automated
```bash
cd packages/react && pnpm run lint          # TypeScript
cd packages/react && pnpm run test          # Vitest
python .agent/skills/frontend-design/scripts/ux_audit.py .
cd packages/react && pnpm run build         # Build
```

### Manual Visual
- [ ] Standard menu: `surface-container-low` background
- [ ] Vibrant menu: `tertiary-container` background
- [ ] Group hover: spring shape morph visible
- [ ] Selected item: `rounded-md` pill + check icon
- [ ] Leading item: top corners larger than bottom
- [ ] Trailing item: bottom corners larger than top
- [ ] Gap between groups: 2dp physical gap
- [ ] Enter animation: scales from 0.8 with spring
- [ ] Keyboard navigation: all keys work
- [ ] Focus restores to trigger after Escape

### Rule Compliance
- [ ] No purple/violet hex codes
- [ ] No generic template layouts
- [ ] Socratic Gate respected (this plan created before code)

```
## ✅ PHASE X COMPLETE (fill after implementation)
- Lint: [ ]
- Tests: [ ]
- Build: [ ]
- Date: ___________
```
