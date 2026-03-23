# Kế Hoạch: Tối ưu Layout Shift cho Button & Button Group

## 🎯 Mục tiêu
Hạn chế tối đa hiện tượng Layout Shift (nhảy/giật khung hình) khi nội dung của Button thay đổi (ví dụ: Icon tự động xuất hiện khi nút chuyển trạng thái `selected`), hướng tới chuẩn Animation "Expressive" của Material Design 3.

## 📝 Yêu cầu đã chốt (Socratic Gate Answers)
1. **Space Handling**: (1C) Sử dụng Framer Motion `layout` để animate chiều rộng (Width) một cách mượt mà thay vì giật cục.
2. **Text / Overflow Handling**: (2) Cho phép scroll ngang (Horizontal Scroll) đối với ButtonGroup khi không đủ không gian bề ngang (Mobile), giữ nguyên vẹn nội dung text.
3. **Scope**: (3B) Cập nhật tận gốc tại lõi `Button` component để tất cả nơi sử dụng Button đều hưởng lợi, kết hợp tinh chỉnh container của `ButtonGroup` để hỗ trợ scoll.

---

## 🛠️ Task Breakdown (Phân tách Công việc)

### Phase 1: Refactor Lõi `Button` Component (Scope 3B & 1C)
- Bọc nội dung của `Button` (Icon và Text) bằng các phần tử `motion.span` hoặc `motion.div`.
- Thiết lập thuộc tính `layout` trên wrapper `motion.button` để component bên ngoài nhường chỗ mượt mà.
- Áp dụng `AnimatePresence` kết hợp `initial={{ width: 0, opacity: 0, originX: 0 }}`, `animate={{ width: "auto", opacity: 1 }}`, `exit={{ width: 0, opacity: 0 }}` cho phần Icon. Nhờ vậy, thay vì icon "nhảy" vào chiếm ~24px vị trí ngay lập tức, không gian sẽ được mở rộng/thu hẹp từ từ.
- Đảm bảo animation mới không bị xung đột với `whileTap` và `border-radius` overrides hiện có.

### Phase 2: Cập nhật `ButtonGroup` (Scope 2)
- Thêm thiết lập CSS classes cho thẻ container `fieldset` để cho phép cuộn ngang màn hình khi container bị bóp hẹp (`overflow-x-auto`, `max-w-full`).
- Ẩn thanh cuộn hệ thống (áp dụng class tiện ích Tailwind ẩn scrollbar như `scrollbar-none` / `[&::-webkit-scrollbar]:hidden`) để UI luôn mượt mà và Clean.
- Thiết lập `flex-shrink-0` cho các nút con (nếu cần thiết) để Button không bị bóp méo chữ do flexbox, buộc container phải cuộn.

### Phase 3: Kiểm chứng & Hoàn thiện (Verification)
- Chạy lại bài kiểm tra tự động (Unit Tests) để xác nhận không làm hỏng tính năng Morphing Corners & Gap của ButtonGroup.
- Test trực quan trên Docs Page (Thử thay đổi kích thước cửa sổ Browser để test Scroll ngang).
- Verify xem hiệu ứng thụt/thò icon khi Toggle nút có tạo ra trải nghiệm vật lý tự nhiên của MD3 hay không.

## 👥 Assignees
- Quy hoạch: `@project-planner`
- Code thực thi: `@frontend-specialist`, `@orchestrator`
