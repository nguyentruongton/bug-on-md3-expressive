# PLAN: NavigationRail Component — MD3 Expressive React

## Overview

Triển khai component `NavigationRail` hoàn chỉnh, production-ready cho thư viện React UI MD3 Expressive (`packages/react/`).

Component bao gồm 3 variant:
- **`collapsed`** — icon-only rail (96dp, mặc định trên màn hình mid-size)
- **`expanded`** — icon + label (220–360dp, giống nav drawer)
- **`modal`** — expanded nhưng overlay nội dung kèm backdrop

---

## Project Type

**WEB** — Package React/TypeScript trong monorepo, agent: `frontend-specialist`

---

## Success Criteria

- [ ] Component render đúng spec MD3 Expressive (3 variant)
- [ ] Token design từ Kotlin source được map chính xác sang Tailwind `m3-*`
- [ ] Animation sử dụng Framer Motion (LazyMotion + domMax + m.*), không import motion trực tiếp
- [ ] Keyboard navigation đầy đủ (ArrowUp/Down, Home, End, Space, Enter)
- [ ] Accessibility WCAG 2.1 AA: role="navigation", aria-current="page", aria-label, TouchTarget
- [ ] 15+ test cases pass trong navigation-rail.test.tsx
- [ ] Build TypeScript thành công — npx tsc --noEmit
- [ ] Ripple clip đúng theo indicator shape (overflow-hidden)
- [ ] Exports đầy đủ trong index.ts

---

## Tech Stack

| Thành phần | Công nghệ | Lý do |
|---|---|---|
| Framework | React 18 + TypeScript strict | Codebase existing |
| Styling | Tailwind CSS v4 + m3-* tokens | Pattern từ button/fab/chip |
| Animation | motion/react — LazyMotion + domMax | Codebase rule — không dùng motion.* |
| Variants | cva (class-variance-authority) | Pattern từ button.tsx |
| State | SPRING_TRANSITION, SPRING_TRANSITION_FAST | Từ ./shared/constants |
| Ripple | Ripple, useRippleState | Từ ./ripple |
| Touch | TouchTarget | Từ ./shared/touch-target |
| Utils | cn | Từ ../lib/utils |

---

## Design Token Mapping (Kotlin → Tailwind)

### Collapsed Tokens (NavigationRailCollapsedTokens.kt)

```
ContainerWidth = 96dp → w-24 (6rem)
NarrowContainerWidth = 80dp → w-20 (5rem)
TopSpace = 44dp → pt-[2.75rem]
ItemVerticalSpace = 4dp → gap-y-1
ContainerColor = Surface → bg-m3-surface
```

### Expanded Tokens (NavigationRailExpandedTokens.kt)

```
ContainerWidthMinimum = 220dp → min-w-[13.75rem]
ContainerWidthMaximum = 360dp → max-w-[22.5rem]
TopSpace = 44dp → pt-[2.75rem]
ModalContainerColor = SurfaceContainer → bg-m3-surface-container
ModalContainerShape = CornerLarge → rounded-r-[var(--m3-shape-corner-large)]
```

### Baseline Item Tokens (NavigationRailBaselineItemTokens.kt)

```
ActiveIndicatorLeadingSpace = 16dp → mx-4 (px-4)
ActiveIndicatorShape = CornerFull → rounded-full
ContainerHeight = 64dp → h-16
ContainerVerticalSpace = 6dp → py-[0.375rem]
HeaderSpaceMinimum = 40dp → min-h-10
IconSize = 24dp → size-6
```

### Vertical Item Tokens (NavigationRailVerticalItemTokens.kt)

```
ActiveIndicatorHeight = 32dp → h-8
ActiveIndicatorWidth = 56dp → w-14
IconLabelSpace = 4dp → gap-y-1 (label below icon)
LabelTextFont = LabelMedium → text-xs font-medium tracking-wide
```

### Horizontal Item Tokens (NavigationRailHorizontalItemTokens.kt)

```
ActiveIndicatorHeight = 56dp → h-14
IconLabelSpace = 8dp → gap-x-2 (label beside icon)
FullWidthLeadingSpace = 16dp → px-4
LabelTextFont = LabelLarge → text-sm font-medium tracking-wide
```

### Color Tokens (NavigationRailColorTokens.kt)

