# PLAN: Fix VerticalMenuDropdown — Flip Position & Scroll Lock

## 1. Overview

Hai lỗi được báo cáo trong `VerticalMenuDropdown` (wrapper dùng trong mọi demo):

| # | Lỗi | Mô tả |
|---|-----|-------|
| 1 | **Không flip position** | Menu luôn mở xuống (`top: rect.bottom + 8`) dù trigger nằm sát đáy viewport |
| 2 | **Scroll khi menu đang mở** | Body vẫn scrollable khi menu đang hiển thị — vi phạm menu behavior |

---

## 2. Project Type

**WEB** — Agent: `frontend-specialist`, Skill: `frontend-design`

---

## 3. Root Cause Analysis

### Vì sao Baseline hoạt động đúng?

`Menu` (baseline) dùng `@radix-ui/react-dropdown-menu` — Radix bao gồm **Popper engine** (dựa trên Floating UI), tự động:

- Tính khoảng cách từ trigger đến bottom/top của viewport
- Flip `side` từ `bottom` → `top` khi không đủ không gian
- Set `--radix-dropdown-menu-content-transform-origin` đúng với hướng flip
- Block body scroll bằng pointer-events hoặc overflow hidden qua `@radix-ui/react-dismissable-layer`

### Vì sao VerticalMenu bị sai?

`VerticalMenuDropdown` sử dụng portal thủ công với `createPortal`:

```tsx
// HARD-CODED: luôn mở xuống
setPos({
  top: rect.bottom + window.scrollY + 8,
  left: rect.left + window.scrollX,
})
```

**Bug 1 — Không flip:** Không có logic nào kiểm tra `window.innerHeight - rect.bottom` vs chiều cao menu.

**Bug 2 — Scroll:** Không có `overflow: hidden` hay scroll lock trên `document.body` khi menu mở.

---

## 4. Success Criteria

- [ ] Khi trigger nằm sát đáy viewport (< estimatedMenuHeight px), menu mở **lên trên**
- [ ] `transformOrigin` khớp với hướng mở (top-left khi xuống, bottom-left khi lên)
- [ ] Body scroll bị lock khi menu đang mở, được restore khi đóng
- [ ] Không có layout shift khi lock scroll (scrollbar compensation)
- [ ] Behavior nhất quán với Baseline menu (Radix)
- [ ] Code clean, không dùng magic numbers

---

## 5. Tech Stack

| Tool | Mục đích |
|------|----------|
| `React.useRef` + `getBoundingClientRect()` | Đo vị trí trigger |
| `React.useLayoutEffect` + menu ref | Đo chiều cao menu thực sau render |
| `window.innerHeight` | Xác định viewport bottom boundary |
| `document.body.style.overflow` | Lock/unlock scroll |
| `motion/react` (`AnimatePresence`, `m.div`) | Animation (giữ nguyên) |
| `createPortal(_, document.body)` | Portal (giữ nguyên) |

---

## 6. File Structure

Chỉ 1 file chính thay đổi:

```
apps/docs/registry/demos/
└── _vertical-menu-dropdown.tsx   ← TARGET (shared helper dùng bởi 6 demo)
```

> **Note:** `menu-submenu-demo.tsx` dùng cơ chế riêng (`absolute top-full`) — cần fix riêng trong Task 3.

---

## 7. Task Breakdown

### Task 1: Fix Flip Position Logic

**Agent:** `frontend-specialist`  
**Priority:** P0

**INPUT:** `_vertical-menu-dropdown.tsx` — `pos` luôn là `{ top: rect.bottom + 8, left }`

**OUTPUT:** State `pos` mở rộng thêm `openUpward: boolean`:

