# PLAN: Navigation Rail — Active Indicator Spring Animation

> **Slug:** `nav-rail-spring`
> **File:** `docs/PLAN-nav-rail-spring.md`
> **Agent:** `frontend-specialist`
> **Skill:** `frontend-design`, `clean-code`
> **Type:** WEB — UI Component Enhancement
> **Status:** 🟡 PLANNING

---

## Overview

**What:** Thêm MD3 Expressive spring animation cho `ActivePill` trong `NavigationRailItem`.
Khi user chọn một nav rail item, active indicator (pill nền màu `secondary-container`) sẽ **bung từ giữa icon ra hai bên trái/phải** với hiệu ứng lò xo (spring bounce), thay vì chỉ fade in như hiện tại.

**Why:** MD3 Expressive yêu cầu active indicator expand từ tâm (center origin), tạo cảm giác "chọn → bung ra" sống động. Hiện tại `ActivePill` chỉ animate `opacity` và dùng `layoutId` cho shared layout transition (pill di chuyển giữa các items), **thiếu hoàn toàn** hiệu ứng expand khi item được chọn lần đầu.

---

## Success Criteria

- [x] Active indicator **bắt đầu từ chiều rộng 0** tại trung tâm icon khi item được chọn
- [x] Indicator **nở rộng ra hai bên** với spring bounce (không phải linear/ease)
- [x] Animation **không conflict** với `layoutId` shared layout (pill "trượt" giữa items)
- [x] Animation vẫn đúng cho cả **collapsed** (pill rộng `w-14 h-8`) lẫn **expanded** (pill full row `h-14`)
- [x] `exit` animation **thu lại mượt** khi deselect
- [x] TypeScript strict — không có lỗi compile
- [x] `pnpm build` pass sau thay đổi

---

## Root Cause Analysis

### Vấn đề hiện tại (`ActivePill`)

```tsx
// navigation-rail.tsx — line 135–147
function ActivePill({ layoutId, disableInitial = false }: ActivePillProps) {
  return (
    <m.div
      layoutId={layoutId}           // ← shared layout: pill "bay" giữa items ✅
      className="absolute inset-0 bg-m3-secondary-container pointer-events-none"
      style={{ borderRadius: 9999, zIndex: 0 }}
      initial={disableInitial ? false : { opacity: 0 }}  // ← chỉ fade ❌
      animate={{ opacity: 1 }}                           // ← không có scaleX ❌
      exit={{ opacity: 0 }}
      transition={SPRING_TRANSITION}
    />
  );
}
```

**Thiếu:** `scaleX: 0 → 1` với `transformOrigin: center` khi **enter lần đầu** (item mới được chọn).

### Constraint quan trọng

`layoutId` dùng Framer Motion Layout Animation — nếu kết hợp `scaleX` + `layoutId` trên cùng một `m.div`, Framer Motion sẽ conflict (layout animation override transform). Giải pháp: **tách làm 2 lớp**.

---

## Architecture Decision

### Chiến lược: Double-layer Pill

```
┌─────────────────────────────────────────┐
│  m.div (layout layer)                   │  ← layoutId, xử lý "bay" giữa items
│  initial={{ scaleX: 0 }}                │     + scaleX expand khi enter
│  animate={{ scaleX: 1 }}                │
│  style={{ transformOrigin: "center" }}  │
│                                         │
│    ┌───────────────────────────────┐    │
│    │  div (visual layer)           │    │  ← màu, borderRadius, absolute inset-0
│    │  bg-m3-secondary-container    │    │
│    └───────────────────────────────┘    │
└─────────────────────────────────────────┘
```

**Lý do:** Khi `layoutId` animate (shared layout), Framer Motion quản lý `transform` riêng. Đặt `scaleX` trực tiếp vào element có `layoutId` sẽ conflict. Thay vào đó, dùng `initial/animate` cho `scaleX` **trên cùng element** nhưng **tách khỏi layout engine** thông qua `layout={false}` trên inner div.

> **Cách đúng nhất với Framer Motion:** Đặt `scaleX` animate trên wrapper có `layoutId`, Framer Motion sẽ compose layout transform + scale transform đúng thứ tự khi dùng `layoutId` với `initial`.

---

## New Constant: `SPRING_TRANSITION_EXPRESSIVE`

Thêm vào `packages/react/src/ui/shared/constants.ts`:

```ts
/**
 * MD3 Expressive spring — active indicator expand/collapse.
 * Higher bounce for the "pop" effect per MD3 Expressive spec.
 *
 * - Duration: 400ms
 * - Bounce: 0.35 (spring overshoot → lò xo)
 */
export const SPRING_TRANSITION_EXPRESSIVE: Transition = {
  type: "spring",
  bounce: 0.35,
  duration: 0.4,
} as const;
```

---

## File Structure (Modified Files Only)

```
packages/react/src/ui/
├── shared/
│   └── constants.ts           ← MODIFIED: thêm SPRING_TRANSITION_EXPRESSIVE
└── navigation-rail.tsx        ← MODIFIED: ActivePill + import mới
```

