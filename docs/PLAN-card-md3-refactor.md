# PLAN: Card Component – MD3 Expressive Refactor

- **File target:** `packages/react/src/ui/card.tsx`
- **Phân loại task:** COMPLEX CODE
- **Agent:** `frontend-specialist`
- **Slug:** `card-md3-refactor`

---

## Phase 1: Analysis

### Trạng thái hiện tại

File `card.tsx` hiện chỉ có 39 dòng, thiếu:
- Static vs Interactive routing (`div` vs `button`/`a`)
- Đúng MD3 design tokens (ko dùng `bg-m3-surface-container-high` cho cả 3 variant)
- Disabled state với opacity + pointer-events-none
- Animation elevation qua `motion`
- Ripple effect
- A11y đầy đủ (`aria-disabled`, `tabIndex`, v.v.)

### Token Mapping (Kotlin → Tailwind)

| Kotlin Token | Tailwind class |
|---|---|
| `ElevatedCard.ContainerColor = SurfaceContainerLow` | `bg-m3-surface-container-low` |
| `FilledCard.ContainerColor = SurfaceContainerHighest` | `bg-m3-surface-container-highest` |
| `OutlinedCard.ContainerColor = Surface` | `bg-m3-surface` |
| `OutlinedCard.OutlineColor = OutlineVariant` | `border-m3-outline-variant` |
| `ElevationTokens.Level0` | `elevation-0` (shadow-none) |
| `ElevationTokens.Level1` | `elevation-1` |
| `ElevationTokens.Level2` | `elevation-2` |
| `DisabledContainerOpacity = 0.38f` | Nội dung: `opacity-[0.38]` |
| `DisabledOutlineOpacity = 0.12f` | Border: `opacity-[0.12]` |

### Elevation Spec (từ `Elevation.kt`)

| Variant | Rest | Hover | Pressed/Focus |
|---|---|---|---|
| **Elevated** | Level 1 | Level 2 | Level 1 |
| **Filled** | Level 0 | Level 1 | Level 0 |
| **Outlined** | Level 0 | Level 1 | Level 0 |

Animation: incoming `120ms FastOutSlowIn`, outgoing `150ms` CubicBezier(0.40, 0, 0.60, 1)

---

## Phase 2: Planning

### Task Breakdown

- [ ] **T1** – Cập nhật `cardVariants` (cva): fix token classes cho 3 variant
- [ ] **T2** – Định nghĩa `ELEVATION_SHADOWS` map (Level0/1/2 → box-shadow CSS string)
- [ ] **T3** – Tạo `useCardElevation(variant)` hook: trả về `{ defaultShadow, hoverShadow, pressedShadow }`
- [ ] **T4** – Định nghĩa `CardProps` interface theo spec (bao gồm `disabled`, `interactive`, `href`)
- [ ] **T5** – Implement component logic: `isInteractive` flag, routing sang `m.button`/`m.a`/`div`
- [ ] **T6** – Integrate `Ripple` cho interactive card (theo mẫu `button.tsx`)
- [ ] **T7** – Implement disabled state: `pointer-events-none`, `aria-disabled`, opacity
- [ ] **T8** – A11y: `tabIndex={0}`, `role="button"` (nếu cần), `aria-disabled`
- [ ] **T9** – Viết unit tests: `card.test.tsx`
- [ ] **T10** – Chạy type check và test suite

### Dependencies

```
button.tsx (mẫu dùng LazyMotion + Ripple)
ripple.tsx (Ripple, RippleOrigin types)
lib/utils.ts (cn helper)
motion/react (m, LazyMotion, domMax)
```

---

## Phase 3: Solutioning

### Architecture

```
CardProps {
  variant?: "elevated" | "filled" | "outlined"
  disabled?: boolean
  interactive?: boolean   // Force interactive dù không có onClick
  href?: string           // Render as <a>
  onClick?: ...           // Auto-detects interactive
}

isInteractive = !!onClick || !!href || !!interactive

→ Static:      <div> (no motion, no ripple)
→ has href:    <LazyMotion><m.a href={href}> + Ripple
→ has onClick: <LazyMotion><m.button> + Ripple

Disabled:
  - pointer-events-none
  - aria-disabled="true"
  - Opacity: container 38%, border (outlined) 12%
  - Elevation → Level 0

Motion:
  animate={{ boxShadow: defaultShadow }}
  whileHover={{ boxShadow: hoverShadow }}
  whileTap={{ boxShadow: pressedShadow }}
  transition={{ boxShadow: { duration: 0.12, ease: [0.4, 0, 0.2, 1] } }}
```

---

## Phase 4: Implementation

### File Changes

| File | Action |
|---|---|
| `packages/react/src/ui/card.tsx` | MODIFY – refactor toàn bộ |
| `packages/react/src/ui/card.test.tsx` | NEW – unit tests |

### Note về `asChild`

`@radix-ui/react-slot` **chưa có** trong `package.json`. 
Prop `asChild` sẽ **không** được implement trong lần này để tránh thêm dependency.

---

## Verification Checklist

### Tự động

```bash
# Type check
pnpm --filter @bug-on/md3-react lint

# Test suite  
pnpm --filter @bug-on/md3-react test
```

### Unit Tests cần viết (`card.test.tsx`)

| # | Test | Assertion |
|---|---|---|
| 1 | Static card (không có onClick/href/interactive) | Render `div`, không có `tabIndex` |
| 2 | Interactive card (có `onClick`) | Render element với `tabIndex={0}` |
| 3 | Link card (có `href`) | Render `<a>` với `href` attribute |
| 4 | `interactive` prop forced | Render với `tabIndex={0}` dù không có `onClick` |
| 5 | Disabled card | `aria-disabled="true"`, class `pointer-events-none` |
| 6 | `elevated` variant token | Class `bg-m3-surface-container-low` |
| 7 | `filled` variant token | Class `bg-m3-surface-container-highest` |
| 8 | `outlined` variant token | Class `bg-m3-surface`, `border-m3-outline-variant` |

