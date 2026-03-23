# Plan: Cập nhật Color Token cho ButtonGroup MD3 Expressive (v2)

Nâng cấp `ButtonGroup` và `Button` để hỗ trợ phân biệt màu sắc rõ ràng, không sử dụng outline cho trạng thái unselected, và tự động quản lý icon check.

## User Review Required

> [!IMPORTANT]
> **ShowCheck**: Thêm prop `showCheck` vào `ButtonGroup`. Khi bật, các nút đang `selected` sẽ tự động hiển thị icon check nếu chưa có icon khác.
> **Color Logic**: Trạng thái `unselected` trong Connected Group sẽ có nền màu (mặc định là `tonal`), không dùng `outlined`.

## Proposed Changes

### [Component] [Button](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/button.tsx)

#### [MODIFY] [button.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/button.tsx)

- **Thêm prop `selectedColorStyle`**: Cho phép định nghĩa `colorStyle` khi nút ở trạng thái `selected`.
- **Cập nhật `effectiveColorStyle`**: Linh hoạt hơn, ưu tiên `selectedColorStyle` nếu có.

---

### [Component] [ButtonGroup](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/button-group.tsx)

#### [MODIFY] [button-group.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/packages/react/src/ui/button-group.tsx)

- **Thêm prop `showCheck: boolean`**.
- **Cập nhật logic `cloneElement`**:
  - **Color**: Nếu `variant === "connected"`, mặc định `colorStyle="tonal"` cho unselected và `selectedColorStyle="filled"` cho selected (đảm bảo không có outline).
  - **Checkmark**: Nếu `showCheck={true}` và `isSelected`, tự động inject `<Check />` vào prop `icon` của `Button`.
  - **Đồng bộ Color**: Đảm bảo toàn bộ nhóm sử dụng chung một hệ màu từ `ButtonGroup`.

---

### [Demo] [page.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/app/components/button-groups/page.tsx)

#### [MODIFY] [page.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/app/components/button-groups/page.tsx)

- Cập nhật demo sử dụng `showCheck`.
- Trình diễn Connected Group với các cặp màu: Tonal vs Filled.

## Verification Plan

### Automated Tests
- Kiểm tra render icon `Check` khi `showCheck` được bật.
- Kiểm tra class CSS để đảm bảo không có `border-m3-outline` khi unselected.

### Manual Verification
- Kiểm tra visual trên trang demo.
- Xử lý a11y: Đảm bảo icon Check có `aria-hidden="true"` nếu label đã đủ rõ ràng.
