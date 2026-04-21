# PLAN: Menu Architecture Redesign — Unified API + ContextMenu

## 1. Overview

Redesign toàn bộ Menu system để:
1. **Unified API**: `variant="baseline|expressive"` thay cho `menuVariant` 
2. **Menu family** (dropdown): button, text field, icon trigger → `@radix-ui/react-dropdown-menu`
3. **ContextMenu family** (right-click): → `@radix-ui/react-context-menu` (mới)
4. `VerticalMenu` (static list) giữ nguyên, không thay đổi

---

## 2. Project Type

**WEB — Library (UI component library)**  
Agent: `frontend-specialist`, Skill: `frontend-design`, `clean-code`

---

## 3. Root Cause / Motivation

| Problem | Current State | Target State |
|---------|--------------|--------------|
| VerticalMenu không có positioning | Manual `VerticalMenuDropdown` | `Menu variant="expressive"` dùng Radix DropdownMenu |
| Không có right-click support | ❌ Không có | `ContextMenu` family mới |
| `menuVariant` prop naming | `menuVariant="baseline\|expressive"` | `variant="baseline\|expressive"` |
| `isStatic` không rõ ràng | Boolean flag | `menuPrimitive="dropdown\|context\|static"` trong context |

---

## 4. Architecture Decision

### menuPrimitive — trái tim của thiết kế mới

```
MenuContext.menuPrimitive: "dropdown" | "context" | "static"
```

`MenuItem` đọc `menuPrimitive` từ context để chọn đúng Radix primitive:

```
dropdown → DropdownMenu.Item / CheckboxItem / RadioItem
context  → ContextMenu.Item / CheckboxItem / RadioItem  
static   → Slot (hiện tại isStatic=true)
```

### Component Families

```
Menu (dropdown popup)
├── MenuTrigger          ← DropdownMenu.Trigger
├── MenuContent          ← DropdownMenu.Content (variant="baseline|expressive")  
├── MenuGroup            ← unchanged
├── MenuItem             ← switches on menuPrimitive
├── MenuDivider          ← unchanged
└── SubMenu              ← DropdownMenu.Sub (unchanged)

ContextMenu (right-click)
├── ContextMenuTrigger   ← ContextMenu.Trigger
├── ContextMenuContent   ← ContextMenu.Content (variant="baseline|expressive")
├── ContextMenuGroup     ← re-export MenuGroup (same component)
├── ContextMenuItem      ← re-export MenuItem (reads context, picks ContextMenu.Item)
└── ContextMenuDivider   ← re-export MenuDivider (unchanged)

VerticalMenu (static, unchanged)
├── VerticalMenuContent
├── VerticalMenuGroup
└── VerticalMenuDivider
```

### Expressive MenuContent — visual

Khi `variant="expressive"`, `MenuContent` render **VerticalMenuContent structure** bên trong `DropdownMenu.Content`:

```tsx
// variant="baseline" → plain list, 4px corners
// variant="expressive" → MenuGroup với shape morphing
```

Không tạo lại component mới — tái sử dụng `MenuGroup` + `MenuItem` visual logic đã có.

---

## 5. API Surface (New vs Old)

### Menu (dropdown) — Breaking change

```tsx
// OLD
<Menu menuVariant="baseline" colorVariant="standard">
  <MenuTrigger asChild><Button /></MenuTrigger>
  <MenuContent>...</MenuContent>
</Menu>

// NEW
<Menu variant="baseline" colorVariant="standard">
  <MenuTrigger asChild><Button /></MenuTrigger>
  <MenuContent>...</MenuContent>
</Menu>

// NEW — Expressive popup (replaces VerticalMenuDropdown hack)
<Menu variant="expressive" colorVariant="standard">
  <MenuTrigger asChild><Button /></MenuTrigger>
  <MenuContent>
    <MenuGroup>
      <MenuItem>Edit</MenuItem>
    </MenuGroup>
  </MenuContent>
</Menu>
```

### ContextMenu — New family

```tsx
<ContextMenu variant="baseline">
  <ContextMenuTrigger asChild>
    <div onContextMenu={...}>Right-click me</div>
  </ContextMenuTrigger>
  <ContextMenuContent>
    <ContextMenuItem>Copy</ContextMenuItem>
    <ContextMenuItem>Paste</ContextMenuItem>
  </ContextMenuContent>
</ContextMenu>
```

---

## 6. File Structure

### Files to MODIFY

```
packages/react/src/ui/menu/
├── menu-context.tsx       ← Add menuPrimitive, rename isStatic → menuPrimitive="static"
├── menu-types.ts          ← Rename menuVariant→variant, add ContextMenu types, menuPrimitive type
├── menu.tsx               ← Rename menuVariant prop → variant; add "expressive" MenuContent support
├── menu-item.tsx          ← Switch on menuPrimitive for Radix primitive selection
└── sub-menu.tsx           ← Guard: only works with menuPrimitive="dropdown"
```

