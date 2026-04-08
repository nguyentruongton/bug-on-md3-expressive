# Demo Page cho Divider Component

## Overview
Viết trang document MDX và tạo các component preview (React TSX) cho component `Divider` (MD3 Expressive). Component hỗ trợ nhiều variations như forms (full-bleed, inset, v.v...), hướng (horizontal/vertical) và shape (flat/wavy).

## Project Type
WEB

## Success Criteria
- Hiển thị đầy đủ tất cả các states, variants, orientations và shape của component `Divider` thông qua `ComponentPreview` component.
- Layout gọn gàng, sử dụng code snippet trực quan cho user.
- Giao diện aesthetic đúng chuẩn MD3 Expressive.

## Tech Stack
- Next.js (App Router) với MDX
- React, Tailwind CSS
- MD3 Expressive Components (`@bug-on/md3-react`)
- Framer Motion

## File Structure
```text
├── apps/docs/content/components/
│   └── divider.mdx
└── apps/docs/registry/demos/
    ├── divider-variants.tsx
    ├── divider-orientations.tsx
    ├── divider-shapes.tsx
    └── divider-insets.tsx
```

## Task Breakdown
### Task 1: Xây dựng các Demo Previews cho Divider
- **Agent**: `frontend-specialist`
- **Skills**: `frontend-design`, `react-best-practices`
- **Action**: Tạo trực tiếp 4 file tsx trong thư mục `apps/docs/registry/demos/`. Các component sử dụng component layout (`div` linh hoạt hoặc Stack component nếu có) để bọc `<Divider />` cho dễ hình dung.
- **INPUT**: UI specification từ `packages/react/src/ui/divider.tsx`
- **OUTPUT**: Các file `divider-variants.tsx`, `divider-orientations.tsx`, `divider-shapes.tsx`, `divider-insets.tsx`.
- **VERIFY**: Các file components compile thành công nếu không có lỗi TypeScript.

### Task 2: Viết Divider MDX Document
- **Agent**: `frontend-specialist`
- **Skills**: `documentation-templates`
- **Action**: Viết tài liệu `divider.mdx` hướng dẫn người dùng cách dùng `Divider`. Nhúng `<ComponentPreview />` tham chiếu đến các demo ở bước trên và liệt kê API Reference Prop Table.
- **INPUT**: Các demos và metadata từ codebase.
- **OUTPUT**: Tệp tin `apps/docs/content/components/divider.mdx`.
- **VERIFY**: Kiểm tra route `/components/divider` xem tài liệu có hiển thị đúng với các interactive code blocks và preview tab không.

## Kiểm Tra Phase X
- [ ] No purple/violet hex codes
- [ ] No standard template layouts
- [ ] Socratic Gate was respected

```markdown
## ✅ PHASE X COMPLETE
- Lint: [ ] Pass
- Security: [ ] No critical issues
- Build: [ ] Success
- Date: [Current Date]
```
