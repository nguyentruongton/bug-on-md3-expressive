# PLAN: MD3 Expressive Menu — Full Port & Enhancement
> **Slug:** `menu-md3-expressive`  
> **Path:** `docs/PLAN-menu-md3-expressive.md`  
> **Type:** WEB (React component library)  
> **Agent:** `frontend-specialist`  
> **Created:** 2026-04-18

---

## 📋 Overview

### What
Port the Android MD3 Expressive Menu system to React TypeScript, bringing:
1. **Faithful color tokens** — correct CSS variables from `StandardMenuTokens`, `VibrantMenuTokens`, `ListTokens`
2. **Shape morphing** — `CornerLarge → CornerSmall` on hover for groups; `CornerExtraSmall ↔ CornerMedium` on selected for items
3. **Container open/close animation** — `scale(0.8→1)` + `opacity(0→1)` from anchor transform-origin using `FastSpatial`
4. **Leading icon expand/collapse animation** — only for check icon (selectable items), not for static icons
5. **Selected item container color animation** — smooth CSS transition on background-color
6. **AnimatePresence** — wrap `MenuContent` properly so exit animation plays

### Why
Current implementation has 6 specific gaps versus the Android Kotlin source:
- **Gap 1:** Spring values not precisely MD3 (`FastSpatial` ≠ current values)
- **Gap 2:** Regular `leadingIcon` animates width on menu open (should be static)
- **Gap 3:** Exit animation may be cut off by Radix unmounting before `m.div` exit plays
- **Gap 4:** `supportingText` color hardcoded, ignores vibrant variant token
- **Gap 5:** Selected container color changes are instant (no `animateColorAsState`)
- **Gap 6:** Minor cleanup — `rounded-sm` hardcoded instead of named constant

---

## ✅ Success Criteria

| # | Criterion | Measured By |
|---|-----------|-------------|
| 1 | Container open: scale 0.8→1, opacity 0→1, FastSpatial spring | Visual test |
| 2 | Container close: exit animation plays BEFORE unmount | Visual test |
| 3 | Group hover: borderRadius morphs to position-correct active shape | Hover test |
| 4 | Item selected: borderRadius morphs to `CornerMedium(12px)` | Click test |
| 5 | Item selected: bg color fades (not instant swap) | Visual test |
| 6 | Regular `leadingIcon` does NOT animate on menu open | Static icon test |
| 7 | All color tokens match Kotlin tokens exactly | Token audit |
| 8 | `pnpm build` → 0 TypeScript errors | Build |
| 9 | All existing tests pass | `pnpm test` |

---

## 🔍 Current Gaps Analysis

### Gap 1 — Animation spring values
**Current:** `stiffness: 300, damping: 25, mass: 0.8`  
**MD3 FastSpatial:** `spring(stiffness=380, dampingRatio=0.7)` → Framer: `stiffness:380, damping:28`  
**MD3 FastEffects:** `duration=150ms, FastOutLinearIn` → Framer: `duration:0.15, ease:[0.4,0,1,1]`

### Gap 2 — Leading icon animates on every open
**Current:** Regular `leadingIcon` uses `CHECK_ICON_VARIANTS` with `initial="hidden"` → width animates 0→20 on open  
**Android:** Regular icons are static; only check icon (selected state change) expands horizontally  

### Gap 3 — AnimatePresence missing for exit
**Current:** `m.div` inside `DropdownMenu.Content` has exit variants but no `AnimatePresence` at portal level  
**Fix:** Use Radix `forceMount` + top-level `AnimatePresence` driven by `open` state from context

### Gap 4 — supportingText color
**Current:** `text-m3-on-surface-variant` hardcoded for both variants  
**Android VibrantMenuTokens:** `ItemSupportingTextColor = OnTertiaryContainer`

### Gap 5 — Container color transition
**Current:** Class swap is instant (Tailwind conditional class)  
**Android:** `animateColorAsState` with `FastEffects` (150ms)

### Gap 6 — Hardcoded `rounded-sm`
**Current:** `menu.tsx` MenuContent has `rounded-sm` inline  
**Fix:** Extract as `MENU_CONTAINER_SHAPE = "rounded-[4px]"` constant in `menu-tokens.ts`

---

## 🏗️ Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Components | React 18 + TypeScript | Existing |
| Animation | `motion/react` (Framer Motion v11) | Already used |
| Primitives | `@radix-ui/react-dropdown-menu` | Already used |
| Styling | Tailwind CSS v4 + CSS variables | Existing |

---

## 📁 Files to Modify

```
packages/react/src/ui/menu/
├── menu-animations.ts   ← UPDATE spring values (Gap 1)
├── menu-tokens.ts       ← ADD supportingTextColor, MENU_CONTAINER_SHAPE (Gap 4, 6)
├── menu-item.tsx        ← FIX icon animation split (Gap 2), FIX color tokens (Gap 4, 5)
├── menu.tsx             ← FIX AnimatePresence + forceMount (Gap 3), fix rounded-sm (Gap 6)
├── menu-context.tsx     ← ADD open state to context (needed for Gap 3)
└── menu.test.tsx        ← ADD tests for new behavior
```

