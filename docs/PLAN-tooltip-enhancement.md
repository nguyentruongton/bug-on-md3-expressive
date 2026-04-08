# Cải thiện Tooltip & Sửa lỗi Rich Tooltip

## 1. Mục tiêu
- **Tính năng mới**: Thêm tuỳ chọn (props: `showDelay`, `hideDelay`) cho phép nhà phát triển tùy chỉnh thời gian hiện và ẩn của tooltip.
- **Sửa lỗi**: Khắc phục tình trạng Rich Tooltip (chứa action button) bị ẩn đi ngay lập tức khi chuột rời khỏi neo (anchor) chưa kịp thao tác lên tooltip.

## 2. Các file cần thay đổi
1. `packages/react/src/ui/tooltip/tooltip.types.ts`
   - [MODIFY] Thêm `showDelay` và `hideDelay` (kiểu `number`, tuỳ chọn) vào `TooltipBoxProps`.
2. `packages/react/src/ui/tooltip/tooltip-box.tsx`
   - [MODIFY] Thêm các refs quản lý timeout cho việc ẩn (`hideTimeoutRef`).
   - [MODIFY] Cập nhật event `handlePointerEnter`/`handlePointerLeave` trên `anchor` để dùng `showDelay` và `hideDelay`.
   - [MODIFY] Gắn thêm event `onPointerEnter`/`onPointerLeave` trên mảng `motion.div` chứa tooltip để huỷ ẩn khi người dùng dùng chuột trỏ vào nội dung tooltip (hỗ trợ Rich Tooltip).

## 3. Quá trình kiểm tra (Verification)
- Mở trang Docs hoặc Storybook chứa Rich Tooltip. Di chuột vào vùng `anchor`, sau đó di chuột dọc theo hướng Tooltip. Xác nhận Tooltip không bị ẩn.
- Thử nghiệm nhấp chuột vào action button bên trong Rich Tooltip.
- Tuỳ chỉnh thời gian `showDelay=1000` và `hideDelay=500` để kiểm tra độ chính xác của props mới.

## 4. Các câu hỏi mở (Open Questions)
*Chờ người dùng làm rõ trước khi bắt đầu.*
