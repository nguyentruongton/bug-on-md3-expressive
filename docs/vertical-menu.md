# PLAN: MD3 Expressive Vertical Menu Variants

> **Task Slug:** `vertical-menu`
> **Project Type:** WEB (React component library)
> **Agent:** `frontend-specialist`
> **Created:** 2026-04-18

---

## 📋 Overview

MD3 Expressive defines **2 top-level menu variants**:

| Variant | Description | Status |
|---|---|---|
| **Menu (Baseline)** | Dropdown popup triggered by a button, uses Radix DropdownMenu | ✅ Done |
| **Vertical Menus** | Always-visible vertical list (no trigger/popup), 2 sub-variants | ❌ Missing |

### Vertical Menu Sub-variants

| Sub-variant | Separation style | Key tokens |
|---|---|---|
| **Vertical Menu with Gap** | `gap-0.5` (2dp) between segments (no divider) | `SegmentedMenuTokens.SegmentedGap` |
| **Vertical Menu with Divider** | `HorizontalDivider` (`outline-variant`, 12dp horizontal padding) between segments | `MenuDefaults.HorizontalDividerPadding` |

Both sub-variants share:
- Always-visible (no portal, no trigger, no popup animation)
- Same `MenuGroup` shape morphing on hover (CornerLarge active, CornerSmall inactive)
- Same `MenuItem` shape morphing based on position
- Same `colorVariant`: `standard` | `vibrant`
- `min-w-28 max-w-[280px]` width constraints

---

## ✅ Success Criteria

- [x] `VerticalMenu` root component renders a static `div` (not a Radix Dropdown Root)
- [x] `VerticalMenuContent` renders items directly (no portal, no popup animation)
- [x] `VerticalMenuGroup` reuses existing `MenuGroup` shape morphing logic
- [x] **Gap variant**: groups separated by `gap-0.5` (2dp), no divider between groups
- [x] **Divider variant**: a `VerticalMenuDivider` (`bg-m3-outline-variant`, `mx-3 my-0.5`) is auto-inserted between groups
- [x] `colorVariant` (`standard` | `vibrant`) works on both variants
- [x] All existing tokens in `menu-tokens.ts` are reused (no duplication)
- [x] New types are added to `menu-types.ts`
- [x] All new components are exported from `index.ts`
- [x] 2 demo files created for the docs site
- [x] `menus.mdx` updated with a "Vertical Menus" section
- [x] Tests written for new components (8 new tests — all pass)
- [x] TypeScript compiles without errors

---

## 🏗️ Tech Stack

| Technology | Rationale |
|---|---|
| React + TypeScript | Consistent with rest of `packages/react` |
| Framer Motion (`motion/react`) | Shape morphing reuse from existing `MenuGroup` |
| Tailwind CSS (arbitrary values) | Consistent with existing token system |
| Existing `menu-tokens.ts` | Reuse `GROUP_SHAPES`, `ITEM_SHAPE_CLASSES`, `STANDARD_COLORS`, `VIBRANT_COLORS`, `DIVIDER_*` |
| **No Radix primitives** | Vertical menus are static — no popup/trigger needed |

---

## 📁 File Structure

```
packages/react/src/ui/menu/
├── index.ts                          ← Add new exports
├── menu-types.ts                     ← Add VerticalMenuProps, VerticalMenuContentProps, VerticalMenuGroupProps
├── menu-tokens.ts                    ← No change (tokens already exist)
├── menu-context.tsx                  ← Reuse MenuProvider / useMenuContext
├── menu-group.tsx                    ← No change (reused as-is)
├── menu-item.tsx                     ← No change (reused as-is)
├── menu-divider.tsx                  ← Minor: add non-Radix variant for static context
├── vertical-menu.tsx                 ← NEW: VerticalMenu root + VerticalMenuContent
└── vertical-menu-group.tsx           ← NEW: VerticalMenuGroup (thin wrapper or re-export)

apps/docs/
├── registry/demos/
│   ├── vertical-menu-gap-demo.tsx    ← NEW: Demo for gap variant
│   └── vertical-menu-divider-demo.tsx ← NEW: Demo for divider variant
└── content/components/
    └── menus.mdx                     ← UPDATE: Add "Vertical Menus" section
```

---

## 📝 Task Breakdown

### PHASE 1 — ANALYSIS ✅ (Done)

All analysis completed during planning. Key findings:

