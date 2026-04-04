# Thay thế Navigation Rail

## Overview

Sử dụng component `NavigationRail` từ thư viện nội bộ `@bug-on/md3-react` (tương ứng với file `packages/react/src/ui/navigation-rail.tsx`) để thay thế toàn bộ cho file `apps/docs/components/layout/navigation-rail.tsx` hiện đang được custom riêng cho ứng dụng docs. Việc này giúp đồng bộ hóa component của hệ thống MD3 xuyên suốt dự án và giảm bớt code dư thừa.

## Project Type
WEB

## Success Criteria
- [ ] Loại bỏ hoàn toàn component custom `apps/docs/components/layout/navigation-rail.tsx`.
- [ ] Thay thế bằng `NavigationRail` và `NavigationRailItem` từ `@bug-on/md3-react` trực tiếp trong `apps/docs/components/layout/layout-wrapper.tsx` (hoặc tạo một wrapper riêng ở layer trên cùng nếu cần route/state tracking).
- [ ] Giao diện (UX/UI) có cùng chức năng tương đương: Navigation Rail đặt bên trái ở màn hình desktop (`lg` trở lên) và cố định ở đáy màn hình dưới dạng Navigation Bar dành cho mobile (có thể cần ẩn/hiện hoặc dùng component thay thế cho mobile dựa theo chuẩn của thư viện MD3).
- [ ] Highlight đúng item khi URL trên route tương ứng.

## Tech Stack
- React / Next.js app router
- Tailwind CSS / MD3 Design system
- Component nội bộ: `NavigationRail`, `NavigationRailItem` từ `@bug-on/md3-react`

## File Structure
- **[MODIFY]** `apps/docs/components/layout/layout-wrapper.tsx`
- **[DELETE]** `apps/docs/components/layout/navigation-rail.tsx`
- **[NEW]** (Tùy chọn) `apps/docs/components/layout/app-navigation.tsx` (nếu cần tách logic route cho Navigation).

## Task Breakdown

### Task 1: Tích hợp NavigationRail thư viện vào layout web
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`, `clean-code`
- **Priority:** High
- **Dependencies:** None
- **INPUT → OUTPUT:**
  - Input: `NavigationRail` gốc, routing context từ `next/navigation`.
  - Output: Import và sử dụng `NavigationRail` và `NavigationRailItem` vào hệ thống Docs layout. Thiết lập state `active` cho các item dựa trên `usePathname()`. Dùng thẻ `<Link>` của next hoặc truyền handler vào `onClick` cho các item `home`, `get-started`, `components`, `settings`. 
- **VERIFY:** Component render thành công lên UI với component của package library. Click vào các tab phải chuyển trang bình thường.

### Task 2: Đảm bảo responsive Layout cho Mobile và Desktop
- **Agent:** `frontend-specialist`
- **Skill:** `frontend-design`
- **Priority:** Medium
- **Dependencies:** Task 1
- **INPUT → OUTPUT:**
  - Input: Giao diện docs hiện tại render dạng ngang ở cuối màn hình (`bottom-4`) đối với mobile và dạng dọc với Desktop (`lg:w-22`). 
  - Output: Kiểm tra `NavigationRail` của thư viện có hỗ trợ layout dọc/ngang (bottom sheet) không. Nếu thư viện chỉ chuyên dụng cho Rail (dọc desktop), cần bọc nó lại bằng CSS responsive như `hidden lg:flex` và thêm một Navigation Bar / Bottom Navbar ở góc độ layout wrapper để thay thế ở màn hình nhỏ, hoặc custom class thông qua thư viện để đạt được thiết kế tương đương.
- **VERIFY:** Mobile hiện các icon ở bottom, không bị tràn màn hình. Desktop hiện Rail đứng bên trái.

### Task 3: Xóa file component cũ và các tham chiếu thừa
- **Agent:** `orchestrator`
- **Skill:** `clean-code`
- **Priority:** Low
- **Dependencies:** Task 1, Task 2
- **INPUT → OUTPUT:**
  - Input: File `apps/docs/components/layout/navigation-rail.tsx`.
  - Output: Xóa file ra khỏi hệ thống. Dọn dẹp lại `layout-wrapper.tsx` xem có còn import bị thừa không.
- **VERIFY:** Build không bị crash do missing file. Eslint pass hoàn toàn.

## ✅ PHASE X: Verification
- [x] Lint: `npm run lint` & Type check: `npx tsc --noEmit` tại thư mục docs.
- [x] Chạy lệnh build: Thử sinh production build xem Next.js có vướng API hay Client directives không.
- [x] Giao diện (Lighthouse/Mobile test): Đảm bảo các chỉ số về layout shift không bị ảnh hưởng quá nghiêm trọng. Mọi điều hướng ứng dụng hoạt động tốt.
