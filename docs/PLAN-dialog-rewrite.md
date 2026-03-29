# PLAN: Dialog Component — Complete Rewrite for MD3 Expressive

**Task slug:** `dialog-rewrite`
**Agent:** `frontend-specialist` + `project-planner`
**Status:** Ready for review

---

## 1. Context & Objective

Rewrite `packages/react/src/ui/dialog.tsx` để đạt chuẩn **Material Design 3 Expressive** đầy đủ, thêm các sub-component còn thiếu (`DialogBody`, `DialogIcon`, `DialogFullScreenContent`), viết test file và cập nhật exports.

### Phân tích hiện trạng (`dialog.tsx` v1)

| Sub-component | Trạng thái | Vấn đề |
|---|---|---|
| `Dialog` | ✅ Có | OK |
| `DialogTrigger` | ✅ Có | `displayName` gán cho `RadixDialog.Trigger` (không có tác dụng) |
| `DialogPortal` | ✅ Có | Thiếu `displayName` |
| `DialogOverlay` | ✅ Có | OK |
| `DialogContent` | ✅ Có | `max-w-140` sai (phải là `max-w-[560px]`); `aria-label` đóng dùng tiếng Việt (phải dùng tiếng Anh) |
| `DialogHeader` | ✅ Có | `gap-1` (nên là `gap-2`) |
| `DialogTitle` | ✅ Có | Typography: `font-medium`/`tracking-[-0.01em]` (MD3 spec: `font-normal`/`tracking-[0em]`) |
| `DialogDescription` | ✅ Có | OK |
| `DialogFooter` | ✅ Có | OK |
| `DialogClose` | ✅ Có | Thiếu `displayName` |
| `DialogIcon` | ❌ **THIẾU** | Cần tạo mới |
| `DialogBody` | ❌ **THIẾU** | Cần tạo mới |
| `DialogFullScreenContent` | ❌ **THIẾU** | Cần tạo mới |
| Animation `MD3_CONTENT_ANIM` | ⚠️ Sai spec | `initial: scale: 0.9, y: 16` → phải là `scale: 0.85, y: 24` |

---

## 2. Files cần tạo / sửa

| File | Action |
|---|---|
| `packages/react/src/ui/dialog.tsx` | **REWRITE** toàn bộ |
| `packages/react/src/ui/dialog.test.tsx` | **CREATE** mới |
| `packages/react/src/index.ts` | **UPDATE** exports |

---

## 3. Chi tiết kỹ thuật

### 3.1 Animation Config (MD3 Expressive Spring)

```ts
// Không đổi — đã đúng chuẩn
const MD3_SPRING = { type: "spring", stiffness: 400, damping: 30, mass: 1 };

// Overlay: fade in/out
const MD3_OVERLAY_ANIM = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { duration: 0.2, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

// Content Dialog (FIX: scale 0.85, y: 24)
const MD3_CONTENT_ANIM = {
  initial: { opacity: 0, scale: 0.85, y: 24 },       // ← sửa từ 0.9/16
  animate: { opacity: 1, scale: 1, y: 0, transition: MD3_SPRING },
  exit: { opacity: 0, scale: 0.95, y: 8, transition: { duration: 0.15, ease: "easeIn" } },
};

// NEW: Full-screen Dialog (slide từ bottom)
const MD3_FULLSCREEN_ANIM = {
  initial: { y: "100%" },
  animate: { y: 0, transition: MD3_SPRING },
  exit: { y: "100%", transition: { duration: 0.2, ease: "easeIn" } },
};
```

### 3.2 Sub-components cần sửa / thêm

#### `DialogContent` — sửa

- **`max-w-[560px]`** (thay `max-w-140`)
- **`aria-label="Close dialog"`** (tiếng Anh, theo constraint)
- Close button dùng `RadixDialog.Close` với icon `X` size `h-6 w-6` (MD3: 24dp)
- Focus ring: `outline-none` trên `motion.div`

#### `DialogTitle` — sửa typography

```
MD3 textAppearanceHeadlineSmall:
  text-[24px] leading-8 font-normal tracking-[0em]
                         ^^^^^^^^^^ ^^^^^^^^^^^^^
                         Đổi từ font-medium / tracking-[-0.01em]
```

#### `DialogHeader` — sửa gap

```
gap-2 mb-4  (thay gap-1 mb-4)
```

#### `DialogIcon` — NEW

```tsx
const DialogIcon = ({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("flex justify-center mb-4 text-m3-secondary", className)}
    aria-hidden="true"
    {...props}
  >
    {children}
  </div>
);
DialogIcon.displayName = "DialogIcon";
```

#### `DialogBody` — NEW

