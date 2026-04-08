# PLAN-md3-theme-docs

## Goal
Viết tài liệu "Get Started" hoàn chỉnh cho trang docs bao gồm các trang **Installation** và **Theme** bằng định dạng MDX. Trang Theme sẽ có demo tương tác cho hệ thống màu động.

## Proposed Changes

### 1. MDX Content
- **`apps/docs/content/get-started/installation.mdx` [NEW]**:
    - Hướng dẫn cài đặt gói qua npm/pnpm/yarn.
    - Cấu hình Peer dependencies (React, Framer Motion, v.v.).
- **`apps/docs/content/get-started/theme.mdx` [NEW]**:
    - Giới thiệu về `MD3ThemeProvider`.
    - Hướng dẫn thiết lập tại root.
    - Tài liệu chi tiết về props và hooks.
    - Tích hợp demo component.

### 2. Demo Components
- **`apps/docs/components/mdx/theme-demo.tsx` [NEW]**:
    - Component React hỗ trợ chọn màu và đổi Light/Dark mode.

### 3. Routing & Logic
- **`apps/docs/app/get-started/[slug]/page.tsx` [NEW]**:
    - Tạo route động xử lý MDX trong thư mục `content/get-started`.
- **`apps/docs/app/get-started/page.tsx` [DELETE]**:
    - Xóa file placeholder cũ.

### 4. Navigation
- **`apps/docs/lib/data.ts` [MODIFY]**:
    - Thêm danh mục "Get Started" với các mục "Installation" và "Theme" vào dữ liệu sidebar.

## Verification Plan
- Truy cập `/get-started/installation` và `/get-started/theme`.
- Kiểm tra tính năng đồng bộ theme trên toàn trang docs.
