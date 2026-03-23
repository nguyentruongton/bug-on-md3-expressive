# Refactor Core Layout to Expressive Floating Design

## 1. Goal Description
Refactor the current application layout to match a Material 3 Expressive "floating" aesthetic. This involves adding an animated mesh gradient background, constraining the main application layout within a `max-width` container, and updating the Navigation Drawer to toggle its visibility via the Navigation Rail rather than relying solely on page routing. The layout will also be made fully responsive.

## 2. Finalized UX Decisions
- **Gradient Background**: Animated mesh gradient (chuyển động xoay mờ các khối màu lấy cảm hứng từ Material 3 Expressive).
- **Max Width**: Sử dụng container kích thước `max-w-screen-2xl` (khoảng `1536px`) kết hợp padding (gutters) khép kín để bảo đảm tỷ lệ trống 2 bên giống hình mẫu.
- **Mobile Responsive**: 
  - Desktop: Nav Rail bên trái, Drawer đứng cạnh, giao diện nổi.
  - Mobile/Tablet nhỏ: Nav Rail chuyển thành Bottom Navigation Bar. Navigation Drawer chuyển thành dạng Modal Overlay (Side/Bottom Sheet) trượt vào khi bấm nút "Components".
- **Quản lý trạng thái Drawer**: Tích hợp store/context lưu trạng thái đóng/mở qua `localStorage`, nhưng cấu hình chỉ phục hồi trạng thái mở trên Desktop. Thiết bị Mobile sẽ luôn đóng mặc định.

## 3. Proposed Changes

### Background & Global Layout
- **[NEW/MODIFY]** Global Styles / CSS
  - Khai báo các class cho animated mesh gradient (sử dụng `@keyframes` để làm các blob màu di chuyển/xoay mờ).
- **[MODIFY]** `apps/docs/app/layout.tsx` (hoặc file bố cục gốc)
  - Áp dụng gradient background.
  - Bọc ứng dụng trong `max-w-screen-2xl mx-auto h-screen p-4 md:p-6 lg:p-8 flex gap-4`.

### Navigation Rail & Drawer
- **[NEW/MODIFY]** State Manager (`useLayoutStore` hoặc tương tự)
  - Quản lý trạng thái `isDrawerOpen` có config persisted localStorage (lọc màn hình mobile).
- **[MODIFY]** Component `NavRail` / `Sidebar`
  - Đổi logic cho mục "Components": Xóa href cố định, thay bằng onClick kích hoạt `toggleDrawer()`.
  - Responsive: Chuyển Flex hướng dọc (cột) sang ngang, gắn đáy màn hình (Bottom Bar) đối với màn hình nhỏ.
- **[MODIFY]** Component `NavigationDrawer`
  - Biến đổi thành dạng Floating Card (`rounded-[2rem]`, màu nền đục mặt phẳng, padding phù hợp).
  - Responsive: Desktop (Inline Flex Item có thể unmount/thu vào), Mobile (Fixed z-index cao + Backdrop mờ).

### Main Content Area
- **[MODIFY]** Main Page Wrapper / `page.tsx`
  - Đóng gói nội dung trang lại thành một khối nổi (`bg-surface`, `rounded-[2rem]`) hoặc nhiều khối con tùy nội dung, sử dụng flex/grid để scale lấp đầy không gian còn lại.

## 4. Verification Plan
- Chạy hệ thống trên các cỡ màn hình (Mobile, Tablet, Desktop).
- Kiểm tra hiệu ứng Animated Gradient hiển thị mượt mà.
- Kiểm tra trạng thái Drawer: Refresh trang trên Desktop thì tình trạng mở/đóng giữ nguyên; Refresh trên Mobile thì luôn thu gọn.
- Xác nhận nút "Components" tại Nav Rail/Bottom Bar hoạt động đúng nhiệm vụ.