```
ItemActiveIcon = OnSecondaryContainer → text-m3-on-secondary-container
ItemActiveIndicator = SecondaryContainer → bg-m3-secondary-container
ItemActiveLabelText = Secondary → text-m3-secondary
ItemInactiveIcon = OnSurfaceVariant → text-m3-on-surface-variant
ItemInactiveLabelText = OnSurfaceVariant → text-m3-on-surface-variant
State layers = OnSecondaryContainer → currentColor ripple (12% opacity)
```

---

## File Structure

```
packages/react/src/ui/
├── navigation-rail.tsx       ← [NEW] Component chính
├── navigation-rail.test.tsx  ← [NEW] Test suite
packages/react/src/
└── index.ts                  ← [MODIFY] Thêm exports
```

---

## Architecture Decisions

### 1. Context Pattern

Context chia sẻ `variant` và `alwaysShowLabel` từ `NavigationRail` xuống `NavigationRailItem` mà không cần prop drilling.

### 2. Keyboard Navigation

Sử dụng roving tabindex pattern với `useRef<Array<HTMLButtonElement | null>>([])` tại container. Xử lý ArrowUp/Down, Home, End tại container level.

### 3. Indicator Animation (Vertical)

Animate `width` bằng spring (0 → 3.5rem) thay vì `scaleX` để tránh lệch positioning khi clip:
```
animate={{ width: selected ? '3.5rem' : 0, opacity: selected ? 1 : 0 }}
transition={SPRING_TRANSITION}
```

### 4. Label Visibility Logic

| Trạng thái | alwaysShowLabel=true | alwaysShowLabel=false |
|---|---|---|
| Selected | Hiện | Hiện |
| Inactive | Hiện | Ẩn (AnimatePresence exit) |

### 5. Modal Animation

Backdrop fade-in + Rail slide từ trái dùng `AnimatePresence` bọc cả hai:
```
Backdrop: initial={{ opacity: 0 }} → animate={{ opacity: 1 }}
Rail: initial={{ x: '-100%' }} → animate={{ x: 0 }}
Transition: SPRING_TRANSITION
```

---

## Task Breakdown

### TASK-01: Tokens + Types + CVA + Context

**Agent:** frontend-specialist | **Skills:** frontend-design, clean-code
**Priority:** P0 — Blocker cho tất cả

**INPUT:** Kotlin token files + spec
**OUTPUT:**
- Constants: COLLAPSED_TOKENS, EXPANDED_TOKENS, VERTICAL_ITEM_TOKENS, HORIZONTAL_ITEM_TOKENS, COLOR_TOKENS
- NavigationRailContext với { variant, alwaysShowLabel }
- CVA: navigationRailVariants
- Types: NavigationRailVariant, NavigationRailItemProps, NavigationRailProps

**VERIFY:** npx tsc --noEmit không lỗi, types khớp spec

---

### TASK-02: NavigationRailItem — Collapsed (Vertical Layout)

**Agent:** frontend-specialist | **Skills:** frontend-design, clean-code
**Priority:** P1

**INPUT:** TASK-01
**OUTPUT:**
- Vertical layout: indicator pill w-14 h-8, icon centered
- Label bên dưới với AnimatePresence (opacity + y fade)
- Ripple + useRippleState, overflow-hidden
- TouchTarget, aria-current="page", aria-hidden icon
- Animate width: 0 → 3.5rem khi selected

**VERIFY:**
- Ripple clip đúng pill shape
- aria-current="page" khi selected
- Label hiện/ẩn theo alwaysShowLabel

---

### TASK-03: NavigationRailItem — Expanded (Horizontal Layout)

**Agent:** frontend-specialist | **Skills:** frontend-design, clean-code
**Priority:** P1.5

**INPUT:** TASK-02
**OUTPUT:**
- Conditional rendering khi variant='expanded'
- Horizontal: flex-row, icon left + label right, gap-x-2
- Indicator full-height h-14, rounded-full
- Label: text-sm font-medium tracking-wide

**VERIFY:** Đúng layout trong expanded mode, indicator height 56dp

---

### TASK-04: NavigationRail Container + Keyboard Navigation

**Agent:** frontend-specialist | **Skills:** frontend-design, clean-code
**Priority:** P2

**INPUT:** TASK-02, TASK-03
**OUTPUT:**
- nav element: role="navigation", aria-label
- Header slot (pt-[2.75rem]), footer slot
- Keyboard nav: ArrowUp/Down, Home, End, Space/Enter
- Collapsed: w-24 / w-20 (narrow)
- Expanded: min-w-[13.75rem] max-w-[22.5rem]
- overflow-y-auto

