# PLAN-switch-docs.md - Thêm Switch vào tài liệu

> **Trạng thái:** Chờ phê duyệt
> **Nhiệm vụ:** Tích hợp Switch component vào documentation app (Next.js)

---

## 📋 Giai đoạn 1: Tạo Demos (Registry)

Tạo các file mã nguồn demo trong `apps/docs/registry/demos/`. Đây là các file mà component `ComponentPreview` sẽ đọc để hiển thị cả "Preview" và "Code".

- [ ] `switch-basic.tsx`: Demo cơ bản.
- [ ] `switch-labeled.tsx`: Demo có nhãn.
- [ ] `switch-icons.tsx`: Demo có icons trong thumb.
- [ ] `switch-states.tsx`: Demo các trạng thái Disabled.

## 📝 Giai đoạn 2: Trang tài liệu MDX

Tạo file `apps/docs/content/components/switch.mdx`. Trang này sẽ sử dụng component `<ComponentPreview />` để gọi các demo đã tạo ở Giai đoạn 1.

- [ ] Thông tin giới thiệu (MD3 Switch overview).
- [ ] Các phần hiển thị demo tương ứng.
- [ ] Bảng API Reference liệt kê tất cả Props từ `SwitchProps`.
- [ ] Ghi chú về Accessibility (ARIA role=switch).

## 🧭 Giai đoạn 3: Cấu hình Navigation

Cập nhật metadata để trang Switch xuất hiện trên UI của docs app.

- [ ] `apps/docs/lib/data.ts`: Thêm `href: "/components/switch"` vào item "Switch".

## ✅ Kế hoạch Xác minh

1. **Kiểm tra UI**: Truy cập trang `/components/switch` trên trình duyệt.
2. **Tương tác**: Click thử Switch, hover, mousedown (để xem size morph 28px).
3. **Responsive**: Kiểm tra Dark mode/Light mode xem Switch có đổi màu đúng không.
4. **Code link**: Click tab "Code" trên mỗi demo để đảm bảo source code hiển thị chính xác.