1. **`MenuGroup`** already implements shape morphing (hover → active shape) via `motion/react`. Can be reused as-is or with minimal changes.
2. **`MenuDivider`** wraps `DropdownMenu.Separator` (Radix). For static vertical context, need a non-Radix `<hr>` variant.
3. **`MenuProvider` / `useMenuContext`** carry `colorVariant` + `open` state. Vertical menu doesn't need `open` (always visible), but `colorVariant` must still be provided via context.
4. **Tokens** are complete — `GROUP_SHAPES`, `STANDARD_COLORS`, `VIBRANT_COLORS`, `DIVIDER_PADDING`, `DIVIDER_COLOR` all exist.
5. **No new animation variants needed** — reuse `GROUP_SHAPE_SPRING` from `menu-animations.ts`.

---

### PHASE 2 — PLANNING ✅ (This document)

---

### PHASE 3 — SOLUTIONING

#### Architecture Decision: How to separate Gap vs Divider

**Option A:** Single `VerticalMenuContent` with `separatorStyle?: "gap" | "divider"` prop.
- ✅ Simpler consumer API
- ✅ Only one component to learn
- ❌ Slightly more complex internal logic

**Option B:** Two separate components `VerticalMenuGapContent` and `VerticalMenuDividerContent`.
- ✅ Maximum clarity, exact spec naming
- ❌ Redundant API surface

**→ Decision: Option A** — `VerticalMenuContent` with `separatorStyle="gap" | "divider"`, defaulting to `"gap"`. This mirrors how MD3 presents them as sub-variants, not separate components.

#### Architecture Decision: VerticalMenuGroup vs re-using MenuGroup

**MenuGroup** currently wraps `role="group"` with hover shape morphing. For Vertical Menu, behavior is identical. **→ Re-export as `VerticalMenuGroup` alias** to avoid code duplication.

#### Architecture Decision: MenuDivider in static context

Current `MenuDivider` wraps `DropdownMenu.Separator` which requires being inside a Radix `DropdownMenu.Root`. For vertical menus, render a bare `<hr>` with the same classes.

**→ Refactor `MenuDivider`** to detect context: if inside a Radix context, use `DropdownMenu.Separator`; otherwise render a plain `<hr>`. OR create a separate `VerticalMenuDivider` that is a plain `<hr>`. 

**→ Decision: Create `VerticalMenuDivider` as a plain `<hr>` with identical styling.** Avoids touching existing working `MenuDivider`.

#### Component API Design

```tsx
// Vertical Menu with Gap (default)
<VerticalMenu colorVariant="standard">
  <VerticalMenuContent separatorStyle="gap">
    <VerticalMenuGroup>
      <MenuItem leadingIcon={<Icon name="visibility" size={20} />}>Item 1</MenuItem>
      <MenuItem leadingIcon={<Icon name="content_copy" size={20} />} trailingText="⌘C">Item 2</MenuItem>
      <MenuItem selected leadingIcon={<Icon name="edit" size={20} />}>Item 3</MenuItem>
    </VerticalMenuGroup>
    <VerticalMenuGroup>
      <MenuItem leadingIcon={<Icon name="cloud" size={20} />} trailingIcon={<Icon name="chevron_right" size={20} />}>Item 4</MenuItem>
    </VerticalMenuGroup>
  </VerticalMenuContent>
</VerticalMenu>

// Vertical Menu with Divider
<VerticalMenu colorVariant="standard">
  <VerticalMenuContent separatorStyle="divider">
    <VerticalMenuGroup>
      {/* items */}
    </VerticalMenuGroup>
    <VerticalMenuGroup>
      {/* items */}
    </VerticalMenuGroup>
  </VerticalMenuContent>
</VerticalMenu>
```

#### Token Mapping (from MD3 spec)

| Property | Token | Value |
|---|---|---|
| Container shape | `MENU_CONTAINER_SHAPE` | `rounded-[4px]` |
| Group active shape (standalone) | `GROUP_SHAPES.standaloneActive` | `16px` |
| Group active shape (leading) | `GROUP_SHAPES.leadingActive` | `16px 16px 8px 8px` |
| Group active shape (middle) | `GROUP_SHAPES.middleActive` | `8px` |
| Group active shape (trailing) | `GROUP_SHAPES.trailingActive` | `8px 8px 16px 16px` |
| Group inactive shape | `GROUP_SHAPES.inactive` | `8px` |
| Gap between groups | `MENU_GROUP_GAP` | `gap-0.5` (2dp) |
| Divider padding | `DIVIDER_PADDING` | `mx-3 my-0.5` |
| Divider color | `DIVIDER_COLOR` | `bg-m3-outline-variant` |
| Min width | `MENU_MIN_WIDTH` | `min-w-28` (112dp) |
| Max width | `MENU_MAX_WIDTH` | `max-w-[280px]` |
| Container bg (standard) | `STANDARD_COLORS.containerBg` | `bg-m3-surface-container-low` |
| Container bg (vibrant) | `VIBRANT_COLORS.containerBg` | `bg-m3-tertiary-container` |

