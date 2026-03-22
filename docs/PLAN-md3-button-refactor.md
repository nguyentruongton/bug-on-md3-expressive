# Overview

Kế hoạch refactor component Button hiện tại để tuân thủ chặt chẽ thiết kế Material Design 3 Expressive, nâng cấp khả năng truy cập (A11y) và tích hợp Framer Motion một cách tối ưu.

## Project Type

**WEB**

## Success Criteria

- Đảm bảo đủ 5 biến thể màu: Elevated, Filled, Tonal, Outlined, Text.
- Đảm bảo đủ 5 kích thước: XS đến XL với thông số padding, dimension chính xác (ví dụ: Size Small có padding 16dp, height 40dp, icon 20dp).
- **A11y**: Touch target tối thiểu 48x48dp cho tất cả các nút (đặc biệt XS và SM) được thực hiện bằng thuộc tính pseudo-element thay vì wrapper.
- **Expressive Morphing**: Hiệu ứng chuyển hình dạng chính xác từ pill (viên thuốc) sang bo góc nhỏ hơn khi nhấn, sử dụng khả năng nội suy mượt mà của Framer Motion.
- **Tối ưu Bundle**: Component được refactor sử dụng `<m.button>` kết hợp tiện ích `LazyMotion` giúp giảm đáng kể kích thước gói JS tải xuống.

## Tech Stack

- React 19
- Tailwind CSS 4.2
- Framer Motion
- TypeScript

## File Structure

Cấu trúc file thay đổi tập trung vào component hiện tại:
```plaintext
packages/react/src/ui/
└── button.tsx
```

## Task Breakdown

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| T1 | Tích hợp `<m.button>` & `LazyMotion` | `frontend-specialist` | `react-best-practices` | P1 | None | Nguồn component cũ → Component bọc `LazyMotion` và `m.button` → Không tăng bundle size quá lớn |
| T2 | Chuẩn hóa Specs Kích thước | `frontend-specialist` | `frontend-design` | P1 | T1 | Kích thước cũ (rem) → Hệ thống kích thước chính xác theo spec (px/rem) → Size SM cao 40px, padding 16px |
| T3 | Xây dựng Target Area 48dp (A11y) | `frontend-specialist` | `web-design-guidelines` | P1 | T2 | Nút < 48dp → CSS `::after` bọc vùng 48x48dp → Inspect bằng DevTools hiển thị vùng click 48dp |
| T4 | Áp dụng Expressive Morphing | `frontend-specialist` | `frontend-design` | P1 | T3 | Tailwind active utilities → Framer Motion `whileTap` thay đổi `borderRadius` → Nhấn thử thấy hiệu ứng mượt mà |
| T5 | Cập nhật Design Tokens (Tailwind 4.2) | `frontend-specialist` | `tailwind-patterns` | P2 | T4 | Utility classes phân tán → Tokens chuẩn hóa -> Component hiển thị đúng theme màu |

## ✅ PHASE X (Verification Checklist)

- [ ] Lint & Type Check: Code pass ESLint (Biome) & TypeScript Compiler.
- [ ] A11y & UX: Kiểm tra Touch target 48dp cho nền tảng di động và web (phù hợp WCAG).
- [ ] Build Check: Package build thành công.
- [ ] Run & Test: Button hoạt động ổn định trên giao diện chạy thật.