---

## 📌 Task Breakdown

### T1 — Fix Animation Spring Values
**Agent:** `frontend-specialist` | **Priority:** P0 | **Dependencies:** None

**INPUT:** `menu-animations.ts` current spring values  
**OUTPUT:** Updated with MD3-accurate FastSpatial and FastEffects values  
**VERIFY:** Menu open animation feels snappy-spring, close is quick fade

```ts
// FAST_SPATIAL_SPRING (menu-animations.ts)
{ type: "spring", stiffness: 380, damping: 28, mass: 1 }
// FAST_EFFECTS_TRANSITION (exit transitions)
{ duration: 0.15, ease: [0.4, 0, 1, 1] }
```

- [ ] T1.1: Update `MENU_CONTAINER_VARIANTS` visible (FastSpatial) and exit (FastEffects)
- [ ] T1.2: Update `GROUP_SHAPE_SPRING` to FastSpatial
- [ ] T1.3: Update `CHECK_ICON_VARIANTS` enter/exit
- [ ] T1.4: Update `SUBMENU_CONTAINER_VARIANTS`

---

### T2 — Fix AnimatePresence for Exit Animation
**Agent:** `frontend-specialist` | **Priority:** P0 | **Dependencies:** None

**INPUT:** `menu.tsx`, `menu-context.tsx`  
**OUTPUT:** `MenuContext` exposes `open: boolean`; `MenuContent` uses `forceMount` + `AnimatePresence`  
**VERIFY:** Close menu → scale+opacity exit plays before unmount

Approach (Radix forceMount pattern):
1. Add `open` / `onOpenChange` to `MenuContext`
2. `Menu` root forwards these to `DropdownMenu.Root` and `MenuContext`
3. `MenuContent`: add `forceMount` to `DropdownMenu.Content`
4. Wrap `m.div` with `<AnimatePresence>` conditional on `open` from context

- [ ] T2.1: Add `open?: boolean; onOpenChange?: (open: boolean) => void` to `MenuContext`
- [ ] T2.2: Update `Menu` root to pass `open`/`onOpenChange` to both context and Radix Root
- [ ] T2.3: In `MenuContent`: add `forceMount`, wrap `m.div` with `<AnimatePresence>`
- [ ] T2.4: Drive `AnimatePresence` with `open` from `useMenuContext()`

---

### T3 — Fix Leading Icon Static Render (non-selectable items)
**Agent:** `frontend-specialist` | **Priority:** P1 | **Dependencies:** T1

**INPUT:** `menu-item.tsx` — all leading icons animated  
**OUTPUT:** Only check icon (selected state) uses width animation; regular icon is static  
**VERIFY:** Non-selectable item with `leadingIcon` → no animation on menu open/close

Logic split:
- `selected !== undefined` (selectable item): use `AnimatePresence mode="wait"` to swap between check ↔ user icon
- `selected === undefined` (static item with icon): render icon without `variants`, `initial`, or `animate`

- [ ] T3.1: Add `isSelectable` flag (`selected !== undefined`)
- [ ] T3.2: Static path: render `leadingIcon` in plain `<span>` with fixed width, no motion variants
- [ ] T3.3: Selectable path: keep existing `AnimatePresence` + `CHECK_ICON_VARIANTS`

---

### T4 — Add Color Tokens & Fix Vibrant Supporting Text
**Agent:** `frontend-specialist` | **Priority:** P1 | **Dependencies:** None

**INPUT:** `menu-tokens.ts`, `menu-item.tsx`  
**OUTPUT:** Complete color token objects; supporting/trailing text uses correct token  
**VERIFY:** Vibrant menu → `supportingText` is `text-m3-on-tertiary-container`

Token additions to `menu-tokens.ts`:

| New Key | Standard | Vibrant |
|---------|----------|---------|
| `supportingTextColor` | `text-m3-on-surface-variant` | `text-m3-on-tertiary-container` |
| `trailingSupportingTextColor` | `text-m3-on-surface-variant` | `text-m3-on-tertiary-container` |
| `MENU_CONTAINER_SHAPE` | `"rounded-[4px]"` | (global) |

- [ ] T4.1: Add `supportingTextColor` and `trailingSupportingTextColor` to `STANDARD_COLORS` and `VIBRANT_COLORS`
- [ ] T4.2: Add `MENU_CONTAINER_SHAPE = "rounded-[4px]"` constant
- [ ] T4.3: Update `menu-item.tsx` supporting text span to use `colors.supportingTextColor`
- [ ] T4.4: Update `menu.tsx` to replace `"rounded-sm"` with `MENU_CONTAINER_SHAPE`

---

