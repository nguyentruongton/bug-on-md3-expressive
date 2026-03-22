# Plan: MD3 Expressive Button Ripple

## Overview

Kế hoạch thay thế hiệu ứng animation `scale` hiện tại của component Button bằng class `ripple` chuẩn Design System của Material Design 3 Expressive. Phiên bản này ưu tiên trải nghiệm gốc với Framer Motion, bao gồm cắt viền chính xác theo hình dạng morphing và tuân thủ chặt độ tiện dụng (Accessibility / A11y).

## Project Type

**WEB**

## Success Criteria

1.  **Chuyển động (Motion):** Hiệu ứng Ripple lan rộng khi click vào Button, điểm bắt đầu từ tọa độ click chuột (pointer event coordinates).
2.  **Đồng bộ hóa (Morphing Sync):** Lớp Ripple bị giới hạn hình dạng (clipped) bằng `overflow: hidden`, tự động bám theo `border-radius` đang thay đổi qua lại giữa hình Tròn và Vuông (Toggle button).
3.  **Khả năng tiếp cận (Accessibility - a11y):** Tự động vô hiệu hóa Ripple animation nếu thiết bị/hệ điều hành người dùng bật cấu hình chống chóng mặt `prefers-reduced-motion`.

## Tech Stack

-   **React 19 & TypeScript:** Quản lý state tọa độ click và key logic.
-   **Framer Motion (`motion/react`):** Quản lý timing lan tỏa của Ripple và clipping vào component đang thay đổi kích thước.
-   **Tailwind CSS 4.2:** Utility class cho styling (absolute positioning, background màu của ripple, radial mask).

## File Structure

```
packages/react/src/
└── ui/
    ├── button.tsx         # (Update) Gắn custom Ripple component, xoá scale click
    └── ripple.tsx         # [NEW] Custom hook/component bọc hiệu ứng Framer Motion
```

---

## Task Breakdown

### Task 1: Tạo Component `Ripple` (Dựa trên Framer Motion)

-   **Agent:** `frontend-specialist`
-   **Skills:** `frontend-design`, `react-best-practices`
-   **Priority:** P0
-   **Dependencies:** None
-   **INPUT:** Toạ độ click `(x, y)` và `containerRef` của Button.
-   **OUTPUT:** Component `<Ripple />` nhận tọa độ, hiển thị vòng tròn loang dần (`animate={{ scale: 2, opacity: 0 }}`) rồi tự huỷ. Theo tiêu chuẩn a11y, sử dụng hook `useReducedMotion` của Framer Motion để tắt nếu cần.
-   **VERIFY:** Kiểm tra source code (`ripple.tsx`) có dùng `useReducedMotion`. Kiểm tra `AnimatePresence` đảm nhận xoá các thẻ `<span>` sau khi ripple kết thúc. Thẻ `<Ripple>` được bọc bằng `overflow-hidden` và apply dynamic `border-radius`.

### Task 2: Import `<Ripple>` vào Button Component & Áp dụng Shape Morphing

-   **Agent:** `frontend-specialist`
-   **Skills:** `frontend-design`, `react-best-practices`
-   **Priority:** P0
-   **Dependencies:** Task 1
-   **INPUT:** `button.tsx` đang có `whileTap={{ scale: 0.97 }}` và animate `radius`.
-   **OUTPUT:**
    -   Bỏ hiệu ứng `scale` trên `whileTap` thay thành ripple.
    -   Gắn sự kiện `onPointerDown` vào button để sinh `x, y` cho `<Ripple />`.
    -   Gói `<Ripple>` bên trong logic render. Đảm bảo `<Ripple>` được cắt khung (`clipped`) khít 100% với giá trị `border-radius` đang Morphing của viền ngoài Button.
-   **VERIFY:** Khởi chạy server, click component ở dạng `round`, sau khi chuyển `square`, click lại phải thấy Ripple không bị tràn hay lỗi vuông góc. Nhấn liên tục thấy UI phản hồi tốt, không memory leak.

---

## 🟢 PHASE X: FINAL VERIFICATION CHECKLIST

-   [ ] **Lint & Type Check:** Run `cd packages/react && pnpm run lint` & `tsc --noEmit`. Đảm bảo code mới type-safe.
-   [ ] **Accessibility & UX Audit:** Run `python .agent/skills/frontend-design/scripts/accessibility_checker.py .` và `ux_audit.py` để check lại a11y. Test bằng việc OS bật reduced-motion (không nên thấy Ripple).
-   [ ] **Visual Test:** Mở `http://localhost:3000/docs`. Thử 5 variants của nút. Thử nút `Toggle (Saved)`.
-   [ ] Socratic Gate đã được tuân thủ (P0, P1, P2 confirm via user).
-   [ ] No Custom/Generic Template used, only MD3 Expressive.
