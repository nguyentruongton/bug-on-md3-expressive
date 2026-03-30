# Goal: Thêm FAB Menu vào trang Demo Documentations

Tạo trang docs và showcase component `FABMenu` (vừa được implement trong `@bug-on/md3-react`) theo tiêu chuẩn của project. Trang demo sẽ bao gồm phần lý thuyết về component và hiển thị nhiều biến thể (variants, sizes, alignments, disabled states).

## User Review Required
> [!IMPORTANT]
> Đây là bản kế hoạch. Vui lòng xem xét các use cases, nếu bạn muốn bổ sung màn hình hay ví dụ nào khác trước khi tiến hành viết code.

## Proposed Changes

---

### Cập nhật Sidebar Navigation
- Cập nhật file `apps/docs/lib/data.ts`
- Thêm thuộc tính `href: "/components/fab-menu"` vào category `FAB menu`.

#### [MODIFY] [data.ts](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/lib/data.ts)

---

### Tạo Registry Demos
Sẽ tạo các files examples chứng minh khả năng support các variants theo chuẩn MD3. Dưới đây là các file sẽ được tạo trong folder `apps/docs/registry/demos/`:

#### [NEW] [fab-menu-default.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/fab-menu-default.tsx)
- Giới thiệu cách dùng cơ bản, `expanded` state controls.
- Component chính: `<FABMenu>` và hiển thị 3 items hành động.

#### [NEW] [fab-menu-variants.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/fab-menu-variants.tsx)
- Hiển thị các màu sắc role khác nhau: `primary`, `secondary`, `tertiary`.

#### [NEW] [fab-menu-sizes.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/fab-menu-sizes.tsx)
- Hiển thị các size FAB được hỗ trợ: `baseline` (56dp), `medium` (80dp) và `large` (96dp).

#### [NEW] [fab-menu-alignment.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/fab-menu-alignment.tsx)
- Thay đổi property alignment: `start` và `end`.

#### [NEW] [fab-menu-icon-only.tsx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/registry/demos/fab-menu-icon-only.tsx)
- Cách hiển thị FAB Menu without text label (dạng tile grid vuông góc/icon only).

---

### Tạo trang Documentation (MDX)
Tạo nội dung base cho đường dẫn `/components/fab-menus`.

#### [NEW] [fab-menu.mdx](file:///Users/stark/Documents/GitHub/bug-on-md3-expressive/apps/docs/content/components/fab-menu.mdx)
- Thêm frontmatter title, description.
- Load ComponentPreview files.
- Document phần accessibility, API references giống cấu trúc các components khác.

## Verification Plan

### Manual Verification
- Truy cập vào trang local http://localhost:3000/components/fab-menus
- Chắc chắn ComponentPreviews hiển thị đúng code source, không có lỗi render.
- Test trực tiếp các demo component FAB menu trên trang Docs:
  - Nhấp để mở / đóng.
  - Sử dụng phím Escape, Tab để điều hướng.
  - Test responsive hiển thị components Preview block không bị tràn màn hình.

### Automated Tests
- Chạy `npm run lint` & `npm run tsc --noEmit` & Biome checks để đảm bảo code của registry format chuẩn.