---

### PHASE 4 — IMPLEMENTATION

#### Task 1: Add types to `menu-types.ts`

- **Agent:** `frontend-specialist`
- **Priority:** P0 (blocker for all subsequent tasks)
- **Dependencies:** None

**INPUT:** `menu-types.ts` (current)
**OUTPUT:** Add:
```ts
export type VerticalMenuSeparatorStyle = "gap" | "divider";

export interface VerticalMenuProps {
  children: React.ReactNode;
  colorVariant?: MenuColorVariant;
  className?: string;
}

export interface VerticalMenuContentProps {
  children: React.ReactNode;
  /** "gap" uses 2dp gap between groups; "divider" inserts a horizontal rule */
  separatorStyle?: VerticalMenuSeparatorStyle;
  colorVariant?: MenuColorVariant;
  className?: string;
}

export interface VerticalMenuGroupProps extends MenuGroupProps {}

export interface VerticalMenuDividerProps {
  className?: string;
}
```
**VERIFY:** `npx tsc --noEmit` passes

---

#### Task 2: Create `vertical-menu.tsx`

- **Agent:** `frontend-specialist`
- **Priority:** P1
- **Dependencies:** Task 1

**INPUT:** `menu-types.ts` (updated), `menu-tokens.ts`, `menu-context.tsx`, `menu-group.tsx`
**OUTPUT:** New file `packages/react/src/ui/menu/vertical-menu.tsx` containing:

- `VerticalMenu`: wraps `MenuProvider` with `open={true}` (always visible), renders a `div`
- `VerticalMenuContent`: renders children as `div` with gap or auto-inserts `VerticalMenuDivider` between `VerticalMenuGroup` children
  - Gap style: `flex flex-col gap-0.5` container
  - Divider style: `flex flex-col` container, `React.Children` iteration to insert `<VerticalMenuDivider />` between groups
  - Auto-injects `index` and `count` props into `VerticalMenuGroup` children (same as `MenuGroup` injects `itemPosition`)
- `VerticalMenuGroup`: thin wrapper or re-export of `MenuGroup`
- `VerticalMenuDivider`: plain `<hr>` with `mx-3 my-0.5 h-px border-0 bg-m3-outline-variant`

**Container classes for `VerticalMenuContent`:**
```
py-2 min-w-28 max-w-[280px] rounded-[4px] elevation-2 overflow-hidden
bg-m3-surface-container-low (standard) | bg-m3-tertiary-container (vibrant)
```

**VERIFY:**
- Component renders without errors
- Gap variant shows 2dp gaps, no dividers
- Divider variant shows `outline-variant` lines between groups
- Shape morphing works on hover

---

#### Task 3: Update `index.ts` exports

- **Agent:** `frontend-specialist`
- **Priority:** P1
- **Dependencies:** Task 2

**INPUT:** `index.ts` (current)
**OUTPUT:** Add exports:
```ts
export type {
  VerticalMenuProps,
  VerticalMenuContentProps,
  VerticalMenuGroupProps,
  VerticalMenuDividerProps,
  VerticalMenuSeparatorStyle,
} from "./menu-types";

export {
  VerticalMenu,
  VerticalMenuContent,
  VerticalMenuGroup,
  VerticalMenuDivider,
} from "./vertical-menu";
```
**VERIFY:** `import { VerticalMenu } from "@bug-on/md3-react"` resolves

---

#### Task 4: Create `vertical-menu-gap-demo.tsx`

- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Dependencies:** Task 3

**INPUT:** Design from user's image 1 (left panel) — rounded card with items separated by gaps
**OUTPUT:** `apps/docs/registry/demos/vertical-menu-gap-demo.tsx`