### Files to CREATE

```
packages/react/src/ui/menu/
└── context-menu.tsx       ← ContextMenu, ContextMenuTrigger, ContextMenuContent
```

### Files to UPDATE (exports)

```
packages/react/src/ui/menu/index.ts   ← Export new ContextMenu family
packages/react/src/index.ts           ← Export ContextMenu* types + components
packages/react/package.json           ← Add @radix-ui/react-context-menu dependency
```

### Demo Files to MIGRATE

```
apps/docs/registry/demos/
├── menu-basic-demo.tsx          ← menuVariant → variant
├── menu-icons-demo.tsx
├── menu-selection-demo.tsx
├── menu-grouped-demo.tsx
├── menu-supporting-text-demo.tsx
├── menu-full-demo.tsx
├── menu-submenu-demo.tsx
└── _vertical-menu-dropdown.tsx  ← DELETE (replaced by Menu variant="expressive")
```

---

## 7. Task Breakdown

---

### Task 0: Install dependency

**Agent:** `frontend-specialist`  
**Priority:** P0 — blocker

```bash
pnpm add @radix-ui/react-context-menu --filter @bug-on/md3-react
```

**INPUT:** `packages/react/package.json` không có `@radix-ui/react-context-menu`  
**OUTPUT:** Dependency installed, lockfile updated  
**VERIFY:** `pnpm build` không báo module not found

---

### Task 1: Update `menu-context.tsx` — Replace `isStatic` with `menuPrimitive`

**Agent:** `frontend-specialist`  
**Priority:** P0 — all other tasks depend on this

**Changes:**
- Rename `isStatic: boolean` → `menuPrimitive: "dropdown" | "context" | "static"`
- `MenuProvider`: accept `menuPrimitive` prop, default `"dropdown"`
- `useMenuContext()`: return `menuPrimitive` instead of `isStatic`
- Internal backward-compat: `isStatic` computed getter `menuPrimitive === "static"` (để `MenuGroup` không cần sửa ngay)
- Rename `menuVariant` → `variant` trong context

**VERIFY:** TypeScript compiles, no `isStatic` references broken

---

### Task 2: Update `menu-types.ts` — Rename + New Types

**Agent:** `frontend-specialist`  
**Priority:** P0

**Changes:**
- `MenuVariant`: giữ nguyên type `"baseline" | "expressive"`
- `MenuProps`: rename `menuVariant?: MenuVariant` → `variant?: MenuVariant`
- Add `menuPrimitive` to internal context type (not public prop)
- Add new types: `ContextMenuProps`, `ContextMenuTriggerProps`, `ContextMenuContentProps`

**VERIFY:** All imports in menu files still resolve

---

### Task 3: Update `menu-item.tsx` — menuPrimitive switching

**Agent:** `frontend-specialist`  
**Priority:** P1 (after Task 1)

**Core change:** Replace `isStatic || isSubTrigger` gate with `menuPrimitive` switching:

```tsx
import * as ContextMenu from "@radix-ui/react-context-menu";

const ItemPrimitive =
  menuPrimitive === "static" || isSubTrigger
    ? Slot
    : menuPrimitive === "context"
      ? (isCheckbox
          ? ContextMenu.CheckboxItem
          : isRadio
            ? ContextMenu.RadioItem
            : ContextMenu.Item) as React.ElementType
      : (isCheckbox  // "dropdown" (default)
          ? DropdownMenu.CheckboxItem
          : isRadio
            ? DropdownMenu.RadioItem
            : DropdownMenu.Item) as React.ElementType;
```

**Props mapping:** Both DropdownMenu and ContextMenu items share identical prop APIs (`disabled`, `onSelect`, `checked`, `value`) — no extra branching needed.

**ARIA handling for static:** Keep existing logic (Slot + manual role/aria-checked)

**VERIFY:** MenuItem works in all 3 contexts (dropdown, context, static) — unit tests pass

---

### Task 4: Update `menu.tsx` — `variant` prop + Expressive MenuContent

**Agent:** `frontend-specialist`  
**Priority:** P1 (after Tasks 1-2)

**Changes to `Menu` root:**
- Rename `menuVariant` prop → `variant` (default: `"baseline"`)
- Pass `menuPrimitive="dropdown"` to `MenuProvider`
- Keep `colorVariant` unchanged

**Changes to `MenuContent`:**
- Add `variant` reading from context
- When `variant="expressive"`: render with `VerticalMenuContent`-style container (rounded-2xl, elevation-2) inside `DropdownMenu.Content`
- When `variant="baseline"`: current behavior unchanged

```tsx
// Expressive MenuContent container:
// rounded-2xl, bg, elevation-2, overflow-hidden (or visible for SubMenu)
// transformOrigin from --radix-dropdown-menu-content-transform-origin ← auto flip!
```

**Key benefit:** `DropdownMenu.Content` handles ALL positioning — flip, collision detection, scroll lock, transformOrigin. No more manual `VerticalMenuDropdown` needed.

