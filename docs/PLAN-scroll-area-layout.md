# Tích hợp ScrollArea cho LayoutWrapper

## Overview
Mục tiêu là sử dụng component `ScrollArea` (từ `packages/react/src/ui/scroll-area.tsx`) trong `LayoutWrapper` (`apps/docs/components/layout/layout-wrapper.tsx`). Điều này nhằm mục đích:
1. Đồng bộ giao diện thanh cuộn (scrollbar) trên toàn bộ các trình duyệt (Chrome, Safari, Firefox) và hệ điều hành.
2. Đảm bảo thanh cuộn được giới hạn bên trong wrapper, không tràn ra khỏi các góc bo tròn (border-radius) của UI, giải quyết vấn đề thẩm mỹ hiện tại.

## Project Type
WEB

## Success Criteria
- [ ] Giao diện `LayoutWrapper` sử dụng `ScrollArea` mà không làm vỡ bố cục hiện tại.
- [ ] Scrollbar không còn sử dụng kiểu native mặc định của OS mà dùng kiểu tuỳ biến từ component `ScrollArea`.
- [ ] Khi cuộn, thanh cuộn vẫn nằm gọn lỏn trong khu vực nội dung (bên trong `lg:rounded-[2.5rem]`).
- [ ] Thanh cuộn tự ẩn/hiện đúng kiểu `type="hover"` hoặc `scroll` theo thiết kế.

## Tech Stack
- React Server/Client Components
- Tailwind CSS (cho styling và xử lý overflow)
- Radix UI (`ScrollArea` internal component)

## File Structure
- `apps/docs/components/layout/layout-wrapper.tsx` (Thay đổi)
- `packages/react/src/ui/scroll-area.tsx` (Tham chiếu, cung cấp module)

## Task Breakdown

### Task 1: Thay thế thẻ scroll mặc định bằng `<ScrollArea>`
- **Agent:** `frontend-specialist`
- **Skills:** `frontend-design`, `react-best-practices`
- **Priority:** P0
- **Dependencies:** Không có
- **INPUT:** `apps/docs/components/layout/layout-wrapper.tsx`
- **OUTPUT:** File `layout-wrapper.tsx` mới. Thay thế className `overflow-y-auto` ở thẻ `<main>` thành overflow ẩn, và bọc inner content bằng component `<ScrollArea>`.
- **VERIFY:** Mở trình duyệt ở `http://localhost:3000`, cuộn trang và xem hiển thị Scrollbar. Scrollbar có bo góc đẹp mắt và không bị đè ra viền của wrapper.

## Phase X: Verification
- [x] Socratic Gate was respected
- [x] Scripts: Chạy `npm run lint && npx tsc --noEmit` thành công
- [x] Scripts: UX audit (không lỗi giao diện trên màn hình lớn và di động)
- [x] Build: `npm run build` không lỗi
- [x] Run & Test: Vận hành mượt mà trên browser thử nghiệm

## ✅ PHASE X COMPLETE
- Lint: ✅ Pass
- Security: ✅ No critical issues
- Build: ✅ Success
- Date: 2026-03-23