Demo should show:
- `VerticalMenu` with `colorVariant="standard"`
- `VerticalMenuContent` with `separatorStyle="gap"`
- 2 `VerticalMenuGroup`s
- Items with leading icons, trailing icons, selected state
- Matches image 1 left panel exactly

**VERIFY:** Demo renders correctly in docs site

---

#### Task 5: Create `vertical-menu-divider-demo.tsx`

- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Dependencies:** Task 3

**INPUT:** Design from user's image 1 (right panel) — rounded card with items separated by divider lines
**OUTPUT:** `apps/docs/registry/demos/vertical-menu-divider-demo.tsx`

Demo should show:
- `VerticalMenu` with `colorVariant="standard"`
- `VerticalMenuContent` with `separatorStyle="divider"`
- 2 `VerticalMenuGroup`s separated by a divider
- Same items as gap demo

**VERIFY:** Demo renders correctly in docs site

---

#### Task 6: Update `menus.mdx` docs

- **Agent:** `frontend-specialist`
- **Priority:** P2
- **Dependencies:** Tasks 4, 5

**INPUT:** `apps/docs/content/components/menus.mdx` (current)
**OUTPUT:** Add new section "Vertical Menus" with:
- Brief description
- Two `<ComponentPreview>` for gap and divider demos
- Note on when to use vertical vs dropdown menu

**VERIFY:** Docs page builds and renders both demos

---

#### Task 7: Write tests for new components

- **Agent:** `frontend-specialist` (skills: `testing-patterns`)
- **Priority:** P3
- **Dependencies:** Task 2

**INPUT:** `packages/react/src/ui/menu/menu.test.tsx` (as reference)
**OUTPUT:** Tests appended to `menu.test.tsx` or new `vertical-menu.test.tsx`:

Test cases:
- `VerticalMenu` renders children
- `VerticalMenuContent separatorStyle="gap"` — no divider elements rendered
- `VerticalMenuContent separatorStyle="divider"` — divider `<hr>` elements rendered between groups
- `VerticalMenuGroup` renders with correct `index` and `count` props
- `VerticalMenuDivider` renders an `<hr>` element
- `colorVariant="vibrant"` applies vibrant background classes

**VERIFY:** `pnpm test` passes all new test cases

---

## 🔍 Phase X: Verification Checklist

```
[ ] pnpm build — no TypeScript errors
[ ] pnpm lint — no lint errors
[ ] pnpm test — all tests pass (existing + new)
[ ] Visual check: Gap variant shows 2dp gaps between groups
[ ] Visual check: Divider variant shows outline-variant lines between groups
[ ] Visual check: Shape morphing on hover works for both variants
[ ] Visual check: colorVariant="vibrant" applies tertiary-container background
[ ] Visual check: selected items show check icon + selectedBg color
[ ] Visual check: disabled items show 38% opacity
[ ] Docs: menus.mdx renders new section with both demo previews
[ ] No purple/violet hex codes
[ ] No DropdownMenu.Root / Portal in vertical menu implementations
[ ] Tokens from menu-tokens.ts reused (no hardcoded values)
[ ] All new components have displayName set
[ ] All new types exported from index.ts
[ ] index.ts has no duplicate exports
```

---

## ⚠️ Risk Areas & Mitigations

| Risk | Mitigation |
|---|---|
| `MenuGroup` injects `itemPosition` via `React.cloneElement` — `VerticalMenuGroup` must do the same | Reuse `MenuGroup` directly (no re-implementation) |
| `VerticalMenuContent` needs to auto-count children for `index/count` injection | Use `React.Children.toArray().filter(isValidElement)` pattern from `MenuGroup` |
| `MenuDivider` uses `DropdownMenu.Separator` — breaks in non-Radix context | Create `VerticalMenuDivider` as plain `<hr>` |
| Shape morphing requires `motion/react` `m.div` — ensure import consistency | Use `m` from `motion/react` (not `motion`) as in existing files |
| Docs site registration — `ComponentPreview` requires demo name in registry | Register both demos in the docs registry config |

---

## 📌 Notes

- **No Radix DropdownMenu** primitives in vertical menu — these are static components
- The `MenuProvider` will be used with `open={true}` (permanently open) so `MenuItem` receives the context it needs for `colorVariant`
- `VerticalMenuGroup` can be a direct re-export of `MenuGroup` since the behavior is identical; only the consumer's mental model differs (vertical vs popup)
- This does NOT change any existing Menu (baseline) code — purely additive

---

*Next step: Run `/create` or proceed with implementation task by task.*
