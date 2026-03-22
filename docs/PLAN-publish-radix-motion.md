# Plan: Publish Setup & Radix UI Integration

## 1. Overview
Triển khai hệ thống quản lý version và release tự động cho monorepo bằng `changesets` để đảm bảo quy trình publish `@bug-on/md3-react` lên npm trực quan nhất. Song song với đó, nâng cấp Core UI của thư viện bằng cách tích hợp **Radix UI Primitives** (A11y) và thư viện **motion** (Animation) cho các component phức tạp như Dialog, Dropdown, và Drawer theo đúng ngôn ngữ Material Design 3 Expressive.

## 2. Project Type
**WEB** (Monorepo React Library)

## 3. Success Criteria
- **Version Control:** Workflow `changesets` được thiếp lập chuẩn mực, có script gen CHANGELOG.md và config npm publish.
- **A11y UI:** Radix UI bọc ngoài các thành phần tương tác phức tạp, đảm bảo full keyboard navigation, screen reader support, focus trap.
- **Micro-Animations:** Sử dụng module `motion` kết hợp `<AnimatePresence>` tạo hiệu ứng mượt mà khi mount/unmount component (scale in, slide, spring).

## 4. Tech Stack & Dependencies
- `@changesets/cli`: Quản lý semantic versioning cho monorepo (tương tác trực tiếp với pnpm workspaces).
- `@radix-ui/react-dialog`, `@radix-ui/react-dropdown-menu`: Lõi xử lý logic (Headless UI).
- `motion`: Thực thi animation khi element render hoặc rời khỏi DOM.

## 5. File Structure Planned
```text
packages/react/src/ui/
 ├── dialog.tsx     (Radix + motion + MD3 Tailwind)
 ├── dropdown.tsx   (Radix + MD3 Tailwind)
 └── drawer.tsx     (Radix Dialog base + custom slider animation)
```

## 6. Task Breakdown

| Task ID | Task Name | Agent & Skill | Action (INPUT → OUTPUT → VERIFY) |
|---|---|---|---|
| **T1** | `setup-changesets` | `devops-engineer` (`deployment-procedures`) | **IN:** Root pnpm workspace.<br>**OUT:** `.changeset` config directory, `package.json` release scripts.<br>**VERIFY:** Chạy `pnpm changeset status` hiển thị đúng cấu hình. |
| **T2** | `radix-dialog-core` | `frontend-specialist` (`frontend-design`) | **IN:** `@radix-ui/react-dialog` package.<br>**OUT:** Modal Component với structure MD3 (Overlay, Content, Title).<br>**VERIFY:** Bấm phím `ESC` đóng được modal, có Focus Trap bên trong. |
| **T3** | `dialog-motion` | `frontend-specialist` (`frontend-design`) | **IN:** `motion` AnimatePresence.<br>**OUT:** Dialog tích hợp animation `scale`/`fade` MD3 khi đóng mở.<br>**VERIFY:** Unmount animation chờ element mờ hẳn mới xóa khỏi DOM. |
| **T4** | `md3-dropdown` | `frontend-specialist` (`frontend-design`) | **IN:** Radix Dropdown primitive.<br>**OUT:** Menu dropdown UI với Tailwind classes.<br>**VERIFY:** Di chuyển giữa các menu items bằng phím mũi tên ⬇️ ⬆️. |
| **T5** | `md3-drawer` | `frontend-specialist` (`frontend-design`) | **IN:** Cấu trúc tương tự Dialog.<br>**OUT:** Component Bottom Sheet/Drawer trượt từ dưới lên kèm hiệu ứng mờ nền.<br>**VERIFY:** Kích thước phản hồi theo nội dung, trượt mượt 60fps. |

## 7. Phase X: Verification (Checklist)
- [ ] Lệnh `pnpm build` thành công trên toàn bộ workspaces.
- [ ] Chạy `pnpm changeset add` sinh được file md trong folder `.changeset`.
- [ ] Accessibility Audit: Component Radix UI giữ lại đầy đủ thuộc tính `aria-expanded`, `aria-controls`.
- [ ] Bundle Size Check: Phân tích đảm bảo việc cài đặt *motion* không làm tăng bundle size của những file không import nó.
