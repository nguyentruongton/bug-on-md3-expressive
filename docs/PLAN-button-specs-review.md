# Button Specs Review & Final QA Plan

## Overview
Tiến hành kiểm tra và so sánh component `button.tsx` và `ripple.tsx` hiện tại với tài liệu đặc tả Material Design 3 Expressive. Hiện tại component đã triển khai xuất sắc các tiêu chí về kích thước (XS-XL), 5 variants màu sắc (elevated, filled, tonal, outlined, text), shape morphing (chuyển đổi mượt mà với Framer Motion), đảm bảo A11y (Touch target 48dp), và hiệu ứng Ripple (có tích hợp `useReducedMotion`). Kế hoạch này tập trung vào khâu QA cuối cùng: kiểm tra edge-cases (RTL, High Contrast mode, Keyboard focus) và E2E testing để đảm bảo component đạt độ hoàn thiện tối đa.

## Project Type
**WEB**

## Success Criteria
- Xác nhận component Button hoàn toàn đáp ứng M3 Expressive Spec đã đề ra ở các bản kế hoạch trước.
- Vượt qua kiểm tra Accessibility nâng cao (WCAG AA, High Contrast, Keyboard Navigation logic).
- Đảm bảo Playwright E2E tests bao phủ mọi state quan trọng (hover, focus-visible, active, disabled, toggle).
- Kiểm thử Layout Shift và tính tương thích với chế độ hiển thị RTL (Right-to-Left).

## Tech Stack
- React 19, Tailwind CSS 4.2
- Framer Motion
- TypeScript
- Playwright (E2E Testing)

## File Structure
```plaintext
packages/react/src/ui/
├── button.tsx
└── ripple.tsx
```

## Task Breakdown

| Task ID | Name | Agent | Skills | Priority | Dependencies | INPUT → OUTPUT → VERIFY |
|---------|------|-------|--------|----------|--------------|-------------------------|
| T1 | Kiểm tra RTL & High Contrast | `frontend-specialist` | `web-design-guidelines` | P1 | None | Component Button hiện tại → Thêm thuộc tính `dir="rtl"` và giả lập high contrast → Đảm bảo giao diện không vỡ, khoảng cách chuẩn, icon leading/trailing đảo ngược đúng vị trí |
| T2 | Audit Accessibility toàn diện | `frontend-specialist` | `web-design-guidelines` | P1 | None | Nút hiện tại → Phím Tab logic, focus ring M3 Primary, ARIA testing → Vòng focus-visible xuất hiện chuẩn xác, Screen reader đọc đúng nội dung và aria-pressed bằng True/False |
| T3 | Viết Playwright E2E Tests | `test-engineer` | `webapp-testing` | P1 | T1, T2 | Code hiện tại → Test scripts kiểm tra tương tác click, focus, trạng thái disabled, và render của Ripple → Pass 100% kèm screenshot report |

## ✅ PHASE X (Verification Checklist)
- [ ] Lint & Type Check: Đảm bảo không lỗi tĩnh.
- [ ] Kiểm tra Socratic Gate: Các yêu cầu edge-case đã được xác minh.
- [ ] UX/A11y Audit: Chạy kịch bản `ux_audit.py` và `accessibility_checker.py`.
- [ ] E2E Tests: Chạy kiểm thử Playwright.
- [ ] Build & Run: Component build thành công trong package library và app docs.
