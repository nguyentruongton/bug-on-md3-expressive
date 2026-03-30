# Phân Tích & Kế Hoạch Chỉnh Sửa Border Radius Cho FAB (MD3 Expressive)

## 1. Phân Tích Vấn Đề
Dựa vào tài liệu Material Design 3 (MD3) Expressive và mã nguồn hiện tại trong `packages/react/src/ui/fab.tsx`:

- **Chuẩn MD3 Expressive**:
  - MD3 không còn sử dụng hình tròn hoàn hảo (fully rounded / pill shape) cho các Floating Action Button mặc định nữa.
  - Thay vào đó, FAB sử dụng hình chữ nhật bo góc (Rounded Rectangle).
  - Cụ thể:
    - **Small FAB** (40x40): Radius chuẩn là **12dp**.
    - **Regular/Standard FAB** (56x56): Radius chuẩn là **16dp**.
    - **Large FAB** (96x96): Radius chuẩn là **28dp**.

- **Thực Trạng Trong Code** (`MORPH_RADIUS` ở dòng code ~94):
  - `sm`: default 20 (tức 40/2 = tròn 100%)
  - `md`: default 28 (tức 56/2 = tròn 100%)
  - `lg`: default 48 (tức 96/2 = tròn 100%)
  - `xl`: default 68 (tức 136/2 = tròn 100%)

=> **Kết luận**: Nhận định của bạn là chính xác tuyệt đối. Hiện tại code đang set mặc định component FAB là `round full` (tạo thành một vòng tròn do border radius = chiều cao / 2). Điều này đi ngược với spec của MD3 Expressive Spec.

## 2. Kế Hoạch Đề Xuất (Task Breakdown)
Chúng ta sẽ chuẩn hoá thuộc tính shape (radius) cho toàn bộ component `FAB`.

### File cần chỉnh sửa:
`packages/react/src/ui/fab.tsx`

### Chi tiết thay đổi:
- **Cập nhật `MORPH_RADIUS`**: Thay thế các giá trị `default` radius (hình tròn) trong các kích cỡ bằng các giá trị bo góc hình vuông chuẩn xác từ tài liệu MD3:
  - `sm`: `default: 12`
  - `md`: `default: 16`
  - `lg`: `default: 28`
  - `xl`: `default: 40` (giá trị tương xứng cho xl theo tỉ lệ)
- **Kiểm tra và chuẩn hóa `pressed` / `extended`**: Hiện tại `extended` và `extended_pressed` đang dùng những mapping riêng. Các giá trị này cũng cần khớp với shape MD3 của Extended FAB (Thường Extended FAB cũng có radius 16dp). Cần điều chỉnh animation click (pressed) vừa phải để nút nhún mà không bị biến dạng bất thường.

## 3. Câu Hỏi Cần Rõ Trước Khi Tiến Hành (Socratic Gate)
Để cấu hình chính xác cho các interaction, hãy xác nhận giúp tôi 2 ý sau:

1. **Hiệu ứng Morphing Animation**: Khi nút được nhấn (`pressed`), bạn có muốn tiếp tục áp dụng hiệu ứng "nén góc bo" (như cũ là từ radius 28 -> 16) không? Vì khi default đã giảm xuống 16px, thì khi `pressed` có nên thu góc bo lại còn `10px/12px` để tạo độ nhấn mềm mại, hay cứ giữ cứng `16px`?
2. **Kích thước XL**: Material Design 3 thường chỉ định nghĩa Small, Standard và Large. Đối với size `xl` (136px) là custom size của dự án bạn, bạn muốn giữ radius default là `40px` chứ?

---
*Vui lòng phản hồi những câu hỏi trên trước khi chúng ta chạy lệnh `/create` (hoặc tôi tiếp tục sửa đổi code).*
