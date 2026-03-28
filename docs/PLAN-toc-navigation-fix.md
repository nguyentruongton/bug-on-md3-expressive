# Lỗi Điều hướng Table of Contents

Lỗi được báo cáo: Khi click vào các mục trong Table of Contents (ToC), trang không cuộn đến section tương ứng.

## Nguyên nhân gốc rễ

Qua phân tích mã nguồn:
1.  Trang tài liệu (`IconButtonsPage`) được bao bọc bởi một thành phần `ScrollArea` (dựa trên Radix UI) trong `LayoutWrapper`.
2.  `ScrollArea` này tạo ra một khung cuộn nội bộ, khiến cho `window` không còn là đối tượng cuộn chính.
3.  Hàm `handleClick` trong `toc.tsx` hiện đang sử dụng `window.scrollTo`, lệnh này không có tác dụng đối với các khung cuộn nội bộ bên trong trang.

## Giải pháp đề xuất

Sử dụng `element.scrollIntoView({ behavior: 'smooth' })`. Giải pháp này là lựa chọn tối ưu vì:
-   **Tính tương thích cao (Universal):** Tự động phát hiện và cuộn khung chứa gần nhất của phần tử, cho dù đó là `window` hay bất kỳ một `ScrollArea` nội bộ nào (như `Radix UI Viewport`). Điều này rất quan trọng đối với một thư viện UI (UI Library) cần hoạt động đúng trong mọi ngữ cảnh sử dụng.
-   **Đơn giản & Đáng tin cậy:** Loại bỏ việc tính toán vị trí thủ công (vốn dễ lỗi khi có layout phức tạp hoặc sticky headers).
-   **Tôn trọng CSS:** Tự động áp dụng thuộc tính `scroll-margin-top` (đã có sẵn là `scroll-mt-24` trên các section).

## Thay đổi dự kiến

### [Component] [react-ui](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/toc.tsx)

#### [MODIFY] [toc.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/toc.tsx)

Cập nhật hàm `handleClick`:
-   Loại bỏ việc tính toán vị trí thủ công và `window.scrollTo`.
-   Sử dụng `element.scrollIntoView({ behavior: 'smooth' })`.
-   **Lưu ý:** Không cập nhật URL hash theo yêu cầu của người dùng để tránh các tác động ngoài ý muốn tới router.

## Kế hoạch xác minh

### Kiểm tra thủ công
1.  Mở trang Icon Buttons trong trình duyệt.
2.  Click vào từng mục trong ToC bên phải.
3.  Xác nhận trang cuộn mượt mà đến đúng section và dừng lại ở vị trí hợp lý.