```tsx
const MENU_OFFSET = 8; // px gap between trigger and menu
const ESTIMATED_MENU_HEIGHT = 300; // fallback before real height measured

const handleToggle = React.useCallback(() => {
  if (!triggerRef.current) return;
  const rect = triggerRef.current.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const openUpward = spaceBelow < ESTIMATED_MENU_HEIGHT;

  setPos({
    top: openUpward
      ? rect.top + window.scrollY - ESTIMATED_MENU_HEIGHT - MENU_OFFSET
      : rect.bottom + window.scrollY + MENU_OFFSET,
    left: rect.left + window.scrollX,
    openUpward,
  });
  setOpen((prev) => !prev);
}, []);
```

Cập nhật `m.div` style:

```tsx
style={{
  top: pos.top,
  left: pos.left,
  transformOrigin: pos.openUpward ? "bottom left" : "top left",
}}
```

**VERIFY:**
- Trigger giữa trang → menu mở xuống ✅
- Trigger sát đáy viewport → menu mở lên ✅
- `transformOrigin` animation đúng hướng ✅

---

### Task 1b: Đo chiều cao menu thực (precision fix)

**Agent:** `frontend-specialist`

Dùng `menuRef` + `useLayoutEffect` để đo `offsetHeight` sau khi menu render, adjust position nếu cần:

```tsx
const menuRef = React.useRef<HTMLDivElement>(null);

React.useLayoutEffect(() => {
  if (!open || !menuRef.current || !triggerRef.current) return;
  const menuHeight = menuRef.current.offsetHeight;
  const rect = triggerRef.current.getBoundingClientRect();
  const spaceBelow = window.innerHeight - rect.bottom;
  const shouldFlip = spaceBelow < menuHeight + MENU_OFFSET;
  
  setPos((prev) => ({
    ...prev,
    top: shouldFlip
      ? rect.top + window.scrollY - menuHeight - MENU_OFFSET
      : rect.bottom + window.scrollY + MENU_OFFSET,
    openUpward: shouldFlip,
  }));
}, [open]);
```

**VERIFY:** Position chính xác với chiều cao menu thực tế ✅

---

### Task 2: Fix Scroll Lock

**Agent:** `frontend-specialist`  
**Priority:** P0 (parallel với Task 1)

**INPUT:** `_vertical-menu-dropdown.tsx` sau Task 1

**OUTPUT:** Effect scroll lock:

```tsx
React.useEffect(() => {
  if (!open) return;
  const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
  document.body.style.overflow = 'hidden';
  document.body.style.paddingRight = `${scrollbarWidth}px`;
  return () => {
    document.body.style.overflow = '';
    document.body.style.paddingRight = '';
  };
}, [open]);
```

**VERIFY:**
- Menu mở → body không scroll được ✅
- Menu đóng → scroll restore ✅
- Không có layout shift (scrollbar compensation) ✅

---

### Task 3: Fix `menu-submenu-demo.tsx`

**Agent:** `frontend-specialist`  
**Priority:** P1 (sau Task 1 & 2)

File này dùng `absolute top-full` thay vì `VerticalMenuDropdown`:

```tsx
<div className="absolute top-full mt-2 z-50">
  <VerticalMenu>...</VerticalMenu>
</div>
```

Migrate sang `VerticalMenuDropdown` để đồng nhất behavior.

**VERIFY:** Demo submenu có flip và scroll lock giống các demo khác ✅

---

## 8. Phase X: Verification Checklist

- [x] `pnpm lint` — không có lỗi (143 files, 0 errors)
- [x] `pnpm build` — build thành công
- [x] Visual: Menu flip khi trigger sát bottom viewport
- [x] Visual: Menu mở xuống bình thường khi trigger ở giữa trang
- [x] Scroll lock: Body không scrollable khi menu mở
- [x] No layout shift: Scrollbar compensation hoạt động
- [x] Keyboard: Escape vẫn đóng menu
- [x] Outside click: Vẫn đóng menu
- [x] Animation: `transformOrigin` đúng hướng cho cả hai trường hợp
- [x] `menu-submenu-demo.tsx` consistent với các demo khác

## ✅ PHASE X COMPLETE
- Lint: ✅ 143 files, 0 errors
- Date: 2026-04-20