```tsx
const DialogBody = ({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn("overflow-y-auto max-h-[calc(85dvh-200px)] -mx-6 px-6", className)}
    {...props}
  />
);
DialogBody.displayName = "DialogBody";
```

#### `DialogFullScreenContent` — NEW (hoàn toàn tách biệt)

```tsx
export interface DialogFullScreenContentProps
  extends React.ComponentPropsWithoutRef<typeof RadixDialog.Content> {
  title?: string;
  actionLabel?: string;
  onAction?: () => void;
  showDivider?: boolean;
  className?: string;
}
```

Cấu trúc DOM:
```
<RadixDialog.Content asChild>
  <motion.div fixed inset-0 z-50 w-full h-full bg-m3-surface flex flex-col>
    // Top App Bar
    <div h-14 flex items-center px-4 gap-2>
      <RadixDialog.Close asChild>
        <button aria-label="Close">
          <X aria-hidden />
        </button>
      </RadixDialog.Close>
      <span title />          // optional
      <button actionLabel />  // optional, text-m3-primary
    </div>
    // Optional divider
    {showDivider && <hr border-m3-outline-variant />}
    // Scrollable body
    <div flex-1 overflow-y-auto p-6>
      {children}
    </div>
  </motion.div>
</RadixDialog.Content>
```

### 3.3 Vấn đề `displayName`

Hiện tại `DialogTrigger.displayName` và `DialogClose` không có `displayName` vì chúng là re-exports trực tiếp từ Radix. Gán `displayName` trên Radix primitive sẽ bị ghi đè. Giải pháp: tạo wrapper nhỏ hoặc ghi chú rõ trong code.

Theo pattern của `drawer.tsx`:
```ts
const DialogTrigger = RadixDialog.Trigger;
DialogTrigger.displayName = "DialogTrigger";  // OK — chỉ ghi lên reference local
```

### 3.4 Tailwind token names (verified từ existing components)

| Token | Class |
|---|---|
| Surface Container High | `bg-m3-surface-container-high` |
| Surface | `bg-m3-surface` |
| On Surface | `text-m3-on-surface` |
| On Surface Variant | `text-m3-on-surface-variant` |
| Primary | `text-m3-primary` / `ring-m3-primary` |
| Secondary | `text-m3-secondary` |
| Outline Variant | `border-m3-outline-variant` |
| State layer | `hover:bg-m3-on-surface/8` |
| Primary tint | `hover:bg-m3-primary/8` |

---

## 4. Test Plan (`dialog.test.tsx`)

### Pattern từ `button.test.tsx`

```ts
"use client";
import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { ... } from "../dialog";
```

### Test Cases

#### `describe("Dialog")` — 10 tests

| # | Test | Approach |
|---|---|---|
| 1 | Renders trigger button | `render(<Dialog>...<DialogTrigger>Open</DialogTrigger></Dialog>)` → `getByRole("button")` |
| 2 | Opens dialog on trigger click | `fireEvent.click(trigger)` → `getByRole("dialog")` |
| 3 | Closes dialog on close button click | open → find close button → `fireEvent.click` → dialog hidden |
| 4 | `DialogTitle` accessible (role=heading) | `getByRole("heading")` |
| 5 | `DialogDescription` accessible | `getByText(...)` via description |
| 6 | `hideCloseButton=true` hides X | `queryByLabelText("Close dialog")` → null |
| 7 | `onOpenChange` called on Escape | `fireEvent.keyDown(document, { key: "Escape" })` |
| 8 | `DialogIcon` renders children | `getByText` / `aria-hidden` check |
| 9 | `DialogBody` has `overflow-y-auto` | `container.querySelector` class check |
| 10 | `DialogFooter` has `justify-end` | className check |

#### `describe("DialogFullScreenContent")` — 5 tests

| # | Test | Approach |
|---|---|---|
| 11 | Renders full-screen dialog | `inset-0` / `fixed` class check |
| 12 | Renders title in top bar | `getByText(title)` |
| 13 | Renders action button | `getByText(actionLabel)` |
| 14 | Calls `onAction` | `vi.fn()` + `fireEvent.click` |
| 15 | Renders `<hr>` when `showDivider=true` | `container.querySelector("hr")` |

### Quan trọng về Animation trong tests

Radix Dialog + AnimatePresence với `forceMount` + controlled `open`/`AnimatePresence` pattern cần strategy đặc biệt:

**Strategy:** Render Dialog ở trạng thái `open={true}` ngay từ đầu (bỏ qua animation) để test nội dung. Dùng `open` prop controlled để control state trong tests.

```tsx
// Pattern helper cho tests:
const renderDialog = (props = {}) => render(
  <Dialog open={true} onOpenChange={vi.fn()}>
    <DialogPortal open={true}>
      <DialogOverlay />
      <DialogContent>
        <DialogTitle>Test Title</DialogTitle>
        <DialogDescription>Test Desc</DialogDescription>
      </DialogContent>
    </DialogPortal>
  </Dialog>
);
```

