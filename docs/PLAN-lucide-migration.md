# PLAN-lucide-migration: Chuyển đổi `lucide-react` sang `<Icon>`

## Chú Thích (Goal Description)
Bản kế hoạch này mô tả chi tiết quá trình loại bỏ hoàn toàn thư viện `lucide-react` và thay thế bằng component `<Icon>` (sử dụng Material Symbols variable font) trong toàn bộ codebase, bao gồm các trang demo và một số ít component lõi.

## Yêu Cầu Xem Xét Từ User (User Review Required)
> [!IMPORTANT]
> Việc chuyển đổi sẽ loại bỏ `lucide-react` khỏi toàn bộ `dependencies`. Bạn có đồng ý với việc sử dụng các tên gọi (ligatures) tương đương trong Material Symbols thay thế cho Lucide không? (ví dụ: `X` -> `close`, `Check` -> `check`, `Trash2` -> `delete`).
> Component `<Icon>` đã được định nghĩa sẵn trong `packages/react/src/ui/icon.tsx`. 

## Thuộc Tính Dự Án (Project Type)
WEB (Next.js & React UI Library)

## Tiêu Chí Thành Công (Success Criteria)
- 100% `lucide-react` được thay thế bằng `<Icon name="..." />`
- Đã gỡ bỏ thư viện `lucide-react` khỏi các tệp `package.json`
- Giao diện (UI) hiển thị chính xác theo Material Design 3 (MD3)
- Không có lỗi type và linter (Accessibility cũng được đảm bảo theo thuộc tính `aria-hidden` đã khai báo trong Icon component).

## Chi Tiết Các Tác Vụ (Task Breakdown)

### Tác Vụ 1 (Task 1): Chuyển đổi Components Lõi (`packages/react/src/ui`)
- **Đại diện Agent**: `frontend-specialist`
- **Mô tả**: Thay thế các import từ `lucide-react` sang `<Icon>` tại:
  - `code-block.tsx` (`Check`, `Copy`)
  - `drawer.tsx` (`X` -> `close`)
  - `dialog.tsx` (`X` -> `close`)
  - `button-group.tsx` (`Check` -> `check`)
  - `dropdown.tsx` (`Check`, `ChevronRight`, `Circle`)
  - Xóa dòng `"lucide-react"` trong `package.json` của `packages/react`.

### Tác Vụ 2 (Task 2): Cập nhật Cấu hình & Layout Docs (`apps/docs`)
- **Đại diện Agent**: `frontend-specialist`
- **Mô tả**: Sửa đổi cấu trúc nơi render và tham chiếu icon tại:
  - `lib/data.ts` (Sửa kiểu dữ liệu, các config data mapping)
  - `components/layout/layout-wrapper.tsx`
  - `components/ComponentCard.tsx` 
  - `content/components/buttons.mdx` (Sửa metadata và mdx component)
  - Xóa dòng `"lucide-react"` trong `package.json` của `apps/docs`.

### Tác Vụ 3 (Task 3): Migrate Demo Pages (`apps/docs/registry/demos/*`)
- **Đại diện Agent**: `frontend-specialist`
- **Mô tả**: Phản chiếu việc thay thế Icon vào khoảng 25+ tệp Demo components.
  - Các file bị ảnh hưởng như: `fab-*.tsx`, `icon-button-*.tsx`, `button-*.tsx`, `chip-*.tsx`, v.v.
  - Định dạng chuyển đổi: thay vì render JSX `<Settings className="..." />`, sử dụng `<Icon name="settings" className="..." />`.

## Kế hoạch Kiểm thử (Verification Plan)

### Kiểm thử Tự động (Automated Tests)
```bash
# Kiểm tra file đã bị xóa hết mọi string import
grep -r "lucide-react" .
# Khởi chạy Type checker và Linter đảm bảo code vững chắc
npm run lint && npx tsc --noEmit
# Chạy script verify cho accessibility (a11y) và UI/UX
python .agent/scripts/verify_all.py .
```

### Kiểm chứng Thủ công (Manual Verification)
- Khởi chạy dev server (`npm run dev`) để duyệt xem giao diện Web. Xác nhận các icon render bình thường, không bị biến dạng do optical sizes biến đổi sai. 

## Những Câu Hỏi Còn Bỏ Ngỏ (Open Questions)
- Trong `apps/docs/lib/data.ts`, dữ liệu icon có nên chuyển type logic thành `string` để các module consume tự bọc `<Icon name={item.icon} />` thay vì trực tiếp lưu Component JSX không? Mời bạn cho ý kiến, nếu đồng ý tôi sẽ triển khai theo hướng đó.