**VERIFY:**
- `variant="baseline"` renders exactly as before ✅  
- `variant="expressive"` opens as popup with auto-flip ✅

---

### Task 5: Create `context-menu.tsx`

**Agent:** `frontend-specialist`  
**Priority:** P1 (parallel with Task 4)

**New file:** `packages/react/src/ui/menu/context-menu.tsx`

**Components:**

```tsx
// ContextMenu root — wraps @radix-ui/react-context-menu Root
// Provides MenuContext with menuPrimitive="context"
export function ContextMenu({ variant, colorVariant, children }: ContextMenuProps)

// ContextMenuTrigger — wraps ContextMenu.Trigger
export const ContextMenuTrigger

// ContextMenuContent — wraps ContextMenu.Content with MD3 styling
// variant="baseline" → same styling as MenuContent baseline
// variant="expressive" → expressive shape container
export const ContextMenuContent
```

**Re-exports** (same components, just aliased):
```tsx
export { MenuGroup as ContextMenuGroup }
export { MenuItem as ContextMenuItem }
export { MenuDivider as ContextMenuDivider }
export { SubMenu as ContextMenuSubMenu }  // ContextMenu.Sub exists in Radix ✅
```

> **Note:** `@radix-ui/react-context-menu` has the same Sub/SubTrigger/SubContent API as DropdownMenu. SubMenu needs minor update (Task 6).

**VERIFY:** Right-click triggers menu, positioning auto-handles by Radix

---

### Task 6: Update `sub-menu.tsx` — Support ContextMenu primitive

**Agent:** `frontend-specialist`  
**Priority:** P2 (after Task 5)

**Changes:**
- Read `menuPrimitive` from context
- When `menuPrimitive === "context"`: use `ContextMenu.Sub / SubTrigger / SubContent`
- When `menuPrimitive === "dropdown"`: current behavior (unchanged)
- When `menuPrimitive === "static"`: throw dev warning (SubMenu not supported in static)

**VERIFY:** Nested submenus work in both dropdown and context menu contexts

---

### Task 7: Update `index.ts` — Exports

**Agent:** `frontend-specialist`  
**Priority:** P2 (after Tasks 4-5)

**Export new:**
```ts
export {
  ContextMenu,
  ContextMenuTrigger, 
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuDivider,
} from "./ui/menu/context-menu";

export type {
  ContextMenuProps,
  ContextMenuTriggerProps,
  ContextMenuContentProps,
} from "./ui/menu/menu-types";
```

**VERIFY:** `pnpm build` — 0 errors, all exports visible in dist

---

### Task 8: Migrate demo files

**Agent:** `frontend-specialist`  
**Priority:** P3 (after library builds)

**Per file:**
- Replace `menuVariant="baseline"` → `variant="baseline"`
- Replace `VerticalMenuDropdown` + `VerticalMenu` → `Menu variant="expressive"`
- Delete `_vertical-menu-dropdown.tsx`
- Add one new demo showcasing `ContextMenu`

**VERIFY:** `pnpm dev` — all demos render correctly, no console errors

---

## 8. Migration Guide (for consumers)

```tsx
// BEFORE
<Menu menuVariant="baseline">...</Menu>

// AFTER  
<Menu variant="baseline">...</Menu>

// BEFORE — Expressive popup (via VerticalMenuDropdown hack)
<VerticalMenuDropdown trigger={<Button />}>
  <VerticalMenu><VerticalMenuContent>...</VerticalMenuContent></VerticalMenu>
</VerticalMenuDropdown>

// AFTER — Clean expressive popup
<Menu variant="expressive">
  <MenuTrigger asChild><Button /></MenuTrigger>
  <MenuContent>
    <MenuGroup><MenuItem>Edit</MenuItem></MenuGroup>
  </MenuContent>
</Menu>
```

---

## 9. Non-goals (out of scope)

- `VerticalMenu` static component → NOT changed (still works for sidebar/nav use cases)
- `ContextMenu` SubMenu → implemented but basic (no hover delay needed for context menus)
- Mobile context menu (long press) → separate task

---

## 10. Phase X: Verification Checklist

- [ ] `pnpm build` — 0 TS errors, 0 warnings
- [ ] `pnpm biome check` — 0 lint errors  
- [ ] `Menu variant="baseline"` renders identically to before (visual regression)
- [ ] `Menu variant="expressive"` opens as popup with auto-flip ✅
- [ ] `ContextMenu` opens on right-click ✅
- [ ] `MenuItem selected` animation works in all 3 primitive contexts
- [ ] `SubMenu` works in `variant="expressive"` dropdown
- [ ] `SubMenu` works in `ContextMenu`
- [ ] `VerticalMenu` (static) unchanged — no visual regression
- [ ] All demo files migrated, `_vertical-menu-dropdown.tsx` deleted
- [ ] `pnpm test` — existing tests pass
