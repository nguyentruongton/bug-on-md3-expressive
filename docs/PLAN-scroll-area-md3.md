# Plan: ScrollArea Component (MD3 Expressive)

Triển khai component `ScrollArea` dựa trên Radix UI Primitives với phong cách Material Design 3 (Expressive).

## Proposed Changes

### [Component] @bug-on/md3-react

Tạo component `ScrollArea` hỗ trợ cuộn nội dung mượt mờ với thanh cuộn tùy chỉnh theo tiêu chuẩn MD3.

#### [NEW] [scroll-area.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/scroll-area.tsx)

- **Library**: Sử dụng `@radix-ui/react-scroll-area`.
- **Cấu trúc**:
  - `ScrollArea`: Wrapper chính (`ScrollArea.Root`).
  - `ScrollAreaViewport`: Vùng chứa nội dung (`ScrollArea.Viewport`).
  - `ScrollAreaScrollbar`: Thanh cuộn (`ScrollArea.Scrollbar`).
  - `ScrollAreaThumb`: Con chạy (`ScrollArea.Thumb`).
- **Props**:
  - `type`: `hover` | `scroll` | `always` | `none` (Mặc định: `hover`). Cho phép ẩn/hiện thanh cuộn linh hoạt.
  - `orientation`: `vertical` | `horizontal`.
  - `scrollHideDelay`: Thời gian ẩn thanh cuộn (Mặc định: 600ms).
- **Styling (MD3 Expressive)**:
  - **Track**: Màu trong suốt hoặc `m3-surface-container-low` rất mờ. Độ dày khoảng 10px để đảm bảo vùng tương tác (touch target).
  - **Thumb**: Hình viên thuốc (pill-shaped) với `rounded-full`. Màu `m3-on-surface/30` hoặc `m3-on-surface-variant/40` để tạo sự tối giản nhưng vẫn rõ ràng trên nền `surface`.
  - **Interaction**: Thumb có thể đậm màu hơn khi hover (`m3-on-surface/50`).
  - **Corners**: `ScrollArea.Corner` sử dụng màu `m3-surface-container`.

### [Documentation] apps/docs

#### [NEW] [scroll-area-demo.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/app/demo/scroll-area/page.tsx)

- Trang demo hiển thị `ScrollArea` với các trường hợp:
  - Danh sách dài (dọc).
  - Nội dung rộng (ngang).
  - Các chế độ `type` khác nhau (hover, always).

## Verification Plan

### Automated Tests
- Kiểm tra render đúng cấu trúc Radix.
- Kiểm tra các props `type` và `orientation` hoạt động đúng thông qua data-attributes của Radix.

### Manual Verification
- **A11Y**: Kiểm tra điều hướng bàn phím (tab vào vùng cuộn, phím mũi tên/PageUp/PageDown).
- **Responsive**: Kiểm tra trên các kích thước màn hình khác nhau (mobile touch vs desktop hover).
- **Visual**: Đảm bảo thanh cuộn mang phong cách MD3 (pill-shaped, màu sắc hài hòa với `surface`).
- **Expressive**: Kiểm tra animation hiện/ẩn mượt mà của thanh cuộn.