**VERIFY:**
- ArrowDown di chuyển focus item 0 → 1 → 2
- Home/End focus đúng
- nav có role="navigation"

---

### TASK-05: Modal Variant

**Agent:** frontend-specialist | **Skills:** frontend-design, clean-code
**Priority:** P2

**INPUT:** TASK-04
**OUTPUT:**
- AnimatePresence bao backdrop + rail
- Backdrop: fixed inset-0 bg-black/40 z-40, click → onClose()
- Rail: fixed left-0 top-0 h-full z-50, slide từ trái
- rounded-r-[var(--m3-shape-corner-large)]
- shadow-lg (Level2 elevation)

**VERIFY:**
- Backdrop render khi open=true
- onClose() gọi khi click backdrop
- Slide-in animation từ trái

---

### TASK-06: Test Suite (navigation-rail.test.tsx)

**Agent:** frontend-specialist | **Skills:** testing-patterns, clean-code
**Priority:** P3

**INPUT:** Component hoàn chỉnh từ TASK-01 đến TASK-05
**OUTPUT:** 15+ test cases:

1. Smoke test — render không crash
2. alwaysShowLabel=true → label hiện cho inactive
3. alwaysShowLabel=false → label ẩn khi inactive
4. selected item → label hiện dù alwaysShowLabel=false
5. onClick callback được gọi
6. disabled → onClick không gọi
7. aria-current="page" trên selected item
8. ArrowDown di chuyển focus
9. ArrowUp di chuyển focus
10. Space/Enter select item
11. modal variant → backdrop render khi open=true
12. modal onClose → gọi khi click backdrop
13. collapsed → width class chính xác
14. expanded → min/max width classes
15. narrow prop → w-20 thay vì w-24

**VERIFY:** pnpm test packages/react — tất cả pass

---

### TASK-07: Cập nhật index.ts — Exports

**Agent:** frontend-specialist | **Skills:** clean-code
**Priority:** P3 (parallel với TASK-06)

**INPUT:** index.ts hiện tại
**OUTPUT:**
```typescript
// NavigationRail — MD3 Expressive
export type {
  NavigationRailItemProps,
  NavigationRailProps,
  NavigationRailVariant,
} from './ui/navigation-rail';
export {
  NavigationRail,
  NavigationRailItem,
} from './ui/navigation-rail';
```

**VERIFY:** Import từ package hoạt động, tsc không error

---

## Dependency Graph

```
TASK-01 (Types + Tokens)
    ↓
TASK-02 (Item - Collapsed)
    ↓
TASK-03 (Item - Expanded)
    ↓
TASK-04 (Container + Keyboard)
    ↓
TASK-05 (Modal)
    ↓
TASK-06 (Tests) ─── TASK-07 (Exports) [parallel]
```

---

## Rủi Ro & Giải Pháp

| Rủi ro | Mức độ | Giải pháp |
|---|---|---|
| LazyMotion wrap conflict | Medium | Mỗi component wrap riêng theo pattern fab.tsx |
| overflow-hidden clip animation | Medium | Dùng width animation thay vì scaleX |
| Keyboard roving tabindex | High | querySelectorAll('[role="menuitem"]') tại container |
| Modal z-index conflict | Low | Document z-40/z-50 rõ trong JSDoc |

---

## Verification Plan

### Automated
```bash
# Type check
cd packages/react && npx tsc --noEmit

# Unit tests
cd packages/react && npx vitest run --reporter=verbose

# Build
cd packages/react && pnpm build
```

### Manual
- Visual: 3 variants trong docs site
- Keyboard: Tab, ArrowUp/Down, Home, End, Space, Enter
- Ripple: click item → clip đúng pill
- Modal: open/close animation từ trái

---

## Open Questions

> [!IMPORTANT]
> **Q1 — Keyboard Pattern:** Roving tabindex (`tabIndex={0 | -1}`) vs `onKeyDown` tại container? Roving tabindex chuẩn ARIA hơn nhưng phức tạp hơn. Tôi sẽ implement roving tabindex theo chuẩn ARIA APG Navigation Menu pattern.

> [!NOTE]
> **Q2 — Badge Component:** Spec đề cập `badge?: React.ReactNode` nhưng không có `Badge` component sẵn. Render như `<span className="...">` đơn giản, consumer tự style.

> [!NOTE]
> **Q3 — Icon Fill:** Khi `selected=true`, nên tự động set `fontVariationSettings: "'FILL' 1"` trên icon container không? Sẽ implement như inline style trên icon wrapper khi selected.