### T5 — Add Selected Container Color Transition
**Agent:** `frontend-specialist` | **Priority:** P1 | **Dependencies:** T1

**INPUT:** `menu-item.tsx` instant class swap for selected bg  
**OUTPUT:** CSS transition on background-color (150ms, FastOutLinearIn)  
**VERIFY:** Click to select → bg fades from `surface-container-low` to `tertiary-container`

Approach: Add `transition-colors` + `duration-150` Tailwind classes to the item `div`. This matches Android's `animateColorAsState` with `FastEffects` (150ms).

- [ ] T5.1: Add `"transition-colors duration-150 ease-in"` to MenuItem div className
- [ ] T5.2: Verify no conflict with `transition-[border-radius]` (both can coexist via `transition-[border-radius,background-color]`)
- [ ] T5.3: Consolidate into single `transition-[border-radius,background-color] duration-150 ease-in`

---

### T6 — Cleanup & Constants
**Agent:** `frontend-specialist` | **Priority:** P2 | **Dependencies:** T1–T5

- [ ] T6.1: Remove dead code after icon animation split
- [ ] T6.2: Update all JSDoc comments in affected files
- [ ] T6.3: Verify `MENU_POPUP_PADDING_Y` used in `menu.tsx` (already is ✓)
- [ ] T6.4: Run `pnpm lint` and fix any warnings

---

### T7 — Update Tests
**Agent:** `test-engineer` | **Priority:** P2 | **Dependencies:** T1–T6

- [ ] T7.1: Test: non-selectable item with `leadingIcon` → no `data-initial` on icon span
- [ ] T7.2: Test: vibrant menu → `supportingText` has `text-m3-on-tertiary-container` class
- [ ] T7.3: Test: selectable item `selected=true` → check icon renders
- [ ] T7.4: Run all tests → 0 failures

---

### T8 — Final Build & Verification
**Priority:** P3 | **Dependencies:** All

- [ ] T8.1: `pnpm build` → success
- [ ] T8.2: `pnpm test` → all pass
- [ ] T8.3: Visual review — open/close animation, hover shapes, selection states
- [ ] T8.4: `pnpm lint` → 0 errors

---

## 📐 Design Token Reference

### Animation Springs

| Token | Framer Motion |
|-------|--------------|
| FastSpatial | `{ type:"spring", stiffness:380, damping:28, mass:1 }` |
| FastEffects | `{ duration:0.15, ease:[0.4,0,1,1] }` |

### Shape Values

| MD3 Token | px |
|-----------|-----|
| CornerExtraSmall | 4px |
| CornerSmall | 8px |
| CornerMedium | 12px |
| CornerLarge | 16px |

### Group Shape Mapping

| Position | Active Shape | Inactive Shape |
|----------|-------------|----------------|
| standalone | `"16px"` (CornerLarge all) | `"8px"` (CornerSmall) |
| leading | `"16px 16px 8px 8px"` | `"8px"` |
| middle | `"8px"` | `"8px"` |
| trailing | `"8px 8px 16px 16px"` | `"8px"` |

### Item Shape Mapping

| Position | Unselected | Selected |
|----------|-----------|---------|
| leading | `"12px 12px 4px 4px"` | `"12px"` |
| middle | `"4px"` | `"12px"` |
| trailing | `"4px 4px 12px 12px"` | `"12px"` |
| standalone | `"4px"` | `"12px"` |

---

## ⚠️ Risks

| Risk | Likelihood | Mitigation |
|------|-----------|------------|
| Radix unmounts before exit animation finishes | High | `forceMount` + `AnimatePresence` |
| Spring values feel different on web vs Android | Medium | Tune after visual review |
| `transition-[border-radius,background-color]` Tailwind syntax | Low | Use inline `style` if Tailwind purges |

---

## 🔗 Dependency Graph

```
T1 (Springs) ────┐
T2 (Presence) ───┤──→ T6 (Cleanup) ──→ T7 (Tests) ──→ T8 (Build)
T3 (Icon anim) ──┤
T4 (Tokens) ─────┤
T5 (Color trans) ┘
```

T1, T2, T3, T4, T5 → **Parallel**  
T6 → after T1–T5  
T7 → after T6  
T8 → after T7

---

## 🏁 Phase X — Final Verification

- [ ] `pnpm build` → 0 errors
- [ ] `pnpm test` → all pass  
- [ ] `pnpm lint` → 0 errors
- [ ] Menu open animation: FastSpatial spring ✓
- [ ] Menu close animation: exit plays before unmount ✓
- [ ] Group hover: shape morphs smoothly ✓
- [ ] Item selected: borderRadius + color fade ✓
- [ ] Regular `leadingIcon` does NOT animate on open ✓
- [ ] Vibrant `supportingText` = `text-m3-on-tertiary-container` ✓
- [ ] No hardcoded `rounded-sm` in `menu.tsx` ✓
- [ ] No purple/violet hex codes ✓