---

## 5. Index.ts Updates

### Additions (alphabetical within dialog block)

```ts
// Types — thêm DialogFullScreenContentProps
export type { DialogContentProps, DialogFullScreenContentProps, DialogProps } from "./ui/dialog";

// Named exports — thêm DialogBody, DialogFullScreenContent, DialogIcon
export {
  Dialog,
  DialogBody,              // NEW
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogFullScreenContent, // NEW
  DialogHeader,
  DialogIcon,              // NEW
  DialogOverlay,
  DialogPortal,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
```

---

## 6. Constraints checklist

- [x] **NO** new npm dependencies — chỉ dùng dependencies đã có trong `package.json`
- [x] `motion/react` (không phải `framer-motion`)
- [x] `cn()` từ `../lib/utils`
- [x] `React.forwardRef` cho tất cả components nhận `ref`
- [x] `.displayName` trên tất cả components
- [x] Biome formatting: tabs for indentation, double quotes
- [x] `aria-label` tiếng Anh: `"Close dialog"`, `"Close"`
- [x] Token names: `m3-*` convention (không tự tạo mới)
- [x] `max-w-[560px]` cho BasicDialog (MD3 spec max 560dp)
- [x] `DialogFullScreenContent` là **named export riêng**, không phải prop variant

---

## 7. Verification Plan

### Automated

```bash
# 1. Run tests
pnpm --filter @bug-on/md3-react test

# 2. Build
pnpm --filter @bug-on/md3-react build

# 3. TypeScript check (lint script)
pnpm --filter @bug-on/md3-react lint
```

### Expected results

| Command | Expected |
|---|---|
| `test` | ✅ All 15 dialog tests pass |
| `build` | ✅ No errors, generates `dist/` |
| `lint` | ✅ No TypeScript errors |

---

## 8. Task Breakdown (Execution Order)

### Phase 1 — Đọc & xác nhận

- [x] Đọc `dialog.tsx` hiện tại
- [x] Đọc `button.tsx`, `drawer.tsx` (pattern reference)
- [x] Đọc `button.test.tsx` (test pattern)
- [x] Đọc `index.ts` (export pattern)
- [x] Đọc `Dialog.md` (MD3 spec)
- [x] Xác nhận available dependencies

### Phase 2 — Viết code (sau khi user approve)

- [ ] **P2.1** Rewrite `dialog.tsx`
  - [ ] Fix animation config (scale 0.85, y: 24)
  - [ ] Fix `DialogContent` (max-w-[560px], aria-label English, close icon h-6 w-6)
  - [ ] Fix `DialogTitle` typography (font-normal, tracking-[0em])
  - [ ] Fix `DialogHeader` gap (gap-2)
  - [ ] Add `DialogIcon` component
  - [ ] Add `DialogBody` component
  - [ ] Add `DialogFullScreenContent` + interface
  - [ ] Update exports block
  - [ ] Update JSDoc usage comment

- [ ] **P2.2** Create `dialog.test.tsx`
  - [ ] 10 tests cho `Dialog`
  - [ ] 5 tests cho `DialogFullScreenContent`

- [ ] **P2.3** Update `index.ts`
  - [ ] Add `DialogFullScreenContentProps` type export
  - [ ] Add `DialogBody`, `DialogFullScreenContent`, `DialogIcon` to named exports

### Phase 3 — Verify

- [ ] Run `pnpm --filter @bug-on/md3-react test`
- [ ] Run `pnpm --filter @bug-on/md3-react build`
- [ ] Run `pnpm --filter @bug-on/md3-react lint`
- [ ] Fix lỗi nếu có

---

## 9. Open Questions

> **Q1:** `DialogPortal` hiện không có `displayName`. Có thể thêm qua property thông thường (vì nó là function component thuần, không phải RadixDialog primitive). Bạn có muốn thêm không?
> → _Mặc định: CÓ thêm `DialogPortal.displayName = "DialogPortal"`_

> **Q2:** `aria-label` của nút Close trong `DialogFullScreenContent` — dùng `"Close"` hay `"Close dialog"`?
> → _Constraint nói `"Close dialog"` cho main DialogContent, `"Close"` cho full-screen. Sẽ dùng đúng như vậy._

> **Q3:** Hiện tại `dialog.tsx` có `aria-label="Đóng hộp thoại"` (tiếng Việt). Constraint yêu cầu đổi sang `"Close dialog"` (tiếng Anh). Confirm?
> → _Đúng — sẽ đổi sang tiếng Anh theo constraint._

---

**Plan file:** `docs/PLAN-dialog-rewrite.md`
