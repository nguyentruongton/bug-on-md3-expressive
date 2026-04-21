# Plan: Thêm Trigger Button cho Vertical Menu

## 1. Overview
Yêu cầu: Thêm các button trigger để mở `VerticalMenu` (Expressive variant) trong các demo (`menu-full-demo.tsx`, v.v.).
Do `VerticalMenu` hiện tại được thiết kế là một component tĩnh (`isStatic=true`, luôn hiển thị), việc thêm trigger button có thể được thực hiện bằng cách render có điều kiện (conditional rendering) kết hợp với animation, hoặc bọc trong một Popover/Drawer.

## 2. Project Type
**WEB** (Agent: `frontend-specialist`)

## 3. Success Criteria
- [x] Demo `menu-full-demo.tsx` (và các demo liên quan) có button "Toggle Vertical Menu".
- [x] Khi click vào button, `VerticalMenu` hiển thị hoặc ẩn đi một cách mượt mà.
- [x] Không làm ảnh hưởng đến cấu trúc và shape morphing (bo góc) của `VerticalMenu`.

## 4. Tech Stack
- React (`useState`, conditionally render)
- Framer Motion (`AnimatePresence` cho hiệu ứng mở/đóng nếu cần)
- `@bug-on/md3-react` (`Button`, `VerticalMenu`)

## 5. Phase 0: Socratic Gate (Câu hỏi xác nhận)
Trước khi tiến hành code, cần làm rõ các điểm sau:
1. **Cơ chế hiển thị (Behavior):** Bạn muốn `VerticalMenu` xuất hiện dưới dạng **Popover/Dropdown** (nổi lên trên các nội dung khác) hay chỉ đơn giản là **Toggle ẩn/hiện** ngay trên luồng layout của trang (như một collapsible section)?
2. **Hiệu ứng (Animation):** Bạn có muốn thêm hiệu ứng mở rộng/thu gọn (expand/collapse) khi click trigger button không, hay chỉ cần xuất hiện tức thì?

## 6. Task Breakdown

### Task 1: Cập nhật `menu-full-demo.tsx`
- **Agent:** `frontend-specialist`
- **Input:** File `apps/docs/registry/demos/menu-full-demo.tsx`.
- **Output:** Thêm state `isOpen` và `Button` trigger. Bọc `VerticalMenu` trong điều kiện hiển thị.
- **Verify:** Nút trigger hoạt động ổn định, `VerticalMenu` hiển thị đúng gap/divider khi được mở.

### Task 2: Cập nhật các demo khác (nếu cần)
- **Agent:** `frontend-specialist`
- **Input:** File `apps/docs/registry/demos/menu-submenu-demo.tsx` (nếu có chứa Vertical Menu).
- **Output:** Thêm logic trigger tương tự như Task 1.
- **Verify:** Demo hoạt động đồng nhất.

## 7. Phase X: Verification
- [x] **Lint:** `npm run lint` không có lỗi.
- [x] **UX Audit:** Trigger button tuân thủ M3 accessibility (ví dụ: `aria-expanded`).
- [x] **Build:** Đảm bảo docs build thành công.

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-04-20
