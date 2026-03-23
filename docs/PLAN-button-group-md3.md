# Plan: Nâng cấp ButtonGroup MD3 Expressive

Nâng cấp `ButtonGroup` để hỗ trợ các tiêu chuẩn Material Design 3 Expressive mới nhất, tập trung vào khả năng scale linh hoạt theo kích thước (size) và hiệu ứng chuyển đổi mềm mại (morphing) của các góc bo.

## Proposed Changes

### [Component] [ButtonGroup](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/button-group.tsx)

#### [MODIFY] [button-group.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/button-group.tsx)

1.  **Cập nhật `ButtonGroupProps`**:
    *   Thêm prop `size`: `"xs" | "sm" | "md" | "lg" | "xl"`. Theo yêu cầu, size này sẽ được áp dụng cho toàn bộ các nút trong nhóm.
    *   Thêm prop `morphingWidth` (boolean, mặc định: `true`): Cho phép bật/tắt hiệu ứng Khi một nút được nhấn (onPointerDown), nó sẽ mở rộng chiều rộng, đồng thời đẩy/thu hẹp các nút lân cận. Chúng ta quản lý trạng thái này thông qua pressedIndex.

2.  **Cập nhật `INNER_RADIUS_MAP`**:
    *   `xs: 4`, `sm: 8`, `md: 8`, `lg: 16`, `xl: 20` (Đơn vị: px).

3.  **Cập nhật CSS/Tailwind**:
    *   Thay đổi `gap` cho `variant="connected"` từ `gap-0` thành `gap-[2px]`.
    *   Sử dụng biến CSS (CSS Variables) để truyền `inner-radius` vào các class bo góc linh hoạt.

4.  **Logic Bo Góc & Morphing**:
    *   Nếu `variant="connected"`:
        *   Nút đầu/cuối: Các góc ngoài luôn là `rounded-full` (hoặc `rounded-t-full/b-full` tùy orientation). Các góc trong bo theo `INNER_RADIUS_MAP` của `size` tương ứng.
        *   Nút được chọn (`isSelected`): Chuyển toàn bộ các góc thành `rounded-full`.
        *   Nếu `morphing={true}`: Thêm class `transition-[border-radius] duration-300 ease-out`.

5.  **Cơ chế truyền `size` cho Buttons con**:
    *   Khi sử dụng `React.cloneElement`, `size` từ `ButtonGroup` sẽ được inject vào từng Button con để đảm bảo tính đồng bộ hoàn toàn như yêu cầu.

### [Demo] [button-groups/page.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/app/components/button-groups/page.tsx)

#### [MODIFY] [page.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/app/components/button-groups/page.tsx)

*   Cập nhật section "Connected Variant" để trình diễn khả năng scale theo size (ví dụ: tạo 2 nhóm với size khác nhau để so sánh độ bo góc).
*   Thêm một ví dụ về việc tắt `morphingWidth` để người dùng thấy sự khác biệt.

## Verification Plan

### Automated Tests
*   Viết unit test kiểm tra thuộc tính CSS `gap-0.5` trên thẻ `fieldset` khi dùng `variant="connected"`.
*   Kiểm tra border-radius của các nút bên trong dựa trên `size` truyền vào (ví dụ: size `lg` phải có góc trong 16px).
*   Kiểm tra xem class `transition-[border-radius]` có hiện diện khi `morphing={true}` hay không.

### Manual Verification
*   Mở trang demo, click chọn các nút "Day/Week/Month" và quan sát hiệu ứng morphing góc bo.
*   Thay đổi kích thước từ "sm" lên "lg" và kiểm tra xem góc bo có "nở" ra tương ứng hay không.
