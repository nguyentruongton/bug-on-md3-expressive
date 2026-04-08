# [PLAN] Cập nhật Documentation và Demos cho Tooltips

Kế hoạch này chi tiết các bước để cập nhật trang tài liệu Tooltips (`tooltips.mdx`) và các thành phần demo liên quan trong ứng dụng `docs`. Mục tiêu là phản ánh chính xác các thay đổi về API, cấu hình MD3 Expressive và các cải tiến về tính tiếp cận (accessibility) đã thực hiện.

## Các thay đổi đề xuất

### Tài liệu (MDX)

#### [MODIFY] [tooltips.mdx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/content/components/tooltips.mdx)
- Cập nhật mô tả thành phần để phù hợp với thông số MD3 Expressive.
- Cập nhật bảng **API Reference** cho `TooltipBox`, `PlainTooltip` và `RichTooltip` với các prop mới/đã đổi tên.
- Bổ sung mục **Accessibility**:
  - Hỗ trợ bàn phím (`Enter`, `Space`, `Escape`).
  - Các thuộc tính ARIA (`aria-describedby`, `role="tooltip"`).
  - Tương tác chạm (`long-press`).
- Thêm phần **Interaction Triggers** để giải thích các loại trigger (Hover, Focus, Click, Long-press).

---

### Demos (Registry)

#### [MODIFY] [tooltip-basic.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/tooltip-basic.tsx)
- Sử dụng các pattern prop mới nhất.
- Thêm ví dụ cho các vị trí (placements) và caret khác nhau.

#### [MODIFY] [tooltip-rich.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/tooltip-rich.tsx)
- Cập nhật code theo API `RichTooltip` mới nhất.
- Hiển thị cả biến thể Hover và Click cho nội dung đa dạng.

#### [NEW] [tooltip-interaction.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/tooltip-interaction.tsx)
- Demo riêng biệt cho các kiểu trigger:
  - `["hover", "focus"]` (Mặc định)
  - `["click"]` (Interactive/Sticky)
  - `["long-press"]` (Mobile pattern)

#### [NEW] [tooltip-accessibility.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/tooltip-accessibility.tsx)
- Demo tập trung vào khả năng điều hướng bằng bàn phím và hỗ trợ trình đọc màn hình.

## Kế hoạch xác minh

### Kiểm tra thủ công
- Truy cập `http://localhost:3000/components/tooltips`.
- Kiểm tra từng demo:
  - Trigger bằng hover.
  - Trigger bằng phím `Tab` (focus).
  - Phím `Escape` để đóng.
  - Vị trí của Caret.
  - Phản hồi khi nhấn giữ (long-press) trên giả lập mobile.
