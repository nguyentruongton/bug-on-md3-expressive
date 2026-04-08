# PLAN: Snackbar Component Demos

**Task slug:** `snackbar-demo`
**Agent:** `@frontend-specialist`
**Phase:** Planning Only

---

## 📋 Overview

Thêm tài liệu và demo page cho `Snackbar` component trên MD3 Expressive docs, bao gồm các use cases thực tế để trình diễn UI/UX và logic Queue.

## 📁 Files to Create/Modify

### 1. [MODIFY] `apps/docs/app/layout.tsx`
- Bổ sung `SnackbarProvider` từ `@bug-on/md3-react` để wrap toàn bộ ứng dụng (chứa ứng dụng và `<LayoutWrapper>`).
- Bước này bắt buộc bởi `useSnackbar` hook chỉ đọc được logic khi nằm trong Context Provider.

### 2. [NEW] `apps/docs/registry/demos/snackbar-basic.tsx`
- Component demo với nút trigger hiển thị Snackbar cơ bản với message đơn giản. (Ví dụ: "Message sent").

### 3. [NEW] `apps/docs/registry/demos/snackbar-action.tsx`
- Demo hiển thị Snackbar có chứa action button (`actionLabel="Undo"`).
- Trình diễn cách await Promise được trả về bởi `showSnackbar` để biết người dùng đã click action.

### 4. [NEW] `apps/docs/registry/demos/snackbar-dismiss.tsx`
- Demo hiển thị Snackbar với `withDismissAction={true}`. Trình diễn việc cho phép người dùng tự bỏ qua snackbar (icon "X").

### 5. [NEW] `apps/docs/registry/demos/snackbar-newline.tsx`
- Demo Snackbar với message dài và cờ `actionOnNewLine={true}`, cho phép giao diện thay đổi sang dạng Column layout.

### 6. [NEW] `apps/docs/registry/demos/snackbar-queue.tsx`
- Demo queueing nhiều Snackbar: Sử dụng vòng lặp hoặc multi clicks để đẩy vào hàng đợi, chứng minh chúng hiện tuần tự chứ không chồng chéo.

### 7. [NEW] `apps/docs/content/components/snackbar.mdx`
- Nội dung docs cho Snackbar.
- Bao gồm hướng dẫn Installation & Setup (`SnackbarProvider`).
- Import các component demos bên trên bằng `<ComponentPreview name="snackbar-..." />`.
- Đầy đủ API Reference.

---

## ✅ Verification Plan
1. **Khởi động server docs**: `pnpm dev` ở package root hoặc docs.
2. **Preview UI**: Vào `/components/snackbar` và thao tác với mọi demo, trong đó có test spam click để verify Queue feature.
3. Chạy `pnpm biome check apps/docs/registry/demos/snackbar-*.tsx` để đảm bảo code sạch.

---

## ⚠️ Edge Cases & Notes
- Nhớ phải có `"use client";` ở trên cùng tất cả các components render button + gọi hook `useSnackbar`, vì event onClick yêu cầu CSR.
- `SnackbarProvider` từ thư viện đã là Client Component, nên có thể an toàn dùng trực tiếp trong Server layout `app/layout.tsx`.