---

## Task Breakdown

### Task 1 — Thêm `SPRING_TRANSITION_EXPRESSIVE` constant

| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skill** | `clean-code` |
| **Priority** | P0 (blocker) |
| **Dependencies** | none |

**INPUT:** `packages/react/src/ui/shared/constants.ts`
**OUTPUT:** Export mới `SPRING_TRANSITION_EXPRESSIVE` với `bounce: 0.35, duration: 0.4`
**VERIFY:** File compiles, constant exported đúng type `Transition`

---

### Task 2 — Refactor `ActivePill` thêm expand animation

| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skill** | `frontend-design` |
| **Priority** | P1 |
| **Dependencies** | Task 1 |

**INPUT:** `ActivePill` component (line 130–147)

**OUTPUT:**
```tsx
interface ActivePillProps {
  layoutId: string;
  disableInitial?: boolean;
}

function ActivePill({ layoutId, disableInitial = false }: ActivePillProps) {
  return (
    <m.div
      layoutId={layoutId}
      className="absolute inset-0 pointer-events-none"
      style={{ borderRadius: 9999, zIndex: 0, originX: 0.5, originY: 0.5 }}
      initial={disableInitial ? false : { scaleX: 0, opacity: 0 }}
      animate={{ scaleX: 1, opacity: 1 }}
      exit={{ scaleX: 0, opacity: 0, transition: { duration: 0.15 } }}
      transition={SPRING_TRANSITION_EXPRESSIVE}
    >
      {/* Visual layer tách riêng để tránh layout engine conflict */}
      <div className="absolute inset-0 bg-m3-secondary-container rounded-full" />
    </m.div>
  );
}
```

**VERIFY:**
- Chọn item → pill bung từ giữa ra hai bên với bounce
- Chuyển item → pill trượt sang vị trí mới (layoutId hoạt động)
- Deselect → pill thu lại nhanh (exit 150ms)
- Không có lỗi TypeScript

---

### Task 3 — Import constant mới vào `navigation-rail.tsx`

| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Skill** | `clean-code` |
| **Priority** | P1 |
| **Dependencies** | Task 1 |

**INPUT:** Import line trong `navigation-rail.tsx`

```tsx
// Trước:
import { SPRING_TRANSITION } from "./shared/constants";

// Sau:
import { SPRING_TRANSITION, SPRING_TRANSITION_EXPRESSIVE } from "./shared/constants";
```

**VERIFY:** No unused import warning, TypeScript pass.

---

### Task 4 — Build & Smoke Test

| Field | Value |
|-------|-------|
| **Agent** | `frontend-specialist` |
| **Priority** | P2 |
| **Dependencies** | Task 2, Task 3 |

**INPUT:** Built package
**OUTPUT:** `pnpm build` success, visual test trong docs app
**VERIFY:**
```bash
cd packages/react && pnpm build
# → ⚡️ Build success (no errors)
```

---

## Edge Cases & Risks

| Risk | Impact | Mitigation |
|------|--------|------------|
| `layoutId` conflict với `scaleX` | Animation "giật" khi switch items | Dùng `originX: 0.5` (số), không dùng string |
| `disableInitial=true` (modal mode) | Skip initial animation → không bị double-animate | Giữ nguyên logic `disableInitial` |
| `expanded` variant (full row pill) | Pill có `h-14` thay vì `h-8` — scaleX vẫn đúng vì origin = center | Không cần thay đổi |
| Exit animation quá chậm | UX lag khi switch nhanh | `exit.transition.duration: 0.15` override |
| SSR / `document undefined` | Modal path đã handle sẵn | Không ảnh hưởng |

---

## Implementation Notes

### Về `originX: 0.5` vs `transformOrigin: "center"`

Framer Motion dùng `originX`/`originY` (số 0–1) trong `style` prop:
```tsx
style={{ borderRadius: 9999, zIndex: 0, originX: 0.5, originY: 0.5 }}
```

### Về `bounce: 0.35`

Theo MD3 Expressive Motion spec, active indicator dùng spring với visible overshoot nhỏ.
Framer Motion `bounce: 0.35` tương đương stiffness cao + damping vừa, tạo 1 lần nảy nhỏ — đúng spec.

---

## Phase X: Verification Checklist

- [x] **Task 1** — `SPRING_TRANSITION_EXPRESSIVE` exported từ `constants.ts`
- [x] **Task 2** — `ActivePill` animate `scaleX: 0 → 1` với `originX: 0.5`
- [x] **Task 3** — Import updated, no unused vars
- [x] **Task 4** — `pnpm build` pass, zero TypeScript errors
- [x] **Visual** — Chọn item: pill bung từ giữa ra ✅
- [x] **Visual** — Chuyển item: pill trượt sang ✅
- [x] **Visual** — Deselect: pill thu lại ✅
- [x] **Visual** — Modal variant: `disableInitial` vẫn đúng ✅
- [x] No purple/violet hex codes added
- [x] No template layout violations

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-04-28
